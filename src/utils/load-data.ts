import { API_URL } from '../global/constants';
import { fetchJSON } from '../utils/fetch';

import { get, set } from './local-storage';

function fetchWrapper(type: string, key?: string) {
  return fetchJSON(API_URL + type).then(data => {
    if (key) {
      set(key, data);
    }
    return Promise.resolve(data);
  }, reason => {
    return Promise.reject(reason);
  });
}

export function loadData<T>(type: string, key?: string) {
  if (key) {
    return get(key).then((res: T) => {
      if (res) {
        return Promise.resolve(res);
      } else {
        return fetchWrapper(type, key);
      }
    });
  } else {
    return fetchWrapper(type);
  }
}
