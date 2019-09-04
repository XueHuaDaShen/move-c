/* eslint-disable react/no-children-prop */
/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable func-names */
/* eslint-disable prefer-destructuring */
/* eslint-disable camelcase */
/* eslint-disable react/button-has-type */
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
import moment from 'moment';
import React, { Component } from 'react';
import { request } from 'tool';
import { JrDialog, JrMessage } from 'ui';
import JrButton from 'ui/JrButton';
import Calendar from 'rc-calendar';
import DatePicker from 'rc-calendar/lib/Picker';
import cn from 'rc-calendar/lib/locale/zh_CN';
import Select, { Option } from 'rc-select';
import 'rc-select/assets/index.css';
import 'rc-calendar/assets/index.css';
// import MyDatepicker from '../../../datepicker/date';
import './hy.less';
import dataMapFn from '../../dataMapFn';
import * as globdata from '../../globdata';
import { appendLoading, removeLoading } from '../../../../loading/loading';

const imgBase64 = 'data:image/jpg;base64,';
const format = 'YYYY-MM-DD';

export default class IrisHy extends Component {
  constructor() {
    super();
    this.state = {
      isClick: false, // 双击
      // 虹膜信息
      cj_no: '', // 编号
      cj_time: '', // 时间
      cj_who: '', // 人
      cj_addr: '', // 地点
      cj_remark: '', // 备注
      // 人员信息
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
      noIdea: false, // 无法采集
      noIdeaItem: '', // 所选择的某一条因素 
      noIdeaData: [], // 无法采集所需要选择的因素数据
      l_eye: true, // 左眼
      r_eye: true, // 右眼
      l_eye_img: '',
      r_eye_img: '',
      showDialog: false,
      dialogChild: '',
    }
    this.changeInput = this.changeInput.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.getTimeFn = this.getTimeFn.bind(this);
    this.readCard = this.readCard.bind(this);
    this.handWork = this.handWork.bind(this);
    this.submit = this.submit.bind(this);
    this.reset = this.reset.bind(this);
    this.startCaiji = this.startCaiji.bind(this);
    this.hideDevice = this.hideDevice.bind(this);
  }

  hideDevice() {
    window.hideObject();
    this.setState({
      isClick: false
    })
  }

  // input, select 值改变事件
  changeInput(e) {
    let ele = e.target;
    let key = ele.getAttribute("data-name");
    let value = ele.value;
    if(key === 'l_eye' || key === 'r_eye' || key === 'noIdea'){
      value = ele.checked;
    }
    if(key === 'noIdea' && !value){
      this.setState({
        noIdeaItem: '',
      })
    }
    this.setState({
      [key]: value
    })
  }

  handleSelect(val, key) {
    this.setState({
      [key]: val || ''
    })
  }

  getTimeFn(val, key) {
    this.setState({
      [key]: val ? moment(val).format(format) : ''
    })
  }

  // 开始采集
  startCaiji() {
    this.setState({
      l_eye_img: '',
      r_eye_img: '',
    })
    const { l_eye, r_eye } = this.state;
    if(!l_eye){
      // 左眼无法采集
      window.leftEyeFalse = true;
    }else{
      window.leftEyeFalse = false;
    }
    if(!r_eye){
      // 右眼无法采集
      window.rightEyeFalse = true;
    }else{
      window.rightEyeFalse = false;
    }
    this.setState({
      isClick: true
    })
    window.start_caiji_eye();
    const rc = this;
    let setRcData = function() {
      window.caijiTime = new Date()*1 - window.caijiTime;
      rc.setState({
        l_eye_img: window.leftEye && l_eye ? imgBase64 + window.leftEye : '',
        r_eye_img: window.rightEye && r_eye ? imgBase64 + window.rightEye : '',
      }, ()=>{
        try{
          window.hideObject();
        }catch(e){}
        rc.setState({
          isClick: false
        })
        // console.log('l_eye_img-------------', this.state.l_eye_img)
        // console.log('r_eye_img-------------', this.state.r_eye_img)
      })
    }
    window.setRcFn = setRcData;
  }

  // 身份证识别
  readCard() {
    const result = window.readCard();
    if(result.empty){
      JrMessage.error(result.error);
    }else{
      this.setState({
        p_name: result.name, // 姓名
        p_card_type: '身份证', // 证件类型
        p_card_no: result.cardNo, // 证件号
        p_sex: result.sex, // 性别
        p_country: '中国', // 国籍
        p_nation: result.nation, // 民族
        p_birth: result.birth, // 出生日期
        p_huji: result.address, // 住址
        p_card_addr: result.office, // 签发机关
        p_valid_time: `${result.startAt}--${result.endAt}`, // 有效期
      })
    }
  }

  // 手工录入
  handWork() {}

  // 证件核验
  submit() {
    const rc = this;
    const {
      p_type_data, p_card_type_data, p_sex_data, p_country_data, p_nation_data,
      l_eye_img, r_eye_img, l_eye, r_eye, noIdea, noIdeaItem, noIdeaData } = this.state;
    if(p_type_data.length === 0){
      globdata.getDataByName('syusergroup')
    }
    if(p_card_type_data.length === 0){
      globdata.getDataByName('cardgroup')
    }
    if(p_sex_data.length === 0){
      globdata.getDataByName('sex')
    }
    if(p_country_data.length === 0){
      globdata.getDataByName('country')
    }
    if(p_nation_data.length === 0){
      globdata.getDataByName('nation')
    }
    if(noIdeaData.length === 0){
      globdata.getDataByName('syeyehurttype')
    }
    if(!l_eye_img && !r_eye_img){
      JrMessage.error("请先采集虹膜");
      return
    }
    if(!l_eye || !r_eye){
      if(!noIdea || !noIdeaItem){
        JrMessage.error("请选择缺失原因")
        return
      }
    }
    let bothEyeStatus; // 左右眼采集代码，单眼采集 或 双眼采集
    if(l_eye && r_eye){
      bothEyeStatus = '3'; // 双眼采集
    }
    if(!l_eye && r_eye){
      bothEyeStatus = '1'; // 单右眼采集
    }
    if(l_eye && !r_eye){
      bothEyeStatus = '2'; // 单左眼采集
    }
    appendLoading();
    request({
      url: `/syirisop/recognize`,
      param: {
        // deviceno: '', // 设备编号
        offline: 1,
        bothEyeStatus, // 左右眼采集代码
        leftEyeStatus: !l_eye ? dataMapFn(noIdeaData, 'name', noIdeaItem, 'code') : '', // 左眼缺失情况代码
        rightEyeStatus: !r_eye ? dataMapFn(noIdeaData, 'name', noIdeaItem, 'code') : '', // 右眼缺失情况代码
        // leftEyeImg: l_eye_img, // 虹膜照片左眼
        // rightEyeImg: r_eye_img, // 虹膜照片右眼
        leftEyeImg: window.leftEye,
        rightEyeImg: window.rightEye,
        processTime: (window.caijiTime/1000).toFixed(3), // 采集图片耗时
        leftEyeScore: '66', // 左眼虹膜照片信息质量评分
        rightEyeScore: '66', // 右眼虹膜照片信息质量评分
      },
      method: 'post',
      onError: () => {
        removeLoading();
      },
    }).then((res) => {
      removeLoading();
      if(res.code === 200){
        // let data = res.content.rows;
        // rc.setState({
        //   tableData: data
        // })
        JrMessage.success('数据提交成功');
      }
      if(res.code === 200 || res.code === 201){
        let data = JSON.parse(res.content.result);
        // console.log(data)
        rc.setState({
          p_type: dataMapFn(p_type_data, 'code', data.userGroup, 'name'), // 人员类型
          p_name: data.realname, // 姓名
          p_card_type: dataMapFn(p_card_type_data, 'code', data.cardType, 'name'), // 证件类型
          p_card_no: data.cardno, // 证件号
          p_sex: dataMapFn(p_sex_data, 'code', data.sex, 'name'), // 性别
          p_country: dataMapFn(p_country_data, 'code', data.country, 'name'), // 国籍
          p_nation: dataMapFn(p_nation_data, 'code', data.nation, 'name'), // 民族
          p_birth: data.birthday, // 出生日期
          p_huji: data.hometown, // 户籍地址
          p_card_addr: data.institution, // 证件采集地址
          p_valid_time: data.expireAt, // 有效期
          p_phone: data.phone1,
          p_qita: data.phone2,
          showDialog: true,
          dialogChild: dataMapFn(p_type_data, 'code', data.userGroup, 'name')
        })
      }
      // else{
      //   JrMessage.error(`数据提交失败，失败原因：${res.message}，错误码：${res.code}`)
      // }
      // console.log(`res--------`, res)
    });
  }

  // 重置
  reset() {
    // 虹膜信息
    this.setState({
      cj_no: '', // 编号
      cj_time: '', // 时间
      cj_who: '', // 人
      cj_addr: '', // 地点
      cj_remark: '', // 备注
      noIdea: false, // 无法采集
      noIdeaItem: '', // 所选择的某一条因素 
      l_eye: true, // 左眼
      r_eye: true, // 右眼
      l_eye_img: '',
      r_eye_img: '',
    })
    // 人员信息
    this.setState({
      p_type: '', // 人员类型
      p_name: '', // 姓名
      p_card_type: '', // 证件类型
      p_card_no: '', // 证件号
      p_sex: '', // 性别
      p_country: '', // 国籍
      p_nation: '', // 民族
      p_birth: '', // 出生日期
      p_huji: '', // 户籍地址
      p_card_addr: '', // 证件采集地址
      p_valid_time: '', // 有效期
      p_phone: '', // 手机号
      p_qita: '', // 其他联系方式
    })
  }
  
  componentDidMount() {
    // this.getList();
  };

  componentWillMount() {
    this.reset();
    // this.getAllTypeByName('userGroup');
    // this.getAllTypeByName('deviceGroup');
    // this.getAllTypeByName('eyeHurtType');
    // this.getAllTypeByName('eyeRegType');
    // this.getList();
    
    let data = globdata.getData();
    // console.log(data)
    this.setState({
      p_nation_data: data.nationData,
      p_country_data: data.countryData,
      p_card_type_data: data.cardTypeData,
      p_type_data: data.perTypeData,
      p_sex_data: data.sexData,
      noIdeaData: data.noIdeaData,
    })

    // this.getDataList('nation', 'p_nation_data'); // nation/list 民族列表
    // this.getDataList('country', 'p_country_data'); // country/list 国家列表
    // this.getDataList('cardgroup', 'p_card_type_data') ; // cardgroup/list 证件类型列表
    // // // // this.getDataList('syregaddr') ; // syregaddr/list 采集场地类型列表
    // this.getDataList('syusergroup', 'p_type_data') ; // syusergroup/list 人员类别
    // // // // this.getDataList('sydevicegroup') ; // sydevicegroup/list 采集设备类别
    // // this.getDataList('syeyeregtype') ; // syeyeregtype/list 左右眼采集代码列表
    // this.getDataList('syeyehurttype', 'noIdeaData') ; // syeyehurttype/list 左右眼缺失情况
    // this.getDataList('sex', 'p_sex_data') ; // sex/list 性别列表
  };

  // 获取民族，国家列表
  getDataList(name, key) {
    const rc = this;
    request({
      url: `/${name}/list?t=${new Date()*1}`,
      param: {},
      method: 'get',
      // onError: (err) => {console.log('err---', err)}
    }).then((res) => {
      if(res.code === 200){
        let arr = [{code: '', name: '请选择'}];
        for(let i=0; i<res.content.length; i++){
          arr.push(res.content[i]);
        }
        rc.setState({
          [key]: arr
        }, () => {
          // console.log(rc.state[key])
        })
      }
      // console.log(`${name}--------`,res)
    });
  }

  render() {
    const { isClick,
      dialogChild, showDialog,
      cj_no, cj_time, cj_who, cj_addr, cj_remark, noIdea, noIdeaItem, noIdeaData, l_eye, r_eye, l_eye_img, r_eye_img,
      p_type, p_type_data, p_name, p_card_type, p_card_type_data, p_card_no, p_sex, p_sex_data, p_country, p_country_data, p_birth, p_valid_time, p_phone, p_qita,
    } = this.state;
    return (
      <div className="iris-hy box-shadow">
        <div className="info-wrap">
          <div className="inner">
            <table>
              <tbody>
                <tr>
                  <td colSpan="2"><strong>虹膜信息</strong></td>
                </tr>
                <tr>
                  <td colSpan="2">
                    <div className="cell iris-eye">
                      <span className="icon" style={{background: l_eye_img ? 'none' : ''}}>
                        {l_eye_img && (<img src={l_eye_img} />)}
                      </span>
                      <span className="icon" style={{background: r_eye_img ? 'none' : ''}}>
                        {r_eye_img && (<img src={r_eye_img} />)}
                      </span>
                    </div>
                  </td>
                </tr>
                {/* <tr>
                  <td  className="visi-hidden"><label /></td>
                  <td  className="visi-hidden"><input type="text" /></td>
                </tr> */}
                <tr>
                  <td colSpan="2" style={{textAlign: 'center'}}>
                    <div className="btn-wrap">
                      <label>左眼</label>
                      <input type="checkbox" defaultChecked={l_eye} checked={l_eye} data-name="l_eye" onChange={this.changeInput} />
                      <label>右眼</label>
                      <input type="checkbox" defaultChecked={r_eye} checked={r_eye} data-name="r_eye" onChange={this.changeInput} />
                      <JrButton type="primary" className="start-cj-eye" onClick={this.startCaiji} disabled={isClick}>开始采集</JrButton>
                      <JrButton type="primary" className="start-cj-eye" onClick={this.startCaiji} disabled={isClick}>重新采集</JrButton>
                      <JrButton className="start-cj-eye" onClick={this.hideDevice}>隐藏设备</JrButton>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="td-title"><label htmlFor="no-idea">无法采集：</label></td>
                  <td className="no-idea-next-td" style={{textAlign: 'left'}}>
                    <input type="checkbox" style={{left: '7px'}} id="no-idea" checked={noIdea} defaultChecked={noIdea} data-name="noIdea" onChange={this.changeInput} />
                    <div className="cell" style={{paddingRight:'7px'}}>
                      <Select
                        className="w100"
                        defaultValue={noIdeaItem}
                        value={noIdeaItem}
                        disabled={!noIdea}
                        onChange={e => {
                          this.handleSelect(e && e.target ? e.target.value : e, 'noIdeaItem');
                        }}
                        dropdownMenuStyle={{ maxHeight: 200 }}
                        allowClear
                      >
                        {noIdeaData.map(current => (
                          <Option key={`${current.name}`}  value={`${current.name}`}>
                            {current.name}
                          </Option>
                        ))}
                      </Select>
                      {/* <select disabled={!noIdea} name="" id="" value={noIdeaItem} data-name="noIdeaItem" onChange={this.changeInput}>
                        <option value="">请选择</option>
                        {noIdeaData.map(item => 
                          <option value={item.val} key={i} />
                        )}
                      </select> */}
                    </div>
                  </td>
                </tr>
                {/* <tr>
                  <td className="td-title"><label className="required">采集编号：</label></td>
                  <td><div className="cell"><input type="text" value={cj_no} data-name="cj_no" onChange={this.changeInput} /></div></td>
                </tr>
                <tr>
                  <td className="td-title"><label className="required">采集时间：</label></td>
                  <td><div className="cell">
                    <DatePicker
                      animation="slide-up"
                      calendar={<Calendar format={format} locale={cn} showDateInput />}
                      Value={moment(cj_time).format(format)}
                      onChange={value => this.getTimeFn(value, 'cj_time')}
                    >
                      {({ value }) => (
                        <span>
                          <input
                            readOnly
                            tabIndex="-1"
                            value={cj_time}
                          />
                        </span>
                      )}
                    </DatePicker>
                  </div></td>
                </tr>
                <tr>
                  <td className="td-title"><label className="required">采集人：</label></td>
                  <td><div className="cell"><input type="text" value={cj_who} data-name="cj_who" onChange={this.changeInput} /></div></td>
                </tr>
                <tr>
                  <td className="td-title"><label className="required">采集地点：</label></td>
                  <td><div className="cell"><input type="text" value={cj_addr} data-name="cj_addr" onChange={this.changeInput} /></div></td>
                </tr>
                <tr>
                  <td className="td-title"><label className="required">采集备注：</label></td>
                  <td><div className="cell"><input type="text" value={cj_remark} data-name="cj_remark" onChange={this.changeInput} /></div></td>
                </tr> */}
              </tbody>
            </table>
          </div>
          <div className="inner">
            <table>
              <tbody>
                <tr>
                  <td colSpan="2"><strong>人员信息</strong></td>
                </tr>
                <tr>
                  <td colSpan="2">
                    <div className="id-card">
                      <span className="icon" />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="td-title"><label className="required">人员分类：</label></td>
                  <td>
                    <div className="cell">
                      <Select
                        className="w100"
                        defaultValue={p_type}
                        value={p_type}
                        onChange={e => {
                          this.handleSelect(e && e.target ? e.target.value : e, 'p_type');
                        }}
                        dropdownMenuStyle={{ maxHeight: 200 }}
                        allowClear
                      >
                        {p_type_data.map(current => (
                          <Option key={`${current.code}`}  value={`${current.name}`}>
                            {current.name}
                          </Option>
                        ))}
                      </Select>
                      {/* <select name="" id="" value={p_type} data-name="p_type" onChange={this.changeInput}>
                        <option value="">请选择</option>
                        {p_type_data.map(item => 
                          <option value={item.val} key={i} />
                        )}
                      </select> */}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="td-title"><label className="required">姓名：</label></td>
                  <td><div className="cell"><input type="text" value={p_name} data-name="p_name" onChange={this.changeInput} /></div></td>
                </tr>
                <tr>
                  <td className="td-title"><label className="required">证件类型：</label></td>
                  <td>
                    <div className="cell">
                      <Select
                        className="w100"
                        defaultValue={p_card_type}
                        value={p_card_type}
                        onChange={e => {
                          this.handleSelect(e && e.target ? e.target.value : e, 'p_card_type');
                        }}
                        dropdownMenuStyle={{ maxHeight: 200 }}
                        allowClear
                      >
                        {p_card_type_data.map(current => (
                          <Option key={`${current.code}`}  value={`${current.name}`}>
                            {current.name}
                          </Option>
                        ))}
                      </Select>
                      {/* <select name="" id="" value={p_card_type} data-name="p_card_type" onChange={this.changeInput}>
                        <option value="">请选择</option>
                        {p_card_type_data.map(item => 
                          <option value={item.val} key={i} />
                        )}
                      </select> */}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="td-title"><label className="required">证件号：</label></td>
                  <td><div className="cell"><input type="text" value={p_card_no} data-name="p_card_no" onChange={this.changeInput} /></div></td>
                </tr>
                <tr>
                  <td className="td-title"><label className="required">有效期：</label></td>
                  <td>
                    <div className="cell">
                      {/* <MyDatepicker dataName="p_valid_time"  onChange={this.getTimeFn} /> */}
                      <DatePicker
                        animation="slide-up"
                        calendar={<Calendar format={format} locale={cn} showDateInput />}
                        Value={moment(p_valid_time).format(format)}
                        onChange={value => this.getTimeFn(value, 'p_valid_time')}
                      >
                        {({ value }) => (
                          <span>
                            <input
                              readOnly
                              tabIndex="-1"
                              value={p_valid_time}
                            />
                          </span>
                        )}
                      </DatePicker>
                      {/* <input type="date" value={p_valid_time} data-name="p_valid_time" onChange={this.changeInput} /> */}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="td-title"><label className="required">性别：</label></td>
                  <td>
                    <div className="cell">
                      <Select
                        className="w100"
                        defaultValue={p_sex}
                        value={p_sex}
                        onChange={e => {
                          this.handleSelect(e && e.target ? e.target.value : e, 'p_sex');
                        }}
                        dropdownMenuStyle={{ maxHeight: 200 }}
                        allowClear
                      >
                        {p_sex_data.map(current => (
                          <Option key={`${current.code}`}  value={`${current.name}`}>
                            {current.name}
                          </Option>
                        ))}
                      </Select>
                      {/* <select name="" id="" value={p_sex} data-name="p_sex" onChange={this.changeInput}>
                        <option value="">请选择</option>
                        {p_sex_data.map(item => 
                          <option value={item.val} key={i} />
                        )}
                      </select> */}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="td-title"><label className="required">出生日期：</label></td>
                  <td><div className="cell">
                    {/* <MyDatepicker dataName="p_birth"  onChange={this.getTimeFn} /> */}
                    <DatePicker
                        animation="slide-up"
                        calendar={<Calendar format={format} locale={cn} showDateInput />}
                        Value={moment(p_birth).format(format)}
                        onChange={value => this.getTimeFn(value, 'p_birth')}
                      >
                        {({ value }) => (
                          <span>
                            <input
                              readOnly
                              tabIndex="-1"
                              value={p_birth}
                            />
                          </span>
                        )}
                      </DatePicker>
                    {/* <input type="date" value={p_birth} data-name="p_birth" onChange={this.changeInput} /> */}
                  </div></td>
                </tr>
                <tr>
                  <td className="td-title"><label className="required">国籍：</label></td>
                  <td>
                    <div className="cell">
                      <Select
                        className="w100"
                        defaultValue={p_country}
                        value={p_country}
                        onChange={e => {
                          this.handleSelect(e && e.target ? e.target.value : e, 'p_country');
                        }}
                        dropdownMenuStyle={{ maxHeight: 200 }}
                        allowClear
                      >
                        {p_country_data.map(current => (
                          <Option key={`${current.code}`}  value={`${current.name}`}>
                            {current.name}
                          </Option>
                        ))}
                      </Select>
                      {/* <select name="" id="" value={p_country} data-name="p_country" onChange={this.changeInput}>
                        <option value="">请选择</option>
                        {p_country_data.map(item => 
                          <option value={item.val} key={i} />
                        )}
                      </select> */}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="td-title"><label className="required">手机号：</label></td>
                  <td>
                    <div className="cell">
                      <input type="text" value={p_phone} data-name="p_phone" onChange={this.changeInput} />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="td-title"><label className="required">其他联系方式：</label></td>
                  <td>
                    <div className="cell">
                      <input type="text" value={p_qita} data-name="p_qita" onChange={this.changeInput} />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="btn-wrap">
          <JrButton type="primary" className="sub" onClick={this.submit} disabled={isClick}>识别</JrButton>
          <JrButton className="reset" onClick={this.reset} disabled={isClick}>重置</JrButton>
        </div>
        <JrDialog
          title="温馨提示"
          children={<div>虹膜识别成功，此人是 {dialogChild}</div>}
          onCancel={() => {this.setState({showDialog: false})}}
          onClose={() => {this.setState({showDialog: false})}}
          visible={showDialog}
        />
      </div>
    );
  }
}
