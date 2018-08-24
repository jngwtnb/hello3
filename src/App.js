import React, { Component } from 'react';
//import ReactDOM from 'react-dom';
//import logo from './logo.svg';

import '../node_modules/onsenui/css/onsenui.css';
import '../node_modules/onsenui/css/onsen-css-components.css';
import './App.css';

//import '../node_modules/onsenui/css/dark-onsen-css-components.css';
import ons from 'onsenui';
//import {Page, Button, Toolbar} from 'react-onsenui';
import Ons, { Navigator, Page, Button, Toolbar, ToolbarButton, BackButton, Icon, Tab, Tabbar, Row, Col, Input, List, ListItem } from 'react-onsenui';
import Forms from './Forms';
import dngr from './dongri_logo.png';
//import cordova from 'cordova';

class TabPage3 extends React.Component {
  handleClick() {
    ons.notification.alert('Hello, world!');
  }

  popPage() {
    this.props.navigator.popPage();
  }


  render() {
    return (
      <Page>
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
      <Page>

        <p style={{ padding: '0 15px' }}>
          This is the <strong>{this.props.title}</strong> page!
        </p>

        <Button onClick={this.handleClick}>Push!</Button>
      </Page>
    )
  }
}

class HistoryPage extends React.Component {
  handleClick() {
    ons.notification.alert('Hello, world!');
  }

  render() {
    return (
      <Page>
        <Tabbar
          index={0}
          swipeable={false}
          position={"top"}
          renderTabs={(activeIndex, tabbar) => [
            {
              content: <HistoryPage2 title="History" key="History" active={activeIndex === 0} tabbar={tabbar} />,
              tab: <Tab label="並べ替え" key="Hisotoryyyyyyyyyy" icon="home" />
            },
          ]}
        />
      </Page>
    )
  }
}

class HistoryPage2 extends React.Component {
  handleClick() {
    ons.notification.alert('Hello, world!');
  }

  render() {
    return (
      <Page>
        <List
          modifier="inset2 noborder"
          dataSource={['Row 1', 'Row 2', 'Row 2', 'Row 2', 'Row 2', 'Row 2', 'Row 2', 'Row 2', 'Row 2', 'Row 2']}
          renderRow={(row, idx) => 
            <ListItem key={row+idx} modifier="nodivider inset">
              <Icon size={{default: 32}} style={{color: "limegreen"}} icon={{default: 'fa-check-square'}}/>
              {row}
              <Button modifier="quiet">Remove</Button>
            </ListItem>
          }
        />
      </Page>
    )
  }
}

class QrCodePage extends React.Component {
  qr() {
    console.log(window.cordova);
/*
  console.log(window);
  console.log(window.cordova);
  console.log(window.cordova.plugins);
   */

    if (window.cordova) {
      window.plugins.barcodeScanner.scan(
        function (result) {
            alert("We got a barcode\n" +
                  "Result: " + result.text + "\n" +
                  "Format: " + result.format + "\n" +
                  "Cancelled: " + result.cancelled);
        }, 
        function (error) {
            alert("Scanning failed: " + error);
        }
      );  
    }


  }

  handleClick() {
    ons.notification.alert('Hello, world!');
  }

  render() {
    return (
      <Page>
        <div className="send-form-container">
          <div className="send-form-box" />
          <div className="send-form-label">送金に必要な項目を入力してください:</div>
          <div className="send-form">
            <Input modifier="underbar" placeholder={'メールアドレス'} type={"text"} />
            <Input modifier="underbar" placeholder={'パスワード'} type={"text"} />
            <Input modifier="underbar" placeholder={'メッセージ'} type={"text"} />
            <Button modifier="send-button" onClick={this.qr.bind(this)}>送信</Button>
          </div>
        </div>
      </Page>
    )
  }
}

class SendPage extends React.Component {
  handleClick() {
    ons.notification.alert('Hello, world!');
  }

  render() {
    return (
      <Page>
        <Tabbar
          index={1}
          swipeable={false}
          position={"top"}
          renderTabs={(activeIndex, tabbar) => [
            {
              content: <TabPage2 title="Send" key="Sendaa" active={activeIndex === 0} tabbar={tabbar} />,
              tab: <Tab label="タッチ支払い" key="Sendaaaaaaaaaa" icon="home" />
            },
            {
              content: <QrCodePage title="QrCode" key="QrCode" active={activeIndex === 1} tabbar={tabbar} />,
              tab: <Tab label="QRコード" key="QrCodeTab" icon="md-settings" />
            },
          ]}
        />
      </Page>
    )
  }
}

class MainPage extends React.Component {
  popPage() {
    this.props.navigator.popPage({ component: MainPage, title: "MainPage" });
  }

  render() {
    return (
      <Page renderToolbar={() => 
        <Toolbar>
          <div className="left">ざんだか</div>
          <div className="center">12,300DNGR</div>
          <div className="right">をれっと</div>
        </Toolbar>
      }>
        <Tabbar
          initialIndex={1}
          swipeable={true}
          renderTabs={(activeIndex, tabbar) => [
            {
              content: <SendPage title="Send" key="Send" active={activeIndex === 0} tabbar={tabbar} />,
              tab: <Tab label="送金" key="SendTab" icon="home" />
            },
            {
              content: <TabPage2 title="Receive" key="Receive" active={activeIndex === 1} tabbar={tabbar} />,
              tab: <Tab label="受取" key="ReceiveTab" icon="md-settings" />
            },
            {
              content: <HistoryPage title="History" key="History" active={activeIndex === 2} tabbar={tabbar} />,
              tab: <Tab label="履歴" key="HistoryTab" icon="md-settings" />
            },
            {
              content: <TabPage2 title="Settings" key="Setting" active={activeIndex === 3} tabbar={tabbar} />,
              tab: <Tab label="設定" key="SettingsTab" icon="md-settings" />
            },
          ]}
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
        <div className="login-form-container">
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
