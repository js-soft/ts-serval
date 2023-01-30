import { Serializable } from "../Serializable"
import { serialize, serializeOnly, type } from "../serialization/Serialize"
import { validate } from "../validation/ValidateGlobals"

@type("JSONWrapper")
@serializeOnly("value")
export class JSONWrapper extends Serializable {
    @serialize({ any: true })
    @validate()
    public value: any

    public static override preFrom(value: any): any {
        delete value["@type"]
        delete value["@version"]
        return { value: value }
    }

    public static from(value: any): JSONWrapper {
        return this.fromAny(value)
    }
}
