import { ValidatorFunction } from ".."
import { Validate } from "./Validate"
import { PrimitiveType, ValidateParameter } from "./ValidateInterfaces"

export function nullable(): ValidatorFunction {
    return Validate.nullable()
}

export function validate(params?: ValidateParameter): ValidatorFunction {
    return Validate.validate(params)
}

export function minLength(minLength: number): ValidatorFunction {
    return Validate.minLength(minLength)
}

export function maxLength(maxLength: number): ValidatorFunction {
    return Validate.maxLength(maxLength)
}

export function allowedChars(allowedChars: string): ValidatorFunction {
    return Validate.allowedChars(allowedChars)
}

export function disallowedChars(disallowedChars: string): ValidatorFunction {
    return Validate.disallowedChars(disallowedChars)
}

export function allowedValues(allowedValues: any[]): ValidatorFunction {
    return Validate.allowedValues(allowedValues)
}

export function disallowedValues(disallowedValues: any[]): ValidatorFunction {
    return Validate.disallowedValues(disallowedValues)
}

export function regExp(regExp: RegExp): ValidatorFunction {
    return Validate.regExp(regExp)
}

export function allowedTypes(types: PrimitiveType[] | PrimitiveType): ValidatorFunction {
    return Validate.allowedTypes(types)
}

export function minValue(minValue: number): ValidatorFunction {
    return Validate.minValue(minValue)
}

export function maxValue(maxValue: number): ValidatorFunction {
    return Validate.maxValue(maxValue)
}

export function between(minValue: number, maxValue: number): ValidatorFunction {
    return Validate.between(minValue, maxValue)
}
