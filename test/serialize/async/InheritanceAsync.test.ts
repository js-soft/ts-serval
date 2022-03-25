import { schema, SerializableAsync, serialize } from "@js-soft/ts-serval"
import { expect } from "chai"

/**
 *
 * SerializableAsync
 *  |- RelationshipTemplateAsync
 *  |- TokenContentAsync
 *  |   |- TokenGenericAsync
 *  |   |- TokenContentRelationshipTemplateAsync
 *  |   |- TokenContentStringAsync
 */

@schema("https://schema.local.corp", "RelationshipTemplateAsync")
class RelationshipTemplateAsync extends SerializableAsync {
    @serialize({ deserializeStrings: true })
    public template: Object

    public static async deserialize(value: string): Promise<RelationshipTemplateAsync> {
        return await super.deserializeT(value)
    }

    public static async from(value: Object): Promise<RelationshipTemplateAsync> {
        return await super.fromT(value)
    }
}

@schema("https://schema.local.corp", "TokenContentAsync")
class TokenContentAsync extends SerializableAsync {
    public notToBeSerialized = "avalue"

    @serialize()
    public title: string

    public static async deserialize(value: string): Promise<TokenContentAsync> {
        return await super.deserializeT(value)
    }

    public static async from(value: Object): Promise<TokenContentAsync> {
        return await super.fromT(value)
    }
}

@schema("https://schema.local.corp", "TokenContentGenericAsync")
class TokenContentGenericAsync extends TokenContentAsync {
    @serialize({ any: true, deserializeStrings: true })
    public content: any

    public static async deserialize(value: string): Promise<TokenContentGenericAsync> {
        return await super.deserializeT(value)
    }

    public static async from(value: Object): Promise<TokenContentGenericAsync> {
        return await super.fromT(value)
    }
}

@schema("https://schema.local.corp", "TokenContentRelationshipTemplateAsync")
class TokenContentRelationshipTemplateAsync extends TokenContentAsync {
    @serialize({ deserializeStrings: true })
    public content: RelationshipTemplateAsync

    @serialize({ optional: true })
    public optionalContent: string

    public static async deserialize(value: string): Promise<TokenContentRelationshipTemplateAsync> {
        return await super.deserializeT(value)
    }

    public static async from(value: Object): Promise<TokenContentRelationshipTemplateAsync> {
        return await super.fromT(value)
    }
}

@schema("https://schema.local.corp", "TokenContentStringAsync")
class TokenContentStringAsync extends TokenContentAsync {
    @serialize()
    public content: String

    public static async deserialize(value: string): Promise<TokenContentStringAsync> {
        return await super.deserializeT(value)
    }

    public static async from(value: Object): Promise<TokenContentStringAsync> {
        return await super.fromT(value)
    }
}

@schema("https://schema.local.corp", "TokenRelationshipTemplatesAsync")
class TokenRelationshipTemplatesAsync extends SerializableAsync {
    @serialize({ type: TokenContentRelationshipTemplateAsync })
    public templates: TokenContentRelationshipTemplateAsync[]

    public static async deserialize(value: string): Promise<TokenRelationshipTemplatesAsync> {
        return await super.deserializeT(value)
    }

    public static async from(value: Object): Promise<TokenRelationshipTemplatesAsync> {
        return await super.fromT(value)
    }
}

export class InheritanceAsyncTest {
    public static init(): void {
        describe("InheritanceAsync", function () {
            describe("TokenContentString", function () {
                it("from() creates instance from given interface", async function () {
                    const token: any = await TokenContentStringAsync.from({
                        title: "Test",
                        content: "someContent"
                    })

                    expect(token).to.be.instanceOf(SerializableAsync)
                    expect(token).to.be.instanceOf(TokenContentAsync)
                    expect(token).to.be.instanceOf(TokenContentStringAsync)
                    expect(token).not.to.be.instanceOf(TokenContentRelationshipTemplateAsync)
                    expect(token).not.to.be.instanceOf(TokenContentGenericAsync)
                    expect(token.notToBeSerialized).to.exist
                    expect(token.notToBeSerialized).to.equal("avalue")
                    expect(token.title).to.exist
                    expect(token.title).to.equal("Test")
                    expect(token.content).to.exist
                    expect(token.content).to.equal("someContent")
                })

                it("from() creates instance from given instance", async function () {
                    const useToken: any = await TokenContentStringAsync.from({
                        title: "Test",
                        content: "someContent"
                    })
                    const token: any = await TokenContentStringAsync.from(useToken)

                    expect(token).to.be.instanceOf(SerializableAsync)
                    expect(token).to.be.instanceOf(TokenContentAsync)
                    expect(token).to.be.instanceOf(TokenContentStringAsync)
                    expect(token).not.to.be.instanceOf(TokenContentRelationshipTemplateAsync)
                    expect(token).not.to.be.instanceOf(TokenContentGenericAsync)
                    expect(token.notToBeSerialized).to.exist
                    expect(token.notToBeSerialized).to.equal("avalue")
                    expect(token.title).to.exist
                    expect(token.title).to.equal("Test")
                    expect(token.content).to.exist
                    expect(token.content).to.equal("someContent")
                })

                it("from() creates instance from given object", async function () {
                    const useToken: any = await TokenContentStringAsync.from({
                        title: "Test",
                        content: "someContent"
                    })
                    const object: Object = useToken.toJSON()
                    const token: any = await TokenContentStringAsync.from(object)

                    expect(token).to.be.instanceOf(SerializableAsync)
                    expect(token).to.be.instanceOf(TokenContentAsync)
                    expect(token).to.be.instanceOf(TokenContentStringAsync)
                    expect(token).not.to.be.instanceOf(TokenContentRelationshipTemplateAsync)
                    expect(token).not.to.be.instanceOf(TokenContentGenericAsync)
                    expect(token.notToBeSerialized).to.exist
                    expect(token.notToBeSerialized).to.equal("avalue")
                    expect(token.title).to.exist
                    expect(token.title).to.equal("Test")
                    expect(token.content).to.exist
                    expect(token.content).to.equal("someContent")
                })

                it("deserialize() creates instance from given string", async function () {
                    const token: any = await TokenContentStringAsync.deserialize(
                        '{"content":"someContent","title":"Test"}'
                    )

                    expect(token).to.be.instanceOf(SerializableAsync)
                    expect(token).to.be.instanceOf(TokenContentAsync)
                    expect(token).to.be.instanceOf(TokenContentStringAsync)
                    expect(token).not.to.be.instanceOf(TokenContentRelationshipTemplateAsync)
                    expect(token).not.to.be.instanceOf(TokenContentGenericAsync)
                    expect(token.notToBeSerialized).to.exist
                    expect(token.notToBeSerialized).to.equal("avalue")
                    expect(token.title).to.exist
                    expect(token.title).to.equal("Test")
                    expect(token.content).to.exist
                    expect(token.content).to.equal("someContent")
                })

                it("serialize() creates string from given instance", async function () {
                    const token: any = await TokenContentStringAsync.deserialize(
                        '{"title":"Test","content":"someContent"}'
                    )
                    const string: string = token.serialize()
                    expect(string).to.equal(
                        '{"@context":"https://schema.local.corp","@type":"TokenContentStringAsync","content":"someContent","title":"Test"}'
                    )
                })

                it("multiple de/serialization works", async function () {
                    let token: any = await TokenContentStringAsync.deserialize(
                        '{"title":"Test","content":"someContent"}'
                    )
                    let string: string = token.serialize()
                    token = await TokenContentStringAsync.deserialize(string)
                    string = token.serialize()
                    token = await TokenContentStringAsync.deserialize(string)
                    string = token.serialize()
                    expect(string).to.equal(
                        '{"@context":"https://schema.local.corp","@type":"TokenContentStringAsync","content":"someContent","title":"Test"}'
                    )
                })
            })

            describe("TokenRelationshipTemplatesAsync", function () {
                it("from() creates instance from given interface (all objects)", async function () {
                    const token: any = await TokenRelationshipTemplatesAsync.from({
                        templates: [
                            await TokenContentRelationshipTemplateAsync.from({
                                title: "Test",
                                content: await RelationshipTemplateAsync.from({
                                    template: { myprop: "myvalue" }
                                })
                            }),
                            await TokenContentRelationshipTemplateAsync.from({
                                title: "Test 2",
                                content: await RelationshipTemplateAsync.from({
                                    template: { myprop: "myvalue" }
                                }),
                                optionalContent: "someOptionalContent"
                            })
                        ]
                    })

                    expect(token).to.be.instanceOf(SerializableAsync)
                    expect(token).to.be.instanceOf(TokenRelationshipTemplatesAsync)
                    expect(token.templates).to.exist
                    expect(token.templates).to.be.instanceOf(Array)
                    expect(token.templates.length).to.equal(2)

                    const item0 = token.templates[0]
                    expect(item0).to.be.instanceOf(SerializableAsync)
                    expect(item0).to.be.instanceOf(TokenContentAsync)
                    expect(item0).to.be.instanceOf(TokenContentRelationshipTemplateAsync)
                    expect(item0.optionalContent).not.to.exist
                    expect(item0.title).to.exist
                    expect(item0.title).to.equal("Test")
                    expect(item0.notToBeSerialized).to.exist
                    expect(item0.notToBeSerialized).to.equal("avalue")
                    expect(item0.content.template).to.exist
                    expect(item0.content.template.myprop).to.exist

                    const item1 = token.templates[1]
                    expect(item1).to.be.instanceOf(SerializableAsync)
                    expect(item1).to.be.instanceOf(TokenContentAsync)
                    expect(item1).to.be.instanceOf(TokenContentRelationshipTemplateAsync)
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

            describe("TokenContentRelationshipTemplateAsync", function () {
                it("from() creates instance from given interface (all objects)", async function () {
                    const token: any = await TokenContentRelationshipTemplateAsync.from({
                        title: "Test",
                        content: await RelationshipTemplateAsync.from({
                            template: { myprop: "myvalue" }
                        })
                    })

                    expect(token).to.be.instanceOf(SerializableAsync)
                    expect(token).to.be.instanceOf(TokenContentAsync)
                    expect(token).to.be.instanceOf(TokenContentRelationshipTemplateAsync)
                    expect(token).not.to.be.instanceOf(TokenContentStringAsync)
                    expect(token).not.to.be.instanceOf(TokenContentGenericAsync)
                    expect(token.content).to.exist
                    expect(token.content).to.be.instanceOf(RelationshipTemplateAsync)
                    expect(token.optionalContent).not.to.exist
                    expect(token.notToBeSerialized).to.exist
                    expect(token.notToBeSerialized).to.equal("avalue")
                    expect(token.title).to.exist
                    expect(token.title).to.equal("Test")
                    expect(token.content.template).to.exist
                    expect(token.content.template.myprop).to.exist
                })

                it("from() creates instance from given interface (all objects, optional content)", async function () {
                    const token: any = await TokenContentRelationshipTemplateAsync.from({
                        title: "Test",
                        content: await RelationshipTemplateAsync.from({
                            template: { myprop: "myvalue" }
                        }),
                        optionalContent: "Testing"
                    })

                    expect(token).to.be.instanceOf(SerializableAsync)
                    expect(token).to.be.instanceOf(TokenContentAsync)
                    expect(token).to.be.instanceOf(TokenContentRelationshipTemplateAsync)
                    expect(token).not.to.be.instanceOf(TokenContentStringAsync)
                    expect(token).not.to.be.instanceOf(TokenContentGenericAsync)
                    expect(token.content).to.exist
                    expect(token.content).to.be.instanceOf(RelationshipTemplateAsync)
                    expect(token.optionalContent).to.exist
                    expect(token.optionalContent).to.equal("Testing")
                    expect(token.notToBeSerialized).to.exist
                    expect(token.notToBeSerialized).to.equal("avalue")
                    expect(token.title).to.exist
                    expect(token.title).to.equal("Test")
                    expect(token.content.template).to.exist
                    expect(token.content.template.myprop).to.exist
                })

                it("from() creates instance from given interface (with strings to deserialize)", async function () {
                    const token: any = await TokenContentRelationshipTemplateAsync.from({
                        title: "Test",
                        content: '{"template":"{\\"myprop\\":\\"myvalue\\"}"}'
                    })

                    expect(token).to.be.instanceOf(SerializableAsync)
                    expect(token).to.be.instanceOf(TokenContentAsync)
                    expect(token).to.be.instanceOf(TokenContentRelationshipTemplateAsync)
                    expect(token).not.to.be.instanceOf(TokenContentStringAsync)
                    expect(token).not.to.be.instanceOf(TokenContentGenericAsync)
                    expect(token.content).to.exist
                    expect(token.content).to.be.instanceOf(RelationshipTemplateAsync)
                    expect(token.notToBeSerialized).to.exist
                    expect(token.notToBeSerialized).to.equal("avalue")
                    expect(token.title).to.exist
                    expect(token.title).to.equal("Test")
                    expect(token.content.template).to.exist
                    expect(token.content.template.myprop).to.exist
                    expect(token.content.template.myprop).to.equal("myvalue")
                })

                it("from() creates instance from given instance", async function () {
                    const useToken: any = await TokenContentRelationshipTemplateAsync.from({
                        title: "Test",
                        content: '{"template":"{\\"myprop\\":\\"myvalue\\"}"}'
                    })
                    const token: any = await TokenContentRelationshipTemplateAsync.from(useToken)

                    expect(token).to.be.instanceOf(SerializableAsync)
                    expect(token).to.be.instanceOf(TokenContentAsync)
                    expect(token).to.be.instanceOf(TokenContentRelationshipTemplateAsync)
                    expect(token).not.to.be.instanceOf(TokenContentStringAsync)
                    expect(token).not.to.be.instanceOf(TokenContentGenericAsync)
                    expect(token.content).to.exist
                    expect(token.content).to.be.instanceOf(RelationshipTemplateAsync)
                    expect(token.notToBeSerialized).to.exist
                    expect(token.notToBeSerialized).to.equal("avalue")
                    expect(token.title).to.exist
                    expect(token.title).to.equal("Test")
                    expect(token.content.template).to.exist
                    expect(token.content.template.myprop).to.exist
                    expect(token.content.template.myprop).to.equal("myvalue")
                })

                it("from() creates instance from given object", async function () {
                    const useToken: any = await TokenContentRelationshipTemplateAsync.from({
                        title: "Test",
                        content: '{"template":"{\\"myprop\\":\\"myvalue\\"}"}'
                    })
                    const object: any = useToken.toJSON()
                    expect(object["@type"]).to.equal("TokenContentRelationshipTemplateAsync")
                    expect(object["@context"]).to.equal("https://schema.local.corp")
                    expect(object.title).to.exist
                    expect(object.content).to.exist
                    expect(object.optionalContent).to.not.exist
                    expect(object.content.template).to.exist
                    expect(object.content["@type"]).to.not.exist
                    expect(object.content["@context"]).to.not.exist
                    const token: any = await TokenContentRelationshipTemplateAsync.from(object)

                    expect(token).to.be.instanceOf(SerializableAsync)
                    expect(token).to.be.instanceOf(TokenContentAsync)
                    expect(token).to.be.instanceOf(TokenContentRelationshipTemplateAsync)
                    expect(token).not.to.be.instanceOf(TokenContentStringAsync)
                    expect(token).not.to.be.instanceOf(TokenContentGenericAsync)
                    expect(token.content).to.exist
                    expect(token.content).to.be.instanceOf(RelationshipTemplateAsync)
                    expect(token.notToBeSerialized).to.exist
                    expect(token.notToBeSerialized).to.equal("avalue")
                    expect(token.title).to.exist
                    expect(token.title).to.equal("Test")
                    expect(token.content.template).to.exist
                    expect(token.content.template.myprop).to.exist
                    expect(token.content.template.myprop).to.equal("myvalue")
                })

                it("deserialize() creates instance from given string", async function () {
                    const str = '{"title":"Test","content":"{\\"template\\":{\\"myprop\\":\\"myvalue\\"}}"}'
                    const token: any = await TokenContentRelationshipTemplateAsync.deserialize(str)

                    expect(token).to.be.instanceOf(SerializableAsync)
                    expect(token).to.be.instanceOf(TokenContentAsync)
                    expect(token).to.be.instanceOf(TokenContentRelationshipTemplateAsync)
                    expect(token).not.to.be.instanceOf(TokenContentStringAsync)
                    expect(token).not.to.be.instanceOf(TokenContentGenericAsync)
                    expect(token.content).to.exist
                    expect(token.content).to.be.instanceOf(RelationshipTemplateAsync)
                    expect(token.notToBeSerialized).to.exist
                    expect(token.notToBeSerialized).to.equal("avalue")
                    expect(token.title).to.exist
                    expect(token.title).to.equal("Test")
                    expect(token.content.template).to.exist
                    expect(token.content.template.myprop).to.exist
                    expect(token.content.template.myprop).to.equal("myvalue")
                })

                it("serialize() creates string from given instance", async function () {
                    const token: any = await TokenContentStringAsync.deserialize(
                        '{"title":"Test","content":"{\\"template\\":{\\"myprop\\":\\"myvalue\\"}}"}'
                    )
                    const string: string = token.serialize()
                    expect(string).to.equal(
                        '{"@context":"https://schema.local.corp","@type":"TokenContentStringAsync","content":"{\\"template\\":{\\"myprop\\":\\"myvalue\\"}}","title":"Test"}'
                    )
                })

                it("multiple de/serialization works", async function () {
                    let token: any = await TokenContentStringAsync.deserialize(
                        '{"title":"Test","content":"{\\"template\\":{\\"myprop\\":\\"myvalue\\"}}"}'
                    )
                    let string: string = token.serialize()
                    token = await TokenContentStringAsync.deserialize(string)
                    string = token.serialize()
                    token = await TokenContentStringAsync.deserialize(string)
                    string = token.serialize()
                    expect(string).to.equal(
                        '{"@context":"https://schema.local.corp","@type":"TokenContentStringAsync","content":"{\\"template\\":{\\"myprop\\":\\"myvalue\\"}}","title":"Test"}'
                    )
                })
            })

            describe("TokenContentGenericAsync", function () {
                it("from() creates instance from given interface", async function () {
                    const token: any = await TokenContentGenericAsync.from({
                        title: "Test",
                        content: "someContent"
                    })

                    expect(token).to.be.instanceOf(SerializableAsync)
                    expect(token).to.be.instanceOf(TokenContentAsync)
                    expect(token).to.be.instanceOf(TokenContentGenericAsync)
                    expect(token).not.to.be.instanceOf(TokenContentRelationshipTemplateAsync)
                    expect(token).not.to.be.instanceOf(TokenContentStringAsync)
                    expect(token.notToBeSerialized).to.exist
                    expect(token.notToBeSerialized).to.equal("avalue")
                    expect(token.title).to.exist
                    expect(token.title).to.equal("Test")
                    expect(token.content).to.exist
                    expect(token.content).to.be.a("string")
                    expect(token.content).to.equal("someContent")
                })

                it("from() creates instance from given interface (1)", async function () {
                    const token: any = await TokenContentGenericAsync.from({
                        title: "Test",
                        content: true
                    })

                    expect(token).to.be.instanceOf(SerializableAsync)
                    expect(token).to.be.instanceOf(TokenContentAsync)
                    expect(token).to.be.instanceOf(TokenContentGenericAsync)
                    expect(token).not.to.be.instanceOf(TokenContentRelationshipTemplateAsync)
                    expect(token).not.to.be.instanceOf(TokenContentStringAsync)
                    expect(token.notToBeSerialized).to.exist
                    expect(token.notToBeSerialized).to.equal("avalue")
                    expect(token.title).to.exist
                    expect(token.title).to.equal("Test")
                    expect(token.content).to.exist
                    expect(token.content).to.be.a("boolean")
                    expect(token.content).to.equal(true)
                })

                it("from() creates instance from given interface (2)", async function () {
                    const token: any = await TokenContentGenericAsync.from({
                        title: "Test",
                        content: 5
                    })

                    expect(token).to.be.instanceOf(SerializableAsync)
                    expect(token).to.be.instanceOf(TokenContentAsync)
                    expect(token).to.be.instanceOf(TokenContentGenericAsync)
                    expect(token).not.to.be.instanceOf(TokenContentRelationshipTemplateAsync)
                    expect(token).not.to.be.instanceOf(TokenContentStringAsync)
                    expect(token.notToBeSerialized).to.exist
                    expect(token.notToBeSerialized).to.equal("avalue")
                    expect(token.title).to.exist
                    expect(token.title).to.equal("Test")
                    expect(token.content).to.exist
                    expect(token.content).to.be.a("number")
                    expect(token.content).to.equal(5)
                })

                it("from() creates instance from given instance (1)", async function () {
                    const useToken: any = await TokenContentGenericAsync.from({
                        title: "Test",
                        content: "someContent"
                    })

                    const token: any = await TokenContentGenericAsync.from(useToken)

                    expect(token).to.be.instanceOf(SerializableAsync)
                    expect(token).to.be.instanceOf(TokenContentAsync)
                    expect(token).to.be.instanceOf(TokenContentGenericAsync)
                    expect(token).not.to.be.instanceOf(TokenContentRelationshipTemplateAsync)
                    expect(token).not.to.be.instanceOf(TokenContentStringAsync)
                    expect(token.notToBeSerialized).to.exist
                    expect(token.notToBeSerialized).to.equal("avalue")
                    expect(token.title).to.exist
                    expect(token.title).to.equal("Test")
                    expect(token.content).to.exist
                    expect(token.content).to.be.a("string")
                    expect(token.content).to.equal("someContent")
                })

                it("from() creates instance from given instance (2)", async function () {
                    const useToken: any = await TokenContentGenericAsync.from({
                        title: "Test",
                        content: true
                    })

                    const token: any = await TokenContentGenericAsync.from(useToken)

                    expect(token).to.be.instanceOf(SerializableAsync)
                    expect(token).to.be.instanceOf(TokenContentAsync)
                    expect(token).to.be.instanceOf(TokenContentGenericAsync)
                    expect(token).not.to.be.instanceOf(TokenContentRelationshipTemplateAsync)
                    expect(token).not.to.be.instanceOf(TokenContentStringAsync)
                    expect(token.notToBeSerialized).to.exist
                    expect(token.notToBeSerialized).to.equal("avalue")
                    expect(token.title).to.exist
                    expect(token.title).to.equal("Test")
                    expect(token.content).to.exist
                    expect(token.content).to.be.a("boolean")
                    expect(token.content).to.equal(true)
                })

                it("from() creates instance from given instance (3)", async function () {
                    const useToken: any = await TokenContentGenericAsync.from({
                        title: "Test",
                        content: 5
                    })

                    const token: any = await TokenContentGenericAsync.from(useToken)

                    expect(token).to.be.instanceOf(SerializableAsync)
                    expect(token).to.be.instanceOf(TokenContentAsync)
                    expect(token).to.be.instanceOf(TokenContentGenericAsync)
                    expect(token).not.to.be.instanceOf(TokenContentRelationshipTemplateAsync)
                    expect(token).not.to.be.instanceOf(TokenContentStringAsync)
                    expect(token.notToBeSerialized).to.exist
                    expect(token.notToBeSerialized).to.equal("avalue")
                    expect(token.title).to.exist
                    expect(token.title).to.equal("Test")
                    expect(token.content).to.exist
                    expect(token.content).to.be.a("number")
                    expect(token.content).to.equal(5)
                })

                it("from() creates instance from given object (1)", async function () {
                    const useToken: any = await TokenContentGenericAsync.from({
                        title: "Test",
                        content: "someContent"
                    })

                    const object: Object = useToken.toJSON()

                    const token: any = await TokenContentGenericAsync.from(object)

                    expect(token).to.be.instanceOf(SerializableAsync)
                    expect(token).to.be.instanceOf(TokenContentAsync)
                    expect(token).to.be.instanceOf(TokenContentGenericAsync)
                    expect(token).not.to.be.instanceOf(TokenContentRelationshipTemplateAsync)
                    expect(token).not.to.be.instanceOf(TokenContentStringAsync)
                    expect(token.notToBeSerialized).to.exist
                    expect(token.notToBeSerialized).to.equal("avalue")
                    expect(token.title).to.exist
                    expect(token.title).to.equal("Test")
                    expect(token.content).to.exist
                    expect(token.content).to.be.a("string")
                    expect(token.content).to.equal("someContent")
                })

                it("from() creates instance from given object (2)", async function () {
                    const useToken: any = await TokenContentGenericAsync.from({
                        title: "Test",
                        content: true
                    })

                    const object: Object = useToken.toJSON()

                    const token: any = await TokenContentGenericAsync.from(object)

                    expect(token).to.be.instanceOf(SerializableAsync)
                    expect(token).to.be.instanceOf(TokenContentAsync)
                    expect(token).to.be.instanceOf(TokenContentGenericAsync)
                    expect(token).not.to.be.instanceOf(TokenContentRelationshipTemplateAsync)
                    expect(token).not.to.be.instanceOf(TokenContentStringAsync)
                    expect(token.notToBeSerialized).to.exist
                    expect(token.notToBeSerialized).to.equal("avalue")
                    expect(token.title).to.exist
                    expect(token.title).to.equal("Test")
                    expect(token.content).to.exist
                    expect(token.content).to.be.a("boolean")
                    expect(token.content).to.equal(true)
                })

                it("from() creates instance from given object (3)", async function () {
                    const useToken: any = await TokenContentGenericAsync.from({
                        title: "Test",
                        content: 5
                    })

                    const object: Object = useToken.toJSON()

                    const token: any = await TokenContentGenericAsync.from(object)

                    expect(token).to.be.instanceOf(SerializableAsync)
                    expect(token).to.be.instanceOf(TokenContentAsync)
                    expect(token).to.be.instanceOf(TokenContentGenericAsync)
                    expect(token).not.to.be.instanceOf(TokenContentRelationshipTemplateAsync)
                    expect(token).not.to.be.instanceOf(TokenContentStringAsync)
                    expect(token.notToBeSerialized).to.exist
                    expect(token.notToBeSerialized).to.equal("avalue")
                    expect(token.title).to.exist
                    expect(token.title).to.equal("Test")
                    expect(token.content).to.exist
                    expect(token.content).to.be.a("number")
                    expect(token.content).to.equal(5)
                })

                it("deserialize() creates instance from given string", async function () {
                    const token: any = await TokenContentGenericAsync.deserialize(
                        '{"title":"Test","content":"someContent"}'
                    )

                    expect(token).to.be.instanceOf(SerializableAsync)
                    expect(token).to.be.instanceOf(TokenContentAsync)
                    expect(token).to.be.instanceOf(TokenContentGenericAsync)
                    expect(token).not.to.be.instanceOf(TokenContentRelationshipTemplateAsync)
                    expect(token).not.to.be.instanceOf(TokenContentStringAsync)
                    expect(token.notToBeSerialized).to.exist
                    expect(token.notToBeSerialized).to.equal("avalue")
                    expect(token.title).to.exist
                    expect(token.title).to.equal("Test")
                    expect(token.content).to.exist
                    expect(token.content).to.equal("someContent")
                })

                it("serialize() creates string from given instance (1)", async function () {
                    const token: any = await TokenContentGenericAsync.deserialize(
                        '{"title":"Test","content":"someContent"}'
                    )
                    const string: string = token.serialize()
                    expect(string).to.equal(
                        '{"@context":"https://schema.local.corp","@type":"TokenContentGenericAsync","content":"someContent","title":"Test"}'
                    )
                })

                it("serialize() creates string from given instance (2)", async function () {
                    const token: any = await TokenContentGenericAsync.deserialize('{"title":"Test","content":true}')
                    const string: string = token.serialize()
                    expect(string).to.equal(
                        '{"@context":"https://schema.local.corp","@type":"TokenContentGenericAsync","content":true,"title":"Test"}'
                    )
                })

                it("serialize() creates string from given instance", async function () {
                    const token: any = await TokenContentGenericAsync.deserialize('{"title":"Test","content":5}')
                    const string: string = token.serialize()
                    expect(string).to.equal(
                        '{"@context":"https://schema.local.corp","@type":"TokenContentGenericAsync","content":5,"title":"Test"}'
                    )
                })

                it("multiple de/serialization works", async function () {
                    let token: any = await TokenContentGenericAsync.deserialize(
                        '{"title":"Test","content":"someContent"}'
                    )
                    let string: string = token.serialize()
                    token = await TokenContentGenericAsync.deserialize(string)
                    string = token.serialize()
                    token = await TokenContentGenericAsync.deserialize(string)
                    string = token.serialize()
                    expect(string).to.equal(
                        '{"@context":"https://schema.local.corp","@type":"TokenContentGenericAsync","content":"someContent","title":"Test"}'
                    )
                })

                it("multiple de/serialization works (1)", async function () {
                    let token: any = await TokenContentGenericAsync.deserialize('{"title":"Test","content":true}')
                    let string: string = token.serialize()
                    token = await TokenContentGenericAsync.deserialize(string)
                    string = token.serialize()
                    token = await TokenContentGenericAsync.deserialize(string)
                    string = token.serialize()
                    expect(string).to.equal(
                        '{"@context":"https://schema.local.corp","@type":"TokenContentGenericAsync","content":true,"title":"Test"}'
                    )
                })

                it("multiple de/serialization works (2)", async function () {
                    let token: any = await TokenContentGenericAsync.deserialize('{"title":"Test","content":5}')
                    let string: string = token.serialize()
                    token = await TokenContentGenericAsync.deserialize(string)
                    string = token.serialize()
                    token = await TokenContentGenericAsync.deserialize(string)
                    string = token.serialize()
                    expect(string).to.equal(
                        '{"@context":"https://schema.local.corp","@type":"TokenContentGenericAsync","content":5,"title":"Test"}'
                    )
                })
            })
        })
    }
}
