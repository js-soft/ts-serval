import { schema, Serializable, serialize } from "@js-soft/ts-serval"
import { expect } from "chai"

@schema("https://schema.local.corp", "RelationshipTemplate")
class RelationshipTemplate extends Serializable {
    @serialize({ deserializeStrings: true })
    public template: Object

    public static from(value: Object): RelationshipTemplate {
        return this.fromAny(value)
    }
}

@schema("https://schema.local.corp", "TokenContent")
class TokenContent extends Serializable {
    public notToBeSerialized = "avalue"

    @serialize()
    public title: string

    public static from(value: Object): TokenContent {
        return this.fromAny(value)
    }
}

@schema("https://schema.local.corp", "TokenContentGeneric")
class TokenContentGeneric extends TokenContent {
    @serialize({ any: true, deserializeStrings: true })
    public content: any

    public static from(value: Object): TokenContentGeneric {
        return this.fromAny(value)
    }
}

@schema("https://schema.local.corp", "TokenContentRelationshipTemplate")
class TokenContentRelationshipTemplate extends TokenContent {
    @serialize({ deserializeStrings: true })
    public content: RelationshipTemplate

    @serialize({ optional: true })
    public optionalContent: string

    public static from(value: Object): TokenContentRelationshipTemplate {
        return this.fromAny(value)
    }
}

@schema("https://schema.local.corp", "TokenContentString")
class TokenContentString extends TokenContent {
    @serialize()
    public content: String

    public static from(value: Object): TokenContentString {
        return this.fromAny(value)
    }
}

@schema("https://schema.local.corp", "TokenRelationshipTemplates")
class TokenRelationshipTemplates extends Serializable {
    @serialize({ type: TokenContentRelationshipTemplate })
    public templates: TokenContentRelationshipTemplate[]

    public static from(value: Object): TokenRelationshipTemplates {
        return this.fromAny(value)
    }
}

export class InheritanceTest {
    public static init(): void {
        describe("Inheritance", function () {
            describe("TokenContentString", function () {
                it("from() creates instance from given interface", function () {
                    const token: any = TokenContentString.from({
                        title: "Test",
                        content: "someContent"
                    })

                    expect(token).to.be.instanceOf(Serializable)
                    expect(token).to.be.instanceOf(TokenContent)
                    expect(token).to.be.instanceOf(TokenContentString)
                    expect(token).not.to.be.instanceOf(TokenContentRelationshipTemplate)
                    expect(token).not.to.be.instanceOf(TokenContentGeneric)
                    expect(token.notToBeSerialized).to.exist
                    expect(token.notToBeSerialized).to.equal("avalue")
                    expect(token.title).to.exist
                    expect(token.title).to.equal("Test")
                    expect(token.content).to.exist
                    expect(token.content).to.equal("someContent")
                })

                it("from() creates instance from given instance", function () {
                    const useToken: any = TokenContentString.from({
                        title: "Test",
                        content: "someContent"
                    })
                    const token: any = TokenContentString.from(useToken)

                    expect(token).to.be.instanceOf(Serializable)
                    expect(token).to.be.instanceOf(TokenContent)
                    expect(token).to.be.instanceOf(TokenContentString)
                    expect(token).not.to.be.instanceOf(TokenContentRelationshipTemplate)
                    expect(token).not.to.be.instanceOf(TokenContentGeneric)
                    expect(token.notToBeSerialized).to.exist
                    expect(token.notToBeSerialized).to.equal("avalue")
                    expect(token.title).to.exist
                    expect(token.title).to.equal("Test")
                    expect(token.content).to.exist
                    expect(token.content).to.equal("someContent")
                })

                it("from() creates instance from given object", function () {
                    const useToken: any = TokenContentString.from({
                        title: "Test",
                        content: "someContent"
                    })
                    const object: Object = useToken.toJSON()
                    const token: any = TokenContentString.from(object)

                    expect(token).to.be.instanceOf(Serializable)
                    expect(token).to.be.instanceOf(TokenContent)
                    expect(token).to.be.instanceOf(TokenContentString)
                    expect(token).not.to.be.instanceOf(TokenContentRelationshipTemplate)
                    expect(token).not.to.be.instanceOf(TokenContentGeneric)
                    expect(token.notToBeSerialized).to.exist
                    expect(token.notToBeSerialized).to.equal("avalue")
                    expect(token.title).to.exist
                    expect(token.title).to.equal("Test")
                    expect(token.content).to.exist
                    expect(token.content).to.equal("someContent")
                })

                it("deserialize() creates instance from given string", function () {
                    const token: any = TokenContentString.deserialize('{"content":"someContent","title":"Test"}')

                    expect(token).to.be.instanceOf(Serializable)
                    expect(token).to.be.instanceOf(TokenContent)
                    expect(token).to.be.instanceOf(TokenContentString)
                    expect(token).not.to.be.instanceOf(TokenContentRelationshipTemplate)
                    expect(token).not.to.be.instanceOf(TokenContentGeneric)
                    expect(token.notToBeSerialized).to.exist
                    expect(token.notToBeSerialized).to.equal("avalue")
                    expect(token.title).to.exist
                    expect(token.title).to.equal("Test")
                    expect(token.content).to.exist
                    expect(token.content).to.equal("someContent")
                })

                it("serialize() creates string from given instance", function () {
                    const token: any = TokenContentString.deserialize('{"content":"someContent","title":"Test"}')
                    const string: string = token.serialize()
                    expect(string).to.equal(
                        '{"@context":"https://schema.local.corp","@type":"TokenContentString","content":"someContent","title":"Test"}'
                    )
                })

                it("multiple de/serialization works", function () {
                    let token: any = TokenContentString.deserialize('{"content":"someContent","title":"Test"}')
                    let string: string = token.serialize()
                    token = TokenContentString.deserialize(string)
                    string = token.serialize()
                    token = TokenContentString.deserialize(string)
                    string = token.serialize()
                    expect(string).to.equal(
                        '{"@context":"https://schema.local.corp","@type":"TokenContentString","content":"someContent","title":"Test"}'
                    )
                })
            })

            describe("TokenRelationshipTemplates", function () {
                it("from() creates instance from given interface (all objects)", function () {
                    const token: any = TokenRelationshipTemplates.from({
                        templates: [
                            TokenContentRelationshipTemplate.from({
                                title: "Test",
                                content: RelationshipTemplate.from({
                                    template: { myprop: "myvalue" }
                                })
                            }),
                            TokenContentRelationshipTemplate.from({
                                title: "Test 2",
                                content: RelationshipTemplate.from({
                                    template: { myprop: "myvalue" }
                                }),
                                optionalContent: "someOptionalContent"
                            })
                        ]
                    })

                    expect(token).to.be.instanceOf(Serializable)
                    expect(token).to.be.instanceOf(TokenRelationshipTemplates)
                    expect(token.templates).to.exist
                    expect(token.templates).to.be.instanceOf(Array)
                    expect(token.templates.length).to.equal(2)

                    const item0 = token.templates[0]
                    expect(item0).to.be.instanceOf(Serializable)
                    expect(item0).to.be.instanceOf(TokenContent)
                    expect(item0).to.be.instanceOf(TokenContentRelationshipTemplate)
                    expect(item0.optionalContent).not.to.exist
                    expect(item0.title).to.exist
                    expect(item0.title).to.equal("Test")
                    expect(item0.notToBeSerialized).to.exist
                    expect(item0.notToBeSerialized).to.equal("avalue")
                    expect(item0.content.template).to.exist
                    expect(item0.content.template.myprop).to.exist

                    const item1 = token.templates[1]
                    expect(item1).to.be.instanceOf(Serializable)
                    expect(item1).to.be.instanceOf(TokenContent)
                    expect(item1).to.be.instanceOf(TokenContentRelationshipTemplate)
                    expect(item1.optionalContent).to.exist
                    expect(item1.optionalContent).to.equal("someOptionalContent")
                    expect(item1.title).to.exist
                    expect(item1.title).to.equal("Test 2")
                    expect(item1.notToBeSerialized).to.exist
                    expect(item1.notToBeSerialized).to.equal("avalue")
                    expect(item1.content.template).to.exist
                    expect(item1.content.template.myprop).to.exist
                })
            })

            describe("TokenContentRelationshipTemplate", function () {
                it("from() creates instance from given interface (all objects)", function () {
                    const token: any = TokenContentRelationshipTemplate.from({
                        title: "Test",
                        content: RelationshipTemplate.from({
                            template: { myprop: "myvalue" }
                        })
                    })

                    expect(token).to.be.instanceOf(Serializable)
                    expect(token).to.be.instanceOf(TokenContent)
                    expect(token).to.be.instanceOf(TokenContentRelationshipTemplate)
                    expect(token).not.to.be.instanceOf(TokenContentString)
                    expect(token).not.to.be.instanceOf(TokenContentGeneric)
                    expect(token.content).to.exist
                    expect(token.content).to.be.instanceOf(RelationshipTemplate)
                    expect(token.notToBeSerialized).to.exist
                    expect(token.notToBeSerialized).to.equal("avalue")
                    expect(token.title).to.exist
                    expect(token.title).to.equal("Test")
                    expect(token.content.template).to.exist
                    expect(token.content.template.myprop).to.exist
                })

                it("from() creates instance from given interface (with strings to deserialize)", function () {
                    const token: any = TokenContentRelationshipTemplate.from({
                        title: "Test",
                        content: '{"template":"{\\"myprop\\":\\"myvalue\\"}"}'
                    })

                    expect(token).to.be.instanceOf(Serializable)
                    expect(token).to.be.instanceOf(TokenContent)
                    expect(token).to.be.instanceOf(TokenContentRelationshipTemplate)
                    expect(token).not.to.be.instanceOf(TokenContentString)
                    expect(token).not.to.be.instanceOf(TokenContentGeneric)
                    expect(token.content).to.exist
                    expect(token.content).to.be.instanceOf(RelationshipTemplate)
                    expect(token.notToBeSerialized).to.exist
                    expect(token.notToBeSerialized).to.equal("avalue")
                    expect(token.title).to.exist
                    expect(token.title).to.equal("Test")
                    expect(token.content.template).to.exist
                    expect(token.content.template.myprop).to.exist
                    expect(token.content.template.myprop).to.equal("myvalue")
                })

                it("from() creates instance from given instance", function () {
                    const useToken: any = TokenContentRelationshipTemplate.from({
                        title: "Test",
                        content: '{"template":"{\\"myprop\\":\\"myvalue\\"}"}'
                    })
                    const token: any = TokenContentRelationshipTemplate.from(useToken)

                    expect(token).to.be.instanceOf(Serializable)
                    expect(token).to.be.instanceOf(TokenContent)
                    expect(token).to.be.instanceOf(TokenContentRelationshipTemplate)
                    expect(token).not.to.be.instanceOf(TokenContentString)
                    expect(token).not.to.be.instanceOf(TokenContentGeneric)
                    expect(token.content).to.exist
                    expect(token.content).to.be.instanceOf(RelationshipTemplate)
                    expect(token.notToBeSerialized).to.exist
                    expect(token.notToBeSerialized).to.equal("avalue")
                    expect(token.title).to.exist
                    expect(token.title).to.equal("Test")
                    expect(token.content.template).to.exist
                    expect(token.content.template.myprop).to.exist
                    expect(token.content.template.myprop).to.equal("myvalue")
                })

                it("from() creates instance from given object", function () {
                    const useToken: any = TokenContentRelationshipTemplate.from({
                        title: "Test",
                        content: '{"template":"{\\"myprop\\":\\"myvalue\\"}"}'
                    })
                    const object: any = useToken.toJSON()
                    expect(object["@type"]).to.equal("TokenContentRelationshipTemplate")
                    expect(object["@context"]).to.equal("https://schema.local.corp")
                    expect(object.title).to.exist
                    expect(object.content).to.exist
                    expect(object.optionalContent).to.not.exist
                    expect(object.content.template).to.exist
                    expect(object.content["@type"]).to.not.exist
                    expect(object.content["@context"]).to.not.exist
                    const token: any = TokenContentRelationshipTemplate.from(object)

                    expect(token).to.be.instanceOf(Serializable)
                    expect(token).to.be.instanceOf(TokenContent)
                    expect(token).to.be.instanceOf(TokenContentRelationshipTemplate)
                    expect(token).not.to.be.instanceOf(TokenContentString)
                    expect(token).not.to.be.instanceOf(TokenContentGeneric)
                    expect(token.content).to.exist
                    expect(token.content).to.be.instanceOf(RelationshipTemplate)
                    expect(token.notToBeSerialized).to.exist
                    expect(token.notToBeSerialized).to.equal("avalue")
                    expect(token.title).to.exist
                    expect(token.title).to.equal("Test")
                    expect(token.content.template).to.exist
                    expect(token.content.template.myprop).to.exist
                    expect(token.content.template.myprop).to.equal("myvalue")
                })

                it("deserialize() creates instance from given string", function () {
                    const str = '{"title":"Test","content":"{\\"template\\":{\\"myprop\\":\\"myvalue\\"}}"}'
                    const token: any = TokenContentRelationshipTemplate.deserialize(str)

                    expect(token).to.be.instanceOf(Serializable)
                    expect(token).to.be.instanceOf(TokenContent)
                    expect(token).to.be.instanceOf(TokenContentRelationshipTemplate)
                    expect(token).not.to.be.instanceOf(TokenContentString)
                    expect(token).not.to.be.instanceOf(TokenContentGeneric)
                    expect(token.content).to.exist
                    expect(token.content).to.be.instanceOf(RelationshipTemplate)
                    expect(token.notToBeSerialized).to.exist
                    expect(token.notToBeSerialized).to.equal("avalue")
                    expect(token.title).to.exist
                    expect(token.title).to.equal("Test")
                    expect(token.content.template).to.exist
                    expect(token.content.template.myprop).to.exist
                    expect(token.content.template.myprop).to.equal("myvalue")
                })

                it("serialize() creates string from given instance", function () {
                    const token: any = TokenContentString.deserialize(
                        '{"title":"Test","content":"{\\"template\\":{\\"myprop\\":\\"myvalue\\"}}"}'
                    )
                    const string: string = token.serialize()
                    expect(string).to.equal(
                        '{"@context":"https://schema.local.corp","@type":"TokenContentString","content":"{\\"template\\":{\\"myprop\\":\\"myvalue\\"}}","title":"Test"}'
                    )
                })

                it("multiple de/serialization works", function () {
                    let token: any = TokenContentString.deserialize(
                        '{"title":"Test","content":"{\\"template\\":{\\"myprop\\":\\"myvalue\\"}}"}'
                    )
                    let string: string = token.serialize()
                    token = TokenContentString.deserialize(string)
                    string = token.serialize()
                    token = TokenContentString.deserialize(string)
                    string = token.serialize()
                    expect(string).to.equal(
                        '{"@context":"https://schema.local.corp","@type":"TokenContentString","content":"{\\"template\\":{\\"myprop\\":\\"myvalue\\"}}","title":"Test"}'
                    )
                })
            })

            describe("TokenContentGeneric", function () {
                it("from() creates instance from given interface", function () {
                    const token: any = TokenContentGeneric.from({
                        title: "Test",
                        content: "someContent"
                    })

                    expect(token).to.be.instanceOf(Serializable)
                    expect(token).to.be.instanceOf(TokenContent)
                    expect(token).to.be.instanceOf(TokenContentGeneric)
                    expect(token).not.to.be.instanceOf(TokenContentRelationshipTemplate)
                    expect(token).not.to.be.instanceOf(TokenContentString)
                    expect(token.notToBeSerialized).to.exist
                    expect(token.notToBeSerialized).to.equal("avalue")
                    expect(token.title).to.exist
                    expect(token.title).to.equal("Test")
                    expect(token.content).to.exist
                    expect(token.content).to.be.a("string")
                    expect(token.content).to.equal("someContent")
                })

                it("from() creates instance from given interface (1)", function () {
                    const token: any = TokenContentGeneric.from({
                        title: "Test",
                        content: true
                    })

                    expect(token).to.be.instanceOf(Serializable)
                    expect(token).to.be.instanceOf(TokenContent)
                    expect(token).to.be.instanceOf(TokenContentGeneric)
                    expect(token).not.to.be.instanceOf(TokenContentRelationshipTemplate)
                    expect(token).not.to.be.instanceOf(TokenContentString)
                    expect(token.notToBeSerialized).to.exist
                    expect(token.notToBeSerialized).to.equal("avalue")
                    expect(token.title).to.exist
                    expect(token.title).to.equal("Test")
                    expect(token.content).to.exist
                    expect(token.content).to.be.a("boolean")
                    expect(token.content).to.equal(true)
                })

                it("from() creates instance from given interface (2)", function () {
                    const token: any = TokenContentGeneric.from({
                        title: "Test",
                        content: 5
                    })

                    expect(token).to.be.instanceOf(Serializable)
                    expect(token).to.be.instanceOf(TokenContent)
                    expect(token).to.be.instanceOf(TokenContentGeneric)
                    expect(token).not.to.be.instanceOf(TokenContentRelationshipTemplate)
                    expect(token).not.to.be.instanceOf(TokenContentString)
                    expect(token.notToBeSerialized).to.exist
                    expect(token.notToBeSerialized).to.equal("avalue")
                    expect(token.title).to.exist
                    expect(token.title).to.equal("Test")
                    expect(token.content).to.exist
                    expect(token.content).to.be.a("number")
                    expect(token.content).to.equal(5)
                })

                it("from() creates instance from given instance (1)", function () {
                    const useToken: any = TokenContentGeneric.from({
                        title: "Test",
                        content: "someContent"
                    })

                    const token: any = TokenContentGeneric.from(useToken)

                    expect(token).to.be.instanceOf(Serializable)
                    expect(token).to.be.instanceOf(TokenContent)
                    expect(token).to.be.instanceOf(TokenContentGeneric)
                    expect(token).not.to.be.instanceOf(TokenContentRelationshipTemplate)
                    expect(token).not.to.be.instanceOf(TokenContentString)
                    expect(token.notToBeSerialized).to.exist
                    expect(token.notToBeSerialized).to.equal("avalue")
                    expect(token.title).to.exist
                    expect(token.title).to.equal("Test")
                    expect(token.content).to.exist
                    expect(token.content).to.be.a("string")
                    expect(token.content).to.equal("someContent")
                })

                it("from() creates instance from given instance (2)", function () {
                    const useToken: any = TokenContentGeneric.from({
                        title: "Test",
                        content: true
                    })

                    const token: any = TokenContentGeneric.from(useToken)

                    expect(token).to.be.instanceOf(Serializable)
                    expect(token).to.be.instanceOf(TokenContent)
                    expect(token).to.be.instanceOf(TokenContentGeneric)
                    expect(token).not.to.be.instanceOf(TokenContentRelationshipTemplate)
                    expect(token).not.to.be.instanceOf(TokenContentString)
                    expect(token.notToBeSerialized).to.exist
                    expect(token.notToBeSerialized).to.equal("avalue")
                    expect(token.title).to.exist
                    expect(token.title).to.equal("Test")
                    expect(token.content).to.exist
                    expect(token.content).to.be.a("boolean")
                    expect(token.content).to.equal(true)
                })

                it("from() creates instance from given instance (3)", function () {
                    const useToken: any = TokenContentGeneric.from({
                        title: "Test",
                        content: 5
                    })

                    const token: any = TokenContentGeneric.from(useToken)

                    expect(token).to.be.instanceOf(Serializable)
                    expect(token).to.be.instanceOf(TokenContent)
                    expect(token).to.be.instanceOf(TokenContentGeneric)
                    expect(token).not.to.be.instanceOf(TokenContentRelationshipTemplate)
                    expect(token).not.to.be.instanceOf(TokenContentString)
                    expect(token.notToBeSerialized).to.exist
                    expect(token.notToBeSerialized).to.equal("avalue")
                    expect(token.title).to.exist
                    expect(token.title).to.equal("Test")
                    expect(token.content).to.exist
                    expect(token.content).to.be.a("number")
                    expect(token.content).to.equal(5)
                })

                it("from() creates instance from given object (1)", function () {
                    const useToken: any = TokenContentGeneric.from({
                        title: "Test",
                        content: "someContent"
                    })

                    const object: Object = useToken.toJSON()

                    const token: any = TokenContentGeneric.from(object)

                    expect(token).to.be.instanceOf(Serializable)
                    expect(token).to.be.instanceOf(TokenContent)
                    expect(token).to.be.instanceOf(TokenContentGeneric)
                    expect(token).not.to.be.instanceOf(TokenContentRelationshipTemplate)
                    expect(token).not.to.be.instanceOf(TokenContentString)
                    expect(token.notToBeSerialized).to.exist
                    expect(token.notToBeSerialized).to.equal("avalue")
                    expect(token.title).to.exist
                    expect(token.title).to.equal("Test")
                    expect(token.content).to.exist
                    expect(token.content).to.be.a("string")
                    expect(token.content).to.equal("someContent")
                })

                it("from() creates instance from given object (2)", function () {
                    const useToken: any = TokenContentGeneric.from({
                        title: "Test",
                        content: true
                    })

                    const object: Object = useToken.toJSON()

                    const token: any = TokenContentGeneric.from(object)

                    expect(token).to.be.instanceOf(Serializable)
                    expect(token).to.be.instanceOf(TokenContent)
                    expect(token).to.be.instanceOf(TokenContentGeneric)
                    expect(token).not.to.be.instanceOf(TokenContentRelationshipTemplate)
                    expect(token).not.to.be.instanceOf(TokenContentString)
                    expect(token.notToBeSerialized).to.exist
                    expect(token.notToBeSerialized).to.equal("avalue")
                    expect(token.title).to.exist
                    expect(token.title).to.equal("Test")
                    expect(token.content).to.exist
                    expect(token.content).to.be.a("boolean")
                    expect(token.content).to.equal(true)
                })

                it("from() creates instance from given object (3)", function () {
                    const useToken: any = TokenContentGeneric.from({
                        title: "Test",
                        content: 5
                    })

                    const object: Object = useToken.toJSON()

                    const token: any = TokenContentGeneric.from(object)

                    expect(token).to.be.instanceOf(Serializable)
                    expect(token).to.be.instanceOf(TokenContent)
                    expect(token).to.be.instanceOf(TokenContentGeneric)
                    expect(token).not.to.be.instanceOf(TokenContentRelationshipTemplate)
                    expect(token).not.to.be.instanceOf(TokenContentString)
                    expect(token.notToBeSerialized).to.exist
                    expect(token.notToBeSerialized).to.equal("avalue")
                    expect(token.title).to.exist
                    expect(token.title).to.equal("Test")
                    expect(token.content).to.exist
                    expect(token.content).to.be.a("number")
                    expect(token.content).to.equal(5)
                })

                it("deserialize() creates instance from given string", function () {
                    const token: any = TokenContentGeneric.deserialize('{"title":"Test","content":"someContent"}')

                    expect(token).to.be.instanceOf(Serializable)
                    expect(token).to.be.instanceOf(TokenContent)
                    expect(token).to.be.instanceOf(TokenContentGeneric)
                    expect(token).not.to.be.instanceOf(TokenContentRelationshipTemplate)
                    expect(token).not.to.be.instanceOf(TokenContentString)
                    expect(token.notToBeSerialized).to.exist
                    expect(token.notToBeSerialized).to.equal("avalue")
                    expect(token.title).to.exist
                    expect(token.title).to.equal("Test")
                    expect(token.content).to.exist
                    expect(token.content).to.equal("someContent")
                })

                it("serialize() creates string from given instance (1)", function () {
                    const token: any = TokenContentGeneric.deserialize('{"title":"Test","content":"someContent"}')
                    const string: string = token.serialize()
                    expect(string).to.equal(
                        '{"@context":"https://schema.local.corp","@type":"TokenContentGeneric","content":"someContent","title":"Test"}'
                    )
                })

                it("serialize() creates string from given instance (2)", function () {
                    const token: any = TokenContentGeneric.deserialize('{"title":"Test","content":true}')
                    const string: string = token.serialize()
                    expect(string).to.equal(
                        '{"@context":"https://schema.local.corp","@type":"TokenContentGeneric","content":true,"title":"Test"}'
                    )
                })

                it("serialize() creates string from given instance", function () {
                    const token: any = TokenContentGeneric.deserialize('{"title":"Test","content":5}')
                    const string: string = token.serialize()
                    expect(string).to.equal(
                        '{"@context":"https://schema.local.corp","@type":"TokenContentGeneric","content":5,"title":"Test"}'
                    )
                })

                it("multiple de/serialization works", function () {
                    let token: any = TokenContentGeneric.deserialize('{"title":"Test","content":"someContent"}')
                    let string: string = token.serialize()
                    token = TokenContentGeneric.deserialize(string)
                    string = token.serialize()
                    token = TokenContentGeneric.deserialize(string)
                    string = token.serialize()
                    expect(string).to.equal(
                        '{"@context":"https://schema.local.corp","@type":"TokenContentGeneric","content":"someContent","title":"Test"}'
                    )
                })

                it("multiple de/serialization works (1)", function () {
                    let token: any = TokenContentGeneric.deserialize('{"title":"Test","content":true}')
                    let string: string = token.serialize()
                    token = TokenContentGeneric.deserialize(string)
                    string = token.serialize()
                    token = TokenContentGeneric.deserialize(string)
                    string = token.serialize()
                    expect(string).to.equal(
                        '{"@context":"https://schema.local.corp","@type":"TokenContentGeneric","content":true,"title":"Test"}'
                    )
                })

                it("multiple de/serialization works (2)", function () {
                    let token: any = TokenContentGeneric.deserialize('{"title":"Test","content":5}')
                    let string: string = token.serialize()
                    token = TokenContentGeneric.deserialize(string)
                    string = token.serialize()
                    token = TokenContentGeneric.deserialize(string)
                    string = token.serialize()
                    expect(string).to.equal(
                        '{"@context":"https://schema.local.corp","@type":"TokenContentGeneric","content":5,"title":"Test"}'
                    )
                })
            })
        })
    }
}
