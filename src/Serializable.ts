import _ from "lodash"
import { ServalError } from "./errors"
import { Constructor, ISerializable } from "./interfaces"
import { METADATA_FIELDS, Parser } from "./parsing/Parser"
import { ParsingError } from "./parsing/ParsingError"
import { SerializableBase } from "./SerializableBase"

export class Serializable extends SerializableBase implements ISerializable {
    /**
     * Parses the given object to the class defined in `@type`.
     *
     * @param value The JSON object to parse. The object must have the `@type` property set in order to be parsed, in addition to possible `@context` and `@version` properties.
     * @returns the parsed object of the class defined in `@type`
     */
    public static fromUnknown(value: any): Serializable {
        if (!value.hasOwnProperty("@type")) {
            return Serializable.fromAny(value)
        }

        const type = value["@type"]

        if (typeof type !== "string") {
            throw new ServalError("@type is not a string.")
        }

        let version = 1
        if (value["@version"]) {
            try {
                version = parseInt(value["@version"])
            } catch (_) {
                throw new ServalError("Version is not a number.")
            }
        }

        const result = SerializableBase.getModule(type, version)
        if (!result) {
            throw new ServalError(
                `Type '${type}' with version ${version} was not found within reflection classes. You might have to install a module first.`
            )
        }

        if (typeof result.fromJSON === "function") {
            return result.fromJSON(value)
        }

        return result.fromAny(value)
    }

    /**
     * Parses the given string to the class defined in `@type`.
     *
     * @param value the string to deserialize
     * @returns the deserialized and parsed object of the class defined in `@type`
     */
    public static deserializeUnknown(value: string): Serializable {
        let object: any
        try {
            object = JSON.parse(value)
        } catch (e) {
            throw new ServalError(`DeserializationError ${e}`)
        }

        return this.fromUnknown(object)
    }

    /**
     * Deserializes the given string to the current class. This method can not be overwritten.
     * The alternative method for changing the deserialization logic is to overwrite the `{@link preDeserialize}` and `{@link postDeserialize}` methods.
     *
     * @param this tells typescript that the context of this method is the current class
     * @param value the object which should be parsed
     * @returns the deserialized and parsed object of the class T
     */
    public static deserialize<T extends Serializable>(this: Constructor<T>, value: string): T {
        const type = (this as any).prototype.constructor

        // recreating the this context of this function using `that`
        const that = this as unknown as typeof Serializable

        let object
        try {
            object = JSON.parse(value)
        } catch (e) {
            throw new ParsingError(
                type.name,
                "deserialize()",
                "The given String value is not in JSON format and could not be deserialized.",
                e
            )
        }

        object = that.preDeserialize(object)

        const deserialized = that.fromT<T>(object)

        return that.postDeserialize(deserialized)
    }

    /**
     * `preDeserialize` can be overwritten to manipulate the value before the deserialization from string.
     * This allows to add logic to the deserialization without having to override the deserialize method.
     *
     * This function will run before the {@link preFrom} method.
     *
     * @param value the object that will be manipulated before the actual parsing.
     * @returns the manipulated object
     */
    protected static preDeserialize(value: any): any {
        return value
    }

    /**
     * `postDeserialize` can be overwritten to manipulate the value after the deserialization from string.
     * This allows to add logic to the deserialization without having to override the deserialize method.
     *
     * This function will run after the {@link postFrom} method.
     *
     * @param value the object that will be manipulated after the actual parsing.
     * @returns the manipulated object
     */
    protected static postDeserialize<T extends Serializable>(value: T): T {
        return value
    }

    /**
     * The main entrypoint of the parsing. This method may be overwritten but the this context also has to be in the method signature.
     * The recommended method for changing the parsing logic is to overwrite the `{@link preFrom}` and `{@link postFrom}` methods.
     *
     * This is an example on how to overwrite it:
     * ```ts
     * public static fromAny<T extends ClassThatExtendsSerializable>(this: Constructor<T>, value: IClassThatExtendsSerializable): T {
     *   return (this as any).fromT(value)
     * }
     * ```
     *
     * @param this tells typescript that the context of this method is the current class instance, which may be a subclass of Serializable
     * @param value the object which should be parsed
     * @returns the parsed object of the class T
     */
    public static fromAny<T extends Serializable>(this: Constructor<T>, value: any): T {
        const type = (this as any).prototype.constructor

        const that = this as unknown as typeof Serializable

        if (!type || type === Serializable) {
            return that.fromUnknown({ ...value, "@type": "JSONWrapper", "@version": 1 }) as T
        }

        return that.fromT(value)
    }

    /**
     * Parsed the given object to the current class.
     *
     * @param value The object which should be parsed
     * @returns An object of the given type T
     *
     * @throws ParsingError when the deserialization failed (structure is not correct)
     * @throws ValidationError when the validation of field failed (structure is correct but content is not)
     */
    private static fromT<T extends Serializable>(value: any): T {
        const type = (this as any).prototype.constructor as Constructor<T>

        // run preFrom only if it was overwritten and the value is not already a SerializableBase
        if (this.preFrom !== Serializable.preFrom && !(value instanceof SerializableBase)) {
            value = this.preFrom(_.cloneDeep(value))
        }

        const propertyMap = this.getPropertyMap()
        const nonReservedKeys = Array.from(propertyMap.keys()).filter((k) => !METADATA_FIELDS.includes(k))

        if (typeof value === "undefined" || value === null) {
            throw new ParsingError(type.name, "from()", `Parameter must be an object - is '${value}'`)
        }

        if (nonReservedKeys.length === 0) return new type(value)

        if (typeof value !== "object") {
            throw new ParsingError(type.name, "from()", `Parameter must be an object - is '${value}'`)
        }

        const realObj: T = new type()

        for (const [key, info] of propertyMap.entries()) {
            if (METADATA_FIELDS.includes(key)) continue

            let jsonKey = key
            if (typeof value[jsonKey] === "undefined" && info.alias) {
                jsonKey = info.alias
            }

            const propertyValue = Parser.parseProperty(
                value[jsonKey],
                info,
                (realObj as Object).constructor.name,
                Serializable
            )
            if (typeof propertyValue !== "undefined") {
                realObj[info.key] = propertyValue
            }
        }

        return this.postFrom(realObj)
    }

    /**
     * `preFrom` can be overwritten to manipulate the value before the parsing.
     * This allows to add logic to the parsing without having to override the fromAny method.
     *
     * @param value the object that will be manipulated before the actual parsing.
     * @returns the manipulated object
     */
    protected static preFrom(value: any): Promise<any> | any {
        return value
    }

    /**
     * `postFrom` can be overwritten to manipulate the value after the parsing.
     * This allows to add logic to the parsing without having to override the fromAny method.
     *
     * @param value the object that will be manipulated after the actual parsing.
     * @returns the manipulated object
     */
    protected static postFrom<T extends Serializable>(value: T): T {
        return value
    }
}
