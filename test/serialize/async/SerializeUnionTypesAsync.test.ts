import { ISerializableAsync, SerializableAsync, serialize, type, validate } from "@js-soft/ts-serval"
import { expect } from "chai"

export class SerializeUnionTypesAsyncTest {
    public static init(): void {
        describe("UnionsAsync", function () {
            it("can parse first option (from JSON)", async function () {
                const json = {
                    "@type": "AsyncClassWithUnionProperty",
                    content: {
                        "@type": "AsyncUnionOption1",
                        p1: "val"
                    }
                }
                const obj = await AsyncClassWithUnionProperty.fromAny(json)
                expect(obj.content).to.be.instanceOf(AsyncUnionOption1)
            })

            it("can parse second option (from JSON)", async function () {
                const json = {
                    "@type": "AsyncClassWithUnionProperty",
                    content: {
                        "@type": "AsyncUnionOption2",
                        p2: "val"
                    }
                }
                const obj = await AsyncClassWithUnionProperty.fromAny(json)
                expect(obj.content).to.be.instanceOf(AsyncUnionOption2)
            })

            it("can parse first option (from Seriazable object)", async function () {
                const json = {
                    "@type": "AsyncClassWithUnionProperty",
                    content: await AsyncUnionOption1.fromAny({
                        "@type": "AsyncUnionOption1",
                        p1: "val"
                    })
                }

                const obj = await AsyncClassWithUnionProperty.fromAny(json)

                expect(obj.content).to.be.instanceOf(AsyncUnionOption1)
            })

            it("can parse second option (from Seriazable object)", async function () {
                const json = {
                    "@type": "AsyncClassWithUnionProperty",
                    content: await AsyncUnionOption2.fromAny({
                        "@type": "AsyncUnionOption2",
                        p2: "val"
                    })
                }

                const obj = await AsyncClassWithUnionProperty.fromAny(json)

                expect(obj.content).to.be.instanceOf(AsyncUnionOption2)
            })
        })
    }
}

interface IClassWithUnionProperty extends ISerializableAsync {
    content: IUnionOption1 | IUnionOption2
}

interface IUnionOption1 extends ISerializableAsync {
    p1: string
}

interface IUnionOption2 extends ISerializableAsync {
    p2: string
}

@type("AsyncUnionOption1")
class AsyncUnionOption1 extends SerializableAsync implements IUnionOption1 {
    @serialize()
    public p1: string
}

@type("AsyncUnionOption2")
class AsyncUnionOption2 extends SerializableAsync implements IUnionOption2 {
    @serialize()
    public p2: string
}

@type("AsyncClassWithUnionProperty")
class AsyncClassWithUnionProperty extends SerializableAsync implements IClassWithUnionProperty {
    @serialize({ unionTypes: [AsyncUnionOption1, AsyncUnionOption2] })
    @validate()
    public content: AsyncUnionOption1 | AsyncUnionOption2
}
