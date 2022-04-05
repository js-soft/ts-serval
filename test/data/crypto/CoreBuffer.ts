import { ISerializable, schema, Serializable } from "@js-soft/ts-serval"
import { Buffer } from "buffer"

export interface ICoreBuffer extends ISerializable {
    readonly buffer: Uint8Array
    readonly length: number
}

@schema("https://schema.corp", "CoreBuffer")
export class CoreBuffer extends Serializable implements ICoreBuffer {
    private readonly _buffer: Uint8Array

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

    // TODO: ??
    // public static deserialize(value: string): CoreBuffer {
    //     return CoreBuffer.from(value)
    // }

    protected static preFrom(value: any): any {
        if (value instanceof ArrayBuffer) {
            return new Uint8Array(value, 0, value.byteLength)
        } else if (value instanceof Uint8Array) {
            return value
        } else if (value instanceof Array) {
            return Uint8Array.from(value)
        } else if (value instanceof CoreBuffer) {
            return value.buffer
        } else if (typeof value === "string") {
            return Buffer.from(value, "base64")
        }

        return value
    }

    public static from(value: any): CoreBuffer {
        return this.fromAny(value)
    }
}
