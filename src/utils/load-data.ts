import { API_URL } from '../global/constants';
import { fetchJSON } from '../utils/fetch';

import { get, set } from './local-storage';

function fetchWrapper(type: string, key?: string) {
  return fetchJSON(API_URL + type).then(data => {
    if (key !== undefined) {
      set(key, data).catch(error => {
        console.error(`Unable to set ${key} data in local storage`, error);
      });
    }
    return Promise.resolve(data);
  }).catch(reason => {
    return Promise.reject(reason);
  });
}

export function loadData(type: string, key?: string) {
  if (key !== undefined) {
    return get(key).then(res => {
      if (res !== undefined) {
        return Promise.resolve(res);
      } else {
        return fetchWrapper(type, key);
      }
    });
  } else {
    return fetchWrapper(type);
  }
}
