# rl-cluster



<!-- Auto Generated Below -->


## Properties

| Property   | Attribute   | Description | Type                         | Default     |
| ---------- | ----------- | ----------- | ---------------------------- | ----------- |
| `columns`  | `columns`   |             | `number`                     | `2`         |
| `data`     | --          |             | `ClusterData[] \| undefined` | `undefined` |
| `hasMore`  | `has-more`  |             | `boolean`                    | `false`     |
| `heading`  | `heading`   |             | `string`                     | `''`        |
| `isMobile` | `is-mobile` |             | `boolean`                    | `false`     |
| `parentEl` | --          |             | `HTMLElement \| undefined`   | `undefined` |


## Dependencies

### Used by

 - [view-home](../../views/view-home)
 - [view-search](../../views/view-search)

### Depends on

- stencil-route-link
- [rl-card](../card)
- [rl-card](../card)

### Graph
```mermaid
graph TD;
  rl-cluster --> stencil-route-link
  rl-cluster --> rl-card
  rl-cluster --> rl-card
  view-home --> rl-cluster
  view-search --> rl-cluster
  style rl-cluster fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
