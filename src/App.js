import React, { Component } from 'react';
//import ReactDOM from 'react-dom';
//import logo from './logo.svg';
//import './App.css';

import '../node_modules/onsenui/css/onsenui.css';
import '../node_modules/onsenui/css/onsen-css-components.css';
import ons from 'onsenui';
//import {Page, Button, Toolbar} from 'react-onsenui';
import { Navigator, Page, Button, Toolbar, ToolbarButton, BackButton, Icon, Tab, Tabbar } from 'react-onsenui';


class TabPage3 extends React.Component {
  handleClick() {
    ons.notification.alert('Hello, world!');
  }

  popPage() {
    this.props.navigator.popPage();
  }


  render() {
    return (
      <Page renderToolbar={() =>
        <Toolbar>
          <div className="center">{this.props.title}</div>
        </Toolbar>
      }>

        <p style={{ padding: '0 15px' }}>
          This is the <strong>{this.props.title}</strong> page!
        </p>

        <Button onClick={this.handleClick}>Push!</Button>
      </Page>
    )
  }
}

class TabPage2 extends React.Component {
  handleClick() {
    ons.notification.alert('Hello, world!');
  }

  render() {
    return (
      <Page renderToolbar={() =>
        <Toolbar>
          <div className="center">{this.props.title}!!!</div>
        </Toolbar>
      }>

        <p style={{ padding: '0 15px' }}>
          This is the <strong>{this.props.title}</strong> page!
        </p>

        <Button onClick={this.handleClick}>Push!</Button>
      </Page>
    )
  }
}


class MainPage extends React.Component {
  renderTabs() {
    const sections = [
      'Home',
      'Comments',
    ];

    let tabs = sections.map((section) => {
      return {
        content: <TabPage3 key={section} title={section} />,
        tab: <Tab key={section} label={section} />
      };
    });

    tabs.push({
      content: <TabPage2 key={'Settings'} title={'Settings'} />,
      tab: <Tab key={'Settings'} label={'Settings'} />
    });

    return tabs;
  }

  popPage() {
    this.props.navigator.popPage({ component: MainPage, title: "MainPage" });
  }

  render() {
    return (
      <Page>
        <Tabbar
          initialIndex={1}
          renderTabs={this.renderTabs}
          swipeable={true}
        />
      </Page>

    );
  }
}

class LoginPage extends React.Component {
  resetPage() {
    this.props.navigator.resetPage({ component: MainPage, title: "MainPage" });
  }

  render() {
    return (
      <Page>
        <div className="center"><Button onClick={this.resetPage.bind(this)}>login</Button></div>
      </Page>
    );
  }
}

export default class App extends React.Component {
  renderPage(route, navigator) {
    const props = route.props || {};
    props.navigator = navigator;
    props.key = route.title;
    return React.createElement(route.component, props);
  }

  render() {
    return (
      <Navigator
        initialRoute={{ component: LoginPage, title: "LoginPage" }}
        renderPage={this.renderPage}
     //   animation={"none"}
      />
    );
  }
}
