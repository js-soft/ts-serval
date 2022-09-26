import { ServalError } from "./errors"
import { Constructor, ISerializable } from "./interfaces"
import { METADATA_FIELDS, Parser } from "./parsing/Parser"
import { ParsingError } from "./parsing/ParsingError"
import { Serializable } from "./Serializable"
import { SerializableBase } from "./SerializableBase"

export class SerializableAsync extends SerializableBase implements ISerializable {
    /**
     * Parses the given object to the class defined in `@type`.
     *
     * @param value The JSON object to parse. The object must have the `@type` property set in order to be parsed, in addition to possible `@context` and `@version` properties.
     * @returns the parsed object of the class defined in `@type`
     * @returns a promise that resolves in the parsed object of the class defined in `@type`
     */
    public static async fromUnknown(value: any): Promise<SerializableAsync> {
        if (!value.hasOwnProperty("@type")) {
            return await SerializableAsync.fromAny(value)
        }

        const type = value["@type"]

        if (typeof type !== "string") {
            throw new ServalError("@type is not a string.")
        }

        let version = 1
        if (value["@version"]) {
            try {
                version = parseInt(value["@version"])
            } catch (e) {
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

        return await (result.fromAny(value) as Promise<SerializableAsync>)
    }

    /**
     * Parses the given string to the class defined in `@type`.
     *
     * @param value the string to deserialize
     * @returns a promise that resolves in the deserialized and parsed object of the class defined in `@type`
     */
    public static async deserializeUnknown(value: string): Promise<SerializableAsync> {
        let object: any
        try {
            object = JSON.parse(value)
        } catch (e) {
            throw new ServalError(`DeserializationError ${e}`)
        }

        return await this.fromUnknown(object)
    }

    /**
     * Deserializes the given string to the current class. This method can not be overwritten.
     * The alternative method for changing the deserialization logic is to overwrite the `{@link preDeserialize}` and `{@link postDeserialize}` methods.
     *
     * @param this tells typescript that the context of this method is the current class
     * @param value the object which should be parsed
     * @returns a promise that resolves in the deserialized and parsed object of the class T
     */
    public static async deserialize<T extends SerializableAsync>(this: Constructor<T>, value: string): Promise<T> {
        const type = (this as any).prototype.constructor

        // recreating the this context of this function using `that`
        const that = this as unknown as typeof SerializableAsync

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

        object = await that.preDeserialize(object)

        const deserialized = await that.fromT<T>(object)

        return await that.postDeserialize(deserialized)
    }

    /**
     * `preDeserialize` can be overwritten to manipulate the value before the deserialization from string.
     * This allows to add logic to the deserialization without having to override the deserialize method.
     *
     * This function will run before the {@link preFrom} method.
     *
     * @param value the object that will be manipulated before the actual parsing.
     * @returns tht manipulated object or a promise that resolves in the manipulated object
     */
    protected static preDeserialize(value: any): Promise<any> | any {
        return value
    }

    /**
     * `postDeserialize` can be overwritten to manipulate the value after the deserialization from string.
     * This allows to add logic to the deserialization without having to override the deserialize method.
     *
     * This function will run after the {@link postFrom} method.
     *
     * @param value the object that will be manipulated after the actual parsing.
     * @returns  tht manipulated object or a promise that resolves in the manipulated object
     */
    protected static postDeserialize<T extends SerializableAsync>(value: T): Promise<T> | T {
        return value
    }

    /**
     * The main entrypoint of the parsing. This method may be overwritten but the this context also has to be in the method signature.
     * The recommended method for changing the parsing logic is to overwrite the `{@link preFrom}` and `{@link postFrom}` methods.
     *
     * This is an example on how to overwrite it:
     * ```ts
     * public static async fromAny<T extends ClassThatExtendsSerializableAsync>(this: Constructor<T>, value: IClassThatExtendsSerializableAsync): Promise<T> {
     *   return await ((this as any).fromT(value) as Promise<T>)
     * }
     * ```
     *
     * @param this tells typescript that the context of this method is the current class instance, which may be a subclass of SerializableAsync
     * @param value the object which should be parsed
     * @returns a Promise that resolves in the parsed object of the class T
     */
    public static async fromAny<T extends SerializableAsync>(this: Constructor<T>, value: any): Promise<T> {
        const type = (this as any).prototype.constructor

        const that = this as unknown as typeof SerializableAsync

        if (!type || type === SerializableAsync || type === Serializable) {
            return (await that.fromUnknown({ ...value, "@type": "JSONWrapperAsync", "@version": 1 })) as T
        }

        return await that.fromT(value)
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
    private static async fromT<T extends SerializableAsync>(value: any): Promise<T> {
        const type = (this as any).prototype.constructor as Constructor<T>

        value = await this.preFrom(value)

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

            const propertyValue = await Parser.parsePropertyAsync(
                value[jsonKey],
                info,
                (realObj as Object).constructor.name,
                SerializableAsync
            )
            if (typeof propertyValue !== "undefined") {
                realObj[info.key] = propertyValue
            }
        }

        return await this.postFrom(realObj)
    }

    /**
     * `preFrom` can be overwritten to manipulate the value before the parsing.
     * This allows to add logic to the parsing without having to override the fromAny method.
     *
     * @param value the object that will be manipulated before the actual parsing.
     * @returns tht manipulated object or a promise that resolves in the manipulated object
     */
    protected static preFrom(value: any): Promise<any> | any {
        return value
    }

    /**
     * `postFrom` can be overwritten to manipulate the value after the parsing.
     * This allows to add logic to the parsing without having to override the fromAny method.
     *
     * @param value the object that will be manipulated after the actual parsing.
     * @returns tht manipulated object or a promise that resolves in the manipulated object
     */
    protected static postFrom<T extends SerializableAsync>(value: T): Promise<T> | T {
        return value
    }
}
