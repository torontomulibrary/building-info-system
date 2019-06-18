# view-building



<!-- Auto Generated Below -->


## Properties

| Property               | Attribute    | Description                                                                                                                        | Type            | Default     |
| ---------------------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------------- | --------------- | ----------- |
| `appLoaded`            | `app-loaded` | Global flag indicating if the whole application has loaded.  If not, this view should not display either.                          | `boolean`       | `false`     |
| `history` _(required)_ | --           | Reference to the stencil-router history object. Used to programmatically change the browser history when the selected FAQ changes. | `RouterHistory` | `undefined` |


## Dependencies

### Depends on

- stencil-route-title
- [rl-card](../../components/card)
- [rl-expansion-panel](../../components/expansion-panel)

### Graph
```mermaid
graph TD;
  view-building --> stencil-route-title
  view-building --> rl-card
  view-building --> rl-expansion-panel
  style view-building fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
