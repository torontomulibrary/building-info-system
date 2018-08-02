import {
  GET_MAP_DATA,
  UPDATE_ACTIVE_BUILDING,
  UPDATE_ACTIVE_FLOOR,
  UPDATE_ACTIVE_ELEMENT,
  UPDATE_ELEMENTS,
} from '../actions/map-actions';

// Intial state of map slice
const defaultState = {
  activeFloor: {},
  activeFloors: {},
  activeBuilding: {},
  activeFloorplan: {},
  activeElements: {},
  activeElement: {},
  allBuildings: [],
  allFloors: [],
  allElements: [],
  loaded: false
}

/**
 * Reducer for the `map` slice of the store.
 * @param state The current state.
 * @param action The performed action.
 */
const map = (state = defaultState, action) => {
  switch (action.type) {
    case GET_MAP_DATA:
      return {
        ...state,
        allBuildings: action.buildings,
        allFloors: action.floors,
        allElements: action.elements,
        loaded: true
      }
    case UPDATE_ACTIVE_BUILDING:
      return {
        ...state,
        activeBuilding: action.building,
        activeFloors: action.building.floors,
      }
    case UPDATE_ACTIVE_FLOOR:
      return {
        ...state,
        activeFloor: action.floor,
        activeFloorplan: action.floor.floorplan,
        activeElements: action.floor.elements,
      }
    case UPDATE_ACTIVE_ELEMENT:
      return {
        ...state,
        activeElement: action.element,
      }
    case UPDATE_ELEMENTS:
      return {
        ...state,
        activeElements: action.elements
      }
    default:
      return state;
  }
}

export default map;