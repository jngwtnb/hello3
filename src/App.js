import React from 'react';

import '../node_modules/onsenui/css/onsenui.css';
import '../node_modules/onsenui/css/onsen-css-components.css';
import '../node_modules/@fortawesome/fontawesome';
import '../node_modules/@fortawesome/fontawesome-free-solid';
import './App.css';
import './css/';

import ons from 'onsenui';
import {Tabbar, Navigator, Page, Button, Toolbar, Tab, Input} from 'react-onsenui';

import BalancePage from './components/BalancePage';
import SendPage from './components/SendPage';
import ReceivePage from './components/ReceivePage';
import HistoryPage from './components/HistoryPage';
import SettingPage from './components/SettingPage';
import WalletPage from './components/WalletPage';
import TabLikeButton from './components/TabLikeButton';
import Util from './components/Util';

import dngr from './images/dongri_logo.png';

import WalletContext from './contexts/wallet';
import SettingContext from './contexts/setting';

class MainPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tabIndex: 1,
      wallet: {},
      setting: {
        debug: false,
      },
    };

    this.BALANCE_TAB_INDEX = 0;
    this.WALLET_TAB_INDEX = 5;
  }

  componentWillMount() {
localStorage.clear();
    let wallets = JSON.parse(localStorage.getItem("wallets"));

    if (wallets === null) {
      wallets = {
        index: 0,
        data: [
          {label: "suzuki",         ticker: "DNGR", address: Util.generateAddress()},
          {label: "Ichirooooooh's", ticker: "DNGR", address: Util.generateRandomAddress()},
          {label: "鈴木一郎の財布",  ticker: "BTC" , address: Util.generateRandomAddress()},
          {label: "suzuki",         ticker: "BTC",  address: Util.generateRandomAddress()},
        ],
      };

      localStorage.setItem("wallets", JSON.stringify(wallets))
    }

    this.setState({wallets: wallets});
  }




  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.tabIndex === this.state.tabIndex) {
      return false;
    }

    return true;
  }

  handleClickBalanceTab() {
    if (this.state.tabIndex !== this.BALANCE_TAB_INDEX) {
//    this.refs.tabbar._tabbar.setActiveTab(0, { reject: false });
      this.setState({tabIndex: this.BALANCE_TAB_INDEX});
    }
  }

  handleClickWalletTab() {
    if (this.state.tabIndex !== this.WALLET_TAB_INDEX) {
//    this.refs.tabbar._tabbar.setActiveTab(5, { reject: false });
      this.setState({tabIndex: this.WALLET_TAB_INDEX});
    }
  }

  handleChangeWallet(data) {
    console.log("App handleChangeWallet");
//    this.setState({wallet: data});
  }

  handleChangeSetting(data) {
    this.setState({setting: data});
  }

  render() {
    const tabbar =
      <WalletContext.Provider value={this.state.wallet}>
        <SettingContext.Provider value={this.state.setting}>
          <Tabbar
            ref="tabbar"
            modifier="footer"
            index={this.state.tabIndex}
            swipeable={true}
            onPreChange={ev => this.setState({tabIndex: ev.activeIndex})}
            renderTabs={(activeIndex, tabbar) => [
              {
                content: <BalancePage title="Balance" key="balance-page" active={activeIndex === 4} tabbar={tabbar} />,
                tab: <Tab label="残高" key="balance-tab" icon="fa-coins" className="hidden-tab" />
              },
              {
                content: <SendPage title="Send" key="send-page" active={activeIndex === 0} tabbar={tabbar} />,
                tab: <Tab key="send-tab" className="send-icon" />
              },
              {
                content: <ReceivePage title="Receive" key="receive-page" active={activeIndex === 1} tabbar={tabbar} />,
                tab: <Tab key="receive-tab" className="receive-icon" />
              },
              {
                content: 
                  <WalletContext.Consumer key="history-consumer">
                    {wallet => <HistoryPage title="History" key="history-page" active={activeIndex === 2} tabbar={tabbar} wallet={wallet} />}
                  </WalletContext.Consumer>,
                tab: <Tab key="history-tab" className="history-icon" />
              },
              {
                content: <SettingPage title="Setting" key="setting-page" active={activeIndex === 3} tabbar={tabbar} initialSetting={this.state.setting} onChange={this.handleChangeSetting.bind(this)} />,
                tab: <Tab key="setting-tab" className="setting-icon" />
              },
              {
                content: <WalletPage title="Wallet" key="wallet-page" active={activeIndex === 5} tabbar={tabbar} onSelect={this.handleChangeWallet.bind(this)} />,
                tab: <Tab key="wallet-tab" label="ウォレット" icon="fa-wallet" className="hidden-tab" />
              },
            ]}
          />;
        </SettingContext.Provider>
      </WalletContext.Provider>

    return (
      <Page renderToolbar={() => 
        <Toolbar modifier="noshadow header">
          <div className="toolbar-container">
            <TabLikeButton
              className="balance-button balance-icon"
              active={this.state.tabIndex === this.BALANCE_TAB_INDEX}
              onClick={this.handleClickBalanceTab.bind(this)}
            />

            <div className="balance">
              <span className="balance-amount">12,300</span>
              <span className="balance-ticker">{this.state.wallet.ticker}</span>
            </div>

            <div className="partition" />

            <div className="wallet">
              <div className="wallet-name">{this.state.wallet.label}</div>
            </div>

            <TabLikeButton
              className="wallet-button wallet-icon"
              active={this.state.tabIndex === this.WALLET_TAB_INDEX}
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
