export const UPDATE_DRAWER_STATE = 'UPDATE_DRAWER_STATE';

export const updateLayout = () => (dispatch, getState) => {
  if (getState().app.drawerOpened) {
    dispatch(updateDrawerState(false));
  }
};

export const updateDrawerState = opened => (dispatch, getState) => {
  if (getState().app.drawerOpened !== opened) {
    dispatch({
      type: UPDATE_DRAWER_STATE,
      opened,
    });
  }
};
