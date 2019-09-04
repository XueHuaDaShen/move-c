/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
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
import './home.less';
import cj from 'static/img/home/cj.png';
import sb from 'static/img/home/sb.png';
import cjLog from 'static/img/home/cj-jl.png';
import cjCountTime from 'static/img/home/cj-count-t.png';
import cjSearchId from 'static/img/home/cj-search-id.png';
import sbLog from 'static/img/home/sb-jl.png';
import sbCountTime from 'static/img/home/sb-count-t.png';
import personal from 'static/img/home/people.png';
import { request } from 'tool';

const nodata = '暂无数据';
const menuList = [
  { name: '虹膜采集', icon: cj, url: 'cj' },
  { name: '虹膜识别', icon: sb, url: 'sb' },
  { name: '采集记录', icon: cjLog, url: 'cj_log' },
  { name: '采集量统计(按时间)', icon: cjCountTime, url: 'cj_count_time' },
  { name: '批量查询', icon: cjSearchId, url: 'cj_search_id' },
  { name: '识别记录', icon: sbLog, url: 'sb_log' },
  { name: '识别量统计(按时间)', icon: sbCountTime, url: 'sb_count_time' },
  { name: '操作员管理', icon: personal, url: 'admin' },
];
const cjTxt = '近十天采集量';
const sbTxt = '近十天识别量';

export default class Home extends Component {
  componentDidMount() {
    this.getList();
  };

  clickMenu(item) {
    if (this.props.onSelectMenu) {
      this.props.onSelectMenu(item);
    }
  };

  // 近十天采集量
  getCaijiData() {
    const rc = this;
    let end = new Date();
    request({
      url: '/syirisop/aggByDay',
      param: {
        opType: 'REG',
        startAt: end*1-60*60*24*1000*10,
        endAt: end*1
      },
      method: 'post',
      // onError: (err) => {console.log('err---', err)}
    }).then((res) => {
      if(res.code === 200){
        let data = res.content;
        rc.randerEcharts(data, 'left', cjTxt, '采集量')
      }
      // console.log('res--------', rse)
    });
  }

  // 近十天识别量
  getSbData() {
    const rc = this;
    let end = new Date();
    request({
      url: '/syirisop/aggByDay',
      param: {
        opType: 'RECO',
        startAt: end*1-60*60*24*1000*10,
        endAt: end*1
      },
      method: 'post',
      // onError: (err) => {console.log('err---', err)}
    }).then((res) => {
      if(res.code === 200){
        let data = res.content;
        rc.randerEcharts(data, 'right', sbTxt, '识别量')
      }
      // console.log('res--------', rse)
    });
  }

  getList() {
    this.getCaijiData();
    this.getSbData();
  };

  randerEcharts(data, ele, title, text) {
    // return
    if(data.length === 0)return
    // console.log(echarts)
    let echart = echarts.init(document.getElementById(ele));

    // 指定图表的配置项和数据
    let xAxis = [];
    let yAxis = [];
    for(let i=0; i<data.length; i++){
      xAxis.push(data[i].day);
      yAxis.push(data[i].count);
    }
    // 指定图表的配置项和数据
    let option = {
      color: ['#5d6bbf'],
      title: {
        text: title
      },
      tooltip: {},
      legend: {
        data:[text]
      },
      xAxis: {
        data: xAxis
      },
      yAxis: {},
      series: [{
        name: text,
        type: 'bar',
        data: yAxis
      }]
    };

    // 使用刚指定的配置项和数据显示图表。
    echart.setOption(option);
  };

  render() {
    return (
      <div className="home">
        <div className="top box-shadow">
          {/* <ul className="menu-list">{menus}</ul> */}
          <ul className="menu-list">
            {menuList.map(menu => 
              <li key={menu.name} onClick={() => {this.clickMenu(menu)}}>
                <span key={menu.name} className="icon">
                  <img key={menu.name} src={menu.icon} alt="" />
                </span>
                {/* <p className="text">
                  <span>{menu.name}</span>
                </p> */}
              </li>
            )}
          </ul>
        </div>
        <div className="bottom box-shadow">
          <div id="left">
            <p>{cjTxt}</p>
            {nodata}
          </div>
          <div id="right">
            <p>{sbTxt}</p>
            {nodata}
          </div>
        </div>
      </div>
    );
  }
}
