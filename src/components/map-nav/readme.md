# rula-map-nav



<!-- Auto Generated Below -->


## Properties

| Property         | Attribute         | Description                                | Type          |
| ---------------- | ----------------- | ------------------------------------------ | ------------- |
| `activeBuilding` | `active-building` | The `id` of the currently active building. | `number`      |
| `activeFloor`    | `active-floor`    | The `id` of the currently active floor.    | `number`      |
| `buildings`      | --                | An id-indexed map of the buildings.        | `BuildingMap` |
| `floors`         | --                | An id-indexed map of floors.               | `FloorMap`    |


## Events

| Event             | Detail | Description                                          |
| ----------------- | ------ | ---------------------------------------------------- |
| `buildingChanged` |        | An event emitted when the selected Building changes. |
| `floorChanged`    |        | An event emitted when the selected Floor changes.    |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
