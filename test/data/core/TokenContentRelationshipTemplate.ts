import { schema, serialize, validate } from "@js-soft/ts-serval"
import { CryptoSecretKey, ICryptoSecretKey } from "../crypto/CryptoSecretKey"
import { ITokenContent, TokenContent } from "./TokenContent"
import { CoreId, ICoreId } from "./types/CoreId"

export interface ITokenContentRelationshipTemplate extends ITokenContent {
    templateId: ICoreId
    secretKey: ICryptoSecretKey
}

@schema("https://schema.corp", "TokenContentRelationshipTemplate")
export class TokenContentRelationshipTemplate extends TokenContent implements ITokenContentRelationshipTemplate {
    @validate()
    @serialize()
    public templateId: CoreId

    @validate()
    @serialize()
    public secretKey: CryptoSecretKey

    public static async from(value: ITokenContentRelationshipTemplate): Promise<TokenContentRelationshipTemplate> {
        return await super.fromT(value)
    }

    public static async deserialize(value: string): Promise<TokenContentRelationshipTemplate> {
        return await super.deserializeT(value)
    }
}
