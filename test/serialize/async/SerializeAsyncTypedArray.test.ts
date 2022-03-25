import { schema, SerializableAsync, serialize } from "@js-soft/ts-serval"
import { expect } from "chai"
import { expectThrowsAsync } from "../../testUtil"

@schema("https://schema.local.corp", "TokenTypedArrayStringAsync")
class TokenTypedArrayStringAsync extends SerializableAsync {
    public notToBeSerialized = "avalue"

    @serialize({ type: String })
    public content: string[]

    public static async from(value: Object): Promise<TokenTypedArrayStringAsync> {
        return await super.fromT(value)
    }
}

@schema("https://schema.local.corp", "TokenTypedArrayNumberAsync")
class TokenTypedArrayNumberAsync extends SerializableAsync {
    public notToBeSerialized = "avalue"

    @serialize({ type: Number })
    public content: number[]

    public static async from(value: Object): Promise<TokenTypedArrayNumberAsync> {
        return await super.fromT(value)
    }
}

@schema("https://schema.local.corp", "TokenTypedArrayBooleanAsync")
class TokenTypedArrayBooleanAsync extends SerializableAsync {
    public notToBeSerialized = "avalue"

    @serialize({ type: Boolean })
    public content: boolean[]

    public static async from(value: Object): Promise<TokenTypedArrayBooleanAsync> {
        return await super.fromT(value)
    }
}

export class SerializeAsyncTypedArrayTest {
    public static init(): void {
        describe("SerializeAsyncTypedArray", function () {
            describe("TokenTypedArrayStringAsync", function () {
                let token: TokenTypedArrayStringAsync
                it("should deserialize string arrays", async function () {
                    token = await TokenTypedArrayStringAsync.from({ content: ["Test1", "Test2", ""] })
                    expect(token).to.be.instanceOf(TokenTypedArrayStringAsync)
                    expect(token.content).to.be.an("array")
                    expect(token.content[0]).equals("Test1")
                    expect(token.content[1]).equals("Test2")
                    expect(token.content[2]).equals("")
                })

                it("should serialize arbitrary content", function () {
                    const object: any = token.toJSON()
                    expect(object).to.exist
                    expect(object).not.to.be.instanceOf(TokenTypedArrayStringAsync)
                    expect(object.content).to.be.an("array")
                    expect(object.content[0]).equals("Test1")
                    expect(object.content[1]).equals("Test2")
                    expect(object.content[2]).equals("")
                })

                it("should not deserialize non-string arrays", async function () {
                    await expectThrowsAsync(
                        async () => await TokenTypedArrayStringAsync.from({ content: [true, "Test2", "Test3"] })
                    )

                    await expectThrowsAsync(
                        async () => await TokenTypedArrayStringAsync.from({ content: [null, "Test2", "Test3"] })
                    )
                })
            })

            describe("TokenTypedArrayNumberAsync", function () {
                let token: TokenTypedArrayNumberAsync
                it("should deserialize number arrays", async function () {
                    token = await TokenTypedArrayNumberAsync.from({ content: [5, -1.5, 0] })
                    expect(token).to.be.instanceOf(TokenTypedArrayNumberAsync)
                    expect(token.content).to.be.an("array")
                    expect(token.content[0]).equals(5)
                    expect(token.content[1]).equals(-1.5)
                    expect(token.content[2]).equals(0)
                })

                it("should serialize arbitrary content", function () {
                    const object: any = token.toJSON()
                    expect(object).to.exist
                    expect(object).not.to.be.instanceOf(TokenTypedArrayNumberAsync)
                    expect(object.content).to.be.an("array")
                    expect(object.content[0]).equals(5)
                    expect(object.content[1]).equals(-1.5)
                    expect(object.content[2]).equals(0)
                })

                it("should not deserialize non-number arrays", async function () {
                    await expectThrowsAsync(
                        async () => await TokenTypedArrayNumberAsync.from({ content: [true, -1.5, "Test3"] })
                    )

                    await expectThrowsAsync(
                        async () => await TokenTypedArrayNumberAsync.from({ content: [null, -1.5, "Test3"] })
                    )
                })
            })

            describe("TokenTypedArrayBooleanAsync", function () {
                let token: TokenTypedArrayBooleanAsync
                it("should deserialize boolean arrays", async function () {
                    token = await TokenTypedArrayBooleanAsync.from({ content: [true, false, true] })
                    expect(token).to.be.instanceOf(TokenTypedArrayBooleanAsync)
                    expect(token.content).to.be.an("array")
                    expect(token.content[0]).equals(true)
                    expect(token.content[1]).equals(false)
                    expect(token.content[2]).equals(true)
                })

                it("should serialize arbitrary content", function () {
                    const object: any = token.toJSON()
                    expect(object).to.exist
                    expect(object).not.to.be.instanceOf(TokenTypedArrayBooleanAsync)
                    expect(object.content).to.be.an("array")
                    expect(object.content[0]).equals(true)
                    expect(object.content[1]).equals(false)
                    expect(object.content[2]).equals(true)
                })

                it("should not deserialize non-boolean arrays", async function () {
                    await expectThrowsAsync(
                        async () => await TokenTypedArrayBooleanAsync.from({ content: [0, false, true] })
                    )

                    await expectThrowsAsync(
                        async () => await TokenTypedArrayBooleanAsync.from({ content: [null, false, true] })
                    )
                })
            })
        })
    }
}
