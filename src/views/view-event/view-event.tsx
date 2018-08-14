import { Component, Element, Prop, State } from '@stencil/core';
import { APP_TITLE, MONTHS, FULL_MONTHS } from '../../global/constants';
import { formatTime } from '../../utils/event-parser';
import { sanitize } from '../../utils/sanitize';
import { LazyStore, CalEvent } from '../../interface';
import event from '../../reducers/event-reducer';
import { getEventData } from '../../actions/event-actions';

@Component({
  tag: 'view-event',
  styleUrl: 'view-event.scss',
  host: {
    theme: 'rula-view rula-view--events'
  }
})

export class ViewEvent {
  /**
   * Callback function used to unsubscribe from the Redux store.
   */
  private storeUnsubscribe: Function;

  /**
   * Root element of this component.
   */
  @Element() root: HTMLElement;

  /**
   * The currently active Event.
   */
  @State() activeEvent: CalEvent;

  /**
   * An array of all events.
   */
  @State() allEvents: CalEvent[];

  /**
   * The global Redux store.
   */
  @Prop({ context: 'lazyStore' }) lazyStore: LazyStore;

  /**
   * The URL from which to load calendar events (ical file).
   */
  @Prop() icalUrl: string;

  /**
   * Lifecycle function called when the component is about to load and has not
   * yet rendered.
   */
  componentWillLoad() {
    // Add in the `map` recuder to the Store.
    this.lazyStore.addReducers({event});
    this.storeUnsubscribe = this.lazyStore.subscribe(() =>
      this.stateChanged(this.lazyStore.getState().event)
    );

    // Load Map data.
    if (this.icalUrl) {
      this.lazyStore.dispatch(getEventData(this.icalUrl));
    } else {
      // Fail preloading with 'Unable to load map data!'
    }

    // Set window title.
    document.title = `Events | ${APP_TITLE}`;
  }

  /**
   * Lifecycle function called when the component has unloaded and will be
   * destroyed.
   */
  componentDidUnload() {
    this.storeUnsubscribe();
    document.title = APP_TITLE;
  }

  /**
   * Handle when the Redux state changes.
   * 
   * @param state The new Redux state
   */
  stateChanged(state) {
    this.allEvents = state.allEvents;
  }

  /**
   * Generates a string of text that describes an event usable for the 
   * `aria-label` attribute.
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
  eventDate(event: CalEvent, forAria: boolean = false) {
    let sM = event.startTime.getMonth();
    let sD = event.startTime.getDate();
    let c = new Date();
    let cM = c.getMonth();
    let cD = c.getDate();

    if (sM == cM && sD == cD) {
      return 'Today';
    }

    c.setTime(c.getTime() + 86400000);
    cM = c.getMonth(); cD = c.getDate();

    if (sM == cM && sD == cD) {
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
   * Returns a readable string consisting of the start and end time of the
   * event.
   * 
   * @param event The event to get the time from
   */
  eventDuration(event: CalEvent) {
    let s = [
      formatTime(event.startTime),
      (event.endTime ? ' to ' + formatTime(event.endTime) : '')
    ];
    return s.join('');
  }

  /**
   * Adds the two letter suffix to a given number.  E.g. `st`, `nd`, `rd` to `1`
   * `2`, and `3`, respectively.
   * 
   * @param num The number to get the suffix for.
   */
  ordinalSuffix(num) {
    let j = num % 10, k = num % 100;
    if (j == 1 && k != 11) { return num + 'st'; }
    if (j == 2 && k != 12) { return num + 'nd'; }
    if (j == 3 && k != 13) { return num + 'rd'; }
    return num + 'th';
  }

  /**
   * Component render function.
   */
  render() {
    if (!this.allEvents) {
      return (
        <h2 class="rula-view__heading mdc-typography--headline2">No events currently available.</h2>
      );
    }

    return ([
      <h2 class="rula-view__heading">Upcoming events</h2>,
      <div class="rula-view__container mdc-layout-grid">
        <div class="mdc-layout-grid__inner" role="list">
          {this.allEvents.map((event, index) => 
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
                    aria-label={`Get directions to ${event.location}.`}>
                  Find on map
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    ]);
  }
}

