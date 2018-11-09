import React from 'react';
import ons from 'onsenui';
import {Page, Button, List, ListItem, ListHeader, Switch, Modal} from 'react-onsenui';

export default class SettingPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
    if(props.initialSetting) {
      this.state = props.initialSetting;
    }
    this.state.modalOpened = false;

    this._onChange = this.props.onChange;
    this._onCharge = this.props.onCharge;
  }

  handleChangeDebugMode(event) {
    this.state.debugModeEnabled = event.value;
    this._onChange(this.state);
  }

  handleChangeAmountColorCoding(event) {
    this.state.amountColorCodingEnabled = event.value;
    this._onChange(this.state);
  }

  handleClickChildElement(tagName, event) {
    event.stopPropagation();
    event.currentTarget.getElementsByTagName(tagName).item(0).click();
  }

  handleRegisterNfcHce(event) {
    event.stopPropagation();

/*
    window.hce.registerCommandCallback(command => {
      console.log(command);
      var commandAsBytes = new Uint8Array(command);
      var commandAsString = window.hce.util.byteArrayToHexString(commandAsBytes);
      console.log(commandAsString);
    },
    error => {
      console.log(error);
    });

*/
    if (window.hce) {
      window.hce.registerCommandCallback(onCommand);
      const onCommand = function(command) {
        var commandAsBytes = new Uint8Array(command);
        var commandAsString = window.hce.util.byteArrayToHexString(commandAsBytes);
        console.log(command, commandAsString);
        alert(JSON.stringify(command, commandAsString));

        // do something with the command

        // send the response
  //      window.hce.sendReponse(commandResponse);
      }

      window.hce.registerDeactivatedCallback(reason => {
        console.log('Deactivated ' + reason);
        alert('Deactivated ' + reason);
      });

      ons.notification.toast('Registered NFC HCE', { timeout: 1000, animation: 'fall' });
    } else {
      ons.notification.toast('Could not register NFC HCE', { timeout: 1000, animation: 'fall' });
    }

  }

    handleScanIsoDep() {
//    window.nfc.showSettings(ev => {
//      console.log(ev);
//    });

    console.log(window);

    this.setState({modalOpened: true}, () => {
      this.scanIsoDep(uri => {
        this.setState({modalOpened: false});
      })
    });
  }

  scanIsoDep(callback) {
    if (window.cordova && window.nfc) {
      console.log("start NFC listener");
      /*
      window.nfc.addNdefListener(
        nfcEvent => {
          window.nfc.removeNdefListener();
          console.log(JSON.stringify(nfcEvent));
return callback("");
        },
        success => console.log(success),
        error => console.log(error)
      );
      */

      window.nfc.addTagDiscoveredListener(
        function (nfcEvent) {
          window.nfc.removeTagDiscoveredListener();
          console.log(JSON.stringify(nfcEvent));

          alert(JSON.stringify(nfcEvent));

          const tagId = window.nfc.bytesToHexString(nfcEvent.tag.id);
          console.log('Processing', tagId);
return callback("");
/*
          try {
              await nfc.connect('android.nfc.tech.IsoDep', 500);
              console.log('connected to', tagId);
              
              let response = await nfc.transceive(DESFIRE_SELECT_PICC);
              ensureResponseIs('9000', response);
              
              response = await nfc.transceive(DESFIRE_SELECT_AID);
              ensureResponseIs('9100', response);
              // 91a0 means the requested application not found

              alert('Selected application AA AA AA');

              // more transcieve commands go here
              
          } catch (error) {
              alert(error);
          } finally {
              await nfc.close();
              console.log('closed');
          }
*/












            let tag = nfcEvent.tag,
                ndefMessage = tag.ndefMessage;

          //  alert(JSON.stringify(ndefMessage));

            let type = window.nfc.bytesToString(ndefMessage[0].type); 
            let payload = window.nfc.bytesToString(ndefMessage[0].payload);
            let uri = type === "U" ? payload.substring(1) : "";

            return callback(uri);
        },
        function () { // success callback
//            alert("Waiting for NDEF tag");
        },
        function (error) { // error callback
            alert("Error adding NDEF listener " + JSON.stringify(error));
            callback("");
        }
      );

    } else {
      return callback("");
    }
  }

  handleGetSimInfo() {
    if (!window.plugins || !window.plugins.sim) {
      ons.notification.toast('Could not get sim info', { timeout: 1000, animation: 'fall' });
      return;
    }

    window.plugins.sim.getSimInfo(
      result => {
        console.log(result);
        alert(JSON.stringify(result));
      },
      error => {
        console.log(error);
        alert(JSON.stringify(error));
      });
  }





  render() {
    return (
      <Page>
        <div className="tab-like-bar half"></div>
        <div className="tab-like-bar__content">
          <div className="setting-container">
            <List
              modifier="noborder setting-inset"
              className="general"
              dataSource={[
                <ListItem key="general-list-item-nfc" tappable={true} onClick={this.handleClickChildElement.bind(this, "ons-switch")}>
                  <div className="center">NFC決済時に確認する（未実装）</div>
                  <div className="right">
                    <Switch onClick={ev => ev.stopPropagation()} />
                  </div>
                </ListItem>,
                <ListHeader key="history-list-header">履歴</ListHeader>,
                <ListItem key="history-list-item" tappable={true} onClick={this.handleClickChildElement.bind(this, "ons-switch")}>
                  <div className="center">桁毎に色分けする</div>
                  <div className="right">
                    <Switch checked={this.state.amountColorCodingEnabled} onChange={this.handleChangeAmountColorCoding.bind(this)} onClick={ev => ev.stopPropagation()} />
                  </div>
                </ListItem>,
                <ListHeader key="debug-list-header">デバッグ</ListHeader>,
                <ListItem key="debug-list-item-debug" tappable={true} onClick={this.handleClickChildElement.bind(this, "ons-switch")}>
                  <div className="center">デバッグモード</div>
                  <div className="right">
                    <Switch checked={this.state.debugModeEnabled} onChange={this.handleChangeDebugMode.bind(this)} onClick={ev => ev.stopPropagation()} />
                  </div>
                </ListItem>,
                this.state.debugModeEnabled && <ListItem key="debug-list-item-clear" tappable={true} onClick={() => localStorage.clear()}>
                  <div className="center">localStorageを初期化する</div>
                </ListItem>,
                this.state.debugModeEnabled && <ListItem key="debug-list-item-charge" tappable={true} onClick={this._onCharge.bind(this)}>
                  <div className="center">チャージ</div>
                </ListItem>,
                this.state.debugModeEnabled && <ListItem key="debug-list-item-register-nfc-hce" tappable={true} onClick={this.handleRegisterNfcHce.bind(this)}>
                  <div className="center">Register NFC HCE</div>
                </ListItem>,
                this.state.debugModeEnabled && <ListItem key="debug-list-item-scan-iso-dep" tappable={true} onClick={this.handleScanIsoDep.bind(this)}>
                  <div className="center">Scan IsoDep</div>
                </ListItem>,
                this.state.debugModeEnabled && <ListItem key="debug-list-item-get-sim-info" tappable={true} onClick={this.handleGetSimInfo.bind(this)}>
                  <div className="center">Get sim info</div>
                </ListItem>,
              ]}
              renderRow={(row) => row}
            />

          </div>
        </div>

        <Modal
          isOpen={this.state.modalOpened}
          onDeviceBackButton={() => {
            this.setState({modalOpened: false});
          }}
          onPreHide={() => {
            if (window.cordova && window.nfc) {
              window.nfc.removeNdefListener();
              window.nfc.removeTagDiscoveredListener();
            }
          }}
        >
          <div>NFC 待機中...</div>
          <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
          <Button modifier="quiet outline" style={{color: "white"}} onClick={() => this.setState({modalOpened: false})}>キャンセル</Button>
        </Modal>

      </Page>
    )
  }
}
