import { schema, SerializableAsync, serialize } from "@js-soft/ts-serval"
import { expect } from "chai"

@schema("https://schema.local.corp", "TokenSerializableAsyncContentAny")
class TokenSerializableAsyncContentAny extends SerializableAsync {
    public notToBeSerialized = "avalue"

    @serialize({ any: true })
    public content: any
}

export class SerializeAsyncAnyPropertyTest {
    public static init(): void {
        describe("SerializeAsyncAnyProperty", function () {
            describe("SerializableAsyncContent", function () {
                it("should deserialize arbitrary content", async function () {
                    const token: any = await TokenSerializableAsyncContentAny.fromAny({
                        content: { myprop: "someValue" }
                    })
                    expect(token).instanceOf(TokenSerializableAsyncContentAny)
                    expect(token.content, "Content doesnt exist").to.exist
                    expect(token.content.myprop, "Property doesnt exist").to.exist
                    expect(token.content.myprop).to.equal("someValue", "Property doesnt equal string")
                })

                it("should serialize arbitrary content", async function () {
                    const token: any = await TokenSerializableAsyncContentAny.fromAny({
                        content: { myprop: "someValue" }
                    })
                    const object: any = token.toJSON()
                    expect(object).to.exist
                    expect(object.content, "Content doesnt exist").to.exist
                    expect(object.content.myprop, "Property doesnt exist").to.exist
                    expect(object.content.myprop).to.equal("someValue", "Property doesnt equal string")
                })
            })
        })
    }
}
