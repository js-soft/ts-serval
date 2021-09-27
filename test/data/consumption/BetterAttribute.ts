import { schema, serialize, validate } from "@js-soft/ts-serval"
import { Attribute, IAttribute } from "./Attribute"

export interface IBetterAttribute extends IAttribute {
    validTo?: string
}

@schema("https://schema.local.corp", "BetterAttribute")
export class BetterAttribute extends Attribute implements IBetterAttribute {
    @validate({ nullable: true })
    @serialize()
    public validTo?: string

    public static from(value: IBetterAttribute): BetterAttribute {
        return super.fromT(value, BetterAttribute)
    }
}
