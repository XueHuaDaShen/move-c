import '../pages/common/common.less';
import './layout.less'

import React from 'react';
import {Link} from 'react-router-dom';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as Actions from '../redux/actions';

import {Layout, Menu, Icon} from 'antd';
const {SubMenu} = Menu;
const {Sider} = Layout;

class Sidebar extends React.Component {
    constructor() {
        super();
        this.state = {
            openKeys: []
        };
        this.onOpenChange = this.onOpenChange.bind(this);
    }


    componentWillMount() {
        // const that = this;
        // console.log(this.props.opensub);
        // console.log(this.state.openKeys);
        // this.setState({
        //     openKeys: this.props.opensub
        // }, function () {
        //     console.log(that.state.openKeys)
        // })

        // const {actions} = this.props;
        // console.log(actions.activePage)
        // actions.activePage(0);
        const that = this;
        // todo: 异步
        setTimeout(function () {
            // console.log(that.props.opensub);
            // console.log(that.state.openKeys);
            that.setState({
                openKeys: that.props.opensub
            }, function () {
                // console.log(that.state.openKeys)
            })
        }, 0)

    }

    componentDidMount() {



    }

    onOpenChange(openKeys) {
        // console.log(openKeys)
        this.setState({
            openKeys: openKeys
        })
    }

    render() {
        return (
            <Layout className='width250 mysidebar'>
                <Sider width={250} style={{background: '#fff'}}>
                    <Menu
                        mode="inline"
                        // defaultSelectedKeys={['0']}
                        // defaultOpenKeys={this.props.opensub}
                        openKeys = {this.state.openKeys}
                        selectedKeys={this.props.num}
                        onOpenChange={this.onOpenChange}
                        style={{height: '100%'}}

                    >
                        <Menu.Item key="0">
                            <Link to = "/app/home" className="font15">
                            <Icon type="user"/>
                            Home
                            </Link>
                        </Menu.Item>
                        <SubMenu key="sub1" title={<span><Icon type="bank"/>Finance</span>}>
                            <Menu.Item key="1">
                                <Link to = "/app/appRecharge">
                                    APP recharge
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="2">
                                <Link to = "/app/agentRecharge">
                                    Agent recharge
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="3">
                                <Link to = "/app/rush">
                                    Agent user recharge
                                </Link>
                            </Menu.Item>
                            {/*<Menu.Item key="4">*/}
                                {/*<Link to = "/app/salary">*/}
                                    {/*Wages bill*/}
                                {/*</Link>*/}
                            {/*</Menu.Item>*/}
                        </SubMenu>
                        <SubMenu key="sub2" title={<span><Icon type="notification"/>Anchor</span>}>
                            <Menu.Item key="5">
                                <Link to = "/app/fish">
                                    Income
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="6">
                                <Link to = "/app/payNum">
                                    Live
                                </Link>
                            </Menu.Item>
                            {/*<Menu.Item key="7">*/}
                                {/*<Link to = "/app/fishball">*/}
                                    {/*Fan count*/}
                                {/*</Link>*/}
                            {/*</Menu.Item>*/}
                            {/*<Menu.Item key="8">*/}
                                {/*<Link to = "/app/diamonds">*/}
                                    {/*System diamonds*/}
                                {/*</Link>*/}
                            {/*</Menu.Item>*/}
                        </SubMenu>
                        <SubMenu key="sub3" title={<span><Icon type="shop"/>Platform</span>}>
                            <Menu.Item key="9">
                                <Link to = "/app/gift">
                                    Gift
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="10">
                                <Link to = "/app/barrage">
                                    Barrage
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="11">
                                <Link to = "/app/exchange">
                                    Exchange
                                </Link>
                            </Menu.Item>
                            {/*<Menu.Item key="12">*/}
                                {/*<Link to = "/app/withdrawals">*/}
                                    {/*Withdrawals*/}
                                {/*</Link>*/}
                            {/*</Menu.Item>*/}
                            {/*<Menu.Item key="13">*/}
                                {/*<Link to = "/app/users">*/}
                                    {/*Users*/}
                                {/*</Link>*/}
                            {/*</Menu.Item>*/}
                            <Menu.Item key="14">
                                <Link to = "/app/active">
                                    Active user
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="15">
                                <Link to = "/app/increase">
                                    New user
                                </Link>
                            </Menu.Item>
                        </SubMenu>
                        <SubMenu key="sub4" title={<span><Icon type="trophy" />Rank</span>}>
                            <Menu.Item key="16">
                                <Link to = "/app/consumption">
                                    Consumption
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="17">
                                <Link to = "/app/income">
                                    Income
                                </Link>
                            </Menu.Item>
                            {/*<Menu.Item key="18">*/}
                                {/*<Link to = "/app/fansList">*/}
                                    {/*Fans rank*/}
                                {/*</Link>*/}
                            {/*</Menu.Item>*/}
                            {/*<Menu.Item key="19">*/}
                                {/*<Link to = "/app/share">*/}
                                    {/*Share rank*/}
                                {/*</Link>*/}
                            {/*</Menu.Item>*/}

                        </SubMenu>
                        <SubMenu key="sub5" title={<span><Icon type="database"/>Statistic</span>}>
                            <Menu.Item key="20">
                                <Link to = "/app/baseInfo">
                                    Base Info
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="21">
                                <Link to = "/app/fishballGet">
                                    FishballGet
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="22">
                                <Link to = "/app/diamondsPay">
                                    DiamondsPay
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="23">
                                <Link to = "/app/diamondsRecharge">
                                    DiamondsRecharge
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="24">
                                <Link to = "/app/freeDiamonds">
                                    FreeDiamonds
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="25">
                                <Link to = "/app/live">
                                    Live
                                </Link>
                            </Menu.Item>

                        </SubMenu>
                        <SubMenu key="sub6" title={<span><Icon type="pie-chart" />PieChart</span>}>
                            <Menu.Item key="26">
                                <Link to = "/app/fanGift">
                                    FanGift Diamonds
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="27">
                                <Link to = "/app/reward">
                                    Gift Count
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="28">
                                <Link to = "/app/anchorIncome">
                                    Anchor Income
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="29">
                                <Link to = "/app/rechargeProportion">
                                    Recharge
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="30">
                                <Link to = "/app/appRechargeProportion">
                                    APP Recharge
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="31">
                                <Link to = "/app/agencyRechargeProportion">
                                    Agency Recharge
                                </Link>
                            </Menu.Item>

                        </SubMenu>
                    </Menu>
                </Sider>
            </Layout>

        )
    }
}

// export default Sidebar;
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
export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
