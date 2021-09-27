export enum PrimitiveType {
    Number = "number",
    Object = "object",
    Boolean = "boolean",
    String = "string",
    Array = "array"
}

export interface ValidateParameter {
    /**
     * Whether or not the property needs to be set / is required.
     * @default false - The property is required and must be set
     */
    nullable?: boolean

    /**
     * The minimum allowed value (inclusive).
     * If the corresponding type is a number, the min value is the minimum allowed numeric value.
     * If the corresponding type is a string, the min value is the minimum allowed length of the string.
     * @default undefined - No minimum value is set
     */
    min?: number

    /**
     * The maximum allowed value (inclusive).
     * If the corresponding type is a number, the max value is the maximum allowed numeric value.
     * If the corresponding type is a string, the max value is the maximum allowed length of the string.
     * @default undefined - No maximum value is set
     */
    max?: number

    /**
     * A character string of allowed characters. Each character should be unique.
     * If the corresponding type is a string, only the characters within the allowed string are allowed.
     * @default undefined - All characters are allowed
     */
    allowedChars?: string

    /**
     * A character string of disallowed characters. Each character should be unique.
     * If the corresponding type is a string, no character of the disallowed string is allowed.
     * @default undefined - No character is disallowed
     */
    disallowedChars?: string

    /**
     * An array of allowed values. The value must be one of the allowedValues.
     * @default undefined - All values are allowed
     */
    allowedValues?: any[]

    /**
     * An array of disallowed values. The value must not be one of the disallowedValues.
     * @default undefined - No values are disallowed
     */
    disallowedValues?: any[]

    /**
     * A Regular expression on which the given string is tested against.
     * @default undefined - No regular expression will be tested
     */
    regExp?: RegExp

    /**
     * An array which primitive JavaScript types are allowed as a value or a
     * string with a single allowed type.
     * If not set, it uses the type defined by the property's TypeScript definition.
     * Caution: If the type definition is not a primitive type (like an Interface, Class
     * Union Operator, Array, Template, etc) the generic type "object" is used as a fallback).
     * @default undefined - uses the typescript type definition of the property ("object" if unclear)
     */
    allowedTypes?: PrimitiveType[] | PrimitiveType

    /**
     * An array of required inheritances of an object. The objects of this array
     * are again arrays of class names. The first array is an OR the second array is
     * an AND.
     *
     * Example:
     * [
     *  [TokenRelationshipTemplate, Token, CoreSerializableAsync, SerializableAsync],
     *  [File, CoreSerializableAsync, SerializableAsync]
     * ]
     *
     * @default undefined
     */
    requiredInheritance?: Function[][]

    /**
     * A function can be used for custom validation. The custom validator function will be called
     * *in addition* to all other validators.
     * @param value The value which should be set
     * @returns {(string|undefined)} Returns a string (with the error message) if an error occured, undefined otherwise.
     * @default undefined - No custom validation is done.
     */
    customValidator?(value: any): string | undefined
}
