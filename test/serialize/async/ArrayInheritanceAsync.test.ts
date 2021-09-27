import { schema, SerializableAsync, serialize } from "@js-soft/ts-serval"
import { expect } from "chai"

/**
 *
 * SerializableAsync
 *  |- RelationshipTemplateArrayAsync
 *  |- TokenContentArrayAsync
 *  |   |- TokenGenericAsync
 *  |   |- TokenContentRelationshipTemplateArrayAsync
 *  |   |- TokenContentStringArrayAsync
 */

@schema("https://schema.local.corp", "RelationshipTemplateArrayAsync")
class RelationshipTemplateArrayAsync extends SerializableAsync {
    @serialize()
    public template: Object

    public static async deserialize(value: string): Promise<RelationshipTemplateArrayAsync> {
        return await super.deserializeT(value, RelationshipTemplateArrayAsync)
    }

    public static async from(value: Object): Promise<RelationshipTemplateArrayAsync> {
        return await super.fromT(value, RelationshipTemplateArrayAsync)
    }
}

@schema("https://schema.local.corp", "TokenContentArrayAsync")
class TokenContentArrayAsync extends SerializableAsync {
    public notToBeSerialized = "avalue"

    @serialize()
    public title: string

    public static async deserialize(value: string): Promise<TokenContentArrayAsync> {
        return await super.deserializeT(value, TokenContentArrayAsync)
    }

    public static async from(value: Object): Promise<TokenContentArrayAsync> {
        return await super.fromT(value, TokenContentArrayAsync)
    }
}

@schema("https://schema.local.corp", "TokenContentRelationshipTemplateArrayAsync")
class TokenContentRelationshipTemplateArrayAsync extends TokenContentArrayAsync {
    @serialize()
    public content: RelationshipTemplateArrayAsync

    @serialize({ optional: true })
    public optionalContent: string

    public static async deserialize(value: string): Promise<TokenContentRelationshipTemplateArrayAsync> {
        return await super.deserializeT(value, TokenContentRelationshipTemplateArrayAsync)
    }

    public static async from(value: Object): Promise<TokenContentRelationshipTemplateArrayAsync> {
        return await super.fromT(value, TokenContentRelationshipTemplateArrayAsync)
    }
}

@schema("https://schema.local.corp", "TokenRelationshipTemplateArrayAsync")
class TokenRelationshipTemplateArrayAsync extends SerializableAsync {
    @serialize({ deserializeStrings: true, type: TokenContentRelationshipTemplateArrayAsync })
    public templates: TokenContentRelationshipTemplateArrayAsync[]

    public static async deserialize(value: string): Promise<TokenRelationshipTemplateArrayAsync> {
        return await super.deserializeT(value, TokenRelationshipTemplateArrayAsync)
    }

    public static async from(value: Object): Promise<TokenRelationshipTemplateArrayAsync> {
        return await super.fromT(value, TokenRelationshipTemplateArrayAsync)
    }
}

export class ArrayInheritanceAsyncTest {
    public static init(): void {
        function expectValidToken(token) {
            expect(token).to.be.instanceOf(SerializableAsync)
            expect(token).to.be.instanceOf(TokenRelationshipTemplateArrayAsync)
            expect(token.templates).to.exist
            expect(token.templates).to.be.instanceOf(Array)
            expect(token.templates.length).to.equal(2)

            const item0 = token.templates[0]
            expect(item0).to.be.instanceOf(SerializableAsync)
            expect(item0).to.be.instanceOf(TokenContentArrayAsync)
            expect(item0).to.be.instanceOf(TokenContentRelationshipTemplateArrayAsync)
            expect(item0.optionalContent).not.to.exist
            expect(item0.title).to.exist
            expect(item0.title).to.equal("Test")
            expect(item0.notToBeSerialized).to.exist
            expect(item0.notToBeSerialized).to.equal("avalue")
            expect(item0.content.template).to.exist
            expect(item0.content.template.myprop).to.exist

            const item1 = token.templates[1]
            expect(item1).to.be.instanceOf(SerializableAsync)
            expect(item1).to.be.instanceOf(TokenContentArrayAsync)
            expect(item1).to.be.instanceOf(TokenContentRelationshipTemplateArrayAsync)
            expect(item1.optionalContent).to.exist
            expect(item1.optionalContent).to.equal("someOptionalContent")
            expect(item1.title).to.exist
            expect(item1.title).to.equal("Test 2")
            expect(item1.notToBeSerialized).to.exist
            expect(item1.notToBeSerialized).to.equal("avalue")
            expect(item1.content.template).to.exist
            expect(item1.content.template.myprop).to.exist
        }
        describe("ArrayInheritanceAsync", function () {
            describe("TokenRelationshipTemplateArrayAsync", function () {
                it("from() creates instance from given interface (all objects)", async function () {
                    const token: any = await TokenRelationshipTemplateArrayAsync.from({
                        templates: [
                            await TokenContentRelationshipTemplateArrayAsync.from({
                                title: "Test",
                                content: await RelationshipTemplateArrayAsync.from({
                                    template: { myprop: "myvalue" }
                                })
                            }),
                            await TokenContentRelationshipTemplateArrayAsync.from({
                                title: "Test 2",
                                content: await RelationshipTemplateArrayAsync.from({
                                    template: { myprop: "myvalue" }
                                }),
                                optionalContent: "someOptionalContent"
                            })
                        ]
                    })

                    expectValidToken(token)
                })

                it("should toJSON() correctly", async function () {
                    const token: any = await TokenRelationshipTemplateArrayAsync.from({
                        templates: [
                            await TokenContentRelationshipTemplateArrayAsync.from({
                                title: "Test",
                                content: await RelationshipTemplateArrayAsync.from({
                                    template: { myprop: "myvalue" }
                                })
                            }),
                            await TokenContentRelationshipTemplateArrayAsync.from({
                                title: "Test 2",
                                content: await RelationshipTemplateArrayAsync.from({
                                    template: { myprop: "myvalue" }
                                }),
                                optionalContent: "someOptionalContent"
                            })
                        ]
                    })

                    const serialized = JSON.stringify(token.toJSON())
                    const serializedAvailable =
                        '{"@context":"https://schema.local.corp","@type":"TokenRelationshipTemplateArrayAsync","templates":[{"content":{"template":{"myprop":"myvalue"}},"title":"Test"},{"content":{"template":{"myprop":"myvalue"}},"optionalContent":"someOptionalContent","title":"Test 2"}]}'
                    expect(serialized).to.equal(serializedAvailable)
                })

                it("should serialize correctly", async function () {
                    const token: any = await TokenRelationshipTemplateArrayAsync.from({
                        templates: [
                            await TokenContentRelationshipTemplateArrayAsync.from({
                                title: "Test",
                                content: await RelationshipTemplateArrayAsync.from({
                                    template: { myprop: "myvalue" }
                                })
                            }),
                            await TokenContentRelationshipTemplateArrayAsync.from({
                                title: "Test 2",
                                content: await RelationshipTemplateArrayAsync.from({
                                    template: { myprop: "myvalue" }
                                }),
                                optionalContent: "someOptionalContent"
                            })
                        ]
                    })

                    const serialized = token.serialize()
                    const serializedAvailable =
                        '{"@context":"https://schema.local.corp","@type":"TokenRelationshipTemplateArrayAsync","templates":[{"content":{"template":{"myprop":"myvalue"}},"title":"Test"},{"content":{"template":{"myprop":"myvalue"}},"optionalContent":"someOptionalContent","title":"Test 2"}]}'
                    expect(serialized).to.equal(serializedAvailable)
                })

                it("should be deserialized correctly", async function () {
                    const serialized =
                        '{"@context":"https://schema.local.corp","@type":"TokenRelationshipTemplateArrayAsync","templates":[{"content":{"template":{"myprop":"myvalue"}},"title":"Test"},{"content":{"template":{"myprop":"myvalue"}},"optionalContent":"someOptionalContent","title":"Test 2"}]}'
                    const token = await SerializableAsync.deserializeUnknown(serialized)
                    expectValidToken(token)
                })
            })
        })
    }
}
