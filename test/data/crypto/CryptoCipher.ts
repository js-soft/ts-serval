import { ISerializable, ISerialized, schema } from "@js-soft/ts-serval"
import { CoreBuffer, ICoreBuffer } from "./CoreBuffer"
import { CryptoEncryptionAlgorithm } from "./CryptoSecretKey"
import { CryptoSerializableAsync } from "./CryptoSerializableAsync"

export interface ICryptoCipherSerialized extends ISerialized {
    alg: number
    cph: string
    cnt?: number
    nnc?: string
}

export interface ICryptoCipher extends ISerializable {
    algorithm: CryptoEncryptionAlgorithm
    cipher: ICoreBuffer
    counter?: number
    nonce?: ICoreBuffer
}

@schema("https://schema.corp", "CryptoCipher")
export class CryptoCipher extends CryptoSerializableAsync implements ICryptoCipher {
    public static MIN_CIPHER_BYTES = 2
    public static MAX_CIPHER_BYTES: number = 100 * 1024 * 1024

    public readonly algorithm: CryptoEncryptionAlgorithm
    public readonly cipher: CoreBuffer
    public readonly counter?: number
    public readonly nonce?: CoreBuffer

    public override toJSON(verbose = true): ICryptoCipherSerialized {
        const obj: ICryptoCipherSerialized = {
            cph: this.cipher.serialize(),
            alg: this.algorithm
        }
        if (this.nonce) {
            obj.nnc = this.nonce.serialize()
        }
        if (typeof this.counter !== "undefined") {
            obj.cnt = this.counter
        }
        if (verbose) {
            obj["@type"] = "CryptoCipher"
            obj["@context"] = "https://schema.corp"
        }
        return obj
    }

    public static async fromJSON(value: ICryptoCipherSerialized): Promise<CryptoCipher> {
        let nonceBuffer: CoreBuffer | undefined = undefined
        let counter: number | undefined = undefined
        if (typeof value.nnc !== "undefined") {
            nonceBuffer = CoreBuffer.deserialize(value.nnc)
        }

        if (typeof value.cnt !== "undefined") {
            counter = value.cnt
        }

        const cipherBuffer = CoreBuffer.deserialize(value.cph)
        return await this.fromAny({
            algorithm: value.alg,
            cipher: cipherBuffer,
            nonce: nonceBuffer,
            counter: counter
        })
    }

    public static override preDeserialize(value: any): any {
        let nonceBuffer: CoreBuffer | undefined = undefined
        let counter: number | undefined = undefined
        if (typeof value.nnc !== "undefined") {
            nonceBuffer = CoreBuffer.deserialize(value.nnc)
        }

        if (typeof value.cnt !== "undefined") {
            counter = value.cnt
        }

        const cipherBuffer = CoreBuffer.deserialize(value.cph)

        return {
            algorithm: value.alg,
            cipher: cipherBuffer,
            nonce: nonceBuffer,
            counter: counter
        }
    }
}
