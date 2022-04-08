import { ISerializableAsync, ISerialized, schema, serialize, validate } from "@js-soft/ts-serval"
import { CoreBuffer } from "./CoreBuffer"
import { CryptoSerializableAsync } from "./CryptoSerializableAsync"

export interface ICryptoSignatureSerialized extends ISerialized {
    sig: string
    alg: number
    kid?: string
    id?: string
}

export interface ICryptoSignature extends ISerializableAsync {
    signature: CoreBuffer
    algorithm: CryptoHashAlgorithm
    keyId?: string
    id?: string
}

export const enum CryptoHashAlgorithm {
    /** SHA256 Hash Algorithm with a hash of 32 bytes */
    SHA256 = 1,
    /** SHA512 Hash Algorithm with a hash of 64 bytes */
    SHA512 = 2,

    BLAKE2B = 3
}

@schema("https://schema.corp", "CryptoSignature")
export class CryptoSignature extends CryptoSerializableAsync implements ICryptoSignature {
    @serialize()
    @validate()
    public readonly signature: CoreBuffer

    @serialize()
    @validate()
    public readonly algorithm: CryptoHashAlgorithm

    @serialize()
    @validate({ nullable: true })
    public readonly keyId?: string

    @serialize()
    @validate({ nullable: true })
    public readonly id?: string

    public static checkHashAlgorithm(algorithm: number, throwError = true): Error | undefined {
        let error: Error | undefined
        switch (algorithm) {
            case CryptoHashAlgorithm.BLAKE2B:
            case CryptoHashAlgorithm.SHA256:
            case CryptoHashAlgorithm.SHA512:
                break
            default:
                error = new Error("Hash algorithm is not supported.")
                break
        }

        if (error && throwError) throw error
        return error
    }

    public override toJSON(verbose = true): ICryptoSignatureSerialized {
        const obj: ICryptoSignatureSerialized = {
            sig: this.signature.serialize(),
            alg: this.algorithm
        }
        if (verbose) {
            obj["@type"] = "CryptoSignature"
            obj["@context"] = "https://schema.corp"
        }
        return obj
    }

    public static async fromJSON(value: ICryptoSignatureSerialized): Promise<CryptoSignature> {
        const error = CryptoSignature.checkHashAlgorithm(value.alg)
        if (error) throw error

        const buffer = CoreBuffer.from(value.sig)
        return await this.fromAny({
            signature: buffer,
            algorithm: value.alg
        })
    }

    public static override preDeserialize(value: any): any {
        const buffer = CoreBuffer.from(value.sig)
        return {
            signature: buffer,
            algorithm: value.alg
        }
    }
}
