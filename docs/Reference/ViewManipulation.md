## Manipulating View

## client.setSearch

`async client.setSearch(collectionName, enable, field)`

Set search capability of a collection (enabling or disabling it). If the collection does not exist, it will be created.

**Arguments**

- **collectionName**: `string`

  Collection for which to set search capability.

- **enable**: `boolean`

  Whether to enable or disable search capability.

- **field**: `string`

  For which field to enable search capability.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const data = await client.setSearch("some-collection", true, "some-field");
```

## client.searchInCollection

`async client.searchInCollection(collectionName, search, [bindVars], [ttl])`

Search a collection for string matches.

The specified search query will be executed for the collection. The results of the search will be in the response. If
there are too many results, an "id" will be specified for the cursor that can be used to obtain the remaining results.

**Arguments**

- **collectionName**: `string`

  Collection for which to set search capability.

- **search**: `string`

  An C8QL query string or a [query builder](https://npmjs.org/package/aqb)  instance.

- **bindVars**: `object` (optional)

  An object defining the variables to bind the query to.

- **ttl**: `number` (optional)

  TTL in seconds.

  Default value : 60

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const data = await client.searchInCollection("some-collection", "RETURN doc", {}, 60);
```

## client.getListOfViews

`async client.getListOfViews()`

Returns an object containing an array of all view descriptions.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const data = await client.getListOfViews();
```

## client.createView

`async client.createView(viewName, [properties])`

Creates a new view with a given name and properties if it does not already exist.

**Note:** view can't be created with the links. Please use PUT/PATCH for links management.

**Arguments**

- **viewName**: `string`

  The name of the view.

- **properties**: `object` (optional)

    - **links**:
      - **[collection-name]**:
        - **analyzers**: `Array<string>`
          The list of analyzers to be used for indexing of string values (default: ["identity"]).
        - **fields**:
          - **field-name**: `object`
            This is a recursive structure for the specific attribute path, potentially containing any of the following attributes: analyzers, includeAllFields, trackListPositions, storeValues
            Any attributes not specified are inherited from the parent.
        - **includeAllFields**: `boolean`
          The flag determines whether or not to index all fields on a particular level of depth (default: false).
        - **trackListPositions**: `boolean`
          The flag determines whether or not values in a lists should be treated separate (default: false).
        - **storeValues**: `string`
          How should the view track the attribute values, this setting allows for additional value retrieval optimizations, one of:
          - **none**: Do not store values by the view
          - **id**: 'string'
            Store only information about value presence, to allow use of the EXISTS() function (default "none").
                
**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const data = await client.createView("some-view", { links: { "some-collection": { } } });
```

## client.getViewInfo

`async client.getViewInfo(viewName)`

Return information about a view.

**Arguments**

- **viewName**: `string`

  The name of the view.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const data = await client.getViewInfo("some-view");
```

## client.renameView

`async client.renameView(viewName, newName)`

Renames a view.

**Note**: This method is not available in a cluster.

**Arguments**

- **viewName**: `string`

  The current name of the view.
  
- **newName**: `string`

  The new name of the view.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const data = await client.renameView("some-view", "some-new-view");
```

## client.deleteView

`async client.deleteView(viewName)`

Deletes the view identified by view name.

**Arguments**

- **viewName**: `string`

  The name of the view.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const data = await client.deleteView("some-view");
```

## client.getViewProperties

`async client.getViewProperties(viewName)`

Returns an object containing the definition of the view identified by view name.

**Arguments**

- **viewName**: `string`

  The name of the view.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const data = await client.getViewProperties("some-view");
```

## client.updateViewProperties

`async client.updateViewProperties(viewName, properties)`

Changes the properties of a view.

**Arguments**

- **viewName**: `string`

  The name of the view.

- **properties**: `object`

    - **links**:
        - **[collection-name]**:
            - **analyzers**: `Array<string>`
                The list of analyzers to be used for indexing of string values (default: ["identity"]).
            - **fields**:
                - **field-name**: `object`
                    This is a recursive structure for the specific attribute path, potentially containing any of the following attributes: analyzers, includeAllFields, trackListPositions, storeValues
                    Any attributes not specified are inherited from the parent.
            - **includeAllFields**: `boolean`
                The flag determines whether or not to index all fields on a particular level of depth (default: false).
            - **trackListPositions**: `boolean`
                The flag determines whether or not values in a lists should be treated separate (default: false).
            - **storeValues**: `string`
                How should the view track the attribute values, this setting allows for additional value retrieval optimizations, one of:
                - none: Do not store values by the view
                - **id**: 'string'
                Store only information about value presence, to allow use of the EXISTS() function (default "none").

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const data = await client.updateViewProperties("some-view", { links: { "some-collection": { } } });
```

## client.getListOfAnalyzers

`async client.getListOfAnalyzers()`

Retrieves an array of all analyzer definitions.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const data = await client.getListOfAnalyzers();
```

## client.createAnalyzer

`async client.createAnalyzer(analyzerName, type, [properties], [features])`

Creates a new analyzer based on the provided configuration.

**Arguments**

- **analyzerName**: `string`

  The name of the analyzer.

- **type**: `string`

  The name of the analyzer type.

- **properties**: `object` (optional)

  The properties used to configure the specified type. Value may be an object or null. The default value is null.

- **features**: `Array<string>` (optional)

  The set of features to set on the analyzer generated fields.The default value is an empty array.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const data = await client.createAnalyzer("some-analyzer", "identity");
```

## client.deleteAnalyzer

`async client.deleteAnalyzer(analyzerName, [force])`

Removes an analyzer configuration identified by analyzer name.

**Arguments**

- **analyzerName**: `string`

  The name of the analyzer.

- **force**: `boolean` (optional)

  The analyzer configuration should be removed even if it is in-use. The default value is false.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const data = await client.deleteAnalyzer("some-analyzer", true);
```

## client.getAnalyzerDefinition

`async client.getAnalyzerDefinition(analyzerName)`

Retrieves the full definition for the specified analyzer name.

**Arguments**

- **analyzerName**: `string`

  The name of the analyzer.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const data = await client.getAnalyzerDefinition("some-analyzer");
```