import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
//import Sample from './Sample';
import registerServiceWorker from './registerServiceWorker';

const startApp = () => {
  ReactDOM.render(<App />, document.getElementById('root'));
  registerServiceWorker(); //test2
};

if(window.cordova) {
  document.addEventListener('deviceready', startApp, false);
} else {
  startApp();
}