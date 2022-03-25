import { schema, serialize, validate } from "@js-soft/ts-serval"
import { IMessageContent, MessageContent } from "./MessageContent"
import { CoreAddress, ICoreAddress } from "./types/CoreAddress"

export interface IMail extends IMessageContent {
    to: ICoreAddress[]
    cc?: ICoreAddress[]
    subject: string
    body: string
}

@schema("https://schema.corp", "Mail")
export class Mail extends MessageContent implements IMail {
    @validate()
    @serialize({ type: CoreAddress })
    public to: CoreAddress[]

    @validate({ nullable: true })
    @serialize({ type: CoreAddress })
    public cc: CoreAddress[] = []

    @validate()
    @serialize()
    public subject: string

    @validate()
    @serialize()
    public body: string

    public static async from(value: IMail): Promise<Mail> {
        if (typeof value.cc === "undefined") {
            value.cc = []
        }
        if (typeof value.body === "undefined" && (value as any).content) {
            value.body = (value as any).content
            delete (value as any).content
        }
        const obj: Mail = await super.fromT(value)
        return obj
    }
}
