import { ISerializable, Serializable, serialize, type, validate } from "@js-soft/ts-serval"
import { expect } from "chai"

export interface IAnotherClass extends ISerializable {}

@type("AnotherClass")
export class AnotherClass extends Serializable {}

interface IAClass extends ISerializable {
    referenceToAnotherClass?: IAnotherClass
}

@type("AClass")
class AClass extends Serializable {
    @serialize({ type: AnotherClass })
    @validate({ nullable: true })
    public referenceToAnotherClass?: AnotherClass

    public static from(value: IAClass): AClass {
        return super.fromT(value, AClass)
    }
}

export class ValidatePropertyAnnotatedWithTypeTest {
    public static init(): void {
        describe("ValidatePropertyAnnotatedWithType", function () {
            it("should parse an object with an optional property without a value", function () {
                const parsedValue = AClass.from({
                    referenceToAnotherClass: undefined
                })

                expect(parsedValue.referenceToAnotherClass).to.not.exist
            })

            it("should parse an object with an optional property with a value", function () {
                const parsedValue = AClass.from({
                    referenceToAnotherClass: {}
                })

                expect(parsedValue.referenceToAnotherClass).to.exist
            })
        })
    }
}
