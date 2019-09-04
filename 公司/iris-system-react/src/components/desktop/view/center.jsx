/* eslint-disable no-empty */
/* eslint-disable func-names */
/* eslint-disable no-undef */
/* eslint-disable class-methods-use-this */
/* eslint-disable react/no-unused-state */
/* eslint-disable react/sort-comp */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-const-assign */
/* eslint-disable react/prop-types */
/* eslint-disable no-console */
// import React, { Component, PropTypes } from 'react';
import React, { Component } from 'react';
// import { connect } from 'react-redux';
// import ClosePng from 'static/imgs/close.png';
import Tabs, { TabPane } from 'rc-tabs';
import TabContent from 'rc-tabs/lib/TabContent';
import ScrollableInkTabBar from 'rc-tabs/lib/ScrollableInkTabBar';
import 'rc-tabs/assets/index.css';
import { matchMenu } from './menus/menus';
// import { tabChange, activeKeyChange } from '../ducks';
// import Home from './home/home';

// const initTabs = [
//   {
//     name: '首页',
//     url: 'index',
//     content: <Home />,
//   },
// ];
let isRemove = false;
export default class Center extends Component {
  constructor(porps) {
    super(porps);
    this.state = {
      prevUrl: '',
      isDlt: false,
      tabs: [],
    };
    this.handleSelectMenu = this.handleSelectMenu.bind(this);
    this.setContentSize = this.setContentSize.bind(this);
  }

  // static propTypes = {
  //   tabs: PropTypes.array,
  //   activeKey: PropTypes.string,
  //   onTabChange: PropTypes.func.isRequired,
  //   onActiveKeyChange: PropTypes.func.isRequired,
  // };

  // static defaultProps = {
  //   tabs: [],
  //   activeKey: '',
  // };

  componentWillReceiveProps() {
    // console.log('props------------', this.props);
    // this.state.tabs = this.props.tabs;
    // this.state.activeKey = this.props.activeKey;
    $('.rc-tabs-content').scrollTop(0);
    // console.log('change');
  }

  componentWillMount = () => {
    this.state.tabs = this.props.tabs;
    // const { tabs, activeKey } = this.props;
    // this.setState(() => ({
    //   tabs,
    //   activeKey,
    // }));
  };

  componentDidMount() {
    const rc = this;
    this.setContentSize();
    window.onresize = function() {
      rc.setContentSize();
    };
  }

  setContentSize() {
    $('.rc-tabs-content').css({
      height: `${$('.rc-tabs')
        .eq(0)
        .height() -
        $('.rc-tabs-bar')
          .eq(0)
          .height()}px`,
      background: '#fff',
    });
  }

  handleSelectMenu(item) {
    try {
      window.hideObject();
    } catch (e) {}
    const { url } = item;
    const { tabs } = this.state;
    let isFind = false;
    tabs.forEach(tab => {
      if (tab.url === url) {
        isFind = true;
        localStorage.setItem('route-activeKey', tab.url);
        this.props.changeTabs({ tabs: false, activeKey: tab.url });
        // this.setState({ activeKey: tab.url });
      }
    });
    if (!isFind) {
      tabs.push(matchMenu(url));
      this.props.changeTabs({ tabs, activeKey: url });
      // this.setState({
      //   activeKey: url,
      //   tabs,
      // });
    }
  }

  onChange = activeKey => {
    if (!isRemove) {
      localStorage.setItem('route-activeKey', activeKey);
      this.props.changeTabs({ tabs: false, activeKey });
      // this.setState({
      //   activeKey,
      // });
    } else {
      isRemove = false;
    }
  };

  remove = url => {
    try {
      window.hideObject();
    } catch (e) {}
    // console.log(this.props);
    const { tabs, activeKey } = this.props;
    if (activeKey === url) {
      tabs.forEach((tab, index) => {
        if (tab.url === url) {
          const nextTab = tabs[index + 1] || tabs[index - 1];
          if (nextTab) {
            localStorage.setItem('route-activeKey', nextTab.url);
            this.props.changeTabs({ tabs: false, activeKey: nextTab.url });
            // this.setState({ activeKey: nextTab.url });
          }
        }
      });
    } else {
      isRemove = true;
    }
    const arr = tabs.filter(tab => tab.url !== url);
    this.setState({ tabs: arr });
    this.props.changeTabs({ tabs: arr, activeKey: false });
  };

  render() {
    const { activeKey, tabs } = this.props;
    return (
      <div>
        <Tabs
          style={{ background: '#fafafa' }}
          renderTabBar={() => <ScrollableInkTabBar />}
          renderTabContent={() => <TabContent animated={false} />}
          activeKey={activeKey}
          onChange={this.onChange}
          destroyInactiveTabPane
        >
          {tabs.map(tab => (
            <TabPane
              style={{ background: '#fff' }}
              // className="box-shadow"
              tab={
                <span>
                  {tab.name}
                  {tab.name !== '主页' && (
                    <button
                      type="button"
                      className="close_tab"
                      onClick={() => {
                        this.remove(tab.url);
                      }}
                    >
                      <span />
                      {/* <img src={ClosePng} alt="" /> */}
                    </button>
                  )}
                </span>
              }
              key={tab.url}
            >
              <div>{tab.content(this.handleSelectMenu)}</div>
            </TabPane>
          ))}
        </Tabs>
      </div>
    );
  }
}

// const mapStateToProps = state => ({
//   tabs: state.desktop.tabs,
//   activeKey: state.desktop.activeKey,
// });

// const mapDispatchToProps = {
//   onTabChange: tabChange,
//   onActiveKeyChange: activeKeyChange,
// };

// export default connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(Center);
