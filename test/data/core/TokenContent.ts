import { schema } from "@js-soft/ts-serval"
import { CoreSerializableAsync, ICoreSerializableAsync } from "./CoreSerializableAsync"

export interface ITokenContent extends ICoreSerializableAsync {}

@schema("https://schema.corp", "TokenContent")
export class TokenContent extends CoreSerializableAsync implements ITokenContent {}
