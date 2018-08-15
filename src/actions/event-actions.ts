import { EventParser } from '../utils/event-parser';

export const GET_EVENT_DATA = 'GET_EVENT_DATA';
export const UPDATE_ACTIVE_EVENT = 'UPDATE_ACTIVE_EVENT';

const parser: EventParser = new EventParser();

async function onEventsParsed(dispatch) {
  dispatch({ type: GET_EVENT_DATA, events: parser.getFutureEvents(52) });
}

/**
 * The action to pull data into the store from remote storage.
 */
export const getEventData = eventUrl => async dispatch => {
  parser.subscribe(() => {
    onEventsParsed(dispatch);
  });
  parser.loadIcal(eventUrl);
};

export const updateActiveEvent = event => dispatch => {
  dispatch({
    type: UPDATE_ACTIVE_EVENT,
    event,
  });
};
