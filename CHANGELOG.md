## [0.4.1](https://github.com/ryersonlibrary/building-info-system/compare/v0.4.0...v0.4.1) (2019-05-17)


### Bug Fixes

* **app:** DataService returns appropriate type. ([2fee78d](https://github.com/ryersonlibrary/building-info-system/commit/2fee78d))
* **app:** LoadProgress hides properly ([0674ae4](https://github.com/ryersonlibrary/building-info-system/commit/0674ae4))
* **card:** Card action button now StencilRouteLink ([499a5bc](https://github.com/ryersonlibrary/building-info-system/commit/499a5bc)), closes [#18](https://github.com/ryersonlibrary/building-info-system/issues/18)
* **data:** Load events fixed ([7fca4c0](https://github.com/ryersonlibrary/building-info-system/commit/7fca4c0))
* **map:** Remove use of mapRendered event ([1814ca7](https://github.com/ryersonlibrary/building-info-system/commit/1814ca7)), closes [#16](https://github.com/ryersonlibrary/building-info-system/issues/16)
* Remove call to deprecated map function and fix element reselect bug ([b01091b](https://github.com/ryersonlibrary/building-info-system/commit/b01091b))
* **search-box:** Change how search-box and suggestions work ([aa258a0](https://github.com/ryersonlibrary/building-info-system/commit/aa258a0))
* **view-event:** Fix page title and font family ([5cf52ec](https://github.com/ryersonlibrary/building-info-system/commit/5cf52ec))
* **view-map:** Change background color to match map images ([e890cce](https://github.com/ryersonlibrary/building-info-system/commit/e890cce))



# [0.4.0](https://github.com/ryersonlibrary/building-info-system/compare/v0.2.1...v0.4.0) (2019-04-16)


### Bug Fixes

* **accordion:** correct content height ([1390907](https://github.com/ryersonlibrary/building-info-system/commit/1390907))
* housecleaning ([a02623e](https://github.com/ryersonlibrary/building-info-system/commit/a02623e))
* **app:** fix more linting errors ([2b95c6b](https://github.com/ryersonlibrary/building-info-system/commit/2b95c6b))
* **app:** search result click now works ([877cba5](https://github.com/ryersonlibrary/building-info-system/commit/877cba5))
* **app:** Update packages and fix resulting bugs ([66c7dfb](https://github.com/ryersonlibrary/building-info-system/commit/66c7dfb))
* **card:** Card style fixed after material update ([a13b1f4](https://github.com/ryersonlibrary/building-info-system/commit/a13b1f4))
* **map:** `setActiveDetail` now works ([4227585](https://github.com/ryersonlibrary/building-info-system/commit/4227585))
* **search:** rename search-results to search-suggestions ([9323d12](https://github.com/ryersonlibrary/building-info-system/commit/9323d12))
* **search-box:** closes when ESC key pressed ([6f45688](https://github.com/ryersonlibrary/building-info-system/commit/6f45688))
* **sheet:** properly closes on `ESC` keypress ([2e474a2](https://github.com/ryersonlibrary/building-info-system/commit/2e474a2))
* **view:** change how view fades in when loaded ([bc3b67c](https://github.com/ryersonlibrary/building-info-system/commit/bc3b67c))
* **view:** page title now correct ([449fc90](https://github.com/ryersonlibrary/building-info-system/commit/449fc90))
* **view-faq:** Accordion item content height now exact ([e75f817](https://github.com/ryersonlibrary/building-info-system/commit/e75f817))
* fix accordion item initial height when starting open ([636925b](https://github.com/ryersonlibrary/building-info-system/commit/636925b))
* use proper font in search input ([8877ed4](https://github.com/ryersonlibrary/building-info-system/commit/8877ed4))


### Features

* Add map types.  Add support for computer symbols. ([f3d873c](https://github.com/ryersonlibrary/building-info-system/commit/f3d873c))
* **app:** Add custom font support with example scss file ([b2c7744](https://github.com/ryersonlibrary/building-info-system/commit/b2c7744))
* **app:** add linear progress for first load and fade in on route switch ([1334dfa](https://github.com/ryersonlibrary/building-info-system/commit/1334dfa))
* **app:** change app-bar structure ([e48e5f7](https://github.com/ryersonlibrary/building-info-system/commit/e48e5f7))
* **app:** Use centralized dataService to load dataUse a central service to make any requests to the API for data.  Data is then avialable globally andmultiple requests aren't needed.BREAKING CHANGE: `loadData` signature is changed along with api endpoint constants ([fac5ad3](https://github.com/ryersonlibrary/building-info-system/commit/fac5ad3))
* **app:** use new DataService ([fc0ed55](https://github.com/ryersonlibrary/building-info-system/commit/fc0ed55))
* **faq:** select initially open FAQ using URL parameter ([8d095af](https://github.com/ryersonlibrary/building-info-system/commit/8d095af))
* **search:** search broken into multiple files ([2b700d7](https://github.com/ryersonlibrary/building-info-system/commit/2b700d7))
* **search:** search for directory locations working ([295e8de](https://github.com/ryersonlibrary/building-info-system/commit/295e8de))


### BREAKING CHANGES

* **app:** dataService now fires an event on each loaded resource and a new event when all
resources loaded.
* **search:** DOM of the App has changed.  Search has changed.
* `MapElement` and `MapElementMap` type renamed to `MapElementData` and
`MapElementDataMap` respectively.



# [0.3.0](https://github.com/ryersonlibrary/building-info-system/compare/v0.2.1...v0.3.0) (2019-03-15)


### Features

* Add map types.  Add support for computer symbols. ([f3d873c](https://github.com/ryersonlibrary/building-info-system/commit/f3d873c))


### BREAKING CHANGES

* `MapElement` and `MapElementMap` type renamed to `MapElementData` and
`MapElementDataMap` respectively.



## [0.2.1](https://github.com/ryersonlibrary/building-info-system/compare/v0.2.0...v0.2.1) (2019-01-18)


### Bug Fixes

* **accordion:** fix active item selector and change `allowMultiple` default to `false` ([1f737ae](https://github.com/ryersonlibrary/building-info-system/commit/1f737ae))
* **card:** fix typo in card background url ([663ef38](https://github.com/ryersonlibrary/building-info-system/commit/663ef38))
* **testing:** fix problem with localStorage that prevented e2e test from running ([025ecab](https://github.com/ryersonlibrary/building-info-system/commit/025ecab))


### Features

* **card:** add `mediaSize` property to specify how media background image is sized ([985defc](https://github.com/ryersonlibrary/building-info-system/commit/985defc))
* **side-sheet:** improve focus flow ([89ef8b7](https://github.com/ryersonlibrary/building-info-system/commit/89ef8b7))
* **view-map:** remove old events from local storage and lazy-load new events to fill missing ones ([04668c4](https://github.com/ryersonlibrary/building-info-system/commit/04668c4))



# [0.2.0](https://github.com/ryersonlibrary/building-info-system/compare/v0.1.1...v0.2.0) (2019-01-18)


### Features

* **app:** move URL constants to config file and ignore from GIT ([c6cae1a](https://github.com/ryersonlibrary/building-info-system/commit/c6cae1a))



## [0.1.1](https://github.com/ryersonlibrary/building-info-system/compare/v1.0.0...v0.1.1) (2019-01-17)


### Bug Fixes

* **app:** all references to `BASE_URL` fixed to not use leading slash ([7722320](https://github.com/ryersonlibrary/building-info-system/commit/7722320))
* **app:** fix issues raised by linting ([a92c7e3](https://github.com/ryersonlibrary/building-info-system/commit/a92c7e3))
* **app:** Fix problems caused by package update. ([db7a542](https://github.com/ryersonlibrary/building-info-system/commit/db7a542))
* **app:** re-generate docs and update to `tsconfig` ([bf99be5](https://github.com/ryersonlibrary/building-info-system/commit/bf99be5))
* **app:** Small bug fixes and improvements. ([10c4e7d](https://github.com/ryersonlibrary/building-info-system/commit/10c4e7d))
* **app:** Typo in ical resource url. ([5e4fd64](https://github.com/ryersonlibrary/building-info-system/commit/5e4fd64))
* **card:** Change color prop to avoid Stencil warning ([63de658](https://github.com/ryersonlibrary/building-info-system/commit/63de658))
* **card:** Change default text-protection colour and background size. ([cc4bd5a](https://github.com/ryersonlibrary/building-info-system/commit/cc4bd5a))
* **expansion-panel:** Add basic test file. ([3689b02](https://github.com/ryersonlibrary/building-info-system/commit/3689b02))
* **interface:** Remove `map` types from interface defition ([f578024](https://github.com/ryersonlibrary/building-info-system/commit/f578024))
* **load-data:** fix typo in `load-data` ([a6a4478](https://github.com/ryersonlibrary/building-info-system/commit/a6a4478))
* **map:** Reorder imports alphabetically. ([d202c56](https://github.com/ryersonlibrary/building-info-system/commit/d202c56))
* **map-container:** Show text Yes/No for boolean supplemental fields. ([9755e6b](https://github.com/ryersonlibrary/building-info-system/commit/9755e6b))
* **map-container:** Use `map` component from [@ryelib](https://github.com/ryelib)/web-components ([b7ef5cb](https://github.com/ryersonlibrary/building-info-system/commit/b7ef5cb))
* **scss:** change stylelint to look for new `rl` prefix ([7560f3f](https://github.com/ryersonlibrary/building-info-system/commit/7560f3f))
* **view-map:** Fix `initialBuilding` logic ([70b2a8f](https://github.com/ryersonlibrary/building-info-system/commit/70b2a8f))
* Ensure basic spec testing works. ([3b7ea03](https://github.com/ryersonlibrary/building-info-system/commit/3b7ea03))


### Features

* **accordion:** Small fixes and improved key support. ([e489b4f](https://github.com/ryersonlibrary/building-info-system/commit/e489b4f))
* **app:** improve support for hosting location ([02bef98](https://github.com/ryersonlibrary/building-info-system/commit/02bef98))
* **books:** Use MDC Layout Grid for display of content. ([5909818](https://github.com/ryersonlibrary/building-info-system/commit/5909818))
* **card:** Add link support to card action button. ([2c8066e](https://github.com/ryersonlibrary/building-info-system/commit/2c8066e))
* **expansion-panel:** Add expansion panel component. ([eb9153e](https://github.com/ryersonlibrary/building-info-system/commit/eb9153e))
* **local-data:** Add support for skipping Local Storage lookup ([b70f83a](https://github.com/ryersonlibrary/building-info-system/commit/b70f83a))
* **search:** Display book thumbnail and fixed search page styles. ([bc6a440](https://github.com/ryersonlibrary/building-info-system/commit/bc6a440))
* **storage:** create `localStorage` utility ([4281c36](https://github.com/ryersonlibrary/building-info-system/commit/4281c36))
* **view-faq:** `view-faq` now uses `localStorage` utility ([b17085b](https://github.com/ryersonlibrary/building-info-system/commit/b17085b))



<a name="0.1.0"></a>
# 0.1.0 (2018-08-15)


### Bug Fixes

* **map-nav:** Floor MDCSelect now works. ([e6e1ff9](https://github.com/ryersonlibrary/building-info-system/commit/e6e1ff9))


### Features

* **detail-panel:** Change mobile/desktop styles. ([a6c1ef5](https://github.com/ryersonlibrary/building-info-system/commit/a6c1ef5))
* **view-building:** Add Building view. ([719f169](https://github.com/ryersonlibrary/building-info-system/commit/719f169))
* **view-event:** Add Event list page. ([b042d93](https://github.com/ryersonlibrary/building-info-system/commit/b042d93))
* **view-faq:** Change to use rula-accordion. ([138b2e9](https://github.com/ryersonlibrary/building-info-system/commit/138b2e9))



