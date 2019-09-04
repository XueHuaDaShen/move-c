/* eslint-disable import/order */
/* eslint-disable no-plusplus */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable array-callback-return */
/* eslint-disable no-shadow */
/* eslint-disable import/named */
/* eslint-disable react/sort-comp */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable no-undef */
/* eslint-disable react/no-unused-state */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-console */
import React, { Component } from 'react';
// import { request } from 'tool';
// import { JrMessage } from 'ui';
import Header from './view/header1';
import Leftbar from './view/leftbar';
import Center from './view/center';
import { fomartMenu, matchMenu } from './view/menus/menus';
import './view/globdata';
import './index.less';

export default class Home extends Component {
  constructor() {
    super();
    this.state = {
      tabs: [],
      activeKey: 'home',
      menuList: [],
    };
  }

  componentWillMount() {
    this.getList();
  }

  componentDidMount() {
    $('body').addClass('overflow-hidden');
    // this.getList();
  }

  getList() {
    const data = JSON.parse(localStorage.getItem('IRISMENUS'));
    // console.log('menusdata', menusData);
    // console.log(data);
    const menus = fomartMenu(data);
    // console.log(menus);
    this.state.menuList = menus;
    const activeKey = localStorage.getItem('route-activeKey');
    // console.log('activeKey', activeKey);
    this.handleSubmit({
      item: { props: { val: activeKey === 'undefined' ? 'home' : activeKey } },
    });
  }

  handleSubmit({ item }) {
    const home = matchMenu('home');
    const menu = matchMenu(item.props.val);
    const arr = this.state.tabs;
    // console.log('arr', arr);
    // console.log('menu', menu);
    if (arr.length === 0) {
      if (item.props.val === 'home') {
        arr.push(home);
      } else {
        arr.push(home);
        arr.push(menu);
      }
    } else {
      let isFind = false;
      for (let i = 0; i < arr.length; i++) {
        const curr = arr[i];
        if (curr.url === menu.url) {
          isFind = true;
          break;
        } else {
          isFind = false;
        }
      }
      if (!isFind) {
        arr.push(menu);
      }
    }
    localStorage.setItem('route-activeKey', menu.url);
    this.setState({ activeKey: menu.url }, () => {
      this.setState({
        tabs: arr,
      });
    });
    // this.setState(() => ({
    //   activeKey: menu.url,
    //   tabs: arr,
    // }));
    // console.log(this.state.tabs, this.state.activeKey);
    // console.log('tabs----------------', this.state);
  }

  handleChangeTabs({ tabs, activeKey }) {
    if (tabs) {
      this.setState({ tabs });
    }
    if (activeKey) {
      this.setState({ activeKey });
    }
  }

  render() {
    return (
      <div style={{ width: '100%', height: '100%' }}>
        <Header />
        <Leftbar
          menuList={this.state.menuList}
          // tabs={this.state.tabs}
          onSubmit={this.handleSubmit.bind(this)}
        />
        <Center
          tabs={this.state.tabs}
          activeKey={this.state.activeKey}
          changeTabs={this.handleChangeTabs.bind(this)}
        />
      </div>
    );
  }
}
