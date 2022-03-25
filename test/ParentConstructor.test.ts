import { expect } from "chai"
import { ISerializableAsync, SerializableAsync, serialize, type, validate } from "../src"

class NewSerializable {
    public static from<T extends NewSerializable>(): T {
        const ctor = (this as any).prototype.constructor
        const obj = new ctor()

        return obj
    }
}

class TestSerializableClass extends NewSerializable {
    private readonly property = "test"

    public getProperty(): string {
        return this.property
    }
}

interface IAcceptResponseItem extends ISerializableAsync {}

@type("AcceptResponseItem")
class AcceptResponseItem extends SerializableAsync implements IAcceptResponseItem {
    // public static async from(value: IAcceptResponseItem): Promise<AcceptResponseItem> {
    //     return await super.fromT(value)
    // }
}

interface ITestAcceptResponseItem extends IAcceptResponseItem {
    test: string
}

@type("TestAcceptResponseItem")
class TestAcceptResponseItem extends AcceptResponseItem implements ITestAcceptResponseItem {
    @serialize()
    @validate()
    public test: string
}

export class ParentConstructorTest {
    public static init(): void {
        describe.only("querying the parent constructor in a static function", function () {
            it("should get the constructor of the class instead of the superclass", function () {
                const child = TestSerializableClass.from<TestSerializableClass>()

                expect(child).to.be.instanceOf(TestSerializableClass)
                expect(child.getProperty()).to.equal("test")
            })

            it("allows an inherited AcceptResponseItem in the items", async function () {
                const responseJSON = {
                    "@type": "TestAcceptResponseItem",
                    test: "test"
                } as any

                const response = await SerializableAsync.fromUnknown(responseJSON)

                expect(response).to.be.instanceOf(AcceptResponseItem)
                expect(response).to.be.instanceOf(TestAcceptResponseItem)

                expect((response as TestAcceptResponseItem).test).to.equal("test")
            })

            it("allows an inherited AcceptResponseItem in the items a", async function () {
                const responseJSON = {
                    "@type": "TestAcceptResponseItem",
                    test: "test"
                } as any

                const response = await SerializableAsync.fromT<SerializableAsync>(responseJSON)

                expect(response).to.be.instanceOf(AcceptResponseItem)
                expect(response).to.be.instanceOf(TestAcceptResponseItem)

                expect(response.test).to.equal("test")
            })
        })
    }
}
