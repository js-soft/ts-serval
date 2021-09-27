import { ISerializableAsync, schema, SerializableAsync } from "@js-soft/ts-serval"

export interface ICoreSerializableAsync extends ISerializableAsync {}

@schema("https://schema.corp", "CoreSerializableAsync")
export class CoreSerializableAsync extends SerializableAsync implements ISerializableAsync {}
