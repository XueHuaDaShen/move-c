/* eslint-disable no-empty */
/* eslint-disable prefer-const */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable one-var */
/* eslint-disable prefer-rest-params */
/* eslint-disable prefer-spread */
/* eslint-disable no-undef */
/* eslint-disable no-param-reassign */
/* eslint-disable class-methods-use-this */
/* eslint-disable react/prop-types */
/* eslint-disable no-plusplus */
/* eslint-disable prefer-destructuring */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable prettier/prettier */
/* eslint-disable react/no-unused-state */
/* eslint-disable no-console */
import React, { Component } from 'react';
import Menu, { SubMenu, Item as MenuItem } from 'rc-menu';
import 'rc-menu/assets/index.css';
import './leftBar.less';

export default class Leftbar extends Component {
  static defaultProps = {
    menuList: [],
  };

  // eslint-disable-next-line react/sort-comp
  test = () => {};

  constructor(props) {
    super(props);

    this.state = {
      // selectedKeys: '',
      menuList: [], // 菜单列表
      menuNodes: [], // 菜单树
      userName: '测试', // 用户姓名
      unitName: '测试单位', // 单位名称
      menuAnimate: {
        appear(node, done){
          node.style.display='none';
          $(node).slideDown(done);
          return {
            stop(){
              // jq will call done on finish
              $(node).stop(true);
            }
          };
        },
        enter(){
          this.appear.apply(this,arguments);
        },
        leave(node, done){
          // console.log(node, done)
          node.style.display='';
          $(node).slideUp(done);
          return {
            stop(){
              // jq will call done on finish
              $(node).stop(true);
            }
          };              
        }
      }
    };
    this.selectMenu = this.selectMenu.bind(this);
  }

  componentWillMount() {
    // console.log('leftBar--------willmount', this.props);
    // console.log(this.state)
    this.state.menuList = this.props.menuList;
  }

  componentWillReceiveProps() {
    // console.log('leftBar--------ReceiveProps', this.props);
  }

  selectMenu = ({key, item, eve, sel}) => {
    try{
      window.hideObject();
    }catch(e){}
    if (this.props.onSubmit) {
      this.props.onSubmit({key, item, eve, sel});
    }
  };

  render() {
    const url = localStorage.getItem('route-activeKey');
    let f=1, e=1, defaultSelectedKeys;
    const menuList = this.state.menuList;
    const menus = [];
    for (let i = 0; i < menuList.length; i++) {
      const menu = menuList[i];
      if (menu.child) {
        const menuItem = [];
        let icon = menu.icon;
        for (let j = 0; j < menu.child.length; j++) {
          const item = menu.child[j];
          menuItem.push(
            <MenuItem key={`${i + 1  }-${  j + 1}`} val={item.url}>{item.name}</MenuItem>
          );
          if(item.url === url){
            icon = menu.iconed;
            f=(i+1);
            e=(j+1);
          }
        }
        menus.push(
          // eslint-disable-next-line jsx-a11y/alt-text
          <SubMenu key={i + 1} expandIcon={() => (<img src={icon} />)} title={menu.name} >
            {menuItem}
          </SubMenu>
        );
      } else {
        let icon = menu.icon;
        if(menu.url === url){
          icon = menu.iconed;
          f=(i+1);
          e='';
        }
        menus.push(<MenuItem key={i + 1} val={menu.url}><img src={icon} />{menu.name}</MenuItem>);
      }
    }
    defaultSelectedKeys = e ? [`${f}-${e}`] : [`${f}`];
    // console.log(defaultSelectedKeys)
    return (
      <div className="leftbar">
        <h2 className="leftBar-title">虹膜身份核查系统</h2>
        <Menu
          className="leftbar-menu"
          defaultSelectedKeys={defaultSelectedKeys}
          selectedKeys={defaultSelectedKeys}
          subMenuOpenDelay={1000}
          // openAnimation={this.state.menuAnimate}
          onSelect={this.selectMenu}
          mode="inline"
        >
          {menus}
        </Menu>
        <span className="leftBar-icon" />
      </div>
    );
  }
}
