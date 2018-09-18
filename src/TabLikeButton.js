import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

class TabLikeButton extends React.Component {
//  constructor(props) {
//    super(props);
  constructor(...args) {
    super(...args);

    this.onClick = event => {
      if (this.props.onClick) {
        return this.props.onClick(event);
      }
    };

    this.state = {
      active: false
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

/*
render() {
  return React.createElement(this._getDomNodeName(), Util.getAttrs(this), this.props.children);
}

render() {
  const pages = this.props.dataSource.map((data, idx) => this.props.renderRow(data, idx));

  return (
    <ons-list { ...attrs } ref={(list) => { this._list = list; }}>
      {this.props.renderHeader()}
      {pages}
      {this.props.children}
      {this.props.renderFooter()}
    </ons-list>
  );
}
*/

  setActive(active) {
//    this.refs.radio.checked = active;
    this.setState({ "active": active });
  }

  render() {
//    const attrs = Util.getAttrs(this);
//onClick={this.handleClickBalanceTab.bind(this)}
    const active = this.state.active;

    return (
      <div className={`tab-like-button ${this.props.className}`}>
        <input type="radio" style={{display: "none"}} checked={active} />
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

TabLikeButton.propTypes = {
  /**
   * @name modifier
   * @type string
   * @required false
   * @description
   *  [en]The appearance of the button.[/en]
   *  [ja][/ja]
   */
  modifier: PropTypes.string,

  /**
   * @name onClick
   * @type function
   * @description
   *  [en] This function will be called ones the button is clicked. [/en]
   *  [ja][/ja]
   */
  onClick: PropTypes.func
};

export default TabLikeButton;