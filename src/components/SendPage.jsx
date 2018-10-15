import React from 'react';
import {AlertDialog, Page, Button, Input} from 'react-onsenui';
import ons from 'onsenui';

const PROTOCOL = "hello3:";

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

  scanQrCodeByCamera() {
    let data = "";

    if (window.cordova) {
      window.cordova.plugins.barcodeScanner.scan(
        function (result) {
          data = result.cancelled ? "" : result.text;
        },
        function (error) {
          alert("Scanning failed: " + error);
        },
        {
          formats: "QR_CODE",
        },
      );  
    } else {
      var amount = Math.floor(Math.random()*1000);
      console.log("RandomGeneratedAmount:", amount);
      data = `hello3://iizk.jp/?amount=${amount}&recipientId=${this.props.wallet.address}`;
    }

    return data;
  }

  handleSend() {

  }

  handleQr() {
    console.log(this.props);

    let uriString = this.scanQrCodeByCamera();
    console.log(uriString);
    let uri = new URL(uriString);

    if (uri.protocol === PROTOCOL) {
      let amount = uri.searchParams.get("amount");
      let recipientId = uri.searchParams.get("recipientId");
      console.log(amount, recipientId);

      let messageHTML = `
          <div class="send-dialog-content">
            <table>
              <tbody>
                <tr><td class="name">amount</td><td>: </td><td>${amount}</td></tr>
                <tr><td class="name">recipientId</td><td>: </td><td>${recipientId}</td></tr>
              </tbody>
            </table>
          </div>
          送信して構いませんか？
          `;

      ons.notification.confirm({
        title: "",
        messageHTML: messageHTML,
        buttonLabels: ["いいえ", "はい"],
        callback: index => {
          if(index === 1) {
            let deviceId = "";
            let toAddress = recipientId;
            let requestId = "";

          }
        },
      })
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
          <Button style={{display: "none"}} modifier="quiet" className="qr-icon" disabled={this.state.qrDisabled} onClick={() => {
            this.setState({
              qrDisabled: true,
              isOpen: true,
              dialogMessage: "ｑ！！",
            });
          }} />
          <Button modifier="quiet" className="qr-icon" disabled={this.state.qrDisabled} onClick={this.handleQr.bind(this)} />
        </div>

        <div className="tab-like-bar__content">
          <div className="send-form-container">
            <div className="send-form-box" />
            <div className="send-form-label">送金に必要な項目を入力してください:</div>
            <div className="send-form">
              <Input modifier="underbar" placeholder={'メールアドレス'} type={"text"} value="xxxx-xxxx"/>
              <Input modifier="underbar" placeholder={'パスワード'} type={"text"}  value="4646" />
              <Input modifier="underbar" placeholder={'メッセージ(請求IDなど)'} type={"text"} />
              <Button modifier="send-button quiet" onClick={this.handleSend.bind(this)}>送信</Button>
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
