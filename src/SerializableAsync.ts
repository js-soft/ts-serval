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
            return await this.fromT(value)
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

        return await (result.fromAny(value, result) as Promise<SerializableAsync>)
    }

    public static async deserializeUnknown(value: string): Promise<SerializableAsync> {
        try {
            const object = JSON.parse(value)
            return await this.fromUnknown(object)
        } catch (e) {
            throw new ServalError(`ParsingError ${e}`)
        }
    }

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

    protected static preDeserialize(value: any): Promise<any> | any {
        return value
    }

    protected static postDeserialize<T extends SerializableAsync>(value: T): Promise<T> | T {
        return value
    }

    public static async fromAny<T extends SerializableAsync>(this: Constructor<T>, value: any): Promise<T> {
        const type = (this as any).prototype.constructor

        // recreating the this context of this function using `that`
        const that = this as unknown as typeof SerializableAsync

        // TODO: should we really run an explicit JSONWrapper serialization here?
        if (!type || type === SerializableAsync || type === Serializable) {
            const newValue: any = {}

            if (!value["@type"]) {
                newValue["@type"] = "JSONWrapperAsync"
            }
            if (!value["@version"]) {
                newValue["@version"] = 1
            }

            return (await that.fromUnknown({ ...newValue, ...value })) as T
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

        value = this.preFrom(value)

        if (typeof value === "undefined" || value === null || typeof value !== "object") {
            throw new ParsingError(type.name, "from()", `Parameter must be an object - is '${value}'`)
        }

        const realObj: T = new type()
        const propertyMap = SerializableBase.getDescriptor(type.name)
        if (propertyMap) {
            for (const [key, info] of propertyMap.entries()) {
                if (
                    key === "@type" ||
                    key === "@context" ||
                    key === "@version" ||
                    key === "serializeProperty" ||
                    key === "serializeAs"
                ) {
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

        return await this.postFrom(realObj)
    }

    protected static preFrom(value: any): Promise<any> | any {
        return value
    }

    protected static postFrom<T extends SerializableAsync>(value: T): Promise<T> | T {
        return value
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
