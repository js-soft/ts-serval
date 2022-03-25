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

    public toString(): string {
        return this.id
    }

    public equals(id: CoreId): boolean {
        return this.id === id.toString()
    }

    public static from(value: ICoreId | string): CoreId {
        if (typeof value === "string" || value instanceof String) {
            return super.fromT({ id: value })
        }
        return super.fromT(value)
    }

    public static deserialize(value: string): CoreId {
        return this.from(value)
    }

    public serialize(): string {
        return this.id
    }
}
