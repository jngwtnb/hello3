import React, { Component } from 'react';
//import ReactDOM from 'react-dom';
//import logo from './logo.svg';

import '../node_modules/onsenui/css/onsenui.css';
import '../node_modules/onsenui/css/onsen-css-components.css';
import './App.css';

//import '../node_modules/onsenui/css/dark-onsen-css-components.css';
import ons from 'onsenui';
//import {Page, Button, Toolbar} from 'react-onsenui';
import Ons, { Navigator, Page, Button, Toolbar, ToolbarButton, BackButton, Icon, Tab, Tabbar, Row, Col, Input, List, ListItem, PullHook } from 'react-onsenui';
import Forms from './Forms';
import dngr from './dongri_logo.png';
//import cordova from 'cordova';
import '../node_modules/@fortawesome/fontawesome';
import '../node_modules/@fortawesome/fontawesome-free-solid';
//require('@fortawesome/fontawesome')
//require('@fortawesome/fontawesome-free-solid')
import axios from 'axios';

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
  constructor(props) {
    super(props);

    this.state = {
      pullHookState: 'initial',
      data: [],
    }

    this.icons = {
      '完了':   {color: "limegreen", name:{default: 'fa-check-square'}},
      '未確認': {color: "red", name:{default: 'fa-exclamation'}},
      '不明':   {color: "yellow", name:{default: 'fa-question'}},
    };
  }

  handleClick() {
    ons.notification.alert('Hello, world!');
  }

  handleLoad(done) {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    axios.get("https://www.google.com/")
      .then(response => {
        ons.notification.alert('status:', response.status);
        ons.notification.alert('body:', response.data);
//        console.log('status:', response.status); // 200
//        console.log('body:', response.data);     // response body.
      })
      .catch(err => {
        ons.notification.alert('err:', err);
      });

    //    fetch("https://www.google.com/")

/*
    fetch('http://apps.cowry.co.jp/Monet2/api/wallet/history/?deviceId=13CZLXCy6MD2L4iwEeeyXTB8pDAmdQyhD5&limit=100&offset=0', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }})
      .then((response) => {
        console.log(response);
        if(response.ok) {
          return response.json();
        } else {
          throw new Error();
        }
      })
      .then((json) => {
        let history = json;


  //{"amount":"324.00000000","cause":"Receive","createdAt":1535788541632}

        let data = history.histories.map((data) => {
          ons.notification.alert(data);
        });


        this.setState({
          data: history.histories,
        }, done);

      })
      .catch((error) => console.log(error));
      */
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  handleChange(event) {
    this.setState({
      pullHookState: event.state
    });
  }

  render() {
    /*

    */
    let dataSource = [
      {'status': '完了',   'datetime': '2018/7/8 19:34', price: {'amount': '4469'},    'cause': '受取',     'wallet': "kawazu"},
      {'status': '完了',   'datetime': '2018/7/8 19:34', price: {'amount': '198000'},  'cause': '送金',     'wallet': "Taketotto's"},
      {'status': '完了',   'datetime': '2018/7/8 19:34', price: {'amount': '4980000'}, 'cause': 'チャージ', 'wallet': "河島高志の財布"},
      {'status': '未確認', 'datetime': '2018/7/8 19:34', price: {'amount': '4469'},    'cause': '受取',     'wallet': "kawazu"},
      {'status': '不明',   'datetime': '2018/7/8 19:34', price: {'amount': '198000'},  'cause': '送金',     'wallet': "Taketotto's"},
      {'status': '完了',   'datetime': '2018/7/8 19:34', price: {'amount': '4980000'}, 'cause': 'チャージ', 'wallet': "河島高志の財布"},
    ];

    for (let datum of dataSource ) {
      datum.icon = this.icons[datum.status];

      let priceLength = datum.price.amount.length;
      if (priceLength >= 7) {
        datum.price.color = "red";
      } else if (priceLength >= 6) {
        datum.price.color = "green";
      } else {
        datum.price.color = "black";
      }

    }

    let pullHookContent;
    const state = this.state.pullHookState;

    if (state === 'initial') {
      pullHookContent = 'Pull';
    }
    else if (state === 'preaction') {
      pullHookContent = 'Release';
    }
    else {
      pullHookContent = <Icon icon='spinner' spin />;
    }

    return (
      <Page>
        <PullHook onChange={this.handleChange.bind(this)} onLoad={this.handleLoad.bind(this)}>
          {pullHookContent}
        </PullHook>
        <List
          modifier="myinset noborder"
          dataSource={this.state.data}
          renderRow={(data, idx) => 
            <ListItem key={data+idx} modifier="nodivider inset">
              <div className="list-item-container">
                <div className="status">
                  <Icon size={{default: 24}} fixedWidth={true} style={{color: data.icon.color}} icon={data.icon.name}/>
                  {data.status}
                </div>
                <div className="datetime">
                  {data.datetime}
                </div>
                <div className="price">
                  <span className="icon"><Icon size={{default: 24}} icon={{default: "fa-coins"}}/></span>
                  <span className="text">
                    <span className="amount" style={{color: data.price.color}}>{data.price.amount}</span>
                    <br/>
                    <span className="ticker">DNGR</span>
                  </span>
                </div>
                <div className="cause">
                  <span>{data.cause}</span>
                </div>
                <div className="wallet">
                  <span className="wallet-icon"><Icon size={{default: 16}} icon={{default: "fa-wallet"}}/></span>
                  <span className="wallet-text">{data.wallet}</span>
                </div>
              </div>
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
