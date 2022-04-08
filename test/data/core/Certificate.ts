import { schema, serialize, validate } from "@js-soft/ts-serval"
import { CryptoSignature, ICryptoSignature } from "../crypto/CryptoSignature"
import { CoreSerializableAsync, ICoreSerializableAsync } from "./CoreSerializableAsync"

export interface ICertificate extends ICoreSerializableAsync {
    content: string
    signature: ICryptoSignature
}

/**
 * A Certificate is digitally signed data which is issued by one user A (issuer) for another user B (subject).
 * The subject is eligible to share the certificate to any other user C, who in turn can verify, if the information
 * provided really comes from user A. Certificates always contain structured data, thus it is machine readable and
 * can be used for automatic checks.
 *
 * The content of a certificate is comparable with standardized SSL/TLS certificates, but they are not compatible
 * with each other. However, the content can be transformed.
 *
 *
 */
@schema("https://schema.corp", "Certificate")
export class Certificate extends CoreSerializableAsync {
    /**
     * The content of the certificate
     */
    @validate()
    @serialize()
    public content: string

    /**
     * The digital signature of the whole content from the issuer.
     */
    @validate()
    @serialize()
    public signature: CryptoSignature
}
