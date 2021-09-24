import "reflect-metadata"
import { getReflectProperty } from "../reflection/globals"
import { SerializableAsync } from "../SerializableAsync"
import { SerializableBase } from "../SerializableBase"
import { SerializeParameter } from "./SerializeParameter"

export class Serialize {
    public static serialize(params?: SerializeParameter) {
        return function (target: any, propertyKey: string): void {
            const result = Reflect.getOwnMetadata("design:type", target, propertyKey)
            if (!result) {
                throw new Error(
                    `No type information for property ${propertyKey} of class ${target} (constructor ${target.constructor}). This usually happens if you declare classes in one scope, but access them from another scope - try to check your imports if you importing the same class.`
                )
            }

            const prop = getReflectProperty(target, propertyKey, result.name)
            prop.type = result.name
            prop.typeInfo = result

            const lowerType = prop.type.toLowerCase()
            if (lowerType === "boolean" || lowerType === "array" || lowerType === "number" || lowerType === "string") {
                prop.primitiveType = lowerType
            } else {
                prop.primitiveType = "object"
            }

            let key
            switch (prop.type) {
                case "Object":
                    key = "."
                    break
                case "Array":
                    key = "[]"
                    break
                case "Map":
                    key = "{}"
                    break
            }

            if (key) {
                if (params?.type) {
                    prop.itemDescriptor = { key: key, type: params.type.name, typeInfo: params.type }
                } else {
                    prop.itemDescriptor = {
                        key: key,
                        type: "SerializableAsync",
                        typeInfo: SerializableAsync,
                        parseUnknown: true
                    }
                }
            }

            if (!params) {
                return
            }
            prop.enforceString = params.enforceString

            if (params.any) {
                prop.any = params.any
            }

            if (params.deserializeStrings) {
                prop.deserializeStrings = params.deserializeStrings
            }

            if (params.alias) {
                prop.alias = params.alias
            }

            if (params.customGenerator) {
                prop.customGenerator = params.customGenerator
            }
            if (params.parseUnknown) {
                prop.parseUnknown = params.parseUnknown
            }
            if (params.customDeserializer) {
                prop.customDeserializer = params.customDeserializer
            }
            if (params.customParser) {
                prop.customParser = params.customParser
            }

            if (params.optional) {
                prop.optional = true
            }
        }
    }
}

export function schema(context: string, type?: string, version?: string) {
    return (target: any): void => {
        Reflect.defineMetadata("design:type", String, target, "@context")
        Reflect.defineMetadata("design:type", String, target, "@type")
        Reflect.defineMetadata("design:type", String, target, "@version")
        Reflect.defineMetadata(type ? type : target.constructor.name, target, SerializableBase, "types")

        const propContext = getReflectProperty(target, "@context")
        propContext.value = context

        if (type) {
            const propType = getReflectProperty(target, "@type")
            propType.value = type
        }

        if (version) {
            const propVersion = getReflectProperty(target, "@version")
            propVersion.value = version
        }
    }
}

export function type(type: string, version?: string) {
    return (target: any): void => {
        Reflect.defineMetadata("design:type", String, target, "@context")
        Reflect.defineMetadata("design:type", String, target, "@type")
        Reflect.defineMetadata("design:type", String, target, "@version")
        Reflect.defineMetadata(type, target, SerializableBase, "types")

        const propType = getReflectProperty(target, "@type")
        propType.value = type

        if (version) {
            const propVersion = getReflectProperty(target, "@version")
            propVersion.value = version
        }
    }
}

export function version(version: string) {
    return (target: any): void => {
        Reflect.defineMetadata("design:type", String, target, "@context")
        Reflect.defineMetadata("design:type", String, target, "@type")
        Reflect.defineMetadata("design:type", String, target, "@version")
        Reflect.defineMetadata(type, target, SerializableBase, "types")

        const propVersion = getReflectProperty(target, "@version")
        propVersion.value = version
    }
}

export function serializeOnly(
    serializeProperty: string,
    type: "string" | "number" | "boolean" | "array" | "object" = "object"
) {
    return (target: any): void => {
        Reflect.defineMetadata("design:type", String, target, "serializeAs")
        Reflect.defineMetadata("design:type", String, target, "serializeProperty")

        const serializeAs = getReflectProperty(target, "serializeAs")
        serializeAs.value = type
        serializeAs.validate = false
        serializeAs.serialize = false

        const serializeProp = getReflectProperty(target, "serializeProperty")
        serializeProp.value = serializeProperty
        serializeProp.validate = false
        serializeProp.serialize = false
    }
}

export function serialize(params?: SerializeParameter): any {
    return Serialize.serialize(params)
}
