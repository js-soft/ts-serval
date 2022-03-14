import { JSONWrapperAsync, schema, SerializableAsync, serialize } from "@js-soft/ts-serval"
import { expect } from "chai"
import { Attribute } from "../../data/consumption/Attribute"

@schema("https://schema.local.corp", "TokenSerializableWrapperAsync")
class TokenSerializableWrapperAsync extends SerializableAsync {
    public notToBeSerialized = "avalue"

    @serialize()
    public content: SerializableAsync

    public static async from(value: Object): Promise<TokenSerializableWrapperAsync> {
        return await super.fromT(value, TokenSerializableWrapperAsync)
    }
}

@schema("https://schema.local.corp", "TokenSerializableObjectWrapperAsync")
class TokenSerializableObjectWrapperAsync extends SerializableAsync {
    public notToBeSerialized = "avalue"

    @serialize()
    public content: Object

    public static async from(value: Object): Promise<TokenSerializableObjectWrapperAsync> {
        return await super.fromT(value, TokenSerializableObjectWrapperAsync)
    }
}

@schema("https://schema.local.corp", "TokenSerializableAnyWrapperAsync")
class TokenSerializableAnyWrapperAsync extends SerializableAsync {
    public notToBeSerialized = "avalue"

    @serialize()
    public content: any

    public static async from(value: Object): Promise<TokenSerializableAnyWrapperAsync> {
        return await super.fromT(value, TokenSerializableAnyWrapperAsync)
    }
}

export class SerializeAsyncWrapperTest {
    public static init(): void {
        describe("JSONWrapperAsync", function () {
            let wrapper: JSONWrapperAsync
            let serialized: string
            it("should deserialize unknown content to Wrapper", async function () {
                wrapper = await JSONWrapperAsync.from({
                    someProperty: "someValue",
                    content: "someContent"
                })
                expect(wrapper).instanceOf(JSONWrapperAsync)
                expect(wrapper.value.someProperty).equals("someValue")
                expect(wrapper.value.content).equals("someContent")
            })

            it("should serialize Wrapper content", function () {
                const object: any = wrapper.toJSON()
                expect(object).to.exist
                expect(object["@type"]).to.not.exist
                expect(object.someProperty).equals("someValue")
                expect(object.content).equals("someContent")
            })

            it("should serialize Wrapper content to string", function () {
                serialized = wrapper.serialize()
                expect(serialized).to.equal('{"someProperty":"someValue","content":"someContent"}')
            })

            it("should deserialize Wrapper content from string", async function () {
                wrapper = await JSONWrapperAsync.deserialize(serialized)
                expect(wrapper).instanceOf(JSONWrapperAsync)
                expect(wrapper.value.someProperty).equals("someValue")
                expect(wrapper.value.content).equals("someContent")
            })
        })

        describe("JSONWrapperAsyncHierarchy", function () {
            let wrapper: JSONWrapperAsync
            let serialized: string
            it("should deserialize unknown content to Wrapper", async function () {
                wrapper = await JSONWrapperAsync.from({
                    attribute: {
                        "@type": "Attribute", // eslint-disable-line @typescript-eslint/naming-convention
                        name: "Person.firstname",
                        value: "outerFirstname"
                    },
                    child: {
                        "@type": "JSONWrapperAsync", // eslint-disable-line @typescript-eslint/naming-convention
                        someProperty: {
                            boolean: true,
                            number: 5,
                            array: [
                                {
                                    "@type": "Attribute", // eslint-disable-line @typescript-eslint/naming-convention
                                    name: "Person.firstname",
                                    value: "innerFirstname"
                                },
                                {
                                    "@type": "Attribute", // eslint-disable-line @typescript-eslint/naming-convention
                                    name: "Person.lastname",
                                    value: "innerLastname"
                                }
                            ]
                        }
                    },
                    content: "someContent"
                })
                expect(wrapper).instanceOf(JSONWrapperAsync)
                const attribute = wrapper.value.attribute as Attribute
                expect(attribute.name).equals("Person.firstname")
                expect(attribute.value).equals("outerFirstname")
                const child = wrapper.value.child
                expect(child.someProperty).exist
                expect(child.someProperty.boolean).equals(true)
                expect(child.someProperty.number).equals(5)
                expect(child.someProperty.array).is.an("array")
                expect(wrapper.value.content).equals("someContent")
            })

            it("should serialize Wrapper content", function () {
                const object: any = wrapper.toJSON()
                expect(object).to.exist
                expect(object["@type"]).to.not.exist
                expect(object.attribute).to.exist
                expect(object.attribute["@type"]).equals("Attribute")
                expect(object.attribute.name).equals("Person.firstname")
                expect(object.attribute.value).equals("outerFirstname")
                expect(object.child).to.exist
                expect(object.child["@type"]).equals("JSONWrapperAsync")
                expect(object.child.someProperty).to.exist
                expect(object.child.someProperty.boolean).equals(true)
                expect(object.child.someProperty.number).equals(5)
                expect(object.child.someProperty.array).is.an("array")
                expect(object.content).equals("someContent")
            })

            it("should serialize Wrapper content to string", function () {
                serialized = wrapper.serialize()
                expect(serialized).to.equal(
                    '{"attribute":{"@type":"Attribute","name":"Person.firstname","value":"outerFirstname"},"child":{"@type":"JSONWrapperAsync","someProperty":{"boolean":true,"number":5,"array":[{"@type":"Attribute","name":"Person.firstname","value":"innerFirstname"},{"@type":"Attribute","name":"Person.lastname","value":"innerLastname"}]}},"content":"someContent"}'
                )
            })

            it("should deserialize Wrapper content from string", async function () {
                wrapper = await JSONWrapperAsync.deserialize(serialized)
                expect(wrapper).instanceOf(JSONWrapperAsync)
                const attribute = wrapper.value.attribute as Attribute
                expect(attribute.name).equals("Person.firstname")
                expect(attribute.value).equals("outerFirstname")
                const child = wrapper.value.child
                expect(child.someProperty).exist
                expect(child.someProperty.boolean).equals(true)
                expect(child.someProperty.number).equals(5)
                expect(child.someProperty.array).is.an("array")
                expect(wrapper.value.content).equals("someContent")
            })
        })

        describe("TokenSerializableWrapperAsync", function () {
            let wrapper: JSONWrapperAsync
            let object: any
            let token: TokenSerializableWrapperAsync
            let serialized: string
            it("should deserialize unknown wrapper content in token", async function () {
                wrapper = await JSONWrapperAsync.from({
                    someProperty: "someValue",
                    content: "someContent"
                })

                token = await TokenSerializableWrapperAsync.from({ content: wrapper })
                expect(token).instanceOf(TokenSerializableWrapperAsync)
                expect(token.content).instanceOf(JSONWrapperAsync)
                const anyContent = token.content as any
                expect(anyContent.value.someProperty).equals("someValue")
                expect(anyContent.value.content).equals("someContent")
            })

            it("should serialize Token", function () {
                object = token.toJSON()
                expect(object).to.exist
                expect(object["@type"]).to.equal("TokenSerializableWrapperAsync")
                expect(object.content).to.exist
                expect(object.content["@type"]).to.not.exist
                expect(object.content.someProperty).equals("someValue")
                expect(object.content.content).equals("someContent")
            })

            it("should serialize Token content to string", function () {
                serialized = token.serialize()
                expect(serialized).to.equal(
                    '{"@context":"https://schema.local.corp","@type":"TokenSerializableWrapperAsync","content":{"someProperty":"someValue","content":"someContent"}}'
                )
            })

            it("should deserialize Token content from string", async function () {
                token = (await TokenSerializableWrapperAsync.deserialize(serialized)) as TokenSerializableWrapperAsync
                expect(token).instanceOf(TokenSerializableWrapperAsync)
                expect(token.content).instanceOf(JSONWrapperAsync)
                const anyContent = token.content as any
                expect(anyContent.value.someProperty).equals("someValue")
                expect(anyContent.value.content).equals("someContent")
            })
        })

        describe("TokenSerializableObjectWrapperAsync", function () {
            let object: any
            let token: TokenSerializableObjectWrapperAsync
            let serialized: string
            it("should deserialize unknown wrapper content in token", async function () {
                token = await TokenSerializableObjectWrapperAsync.from({ content: { an: "object" } })
                expect(token).instanceOf(TokenSerializableObjectWrapperAsync)
                expect(token.content).not.instanceOf(JSONWrapperAsync)
                const anyContent = token.content as any
                expect(anyContent.an).equals("object")
            })

            it("should serialize Token", function () {
                object = token.toJSON()
                expect(object).to.exist
                expect(object["@type"]).to.equal("TokenSerializableObjectWrapperAsync")
                expect(object.content).to.exist
                expect(object.content["@type"]).to.not.exist
                expect(object.content.an).equals("object")
            })

            it("should serialize Token content to string", function () {
                serialized = token.serialize()
                expect(serialized).to.equal(
                    '{"@context":"https://schema.local.corp","@type":"TokenSerializableObjectWrapperAsync","content":{"an":"object"}}'
                )
            })

            it("should deserialize Token content from string", async function () {
                token = (await TokenSerializableObjectWrapperAsync.deserialize(
                    serialized
                )) as TokenSerializableObjectWrapperAsync
                expect(token).instanceOf(TokenSerializableObjectWrapperAsync)
                expect(token.content).not.instanceOf(JSONWrapperAsync)
                const anyContent = token.content as any
                expect(anyContent.an).equals("object")
            })
        })

        describe("TokenSerializableAnyWrapperAsync", function () {
            let object: any
            let token: TokenSerializableAnyWrapperAsync
            let serialized: string
            it("should deserialize unknown wrapper content in token", async function () {
                token = await TokenSerializableAnyWrapperAsync.from({ content: { an: "object" } })
                expect(token).instanceOf(TokenSerializableAnyWrapperAsync)
                expect(token.content).not.instanceOf(JSONWrapperAsync)
                const anyContent = token.content
                expect(anyContent.an).equals("object")
            })

            it("should serialize Token", function () {
                object = token.toJSON()
                expect(object).to.exist
                expect(object["@type"]).to.equal("TokenSerializableAnyWrapperAsync")
                expect(object.content).to.exist
                expect(object.content["@type"]).to.not.exist
                expect(object.content.an).equals("object")
            })

            it("should serialize Token content to string", function () {
                serialized = token.serialize()
                expect(serialized).to.equal(
                    '{"@context":"https://schema.local.corp","@type":"TokenSerializableAnyWrapperAsync","content":{"an":"object"}}'
                )
            })

            it("should deserialize Token content from string", async function () {
                token = (await TokenSerializableAnyWrapperAsync.deserialize(
                    serialized
                )) as TokenSerializableAnyWrapperAsync
                expect(token).instanceOf(TokenSerializableAnyWrapperAsync)
                expect(token.content).not.instanceOf(JSONWrapperAsync)
                const anyContent = token.content
                expect(anyContent.an).equals("object")
            })
        })
    }
}
