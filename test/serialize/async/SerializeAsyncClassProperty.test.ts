import { schema, Serializable, SerializableAsync, serialize } from "@js-soft/ts-serval"
import { expect } from "chai"
import { Attribute } from "../../data/consumption/Attribute"
import { BetterAttribute } from "../../data/consumption/BetterAttribute"
import { CoreSerializable } from "../../data/core/CoreSerializable"
import { CoreId } from "../../data/core/types/CoreId"
import { expectThrowsAsync } from "../../testUtil"

@schema("https://schema.local.corp", "TokenSerializeAttributeAsync")
class TokenSerializeAttributeAsync extends SerializableAsync {
    public notToBeSerialized = "avalue"

    @serialize()
    public content: Attribute
}

export class SerializeAsyncClassPropertyTest {
    public static init(): void {
        describe("SerializeAsyncClassProperty", function () {
            let attr: any
            let token: any
            let object: any

            it("should parse correct arbitrary content", async function () {
                token = await TokenSerializeAttributeAsync.fromAny({
                    content: { name: "firstname", value: "aFirstname" }
                })
                expect(token).instanceOf(SerializableAsync)
                expect(token).instanceOf(TokenSerializeAttributeAsync)
                expect(token.content).instanceOf(Serializable)
                expect(token.content).instanceOf(CoreSerializable)
                expect(token.content).instanceOf(Attribute)
                expect(token.content.name).equals("firstname")
                expect(token.content.value).equals("aFirstname")
            })

            it("should serialize the arbitrary content (verbose)", function () {
                object = token.toJSON()
                expect(object).is.a("object")
                expect(object).not.instanceOf(SerializableAsync)
                expect(object).not.instanceOf(TokenSerializeAttributeAsync)
                expect(object["@type"]).to.exist
                expect(object["@type"]).equals("TokenSerializeAttributeAsync")
                expect(object["@context"]).to.exist
                expect(object.content).to.exist
                expect(object.content.name).equals("firstname")
                expect(object.content.value).equals("aFirstname")
                expect(object.content["@type"]).to.not.exist
                expect(object.content["@context"]).to.not.exist
            })

            it("should serialize the arbitrary content (non-verbose)", function () {
                object = token.toJSON(false)
                expect(object).is.a("object")
                expect(object).not.instanceOf(SerializableAsync)
                expect(object).not.instanceOf(TokenSerializeAttributeAsync)
                expect(object["@type"]).to.not.exist
                expect(object["@context"]).to.not.exist
                expect(object.content).to.exist
                expect(object.content.name).equals("firstname")
                expect(object.content.value).equals("aFirstname")
                expect(object.content["@type"]).to.not.exist
                expect(object.content["@context"]).to.not.exist
            })

            it("should parse correct instantiated content", async function () {
                attr = Attribute.from({ name: "firstname", value: "aFirstname" })
                token = await TokenSerializeAttributeAsync.fromAny({ content: attr })
                expect(token).to.exist
                expect(token).instanceOf(SerializableAsync)
                expect(token).instanceOf(TokenSerializeAttributeAsync)
                expect(token.content).instanceOf(Serializable)
                expect(token.content).instanceOf(CoreSerializable)
                expect(token.content).instanceOf(Attribute)
                expect(token.content.name).equals("firstname")
                expect(token.content.value).equals("aFirstname")
            })

            it("should serialize the instantiated content", function () {
                object = token.toJSON()
                expect(object).is.a("object")
                expect(object).not.instanceOf(SerializableAsync)
                expect(object).not.instanceOf(TokenSerializeAttributeAsync)
                expect(object["@type"]).to.exist
                expect(object["@type"]).equals("TokenSerializeAttributeAsync")
                expect(object["@context"]).to.exist
                expect(object.content).to.exist
                expect(object.content.name).equals("firstname")
                expect(object.content.value).equals("aFirstname")
                expect(object.content["@type"]).to.not.exist
                expect(object.content["@context"]).to.not.exist
            })

            it("should parse correct instantiated content (subclass)", async function () {
                attr = BetterAttribute.from({ name: "firstname", value: "aFirstname" })
                token = await TokenSerializeAttributeAsync.fromAny({ content: attr })
                expect(token).to.exist
                expect(token).instanceOf(SerializableAsync)
                expect(token).instanceOf(TokenSerializeAttributeAsync)
                expect(token.content).instanceOf(Serializable)
                expect(token.content).instanceOf(CoreSerializable)
                expect(token.content).instanceOf(Attribute)
                expect(token.content).instanceOf(BetterAttribute)
                expect(token.content.name).equals("firstname")
                expect(token.content.value).equals("aFirstname")
            })

            it("should serialize the subclasses content (verbose)", function () {
                object = token.toJSON()
                expect(object).is.a("object")
                expect(object).not.instanceOf(SerializableAsync)
                expect(object).not.instanceOf(TokenSerializeAttributeAsync)
                expect(object["@type"]).to.exist
                expect(object["@type"]).equals("TokenSerializeAttributeAsync")
                expect(object["@context"]).to.exist
                expect(object.content).to.exist
                expect(object.content.name).equals("firstname")
                expect(object.content.value).equals("aFirstname")
                expect(object.content["@type"]).to.exist
                expect(object.content["@type"]).equals("BetterAttribute")
                expect(object.content["@context"]).to.exist
            })

            it("should parse correct serialized content again (subclass)", async function () {
                token = await TokenSerializeAttributeAsync.fromAny(object)
                expect(token).to.exist
                expect(token).instanceOf(SerializableAsync)
                expect(token).instanceOf(TokenSerializeAttributeAsync)
                expect(token.content).instanceOf(Serializable)
                expect(token.content).instanceOf(CoreSerializable)
                expect(token.content).instanceOf(Attribute)
                expect(token.content).instanceOf(BetterAttribute)
                expect(token.content.name).equals("firstname")
                expect(token.content.value).equals("aFirstname")
            })

            it("should serialize the subclasses content (non-verbose)", function () {
                object = token.toJSON(false)
                expect(object).is.a("object")
                expect(object).not.instanceOf(SerializableAsync)
                expect(object).not.instanceOf(TokenSerializeAttributeAsync)
                expect(object["@type"]).to.not.exist
                expect(object["@context"]).to.not.exist
                expect(object.content).to.exist
                expect(object.content.name).equals("firstname")
                expect(object.content.value).equals("aFirstname")
                expect(object.content["@type"]).to.exist
                expect(object.content["@type"]).equals("BetterAttribute")
                expect(object.content["@context"]).to.exist
            })

            it("should not parse additional arbitrary content", async function () {
                token = await TokenSerializeAttributeAsync.fromAny({
                    content: { name: "firstname", value: "aFirstname", anotherProp: "anotherPropValue" },
                    anotherProp: "anotherPropValue"
                })
                expect(token).to.exist
                expect(token).instanceOf(SerializableAsync)
                expect(token).instanceOf(TokenSerializeAttributeAsync)
                expect(token.content).instanceOf(Serializable)
                expect(token.content).instanceOf(CoreSerializable)
                expect(token.content).instanceOf(Attribute)
                expect(token.content.name).equals("firstname")
                expect(token.content.value).equals("aFirstname")
                expect(token.content.anotherProp).to.not.exist
                expect(token.anotherProp).to.not.exist
            })

            it("should not serialize the additional arbitrary content (verbose)", function () {
                object = token.toJSON()
                expect(object).is.a("object")
                expect(object).not.instanceOf(SerializableAsync)
                expect(object).not.instanceOf(TokenSerializeAttributeAsync)
                expect(object["@type"]).to.exist
                expect(object["@type"]).equals("TokenSerializeAttributeAsync")
                expect(object["@context"]).to.exist
                expect(object.content).to.exist
                expect(object.content.name).equals("firstname")
                expect(object.content.value).equals("aFirstname")
                expect(object.content["@type"]).to.not.exist
                expect(object.content["@context"]).to.not.exist
                expect(object.content.anotherProp).to.not.exist
                expect(object.anotherProp).to.not.exist
            })

            it("should not serialize the additional arbitrary content (non-verbose)", function () {
                object = token.toJSON(false)
                expect(object).is.a("object")
                expect(object).not.instanceOf(SerializableAsync)
                expect(object).not.instanceOf(TokenSerializeAttributeAsync)
                expect(object["@type"]).to.not.exist
                expect(object["@context"]).to.not.exist
                expect(object.content).to.exist
                expect(object.content.name).equals("firstname")
                expect(object.content.value).equals("aFirstname")
                expect(object.content["@type"]).to.not.exist
                expect(object.content["@context"]).to.not.exist
                expect(object.content.anotherProp).to.not.exist
                expect(object.anotherProp).to.not.exist
            })

            it("should not parse additional instantiated content", async function () {
                attr = Attribute.from({ name: "firstname", value: "aFirstname" })
                attr.anotherProp = "anotherPropValue"
                token = await TokenSerializeAttributeAsync.fromAny({
                    content: attr,
                    anotherProp: "anotherPropValue"
                })
                expect(token).to.exist
                expect(token).instanceOf(SerializableAsync)
                expect(token).instanceOf(TokenSerializeAttributeAsync)
                expect(token.content).instanceOf(Serializable)
                expect(token.content).instanceOf(CoreSerializable)
                expect(token.content).instanceOf(Attribute)
                expect(token.content.name).equals("firstname")
                expect(token.content.value).equals("aFirstname")
                expect(token.anotherProp).to.not.exist
                // This is intentional, if somebody sets an instance here, it is actually referenced
                // and not copied, thus the arbritrary properties are copied too (for the object)
                expect(token.content.anotherProp).to.exist
            })

            it("should not serialize the additional instantiated content (verbose)", function () {
                object = token.toJSON()
                expect(object).is.a("object")
                expect(object).not.instanceOf(SerializableAsync)
                expect(object).not.instanceOf(TokenSerializeAttributeAsync)
                expect(object["@type"]).to.exist
                expect(object["@type"]).equals("TokenSerializeAttributeAsync")
                expect(object["@context"]).to.exist
                expect(object.content).to.exist
                expect(object.content.name).equals("firstname")
                expect(object.content.value).equals("aFirstname")
                expect(object.content["@type"]).to.not.exist
                expect(object.content["@context"]).to.not.exist
                expect(object.content.anotherProp).to.not.exist
                expect(object.anotherProp).to.not.exist
            })

            it("should not serialize the additional instantiated content (non-verbose)", function () {
                object = token.toJSON(false)
                expect(object).is.a("object")
                expect(object).not.instanceOf(SerializableAsync)
                expect(object).not.instanceOf(TokenSerializeAttributeAsync)
                expect(object["@type"]).to.not.exist
                expect(object["@context"]).to.not.exist
                expect(object.content).to.exist
                expect(object.content.name).equals("firstname")
                expect(object.content.value).equals("aFirstname")
                expect(object.content["@type"]).to.not.exist
                expect(object.content["@context"]).to.not.exist
                expect(object.content.anotherProp).to.not.exist
                expect(object.anotherProp).to.not.exist
            })

            it("should not serialize non-known arbitrary content (verbose)", function () {
                token.content.anotherProp = "test"
                token.anotherProp = "test"
                object = token.toJSON()
                expect(object).is.a("object")
                expect(object).not.instanceOf(SerializableAsync)
                expect(object).not.instanceOf(TokenSerializeAttributeAsync)
                expect(object["@type"]).to.exist
                expect(object["@type"]).equals("TokenSerializeAttributeAsync")
                expect(object["@context"]).to.exist
                expect(object.content).to.exist
                expect(object.content.name).equals("firstname")
                expect(object.content.value).equals("aFirstname")
                expect(object.content["@type"]).to.not.exist
                expect(object.content["@context"]).to.not.exist
                expect(object.content.anotherProp).to.not.exist
                expect(object.anotherProp).to.not.exist
            })

            it("should not serialize non-known arbitrary content (non-verbose)", function () {
                token.content.anotherProp = "test"
                token.anotherProp = "test"
                object = token.toJSON(false)
                expect(object).is.a("object")
                expect(object).not.instanceOf(SerializableAsync)
                expect(object).not.instanceOf(TokenSerializeAttributeAsync)
                expect(object["@type"]).to.not.exist
                expect(object["@context"]).to.not.exist
                expect(object.content).to.exist
                expect(object.content.name).equals("firstname")
                expect(object.content.value).equals("aFirstname")
                expect(object.content["@type"]).to.not.exist
                expect(object.content["@context"]).to.not.exist
                expect(object.content.anotherProp).to.not.exist
                expect(object.anotherProp).to.not.exist
            })

            it("should not parse incorrect instantiated content", async function () {
                const id = CoreId.from("Test")
                await expectThrowsAsync(
                    async () =>
                        await TokenSerializeAttributeAsync.fromAny({
                            content: id
                        })
                )

                await expectThrowsAsync(
                    async () =>
                        await TokenSerializeAttributeAsync.fromAny({
                            conten: id
                        })
                )
            })

            it("should not parse incorrect arbitrary content", async function () {
                await expectThrowsAsync(
                    async () =>
                        await TokenSerializeAttributeAsync.fromAny({
                            content: { nam: "firstname", value: "aFirstname" }
                        })
                )

                await expectThrowsAsync(
                    async () =>
                        await TokenSerializeAttributeAsync.fromAny({
                            conten: { name: "firstname", value: "aFirstname" }
                        })
                )
            })
        })
    }
}
