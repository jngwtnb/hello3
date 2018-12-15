import React from 'react';
import QRCode from "qrcode.react";
import ons from 'onsenui';
import {Page, Button, Icon, Input, Modal} from 'react-onsenui';

import WalletsContext from '../contexts/wallets';

export default class ReceivePage extends React.Component {
  constructor(...args){
    super(...args);

    this.state = {
      nfcDisabled: false,
      isOpen: false,
      dialogMessage: "",
      amount: "555",
//      uri: "",
      modalOpened: false,
      wallet: this.props.wallet,
    };

    this.generateUri = this.generateUri.bind(this);

//    this.state.uri  = this.props.wallet
//                    ? this.generateUri(this.state.amount, this.props.wallet.deviceId)
//                    : "";
//console.log(this.state.uri);
  }

  generateUri(amount, deviceId) {
    return `hello3://iizk.jp/?amount=${amount}&recipientId=${deviceId}`;
  }

  handleCancel() {
    console.log(this.props);
    this.setState({
      nfcDisabled: false,
      isOpen: false,
    });
  }

  handleNfc() {
    if (!window.cordova || !window.hce || !window.ndef) {
      ons.notification.toast('Could not enable HCE', { timeout: 1000, animation: 'fall' });
      return;
    }

    const records = [
        window.ndef.textRecord(this.state.wallet.deviceId),
        window.ndef.textRecord(this.state.amount),
    ];
    const message = window.ndef.encodeMessage(records);
    window.hce.setNdefMessage(message);

    window.hce.registerDeactivatedCallback(reason => {
      console.log('Deactivated ' + reason);
//      window.hce.registerCommandCallback(null);
      this.setState({modalOpened: false});
    });

//    ons.notification.toast('Enable HCE', { timeout: 1000, animation: 'fall' });
    this.setState({modalOpened: true});
  }

  render() {
    return (
      <Page>
        <div className="tab-like-bar">
          <Button modifier="quiet" className="nfc-icon" disabled={this.state.nfcDisabled} onClick={this.handleNfc.bind(this)} />
        </div>

        <div className="tab-like-bar__content">
          <div className="receive-container">
            <WalletsContext.Consumer>
              {([wallets, index]) => 
                wallets[index] &&
                <div className="receive-address">
                  <Input modifier="underbar" placeholder="" readOnly={true} type={"text"} inputId="input-address" value={wallets[index].address}/>
                  <Button modifier="quiet" onClick={() => {
                    document.getElementById("input-address").select();
                    document.execCommand("copy");
                    window.getSelection().removeAllRanges();
                    ons.notification.toast('クリップボードにコピーしました', { timeout: 1000, animation: 'fall' });
                  }}>
                    <Icon icon="fa-clipboard" size={20} style={{color: "black"}}/>
                  </Button>
                </div>
              }
            </WalletsContext.Consumer>
{/*
            <WalletsContext.Consumer>
              {([wallets, index]) => 
                wallets[index] && <QRCode value={`hello3://iizk.jp/?amount=${this.state.amount}&recipientId=${wallets[index].address}`} renderAs="svg" className="receive-box" />
              }
            </WalletsContext.Consumer>
            <QRCode value={this.state.uri} renderAs="svg" className="receive-box" />
*/}
            <QRCode value={`hello3://iizk.jp/?amount=${this.state.amount}&recipientId=${this.state.wallet.address}`} renderAs="svg" className="receive-box" />

            <div className="receive-label">入金予定金額を入力してください:</div>
            <div className="receive-form">
              <WalletsContext.Consumer>{([wallets, index]) => 
                <Input
                  modifier="underbar"
                  placeholder=""
                  defaultValue={this.state.amount}
                  inputId="receive-amount"
                  onChange={ev => {
                    if (wallets[index]) {
                      this.setState({
                        amount: ev.srcElement.value,
                        uri: this.generateUri(ev.srcElement.value, wallets[index].deviceId),
                      });
                    }
                  }}
                  type={"number"}
                  inputmode={"numeric"}
                />
              }</WalletsContext.Consumer>
            </div>
          </div>
        </div>

        <Modal
          isOpen={this.state.modalOpened}
          onDeviceBackButton={() => {
            this.setState({modalOpened: false});
          }}
          onPreHide={() => {}}
        >
          <div>NFC 待機中...</div>
          <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
          <Button modifier="quiet outline" style={{color: "white"}} onClick={() => this.setState({modalOpened: false})}>キャンセル</Button>
        </Modal>

      </Page>
    )
  }
}