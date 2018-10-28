import React from 'react';
import ons from 'onsenui';
import {Page, Button, PullHook, Icon, List, ListItem} from 'react-onsenui';

import WalletsContext from '../contexts/wallets';

export default class HistoryPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pullHookState: 'initial',
      data: [],
    }

    this.icons = {
      '完了':   {color: "green", name:{default: 'fa-check'}},
      '未確認': {color: "red", name:{default: 'fa-exclamation'}},
      '不明':   {color: "orange", name:{default: 'fa-question'}},
    };

    this.causes = {
      'Receive': '受取',
      'Send': '送金',
      'Payment': 'チャージ',
    };
  }

//  componentDidMount() {
//    if (window.cordova) {
//      this.handleLoad(() => {});
//    }
//  }

//  componentDidUpdate(prevProps, prevState) {
//    if (prevProps.wallet !== this.props.wallet && window.cordova) {
//      this.handleLoad(() => {});
//    }
//  }

  handleLoad(wallet, done) {
    if (!wallet) {
      console.log("wallet was undefined.");
      return;
    }

    fetch(`http://apps.cowry.co.jp/Monet2/api/wallet/history/?deviceId=${wallet.deviceId}&limit=100&offset=0`)
      .then(response => {
        if(response.ok) {
          return response.json();
        } else {
          throw new Error();
        }
      })
      .then(json => {
        const statuses = ["完了", "完了", "完了", "完了", "未確認", "不明"];
        const walletLabels = ["suzuki", "ichirooooooh's", "鈴木一郎の財布"];

        let data = json.histories.map(h => {
          let priceLength = h.amount.length;
          let amountColor
              = priceLength >= 7 ? "red"
              : priceLength >= 6 ? "green"
              :                    "black"
              ;

          let status = statuses[Math.floor(Math.random() * statuses.length)];
          let walletLabel = walletLabels[Math.floor(Math.random() * walletLabels.length)];

          return {
            status: {icon: this.icons[status], label: status},
            datetime: new Date(h.createdAt).toLocaleString("ja-JP", {timeZone: "Asia/Tokyo"}),
            price: {amount: h.amount, color: amountColor},
            cause: this.causes[h.cause],
            wallet: walletLabel,
          };
        });


        this.setState({data: data}, done);
        this.forceUpdate();
      })
      .catch((error) => ons.notification.alert(error));

  }

  handleChange(event) {
    this.setState({
      pullHookState: event.state
    });
  }

  render() {
    return (
      <Page>
        <div className="tab-like-bar without-label">
          <Button modifier="quiet" className="sort-button sort-icon" />
        </div>

        <div className="tab-like-bar__content">
        <Page>
          <WalletsContext.Consumer>{([wallets, index]) =>
            <PullHook
              fixedContent={true}
              onChange={this.handleChange.bind(this)}
              onLoad={this.handleLoad.bind(this, wallets[index])}
            >
              {
                (this.state.pullHookState === 'initial') ?
                  <span>
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
          }</WalletsContext.Consumer>

          <List
            modifier="noborder history-inset"
            dataSource={this.state.data}
            renderRow={(data, idx) =>
              <ListItem key={`row-${idx}`} modifier="nodivider history-inset">
                <div className="history-item-container">
                  <div className="status">
                    <Icon size={{default: 20}} fixedWidth={true} style={{backgroundColor: data.status.icon.color}} className="icon" icon={data.status.icon.name}/>
                    <span className="label">{data.status.label}</span>
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
                    <span className="icon single-wallet-icon" />
                    <span className="text">{data.wallet}</span>
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
