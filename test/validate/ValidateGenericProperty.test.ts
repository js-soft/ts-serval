import { JSONWrapper, schema, Serializable, serialize, validate } from "@js-soft/ts-serval"
import { expect } from "chai"

@schema("https://schema.local.corp", "ValidateTokenSerializableGeneric")
class ValidateTokenSerializableGeneric extends Serializable {
    public notToBeSerialized = "avalue"

    @validate()
    @serialize()
    public content: Serializable

    public static from(value: Object): ValidateTokenSerializableGeneric {
        return this.fromAny(value)
    }
}

export class ValidateGenericPropertyTest {
    public static init(): void {
        describe("ValidateGenericProperty", function () {
            describe("ValidateTokenSerializableGeneric", function () {
                it("should deserialize arbitrary content", function () {
                    const token: any = ValidateTokenSerializableGeneric.from({ content: { someProperty: "someValue" } })
                    expect(token).to.exist
                    expect(token.content).instanceOf(JSONWrapper)
                    expect(token.content.value, "Content doesnt exist").to.exist
                    expect(token.content.value.someProperty, "Property doesnt exist").to.exist
                    expect(token.content.value.someProperty).to.equal("someValue", "Property doesnt equal string")
                })

                it("should serialize arbitrary content", function () {
                    const token: any = ValidateTokenSerializableGeneric.from({ content: { someProperty: "someValue" } })
                    const object: any = token.toJSON()
                    expect(object).to.exist
                    expect(object.content, "Content doesnt exist").to.exist
                    expect(object.content.someProperty, "Property doesnt exist").to.exist
                    expect(object.content.someProperty).to.equal("someValue", "Property doesnt equal string")
                })
            })
        })
    }
}
