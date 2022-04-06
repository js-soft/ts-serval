import { ServalError } from "./errors"
import { Constructor, ISerializable } from "./interfaces"
import { METADATA_FIELDS, Parser } from "./parsing/Parser"
import { ParsingError } from "./parsing/ParsingError"
import { IReflectProperty } from "./reflection/ReflectProperty"
import { SerializableBase } from "./SerializableBase"

export class Serializable extends SerializableBase implements ISerializable {
    public static fromUnknown(value: any): Serializable {
        const obj: any = value
        let type
        if (obj["@type"]) {
            if (typeof obj["@type"] !== "string") {
                throw new ServalError("Type is not a string.")
            }
            type = `${obj["@type"]}`
        }

        let version = 1
        if (obj["@version"]) {
            try {
                version = parseInt(obj["@version"])
            } catch (e) {
                throw new ServalError("Version is not a number.")
            }
        }

        if (!type) {
            return Serializable.fromAny(value)
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

    public static deserializeUnknown(value: string): Serializable {
        try {
            const object = JSON.parse(value)
            return this.fromUnknown(object)
        } catch (e) {
            throw new ServalError(`DeserializationError ${e}`)
        }
    }

    /**
     * Deserializes the given string to the current class.
     *
     * @param value The JSON string which should be parsed
     * @returns An object of the given type T
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

    protected static preDeserialize(value: any): any {
        return value
    }

    protected static postDeserialize<T extends Serializable>(value: T): T {
        return value
    }

    public static fromAny<T extends Serializable>(this: Constructor<T>, value: any): T {
        const type = (this as any).prototype.constructor

        // recreating the this context of this function using `that`
        const that = this as unknown as typeof Serializable

        if (!type || type === Serializable) {
            const newValue: any = {}

            if (!value["@type"]) {
                newValue["@type"] = "JSONWrapper"
            }
            if (!value["@version"]) {
                newValue["@version"] = 1
            }

            return that.fromUnknown({ ...newValue, ...value }) as T
        }

        return that.fromT(value)
    }

    /**
     * Parsed the given object to the current class.
     *
     * @param value The object which should be parsed
     * @returns An object of the given type T
     *
     * @throws DeserializationError when the deserialization failed (structure is not correct)
     * @throws ValidationError when the validation of field failed (structure is correct but content is not)
     */
    private static fromT<T extends Serializable>(value: any): T {
        const type = (this as any).prototype.constructor as Constructor<T>

        value = this.preFrom(value)

        const propertyMap = SerializableBase.getDescriptor(type.name)
        const nonReservedKeys = propertyMap
            ? Array.from(propertyMap.keys()).filter((k) => !METADATA_FIELDS.includes(k))
            : undefined

        if (typeof value === "undefined" || value === null || typeof value !== "object") {
            if (nonReservedKeys?.length !== 0) {
                throw new ParsingError(type.name, "from()", `Parameter must be an object - is '${value}'`)
            }

            return new type(value)
        }

        const realObj: T = new type()

        if (propertyMap) {
            propertyMap.forEach((info: IReflectProperty, key: string) => {
                if (METADATA_FIELDS.includes(key)) return

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
            })
        }

        return this.postFrom(realObj)
    }

    protected static preFrom(value: any): Promise<any> | any {
        return value
    }

    protected static postFrom<T extends Serializable>(value: T): T {
        return value
    }
}
