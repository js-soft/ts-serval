import { schema, Serializable, serialize, serializeOnly } from "@js-soft/ts-serval"
import { expect } from "chai"

@schema("https://schema.local.corp", "TokenId")
@serializeOnly("id", "string")
class TokenId extends Serializable {
    public notToBeSerialized = "avalue"

    @serialize()
    public id: string

    public static from(value: Object): TokenId {
        return this.fromAny(value)
    }
}

export class SerializeOnlyTest {
    public static init(): void {
        describe("SerializeOnly", function () {
            describe("TokenId", function () {
                it("should only serialize the given property", function () {
                    const token: any = TokenId.from({ id: "someId" })
                    const object: any = token.toJSON()
                    expect(object).equals("someId")
                })
            })
        })
    }
}
