import { schema, serialize, validate } from "@js-soft/ts-serval"
import { CoreSerializableAsync, ICoreSerializableAsync } from "./CoreSerializableAsync"
import { IMessageContent, MessageContent } from "./MessageContent"
import { IMessageEnvelopeRecipient, MessageEnvelopeRecipient } from "./MessageEnvelopeRecipient"
import { CoreAddress, ICoreAddress } from "./types/CoreAddress"
import { CoreDate, ICoreDate } from "./types/CoreDate"
import { CoreId, ICoreId } from "./types/CoreId"

export interface ICachedMessage extends ICoreSerializableAsync {
    createdBy: ICoreAddress
    createdByDevice: ICoreId

    recipients: IMessageEnvelopeRecipient[]

    createdAt: ICoreDate

    attachments?: ICoreId[]

    content: IMessageContent
}

@schema("https://schema.corp", "CachedMessage")
export class CachedMessage extends CoreSerializableAsync implements ICachedMessage {
    @validate()
    @serialize()
    public createdBy: CoreAddress

    @validate()
    @serialize()
    public createdByDevice: CoreId

    @validate()
    @serialize({ type: MessageEnvelopeRecipient })
    public recipients: MessageEnvelopeRecipient[]

    @validate()
    @serialize()
    public createdAt: CoreDate

    @validate({ nullable: true })
    @serialize({ type: CoreId })
    public attachments: CoreId[]

    @validate()
    @serialize()
    public content: MessageContent

    public static async from(value: ICachedMessage): Promise<CachedMessage> {
        return await super.fromT(value)
    }
}
