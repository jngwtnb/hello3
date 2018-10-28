import React from 'react';
import {Page, Button, List, ListItem, ListHeader, Switch} from 'react-onsenui';

export default class SettingPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = this;
    if(props.initialSetting) {
      this.state = props.initialSetting;
    }

    this._onChange = event => {
      if (this.props.onChange) {
        return this.props.onChange(event);
      }
    };
  }

  handleChangeDebug(event) {
    this.state.debug = event.value;
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
                <ListItem key="general-list-item-debug">
                  <div className="center">デバッグモード</div>
                  <div className="right">
                    <Switch checked={this.state.debug} onChange={this.handleChangeDebug.bind(this)}/>
                  </div>
                </ListItem>,
                <ListItem key="general-list-item-clear">
                  <div className="center"><Button onClick={() => localStorage.clear()}>localStorageを初期化する</Button></div>
                </ListItem>,
                <ListHeader key="history-list-header">履歴</ListHeader>,
                <ListItem key="history-list-item">
                  <div className="center">桁毎に色分けする</div>
                  <div className="right">
                    <Switch checked={true} />
                  </div>
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
