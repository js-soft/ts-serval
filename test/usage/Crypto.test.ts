import { expect } from "chai"
import { CoreBuffer } from "../data/crypto/CoreBuffer"

export class CryptoTest {
    public static init(): void {
        describe("Crypto", function () {
            describe("CoreBuffer", function () {
                it("should parse a buffer from a Uint8Array", function () {
                    const array = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])

                    const coreBuffer = CoreBuffer.from(array)

                    expect(coreBuffer.buffer).to.be.instanceOf(Uint8Array)
                    expect(coreBuffer.buffer.byteLength).to.be.greaterThan(0)
                })
            })
        })
    }
}
