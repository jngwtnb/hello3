import React from 'react';
import ons from 'onsenui';
import {Page, Button, PullHook, Icon, List, ListItem} from 'react-onsenui';

export default class HistoryPage extends React.Component {
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

  render() {
/*
    let dataSource = [
      {'status': '完了',   'datetime': '2018/7/8 19:34', price: {'amount': '4469'},    'cause': '受取',     'wallet': "kawazu"},
      {'status': '完了',   'datetime': '2018/7/8 19:34', price: {'amount': '198000'},  'cause': '送金',     'wallet': "Taketotto's"},
      {'status': '完了',   'datetime': '2018/7/8 19:34', price: {'amount': '4980000'}, 'cause': 'チャージ', 'wallet': "河島高志の財布"},
      {'status': '未確認', 'datetime': '2018/7/8 19:34', price: {'amount': '4469'},    'cause': '受取',     'wallet': "kawazu"},
      {'status': '不明',   'datetime': '2018/7/8 19:34', price: {'amount': '198000'},  'cause': '送金',     'wallet': "Taketotto's"},
      {'status': '完了',   'datetime': '2018/7/8 19:34', price: {'amount': '4980000'}, 'cause': 'チャージ', 'wallet': "河島高志の財布"},
    ];
*/

    return (
      <Page>
        <div className="tab-like-bar">
          <Button modifier="quiet" className="sort-icon"/>
        </div>

        <div className="tab-like-bar__content">
        <Page>
          <PullHook
            onChange={this.handleChange.bind(this)}
            onLoad={this.handleLoad.bind(this)}
          >
            {
              (this.state.pullHookState === 'initial') ?
                <span >
                  <Icon size={35} spin={false} icon='ion-arrow-down-a' />
                  Pull down to refresh
                </span>
              : (this.state.pullHookState === 'preaction') ?
                <span>
                  <Icon size={35} spin={false} icon='ion-arrow-up-a' />
                  Release to refresh
                </span>
              :
                <span><Icon size={35} spin={true} icon='ion-load-d'></Icon> Loading data...</span>
            }
          </PullHook>

          <List
            modifier="myinset noborder"
            dataSource={this.state.data}
            renderRow={(data, idx) =>
              <ListItem key={`row-${idx}`} modifier="nodivider inset">
                <div className="list-item-container">
                  <div className="status">
                    <Icon size={{default: 24}} fixedWidth={true} style={{color: data.status.icon.color}} icon={data.status.icon.name}/>
                    {data.status.label}
                  </div>
                  <div className="datetime">
                    {data.datetime}
                  </div>
                  <div className="price">
                    <span className="icon coins-icon" />
                    <span className="text">
                      <span className="amount" style={{color: data.price.color}}>{data.price.amount}</span>
                      <br/>
                      <span className="ticker">DNGR</span>
                    </span>
                  </div>
                  <div className="cause">
                    <span>{data.cause}</span>
                  </div>
                  <div className="wallet">
                    <span className="wallet-icon"><Icon size={{default: 16}} icon={{default: "fa-wallet"}}/></span>
                    <span className="wallet-text">{data.wallet}</span>
                  </div>
                </div>
              </ListItem>
            }
          />


</Page>
        </div>


      </Page>
    )
  }
}
