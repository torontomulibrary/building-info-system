import {
  GET_EVENT_DATA,
  UPDATE_ACTIVE_EVENT,
} from '../actions/event-actions';

// Intial state of map slice
const defaultState = {
  activeEvent: {},
  allEvents: {},
};

/**
 * Reducer for the `map` slice of the store.
 * @param state The current state.
 * @param action The performed action.
 */
export const eventReducer = (state = defaultState, action) => {
  switch (action.type) {
    case GET_EVENT_DATA:
      return {
        ...state,
        allEvents: action.events,
        loaded: true,
      };
    case UPDATE_ACTIVE_EVENT:
      return {
        ...state,
        activeEvent: action.event,
      };
    default:
      return state;
  }
};
