import { ISerializable, Serializable, serialize, type, validate } from "@js-soft/ts-serval"
import { expect } from "chai"
import { expectThrows } from "../../testUtil"

export class SerializeUnionTypesArrayTest {
    public static init(): void {
        describe("UnionsArray", function () {
            it("can parse first option (from JSON)", function () {
                const json = {
                    "@type": "ClassWithUnionArrayProperty",
                    content: [
                        {
                            "@type": "UnionArrayOption1",
                            p1: "val"
                        }
                    ]
                }
                const obj = ClassWithUnionArrayProperty.from(json)
                expect(obj.content).to.be.an("Array")
                expect(obj.content[0]).to.be.instanceOf(UnionArrayOption1)
            })

            it("can parse second option (from JSON)", function () {
                const json = {
                    "@type": "ClassWithUnionArrayProperty",
                    content: [
                        {
                            "@type": "UnionArrayOption2",
                            p2: "val"
                        }
                    ]
                }
                const obj = ClassWithUnionArrayProperty.from(json)
                expect(obj.content).to.be.an("Array")
                expect(obj.content[0]).to.be.instanceOf(UnionArrayOption2)
            })

            it("can parse first and second option (from JSON)", function () {
                const json = {
                    "@type": "ClassWithUnionArrayProperty",
                    content: [
                        {
                            "@type": "UnionArrayOption1",
                            p1: "val"
                        },
                        {
                            "@type": "UnionArrayOption2",
                            p2: "val"
                        }
                    ]
                }
                const obj = ClassWithUnionArrayProperty.from(json)
                expect(obj.content).to.be.an("Array")
                expect(obj.content[0]).to.be.instanceOf(UnionArrayOption1)
                expect(obj.content[1]).to.be.instanceOf(UnionArrayOption2)
            })

            it("throws if invalid options are given (from JSON)", function () {
                const json = {
                    "@type": "ClassWithUnionArrayProperty",
                    content: [
                        {
                            "@type": "UnionArrayOption1",
                            p1: "val"
                        },
                        {
                            "@type": "InvalidUnionArrayOption",
                            p3: "val"
                        } as any
                    ]
                }
                expectThrows(() => {
                    const obj = ClassWithUnionArrayProperty.from(json)
                    expect(obj.content).to.be.an("Array")
                    expect(obj.content[0]).to.be.instanceOf(UnionArrayOption1)
                    expect(obj.content[1]).to.be.instanceOf(InvalidUnionArrayOption)
                }, "ClassWithUnionArrayProperty.content :: Item with index 1 could not be deserialized to a \\(UnionArrayOption1\\|UnionArrayOption2\\) \\(ClassWithUnionArrayProperty.content\\[\\] :: Parsed object is not an instance of any allowed types \\(UnionArrayOption1\\|UnionArrayOption2\\).")
            })

            it("can parse first option (from Serializable object)", function () {
                const json = {
                    "@type": "ClassWithUnionArrayProperty",
                    content: [
                        UnionArrayOption1.from({
                            "@type": "UnionArrayOption1",
                            p1: "val"
                        }) as UnionArrayOption1
                    ]
                }

                const obj = ClassWithUnionArrayProperty.from(json)
                expect(obj.content).to.be.an("Array")
                expect(obj.content[0]).to.be.instanceOf(UnionArrayOption1)
            })

            it("can parse second option (from Serializable object)", function () {
                const json = {
                    "@type": "ClassWithUnionArrayProperty",
                    content: [
                        UnionArrayOption2.from({
                            "@type": "UnionArrayOption2",
                            p2: "val"
                        }) as UnionArrayOption2
                    ]
                }

                const obj = ClassWithUnionArrayProperty.from(json)
                expect(obj.content).to.be.an("Array")
                expect(obj.content[0]).to.be.instanceOf(UnionArrayOption2)
            })

            it("can parse first and second option (from Serializable object)", function () {
                const json = {
                    "@type": "ClassWithUnionArrayProperty",
                    content: [
                        UnionArrayOption1.from({
                            "@type": "UnionArrayOption1",
                            p1: "val"
                        }) as UnionArrayOption1,
                        UnionArrayOption2.from({
                            "@type": "UnionArrayOption2",
                            p2: "val"
                        }) as UnionArrayOption2
                    ]
                }

                const obj = ClassWithUnionArrayProperty.from(json)
                expect(obj.content).to.be.an("Array")
                expect(obj.content[0]).to.be.instanceOf(UnionArrayOption1)
                expect(obj.content[1]).to.be.instanceOf(UnionArrayOption2)
            })

            it("throws if invalid options are given (from Serializable object)", function () {
                const json = {
                    "@type": "ClassWithUnionArrayProperty",
                    content: [
                        UnionArrayOption1.from({
                            "@type": "UnionArrayOption1",
                            p1: "val"
                        }) as UnionArrayOption1,
                        InvalidUnionArrayOption.from({
                            "@type": "InvalidUnionArrayOption",
                            p3: "val"
                        }) as any
                    ]
                }

                expectThrows(() => {
                    const obj = ClassWithUnionArrayProperty.from(json)
                    expect(obj.content).to.be.an("Array")
                    expect(obj.content[0]).to.be.instanceOf(UnionArrayOption1)
                    expect(obj.content[1]).to.be.instanceOf(InvalidUnionArrayOption)
                }, "ClassWithUnionArrayProperty.content :: Item with index 1 could not be deserialized to a \\(UnionArrayOption1\\|UnionArrayOption2\\) \\(ClassWithUnionArrayProperty.content\\[\\] :: Parsed object is not an instance of any allowed types \\(UnionArrayOption1\\|UnionArrayOption2\\).")
            })
        })
    }
}

interface IClassWithUnionArrayProperty extends ISerializable {
    content: (IUnionOption1 | IUnionOption2)[]
}

interface IUnionOption1 extends ISerializable {
    p1: string
}

interface IUnionOption2 extends ISerializable {
    p2: string
}

@type("UnionArrayOption1")
class UnionArrayOption1 extends Serializable implements IUnionOption1 {
    @serialize()
    public p1: string
}

@type("UnionArrayOption2")
class UnionArrayOption2 extends Serializable implements IUnionOption2 {
    @serialize()
    public p2: string
}

@type("InvalidUnionArrayOption")
class InvalidUnionArrayOption extends Serializable {
    @serialize()
    public p3: string

    public static from(value: any): InvalidUnionArrayOption {
        return super.fromT(value, InvalidUnionArrayOption)
    }
}

@type("ClassWithUnionArrayProperty")
class ClassWithUnionArrayProperty extends Serializable implements IClassWithUnionArrayProperty {
    @serialize({ unionTypes: [UnionArrayOption1, UnionArrayOption2] })
    @validate()
    public content: (UnionArrayOption1 | UnionArrayOption2)[]

    public static from(value: IClassWithUnionArrayProperty): ClassWithUnionArrayProperty {
        return super.fromT(value, ClassWithUnionArrayProperty)
    }
}
