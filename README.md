# TS SerVal

[![GitHub Actions CI](https://github.com/js-soft/ts-serval/workflows/Publish/badge.svg)](https://github.com/js-soft/ts-serval/actions?query=workflow%3APublish)
[![npm version](https://badge.fury.io/js/@js-soft%2fts-serval.svg)](https://www.npmjs.com/package/@js-soft/ts-serval)

TS SerVal (**T**ype**S**cript **Ser**ialization and **Val**idation) is a TypeScript library for runtime serialization and validation of JSON objects to/from JavaScript classes. It is using TypeScript decorators (e.g. @serialize()) to mark classes and properties for serialization and validation. It heavily uses reflection and TypeScript decorators.

## Documentation

The documentation for this package is currently under construction.

### Features

#### JSONWrapper & JSONWrapperAsync

If you require to set any JSON content to a Serializable property, you can use JSONWrapper or JSONWrapperAsync. They enable the (de-)serialization with `serialize()`, `toJSON()`, `from()` or `deserialize()` in a generic way.

The wrappers store all content into a generic `value` property as JSON. This property is transparent, meaning that `value` won't appear in the serialized output. However, accessing the `value` is required while using the wrappers programmatically.

The wrappers are automatically used if ts-serval encounters a property of type Serializable (=> JSONWrapper) or SerializableAsync (=> JSONWrapperAsync).

#### Type `any`

If you would like to allow any type (be it any object, boolean, string, number), set `{any:true}` within the @serialize() descriptor. This will disable most of the parsing and (de-)serialization logic.

```typescript
@validate()
@serialize({any:true})
public content:any
```

If you would also like to allow `null` values, use `{nullable:true}` within the @validate() descriptor.

```typescript
@validate({nullable:true})
@serialize({any:true})
public content:any
```

## Contribute

Currently contribution to this project is not possible. This will change soon.

## License

[MIT](LICENSE)
