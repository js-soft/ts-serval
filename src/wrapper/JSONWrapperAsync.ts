import { SerializableAsync } from "../SerializableAsync"
import { serialize, serializeOnly, type } from "../serialization/Serialize"
import { validate } from "../validation/ValidateGlobals"

@type("JSONWrapperAsync")
@serializeOnly("value")
export class JSONWrapperAsync extends SerializableAsync {
    @serialize({ any: true })
    @validate()
    public value: any

    public static override preFrom(value: any): any {
        const parsed = JSON.parse(JSON.stringify(value))
        delete parsed["@type"]
        delete parsed["@version"]
        return { value: parsed }
    }

    public static async from(value: any): Promise<JSONWrapperAsync> {
        return await this.fromAny(value)
    }
}
