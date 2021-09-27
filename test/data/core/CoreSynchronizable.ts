import { CoreSerializableAsync, ICoreSerializableAsync } from "./CoreSerializableAsync"

export interface ICoreSynchronizable extends ICoreSerializableAsync {
    synchronizedKeys: string[]
    objectIdentifier(): string
}
export abstract class CoreSynchronizable extends CoreSerializableAsync {
    public synchronizedKeys: string[] = []
    abstract objectIdentifier(): string
}
