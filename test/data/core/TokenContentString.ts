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
}
