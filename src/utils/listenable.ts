/**
 * A class implementing a basic Observable pattern using a Set. Calling
 * `subscribe` adds a new function to the Set.  Calling `dispatch` calls all the
 * functions in the set with specified data.
 */
class Observable {
  private _subscribers = new Set<Function>();

  /**
   * Add a specified callback function to this Observer.
   *
   * @param fn A callback function accepting one parameter
   */
  subscribe(fn: (value: any) => void) {
    this._subscribers.add(fn);

    return {
      unsubscribe: () => this._subscribers.delete(fn),
    };
  }

  unsubscribe(fn: (value: any) => void) {
    this._subscribers.delete(fn);
  }

  /**
   * Dispatch a message to each subscriber by calling the stored functions.
   *
   * @param thing Data to pass to each subscriber
   */
  dispatch(thing: any) {
    for (const subscriber of this._subscribers) {
      subscriber(thing);
    }
  }
}

/**
 * A basic Event class
 */
export class Listenable {
  private _observers = new Map<string, Observable>();

  /**
   * Add a specified callback function to this Observer.
   *
   * @param fn A callback function accepting one parameter
   */
  listen(topic: string, fn: (value: any) => void) {
    let observer: Observable;

    if (this._observers.has(topic)) {
      observer = this._observers.get(topic) || new Observable();
    } else {
      observer = new Observable();
      this._observers.set(topic, observer);
    }

    return observer.subscribe(fn);
  }

  unlisten(topic: string, fn: (value: any) => void) {
    if (this._observers.has(topic)) {
      const observer = this._observers.get(topic);
      if (observer && observer.unsubscribe(fn)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Dispatch a message to each observer by calling the stored functions.
   *
   * @param thing Data to pass to each observer
   */
  dispatch(topic: string, thing?: any) {
    if (this._observers.has(topic)) {
      const observer = this._observers.get(topic);
      if (observer) {
        observer.dispatch(thing);
      }
    }
  }
}
