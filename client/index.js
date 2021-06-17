import React from 'react';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { Provider } from 'react-redux';
import reducer from './reducers';
import thunkMiddleware from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';

const store = createStore(
    reducer,
    applyMiddleware(thunkMiddleware)
);

const AppRedux = () => (
    <Provider store = { store }>
        <App />
    </Provider>
);

AppRegistry.registerComponent(appName, () => AppRedux);
