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
        delete value["@type"]
        delete value["@version"]
        return { value: value }
    }

    public static async from(value: any): Promise<JSONWrapperAsync> {
        return await this.fromAny(value)
    }
}
