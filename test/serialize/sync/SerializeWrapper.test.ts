import { JSONWrapper, schema, Serializable, serialize } from "@js-soft/ts-serval"
import { expect } from "chai"
import { Attribute } from "../../data/consumption/Attribute"

@schema("https://schema.local.corp", "TokenSerializableWrapper")
class TokenSerializableWrapper extends Serializable {
    public notToBeSerialized = "avalue"

    @serialize()
    public content: Serializable

    public static from(value: Object): TokenSerializableWrapper {
        return this.fromAny(value)
    }
}

@schema("https://schema.local.corp", "TokenSerializableObjectWrapper")
class TokenSerializableObjectWrapper extends Serializable {
    public notToBeSerialized = "avalue"

    @serialize()
    public content: Object

    public static from(value: Object): TokenSerializableObjectWrapper {
        return this.fromAny(value)
    }
}

@schema("https://schema.local.corp", "TokenSerializableAnyWrapper")
class TokenSerializableAnyWrapper extends Serializable {
    public notToBeSerialized = "avalue"

    @serialize()
    public content: any

    public static from(value: Object): TokenSerializableAnyWrapper {
        return this.fromAny(value)
    }
}

export class SerializeWrapperTest {
    public static init(): void {
        describe("JSONWrapper", function () {
            let wrapper: JSONWrapper
            let serialized: string

            it("should deserialize unknown content to Wrapper", function () {
                wrapper = JSONWrapper.from({
                    someProperty: "someValue",
                    content: "someContent"
                })
                expect(wrapper).instanceOf(JSONWrapper)
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

            it("should deserialize Wrapper content from string", function () {
                wrapper = JSONWrapper.deserialize(serialized)
                expect(wrapper).instanceOf(JSONWrapper)
                expect(wrapper.value.someProperty).equals("someValue")
                expect(wrapper.value.content).equals("someContent")
            })
        })

        describe("JSONWrapperHierarchy", function () {
            let wrapper: JSONWrapper
            let serialized: string
            it("should deserialize unknown content to Wrapper", function () {
                wrapper = JSONWrapper.from({
                    attribute: {
                        "@type": "Attribute",
                        name: "Person.firstname",
                        value: "outerFirstname"
                    },
                    child: {
                        "@type": "JSONWrapper",
                        someProperty: {
                            boolean: true,
                            number: 5,
                            array: [
                                {
                                    "@type": "Attribute",
                                    name: "Person.firstname",
                                    value: "innerFirstname"
                                },
                                {
                                    "@type": "Attribute",
                                    name: "Person.lastname",
                                    value: "innerLastname"
                                }
                            ]
                        }
                    },
                    content: "someContent"
                })
                expect(wrapper).instanceOf(JSONWrapper)
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
                expect(object.child["@type"]).equals("JSONWrapper")
                expect(object.child.someProperty).to.exist
                expect(object.child.someProperty.boolean).equals(true)
                expect(object.child.someProperty.number).equals(5)
                expect(object.child.someProperty.array).is.an("array")
                expect(object.content).equals("someContent")
            })

            it("should serialize Wrapper content to string", function () {
                serialized = wrapper.serialize()
                expect(serialized).to.equal(
                    '{"attribute":{"@type":"Attribute","name":"Person.firstname","value":"outerFirstname"},"child":{"@type":"JSONWrapper","someProperty":{"boolean":true,"number":5,"array":[{"@type":"Attribute","name":"Person.firstname","value":"innerFirstname"},{"@type":"Attribute","name":"Person.lastname","value":"innerLastname"}]}},"content":"someContent"}'
                )
            })

            it("should deserialize Wrapper content from string", function () {
                wrapper = JSONWrapper.deserialize(serialized)
                expect(wrapper).instanceOf(JSONWrapper)
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

        describe("TokenSerializableWrapper", function () {
            let wrapper: JSONWrapper
            let object: any
            let token: TokenSerializableWrapper
            let serialized: string
            it("should deserialize unknown wrapper content in token", function () {
                wrapper = JSONWrapper.from({
                    someProperty: "someValue",
                    content: "someContent"
                })

                token = TokenSerializableWrapper.from({ content: wrapper })
                expect(token).instanceOf(TokenSerializableWrapper)
                expect(token.content).instanceOf(JSONWrapper)
                const anyContent = token.content as any
                expect(anyContent.value.someProperty).equals("someValue")
                expect(anyContent.value.content).equals("someContent")
            })

            it("should serialize Token", function () {
                object = token.toJSON()
                expect(object).to.exist
                expect(object["@type"]).to.equal("TokenSerializableWrapper")
                expect(object.content).to.exist
                expect(object.content["@type"]).to.not.exist
                expect(object.content.someProperty).equals("someValue")
                expect(object.content.content).equals("someContent")
            })

            it("should serialize Token content to string", function () {
                serialized = token.serialize()
                expect(serialized).to.equal(
                    '{"@context":"https://schema.local.corp","@type":"TokenSerializableWrapper","content":{"someProperty":"someValue","content":"someContent"}}'
                )
            })

            it("should deserialize Token content from string", function () {
                token = TokenSerializableWrapper.deserialize(serialized)
                expect(token).instanceOf(TokenSerializableWrapper)
                expect(token.content).instanceOf(JSONWrapper)
                const anyContent = token.content as any
                expect(anyContent.value.someProperty).equals("someValue")
                expect(anyContent.value.content).equals("someContent")
            })
        })

        describe("TokenSerializableObjectWrapper", function () {
            let object: any
            let token: TokenSerializableObjectWrapper
            let serialized: string
            it("should deserialize unknown wrapper content in token", function () {
                token = TokenSerializableObjectWrapper.from({ content: { an: "object" } })
                expect(token).instanceOf(TokenSerializableObjectWrapper)
                expect(token.content).not.instanceOf(JSONWrapper)
                const anyContent = token.content as any
                expect(anyContent.an).equals("object")
            })

            it("should serialize Token", function () {
                object = token.toJSON()
                expect(object).to.exist
                expect(object["@type"]).to.equal("TokenSerializableObjectWrapper")
                expect(object.content).to.exist
                expect(object.content["@type"]).to.not.exist
                expect(object.content.an).equals("object")
            })

            it("should serialize Token content to string", function () {
                serialized = token.serialize()
                expect(serialized).to.equal(
                    '{"@context":"https://schema.local.corp","@type":"TokenSerializableObjectWrapper","content":{"an":"object"}}'
                )
            })

            it("should deserialize Token content from string", function () {
                token = TokenSerializableObjectWrapper.deserialize(serialized)
                expect(token).instanceOf(TokenSerializableObjectWrapper)
                expect(token.content).not.instanceOf(JSONWrapper)
                const anyContent = token.content as any
                expect(anyContent.an).equals("object")
            })
        })

        describe("TokenSerializableAnyWrapper", function () {
            let object: any
            let token: TokenSerializableAnyWrapper
            let serialized: string
            it("should deserialize unknown wrapper content in token", function () {
                token = TokenSerializableAnyWrapper.from({ content: { an: "object" } })
                expect(token).instanceOf(TokenSerializableAnyWrapper)
                expect(token.content).not.instanceOf(JSONWrapper)
                const anyContent = token.content
                expect(anyContent.an).equals("object")
            })

            it("should serialize Token", function () {
                object = token.toJSON()
                expect(object).to.exist
                expect(object["@type"]).to.equal("TokenSerializableAnyWrapper")
                expect(object.content).to.exist
                expect(object.content["@type"]).to.not.exist
                expect(object.content.an).equals("object")
            })

            it("should serialize Token content to string", function () {
                serialized = token.serialize()
                expect(serialized).to.equal(
                    '{"@context":"https://schema.local.corp","@type":"TokenSerializableAnyWrapper","content":{"an":"object"}}'
                )
            })

            it("should deserialize Token content from string", function () {
                token = TokenSerializableAnyWrapper.deserialize(serialized)
                expect(token).instanceOf(TokenSerializableAnyWrapper)
                expect(token.content).not.instanceOf(JSONWrapper)
                const anyContent = token.content
                expect(anyContent.an).equals("object")
            })
        })
    }
}
