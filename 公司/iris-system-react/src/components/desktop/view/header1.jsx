/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable no-alert */
/* eslint-disable react/button-has-type */
/* eslint-disable no-undef */
/* eslint-disable no-useless-return */
/* eslint-disable no-unused-vars */
/* eslint-disable prefer-const */
/* eslint-disable no-plusplus */
/* eslint-disable no-console */
/* eslint-disable prefer-destructuring */
/* eslint-disable camelcase */
/* eslint-disable react/no-unused-state */
/* eslint-disable react/no-children-prop */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable react/sort-comp */
/* eslint-disable class-methods-use-this */
import moment from 'moment';
import React, { Component } from 'react';
import { request, response } from 'tool';
import { JrDialog, JrMessage } from 'ui';
import Calendar from 'rc-calendar';
import DatePicker from 'rc-calendar/lib/Picker';
import cn from 'rc-calendar/lib/locale/zh_CN';
import Select, { Option } from 'rc-select';
import JrButton from 'ui/JrButton';
// import Loading from 'rc-loading';
import 'rc-select/assets/index.css';
import 'rc-calendar/assets/index.css';
import MD5 from 'md5';
import dataMapFn from './dataMapFn';
import { getData } from './globdata';

const format = 'YYYY-MM-DD';
export default class Header extends Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      isClick: false,
      showAdmin: false,
      dialogVisible: false, // 弹框
      pwdDialog: false, // 修改密码弹框
      // 个人资料
      p_type: '', // 人员类型
      p_type_data: [],
      p_name: '', // 姓名
      p_card_type: '', // 证件类型
      p_card_type_data: [],
      p_card_no: '', // 证件号
      p_sex: '', // 性别
      p_sex_data: [],
      p_country: '', // 国籍
      p_country_data: [],
      p_nation: '', // 民族
      p_nation_data: [],
      p_birth: '', // 出生日期
      p_huji: '', // 户籍地址
      p_huji_data: [],
      p_card_addr: '', // 证件采集地址
      p_card_addr_data: [],
      p_valid_time: '', // 有效期
      p_phone: '', // 手机号
      p_qita: '', // 其他联系方式
      userProfile: {}, // 个人信息
    };
    this.changeAdmin = this.changeAdmin.bind(this);
    this.hideAdmin = this.hideAdmin.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.submitInfo = this.submitInfo.bind(this);
    this.handleShowInfo = this.handleShowInfo.bind(this);
    this.editPwd = this.editPwd.bind(this);
    this.handleClosePwdDialog = this.handleClosePwdDialog.bind(this);
    this.submitPwd = this.submitPwd.bind(this);
    this.changeInput = this.changeInput.bind(this);
    this.getTimeFn = this.getTimeFn.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.readCard = this.readCard.bind(this);
  }

  handleClose() {
    this.setState({
      dialogVisible: false,
    });
  }

  // 读取二代身份证
  readCard() {
    // const rc = this;
    const result = window.readCard();
    this.setState({
      isClick: true,
    });
    if (result.empty) {
      JrMessage.error(result.error);
    } else {
      const {
        p_card_type_data,
        p_sex_data,
        p_country_data,
        p_nation_data,
      } = this.state;
      // alert(result.cardType);
      // alert(dataMapFn(p_card_type_data, 'code', result.cardType, 'name'));
      this.setState({
        p_name: result.name, // 姓名
        p_card_type: dataMapFn(
          p_card_type_data,
          'code',
          result.cardType,
          'name'
        ), // 证件类型
        p_card_no: result.cardNo, // 证件号
        // p_img: result.img ? imgBase64 + result.img : '', // 证件照片
        p_sex: dataMapFn(p_sex_data, 'code', result.sex, 'name'), // 性别
        p_country: '中国', // 国籍
        p_nation: dataMapFn(p_nation_data, 'name', result.nation, 'name'), // 民族
        p_birth: result.birth, // 出生日期
        p_huji: result.address, // 住址
        p_card_addr: result.office, // 签发机关
        p_valid_time: `${result.startAt}--${result.endAt}`, // 有效期
      });
    }
    this.setState({
      isClick: false,
    });
  }

  // 获取个人信息
  getUserProfile() {
    const rc = this;
    const {
      p_card_type_data,
      p_sex_data,
      p_country_data,
      p_nation_data,
    } = this.state;
    request({
      url: `/admin/getProfile?t=${new Date() * 1}`,
      param: {},
      method: 'get',
      // onError: err => {
      //   JrMessage.error(`个人信息获取失败，失败原因：${err}`);
      // },
    }).then(res => {
      if (res.code === 200) {
        let data = res.content;
        rc.setState({
          p_name: data.realname,
          p_card_type: dataMapFn(
            p_card_type_data,
            'code',
            data.cardType,
            'name'
          ),
          p_card_no: data.cardno,
          p_sex: dataMapFn(p_sex_data, 'code', data.sex, 'name'),
          p_birth: data.birthday,
          p_country: dataMapFn(p_country_data, 'code', data.country, 'name'),
          p_nation: dataMapFn(p_nation_data, 'name', data.nation, 'name'), // 民族
          p_phone: data.phone1,
          p_qita: data.phone2,
          dialogVisible: true,
        });
      }
      // else {
      //   JrMessage.error(
      //     `个人信息获取失败，失败原因：${res.message}，错误码：${res.code}`
      //   );
      // }
      // console.log('res--------', res);
    });
  }

  submitInfo() {
    const {
      p_card_type_data,
      p_sex_data,
      p_country_data,
      p_nation_data,
      p_name,
      p_card_type,
      p_card_no,
      p_sex,
      p_birth,
      p_country,
      p_nation,
      p_phone,
      p_qita,
    } = this.state;
    const rc = this;
    this.setState({
      loading: true,
    });
    request({
      url: '/admin/updateProfile',
      param: {
        realname: p_name,
        cardType: dataMapFn(p_card_type_data, 'name', p_card_type, 'code'),
        cardno: p_card_no,
        sex: dataMapFn(p_sex_data, 'name', p_sex, 'code'),
        birthday: p_birth,
        country: dataMapFn(p_country_data, 'name', p_country, 'code'),
        nation: dataMapFn(p_nation_data, 'name', p_nation, 'code'),
        phone1: p_phone,
        phone2: p_qita,
      },
      method: 'post',
      // onError: err => {
      //   JrMessage.error(
      //     `数据提交失败，失败原因：${err.message}，错误码：${err.code}`
      //   );
      // },
    }).then(res => {
      rc.setState({
        loading: false,
      });
      if (res.code === 200) {
        //
        JrMessage.success('数据提交成功', '', 0.5);
        rc.setState({
          dialogVisible: false,
        });
      }
      //  else {
      //   JrMessage.error(
      //     `数据提交失败，失败原因：${res.message}，错误码：${res.code}`
      //   );
      // }
      // console.log('res--------', res);
    });
  }

  handleShowInfo() {
    this.getUserProfile();
  }

  editPwd() {
    this.setState({
      pwdDialog: true,
    });
  }

  handleClosePwdDialog() {
    this.setState({
      oldPwd: '',
      newPwd: '',
      okPwd: '',
      pwdDialog: false,
    });
  }

  submitPwd() {
    const rc = this;
    const { oldPwd, newPwd, okPwd } = this.state;
    if (!oldPwd) {
      JrMessage.error('请输入旧密码', '', 0.5);
      return;
    }
    if (!newPwd) {
      JrMessage.error('请输入新密码', '', 0.5);
      return;
    }
    if (!okPwd) {
      JrMessage.error('请确认新密码', '', 0.5);
      return;
    }
    if (newPwd !== okPwd) {
      JrMessage.error('两次新密码不一致', '', 0.5);
      return;
    }
    this.setState({
      loading: true,
    });
    request({
      url: '/admin/changePassword',
      param: {
        oldPass: CryptoJS.HmacMD5(
          CryptoJS.MD5(oldPwd).toString(),
          '12345'
        ).toString(),
        newPass: MD5(newPwd),
        random: '12345',
      },
      method: 'post',
    }).then(res => {
      rc.setState({
        loading: false,
      });
      if (res.code === 200) {
        //
        JrMessage.success('密码修改成功', '', 0.5);
        rc.setState({
          pwdDialog: false,
        });
        localStorage.clear();
        response.push('/');
      }
      // else {
      //   JrMessage.error(
      //     `密码修改失败，失败原因：${res.message}，错误码：${res.code}`
      //   );
      // }
      // console.log('res--------', res);
    });
  }

  // input, select 值改变事件
  changeInput(e) {
    const ele = e.target;
    const key = ele.getAttribute('data-name');
    let value = ele.value;
    if (key === 'noIdea') {
      value = ele.checked;
    }
    this.setState({
      [key]: value,
    });
  }

  getTimeFn(val, key) {
    this.setState({
      [key]: val ? moment(val).format(format) : '',
    });
  }

  handleSelect(val, key) {
    this.setState({
      [key]: val || '',
    });
  }

  hideAdmin() {
    // this.setState({
    //   showAdmin: false,
    // });
  }

  changeAdmin() {
    const {
      showAdmin,
      p_country_data,
      p_card_type_data,
      p_sex_data,
      p_nation_data,
    } = this.state;
    this.setState({
      showAdmin: !showAdmin,
    });
    if (p_country_data.length === 0) {
      this.getDataList('country', 'p_country_data');
    }
    if (p_card_type_data.length === 0) {
      this.getDataList('cardgroup', 'p_card_type_data');
    }
    if (p_sex_data.length === 0) {
      this.getDataList('sex', 'p_sex_data');
    }
    if (p_nation_data.length === 0) {
      this.getDataList('nation', 'p_nation_data');
    }
    return false;
  }

  componentWillMount() {
    // let data = getData();
    // // console.log(data)
    // this.setState({
    //   p_nation_data: data.nationData,
    //   p_country_data: data.countryData,
    //   p_card_type_data: data.cardTypeData,
    //   p_type_data: data.perTypeData,
    //   p_sex_data: data.sexData,
    // });
    // this.getAllTypeByName('userGroup');
    // this.getAllTypeByName('deviceGroup');
    // this.getAllTypeByName('eyeHurtType');
    // this.getAllTypeByName('eyeRegType');
    // this.getList();
    // this.getDataList('nation', 'p_nation_data', 'hy_nation_data'); // nation/list 民族列表
    // this.getDataList('country', 'p_country_data'); // country/list 国家列表
    // this.getDataList('cardgroup', 'p_card_type_data'); // cardgroup/list 证件类型列表
    // this.getDataList('syregaddr') ; // syregaddrgroup/list 采集场地类型列表
    // this.getDataList('syusergroup', 'p_type_data', 'hy_type_data') ; // syusergroup/list 人员类别
    // this.getDataList('sydevicegroup') ; // sydevicegroup/list 采集设备类别
    // this.getDataList('syeyeregtype'); // syeyeregtype/list 左右眼采集代码列表
    // this.getDataList('syeyehurttype', 'noIdeaData') ; // syregaddrgroup/list 左右眼缺失情况
    // this.getDataList('sex', 'p_sex_data'); // syregaddrgroup/list 性别列表
  }

  // 获取民族，国家列表
  getDataList(name, key) {
    const rc = this;
    request({
      url: `/${name}/list?t=${new Date() * 1}`,
      param: {},
      method: 'get',
      onError: () => {
        // console.log('err---', err);
      },
    }).then(res => {
      if (res.code === 200) {
        const arr = [{ code: '', name: '请选择' }];
        for (let i = 0; i < res.content.length; i++) {
          arr.push(res.content[i]);
        }
        rc.setState(
          {
            [key]: arr,
          },
          () => {
            // console.log(rc.state[key]);
          }
        );
      }
      // console.log(`${name}--------`, res);
    });
  }

  editPersonInfo = () => {};

  editPassword = () => {};

  logOut = () => {
    response.push('/');
    localStorage.clear();
  };

  render() {
    const {
      loading,
      isClick,
      showAdmin,
      dialogVisible,
      p_card_type_data,
      p_sex_data,
      p_country_data,
      p_name,
      p_card_type,
      p_card_no,
      p_sex,
      p_birth,
      p_country,
      p_phone,
      p_qita,
      pwdDialog,
      oldPwd,
      newPwd,
      okPwd,
    } = this.state;
    const child = (
      <div className="personal-info">
        <table>
          <tbody>
            <tr>
              <td colSpan="2" style={{ textAlign: 'center' }}>
                <div className="cell">
                  <JrButton
                    type="primary"
                    className="read-card"
                    onClick={this.readCard}
                    disabled={isClick}
                  >
                    读取二代身份证
                  </JrButton>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <label>姓名：</label>
              </td>
              <td>
                <div className="cell">
                  <input
                    type="text"
                    value={p_name}
                    data-name="p_name"
                    onChange={this.changeInput}
                  />
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <label>证件类型：</label>
              </td>
              <td>
                <div className="cell">
                  <Select
                    defaultValue={p_card_type}
                    onChange={e => {
                      this.handleSelect(
                        e && e.target ? e.target.value : e,
                        'p_card_type'
                      );
                    }}
                    value={p_card_type}
                    dropdownMenuStyle={{ maxHeight: 200 }}
                    allowClear
                  >
                    {p_card_type_data.map(current => (
                      <Option key={`${current.code}`} value={`${current.name}`}>
                        {current.name}
                      </Option>
                    ))}
                  </Select>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <label>证件号：</label>
              </td>
              <td>
                <div className="cell">
                  <input
                    type="text"
                    value={p_card_no}
                    data-name="p_card_no"
                    onChange={this.changeInput}
                  />
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <label>性别：</label>
              </td>
              <td>
                <div className="cell">
                  <Select
                    defaultValue={p_sex}
                    className="w100"
                    onChange={e => {
                      this.handleSelect(
                        e && e.target ? e.target.value : e,
                        'p_sex'
                      );
                    }}
                    value={p_sex}
                    dropdownMenuStyle={{ maxHeight: 200 }}
                    allowClear
                  >
                    {p_sex_data.map(current => (
                      <Option key={`${current.code}`} value={`${current.name}`}>
                        {current.name}
                      </Option>
                    ))}
                  </Select>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <label>出生日期：</label>
              </td>
              <td>
                <div className="cell">
                  <DatePicker
                    animation="slide-up"
                    calendar={
                      <Calendar format={format} locale={cn} showDateInput />
                    }
                    Value={moment(p_birth).format(format)}
                    onChange={value => this.getTimeFn(value, 'p_birth')}
                  >
                    {({ value }) => (
                      <span>
                        <input readOnly tabIndex="-1" value={p_birth} />
                      </span>
                    )}
                  </DatePicker>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <label>国籍：</label>
              </td>
              <td>
                <div className="cell">
                  <Select
                    defaultValue={p_country}
                    className="w100"
                    onChange={e => {
                      this.handleSelect(
                        e && e.target ? e.target.value : e,
                        'p_country'
                      );
                    }}
                    value={p_country}
                    dropdownMenuStyle={{ maxHeight: 200 }}
                    allowClear
                  >
                    {p_country_data.map(current => (
                      <Option key={`${current.code}`} value={`${current.name}`}>
                        {current.name}
                      </Option>
                    ))}
                  </Select>
                </div>
              </td>
            </tr>
            <tr>
              <td className="td-title">
                <label>手机号：</label>
              </td>
              <td>
                <div className="cell">
                  <input
                    type="text"
                    value={p_phone}
                    data-name="p_phone"
                    onChange={this.changeInput}
                  />
                </div>
              </td>
            </tr>
            <tr>
              <td className="td-title">
                <label>其他联系方式：</label>
              </td>
              <td>
                <div className="cell">
                  <input
                    type="text"
                    value={p_qita}
                    data-name="p_qita"
                    onChange={this.changeInput}
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
    const childEditPwd = (
      <div className="personal-info">
        <table>
          <tbody>
            <tr>
              <td>
                <label>旧密码：</label>
              </td>
              <td>
                <div className="cell">
                  <input
                    type="password"
                    value={oldPwd}
                    data-name="oldPwd"
                    onChange={this.changeInput}
                  />
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <label>新密码：</label>
              </td>
              <td>
                <div className="cell">
                  <input
                    type="password"
                    value={newPwd}
                    data-name="newPwd"
                    onChange={this.changeInput}
                  />
                </div>
              </td>
            </tr>
            <tr>
              <td className="td-title">
                <label>确认密码：</label>
              </td>
              <td>
                <div className="cell">
                  <input
                    type="password"
                    value={okPwd}
                    data-name="okPwd"
                    onChange={this.changeInput}
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
    return (
      <div className="myHeader">
        <div className="top">
          <div className="police-name">
            <span className="icon" />
            <strong className="name">北京市公安局刑侦大队总部</strong>
          </div>
          {/* <div className="download">
            <span className="text">下载</span>
          </div> */}
          <div className={showAdmin ? 'admin showAdmin' : 'admin'}>
            <p onClick={this.changeAdmin}>
              {/* <input type="text" onBlur={this.hideAdmin} /> */}
              <span className="text">管理员</span>
              <i className="el-icon-caret-bottom" />
            </p>
            {showAdmin && (
              <ul className="admin-info">
                <li onClick={this.handleShowInfo}>个人资料</li>
                <li onClick={this.editPwd}>修改密码</li>
                <li onClick={this.logOut}>退出登录</li>
              </ul>
            )}
          </div>
        </div>
        <JrDialog
          title="个人资料"
          children={child}
          onCancel={this.handleClose}
          onClose={this.handleClose}
          onOk={this.submitInfo}
          okText="保存"
          visible={dialogVisible}
        />
        <JrDialog
          title="修改密码"
          children={childEditPwd}
          onCancel={this.handleClosePwdDialog}
          onClose={this.handleClosePwdDialog}
          onOk={this.submitPwd}
          okText="提交"
          visible={pwdDialog}
        />
      </div>
    );
  }
}
