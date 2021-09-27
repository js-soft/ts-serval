import { PrimitiveType, schema, SerializableAsync, serialize, validate } from "@js-soft/ts-serval"
import { expect } from "chai"
import { expectThrowsAsync } from "../../testUtil"

interface ITokenContentMultiAsync {
    value: string | number | boolean
}

@schema("https://schema.local.corp", "TokenContentMultiAsync")
class TokenContentMultiAsync extends SerializableAsync implements ITokenContentMultiAsync {
    public notToBeSerialized = "avalue"

    @validate({ allowedTypes: [PrimitiveType.String, PrimitiveType.Number, PrimitiveType.Boolean] })
    @serialize()
    public value: string | number | boolean

    public static async from(value: ITokenContentMultiAsync): Promise<TokenContentMultiAsync> {
        return await super.fromT(value, TokenContentMultiAsync)
    }
}

export class SerializeAsyncMultiTypeTest {
    public static init(): void {
        describe("SerializeMultiType", function () {
            it("should serialize the given property as string", async function () {
                const token: TokenContentMultiAsync = await TokenContentMultiAsync.from({ value: "string" })
                const object: any = token.toJSON()
                expect(object.value).be.a("string")
                expect(object.value).equals("string")

                const parsed: TokenContentMultiAsync = await TokenContentMultiAsync.from(object)
                expect(parsed).instanceOf(TokenContentMultiAsync)
                expect(object.value).be.a("string")
                expect(object.value).equals("string")
                const serialized2 = parsed.serialize()
                const parsed2: TokenContentMultiAsync = await TokenContentMultiAsync.deserializeT(
                    serialized2,
                    TokenContentMultiAsync
                )
                expect(parsed2).instanceOf(TokenContentMultiAsync)
                expect(object.value).be.a("string")
                expect(object.value).equals("string")
                const serialized3 = parsed2.serialize()
                const parsed3 = await SerializableAsync.deserializeUnknown(serialized3)
                expect(parsed3).instanceOf(TokenContentMultiAsync)
                expect(object.value).be.a("string")
                expect(object.value).equals("string")
                const serialized4 = parsed3.toJSON()
                const parsed4 = await SerializableAsync.fromUnknown(serialized4)
                expect(parsed4).instanceOf(TokenContentMultiAsync)
                expect(object.value).be.a("string")
                expect(object.value).equals("string")
            })

            it("should serialize the given property as string (empty)", async function () {
                const token: TokenContentMultiAsync = await TokenContentMultiAsync.from({ value: "" })
                const object: any = token.toJSON()
                expect(object.value).be.a("string")
                expect(object.value).equals("")

                const parsed: TokenContentMultiAsync = await TokenContentMultiAsync.from(object)
                expect(parsed).instanceOf(TokenContentMultiAsync)
                expect(object.value).be.a("string")
                expect(object.value).equals("")
                const serialized2 = parsed.serialize()
                const parsed2: TokenContentMultiAsync = await TokenContentMultiAsync.deserializeT(
                    serialized2,
                    TokenContentMultiAsync
                )!
                expect(parsed2).instanceOf(TokenContentMultiAsync)
                expect(object.value).be.a("string")
                expect(object.value).equals("")
                const serialized3 = parsed2.serialize()
                const parsed3 = await SerializableAsync.deserializeUnknown(serialized3)
                expect(parsed3).instanceOf(TokenContentMultiAsync)
                expect(object.value).be.a("string")
                expect(object.value).equals("")
                const serialized4 = parsed3.toJSON()
                const parsed4 = await SerializableAsync.fromUnknown(serialized4)
                expect(parsed4).instanceOf(TokenContentMultiAsync)
                expect(object.value).be.a("string")
                expect(object.value).equals("")
            })

            it("should serialize the given property as boolean (true)", async function () {
                const token: TokenContentMultiAsync = await TokenContentMultiAsync.from({ value: true })
                const object: any = token.toJSON()
                expect(object.value).be.a("boolean")
                expect(object.value).equals(true)

                const parsed: TokenContentMultiAsync = await TokenContentMultiAsync.from(object)
                expect(parsed).instanceOf(TokenContentMultiAsync)
                expect(object.value).be.a("boolean")
                expect(object.value).equals(true)
                const serialized2 = parsed.serialize()
                const parsed2: TokenContentMultiAsync = await TokenContentMultiAsync.deserializeT(
                    serialized2,
                    TokenContentMultiAsync
                )!
                expect(parsed2).instanceOf(TokenContentMultiAsync)
                expect(object.value).be.a("boolean")
                expect(object.value).equals(true)
                const serialized3 = parsed2.serialize()
                const parsed3 = await SerializableAsync.deserializeUnknown(serialized3)
                expect(parsed3).instanceOf(TokenContentMultiAsync)
                expect(object.value).be.a("boolean")
                expect(object.value).equals(true)
                const serialized4 = parsed3.toJSON()
                const parsed4 = await SerializableAsync.fromUnknown(serialized4)
                expect(parsed4).instanceOf(TokenContentMultiAsync)
                expect(object.value).be.a("boolean")
                expect(object.value).equals(true)
            })

            it("should serialize the given property as boolean (false)", async function () {
                const token: TokenContentMultiAsync = await TokenContentMultiAsync.from({ value: false })
                const object: any = token.toJSON()
                expect(object.value).be.a("boolean")
                expect(object.value).equals(false)

                const parsed: TokenContentMultiAsync = await TokenContentMultiAsync.from(object)
                expect(parsed).instanceOf(TokenContentMultiAsync)
                expect(object.value).be.a("boolean")
                expect(object.value).equals(false)
                const serialized2 = parsed.serialize()
                const parsed2: TokenContentMultiAsync = await TokenContentMultiAsync.deserializeT(
                    serialized2,
                    TokenContentMultiAsync
                )!
                expect(parsed2).instanceOf(TokenContentMultiAsync)
                expect(object.value).be.a("boolean")
                expect(object.value).equals(false)
                const serialized3 = parsed2.serialize()
                const parsed3 = await SerializableAsync.deserializeUnknown(serialized3)
                expect(parsed3).instanceOf(TokenContentMultiAsync)
                expect(object.value).be.a("boolean")
                expect(object.value).equals(false)
                const serialized4 = parsed3.toJSON()
                const parsed4 = await SerializableAsync.fromUnknown(serialized4)
                expect(parsed4).instanceOf(TokenContentMultiAsync)
                expect(object.value).be.a("boolean")
                expect(object.value).equals(false)
            })

            it("should serialize the given property as number", async function () {
                const token: TokenContentMultiAsync = await TokenContentMultiAsync.from({ value: 55.5 })
                const object: any = token.toJSON()
                expect(object.value).be.a("number")
                expect(object.value).equals(55.5)

                const parsed: TokenContentMultiAsync = await TokenContentMultiAsync.from(object)
                expect(parsed).instanceOf(TokenContentMultiAsync)
                expect(object.value).be.a("number")
                expect(object.value).equals(55.5)
                const serialized2 = parsed.serialize()
                const parsed2: TokenContentMultiAsync = await TokenContentMultiAsync.deserializeT(
                    serialized2,
                    TokenContentMultiAsync
                )!
                expect(parsed2).instanceOf(TokenContentMultiAsync)
                expect(object.value).be.a("number")
                expect(object.value).equals(55.5)
                const serialized3 = parsed2.serialize()
                const parsed3 = await SerializableAsync.deserializeUnknown(serialized3)
                expect(parsed3).instanceOf(TokenContentMultiAsync)
                expect(object.value).be.a("number")
                expect(object.value).equals(55.5)
                const serialized4 = parsed3.toJSON()
                const parsed4 = await SerializableAsync.fromUnknown(serialized4)
                expect(parsed4).instanceOf(TokenContentMultiAsync)
                expect(object.value).be.a("number")
                expect(object.value).equals(55.5)
            })

            it("should serialize the given property as number (zero)", async function () {
                const token: TokenContentMultiAsync = await TokenContentMultiAsync.from({ value: 0 })
                const object: any = token.toJSON()
                expect(object.value).be.a("number")
                expect(object.value).equals(0)

                const parsed: TokenContentMultiAsync = await TokenContentMultiAsync.from(object)
                expect(parsed).instanceOf(TokenContentMultiAsync)
                expect(object.value).be.a("number")
                expect(object.value).equals(0)
                const serialized2 = parsed.serialize()
                const parsed2: TokenContentMultiAsync = await TokenContentMultiAsync.deserializeT(
                    serialized2,
                    TokenContentMultiAsync
                )!
                expect(parsed2).instanceOf(TokenContentMultiAsync)
                expect(object.value).be.a("number")
                expect(object.value).equals(0)
                const serialized3 = parsed2.serialize()
                const parsed3 = await SerializableAsync.deserializeUnknown(serialized3)
                expect(parsed3).instanceOf(TokenContentMultiAsync)
                expect(object.value).be.a("number")
                expect(object.value).equals(0)
                const serialized4 = parsed3.toJSON()
                const parsed4 = await SerializableAsync.fromUnknown(serialized4)
                expect(parsed4).instanceOf(TokenContentMultiAsync)
                expect(object.value).be.a("number")
                expect(object.value).equals(0)
            })

            it("should not deserialize property with invalid type", async function () {
                const value: any = { value: ["a", "b"] }
                await expectThrowsAsync(
                    async () => await TokenContentMultiAsync.from(value),
                    "TokenContentMultiAsync.value"
                )
            })
        })
    }
}
