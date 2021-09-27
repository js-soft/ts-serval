import { schema, serialize, validate } from "@js-soft/ts-serval"
import { ITokenContent, TokenContent } from "./TokenContent"

export interface ITokenContentString extends ITokenContent {
    content: string
}

@schema("https://schema.corp", "TokenContentString")
export class TokenContentString extends TokenContent {
    @validate()
    @serialize({ enforceString: true })
    public content: string

    public static async from(value: ITokenContentString): Promise<TokenContentString> {
        return await super.fromT(value, TokenContentString)
    }

    public static async deserialize(value: string): Promise<TokenContentString> {
        return await super.deserializeT(value, TokenContentString)
    }
}
