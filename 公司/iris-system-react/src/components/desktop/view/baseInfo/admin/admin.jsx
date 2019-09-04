/* eslint-disable eqeqeq */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-children-prop */
/* eslint-disable prefer-destructuring */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/no-unused-state */
/* eslint-disable react/button-has-type */
/* eslint-disable react/style-prop-object */
/* eslint-disable no-undef */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable react/sort-comp */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable class-methods-use-this */
/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
/* eslint-disable no-plusplus */
/* eslint-disable prefer-const */
/* eslint-disable react/prefer-stateless-function */
import moment from 'moment';
import React, { Component } from 'react';
import { request } from 'tool';
import Table from 'rc-table';
import Switch from 'rc-switch';
import { JrMessage, JrDialog } from 'ui';
import Select, { Option } from 'rc-select';
import 'rc-select/assets/index.css';
import './admin.less';
import MD5 from 'md5';
import dataMapFn from '../../dataMapFn';
import { appendLoading, removeLoading } from '../../../../loading/loading';

const format = 'YYYY-MM-DD';
export default class Admin extends Component {
  constructor() {
    super();
    this.state = {
      dialogFormVisible: false,
      tableData: [],
      user: '', // 用户名
      pwd: '', // 密码
      power: '', // 权限
      powerData: [],
      message: '', // 基本信息
      name: '', // 姓名
      remark: '', // 备注
      resetDialog: false, // 删除弹框
      dialogTitle: '', // 弹框标题
      rowId: '', // 删除列的id
    }
    this.createDialog = this.createDialog.bind(this);
    this.editConfirm = this.editConfirm.bind(this);
    this.resetPwd = this.resetPwd.bind(this);
    this.handleResetPwd = this.handleResetPwd.bind(this);
    this.getLogList = this.getLogList.bind(this);
    this.getPowerList = this.getPowerList.bind(this);
    this.resetForm = this.resetForm.bind(this);
    this.createAdmin = this.createAdmin.bind(this);
    this.changeInput = this.changeInput.bind(this);
    this.inputOnBlur = this.inputOnBlur.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleChangeStatus = this.handleChangeStatus.bind(this);
  }

  componentWillMount() {
    // this.reset();
    this.getLogList();
  };

  createDialog() {
    this.setState({
      dialogTitle: '添加管理员',
      dialogFormVisible: true
    })
    this.getPowerList();
  }

  editConfirm(row) {
    this.setState({
      dialogTitle: '编辑管理员',
      dialogFormVisible: true,
      rowId: row.id,
      user: row.username, // 用户名
      // pwd: '', // 密码
      power: row.role.name, // 权限
      // message: '', // 基本信息
      name: row.profile.realname, // 姓名
      remark: row.profile.message, // 备注
    })
    this.getPowerList();
  }

  // 重置密码 弹框
  resetPwd(row) {
    this.setState({
      resetDialog: true,
      rowId: row.id,
    })
  }

  // 重置密码
  handleResetPwd(){
    const rc = this;
    const { rowId } = this.state;
    appendLoading();
    request({
      url: '/admin/resetPassword',
      param: {
        adminid: rowId
      },
      method: 'post',
      // onError: (err) => {JrMessage.error(`重置密码失败，失败原因：${err}`);}
    }).then((res) => {
      removeLoading();
      if(res.code === 200){
        JrMessage.success(`重置密码成功`);
        rc.setState({
          resetDialog: false,
        })
      }
      // else{
      //   JrMessage.error(`重置密码失败，失败原因：${res.message}，code：${res.code}`);
      // }
      // console.log('重置密码------------------：', res);
    });
  }

  // 获取数据
  getLogList() {
    const rc = this;
    request({
      url: '/admin/list',
      param: {
        pageNum: '1',
        pageSize: '10'
      },
      method: 'post',
      // onError: (err) => {console.log('err---', err)}
    }).then((res) => {
      if(res.code === 200){
        rc.setState({
          tableData: res.content.rows
        })
      }
      // console.log('res--------', res)
    });
  }

  // 获取权限
  getPowerList() {
    const rc = this;
    request({
      url: `/role/list?t=${new Date()*1}`,
      param: {},
      method: 'get',
      // onError: (err) => {console.log('err---', err)}
    }).then((res) => {
      if(res.code === 200){
        rc.setState({
          powerData: res.content
        })
      }
      // console.log('res--------', res)
    });
  }

  // 关闭弹框，重置表单数据
  resetForm() {
    this.setState({
      dialogFormVisible: false,
      user: '', // 用户名
      pwd: '', // 密码
      power: '', // 权限
      powerData: [],
      message: '', // 基本信息
      name: '', // 姓名
      remark: '', // 备注
    });
  }

  // 确认创建
  createAdmin() {
    const rc = this;
    const { rowId, user, pwd, power, powerData, message, name, remark, dialogTitle } = this.state;
    if(!user){
      JrMessage.error('请填写账号');
      return
    }
    if(dialogTitle !== '编辑管理员' && !pwd){
      JrMessage.error('请填写密码');
      return
    }
    if(!power){
      JrMessage.error('请选择权限');
      return
    }
    // if(!message){
    //   JrMessage.error('请填写基本信息');
    //   return
    // }
    if(!name){
      JrMessage.error('请填写姓名');
      return
    }
    if(!remark){
      JrMessage.error('请填写备注');
      return
    }
    appendLoading();
    let url = '/admin/register';
    let data = {
      username: user, // 账号
      password: MD5(pwd), // 密码
      roleid: dataMapFn(powerData, 'name', power, 'id'), // 权限
      // message, // 基本信息
      realname: name, // 姓名
      message: remark, // 备注
    };
    if(dialogTitle === '编辑管理员'){
      url = '/admin/update';
      data = {
        id: rowId,
        username: user, // 账号
        // password: MD5(pwd), // 密码
        roleid: dataMapFn(powerData, 'name', power, 'id'), // 权限
        // message, // 基本信息
        realname: name, // 姓名
        message: remark, // 备注
      }
    }
    // this.loading = true;
    request({
      url,
      param: data,
      method: 'post',
      onError: () => {
        removeLoading();
      },
    }).then((res) => {
      removeLoading();
      if(res.code === 200){
        JrMessage.success('添加成功');
        rc.setState({
          dialogFormVisible: false,
        })
        rc.resetForm()
        rc.getLogList()
      }
      // else{
      //   JrMessage.error(`添加失败，失败原因：${res.message}，错误码：${res.code}`)
      // }
      // console.log('res--------', res)
    });
  }

  // input, select 值改变事件
  changeInput(e) {
    let ele = e.target;
    let key = ele.getAttribute("data-name");
    let value = ele.value;
    // if(key === 'l_eye' || key === 'r_eye' || key === 'noIdea'){
    //   value = ele.checked;
    // }
    this.setState({
      [key]: value
    })
  }

  inputOnBlur(e) {
    let ele = e.target;
    let isRequired = ele.getAttribute("data-required") === 'required';
    let value = ele.value;
    if(isRequired && !value){
      $(ele).addClass('error-border');
    }else{
      $(ele).removeClass('error-border');
    }
  }

  handleSelect(val, key) {
    // console.log(val)
    this.setState({
      [key]: val || ''
    }, () => {
      // console.log(key, '-------', this.state[key])
    })
  }

  handleChangeStatus(value, record) {
    appendLoading();
    let status;
    if(value){
      // 禁用
      status = '1';
    }else{
      // 开启
      status = '0';
    }
    request({
      url: '/admin/update',
      param: {
        id: record.id,
        status
      },
      method: 'post',
      onError: () => {
        removeLoading();
      },
    }).then((res) => {
      removeLoading();
      if(res.code === 200){
        JrMessage.success('修改成功');
      }
      // else{
      //   JrMessage.error(`修改失败，失败原因：${res.message}，错误码：${res.code}`)
      // }
      // console.log('res--------', res)
    });
  }

  render() {
    const { dialogFormVisible, resetDialog, dialogTitle, tableData, user, pwd, power, powerData, message, name, remark } = this.state;
    const columns = [{
      title: '用户名', dataIndex: 'username', key:'username',
    }, {
      title: '用户角色', dataIndex: 'role.name', key:'role.name',
    }, {
      title: '姓名', dataIndex: 'profile.realname', key:'profile.realname',
    }, {
      title: '描述', dataIndex: 'profile.message', key:'profile.message',
    }, {
      title: '创建时间', dataIndex: 'createAt', key:'createAt', render: (record) => <span>{moment(record.createAt).format(format)}</span>
    }, {
      title: '最后操作时间', dataIndex: 'operateAt', key:'operateAt', render: (record) => <span>{moment(record.operateAt).format(format)}</span>
    }, {
      title: '状态', dataIndex: '', key:'status', render: (record) => <Switch
      onChange={(value) => {this.handleChangeStatus(value, record)}}
      defaultChecked={record.status!=0}
      checkedChildren="禁用"
      unCheckedChildren="开启"
    />
    }, {
      title: 'Operations', dataIndex: '', key:'operations', render: (record) => <div><a href="#" onClick={() => {this.editConfirm(record)}}>编辑</a><a href="#" style={{marginLeft: '10px'}} onClick={() => {this.resetPwd(record)}}>重置密码</a></div>,
    }];
    // tableData.map()
    let data = [];
    tableData.forEach((item, index) => {
      let obj = JSON.parse(JSON.stringify(item));
      obj.key = index;
      data.push(obj);
    })
    // const data = [
    //   { name: 'Jack', age: 28, address: 'some where', key:'1' },
    //   { name: 'Rose', age: 36, address: 'some where', key:'2' },
    // ];
    const childResetPwd = (
      <div>确定重置当前账号的密码吗？</div>
    )
    const childCreate = (
      <div className="personal-info">
        <table>
          <tbody>
            <tr>
              <td>
                <label className="required">用户名：</label>
              </td>
              <td>
                <div className="cell">
                  <input
                    type="text"
                    value={user}
                    data-name="user"
                    data-required="required"
                    onChange={this.changeInput}
                    onBlur={this.inputOnBlur}
                  />
                </div>
              </td>
            </tr>
            {dialogTitle !== '编辑管理员' && <tr>
              <td>
                <label className="required">密码：</label>
              </td>
              <td>
                <div className="cell">
                  <input
                    type="password"
                    value={pwd}
                    data-name="pwd"
                    // placeholder="密码选填，默认6个6"
                    onChange={this.changeInput}
                  />
                </div>
              </td>
            </tr>}
            <tr>
              <td>
                <label className="required">权限：</label>
              </td>
              <td>
                <div className="cell">
                  <Select
                    className="error-border"
                    defaultValue={power}
                    onChange={e => {
                      this.handleSelect(e && e.target ? e.target.value : e, 'power');
                    }}
                    dropdownMenuStyle={{ maxHeight: 200 }}
                    allowClear
                  >
                    {powerData.map(current => (
                      <Option key={`${current.name}`} value={`${current.name}`}>
                        {current.name}
                      </Option>
                    ))}
                  </Select>
                </div>
              </td>
            </tr>
            {/* <tr>
              <td>
                <label className="required">基本信息：</label>
              </td>
              <td>
                <div className="cell">
                  <input
                    type="text"
                    value={message}
                    data-name="message"
                    onChange={this.changeInput}
                  />
                </div>
              </td>
            </tr> */}
            <tr>
              <td>
                <label className="required">姓名：</label>
              </td>
              <td>
                <div className="cell">
                  <input
                    type="text"
                    value={name}
                    data-name="name"
                    onChange={this.changeInput}
                  />
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <label className="required">备注：</label>
              </td>
              <td>
                <div className="cell">
                  <textarea name="" id="" cols="30" rows="10" value={remark} data-name="remark" onChange={this.changeInput} />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
    return (
      <div className="admin">
        <div className="create-btn-wrap">
          <button onClick={this.createDialog}>添加</button>
        </div>
        <div className="data-container box-shadow">
          {
            data.length === 0 ?
            <p className="nodata">暂无数据</p> :
            <Table columns={columns} data={data} />
          }
        </div>
        <JrDialog
          title="重置密码"
          children={childResetPwd}
          onOk={this.handleResetPwd}
          onCancel={() => {this.setState({
            resetDialog: false
          })}}
          visible={resetDialog}
        />
        <JrDialog
          title="添加管理员"
          children={childCreate}
          onCancel={this.resetForm}
          onOk={this.createAdmin}
          visible={dialogFormVisible}
        />
      </div>
    );
  }
}
