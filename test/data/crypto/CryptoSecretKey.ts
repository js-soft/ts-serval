import { ISerializable, ISerialized, schema } from "@js-soft/ts-serval"
import { CoreBuffer, ICoreBuffer } from "./CoreBuffer"
import { CryptoSerializableAsync } from "./CryptoSerializableAsync"

export interface ICryptoSecretKeySerialized extends ISerialized {
    alg: number
    key: string
}

export interface ICryptoSecretKey extends ISerializable {
    algorithm: CryptoEncryptionAlgorithm
    secretKey: ICoreBuffer
}

export const enum CryptoEncryptionAlgorithm {
    /**
     * AES 128-bit encryption with Galois-Counter-Mode
     * 12-byte Initialization Vector is prepended to cipher
     * 16-byte Authentication Tag is appended to cipher
     */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    AES128_GCM = 1,
    /**
     * AES 256-bit encryption with Galois-Counter-Mode
     * 12-byte Initialization Vector is prepended to cipher
     * 16-byte Authentication Tag is appended to cipher
     */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    AES256_GCM = 2,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    XCHACHA20_POLY1305 = 3
}

@schema("https://schema.corp", "CryptoSecretKey")
export class CryptoSecretKey extends CryptoSerializableAsync implements ICryptoSecretKey {
    public readonly secretKey: CoreBuffer
    public readonly algorithm: CryptoEncryptionAlgorithm

    public override toJSON(verbose = true): ICryptoSecretKeySerialized {
        const obj: ICryptoSecretKeySerialized = {
            key: this.secretKey.serialize(),
            alg: this.algorithm
        }
        if (verbose) {
            obj["@type"] = "CryptoSecretKey"
            obj["@context"] = "https://schema.corp"
        }
        return obj
    }

    public static async fromJSON(value: ICryptoSecretKeySerialized): Promise<CryptoSecretKey> {
        const buffer = CoreBuffer.deserialize(value.key)
        return await this.fromAny({
            algorithm: value.alg as CryptoEncryptionAlgorithm,
            secretKey: buffer
        })
    }

    public static override preDeserialize(value: any): any {
        const buffer = CoreBuffer.from(value.key)
        return {
            signature: buffer,
            algorithm: value.alg
        }
    }
}
