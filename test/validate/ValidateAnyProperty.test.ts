import { schema, Serializable, serialize, validate } from "@js-soft/ts-serval"
import { expect } from "chai"
import { expectThrows } from "../testUtil"

@schema("https://schema.local.corp", "ValidateTokenSerializableContentAny")
class ValidateTokenSerializableContentAny extends Serializable {
    public notToBeSerialized = "avalue"

    @validate()
    @serialize({ any: true })
    public content: any

    public static from(value: Object): ValidateTokenSerializableContentAny {
        return super.fromT(value, ValidateTokenSerializableContentAny)
    }
}

@schema("https://schema.local.corp", "ValidateTokenSerializableContentAnyNullable")
class ValidateTokenSerializableContentAnyNullable extends Serializable {
    public notToBeSerialized = "avalue"

    @validate({ nullable: true })
    @serialize({ any: true })
    public content: any

    public static from(value: Object): ValidateTokenSerializableContentAnyNullable {
        return super.fromT(value, ValidateTokenSerializableContentAnyNullable)
    }
}

export class ValidateAnyPropertyTest {
    public static init(): void {
        describe("ValidateAnyProperty", function () {
            describe("ValidateTokenSerializableContentAny", function () {
                it("should deserialize arbitrary content", function () {
                    const token: any = ValidateTokenSerializableContentAny.from({
                        content: { someProperty: "someValue" }
                    })
                    expect(token).to.exist
                    expect(token.content, "Content doesnt exist").to.exist
                    expect(token.content.someProperty, "Property doesnt exist").to.exist
                    expect(token.content.someProperty).to.equal("someValue", "Property doesnt equal string")
                })

                it("should serialize arbitrary content", function () {
                    const token: any = ValidateTokenSerializableContentAny.from({
                        content: { someProperty: "someValue" }
                    })
                    const object: any = token.toJSON()
                    expect(object).to.exist
                    expect(object.content, "Content doesnt exist").to.exist
                    expect(object.content.someProperty, "Property doesnt exist").to.exist
                    expect(object.content.someProperty).to.equal("someValue", "Property doesnt equal string")
                })

                it("should deserialize boolean content", function () {
                    const token: any = ValidateTokenSerializableContentAny.from({ content: true })
                    expect(token).instanceOf(ValidateTokenSerializableContentAny)
                    expect(token.content).to.be.a("boolean")
                    expect(token.content).to.equal(true)
                })

                it("should serialize boolean content", function () {
                    const token: any = ValidateTokenSerializableContentAny.from({ content: false })
                    const object: any = token.toJSON()
                    expect(object).to.be.a("object")
                    expect(object).not.to.be.instanceOf(ValidateTokenSerializableContentAny)
                    expect(object.content).to.be.a("boolean")
                    expect(object.content).to.equal(false)
                })

                it("should deserialize number content", function () {
                    const token: any = ValidateTokenSerializableContentAny.from({ content: 45 })
                    expect(token).instanceOf(ValidateTokenSerializableContentAny)
                    expect(token.content).to.be.a("number")
                    expect(token.content).to.equal(45)
                })

                it("should serialize number content", function () {
                    const token: any = ValidateTokenSerializableContentAny.from({ content: 0 })
                    const object: any = token.toJSON()
                    expect(object).to.be.a("object")
                    expect(object).not.to.be.instanceOf(ValidateTokenSerializableContentAny)
                    expect(object.content).to.be.a("number")
                    expect(object.content).to.equal(0)
                })

                it("should deserialize string content", function () {
                    const token: any = ValidateTokenSerializableContentAny.from({ content: "Test" })
                    expect(token).instanceOf(ValidateTokenSerializableContentAny)
                    expect(token.content).to.be.a("string")
                    expect(token.content).to.equal("Test")
                })

                it("should serialize string content", function () {
                    const token: any = ValidateTokenSerializableContentAny.from({ content: "" })
                    const object: any = token.toJSON()
                    expect(object).to.be.a("object")
                    expect(object).not.to.be.instanceOf(ValidateTokenSerializableContentAny)
                    expect(object.content).to.be.a("string")
                    expect(object.content).to.equal("")
                })

                it("should deserialize array content", function () {
                    const token: any = ValidateTokenSerializableContentAny.from({
                        content: [5, "Test2", null, true, [false], { some: "object" }]
                    })
                    expect(token).instanceOf(ValidateTokenSerializableContentAny)
                    expect(token.content).to.be.an("array")
                    expect(token.content[0]).to.equal(5)
                    expect(token.content[1]).to.equal("Test2")
                    expect(token.content[2]).to.equal(null)
                    expect(token.content[3]).to.equal(true)
                    expect(token.content[4]).to.be.an("array")
                    expect(token.content[4].length).to.equal(1)
                    expect(token.content[5]).to.be.an("object")
                    expect(token.content[5].some).to.equal("object")
                })

                it("should serialize array content", function () {
                    const token: any = ValidateTokenSerializableContentAny.from({
                        content: [5, "Test2", null, true, [false], { some: "object" }]
                    })
                    const object: any = token.toJSON()
                    expect(object).to.be.a("object")
                    expect(object).not.to.be.instanceOf(ValidateTokenSerializableContentAny)
                    expect(object.content).to.be.an("array")
                    expect(object.content[0]).to.equal(5)
                    expect(object.content[1]).to.equal("Test2")
                    expect(object.content[2]).to.equal(null)
                    expect(object.content[3]).to.equal(true)
                    expect(object.content[4]).to.be.an("array")
                    expect(object.content[4].length).to.equal(1)
                    expect(object.content[5]).to.be.an("object")
                    expect(object.content[5].some).to.equal("object")
                })

                it("should not deserialize null content", function () {
                    expectThrows(() => ValidateTokenSerializableContentAny.from({ content: null }))
                })

                it("should not set null content", function () {
                    const token: any = ValidateTokenSerializableContentAny.from({ content: "" })
                    expectThrows(() => {
                        token.content = null
                    })
                })
            })

            describe("ValidateTokenSerializableContentAnyNullable", function () {
                it("should deserialize arbitrary content", function () {
                    const token: any = ValidateTokenSerializableContentAnyNullable.from({
                        content: { someProperty: "someValue" }
                    })
                    expect(token).to.exist
                    expect(token.content, "Content doesnt exist").to.exist
                    expect(token.content.someProperty, "Property doesnt exist").to.exist
                    expect(token.content.someProperty).to.equal("someValue", "Property doesnt equal string")
                })

                it("should serialize arbitrary content", function () {
                    const token: any = ValidateTokenSerializableContentAnyNullable.from({
                        content: { someProperty: "someValue" }
                    })
                    const object: any = token.toJSON()
                    expect(object).to.exist
                    expect(object.content, "Content doesnt exist").to.exist
                    expect(object.content.someProperty, "Property doesnt exist").to.exist
                    expect(object.content.someProperty).to.equal("someValue", "Property doesnt equal string")
                })

                it("should deserialize boolean content", function () {
                    const token: any = ValidateTokenSerializableContentAnyNullable.from({ content: true })
                    expect(token).instanceOf(ValidateTokenSerializableContentAnyNullable)
                    expect(token.content).to.be.a("boolean")
                    expect(token.content).to.equal(true)
                })

                it("should serialize boolean content", function () {
                    const token: any = ValidateTokenSerializableContentAnyNullable.from({ content: false })
                    const object: any = token.toJSON()
                    expect(object).to.be.a("object")
                    expect(object).not.to.be.instanceOf(ValidateTokenSerializableContentAnyNullable)
                    expect(object.content).to.be.a("boolean")
                    expect(object.content).to.equal(false)
                })

                it("should deserialize number content", function () {
                    const token: any = ValidateTokenSerializableContentAnyNullable.from({ content: 45 })
                    expect(token).instanceOf(ValidateTokenSerializableContentAnyNullable)
                    expect(token.content).to.be.a("number")
                    expect(token.content).to.equal(45)
                })

                it("should serialize number content", function () {
                    const token: any = ValidateTokenSerializableContentAnyNullable.from({ content: 0 })
                    const object: any = token.toJSON()
                    expect(object).to.be.a("object")
                    expect(object).not.to.be.instanceOf(ValidateTokenSerializableContentAnyNullable)
                    expect(object.content).to.be.a("number")
                    expect(object.content).to.equal(0)
                })

                it("should deserialize string content", function () {
                    const token: any = ValidateTokenSerializableContentAnyNullable.from({ content: "Test" })
                    expect(token).instanceOf(ValidateTokenSerializableContentAnyNullable)
                    expect(token.content).to.be.a("string")
                    expect(token.content).to.equal("Test")
                })

                it("should serialize string content", function () {
                    const token: any = ValidateTokenSerializableContentAnyNullable.from({ content: "" })
                    const object: any = token.toJSON()
                    expect(object).to.be.a("object")
                    expect(object).not.to.be.instanceOf(ValidateTokenSerializableContentAnyNullable)
                    expect(object.content).to.be.a("string")
                    expect(object.content).to.equal("")
                })

                it("should deserialize null content", function () {
                    const token: any = ValidateTokenSerializableContentAnyNullable.from({ content: null })
                    expect(token).instanceOf(ValidateTokenSerializableContentAnyNullable)
                    expect(token.content).to.equal(null)
                })

                it("should serialize null content", function () {
                    const token: any = ValidateTokenSerializableContentAnyNullable.from({ content: null })
                    const object: any = token.toJSON()
                    expect(object).to.be.a("object")
                    expect(object).not.to.be.instanceOf(ValidateTokenSerializableContentAnyNullable)
                    expect(object.content).to.equal(null)
                })
            })
        })
    }
}
