/**
 * Created by wangleping on 2017/5/9.
 */
import  '../common/common.less';
// import './fish.less';

import {Axios, Axios2} from '../common/common';

//补充数据的函数
import completionData from '../../time';

import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as Actions from '../../redux/actions';

import moment from 'moment';
import {DatePicker, Button, Radio, Select, Input, Table, Spin} from 'antd';
const {RangePicker} = DatePicker;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const Option = Select.Option;
let myChart;

// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';

import 'echarts/lib/chart/line';
import 'echarts/lib/chart/bar';

import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/toolbox';


class PayAmount extends React.Component {
    constructor() {
        super();
        this.state = {
            pid: '',
            type: '1',
            channel: '',
            signed: '',
            unionid: '',
            startDate: moment.utc().startOf('day').subtract(7, 'days').format(),
            endDate: moment.utc().endOf('day').subtract(1, 'days').format(),
            dataType: '',
            tableData: [],
            tableLoading: false,
            showStart: '',
            showEnd: '',
            sep: '',
            unionList: [],
            flag: 'All',
        };

        this.onChangeDate = this.onChangeDate.bind(this);
        this.onChangeType = this.onChangeType.bind(this);
        this.onChangeSigned = this.onChangeSigned.bind(this);
        this.search = this.search.bind(this);
        this.setChart = this.setChart.bind(this);
        this.List = this.List.bind(this);
        this.onChangePid = this.onChangePid.bind(this);
        this.unionList = this.unionList.bind(this);
        this.onChangeUnion = this.onChangeUnion.bind(this);
        this.onChangeChannel = this.onChangeChannel.bind(this);
    }

    componentWillMount() {
        const that = this;
        // setTimeout(function () {
        //     console.log(that.props);
        //
        // }, 1000)
        const {actions} = this.props;
        actions.activePage(5);
        actions.openSub('sub2');


    }

    componentDidMount() {
        myChart = echarts.init(document.getElementById('chartWrap'));
        this.List();
        this.unionList()
    }

    onChangeDate(dates, dateStrings) {
        const that = this;
        this.setState({
            startDate: moment.utc(dateStrings[0]).format(),
            endDate: moment.utc(dateStrings[1]).endOf('day').format()
        }, function () {
            // console.log('From: ', that.state.startDate, ', to: ', that.state.endDate);
            // console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);
        })

    }

    onChangeType(e) {
        const that = this;
        // console.log(`radio checked:${e.target.value}`);
        this.setState({
                type: e.target.value
            }, function () {
                console.log(this.state.type)
                that.List();
            }
        );

    }

    onChangeSigned(value) {
        // console.log(value);
        this.setState({
            signed: value
        })
    }

    search() {
        // const that = this;
        this.List();
        // console.log(this.state.startDate)
    }

    setChart(data) {
        const colors = ['#5793f3'];
        const that = this;
        let xAxis = [];
        let yAxis = [];
        let source = [];

        // if (type === '') {
            // if (data["1"].buckets.length > data["11"].buckets.length) {
            //
            // }
            // data["1"].buckets.forEach(function (value) {
            //     xAxis.push(moment(value["key"]).format('YY/MM/DD'))
            // });
            // let xData = data["1"].buckets.map(
            //     (val) => val["key_as_string"]
            // )
            // console.log(xAxis)
        // } else if (type === '1') {


            //

            // console.log(xAxis)
            // console.log(yAxis)
        // } else if (type === '11') {
            // xAxis = data["11"].buckets.map(
            //     (val) => moment(val["key"]).format('M/D')
            // );
            // yAxis = data["11"].buckets.map(
            //     (val) => val["diamonds"].value
            // );
            //
            // data["11"].buckets.forEach(function (val) {
            //     xAxis.push(moment(val["key"]).format('M/D'));
            //     yAxis.push(val["diamonds"].value);
            //     source.push({
            //         key: moment(val["key"]).format('M/D'),
            //         date: moment(val["key"]).format('M/D'),
            //         diamonds: val["diamonds"].value
            //     })
            // });
            // console.log(xAxis)
            // console.log(yAxis)
        // }

        var data = completionData(data);
        Object.keys(data).forEach(function (key) {
            // console.log("key: " + key +", val: " + data[key].diamonds + "||" + data[key].diamonds);
            xAxis.push(moment(data[key].key).format('M/D'));
            yAxis.push(data[key].val);
            source.push({
                key: moment(data[key].key).format('M/D'),
                date: moment(data[key].key).format('M/D'),
                fishball: data[key].val
            })
        });

        this.setState({
            tableData: source,
            tableLoading: false,
            showStart: moment(this.state.startDate).format('YYYY-MM-DD'),
            showEnd: moment(this.state.endDate).format('YYYY-MM-DD'),
            sep: 'to'
        });

        // myChart.hideLoading();
        this.setState({

        });
        myChart.setOption({
            color: colors,

            title: {
                text: 'Fishball bill'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross'
                }
            },
            // grid: {
            //     right: '20%'
            // },
            toolbox: {
                feature: {
                    dataView: {show: true, readOnly: false},
                    magicType: {type: ['line', 'bar']},
                    restore: {show: true},
                    saveAsImage: {show: true}
                }
            },
            legend: {
                data: [that.state.flag]
            },
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                    axisTick: {
                        alignWithLabel: true
                    },
                    data: xAxis
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '',
                    offset: '5',
                    scale: false,
                    axisLine: {
                        show: false,
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        formatter: '{value} '
                    }
                }
            ],
            series: [
                {
                    name: that.state.flag,
                    type: 'line',
                    // yAxisIndex: 1,
                    data: yAxis
                }
            ]
        });
    }


    List() {
        // myChart.showLoading();
        this.setState({
            tableLoading: true
        });
        const that = this;
        Axios2(
            'post',
            '/host/revenue',
            {
                pid: this.state.pid,
                unionid: this.state.unionid,
                signed: this.state.signed,
                channel: this.state.channel,
                typeOfDate: this.state.type,
                begintime: this.state.startDate,
                endtime: this.state.endDate
            },
            {
                token: localStorage.getItem('BI-A-TOKEN')
            },
            function (data) {
                if(typeof data == 'string'){
                    that.setChart([]);
                    that.setState({
                        tableLoading: false
                    });
                }else{
                    that.setChart(data);
                }

            },
            function (err) {
                console.log(err)
            }
        )
    }

    onChangePid(e) {
        console.log(e.target.value)
        this.setState({
            pid: e.target.value
        })
    }

    onChangeChannel(value, option) {
        const that = this;
        if (value == 'null') {
            value = '';
        }
        this.setState({
            channel: value
        }, function () {
            console.log(that.state.channel)
        })
        this.state.flag = value == '' ? 'All':option.props.children;
    }
    onChangeUnion(value) {
        const that = this;
        console.log(value)
        if (value == 'null') {
            value = '';
        }
        this.setState({
            unionid: value
        }, function () {
            console.log(that.state.unionid)
        })
    }
    unionList() {
        const that = this;
        Axios(
            'get',
            '/union/getList',
            {},
            {
                token: localStorage.getItem('BI-A-TOKEN')
            },
            function (data) {
                // data.unshift({_id: null, name: 'Please Select'})
                // console.log(data);
                that.setState({
                    unionList: data
                })
            },
            function (err) {
                console.log(err);
            }
        )
    }

    render() {
        let state = this.state;
        const columns = [{
            title: 'date',
            dataIndex: 'date',
            key: 'date',
            // render: text => <a href="#">{text}</a>,
        }, {
            title: state.flag,
            dataIndex: 'fishball',
            key: 'fishball',
        }];

        let options = this.state.unionList.map(item => <Option key={item._id}>{item.name}</Option>);
        return (
            <div className="rightView">
                <div className="salary-head">
                    <div className="content">
                        <Select defaultValue="" size="large" style={{width: 120, marginRight: 5}} onChange={this.onChangeSigned}>
                            <Option value="">All</Option>
                            <Option value="1">Sign</Option>
                            <Option value="0">Not signed</Option>
                        </Select>
                        <Select defaultValue="" size="large" style={{width: 120, marginRight: 5}} onSelect={this.onChangeChannel}>
                            <Option value="">All</Option>
                            <Option value="gift">gift</Option>
                            <Option value="checkin">checkin</Option>
                            <Option value="activity">activity</Option>
                        </Select>
                        <Input size="large" placeholder="pid" type="number" className="pidInput" style={{width: 120, marginRight: 5}} onChange={this.onChangePid}/>
                        <Select size="large" placeholder="Select Union" style={{width: 120, marginRight: 5}}
                                onChange={this.onChangeUnion}>
                            <Option value="">All</Option>
                            {options}
                        </Select>
                        <RangePicker
                            defaultValue={[moment.utc().startOf('day').subtract(7, 'days'), moment.utc().subtract(1, 'days')]}
                            size="large" onChange={this.onChangeDate} ranges={{
                            'Last 7 days': [moment.utc().startOf('day').subtract(7, 'days'), moment.utc().endOf('day').subtract(1, 'days')],
                            'Last 30 days': [moment.utc().startOf('day').subtract(30, 'days'), moment.utc().endOf('day').subtract(1, 'days')],
                            'Last 60 days': [moment.utc().startOf('day').subtract(60, 'days'), moment.utc().endOf('day').subtract(1, 'days')]
                        }} className="salary-date"/>
                        <Button size="large" icon="search" type="primary" onClick={this.search}></Button>
                    </div>

                </div>

                <div className="c-chart">
                    <div className="c-chart-head">
                        <div className="left">
                            Trend Analysis
                        </div>
                        <div className="right">
                            <RadioGroup onChange={this.onChangeType} defaultValue="1">
                                <RadioButton value="1">day</RadioButton>
                                {/*<RadioButton value="2" disabled={false}>week</RadioButton>*/}
                                <RadioButton value="3">month</RadioButton>
                            </RadioGroup>
                        </div>
                    </div>
                    <Spin spinning={this.state.tableLoading}>
                        <div className="c-chart-body">
                            <div id="chartWrap" className="myChartWrap"></div>
                        </div>
                        <div className="c-chart-foot">
                            <div className="sep"></div>
                            <div className="c-chart-foot-content">
                                {state.showStart}
                                <span className="myChartSep">
                                    {state.sep}
                                </span>
                                {state.showEnd}
                            </div>
                        </div>
                    </Spin>


                </div>

                <div className="c-table">
                    <div className="c-table-head">
                        <div className="left">
                            Data Sources
                        </div>
                    </div>
                    <div className="c-table-body">
                        <Table columns={columns} dataSource={this.state.tableData} loading={this.state.tableLoading}/>
                    </div>
                </div>


            </div>
        )
    }
}


function mapStateToProps(state) {
    return {
        num: state.num,
        opensub: state.opensub
    };
}
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Actions, dispatch)
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(PayAmount);

