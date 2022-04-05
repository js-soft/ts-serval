import { serialize, serializeOnly, validate } from "@js-soft/ts-serval"
import { CoreSerializable, ICoreSerializable } from "../CoreSerializable"

export interface ICoreDate extends ICoreSerializable {
    date: string
}

@serializeOnly("date", "string")
export class CoreDate extends CoreSerializable implements ICoreDate {
    private readonly _dateTime: Date
    public get dateTime(): Date {
        return this._dateTime
    }

    @validate()
    @serialize()
    public readonly date: string

    public constructor(dateTime: Date = new Date()) {
        super()
        this._dateTime = dateTime
        this.date = this._dateTime.toISOString()
    }

    /**
     * Creates an ISO String.
     */
    public toString(): string {
        return this.dateTime.toISOString()
    }

    public toISOString(): string {
        return this.dateTime.toISOString()
    }

    public serialize(): string {
        return this.dateTime.toISOString()
    }

    protected static preFrom(value: any): any {
        if (typeof value === "object") {
            if (typeof value.date === "undefined") {
                if (typeof value.toISOString === "function") {
                    const iso = value.toISOString()
                    return new Date(iso)
                }
            } else {
                return new Date(value.date)
            }
        }

        if (typeof value === "number") {
            return new Date(value)
        }

        return new Date(value as string)
    }

    public static from(value: ICoreDate | string | number): CoreDate {
        return this.fromAny(value)
    }

    // TODO: ??
    // public static deserialize(isoString: string): CoreDate {
    //     return this.from(isoString)
    // }
}
