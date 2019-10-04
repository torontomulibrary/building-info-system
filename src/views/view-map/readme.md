# view-map



<!-- Auto Generated Below -->


## Properties

| Property               | Attribute    | Description                                                                                                                        | Type            | Default     |
| ---------------------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------------- | --------------- | ----------- |
| `appLoaded`            | `app-loaded` | A global flag passed in to indicate if the application has loaded as well.                                                         | `boolean`       | `false`     |
| `history` _(required)_ | --           | Reference to the stencil-router history object. Used to programmatically change the browser history when the selected FAQ changes. | `RouterHistory` | `undefined` |
| `match` _(required)_   | --           | The results coming from `stencil-router` that contain any URL matches.                                                             | `MatchResults`  | `undefined` |


## Events

| Event        | Description                                                          | Type               |
| ------------ | -------------------------------------------------------------------- | ------------------ |
| `dataLoaded` | Event fired when the data specific to this view is finished loading. | `CustomEvent<any>` |


## Dependencies

### Depends on

- stencil-route-title
- rl-pan-zoom
- [rl-floorplan](../../components/floorplan)
- [rl-side-sheet](../../components/side-sheet)
- [rl-map-nav](../../components/map-nav)

### Graph
```mermaid
graph TD;
  view-map --> stencil-route-title
  view-map --> rl-pan-zoom
  view-map --> rl-floorplan
  view-map --> rl-side-sheet
  view-map --> rl-map-nav
  style view-map fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
