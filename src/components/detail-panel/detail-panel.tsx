import { Component, Event, EventEmitter, Element, Prop, State, Watch } from '@stencil/core';
//import { MDCTemporaryDrawer } from '@material/drawer';

import {
  LazyStore,
  MapElementDetail,
  // MapElement,
} from '../../interface';

import map from '../../reducers/map-reducer';

import {
  updateActiveElement,
} from '../../actions/map-actions';

@Component({
  tag: 'rula-detail-panel',
  styleUrl: 'detail-panel.scss',
  host: {
    theme: 'rula-detail-panel rula-detail-panel--animated'
  }
})

export class DetailPanel {
  //private _drawer: MDCTemporaryDrawer;
  private _storeUnsubscribe: Function;

  @Element() root: HTMLStencilElement;

  @State() _details: MapElementDetail[] = [];
  @Prop({ mutable: true }) open: boolean;
  @Watch('open')
  openDrawer() {
    //this._drawer.open = this.open;
  }

  @Prop({ context: 'lazyStore' }) lazyStore: LazyStore;

  @Event() drawerClose: EventEmitter;

  async componentWillLoad() {
    this.lazyStore.addReducers({map});
    this._storeUnsubscribe = this.lazyStore.subscribe(() =>
      this._stateChanged(this.lazyStore.getState().map)
    );
  }

  componentDidLoad() {
    // this._drawer = new MDCTemporaryDrawer(this.root);
    // this._drawer.listen('MDCTemporaryDrawer:close', () => {
    //   this.root.removeAttribute('open');
    //   this.drawerClose.emit();
    //   //this.oldTabStop.focus();
    // });

    // this._drawer.listen('MDCTemporaryDrawer:open', () => {
    //   //this.setFocusTrap_();
    // });
  }

  componentDidUnload() {
    this._storeUnsubscribe();
  }

  _create

  _stateChanged(state) {
    if (state.activeElement && state.activeElement.details) {
      this._details = Object.values(state.activeElement.details);
      this.root.forceUpdate();
      this.open = true;
      this.root.classList.add('rula-detail-panel--open');
    } else {
      this.open = false;
      this.root.classList.remove('rula-detail-panel--open');
    }
  }

  render() {
    let detailName = this._details.map((detail:MapElementDetail) => {
      return detail.name;
    }).join(', ');

    return ([
        <header class='rula-detail-panel__header'>
          <span class="rula-detail-panel__title">
            <div class='mdc-typography--body2'>{this._details[0].code}</div>
            <div class='mdc-typography--headline6'>{detailName}</div>
          </span>
          <button class='material-icons rula-detail-panel__close' onClick={_ => {this.lazyStore.dispatch(updateActiveElement(undefined));}}>close</button>
        </header>,
        <div class='rula-detail-panel__content'>
          <div class="rula-detail-panel__section">
            <div class="rula-detail-panel__subtitle mdc-typography--subtitle2">Description</div>
            {this._details[0].description}
          </div>
        </div>
    ]);
  }
}