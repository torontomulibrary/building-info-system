## [0.6.1](https://github.com/ryersonlibrary/building-info-system/compare/v0.6.0...v0.6.1) (2019-10-10)


### Bug Fixes

* **rl-floorplan:** display content subnodes (currently always handled as text). ([c041333](https://github.com/ryersonlibrary/building-info-system/commit/c041333))
* **rl-floorplan:** display placeholder when invalid data index specified ([0880a46](https://github.com/ryersonlibrary/building-info-system/commit/0880a46))
* **rl-floorplan:** text content displayed properly.  xlink ns attribute parsed correctly ([2556838](https://github.com/ryersonlibrary/building-info-system/commit/2556838))
* **utils/dom:** className now checked (can be undefined or not string) ([dbab639](https://github.com/ryersonlibrary/building-info-system/commit/dbab639))


### Features

* **app:** Replace data-service with app-data ([e3bac78](https://github.com/ryersonlibrary/building-info-system/commit/e3bac78))



# [0.6.0](https://github.com/ryersonlibrary/building-info-system/compare/v0.5.0...v0.6.0) (2019-10-04)


### Bug Fixes

* **app:** `rl-cluster` component now used everywhere for card arrays ([bcb83e7](https://github.com/ryersonlibrary/building-info-system/commit/bcb83e7))
* **app:** Cluster columns now calculated and updated from app ([fb0cc6e](https://github.com/ryersonlibrary/building-info-system/commit/fb0cc6e))
* **app:** revert how search item click is handled ([da68010](https://github.com/ryersonlibrary/building-info-system/commit/da68010))
* **app:** search page route corrected ([37d68e5](https://github.com/ryersonlibrary/building-info-system/commit/37d68e5)), closes [#21](https://github.com/ryersonlibrary/building-info-system/issues/21)
* **data-service:** Loads more events properly when all cahced events in the past. ([71fff3d](https://github.com/ryersonlibrary/building-info-system/commit/71fff3d))
* **event-parser:** better use of Promises ([d47473c](https://github.com/ryersonlibrary/building-info-system/commit/d47473c))
* **faq:** accordion item emits click event rather than using route-link ([05ced7c](https://github.com/ryersonlibrary/building-info-system/commit/05ced7c))
* **faq:** separate URLs for all `faqs` and a single `faq` ([0c14653](https://github.com/ryersonlibrary/building-info-system/commit/0c14653))
* **pageTitle:** fix page title to properly work with new hash locations ([b9354c2](https://github.com/ryersonlibrary/building-info-system/commit/b9354c2))
* **search:** ignore results with no ISBN number ([0b0114a](https://github.com/ryersonlibrary/building-info-system/commit/0b0114a))
* **search-box:** clear internal value when input cleared ([6aaa1fa](https://github.com/ryersonlibrary/building-info-system/commit/6aaa1fa))
* **search-box:** isDescendant now handles when `node` is falsy, not just `null` ([29ce5d9](https://github.com/ryersonlibrary/building-info-system/commit/29ce5d9))
* **search-box:** remove unused and colliding `id` property ([208128c](https://github.com/ryersonlibrary/building-info-system/commit/208128c))
* all components properly use Host functional component ([d13ab16](https://github.com/ryersonlibrary/building-info-system/commit/d13ab16)), closes [#22](https://github.com/ryersonlibrary/building-info-system/issues/22)
* **view-search:** properly import BookDetails interface ([e7792d0](https://github.com/ryersonlibrary/building-info-system/commit/e7792d0))
* fix issues raised by linting ([9295979](https://github.com/ryersonlibrary/building-info-system/commit/9295979))
* **util:** getAncestorByClass now handles nodes without `className` (SVG) ([f9175a9](https://github.com/ryersonlibrary/building-info-system/commit/f9175a9))
* stop elements from being loaded ([ed38df7](https://github.com/ryersonlibrary/building-info-system/commit/ed38df7))
* **view-building:** remove duplicate card styles from building view ([935bf66](https://github.com/ryersonlibrary/building-info-system/commit/935bf66))
* **view-map:** increase computer symbol specificity ([e7d972e](https://github.com/ryersonlibrary/building-info-system/commit/e7d972e))
* **view-map:** Now use `rl-floorplan` component to render maps. ([14073ef](https://github.com/ryersonlibrary/building-info-system/commit/14073ef))
* **view-map:** return early if no book matched ([d652802](https://github.com/ryersonlibrary/building-info-system/commit/d652802))
* **view-styles:** remove duplication of rl-view sass import ([ae2a2bc](https://github.com/ryersonlibrary/building-info-system/commit/ae2a2bc))
* **views:** add Host component around loading placeholder to properly inject styles ([8d4a94a](https://github.com/ryersonlibrary/building-info-system/commit/8d4a94a))


### Features

* **app:** Change and simplify application routes ([3b1800b](https://github.com/ryersonlibrary/building-info-system/commit/3b1800b))
* **app:** Change to using hashHistory from browserHistory ([cd45a0a](https://github.com/ryersonlibrary/building-info-system/commit/cd45a0a))
* **app:** change to using new `Host` component over `hostData` method ([18be291](https://github.com/ryersonlibrary/building-info-system/commit/18be291))
* **app:** clear search bar on page change ([a3a3f79](https://github.com/ryersonlibrary/building-info-system/commit/a3a3f79))
* **card:** search history now includes tiled thumbnails ([466972e](https://github.com/ryersonlibrary/building-info-system/commit/466972e))
* **cluster:** use mdc-typo for header and add list styles to list type ([aa31cd1](https://github.com/ryersonlibrary/building-info-system/commit/aa31cd1))
* **cluster/cards:** Take card title out of media area ([26feb9b](https://github.com/ryersonlibrary/building-info-system/commit/26feb9b))
* **floorplan:** New `rl-floorplan` component ([31d4f24](https://github.com/ryersonlibrary/building-info-system/commit/31d4f24))
* **search:** search results now properly link to books using ISBN not record numbers ([fdff6dd](https://github.com/ryersonlibrary/building-info-system/commit/fdff6dd))
* **search-box:** Search-box directs to search results on enter ([19084ae](https://github.com/ryersonlibrary/building-info-system/commit/19084ae))
* **search-box:** searches made now post query to server for logging ([b563a9c](https://github.com/ryersonlibrary/building-info-system/commit/b563a9c))
* **view-map:** displaying books now uses new API data and uses hash history ([ba59d61](https://github.com/ryersonlibrary/building-info-system/commit/ba59d61))
* **view-map:** map view works completely with hasHistory ([a075664](https://github.com/ryersonlibrary/building-info-system/commit/a075664))


### BREAKING CHANGES

* **view-map:** Breaking changes galore.  Interfaces for MapElement changed.  No longer uses
Elements and Details, just Details (and they're now called Elements for clarity).



# [0.5.0](https://github.com/ryersonlibrary/building-info-system/compare/v0.4.0...v0.5.0) (2019-06-05)


### Bug Fixes

* **app:** DataService returns appropriate type. ([2fee78d](https://github.com/ryersonlibrary/building-info-system/commit/2fee78d))
* **app:** LoadProgress hides properly ([0674ae4](https://github.com/ryersonlibrary/building-info-system/commit/0674ae4))
* **app:** paths changed to use global constants and crucial BASE_PATH ([ce9fa44](https://github.com/ryersonlibrary/building-info-system/commit/ce9fa44))
* **app:** resolve small linting issues ([a6ad658](https://github.com/ryersonlibrary/building-info-system/commit/a6ad658))
* **app:** section-with-header typos ([4ef1962](https://github.com/ryersonlibrary/building-info-system/commit/4ef1962))
* **app:** views use new scrolling carousel component over collection ([a29d517](https://github.com/ryersonlibrary/building-info-system/commit/a29d517))
* **app:** working towards stencil-1 compatibility ([84f3087](https://github.com/ryersonlibrary/building-info-system/commit/84f3087))
* **App:** Changes needed to work with stencil-one ([fc0ee90](https://github.com/ryersonlibrary/building-info-system/commit/fc0ee90))
* **card:** Card action button now StencilRouteLink ([499a5bc](https://github.com/ryersonlibrary/building-info-system/commit/499a5bc)), closes [#18](https://github.com/ryersonlibrary/building-info-system/issues/18)
* **css:** move font overrides to global scss scope ([0fb5398](https://github.com/ryersonlibrary/building-info-system/commit/0fb5398))
* **data:** Load events fixed ([7fca4c0](https://github.com/ryersonlibrary/building-info-system/commit/7fca4c0))
* **Events:** Refresh of cached events works properly ([7c989e1](https://github.com/ryersonlibrary/building-info-system/commit/7c989e1)), closes [#19](https://github.com/ryersonlibrary/building-info-system/issues/19)
* **index:** update paths to be absolute not relative to url ([b89c1da](https://github.com/ryersonlibrary/building-info-system/commit/b89c1da))
* **map:** Remove use of mapRendered event ([1814ca7](https://github.com/ryersonlibrary/building-info-system/commit/1814ca7)), closes [#16](https://github.com/ryersonlibrary/building-info-system/issues/16)
* **map-container:** Extra details for books now display properly ([708f816](https://github.com/ryersonlibrary/building-info-system/commit/708f816))
* **map-container:** initialElement properly selects and computer details fixed ([386fa5e](https://github.com/ryersonlibrary/building-info-system/commit/386fa5e))
* **search:** Search working again as it was using stencil-1.0 ([ffdde20](https://github.com/ryersonlibrary/building-info-system/commit/ffdde20))
* **search-box:** Change how search-box and suggestions work ([aa258a0](https://github.com/ryersonlibrary/building-info-system/commit/aa258a0))
* **view-event:** Fix page title and font family ([5cf52ec](https://github.com/ryersonlibrary/building-info-system/commit/5cf52ec))
* **view-faq:** scroll into view when top is beyond viewport ([4ff8597](https://github.com/ryersonlibrary/building-info-system/commit/4ff8597))
* Remove call to deprecated map function and fix element reselect bug ([b01091b](https://github.com/ryersonlibrary/building-info-system/commit/b01091b))
* **view-map:** Change background color to match map images ([e890cce](https://github.com/ryersonlibrary/building-info-system/commit/e890cce))
* **view-map:** computers parsed only when mapType matches ([cb07126](https://github.com/ryersonlibrary/building-info-system/commit/cb07126))
* **view-map:** Styles use new symbol names from web-components/map component ([8a54bde](https://github.com/ryersonlibrary/building-info-system/commit/8a54bde))


### Features

* **app:** Add Cluster component, modeled after Google Play Music ([46c7698](https://github.com/ryersonlibrary/building-info-system/commit/46c7698))
* **app:** add scrolling carousel component ([f56a534](https://github.com/ryersonlibrary/building-info-system/commit/f56a534))
* **app:** add section-with-header component ([87ae4f2](https://github.com/ryersonlibrary/building-info-system/commit/87ae4f2))
* **view-faq:** faq selection now working completely ([c04041d](https://github.com/ryersonlibrary/building-info-system/commit/c04041d))



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



