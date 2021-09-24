import { ISerializableAsync, schema, SerializableAsync, serialize, validate } from "@js-soft/ts-serval"
import { ITokenContent, TokenContent } from "./TokenContent"

export interface ITokenContentGeneric extends ITokenContent {
    content: ISerializableAsync
}

@schema("https://schema.corp", "TokenContentGeneric")
export class TokenContentGeneric extends TokenContent {
    @validate()
    @serialize()
    public content: SerializableAsync

    public static async from(value: ITokenContentGeneric): Promise<TokenContentGeneric> {
        return await super.fromT(value, TokenContentGeneric)
    }

    public static async deserialize(value: string): Promise<TokenContentGeneric> {
        return await super.deserializeT(value, TokenContentGeneric)
    }
}
