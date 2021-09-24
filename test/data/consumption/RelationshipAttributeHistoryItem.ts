import { ISerializableAsync, schema, SerializableAsync, serialize, validate } from "@js-soft/ts-serval"
import { CoreAddress } from "../core/types/CoreAddress"
import { CoreDate } from "../core/types/CoreDate"
import { CoreId, ICoreId } from "../core/types/CoreId"
import { Attribute } from "./Attribute"

export interface IRelationshipAttributeHistoryItem extends ISerializableAsync {
    reference?: ICoreId
    changedBy?: CoreAddress
    changedAt: CoreDate
    attribute: Attribute
}

@schema("https://schema.corp", "RelationshipAttributeHistoryItem")
export class RelationshipAttributeHistoryItem extends SerializableAsync implements IRelationshipAttributeHistoryItem {
    @validate({ nullable: true })
    @serialize()
    public reference?: CoreId

    @validate()
    @serialize()
    public changedAt: CoreDate

    @validate({ nullable: true })
    @serialize()
    public changedBy?: CoreAddress

    @validate()
    @serialize()
    public attribute: Attribute
}
