import union from 'lodash/union';

import { API_URL, EVENT_URL } from '../global/config';
import {
  APP_DATA,
  EVENTS,
} from '../global/constants';
import { CalEvent } from '../interface';
import { fetchJSON } from '../utils/fetch';

import { EventParser } from './event-parser';
import { Listenable } from './listenable';
import { get, set } from './local-storage';

class DataService extends Listenable {
  private _data: Map<string, {}> = new Map();
  private _loadedData = 0;

  private _initialized = false;

  initialize() {
    if (this._initialized) {
      return;
    } else {
      this._initialized = true;
    }

    for (const key in APP_DATA) {
      if (APP_DATA.hasOwnProperty(key)) {
        const val = APP_DATA[key];

        if (val === 'events') {
          get(val).then((events: CalEvent[]) => {
            if (events) {
              events.forEach((evt: CalEvent, idx: number) => {
                evt.endTime = new Date(evt.endTime);
                evt.startTime = new Date(evt.startTime);
                if (evt.endTime.valueOf() < new Date().valueOf()) {
                  // Remove the event if the end time has passed.
                  delete events[idx];
                }
              });

              // set(val, events);
              // this._data[val] = events;
              this._data.set(val, events);

              // Load additional events if the cached ones are depleted.
              if (events.length < 50) {
                const parser: EventParser = new EventParser();
                parser.subscribe(() => {
                  const evts = parser.getFutureEvents(30);
                  const newEvents = union(events, evts);

                  set(val, newEvents);
                  // this._data[val] = newEvents;
                  this._data.set(val, newEvents);
                });
                parser.loadIcal(EVENT_URL);
              }

              this._loadedData++;
              this._completeLoad();
            } else {
              const parser: EventParser = new EventParser();

              parser.subscribe(() => {
                const evts = parser.getFutureEvents(30);
                set(val, evts);
                // this._data[val] = evts;
                this._data.set(val, evts);
                this._loadedData++;
                this._completeLoad();
              });

              parser.loadIcal(EVENT_URL);
            }
          });
        } else {
          this.loadData(val).then(data => {
            // this._data[val] = data;
            this._data.set(val, data);
            this._loadedData++;
            this._completeLoad();
          });
        }
      }
    }
  }

  _completeLoad() {
    if (this._loadedData === Object.keys(APP_DATA).length) {
      this.dispatch(EVENTS.DATA_LOADED);
      // pubsub.dispatch(PS_TOPIC.DATA_LOADED);
    }
  }

  async fetchWrapper(path: string) {
    try {
      const data = await fetchJSON(API_URL + path);
      set(path, data).catch(error => {
        console.error(`Unable to set ${path} data in local storage`, error);
      });
      return Promise.resolve(data);
    } catch (reason) {
      return Promise.reject(reason);
    }
  }

  async loadData(path: string) {
    const res = await get(path);
    if (res !== undefined) {
      return Promise.resolve(res);
    } else {
      return this.fetchWrapper(path);
    }
  }

  refreshData(path: string) {
    this.fetchWrapper(path);
  }

  getData(key: APP_DATA) {
    let res: any;

    if (this._data.has(key)) {
      res = this._data.get(key);
      if (res) {
        return { ...res };
      } else {
        return this.loadData(key).then(data => {
          return { ...data };
        });
      }
    }
  }
}

export const dataService = new DataService();
