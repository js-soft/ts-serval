import { schema, Serializable, serialize } from "@js-soft/ts-serval"
import { expect } from "chai"

/**
 *
 * Serializable
 *  |- RelationshipTemplateArray
 *  |- TokenContentArray
 *  |   |- TokenGeneric
 *  |   |- TokenContentRelationshipTemplateArray
 *  |   |- TokenContentStringArray
 */

@schema("https://schema.local.corp", "RelationshipTemplateArray")
class RelationshipTemplateArray extends Serializable {
    @serialize()
    public template: Object

    public static deserialize(value: string): RelationshipTemplateArray {
        return super.deserializeT(value)
    }

    public static from(value: Object): RelationshipTemplateArray {
        return super.fromT(value)
    }
}

@schema("https://schema.local.corp", "TokenContentArray")
class TokenContentArray extends Serializable {
    public notToBeSerialized = "avalue"

    @serialize()
    public title: string

    public static deserialize(value: string): TokenContentArray {
        return super.deserializeT(value)
    }

    public static from(value: Object): TokenContentArray {
        return super.fromT(value)
    }
}

@schema("https://schema.local.corp", "TokenContentRelationshipTemplateArray")
class TokenContentRelationshipTemplateArray extends TokenContentArray {
    @serialize()
    public content: RelationshipTemplateArray

    @serialize({ optional: true })
    public optionalContent: string

    public static deserialize(value: string): TokenContentRelationshipTemplateArray {
        return super.deserializeT(value)
    }

    public static from(value: Object): TokenContentRelationshipTemplateArray {
        return super.fromT(value)
    }
}

@schema("https://schema.local.corp", "TokenRelationshipTemplateArray")
class TokenRelationshipTemplateArray extends Serializable {
    @serialize({ deserializeStrings: true, type: TokenContentRelationshipTemplateArray })
    public templates: TokenContentRelationshipTemplateArray[]

    public static deserialize(value: string): TokenRelationshipTemplateArray {
        return super.deserializeT(value)
    }

    public static from(value: Object): TokenRelationshipTemplateArray {
        return super.fromT(value)
    }
}

export class ArrayInheritanceTest {
    public static init(): void {
        function expectValidToken(token) {
            expect(token).to.be.instanceOf(Serializable)
            expect(token).to.be.instanceOf(TokenRelationshipTemplateArray)
            expect(token.templates).to.exist
            expect(token.templates).to.be.instanceOf(Array)
            expect(token.templates.length).to.equal(2)

            const item0 = token.templates[0]
            expect(item0).to.be.instanceOf(Serializable)
            expect(item0).to.be.instanceOf(TokenContentArray)
            expect(item0).to.be.instanceOf(TokenContentRelationshipTemplateArray)
            expect(item0.optionalContent).not.to.exist
            expect(item0.title).to.exist
            expect(item0.title).to.equal("Test")
            expect(item0.notToBeSerialized).to.exist
            expect(item0.notToBeSerialized).to.equal("avalue")
            expect(item0.content.template).to.exist
            expect(item0.content.template.myprop).to.exist

            const item1 = token.templates[1]
            expect(item1).to.be.instanceOf(Serializable)
            expect(item1).to.be.instanceOf(TokenContentArray)
            expect(item1).to.be.instanceOf(TokenContentRelationshipTemplateArray)
            expect(item1.optionalContent).to.exist
            expect(item1.optionalContent).to.equal("someOptionalContent")
            expect(item1.title).to.exist
            expect(item1.title).to.equal("Test 2")
            expect(item1.notToBeSerialized).to.exist
            expect(item1.notToBeSerialized).to.equal("avalue")
            expect(item1.content.template).to.exist
            expect(item1.content.template.myprop).to.exist
        }
        describe("ArrayInheritance", function () {
            describe("TokenRelationshipTemplateArray", function () {
                it("from() creates instance from given interface (all objects)", function () {
                    const token: any = TokenRelationshipTemplateArray.from({
                        templates: [
                            TokenContentRelationshipTemplateArray.from({
                                title: "Test",
                                content: RelationshipTemplateArray.from({
                                    template: { myprop: "myvalue" }
                                })
                            }),
                            TokenContentRelationshipTemplateArray.from({
                                title: "Test 2",
                                content: RelationshipTemplateArray.from({
                                    template: { myprop: "myvalue" }
                                }),
                                optionalContent: "someOptionalContent"
                            })
                        ]
                    })

                    expectValidToken(token)
                })

                it("should toJSON() correctly", function () {
                    const token: any = TokenRelationshipTemplateArray.from({
                        templates: [
                            TokenContentRelationshipTemplateArray.from({
                                title: "Test",
                                content: RelationshipTemplateArray.from({
                                    template: { myprop: "myvalue" }
                                })
                            }),
                            TokenContentRelationshipTemplateArray.from({
                                title: "Test 2",
                                content: RelationshipTemplateArray.from({
                                    template: { myprop: "myvalue" }
                                }),
                                optionalContent: "someOptionalContent"
                            })
                        ]
                    })

                    const serialized = JSON.stringify(token.toJSON())
                    const serializedAvailable =
                        '{"@context":"https://schema.local.corp","@type":"TokenRelationshipTemplateArray","templates":[{"content":{"template":{"myprop":"myvalue"}},"title":"Test"},{"content":{"template":{"myprop":"myvalue"}},"optionalContent":"someOptionalContent","title":"Test 2"}]}'
                    expect(serialized).to.equal(serializedAvailable)
                })

                it("should serialize correctly", function () {
                    const token: any = TokenRelationshipTemplateArray.from({
                        templates: [
                            TokenContentRelationshipTemplateArray.from({
                                title: "Test",
                                content: RelationshipTemplateArray.from({
                                    template: { myprop: "myvalue" }
                                })
                            }),
                            TokenContentRelationshipTemplateArray.from({
                                title: "Test 2",
                                content: RelationshipTemplateArray.from({
                                    template: { myprop: "myvalue" }
                                }),
                                optionalContent: "someOptionalContent"
                            })
                        ]
                    })

                    const serialized = token.serialize()
                    const serializedAvailable =
                        '{"@context":"https://schema.local.corp","@type":"TokenRelationshipTemplateArray","templates":[{"content":{"template":{"myprop":"myvalue"}},"title":"Test"},{"content":{"template":{"myprop":"myvalue"}},"optionalContent":"someOptionalContent","title":"Test 2"}]}'
                    expect(serialized).to.equal(serializedAvailable)
                })

                it("should be deserialized correctly", function () {
                    const serialized =
                        '{"@context":"https://schema.local.corp","@type":"TokenRelationshipTemplateArray","templates":[{"content":{"template":{"myprop":"myvalue"}},"title":"Test"},{"content":{"template":{"myprop":"myvalue"}},"optionalContent":"someOptionalContent","title":"Test 2"}]}'
                    const token = Serializable.deserializeUnknown(serialized)
                    expectValidToken(token)
                })
            })
        })
    }
}
