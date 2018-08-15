import { GET_BUILDING_DATA } from '../actions/building-actions';

// Intial state of building slice
const defaultState = {
  allBuildings: [],
};

/**
 * Reducer for the `building` slice of the store.
 * @param state The current state.
 * @param action The performed action.
 */
export const buildingReducer = (state = defaultState, action) => {
  switch (action.type) {
    case GET_BUILDING_DATA:
      return {
        ...state,
        allBuildings: action.buildings,
      };
    default:
      return state;
  }
};
