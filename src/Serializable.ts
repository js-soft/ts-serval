import { ServalError } from "./errors"
import { Constructor, ISerializable } from "./interfaces"
import { Parser } from "./parsing/Parser"
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
            return Serializable.from(value)
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
        return result.from(value, result)
    }

    public static deserializeUnknown(value: string): Serializable {
        let obj
        try {
            obj = JSON.parse(value)
        } catch (e) {
            throw new ServalError(`DeserializationError ${e}`)
        }
        return this.fromUnknown(obj)
    }

    /**
     * Deserializes the given string to the current class.
     *
     * @param value The JSON string which should be parsed
     * @returns An object of the given type T
     */
    public static deserializeT<T>(value: string, type: new () => T): T {
        let obj
        try {
            obj = JSON.parse(value)
        } catch (e) {
            throw new ParsingError(
                type.name,
                "deserialize()",
                "The given String value is not in JSON format and could not be deserialized.",
                e
            )
        }
        return this.fromT<T>(obj, type)
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
    public static fromT<T>(value: any, type: new () => T): T {
        if (typeof value === "undefined" || value === null || typeof value !== "object") {
            throw new ParsingError(type.name, "from()", `Parameter must be an object - is '${value}'`)
        }

        const realObj: T = new (<Constructor<T>>type)()
        const propertyMap = SerializableBase.getDescriptor(type.name)
        if (propertyMap) {
            propertyMap.forEach((info: IReflectProperty, key: string) => {
                if (
                    key === "@type" ||
                    key === "@context" ||
                    key === "@version" ||
                    key === "serializeProperty" ||
                    key === "serializeAs"
                ) {
                    return
                }

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
        return realObj
    }

    public static deserialize(value: string, type?: new () => Serializable): Serializable {
        if (type) {
            return this.deserializeT(value, type)
        }
        return this.deserializeUnknown(value)
    }

    public static from(value: ISerializable, type?: new () => Serializable): Serializable {
        if (!type || type === Serializable) {
            if (!value["@type"]) {
                value["@type"] = "JSONWrapper"
            }
            if (!value["@version"]) {
                value["@version"] = 1
            }
            return this.fromUnknown(value)
        }
        return this.fromT(value, type)
    }
}
