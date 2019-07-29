/**
 * Created by user on 2017/8/18.
 */
import  '../common/common.less';

import {Axios, Axios2} from '../common/common';
import TableExport from 'tableexport';

import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as Actions from '../../redux/actions';

import moment from 'moment';
import {DatePicker, Button, Radio, Table, Spin, Input, message, Select, Pagination, Dropdown, Menu, Icon } from 'antd';
const {RangePicker} = DatePicker;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const Option = Select.Option;

let myChart;
message.config({
    top: 80,
    duration: 3,
});




class FreeDiamonds extends React.Component {
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
            loadGiftList: [],
            giftList: [],
            senderList: [],
            rankList: [],
            unionList: [],
            unionid: '',
            pid: '',
            signed: '',
            isDetail: false,
            isRank: false,
            scrollNum: 0,
            pageSize: 40,
            pageNum: 1,
            total: 1,
            channel: '',
            table: ''
        };

        this.onChangeDate = this.onChangeDate.bind(this);
        this.onChangeType = this.onChangeType.bind(this);
        this.onChangePid = this.onChangePid.bind(this);
        this.onChangeSigned = this.onChangeSigned.bind(this);
        this.search = this.search.bind(this);
        this.setChart = this.setChart.bind(this);
        this.List = this.List.bind(this);
        this.unionList = this.unionList.bind(this);
        this.onChangeUnion = this.onChangeUnion.bind(this);
        this.Back = this.Back.bind(this);
        this.onDetail = this.onDetail.bind(this);
        this.onSizeFn = this.onSizeFn.bind(this);
        this.pageFn = this.pageFn.bind(this);
        this.onMenuClick = this.onMenuClick.bind(this);
        this.detailList = this.detailList.bind(this);
        this.exportFn = this.exportFn.bind(this);
    }

    componentWillMount() {
        const {actions} = this.props;
        actions.activePage(24);
        actions.openSub('sub5');
    }

    componentDidMount() {
        // myChart = echarts.init(document.getElementById('chartWrap'));
        this.List();
        this.unionList();
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
        let flag = this.state.flag;
        if( flag == '' ){
            this.List();
        }else if( flag == 'detail' ){
            this.state.channel = '';
            this.detailList();
        }else{
            this.detailList();
        }

    }

    exportFn() {
        if( typeof this.state.table != 'string' ){
            this.state.table.remove();
        }
        let flag = this.state.flag;
        if( flag == 'channel' ){
            this.state.table = TableExport(document.getElementsByTagName("table"), {formats: ['xls'], exportButtons: false});
        }else{
            this.state.table = TableExport(document.getElementsByTagName("table"), {formats: ['xls'], ignoreCols: [2], exportButtons: false});
        }

        var tableData = this.state.table.getExportData();

        var exportDataKey = Object.keys(tableData)[0];
        tableData = tableData[exportDataKey]['xls'];

        this.state.table.export2file(
            tableData.data,
            tableData.mimeType,
            tableData.filename,
            tableData.fileExtension
        );
    }

    setChart(data) {
        // console.log(data);
        const colors = ['#5793f3'];
        let source = [];
        let flag = this.state.flag;
        let loadGift = this.state.loadGiftList;
        if( flag === '' ){
            Object.keys(data).forEach(function (key) {
                source.push({
                    key: data[key].pid,
                    ID: data[key].pid,
                    Amount: data[key].val,
                    Method: data[key].pid
                })
            });
        }else if( flag == 'detail' ){
            Object.keys(data).forEach(function (key) {
                source.push({
                    key: moment(data[key].key).format('M/D'),
                    Date: moment(data[key].key).format('D/M'),
                    Diamonds: data[key].val,
                    Method: data[key].pid
                })
            });
        }else if( flag == 'channel' ){
            let k = 0;
            Object.keys(data).forEach(function (key) {
                k++;
                source.push({
                    key: k,
                    Date: moment(data[key].key).format('D/M'),
                    Diamonds: data[key].val,
                    Method: (data[key].channel[0].toUpperCase()+data[key].channel.substr(1))
                })
            });
        }


        this.setState({
            tableData: source,
            tableLoading: false,
            showStart: moment(this.state.startDate).format('YYYY-MM-DD'),
            showEnd: moment(this.state.endDate).format('YYYY-MM-DD'),
            sep: 'to'
        });
        if( flag === '' ){
            document.body.scrollTop = this.state.scrollNum
        }else{
            document.body.scrollTop = 0
        }

    }


    List() {
        this.setState({
            tableLoading: true,
            isDetail: false,
            flag: ''
        });
        const that = this;
        Axios2(
            'get',
            '/statistic/freeDiamond/list',
            {
                begintime: this.state.startDate,
                endtime: this.state.endDate,
                unionid: this.state.unionid,
                pid: this.state.pid,
                status: this.state.signed
            },
            {
                token: localStorage.getItem('BI-A-TOKEN')
            },
            function (data) {
                // console.log(data)
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
                that.setState({
                    tableLoading: false
                });
                if (err.code === 400) {
                    message.error('the pid does not exist');
                }
            }
        )
    }

    detailList() {
        const that = this;
        this.setState({
            tableLoading: true
        });
        Axios2(
            'get',
            '/statistic/freeDiamond/detail',
            {
                begintime: this.state.startDate,
                endtime: this.state.endDate,
                pid: this.state.pid,
                channel: this.state.channel
            },
            {
                token: localStorage.getItem('BI-A-TOKEN')
            },
            function (data) {
                // data.unshift({code: null, name: 'Please Select'})
                // console.log(data);
                that.setState({
                    tableLoading: false,
                    isDetail: true,
                });
                that.setChart(data);
            },
            function (err) {
                console.log(err);
                that.setState({
                    tableLoading: false
                });
            }
        )
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
                // data.unshift({code: null, name: 'Please Select'})
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

    onMenuClick(e,id) {
        let key = e.key;
        this.state.flag = 'channel';
        if( key == 1 ){
            this.setState({
                channel: 'checkin',
                scrollNum: document.body.scrollTop,
                pid: id,
                isRank: false
            },()=>{this.detailList()})
        }else if( key ==2 ){
            this.setState({
                channel: 'activity',
                scrollNum: document.body.scrollTop,
                pid: id,
                isRank: false
            },()=>{this.detailList()})
        }else if( key ==3 ){
            this.setState({
                channel: 'redpacket',
                scrollNum: document.body.scrollTop,
                pid: id,
                isRank: true
            }, ()=>{this.detailList()})
        }
    }

    onChangeUnion(value){
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

    Back() {
        let flag = this.state.flag;
        if( flag == 'detail' ){
            this.setState({
                unionid: '',
                pid: '',
                status: '',
                isRank: false,
                pageSize: 40
            },()=>{this.List()})
        }else{
            this.state.flag = 'detail';
            this.state.channel = '';
            this.detailList()
        }

    }
    onDetail(id) {
        this.state.pageSize = 40;
        this.state.flag = 'detail';
        this.state.pid = id;
        this.state.channel = '';
        this.detailList();

    }
    onSizeFn(value) {
        this.state.pageSize = value;
        this.List();
        // let flag = this.state.flag;
        // if( flag == '' ){
        //     this.List();
        // }else if( flag == 'sender' ){
        //     this.senderList();
        // }else if( flag == 'gift' ){
        //     this.giftList();
        // }
    }
    pageFn(page, pageSize) {
        this.state.flag = 'rank';
        this.state.pageNum = page;
        this.state.pageSize = pageSize;
        this.rankList()
    }

    render() {
        const that = this;
        const state = this.state;
        let flag = state.flag;
        let columns = [];
        if( flag == '' ){
            columns = [{
                title: 'ID',
                dataIndex: 'ID',
                key: 'ID',
            }, {
                title: 'Amount',
                dataIndex: 'Amount',
                key: 'Amount',
            }, {
                title: 'Method',
                dataIndex: 'Method',
                key: 'Method',
                render: (text, record, index) => {
                    return (
                        <Button size="large" onClick={function(){that.onDetail(record.ID)}}>detail</Button>
                    )
                }
            }];
        }else if( flag == 'detail' ){
            columns = [{
                title: 'Date',
                dataIndex: 'Date',
                key: 'Date',
            }, {
                title: 'Diamonds',
                dataIndex: 'Diamonds',
                key: 'Diamonds',
            }, {
                title: 'Method',
                dataIndex: 'Method',
                key: 'Method',
                render: (text, record, index) => {
                    const menu = (
                        <Menu onClick={function(e){that.onMenuClick(e,record.Method)}}>
                            <Menu.Item key="1">Checkin</Menu.Item>
                            <Menu.Item key="2">Activity</Menu.Item>
                            <Menu.Item key="3">Redpacket</Menu.Item>
                        </Menu>
                    )
                    return (
                        <Dropdown overlay={menu}>
                            <Button style={{ marginLeft: 8 }}>
                                Method <Icon type="down" />
                            </Button>
                        </Dropdown>
                    )
                }
            }];
        }else if( flag == 'channel' ){
            columns = [{
                title: 'Date',
                dataIndex: 'Date',
                key: 'Date',
            }, {
                title: 'Diamonds',
                dataIndex: 'Diamonds',
                key: 'Diamonds',
            }, {
                title: 'Method',
                dataIndex: 'Method',
                key: 'Method'
            }];
        }


        let options = state.unionList.map(item => <Option key={item._id}>{item.name}</Option>);

        return (
            <div className="rightView">
                <div className="salary-head">
                    <div className="content">
                        <Button size="large" style={{marginRight:5}} type="primary" onClick={this.exportFn}>Export</Button>
                        { !state.isDetail ?
                            <Select defaultValue="" size="large" style={{width: 120, marginRight: 5}} onChange={this.onChangeSigned}>
                                <Option value="">All</Option>
                                <Option value="1">Sign</Option>
                                <Option value="0">Not signed</Option>
                            </Select>
                            : ''}
                        { !state.isDetail ?
                            <Select size="large" placeholder="Select Union" style={{width: 120, marginRight: 5}} onChange={this.onChangeUnion}>
                                <option value="">All</option>
                                {options}
                            </Select>
                            : ''}
                        { !state.isDetail ?
                            <Input size="large" placeholder="pid" type="number" className="pidInput" onChange={this.onChangePid}/>
                            : ''}
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
                            {state.isDetail?<Button size="small" icon="arrow-left" onClick={this.Back} type="primary" style={{marginLeft:15}}></Button>:''}
                            {!state.isDetail?
                            <Select defaultValue="40" size="small" style={{width: 80, marginLeft: 15}} onChange={this.onSizeFn}>
                            <Option value="40">Size(40)</Option>
                            <Option value="60">Size(60)</Option>
                            <Option value="80">Size(80)</Option>
                            <Option value="100">Size(100)</Option>
                            <Option value="200">Size(200)</Option>
                            </Select>
                            :''}
                        </div>
                    </div>
                    <div className="c-table-body">
                        <Table columns={columns} pagination={false} dataSource={state.tableData} loading={state.tableLoading}/>
                    </div>
                </div>
                {/*{state.isDetail?*/}
                {/*<div style={{marginBottom: 15}}>*/}
                {/*<Pagination defaultCurrent={state.pageNum} current={state.pageNum} total={state.total} pageSize={state.pageSize} onChange={(page, pageSize)=>{this.pageFn(page, pageSize)}}/>*/}
                {/*</div>*/}
                {/*:''}*/}
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
export default connect(mapStateToProps, mapDispatchToProps)(FreeDiamonds);


