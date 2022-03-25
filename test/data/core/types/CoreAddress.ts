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

    public static from(value: ICoreAddress | string): CoreAddress {
        if (typeof value === "string") {
            return super.from({ address: value }) as CoreAddress
        }
        return super.from(value) as CoreAddress
    }

    public static deserialize(value: string): CoreAddress {
        try {
            return super.deserializeT(value)
        } catch (e) {
            return this.from(value)
        }
    }

    public equals(address: CoreAddress): boolean {
        return this.address === address.toString()
    }

    public toString(): string {
        return this.address
    }

    public serialize(): string {
        return this.address
    }
}
