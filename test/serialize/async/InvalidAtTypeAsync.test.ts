import { SerializableAsync } from "@js-soft/ts-serval"
import itParam from "mocha-param"
import { expectThrowsAsync } from "../../testUtil"

export class InvalidAtTypeAsyncTest {
    public static init(): void {
        describe("Invalid @type", function () {
            itParam(
                "should throw when passing '${value}' as @type",
                [null, undefined, false, 0],
                async function (falsyType: any) {
                    await expectThrowsAsync(
                        SerializableAsync.fromUnknown({ "@type": falsyType }),
                        /@type is not a string./
                    )
                }
            )

            it("should throw when passing an empty string as @type", async function () {
                await expectThrowsAsync(
                    SerializableAsync.fromUnknown({ "@type": "" }),
                    /Type '' with version 1 was not found within reflection classes./
                )
            })
        })
    }
}
