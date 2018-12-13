import React from 'react';
import ons from 'onsenui';
import {Page, Button, List, ListItem, ListHeader, Switch, Modal} from 'react-onsenui';

const SAMPLE_LOYALTY_CARD_AID = 'F222222222';
const SELECT_APDU_HEADER = '00A40400';
const SELECT_OK_SW = '9000';
const UNKNOWN_CMD_SW = '0000';
const SELECT_APDU = buildSelectApdu(SAMPLE_LOYALTY_CARD_AID);

function buildSelectApdu(aid) {
    // Format: [CLASS | INSTRUCTION | PARAMETER 1 | PARAMETER 2 | LENGTH | DATA]
    var aidByteLength = ("00" + (aid.length / 2).toString(16)).substr(-2);
    var data = SELECT_APDU_HEADER + aidByteLength + aid;
    return data.toLowerCase();
}

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

    if (!window.cordova || !window.hce || !window.ndef) {
      ons.notification.toast('Could not register NFC HCE', { timeout: 1000, animation: 'fall' });
      return;
    }

    const records = [
        window.ndef.textRecord("Register NFC HCE"),
    ];
    const message = window.ndef.encodeMessage(records);
    window.hce.setNdefMessage(message);

    window.hce.registerDeactivatedCallback(reason => {
      console.log('Deactivated ' + reason);
    }, reqson => {console.log(reqson)});

    ons.notification.toast('Registered NFC HCE', { timeout: 1000, animation: 'fall' });
  }

  handleUnregisterNfcHce(event) {
    event.stopPropagation();

    if (!window.cordova || !window.hce || !window.ndef) {
      ons.notification.toast('Could not unregister NFC HCE', { timeout: 1000, animation: 'fall' });
      return;
    }

    window.hce.registerCommandCallback(null);
    window.hce.registerDeactivatedCallback(null);

    ons.notification.toast('Unregistered NFC HCE', { timeout: 1000, animation: 'fall' });
  }

  handleScanNdef() {
    if (window.cordova && window.nfc) {
      window.nfc.addNdefListener(
        nfcEvent => {
          window.nfc.removeNdefListener();
          console.log(JSON.stringify(nfcEvent));
          alert(JSON.stringify(nfcEvent));
        },
        () => {console.log()},
        (error) => {console.log(error)}
        );
    }
  }

  handleScanIsoDep() {
//    window.nfc.showSettings(ev => {
//      console.log(ev);
//    });

    this.setState({modalOpened: true}, () => {
      this.scanIsoDep(uri => {
        this.setState({modalOpened: false});
      })
    });
  }

  scanIsoDep(callback) {
    if (!window.cordova || !window.nfc) {
      ons.notification.toast('Could not scan IsoDep', { timeout: 1000, animation: 'fall' });
    }

      window.nfc.addTagDiscoveredListener(
        async function (nfcEvent) {
          console.log(JSON.stringify(nfcEvent));

          alert(JSON.stringify(nfcEvent));

          const tagId = window.nfc.bytesToHexString(nfcEvent.tag.id);
          console.log('Processing', tagId);

          try {
            await window.nfc.connect('android.nfc.tech.IsoDep', 500);
            console.log('connected to', tagId);
            
            alert(JSON.stringify(nfcEvent) + tagId);
          } catch (error) {
            alert(error);
          } finally {
            await window.nfc.close();
            console.log('closed');
            window.nfc.removeTagDiscoveredListener();
          }
      }
    );

    ons.notification.toast('Scan IsoDep', { timeout: 1000, animation: 'fall' });
  }

  handleEnableReaderMode() {
    if (!window.cordova || !window.nfc || window.ndef) {
      ons.notification.toast('Could not enable ReaderMode', { timeout: 1000, animation: 'fall' });
      return;
    }

    window.nfc.readerMode(
      window.nfc.FLAG_READER_NFC_A, 
      nfcTag => {
        console.log("ReaderMode:\n" + JSON.stringify(nfcTag));
        alert("ReaderMode:\n" + JSON.stringify(nfcTag));
        if (nfcTag.techTypes.includes("android.nfc.tech.Ndef")) {
          const payload = nfcTag.ndefMessage[0].payload;
          console.log(window.ndef.textHelper.decodePayload(payload));
          alert(window.ndef.textHelper.decodePayload(payload));
        }
      },
      error => console.log('NFC reader mode failed', error)
    );

    ons.notification.toast('Enabled ReaderMode', { timeout: 1000, animation: 'fall' });
  }

  handleDisableReaderMode() {
    if (!window.cordova || !window.nfc) {
      ons.notification.toast('Could not disable ReaderMode', { timeout: 1000, animation: 'fall' });
      return;
    }

    window.nfc.disableReaderMode(
        () => {
          console.log('NFC reader mode disabled');
          ons.notification.toast('Disabled ReaderMode', { timeout: 1000, animation: 'fall' });
        },
        error => {
          console.log('Error disabling NFC reader mode', error);
          alert('Error disabling NFC reader mode', error);
        }
    )
  }

  handleShowNfcSettings() {
    if (!window.cordova || !window.nfc) {
      ons.notification.toast('Could not Show NFC settings', { timeout: 1000, animation: 'fall' });
      return;
    }

    window.nfc.showSettings();
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
                this.state.debugModeEnabled && <ListItem key="debug-list-item-clear-local-storage" tappable={true} onClick={() => localStorage.clear()}>
                  <div className="center">Clear localStorage</div>
                </ListItem>,
                this.state.debugModeEnabled && <ListItem key="debug-list-item-charge" tappable={true} onClick={this._onCharge.bind(this)}>
                  <div className="center">チャージ</div>
                </ListItem>,
                this.state.debugModeEnabled && <ListItem key="debug-list-item-register-nfc-hce" tappable={true} onClick={this.handleRegisterNfcHce.bind(this)}>
                  <div className="center">Register NFC HCE</div>
                </ListItem>,
                this.state.debugModeEnabled && <ListItem key="debug-list-item-unregister-nfc-hce" tappable={true} onClick={this.handleUnregisterNfcHce.bind(this)}>
                  <div className="center">Unregister NFC HCE</div>
                </ListItem>,
                this.state.debugModeEnabled && <ListItem key="debug-list-item-scan-iso-dep" tappable={true} onClick={this.handleScanIsoDep.bind(this)}>
                  <div className="center">Scan IsoDep</div>
                </ListItem>,
                this.state.debugModeEnabled && <ListItem key="debug-list-item-scan-ndef" tappable={true} onClick={this.handleScanNdef.bind(this)}>
                  <div className="center">Scan NDEF</div>
                </ListItem>,
                this.state.debugModeEnabled && <ListItem key="debug-list-item-enable-reader-mode" tappable={true} onClick={this.handleEnableReaderMode.bind(this)}>
                  <div className="center">Enable ReaderMode</div>
                </ListItem>,
                this.state.debugModeEnabled && <ListItem key="debug-list-item-disable-reader-mode" tappable={true} onClick={this.handleDisableReaderMode.bind(this)}>
                  <div className="center">Disable ReaderMode</div>
                </ListItem>,
                this.state.debugModeEnabled && <ListItem key="debug-list-item-show-nfc-settings" tappable={true} onClick={this.handleShowNfcSettings.bind(this)}>
                  <div className="center">Show NFC settings</div>
                </ListItem>,
              ]}
              renderRow={(row) => row}
            />

          </div>
        </div>
{/*
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
*/}
      </Page>
    )
  }
}
