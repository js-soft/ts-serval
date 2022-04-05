import { expect } from "chai"
import { Certificate } from "../data/core/Certificate"
import { CryptoSignature } from "../data/crypto/CryptoSignature"

export class CoreTest {
    public static init(): void {
        describe("Core", function () {
            describe("Certificate", function () {
                it("should deserialize and serialize correctly", async function () {
                    const certObject: any = {
                        content:
                            '{"@context":"https://schema.corp","@type":"CertificateContent","constraints":[{}],"issuedAt":"2021-01-05T11:04:09.819Z","issuer":"id1H9jKjY5RSXFzJVftGcQ48Y3oX43EEdBH4","issuerData":{},"items":[{},{},{}],"subject":"id1NGoWuEFWrjNZsAjNqy13Qzs7iqVAWoyFU","subjectPublicKey":{"pub":"amEeyBzmO971T5PeVgrY-L9goH3v5Kb1a2I9LeSAn30","alg":3}}',
                        signature: {
                            sig: "V8wjmY2YW4i0WEZa_RaWLrYNapgMyNQhCBQVpRabpZc4VYarytu4OaU3-XepHD2BfV4MaNtKTxybw_0F0hqbBg",
                            alg: 2
                        }
                    }
                    const cert = await Certificate.fromAny(certObject)
                    expect(cert).instanceOf(Certificate)
                    expect(cert.content).to.be.a("string")
                    expect(cert.signature).instanceOf(CryptoSignature)

                    const serialized =
                        '{"@context":"https://schema.corp","@type":"Certificate","content":"{\\"@context\\":\\"https://schema.corp\\",\\"@type\\":\\"CertificateContent\\",\\"constraints\\":[{}],\\"issuedAt\\":\\"2021-01-05T11:04:09.819Z\\",\\"issuer\\":\\"id1H9jKjY5RSXFzJVftGcQ48Y3oX43EEdBH4\\",\\"issuerData\\":{},\\"items\\":[{},{},{}],\\"subject\\":\\"id1NGoWuEFWrjNZsAjNqy13Qzs7iqVAWoyFU\\",\\"subjectPublicKey\\":{\\"pub\\":\\"amEeyBzmO971T5PeVgrY-L9goH3v5Kb1a2I9LeSAn30\\",\\"alg\\":3}}","signature":{"sig":"V8wjmY2YW4i0WEZa/RaWLrYNapgMyNQhCBQVpRabpZc4VYarytu4OaU3+XepHD2BfV4MaNtKTxybw/0F0hqbBg==","alg":2}}'
                    expect(cert.serialize()).to.equal(serialized)

                    const cert2 = await Certificate.deserialize(serialized)
                    expect(cert2).instanceOf(Certificate)
                    expect(cert2.content).to.be.a("string")
                    expect(cert2.signature).instanceOf(CryptoSignature)
                })
            })
        })
    }
}
