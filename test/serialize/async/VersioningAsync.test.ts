import { SerializableAsync, serialize, type, validate } from "@js-soft/ts-serval"
import { expect } from "chai"
import { expectThrowsAsync } from "../../testUtil"

@type("VersionedClassAsync")
class VersionedClassV1Async extends SerializableAsync {
    @serialize()
    @validate()
    public propOld: string

    public static async from(value: any): Promise<VersionedClassV1Async> {
        return await this.fromAny(value)
    }
}

@type("VersionedClassAsync", { version: 2 })
class VersionedClassV2Async extends SerializableAsync {
    @serialize()
    @validate()
    public propNew: string

    public static async from(value: any): Promise<VersionedClassV2Async> {
        return await this.fromAny(value)
    }
}

export class VersioningAsyncTest {
    public static init(): void {
        describe("VersionedClassV1Async", function () {
            const json = { "@type": "VersionedClassAsync", propOld: "valOld" }

            it("fromUnknown", async function () {
                const obj = (await SerializableAsync.fromUnknown(json)) as VersionedClassV1Async
                expect(obj).instanceOf(VersionedClassV1Async)
                expect(obj.propOld).to.equal("valOld")
                expect((obj.toJSON() as any)["@version"]).to.be.undefined
            })

            it("fromT", async function () {
                const obj = await VersionedClassV1Async.fromAny(json)
                expect(obj).instanceOf(VersionedClassV1Async)
                expect(obj.propOld).to.equal("valOld")
                expect((obj.toJSON() as any)["@version"]).to.be.undefined
            })

            it("from", async function () {
                const obj = await VersionedClassV1Async.from(json)
                expect(obj).instanceOf(VersionedClassV1Async)
                expect(obj.propOld).to.equal("valOld")
                expect((obj.toJSON() as any)["@version"]).to.be.undefined
            })

            it("from throwsErrorOnWrongVersion", async function () {
                await expectThrowsAsync(async () => {
                    await VersionedClassV2Async.from(json)
                }, "VersionedClassV2Async.propNew :: Value is not defined")
            })

            it("fromT throwsErrorOnWrongVersion", async function () {
                await expectThrowsAsync(async () => {
                    await VersionedClassV2Async.fromAny(json)
                }, "VersionedClassV2Async.propNew :: Value is not defined")
            })

            it("fromUnknown throwsErrorOnWrongVersion", async function () {
                const wrongJSON = { "@type": "VersionedClassAsync", propNew: "valNew" }

                await expectThrowsAsync(async () => {
                    ;(await SerializableAsync.fromUnknown(wrongJSON)) as VersionedClassV2Async
                }, "VersionedClassV1Async.propOld :: Value is not defined")
            })
        })

        describe("VersionedClassV2Async", function () {
            const json = { "@type": "VersionedClassAsync", "@version": 2, propNew: "valNew" }

            it("fromUnknown", async function () {
                const obj = (await SerializableAsync.fromUnknown(json)) as VersionedClassV2Async
                expect(obj).instanceOf(VersionedClassV2Async)
                expect(obj.propNew).to.equal("valNew")
            })

            it("fromT", async function () {
                const obj = await VersionedClassV2Async.fromAny(json)
                expect(obj).instanceOf(VersionedClassV2Async)
                expect(obj.propNew).to.equal("valNew")
                expect((obj.toJSON() as any)["@version"]).to.equal(2)
            })

            it("from", async function () {
                const obj = await VersionedClassV2Async.from(json)
                expect(obj).instanceOf(VersionedClassV2Async)
                expect(obj.propNew).to.equal("valNew")
                expect((obj.toJSON() as any)["@version"]).to.equal(2)
            })

            it("from throwsErrorOnWrongVersion", async function () {
                await expectThrowsAsync(async () => {
                    await VersionedClassV1Async.from(json)
                }, "VersionedClassV1Async.propOld :: Value is not defined")
            })

            it("fromT throwsErrorOnWrongVersion", async function () {
                await expectThrowsAsync(async () => {
                    await VersionedClassV1Async.fromAny(json)
                }, "VersionedClassV1Async.propOld :: Value is not defined")
            })

            it("fromUnknown throwsErrorOnWrongVersion", async function () {
                const wrongJSON = { "@type": "VersionedClassAsync", "@version": 2, propOld: "valOld" }

                await expectThrowsAsync(async () => {
                    ;(await SerializableAsync.fromUnknown(wrongJSON)) as VersionedClassV2Async
                }, "VersionedClassV2Async.propNew :: Value is not defined")
            })
        })
    }
}
