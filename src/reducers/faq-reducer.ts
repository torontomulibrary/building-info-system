import {
  GET_FAQ_DATA,
  UPDATE_ACTIVE_FAQ,
} from '../actions/faq-actions';

// Intial state of map slice
const defaultState = {
  activeFaq: {},
  allFaqs: {},
};

/**
 * Reducer for the `map` slice of the store.
 * @param state The current state.
 * @param action The performed action.
 */
export const faqReducer = (state = defaultState, action) => {
  switch (action.type) {
    case GET_FAQ_DATA:
      return {
        ...state,
        allFaqs: action.faqs,
        loaded: true,
      };
    case UPDATE_ACTIVE_FAQ:
      return {
        ...state,
        activeFaq: action.faq,
      };
    default:
      return state;
  }
};
