import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import '../node_modules/onsenui/css/onsenui.css';
import '../node_modules/onsenui/css/onsen-css-components.css';
import ons from 'onsenui';
import {Page, Button, Toolbar} from 'react-onsenui';

class App extends Component {
  handleClick() {
    ons.notification.alert('Hello world!');
  }

  render() {
    return (
      <Page>
        <Toolbar>
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
          <div className="center">My title</div>
        </Toolbar>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload!?
        </p>
        <Button onClick={this.handleClick}>Tap me!</Button>
        </Page>  
    );
  }
}

export default App;
