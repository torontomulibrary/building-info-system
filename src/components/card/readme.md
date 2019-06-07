# rl-card



<!-- Auto Generated Below -->


## Properties

| Property           | Attribute            | Description | Type                                             | Default                    |
| ------------------ | -------------------- | ----------- | ------------------------------------------------ | -------------------------- |
| `buttons`          | --                   |             | `undefined \| { name: string; link: string; }[]` | `undefined`                |
| `cardColor`        | --                   |             | `Color`                                          | `new Color(255, 255, 255)` |
| `cardData`         | `card-data`          |             | `string \| { [keys: string]: string[]; }`        | `{}`                       |
| `cardMedia`        | `card-media`         |             | `string`                                         | `''`                       |
| `cardTitle`        | `card-title`         |             | `string`                                         | `''`                       |
| `hasPrimaryAction` | `has-primary-action` |             | `boolean`                                        | `false`                    |
| `icons`            | --                   |             | `undefined \| { name: string; }[]`               | `undefined`                |
| `mediaSize`        | `media-size`         |             | `"contain" \| "cover"`                           | `'cover'`                  |
| `noContent`        | `no-content`         |             | `boolean`                                        | `false`                    |
| `noMedia`          | `no-media`           |             | `boolean`                                        | `false`                    |
| `titleInMedia`     | `title-in-media`     |             | `boolean`                                        | `false`                    |
| `wideMediaAspect`  | `wide-media-aspect`  |             | `boolean`                                        | `false`                    |


## Events

| Event         | Description | Type               |
| ------------- | ----------- | ------------------ |
| `cardClicked` |             | `CustomEvent<any>` |


## Dependencies

### Used by

 - [rl-cluster](../cluster)
 - [view-building](../../views/view-building)

### Depends on

- stencil-route-link

### Graph
```mermaid
graph TD;
  rl-card --> stencil-route-link
  rl-cluster --> rl-card
  view-building --> rl-card
  style rl-card fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
