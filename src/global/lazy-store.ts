import { lazyReducerEnhancer } from 'pwa-helpers/lazy-reducer-enhancer.js';
import {
  applyMiddleware,
  combineReducers,
  compose as origCompose,
  createStore,
} from 'redux';
import thunk from 'redux-thunk';

// Sets up a Chrome extension for time travel debugging.
// See https://github.com/zalmoxisus/redux-devtools-extension for more information.
const compose = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || origCompose;

// Add the lazyStore to the 'global' Context for access in StencilJS components.
declare var Context: any;

Context.lazyStore = createStore(
  (state, _) => state,
  compose(lazyReducerEnhancer(combineReducers), applyMiddleware(thunk))
);
