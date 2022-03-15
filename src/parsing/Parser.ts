import { ServalError } from "../errors"
import { IReflectProperty } from "../reflection/ReflectProperty"
import { PrimitiveType } from "../validation/ValidateInterfaces"
import { Validator } from "../validation/Validator"
import { ParsingError } from "./ParsingError"

export abstract class Parser {
    public static parseProperty(value: any, descriptor: IReflectProperty, className: string, caller: any): any {
        // *****CAUTION: Check Validator.checkProperty if you make changes here!*****
        let err: string | undefined
        if (!descriptor.optional) {
            err = Validator.checkDefined(value, descriptor)
            if (err) {
                throw new ParsingError(className, descriptor.key, err)
            }
        }

        if (descriptor.optional && typeof value === "undefined") {
            return undefined
        }

        err = Validator.checkTypes(value, descriptor)
        if (err) {
            throw new ParsingError(className, descriptor.key, err)
        }

        if (descriptor.any) return value

        if (!descriptor.type) descriptor.type = "object"

        switch (descriptor.primitiveType) {
            case "array":
                return Parser.parseArray(value, descriptor, className, caller)

            case "boolean":
                return Parser.parseBoolean(value, descriptor, className)

            case "number":
                return Parser.parseNumber(value, descriptor, className)

            case "string":
                return Parser.parseString(value, descriptor, className)
            default:
                // Ignore everything else
                break
        }

        // Parse possible union types
        if (descriptor.allowedTypes) {
            if (typeof value === "boolean" && descriptor.allowedTypes.includes(PrimitiveType.Boolean)) {
                return Parser.parseBoolean(value, descriptor, className)
            } else if (typeof value === "number" && descriptor.allowedTypes.includes(PrimitiveType.Number)) {
                return Parser.parseNumber(value, descriptor, className)
            } else if (
                typeof value === "string" &&
                !descriptor.deserializeStrings &&
                descriptor.allowedTypes.includes(PrimitiveType.String)
            ) {
                return Parser.parseString(value, descriptor, className)
            } else if (Array.isArray(value) && descriptor.allowedTypes.includes(PrimitiveType.Array)) {
                return Parser.parseArray(value, descriptor, className, caller)
            }
        }

        return Parser.parseObject(value, descriptor, className, caller)
    }

    public static async parsePropertyAsync(
        value: any,
        descriptor: IReflectProperty,
        className = "Unknown",
        caller: any
    ): Promise<any> {
        if (!descriptor.optional) {
            const err = Validator.checkDefined(value, descriptor)
            if (err) {
                throw new ParsingError(className, descriptor.key, err)
            }
        }

        if (descriptor.optional && typeof value === "undefined") {
            return undefined
        }

        if (descriptor.any) return value

        if (!descriptor.type) descriptor.type = "object"

        switch (descriptor.primitiveType) {
            case "array":
                return await Parser.parseArrayAsync(value, descriptor, className, caller)

            case "boolean":
                return await Promise.resolve(Parser.parseBoolean(value, descriptor, className))

            case "number":
                return await Promise.resolve(Parser.parseNumber(value, descriptor, className))

            case "string":
                return await Promise.resolve(Parser.parseString(value, descriptor, className))
            default:
                // Ignore everything else
                break
        }

        // Parse possible union types
        if (descriptor.allowedTypes) {
            if (typeof value === "boolean" && descriptor.allowedTypes.includes(PrimitiveType.Boolean)) {
                return await Promise.resolve(Parser.parseBoolean(value, descriptor, className))
            } else if (typeof value === "number" && descriptor.allowedTypes.includes(PrimitiveType.Number)) {
                return await Promise.resolve(Parser.parseNumber(value, descriptor, className))
            } else if (
                typeof value === "string" &&
                !descriptor.deserializeStrings &&
                descriptor.allowedTypes.includes(PrimitiveType.String)
            ) {
                return await Promise.resolve(Parser.parseString(value, descriptor, className))
            } else if (Array.isArray(value) && descriptor.allowedTypes.includes(PrimitiveType.Array)) {
                return await Parser.parseArrayAsync(value, descriptor, className, caller)
            }
        }

        return await Parser.parseObjectAsync(value, descriptor, className, caller)
    }

    public static parseStringObject(value: any, descriptor: IReflectProperty, className: string, caller: any): any {
        const classInfo: any = descriptor.typeInfo
        const thisObj: any = classInfo
        let fct: Function | undefined
        const args: any[] = [value]

        if ((descriptor.parseUnknown || descriptor.type === "Serializable") && value && value["@type"]) {
            return caller.deserializeUnknown(value)
        }

        if (descriptor.customDeserializer) {
            fct = descriptor.customDeserializer
            args.push(descriptor)
            args.push(classInfo)
        }

        if (!fct) {
            fct = classInfo.deserialize
            args.push(classInfo)
        }

        if (!fct && descriptor.any) {
            return value
        }

        if (!fct) {
            try {
                return JSON.parse(value)
            } catch (e) {
                throw new ParsingError(
                    descriptor.type,
                    descriptor.key,
                    "Deserialization failed as the given string is not a JSON representation.",
                    e
                )
            }
        }

        return fct.apply(thisObj, args)
    }

    public static async parseStringObjectAsync(
        value: any,
        descriptor: IReflectProperty,
        _className: string,
        caller: any
    ): Promise<any> {
        const classInfo: any = descriptor.typeInfo
        const thisObj: any = classInfo
        let fct: Function | undefined
        const args: any[] = [value]

        if (
            (descriptor.parseUnknown ||
                descriptor.type === "Serializable" ||
                descriptor.type === "SerializableAsync") &&
            value &&
            value["@type"]
        ) {
            // eslint-disable-next-line @typescript-eslint/return-await
            return await caller.deserializeUnknown(value)
        }

        if (descriptor.customDeserializer) {
            fct = descriptor.customDeserializer
            args.push(descriptor)
            args.push(classInfo)
        }

        if (!fct) {
            fct = classInfo.deserialize
            args.push(classInfo)
        }

        if (!fct && descriptor.any) {
            return await Promise.resolve(value)
        }

        if (!fct) {
            try {
                const obj = JSON.parse(value)
                return obj
            } catch (e) {
                throw new ParsingError(
                    descriptor.type,
                    descriptor.key,
                    "Deserialization failed as the given string is not a JSON representation.",
                    e
                )
            }
        }

        const ret = fct.apply(thisObj, args)
        return ret
    }

    public static parseString(value: any, descriptor: IReflectProperty, className: string): string {
        const err = Validator.checkString(value, descriptor)
        if (err) {
            throw new ParsingError(className, descriptor.key, err)
        }
        return value
    }

    public static parseNumber(value: any, descriptor: IReflectProperty, className: string): number {
        const err = Validator.checkNumber(value, descriptor)
        if (err) {
            throw new ParsingError(className, descriptor.key, err)
        }
        return value
    }

    public static parseBoolean(value: any, descriptor: IReflectProperty, className: string): boolean {
        const err = Validator.checkBoolean(value, descriptor)
        if (err) {
            throw new ParsingError(className, descriptor.key, err)
        }
        return value
    }

    public static parseArray(value: any[], descriptor: IReflectProperty, className: string, caller: any): any[] {
        const err = Validator.checkArray(value, descriptor)
        if (err) {
            throw new ServalError(err)
        }

        const itemDescriptor: any = descriptor.itemDescriptor
        const ar: any[] = []

        for (let i = 0; i < value.length; i++) {
            const currentElement = value[i]
            try {
                if (itemDescriptor.type === "SerializableAsync") {
                    itemDescriptor.type = "Serializable"
                    itemDescriptor.typeInfo = caller
                }
                if (itemDescriptor.typeInfo === Boolean) {
                    ar.push(this.parseBoolean(currentElement, itemDescriptor, className))
                } else if (itemDescriptor.typeInfo === Number) {
                    ar.push(this.parseNumber(currentElement, itemDescriptor, className))
                } else if (itemDescriptor.typeInfo === String) {
                    ar.push(this.parseString(currentElement, itemDescriptor, className))
                } else {
                    ar.push(this.parseObject(currentElement, itemDescriptor, itemDescriptor.typeInfo, caller))
                }
            } catch (e) {
                const type = descriptor.parseUnknown ? "fromUnknown" : `to a ${itemDescriptor.typeInfo.name}`
                throw new ParsingError(
                    className,
                    descriptor.key,
                    `Item with index ${i} could not be deserialized ${type} (${e.message})`,
                    e
                )
            }
        }

        return ar
    }

    public static async parseArrayAsync(
        value: any[],
        descriptor: IReflectProperty,
        className: string,
        caller: any
    ): Promise<any[]> {
        const err = Validator.checkArray(value, descriptor)
        if (err) {
            throw new ServalError(err)
        }

        const itemDescriptor: any = descriptor.itemDescriptor
        const ar: any[] = []

        for (let i = 0; i < value.length; i++) {
            const currentElement = value[i]
            try {
                if (itemDescriptor.typeInfo === Boolean) {
                    ar.push(this.parseBoolean(currentElement, itemDescriptor, className))
                } else if (itemDescriptor.typeInfo === Number) {
                    ar.push(this.parseNumber(currentElement, itemDescriptor, className))
                } else if (itemDescriptor.typeInfo === String) {
                    ar.push(this.parseString(currentElement, itemDescriptor, className))
                } else {
                    ar.push(await this.parseObjectAsync(currentElement, itemDescriptor, className, caller))
                }
            } catch (e) {
                const type = descriptor.parseUnknown ? "fromUnknown" : `to a ${itemDescriptor.typeInfo.name}`
                throw new ParsingError(
                    className,
                    descriptor.key,
                    `Item with index ${i} could not be deserialized ${type} (${e.message})`,
                    e
                )
            }
        }

        return ar
    }

    public static parseObject(value: any, descriptor: IReflectProperty, className: string, caller: any): any {
        if (value === null || typeof value === "undefined") {
            return null
        }
        const classInfo: any = descriptor.typeInfo
        let thisObj: any = classInfo

        if (descriptor.unionTypes?.some((t) => value instanceof t)) {
            return value
        } else if (!descriptor.unionTypes && value instanceof classInfo) {
            return value
        } else if ((typeof value === "string" && descriptor.deserializeStrings) || descriptor.enforceString) {
            return Parser.parseStringObject(value, descriptor, className, caller)
        } else if (descriptor.any) {
            return value
        }
        let fct: any
        const args: any[] = [value]

        if ((descriptor.parseUnknown || descriptor.type === "Serializable") && value && value["@type"]) {
            return caller.fromUnknown(value)
        }

        if (
            (typeof descriptor.allowSubclasses === "undefined" || descriptor.allowSubclasses) &&
            value &&
            value["@type"]
        ) {
            return caller.fromUnknown(value)
        }

        if (descriptor.customParser) {
            fct = descriptor.customParser
            args.push(descriptor)
            args.push(classInfo)
        }
        if (!fct) {
            fct = classInfo.fromJSON
            args.push(classInfo)
        }
        if (!fct) {
            fct = classInfo.from
            args.push(classInfo)
        }

        if (!fct) {
            fct = caller.from
            thisObj = caller
            args.push(caller)
        }

        return fct.apply(thisObj, args)
    }

    public static async parseObjectAsync(
        value: any,
        descriptor: IReflectProperty,
        className: string,
        caller: any
    ): Promise<any> {
        if (value === null || typeof value === "undefined") {
            return await Promise.resolve(null)
        }
        const classInfo: any = descriptor.typeInfo
        let thisObj: any = classInfo

        if (descriptor.unionTypes?.some((t) => value instanceof t)) {
            return await Promise.resolve(value)
        } else if (!descriptor.unionTypes && value instanceof classInfo) {
            return await Promise.resolve(value)
        } else if ((typeof value === "string" && descriptor.deserializeStrings) || descriptor.enforceString) {
            return await Parser.parseStringObjectAsync(value, descriptor, className, caller)
        } else if (descriptor.any) {
            return await Promise.resolve(value)
        }
        let fct: any
        const args: any[] = [value]

        if (
            (descriptor.parseUnknown ||
                descriptor.type === "Serializable" ||
                descriptor.type === "SerializableAsync") &&
            value &&
            value["@type"]
        ) {
            // eslint-disable-next-line @typescript-eslint/return-await
            return await caller.fromUnknown(value)
        }

        if (
            (typeof descriptor.allowSubclasses === "undefined" || descriptor.allowSubclasses) &&
            value &&
            value["@type"]
        ) {
            // eslint-disable-next-line @typescript-eslint/return-await
            return await caller.fromUnknown(value)
        }

        if (descriptor.customParser) {
            fct = descriptor.customParser
            args.push(descriptor)
            args.push(classInfo)
        }
        if (!fct) {
            fct = classInfo.fromJSON
            args.push(classInfo)
        }
        if (!fct) {
            fct = classInfo.from
            args.push(classInfo)
        }

        if (!fct) {
            fct = caller.from
            thisObj = caller
            args.push(caller)
        }

        const ret = await fct.apply(thisObj, args)
        return ret
    }
}
