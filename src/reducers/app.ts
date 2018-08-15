import {
  UPDATE_DRAWER_STATE
} from '../actions/app.js';

export const appReducer = (state = { drawerOpened: false }, action) => {
  switch (action.type) {
    case UPDATE_DRAWER_STATE:
      return {
        ...state,
        drawerOpened: action.opened,
      };
    default:
      return state;
  }
};
