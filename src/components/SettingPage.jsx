import React from 'react';
import ons from 'onsenui';
import {Page, Button, Input, List, ListItem, ListHeader, Switch} from 'react-onsenui';

export default class SettingPage extends React.Component {
  render() {
    return (
      <Page >
        <div className="tab-like-bar half"></div>
        <div className="tab-like-bar__content">
          <div className="setting-container">
            <List
              modifier="noborder"
              className="general"
              dataSource={[
                <ListItem key="nfc-list-item">
                  <div className="center">NFC決済時に確認する（未実装）</div>
                  <div className="right">
                    <Switch />
                  </div>
                </ListItem>,
                <ListItem key="debug-list-item">
                  <div className="center">デバッグモード</div>
                  <div className="right">
                    <Switch />
                  </div>
                </ListItem>,
              ]}
              renderRow={(row) => row}
            />
            <List
              modifier="noborder"
              className="history"
              dataSource={[
                <ListItem key="history-list-item">
                  <div className="center">桁毎に色分けする</div>
                  <div className="right">
                    <Switch checked={true} />
                  </div>
                </ListItem>,
              ]}
              renderHeader={() => <ListHeader>履歴</ListHeader>}
              renderRow={(row) => row}
            />
          </div>
        </div>
      </Page>
    )
  }
}
