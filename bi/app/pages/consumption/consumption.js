/**
 * Created by user on 2017/7/24.
 */
import  '../common/common.less';

import {Axios, Axios2} from '../common/common';

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




class Consumption extends React.Component {
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
            flag: '',
            giftList: [],
            product: '',
            pid: ''
        };

        this.onChangeDate = this.onChangeDate.bind(this);
        this.onChangeType = this.onChangeType.bind(this);
        this.onChangePid = this.onChangePid.bind(this);
        this.search = this.search.bind(this);
        this.setChart = this.setChart.bind(this);
        this.List = this.List.bind(this);
        this.giftList = this.giftList.bind(this);
        this.onChangeGift = this.onChangeGift.bind(this);
    }

    componentWillMount() {
        const {actions} = this.props;
        actions.activePage(16);
        actions.openSub('sub4');
    }

    componentDidMount() {
        // myChart = echarts.init(document.getElementById('chartWrap'));
        this.List();
        this.giftList();
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
                that.List();
            }
        );

    }

    onChangePid(e) {
        console.log(e.target.value);
        this.setState({
            pid: e.target.value
        })
    }



    search() {
        this.List();
    }

    setChart(data) {
        // console.log(data);
        const colors = ['#5793f3'];
        let xAxis = [];
        let yAxis = [];
        let source = [];

        Object.keys(data).forEach(function (key) {
            // data[key].user.avatar = 'http://www.tutulive.tv/op/0721_tu/img/banner.png'
            source.push({
                key: data[key].user.pid,
                pid: data[key].user.pid,
                loginname: data[key].user.loginname,
                avatar: data[key].user.avatar,
                consume: data[key].val
            })
        });


        this.setState({
            tableData: source,
            tableLoading: false,
            showStart: moment(this.state.startDate).format('YYYY-MM-DD'),
            showEnd: moment(this.state.endDate).format('YYYY-MM-DD'),
            sep: 'to'
        });

    }


    List() {
        this.setState({
            tableLoading: true
        });
        const that = this;
        Axios2(
            'post',
            '/rank/fan/consume',
            {
                begintime: this.state.startDate,
                endtime: this.state.endDate,
                product: this.state.product,
                pid: this.state.pid
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
                console.log(err);
                if (err.code === 400) {
                    message.error('the pid does not exist');
                }
            }
        )
    }

    giftList() {
        const that = this;
        Axios2(
            'get',
            '/gift/list',
            {},
            {
                token: localStorage.getItem('BI-A-TOKEN')
            },
            function (data) {
                // data.unshift({code: null, name: 'Please Select'})
                // console.log(data);
                that.setState({
                    giftList: data
                })
            },
            function (err) {
                console.log(err);
            }
        )
    }

    onChangeGift(value){
        const that = this;
        // console.log(value)
        if (value == 'null') {
            value = '';
        }
        this.setState({
            product: value
        }, function () {
            console.log(that.state.product)
        })
    }

    render() {
        let state = this.state;
        const columns = [{
            title: 'pid',
            dataIndex: 'pid',
            key: 'pid',
        }, {
            title: 'avatar',
            dataIndex: 'avatar',
            key: 'avatar',
            render: (text, record, index) => {
                var img = '';
                if( record.avatar ){
                    img = record.avatar.indexOf("i1.live.aisoqu.com") > -1 ? '?imageView2/1/w/100/h/100':'';
                }else{
                    img = '';
                }
                return (
                    <a href={record.avatar} target="_blank"><img style={{width:"50px"}} src={record.avatar+img}/></a>
                )
            }
        }, {
            title: 'loginname',
            dataIndex: 'loginname',
            key: 'loginname',
        }, {
            title: 'consume',
            dataIndex: 'consume',
            key: 'consume',
        }];

        let options = this.state.giftList.map(item => <Option key={item.code}>{item.name}</Option>);

        return (
            <div className="rightView">
                <div className="salary-head">
                    <div className="content">
                        <Select size="large" placeholder="Select Gift" style={{width: 120, marginRight: 5}}
                                onChange={this.onChangeGift}>
                            <option value="">All</option>
                            {options}
                        </Select>
                        <Input size="large" placeholder="pid" type="number" className="pidInput" onChange={this.onChangePid}/>
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
export default connect(mapStateToProps, mapDispatchToProps)(Consumption);


