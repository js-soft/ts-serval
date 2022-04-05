import { ISerializable, Serializable, serialize, type, validate } from "@js-soft/ts-serval"
import { expect } from "chai"
import { expectThrows } from "../../testUtil"

export class SerializeUnionTypesTest {
    public static init(): void {
        describe("Unions", function () {
            it("can parse first option (from JSON)", function () {
                const json = {
                    "@type": "ClassWithUnionProperty",
                    content: {
                        "@type": "UnionOption1",
                        p1: "val"
                    }
                }
                const obj = ClassWithUnionProperty.from(json)
                expect(obj.content).to.be.instanceOf(UnionOption1)
            })

            it("can parse second option (from JSON)", function () {
                const json = {
                    "@type": "ClassWithUnionProperty",
                    content: {
                        "@type": "UnionOption2",
                        p2: "val"
                    }
                }
                const obj = ClassWithUnionProperty.from(json)
                expect(obj).to.be.instanceOf(ClassWithUnionProperty)
                expect(obj.content).to.be.instanceOf(UnionOption2)
            })

            it("throws if invalid options are given (from JSON)", function () {
                const json = {
                    "@type": "ClassWithUnionProperty",
                    content: {
                        "@type": "InvalidUnionOption",
                        p3: "val"
                    } as any
                }
                expectThrows(() => {
                    const obj = ClassWithUnionProperty.from(json)
                    expect(obj.content).to.be.instanceOf(InvalidUnionOption)
                }, "ClassWithUnionProperty.content :: Parsed object is not an instance of any allowed types \\(UnionOption1\\|UnionOption2\\)")
            })

            it("can parse first option (from Serializable object)", function () {
                const json = {
                    "@type": "ClassWithUnionProperty",
                    content: UnionOption1.from({ p1: "val" })
                }

                const obj = ClassWithUnionProperty.from(json)

                expect(obj.content).to.be.instanceOf(UnionOption1)
            })

            it("can parse second option (from Serializable object)", function () {
                const json = {
                    "@type": "ClassWithUnionProperty",
                    content: UnionOption2.from({ p2: "val" })
                }

                const obj = ClassWithUnionProperty.from(json)

                expect(obj.content).to.be.instanceOf(UnionOption2)
            })

            it("throws if invalid options are given (from Serializable object)", function () {
                const json = {
                    "@type": "AsyncClassWithUnionProperty",
                    content: InvalidUnionOption.fromAny({
                        "@type": "InvalidUnionOption",
                        p3: "val"
                    }) as any
                }

                expectThrows(() => {
                    const obj = ClassWithUnionProperty.from(json)
                    expect(obj).to.be.instanceOf(ClassWithUnionProperty)
                    expect(obj.content).to.be.instanceOf(InvalidUnionOption)
                }, "ClassWithUnionProperty.content :: Parsed object is not an instance of any allowed types \\(UnionOption1\\|UnionOption2\\)")
            })
        })
    }
}

interface IClassWithUnionProperty extends ISerializable {
    content: IUnionOption1 | IUnionOption2
}

interface IUnionOption1 extends ISerializable {
    p1: string
}

interface IUnionOption2 extends ISerializable {
    p2: string
}

@type("UnionOption1")
class UnionOption1 extends Serializable implements IUnionOption1 {
    @serialize()
    public p1: string

    public static from(value: IUnionOption1): UnionOption1 {
        return this.fromAny(value)
    }
}

@type("UnionOption2")
class UnionOption2 extends Serializable implements IUnionOption2 {
    @serialize()
    public p2: string

    public static from(value: IUnionOption2): UnionOption2 {
        return this.fromAny(value)
    }
}

@type("InvalidUnionOption")
class InvalidUnionOption extends Serializable {
    @serialize()
    public p3: string
}

@type("ClassWithUnionProperty")
class ClassWithUnionProperty extends Serializable implements IClassWithUnionProperty {
    @serialize({ unionTypes: [UnionOption1, UnionOption2] })
    @validate()
    public content: UnionOption1 | UnionOption2

    public static from(value: IClassWithUnionProperty): ClassWithUnionProperty {
        return this.fromAny(value)
    }
}
