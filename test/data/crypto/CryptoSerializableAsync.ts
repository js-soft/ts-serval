import { ISerializableAsync, schema, SerializableAsync } from "@js-soft/ts-serval"

@schema("https://schema.corp", "CryptoSerializableAsync")
export class CryptoSerializableAsync extends SerializableAsync implements ISerializableAsync {
    public serialize(verbose = true): string {
        return JSON.stringify(this.toJSON(verbose))
    }
}
