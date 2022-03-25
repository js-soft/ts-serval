import { Serializable } from "../Serializable"
import { serialize, serializeOnly, type } from "../serialization/Serialize"
import { validate } from "../validation/ValidateGlobals"

@type("JSONWrapper")
@serializeOnly("value")
export class JSONWrapper extends Serializable {
    @serialize({ any: true })
    @validate()
    public value: any

    public static from(value: any): JSONWrapper {
        delete value["@type"]
        const parsed = JSON.parse(JSON.stringify(value))
        return this.fromT({ value: parsed })
    }

    public static deserialize(value: string): JSONWrapper {
        const parsed = JSON.parse(value)
        return this.fromT({ value: parsed })
    }
}
