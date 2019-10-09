// import union from 'lodash/union';

// import { API_URL, EVENT_URL } from '../global/config';
// import {
//   APP_DATA,
//   EVENTS,
// } from '../global/constants';
// import { CalEvent } from '../interface';
// import { fetchJSON } from '../utils/fetch';

// import { EventParser } from './event-parser';
// import { Listenable } from './listenable';
// import { get, set } from './local-storage';

// class DataService extends Listenable {
//   private _data: Map<string, {} | []> = new Map();
//   private _loadedData = 0;

//   private _initialized = false;

  // fetchCalendarEvents(num = 30, start?: Date) {
  //   return new Promise<CalEvent[]>(resolve => {
  //     const parser: EventParser = new EventParser();

  //     parser.subscribe(() => {
  //       const events = parser.getFutureEvents(num, start);
  //       resolve(events);
  //     });

  //     parser.loadIcal(EVENT_URL);
  //   });
  // }

//   initialize() {
//     if (this._initialized) {
//       return;
//     } else {
//       this._initialized = true;
//     }

//     for (const key in APP_DATA) {
//       if (APP_DATA.hasOwnProperty(key)) {
//         const val = APP_DATA[key];

//         if (val === 'events') {
          // get<CalEvent[]>(val).then(async (events?: CalEvent[]) => {
          //   if (events !== undefined) {
          //     // Remove any outdated events.
          //     const now = new Date().valueOf();
          //     events = events.filter((evt: CalEvent) => {
          //       const end = new Date(evt.endTime);
          //       return end.valueOf() > now;
          //     });

          //     /**
          //      * If there are not enough events because old ones were filtered
          //      * out, load more.
          //      */
          //     if (events.length < 20) {
          //       const start = events.length > 0 ? events[events.length - 1].endTime : new Date();
          //       const evts = await this.fetchCalendarEvents((30 - events.length), start);
          //       const newEvents = union(events, evts);

          //       set(val, newEvents).catch(err => {
          //         console.error(`Error setting value in localStorage - ${err}`);
          //       });

          //       // this._data.set(val, newEvents);
          //     }

          //     // Convert any date strings to Date objects.
          //     events.forEach((evt: CalEvent) => {
          //       evt.endTime = new Date(evt.endTime);
          //       evt.startTime = new Date(evt.startTime);
          //     });

          //     // Store updated events.
          //     this._data.set(val, events);

          //     this._loadedData++;
          //     this._completeLoad();
          //   } else {
          //     const evts = await this.fetchCalendarEvents();

          //     set(val, evts).catch(err => {
          //       console.error(`Error setting value in localStorage - ${err}`);
          //     });

          //     this._data.set(val, evts);
          //     this._loadedData++;
          //     this._completeLoad();
          //   }
          // }).catch(err => {
          //   console.error(`Error occurred loading data - ${err}`);
          // });
//         } else {
//           this.loadData(val).then(data => {
//             // this._data[val] = data;
//             this._data.set(val, data);
//             this._loadedData++;
//             this._completeLoad();
//           }).catch(err => {
//             console.error(`Error loading ${val} data - ${err}`);
//           });
//         }
//       }
//     }
//   }

//   _completeLoad() {
//     if (this._loadedData === Object.keys(APP_DATA).length) {
//       this.dispatch(EVENTS.DATA_LOADED);
//       this.dispatch(EVENTS.ALL_DATA_LOADED);
//     } else {
//       this.dispatch(EVENTS.DATA_LOADED);
//     }
//   }

//   async fetchWrapper(path: string) {
//     try {
//       const data = await fetchJSON(API_URL + path);
//       set(path, data).catch(error => {
//         console.error(`Unable to set ${path} data in local storage`, error);
//       });
//       return Promise.resolve(data);
//     } catch (reason) {
//       return Promise.reject(reason);
//     }
//   }

//   async loadData(path: string) {
//     const res = await get(path);
//     if (res !== undefined) {
//       return Promise.resolve(res);
//     } else {
//       return this.fetchWrapper(path);
//     }
//   }

//   refreshData(path: string) {
//     this.fetchWrapper(path).catch(err => {
//       console.error(`Error refreshing data (${path}) - ${err}`);
//     });
//   }

//   getData(key: APP_DATA) {
//     let res: any;

//     if (this._data.has(key)) {
//       res = this._data.get(key);
//       if (res) {
//         return res;
//       } else {
//         return this.loadData(key).then(data => {
//           return data;
//         });
//       }
//     }
//   }
// }

// export const dataService = new DataService();
