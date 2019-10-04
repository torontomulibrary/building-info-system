# view-home



<!-- Auto Generated Below -->


## Properties

| Property               | Attribute         | Description                                                                                                                        | Type            | Default     |
| ---------------------- | ----------------- | ---------------------------------------------------------------------------------------------------------------------------------- | --------------- | ----------- |
| `appLoaded`            | `app-loaded`      |                                                                                                                                    | `boolean`       | `false`     |
| `clusterColumns`       | `cluster-columns` |                                                                                                                                    | `number`        | `2`         |
| `history` _(required)_ | --                | Reference to the stencil-router history object. Used to programmatically change the browser history when the selected FAQ changes. | `RouterHistory` | `undefined` |
| `isMobile`             | `is-mobile`       |                                                                                                                                    | `boolean`       | `false`     |


## Dependencies

### Depends on

- stencil-route-title
- [rl-cluster](../../components/cluster)

### Graph
```mermaid
graph TD;
  view-home --> stencil-route-title
  view-home --> rl-cluster
  rl-cluster --> stencil-route-link
  rl-cluster --> rl-card
  rl-cluster --> rl-card
  style view-home fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
