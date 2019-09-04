/* eslint-disable no-unused-vars */
/* eslint-disable one-var */
/* eslint-disable react/button-has-type */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/no-unused-state */
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
import React, { Component } from 'react';
import { request } from 'tool';
import { JrMessage } from 'ui';
import './deviceParam.less';
import { appendLoading, removeLoading } from '../../../../loading/loading';

export default class DeviceParam extends Component {
  constructor() {
    super();
    this.state = {
      deviceData: {}
    }
    this.submitDevice = this.submitDevice.bind(this);
    this.getConfig = this.getConfig.bind(this);
  }

  componentWillMount() {
    // this.reset();
    // this.getList();
    this.getConfig();
  };

  // input, select 值改变事件
  // changeInput(e) {
  //   let ele = e.target;
  //   let key = ele.getAttribute("data-name");
  //   let value = ele.value;
  //   // if(key === 'l_eye' || key === 'r_eye' || key === 'noIdea'){
  //   //   value = ele.checked;
  //   // }
  //   this.setState({
  //     [key]: value
  //   })
  // }

  submitDevice() {
    const {
      leaderName, // 负责人姓名
      leaderCardno, // 负责人身份证
      deptName, // 机关名字
      deptCode, // 机关代码
      deviceCode, // 设备代码
      deviceName, // 设备代码
      deviceManuCode, // 设备制造商代码
      deviceManuName, // 设备制造商名字
      longitude, // 经度
      latitude, // 纬度
      id,
    } = this.state.deviceData;
    appendLoading();
    request({
      url: '/syconfig/updateConfig',
      param: {
        id,
        leaderName, // 负责人姓名
        leaderCardno, // 负责人身份证
        deptName, // 机关名字
        deptCode, // 机关代码
        deviceCode, // 设备代码
        deviceName, // 设备代码
        deviceManuCode, // 设备制造商代码
        deviceManuName, // 设备制造商名字
        longitude, // 经度
        latitude, // 纬度
      },
      method: 'post',
      onError: () => {
        removeLoading();
      },
    }).then(res => {
      removeLoading();
      if (res.code === 200) {
        //
        JrMessage.success('数据提交成功')
      }
      // else{
      //   JrMessage.error(`数据提交失败，失败原因：${res.message}，错误码：${res.code}`)
      // }
      // console.log('res--------', res);
    });
  }

  getConfig() {
    const rc = this;
    request({
      url: `/syconfig/list?t=${new Date()*1}`,
      param: {},
      method: 'get',
      onError: () => {
        removeLoading();
      },
    }).then(res => {
      if (res.code === 200) {
        rc.setState({
          deviceData: res.content
        })
      }
      // console.log('res--------', res);
    });
  }

  render() {
    let taskno, red, white, addr, caijino;
    const {
      // leaderName, // 负责人姓名
      // leaderCardno, // 负责人身份证
      deptName, // 机关名字
      deptCode, // 机关代码
      deviceCode, // 设备代码
      deviceName, // 设备代码
      deviceManuCode, // 设备制造商代码
      // deviceManuName, // 设备制造商名字
      longitude, // 经度
      latitude, // 纬度
      id,
    } = this.state.deviceData;
    return (
      <div className="deviceParam box-shadow">
        <div className="info-wrap">
          <div className="inner">
            <h2>基本信息</h2>
            <ul>
              {/* <li className="w-80">
                <div className="item">
                  <span className="txt">请求方ID：</span>
                  <div className="input-wrap"><input type="text" value={id} data-name="id" onChange={this.changeInput} /></div>
                </div>
              </li>
              <li className="w-80">
                <div className="item">
                  <span className="txt">请求任务号：</span>
                  <div className="input-wrap"><input type="text" value={taskno} data-name="taskno" onChange={this.changeInput} /></div>
                </div>
              </li> */}
              <li className="w-120">
                <div className="item">
                  <span className="txt">请求方公安机关代码：</span>
                  <div className="input-wrap"><input type="text" value={deptCode} data-name="deptCode" onChange={this.changeInput} /></div>
                </div>
              </li>
              <li className="w-120">
                <div className="item">
                  <span className="txt">请求方公安机关名称：</span>
                  <div className="input-wrap"><input type="text" value={deptName} data-name="deptName" onChange={this.changeInput} /></div>
                </div>
              </li>
              <li className="w-120">
                <div className="item">
                  <span className="txt">虹膜采集设备型号：</span>
                  <div className="input-wrap"><input type="text" value={deviceCode} data-name="deviceCode" onChange={this.changeInput} /></div>
                </div>
              </li>
              <li className="w-80">
                <div className="item w-50-percent">
                  <span className="txt">设备编号：</span>
                  <div className="input-wrap"><input type="text" value={deviceName} data-name="deviceName" onChange={this.changeInput} /></div>
                </div>
                <div className="item w-50-percent">
                  <span className="txt">设备厂商：</span>
                  <div className="input-wrap"><input type="text" value={deviceManuCode} data-name="deviceManuCode" onChange={this.changeInput} /></div>
                </div>
              </li>
              <li className="w-80">
                <div className="item w-50-percent">
                  <span className="txt">红外光亮度：</span>
                  <div className="input-wrap"><input type="text" value={red} data-name="red" onChange={this.changeInput} /></div>
                </div>
                <div className="item w-50-percent">
                  <span className="txt">白光亮度：</span>
                  <div className="input-wrap"><input type="text" value={white} data-name="white" onChange={this.changeInput} /></div>
                </div>
              </li>
              <li className="w-80">
                <div className="item w-33-percent">
                  <span className="txt">业务地点：</span>
                  <div className="input-wrap"><input type="text" value={addr} data-name="addr" onChange={this.changeInput} /></div>
                </div>
                <div className="item w-50 w-33-percent">
                  <span className="txt">经度：</span>
                  <div className="input-wrap"><input type="text" value={longitude} data-name="longitude" onChange={this.changeInput} /></div>
                </div>
                <div className="item w-50 w-33-percent">
                  <span className="txt">纬度：</span>
                  <div className="input-wrap"><input type="text" value={latitude} data-name="latitude" onChange={this.changeInput} /></div>
                </div>
              </li>
              {/* <li className="w-80">
                <div className="item">
                  <span className="txt">采集编号：</span>
                  <div className="input-wrap"><input type="text" value={caijino} data-name="caijino" onChange={this.changeInput} /></div>
                </div>
              </li> */}
            </ul>
          </div>
          <button onClick={this.submitDevice}>提交</button>
        </div>
      </div>
    );
  }
}
