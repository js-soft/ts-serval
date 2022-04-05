import { SerializationError } from "./errors"
import { IReflectProperty } from "./reflection/ReflectProperty"
import { Validator } from "./validation/Validator"

export class SerializableBase {
    public static __classes: Map<string, Map<string, IReflectProperty>> // eslint-disable-line @typescript-eslint/naming-convention
    public static __modules: any[] = [SerializableBase] // eslint-disable-line @typescript-eslint/naming-convention
    private readonly __propertyMap: Map<string, IReflectProperty> | undefined // eslint-disable-line @typescript-eslint/naming-convention

    public static addModule(syncModule: any): void {
        SerializableBase.__modules.push(syncModule)
    }

    public static getModule(type: string, version: number): any {
        const typeAndVersion = `${type}@${version}`
        for (const module of SerializableBase.__modules) {
            const implementation = Reflect.getMetadata(typeAndVersion, module, "types")
            if (implementation) return implementation
        }
        return null
    }

    public constructor() {
        this.__propertyMap = SerializableBase.getDescriptor(this.constructor.name)
        if (this.__propertyMap) {
            SerializableBase.copyDescriptorsFromPrototypeChain(this.__propertyMap, (this as any).constructor.prototype)
        }
    }

    private static copyDescriptorsFromPrototypeChain(
        storeInMap: Map<string, IReflectProperty>,
        currentPrototype: any
    ): void {
        const name: string = currentPrototype.__proto__.constructor.name
        if (
            name === "Function" ||
            name === "Object" ||
            name === "Serializable" ||
            name === "SerializableAsync" ||
            name === "SerializableBase"
        ) {
            return
        }
        const currentDescriptors = SerializableBase.getDescriptor(name)
        if (currentDescriptors) {
            currentDescriptors.forEach((value, key) => {
                if (key === "@type" || key === "@version" || key === "@context") return
                storeInMap.set(key, value)
            })
        }

        SerializableBase.copyDescriptorsFromPrototypeChain(storeInMap, currentPrototype.__proto__)
    }

    public static getDescriptor(target: string): Map<string, IReflectProperty> | undefined {
        const map = SerializableBase.__classes.get(target)
        return map
    }

    public getDescriptor(): Map<string, IReflectProperty> | undefined {
        return this.__propertyMap
    }

    /**
     * Validates all defined properties on this object
     *
     * @returns Either an error string or undefined (no errors)
     */
    public validate(): string | undefined {
        let err
        const propertyMap = this.getDescriptor()
        if (propertyMap) {
            for (const [key, info] of propertyMap) {
                if (
                    key === "@type" ||
                    key === "@version" ||
                    key === "@context" ||
                    key === "serializeProperty" ||
                    key === "serializeAs"
                ) {
                    continue
                }

                err = this.validateProperty(key, info)
                if (err) {
                    return `Validating ${key}:${info.type} :: ${err}`
                }
            }
        }
        return undefined
    }

    public validateProperty(key: string, descriptor?: IReflectProperty): string | undefined {
        if (!descriptor) {
            const propertyMap = this.getDescriptor()
            if (!propertyMap) {
                return `No descriptor available for key ${key} (propertyMap is missing)`
            }
            descriptor = propertyMap.get(key)
        }
        if (!descriptor) {
            return `No descriptor available for key ${key}`
        }

        return Validator.checkProperty(this[key], descriptor)
    }

    public static checkProperty(value: any, key: string, className: string): string | undefined {
        const propertyMap = this.getDescriptor(className)
        if (!propertyMap) {
            return `No descriptor available for key ${key} (propertyMap is missing)`
        }
        const descriptor = propertyMap.get(key)
        if (!descriptor) {
            return `No descriptor available for key ${key}`
        }
        return Validator.checkProperty(value, descriptor)
    }

    /**
     * Serializes the object by calling JSON.stringify
     *
     * @returns The serialized JSON string "{...}"
     */
    public serialize(verbose = true): string {
        return JSON.stringify(this.toJSON(verbose, false))
    }

    /**
     * Returns an object representation of this object. Careful, this is not a string - if
     * you require a string call [[serialize()]] instead.
     *
     * @returns An object representation of this object {...}
     */
    public toJSON(verbose = true, serializeAsString = false): Object {
        const obj: any = {}
        const propertyMap = this.getDescriptor()
        let serializeAs: "number" | "boolean" | "string" | "array" | "object" = "object"
        let serializeProperty: string | undefined = undefined
        if (propertyMap) {
            propertyMap.forEach((info: IReflectProperty, key: string) => {
                if (key === "serializeAs") {
                    serializeAs = info.value
                } else if (key === "serializeProperty") {
                    serializeProperty = info.value
                } else if (key === "@type") {
                    if (verbose) {
                        obj[key] = info.value
                    }
                } else if (key === "@version") {
                    if (info.value !== 1 && verbose) {
                        obj[key] = info.value
                    }
                } else if (key === "@context") {
                    if (verbose) {
                        obj[key] = info.value
                    }
                } else {
                    const jsonKey = info.alias ? info.alias : key
                    const value = this.serializeProperty(this[key], info, false, serializeAsString)
                    if (typeof value !== "undefined") {
                        obj[jsonKey] = value
                    }
                }
            })
        }
        if (typeof serializeAs !== "undefined" && typeof serializeProperty !== "undefined") {
            if (!propertyMap?.has(serializeProperty)) {
                throw new SerializationError(
                    this.constructor.name,
                    serializeProperty,
                    "Property is not available in object but is the only property which should be serialized."
                )
            }
            return this.serializeProperty(
                this[serializeProperty],
                propertyMap.get(serializeProperty)!,
                false,
                serializeAsString
            )
        }
        const newObj: any = {}
        const keys: string[] = []
        for (const prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                keys.push(prop)
            }
        }
        keys.sort()
        for (let i = 0, l = keys.length; i < l; i++) {
            newObj[keys[i]] = obj[keys[i]]
        }
        return newObj
    }

    private serializeProperty(
        value: any,
        descriptor: IReflectProperty,
        verbose = false,
        serializeAsString = false
    ): any {
        // Do not render out the property if the value is undefined and the property is optional
        if (descriptor.optional && typeof value === "undefined") {
            return undefined
        }

        // Do render null if the property is not set
        if (Validator.checkDefined(value, descriptor)) {
            return null
        }

        if (typeof descriptor.customSerializer === "function" && serializeAsString) {
            const ret = descriptor.customSerializer(value, descriptor, verbose)
            return ret
        }

        if (typeof descriptor.customGenerator === "function") {
            const ret = descriptor.customGenerator(value, descriptor, verbose)
            return ret
        }

        switch (descriptor.type) {
            case "Number":
            case "Boolean":
            case "String":
                return value

            case "Array":
                if (!descriptor.itemDescriptor) {
                    throw new SerializationError(
                        this.constructor.name,
                        descriptor.key,
                        "No itemDescriptor for Array set."
                    )
                }
                const ar: any[] = []

                if (!value) {
                    return ar
                }

                for (const element of value) {
                    ar.push(this.serializeProperty(element, descriptor.itemDescriptor, verbose, serializeAsString))
                }

                return ar
            default:
                // We always require the type information if it could be anything
                if (descriptor.any) {
                    verbose = true
                }

                // We require the type information if we have subclasses of the given types
                const valueProt = Object.getPrototypeOf(value)
                if (
                    (typeof descriptor.allowSubclasses === "undefined" || descriptor.allowSubclasses) &&
                    typeof value === "object" &&
                    valueProt !== descriptor.typeInfo.prototype
                ) {
                    verbose = true
                }
                if (value instanceof SerializableBase) {
                    if (descriptor.enforceString || serializeAsString) {
                        return value.serialize(verbose)
                    }
                    return value.toJSON(verbose)
                } else if (value instanceof Promise) {
                    throw new SerializationError(
                        this.constructor.name,
                        descriptor.key,
                        "Object is not yet resolved. You have to wait for Promises to proceed with serialization."
                    )
                } else if (typeof value.toJSON === "function") {
                    if (descriptor.enforceString || serializeAsString) {
                        return JSON.stringify(value.toJSON())
                    }
                    return value.toJSON()
                } else {
                    return value
                }
        }
    }
}
