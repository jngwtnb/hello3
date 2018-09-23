import React from 'react';
import ReactDOM from 'react-dom';

export default class TabLikeBar extends React.Component {
  constructor(...args) {
    super(...args);
  }

  render() {
    return (
      <div className={`tab-like-bar ${this.props.className}`}>
        {this.props.children}
      </div>


    );
  }

  /*
          <div className={`tab-like-button ${this.props.className}`}>
          <input type="radio" style={{display: "none"}} ref="radio"/>
          <button className="tabbar__button" >
            <div className="tabbar__icon">
              <ons-icon icon={this.props.icon} />
            </div>
            <div className="tabbar__label">{this.props.label}</div>
          </button>
        </div>

  
   */
}
