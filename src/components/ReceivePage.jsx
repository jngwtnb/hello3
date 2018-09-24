import React from 'react';
import ons from 'onsenui';
import {Page, Button, AlertDialog} from 'react-onsenui';

import '../css/tablikebar.css';

export default class ReceivePage extends React.Component {
  constructor(...args){
    super(...args);

    this.state = {
      nfcDisabled: false,
      isOpen: false,
      dialogMessage: "",
    };
  }

  handleClick() {
    ons.notification.alert('Hello, world!');
  }

  handleCancel() {
    this.setState({
      nfcDisabled: false,
      isOpen: false,
    });
  }

  render() {
    return (
      <Page >
        <div className="tab-like-bar">
          <Button modifier="quiet" className="nfc-icon" disabled={this.state.nfcDisabled} onClick={() => {
            this.setState({
              nfcDisabled: true,
              isOpen: true,
              dialogMessage: "nfc",
            });
          }} />
        </div>

        <div className="tab-like-bar__content">
        </div>

        <AlertDialog isOpen={this.state.isOpen} onCancel={this.handleCancel.bind(this)} isCancelable={false}>
          <div className="alert-dialog-title"></div>
          <div className="alert-dialog-content">
            {this.state.dialogMessage}
          </div>
          <div className="alert-dialog-footer">
            <Button onClick={this.handleCancel.bind(this)} className="alert-dialog-button">
              Ok
            </Button>
          </div>
        </AlertDialog>

      </Page>
    )
  }
}