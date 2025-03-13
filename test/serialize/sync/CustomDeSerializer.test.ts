import { ISerializable, Serializable, serialize, validate } from "@js-soft/ts-serval"
import { expect } from "chai"

export interface ISimpleClass extends ISerializable {
    aProperty: string
}

export class SimpleClass extends Serializable implements ISimpleClass {
    @serialize()
    @validate()
    public aProperty: string

    public static customDeserialize(value: string): SimpleClass {
        return this.from({ aProperty: value })
    }

    public customSerialize(): string {
        return this.aProperty
    }

    public static from(value: ISimpleClass): SimpleClass {
        return this.fromAny(value)
    }
}

interface ClassContainingCustomDeSerializerJSON {
    aSimpleClassProperty: string
}

interface IClassContainingCustomDeSerializer extends ISerializable {
    aSimpleClassProperty: SimpleClass
}

class ClassContainingCustomDeSerializer extends Serializable implements IClassContainingCustomDeSerializer {
    @serialize({
        enforceString: true,
        customSerializer: (sc: SimpleClass) => sc.customSerialize(),
        customDeserializer: SimpleClass.customDeserialize
    })
    @validate()
    public aSimpleClassProperty: SimpleClass

    public static from(
        value: IClassContainingCustomDeSerializer | ClassContainingCustomDeSerializerJSON
    ): ClassContainingCustomDeSerializer {
        return this.fromAny(value)
    }

    public override toJSON(): ClassContainingCustomDeSerializerJSON {
        return super.toJSON() as ClassContainingCustomDeSerializerJSON
    }
}

export class CustomDeSerializerTest {
    public static init(): void {
        describe("Custom (De-)Serializer", function () {
            it("serializes with the custom serializer", function () {
                const instance = ClassContainingCustomDeSerializer.from({
                    aSimpleClassProperty: SimpleClass.from({ aProperty: "value" })
                })

                const json = instance.toJSON()
                expect(json).to.deep.equal({ aSimpleClassProperty: "value" })
            })

            it("deserializes with the custom deserializer", function () {
                const instance = ClassContainingCustomDeSerializer.from({
                    aSimpleClassProperty: "value"
                })

                expect(instance.aSimpleClassProperty).instanceOf(SimpleClass)
                expect(instance.aSimpleClassProperty.aProperty).to.equal("value")
            })
        })
    }
}
