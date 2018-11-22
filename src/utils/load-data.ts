import { API_URL } from '../global/constants';
import { fetchJSON } from '../utils/fetch';

import { get, set } from './local-storage';

export function loadData<T>(key: string, type: string) {
  return get(key).then((res: T) => {
    if (res) {
      return Promise.resolve(res);
    } else {
      return fetchJSON(API_URL + type).then((data: T) => {
        set(key, data);
        return Promise.resolve(res);
      }, reason => {
        return Promise.reject(reason);
      });
    }
  });
}
