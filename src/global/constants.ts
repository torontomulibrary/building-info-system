export const APP_TITLE = 'RULA Building Info System';
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

export const BASE_URL = '/';
export const API_URL = 'http://localhost:8080/api/';
export const SEARCH_URL = 'http://localhost:8080/search/';
export const EVENT_URL = 'http://testnet.library.ryerson.ca/dev/rulapi/ical';

export const FAQ_STORAGE_KEY = 'rula-faqs';
export const EVENTS_STORAGE_KEY = 'rula-events';
export const BUILDINGS_STORAGE_KEY = 'rula-buildings';
export const FLOORS_STORAGE_KEY = 'rula-floors';
export const ELEMENTS_STORAGE_KEY = 'rula-elements';
export const DETAILS_STORAGE_KEY = 'rula-details';
