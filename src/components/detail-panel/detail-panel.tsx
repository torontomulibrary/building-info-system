import { Component, Event, EventEmitter, Element, Prop, State, Watch } from '@stencil/core';
//import { MDCTemporaryDrawer } from '@material/drawer';

import {
  LazyStore,
  MapElementDetail,
} from '../../interface';

import map from '../../reducers/map-reducer';

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
    return ([
        <header class='rula-detail-panel__header'>
          <div class='rula-detail-panel__header-content'>
            <span class='mdc-typography--headline6'>Location Details</span>
          </div>
        </header>,
        <ul class='rula-detail-panel__content rula-list'>
          <li role='separator' class='mdc-list-divider'></li>
        {this._details.map((detail:MapElementDetail) => ([
          <li class='rula-list__item'>
            {detail.name}
          </li>,
          <li class='rula-list__item'>
            {detail.description}
          </li>,
          <li role='separator' class='mdc-list-divider'></li>
        ]))}
        </ul>
    ]);
  }
}