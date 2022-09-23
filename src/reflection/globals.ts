import { SerializableBase } from "../SerializableBase"
import { IReflectProperty } from "./ReflectProperty"

export const propertyBucketName = "serializableProperties"

export function getReflectProperty(target: any, propertyKey: string, type = "any"): IReflectProperty {
    const constructorDefinition: any =
        target.constructor.name !== "Function" ? target.constructor.prototype.constructor : target

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!SerializableBase.__propertyDescriptorsByClassName) {
        SerializableBase.__propertyDescriptorsByClassName = new Map<string, any>()
    }

    let propClass = SerializableBase.__propertyDescriptorsByClassName.get(constructorDefinition.name)
    if (!propClass) {
        propClass = new Map<string, IReflectProperty>()
        SerializableBase.__propertyDescriptorsByClassName.set(constructorDefinition.name, propClass)
    }

    let propInstance = propClass.get(propertyKey)
    if (!propInstance) {
        const lowerType = type.toLowerCase()
        let primitiveType = "object"
        if (lowerType === "boolean" || lowerType === "array" || lowerType === "number" || lowerType === "string") {
            primitiveType = lowerType
        }
        propInstance = { key: propertyKey, type: type, primitiveType: primitiveType, typeInfo: target }
        propClass.set(propertyKey, propInstance)
    }

    return propInstance
}
