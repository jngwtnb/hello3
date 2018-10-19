import React from 'react';
import QRCode from "qrcode.react";
import ons from 'onsenui';
import {Page, Button, AlertDialog, Input} from 'react-onsenui';

import WalletContext from '../contexts/wallet';

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

  generateUri(amount, address) {
    return `hello3://iizk.jp/?amount=${amount}&recipientId=${address}`;
  }

  handleCancel() {
    console.log(this.props);
    this.setState({
      nfcDisabled: false,
      isOpen: false,
    });
  }

  componentWillReceiveProps(nextProps) {
    console.log("ReceivePage componentWillReceiveProps");
    console.log(nextProps);
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

{
//          <QRCode value={this.state.uri} renderAs="svg" className="receive-box" />
}

            <WalletContext.Consumer>
              {wallet => 
                <div className="receive-form">
                  <Input modifier="underbar" placeholder="" readOnly={true} type={"text"} value={wallet.address}/>
                </div>
              }
            </WalletContext.Consumer>

            <WalletContext.Consumer>
              {wallet => 
               <QRCode value={`hello3://iizk.jp/?amount=${this.state.amount}&recipientId=${wallet.address}`} renderAs="svg" className="receive-box" />
              }
            </WalletContext.Consumer>

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
                    uri: this.generateUri(ev.srcElement.value, this.state.walletAddress),
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