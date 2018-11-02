import React from 'react';
import {Page, Button, List, ListItem, ListHeader, Switch} from 'react-onsenui';

export default class SettingPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
    if(props.initialSetting) {
      this.state = props.initialSetting;
    }

    this._onChange = this.props.onChange;
    this._onCharge = this.props.onCharge;
  }

  handleChangeDebug(event) {
    this.state.debugModeEnabled = event.value;
    this._onChange(this.state);
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
                <ListItem key="general-list-item-nfc">
                  <div className="center">NFC決済時に確認する（未実装）</div>
                  <div className="right">
                    <Switch />
                  </div>
                </ListItem>,
                <ListHeader key="history-list-header">履歴</ListHeader>,
                <ListItem key="history-list-item">
                  <div className="center">桁毎に色分けする</div>
                  <div className="right">
                    <Switch checked={true} />
                  </div>
                </ListItem>,
                <ListHeader key="debug-list-header">デバッグ</ListHeader>,
                <ListItem key="debug-list-item-debug">
                  <div className="center">デバッグモード</div>
                  <div className="right">
                    <Switch checked={this.state.debugModeEnabled} onChange={this.handleChangeDebug.bind(this)}/>
                  </div>
                </ListItem>,
                this.state.debugModeEnabled && <ListItem key="debug-list-item-clear">
                  <div className="center"><Button modifier="large light" onClick={() => localStorage.clear()}>localStorageを初期化する</Button></div>
                </ListItem>,
                this.state.debugModeEnabled && <ListItem key="debug-list-item-charge">
                  <div className="center"><Button modifier="large light" onClick={this._onCharge.bind(this)}>チャージ</Button></div>
                </ListItem>,
              ]}
              renderRow={(row) => row}
            />
          </div>
        </div>
      </Page>
    )
  }
}
