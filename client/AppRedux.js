import React from 'react';
import App from './App';
import {Provider} from 'react-redux';
import reducer from './reducers';
import thunk from 'redux-thunk';
import {configureStore} from '@reduxjs/toolkit';

const store = configureStore({
    reducer,
    middleware: [thunk],
});

export default () => (
    <Provider store={store}>
        <App />
    </Provider>
);