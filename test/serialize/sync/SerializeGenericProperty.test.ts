import { JSONWrapper, schema, Serializable, serialize } from "@js-soft/ts-serval"
import { expect } from "chai"
import { Attribute } from "../../data/consumption/Attribute"

@schema("https://schema.local.corp", "TokenSerializableContentGenericProperty")
class TokenSerializableContentGenericProperty extends Serializable {
    public notToBeSerialized = "avalue"

    @serialize()
    public content: Serializable

    public static from(value: Object): TokenSerializableContentGenericProperty {
        return this.fromAny(value)
    }
}

export class SerializeGenericPropertyTest {
    public static init(): void {
        describe("SerializeGenericProperty", function () {
            describe("TokenSerializableContentGenericProperty", function () {
                it("should deserialize arbitrary content", function () {
                    const token: any = TokenSerializableContentGenericProperty.from({
                        content: { someProperty: "someValue" }
                    })
                    expect(token).instanceOf(TokenSerializableContentGenericProperty)
                    expect(token.content).instanceOf(JSONWrapper)
                    expect(token.content.value, "Content doesnt exist").to.exist
                    expect(token.content.value.someProperty, "Property doesnt exist").to.exist
                    expect(token.content.value.someProperty).to.equal("someValue", "Property doesnt equal string")
                })

                it("should serialize arbitrary content", function () {
                    const token: any = TokenSerializableContentGenericProperty.from({
                        content: { someProperty: "someValue" }
                    })
                    const object: any = token.toJSON()
                    expect(object).to.exist
                    expect(object.content, "Content doesnt exist").to.exist
                    expect(object.content.someProperty, "Property doesnt exist").to.exist
                    expect(object.content.someProperty).to.equal("someValue", "Property doesnt equal string")
                    expect(object.content["@type"]).not.exist
                })
            })

            describe("Attribute", function () {
                it("should deserialize other classes", function () {
                    const attribute = Attribute.from({ name: "firstname", value: "test" })
                    const token: any = TokenSerializableContentGenericProperty.from({ content: attribute })
                    expect(token).to.exist
                    expect(token.content).instanceOf(Attribute)
                    expect((token.content as Attribute).name).equals("firstname")
                    expect((token.content as Attribute).value).is.a("string")
                    expect((token.content as Attribute).value).equals("test")
                })

                it("should serialize other classes (and output type information)", function () {
                    const attribute = Attribute.from({ name: "firstname", value: "test" })
                    const token: any = TokenSerializableContentGenericProperty.from({ content: attribute })
                    const object: any = token.toJSON()
                    expect(object).to.exist
                    expect(object.content).is.not.instanceOf(Attribute)
                    expect(object.content.name).equals("firstname")
                    expect(object.content.value).is.a("string")
                    expect(object.content.value).equals("test")
                    expect(object.content["@type"]).equals("Attribute")
                })
            })
        })
    }
}
