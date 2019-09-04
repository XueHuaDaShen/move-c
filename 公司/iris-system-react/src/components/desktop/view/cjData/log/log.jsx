/* eslint-disable consistent-return */
/* eslint-disable eqeqeq */
/* eslint-disable func-names */
/* eslint-disable no-unused-vars */
/* eslint-disable prefer-destructuring */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/button-has-type */
/* eslint-disable react/no-unused-state */
/* eslint-disable jsx-a11y/anchor-is-valid */
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
import { JrMessage } from 'ui';
import Calendar from 'rc-calendar';
import DatePicker from 'rc-calendar/lib/Picker';
import cn from 'rc-calendar/lib/locale/zh_CN';
import Select, { Option } from 'rc-select';
import 'rc-select/assets/index.css';
import 'rc-calendar/assets/index.css';
import Loading from 'rc-loading';
import JrButton from 'ui/JrButton';
import statusArr from '../status';
import dataMapFn from '../../dataMapFn';
import Pagination from '../../../myFenye/myFenye';
import { nationMapFn, countryMapFn, cardTypeMapFn, perTypeMapFn, sexMapFn } from '../../globdata';
import { appendLoading, removeLoading } from '../../../../loading/loading';
// import MyDatepicker from '../../../datepicker/date';
// import './cj.less';

const format = 'YYYY-MM-DD';
export default class CJLog extends Component {
  constructor() {
    super();
    this.state = {
      isClick: false,
      allCheck: false,
      tableData: [],
      loading: false,
      pageSize: 10,
      pageNum: 1,
      total: 1,
      // 查询条件
      searchName: '', // 姓名
      searchNameData: [],
      searchCardNo: '', // 证件号
      searchStatus: '', // 操作结果
      statusData: statusArr,
      startTime: '', // 开始时间
      endTime: '', // 截止时间
      showStart: false,
      showEnd: false,
      nationData: [],
      countryData: [],
      cardTypeData: [],
      perTypeData: [],
      sexData: [],
    }
    this.search = this.search.bind(this);
    this.reset = this.reset.bind(this);
    this.changeInput = this.changeInput.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.getLogList = this.getLogList.bind(this);
    this.getTimeFn = this.getTimeFn.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.uploadAll = this.uploadAll.bind(this);
  }

  componentWillMount() {
    this.search();
    this.getNameList();
  }

  // 查询
  search() {
    const { startTime, endTime, pageNum, pageSize } = this.state;
    // console.log(startTime, endTime);
    let s = new Date(startTime)*1;
    let e = new Date(endTime)*1;
    if(s&&e&&(e<s)){
      JrMessage.error('截止时间不能早于开始时间');
      return;
    }
    this.getLogList(pageNum, pageSize);
  }

  // 重置
  reset() {
    this.setState({
      pageNum: 1,
      pageSize: 10,
      searchName: '', // 姓名
      searchCardType: '', // 证件类型
      searchCardNo: '', // 证件号
      searchStatus: '', // 操作结果
      startTime: '', // 开始时间
      endTime: '', // 截止时间
    })
  }

  // input, select 值改变事件
  changeInput(e) {
    let ele = e.target;
    let key = ele.getAttribute("data-name");
    let value = ele.value;
    if(key === 'allCheck'){
      value = ele.checked;
      $(".upload-checkbox").not(':disabled').prop('checked', value)
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
    // console.log(val)
    this.setState({
      [key]: val ? moment(val).format(format) : ''
    })
  }

  // 获取名字列表
  getNameList() {
    const rc = this;
    // let end = new Date();
    request({
      url: '/admin/list',
      param: {
        pageNum: 1,
        pageSize: 999
      },
      method: 'post',
      // onError: (err) => {
      //   // JrMessage.error(`数据获取失败，失败原因：${err}`);
      // }
    }).then((res) => {
      if(res.code === 200){
        // JrMessage.success('数据获取成功')
        let arr = [];
        res.content.rows.forEach(item => {
          arr.push({
            name: item.profile.realname,
            code: item.id,
          })
        })
        rc.setState({
          searchNameData: arr
        });
      }
      // else{
      //   // JrMessage.error(`数据获取失败，失败原因：${res.message}，错误码：${res.code}`)
      // }
      // console.log('res--------', res)
    });
  }

  // 获取数据
  getLogList(pageNum, pageSize) {
    const rc = this;
    // rc.setState({
    //   loading: true
    // })
    appendLoading();
    let duration = 0.5;
    // let end = new Date();
    const {
      searchName,
      searchStatus,
      searchNameData,
      statusData,
      startTime,
      endTime,
    } = this.state;
    // console.log(pageNum, pageSize)
    request({
      url: '/syirisop/list',
      param: {
        pageNum,
        pageSize,
        opType: 'REG',
        adminid: searchName ? dataMapFn(searchNameData, 'name', searchName, 'code') : '',
        status: searchStatus ? `${dataMapFn(statusData, 'name', searchStatus, 'code')}` : '',
        startAt: new Date(startTime)*1,
        endAt: new Date(endTime)*1
      },
      method: 'post',
      onError: () => {
        removeLoading();
      },
    }).then((res) => {
      removeLoading();
      // rc.setState({
      //   loading: false
      // })
      if(res.code === 200){
        let data = res.content;
        // JrMessage.success('数据获取成功', '', duration);
        rc.setState({
          tableData: data.rows,
          pageNum: data.pageNum,
          total: data.total,
        })
        // console.log(data);
      }
      // else{
      //   JrMessage.error(`数据获取失败，失败原因：${res.message}，错误码：${res.code}`)
      // }
      // console.log('res--------', res)
    });
  }

  handlePageChange (data) {
    // console.log(data)
    this.setState({
      pageNum: data.page,
      pageSize: data.pageSize
    })
    this.getLogList(data.page, data.pageSize);
  }

  // 批量上传
  uploadAll() {
    // 上传
    const rc = this;
    let ids = [];
    $(".upload-checkbox").each(function() {
      if($(this).prop('checked')){
        ids.push($(this).attr('data-rowid'))
      }
    })
    if(ids.length === 0){
      JrMessage.error('请至少选择一条未上传的记录')
      return;
    }
    appendLoading();
    request({
      url: '/syirisop/uploadRecord',
      param: {
        ids
      },
      method: 'post',
    }).then((res) => {
      removeLoading();
      if(res.code === 200){
        // let data = res.content;
        JrMessage.success('上传成功', '', 0.5);
        rc.search();
      }
      // console.log(res);
    });
  }

  // 单条上传
  uploadRow(row) {
    const rc = this;
    appendLoading();
    request({
      url: '/syirisop/uploadRecord',
      param: {
        ids: [row.oplogid]
      },
      method: 'post',
    }).then((res) => {
      removeLoading();
      if(res.code === 200){
        // let data = res.content;
        JrMessage.success('上传成功', '', 0.5);
        rc.search();
      }
      // console.log(res);
    });
  }

  render() {
    const { searchName, searchNameData, searchCardType, cardTypeData, searchCardNo, searchStatus, statusData,
      startTime, endTime, showStart, showEnd, isClick, allCheck,
      tableData, loading, pageSize, pageNum, total, } = this.state;
    const columns = [
      {
        title: '选择上传', dataIndex: '', key: '', render: (text, record, index) => (
          <span><input type="checkbox" disabled={record.status != '-1'} data-rowid={record.oplogid} className="upload-checkbox"/></span>
        )
      },
      {
        title: '姓名', dataIndex: 'realname', key: 'realname',
      },
      {
        title: '人员类别', dataIndex: '', key: 'userGroup', render: (text, record, index) => (
          <span>{perTypeMapFn('code', record.userGroup)}</span>
        )
      },
      {
        title: '证件类型', dataIndex: 'cardType', key: 'cardType', render: (text, record, index) => (
          <span>{cardTypeMapFn('code', record.cardType)}</span>
        )
      },
      {
        title: '证件号', dataIndex: 'cardno', key: 'cardno',
      },
      {
        title: '性别', dataIndex: 'sex', key: 'sex', render: (text, record, index) => (
          <span>{sexMapFn('code', record.sex)}</span>
        )
      },
      {
        title: '有效日期', dataIndex: 'expireAt', key: 'expireAt',
      },
      {
        title: '民族', dataIndex: 'nation', key: 'nation', render: (text, record, index) => (
          <span>{nationMapFn('code', record.nation)}</span>
        )
      },
      {
        title: '户籍', dataIndex: 'hometown', key: 'hometown',
      },
      {
        title: '签发机关', dataIndex: 'institution', key: 'institution',
      },
      {
        title: '国籍', dataIndex: 'country', key: 'country', render: (text, record, index) => (
          <span>{countryMapFn('code', record.country)}</span>
        )
      },
      {
        title: '手机号', dataIndex: 'phone1', key: 'phone1',
      },
      {
        title: '其他联系方式', dataIndex: 'phone2', key: 'phone2',
      },
      {
        title: '状态', dataIndex: '', key: 'status', render: (text, record, index) => (
          <span>{dataMapFn(statusArr, 'code', record.status, 'name')}</span>
        )
      },
      {
        title: '操作', dataIndex: '', key: '操作', render: (text, record, index) => {
          if(record.status == -1){
            return (<a href="#" onClick={() => {this.uploadRow(record)}}>上传</a>)
          }
        }
      },
      // {
      //   title: 'Operations', dataIndex: '', key: 'operations', render: (text, record, index) => (
      //     <a href="#" onClick={()=>{rc.handleClickRow(text, record, index)}}>delete</a>
      //   ),
      // }
    ];
    let data = [];
    tableData.forEach((item, index) => {
      let obj = JSON.parse(JSON.stringify(item));
      obj.key = `${index}`;
      data.push(obj);
    })
    return (
      <Loading spinning={loading} type="fence">
        <div className="cj-log">
          <div className="search-bar box-shadow">
            <div className="item">
              <label>姓名：</label>
              <Select
                onChange={e => {
                  this.handleSelect(e && e.target ? e.target.value : e, 'searchName');
                }}
                value={searchName}
                // showSearch={false}
                dropdownMenuStyle={{ maxHeight: 200 }}
                allowClear
              >
                {searchNameData.map(current => (
                  <Option key={`${current.name}`} value={`${current.name}`}>
                    {current.name}
                  </Option>
                ))}
              </Select>
              {/* <input type="text" value={searchName} data-name="searchName" onChange={this.changeInput} placeholder="请输入姓名" /> */}
            </div>
            {/* <div className="item">
              <label>证件类型：</label>
              <select name="" id="" value={searchCardType} data-name="searchCardType"  onChange={this.changeInput}>
                <option value="">请选择</option>
                {cardTypeData.map(item => 
                  <option value={item.val} key={item.name}>{item.name}</option>
                )}
              </select>
            </div>
            <div className="item">
              <label>证件号：</label>
              <input type="text" value={searchCardNo} data-name="searchCardNo" onChange={this.changeInput} placeholder="请输入证件号码" />
            </div> */}
            <div className="item">
              <label>处理结果：</label>
              <Select
                onChange={e => {
                  this.handleSelect(e && e.target ? e.target.value : e, 'searchStatus');
                }}
                value={searchStatus}
                dropdownMenuStyle={{ maxHeight: 200 }}
                allowClear
              >
                {statusData.map(current => (
                  <Option key={`${current.name}`}  value={`${current.name}`}>
                    {current.name}
                  </Option>
                ))}
              </Select>
              {/* <select name="" id="" value={searchStatus} data-name="searchStatus"  onChange={this.changeInput}>
                <option value="">请选择</option>
                {statusData.map(item => 
                  <option value={item.val} key={item.name}>{item.name}</option>
                )}
              </select> */}
            </div>
            <div className="item">
              <label>时间：</label>
              {/* <MyDatepicker dataName="startTime"  onChange={this.getTimeFn} /> */}
              <DatePicker
                animation="slide-up"
                calendar={<Calendar format={format} locale={cn} showDateInput />}
                Value={moment(startTime)}
                onChange={value => this.getTimeFn(value, 'startTime')}
              >
                {({ value }) => (
                  <span>
                    <input
                      readOnly
                      tabIndex="-1"
                      value={startTime}
                    />
                  </span>
                )}
              </DatePicker>
              --
              <DatePicker
                animation="slide-up"
                calendar={<Calendar format={format} locale={cn} showDateInput />}
                Value={moment(endTime)}
                onChange={value => this.getTimeFn(value, 'endTime')}
              >
                {({ value }) => (
                  <span>
                    <input
                      readOnly
                      tabIndex="-1"
                      value={endTime}
                    />
                  </span>
                )}
              </DatePicker>
              {/* <MyDatepicker dataName="endTime"  onChange={this.getTimeFn}/> */}
              {/* <input type="date" value={startTime} data-name="startTime" onChange={this.changeInput} placeholder="请选择起始时间" />
              --
              <input type="date" value={endTime} data-name="endTime" onChange={this.changeInput} placeholder="请选择起始时间" /> */}
            </div>
            <div className="item">
              <button className="active" onClick={this.search}>查询</button>
              <button onClick={this.reset}>重置</button>
            </div>
          </div>
          <div className="data-container box-shadow">
            <div className="allCheck">
              <label htmlFor="all-check">全选: </label><input id="all-check" data-name="allCheck" onChange={this.changeInput} defaultChecked={allCheck} checked={allCheck} type="checkbox"/>
              <JrButton type="primary" onClick={this.uploadAll} disabled={isClick}>上传</JrButton>
            </div>
            <div className="inner">
              {
                tableData.length === 0 ?
                <p className="nodata">暂无数据</p> :
                <Table columns={columns} data={data} />
              }
            </div>
            {
              tableData.length !== 0 && <Pagination pageNum={pageNum} pageSize={pageSize} total={total} onPageChange={this.handlePageChange} />
            }
          </div>
        </div>
      </Loading>
    );
  }
}
