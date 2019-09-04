/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/anchor-is-valid */
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
import React, { Component } from 'react';
import { request } from 'tool';
import Table from 'rc-table';
import Loading from 'rc-loading';
import { JrMessage } from 'ui';
import Pagination from '../../../myFenye/myFenye';
import { nationMapFn, countryMapFn, cardTypeMapFn, perTypeMapFn, sexMapFn } from '../../globdata';
import { appendLoading, removeLoading } from '../../../../loading/loading';
// import './cj.less';

export default class CjSearchID extends Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      tableData: [],
      pageSize: 10,
      pageNum: 1,
      total: 1,
      // 查询条件
      card_no: [], // 证件号集合 字符串
    }
    this.search = this.search.bind(this);
    this.reset = this.reset.bind(this);
    this.changeInput = this.changeInput.bind(this);
    this.getLogList = this.getLogList.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
  }
  
  componentWillMount() {
    this.reset();
    this.search();
  };

  // 查询
  search() {
    const { pageNum, pageSize } = this.state;
    this.getLogList(pageNum, pageSize );
  }

  // 重置
  reset() {
    this.setState({
      pageNum: 1,
      pageSize: 10,
      card_no: []
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

  // 获取数据
  getLogList(pageNum, pageSize) {
    const rc = this;
    // rc.setState({
    //   loading: true
    // })
    appendLoading();
    const { card_no } = this.state;
    let sym = 'mySym';
    const cardList = card_no.length>0 ? card_no.replace(/[,\s\n;]/g, sym).split(sym) : [];
    // let end = new Date();
    request({
      url: '/syirisop/getByCards',
      param: {
        pageNum,
        pageSize,
        opType: 'REG',
        cardList,
      },
      method: 'post',
      onError: () => {
        removeLoading();
      },
    }).then((res) => {
      // rc.setState({
      //   loading: false
      // })
      removeLoading();
      if(res.code === 200){
        JrMessage.success('数据获取成功', '', 0.5)
        let data = res.content;
        rc.setState({
          tableData: data.rows,
          pageNum: data.pageNum,
          total: data.total,
        })
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
    this.getLogList(data.page, data.pageSize );
  }

  render() {
    const { loading, card_no, tableData, pageSize, pageNum, total, } = this.state;
    const columns = [
      {
        title: '姓名', dataIndex: 'realname', key: 'realname',
      },
      {
        title: '人员类别', dataIndex: 'userGroup', key: 'userGroup', render: (text, record, index) => (
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
      // {
      //   title: 'Operations', dataIndex: '', key: 'operations', render: (text, record, index) => (
      //     <a href="#" onClick={()=>{rc.handleClickRow(text, record, index)}}>delete</a>
      //   ),
      // }
    ];
    let data = [];
    tableData.forEach((item, index) => {
      let obj = JSON.parse(JSON.stringify(item));
      obj.key = index;
      data.push(obj);
    })
    return (
      <Loading spinning={loading} type="fence">
        <div className="cj-search-id">
          <div className="search-bar box-shadow">
            <div className="item" style={{ marginRight: 0, float: 'left' }}>
              <label>证件号：</label>
            </div>
            <div className="item">
              <textarea value={card_no} data-name="card_no" onChange={this.changeInput} name="" id="" cols="30" rows="10" placeholder="证件号请以 ',' 或者 空格 隔开" />
            </div>
            <div className="item">
              <button className="active" onClick={this.search}>查询</button>
              <button onClick={this.reset}>重置</button>
            </div>
          </div>
          <div className="data-container box-shadow">
            <div className="inner">
              {
                tableData.length === 0 ?
                <p className="nodata">暂无数据</p> :
                <Table columns={columns} data={data} />
              }
            </div>
            {
              tableData.length !== 0 && <Pagination pageNum={Number(pageNum)} pageSize={Number(pageSize)} total={Number(total)} onPageChange={this.handlePageChange} />
            }
          </div>
        </div>
      </Loading>
    );
  }
}
