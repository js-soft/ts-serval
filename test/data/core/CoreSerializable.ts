import { ISerializable, Serializable, type } from "@js-soft/ts-serval"

export interface ICoreSerializable extends ISerializable {}

@type("CoreSerializable")
export class CoreSerializable extends Serializable implements ISerializable {}
