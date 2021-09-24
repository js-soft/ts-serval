import { schema, SerializableAsync, serialize, serializeOnly } from "@js-soft/ts-serval"
import { expect } from "chai"

@schema("https://schema.local.corp", "TokenId")
@serializeOnly("id", "string")
class TokenId extends SerializableAsync {
    public notToBeSerialized = "avalue"

    @serialize()
    public id: string

    public static async from(value: Object): Promise<TokenId> {
        return await super.fromT(value, TokenId)
    }
}

export class SerializeOnlyAsyncTest {
    public static init(): void {
        describe("SerializeOnlyAsync", function () {
            describe("TokenId", function () {
                it("should only serialize the given property", async function () {
                    const token: any = await TokenId.from({ id: "someId" })
                    const object: any = token.toJSON()
                    expect(object).equals("someId")
                })
            })
        })
    }
}
