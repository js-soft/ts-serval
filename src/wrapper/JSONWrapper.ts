import { Serializable } from "../Serializable"
import { serialize, serializeOnly, type } from "../serialization/Serialize"
import { validate } from "../validation/ValidateGlobals"

@type("JSONWrapper")
@serializeOnly("value")
export class JSONWrapper extends Serializable {
    @serialize({ any: true })
    @validate()
    public value: any

    public static preFrom(value: any): any {
        const parsed = JSON.parse(JSON.stringify(value))
        delete parsed["@type"]
        delete parsed["@version"]
        return { value: parsed }
    }

    public static from(value: any): JSONWrapper {
        return this.fromAny(value)
    }
}
