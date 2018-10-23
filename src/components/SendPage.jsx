import React from 'react';
import ReactDOMServer from 'react-dom/server';
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

  handleQr(wallet, setting) {
    console.log(wallet, setting);
    this.scanQrCode(uri => {
      Promise.resolve(uri)
        .then(this.parseUri)
        .then(this.confirmSending)
        .then(params => {
          console.log(params);
          return params;
        })
        .then(this.createSendingUrl.bind(null, wallet))
//        .then((url) => {
//          console.log(url);
//          throw new Error();
//        })
        .then(this.sendRequest)
        .then(response => {
          console.log("fetched");
          console.log(response);

          if (setting.debug) {
            response.text().then(text => ons.notification.alert({title: response.statusText, message: text}));
          } else {
            this.props.tabbar._tabbar.setActiveTab(3, { reject: false });
  //        this.refs.tabbar._tabbar.setActiveTab(5, { reject: false });
          }
        })
        .then(() => {
  console.log("end");
        })
        .catch(error => console.log(error));
    })
return;
    Promise.resolve(this.scanQrCode())
  //    .then(this.scanQrCode)
//      .then(() => "monet://iizk.jp/?amount=1234123&invoiceId=cc8bd1c1-9ae6-4c60-9f5e-94569c714ff4")
      .then(this.parseUri.bind(this))
      .then(this.confirmSending)
      .then(this.createSendingUrl.bind(null, wallet))
      .then(this.sendRequest)
      .then(response => {
        console.log("fetched");
        console.log(response);

        if (setting.debug) {
          response.text().then(text => ons.notification.alert({title: response.statusText, message: text}));
        } else {
          this.props.tabbar._tabbar.setActiveTab(3, { reject: false });
//        this.refs.tabbar._tabbar.setActiveTab(5, { reject: false });
        }
      })
      .then(() => {
console.log("end");
      })
      .catch(error => console.log(error));
/*
      .then(uri => {
      //  const params = this.parseUri(uri);
        const params = this.parseUri("monet://iizk.jp/?amount=1234123&invoiceId=cc8bd1c1-9ae6-4c60-9f5e-94569c714ff4");
        console.log("amount", params.amount, "recipientId", params.recipientId, "invoiceId", params.invoiceId);

        this.confirmSending(params)
          .then(index => {
            if (index == 0 && params.amount !== null) {
              const url = this.getSendingUrlBy(params, wallet);
              console.log(url);
              return //fetch(url);
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

      })
      ;
*/
  }

  scanQrCode(callback) {
    if (window.cordova) {
      window.cordova.plugins.barcodeScanner.scan(
        result => {
          let uri = result.cancelled ? "" : result.text;
          if (uri === "") return new Error();
        //  this.setState({uri: uri});
          return callback(uri);
        },
        error => {
          alert("Scanning failed: " + error);
          return new Error();
        },
        {formats: "QR_CODE"},
      );  
    } else {
      let amount = Math.floor(Math.random()*1000);
      console.log("RandomGeneratedAmount:", amount);
    //  this.setState({uri: `hello3://iizk.jp/?amount=${amount}&recipientId=WmjedSdfqYUkNEkKBgsNSrCUEZCYqkqNXd`});
//      return `hello3://iizk.jp/?amount=${amount}&recipientId=WmjedSdfqYUkNEkKBgsNSrCUEZCYqkqNXd`;
      //  return Promise.resolve(`hello3://iizk.jp/?amount=${amount}&recipientId=WmjedSdfqYUkNEkKBgsNSrCUEZCYqkqNXd`)
      callback(`hello3://iizk.jp/?amount=${amount}&recipientId=WmjedSdfqYUkNEkKBgsNSrCUEZCYqkqNXd`);
    }
  }

  parseUri(uriString) {
    console.log(uriString);

    let uri = new URL(uriString);

    let amount = uri.searchParams.get("amount");
    let recipientId = uri.searchParams.get("recipientId");
    let invoiceId = uri.searchParams.get("invoiceId");

    return {
      amount: amount,
      recipientId: recipientId,
      invoiceId: invoiceId,
    };
  }

  confirmSending(params) {
    let messageHTML = ReactDOMServer.renderToString(
      <div>
        <div className="send-dialog-content">
          <table>
            <tbody>
              {params.amount ? <tr><td className="name">amount</td><td>: </td><td>{params.amount}</td></tr> : ""}
              {params.recipientId ? <tr><td className="name">recipientId</td><td>: </td><td>{params.recipientId}</td></tr> : ""}
              {params.invoiceId ? <tr><td className="name">invoiceId</td><td>: </td><td>{params.invoiceId}</td></tr> : ""}
            </tbody>
          </table>
        </div>
        送信して構いませんか？
      </div>
    );

    return ons.notification.confirm({
      title: "",
      messageHTML: messageHTML,
      buttonLabels: ["はい", "いいえ"],
    }).then(index => {
      if (index === 0) {
        return params;
      } else { throw new Error() }
    });
  }

  createSendingUrl(wallet, params) {
console.log(params, wallet);

    let url;
    let endpoint;
    let parsedUrl;
    let query;

    if (params.recipientId !== null) {
      endpoint = "http://apps.cowry.co.jp/Monet2/api/wallet/send/";
      parsedUrl = new URL(endpoint);
      query = parsedUrl.searchParams;
      query.append("deviceId", wallet.deviceId);
      query.append("toAddress", params.recipientId);
      query.append("amount", params.amount);
      query.append("requestId", "");
      url = parsedUrl.href;
    } else if (params.invoiceId !== null) {
      endpoint = "http://apps.cowry.co.jp/Monet2/api/bill/pay/";
      parsedUrl = new URL(endpoint);
      query = parsedUrl.searchParams;
      query.append("deviceId", wallet.deviceId);
      query.append("id", params.invoiceId);
      url = parsedUrl.href;
    } else { return }

    return url;
  }

  sendRequest(url) {
    return fetch(url);
  }

  handleSend() {

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

        <SettingContext.Consumer>{ setting =>
          <WalletsContext.Consumer>{ ([wallets, index]) => 
            <Button
              modifier="quiet"
              className="qr-icon"
              disabled={this.state.qrDisabled}
              onClick={this.handleQr.bind(this, wallets[index], setting)}
            />
          }</WalletsContext.Consumer>
        }</SettingContext.Consumer>
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
  }}
