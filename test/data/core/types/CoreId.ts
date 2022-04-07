import { serialize, serializeOnly, validate } from "@js-soft/ts-serval"
import { CoreSerializable, ICoreSerializable } from "../CoreSerializable"

export interface ICoreId extends ICoreSerializable {
    id: string
}

/**
 * A CoreId is any kind of identifier we have in the system.
 */
@serializeOnly("id", "string")
export class CoreId extends CoreSerializable implements ICoreId {
    @validate()
    @serialize()
    public id: string

    public override toString(): string {
        return this.id
    }

    public equals(id: CoreId): boolean {
        return this.id === id.toString()
    }

    protected static override preFrom(value: any): any {
        if (typeof value === "string") {
            return { id: value }
        }

        return value
    }

    public static from(value: ICoreId | string): CoreId {
        return this.fromAny(value)
    }

    public override serialize(): string {
        return this.id
    }
}
