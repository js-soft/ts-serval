import { schema, SerializableAsync, serialize } from "@js-soft/ts-serval"
import { expect } from "chai"
import { Attribute } from "../../data/consumption/Attribute"

@schema("https://schema.local.corp", "TokenSerializableAsyncEnforceString")
class TokenSerializableAsyncEnforceString extends SerializableAsync {
    public notToBeSerialized = "avalue"

    @serialize({ enforceString: true })
    public content: Attribute
}

export class SerializeAsyncEnforceStringPropertyTest {
    public static init(): void {
        describe("SerializeAsyncEnforceStringProperty", function () {
            let token: TokenSerializableAsyncEnforceString
            it("should create from object", async function () {
                const attribute = Attribute.from({ name: "firstname", value: "test" })
                const serialized = attribute.serialize()
                token = await TokenSerializableAsyncEnforceString.fromAny({ content: serialized })
                expect(token).instanceOf(TokenSerializableAsyncEnforceString)
                expect(token.content).instanceOf(Attribute)
                expect(token.content.name).equals("firstname")
                expect(token.content.value).is.a("string")
                expect(token.content.value).equals("test")
            })

            it("should serialize as JSON", function () {
                const tokenAsJSON = token.toJSON() as any

                expect(tokenAsJSON).to.be.a("object")
                expect(tokenAsJSON).not.to.be.instanceOf(TokenSerializableAsyncEnforceString)
                expect(tokenAsJSON).to.exist
                expect(tokenAsJSON.content).to.be.a("string")
                expect(tokenAsJSON.content).to.equal('{"name":"firstname","value":"test"}')
            })

            it("should deserialize from object (as string)", async function () {
                token = await TokenSerializableAsyncEnforceString.fromAny(token.toJSON())
                expect(token).instanceOf(TokenSerializableAsyncEnforceString)
                expect(token.content).instanceOf(Attribute)
                expect(token.content.name).equals("firstname")
                expect(token.content.value).is.a("string")
                expect(token.content.value).equals("test")
            })

            it("should serialize as string", function () {
                const serialized = token.serialize()

                expect(serialized).to.be.a("string")
                expect(serialized).to.equal(
                    '{"@context":"https://schema.local.corp","@type":"TokenSerializableAsyncEnforceString","content":"{\\"name\\":\\"firstname\\",\\"value\\":\\"test\\"}"}'
                )
            })

            it("should deserialize from string", async function () {
                const deserializedToken = await TokenSerializableAsyncEnforceString.deserialize(token.serialize())
                expect(deserializedToken).instanceOf(TokenSerializableAsyncEnforceString)
                expect(deserializedToken.content).instanceOf(Attribute)
                expect(deserializedToken.content.name).equals("firstname")
                expect(deserializedToken.content.value).is.a("string")
                expect(deserializedToken.content.value).equals("test")
            })
        })
    }
}
