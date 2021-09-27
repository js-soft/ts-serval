import { SerializableAsync } from "../SerializableAsync"
import { serialize, serializeOnly, type } from "../serialization/Serialize"
import { validate } from "../validation/ValidateGlobals"

@type("JSONWrapperAsync")
@serializeOnly("value")
export class JSONWrapperAsync extends SerializableAsync {
    @serialize({ any: true })
    @validate()
    public value: any

    public static async from(value: any): Promise<JSONWrapperAsync> {
        delete value["@type"]
        const parsed = JSON.parse(JSON.stringify(value))
        return await this.fromT({ value: parsed }, JSONWrapperAsync)
    }

    public static async deserialize(value: string): Promise<JSONWrapperAsync> {
        const parsed = JSON.parse(value)
        return await this.fromT({ value: parsed }, JSONWrapperAsync)
    }
}
