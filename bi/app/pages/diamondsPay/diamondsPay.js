/**
 * Created by user on 2017/8/17.
 */

import  '../common/common.less';

import {Axios, Axios2} from '../common/common';
import TableExport from 'tableexport';

import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as Actions from '../../redux/actions';

import moment from 'moment';
import {DatePicker, Button, Radio, Table, Spin, Input, message, Select, Pagination, Modal, Dropdown, Menu, Icon } from 'antd';
const {RangePicker} = DatePicker;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const Option = Select.Option;

let myChart;
message.config({
    top: 80,
    duration: 3,
});




class DiamondsPay extends React.Component {
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
            scrollNum: 0,
            pageSize: 40,
            pageNum: 1,
            total: 1,
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
        this.giftList = this.giftList.bind(this);
        this.senderList = this.senderList.bind(this);
        this.rankList = this.rankList.bind(this);
        this.onChangeUnion = this.onChangeUnion.bind(this);
        this.Back = this.Back.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleOk = this.handleOk.bind(this);
        this.showModal = this.showModal.bind(this);
        this.onMenuClick = this.onMenuClick.bind(this);
        this.loadGiftList = this.loadGiftList.bind(this);
        this.onSizeFn = this.onSizeFn.bind(this);
        this.pageFn = this.pageFn.bind(this);
        this.exportFn = this.exportFn.bind(this);
    }

    componentWillMount() {
        const {actions} = this.props;
        actions.activePage(22);
        actions.openSub('sub5');
    }

    componentDidMount() {
        // myChart = echarts.init(document.getElementById('chartWrap'));
        this.List();
        this.unionList();
        this.loadGiftList();
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
        }else if( flag == 'sender' ){
            this.senderList();
        }else if( flag == 'gift' ){
            this.giftList();
        }else if( flag == 'rank' ){
            this.rankList();
        }

    }

    exportFn() {
        if( typeof this.state.table != 'string' ){
            this.state.table.remove();
        }
        let flag = this.state.flag;
        if( flag === '' ){
            this.state.table = TableExport(document.getElementsByTagName("table"), {formats: ['xls'], ignoreCols: [2], exportButtons: false});
        }else{
            this.state.table = TableExport(document.getElementsByTagName("table"), {formats: ['xls'], exportButtons: false});
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
                    Amount: data[key].amount,
                    operate: data[key].pid
                })
            });
        }else if( flag == 'sender' ){
            Object.keys(data).forEach(function (key) {
                source.push({
                    key: data[key].pid,
                    SendToID: data[key].pid,
                    Amount: data[key].amount
                })
            });
        }else if( flag == 'gift' ){
            Object.keys(data).forEach(function (key) {
                let code = data[key].gift;
                Object.keys(loadGift).forEach(function(k) {
                    if( loadGift[k].code == code ){
                        source.push({
                            key: data[key].gift,
                            Gift: loadGift[k].name,
                            Price: loadGift[k].diamonds,
                            Amount: data[key].COUNT,
                            Fishballs: data[key].SUM
                        })
                    }
                })
            });
        }else if( flag == 'rank' ){
            var newKey = 0;
            Object.keys(data).forEach(function (key) {
                // data[key].user.avatar = 'http://www.tutulive.tv/op/0721_tu/img/banner.png'
                let code = data[key].gift;
                newKey+=1;
                Object.keys(loadGift).forEach(function(k) {
                    if( loadGift[k].code == code ){
                        source.push({
                            key: newKey,
                            SenderToID: data[key].receiverPid,
                            Gift: loadGift[k].name,
                            Price: data[key].price,
                            Date: moment(data[key].date).format('YYYY-MM-DD')
                        })
                    }
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
            '/statistic/consumer/rank',
            {
                begintime: this.state.startDate,
                endtime: this.state.endDate,
                pid: this.state.pid
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

    loadGiftList() {
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
                    loadGiftList: data
                })
            },
            function (err) {
                console.log(err);
            }
        )
    }

    giftList() {
        const that = this;
        this.setState({
            tableLoading: true
        });
        Axios2(
            'get',
            '/statistic/consumer/gift/list',
            {
                begintime: this.state.startDate,
                endtime: this.state.endDate,
                size: this.state.pageSize,
                pid: this.state.pid
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
    senderList() {
        const that = this;
        this.setState({
            tableLoading: true
        });
        Axios2(
            'get',
            '/statistic/consumer/receiver/rank',
            {
                begintime: this.state.startDate,
                endtime: this.state.endDate,
                size: this.state.pageSize,
                pid: this.state.pid
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
    rankList() {
        const that = this;
        this.setState({
            tableLoading: true
        });
        Axios2(
            'get',
            '/statistic/consumer/list',
            {
                begintime: this.state.startDate,
                endtime: this.state.endDate,
                size: this.state.pageSize,
                pid: this.state.pid,
                page: this.state.pageNum
            },
            {
                token: localStorage.getItem('BI-A-TOKEN')
            },
            function (data) {
                // data.unshift({code: null, name: 'Please Select'})
                // console.log(data);
                if(typeof data == 'string'){
                    that.setState({
                        tableLoading: false,
                        isDetail: true,
                        total: 1,
                        pageNum: 1
                    },()=>{that.setChart([])});
                }else{
                    that.setState({
                        tableLoading: false,
                        isDetail: true,
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
            }
        )
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
        this.setState({
            unionid: '',
            pid: '',
            status: '',
            pageSize: 40
        },()=>{this.List()})
    }
    pageFn(page, pageSize) {
        this.state.flag = 'rank';
        this.state.pageNum = page;
        this.state.pageSize = pageSize;
        this.rankList()
    }
    showModal(){
        this.setState({
            DEvisible: true,
        });
    }
    handleOk(){
        this.setState({ DEloading: true });
        setTimeout(() => {
            this.setState({ DEloading: false, DEvisible: false });
        }, 3000);
    }
    handleCancel(){
        this.setState({ DEvisible: false });
    }
    onSizeFn(value) {
        this.state.pageSize = value;
        let flag = this.state.flag;
        if( flag == '' ){
            this.List();
        }else if( flag == 'sender' ){
            this.senderList();
        }else if( flag == 'gift' ){
            this.giftList();
        }else if( flag == 'rank' ){
            this.rankList();
        }
    }
    onMenuClick(e,id) {
        this.state.pageSize = 40;
        let key = e.key;
        if( key == 1 ){
            this.setState({
                flag: 'sender',
                scrollNum: document.body.scrollTop,
                pid: id
            },()=>{this.senderList()})
        }else if( key ==2 ){
            this.setState({
                flag: 'gift',
                scrollNum: document.body.scrollTop,
                pid: id
            },()=>{this.giftList()})
        }else if( key ==3 ){
            this.setState({
                flag: 'rank',
                pageNum: 1,
                scrollNum: document.body.scrollTop,
                pid: id
            }, ()=>{this.rankList()})
        }

    }

    render() {
        const that = this;
        let flag = this.state.flag;
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
                title: 'operate',
                dataIndex: 'operate',
                key: 'operate',
                render: (text, record, index) => {
                    const menu = (
                        <Menu onClick={function(e){that.onMenuClick(e,record.ID)}}>
                            <Menu.Item key="1">by receiver</Menu.Item>
                            <Menu.Item key="2">by gift</Menu.Item>
                            <Menu.Item key="3">list</Menu.Item>
                        </Menu>
                    )
                    return (
                        <Dropdown overlay={menu}>
                            <Button style={{ marginLeft: 8 }}>
                                detail <Icon type="down" />
                            </Button>
                        </Dropdown>
                    )
                }
            }];
        }else if( flag == 'sender' ){
            columns = [{
                title: 'SendToID',
                dataIndex: 'SendToID',
                key: 'SendToID',
            }, {
                title: 'Amount',
                dataIndex: 'Amount',
                key: 'Amount',
            }];
        }else if( flag == 'gift' ){
            columns = [{
                title: 'Gift',
                dataIndex: 'Gift',
                key: 'Gift',
            }, {
                title: 'Price',
                dataIndex: 'Price',
                key: 'Price',
            }, {
                title: 'Amount',
                dataIndex: 'Amount',
                key: 'Amount',
            }, {
                title: 'Fishballs',
                dataIndex: 'Fishballs',
                key: 'Fishballs',
            }];
        }else if( flag == 'rank' ){
            columns = [{
                title: 'SenderToID',
                dataIndex: 'SenderToID',
                key: 'SenderToID',
            }, {
                title: 'Gift',
                dataIndex: 'Gift',
                key: 'Gift',
            }, {
                title: 'Price',
                dataIndex: 'Price',
                key: 'Price',
            }, {
                title: 'Date',
                dataIndex: 'Date',
                key: 'Date',
            }];
        }


        let options = this.state.unionList.map(item => <Option key={item._id}>{item.name}</Option>);

        return (
            <div className="rightView">
                <div className="salary-head">
                    <div className="content">
                        {/*<Select defaultValue="" size="large" style={{width: 120, marginRight: 5}} onChange={this.onChangeSigned}>*/}
                            {/*<Option value="">All</Option>*/}
                            {/*<Option value="1">Sign</Option>*/}
                            {/*<Option value="0">Not signed</Option>*/}
                        {/*</Select>*/}
                        {/*<Select size="large" placeholder="Select Union" style={{width: 120, marginRight: 5}}*/}
                                {/*onChange={this.onChangeUnion}>*/}
                            {/*<option value="">All</option>*/}
                            {/*{options}*/}
                        {/*</Select>*/}
                        {flag!='rank'?<Button size="large" style={{marginRight:5}} type="primary" onClick={this.exportFn}>Export</Button>:''}
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
                            {this.state.isDetail?<Button size="small" icon="arrow-left" onClick={this.Back} type="primary" style={{marginLeft:15}}></Button>:''}
                            {flag!='rank'?
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
                        <Table columns={columns} pagination={false} dataSource={this.state.tableData} loading={this.state.tableLoading}/>
                    </div>
                </div>
                {flag=='rank'?
                <div style={{marginBottom: 15}}>
                    <Pagination defaultCurrent={this.state.pageNum} current={this.state.pageNum} total={this.state.total} pageSize={this.state.pageSize} onChange={(page, pageSize)=>{this.pageFn(page, pageSize)}}/>
                </div>
                :''}


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
export default connect(mapStateToProps, mapDispatchToProps)(DiamondsPay);


