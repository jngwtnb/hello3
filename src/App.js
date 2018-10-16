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

import dngr from './images/dongri_logo.png';

import WalletContext from './contexts/wallet';

class MainPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tabIndex: 1,
      activeBalanceTab: false,
      activeWalletTab: false,
      wallet: {},
      walletAddress: "",
    }
  }

  handleClickBalanceTab() {
    if (this.state.tabIndex !== 0) {
      this.refs.tabbar._tabbar.setActiveTab(0, { reject: false });
    }
  }

  handleClickWalletTab() {
    if (this.state.tabIndex !== 5) {
      this.refs.tabbar._tabbar.setActiveTab(5, { reject: false });
    }
  }

  handleSelect(data) {
    this.setState({
      wallet: data,
    });
  }

  render() {
    const tabbar =
      <WalletContext.Provider value={this.state.wallet}>
        <Tabbar
          ref="tabbar"
          modifier="footer"
          index={1}
          swipeable={true}
          onPreChange={ev => {
            this.setState({
              tabIndex: ev.activeIndex,
              activeBalanceTab: ev.activeIndex === 0,
              activeWalletTab: ev.activeIndex === 5,
            });
          }}
//          wallet={this.state.wallet}
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
              content: <SettingPage title="Setting" key="setting-page" active={activeIndex === 3} tabbar={tabbar} />,
              tab: <Tab key="setting-tab" className="setting-icon" />
            },
            {
              content: <WalletPage title="Wallet" key="wallet-page" active={activeIndex === 5} tabbar={tabbar} onSelect={this.handleSelect.bind(this)} />,
              tab: <Tab key="wallet-tab" label="ウォレット" icon="fa-wallet" className="hidden-tab" />
            },
          ]}
        />;
      </WalletContext.Provider>

    return (
      <Page renderToolbar={() => 
        <Toolbar modifier="noshadow header">
          <div className="toolbar-container">
            <TabLikeButton
              className="balance-button balance-icon"
              active={this.state.activeBalanceTab}
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
              active={this.state.activeWalletTab}
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
