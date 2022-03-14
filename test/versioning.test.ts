import { Serializable, serialize, type, validate } from "@js-soft/ts-serval"
import { expect } from "chai"

@type("VersionedClass")
class VersionedClassV1 extends Serializable {
    @serialize()
    @validate()
    public propOld: string
}

@type("VersionedClass", "2")
class VersionedClassV2 extends Serializable {
    @serialize()
    @validate()
    public propNew: string
}

export class VersioningTest {
    public static init(): void {
        describe.only("VersionedClassV1", function () {
            const json = { "@type": "VersionedClass", propOld: "val" }

            it("fromT", function () {
                const obj = VersionedClassV1.fromT<VersionedClassV1>(json, VersionedClassV1)
                expect((obj.toJSON() as any)["@version"]).to.be.undefined
            })
        })

        describe.only("VersionedClassV2", function () {
            const json = { "@type": "VersionedClass", "@version": "2", propNew: "val" }

            it("fromT", function () {
                const obj = VersionedClassV2.fromT<VersionedClassV2>(json, VersionedClassV2)
                expect((obj.toJSON() as any)["@version"]).to.equal("2")
            })

            // when the value of "@version" is an object instead of a string (as the original error message suggests), the resulting error message is different
            it("fromT with version as object", function () {
                const json = { "@type": "VersionedClass", "@version": { version: "2" }, propNew: "val" }
                const obj = VersionedClassV2.fromT<VersionedClassV2>(json, VersionedClassV2)
                expect((obj.toJSON() as any)["@version"]).to.equal("2")
            })
        })
    }
}
