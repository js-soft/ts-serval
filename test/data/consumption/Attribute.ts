import { schema, serialize, validate } from "@js-soft/ts-serval"
import { CoreSerializable, ICoreSerializable } from "../core/CoreSerializable"

export interface IAttribute extends ICoreSerializable {
    name: string
    value: any
    validFrom?: string
}

@schema("https://schema.local.corp", "Attribute")
export class Attribute extends CoreSerializable implements IAttribute {
    @validate()
    @serialize()
    public name: string

    @serialize({ any: true })
    public value: any

    @validate({ nullable: true })
    @serialize()
    public validFrom?: string

    public static from(value: IAttribute): Attribute {
        return super.fromT(value)
    }
}
