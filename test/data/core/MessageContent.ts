import { schema } from "@js-soft/ts-serval"
import { CoreSerializableAsync, ICoreSerializableAsync } from "./CoreSerializableAsync"

export interface IMessageContent extends ICoreSerializableAsync {}

@schema("https://schema.corp", "MessageContent")
export abstract class MessageContent extends CoreSerializableAsync implements IMessageContent {}
