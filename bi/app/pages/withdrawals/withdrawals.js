/**
 * Created by user on 2017/7/24.
 */
import  '../common/common.less';

import {Axios} from '../common/common';

import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as Actions from '../../redux/actions';

import moment from 'moment';
import {DatePicker, Button, Radio, Table, Spin, Input, message, Select} from 'antd';
const {RangePicker} = DatePicker;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const Option = Select.Option;

let myChart;
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


class Withdrawals extends React.Component {
    constructor() {
        super();
        this.state = {
            startDate: moment.utc().startOf('day').subtract(7, 'days').format(),
            endDate: moment.utc().endOf('day').subtract(1, 'days').format(),
            tableData: [],
            tableLoading: false,
            showStart: '',
            showEnd: '',
            sep: '',
            type: 1,
            flag: ''
        };

        this.onChangeDate = this.onChangeDate.bind(this);
        this.onChangeType = this.onChangeType.bind(this);
        this.onChangeDataType = this.onChangeDataType.bind(this);
        this.search = this.search.bind(this);
        this.setChart = this.setChart.bind(this);
        this.List = this.List.bind(this);
    }

    componentWillMount() {
        const {actions} = this.props;
        actions.activePage(12);
        actions.openSub('sub3');
    }

    componentDidMount() {
        myChart = echarts.init(document.getElementById('chartWrap'));
        // this.List();
    }

    onChangeDate(dates, dateStrings) {
        this.setState({
            startDate: moment.utc(dateStrings[0]).startOf('day').format(),
            endDate: moment.utc(dateStrings[1]).endOf('day').format()
        })

    }

    onChangeType(e) {
        const that = this;
        this.setState({
                type: e.target.value
            }, function () {
                // that.List();
            }
        );

    }

    onChangeDataType(value) {
        console.log(value);
        this.setState({
            flag: value
        })
    }



    search() {
        // this.List();
    }

    setChart(data) {
        // console.log(data);
        const colors = ['#5793f3'];
        let xAxis = [];
        let yAxis = [];
        let source = [];

        Object.keys(data).forEach(function (key) {
            // console.log("key: " + key +", val: " + data[key].diamonds + "||" + data[key].diamonds);
            xAxis.push(moment(Number(key)).format('M/D'));
            yAxis.push(data[key].coins.value);
            source.push({
                key: moment(Number(key)).format('M/D'),
                date: moment(Number(key)).format('M/D'),
                fish: data[key].coins.value
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
                text: 'Withdrawals bill'
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
                data: ['fishball']
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
                    scale: true,
                    axisLine: {
                        show: false,
                    },
                    axisTick: {
                        show: false
                    },
                    // splitNumber: '3',
                    axisLabel: {
                        formatter: '{value} '
                    }
                }
            ],
            series: [
                {
                    name: 'fishball',
                    type: 'line',
                    data: yAxis
                }
            ]
        });
    }


    List() {
        this.setState({
            tableLoading: true
        });
        const that = this;
        Axios(
            'post',
            '/payment/coin/statistics',
            {
                begintime: this.state.startDate,
                endtime: this.state.endDate,
                typeOfDate: this.state.type,
                flag: this.state.flag
            },
            {
                token: localStorage.getItem('BI-A-TOKEN')
            },
            function (data) {
                that.setChart(data);
                // console.log(data)
            },
            function (err) {
                console.log(err);
                if (err.code === 400) {
                    message.error('the pid does not exist');
                }
            }
        )
    }


    render() {
        let state = this.state;
        const columns = [{
            title: 'date',
            dataIndex: 'date',
            key: 'date',
        }, {
            title: 'fishball',
            dataIndex: 'fish',
            key: 'fish',
        }];


        return (
            <div className="rightView">
                <div className="salary-head">
                    <div className="content">
                        <Select defaultValue="2" style={{width: 120}} onChange={this.onChangeDataType}>
                            <Option value="1">count</Option>
                            <Option value="2">fishball</Option>
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
export default connect(mapStateToProps, mapDispatchToProps)(Withdrawals);


