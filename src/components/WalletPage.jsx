import React from 'react';
import ReactDOM from 'react-dom';
import ons from 'onsenui';
import {Page, Button, List, ListItem, AlertDialog} from 'react-onsenui';

export default class WalletPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pullHookState: 'initial',
      wallets: {
        index: 0,
        data: [],
      },
      selectedIndex: 0,
      deleteDialogOpened: false,
      clickedDeleteButton: null,
      clickedDeleteButtonIndex: 0,
    }

    this._onSelect = event => {
      if (this.props.onSelect) {
        return this.props.onSelect(event);
      }
    };
  }

  componentWillMount() {
    let data = JSON.parse(localStorage.getItem("wallets"));

    if (data === null) {
      data = [
        {label: "suzuki",         ticker: "DNGR", address: this.generateAddress()},
        {label: "Ichirooooooh's", ticker: "DNGR", address: this.generateRandomAddress()},
        {label: "鈴木一郎の財布",  ticker: "BTC" , address: this.generateRandomAddress()},
        {label: "suzuki",         ticker: "BTC",  address: this.generateRandomAddress()},
      ];

      localStorage.setItem("wallets", JSON.stringify(data))
    }

    this.setState({data: data});
  }

  componentDidMount() {
    console.log("componentDidMount");
//    this.setState({selectedIndex: 0});
//    this._onSelect(this.state.data[0]);
  }

  componentWillUpdate(nextProps, nextState) {
    console.log("componentWillUpdate");
    this._onSelect(nextState.data[nextState.selectedIndex]);
  }

  handleChange(event) {
    this.setState({
      pullHookState: event.state
    });
  }

  handleDeleteDialogCancel() {
    let buttons = ReactDOM.findDOMNode(this).getElementsByClassName("delete-button")
    buttons.item(this.state.clickedDeleteButtonIndex).disabled = false;

    this.setState({
      deleteDialogOpened: false,
    });
  }

  render() {
    const wallet = this.state.wallets.data[this.state.clickedDeleteButtonIndex];

    return (
      <Page>
        <div className="tab-like-bar">
          <Button modifier="quiet" className="create-icon"/>
          <Button modifier="quiet" className="manage-icon"/>
        </div>

        <div className="tab-like-bar__content">
          <List
            modifier="noborder wallet-inset"
            dataSource={this.state.wallets.data}
            renderRow={(data, idx) =>
              <ListItem
                key={`wallet-item-${idx}`}
                modifier="nodivider wallet-inset selectable"
                tappable={true}
                selected={idx === this.state.selectedIndex}
                onClick={() => this.setState({selectedIndex: idx})}
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
                      ev.currentTarget.disabled = true;

                      this.setState({
                        deleteDialogOpened: true,
                        clickedDeleteButtonIndex: idx,
                      });
                    }}/>
                  </div>
                </div>
              </ListItem>
            }
          />
        </div>

        <AlertDialog isOpen={this.state.deleteDialogOpened} onCancel={this.handleDeleteDialogCancel.bind(this)} isCancelable={false}>
          <div className="alert-dialog-title"></div>
          <div className="alert-dialog-content">
            <div className="wallet-dialog-content">
              <table>
                <tbody>
                  <tr><td className="name">label</td><td>: </td><td>{wallet ? wallet.label : ""}</td></tr>
                  <tr><td className="name">ticker</td><td>: </td><td>{wallet ? wallet.ticker : ""}</td></tr>
                  <tr><td className="name">address</td><td>: </td><td>{wallet ? wallet.address : ""}</td></tr>
                </tbody>
              </table>
            </div>
            <br/>
            削除しますか？
          </div>
          <div className="alert-dialog-footer alert-dialog-footer--rowfooter">
            <Button onClick={this.handleDeleteDialogCancel.bind(this)} className="alert-dialog-button alert-dialog-button--rowfooter">
              はい（未実装）
            </Button>
            <Button onClick={this.handleDeleteDialogCancel.bind(this)} className="alert-dialog-button alert-dialog-button--rowfooter alert-dialog-button--primal">
              いいえ
            </Button>
          </div>
        </AlertDialog>

      </Page>
    )
  }
}
