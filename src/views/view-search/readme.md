# view-home



<!-- Auto Generated Below -->


## Properties

| Property               | Attribute    | Description | Type                  | Default     |
| ---------------------- | ------------ | ----------- | --------------------- | ----------- |
| `appLoaded`            | `app-loaded` |             | `boolean`             | `false`     |
| `history` _(required)_ | --           |             | `RouterHistory`       | `undefined` |
| `match` _(required)_   | --           |             | `MatchResults`        | `undefined` |
| `searchUrl`            | `search-url` |             | `string \| undefined` | `undefined` |


## Dependencies

### Depends on

- [rl-collection](../../components/collection)
- [rl-card](../../components/card)

### Graph
```mermaid
graph TD;
  view-search --> rl-collection
  view-search --> rl-card
  style view-search fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
