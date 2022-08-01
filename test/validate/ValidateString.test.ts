import { Serializable, serialize, type, validate } from "@js-soft/ts-serval"
import { expect } from "chai"

@type("ValidateStringMinMaxTestType")
class ValidateStringMinMaxTestType extends Serializable {
    @serialize()
    @validate({ min: 1, max: 2 })
    public value: string
}

@type("ValidateStringRegexTestType")
class ValidateStringRegexTestType extends Serializable {
    @validate({ regExp: /test/ })
    @serialize()
    public value: string
}

export class ValidateStringTest {
    public static init(): void {
        describe("ValidateString", function () {
            describe("Min", function () {
                it("accepts a correct value", function () {
                    const value = ValidateStringMinMaxTestType.fromAny({ value: "a" })
                    expect(value.value).to.equal("a")
                })

                it("rejects a too short value", function () {
                    expect(() => ValidateStringMinMaxTestType.fromAny({ value: "" })).to.throw(
                        "Value is shorter than 1 characters"
                    )
                })
            })

            describe("Max", function () {
                it("accepts a correct value", function () {
                    const value = ValidateStringMinMaxTestType.fromAny({ value: "ab" })
                    expect(value.value).to.equal("ab")
                })

                it("rejects a too long value", function () {
                    expect(() => ValidateStringMinMaxTestType.fromAny({ value: "abc" })).to.throw(
                        "Value is longer than 2 characters"
                    )
                })
            })

            describe("Regex", function () {
                it("accepts a correct value", function () {
                    const value = ValidateStringRegexTestType.fromAny({ value: "test" })

                    expect(value.value).to.equal("test")
                })

                it("rejects a wrong value", function () {
                    expect(() => ValidateStringRegexTestType.fromAny({ value: "wrong" })).to.throw(
                        " Value does not match regular expression"
                    )
                })
            })
        })
    }
}
