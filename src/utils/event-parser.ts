import { CalEvent } from '../interface';

/**
   * Returns the time portion of a Date object in the format hh:mm dd.
   * 
   * @param date The date object to get the time from.
   * @returns The formatted time string.
   */
export function formatTime(date: Date): string {
  var h, hh, dd = 'AM', m;

  h = hh = date.getHours();
  m = date.getMinutes();
  if (h >= 12) { h = hh - 12; dd = 'PM'; }
  if (h == 0) { h = 12; }
  m = (m < 10) ? '0' + m : m;
  
  return h + ':' + m + ' ' + dd;
}

export class EventParser {
  private events: CalEvent[];
  private listeners: Function[];

  /**
   * Create a new RulaICALParser.
   * 
   * @param url Optional URL to an ICAL file to load and parse.
   */
  constructor(url?: string) {
    if (url) {
      // If the optional URL provided, load it.
      this.loadIcal(url);
    }

    this.listeners = [];
  }

  fetchICAL(url: string) {
    return fetch(url, {
      credentials: 'same-origin',
      mode: 'cors',
      redirect: 'follow',
      referrer: 'no-referrer'
    }).then(res => {
      if (res.ok) {
        return res.text();
      }
      throw new Error('Network response was not OK.');
    }).catch(err => {
      console.log('Fetch ICAL error: ' + err.message);
    })
  }

  /**
   * Handles when the ical file is loaded by passing it to the ical.js parser.
   * 
   * @param data The loaded ical file in text format.
   */
  onICalLoad(data: string) {
    //var data = evt.target.getResponseText();
	
    // Create a new ICAL object to parse the file.
    var parser = new (window as any).ICAL["ComponentParser"](
      {"parseEvent": true, "parseTimezone": true});
    
    // Create a new internal array to hold the parsed events.
    this.events = [];
    
    // Set the callback for when the parser encounters an event.
    parser["onevent"] = this.onICalEvent.bind(this);
    parser["oncomplete"] = this.onICalParseComplete.bind(this);
    
    // Begin parsing.
    parser["process"](data);
  };

  /**
   * Handles when the ical.js library encounters an error parsing the ICAL file.
   * 
   * @param evt The triggering event.
   */
  onICalError(evt) {
    console.log(evt);
  };

  /**
   * Processes an ical.js Event and stores the necessary information.
   * 
   * @param evt an ical.js event to process.
   */
  onICalEvent(evt) {
    const comp = evt['component'];

    let newEvent: CalEvent;
    // Set the cutoff time for ten minutes from now.  Events will not be used
    // if they are within ten minutes of finishing.
    const cutoff = new Date(Date.now() + 600000);
    
    let result = null;
    const regEx = /(\[(\w{2,3})\])?\s*(.*)/;

    // Check to see if the event has a repeat rule.  If it does, it will need to
    // be expanded into multiple individual events.
    if (comp.getFirstPropertyValue('rrule')) {
      let recur = new (window as any).ICAL.RecurExpansion({
        'component': comp,
        'dtstart': comp.getFirstPropertyValue('dtstart')
      });
      
      let duration = comp.getFirstPropertyValue('dtend').subtractDate(
          comp.getFirstPropertyValue('dtstart'));
      
      let start, end, count = 0;
      
      while ((start = recur.next()) && count < 16) {
        end = start.clone();
        end.addDuration(duration);
        
        if (end.toJSDate() < cutoff) { continue; }
        newEvent = {};
        newEvent.startTime = new Date(start.toJSDate());
        newEvent.endTime = new Date(end.toJSDate());
        newEvent.title = comp.getFirstPropertyValue('summary');
        
        // Use regEx to find any [TAG] at the start of the description and
        // isolate it as the event category (stakeholder)  Remaining description
        // is used as-is.
        result = regEx.exec(comp.getFirstPropertyValue('description'));
        newEvent.group = result[2];
        newEvent.description = result[3];
        
        newEvent.location = comp.getFirstPropertyValue('location');
        
        this.events.push(newEvent);
        count++;
      }
    // Otherwise, a single event exists, push it onto the list if the end time
    // is at least 10 minutes from now..
    } else {
      if (comp.getFirstPropertyValue('dtend').toJSDate().valueOf() <
          cutoff.getTime()) {
        return;
      }
      
      newEvent = {};
      newEvent.startTime =
        new Date(comp.getFirstPropertyValue('dtstart').toJSDate());
      newEvent.endTime =
        new Date(comp.getFirstPropertyValue('dtend').toJSDate());
      newEvent.title = comp.getFirstPropertyValue('summary');
      
      // Use regEx to find any [TAG] at the start of the description and
      // isolate it as the event category (stakeholder)  Remaining description
      // is used as-is.
      result = regEx.exec(comp.getFirstPropertyValue('description'));
      
      newEvent.group = result[2];
      newEvent.description = result[3];
      
      newEvent.location = comp.getFirstPropertyValue('location');
      
      this.events.push(newEvent);
    }
  }

  /**
   * Handles when the ical.js library completes parsing the ical file.
   */
  onICalParseComplete() {
    this.events.sort(this.compareEventTimes);
    this.dispatch();
  }

  /**
   * Compares two events based on their end times.
   * 
   * @param a The first event to compare.
   * @param b The second event to compare.
   * 
   * @returns `-1` if `a < b`, `1` if `a > b` and `0` otherwise.
   */
  compareEventTimes(a: CalEvent, b: CalEvent) {
    if (a.endTime < b.endTime) {
      return -1;
    } else if (a.endTime > b.endTime) {
      return 1;
    } else {
      return 0;
    }
  }

  /**
   * Returns a copy of the parsed events.
   * 
   * @returns A shallow copy of all the parsed events.
   */
  getEvents(): CalEvent[] {
    return this.events.slice(0);
  }

  /**
   * Returns a new array containing future events (events with an end time
   * after the current time).  Specifying a number will limit the number of
   * events returned.
   * 
   * @param num Optional. The maximum number of events to return.
   * 
   * @returns A shallow copy of all the events with an end time after the
   * current time.
   */
  getFutureEvents(num?: number): CalEvent[] {
    let events: CalEvent[] = [], now = new Date();

    num = num || Number.MAX_SAFE_INTEGER;

    this.events.map((event) => {
      if (event.endTime >= now && events.length < num) {
        events.push(event);
      }
    });

    return events;
  }

  /**
   * Loads an ICAL file from a specified URL.  Once loaded the events in the
   * file will be parsed.
   * 
   * @param url The URL to load the ICAL file from
   */
  loadIcal(url: string) {
    if (url) {
      this.fetchICAL(url).then(res => {
        if (res) {
          this.onICalLoad(res);
        } else {
          throw new Error('Fetched ICAL had no content');
        }
      })
    }
  }

  /**
   * Subscribe to notifications from this parser object.
   * 
   * @param listener A callback function used to subscribe to notifications.
   */
  subscribe(listener: () => void): () => void  {
    if (typeof listener !== 'function') {
      throw new Error('expected listener to be a function.');
    }

    let listeners = this.listeners;
    listeners.push(listener);

    let isSubscribed = true;
    return function unsubscribe() {
      if (!isSubscribed) {
        return;
      }

      const index = listeners.indexOf(listener);
      listeners.splice(index, 1);

      isSubscribed = false;
    }
  }

  /**
   * Notify subscribers by calling the provided listener function(s).
   */
  dispatch() {
    const listeners = this.listeners;
    for (let i = 0, len = listeners.length; i < len; i++) {
      const listener = listeners[i];
      listener();
    }
  }
}
