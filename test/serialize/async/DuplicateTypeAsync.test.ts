import { SerializableAsync, serialize, type, validate } from "@js-soft/ts-serval"
import { expect } from "chai"

@type("DuplicatedClassAsync")
class DuplicatedClassAsync extends SerializableAsync {
    @serialize()
    @validate()
    public propOld: string

    public static async from(value: any): Promise<DuplicatedClassAsync> {
        return await super.fromT(value, DuplicatedClassAsync)
    }
}

@type("DuplicatedClassAsync")
class DuplicatedClass2Async extends SerializableAsync {
    @serialize()
    @validate()
    public propNew: DuplicatedClassAsync

    public static async from(value: any): Promise<DuplicatedClass2Async> {
        return await super.fromT(value, DuplicatedClass2Async)
    }
}

export class DuplicateAsyncTypeTest {
    public static init(): void {
        describe("DuplicateAsyncTypeTest", function () {
            const json = {
                "@type": "DuplicatedClassAsync",
                propNew: {
                    propOld: "Hugo"
                }
            }

            it("should deserialize duplicated class correctly (from JSON)", async function () {
                const obj = (await SerializableAsync.fromUnknown(json)) as DuplicatedClass2Async
                expect(obj).instanceOf(DuplicatedClass2Async)
                expect(obj.propNew).to.be.instanceOf(DuplicatedClassAsync)
            })

            it("should deserialize duplicated class correctly (from Serializable)", async function () {
                const instance = await DuplicatedClassAsync.from({ propOld: "test" })
                const obj = await DuplicatedClassAsync.from(instance)
                expect(obj).instanceOf(DuplicatedClassAsync)
                expect(obj.propOld).to.equal("test")
            })
        })
    }
}
