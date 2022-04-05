import { schema, serialize, validate } from "@js-soft/ts-serval"
import { CryptoCipher, ICryptoCipher } from "../crypto/CryptoCipher"
import { CoreSerializableAsync, ICoreSerializableAsync } from "./CoreSerializableAsync"
import { CoreAddress, ICoreAddress } from "./types/CoreAddress"

export interface IMessageEnvelopeRecipient extends ICoreSerializableAsync {
    address: ICoreAddress
    encryptedKey: ICryptoCipher
}

@schema("https://schema.corp", "MessageEnvelopeRecipient")
export class MessageEnvelopeRecipient extends CoreSerializableAsync implements IMessageEnvelopeRecipient {
    @validate()
    @serialize()
    public address: CoreAddress

    @validate()
    @serialize()
    public encryptedKey: CryptoCipher
}
