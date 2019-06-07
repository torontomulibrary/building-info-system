# view-home



<!-- Auto Generated Below -->


## Properties

| Property               | Attribute    | Description | Type            | Default     |
| ---------------------- | ------------ | ----------- | --------------- | ----------- |
| `appLoaded`            | `app-loaded` |             | `boolean`       | `false`     |
| `history` _(required)_ | --           |             | `RouterHistory` | `undefined` |


## Dependencies

### Depends on

- stencil-route-title
- [rl-cluster](../../components/cluster)

### Graph
```mermaid
graph TD;
  view-book --> stencil-route-title
  view-book --> rl-cluster
  rl-cluster --> rl-card
  rl-cluster --> stencil-route-link
  rl-card --> stencil-route-link
  style view-book fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
