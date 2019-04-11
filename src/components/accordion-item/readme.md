# rl-accordion-item



<!-- Auto Generated Below -->


## Properties

| Property | Attribute | Description                                                                                          | Type      | Default |
| -------- | --------- | ---------------------------------------------------------------------------------------------------- | --------- | ------- |
| `delay`  | `delay`   | A delay used to fade-in this item a specific amount of time after the component is rendered.         | `number`  | `0`     |
| `index`  | `index`   | An index number used to reference this item in the larger list of all items in the parent accordion. | `number`  | `0`     |
| `isOpen` | `is-open` | A state tracking the current open/closed state of this item.                                         | `boolean` | `false` |


## Events

| Event           | Description                                                      | Type                |
| --------------- | ---------------------------------------------------------------- | ------------------- |
| `afterCollapse` | Event emitted after the body's collapse animation has completed. | `CustomEvent<void>` |
| `afterExpand`   |                                                                  | `CustomEvent<void>` |
| `closed`        |                                                                  | `CustomEvent<void>` |
| `opened`        |                                                                  | `CustomEvent<void>` |


## Methods

### `close() => void`

This function closes this item.

#### Returns

Type: `void`



### `open() => void`

This function opens this item.

#### Returns

Type: `void`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
