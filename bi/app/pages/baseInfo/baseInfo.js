/**
 * Created by user on 2017/8/16.
 */
import  '../common/common.less';
import  './baseInfo.less';

import {Axios, Axios2} from '../common/common';

import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as Actions from '../../redux/actions';

import moment from 'moment';
import {DatePicker, Button, Radio, Table, Spin, Input, message, Select, Pagination, Modal } from 'antd';
const {RangePicker} = DatePicker;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const Option = Select.Option;

let myChart;
message.config({
    top: 80,
    duration: 3,
});




class BaseInfo extends React.Component {
    constructor() {
        super();
        this.state = {
            startDate: moment.utc().startOf('day').subtract(7, 'days').format(),
            endDate: moment.utc().endOf('day').subtract(1, 'days').format(),
            tableData: [],
            tableLoading: false,
            DEloading: false,
            DEvisible: false,
            showStart: '',
            showEnd: '',
            sep: '',
            type: 1,
            flag: '',
            giftList: [],
            unionid: '',
            pid: '',
            signed: '',
            isDetail: false,
            scrollNum: 0,
            htmlID: '',
            htmlName: '',
            htmlDate: '',
            htmlLast: '',
            htmlLastPay: '',
            htmlLastRecharge: '',
            total: 1,
            pageNum: 1,
            pageSize: 40
        };

        this.onChangeDate = this.onChangeDate.bind(this);
        this.onChangeType = this.onChangeType.bind(this);
        this.onChangePid = this.onChangePid.bind(this);
        this.onChangeSigned = this.onChangeSigned.bind(this);
        this.search = this.search.bind(this);
        this.setChart = this.setChart.bind(this);
        this.List = this.List.bind(this);
        this.giftList = this.giftList.bind(this);
        this.onChangeGift = this.onChangeGift.bind(this);
        this.onDetail = this.onDetail.bind(this);
        this.Back = this.Back.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.showModal = this.showModal.bind(this);
        this.pageFn = this.pageFn.bind(this);
    }

    componentWillMount() {
        const {actions} = this.props;
        actions.activePage(20);
        actions.openSub('sub5');
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
    onChangeSigned(value) {
        // console.log(value);
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

    onChangePid(e) {
        // console.log(e.target.value);
        this.setState({
            pid: e.target.value
        })
    }



    search() {
        this.setState({
            tableLoading: true,
            pageNum: 1
        }, ()=>{this.List()})
    }

    setChart(data) {
        // console.log(data);
        const colors = ['#5793f3'];
        let xAxis = [];
        let yAxis = [];
        let source = [];
        let flag = this.state.flag;
        Object.keys(data).forEach(function (key) {
            // data[key].user.avatar = 'http://www.tutulive.tv/op/0721_tu/img/banner.png'
            source.push({
                key: data[key].pid,
                ID: data[key].pid,
                Name: data[key].loginname_nlz,
                Sign: data[key].is_signed==0?'Not signed':'Sign',
                Fans: data[key].num_follower,
                diamond: data[key].diamond,
                operate: data[key].pid
            })
        });


        this.setState({
            tableData: source,
            tableLoading: false,
            showStart: moment(this.state.startDate).format('YYYY-MM-DD'),
            showEnd: moment(this.state.endDate).format('YYYY-MM-DD'),
            sep: 'to'
        });
        if( flag == 'page' ){
            document.body.scrollTop = 0;
        }
        // document.body.scrollTop = this.state.scrollNum;

    }


    List() {
        this.setState({
            tableLoading: true,
            isDetail: false
        })
        
        const that = this;
        Axios2(
            'get',
            '/statistic/user/list',
            {
                unionid: this.state.unionid,
                pid: this.state.pid,
                status: this.state.signed,
                page: this.state.pageNum,
                size: this.state.pageSize
            },
            {
                token: localStorage.getItem('BI-A-TOKEN')
            },
            function (data) {
                // console.log(data)
                if(typeof data == 'string'){
                    that.setState({
                        tableLoading: false,
                        total: 1,
                        pageNum: 1
                    },()=>{that.setChart([])});
                }else{
                    that.setState({
                        total: parseInt(data.total),
                        pageNum: parseInt(data.pageNum)
                    },()=>{that.setChart(data.content)});
                }
            },
            function (err) {
                console.log(err);
                that.setState({
                    tableLoading: false
                });
                if (err.code === 400) {
                    message.error('the pid does not exist');
                }
            }
        )
    }

    giftList() {
        const that = this;
        Axios(
            'get',
            '/union/getList',
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
            unionid: value
        }, function () {
            console.log(that.state.unionid)
        })
    }
    onDetail(pid){
        this.setState({
            tableLoading: true
        });
        const that = this;
        Axios2(
            'get',
            '/statistic/user/detail',
            {
                unionid: this.state.unionid,
                pid: pid,
                status: this.state.signed
            },
            {
                token: localStorage.getItem('BI-A-TOKEN')
            },
            function (data) {
                // console.log(data)
                that.setState({
                    tableLoading: false
                });
                that.setState({
                    htmlID: data.pid,
                    htmlName: data.loginname_nlz,
                    htmlDate: data.create_at,
                    htmlLast: data.lastLoginDate,
                    htmlLastPay: data.lastDiamondPay||'',
                    htmlLastRecharge: data.lastDiamondRecharge||''
                })
                that.showModal();
            },
            function (err) {
                that.setState({
                    html: err
                })
                that.showModal();
                console.log(err);
                if (err.code === 400) {
                    message.error('the pid does not exist');
                }
            }
        )
    }

    Back() {
        this.List();
    }
    showModal(){
        this.setState({
            DEvisible: true,
        });
    }
    handleCancel(){
        this.setState({ DEvisible: false });
    }
    pageFn(page, pageSize) {
        this.state.flag = 'page';
        this.state.pageNum = page;
        this.state.pageSize = pageSize;
        this.List()
    }

    render() {
        const that = this;
        let state = this.state;
        const columns = [{
            title: 'ID',
            dataIndex: 'ID',
            key: 'ID',
        }, {
            title: 'Name',
            dataIndex: 'Name',
            key: 'Name',
        }, {
            title: 'Sign',
            dataIndex: 'Sign',
            key: 'Sign',
        }, {
            title: 'Fans',
            dataIndex: 'Fans',
            key: 'Fans',
        }, {
            title: 'diamond',
            dataIndex: 'diamond',
            key: 'diamond',
        }, {
            title: 'operate',
            dataIndex: 'operate',
            key: 'operate',
            render: (text, record, index) => {
                return (
                    <Button size="large" onClick={function(){that.onDetail(record.ID)}}>detail</Button>
                )
            }
        }];

        let options = state.giftList.map(item => <Option key={item._id}>{item.name}</Option>);

        return (
            <div className="rightView">
                <div className="salary-head">
                    <div className="content">
                        <Select defaultValue="" size="large" style={{width: 120, marginRight: 5}} onChange={this.onChangeSigned}>
                            <Option value="">All</Option>
                            <Option value="1">Sign</Option>
                            <Option value="0">Not signed</Option>
                        </Select>
                        <Select size="large" placeholder="Select Union" style={{width: 120, marginRight: 5}}
                                onChange={this.onChangeGift}>
                            <option value="">All</option>
                            {options}
                        </Select>
                        <Input size="large" placeholder="pid" type="number" className="pidInput" onChange={this.onChangePid}/>
                        {/*<RangePicker*/}
                            {/*defaultValue={[moment.utc().startOf('day').subtract(7, 'days'), moment.utc().subtract(1, 'days')]}*/}
                            {/*size="large" onChange={this.onChangeDate} ranges={{*/}
                            {/*'Last 7 days': [moment.utc().startOf('day').subtract(7, 'days'), moment.utc().endOf('day').subtract(1, 'days')],*/}
                            {/*'Last 30 days': [moment.utc().startOf('day').subtract(30, 'days'), moment.utc().endOf('day').subtract(1, 'days')],*/}
                            {/*'Last 60 days': [moment.utc().startOf('day').subtract(60, 'days'), moment.utc().endOf('day').subtract(1, 'days')]*/}
                        {/*}} className="salary-date"/>*/}
                        <Button size="large" icon="search" type="primary" onClick={this.search}></Button>
                    </div>

                </div>


                <div className="c-table">
                    <div className="c-table-head">
                        <div className="left">
                            Data Sources
                            {/*{state.isDetail?<Button size="large" icon="arrow-left" onClick={this.Back} type="primary" style={{marginLeft:15}}></Button>:''}*/}
                        </div>
                    </div>
                    <div className="c-table-body">
                        <Table columns={columns} rowClassName={function(r,i){return 'myTr'}} pagination={false} dataSource={state.tableData} loading={state.tableLoading}/>
                    </div>
                    <Modal
                        visible={state.DEvisible}
                        title="Detail"
                        onOk={this.handleCancel}
                        onCancel={this.handleCancel}
                        footer={[
                            <Button key="back" size="large" onClick={this.handleCancel}>Cancel</Button>,
                            <Button key="submit" type="primary" size="large" onClick={this.handleCancel}>
                                OK
                            </Button>,
                        ]}
                    >
                        <p className="detailP"><span>ID</span><i>：</i><em>{state.htmlID}</em></p>
                        <p className="detailP"><span>Name</span><i>：</i><em>{state.htmlName}</em></p>
                        <p className="detailP"><span>DateCreate</span><i>：</i><em>{state.htmlDate}</em></p>
                        <p className="detailP"><span>LastLogin</span><i>：</i><em>{state.htmlLast}</em></p>
                        <p className="detailP"><span>LastDiamondPay</span><i>：</i><em>{state.htmlLastPay}</em></p>
                        <p className="detailP"><span>LastDiamondRecharge</span><i>：</i><em>{state.htmlLastRecharge}</em></p>
                    </Modal>
                </div>
                <div style={{marginBottom: 15}}>
                    <Pagination defaultCurrent={state.pageNum} current={state.pageNum} total={state.total} pageSize={state.pageSize} onChange={(page, pageSize)=>{this.pageFn(page, pageSize)}} />
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
export default connect(mapStateToProps, mapDispatchToProps)(BaseInfo);


