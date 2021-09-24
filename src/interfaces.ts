export interface Constructor<T> {
    new (...args: any[]): T
}

export interface ISerializable {}

export interface ISerializableAsync {}

export interface ISerialized {
    "@context"?: string
    "@type"?: string
    "@version"?: string
}
