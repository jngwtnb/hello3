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

  render() {
    return (
      <Page>
        <div className="tab-like-bar">
          <Button modifier="quiet" className="nfc-icon" disabled={this.state.nfcDisabled} onClick={() => {
            this.setState({
              nfcDisabled: true,
              isOpen: true,
              dialogMessage: "nfc",
            });
          }} />
        </div>

        <div className="tab-like-bar__content">
          <div className="receive-container">
            <WalletsContext.Consumer>
              {([wallets, index]) => 
                wallets[index] &&
                <span className="receive-form">
                  <Input modifier="underbar" placeholder="" readOnly={true} type={"text"} inputId="input-address" value={wallets[index].address}/>
                  <Button modifier="" onClick={() => {
                    document.getElementById("input-address").select();
                    document.execCommand("copy");
                    ons.notification.toast('クリップボードにコピーしました', { timeout: 1000, animation: 'fall' });
                  }}>
                    <Icon icon="fa-clipboard"/>
                  </Button>
                </span>
              }
            </WalletsContext.Consumer>

            <WalletsContext.Consumer>
              {([wallets, index]) => 
                wallets[index] && <QRCode value={`hello3://iizk.jp/?amount=${this.state.amount}&recipientId=${wallets[index].address}`} renderAs="svg" className="receive-box" />
              }
            </WalletsContext.Consumer>

            <div className="receive-label">入金予定金額を入力してください:</div>
            <div className="receive-form">
              <Input
                modifier="underbar"
                placeholder=""
                defaultValue={this.state.amount}
                inputId="receive-amount"
                onChange={ev => {
                  this.setState({
                    amount: ev.srcElement.value,
                    uri: this.generateUri(ev.srcElement.value, this.state.wallet.deviceId),
                  });
                }}
                type={"number"}
                inputmode={"numeric"}
              />
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