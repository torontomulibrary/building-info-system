/**
* This is an autogenerated file created by the Stencil compiler.
* It contains typing information for all components that exist in this project.
*/
/* tslint:disable */

import '@stencil/core';

import '@stencil/router';
import '@stencil/state-tunnel';
import '@rula/web-components';
import {
  BuildingMap as BuildingMap2,
  CalEvent,
  FaqMap,
  MapData,
  MapElement,
  MapElementDetailMap,
} from './interface';
import {
  Building,
  BuildingMap,
  Floor,
  FloorMap,
} from './interface.js';
import {
  MatchResults,
} from '@stencil/router';


export namespace Components {

  interface RulaBis {
    /**
    * A URL used to access when loading data.
    */
    'apiUrl': string;
    /**
    * The displayed title of the application.
    */
    'appTitle': string;
    'baseUrl': string;
    /**
    * A URL used to load ICAL event information.
    */
    'icalUrl': string;
  }
  interface RulaBisAttributes extends StencilHTMLAttributes {
    /**
    * A URL used to access when loading data.
    */
    'apiUrl'?: string;
    /**
    * The displayed title of the application.
    */
    'appTitle'?: string;
    'baseUrl'?: string;
    /**
    * A URL used to load ICAL event information.
    */
    'icalUrl'?: string;
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

  interface RulaDetailPanel {
    'activeElement': MapElement;
    /**
    * Hide the DetailPanel.
    */
    'hidePanel': () => void;
    /**
    * Show the DetailPanel.
    */
    'showPanel': () => void;
  }
  interface RulaDetailPanelAttributes extends StencilHTMLAttributes {
    'activeElement'?: MapElement;
    'onDetailPanelClose'?: (event: CustomEvent) => void;
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

  interface RulaExpandableCard {}
  interface RulaExpandableCardAttributes extends StencilHTMLAttributes {}

  interface RulaGraphicDevice {}
  interface RulaGraphicDeviceAttributes extends StencilHTMLAttributes {}

  interface RulaMapNav {
    /**
    * The currently active Building.
    */
    'activeBuilding': Building;
    /**
    * The currently active Floor.
    */
    'activeFloor': Floor;
    /**
    * A list of all the Floors of the currenly active Building
    */
    'activeFloors': FloorMap;
    /**
    * A list of all the buildings.
    */
    'allBuildings': BuildingMap;
  }
  interface RulaMapNavAttributes extends StencilHTMLAttributes {
    /**
    * The currently active Building.
    */
    'activeBuilding'?: Building;
    /**
    * The currently active Floor.
    */
    'activeFloor'?: Floor;
    /**
    * A list of all the Floors of the currenly active Building
    */
    'activeFloors'?: FloorMap;
    /**
    * A list of all the buildings.
    */
    'allBuildings'?: BuildingMap;
    /**
    * An event emitted when the selected Building changes.
    */
    'onMapNavBuildingChanged'?: (event: CustomEvent) => void;
    /**
    * An event emitted when the selected Floor changes.
    */
    'onMapNavFloorChanged'?: (event: CustomEvent) => void;
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

  interface ViewBuilding {
    /**
    * A list of all the Buildings.
    */
    'allBuildings': BuildingMap;
  }
  interface ViewBuildingAttributes extends StencilHTMLAttributes {
    /**
    * A list of all the Buildings.
    */
    'allBuildings'?: BuildingMap;
  }

  interface ViewEvent {
    /**
    * An array of all events.
    */
    'allEvents': CalEvent[];
  }
  interface ViewEventAttributes extends StencilHTMLAttributes {
    /**
    * An array of all events.
    */
    'allEvents'?: CalEvent[];
  }

  interface ViewFaq {
    /**
    * A list of all the FAQs that will be displayed.
    */
    'allFaqs': FaqMap;
  }
  interface ViewFaqAttributes extends StencilHTMLAttributes {
    /**
    * A list of all the FAQs that will be displayed.
    */
    'allFaqs'?: FaqMap;
  }

  interface ViewHome {}
  interface ViewHomeAttributes extends StencilHTMLAttributes {}

  interface ViewMap {
    /**
    * A URL used to access when loading data.
    */
    'apiUrl': string;
    /**
    * A list of all the Buildings.
    */
    'data': MapData;
    /**
    * The results coming from `stencil-router` that contain any URL matches.
    */
    'match': MatchResults;
    'setActiveElementByDetail': (detailId: number) => void;
  }
  interface ViewMapAttributes extends StencilHTMLAttributes {
    /**
    * A URL used to access when loading data.
    */
    'apiUrl'?: string;
    /**
    * A list of all the Buildings.
    */
    'data'?: MapData;
    /**
    * The results coming from `stencil-router` that contain any URL matches.
    */
    'match'?: MatchResults;
  }
}

declare global {
  interface StencilElementInterfaces {
    'RulaBis': Components.RulaBis;
    'RulaAppBar': Components.RulaAppBar;
    'RulaDetailPanel': Components.RulaDetailPanel;
    'RulaDrawer': Components.RulaDrawer;
    'RulaExpandableCard': Components.RulaExpandableCard;
    'RulaGraphicDevice': Components.RulaGraphicDevice;
    'RulaMapNav': Components.RulaMapNav;
    'RulaSearchBox': Components.RulaSearchBox;
    'ViewBuilding': Components.ViewBuilding;
    'ViewEvent': Components.ViewEvent;
    'ViewFaq': Components.ViewFaq;
    'ViewHome': Components.ViewHome;
    'ViewMap': Components.ViewMap;
  }

  interface StencilIntrinsicElements {
    'rula-bis': Components.RulaBisAttributes;
    'rula-app-bar': Components.RulaAppBarAttributes;
    'rula-detail-panel': Components.RulaDetailPanelAttributes;
    'rula-drawer': Components.RulaDrawerAttributes;
    'rula-expandable-card': Components.RulaExpandableCardAttributes;
    'rula-graphic-device': Components.RulaGraphicDeviceAttributes;
    'rula-map-nav': Components.RulaMapNavAttributes;
    'rula-search-box': Components.RulaSearchBoxAttributes;
    'view-building': Components.ViewBuildingAttributes;
    'view-event': Components.ViewEventAttributes;
    'view-faq': Components.ViewFaqAttributes;
    'view-home': Components.ViewHomeAttributes;
    'view-map': Components.ViewMapAttributes;
  }


  interface HTMLRulaBisElement extends Components.RulaBis, HTMLStencilElement {}
  var HTMLRulaBisElement: {
    prototype: HTMLRulaBisElement;
    new (): HTMLRulaBisElement;
  };

  interface HTMLRulaAppBarElement extends Components.RulaAppBar, HTMLStencilElement {}
  var HTMLRulaAppBarElement: {
    prototype: HTMLRulaAppBarElement;
    new (): HTMLRulaAppBarElement;
  };

  interface HTMLRulaDetailPanelElement extends Components.RulaDetailPanel, HTMLStencilElement {}
  var HTMLRulaDetailPanelElement: {
    prototype: HTMLRulaDetailPanelElement;
    new (): HTMLRulaDetailPanelElement;
  };

  interface HTMLRulaDrawerElement extends Components.RulaDrawer, HTMLStencilElement {}
  var HTMLRulaDrawerElement: {
    prototype: HTMLRulaDrawerElement;
    new (): HTMLRulaDrawerElement;
  };

  interface HTMLRulaExpandableCardElement extends Components.RulaExpandableCard, HTMLStencilElement {}
  var HTMLRulaExpandableCardElement: {
    prototype: HTMLRulaExpandableCardElement;
    new (): HTMLRulaExpandableCardElement;
  };

  interface HTMLRulaGraphicDeviceElement extends Components.RulaGraphicDevice, HTMLStencilElement {}
  var HTMLRulaGraphicDeviceElement: {
    prototype: HTMLRulaGraphicDeviceElement;
    new (): HTMLRulaGraphicDeviceElement;
  };

  interface HTMLRulaMapNavElement extends Components.RulaMapNav, HTMLStencilElement {}
  var HTMLRulaMapNavElement: {
    prototype: HTMLRulaMapNavElement;
    new (): HTMLRulaMapNavElement;
  };

  interface HTMLRulaSearchBoxElement extends Components.RulaSearchBox, HTMLStencilElement {}
  var HTMLRulaSearchBoxElement: {
    prototype: HTMLRulaSearchBoxElement;
    new (): HTMLRulaSearchBoxElement;
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

  interface HTMLElementTagNameMap {
    'rula-bis': HTMLRulaBisElement
    'rula-app-bar': HTMLRulaAppBarElement
    'rula-detail-panel': HTMLRulaDetailPanelElement
    'rula-drawer': HTMLRulaDrawerElement
    'rula-expandable-card': HTMLRulaExpandableCardElement
    'rula-graphic-device': HTMLRulaGraphicDeviceElement
    'rula-map-nav': HTMLRulaMapNavElement
    'rula-search-box': HTMLRulaSearchBoxElement
    'view-building': HTMLViewBuildingElement
    'view-event': HTMLViewEventElement
    'view-faq': HTMLViewFaqElement
    'view-home': HTMLViewHomeElement
    'view-map': HTMLViewMapElement
  }

  interface ElementTagNameMap {
    'rula-bis': HTMLRulaBisElement;
    'rula-app-bar': HTMLRulaAppBarElement;
    'rula-detail-panel': HTMLRulaDetailPanelElement;
    'rula-drawer': HTMLRulaDrawerElement;
    'rula-expandable-card': HTMLRulaExpandableCardElement;
    'rula-graphic-device': HTMLRulaGraphicDeviceElement;
    'rula-map-nav': HTMLRulaMapNavElement;
    'rula-search-box': HTMLRulaSearchBoxElement;
    'view-building': HTMLViewBuildingElement;
    'view-event': HTMLViewEventElement;
    'view-faq': HTMLViewFaqElement;
    'view-home': HTMLViewHomeElement;
    'view-map': HTMLViewMapElement;
  }


  export namespace JSX {
    export interface Element {}
    export interface IntrinsicElements extends StencilIntrinsicElements {
      [tagName: string]: any;
    }
  }
  export interface HTMLAttributes extends StencilHTMLAttributes {}

}
