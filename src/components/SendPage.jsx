import React from 'react';
import ReactDOMServer from 'react-dom/server';
import {AlertDialog, Page, Button, Input, Modal} from 'react-onsenui';
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
      userInputedAddress: "",
      userInputedAmount: -1,
      openedModal: false,
    };

    this._onSend = this.props.onSend;
  }

  handleScanNfc(wallet) {
    if (!wallet) {
      return;
    }

    this.setState({openedModal: true}, () => {
      this.scanNfc(uri => {
        this.setState({openedModal: false}, () => {
          Promise.resolve(uri)
            .then(this.parseUri)
            .then(this.confirmSending)
            .then(this.createSendingUrl.bind(null, wallet))
            .then(this.sendRequest)
            .then(this.sendResponseToParent.bind(this))
            .catch(error => console.log(error));
          })
      })
    });
  }

  handleScanQrCode(wallet) {
    if (!wallet) {
      return;
    }

    this.scanQrCode(uri => {
      Promise.resolve(uri)
        .then(this.parseUri)
        .then(this.confirmSending)
        .then(this.createSendingUrl.bind(null, wallet))
        .then(this.sendRequest)
        .then(this.sendResponseToParent.bind(this))
        .catch(error => console.log(error));
    })

    return;
  }

  scanNfc(callback) {
    if (!window.cordova || !window.nfc) {
      callback("");
      return;
    }

    window.nfc.readerMode(
      window.nfc.FLAG_READER_NFC_A,
      nfcTag => {
        console.log("ReaderMode:\n" + JSON.stringify(nfcTag));
        if (nfcTag.techTypes.includes("android.nfc.tech.Ndef")) {
          const uri = window.ndef.uriHelper.decodePayload(nfcTag.ndefMessage[0].payload);
console.log(uri);

          window.nfc.disableReaderMode();
          callback(uri);
        }
      },
      error => console.log('NFC reader mode failed', error)
    );

/*
    window.nfc.addNdefListener(
      function (nfcEvent) {
          window.nfc.removeNdefListener();
          console.log(JSON.stringify(nfcEvent));

          let tag = nfcEvent.tag,
              ndefMessage = tag.ndefMessage;

        //  alert(JSON.stringify(ndefMessage));

          let type = window.nfc.bytesToString(ndefMessage[0].type); 
          let payload = window.nfc.bytesToString(ndefMessage[0].payload);
          let uri = type === "U" ? payload.substring(1) : "";

          callback(uri);
      },
      function () { // success callback
        //  alert("Waiting for NDEF tag");
      },
      function (error) { // error callback
        alert("Error adding NDEF listener " + JSON.stringify(error));
        callback("");
      }
    );
    */
  }

  scanQrCode(callback) {
    if (window.cordova && window.cordova.plugins.barcodeScanner) {
      window.cordova.plugins.barcodeScanner.scan(
        result => {
          let uri = result.cancelled ? "" : result.text;
          if (uri === "") return new Error();
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
      amount = 1300;
      callback(`hello3://iizk.jp/?amount=${amount}&recipientId=WStgkM9KDV81vzZ43GA2GueN8SAG2TVj2C`);
    }
  }

  parseUri(uriString) {
    console.log(uriString);
    if (uriString === "") {
      throw new Error();
    }

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

  sendResponseToParent(response) {
    console.log("fetched");
    console.log(response);

    if (response.ok) {
      response.text().then(text => this._onSend(response.statusText, text));
    } else {
      throw new Error();
    }
  }

  handleSend(wallet, params) {
    if (!wallet) return;

    if(!params) {
      params = {
        amount: this.state.userInputedAmount,
        recipientId: this.state.userInputedAddress,
      };
    }

    Promise.resolve(params)
      .then(this.confirmSending)
      .then(this.createSendingUrl.bind(null, wallet))
      .then(this.sendRequest)
      .then(response => {
        console.log("fetched");
        console.log(response);
          if (response.ok) {
            response.text().then(text => this._onSend(response.statusText, text));
          } else {
            throw new Error();
          }
      })
      .catch(error => console.log(error));
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
          }}
        </WalletsContext.Consumer>

        <SettingContext.Consumer>
          {setting => {
            this.state.setting = setting;
          }}
        </SettingContext.Consumer>

          <WalletsContext.Consumer>{ ([wallets, index]) => 
            <div className="tab-like-bar">
              <Button
                modifier="quiet"
                className="nfc-send-icon"
                disabled={this.state.nfcDisabled}
                onClick={this.handleScanNfc.bind(this, wallets[index])}
              />
              <Button
                modifier="quiet"
                className="qr-icon"
                disabled={this.state.qrDisabled}
                onClick={this.handleScanQrCode.bind(this, wallets[index])}
              />
            </div>
          }</WalletsContext.Consumer>

        <div className="tab-like-bar__content">
          <div className="send-form-container">
            <div className="send-form-box" />
            <div className="send-form-label">送金に必要な項目を入力してください:</div>
            <div className="send-form">
              <Input modifier="underbar" placeholder={'アドレス'} type={"text"} onChange={ev => this.setState({userInputedAddress: ev.target.value})} />
              <Input modifier="underbar" placeholder={'金額'} type={"number"} inputmode={"numeric"} onChange={ev => this.setState({userInputedAmount: ev.target.value})} />
              <Input modifier="underbar" placeholder={'メッセージ(請求IDなど)'} type={"text"} />
              <WalletsContext.Consumer>{ ([wallets, index]) => 
                <Button modifier="send-button quiet" onClick={this.handleSend.bind(this, wallets[index])}>送信</Button>
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

        <Modal
          isOpen={this.state.openedModal}
          onDeviceBackButton={() => {
            this.setState({openedModal: false});
          }}
          onPreHide={() => {
            if (window.cordova && window.nfc) {
              window.nfc.removeNdefListener();
            }
          }}
        >
          <div>NFC 待機中...</div>
          <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
          <Button modifier="quiet outline" style={{color: "white"}} onClick={() => this.setState({openedModal: false})}>キャンセル</Button>
        </Modal>
      </Page>
    )
  }}
