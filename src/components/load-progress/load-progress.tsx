import { MDCLinearProgress } from '@material/linear-progress/index';
import { Component, Element, State } from '@stencil/core';

import { APP_DATA, EVENTS } from '../../global/constants';
import { dataService } from '../../utils/data-service';

@Component({
  tag: 'rl-load-progress',
  styleUrl: 'load-progress.scss',
})

export class LoadProgress {
  private _pb?: MDCLinearProgress;
  private _pbEl!: HTMLElement;

  private _max = Object.keys(APP_DATA).length;
  private _progress = 0;

  @Element() root!: HTMLElement;

  @State() done = false;

  componentWillLoad() {
    dataService.listen(EVENTS.DATA_LOADED, () => {
      this._progress++;
      if (this._pb) {
        this._pb.progress = this._progress / this._max;
      }
    });

    dataService.listen(EVENTS.ALL_DATA_LOADED, () => {
      this.done = true;
    });
  }

  componentDidLoad() {
    this._pb = new MDCLinearProgress(this._pbEl);
    this._pb.open();
    this._pb.progress = 0;
    this._pb.buffer = 1;

    this.root.addEventListener('transitionend', () => {
      this.root.style.display = 'none';
    });
  }

  hostData() {
    return {
      class: {
        'rl-load-progress': true,
        'rl-load-progress--done': this.done,
      },
    };
  }

  render() {
    return ([
      <div>
        App Loading...
      </div>,
      <div ref={el => this._pbEl = el as HTMLElement} role="progressbar" class="mdc-linear-progress">
        <div class="mdc-linear-progress__buffering-dots"></div>
        <div class="mdc-linear-progress__buffer"></div>
        <div class="mdc-linear-progress__bar mdc-linear-progress__primary-bar">
          <span class="mdc-linear-progress__bar-inner"></span>
        </div>
        <div class="mdc-linear-progress__bar mdc-linear-progress__secondary-bar">
          <span class="mdc-linear-progress__bar-inner"></span>
        </div>
      </div>,
    ]);
  }
}
