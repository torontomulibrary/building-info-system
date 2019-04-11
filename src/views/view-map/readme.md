# view-map



<!-- Auto Generated Below -->


## Properties

| Property             | Attribute    | Description                                                                                                           | Type                                                         | Default              |
| -------------------- | ------------ | --------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ | -------------------- |
| `appLoaded`          | `app-loaded` | The global object of all application data. A global flag passed in to indicate if the application has loaded as well. | `boolean`                                                    | `false`              |
| `mapType`            | `map-type`   |                                                                                                                       | `MAP_TYPE.BOOKS \| MAP_TYPE.COMPUTERS \| MAP_TYPE.DIRECTORY` | `MAP_TYPE.DIRECTORY` |
| `match` _(required)_ | --           | The results coming from `stencil-router` that contain any URL matches.                                                | `MatchResults`                                               | `undefined`          |


## Events

| Event        | Description                                                          | Type                |
| ------------ | -------------------------------------------------------------------- | ------------------- |
| `dataLoaded` | Event fired when the data specific to this view is finished loading. | `CustomEvent<void>` |


## Methods

### `setActiveElement(id: number) => void`



#### Parameters

| Name | Type     | Description |
| ---- | -------- | ----------- |
| `id` | `number` |             |

#### Returns

Type: `void`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
