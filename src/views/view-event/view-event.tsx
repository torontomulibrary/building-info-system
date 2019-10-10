import { Component, Element, Host, Prop, State, h } from '@stencil/core';
import { QueueApi } from '@stencil/core/dist/declarations';
import { RouterHistory } from '@stencil/router';

import {
  BASE_URL,
} from '../../global/config';
import {
  FULL_MONTHS,
  MAP_TYPE,
  MONTHS,
  ROUTES,
} from '../../global/constants';
import { CalEvent } from '../../interface';
import { dataStore } from '../../utils/app-data';
import { formatTime } from '../../utils/event-parser';
import { sanitize } from '../../utils/sanitize';

@Component({
  tag: 'view-event',
  styleUrl: 'view-event.scss',
})

export class ViewEvent {
  @Element() root!: HTMLElement;

  /**
   * Internal list of all Events to display.
   */
  @State() events?: CalEvent[];

  /**
   * A flag indicating if this view loaded all the data needed to display.
   */
  @State() loaded = false;

  /**
   * Global flag indicating if the whole application has loaded.  If not, this
   * view should not display either.
   */
  @Prop() appLoaded = false;

  @Prop() history!: RouterHistory;

  @Prop({ context: 'queue' }) queue!: QueueApi;

  /**
   * Lifecycle event fired when the component is first initialized and not
   * yet in the DOM.
   */
  componentWillLoad() {
    dataStore.getData('events').then(events => {
      this.events = events;
    }).catch(e => console.error('Error loading events in view-faq ' + e));
  }

  componentDidLoad() {
    this.checkSize();
  }

  checkSize() {
    if (this.root.offsetHeight === 0) {
      this.queue.write(() => {
        this.checkSize();
      });
    } else {
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

  /**
   * Component render function.
   */
  render() {
    if (this.events) {

      return (
        <Host class={{
          'rl-view': true,
          'rl-view--events': true,
          'rl-view--loaded': this.loaded && this.appLoaded,
        }}>
          <stencil-route-title pageTitle="Events | " />
          <h2 class="rl-view__heading">Upcoming events</h2>
          <div class="rl-view__container mdc-layout-grid">
            <div class="mdc-layout-grid__inner" role="list">
              {this.events.map((event: CalEvent, index: number) => {
                const room = event.location.replace(/\s/g, '').slice(0, 6);
                return (
                <div class={`${event.group} rl-event mdc-layout-grid__cell--span-4`} role="listitem" tabindex="0"
                    data-fade-delay={(index + 1) * 20} fade-in
                    aria-label={this.eventLabel(event)}>
                  <div class="rl-event__header rl-event__header--16-9">
                  <div class="rl-event__text-protection"></div>
                    <div class="rl-event__header-content">
                      <div class="rl-event__date mdc-typography--headline6">{this.eventDate(event)}</div>
                      <div class="rl-event__time mdc-typography--subtitle2">{this.eventDuration(event)}</div>
                      <div class="rl-event__location mdc-typography--subtitle1">{event.location ? event.location : ''}</div>
                    </div>
                  </div>
                  <div class="rl-event__detail" aria-label={`Details: ${sanitize(event.description)}`}>
                    <div class="rl-event__title mdc-typography--headline5">{event.title}</div>
                    <div class="mdc-typography--body1" innerHTML={sanitize(event.description)}></div>
                  </div>
                  <div class="rl-event__actions mdc-card__actions">
                    <a class="mdc-button mdc-card__action mdc-card__action--button rl-event__action"
                        aria-label={`Find ${event.location} on the map.`}
                        href={`${BASE_URL}${ROUTES.MAP}/${MAP_TYPE.LOCN}/${room}`}>
                      <span class="mdc-button__label">
                        Find on map
                      </span>
                    </a>
                  </div>
                </div>);
              })}
            </div>
          </div>
        </Host>
      );
    }

    return (
      <Host class={{
        'rl-view': true,
        'rl-view--events': true,
        'rl-view--loaded': this.loaded && this.appLoaded,
      }}>
        <stencil-route-title pageTitle="Events | " />
        <h2 class="rl-view__heading mdc-typography--headline2">No events currently available.</h2>
      </Host>
    );
  }
}
