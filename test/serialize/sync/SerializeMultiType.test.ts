import { PrimitiveType, schema, Serializable, serialize, validate } from "@js-soft/ts-serval"
import { expect } from "chai"
import { expectThrows } from "../../testUtil"

interface ITokenContentMulti {
    value: string | number | boolean
}

@schema("https://schema.local.corp", "TokenContentMulti")
class TokenContentMulti extends Serializable implements ITokenContentMulti {
    public notToBeSerialized = "avalue"

    @validate({ allowedTypes: [PrimitiveType.String, PrimitiveType.Number, PrimitiveType.Boolean] })
    @serialize()
    public value: string | number | boolean

    public static from(value: ITokenContentMulti): TokenContentMulti {
        return super.fromT(value, TokenContentMulti)
    }
}

export class SerializeMultiTypeTest {
    public static init(): void {
        describe("SerializeMultiType", function () {
            it("should serialize the given property as string", function () {
                const token: TokenContentMulti = TokenContentMulti.from({ value: "string" })
                const object: any = token.toJSON()
                expect(object.value).be.a("string")
                expect(object.value).equals("string")

                const parsed: TokenContentMulti = TokenContentMulti.from(object)
                expect(parsed).instanceOf(TokenContentMulti)
                expect(object.value).be.a("string")
                expect(object.value).equals("string")
                const serialized2 = parsed.serialize()
                const parsed2: TokenContentMulti = TokenContentMulti.deserializeT(serialized2, TokenContentMulti)
                expect(parsed2).instanceOf(TokenContentMulti)
                expect(object.value).be.a("string")
                expect(object.value).equals("string")
                const serialized3 = parsed2.serialize()
                const parsed3 = Serializable.deserializeUnknown(serialized3)
                expect(parsed3).instanceOf(TokenContentMulti)
                expect(object.value).be.a("string")
                expect(object.value).equals("string")
                const serialized4 = parsed3.toJSON()
                const parsed4 = Serializable.fromUnknown(serialized4)
                expect(parsed4).instanceOf(TokenContentMulti)
                expect(object.value).be.a("string")
                expect(object.value).equals("string")
            })

            it("should serialize the given property as string (empty)", function () {
                const token: TokenContentMulti = TokenContentMulti.from({ value: "" })
                const object: any = token.toJSON()
                expect(object.value).be.a("string")
                expect(object.value).equals("")

                const parsed: TokenContentMulti = TokenContentMulti.from(object)
                expect(parsed).instanceOf(TokenContentMulti)
                expect(object.value).be.a("string")
                expect(object.value).equals("")
                const serialized2 = parsed.serialize()
                const parsed2: TokenContentMulti = TokenContentMulti.deserializeT(serialized2, TokenContentMulti)
                expect(parsed2).instanceOf(TokenContentMulti)
                expect(object.value).be.a("string")
                expect(object.value).equals("")
                const serialized3 = parsed2.serialize()
                const parsed3 = Serializable.deserializeUnknown(serialized3)
                expect(parsed3).instanceOf(TokenContentMulti)
                expect(object.value).be.a("string")
                expect(object.value).equals("")
                const serialized4 = parsed3.toJSON()
                const parsed4 = Serializable.fromUnknown(serialized4)
                expect(parsed4).instanceOf(TokenContentMulti)
                expect(object.value).be.a("string")
                expect(object.value).equals("")
            })

            it("should serialize the given property as boolean (true)", function () {
                const token: TokenContentMulti = TokenContentMulti.from({ value: true })
                const object: any = token.toJSON()
                expect(object.value).be.a("boolean")
                expect(object.value).equals(true)

                const parsed: TokenContentMulti = TokenContentMulti.from(object)
                expect(parsed).instanceOf(TokenContentMulti)
                expect(object.value).be.a("boolean")
                expect(object.value).equals(true)
                const serialized2 = parsed.serialize()
                const parsed2: TokenContentMulti = TokenContentMulti.deserializeT(serialized2, TokenContentMulti)
                expect(parsed2).instanceOf(TokenContentMulti)
                expect(object.value).be.a("boolean")
                expect(object.value).equals(true)
                const serialized3 = parsed2.serialize()
                const parsed3 = Serializable.deserializeUnknown(serialized3)
                expect(parsed3).instanceOf(TokenContentMulti)
                expect(object.value).be.a("boolean")
                expect(object.value).equals(true)
                const serialized4 = parsed3.toJSON()
                const parsed4 = Serializable.fromUnknown(serialized4)
                expect(parsed4).instanceOf(TokenContentMulti)
                expect(object.value).be.a("boolean")
                expect(object.value).equals(true)
            })

            it("should serialize the given property as boolean (false)", function () {
                const token: TokenContentMulti = TokenContentMulti.from({ value: false })
                const object: any = token.toJSON()
                expect(object.value).be.a("boolean")
                expect(object.value).equals(false)

                const parsed: TokenContentMulti = TokenContentMulti.from(object)
                expect(parsed).instanceOf(TokenContentMulti)
                expect(object.value).be.a("boolean")
                expect(object.value).equals(false)
                const serialized2 = parsed.serialize()
                const parsed2: TokenContentMulti = TokenContentMulti.deserializeT(serialized2, TokenContentMulti)
                expect(parsed2).instanceOf(TokenContentMulti)
                expect(object.value).be.a("boolean")
                expect(object.value).equals(false)
                const serialized3 = parsed2.serialize()
                const parsed3 = Serializable.deserializeUnknown(serialized3)
                expect(parsed3).instanceOf(TokenContentMulti)
                expect(object.value).be.a("boolean")
                expect(object.value).equals(false)
                const serialized4 = parsed3.toJSON()
                const parsed4 = Serializable.fromUnknown(serialized4)
                expect(parsed4).instanceOf(TokenContentMulti)
                expect(object.value).be.a("boolean")
                expect(object.value).equals(false)
            })

            it("should serialize the given property as number", function () {
                const token: TokenContentMulti = TokenContentMulti.from({ value: 55.5 })
                const object: any = token.toJSON()
                expect(object.value).be.a("number")
                expect(object.value).equals(55.5)

                const parsed: TokenContentMulti = TokenContentMulti.from(object)
                expect(parsed).instanceOf(TokenContentMulti)
                expect(object.value).be.a("number")
                expect(object.value).equals(55.5)
                const serialized2 = parsed.serialize()
                const parsed2: TokenContentMulti = TokenContentMulti.deserializeT(serialized2, TokenContentMulti)
                expect(parsed2).instanceOf(TokenContentMulti)
                expect(object.value).be.a("number")
                expect(object.value).equals(55.5)
                const serialized3 = parsed2.serialize()
                const parsed3 = Serializable.deserializeUnknown(serialized3)
                expect(parsed3).instanceOf(TokenContentMulti)
                expect(object.value).be.a("number")
                expect(object.value).equals(55.5)
                const serialized4 = parsed3.toJSON()
                const parsed4 = Serializable.fromUnknown(serialized4)
                expect(parsed4).instanceOf(TokenContentMulti)
                expect(object.value).be.a("number")
                expect(object.value).equals(55.5)
            })

            it("should serialize the given property as number (zero)", function () {
                const token: TokenContentMulti = TokenContentMulti.from({ value: 0 })
                const object: any = token.toJSON()
                expect(object.value).be.a("number")
                expect(object.value).equals(0)

                const parsed: TokenContentMulti = TokenContentMulti.from(object)
                expect(parsed).instanceOf(TokenContentMulti)
                expect(object.value).be.a("number")
                expect(object.value).equals(0)
                const serialized2 = parsed.serialize()
                const parsed2: TokenContentMulti = TokenContentMulti.deserializeT(serialized2, TokenContentMulti)
                expect(parsed2).instanceOf(TokenContentMulti)
                expect(object.value).be.a("number")
                expect(object.value).equals(0)
                const serialized3 = parsed2.serialize()
                const parsed3 = Serializable.deserializeUnknown(serialized3)
                expect(parsed3).instanceOf(TokenContentMulti)
                expect(object.value).be.a("number")
                expect(object.value).equals(0)
                const serialized4 = parsed3.toJSON()
                const parsed4 = Serializable.fromUnknown(serialized4)
                expect(parsed4).instanceOf(TokenContentMulti)
                expect(object.value).be.a("number")
                expect(object.value).equals(0)
            })

            it("should not parse properties with wrong type", function () {
                const value: any = { value: ["a", "b"] }
                expectThrows(() => TokenContentMulti.from(value), "TokenContentMulti.value")
            })
        })
    }
}
