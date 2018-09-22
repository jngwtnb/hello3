import React from 'react';
import ReactDOM from 'react-dom';

export default class TabLikeButton extends React.Component {
  constructor(...args) {
    super(...args);

    this.onClick = event => {
      if (this.props.onClick) {
        return this.props.onClick(event);
      }
    };
  }

  componentDidMount() {
    var node = ReactDOM.findDOMNode(this);
    node.addEventListener('click', this.onClick);
  }

  componentWillUnmount() {
    var node = ReactDOM.findDOMNode(this);
    node.removeEventListener('click', this.onClick);
  }

  componentWillReceiveProps(nextProps) {
    this.refs.radio.checked = nextProps.active;
  }

  render() {
    return (
        <div className={`tab-like-button ${this.props.className}`}>
          <input type="radio" style={{display: "none"}} ref="radio"/>
          <button className="tabbar__button" >
            <div className="tabbar__icon">
              <ons-icon icon={this.props.icon} />
            </div>
            <div className="tabbar__label">{this.props.label}</div>
          </button>
        </div>
    );
  }
}
