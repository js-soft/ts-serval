import { schema, Serializable, serialize } from "@js-soft/ts-serval"
import { expect } from "chai"
import { Attribute } from "../../data/consumption/Attribute"

@schema("https://schema.local.corp", "TokenSerializableEnforceString")
class TokenSerializableEnforceString extends Serializable {
    public notToBeSerialized = "avalue"

    @serialize({ enforceString: true })
    public content: Attribute

    public static from(value: Object): TokenSerializableEnforceString {
        return this.fromAny(value)
    }
}

export class SerializeEnforceStringPropertyTest {
    public static init(): void {
        describe("SerializeEnforceStringProperty", function () {
            let token: TokenSerializableEnforceString

            it("should create from object", function () {
                const attribute = Attribute.from({ name: "firstname", value: "test" })
                token = TokenSerializableEnforceString.from({ content: attribute })
                expect(token).instanceOf(TokenSerializableEnforceString)
                expect(token.content).instanceOf(Attribute)
                expect(token.content.name).equals("firstname")
                expect(token.content.value).is.a("string")
                expect(token.content.value).equals("test")
            })

            it("should serialize as JSON", function () {
                const tokenAsJSON = token.toJSON() as any

                expect(tokenAsJSON).to.be.a("object")
                expect(tokenAsJSON).not.to.be.instanceOf(TokenSerializableEnforceString)
                expect(tokenAsJSON).to.exist
                expect(tokenAsJSON.content).to.be.a("string")
                expect(tokenAsJSON.content).to.equal('{"name":"firstname","value":"test"}')
            })

            it("should deserialize from object (as string)", function () {
                token = TokenSerializableEnforceString.from(token.toJSON())
                expect(token).instanceOf(TokenSerializableEnforceString)
                expect(token.content).instanceOf(Attribute)
                expect(token.content.name).equals("firstname")
                expect(token.content.value).is.a("string")
                expect(token.content.value).equals("test")
            })

            it("should serialize as string", function () {
                const serializedToken = token.serialize()

                expect(serializedToken).to.be.a("string")
                expect(serializedToken).to.equal(
                    '{"@context":"https://schema.local.corp","@type":"TokenSerializableEnforceString","content":"{\\"name\\":\\"firstname\\",\\"value\\":\\"test\\"}"}'
                )
            })

            it("should deserialize from string", function () {
                const tokenAfterDeserialize = TokenSerializableEnforceString.deserialize(token.serialize())

                expect(tokenAfterDeserialize).instanceOf(TokenSerializableEnforceString)
                expect(tokenAfterDeserialize.content).instanceOf(Attribute)
                expect(tokenAfterDeserialize.content.name).equals("firstname")
                expect(tokenAfterDeserialize.content.value).is.a("string")
                expect(tokenAfterDeserialize.content.value).equals("test")
            })
        })
    }
}
