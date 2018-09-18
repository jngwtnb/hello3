import React, { Component } from 'react';
//import ReactDOM from 'react-dom';
//import logo from './logo.svg';

import '../node_modules/onsenui/css/onsenui.css';
import '../node_modules/onsenui/css/onsen-css-components.css';
import '../node_modules/@fortawesome/fontawesome';
import '../node_modules/@fortawesome/fontawesome-free-solid';
import './App.css';
import './css/list.css';
import './css/header.css';
import './css/footer.css';
//require('@fortawesome/fontawesome')
//require('@fortawesome/fontawesome-free-solid')
//import '../node_modules/onsenui/css/dark-onsen-css-components.css';

import ons from 'onsenui';
import Ons, { Navigator, Page, Button, BottomToolbar, Toolbar, ToolbarButton, BackButton, Icon, Tab, Tabbar, Row, Col, Input, List, ListItem, PullHook, ListHeader } from 'react-onsenui';
import dngr from './dongri_logo.png';
import TabLikeButton from './TabLikeButton';

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
        <Tabbar
          modifier="half"
          swipeable={false}
          position={"top"}
          renderTabs={(activeIndex, tabbar) => [
          ]}
        />

        <p style={{ padding: '0 15px' }}>
          This is the <strong>{this.props.title}</strong> page!
        </p>

        <Button onClick={this.handleClick}>Push!</Button>
      </Page>
    )
  }
}

class HistoryPage extends React.Component {
  render() {
    return (
      <Page>
        <Tabbar
          modifier="half"
          index={0}
          swipeable={false}
          position={"top"}
          renderTabs={(activeIndex, tabbar) => [
            {
              content: <HistoryPage2 title="History" key="Historrrry" active={activeIndex === 0} tabbar={tabbar} />,
              tab: <Tab label="並べ替え" key="Hisotoryyyyyyyyyy" icon="fa-arrows-alt-v" />
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

    this.causes = {
      'Receive': '受取',
      'Send': '送金',
      'Payment': 'チャージ',
    };
  }

  handleClick() {
    ons.notification.alert('Hello, world!');
  }

  handleLoad(done) {
    fetch('http://apps.cowry.co.jp/Monet2/api/wallet/history/?deviceId=13CZLXCy6MD2L4iwEeeyXTB8pDAmdQyhD5&limit=100&offset=0')
      .then((response) => {
        if(response.ok) {
          return response.json();
        } else {
          throw new Error();
        }
      })
      .then((history) => {
        const statuses = ["完了", "完了", "完了", "完了", "未確認", "不明"];
        const wallets = ["suzuki", "ichirooooooh's", "鈴木一郎の財布"];

        let data = history.histories.map(h => {
          let priceLength = h.amount.length;
          let amountColor
              = priceLength >= 7 ? "red"
              : priceLength >= 6 ? "green"
              :                    "black"
              ;

          let status = statuses[Math.floor(Math.random() * statuses.length)];
          let wallet = wallets[Math.floor(Math.random() * wallets.length)];

          return {
            status: {icon: this.icons[status], label: status},
            datetime: new Date(h.createdAt).toLocaleString("ja-JP", {timeZone: "Asia/Tokyo"}),
            price: {amount: h.amount, color: amountColor},
            cause: this.causes[h.cause],
            wallet: wallet,
          };
        });


        this.setState({data: []});
        this.setState({data: data}, done);
      })
      .catch((error) => console.log(error));

  }

  handleChange(event) {
    this.setState({
      pullHookState: event.state
    });
  }

  render() {
/*
    let dataSource = [
      {'status': '完了',   'datetime': '2018/7/8 19:34', price: {'amount': '4469'},    'cause': '受取',     'wallet': "kawazu"},
      {'status': '完了',   'datetime': '2018/7/8 19:34', price: {'amount': '198000'},  'cause': '送金',     'wallet': "Taketotto's"},
      {'status': '完了',   'datetime': '2018/7/8 19:34', price: {'amount': '4980000'}, 'cause': 'チャージ', 'wallet': "河島高志の財布"},
      {'status': '未確認', 'datetime': '2018/7/8 19:34', price: {'amount': '4469'},    'cause': '受取',     'wallet': "kawazu"},
      {'status': '不明',   'datetime': '2018/7/8 19:34', price: {'amount': '198000'},  'cause': '送金',     'wallet': "Taketotto's"},
      {'status': '完了',   'datetime': '2018/7/8 19:34', price: {'amount': '4980000'}, 'cause': 'チャージ', 'wallet': "河島高志の財布"},
    ];
*/

    return (
      <Page>
        <PullHook onChange={this.handleChange.bind(this)} onLoad={this.handleLoad.bind(this)}>
          {
            (this.state.pullHookState === 'initial') ?
              <span >
                <Icon size={35} spin={false} icon='ion-arrow-down-a' />
                Pull down to refresh
              </span>
            : (this.state.pullHookState === 'preaction') ?
              <span>
                <Icon size={35} spin={false} icon='ion-arrow-up-a' />
                Release to refresh
              </span>
            :
              <span><Icon size={35} spin={true} icon='ion-load-d'></Icon> Loading data...</span>
          }
        </PullHook>
        <List
          modifier="myinset noborder"
          dataSource={this.state.data}
          renderRow={(data, idx) =>
            <ListItem key={`row-${idx}`} modifier="nodivider inset">
              <div className="list-item-container">
                <div className="status">
                  <Icon size={{default: 24}} fixedWidth={true} style={{color: data.status.icon.color}} icon={data.status.icon.name}/>
                  {data.status.label}
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
  render() {
    return (
      <Page>
        <Tabbar
          modifier="half"
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
  constructor(props) {
    super(props);

    this.state = {
      index: 0,
    }
  }

  popPage() {
    this.props.navigator.popPage({ component: MainPage, title: "MainPage" });
  }

  handleClickBalanceTab() {
    this.state.index = 4;
    this.refs.tabbar._tabbar.setActiveTab(4, { reject: false });
  }

  handleClickWalletTab() {
    this.state.index = 5;
    this.refs.tabbar._tabbar.setActiveTab(5, { reject: false });
  }

  handleTabLikeButton() {
    ons.notification.alert('Hello, world!');
  }
/*

            <div className="balance-button">
              <input type="radio" style={{display: "none"}} id="balanceTab" />
              <button className="tabbar__button" onClick={this.handleClickBalanceTab.bind(this)}>
                <div className="tabbar__icon">
                  <ons-icon icon="fa-coins" />
                </div>
                <div className="tabbar__label">残高</div>
              </button>
            </div>


*/
  render() {
    return (
      <Page renderToolbar={() => 
        <Toolbar modifier="noshadow header">
          <div className="center toolbar-container">
            <TabLikeButton
              ref="balanceTab"
              className="balance-button"
              icon="fa-coins"
              label="残高"
              onClick={this.handleClickBalanceTab.bind(this)}
            />


            <div className="balance">
              <span className="balance-amount">12,300</span>
              <span className="balance-ticker">DNGR</span>
            </div>

            <div className="partition" />

            <div className="wallet-name">Ichroh</div>
 
            <div className="wallet-button">
              <input type="radio" style={{display: "none"}} id="walletTab" />
              <button className="tabbar__button" onClick={this.handleClickWalletTab.bind(this)}>
                <div className="tabbar__icon">
                  <ons-icon icon="fa-wallet"></ons-icon>
                </div>
                <div className="tabbar__label">ウォレット</div>
              </button>
            </div>
          </div>
        </Toolbar>
      }>
        <Tabbar
          ref="tabbar"
          modifier="footer"
          initialIndex={0}
          swipeable={true}
          index={this.state.index}
          visible={true}
          onPreChange={ev => {
/*            document.getElementById("balanceTab").checked = ev.activeIndex === 4;*/
///            this.refs.balanceTabButton.setActive(ev.activeIndex === 4);
            console.log(this.refs);
            document.getElementById("walletTab").checked = ev.activeIndex === 5;
          }}
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
            {
              content: <SendPage title="Balance" key="Balance" active={activeIndex === 4} tabbar={tabbar} />,
              tab: <Tab label="残高" key="SendTabaaaaaaaaaaa" icon="fa-coins" className="hidden-tab" />
            },
            {
              content: <SendPage title="Senddddddd" key="Senddddddddddddddd" active={activeIndex === 5} tabbar={tabbar} />,
              tab: <Tab label="ウォレット" key="SendTabaaaaaaaaaaaaa" icon="fa-wallet" className="hidden-tab" />
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
