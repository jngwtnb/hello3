import React from 'react';
import QRCode from "qrcode.react";
import ons from 'onsenui';
import {Page, Button, AlertDialog, Input} from 'react-onsenui';

export default class ReceivePage extends React.Component {
  constructor(...args){
    super(...args);

    this.state = {
      nfcDisabled: false,
      isOpen: false,
      dialogMessage: "",
      uri: "",
    };
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
            <Input modifier="underbar" placeholder="aaaaaaaaaaaa" type={"text"} value=""/>

            <QRCode value={this.state.uri} className="receive-box" />

            <div className="receive-label">入金予定金額を入力してください:</div>
            <div className="receive-form">
              <Input
                modifier="underbar"
                placeholder=""
                type={"text"}
                inputId="receive-amount"
                onChange={() => {
                  this.setState({
                    uri: `money://atmk.jp/amount=${document.getElementById("receive-amount").value}`,
                  });
                }}
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