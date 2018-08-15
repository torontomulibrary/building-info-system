import {
  FaqMap
} from '../interface.js';
import { fetchJSON } from '../utils/fetch.js';

export const GET_FAQ_DATA = 'GET_FAQ_DATA';
export const UPDATE_ACTIVE_FAQ = 'UPDATE_ACTIVE_FAQ';

/**
 * The action to pull data into the store from remote storage.
 */
export const getFaqData = apiUrl => async dispatch => {
  const faqUrl = apiUrl + 'faqs';

  // Load data (synchronously for now)
  const faqs: FaqMap = await fetchJSON(faqUrl, { method: 'GET', mode: 'cors' });

  dispatch({ type: GET_FAQ_DATA, faqs });
};

export const updateActiveFaq = faq => dispatch => {
  dispatch({
    type: UPDATE_ACTIVE_FAQ,
    faq,
  });
};
