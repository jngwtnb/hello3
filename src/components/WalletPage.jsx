import React from 'react';
import ons from 'onsenui';
import {Page, Button, Icon, PullHook, List, ListItem} from 'react-onsenui';

export default class WalletPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pullHookState: 'initial',
      data: [
        {label: "suzuki",         ticker: "DNGR", address: this.generateAddress()},
        {label: "Ichirooooooh's", ticker: "DNGR", address: this.generateAddress()},
        {label: "鈴木一郎の財布",  ticker: "BTC" , address: this.generateAddress()},
        {label: "suzuki",         ticker: "BTC",  address: this.generateAddress()},
      ],
      selected: 0,
    }

    this.onSelect = event => {
      if (this.props.onSelect) {
        return this.props.onSelect(event);
      }
    };

  }

  handleLoad(done) {
    fetch('http://apps.cowry.co.jp/Monet2/api/wallet/history/?deviceId=13CZLXCy6MD2L4iwEeeyXTB8pDAmdQyhD5&limit=100&offset=0')
      .then((response) => {
        if(response.ok) {
          return response.json();
        } else {
          throw new Error();
        }
      })
      .then((history) => {
        const statuses = ["完了", "完了", "完了", "完了", "未確認", "不明"];
        const wallets = ["suzuki", "ichirooooooh's", "鈴木一郎の財布"];

        let data = history.histories.map(h => {
          let priceLength = h.amount.length;
          let amountColor
              = priceLength >= 7 ? "red"
              : priceLength >= 6 ? "green"
              :                    "black"
              ;

          let status = statuses[Math.floor(Math.random() * statuses.length)];
          let wallet = wallets[Math.floor(Math.random() * wallets.length)];

          return {
            status: {icon: this.icons[status], label: status},
            datetime: new Date(h.createdAt).toLocaleString("ja-JP", {timeZone: "Asia/Tokyo"}),
            price: {amount: h.amount, color: amountColor},
            cause: this.causes[h.cause],
            wallet: wallet,
          };
        });


        this.setState({data: []}); // 更新
        this.setState({data: data}, done);
      })
      .catch((error) => console.log(error));

  }

  handleChange(event) {
    this.setState({
      pullHookState: event.state
    });
  }

  generateAddress() {
    let len = Math.floor(Math.random()*10) + 26;
    let chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-";
    let charsLen = chars.length;
    let addr = "";
    for (let i=0; i<len; i++) {
      addr += chars[Math.floor(Math.random()*charsLen)];
    }
    return addr;
  }

  componentWillUpdate(nextProps, nextState) {
    this.onSelect(nextState.data[nextState.selected]);
  }

  render() {
    return (
      <Page>
        <div className="tab-like-bar">
          <Button modifier="quiet" className="create-icon"/>
          <Button modifier="quiet" className="manage-icon"/>
        </div>

        <div className="tab-like-bar__content">
          <List
            modifier="myinset noborder"
            dataSource={this.state.data}
            renderRow={(data, idx) =>
              <ListItem
                key={`wallet-item-${idx}`}
                modifier="nodivider inset selectable"
                tappable={true}
//                disabled={this.state.data[idx].disabled}
                disabled={data.disabled}
                onClick={() => {
                  this.state.data.forEach((d, i) => {
                    d.disabled = i === idx ? true : null;
                  });
                  this.setState({selected: idx});
                }
              }>
                <div className="wallet-item-container">
                  <div className="wallet">
                    <span className="wallet-icon"><Icon size={{default: 20}} icon={{default: "fa-wallet"}}/></span>
                    <span className="wallet-text">{data.label}</span>
                  </div>

                  <div className="ticker">{data.ticker}</div>
                  <div className="address">{data.address}</div>
                  <div className="delete">
                    <Button className="delete-icon" onClick={ev => {
                      ev.stopPropagation();
                      console.log("delete!!")
                      }}/>
                  </div>
                </div>
              </ListItem>
            }
          />
        </div>


      </Page>
    )
  }
}