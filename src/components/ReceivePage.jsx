import React from 'react';
import QRCode from "qrcode.react";
import ons from 'onsenui';
import {Page, Button, Icon, AlertDialog, Input} from 'react-onsenui';

import WalletsContext from '../contexts/wallets';

export default class ReceivePage extends React.Component {
  constructor(...args){
    super(...args);

    this.state = {
      nfcDisabled: false,
      isOpen: false,
      dialogMessage: "",
      amount: "555",
      uri: "",
    };

    this.generateUri = this.generateUri.bind(this);
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
        window.ndef.uriRecord(this.state.uri),
    ];
    const message = window.ndef.encodeMessage(records);
    window.hce.setNdefMessage(message);

    window.hce.registerDeactivatedCallback(reason => {
      console.log('Deactivated ' + reason);
    }, reqson => {console.log(reqson)});

    ons.notification.toast('Enable HCE', { timeout: 1000, animation: 'fall' });
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

            <WalletsContext.Consumer>
              {([wallets, index]) => 
                wallets[index] && <QRCode value={`hello3://iizk.jp/?amount=${this.state.amount}&recipientId=${wallets[index].address}`} renderAs="svg" className="receive-box" />
              }
            </WalletsContext.Consumer>

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

        <AlertDialog isOpen={this.state.isOpen} onCancel={this.handleCancel.bind(this)} isCancelable={false}>
          <div className="alert-dialog-title"></div>
          <div className="alert-dialog-content">
            {this.state.dialogMessage}
          </div>
          <div className="alert-dialog-footer">
            <Button onClick={this.handleCancel.bind(this)} className="alert-dialog-button">
              Ok
            </Button>
          </div>
        </AlertDialog>

      </Page>
    )
  }
}