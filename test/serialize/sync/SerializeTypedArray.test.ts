import { schema, Serializable, serialize } from "@js-soft/ts-serval"
import { expect } from "chai"
import { expectThrows } from "../../testUtil"

@schema("https://schema.local.corp", "TokenTypedArrayString")
class TokenTypedArrayString extends Serializable {
    public notToBeSerialized = "avalue"

    @serialize({ type: String })
    public content: string[]

    public static from(value: Object): TokenTypedArrayString {
        return super.fromT(value)
    }
}

@schema("https://schema.local.corp", "TokenTypedArrayNumber")
class TokenTypedArrayNumber extends Serializable {
    public notToBeSerialized = "avalue"

    @serialize({ type: Number })
    public content: number[]

    public static from(value: Object): TokenTypedArrayNumber {
        return super.fromT(value)
    }
}

@schema("https://schema.local.corp", "TokenTypedArrayBoolean")
class TokenTypedArrayBoolean extends Serializable {
    public notToBeSerialized = "avalue"

    @serialize({ type: Boolean })
    public content: boolean[]

    public static from(value: Object): TokenTypedArrayBoolean {
        return super.fromT(value)
    }
}

export class SerializeTypedArrayTest {
    public static init(): void {
        describe("SerializeTypedArray", function () {
            describe("TokenTypedArrayString", function () {
                let token: TokenTypedArrayString
                it("should deserialize string arrays", function () {
                    token = TokenTypedArrayString.from({ content: ["Test1", "Test2", ""] })
                    expect(token).to.be.instanceOf(TokenTypedArrayString)
                    expect(token.content).to.be.an("array")
                    expect(token.content[0]).equals("Test1")
                    expect(token.content[1]).equals("Test2")
                    expect(token.content[2]).equals("")
                })

                it("should serialize arbitrary content", function () {
                    const object: any = token.toJSON()
                    expect(object).to.exist
                    expect(object).not.to.be.instanceOf(TokenTypedArrayString)
                    expect(object.content).to.be.an("array")
                    expect(object.content[0]).equals("Test1")
                    expect(object.content[1]).equals("Test2")
                    expect(object.content[2]).equals("")
                })

                it("should not deserialize non-string arrays", function () {
                    expectThrows(() => {
                        token = TokenTypedArrayString.from({ content: [true, "Test2", "Test3"] })
                    })

                    expectThrows(() => {
                        token = TokenTypedArrayString.from({ content: [null, "Test2", "Test3"] })
                    })
                })
            })

            describe("TokenTypedArrayNumber", function () {
                let token: TokenTypedArrayNumber
                it("should deserialize number arrays", function () {
                    token = TokenTypedArrayNumber.from({ content: [5, -1.5, 0] })
                    expect(token).to.be.instanceOf(TokenTypedArrayNumber)
                    expect(token.content).to.be.an("array")
                    expect(token.content[0]).equals(5)
                    expect(token.content[1]).equals(-1.5)
                    expect(token.content[2]).equals(0)
                })

                it("should serialize arbitrary content", function () {
                    const object: any = token.toJSON()
                    expect(object).to.exist
                    expect(object).not.to.be.instanceOf(TokenTypedArrayNumber)
                    expect(object.content).to.be.an("array")
                    expect(object.content[0]).equals(5)
                    expect(object.content[1]).equals(-1.5)
                    expect(object.content[2]).equals(0)
                })

                it("should not deserialize non-number arrays", function () {
                    expectThrows(() => {
                        token = TokenTypedArrayNumber.from({ content: [true, -1.5, "Test3"] })
                    })

                    expectThrows(() => {
                        token = TokenTypedArrayNumber.from({ content: [null, -1.5, "Test3"] })
                    })
                })
            })

            describe("TokenTypedArrayBoolean", function () {
                let token: TokenTypedArrayBoolean
                it("should deserialize boolean arrays", function () {
                    token = TokenTypedArrayBoolean.from({ content: [true, false, true] })
                    expect(token).to.be.instanceOf(TokenTypedArrayBoolean)
                    expect(token.content).to.be.an("array")
                    expect(token.content[0]).equals(true)
                    expect(token.content[1]).equals(false)
                    expect(token.content[2]).equals(true)
                })

                it("should serialize arbitrary content", function () {
                    const object: any = token.toJSON()
                    expect(object).to.exist
                    expect(object).not.to.be.instanceOf(TokenTypedArrayBoolean)
                    expect(object.content).to.be.an("array")
                    expect(object.content[0]).equals(true)
                    expect(object.content[1]).equals(false)
                    expect(object.content[2]).equals(true)
                })

                it("should not deserialize non-boolean arrays", function () {
                    expectThrows(() => {
                        token = TokenTypedArrayBoolean.from({ content: [0, false, true] })
                    })
                    expectThrows(() => {
                        token = TokenTypedArrayBoolean.from({ content: [null, false, true] })
                    })
                })
            })
        })
    }
}
