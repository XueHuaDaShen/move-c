/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */
/* eslint-disable func-names */
/* eslint-disable consistent-return */
/* eslint-disable prefer-destructuring */
/* eslint-disable react/sort-comp */
/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-console */
/* eslint-disable no-undef */
/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import CryptoJS from 'crypto-js';
// import { Link } from 'react-router';
import { createForm } from 'rc-form';
import { JrMessage } from 'ui';
import { request, response } from 'tool';
import Loading from 'rc-loading';
import MD5 from 'md5';
import './index.less';
import bg from 'static/img/login/bj-icon.png';
import { appendLoading, removeLoading } from '../loading/loading';

class Login extends Component {
  constructor(props) {
    super(props);
    this.rememberPassword = false;
    this.state = {
      isClick: false, // 双击
      loading: false,
      lang: 'en',
      enlang: {
        welcome: 'Welcome to Iris Identity Checking System',
      },
      zhlang: {
        welcome: '欢迎使用虹膜身份核验系统',
      },
      user: '',
      pwd: '',
    };
    this.login = this.login.bind(this);
    this.getMenu = this.getMenu.bind(this);
    this.changeInput = this.changeInput.bind(this);
    this.changeLanguage = this.changeLanguage.bind(this);
  }

  componentDidMount() {
    $('body').removeClass('overflow-hidden');
    const rc = this;
    // this.register();
    document.onkeypress = function(e) {
      if (e.keyCode === 13) {
        rc.login();
      }
    };
  }

  changeLanguage() {
    const { lang } = this.state;
    if (lang === 'en') {
      this.setState({
        lang: 'zh',
      });
    } else {
      this.setState({
        lang: 'en',
      });
    }
  }

  register() {
    const rc = this;
    this.setState({
      isClick: true,
      loading: true,
    });
    request({
      url: '/admin/register',
      param: {
        username: 'ceshi123',
        password: MD5('123456'),
        roleid: '123',
      },
      method: 'post',
      // onError: err => {
      //   rc.setState({
      //     isClick: false,
      //     loading: false,
      //   });
      //   // console.log('err---', err);
      // },
    }).then(data => {
      rc.setState({
        isClick: false,
        loading: false,
      });
      if (data.code === 200) {
        localStorage.setItem('token', data.content);
        response.push('/desktop');
      }
      // else {
      //   JrMessage.error(`注册失败 ${data.message}`);
      // }
      // console.log('data--------', data);
    });
  }

  // input, select 值改变事件
  changeInput(e) {
    const ele = e.target;
    const key = ele.getAttribute('data-name');
    let value = ele.value;
    if (key === 'l_eye' || key === 'r_eye' || key === 'noIdea') {
      value = ele.checked;
    }
    this.setState({
      [key]: value,
    });
  }

  login = () => {
    const rc = this;
    const { user, pwd } = this.state;
    if (!user) {
      JrMessage.error('请输入用户名');
      return false;
    }
    if (!pwd) {
      JrMessage.error('请输入密码');
      return false;
    }
    appendLoading();
    request({
      url: '/admin/login',
      param: {
        username: user,
        password: CryptoJS.HmacMD5(
          CryptoJS.MD5(pwd).toString(),
          '12345'
        ).toString(),
        random: '12345',
      },
      method: 'post',
      onError: () => {
        removeLoading();
      },
    }).then(data => {
      // rc.setState({
      //   isClick: false,
      //   loading: false,
      // });
      // console.log(data);
      removeLoading();
      if (data.code === 200) {
        localStorage.setItem('token', data.content);
        rc.getMenu();
      }
      // else {
      //   JrMessage.error(`登录失败 ${data.message}`);
      // }
      // console.log('data--------', data);
    });
  };

  getMenu() {
    // const rc = this;
    request({
      url: `/rolemenu/getByRole?t=${new Date() * 1}`,
      param: {},
      method: 'get',
      // onError: err => {
      //   JrMessage.error(`获取菜单失败，失败原因：${err}`, '', 1);
      // },
    }).then(res => {
      if (res.code === 200) {
        const data = res.content;
        if (data.length === 0) {
          JrMessage.error(`获取菜单失败`);
        } else {
          localStorage.setItem('IRISMENUS', JSON.stringify(data));
          localStorage.setItem('route-activeKey', 'home');
          response.push('/desktop');
        }
        // rc.state.menuList = menus;
      }
      // else {
      //   JrMessage.error(
      //     `获取菜单失败，失败原因：${res.message}，错误码：${res.code}`,
      //     '',
      //     1
      //   );
      // }
      // console.log('res--------', res);
    });
  }

  render() {
    // const { form } = this.props;
    // const { getFieldProps } = form;
    const { user, pwd, loading, isClick } = this.state;
    let language = {};
    const { enlang, zhlang, lang } = this.state;
    if (lang === 'en') {
      language = enlang;
    } else {
      language = zhlang;
    }
    return (
      <Loading spinning={loading} type="fence">
        <div className="login">
          <div className="top">
            <span className="icon" />
            <p className="text">{language.welcome}</p>
            {/* <div className="operate">
              <div className="download">
                <span className="text">下载</span>
              </div>
              <div className="admin">
                <span className="text">管理员</span>
                <i className="el-icon-caret-bottom" />
                <ul className="admin-info">
                  <li>个人资料</li>
                  <li>退出登录</li>
                </ul>
              </div>
            </div> */}
          </div>
          <div className="mid">
            <div className="bj-icon">
              <img src={bg} alt="" />
            </div>
            <div className="login-form box-shadow">
              <div className="tag" onClick={this.changeLanguage}>
                <span>中</span>/<span>英</span>
              </div>
              <h2>用户登录</h2>
              <div className="user">
                <span className="icon" />
                <input
                  type="text"
                  value={user}
                  data-name="user"
                  onChange={this.changeInput}
                />
              </div>
              <div className="pwd">
                <span className="icon" />
                <input
                  type="password"
                  value={pwd}
                  data-name="pwd"
                  onChange={this.changeInput}
                />
              </div>
              <button
                className="button"
                disabled={isClick}
                onClick={this.login}
              >
                登&nbsp;&nbsp;&nbsp;&nbsp;录
              </button>
            </div>
          </div>
          <div className="bot">
            <p className="text">
              <span>法律声明</span>
              &nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;
              <span>联系我们</span>
            </p>
            <p className="banquan">
              Copyright © 2017-2019 天津中科虹星科技有限公司 版权所有
            </p>
          </div>
        </div>
      </Loading>
    );
  }
}

export default createForm()(Login);
