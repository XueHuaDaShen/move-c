/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable one-var */
/* eslint-disable react/button-has-type */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/no-unused-state */
/* eslint-disable prefer-destructuring */
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
import statusArr from '../status';
import dataMapFn from '../../dataMapFn';
import Pagination from '../../../myFenye/myFenye';
import { appendLoading, removeLoading } from '../../../../loading/loading';
// import MyDatepicker from '../../../datepicker/date';
// import './cj.less';
const nodata = '暂无数据';
const nodataText = '近十天采集量';
const format = 'YYYY-MM-DD';
// const sbTxt = '近十天识别量';
export default class CjCountPeople extends Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      tableData: [],
      pageSize: 10,
      pageNum: 1,
      total: 1,
      tags: [
        {label: '柱状图', val: 'bar'},
        {label: '折线图', val: 'line'},
        {label: '表格', val: 'table'},
      ],
      nowTag: 'bar',
      showTable: false,
      // 查询条件
      searchName: '', // 姓名
      searchNameData: [],
      searchCardType: '', // 证件类型
      cardTypeData: [
        {name: 'ceshi1', code: 1},
        {name: 'ceshi2', code: 2}
      ],
      searchCardNo: '', // 证件号
      searchStatus: '', // 操作结果
      statusData: statusArr,
      startTime: '', // 开始时间
      endTime: '', // 截止时间
    }
    this.search = this.search.bind(this);
    this.reset = this.reset.bind(this);
    this.changeInput = this.changeInput.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.getTimeFn = this.getTimeFn.bind(this);
    this.handleChangeTag = this.handleChangeTag.bind(this);
    this.getLogList = this.getLogList.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
  }
  
  componentDidMount() {
    this.reset();
    this.search();
    this.getNameList();
  };
  
  // 查询
  search() {
    const { startTime, endTime, pageNum, pageSize } = this.state;
    let s = new Date(startTime)*1;
    let e = new Date(endTime)*1;
    if(s&&e&&(e<s)){
      JrMessage.error('截止时间不能早于开始时间');
      return;
    }
    this.getLogList();
    // this.getLogList(pageNum, pageSize);
  }

  // 重置
  reset() {
    this.setState({
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
    // if(key === 'l_eye' || key === 'r_eye' || key === 'noIdea'){
    //   value = ele.checked;
    // }
    this.setState({
      [key]: value
    })
  }

  handleSelect(val, key) {
    this.setState({
      [key]: val || ''
    }, () => {
      // console.log(key, '-------', this.state[key])
    })
  }

  getTimeFn(val, key) {
    this.setState({
      [key]: val ? moment(val).format(format) : ''
    })
  }

  // 切换标签
  handleChangeTag(tag) {
    const { nowTag } = this.state;
    if(tag.val === nowTag) return;
    if(tag.val === 'table'){
      this.setState({
        showTable: true
      })
    }else{
      this.setState({
        showTable: false
      }, ()=>{this.randerEcharts(tag.val)})
    }
    this.setState({
      nowTag: tag.val
    });
  }

  // 渲染图表
  randerEcharts(type) {
    // console.log(echarts)
    if(type === 'table') return;
    const { tableData } = this.state;
    // if(tableData.length === 0) return
    // console.log(tableData)
    let echart = echarts.init(document.getElementById('echart-wrap-cj-people'));
    let xAxis = [], yAxis = [];
    for(let i=0; i<tableData.length; i++){
      xAxis.push(tableData[i].admin.username);
      yAxis.push(tableData[i].count);
    }
    // 指定图表的配置项和数据
    let option = {
      color: ['#5d6bbf'],
      title: {
        text: '采集量统计（按人）'
      },
      tooltip: {},
      legend: {
        data:['采集量']
      },
      xAxis: {
        data: xAxis
      },
      yAxis: {},
      series: [{
        name: '采集量',
        type,
        data: yAxis
      }]
    };

    // 使用刚指定的配置项和数据显示图表。
    echart.setOption(option);
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
  getLogList() {
    const rc = this;
    // rc.setState({
    //   loading: true
    // })
    appendLoading();
    // let end = new Date();
    const {
      searchName,
      searchStatus,
      searchNameData,
      statusData,
      startTime,
      endTime,
    } = this.state;
    request({
      url: '/syirisop/aggByAdmin',
      param: {
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
      // rc.setState({
      //   loading: false,
      // })
      removeLoading();
      if(res.code === 200){
        JrMessage.success('数据获取成功', '', 0.5)
        rc.setState({
          tableData: res.content
        }, () => {
          rc.randerEcharts(rc.state.nowTag);
        });
      }
      // else{
      //   JrMessage.error(`数据获取失败，失败原因：${res.message}，错误码：${res.code}`, '', 0.5)
      // }
      // console.log('res--------', res)
    });
  }

  handlePageChange (data) {
    // console.log(page)
    this.setState({
      pageNum: data.page,
      pageSize: data.pageSize
    })
    this.getLogList();
  }

  render() {
    const { 
      loading,
      searchName, searchNameData, searchCardType, cardTypeData, searchCardNo, searchStatus, statusData, startTime, endTime,
      showTable, tags, nowTag,
      tableData, pageSize, pageNum, total,
    } = this.state;
    const columns = [{
      title: '用户名', dataIndex: 'admin.username', key:'admin.username',
    }, {
      title: '数量', dataIndex: 'count', key:'count',
    }];
    let data = [];
    tableData.forEach((item, index) => {
      let obj = JSON.parse(JSON.stringify(item));
      obj.key = index;
      data.push(obj);
    })
    return (
      <Loading spinning={loading} type="fence">
        <div className="cj-count-pepole">
          <div className="search-bar box-shadow">
            <div className="item">
              <label>姓名：</label>
              <Select
                onChange={e => {
                  this.handleSelect(e && e.target ? e.target.value : e, 'searchName');
                }}
                value={searchName}
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
                  <Option key={`${current.code}`} labelInValue  value={`${current.name}`}>
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
                Value={moment(startTime).format(format)}
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
                Value={moment(endTime).format(format)}
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
            </div>
            <div className="item">
              <button className="active" onClick={this.search}>查询</button>
              <button onClick={this.reset}>重置</button>
            </div>
          </div>
          <div className="data-count-wrap box-shadow">
            <div className="kind-tag">
              {
                tags.map(tag =>
                  <span onClick={()=>{this.handleChangeTag(tag)}} className={tag.val === nowTag ? 'active':''} key={tag.label}>{tag.label}</span>
                )
              }
            </div>
            <div className="data-wrap">
              <div className="echart-wrap" style={{display: showTable ? 'none' : 'block'}} id="echart-wrap-cj-people">
                {/* <p>{nodataText}</p>
                {nodata} */}
              </div>
              <div style={{display: !showTable ? 'none' : 'block'}} className="data-container">
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
          </div>
        </div>
      </Loading>
    );
  }
}
