import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

const startApp = () => {
  ReactDOM.render(<App />, document.getElementById('root'));
  registerServiceWorker(); //test2
};

//console.log(window);

if(window.cordova) {
//  window.Keyboard.shrinkView(true);
  document.addEventListener('deviceready', startApp, false);
} else {
  startApp();
}