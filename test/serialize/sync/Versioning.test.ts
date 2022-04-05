import { Serializable, serialize, type, validate } from "@js-soft/ts-serval"
import { expect } from "chai"
import { expectThrows } from "../../testUtil"

@type("VersionedClass")
class VersionedClassV1 extends Serializable {
    @serialize()
    @validate()
    public propOld: string

    public static from(value: any): VersionedClassV1 {
        return this.fromAny(value)
    }
}

@type("VersionedClass", { version: 2 })
class VersionedClassV2 extends Serializable {
    @serialize()
    @validate()
    public propNew: string

    public static from(value: any): VersionedClassV2 {
        return this.fromAny(value)
    }
}

export class VersioningTest {
    public static init(): void {
        describe("VersionedClassV1", function () {
            const json = { "@type": "VersionedClass", propOld: "valOld" }

            it("fromUnknown", function () {
                const obj = Serializable.fromUnknown(json) as VersionedClassV1
                expect(obj).instanceOf(VersionedClassV1)
                expect(obj.propOld).to.equal("valOld")
                expect((obj.toJSON() as any)["@version"]).to.be.undefined
            })

            it("fromT", function () {
                const obj = VersionedClassV1.fromAny(json)
                expect(obj).instanceOf(VersionedClassV1)
                expect(obj.propOld).to.equal("valOld")
                expect((obj.toJSON() as any)["@version"]).to.be.undefined
            })

            it("from", function () {
                const obj = VersionedClassV1.from(json)
                expect(obj).instanceOf(VersionedClassV1)
                expect(obj.propOld).to.equal("valOld")
                expect((obj.toJSON() as any)["@version"]).to.be.undefined
            })

            it("from throwsErrorOnWrongVersion", function () {
                expectThrows(() => {
                    VersionedClassV2.from(json)
                }, "VersionedClassV2.propNew :: Value is not defined")
            })

            it("fromT throwsErrorOnWrongVersion", function () {
                expectThrows(() => {
                    VersionedClassV2.fromAny(json)
                }, "VersionedClassV2.propNew :: Value is not defined")
            })

            it("fromUnknown throwsErrorOnWrongVersion", function () {
                const wrongJSON = { "@type": "VersionedClass", propNew: "valNew" }

                expectThrows(() => {
                    Serializable.fromUnknown(wrongJSON) as VersionedClassV2
                }, "VersionedClassV1.propOld :: Value is not defined")
            })
        })

        describe("VersionedClassV2", function () {
            const json = { "@type": "VersionedClass", "@version": 2, propNew: "valNew" }

            it("fromUnknown", function () {
                const obj = Serializable.fromUnknown(json) as VersionedClassV2
                expect(obj).instanceOf(VersionedClassV2)
                expect(obj.propNew).to.equal("valNew")
            })

            it("fromT", function () {
                const obj = VersionedClassV2.fromAny(json)
                expect(obj).instanceOf(VersionedClassV2)
                expect(obj.propNew).to.equal("valNew")
                expect((obj.toJSON() as any)["@version"]).to.equal(2)
            })

            it("from", function () {
                const obj = VersionedClassV2.from(json)
                expect(obj).instanceOf(VersionedClassV2)
                expect(obj.propNew).to.equal("valNew")
                expect((obj.toJSON() as any)["@version"]).to.equal(2)
            })

            it("from throwsErrorOnWrongVersion", function () {
                expectThrows(() => {
                    VersionedClassV1.from(json)
                }, "VersionedClassV1.propOld :: Value is not defined")
            })

            it("fromT throwsErrorOnWrongVersion", function () {
                expectThrows(() => {
                    VersionedClassV1.fromAny(json)
                }, "VersionedClassV1.propOld :: Value is not defined")
            })

            it("fromUnknown throwsErrorOnWrongVersion", function () {
                const wrongJSON = { "@type": "VersionedClass", "@version": 2, propOld: "valOld" }

                expectThrows(() => {
                    Serializable.fromUnknown(wrongJSON) as VersionedClassV2
                }, "VersionedClassV2.propNew :: Value is not defined")
            })
        })
    }
}
