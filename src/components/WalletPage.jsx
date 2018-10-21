import React from 'react';
import ReactDOMServer from 'react-dom/server';
import ons from 'onsenui';
import {Page, Button, List, ListItem} from 'react-onsenui';

import WalletsContext from '../contexts/wallets';

export default class WalletPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedIndex: props.initialIndex,
    }

    this._onSelect = (event, index) => {
      if (this.props.onSelect) {
        return this.props.onSelect(event, index);
      }
    };
  }

  render() {
    return (
      <Page>
        <div className="tab-like-bar">
          <Button modifier="quiet" className="create-icon"/>
          <Button modifier="quiet" className="manage-icon"/>
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
                  selected={idx == this.state.selectedIndex}
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
                    <div className="address">{data.address}</div>
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
                                  <tr><td className="name">address</td><td>: </td><td>{data.address}</td></tr>
                                  </tbody>
                              </table>
                            </div>
                            削除しますか？
                          </div>
                        );

                        ons.notification.confirm({
                          title: "",
                          messageHTML: messageHTML,
                          buttonLabels: ["はい（未実装）", "いいえ"],
                        })
                        .then(index => {
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
      </Page>
    )
  }
}
