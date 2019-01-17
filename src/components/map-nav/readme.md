# rl-map-nav



<!-- Auto Generated Below -->


## Properties

| Property                      | Attribute         | Description                                | Type          | Default     |
| ----------------------------- | ----------------- | ------------------------------------------ | ------------- | ----------- |
| `activeBuilding` _(required)_ | `active-building` | The `id` of the currently active building. | `number`      | `undefined` |
| `activeFloor` _(required)_    | `active-floor`    | The `id` of the currently active floor.    | `number`      | `undefined` |
| `buildings` _(required)_      | --                | An id-indexed map of the buildings.        | `BuildingMap` | `undefined` |
| `floors` _(required)_         | --                | An id-indexed map of floors.               | `FloorMap`    | `undefined` |


## Events

| Event             | Description                                          | Type                |
| ----------------- | ---------------------------------------------------- | ------------------- |
| `buildingChanged` | An event emitted when the selected Building changes. | `CustomEvent<void>` |
| `floorChanged`    | An event emitted when the selected Floor changes.    | `CustomEvent<void>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
