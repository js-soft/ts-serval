import { ArrayInheritanceAsyncTest } from "./serialize/async/ArrayInheritanceAsync.test"
import { InheritanceAsyncTest } from "./serialize/async/InheritanceAsync.test"
import { SerializeAsyncAnyPropertyTest } from "./serialize/async/SerializeAsyncAnyProperty.test"
import { SerializeAsyncClassPropertyTest } from "./serialize/async/SerializeAsyncClassProperty.test"
import { SerializeAsyncEnforceStringPropertyTest } from "./serialize/async/SerializeAsyncEnforceStringProperty.test"
import { SerializeAsyncGenericPropertyTest } from "./serialize/async/SerializeAsyncGenericProperty.test"
import { SerializeAsyncMultiTypeTest } from "./serialize/async/SerializeAsyncMultiType.test"
import { SerializeAsyncTypedArrayTest } from "./serialize/async/SerializeAsyncTypedArray.test"
import { SerializeAsyncWrapperTest } from "./serialize/async/SerializeAsyncWrapper.test"
import { SerializeOnlyAsyncTest } from "./serialize/async/SerializeOnlyAsync.test"
import { ArrayInheritanceTest } from "./serialize/sync/ArrayInheritance.test"
import { InheritanceTest } from "./serialize/sync/Inheritance.test"
import { SerializeAnyPropertyTest } from "./serialize/sync/SerializeAnyProperty.test"
import { SerializeClassPropertyTest } from "./serialize/sync/SerializeClassProperty.test"
import { SerializeEnforceStringPropertyTest } from "./serialize/sync/SerializeEnforceStringProperty.test"
import { SerializeGenericPropertyTest } from "./serialize/sync/SerializeGenericProperty.test"
import { SerializeMultiTypeTest } from "./serialize/sync/SerializeMultiType.test"
import { SerializeOnlyTest } from "./serialize/sync/SerializeOnly.test"
import { SerializeTypedArrayTest } from "./serialize/sync/SerializeTypedArray.test"
import { SerializeWrapperTest } from "./serialize/sync/SerializeWrapper.test"
import { CoreTest } from "./usage/Core.test"
import { ValidateAnyPropertyTest } from "./validate/ValidateAnyProperty.test"
import { ValidateGenericPropertyTest } from "./validate/ValidateGenericProperty.test"
import { ValidatePropertyAnnotatedWithTypeTest } from "./validate/ValidatePropertyAnnotatedWithTypeTest.test"

export class ServalTest {
    public static runSerializeAsync(): void {
        SerializeAsyncEnforceStringPropertyTest.init()
        SerializeAsyncClassPropertyTest.init()
        SerializeAsyncMultiTypeTest.init()
        SerializeOnlyAsyncTest.init()
        SerializeAsyncGenericPropertyTest.init()
        SerializeAsyncAnyPropertyTest.init()
        InheritanceAsyncTest.init()
        ArrayInheritanceAsyncTest.init()
        SerializeAsyncTypedArrayTest.init()
        SerializeAsyncWrapperTest.init()
    }

    public static runSerializeSync(): void {
        ValidatePropertyAnnotatedWithTypeTest.init()
        SerializeEnforceStringPropertyTest.init()
        SerializeClassPropertyTest.init()
        SerializeMultiTypeTest.init()
        SerializeOnlyTest.init()
        InheritanceTest.init()
        SerializeGenericPropertyTest.init()
        SerializeAnyPropertyTest.init()
        ArrayInheritanceTest.init()
        SerializeTypedArrayTest.init()
        SerializeWrapperTest.init()
    }

    public static runValidate(): void {
        ValidateAnyPropertyTest.init()
        ValidateGenericPropertyTest.init()
    }

    public static runUsage(): void {
        CoreTest.init()
    }

    public static run(): void {
        this.runSerializeAsync()
        this.runSerializeSync()
        this.runValidate()
        this.runUsage()
    }

    public static init(): void {
        this.run()
    }
}
ServalTest.init()
