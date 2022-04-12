import { Inheritance2Test } from "./Inheritance.test"
import { ParentConstructorTest } from "./ParentConstructor.test"
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
import { SerializeUnionTypesArrayAsyncTest } from "./serialize/async/SerializeUnionTypesArrayAsync.test"
import { SerializeUnionTypesAsyncTest } from "./serialize/async/SerializeUnionTypesAsync.test"
import { VersioningAsyncTest } from "./serialize/async/VersioningAsync.test"
import { ArrayInheritanceTest } from "./serialize/sync/ArrayInheritance.test"
import { InheritanceTest } from "./serialize/sync/Inheritance.test"
import { SerializeAnyPropertyTest } from "./serialize/sync/SerializeAnyProperty.test"
import { SerializeClassPropertyTest } from "./serialize/sync/SerializeClassProperty.test"
import { SerializeEnforceStringPropertyTest } from "./serialize/sync/SerializeEnforceStringProperty.test"
import { SerializeGenericPropertyTest } from "./serialize/sync/SerializeGenericProperty.test"
import { SerializeMultiTypeTest } from "./serialize/sync/SerializeMultiType.test"
import { SerializeOnlyTest } from "./serialize/sync/SerializeOnly.test"
import { SerializeTypedArrayTest } from "./serialize/sync/SerializeTypedArray.test"
import { SerializeUnionTypesTest } from "./serialize/sync/SerializeUnionTypes.test"
import { SerializeUnionTypesArrayTest } from "./serialize/sync/SerializeUnionTypesArray.test"
import { SerializeWrapperTest } from "./serialize/sync/SerializeWrapper.test"
import { VersioningTest } from "./serialize/sync/Versioning.test"
import { CoreTest } from "./usage/Core.test"
import { CryptoTest } from "./usage/Crypto.test"
import { ValidateAnyPropertyTest } from "./validate/ValidateAnyProperty.test"
import { ValidateGenericPropertyTest } from "./validate/ValidateGenericProperty.test"
import { ValidatePropertyAnnotatedWithTypeTest } from "./validate/ValidatePropertyAnnotatedWithTypeTest.test"

function runSerializeAsync(): void {
    SerializeAsyncEnforceStringPropertyTest.init()
    SerializeAsyncClassPropertyTest.init()
    SerializeAsyncMultiTypeTest.init()
    SerializeOnlyAsyncTest.init()
    SerializeAsyncGenericPropertyTest.init()
    SerializeAsyncAnyPropertyTest.init()
    InheritanceAsyncTest.init()
    ArrayInheritanceAsyncTest.init()
    SerializeUnionTypesArrayAsyncTest.init()
    SerializeAsyncTypedArrayTest.init()
    SerializeUnionTypesAsyncTest.init()
    SerializeAsyncWrapperTest.init()
    VersioningAsyncTest.init()
}

function runSerializeSync(): void {
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
    SerializeUnionTypesArrayTest.init()
    SerializeUnionTypesTest.init()
    SerializeWrapperTest.init()
    VersioningTest.init()
}

function runValidate(): void {
    ValidateAnyPropertyTest.init()
    ValidateGenericPropertyTest.init()
}

function runUsage() {
    CoreTest.init()
    ParentConstructorTest.init()
    CryptoTest.init()
    Inheritance2Test.init()
}

runSerializeAsync()
runSerializeSync()
runValidate()
runUsage()
