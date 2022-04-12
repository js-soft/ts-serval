import { Serializable, serialize, type, validate } from "@js-soft/ts-serval"
import { expect } from "chai"
import { CoreBuffer } from "./data/crypto/CoreBuffer"

enum Baz {
    A = 1
}

enum Qux {
    B = 1
}

@type("Foo")
class Foo extends Serializable {
    @serialize()
    @validate()
    public test: Baz | Qux

    @serialize()
    @validate()
    public buffer: CoreBuffer
}

@type("Bar")
class Bar extends Foo {
    public override test: Baz
}

@type("IContainBar")
class IContainBar extends Serializable {
    @serialize()
    @validate()
    public bar: Bar
}

export class Inheritance2Test {
    public static init(): void {
        describe.only("Inheritance", function () {
            it("will crash", function () {
                const child = IContainBar.fromAny({ bar: { test: 1, buffer: CoreBuffer.from("YQ==") } })
                expect(child.bar.test).to.be.equal(1)
                expect(child.bar.buffer.length).to.be.equal(1)
            })

            it("will not crash", function () {
                const child = IContainBar.fromAny({ bar: { test: 1, buffer: CoreBuffer.from("YQ==") } })
                expect(child.bar.test).to.be.equal(1)
                expect(child.bar.buffer.length).to.be.equal(1)
            })
        })
    }
}
