import { createStore, applyMiddleware, compose } from 'redux';
import { persistStore} from 'redux-persist';

import logger from 'redux-logger';
import reducer from '../reducers/rootReducer';
import { composeWithDevTools } from 'redux-devtools-extension';

let middleware = [];

const reduxImmutableStateInvariant = require('redux-immutable-state-invariant').default();
middleware = [...middleware, reduxImmutableStateInvariant, logger];

export default function configureStore(initialState) {
	let store = createStore(reducer, undefined, composeWithDevTools(applyMiddleware(...middleware)))
	let persistor = persistStore(store)
	return { persistor, store }
};