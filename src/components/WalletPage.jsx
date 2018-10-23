import React from 'react';
import ReactDOMServer from 'react-dom/server';
import ons from 'onsenui';
import {Page, Button, List, ListItem, Input, Select, Checkbox,AlertDialog} from 'react-onsenui';

import WalletsContext from '../contexts/wallets';
import SettingContext from '../contexts/setting';

export default class WalletPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedIndex: props.initialIndex,
      newWalletLabel: "",
      newWalletTicker: "dngr",
      openedCreateDialog: false,
    }

    this._onSelect = (event, index) => {
      if (this.props.onSelect) {
        return this.props.onSelect(event, index);
      }
    };

    this._onCreate = props.onCreate;
    this._onDelete = props.onDelete;
  }

  handleClickCreateButton() {
    this.setState({openedCreateDialog: true});
  }

  render() {
    return (
      <Page>
        <div className="tab-like-bar">
          <Button modifier="quiet" className="create-icon" onClick={this.handleClickCreateButton.bind(this)} />
          <Button modifier="quiet" className="manage-icon" />
        </div>

        <div className="tab-like-bar__content">
          <WalletsContext.Consumer>{([wallets, index]) =>
            <List
              modifier="noborder wallet-inset"
              dataSource={wallets}
              renderRow={(data, idx) =>
                <ListItem
                  key={`wallet-item-${idx}`}
                  modifier="nodivider wallet-inset selectable"
                  tappable={true}
                  selected={idx == index}
                  onClick={() => {
                    this.setState({selectedIndex: idx});
                    this._onSelect(idx);
                  }}
                >
                  <div className="wallet-item-container">
                    <div className="wallet">
                      <span className="icon single-wallet-icon"></span>
                      <span className="wallet-text">{data.label}</span>
                    </div>

                    <div className="ticker">{data.ticker}</div>
                    <div className="device-id">{data.deviceId}</div>
                    <div className="delete">
                      <Button className="delete-button delete-icon" onClick={ev => {
                        ev.stopPropagation();

                        let deleteButton = ev.currentTarget;
                        deleteButton.disabled = true;

                        let messageHTML = ReactDOMServer.renderToString(
                          <div>
                            <div className="wallet-dialog-content">
                              <table>
                                <tbody>
                                  <tr><td className="name">label</td><td>: </td><td>{data.label}</td></tr>
                                  <tr><td className="name">ticker</td><td>: </td><td>{data.ticker}</td></tr>
                                  <tr><td className="name">deviceId</td><td>: </td><td>{data.deviceId}</td></tr>
                                  </tbody>
                              </table>
                            </div>
                            削除しますか？
                          </div>
                        );

                        ons.notification.confirm({
                          title: "",
                          messageHTML: messageHTML,
                          buttonLabels: ["はい", "いいえ"],
                        })
                        .then(index => {
                          if(index === 0) {
                            this._onDelete(idx);
                          }

                          deleteButton.disabled = false;
                        });
                      }}/>
                    </div>
                  </div>
                </ListItem>
              }
            />
          }</WalletsContext.Consumer>
        </div>

            <AlertDialog isOpen={this.state.openedCreateDialog} isCancelable={false}>
              <div className="alert-dialog-title"></div>
              <div className="alert-dialog-content">
                <div className="wallet-dialog-content">
                  <table>
                    <tbody>
                      <tr><td className="name">label</td><td>: </td><td>
                        <Input
                          modifier="underbar"
                          value={this.state.newWalletLabel} float
                          onChange={(event) => { this.setState({newWalletLabel: event.target.value})} }
                        />
                      </td></tr>
                      <tr><td className="name">ticker</td><td>: </td><td>
                        <Select
                          modifier="underber"
                          value={this.state.newWalletTicker}
                          onChange={(event) => this.setState({newWalletTicker: event.target.value})}
                        >
                          <option value="dngr">DNGR</option>
                          <option value="btc">BTC</option>
                        </Select></td></tr>
                        {
                          <tr><td className="name">deviceId</td><td>: </td><td>
                            <Checkbox
                              modifier="underbar"
                              value={this.state.newWalletLabel} float
                              onChange={(event) => { this.setState({newWalletLabel: event.target.value})} }
                            />
                          </td></tr>
                        }
                      </tbody>
                  </table>
                </div>
              </div>
              <div className="alert-dialog-footer">
                <Button
                  className="alert-dialog-button"
                  onClick={() => {
                    this._onCreate(this.state.newWalletLabel, this.state.newWalletTicker);
                    this.setState({
                      newWalletLabel: "",
                      newWalletTicker: "dngr",
                      openedCreateDialog: false,
                    });
                  }}
                >作成</Button>
              </div>
              <div className="alert-dialog-footer alert-dialog-button--rowfooter">
                <Button
                  className="alert-dialog-button alert-dialog-button--rowfooter"
                  onClick={() => {this.setState({openedCreateDialog: false})}}
                >キャンセル</Button>
              </div>
            </AlertDialog>
          }}
      </Page>
    )
  }
}