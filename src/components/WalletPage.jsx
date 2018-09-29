import React from 'react';
import ons from 'onsenui';
import {Page, Button, Icon, PullHook, List, ListItem} from 'react-onsenui';

export default class WalletPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pullHookState: 'initial',
      data: [],
    }

    this.icons = {
      '完了':   {color: "limegreen", name:{default: 'fa-check-square'}},
      '未確認': {color: "red", name:{default: 'fa-exclamation'}},
      '不明':   {color: "yellow", name:{default: 'fa-question'}},
    };

    this.causes = {
      'Receive': '受取',
      'Send': '送金',
      'Payment': 'チャージ',
    };
  }

  handleClick() {
    ons.notification.alert('Hello, world!');
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

  render() {
    let dataSource = [
      {wallet: "suzuki",         ticker: "DNGR", address: ""},
      {wallet: "Ichirooooooh's", ticker: "DNGR", address: ""},
      {wallet: "鈴木一郎の財布",  ticker: "BTC" , address: ""},
      {wallet: "suzuki",         ticker: "BTC",  address: ""},
    ];

    dataSource.forEach(data => {
      data.address = this.generateAddress();
    });

    return (
      <Page>
        <div className="tab-like-bar">
          <Button modifier="quiet" className="create-icon"/>
          <Button modifier="quiet" className="manage-icon"/>
        </div>

        <div className="tab-like-bar__content">
          <List
            modifier="myinset noborder"
            dataSource={dataSource}
            renderRow={(data, idx) =>
              <ListItem key={`row-${idx}`} modifier="nodivider inset" tappable={true}>
                <div className="wallet-item-container">
                  <div className="wallet">
                    <span className="wallet-icon"><Icon size={{default: 20}} icon={{default: "fa-wallet"}}/></span>
                    <span className="wallet-text">{data.wallet}</span>
                  </div>

                  <div className="ticker">{data.ticker}</div>
                  <div className="address">{data.address}</div>
                  <div className="delete">
                    <Button className="delete-icon" onClick={() => console.log("delete!!")}/>
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
