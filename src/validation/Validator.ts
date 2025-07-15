import { IReflectProperty } from "../reflection/ReflectProperty"
import { PrimitiveType } from "./ValidateInterfaces"

export abstract class Validator {
    public static checkDefined(value: any, _descriptor?: IReflectProperty): string | undefined {
        if (typeof value === "undefined" || value === null || Number.isNaN(value)) {
            return "Value is not defined"
        }
        return
    }

    public static checkBoolean(value: boolean, _descriptor?: IReflectProperty): string | undefined {
        if (typeof value !== "boolean") {
            return "Value is not a boolean"
        }
        return
    }

    public static checkString(value: string, descriptor: IReflectProperty): string | undefined {
        if (typeof value !== "string") {
            return "Value is not a string"
        }

        if (typeof descriptor.minLength !== "undefined" && value.length < descriptor.minLength) {
            return `Value is shorter than ${descriptor.minLength} characters`
        }

        if (typeof descriptor.maxLength !== "undefined" && value.length > descriptor.maxLength) {
            return `Value is longer than ${descriptor.maxLength} characters`
        }

        if (typeof descriptor.regExp !== "undefined" && !descriptor.regExp.test(value)) {
            return `Value does not match regular expression ${descriptor.regExp}`
        }

        if (typeof descriptor.allowedChars !== "undefined") {
            const regExp = new RegExp(`^[${descriptor.allowedChars}]+$`)
            if (!regExp.test(value)) {
                return `Value contains other characters than the allowed ones '${descriptor.allowedChars}'`
            }
        }

        if (typeof descriptor.disallowedChars !== "undefined") {
            const regExp = new RegExp(`[${descriptor.disallowedChars}]+`)
            if (regExp.test(value)) {
                return `Value contains disallowed characters like '${descriptor.disallowedChars}'`
            }
        }

        if (typeof descriptor.allowedValues !== "undefined" && !descriptor.allowedValues.includes(value)) {
            return "Value is not within the list of allowed values."
        }

        if (descriptor.disallowedValues?.includes(value)) {
            return "Value is within the list of disallowed values."
        }

        return
    }

    public static checkNumber(value: number, descriptor: IReflectProperty): string | undefined {
        if (typeof value !== "number") {
            return "Value is not a number."
        }

        if (isNaN(value)) {
            return "Value could not be parsed to Number"
        }

        if (typeof descriptor.minValue !== "undefined" && value < descriptor.minValue) {
            return `Value is below threshold of ${descriptor.minValue}`
        }

        if (typeof descriptor.maxValue !== "undefined" && value > descriptor.maxValue) {
            return `Value is above threshold of ${descriptor.maxValue}`
        }

        if (typeof descriptor.allowedValues !== "undefined" && !descriptor.allowedValues.includes(value)) {
            return "Value is not within the list of allowed values."
        }

        if (descriptor.disallowedValues?.includes(value)) {
            return "Value is within the list of disallowed values."
        }

        return
    }

    public static checkArray(value: any, descriptor: IReflectProperty): string | undefined {
        if (typeof value !== "object" || !(value instanceof Array)) {
            return "Value is not an Array."
        }

        if (typeof descriptor.minLength !== "undefined" && value.length < descriptor.minLength) {
            return `Array has less items than minimum ${descriptor.minLength} allowed.`
        }

        if (typeof descriptor.maxLength !== "undefined" && value.length > descriptor.maxLength) {
            return `Array has more items than maximum ${descriptor.maxLength} allowed.`
        }

        let i = 0
        for (const item of value) {
            if (typeof descriptor.allowedValues !== "undefined" && !descriptor.allowedValues.includes(item)) {
                return `Value of item ${i} is not within the list of allowed values.`
            }

            if (descriptor.disallowedValues?.includes(item)) {
                return `Value of item ${i} is within the list of disallowed values.`
            }
            i++
        }

        return
    }

    public static checkObject(value: any, descriptor: IReflectProperty): string | undefined {
        if (descriptor.any) {
            return ""
        }
        if (typeof value !== "object") {
            return `Value is not an Object and no instance of ${descriptor.typeInfo.name}.`
        }
        if (descriptor.primitiveType === "object") {
            if (
                !(value instanceof descriptor.typeInfo) &&
                !(descriptor.typeInfo.name === "Serializable" || descriptor.typeInfo.name === "SerializableAsync")
            ) {
                return `Value not an instance of ${descriptor.typeInfo.name}.`
            }
        }

        if (descriptor.requiredInheritance) {
            let notFound = true
            for (const classes of descriptor.requiredInheritance) {
                let i = 0
                for (const instance of classes) {
                    if (value instanceof instance) {
                        i++
                    }
                }
                if (i === classes.length - 1) {
                    notFound = false
                    break
                }
            }
            if (notFound) {
                return `Value does not fit into any given inheritance chains for value ${descriptor.typeInfo.name}`
            }
        }
        return
    }

    public static checkTypes(value: any, descriptor: IReflectProperty): string | undefined {
        const allowedTypes = descriptor.allowedTypes
        if (!allowedTypes) {
            return
        }
        for (const type of allowedTypes) {
            if (type.toLowerCase() === "array" && Array.isArray(value)) {
                return
            } else if (typeof value === type.toLowerCase()) {
                return
            }
        }
        return "Value is not an allowed type."
    }

    public static checkProperty(value: any, descriptor: IReflectProperty): string | undefined {
        // *****CAUTION: Check Parser.parseProperty if you make changes here!*****
        if (!descriptor.validate) {
            return
        }

        let err: string | undefined

        if (!descriptor.optional) {
            err = this.checkDefined(value, descriptor)
            if (err) return err
        } else if (typeof value === "undefined" || value === null || Number.isNaN(value)) {
            return
        }

        err = this.checkTypes(value, descriptor)
        if (err) return err

        if (typeof descriptor.customValidator === "function") {
            err = descriptor.customValidator(value, descriptor)
            if (err) return err
        }

        if (!descriptor.type) descriptor.type = "object"

        switch (descriptor.primitiveType) {
            case "array":
                return this.checkArray(value, descriptor)

            case "boolean":
                return this.checkBoolean(value, descriptor)

            case "number":
                return this.checkNumber(value, descriptor)

            case "string":
                return this.checkString(value, descriptor)
            case undefined:
            default:
                // Ignore all other values
                break
        }

        // Check possible union types
        if (descriptor.allowedTypes) {
            if (typeof value === "boolean" && descriptor.allowedTypes.includes(PrimitiveType.Boolean)) {
                return this.checkBoolean(value, descriptor)
            } else if (typeof value === "number" && descriptor.allowedTypes.includes(PrimitiveType.Number)) {
                return this.checkNumber(value, descriptor)
            } else if (
                typeof value === "string" &&
                !descriptor.deserializeStrings &&
                descriptor.allowedTypes.includes(PrimitiveType.String)
            ) {
                return this.checkString(value, descriptor)
            } else if (Array.isArray(value) && descriptor.allowedTypes.includes(PrimitiveType.Array)) {
                return this.checkArray(value, descriptor)
            }
        }

        return this.checkObject(value, descriptor)
    }
}
