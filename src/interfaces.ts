export interface Constructor<T> {
    new (...args: any[]): T
}

export interface ISerializable {}

export interface ISerializableAsync {}

export interface ISerialized {
    "@context"?: string // eslint-disable-line @typescript-eslint/naming-convention
    "@type"?: string // eslint-disable-line @typescript-eslint/naming-convention
    "@version"?: string // eslint-disable-line @typescript-eslint/naming-convention
}
