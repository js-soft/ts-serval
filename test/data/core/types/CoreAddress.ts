import { schema, serialize, serializeOnly, validate } from "@js-soft/ts-serval"
import { CoreSerializable, ICoreSerializable } from "../CoreSerializable"

export interface ICoreAddress extends ICoreSerializable {
    address: string
}

/**
 * A CoreAddress is the primary technical identitier of an account.
 */
@schema("https://schema.corp", "CoreAddress")
@serializeOnly("address", "string")
export class CoreAddress extends CoreSerializable {
    @validate()
    @serialize()
    public address: string

    protected static override preFrom(value: any): any {
        if (typeof value === "string") {
            return { address: value }
        }

        return value
    }

    public static from(value: ICoreAddress | string): CoreAddress {
        return this.fromAny(value)
    }

    public equals(address: CoreAddress): boolean {
        return this.address === address.toString()
    }

    public override toString(): string {
        return this.address
    }

    public override serialize(): string {
        return this.address
    }
}
