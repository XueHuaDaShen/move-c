/**
 * Created by wangleping on 2017/5/11.
 */
import  '../common/common.less';
// import './fishball.less';

import {Axios} from '../common/common';

import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as Actions from '../../redux/actions';

import moment from 'moment';
import {DatePicker, Button, Radio, Table, Spin, Input} from 'antd';
const {RangePicker} = DatePicker;
// const RadioButton = Radio.Button;
// const RadioGroup = Radio.Group;
let myChart;

// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';

import 'echarts/lib/chart/line';
import 'echarts/lib/chart/bar';


import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/toolbox';


class Fishball extends React.Component {
    constructor() {
        super();
        this.state = {
            pid: '',
            startDate: moment.utc().startOf('day').subtract(7, 'days').format(),
            endDate: moment.utc().endOf('day').subtract(1, 'days').format(),
            tableData: [],
            tableLoading: false,
            showStart: '',
            showEnd: '',
            sep: ''
        };

        this.onChangeDate = this.onChangeDate.bind(this);
        // this.onChangeType = this.onChangeType.bind(this);
        // this.onChangeDataType = this.onChangeDataType.bind(this);
        this.search = this.search.bind(this);
        this.setChart = this.setChart.bind(this);
        this.List = this.List.bind(this);
    }

    componentWillMount() {
        const {actions} = this.props;
        actions.activePage(7);
        actions.openSub('sub2');
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

    // onChangeType(e) {
    //     const that = this;
    //     this.setState({
    //             type: e.target.value
    //         }, function () {
    //             that.List();
    //         }
    //     );
    //
    // }
    //
    // onChangeDataType(value) {
    //     this.setState({
    //         dataType: value
    //     })
    // }

    search() {
        // this.List();
    }

    setChart(data) {
        const colors = ['#5793f3'];
        let xAxis = [];
        let yAxis = [];
        let source = [];

        data.forEach(function (val) {
            xAxis.push(moment(val["date"]).format('M/D'));
            yAxis.push(val["total_coin"]);
            source.push({
                key: moment(val["date"]).format('M/D'),
                date: moment(val["date"]).format('M/D'),
                fishball: val["total_coin"]
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
                text: 'System fishball'
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
            '/system/coin/statistics',
            {
                begintime: this.state.startDate,
                endtime: this.state.endDate,
                // pid: this.state.pid
            },
            {
                token: localStorage.getItem('BI-A-TOKEN')
            },
            function (data) {
                that.setChart(data);
                // console.log(data)
            },
            function (err) {
                console.log(err)
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
            dataIndex: 'fishball',
            key: 'fishball',
        }];


        return (
            <div className="rightView">
                <div className="salary-head">
                    <div className="content">
                        {/*<Input size = "large" placeholder = "pid" className="pidInput"/>*/}
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
                        {/*<div className="right">*/}
                            {/*<RadioGroup onChange={this.onChangeType} defaultValue="1">*/}
                                {/*<RadioButton value="1">日</RadioButton>*/}
                                {/*<RadioButton value="2" disabled={false}>周</RadioButton>*/}
                                {/*<RadioButton value="3">月</RadioButton>*/}
                            {/*</RadioGroup>*/}
                        {/*</div>*/}
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
export default connect(mapStateToProps, mapDispatchToProps)(Fishball);

