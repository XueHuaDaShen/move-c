/**
 * Created by wangleping on 2017/5/9.
 */
import  '../common/common.less';
// import './payNum.less';

import {Axios, Axios2} from '../common/common';

//补充数据的函数
import completionData from '../../time';

import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as Actions from '../../redux/actions';

import moment from 'moment';
import {DatePicker, Button, Radio, Select, Input, Table, message, Spin} from 'antd';
const {RangePicker} = DatePicker;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const Option = Select.Option;
let myChart;
let detailChart;
message.config({
    top: 80,
    duration: 3,
});

// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';

import 'echarts/lib/chart/line';
import 'echarts/lib/chart/bar';


import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/toolbox';





class PayNum extends React.Component {
    constructor() {
        super();
        this.state = {
            type: '1',
            signed: '',
            pid: '',
            intervalType: '',
            timeType: '1',
            startDate: moment.utc().startOf('day').subtract(7, 'days').format(),
            endDate: moment.utc().endOf('day').subtract(1, 'days').format(),
            dataType: '',
            tableData: [],
            tableLoading: false,
            showStart: '',
            showEnd: '',
            sep: '',
            flag: 'duration',
            isDetail: false,
            detailLoading: false,
            detailData: [],
            nowDay: '',
        };

        this.onChangeDate = this.onChangeDate.bind(this);
        this.onChangeType = this.onChangeType.bind(this);
        this.onChangeSigned = this.onChangeSigned.bind(this);
        this.onChangeTimeType = this.onChangeTimeType.bind(this);
        this.onChangeDataType = this.onChangeDataType.bind(this);
        this.search = this.search.bind(this);
        this.setChart = this.setChart.bind(this);
        this.setDetailChart = this.setDetailChart.bind(this);
        this.List = this.List.bind(this);
        this.onDetail = this.onDetail.bind(this);
        this.Back = this.Back.bind(this);
    }

    componentWillMount() {
        const {actions} = this.props;
        actions.activePage(6);
        actions.openSub('sub2');
    }

    componentDidMount() {
        myChart = echarts.init(document.getElementById('chartWrap'));
        this.List();
    }

    onChangeDate(dates, dateStrings) {
        this.setState({
            startDate: moment.utc(dateStrings[0]).startOf('day').format(),
            endDate: moment.utc(dateStrings[1]).endOf('day').format()
        })

    }

    onChangeSigned(value) {
        console.log(value);
        this.setState({
            signed: value
        })
    }
    onChangeType(e) {
        const that = this;
        this.setState({
                type: e.target.value
            }, function () {
                that.List();
            }
        );

    }

    onChangeDataType(value) {
        this.setState({
            intervalType: value
        })
    }
    onChangeTimeType(value, option) {
        this.setState({
            timeType: value
        })
        this.state.flag = value == '' ? 'All':option.props.children;
    }

    search() {
        this.setState({
            isDetail: false
        },()=>{this.List();})

    }

    setChart(data) {
        const colors = ['#5793f3'];
        const that = this;
        let xAxis = [];
        let yAxis = [];
        let source = [];
        // console.log(data);

        var data = completionData(data);
        Object.keys(data).forEach(function (key) {
            xAxis.push(moment(data[key].key).format('M/D'));
            yAxis.push(data[key].val);
            source.push({
                key: moment(data[key].key).format('Y/M/D'),
                date: moment(data[key].key).format('M/D'),
                payers: data[key].val
            })
        });

        this.setState({
            tableData: source,
            tableLoading: false,
            showStart: moment(this.state.startDate).format('YYYY-MM-DD'),
            showEnd: moment(this.state.endDate).format('YYYY-MM-DD'),
            sep: 'to'
        });


        myChart.setOption({
            color: colors,

            title: {
                text: 'Live Number'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross'
                }
            },
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
                    data: yAxis
                }
            ]
        });
    }

    setDetailChart(data) {
        console.log(this.state.isDetail)
        console.log(myChart)
        console.log(detailChart)
        const colors = ['#5793f3'];
        const that = this;
        let xAxis = [];
        let yAxis = [];
        let source = [];
        console.log(data);

        var data = completionData(data);
        Object.keys(data).forEach(function (key) {
            xAxis.push(data[key].key);
            yAxis.push(data[key].val);
            source.push({
                key: data[key].key,
                date: data[key].key,
                payers: data[key].val
            })
        });

        this.setState({
            detailData: source,
            detailLoading: false
        });


        detailChart.setOption({
            color: colors,

            title: {
                text: 'Live Number'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross'
                }
            },
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
                    data: yAxis
                }
            ]
        });
    }

    onChangePid(e) {
        this.setState({
            pid: e.target.value
        })
    }

    List() {
        this.setState({
            tableLoading: true
        });
        const that = this;
        Axios2(
            'post',
            '/host/live',
            {
                pid: this.state.pid,
                signed: this.state.signed,
                intervalType: this.state.intervalType,
                type: this.state.timeType,
                begintime: this.state.startDate,
                endtime: this.state.endDate,
                typeOfDate: this.state.type
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

    onDetail(record){
        console.log(record)
        const that = this;
        this.setState({
            isDetail: true,
            nowDay: record.key
        }, ()=>{detailChart = echarts.init(document.getElementById('detailChart'))});
        Axios2(
            'post',
            '/host/live/day',
            {
                pid: this.state.pid,
                signed: this.state.signed,
                intervalType: this.state.intervalType,
                type: this.state.timeType,
                begintime: record.key,
                endtime: record.key
            },
            {
                token: localStorage.getItem('BI-A-TOKEN')
            },
            function (data) {
                // console.log(data);
                that.setDetailChart(data)
            },
            function (err) {
                console.log(err);
            }
        )
    }
    Back() {
        this.setState({
            isDetail: false
        })
    }


    render() {
        let state = this.state;
        const that = this;
        const columns = [{
            title: 'date',
            dataIndex: 'date',
            key: 'date',
        }, {
            title: state.flag,
            dataIndex: 'payers',
            key: 'payers',
        }, {
            title: 'operate',
            dataIndex: 'operate',
            key: 'operate',
            render: (text, record, index) => {
                return (
                    <Button size="large" onClick={function(){that.onDetail(record)}}>detail</Button>
                )
            }
        }];


        return (
            <div className="rightView">
                <div className="salary-head">
                    <div className="content">
                        <Select defaultValue="" size="large" style={{width: 120, marginRight: 5}} onChange={this.onChangeSigned}>
                            <Option value="">All</Option>
                            <Option value="1">Sign</Option>
                            <Option value="0">Not signed</Option>
                        </Select>
                        <Select defaultValue="1" size="large" style={{width: 120, marginRight: 5}} onSelect={this.onChangeTimeType}>
                            <Option value="1">duration</Option>
                            <Option value="2">count</Option>
                        </Select>
                        <Select defaultValue="" size="large" style={{width: 120, marginRight: 5}} onChange={this.onChangeDataType}>
                            <Option value="">All</Option>
                            <Option value="1">Effective live broadcast</Option>
                            <Option value="0">Invalid live broadcast</Option>
                        </Select>
                        <Input size="large" placeholder="pid" type="number" className="pidInput" style={{width: 120, marginRight: 5}} onChange={this.onChangePid}/>
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
                {!state.isDetail?
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
                :""}

                {state.isDetail?
                    <div className="c-chart">
                        <div className="c-chart-head">
                            <div className="left">
                                Detail
                                <Button size="small" icon="arrow-left" onClick={this.Back}  type="primary" style={{marginLeft:15}}></Button>
                            </div>
                        </div>
                        <Spin spinning={this.state.tableLoading}>
                            <div className="c-chart-body">
                                <div id="detailChart" className="myChartWrap"></div>
                            </div>
                            <div className="c-chart-foot">
                                <div className="sep"></div>
                                <div className="c-chart-foot-content">
                                    {state.nowDay}
                                </div>
                            </div>
                        </Spin>
                    </div>
                :""}
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
export default connect(mapStateToProps, mapDispatchToProps)(PayNum);

