import React from 'react';
import {AlertDialog, Page, Button, Input} from 'react-onsenui';
import ons from 'onsenui';

import WalletsContext from '../contexts/wallets';
import SettingContext from '../contexts/setting';

export default class SendPage extends React.Component {

  constructor(...args){
    super(...args);

    this.state = {
      nfcDisabled: false,
      qrDisabled: false,
      isOpen: false,
      dialogMessage: "",
      setting: {},
    };
  }

  handleQr() {
    if (window.cordova) {
      window.cordova.plugins.barcodeScanner.scan(
        function (result) {
          let uri = result.cancelled ? "" : result.text;
          if (uri === "") return;
            this.setState({uri: uri});
        }.bind(this),
        function (error) {
          alert("Scanning failed: " + error);
        },
        {
          formats: "QR_CODE",
        },
      );  
    } else {
      let amount = Math.floor(Math.random()*1000);
      console.log("RandomGeneratedAmount:", amount);
      this.setState({uri: `hello3://iizk.jp/?amount=${amount}&recipientId=WmjedSdfqYUkNEkKBgsNSrCUEZCYqkqNXd`});
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.uri !== this.state.uri) {
      // QRコード　スキャン後

      let [amount, recipientId] = this.parseSendUri(nextState.uri);

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
        buttonLabels: ["はい", "いいえ"],
      })
      .then(index => {
          if(index === 0) {
            let parsedUrl = new URL("http://apps.cowry.co.jp/Monet2/api/wallet/send/");
            let query = parsedUrl.searchParams;
            query.append("deviceId", this.state.wallet.address);
            query.append("toAddress", recipientId);
            query.append("amount", amount);
            query.append("requestId", "");

            return fetch(parsedUrl.href);
          } else {
            throw new Error();
          }
      })
      .then(response => {
        console.log("fetched");
        console.log(response);

        if (this.state.setting.debug) {
          response.text().then(text => ons.notification.alert({title: response.statusText, message: text}));
        } else {

        }
      })
      .catch(error => {});

      return false;
    }

    return true;
  }

  handleSend() {

  }

  parseSendUri(uriString) {
    if (uriString === "") {
      let amount = Math.floor(Math.random()*1000);
      console.log("RandomGeneratedAmount:", amount);
      uriString = `hello3://iizk.jp/?amount=${amount}&recipientId=aaaaaaaaaaaaaaaaaaaa`;
    }
    console.log(uriString);

    let uri = new URL(uriString);

    let amount = uri.searchParams.get("amount");
    let recipientId = uri.searchParams.get("recipientId");
    console.log(amount, recipientId);

    return [amount, recipientId];
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
        <WalletsContext.Consumer>
          {wallets => {
            this.state.wallet = wallets;
            null;
          }}
        </WalletsContext.Consumer>

        <SettingContext.Consumer>
          {setting => {
            this.state.setting = setting;
            null;
          }}
        </SettingContext.Consumer>

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
