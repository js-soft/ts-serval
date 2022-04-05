import { Constructor, ISerializableAsync, SerializableAsync, serialize, type, validate } from "@js-soft/ts-serval"
import { expect } from "chai"

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

@type("AsyncParentItem")
class AsyncParentItem extends SerializableAsync implements IParentItem {
    public static from(value: IParentItem): Promise<AsyncParentItem> {
        return this.fromAny(value)
    }

    public static async fromAny<T extends AsyncParentItem>(this: Constructor<T>, value: IParentItem): Promise<T> {
        return await ((this as any).fromT(value) as Promise<T>)
    }
}

interface IChildItem extends IParentItem {
    test: string
}

@type("AsyncChildItem")
class AsyncChildItem extends AsyncParentItem implements IChildItem {
    @serialize()
    @validate()
    public test: string

    public static from(value: IChildItem): Promise<AsyncChildItem> {
        return this.fromAny(value)
    }

    // public static async fromAny<T extends AsyncParentItem>(this: Constructor<T>, value: IChildItem): Promise<T> {
    //     return await ((this as any).fromT(value) as Promise<T>)
    // }
}

@type("SyncParentItem")
class SyncParentItem extends SerializableAsync implements IParentItem {}

@type("SyncChildItem")
class SyncChildItem extends SyncParentItem implements IChildItem {
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

            it("should create a AsyncChildItem instead of a ParentItem when the AsyncParentItem overrides the from method", async function () {
                const responseJSON = {
                    "@type": "AsyncChildItem",
                    test: "test"
                } as any

                const response = await SerializableAsync.fromUnknown(responseJSON)

                expect(response).to.be.instanceOf(AsyncParentItem)
                expect(response).to.be.instanceOf(AsyncChildItem)

                expect((response as AsyncChildItem).test).to.equal("test")
            })

            it("should create 2a AsyncChildItem instead of a AsyncParentItem when the AsyncParentItem overrides the from method", async function () {
                const responseJSON = {
                    "@type": "AsyncChildItem",
                    test: "test"
                } as any

                const response = await AsyncChildItem.from(responseJSON)

                expect(response).to.be.instanceOf(AsyncParentItem)
                expect(response).to.be.instanceOf(AsyncChildItem)

                expect(response.test).to.equal("test")
            })

            it("should create a SyncChildItem instead of a SyncParentItem when the SyncParentItem overrides the from method", async function () {
                const responseJSON = {
                    "@type": "SyncChildItem",
                    test: "test"
                } as any

                const response = await SerializableAsync.fromUnknown(responseJSON)

                expect(response).to.be.instanceOf(SyncParentItem)
                expect(response).to.be.instanceOf(SyncChildItem)

                expect((response as SyncChildItem).test).to.equal("test")
            })

            it("should create 2a SyncChildItem instead of a SyncParentItem when the SyncParentItem overrides the from method", async function () {
                const responseJSON = {
                    "@type": "SyncChildItem",
                    test: "test"
                } as any

                const response = await SyncChildItem.fromAny(responseJSON)

                expect(response).to.be.instanceOf(SyncParentItem)
                expect(response).to.be.instanceOf(SyncChildItem)

                expect(response.test).to.equal("test")
            })
        })
    }
}
