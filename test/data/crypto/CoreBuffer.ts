import { ISerializable, schema, Serializable } from "@js-soft/ts-serval"
import { Buffer } from "buffer"

export interface ICoreBuffer extends ISerializable {
    readonly buffer: Uint8Array
    readonly length: number
}

@schema("https://schema.corp", "CoreBuffer")
export class CoreBuffer extends Serializable implements ICoreBuffer {
    private readonly _buffer: Uint8Array

    public constructor(value: any = []) {
        super()
        if (value instanceof ArrayBuffer) {
            this._buffer = new Uint8Array(value, 0, value.byteLength)
        } else if (value instanceof Uint8Array) {
            this._buffer = value
        } else if (value instanceof Array) {
            this._buffer = Uint8Array.from(value)
        } else if (value instanceof CoreBuffer) {
            this._buffer = value.buffer
        } else if (typeof value === "string") {
            this._buffer = Buffer.from(value, "base64")
        }
    }

    public get buffer(): Uint8Array {
        return this._buffer
    }

    public get length(): number {
        return this._buffer.length
    }

    public toJSON(): Object {
        return this.serialize()
    }

    public serialize(): string {
        return Buffer.from(this._buffer).toString("base64")
    }

    public static from(value: any): CoreBuffer {
        return this.fromAny(value)
    }
}
