/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */


import '@stencil/core';

import '@stencil/router';
import '@stencil/state-tunnel';
import {
  BuildingMap,
  MapElementDetailMap,
  MapElementMap,
} from './interface';
import {
  BuildingMap as BuildingMap2,
  FloorMap,
} from './interface.js';
import {
  MatchResults,
  RouterHistory,
} from '@stencil/router';


export namespace Components {

  interface RulaBis {
    /**
    * A URL used to access when loading data. A URL used to load ICAL event information. The displayed title of the application.
    */
    'appTitle': string;
  }
  interface RulaBisAttributes extends StencilHTMLAttributes {
    /**
    * A URL used to access when loading data. A URL used to load ICAL event information. The displayed title of the application.
    */
    'appTitle'?: string;
  }

  interface RulaAccordionItem {
    /**
    * This function closes this item.
    */
    'close': () => void;
    /**
    * A delay used to fade-in this item a specific amount of time after the component is rendered.
    */
    'delay': number;
    /**
    * An index number used to reference this item in the larger list of all items in the parent accordion.
    */
    'index': number;
    /**
    * This function opens this item.
    */
    'open': () => void;
  }
  interface RulaAccordionItemAttributes extends StencilHTMLAttributes {
    /**
    * A delay used to fade-in this item a specific amount of time after the component is rendered.
    */
    'delay'?: number;
    /**
    * An index number used to reference this item in the larger list of all items in the parent accordion.
    */
    'index'?: number;
    /**
    * An event that is emitted when this item changes its open/closed state.
    */
    'onToggleItem'?: (event: CustomEvent) => void;
  }

  interface RulaAccordion {
    /**
    * Flag indicating if multiple `accordion-item`s can be open at once. Defaults to true.
    */
    'allowMultiple': boolean;
    /**
    * An array of content displayed by the accordion.
    */
    'items': Array<{ [key: string]: string }>;
  }
  interface RulaAccordionAttributes extends StencilHTMLAttributes {
    /**
    * Flag indicating if multiple `accordion-item`s can be open at once. Defaults to true.
    */
    'allowMultiple'?: boolean;
    /**
    * An array of content displayed by the accordion.
    */
    'items'?: Array<{ [key: string]: string }>;
  }

  interface RulaAppBar {
    'appTitle': string;
    /**
    * The current width of the application.  Used to determine what kind of interface should be displayed (reduced or full-width layout).
    */
    'appWidth': number;
    'searchData': MapElementDetailMap;
  }
  interface RulaAppBarAttributes extends StencilHTMLAttributes {
    'appTitle'?: string;
    /**
    * The current width of the application.  Used to determine what kind of interface should be displayed (reduced or full-width layout).
    */
    'appWidth'?: number;
    /**
    * Event fired when the menu button on the app bar is clicked.
    */
    'onMenuClicked'?: (event: CustomEvent) => void;
    'searchData'?: MapElementDetailMap;
  }

  interface RulaCard {
    'buttons'?: Array<{name: string}>;
    'cardColor': {r: number, g: number, b: number};
    'cardData': { [keys: string]: string[] } | string;
    'cardMedia': string;
    'cardTitle': string;
    'hasPrimaryAction': boolean;
    'icons'?: Array<{name: string}>;
    'noContent': boolean;
    'titleInMedia': boolean;
    'wideMediaAspect': boolean;
  }
  interface RulaCardAttributes extends StencilHTMLAttributes {
    'buttons'?: Array<{name: string}>;
    'cardColor'?: {r: number, g: number, b: number};
    'cardData'?: { [keys: string]: string[] } | string;
    'cardMedia'?: string;
    'cardTitle'?: string;
    'hasPrimaryAction'?: boolean;
    'icons'?: Array<{name: string}>;
    'noContent'?: boolean;
    'onCardClicked'?: (event: CustomEvent) => void;
    'titleInMedia'?: boolean;
    'wideMediaAspect'?: boolean;
  }

  interface RulaCollection {
    'collectionTitle': string;
  }
  interface RulaCollectionAttributes extends StencilHTMLAttributes {
    'collectionTitle'?: string;
  }

  interface RulaDrawer {
    /**
    * Flag indicating if the drawer is open.
    */
    'open': boolean;
  }
  interface RulaDrawerAttributes extends StencilHTMLAttributes {
    /**
    * An event emitted when this drawer closes.
    */
    'onDrawerClose'?: (event: CustomEvent) => void;
    /**
    * Flag indicating if the drawer is open.
    */
    'open'?: boolean;
  }

  interface RulaGraphicDevice {}
  interface RulaGraphicDeviceAttributes extends StencilHTMLAttributes {}

  interface RulaMapContainer {
    'buildings': BuildingMap;
    'extraDetails'?: {};
    'initialBuilding': number;
    'initialElement'?: number;
    'initialFloor': number;
  }
  interface RulaMapContainerAttributes extends StencilHTMLAttributes {
    'buildings'?: BuildingMap;
    'extraDetails'?: {};
    'initialBuilding'?: number;
    'initialElement'?: number;
    'initialFloor'?: number;
  }

  interface RulaMapNav {
    /**
    * The `id` of the currently active building.
    */
    'activeBuilding': number;
    /**
    * The `id` of the currently active floor.
    */
    'activeFloor': number;
    /**
    * An id-indexed map of the buildings.
    */
    'buildings': BuildingMap;
    /**
    * An id-indexed map of floors.
    */
    'floors': FloorMap;
  }
  interface RulaMapNavAttributes extends StencilHTMLAttributes {
    /**
    * The `id` of the currently active building.
    */
    'activeBuilding'?: number;
    /**
    * The `id` of the currently active floor.
    */
    'activeFloor'?: number;
    /**
    * An id-indexed map of the buildings.
    */
    'buildings'?: BuildingMap;
    /**
    * An id-indexed map of floors.
    */
    'floors'?: FloorMap;
    /**
    * An event emitted when the selected Building changes.
    */
    'onBuildingChanged'?: (event: CustomEvent) => void;
    /**
    * An event emitted when the selected Floor changes.
    */
    'onFloorChanged'?: (event: CustomEvent) => void;
  }

  interface RulaMap {
    /**
    * Clears the currently active element.
    */
    'clearActiveElement': () => void;
    /**
    * An array of the elements that will be displayed on the Map.
    */
    'elements': MapElementMap;
    /**
    * An image that will be displayed on the Map.
    */
    'floorplan'?: string;
    /**
    * The maximum scale factor.
    */
    'maxScale': number;
    /**
    * The minimum scale factor.
    */
    'minScale': number;
    /**
    * Sets the element with the specified ID to active.
    */
    'setActiveElement': (id: number) => void;
  }
  interface RulaMapAttributes extends StencilHTMLAttributes {
    /**
    * An array of the elements that will be displayed on the Map.
    */
    'elements'?: MapElementMap;
    /**
    * An image that will be displayed on the Map.
    */
    'floorplan'?: string;
    /**
    * The maximum scale factor.
    */
    'maxScale'?: number;
    /**
    * The minimum scale factor.
    */
    'minScale'?: number;
    /**
    * An event fired when the user deselects the selected MapElement. The clicked element will be passed as the event parameter.
    */
    'onElementDeselected'?: (event: CustomEvent) => void;
    /**
    * An event fired when the user selects a MapElement. The clicked element will be passed as the event parameter.
    */
    'onElementSelected'?: (event: CustomEvent) => void;
    /**
    * An event fired when the map floorplan is updated.
    */
    'onMapRendered'?: (event: CustomEvent) => void;
  }

  interface RulaSearchBox {
    'id': string;
    'searchData': MapElementDetailMap;
    'showMenu': boolean;
  }
  interface RulaSearchBoxAttributes extends StencilHTMLAttributes {
    'id'?: string;
    'onIconClick'?: (event: CustomEvent) => void;
    'onResultSelected'?: (event: CustomEvent) => void;
    'searchData'?: MapElementDetailMap;
    'showMenu'?: boolean;
  }

  interface RulaSideSheet {
    'open': boolean;
  }
  interface RulaSideSheetAttributes extends StencilHTMLAttributes {
    /**
    * Event fired when the `side-sheet` has finished closing.
    */
    'onClosed'?: (event: CustomEvent) => void;
    /**
    * Event fired when the `side-sheet` has finished opening.
    */
    'onOpened'?: (event: CustomEvent) => void;
    'open'?: boolean;
  }

  interface ViewBook {
    'appLoaded': boolean;
    'history': RouterHistory;
  }
  interface ViewBookAttributes extends StencilHTMLAttributes {
    'appLoaded'?: boolean;
    'history'?: RouterHistory;
  }

  interface ViewBuilding {
    /**
    * Global flag indicating if the whole application has loaded.  If not, this view should not display either.
    */
    'appLoaded': boolean;
  }
  interface ViewBuildingAttributes extends StencilHTMLAttributes {
    /**
    * Global flag indicating if the whole application has loaded.  If not, this view should not display either.
    */
    'appLoaded'?: boolean;
  }

  interface ViewEvent {
    /**
    * Global flag indicating if the whole application has loaded.  If not, this view should not display either.
    */
    'appLoaded': boolean;
  }
  interface ViewEventAttributes extends StencilHTMLAttributes {
    /**
    * Global flag indicating if the whole application has loaded.  If not, this view should not display either.
    */
    'appLoaded'?: boolean;
  }

  interface ViewFaq {
    /**
    * Global flag indicating if the whole application has loaded.  If not, this view should not display either.
    */
    'appLoaded': boolean;
  }
  interface ViewFaqAttributes extends StencilHTMLAttributes {
    /**
    * Global flag indicating if the whole application has loaded.  If not, this view should not display either.
    */
    'appLoaded'?: boolean;
  }

  interface ViewHome {
    'appLoaded': boolean;
  }
  interface ViewHomeAttributes extends StencilHTMLAttributes {
    'appLoaded'?: boolean;
  }

  interface ViewMap {
    /**
    * The global object of all application data. A global flag passed in to indicate if the application has loaded as well.
    */
    'appLoaded': boolean;
    'mapType': string;
    /**
    * The results coming from `stencil-router` that contain any URL matches.
    */
    'match': MatchResults;
  }
  interface ViewMapAttributes extends StencilHTMLAttributes {
    /**
    * The global object of all application data. A global flag passed in to indicate if the application has loaded as well.
    */
    'appLoaded'?: boolean;
    'mapType'?: string;
    /**
    * The results coming from `stencil-router` that contain any URL matches.
    */
    'match'?: MatchResults;
    /**
    * Event fired when the data specific to this view is finished loading.
    */
    'onDataLoaded'?: (event: CustomEvent) => void;
  }

  interface ViewSearch {
    'appLoaded': boolean;
    'history': RouterHistory;
    'match': MatchResults;
    'searchUrl'?: string;
  }
  interface ViewSearchAttributes extends StencilHTMLAttributes {
    'appLoaded'?: boolean;
    'history'?: RouterHistory;
    'match'?: MatchResults;
    'searchUrl'?: string;
  }
}

declare global {
  interface StencilElementInterfaces {
    'RulaBis': Components.RulaBis;
    'RulaAccordionItem': Components.RulaAccordionItem;
    'RulaAccordion': Components.RulaAccordion;
    'RulaAppBar': Components.RulaAppBar;
    'RulaCard': Components.RulaCard;
    'RulaCollection': Components.RulaCollection;
    'RulaDrawer': Components.RulaDrawer;
    'RulaGraphicDevice': Components.RulaGraphicDevice;
    'RulaMapContainer': Components.RulaMapContainer;
    'RulaMapNav': Components.RulaMapNav;
    'RulaMap': Components.RulaMap;
    'RulaSearchBox': Components.RulaSearchBox;
    'RulaSideSheet': Components.RulaSideSheet;
    'ViewBook': Components.ViewBook;
    'ViewBuilding': Components.ViewBuilding;
    'ViewEvent': Components.ViewEvent;
    'ViewFaq': Components.ViewFaq;
    'ViewHome': Components.ViewHome;
    'ViewMap': Components.ViewMap;
    'ViewSearch': Components.ViewSearch;
  }

  interface StencilIntrinsicElements {
    'rula-bis': Components.RulaBisAttributes;
    'rula-accordion-item': Components.RulaAccordionItemAttributes;
    'rula-accordion': Components.RulaAccordionAttributes;
    'rula-app-bar': Components.RulaAppBarAttributes;
    'rula-card': Components.RulaCardAttributes;
    'rula-collection': Components.RulaCollectionAttributes;
    'rula-drawer': Components.RulaDrawerAttributes;
    'rula-graphic-device': Components.RulaGraphicDeviceAttributes;
    'rula-map-container': Components.RulaMapContainerAttributes;
    'rula-map-nav': Components.RulaMapNavAttributes;
    'rula-map': Components.RulaMapAttributes;
    'rula-search-box': Components.RulaSearchBoxAttributes;
    'rula-side-sheet': Components.RulaSideSheetAttributes;
    'view-book': Components.ViewBookAttributes;
    'view-building': Components.ViewBuildingAttributes;
    'view-event': Components.ViewEventAttributes;
    'view-faq': Components.ViewFaqAttributes;
    'view-home': Components.ViewHomeAttributes;
    'view-map': Components.ViewMapAttributes;
    'view-search': Components.ViewSearchAttributes;
  }


  interface HTMLRulaBisElement extends Components.RulaBis, HTMLStencilElement {}
  var HTMLRulaBisElement: {
    prototype: HTMLRulaBisElement;
    new (): HTMLRulaBisElement;
  };

  interface HTMLRulaAccordionItemElement extends Components.RulaAccordionItem, HTMLStencilElement {}
  var HTMLRulaAccordionItemElement: {
    prototype: HTMLRulaAccordionItemElement;
    new (): HTMLRulaAccordionItemElement;
  };

  interface HTMLRulaAccordionElement extends Components.RulaAccordion, HTMLStencilElement {}
  var HTMLRulaAccordionElement: {
    prototype: HTMLRulaAccordionElement;
    new (): HTMLRulaAccordionElement;
  };

  interface HTMLRulaAppBarElement extends Components.RulaAppBar, HTMLStencilElement {}
  var HTMLRulaAppBarElement: {
    prototype: HTMLRulaAppBarElement;
    new (): HTMLRulaAppBarElement;
  };

  interface HTMLRulaCardElement extends Components.RulaCard, HTMLStencilElement {}
  var HTMLRulaCardElement: {
    prototype: HTMLRulaCardElement;
    new (): HTMLRulaCardElement;
  };

  interface HTMLRulaCollectionElement extends Components.RulaCollection, HTMLStencilElement {}
  var HTMLRulaCollectionElement: {
    prototype: HTMLRulaCollectionElement;
    new (): HTMLRulaCollectionElement;
  };

  interface HTMLRulaDrawerElement extends Components.RulaDrawer, HTMLStencilElement {}
  var HTMLRulaDrawerElement: {
    prototype: HTMLRulaDrawerElement;
    new (): HTMLRulaDrawerElement;
  };

  interface HTMLRulaGraphicDeviceElement extends Components.RulaGraphicDevice, HTMLStencilElement {}
  var HTMLRulaGraphicDeviceElement: {
    prototype: HTMLRulaGraphicDeviceElement;
    new (): HTMLRulaGraphicDeviceElement;
  };

  interface HTMLRulaMapContainerElement extends Components.RulaMapContainer, HTMLStencilElement {}
  var HTMLRulaMapContainerElement: {
    prototype: HTMLRulaMapContainerElement;
    new (): HTMLRulaMapContainerElement;
  };

  interface HTMLRulaMapNavElement extends Components.RulaMapNav, HTMLStencilElement {}
  var HTMLRulaMapNavElement: {
    prototype: HTMLRulaMapNavElement;
    new (): HTMLRulaMapNavElement;
  };

  interface HTMLRulaMapElement extends Components.RulaMap, HTMLStencilElement {}
  var HTMLRulaMapElement: {
    prototype: HTMLRulaMapElement;
    new (): HTMLRulaMapElement;
  };

  interface HTMLRulaSearchBoxElement extends Components.RulaSearchBox, HTMLStencilElement {}
  var HTMLRulaSearchBoxElement: {
    prototype: HTMLRulaSearchBoxElement;
    new (): HTMLRulaSearchBoxElement;
  };

  interface HTMLRulaSideSheetElement extends Components.RulaSideSheet, HTMLStencilElement {}
  var HTMLRulaSideSheetElement: {
    prototype: HTMLRulaSideSheetElement;
    new (): HTMLRulaSideSheetElement;
  };

  interface HTMLViewBookElement extends Components.ViewBook, HTMLStencilElement {}
  var HTMLViewBookElement: {
    prototype: HTMLViewBookElement;
    new (): HTMLViewBookElement;
  };

  interface HTMLViewBuildingElement extends Components.ViewBuilding, HTMLStencilElement {}
  var HTMLViewBuildingElement: {
    prototype: HTMLViewBuildingElement;
    new (): HTMLViewBuildingElement;
  };

  interface HTMLViewEventElement extends Components.ViewEvent, HTMLStencilElement {}
  var HTMLViewEventElement: {
    prototype: HTMLViewEventElement;
    new (): HTMLViewEventElement;
  };

  interface HTMLViewFaqElement extends Components.ViewFaq, HTMLStencilElement {}
  var HTMLViewFaqElement: {
    prototype: HTMLViewFaqElement;
    new (): HTMLViewFaqElement;
  };

  interface HTMLViewHomeElement extends Components.ViewHome, HTMLStencilElement {}
  var HTMLViewHomeElement: {
    prototype: HTMLViewHomeElement;
    new (): HTMLViewHomeElement;
  };

  interface HTMLViewMapElement extends Components.ViewMap, HTMLStencilElement {}
  var HTMLViewMapElement: {
    prototype: HTMLViewMapElement;
    new (): HTMLViewMapElement;
  };

  interface HTMLViewSearchElement extends Components.ViewSearch, HTMLStencilElement {}
  var HTMLViewSearchElement: {
    prototype: HTMLViewSearchElement;
    new (): HTMLViewSearchElement;
  };

  interface HTMLElementTagNameMap {
    'rula-bis': HTMLRulaBisElement
    'rula-accordion-item': HTMLRulaAccordionItemElement
    'rula-accordion': HTMLRulaAccordionElement
    'rula-app-bar': HTMLRulaAppBarElement
    'rula-card': HTMLRulaCardElement
    'rula-collection': HTMLRulaCollectionElement
    'rula-drawer': HTMLRulaDrawerElement
    'rula-graphic-device': HTMLRulaGraphicDeviceElement
    'rula-map-container': HTMLRulaMapContainerElement
    'rula-map-nav': HTMLRulaMapNavElement
    'rula-map': HTMLRulaMapElement
    'rula-search-box': HTMLRulaSearchBoxElement
    'rula-side-sheet': HTMLRulaSideSheetElement
    'view-book': HTMLViewBookElement
    'view-building': HTMLViewBuildingElement
    'view-event': HTMLViewEventElement
    'view-faq': HTMLViewFaqElement
    'view-home': HTMLViewHomeElement
    'view-map': HTMLViewMapElement
    'view-search': HTMLViewSearchElement
  }

  interface ElementTagNameMap {
    'rula-bis': HTMLRulaBisElement;
    'rula-accordion-item': HTMLRulaAccordionItemElement;
    'rula-accordion': HTMLRulaAccordionElement;
    'rula-app-bar': HTMLRulaAppBarElement;
    'rula-card': HTMLRulaCardElement;
    'rula-collection': HTMLRulaCollectionElement;
    'rula-drawer': HTMLRulaDrawerElement;
    'rula-graphic-device': HTMLRulaGraphicDeviceElement;
    'rula-map-container': HTMLRulaMapContainerElement;
    'rula-map-nav': HTMLRulaMapNavElement;
    'rula-map': HTMLRulaMapElement;
    'rula-search-box': HTMLRulaSearchBoxElement;
    'rula-side-sheet': HTMLRulaSideSheetElement;
    'view-book': HTMLViewBookElement;
    'view-building': HTMLViewBuildingElement;
    'view-event': HTMLViewEventElement;
    'view-faq': HTMLViewFaqElement;
    'view-home': HTMLViewHomeElement;
    'view-map': HTMLViewMapElement;
    'view-search': HTMLViewSearchElement;
  }


  export namespace JSX {
    export interface Element {}
    export interface IntrinsicElements extends StencilIntrinsicElements {
      [tagName: string]: any;
    }
  }
  export interface HTMLAttributes extends StencilHTMLAttributes {}

}
