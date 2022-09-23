import { Serializable } from "@js-soft/ts-serval"
import { expect } from "chai"
import itParam from "mocha-param"

export class InvalidAtTypeTest {
    public static init(): void {
        describe("Invalid @type", function () {
            itParam(
                "should throw when passing '${value}' as @type",
                [null, undefined, false, 0],
                function (falsyType: any) {
                    expect(() => Serializable.fromUnknown({ "@type": falsyType })).to.throw(/@type is not a string./)
                }
            )

            it("should throw when passing an empty string as @type", function () {
                expect(() => Serializable.fromUnknown({ "@type": "" })).to.throw(
                    /Type '' with version 1 was not found within reflection classes./
                )
            })
        })
    }
}
