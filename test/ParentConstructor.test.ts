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

interface IParentItem extends ISerializableAsync {}

@type("ParentItem")
class ParentItem extends SerializableAsync implements IParentItem {
    public static async from(value: IParentItem): Promise<ParentItem> {
        return await super.fromT(value)
    }
}

interface IChildItem extends IParentItem {
    test: string
}

@type("ChildItem")
class ChildItem extends ParentItem implements IChildItem {
    @serialize()
    @validate()
    public test: string
}

export class ParentConstructorTest {
    public static init(): void {
        describe("querying the parent constructor in a static function", function () {
            it("should get the constructor of the class instead of the superclass", function () {
                const child = TestSerializableClass.from<TestSerializableClass>()

                expect(child).to.be.instanceOf(TestSerializableClass)
                expect(child.getProperty()).to.equal("test")
            })

            it("should create a ChildItem instead of a ParentItem when the ParentItem overrides the from method", async function () {
                const responseJSON = {
                    "@type": "ChildItem",
                    test: "test"
                } as any

                const response = await SerializableAsync.fromUnknown(responseJSON)

                expect(response).to.be.instanceOf(ParentItem)
                expect(response).to.be.instanceOf(ChildItem)

                expect((response as ChildItem).test).to.equal("test")
            })
        })
    }
}
