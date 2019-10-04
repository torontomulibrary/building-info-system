# rl-map-nav



<!-- Auto Generated Below -->


## Properties

| Property                      | Attribute | Description                                | Type          | Default     |
| ----------------------------- | --------- | ------------------------------------------ | ------------- | ----------- |
| `activeBuilding` _(required)_ | --        | The `id` of the currently active building. | `Building`    | `undefined` |
| `activeFloor` _(required)_    | --        | The `id` of the currently active floor.    | `Floor`       | `undefined` |
| `buildings` _(required)_      | --        | An id-indexed map of the buildings.        | `BuildingMap` | `undefined` |
| `floors` _(required)_         | --        | An id-indexed map of floors.               | `FloorMap`    | `undefined` |


## Events

| Event             | Description                                          | Type               |
| ----------------- | ---------------------------------------------------- | ------------------ |
| `buildingChanged` | An event emitted when the selected Building changes. | `CustomEvent<any>` |
| `floorChanged`    | An event emitted when the selected Floor changes.    | `CustomEvent<any>` |


## Dependencies

### Used by

 - [view-map](../../views/view-map)

### Graph
```mermaid
graph TD;
  view-map --> rl-map-nav
  style rl-map-nav fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
