import { ISerializableAsync, schema, SerializableAsync, serialize, validate } from "@js-soft/ts-serval"
import { CoreSynchronizable, ICoreSynchronizable } from "../core/CoreSynchronizable"
import { CoreDate, ICoreDate } from "../core/types/CoreDate"
import { CoreId } from "../core/types/CoreId"

export interface IDraftSerialized extends ICoreSynchronizable {
    type: string
    createdAt: ICoreDate
    content: ISerializableAsync
}

@schema("https://schema.corp", "Draft")
export class Draft extends CoreSynchronizable implements IDraftSerialized {
    @validate()
    @serialize()
    public id: CoreId

    @validate()
    @serialize()
    public type: string

    @validate()
    @serialize()
    public createdAt: CoreDate

    @validate()
    @serialize()
    public content: SerializableAsync

    public objectIdentifier(): string {
        return JSON.stringify({
            id: this.id.toString()
        })
    }
}
