
export default class TabLikeButton extends BasicComponent {
  constructor(...args) {
    super(...args);

    const callback = (name, event) => {
      if (this.props[name]) {
        return this.props[name](event);
      }
    };
    this.onClick = callback.bind(this, 'onClick');
  }

  componentWillUnmount() {
    const node = this._tabbar;
    node.removeEventListener('prechange', this.onPreChange);
    node.removeEventListener('postchange', this.onPostChange);
    node.removeEventListener('reactive', this.onReactive);
  }

  render() {
    return (
      <div className="balance-button">
        <input type="radio" style={{display: "none"}} id="balanceTab" />
        <button className="tabbar__button" onClick={this.handleClickBalanceTab.bind(this)}>
        <div className="tabbar__icon">
          <ons-icon icon="fa-coins" />
        </div>
        <div className="tabbar__label">残高</div>
        </button>
      </div>
    );
} 

}

