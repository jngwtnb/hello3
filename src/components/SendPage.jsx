import React from 'react';
import {AlertDialog, Page, Button, Input} from 'react-onsenui';

import '../css/sendpage.css';
import '../css/tablikebar.css';

export default class SendPage extends React.Component {
  constructor(...args){
    super(...args);

    this.state = {
      nfcDisabled: false,
      qrDisabled: false,
      isOpen: false,
      dialogMessage: "",
    };
  }

  
  qr() {
    console.log(window.cordova);
/*
  console.log(window);
  console.log(window.cordova);
  console.log(window.cordova.plugins);
   */

    if (window.cordova) {
      window.plugins.barcodeScanner.scan(
        function (result) {
            alert("We got a barcode\n" +
                  "Result: " + result.text + "\n" +
                  "Format: " + result.format + "\n" +
                  "Cancelled: " + result.cancelled);
        }, 
        function (error) {
            alert("Scanning failed: " + error);
        }
      );  
    }


  }

  handleCancel() {
    this.setState({
      nfcDisabled: false,
      qrDisabled: false,
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
          <Button modifier="quiet" className="qr-icon" disabled={this.state.qrDisabled} onClick={() => {
            this.setState({
              qrDisabled: true,
              isOpen: true,
              dialogMessage: "ｑ！！",
            });
          }} />
        </div>

        <div className="tab-like-bar__content">
          <div className="send-form-container">
            <div className="send-form-box" />
            <div className="send-form-label">送金に必要な項目を入力してください:</div>
            <div className="send-form">
              <Input modifier="underbar" placeholder={'メールアドレス'} type={"text"} value="xxxx-xxxx"/>
              <Input modifier="underbar" placeholder={'パスワード'} type={"text"}  value="4646" />
              <Input modifier="underbar" placeholder={'メッセージ(請求IDなど)'} type={"text"} />
              <Button modifier="send-button quiet" onClick={this.qr.bind(this)}>送信</Button>
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
