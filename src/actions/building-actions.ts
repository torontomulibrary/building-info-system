import { fetchJSON } from '../utils/fetch.js';
import { BuildingMap, } from '../interface.js';

export const GET_BUILDING_DATA = 'GET_BUILDING_DATA';

/**
 * The action to pull data into the store from remote storage.
 */
export const getBuildingData = (apiUrl) => async (dispatch) => {
  const bldUrl = apiUrl + 'buildings';

  // Load data (synchronously for now)
  const buildings: BuildingMap = await fetchJSON(bldUrl, {method: 'GET', mode: 'cors'});

  dispatch({ type: GET_BUILDING_DATA, buildings});
};