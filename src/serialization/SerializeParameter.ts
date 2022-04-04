import { SerializableBase } from "../SerializableBase"

export interface SerializeParameterBase {
    /**
     * The serialization alias for this property. Serialization and deserialization will
     * only work with the alias if set
     * @default undefined - no alias is set
     */
    alias?: string

    /**
     * Whether or not to allow subclasses of defined types
     * @default true - Subclasses are allowed
     */
    allowSubclasses?: boolean

    /**
     * Whether or not the content of a property should be parsed (and validated)
     * @default false - the property and its content is parsed and validated
     */
    any?: boolean

    /**
     * The custom deserialization function to deserialize an object from a string
     * @default undefined - the internal .deserialize() function is used
     */
    customDeserializer?:
        | ((value: string) => SerializableBase)
        | ((value: string) => Promise<SerializableBase>)
        | Function

    /**
     * The custom function to parse an object from another (usually untyped) JSON object
     * @default undefined - the internal .from() function is used
     */
    customParser?: ((value: object) => SerializableBase) | ((value: object) => Promise<SerializableBase>) | Function

    /**
     * The custom function to generate a JSON representation out of an object
     * @default undefined - the internal .toJSON() function is used
     */
    customGenerator?: ((value: SerializableBase) => object) | Function

    /**
     * The custom function to serialize an object to a string
     * @default undefined - the internal .serialize() function is used
     */
    customSerializer?: ((value: SerializableBase) => string) | Function

    /**
     * Whether or not strings should be serialized
     * Only works if strings are NOT allowed as types (as otherwise
     * it uses the string as value and not the deserialized object)
     */
    deserializeStrings?: boolean

    /**
     * Whether or not to enforce string (de-)serialization for this property
     * @default false - Strings are not enforces, the properties type is used
     */
    enforceString?: boolean

    /**
     * Whether or not the property can be optional (not existing in the structure)
     * Same as validate.nullable
     * @default false - the property must be set
     */
    optional?: boolean

    /**
     * Whether or not the property's value should be parsed as unknown. This is only done if the value
     * and its @type property is set.
     *
     * @default undefined - By default, types of Serializable and SerializableAsync are parsed as unknown. Additionally,
     * if subclasses are allowed, they are parsed as unknown.
     */
    parseUnknown?: boolean
}

export interface SerializeParameterUnionTypes extends SerializeParameterBase {
    /**
     * If a property has more than one possible type, add all the possibilities here in order for
     * (de)serialization to work properly
     */
    unionTypes?: Function[]

    type?: void
}
export interface SerializeParameterSingleType extends SerializeParameterBase {
    /**
     * The type information of the given property. This can be fetched automatically be the source
     * code - with following exceptions:
     * - `type` needs to be set for Arrays
     *
     * @default undefined - no type is set, type will be used from the reflection
     */
    type?: Function

    unionTypes?: void
}

export type SerializeParameter = SerializeParameterSingleType | SerializeParameterUnionTypes
