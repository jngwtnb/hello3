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
  }

  componentDidMount() {
    var node = ReactDOM.findDOMNode(this);
    node.addEventListener('click', this.onClick);
  }

  componentWillUnmount() {
    var node = ReactDOM.findDOMNode(this);
    node.removeEventListener('click', this.onClick);
    console.log("TabLikeButton.componentWillUnmount");
  }

  componentWillReceiveProps(nextProps) {
    this.refs.radio.checked = nextProps.active;

//    this.setState({
//      active: nextProps.active,
//    });
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