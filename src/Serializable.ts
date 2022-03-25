import { ServalError } from "./errors"
import { Constructor, ISerializable } from "./interfaces"
import { Parser } from "./parsing/Parser"
import { ParsingError } from "./parsing/ParsingError"
import { IReflectProperty } from "./reflection/ReflectProperty"
import { SerializableBase } from "./SerializableBase"

export class Serializable extends SerializableBase implements ISerializable {
    public static fromUnknown(value: any): Serializable {
        const obj: any = value
        if (obj["@type"]) {
            const result = SerializableBase.getModule(obj["@type"])
            if (!result) {
                throw new ServalError(
                    `Type '${obj["@type"]}' was not found within reflection classes. You might have to install a module first.`
                )
            }
            if (typeof result.fromJSON === "function") {
                return result.fromJSON(value)
            }
            return result.from(value, result)
        }
        return Serializable.from(value)
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
    public static deserializeT<T extends Serializable>(value: string): T {
        const type = (this as any).prototype.constructor

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
        return this.fromT<T>(obj)
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
    protected static fromT<T>(value: any): T {
        const type = (this as any).prototype.constructor

        if (typeof value === "undefined" || value === null || typeof value !== "object") {
            throw new ParsingError(type.name, "from()", `Parameter must be an object - is '${value}'`)
        }

        const realObj: T = new (<Constructor<T>>type)()
        const propertyMap = SerializableBase.getDescriptor(type.name)
        if (propertyMap) {
            propertyMap.forEach((info: IReflectProperty, key: string) => {
                if (key === "@type" || key === "@context" || key === "serializeProperty" || key === "serializeAs") {
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

    public static deserialize(value: string): Serializable {
        const type = (this as any).prototype.constructor

        if (type) {
            return this.deserializeT(value)
        }
        return this.deserializeUnknown(value)
    }

    public static from(value: ISerializable): Serializable {
        const type = (this as any).prototype.constructor

        if (!type || type === Serializable) {
            if (!value["@type"]) {
                value["@type"] = "JSONWrapper"
            }
            return this.fromUnknown(value)
        }

        return this.fromT(value)
    }
}
