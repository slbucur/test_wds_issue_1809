import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware, compose} from 'redux';
import {browserHistory} from 'react-router';
import thunk from 'redux-thunk';
import promise from 'redux-promise';

//---Startup code

const doNothingReducer = function(state = {}, action){
    return state;
}

const args = [thunk, promise];
const composeEnhancers = process.env.NODE_ENV === 'production' ? compose : (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose);
const store = createStore(doNothingReducer,composeEnhancers(applyMiddleware(...args)));
//--------------

import { AppContainer} from 'react-hot-loader'
import App from './App'

//---App initialization
const content = (
    <AppContainer>
      <Provider store={store}>
        <App history={browserHistory}/>
      </Provider>
    </AppContainer>
);
const renderRoot = () => ReactDOM.render(
    content,
    document.getElementById('root')
);

renderRoot();