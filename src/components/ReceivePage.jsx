import React from 'react';
import QRCode from "qrcode.react";
import ons from 'onsenui';
import {Page, Button, AlertDialog, Input} from 'react-onsenui';
import jsSHA from 'jssha';

export default class ReceivePage extends React.Component {
  constructor(...args){
    super(...args);

    console.log(window.device);

    this.state = {
      walletAddress: "",
      nfcDisabled: false,
      isOpen: false,
      dialogMessage: "",
      amount: "555",
    };

    if (window.cordova && window.device) {
      var shaObj = new jsSHA("SHA-256", "TEXT");
      shaObj.update(window.device.uuid + "arcturus");
      var sha256digest = shaObj.getHash("HEX");
      this.state.walletAddress = sha256digest.substring(0, 20);
    }

    this.generateUri = this.generateUri.bind(this);

    this.state.uri = this.generateUri(this.state.amount, this.state.walletAddress);
    console.log(this.state.url);

  }

  generateUri(amount, address) {
    return `hello3://iizk.jp/?amount=${amount}&recipientId=${address}`;
  }

  handleClick() {
    ons.notification.alert('Hello, world!');
  }

  handleCancel() {
    this.setState({
      nfcDisabled: false,
      isOpen: false,
    });
  }

  render() {
    return (
      <Page >
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
            <div className="receive-form">
              <Input modifier="underbar" placeholder="" type={"text"} value={this.state.walletAddress}/>
            </div>

            <QRCode value={this.state.uri} renderAs="svg" className="receive-box" />

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