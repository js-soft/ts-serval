import { schema, serialize, validate } from "@js-soft/ts-serval"
import { CryptoSecretKey, ICryptoSecretKey } from "../crypto/CryptoSecretKey"
import { CachedMessage, ICachedMessage } from "./CachedMessage"
import { CoreSerializableAsync, ICoreSerializableAsync } from "./CoreSerializableAsync"
import { CoreDate, ICoreDate } from "./types/CoreDate"
import { CoreId, ICoreId } from "./types/CoreId"

export interface IMessage extends ICoreSerializableAsync {
    id: ICoreId
    secretKey: ICryptoSecretKey
    isOwn: boolean
    cache?: ICachedMessage
    cachedAt?: ICoreDate
    metadata?: any
    metadataChangedAt?: ICoreDate
}

@schema("https://schema.corp", "Message")
export class Message extends CoreSerializableAsync implements IMessage {
    @validate()
    @serialize()
    public id: CoreId

    @validate()
    @serialize()
    public secretKey: CryptoSecretKey

    @validate()
    @serialize()
    public isOwn: boolean

    @validate({ nullable: true })
    @serialize()
    public cache?: CachedMessage

    @validate({ nullable: true })
    @serialize()
    public cachedAt?: CoreDate

    @validate({ nullable: true })
    @serialize()
    public metadata?: any

    @validate({ nullable: true })
    @serialize()
    public metadataChangedAt?: CoreDate

    public objectIdentifier(): string {
        return JSON.stringify({
            id: this.id.toString()
        })
    }

    public static async from(value: IMessage): Promise<Message> {
        return await super.fromT(value)
    }

    public clearCache(): this {
        this.cache = undefined
        this.cachedAt = undefined
        return this
    }
}
