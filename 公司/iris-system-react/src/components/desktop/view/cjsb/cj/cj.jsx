/* eslint-disable no-buffer-constructor */
/* eslint-disable no-alert */
/* eslint-disable no-redeclare */
/* eslint-disable block-scoped-var */
/* eslint-disable vars-on-top */
/* eslint-disable no-var */
/* eslint-disable eqeqeq */
/* eslint-disable no-bitwise */
/* eslint-disable one-var */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-useless-return */
/* eslint-disable no-empty */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable func-names */
/* eslint-disable prefer-destructuring */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable camelcase */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/no-children-prop */
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
import CryptoJS from 'crypto-js';
import { request } from 'tool';
// import { JrDialog } from 'ui';
// import Dialog from 'rc-dialog';
import './cj.less';
import { JrMessage, JrDialog } from 'ui';
import JrButton from 'ui/JrButton';
import Calendar from 'rc-calendar';
import DatePicker from 'rc-calendar/lib/Picker';
import cn from 'rc-calendar/lib/locale/zh_CN';
import Select, { Option } from 'rc-select';
import 'rc-select/assets/index.css';
import 'rc-calendar/assets/index.css';
import dataMapFn from '../../dataMapFn';
import * as globdata from '../../globdata';
import { appendLoading, removeLoading } from '../../../../loading/loading';
import config from '../../../../../config/config';
// import MyDatepicker from '../../../datepicker/date';
console.log('CryptoJS---------', CryptoJS);
const imgBase64 = 'data:image/jpg;base64,';
const format = 'YYYY-MM-DD';
export default class IrisCj extends Component {
  constructor() {
    super();
    this.state = {
      isClick: false, // 双击
      p_type: '', // 人员类型
      p_type_data: [],
      p_name: '', // 姓名
      p_card_type: '', // 证件类型
      p_card_type_data: [],
      p_card_no: '', // 证件号
      p_img: '', // 证件照片
      p_sex: '', // 性别
      p_sex_data: [],
      p_country: '', // 国籍
      p_country_data: [],
      p_nation: '', // 民族
      p_nation_data: [],
      p_birth: '', // 出生日期
      p_huji: '', // 住址
      p_huji_data: [],
      p_card_addr: '', // 签发机关
      p_card_addr_data: [],
      p_valid_time: '', // 有效期
      p_phone: '', // 手机号
      p_qita: '', // 其他联系方式
      p_caijiren: '', // 采集人
      p_caijiren_data: [],
      noIdea: false, // 无法采集
      noIdeaItem: '', // 所选择的某一条因素 
      noIdeaData: [], // 无法采集所需要选择的因素数据
      remark: '', // 备注
      dialogVisible: false, // 弹框
      l_eye: true, // 左眼
      r_eye: true, // 右眼
      l_eye_img: '',
      r_eye_img: '',
      isOnLine: false,
      faceDialog: false,
      faceImg: '',
      getFile: '',
    }
    this.handleClose = this.handleClose.bind(this);
    this.submit = this.submit.bind(this);
    this.showSubmit = this.showSubmit.bind(this);
    this.reset = this.reset.bind(this);
    this.readCard = this.readCard.bind(this);
    this.showCheckDialog = this.showCheckDialog.bind(this);
    this.startCheck = this.startCheck.bind(this);
    this.startCaiji = this.startCaiji.bind(this);
    this.startCaijiEye = this.startCaijiEye.bind(this);
    this.stopCaijiEye = this.stopCaijiEye.bind(this);
    this.changeInput = this.changeInput.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.getTimeFn = this.getTimeFn.bind(this);
    this.handleSelectFoucs = this.handleSelectFoucs.bind(this);
    this.hideDevice = this.hideDevice.bind(this);
    this.forwardingDisanfang = this.forwardingDisanfang.bind(this);
  }

  // 生成 UUID
  getGuid() {
    // xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
    return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      let r = Math.random() * 16 | 0,
        v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    })
  }

  // 第三方加解密
  forwardingDisanfang() {
    const rc = this;
    let ROOT_URL = '';
    if (process.env.NODE_ENV === 'development') {
      ROOT_URL = config.development;
    } else {
      ROOT_URL = config.product;
    }
    // let url = '/admin/login';
    // let jsonStr = {
    //   username: 'admin',
    //   password: CryptoJS.HmacMD5(
    //     CryptoJS.MD5('123456').toString(),
    //     '12345'
    //   ).toString(),
    //   random: '12345',
    // }
    let jsonStr = 'abcd';
    console.log('要加密的数据------------', JSON.stringify(jsonStr))
    // let jsonStr = {
    //   name: '测试字符串',
    //   length: 5,
    //   result: 'ok or not'
    // };
    let hexKey = '9vvHhv4c1gY8btKbB39TqBiPAVCOmgLdh63f9R8wkVo=';
    // hexKey = atob(hexKey);
    hexKey = new Buffer(hexKey, 'base64');
    // hexKey = CryptoJS.enc.Hex.parse(hexKey);
    // var salt = CryptoJS.lib.WordArray.create(0);
    // hexKey = CryptoJS.PBKDF2(hexKey, salt, { keySize: 256/32, iterations: 500 });
		var iv = CryptoJS.enc.Hex.parse('1234567890123456'); 
    console.log('加密的key------------', hexKey);
    let srcs = CryptoJS.enc.Hex.parse(JSON.stringify(jsonStr));
    let bizDataEnc = CryptoJS.AES.encrypt(
      jsonStr,
      hexKey,
      {
        iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      }
    );
    bizDataEnc = CryptoJS.enc.Base64.stringify(bizDataEnc.ciphertext)
    // return encrypted.ciphertext.toString().toUpperCase();
    // let bizDataEnc = CryptoJS.AES.encrypt(JSON.stringify(jsonStr), hexKey, {
    //   mode: CryptoJS.mode.ECB,
    //   padding: CryptoJS.pad.Pkcs7
    // }).toString();
    console.log('加密后的数据-------------', bizDataEnc);
    console.log('加密后的数据长度-------------', bizDataEnc.length);
    // let bizDataEnc = 'ddsLihYoL0M+a2Mqhbuxi9z3ph/lnoRvHQXOC5Z3y6j6UasEUiV6lI6hFsZj0TX1lupW0HUP2KtmkIKJaIkvj/hsR/tJMiZsrgKQLjgiIUs5vnxvTzpVrDPIVvSLW5fm';
    // let data = {
    //   uuid: 1100013, // 分配的id
    //   inOrderId: rc.getGuid(), // 订单id  guid
    //   bizDataEnc: encodeURIComponent(bizDataEnc), // 业务数据 base64
    //   forwardUrl: `${ROOT_URL}/admin/login`, // 需要转发的地址
    //   forwardMethod: 'body', // 转发的方式
    //   dataLength: bizDataEnc.length, // 业务数据的长度
    //   keySequence: '1100012000000000000000000000460', // 加密秘钥 序列号
    //   ttl: 60, // 有效期 s
    //   ts: Math.floor(new Date()*1/1000), // 10位UNIX时间戳
    // }
    // let keyArr = [];
    // Object.keys(data).forEach((key) => {
    //   keyArr.push(key);
    // });
    // let newData = [];
    // let newKeyarr = keyArr.sort();
    // for(let i=0; i<newKeyarr.length; i++){
    //   newData.push(`${newKeyarr[i]}=${data[newKeyarr[i]]}`);
    // }
    // newData.push(`key=${hexKey}`)
    // console.log('传输的数据-------', newData);
    // let sign = CryptoJS.SHA256(newData.join('&'));
    // data.sign = sign;
    // let formData = new FormData();
    // formData.append('uuid', data.uuid);
    // formData.append('inOrderId', data.inOrderId);
    // formData.append('bizDataEnc', data.bizDataEnc);
    // formData.append('forwardUrl', data.forwardUrl);
    // formData.append('forwardMethod', data.forwardMethod);
    // formData.append('dataLength', data.dataLength);
    // formData.append('keySequence', data.keySequence);
    // formData.append('ttl', data.ttl);
    // formData.append('ts', data.ts);
    // formData.append('sign', data.sign);
    // request({
    //   url: `http://123.57.236.72/gateway/v1.json`,
    //   param: formData,
    //   method: 'post',
    //   onError: () => {
    //     removeLoading();
    //   },
    // }).then((res) => {
    //   console.log('res---------------', res);
    //   removeLoading();
    //   if(res.code === 200){
    //     // JrMessage.success('数据提交成功')
    //   }
    // });
  }

  handleClose() {
    // this.state.dialogVisible = false;
    this.setState({
      dialogVisible: false
    })
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
    if(key === 'l_eye' || key === 'r_eye' || key === 'noIdea' || key === 'isOnLine'){
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

  showSubmit() {
    const {
      p_type,
      p_name,
      p_card_type,
      p_card_no,
      p_sex,
      p_country,
      p_nation,
      p_birth,
      p_huji,
      p_card_addr,
      p_valid_time,
      p_phone,
      p_qita,
      p_caijiren,
      noIdea,
      noIdeaItem,
      remark,
      l_eye,
      r_eye,
      l_eye_img,
      r_eye_img,
      p_type_data,
      p_card_type_data,
      p_sex_data,
      p_nation_data,
      p_country_data,
      noIdeaData,
      isOnLine,
    } = this.state;
    if(!l_eye_img && !r_eye_img){
      JrMessage.error("请先采集虹膜");
      return
    }
    if(!l_eye || !r_eye){
      if(!noIdea || !noIdeaItem){
        JrMessage.error("请选择缺失原因")
        return;
      }
    }
    if(!p_type || !p_name || !p_card_type || !p_card_no || !p_sex || !p_country || !p_nation || !p_birth || !p_huji || !p_card_addr || !p_valid_time || !p_phone || !p_qita || !p_caijiren || !remark){
      this.setState({
        dialogVisible: true,
      })
      return;
    }
    // this.submit();
  }

  // 确定
  submit() {
    const {
      p_type,
      p_name,
      p_card_type,
      p_card_no,
      p_sex,
      p_country,
      p_nation,
      p_birth,
      p_huji,
      p_card_addr,
      p_valid_time,
      p_phone,
      p_qita,
      p_caijiren,
      noIdea,
      noIdeaItem,
      remark,
      l_eye,
      r_eye,
      l_eye_img,
      r_eye_img,
      p_type_data,
      p_card_type_data,
      p_sex_data,
      p_nation_data,
      p_country_data,
      noIdeaData,
      isOnLine,
    } = this.state;
    // if(!l_eye_img && !r_eye_img){
    //   JrMessage.error("请先采集虹膜");
    //   return
    // }
    // if(!l_eye || !r_eye){
    //   if(!noIdea || !noIdeaItem){
    //     JrMessage.error("请选择缺失原因")
    //     return
    //   }
    // }
    // if(!p_type || !p_name || !p_card_type || !p_card_no || !p_sex || !p_country || !p_nation || !p_birth || !p_huji || !p_card_addr || !p_valid_time || !p_phone || !p_qita || !p_caijiren || !remark){
    //   JrMessage.error("请完善资料")
    //   return
    // }
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
    const rc = this;
    appendLoading();
    request({
      url: `/syirisop/register`,
      param: {
        // deviceno: '', // 设备编号
        offline: 1,
        userGroup: dataMapFn(p_type_data, 'name', p_type, 'code'), // 被采集虹膜人员类别代码, 人员类别
        realname: p_name, // 被采集人姓名, 姓名
        cardType: dataMapFn(p_card_type_data, 'name', p_card_type, 'code'), // 被采集人证件类型代码, 证件类型
        cardno: p_card_no, // 被采集人证件号码, 证件号码
        cardImg: window.idCardImg, // 证件照片
        sex: dataMapFn(p_sex_data, 'name', p_sex, 'code'), // 被采集人性别, 性别
        nation: dataMapFn(p_nation_data, 'name', p_nation, 'code'), // 被采集人民族代码, 民族
        country: dataMapFn(p_country_data, 'name', p_country, 'code'), // 被采集人国家代码, 国籍
        birthday: p_birth, // 被采集人出生日期, 出生日期
        hometown: p_huji, // 被采集人户籍地址, 住址
        institution: p_card_addr, // 签发机关
        expireAt: p_valid_time, // 有效期限
        phone1: p_phone, // 手机号码1
        phone2: p_qita, // 手机号码2
        regRealname: p_caijiren, // 采集人姓名, 采集人
        bothEyeStatus, // 左右眼采集代码
        leftEyeStatus: !l_eye ? dataMapFn(noIdeaData, 'name', noIdeaItem, 'code') : '', // 左眼缺失情况代码
        rightEyeStatus: !r_eye ? dataMapFn(noIdeaData, 'name', noIdeaItem, 'code') : '', // 右眼缺失情况代码
        // leftEyeImg: l_eye_img, // 虹膜照片左眼
        // rightEyeImg: r_eye_img, // 虹膜照片右眼
        leftEyeImg: window.leftEye,
        rightEyeImg: window.rightEye,
        processTime: (window.caijiTime/1000).toFixed(3), // 采集图片耗时
        leftEyeScore: '95', // 左眼虹膜照片信息质量评分
        rightEyeScore: '95', // 右眼虹膜照片信息质量评分
        message: remark, // 采集备注
        isOnLine: isOnLine ? 1 : 0 // 是否离线上传
      },
      method: 'post',
      onError: () => {
        removeLoading();
      },
    }).then((res) => {
      removeLoading();
      if(res.code === 200){
        JrMessage.success('数据提交成功')
        rc.reset();
        // let data = res.content.rows;
        // rc.setState({
        //   tableData: data
        // })
      }
      if(res.code === 201){
        rc.reset();
      }
      // else{
      //   JrMessage.error(`数据提交失败，失败原因：${res.message}，错误码：${res.code}`)
      // }
      // console.log(`res--------`, res)
    });
  }

  // 重置
  reset() {
    // 人员信息
    this.setState({
      p_type: '', // 人员类型
      p_name: '', // 姓名
      p_card_type: '', // 证件类型
      p_card_no: '', // 证件号
      p_img: '', // 证件照片
      p_sex: '', // 性别
      p_country: '', // 国籍
      p_nation: '', // 民族
      p_birth: '', // 出生日期
      p_huji: '', // 住址
      p_card_addr: '', // 签发机关
      p_valid_time: '', // 有效期
      p_phone: '', // 手机号
      p_qita: '', // 其他联系方式
      p_caijiren: '', // 采集人
      noIdea: false, // 无法采集
      noIdeaItem: '', // 所选择的某一条因素 
      remark: '', // 备注
      l_eye: true, // 左眼是否勾选
      r_eye: true, // 右眼是否勾选
      l_eye_img: '',
      r_eye_img: '',
      dialogVisible: false,
    })
  }

  // 读取二代身份证
  readCard() {
    // const rc = this;
    const result = window.readCard();
    if(result.empty){
      JrMessage.error(result.error);
    }else{
      const {
        p_sex_data,
        p_nation_data,
        p_country_data,
        p_card_type_data,
      } = this.state;
      this.setState({
        p_name: result.name, // 姓名
        p_card_type: dataMapFn(p_card_type_data, 'id', result.cardType, 'name'), // 证件类型
        p_card_no: result.cardNo, // 证件号
        p_img: result.img ? imgBase64 + result.img : '', // 证件照片
        p_sex: dataMapFn(p_sex_data, 'code', result.sex, 'name'), // 性别
        p_country: '中国', // 国籍
        p_nation: dataMapFn(p_nation_data, 'name', result.nation, 'name'), // 民族
        p_birth: result.birth, // 出生日期
        p_huji: result.address, // 住址
        p_card_addr: result.office, // 签发机关
        p_valid_time: `${result.startAt}--${result.endAt}`, // 有效期
      })
    }
  }

  // 核验人脸信息
  showCheckDialog() {
    const rc = this;
    window.caijiFace();
    let setRcFaceFn = function(img) {
      rc.setState({
        faceDialog: true,
        faceImg: img,
      })
    }
    window.setRcFaceFn = setRcFaceFn;
  }

  // 开始核验
  startCheck() {}

  // 开始采集
  startCaiji() {
    const { l_eye, r_eye } = this.state;
    this.setState({
      l_eye_img: '',
      r_eye_img: '',
    })
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

  // 采集虹膜
  // 开始
  startCaijiEye() {}

  // 停止
  stopCaijiEye() {}

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
    // // this.getDataList('syregaddr') ; // syregaddrgroup/list 采集场地类型列表
    // this.getDataList('syusergroup', 'p_type_data') ; // syusergroup/list 人员类别
    // // this.getDataList('sydevicegroup') ; // sydevicegroup/list 采集设备类别
    this.getDataList('syeyeregtype') ; // syeyeregtype/list 左右眼采集代码列表
    // this.getDataList('syeyehurttype', 'noIdeaData') ; // syregaddrgroup/list 左右眼缺失情况
    // this.getDataList('sex', 'p_sex_data') ; // syregaddrgroup/list 性别列表
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
        // rc.setState({
        //   [key]: arr
        // }, () => {
        //   // console.log(rc.state[key])
        // })
      }
      console.log(`${name}--------`,res)
    });
  }

  getAllTypeByName(name) {
    // const rc = this;
    request({
      url: `/${name}/getAll?t=${new Date()*1}`,
      param: {},
      method: 'get',
      // onError: (err) => {console.log('err---', err)}
    }).then((res) => {
      if(res.code === 200){
        // let data = res.content.rows;
        // rc.setState({
        //   tableData: data
        // })
      }
      // console.log(`${name}--------`, JSON.parse(res.content))
    });
  }

  handleSelectFoucs(name, data) {
    if(this.state[data].length === 0){
      globdata.getDataByName(name)
    }
  }

  render() {
    const { faceDialog, faceImg, isClick, noIdea, isOnLine, noIdeaItem, noIdeaData, remark, p_type, p_type_data, p_name, p_card_type, p_card_type_data, p_card_no, p_img, p_sex, p_sex_data, p_country, p_country_data, p_nation, p_nation_data, p_birth, p_huji, p_card_addr, p_caijiren, p_caijiren_data, p_valid_time, p_phone, p_qita, l_eye, r_eye, l_eye_img, r_eye_img, dialogVisible, } = this.state;
    const child = (
      <div>信息录入不完整，确定提交吗？</div>
    )
    const checkChild = (
      <div className="check-wrap">
        <div className="left">
          <h2 className="title">采集照片:</h2>
          <img src={faceImg} alt=""/>
        </div>
        <div className="right">
          <div className="top">
            <h2 className="title">证件照片:</h2>
            <img src={p_img} alt=""/>
          </div>
          <div className="bot">
            <h2 className="title">核验结果:</h2>
            <h2 className="result">核验成功，请采集虹膜</h2>
          </div>
        </div>
      </div>
    )
    return (
      <div className="iris-cj box-shadow">
        <p className="page-title">人员信息</p>
        <div className="info-wrap">
          <div className="inner">
            <table>
              <tbody>
                <tr>
                  <td className="td-title"><label className="required">人员分类：</label></td>
                  <td style={{position: 'relative'}}>
                    <div className="cell" onClick={() => {this.handleSelectFoucs('syusergroup', 'p_type_data')}}>
                      <Select
                        className="w100 error-border"
                        defaultValue={p_type}
                        value={p_type}
                        onChange={e => {
                          this.handleSelect(e && e.target ? e.target.value : e, 'p_type');
                        }}
                        dropdownMenuStyle={{ maxHeight: 200 }}
                        allowClear
                      >
                        {p_type_data.map(current => (
                          <Option key={`${current.name}`} value={current.name}>
                            {current.name}
                          </Option>
                        ))}
                      </Select>
                      {/* <select name="" id="" value={p_type} data-name="p_type" onChange={this.changeInput}>
                        {p_type_data.map(item => 
                          <option value={item.code} key={item.code}>{item.name}</option>
                        )}
                      </select> */}
                    </div>
                  </td>
                  <td rowSpan="4" colSpan="6">
                    <div className="cell read-info">
                      <div className="id-card">
                        <div className="card-wrap">
                          <span className="icon" style={{background: p_img ? 'none' : ''}}>
                            {p_img && (<img src={p_img} />)}
                          </span>
                        </div>
                        <div className="btn-wrap">
                          <JrButton type="primary" className="read-card" onClick={this.forwardingDisanfang} disabled={isClick}>读取二代身份证</JrButton>
                          <JrButton type="primary" className="read-card" onClick={this.showCheckDialog} disabled={!p_img}>人证核验</JrButton>
                        </div>
                      </div>
                      <div className="iris-eye">
                        <div className="eye-wrap">
                          <span className="icon" style={{background: l_eye_img ? 'none' : ''}}>
                            {l_eye_img && (<img src={l_eye_img} />)}
                          </span>
                          <span className="icon" style={{background: r_eye_img ? 'none' : ''}}>
                            {r_eye_img && (<img src={r_eye_img} />)}
                          </span>
                        </div>
                        <div className="btn-wrap">
                          <label>左眼</label>
                          <input type="checkbox" defaultChecked={l_eye} data-name="l_eye" onChange={this.changeInput} />
                          <label>右眼</label>
                          <input type="checkbox" defaultChecked={r_eye} data-name="r_eye" onChange={this.changeInput} />
                          <JrButton type="primary" className="start-cj-eye" onClick={this.startCaiji} disabled={isClick}>开始采集</JrButton>
                          <JrButton type="primary" className="start-cj-eye" onClick={this.startCaiji} disabled={isClick}>重新采集</JrButton>
                          <JrButton className="start-cj-eye" onClick={this.hideDevice}>隐藏设备</JrButton>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="td-title"><label className="required">姓名：</label></td>
                  <td>
                    <div className="cell">
                      <input type="text" value={p_name} data-name="p_name" onChange={this.changeInput} />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="td-title"><label className="required">证件类型：</label></td>
                  <td>
                    <div className="cell" onClick={() => {this.handleSelectFoucs('cardgroup', 'p_card_type_data')}}>
                      <Select
                        defaultValue={p_card_type}
                        value={p_card_type}
                        onChange={e => {
                          this.handleSelect(e && e.target ? e.target.value : e, 'p_card_type');
                        }}
                        dropdownMenuStyle={{ maxHeight: 200 }}
                        allowClear
                      >
                        {p_card_type_data.map(current => (
                          <Option key={`${current.name}`} value={current.name}>
                            {current.name}
                          </Option>
                        ))}
                      </Select>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="td-title"><label className="required">证件号：</label></td>
                  <td>
                    <div className="cell">
                      <input type="text" value={p_card_no} data-name="p_card_no" onChange={this.changeInput} />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="td-title"><label className="required">性别：</label></td>
                  <td>
                    <div className="cell" onClick={() => {this.handleSelectFoucs('sex', 'p_sex_data')}}>
                      <Select
                        defaultValue={p_sex}
                        value={p_sex}
                        onChange={e => {
                          this.handleSelect(e && e.target ? e.target.value : e, 'p_sex');
                        }}
                        dropdownMenuStyle={{ maxHeight: 200 }}
                        allowClear
                      >
                        {p_sex_data.map(current => (
                          <Option key={`${current.name}`} value={current.name}>
                            {current.name}
                          </Option>
                        ))}
                      </Select>
                      {/* <select name="" id="" value={p_sex} data-name="p_sex" onChange={this.changeInput}>
                        {p_sex_data.map(item => 
                          <option value={item.code} key={item.code}>{item.name}</option>
                        )}
                      </select> */}
                    </div>
                  </td>
                  <td className="td-title"><label className="required">国籍：</label></td>
                  <td>
                    <div className="cell" onClick={() => {this.handleSelectFoucs('country', 'p_country_data')}}>
                      <Select
                        defaultValue={p_country}
                        value={p_country}
                        onChange={e => {
                          this.handleSelect(e && e.target ? e.target.value : e, 'p_country');
                        }}
                        dropdownMenuStyle={{ maxHeight: 200 }}
                        allowClear
                      >
                        {p_country_data.map(current => (
                          <Option key={`${current.name}`} value={current.name}>
                            {current.name}
                          </Option>
                        ))}
                      </Select>
                      {/* <select name="" id="" value={p_country} data-name="p_country" onChange={this.changeInput}>
                        {p_country_data.map(item => 
                          <option value={item.code} key={item.code}>{item.name}</option>
                        )}
                      </select> */}
                    </div>
                  </td>
                  <td className="td-title"><label className="required">采集人：</label></td>
                  <td style={{textAlign: 'left'}}>
                    <div className="cell" style={{padding:0}}>
                      <input type="text" value={p_caijiren} data-name="p_caijiren" onChange={this.changeInput} />
                      {/* <Select
                        defaultValue={p_caijiren}
                        value={p_caijiren}
                        onChange={e => {
                          this.handleSelect(e && e.target ? e.target.value : e, 'p_caijiren');
                        }}
                        dropdownMenuStyle={{ maxHeight: 200 }}
                        allowClear
                      >
                        {p_caijiren_data.map(current => (
                          <Option key={`${current.name}`} value={current.name}>
                            {current.name}
                          </Option>
                        ))}
                      </Select> */}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="td-title"><label className="required">民族：</label></td>
                  <td>
                    <div className="cell" onClick={() => {this.handleSelectFoucs('nation', 'p_nation_data')}}>
                      <Select
                        defaultValue={p_nation}
                        value={p_nation}
                        onChange={e => {
                          this.handleSelect(e && e.target ? e.target.value : e, 'p_nation');
                        }}
                        dropdownMenuStyle={{ maxHeight: 200 }}
                        allowClear
                      >
                        {p_nation_data.map(current => (
                          <Option key={`${current.name}`} value={current.name}>
                            {current.name}
                          </Option>
                        ))}
                      </Select>
                    </div>
                  </td>
                  <td className="td-title"><label className="required">出生日期：</label></td>
                  <td>
                    <div className="cell">
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
                    </div>
                  </td>
                  <td className="td-title">
                    <label className="required">备注：</label>
                  </td>
                  <td rowSpan="5">
                    <div className="cell" style={{padding: 0}}>
                      <textarea name="" id="" cols="30" rows="10" value={remark} data-name="remark" onChange={this.changeInput} />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="td-title"><label className="required">住址：</label></td>
                  <td colSpan="3">
                    <div className="cell">
                      <input className="w100" type="text" value={p_huji} data-name="p_huji" onChange={this.changeInput} />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="td-title"><label className="required">签发机关：</label></td>
                  <td colSpan="3">
                    <div className="cell">
                      <input className="w100" type="text" value={p_card_addr} data-name="p_card_addr" onChange={this.changeInput} />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="td-title"><label className="required">有效期：</label></td>
                  <td colSpan="3">
                    <div className="cell">
                      <input className="w100" type="text" value={p_valid_time} data-name="p_valid_time" onChange={this.changeInput} />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="td-title"><label className="required">手机号：</label></td>
                  <td colSpan="3">
                    <div className="cell">
                      <input className="w100" type="text" value={p_phone} data-name="p_phone" onChange={this.changeInput} />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="td-title"><label className="required">其他联系方式：</label></td>
                  <td colSpan="3">
                    <div className="cell">
                      <input className="w100" type="text" value={p_qita} data-name="p_qita" onChange={this.changeInput} />
                    </div>
                  </td>
                  <td className="td-title"><label htmlFor="no-idea">无法采集：</label></td>
                  <td className="no-idea-next-td" style={{textAlign: 'left', position: 'relative'}}>
                    <input type="checkbox" id="no-idea" checked={noIdea} defaultChecked={noIdea} data-name="noIdea" onChange={this.changeInput} />
                    <div className="cell" onClick={() => {this.handleSelectFoucs('syeyehurttype', 'noIdeaData')}}>
                      <Select
                        // className="w100"
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
                          <Option key={`${current.name}`} value={current.name}>
                            {current.name}
                          </Option>
                        ))}
                      </Select>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="btn-wrap">
          <label htmlFor="isOnLine" style={{fontSize: '12px'}}>离线上传：</label>
          <input type="checkbox" id="isOnLine" checked={isOnLine} defaultChecked={isOnLine} data-name="isOnLine" onChange={this.changeInput} />
          <JrButton type="primary" className="sub" onClick={this.showSubmit} disabled={isClick}>提交</JrButton>
          <JrButton className="reset" onClick={this.reset} disabled={isClick}>重置</JrButton>
        </div>
        <JrDialog title="温馨提示"
          children={child}
          onCancel={this.handleClose}
          onClose={this.handleClose}
          onOk={this.submit}
          visible={dialogVisible} 
        />
        <JrDialog
          title="人证核验"
          children={checkChild}
          onCancel={() => {this.setState({
            faceDialog: false
          })}}
          cancelText="完成"
          onOk={this.startCheck}
          okText="开始核验"
          visible={faceDialog}
        />
      </div>
    );
  }
}
