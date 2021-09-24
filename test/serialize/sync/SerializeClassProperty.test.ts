import { schema, Serializable, serialize } from "@js-soft/ts-serval"
import { expect } from "chai"
import { Attribute } from "../../data/consumption/Attribute"
import { BetterAttribute } from "../../data/consumption/BetterAttribute"
import { CoreSerializable } from "../../data/core/CoreSerializable"
import { CoreId } from "../../data/core/types/CoreId"
import { expectThrows } from "../../testUtil"

@schema("https://schema.local.corp", "TokenSerializeAttribute")
class TokenSerializeAttribute extends Serializable {
    public notToBeSerialized = "avalue"

    @serialize()
    public content: Attribute

    public static from(value: Object): TokenSerializeAttribute {
        return super.fromT(value, TokenSerializeAttribute)
    }
}

export class SerializeClassPropertyTest {
    public static init(): void {
        describe("SerializeClassProperty", function () {
            let attr: any
            let token: any
            let object: any

            it("should parse correct arbitrary content", function () {
                token = TokenSerializeAttribute.from({ content: { name: "firstname", value: "aFirstname" } })
                expect(token).instanceOf(Serializable)
                expect(token).instanceOf(TokenSerializeAttribute)
                expect(token.content).instanceOf(Serializable)
                expect(token.content).instanceOf(CoreSerializable)
                expect(token.content).instanceOf(Attribute)
                expect(token.content.name).equals("firstname")
                expect(token.content.value).equals("aFirstname")
            })

            it("should serialize the arbitrary content (verbose)", function () {
                object = token.toJSON()
                expect(object).is.a("object")
                expect(object).not.instanceOf(Serializable)
                expect(object).not.instanceOf(TokenSerializeAttribute)
                expect(object["@type"]).to.exist
                expect(object["@type"]).equals("TokenSerializeAttribute")
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
                expect(object).not.instanceOf(Serializable)
                expect(object).not.instanceOf(TokenSerializeAttribute)
                expect(object["@type"]).to.not.exist
                expect(object["@context"]).to.not.exist
                expect(object.content).to.exist
                expect(object.content.name).equals("firstname")
                expect(object.content.value).equals("aFirstname")
                expect(object.content["@type"]).to.not.exist
                expect(object.content["@context"]).to.not.exist
            })

            it("should parse correct instantiated content", function () {
                attr = Attribute.from({ name: "firstname", value: "aFirstname" })
                token = TokenSerializeAttribute.from({ content: attr })
                expect(token).to.exist
                expect(token).instanceOf(Serializable)
                expect(token).instanceOf(TokenSerializeAttribute)
                expect(token.content).instanceOf(Serializable)
                expect(token.content).instanceOf(CoreSerializable)
                expect(token.content).instanceOf(Attribute)
                expect(token.content.name).equals("firstname")
                expect(token.content.value).equals("aFirstname")
            })

            it("should serialize the instantiated content", function () {
                object = token.toJSON()
                expect(object).is.a("object")
                expect(object).not.instanceOf(Serializable)
                expect(object).not.instanceOf(TokenSerializeAttribute)
                expect(object["@type"]).to.exist
                expect(object["@type"]).equals("TokenSerializeAttribute")
                expect(object["@context"]).to.exist
                expect(object.content).to.exist
                expect(object.content.name).equals("firstname")
                expect(object.content.value).equals("aFirstname")
                expect(object.content["@type"]).to.not.exist
                expect(object.content["@context"]).to.not.exist
            })

            it("should parse correct instantiated content (subclass)", function () {
                attr = BetterAttribute.from({ name: "firstname", value: "aFirstname" })
                token = TokenSerializeAttribute.from({ content: attr })
                expect(token).to.exist
                expect(token).instanceOf(Serializable)
                expect(token).instanceOf(TokenSerializeAttribute)
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
                expect(object).not.instanceOf(Serializable)
                expect(object).not.instanceOf(TokenSerializeAttribute)
                expect(object["@type"]).to.exist
                expect(object["@type"]).equals("TokenSerializeAttribute")
                expect(object["@context"]).to.exist
                expect(object.content).to.exist
                expect(object.content.name).equals("firstname")
                expect(object.content.value).equals("aFirstname")
                expect(object.content["@type"]).to.exist
                expect(object.content["@type"]).equals("BetterAttribute")
                expect(object.content["@context"]).to.exist
            })

            it("should parse correct serialized content again (subclass)", function () {
                token = TokenSerializeAttribute.from(object)
                expect(token).to.exist
                expect(token).instanceOf(Serializable)
                expect(token).instanceOf(TokenSerializeAttribute)
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
                expect(object).not.instanceOf(Serializable)
                expect(object).not.instanceOf(TokenSerializeAttribute)
                expect(object["@type"]).to.not.exist
                expect(object["@context"]).to.not.exist
                expect(object.content).to.exist
                expect(object.content.name).equals("firstname")
                expect(object.content.value).equals("aFirstname")
                expect(object.content["@type"]).to.exist
                expect(object.content["@type"]).equals("BetterAttribute")
                expect(object.content["@context"]).to.exist
            })

            it("should not parse additional arbitrary content", function () {
                token = TokenSerializeAttribute.from({
                    content: {
                        name: "firstname",
                        value: "aFirstname",
                        someAdditonalArbitraryProperty: "someAdditonalArbitraryValue"
                    },
                    someAdditonalArbitraryProperty: "someAdditonalArbitraryValue"
                })
                expect(token).to.exist
                expect(token).instanceOf(Serializable)
                expect(token).instanceOf(TokenSerializeAttribute)
                expect(token.content).instanceOf(Serializable)
                expect(token.content).instanceOf(CoreSerializable)
                expect(token.content).instanceOf(Attribute)
                expect(token.content.name).equals("firstname")
                expect(token.content.value).equals("aFirstname")
                expect(token.content.someAdditonalArbitraryProperty).to.not.exist
                expect(token.someAdditonalArbitraryProperty).to.not.exist
            })

            it("should not serialize the additional arbitrary content (verbose)", function () {
                object = token.toJSON()
                expect(object).is.a("object")
                expect(object).not.instanceOf(Serializable)
                expect(object).not.instanceOf(TokenSerializeAttribute)
                expect(object["@type"]).to.exist
                expect(object["@type"]).equals("TokenSerializeAttribute")
                expect(object["@context"]).to.exist
                expect(object.content).to.exist
                expect(object.content.name).equals("firstname")
                expect(object.content.value).equals("aFirstname")
                expect(object.content["@type"]).to.not.exist
                expect(object.content["@context"]).to.not.exist
                expect(object.content.someprop).to.not.exist
                expect(object.someprop).to.not.exist
            })

            it("should not serialize the additional arbitrary content (non-verbose)", function () {
                object = token.toJSON(false)
                expect(object).is.a("object")
                expect(object).not.instanceOf(Serializable)
                expect(object).not.instanceOf(TokenSerializeAttribute)
                expect(object["@type"]).to.not.exist
                expect(object["@context"]).to.not.exist
                expect(object.content).to.exist
                expect(object.content.name).equals("firstname")
                expect(object.content.value).equals("aFirstname")
                expect(object.content["@type"]).to.not.exist
                expect(object.content["@context"]).to.not.exist
                expect(object.content.someprop).to.not.exist
                expect(object.someprop).to.not.exist
            })

            it("should not parse additional instantiated content", function () {
                attr = Attribute.from({ name: "firstname", value: "aFirstname" })
                attr.additionalContent = "someAdditionalContent"
                token = TokenSerializeAttribute.from({
                    content: attr,
                    additionalContent: "someAdditionalContent"
                })
                expect(token).to.exist
                expect(token).instanceOf(Serializable)
                expect(token).instanceOf(TokenSerializeAttribute)
                expect(token.content).instanceOf(Serializable)
                expect(token.content).instanceOf(CoreSerializable)
                expect(token.content).instanceOf(Attribute)
                expect(token.content.name).equals("firstname")
                expect(token.content.value).equals("aFirstname")
                expect(token.additionalContent).to.not.exist
                // This is intentional, if somebody sets an instance here, it is actually referenced
                // and not copied, thus the arbritrary properties are copied too (for the object)
                expect(token.content.additionalContent).to.exist
            })

            it("should not serialize the additional instantiated content (verbose)", function () {
                object = token.toJSON()
                expect(object).is.a("object")
                expect(object).not.instanceOf(Serializable)
                expect(object).not.instanceOf(TokenSerializeAttribute)
                expect(object["@type"]).to.exist
                expect(object["@type"]).equals("TokenSerializeAttribute")
                expect(object["@context"]).to.exist
                expect(object.content).to.exist
                expect(object.content.name).equals("firstname")
                expect(object.content.value).equals("aFirstname")
                expect(object.content["@type"]).to.not.exist
                expect(object.content["@context"]).to.not.exist
                expect(object.content.someprop).to.not.exist
                expect(object.someprop).to.not.exist
            })

            it("should not serialize the additional instantiated content (non-verbose)", function () {
                object = token.toJSON(false)
                expect(object).is.a("object")
                expect(object).not.instanceOf(Serializable)
                expect(object).not.instanceOf(TokenSerializeAttribute)
                expect(object["@type"]).to.not.exist
                expect(object["@context"]).to.not.exist
                expect(object.content).to.exist
                expect(object.content.name).equals("firstname")
                expect(object.content.value).equals("aFirstname")
                expect(object.content["@type"]).to.not.exist
                expect(object.content["@context"]).to.not.exist
                expect(object.content.someprop).to.not.exist
                expect(object.someprop).to.not.exist
            })

            it("should not serialize non-known arbitrary content (verbose)", function () {
                token.content.someprop = "test"
                token.someprop = "test"
                object = token.toJSON()
                expect(object).is.a("object")
                expect(object).not.instanceOf(Serializable)
                expect(object).not.instanceOf(TokenSerializeAttribute)
                expect(object["@type"]).to.exist
                expect(object["@type"]).equals("TokenSerializeAttribute")
                expect(object["@context"]).to.exist
                expect(object.content).to.exist
                expect(object.content.name).equals("firstname")
                expect(object.content.value).equals("aFirstname")
                expect(object.content["@type"]).to.not.exist
                expect(object.content["@context"]).to.not.exist
                expect(object.content.someprop).to.not.exist
                expect(object.someprop).to.not.exist
            })

            it("should not serialize non-known arbitrary content (non-verbose)", function () {
                token.content.someprop = "test"
                token.someprop = "test"
                object = token.toJSON(false)
                expect(object).is.a("object")
                expect(object).not.instanceOf(Serializable)
                expect(object).not.instanceOf(TokenSerializeAttribute)
                expect(object["@type"]).to.not.exist
                expect(object["@context"]).to.not.exist
                expect(object.content).to.exist
                expect(object.content.name).equals("firstname")
                expect(object.content.value).equals("aFirstname")
                expect(object.content["@type"]).to.not.exist
                expect(object.content["@context"]).to.not.exist
                expect(object.content.someprop).to.not.exist
                expect(object.someprop).to.not.exist
            })

            it("should not parse incorrect instantiated content", function () {
                const id = CoreId.from("Test")
                expectThrows(() => {
                    TokenSerializeAttribute.from({
                        content: id
                    })
                })

                expectThrows(() => {
                    TokenSerializeAttribute.from({
                        conten: id
                    })
                })
            })

            it("should not parse incorrect arbitrary content", function () {
                expectThrows(() => {
                    TokenSerializeAttribute.from({
                        content: {
                            someIncorrectArbitraryProperty: "someIncorrectArbitraryValue",
                            value: "someCorrectValue"
                        }
                    })
                })

                expectThrows(() => {
                    TokenSerializeAttribute.from({
                        conten: {
                            someIncorrectArbitraryProperty: "someIncorrectArbitraryValue",
                            value: "someCorrectValue"
                        }
                    })
                })
            })
        })
    }
}
