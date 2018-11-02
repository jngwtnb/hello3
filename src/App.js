import React from 'react';

import '../node_modules/onsenui/css/onsenui.css';
import '../node_modules/onsenui/css/onsen-css-components.css';
import '../node_modules/@fortawesome/fontawesome';
import '../node_modules/@fortawesome/fontawesome-free-solid';
import './App.css';
import './css/';

import ons from 'onsenui';
import {Tabbar, Navigator, Page, Button, Toolbar, Tab, Input, SpeedDial, SpeedDialItem, Fab, Icon} from 'react-onsenui';

import BalancePage from './components/BalancePage';
import SendPage from './components/SendPage';
import ReceivePage from './components/ReceivePage';
import HistoryPage from './components/HistoryPage';
import SettingPage from './components/SettingPage';
import WalletPage from './components/WalletPage';
import TabLikeButton from './components/TabLikeButton';
import Util from './components/Util';

import dngr from './images/dongri_logo.png';

import WalletsContext from './contexts/wallets';
import SettingContext from './contexts/setting';

const BALANCE_TAB_INDEX = 0;
const HISTORY_TAB_INDEX = 3;
const WALLET_TAB_INDEX = 5;

class MainPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tabIndex: 1,
      currentWallet: {},
      currentWalletIndex: 0,
      wallets: [],
      setting: {
        debugModeEnabled: false,
      },
    };

    this.historyRef = React.createRef();
    this.sendRef = React.createRef();
  }

  componentWillMount() {
    let wallets = JSON.parse(localStorage.getItem("wallets"));
    if (wallets === null) {
      wallets = [];
      localStorage.setItem("wallets", JSON.stringify(wallets))
    }

    let indexString = localStorage.getItem("wallet-index");
    let index;
    if (indexString === null) {
      index = wallets.length > 0 ? 0 : -1;
      localStorage.setItem("wallet-index", index);
    } else {
      index = Number(indexString);
    }

    this.setState({
      currentWallet: wallets[index] || {},
      currentWalletIndex: index,
      wallets: wallets,
    });
  }

  handleClickBalanceTab() {
    if (this.state.tabIndex !== BALANCE_TAB_INDEX) {
      this.setState({tabIndex: BALANCE_TAB_INDEX});
    }
  }

  handleClickWalletTab() {
    if (this.state.tabIndex !== WALLET_TAB_INDEX) {
//    this.refs.tabbar._tabbar.setActiveTab(5, { reject: false });
      this.setState({tabIndex: WALLET_TAB_INDEX});
    }
  }

  handleSelectWallet(index) {
    if (index !== this.state.currentWalletIndex) {
      this.setState({
        currentWallet: this.state.wallets[index],
        currentWalletIndex: index,
      }, () => {
        localStorage.setItem("wallet-index", index);
        this.historyRef.current.handleLoad(this.state.currentWallet);
      });
    }
  }

  handleChangeSetting(data) {
    this.setState({setting: data});
  }

  handleCreateWallet(label, ticker, deviceId, deviceIdRandomizes) {

    if (deviceId === "") {
      deviceId = deviceIdRandomizes
               ? Util.generateRandomDeviceId()
               : Util.generateDeviceId();
    }

    fetch(`http://apps.cowry.co.jp/Monet2/api/wallet/?deviceId=${deviceId}`)
      .then(response => {
        if (response.ok) {
         return response.json();
        } else {
          throw new Error();
        }
      })
      .then(json => {
        console.log(json);
        let wallets = this.state.wallets;
        wallets.push({
          label: label,
          ticker: ticker.toUpperCase(),
          deviceId: deviceId,
          address: json.id,
          amount: parseFloat(json.amount),
        });

        let newIndex = wallets.length === 1 ? 0 : this.state.currentWalletIndex;

        this.setState({
          currentWallet: wallets[newIndex] || {},
          currentWalletIndex: newIndex,
          wallets: wallets,
        }, () => {
          localStorage.setItem("wallet-index", newIndex);
          localStorage.setItem("wallets", JSON.stringify(wallets))
        });
      })
      .catch(
        error => console.log(error)
      );
  }

  handleDeleteWallet(index) {
    let newWallets = this.state.wallets;
    if(newWallets.length !== 0) {
      newWallets.splice(index, 1);
    }

    let newIndex = this.state.currentWalletIndex === index ? -1
                 : this.state.currentWalletIndex > index   ? this.state.currentWalletIndex - 1
                 : this.state.currentWalletIndex;

    if (!newWallets[newIndex]) newIndex = -1;

    this.setState({
      currentWallet: newWallets[newIndex] || {},
      currentWalletIndex: newIndex,
      wallets: newWallets,
    }, () => {
      localStorage.setItem("wallet-index", newIndex);
      localStorage.setItem("wallets", JSON.stringify(newWallets))
      this.forceUpdate();
    });
  }

  updateCurrentWallet() {
    const deviceId = this.state.currentWallet.deviceId;
    if (deviceId === null) return;

console.log("before FETCH");
    fetch(`http://apps.cowry.co.jp/Monet2/api/wallet/?deviceId=${this.state.currentWallet.deviceId}`)
      .then(response => {
        console.log(response);
        if (response.ok) {
         return response.json();
        } else {
          throw new Error();
        }
      })
      .then(json => {
        console.log(json);
        let wallet = this.state.currentWallet;
        wallet.amount = parseFloat(json.amount);

        let wallets = this.state.wallets;
        wallets[this.state.currentWalletIndex] = wallet;

        this.setState({
          currentWallet: wallet,
          wallets: wallets,
        }, () => {
          localStorage.setItem("wallets", JSON.stringify(wallets))
        });
      })
      .catch(
        error => console.log(error)
      );
console.log("after FETCH");
  }

  handleSend(status, text) {
    if (this.state.setting.debugModeEnabled) {
      this.updateCurrentWallet();
      ons.notification.alert({title: status, message: text});
    } else {
      this.setState({tabIndex: HISTORY_TAB_INDEX});
      this.historyRef.current.handleLoad(this.state.currentWallet);
    }
  }

  handleHistoryLoad() {
    this.updateCurrentWallet();
  }

  handleDebugCharge() {
      const wallet = {
        address: "WmjedSdfqYUkNEkKBgsNSrCUEZCYqkqNXd",
        deviceId: "13CZLXCy6MD2L4iwEeeyXTB8pDAmdQyhD5",
        ticker: "DNGR",
      };

      const params = {
        amount: 1000,
        recipientId: this.state.currentWallet.address,
      };

      this.sendRef.current.handleSend(wallet, params);
  }

  render() {
    const tabbar =
      <WalletsContext.Provider value={[this.state.wallets, this.state.currentWalletIndex]}>
        <SettingContext.Provider value={this.state.setting}>
          <Tabbar
            modifier="footer"
            index={this.state.tabIndex}
            swipeable={true}
            onPostChange={ev => this.setState({tabIndex: ev.activeIndex})}
            renderTabs={(activeIndex, tabbar) => [
              {
                content: <BalancePage title="Balance" key="balance-page" active={activeIndex === 4} tabbar={tabbar} />,
                tab: <Tab label="残高" key="balance-tab" icon="fa-coins" className="hidden-tab" />
              },
              {
                content: <SendPage title="Send" key="send-page" active={activeIndex === 0} tabbar={tabbar} ref={this.sendRef} onSend={this.handleSend.bind(this)} />,
                tab: <Tab key="send-tab" className="send-icon" />
              },
              {
                content: <ReceivePage title="Receive" key="receive-page" active={activeIndex === 1} tabbar={tabbar} />,
                tab: <Tab key="receive-tab" className="receive-icon" />
              },
              {
                content: <HistoryPage title="History" key="history-page" active={activeIndex === 2} tabbar={tabbar} ref={this.historyRef} onLoad={this.handleHistoryLoad.bind(this)} />,
                tab: <Tab key="history-tab" className="history-icon" />
              },
              {
                content: <SettingPage title="Setting" key="setting-page" active={activeIndex === 3} tabbar={tabbar} initialSetting={this.state.setting} onChange={this.handleChangeSetting.bind(this)} onCharge={this.handleDebugCharge.bind(this)} />,
                tab: <Tab key="setting-tab" className="setting-icon" />
              },
              {
                content: <WalletPage title="Wallet" key="wallet-page" active={activeIndex === 5} tabbar={tabbar} initialIndex={this.state.currentWalletIndex} onSelect={this.handleSelectWallet.bind(this)} onCreate={this.handleCreateWallet.bind(this)} onDelete={this.handleDeleteWallet.bind(this)} />,
                tab: <Tab key="wallet-tab" label="ウォレット" icon="fa-wallet" className="hidden-tab" />
              },
            ]}
          />;
        </SettingContext.Provider>
      </WalletsContext.Provider>

    return (
      <Page renderToolbar={() => 
        <Toolbar modifier="noshadow header">
          <div className="toolbar-container">
            <TabLikeButton
              className="balance-button balance-icon"
              active={this.state.tabIndex === BALANCE_TAB_INDEX}
              onClick={this.handleClickBalanceTab.bind(this)}
            />

            {
              Object.keys(this.state.currentWallet).length ?
              <div className="balance">
                <span className="balance-amount">{this.state.currentWallet.amount}.00000001</span>
                <span className="balance-ticker">{this.state.currentWallet.ticker}</span>
              </div>
              : null
            }

            <div className="partition" />

            {
              Object.keys(this.state.currentWallet).length ?
                <div className="wallet">
                  <div className="wallet-name">{this.state.currentWallet.label}</div>
                </div>
                : null
            }

            <TabLikeButton
              className="wallet-button wallet-icon"
              active={this.state.tabIndex === WALLET_TAB_INDEX}
              onClick={this.handleClickWalletTab.bind(this)}
            />
          </div>
        </Toolbar>
      }>
        {tabbar}
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

        <SpeedDial position="right bottom" direction="up">
          <Fab>
            <Icon icon="fa-cog"></Icon>
          </Fab>
          <SpeedDialItem onClick={() => {
            ons.notification.confirm({
              title: "データを初期化します",
              message: "よろしいですか？",
              buttonLabels: ["はい", "いいえ"],
            }).then(index => {
              if (index === 0) {
                ons.notification.confirm({
                  title: "",
                  message: "本当に？",
                  buttonLabels: ["はい", "いいえ"],
                }).then(index => {
                  if (index === 0) {
                    localStorage.clear();
                  }
                });
              }
            });
          }}><Icon icon="fa-trash"></Icon></SpeedDialItem>
        </SpeedDial>
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
