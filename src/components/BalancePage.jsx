import React from 'react';
import ons from 'onsenui';
import {Page, Button, List, ListItem} from 'react-onsenui';

export default class BalancePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [
        {icon: "coins-icon", ticker: "DNGR", amount: "968,164,923"},
        {icon: "coins-icon", ticker: "BTC",  amount: "365,015"},
      ],
    };
  }

  render() {
    return (
      <Page>
        <div className="tab-like-bar half" />

        <div className="tab-like-bar__content">
          <List
            modifier="noborder balance-inset"
            dataSource={this.state.data}
            renderRow={(data, idx) =>
              <ListItem
                key={`balance-item-${idx}`}
                modifier="nodivider balance-inset"
              >
                <div className="balance-item-container">
                  <div className={"icon " + data.icon} />
                  <div className="ticker">{data.ticker}</div>
                  <div className="price">
                    <span className="amount">{data.amount}</span>
                    <span className="ticker">{data.ticker}</span>
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
