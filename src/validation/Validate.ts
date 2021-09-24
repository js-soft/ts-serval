import "reflect-metadata"
import { DecoratorError } from "../errors"
import { getReflectProperty, propertyBucketName } from "../reflection/globals"
import { Validator } from "../validation/Validator"
import { PrimitiveType, ValidateParameter } from "./ValidateInterfaces"
import { ValidationError } from "./ValidationError"

export type ValidatorFunction = (target: any, propertyKey: string) => void

export class Validate {
    public static validate(params?: ValidateParameter): ValidatorFunction {
        return function (target: any, propertyKey: string): void {
            const prop = getReflectProperty(target, propertyKey)
            prop.validate = true

            const propertyGetter = function (): any {
                if (prop.value && typeof this[`_${propertyKey}`] === "undefined") {
                    return prop.value
                }
                return this[`_${propertyKey}`]
            }

            const propertySetter = function (newVal: any): void {
                let err = Validator.checkProperty(newVal, prop)
                if (err) {
                    throw new ValidationError(this.constructor.name, `${prop.key}:${prop.type}`, err)
                }
                if (params?.customValidator) {
                    err = params.customValidator.apply(this, [newVal, prop])
                    if (err) {
                        throw new ValidationError(this.constructor.name, `${prop.key}:${prop.type}`, err)
                    }
                }

                this[`_${propertyKey}`] = newVal
            }

            if (delete target[propertyKey]) {
                Reflect.defineMetadata(propertyBucketName, [prop], target)

                // Create new property with getter and setter
                Object.defineProperty(target, propertyKey, {
                    get: propertyGetter,
                    set: propertySetter,
                    enumerable: true,
                    configurable: true
                })
            }

            if (!params) {
                return
            }
            prop.optional = params.nullable ? true : false
            prop.customValidator = params.customValidator
            switch (prop.type) {
                case "Object":
                    prop.allowedValues = params.allowedValues
                    prop.disallowedValues = params.disallowedValues
                    prop.minLength = params.min
                    prop.maxLength = params.max
                    prop.allowedTypes = params.allowedTypes
                    break

                case "String":
                    prop.minLength = params.min
                    prop.maxLength = params.max
                    prop.allowedChars = params.allowedChars
                    prop.disallowedChars = params.disallowedChars
                    prop.regExp = params.regExp
                    prop.allowedValues = params.allowedValues
                    prop.disallowedValues = params.disallowedValues
                    break

                case "Number":
                    prop.minValue = params.min
                    prop.maxValue = params.max
                    prop.allowedValues = params.allowedValues
                    prop.disallowedValues = params.disallowedValues
                    break
            }
        }
    }

    public static nullable(): ValidatorFunction {
        return function (target: any, propertyKey: string): void {
            const prop = getReflectProperty(target, propertyKey)
            prop.validate = true
            prop.optional = true
        }
    }

    public static minLength(minLength: number): ValidatorFunction {
        return function (target: any, propertyKey: string): void {
            const prop = getReflectProperty(target, propertyKey)
            if (prop.type !== "String") {
                throw new DecoratorError(
                    "minLength",
                    `Decorator minLength only works on String types: Property ${propertyKey} of class ${target.constructor.name} is not of type String.`
                )
            }
            if (minLength < 0) {
                throw new DecoratorError(
                    "minLength",
                    `Decorator minLength cannot be negative: Property ${propertyKey} of class ${target.constructor.name}.`
                )
            }
            prop.validate = true
            prop.minLength = minLength
        }
    }

    public static maxLength(maxLength: number): ValidatorFunction {
        return function (target: any, propertyKey: string): void {
            const prop = getReflectProperty(target, propertyKey)
            if (prop.type !== "String") {
                throw new DecoratorError(
                    "maxLength",
                    `Decorator maxLength only works on String types: Property ${propertyKey} of class ${target.constructor.name} is not of type String.`
                )
            }
            prop.validate = true
            prop.maxLength = maxLength
        }
    }

    public static allowedChars(allowedChars: string): ValidatorFunction {
        return function (target: any, propertyKey: string): void {
            const prop = getReflectProperty(target, propertyKey)
            if (prop.type !== "String") {
                throw new DecoratorError(
                    "allowedChars",
                    `Decorator allowedChars only works on String types: Property ${propertyKey} of class ${target.constructor.name} is not of type String.`
                )
            }
            prop.validate = true
            prop.allowedChars = allowedChars
        }
    }

    public static disallowedChars(disallowedChars: string): ValidatorFunction {
        return function (target: any, propertyKey: string): void {
            const prop = getReflectProperty(target, propertyKey)
            if (prop.type !== "String") {
                throw new DecoratorError(
                    "disallowedChars",
                    `Decorator disallowedChars only works on String types: Property ${propertyKey} of class ${target.constructor.name} is not of type String.`
                )
            }
            prop.validate = true
            prop.disallowedChars = disallowedChars
        }
    }

    public static allowedValues(allowedValues: any[]): ValidatorFunction {
        return function (target: any, propertyKey: string): void {
            const prop = getReflectProperty(target, propertyKey)
            prop.validate = true
            prop.allowedValues = allowedValues
        }
    }

    public static disallowedValues(disallowedValues: any[]): ValidatorFunction {
        return function (target: any, propertyKey: string): void {
            const prop = getReflectProperty(target, propertyKey)
            prop.validate = true
            prop.disallowedValues = disallowedValues
        }
    }

    public static regExp(regExp: RegExp): ValidatorFunction {
        return function (target: any, propertyKey: string): void {
            const prop = getReflectProperty(target, propertyKey)
            if (prop.type !== "String") {
                throw new DecoratorError(
                    "regExp",
                    `Decorator regExp only works on String types: Property ${propertyKey} of class ${target.constructor.name} is not of type String.`
                )
            }
            prop.validate = true
            prop.regExp = regExp
        }
    }

    public static allowedTypes(allowedTypes: PrimitiveType[] | PrimitiveType): ValidatorFunction {
        return function (target: any, propertyKey: string): void {
            const prop = getReflectProperty(target, propertyKey)
            prop.validate = true
            prop.allowedTypes = allowedTypes
        }
    }

    public static minValue(minValue: number): ValidatorFunction {
        return function (target: any, propertyKey: string): void {
            const prop = getReflectProperty(target, propertyKey)
            if (prop.type !== "Number") {
                throw new DecoratorError(
                    "minValue",
                    `Decorator minValue only works on Number types: Property ${propertyKey} of class ${target.constructor.name} is not of type Number.`
                )
            }
            prop.validate = true
            prop.minValue = minValue
        }
    }

    public static maxValue(maxValue: number): ValidatorFunction {
        return function (target: any, propertyKey: string): void {
            const prop = getReflectProperty(target, propertyKey)
            if (prop.type !== "Number") {
                throw new DecoratorError(
                    "maxValue",
                    `Decorator maxValue only works on Number types: Property ${propertyKey} of class ${target.constructor.name} is not of type Number.`
                )
            }
            prop.validate = true
            prop.maxValue = maxValue
        }
    }

    public static between(minValue: number, maxValue: number): ValidatorFunction {
        return function (target: any, propertyKey: string): void {
            const prop = getReflectProperty(target, propertyKey)
            if (prop.type !== "Number") {
                throw new DecoratorError(
                    "between",
                    `Decorator between only works on Number types: Property ${propertyKey} of class ${target.constructor.name} is not of type Number.`
                )
            }
            prop.validate = true
            prop.minValue = minValue
            prop.maxValue = maxValue
        }
    }
}
