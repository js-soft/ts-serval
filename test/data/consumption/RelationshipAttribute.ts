import { ISerializableAsync, schema, SerializableAsync, serialize, validate } from "@js-soft/ts-serval"
import { IRelationshipAttributeHistoryItem, RelationshipAttributeHistoryItem } from "./RelationshipAttributeHistoryItem"

export interface IRelationshipAttribute extends ISerializableAsync {
    current: any
    history: IRelationshipAttributeHistoryItem[]
}

@schema("https://schema.corp", "RelationshipAttribute")
export class RelationshipAttribute extends SerializableAsync implements IRelationshipAttribute {
    @validate()
    @serialize()
    public current: any

    @validate()
    @serialize({ type: RelationshipAttributeHistoryItem })
    public history: RelationshipAttributeHistoryItem[]
}
