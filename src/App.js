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

import WalletsContext from './contexts/wallets';
import SettingContext from './contexts/setting';

const BALANCE_TAB_INDEX = 0;
const WALLET_TAB_INDEX = 5;

class MainPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tabIndex: 1,
      selectedWallet: {},
      selectedWalletIndex: 0,
      wallets: [],
      setting: {
        debug: false,
      },
    };
  }

  componentWillMount() {
    let wallets = JSON.parse(localStorage.getItem("wallets"));
    if (wallets === null) {
      wallets = [
        {label: "suzuki",         ticker: "DNGR", deviceId: Util.generateDeviceId()},
        {label: "Ichirooooooh's", ticker: "DNGR", deviceId: Util.generateRandomDeviceId()},
        {label: "鈴木一郎の財布",  ticker: "BTC" , deviceId: Util.generateRandomDeviceId()},
        {label: "suzuki",         ticker: "BTC",  deviceId: Util.generateRandomDeviceId()},
      ];

      localStorage.setItem("wallets", JSON.stringify(wallets))
    }

    let index = Number(localStorage.getItem("wallet-index"));
    if (index === null) {
      index = 0;
      localStorage.setItem("wallet-index", index);
    }
console.log(wallets, index);

    this.setState({
      selectedWallet: wallets[index],
      selectedWalletIndex: index,
      wallets: wallets,
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.tabIndex === this.state.tabIndex) {
      if (nextState.selectedWalletIndex === this.state.selectedWalletIndex) {
        return false;
      }
    }
    return true;
  }

  handleClickBalanceTab() {
    if (this.state.tabIndex !== BALANCE_TAB_INDEX) {
//    this.refs.tabbar._tabbar.setActiveTab(0, { reject: false });
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
    if (index !== this.state.selectedWalletIndex) {
      this.setState({
        selectedWallet: this.state.wallets[index],
        selectedWalletIndex: index,
      });
//      localStorage.setItem("wallet-index", index);
    }
  }

  handleChangeSetting(data) {
    this.setState({setting: data});
  }

  handleCreateWallet(label, ticker) {
    console.log("handleCreateWallet", label, ticker);
    let wallets = this.state.wallets;

    let newIndex = wallets.length === 0 ? 0 : this.state.selectedWalletIndex;
    wallets.push({label: label, ticker: ticker.toUpperCase(), deviceId: Util.generateRandomDeviceId()});

    this.setState({
      selectedWallet: wallets[newIndex],
      selectedWalletIndex: newIndex,
      wallets: wallets,
    });
  }

  handleDeleteWallet(index) {
    console.log("handleDeleteWallet", index);
    let newWallets = this.state.wallets;
    if(newWallets.length !== 0) {
      newWallets.splice(index, 1);
    }

    let newIndex = this.state.selectedWalletIndex === index ? -1
                 : this.state.selectedWalletIndex > index   ? this.state.selectedWalletIndex - 1
                 : this.state.selectedWalletIndex;

    if (!newWallets[newIndex]) newIndex = -1;

    this.setState({
      selectedWallet: newWallets[newIndex] || {},
      selectedWalletIndex: newIndex,
      wallets: newWallets,
    }, () => {
      this.forceUpdate();
    });
  }


  render() {
    const tabbar =
      <WalletsContext.Provider value={[this.state.wallets, this.state.selectedWalletIndex]}>
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
                content: <HistoryPage title="History" key="history-page" active={activeIndex === 2} tabbar={tabbar} />,
                tab: <Tab key="history-tab" className="history-icon" />
              },
              {
                content: <SettingPage title="Setting" key="setting-page" active={activeIndex === 3} tabbar={tabbar} initialSetting={this.state.setting} onChange={this.handleChangeSetting.bind(this)} />,
                tab: <Tab key="setting-tab" className="setting-icon" />
              },
              {
                content: <WalletPage title="Wallet" key="wallet-page" active={activeIndex === 5} tabbar={tabbar} initialIndex={this.state.selectedWalletIndex} onSelect={this.handleSelectWallet.bind(this)} onCreate={this.handleCreateWallet.bind(this)} onDelete={this.handleDeleteWallet.bind(this)} />,
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
              Object.keys(this.state.selectedWallet).length ?
              <div className="balance">
                <span className="balance-amount">12,300</span>
                <span className="balance-ticker">{this.state.selectedWallet.ticker}</span>
              </div>
              : null
            }

            <div className="partition" />

            {
              Object.keys(this.state.selectedWallet).length ?
                <div className="wallet">
                  <div className="wallet-name">{this.state.selectedWallet.label}</div>
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
