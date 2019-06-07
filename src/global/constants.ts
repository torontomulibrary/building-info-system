export const APP_TITLE = 'Ryerson Library Finder';
export const FOCUSABLE_ELEMENTS = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex], [contenteditable]';
export const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export const FULL_MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const CONTROL_SIZE = 100;

export const SVG_NS = 'http://www.w3.org/2000/svg';

// The possible states the map can use.
export const STATES = {
  NORMAL:           0,
  GESTURE_DOWN:     1,
  DRAGGING:         2,
  ZOOMING:          3,
  ADD_REGION_INIT:  10,
  ADD_REGION_FIRST: 11,
  ADD_REGION:       12,
  ADDPOINT:         13,
  DRAG_ELEMENT:     14,
};

// The distance the user must drag before the map will start to pan.
export const HYSTERESIS = 8;

// Default maximum scale (zoom) factor.
export const DEFAULT_MAX_SCALE = 3;

// Default minimum scale (zoom) factor.
export const DEFAULT_MIN_SCALE = 1;

/**
 * Enumerated data endpoints.
 */
export enum APP_DATA {
  BUILDING = 'buildings',
  COMPUTERS = 'computers',
  DETAILS = 'details',
  ELEMENTS = 'elements',
  EVENTS = 'events',
  FAQS = 'faqs',
  FLOORS = 'floors',
  HISTORY = 'history',
  // DETAIL_TYPES,
}

export enum ROUTES {
  DIRECTORY = 'directory',
  BOOKS = 'books',
  COMPUTERS = 'computers',
  BUILDINGS = 'buildings',
  EVENTS = 'events',
  FAQS = 'faqs',
  FAQ = 'faq',
  SEARCH = 'search',
  HOME = 'home',
}

export enum MAP_TYPE {
  DIRECTORY = 'map.dir',
  COMPUTERS = 'map.comp',
  BOOKS = 'map.book',
}

export enum EVENTS {
  DATA_LOADED = 'ds:loaded',
  ALL_DATA_LOADED = 'ds:allLoaded',
}
