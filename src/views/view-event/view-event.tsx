import { Component, Event, EventEmitter, Prop, State } from '@stencil/core';

import { FULL_MONTHS, MONTHS } from '../../global/constants';
import { AppData, CalEvent } from '../../interface';
import { EventParser, formatTime } from '../../utils/event-parser';
import { sanitize } from '../../utils/sanitize';

@Component({
  tag: 'view-event',
  styleUrl: 'view-event.scss',
})

export class ViewEvent {
  /**
   * An array of all events.
   */
  // @Prop() allEvents!: CalEvent[];

  @State() loaded = false;

  @Prop({ mutable: true }) appData!: AppData;

  @Prop() appLoaded = false;

  @Event() dataLoaded!: EventEmitter;

  componentWillLoad() {
    if (!this.appData.events) {
      // Load events if there are none loaded yet.
      const parser: EventParser = new EventParser();

      parser.subscribe(() => {
        this.appData = { ...this.appData, events: parser.getFutureEvents(52) };
        // this.eventsLoaded = true;
        this.loaded = true;
        this.dataLoaded.emit(this.appData);
      });

      parser.loadIcal(this.appData.icalUrl);
    }
  }

  componentDidLoad() {
    if (this.appData.events) {
      this.loaded = true;
    }
  }

  /**
   * Generates a string of text that describes an event usable for the
   * `aria-label` attribute. This takes the form:
   * `title + date + time + [location] + description`
   *
   * @param event The event to create a label from
   */
  eventLabel(event: CalEvent) {
    return 'Event: ' + event.title +
      ' ' + this.eventDate(event, true) +
      ' at ' + this.eventDuration(event) +
      (event.location ? ' in ' + event.location : '') +
      '. ' + event.description;
  }

  /**
   * Generates the 'date' of an event depending on the start time.  If an event
   * starts either today or tomorrow, that will be returned, otherwise the
   * month followed by the date will be returned.  If the `forAria` flag is set,
   * full month names (rather than three letter abbreviations) will be used.
   *
   * @param event The calendar event to use
   * @param forAria A flag indicating if the date will be used in an aria label.
   */
  eventDate(event: CalEvent, forAria = false) {
    if (!event.startTime) {
      return;
    }

    const sM = event.startTime.getMonth();
    const sD = event.startTime.getDate();
    const c = new Date();
    let cM = c.getMonth();
    let cD = c.getDate();

    if (sM === cM && sD === cD) {
      return 'Today';
    }

    c.setTime(c.getTime() + 86400000);
    cM = c.getMonth(); cD = c.getDate();

    if (sM === cM && sD === cD) {
      return 'Tomorrow';
    }

    if (forAria) {
      return ' on ' + FULL_MONTHS[event.startTime.getMonth()] +
          ' ' + this.ordinalSuffix(event.startTime.getDate());
    } else {
      return MONTHS[event.startTime.getMonth()] + ' ' + event.startTime.getDate();
    }
  }

  /**
   * Calculate the duration of a given event and format it as a readable string
   * e.g. `10:00AM to 12:30 PM`.
   *
   * @param event The event
   */
  eventDuration(event: CalEvent) {
    if (!event.startTime) {
      return '';
    }

    const s = [
      formatTime(event.startTime),
      (event.endTime ? ' to ' + formatTime(event.endTime) : ''),
    ];
    return s.join('');
  }

  /**
   * Adds the two letter suffix to a given number.  E.g. `st`, `nd`, `rd` to `1`
   * `2`, and `3`, respectively.
   *
   * @param num The number to get the suffix for.
   */
  ordinalSuffix(num: number) {
    const j = num % 10;
    const k = num % 100;
    if (j === 1 && k !== 11) { return num + 'st'; }
    if (j === 2 && k !== 12) { return num + 'nd'; }
    if (j === 3 && k !== 13) { return num + 'rd'; }
    return num + 'th';
  }

  hostData() {
    return {
      class: {
        'rula-view': true,
        'rula-view--events': true,
        'rula-view--loaded': this.loaded && this.appLoaded,
      },
    };
  }

  /**
   * Component render function.
   */
  render() {
    if (this.appData && this.appData.events) {
      return ([
        <stencil-route-title title="Events" />,
        <h2 class="rula-view__heading">Upcoming events</h2>,
        <div class="rula-view__container mdc-layout-grid">
          <div class="mdc-layout-grid__inner" role="list">
            {this.appData.events.map((event: CalEvent, index: number) =>
              <div class={`${event.group} rula-event mdc-layout-grid__cell--span-4`} role="listitem" tabindex="0"
                  data-fade-delay={(index + 1) * 20} fade-in
                  aria-label={this.eventLabel(event)}>
                <div class="rula-event__header rula-event__header--16-9">
                <div class="rula-event__text-protection"></div>
                  <div class="rula-event__header-content">
                    <div class="rula-event__date mdc-typography--headline6">{this.eventDate(event)}</div>
                    <div class="rula-event__time mdc-typography--subtitle2">{this.eventDuration(event)}</div>
                    <div class="rula-event__location mdc-typography--subtitle1">{event.location ? event.location : ''}</div>
                  </div>
                </div>
                <div class="rula-event__detail" aria-label={`Details: ${sanitize(event.description)}`}>
                  <div class="rula-event__title mdc-typography--headline5">{event.title}</div>
                  <div class="mdc-typography--body1" innerHTML={sanitize(event.description)}></div>
                </div>
                <div class="rula-event__actions">
                  <button class="mdc-button rula-event__action"
                      aria-label={`Find ${event.location} on the map.`}>
                    Find on map
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>,
      ]);
    }

    return (
      <h2 class="rula-view__heading mdc-typography--headline2">No events currently available.</h2>
    );
  }
}
