import { schema, Serializable, serialize } from "@js-soft/ts-serval"
import { expect } from "chai"

@schema("https://schema.local.corp", "TokenSerializableContentAny")
class TokenSerializableContentAny extends Serializable {
    public notToBeSerialized = "avalue"

    @serialize({ any: true })
    public content: any

    public static from(value: Object): TokenSerializableContentAny {
        return super.from(value, TokenSerializableContentAny) as TokenSerializableContentAny
    }
}

export class SerializeAnyPropertyTest {
    public static init(): void {
        describe("SerializeAnyProperty", function () {
            describe("TokenSerializableContentAny", function () {
                it("should deserialize arbitrary content", function () {
                    const token: any = TokenSerializableContentAny.from({ content: { someProperty: "someValue" } })
                    expect(token).instanceOf(TokenSerializableContentAny)
                    expect(token.content, "Content doesnt exist").to.exist
                    expect(token.content.someProperty, "Property doesnt exist").to.exist
                    expect(token.content.someProperty).to.equal("someValue", "Property doesnt equal string")
                })

                it("should serialize arbitrary content", function () {
                    const token: any = TokenSerializableContentAny.from({ content: { someProperty: "someValue" } })
                    const object: any = token.toJSON()
                    expect(object).to.exist
                    expect(object.content, "Content doesnt exist").to.exist
                    expect(object.content.someProperty, "Property doesnt exist").to.exist
                    expect(object.content.someProperty).to.equal("someValue", "Property doesnt equal string")
                })
            })
        })
    }
}
