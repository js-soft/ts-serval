import { JSONWrapper, JSONWrapperAsync, schema, Serializable, SerializableAsync, serialize } from "@js-soft/ts-serval"
import { expect } from "chai"

@schema("https://schema.local.corp", "TokenSerializableAsyncContent")
class TokenSerializableAsyncContent extends SerializableAsync {
    public notToBeSerialized = "avalue"

    @serialize()
    public content: Serializable

    public static async from(value: Object): Promise<TokenSerializableAsyncContent> {
        return await super.fromT(value)
    }
}

@schema("https://schema.local.corp", "TokenSerializableAsyncContentAsync")
class TokenSerializableAsyncContentAsync extends SerializableAsync {
    public notToBeSerialized = "avalue"

    @serialize()
    public content: SerializableAsync

    public static async from(value: Object): Promise<TokenSerializableAsyncContentAsync> {
        return await super.fromT(value)
    }
}

export class SerializeAsyncGenericPropertyTest {
    public static init(): void {
        describe("SerializeAsyncGenericProperty", function () {
            describe("SerializableAsyncContent", function () {
                it("should deserialize arbitrary content", async function () {
                    const token: any = await TokenSerializableAsyncContent.from({
                        content: { someProperty: "someValue" }
                    })
                    expect(token).to.instanceOf(TokenSerializableAsyncContent)
                    expect(token.content).instanceOf(JSONWrapper)
                    expect(token.content.value, "Content doesnt exist").to.exist
                    expect(token.content.value.someProperty, "Property doesnt exist").to.exist
                    expect(token.content.value.someProperty).to.equal("someValue", "Property doesnt equal string")
                })

                it("should serialize arbitrary content", async function () {
                    const token: any = await TokenSerializableAsyncContent.from({
                        content: { someProperty: "someValue" }
                    })
                    const object: any = token.toJSON()
                    expect(object).to.exist
                    expect(object.content, "Content doesnt exist").to.exist
                    expect(object.content.someProperty, "Property doesnt exist").to.exist
                    expect(object.content.someProperty).to.equal("someValue", "Property doesnt equal string")
                })
            })

            describe("SerializableAsyncContentAsync", function () {
                it("should deserialize arbitrary content", async function () {
                    const token: any = await TokenSerializableAsyncContentAsync.from({
                        content: { someProperty: "someValue" }
                    })
                    expect(token).to.instanceOf(TokenSerializableAsyncContentAsync)
                    expect(token.content).instanceOf(JSONWrapperAsync)
                    expect(token.content.value, "Content doesnt exist").to.exist
                    expect(token.content.value.someProperty, "Property doesnt exist").to.exist
                    expect(token.content.value.someProperty).to.equal("someValue", "Property doesnt equal string")
                })

                it("should serialize arbitrary content", async function () {
                    const token: any = await TokenSerializableAsyncContentAsync.from({
                        content: { someProperty: "someValue" }
                    })
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
