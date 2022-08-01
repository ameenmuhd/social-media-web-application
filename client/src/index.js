import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {Provider} from 'react-redux'
import store from './Redux/Store';
import {PersistGate} from 'redux-persist/es/integration/react';
import {persistStore} from 'redux-persist';
import App from './App';
import reportWebVitals from './reportWebVitals';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
    <PersistGate persistor={persistStore(store)}>
    <App />
    </PersistGate>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
