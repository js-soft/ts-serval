import { Serializable, serialize, type, validate } from "@js-soft/ts-serval"
import { expect } from "chai"
import { CoreBuffer } from "./data/crypto/CoreBuffer"

@type("Foo")
class Foo extends Serializable {
    @serialize()
    @validate()
    public test: number

    @serialize()
    @validate()
    public buffer: CoreBuffer
}

@type("Bar")
class Bar extends Foo {}

export class Inheritance2Test {
    public static init(): void {
        const buffer = CoreBuffer.from("YQ==")

        describe("Inheritance", function () {
            it("will crash", function () {
                const child = Bar.fromAny({ test: 1, buffer })
                expect(child.test).to.be.equal(1)
                expect(child.buffer.length).to.be.equal(1)
            })

            it("will not crash", function () {
                const child = Bar.fromAny({ test: 1, buffer })
                expect(child.test).to.be.equal(1)
                expect(child.buffer.length).to.be.equal(1)
            })
        })
    }
}
