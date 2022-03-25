import { ServalError } from "./errors"
import { Constructor, ISerializable } from "./interfaces"
import { Parser } from "./parsing/Parser"
import { ParsingError } from "./parsing/ParsingError"
import { IReflectProperty } from "./reflection/ReflectProperty"
import { Serializable } from "./Serializable"
import { SerializableBase } from "./SerializableBase"
import { Validator } from "./validation/Validator"

export class SerializableAsync extends SerializableBase implements ISerializable {
    public static async fromUnknown(value: any): Promise<SerializableAsync> {
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
        return await this.from(value)
    }

    public static async deserializeUnknown(value: string): Promise<SerializableAsync> {
        let obj
        try {
            obj = JSON.parse(value)
        } catch (e) {
            throw new ServalError(`ParsingError ${e}`)
        }
        return await this.fromUnknown(obj)
    }

    public static async deserialize(value: string): Promise<SerializableAsync> {
        const type = (this as any).prototype.constructor

        if (type.name !== "object") {
            return await this.deserializeT(value)
        }
        return await this.deserializeUnknown(value)
    }

    /**
     * Deserializes the given string to the current class.
     *
     * @param value The JSON string which should be parsed
     * @returns An object of the given type T
     */
    protected static async deserializeT<T>(value: string): Promise<T> {
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
        return await this.fromT<T>(obj)
    }

    public static async from(value: any): Promise<SerializableAsync> {
        const type = (this as any).prototype.constructor

        if (!type || type === SerializableAsync || type === Serializable) {
            if (!value["@type"]) {
                value["@type"] = "JSONWrapperAsync"
            }
            return await this.fromUnknown(value)
        }
        return await this.fromT(value)
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
    protected static async fromT<T>(value: any): Promise<T> {
        const type = (this as any).prototype.constructor

        if (typeof value === "undefined" || value === null || typeof value !== "object") {
            throw new ParsingError(type.name, "from()", `Parameter must be an object - is '${value}'`)
        }

        const realObj: T = new (<Constructor<T>>type)()
        const propertyMap = SerializableBase.getDescriptor(type.name)
        if (propertyMap) {
            for (const [key, info] of propertyMap.entries()) {
                if (key === "@type" || key === "@context" || key === "serializeProperty" || key === "serializeAs") {
                    continue
                }

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
        }
        return realObj
    }

    public validateProperty(key: string, descriptor?: IReflectProperty): string | undefined {
        if (!descriptor) {
            const propertyMap = this.getDescriptor()
            if (!propertyMap) {
                return `No descriptor available for key ${key} (propertyMap is missing)`
            }
            descriptor = propertyMap.get(key)
        }
        if (!descriptor) {
            return `No descriptor available for key ${key}`
        }

        return Validator.checkProperty(this[key], descriptor)
    }

    public static checkProperty(value: any, key: string, className: string): string | undefined {
        const propertyMap = Serializable.getDescriptor(className)
        if (!propertyMap) {
            return `No descriptor available for key ${key} (propertyMap is missing)`
        }
        const descriptor = propertyMap.get(key)
        if (!descriptor) {
            return `No descriptor available for key ${key}`
        }
        return Validator.checkProperty(value, descriptor)
    }
}
