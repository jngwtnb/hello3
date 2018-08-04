import React, { Component } from 'react';
//import ReactDOM from 'react-dom';
//import logo from './logo.svg';
import './App.css';

import '../node_modules/onsenui/css/onsenui.css';
//import '../node_modules/onsenui/css/onsen-css-components.css';
import '../node_modules/onsenui/css/dark-onsen-css-components.css';
import ons from 'onsenui';
//import {Page, Button, Toolbar} from 'react-onsenui';
import Ons, { Navigator, Page, Button, Toolbar, ToolbarButton, BackButton, Icon, Tab, Tabbar, Row, Col, Input } from 'react-onsenui';
import Forms from './Forms';
import dngr from './dongri_logo.png';

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

  gotoforms() {
    this.props.navigator.resetPage({ component: Forms, title: "Forms" })
  }

  render() {
    return (
      <Page>
        <div className="login-container">
          <img className="login-logo" src={dngr} alt="dngr" />
          <div className="login-form">
            <Input modifier="login-input-top" placeholder={'メールアドレス'} type={"text"} />
            <Input modifier="login-input-middle" placeholder={'パスワード'} type={"password"} />
            <Button modifier="login-button-bottom" onClick={this.resetPage.bind(this)}>ログイン</Button>
          </div>
        </div>
        <p style={{
  	      position: "absolute",
          right: 0,
          bottom: 0,
        }}><Button onClick={this.gotoforms.bind(this)}>forms</Button></p>
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
    ons.forcePlatformStyling('ios');
    return (
      <Navigator
        initialRoute={{ component: LoginPage, title: "LoginPage" }}
        renderPage={this.renderPage}
     //   animation={"none"}
      />
    );
  }
}
