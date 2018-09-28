import React from 'react';
import ons from 'onsenui';
import {Page, Button} from 'react-onsenui';

export default class SettingPage extends React.Component {
  handleClick() {
    ons.notification.alert('Hello, world!');
  }

  render() {
    return (
      <Page >
        <div className="tab-like-bar half"></div>
        <div className="tab-like-bar__content">
          <p style={{ padding: '0 15px' }}>
            This is the <strong>{this.props.title}</strong> page!
          </p>

          <Button onClick={this.handleClick}>Push!</Button>
        </div>

      </Page>
    )
  }
}
