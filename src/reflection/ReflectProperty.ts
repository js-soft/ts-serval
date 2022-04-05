import { PrimitiveType } from "../validation/ValidateInterfaces"

export interface IReflectProperty {
    /**
     * The property's name
     */
    key: string

    /**
     * If a property has more than one possible type, add all the possibilities here in order for
     * (de)serialization to work properly
     */
    unionTypes?: (new (...args: unknown[]) => unknown)[]

    /**
     * The TypeScript type of the property (e.g. Classname)
     */
    type: string
    /**
     * The Javascript constructor/class
     */
    typeInfo: Function
    /**
     * The Javascript primitive type of the property
     */
    primitiveType?: string

    itemDescriptor?: IReflectProperty
    /**
     * The possible static value of the property, e.g. @context, @type or @version
     */
    value?: any

    serialize?: boolean

    serializeProperty?: boolean
    serializeAs?: boolean

    alias?: string
    allowSubclasses?: boolean
    any?: boolean
    customDeserializer?: Function
    customGenerator?: Function
    customParser?: Function
    customSerializer?: Function
    deserializeStrings?: boolean
    enforceString?: boolean
    optional?: boolean

    parseUnknown?: boolean

    allowedTypes?: PrimitiveType[] | PrimitiveType
    customValidator?: Function
    validate?: boolean
    minValue?: number
    maxValue?: number
    minLength?: number
    maxLength?: number
    allowedChars?: string
    disallowedChars?: string
    allowedValues?: any[]
    disallowedValues?: any[]
    regExp?: RegExp
    validateInternal?: Function
    requiredInheritance?: Function[][]
}
