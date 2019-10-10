import { API_URL, EVENT_URL } from '../global/config';
import { Building, CalEvent, ComputerLab, Faq, Floor, MapElement, SearchHistory } from '../interface';

import { EventParser } from './event-parser';

/**
 * The interface for the central data store.  Each entry is a promise that
 * resolves to the data for that entpoint.
 */
interface DataSchema {
  buildings: Promise<Building[]>;
  floors: Promise<Floor[]>;
  events: Promise<CalEvent[]>;
  faqs: Promise<Faq[]>;
  details: Promise<MapElement[]>;
  computers: Promise<ComputerLab[]>;
  history: Promise<SearchHistory>;
}

/**
 * Extract the keys from the DataSchema
 */
declare type DataKeys = { [K in keyof DataSchema]: K } extends {
  [_ in keyof DataSchema]: infer U } ? U : never;

/**
 * Extract the value from the DataSchema based on the given key.
 */
declare type DataValue<K extends DataKeys> = DataSchema[K];

export class AppDataStore {
  private store: { [key: string]: Promise<any> } = {};

  private fetchCalendarEvents(num = 30, start?: Date) {
    return new Promise<CalEvent[]>(resolve => {
      const parser: EventParser = new EventParser();

      parser.subscribe(() => {
        const events = parser.getFutureEvents(num, start);
        resolve(events);
      });

      parser.loadIcal(EVENT_URL);
    });
  }

  private fetchJSON(input: string, init: {} = { method: 'GET', mode: 'cors' }): Promise<any> {
    return fetch(input, init).then(res => {
      if (res.ok) {
        return res.json();
      }
      throw new Error('HTTP response was not OK.');
    }).catch(err => {
      throw new Error('Fetch json error: ' + err.message);
    });
  }

  /**
   * Fetch a blob of data from a named endpoint.
   *
   * @param name The name of the data to get
   */
  getData<K extends DataKeys>(name: K): DataValue<K> {
    if (!this.store.hasOwnProperty(name)) {
      this.store[name] = name === 'events' ? this.fetchCalendarEvents() : this.fetchJSON(API_URL + name);
    }

    // No return the endpoint.
    return this.store[name];
  }
}

export const dataStore = new AppDataStore();
