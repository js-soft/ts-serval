import { ISerializableAsync, SerializableAsync, serialize, type, validate } from "@js-soft/ts-serval"
import { expect } from "chai"
import { expectThrowsAsync } from "../../testUtil"

export class SerializeUnionTypesArrayAsyncTest {
    public static init(): void {
        describe("UnionsArrayAsync", function () {
            it("can parse first option (from JSON)", async function () {
                const json = {
                    "@type": "AsyncClassWithUnionArrayProperty",
                    content: [
                        {
                            "@type": "AsyncUnionArrayOption1",
                            p1: "val"
                        }
                    ]
                }
                const obj = await AsyncClassWithUnionArrayProperty.from(json)
                expect(obj.content).to.be.an("Array")
                expect(obj.content[0]).to.be.instanceOf(AsyncUnionArrayOption1)
            })

            it("can parse second option (from JSON)", async function () {
                const json = {
                    "@type": "AsyncClassWithUnionArrayProperty",
                    content: [
                        {
                            "@type": "AsyncUnionArrayOption2",
                            p2: "val"
                        }
                    ]
                }
                const obj = await AsyncClassWithUnionArrayProperty.from(json)
                expect(obj.content).to.be.an("Array")
                expect(obj.content[0]).to.be.instanceOf(AsyncUnionArrayOption2)
            })

            it("can parse first and second option (from JSON)", async function () {
                const json = {
                    "@type": "AsyncClassWithUnionArrayProperty",
                    content: [
                        {
                            "@type": "AsyncUnionArrayOption1",
                            p1: "val"
                        },
                        {
                            "@type": "AsyncUnionArrayOption2",
                            p2: "val"
                        }
                    ]
                }
                const obj = await AsyncClassWithUnionArrayProperty.from(json)
                expect(obj.content).to.be.an("Array")
                expect(obj.content[0]).to.be.instanceOf(AsyncUnionArrayOption1)
                expect(obj.content[1]).to.be.instanceOf(AsyncUnionArrayOption2)
            })

            it("throws if invalid options are given (from JSON)", async function () {
                const json = {
                    "@type": "AsyncClassWithUnionArrayProperty",
                    content: [
                        {
                            "@type": "AsyncUnionArrayOption1",
                            p1: "val"
                        },
                        {
                            "@type": "InvalidUnionArrayAsyncOption",
                            p3: "val"
                        } as any
                    ]
                }
                await expectThrowsAsync(async () => {
                    const obj = await AsyncClassWithUnionArrayProperty.from(json)
                    expect(obj.content).to.be.an("Array")
                    expect(obj.content[0]).to.be.instanceOf(AsyncUnionArrayOption1)
                    expect(obj.content[1]).to.be.instanceOf(InvalidUnionArrayAsyncOption)
                }, "AsyncClassWithUnionArrayProperty.content :: Item with index 1 could not be deserialized to a \\(AsyncUnionArrayOption1\\|AsyncUnionArrayOption2\\) \\(AsyncClassWithUnionArrayProperty.content\\[\\] :: Parsed object is not an instance of any allowed types \\(AsyncUnionArrayOption1\\|AsyncUnionArrayOption2\\).")
            })

            it("can parse first option (from Serializable object)", async function () {
                const json = {
                    "@type": "AsyncClassWithUnionArrayProperty",
                    content: [
                        (await AsyncUnionArrayOption1.from({
                            "@type": "AsyncUnionArrayOption1",
                            p1: "val"
                        })) as AsyncUnionArrayOption1
                    ]
                }

                const obj = await AsyncClassWithUnionArrayProperty.from(json)
                expect(obj.content).to.be.an("Array")
                expect(obj.content[0]).to.be.instanceOf(AsyncUnionArrayOption1)
            })

            it("can parse second option (from Serializable object)", async function () {
                const json = {
                    "@type": "AsyncClassWithUnionArrayProperty",
                    content: [
                        (await AsyncUnionArrayOption2.from({
                            "@type": "AsyncUnionArrayOption2",
                            p2: "val"
                        })) as AsyncUnionArrayOption2
                    ]
                }

                const obj = await AsyncClassWithUnionArrayProperty.from(json)
                expect(obj.content).to.be.an("Array")
                expect(obj.content[0]).to.be.instanceOf(AsyncUnionArrayOption2)
            })

            it("can parse first and second option (from Serializable object)", async function () {
                const json = {
                    "@type": "AsyncClassWithUnionArrayProperty",
                    content: [
                        (await AsyncUnionArrayOption1.from({
                            "@type": "AsyncUnionArrayOption1",
                            p1: "val"
                        })) as AsyncUnionArrayOption1,
                        (await AsyncUnionArrayOption2.from({
                            "@type": "AsyncUnionArrayOption2",
                            p2: "val"
                        })) as AsyncUnionArrayOption2
                    ]
                }

                const obj = await AsyncClassWithUnionArrayProperty.from(json)
                expect(obj.content).to.be.an("Array")
                expect(obj.content[0]).to.be.instanceOf(AsyncUnionArrayOption1)
                expect(obj.content[1]).to.be.instanceOf(AsyncUnionArrayOption2)
            })

            it("throws if invalid options are given (from Serializable object)", async function () {
                const json = {
                    "@type": "AsyncClassWithUnionArrayProperty",
                    content: [
                        (await AsyncUnionArrayOption1.from({
                            "@type": "AsyncUnionArrayOption1",
                            p1: "val"
                        })) as AsyncUnionArrayOption1,
                        (await InvalidUnionArrayAsyncOption.from({
                            "@type": "InvalidUnionArrayAsyncOption",
                            p3: "val"
                        })) as any
                    ]
                }

                await expectThrowsAsync(async () => {
                    const obj = await AsyncClassWithUnionArrayProperty.from(json)
                    expect(obj.content).to.be.an("Array")
                    expect(obj.content[0]).to.be.instanceOf(AsyncUnionArrayOption1)
                    expect(obj.content[1]).to.be.instanceOf(InvalidUnionArrayAsyncOption)
                }, "AsyncClassWithUnionArrayProperty.content :: Item with index 1 could not be deserialized to a \\(AsyncUnionArrayOption1\\|AsyncUnionArrayOption2\\) \\(AsyncClassWithUnionArrayProperty.content\\[\\] :: Parsed object is not an instance of any allowed types \\(AsyncUnionArrayOption1\\|AsyncUnionArrayOption2\\).")
            })
        })
    }
}

interface IClassWithUnionArrayProperty extends ISerializableAsync {
    content: (IUnionOption1 | IUnionOption2)[]
}

interface IUnionOption1 extends ISerializableAsync {
    p1: string
}

interface IUnionOption2 extends ISerializableAsync {
    p2: string
}

@type("AsyncUnionArrayOption1")
class AsyncUnionArrayOption1 extends SerializableAsync implements IUnionOption1 {
    @serialize()
    public p1: string
}

@type("AsyncUnionArrayOption2")
class AsyncUnionArrayOption2 extends SerializableAsync implements IUnionOption2 {
    @serialize()
    public p2: string
}

@type("InvalidUnionArrayAsyncOption")
class InvalidUnionArrayAsyncOption extends SerializableAsync {
    @serialize()
    public p3: string

    public static async from(value: any): Promise<InvalidUnionArrayAsyncOption> {
        return await super.fromT(value, InvalidUnionArrayAsyncOption)
    }
}

@type("AsyncClassWithUnionArrayProperty")
class AsyncClassWithUnionArrayProperty extends SerializableAsync implements IClassWithUnionArrayProperty {
    @serialize({ unionTypes: [AsyncUnionArrayOption1, AsyncUnionArrayOption2] })
    @validate()
    public content: (AsyncUnionArrayOption1 | AsyncUnionArrayOption2)[]

    public static async from(value: IClassWithUnionArrayProperty): Promise<AsyncClassWithUnionArrayProperty> {
        return await super.fromT(value, AsyncClassWithUnionArrayProperty)
    }
}
