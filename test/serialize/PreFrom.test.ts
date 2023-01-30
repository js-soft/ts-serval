import { Serializable, serialize, type } from "@js-soft/ts-serval"
import { expect } from "chai"

@type("PreFromSerializable")
class PreFromSerializable extends Serializable {
    @serialize()
    public x: string

    public static override preFrom(value: any) {
        value.x = `${value.x}y`
        return value
    }

    public static from(value: Object): PreFromSerializable {
        return this.fromAny(value)
    }
}

@type("PreFromSerializableAsync")
class PreFromSerializableAsync extends Serializable {
    @serialize()
    public x: string

    public static override preFrom(value: any) {
        value.x = `${value.x}y`
        return value
    }

    public static from(value: Object): PreFromSerializableAsync {
        return this.fromAny(value)
    }
}

export class PreFromTest {
    public static init(): void {
        describe("PreFrom (Serializable)", function () {
            it("should not change the value in prefrom (value is object)", function () {
                const value = { x: "x" }

                const s = PreFromSerializable.fromAny(value)
                expect(s.x).to.equal("xy")

                expect(value).to.deep.equal({ x: "x" })
            })

            it("should not change the value in prefrom (value is Serializable)", function () {
                const value = PreFromSerializable.fromAny({ x: "x" })

                const s = PreFromSerializable.fromAny(value)
                expect(s.x).to.equal("xyy")

                expect(value.toJSON()).to.deep.equal({ "@type": "PreFromSerializable", x: "xy" })
            })
        })

        describe("PreFrom (Serializable Async)", function () {
            it("should not change the value in prefrom (value is object)", function () {
                const value = { x: "x" }

                const s = PreFromSerializableAsync.fromAny(value)
                expect(s.x).to.equal("xy")

                expect(value).to.deep.equal({ x: "x" })
            })

            it("should not change the value in prefrom (value is Serializable)", function () {
                const value = PreFromSerializableAsync.fromAny({ x: "x" })

                const s = PreFromSerializableAsync.fromAny(value)
                expect(s.x).to.equal("xyy")

                expect(value.toJSON()).to.deep.equal({ "@type": "PreFromSerializableAsync", x: "xy" })
            })
        })
    }
}
