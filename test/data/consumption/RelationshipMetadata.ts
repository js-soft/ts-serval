import { ISerializableAsync, schema, SerializableAsync, serialize, validate } from "@js-soft/ts-serval"
import { CoreId, ICoreId } from "../core/types/CoreId"
import { RelationshipAttribute } from "./RelationshipAttribute"

export interface IRelationshipMetadata extends ISerializableAsync {
    relationshipId: ICoreId
    isPinned: boolean
    title: string
    description?: string
    attributesSent: Record<string, RelationshipAttribute>
    attributesReceived: Record<string, RelationshipAttribute>
}

@schema("https://schema.corp", "RelationshipMetadata")
export class RelationshipMetadata extends SerializableAsync implements IRelationshipMetadata {
    @validate()
    @serialize()
    public relationshipId: CoreId

    @validate()
    @serialize()
    public isPinned: boolean

    @validate()
    @serialize()
    public title: string

    @validate({ nullable: true })
    @serialize()
    public description?: string

    @validate()
    @serialize()
    public attributesSent: Record<string, RelationshipAttribute>

    @validate()
    @serialize()
    public attributesReceived: Record<string, RelationshipAttribute>
}
