/**
 * Created by wangleping on 2017/5/4.
 */
import '../pages/common/common.less';
import './layout.less'

import {AxiosLogin} from '../pages/common/common';

import createHistory from 'history/createHashHistory';
const history = createHistory();

import React from 'react';
import {Layout, Menu} from 'antd';
const {Header} = Layout;

class myHeader extends React.Component {
    constructor() {
        super();
        this.state = {
            username: ''
        };
        this.logout = this.logout.bind(this);
        this.goHome = this.goHome.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    componentWillMount() {
        this.setState({
            username: localStorage.getItem('BI-USERNAME')
    })
    }

    logout() {
        // alert('logout')
        AxiosLogin(
            'get',
            '/user/logout',
            '',
            {token: localStorage.getItem('BI-A-TOKEN')},
            function () {
                localStorage.removeItem('BI-A-TOKEN');
                localStorage.removeItem('BI-R-TOKEN');
                localStorage.removeItem('BI-USERNAME');
                history.push('/');
            },
            function (err) {
                console.log(err)
            }
        )
    }

    goHome() {
        history.push('/app');
    }

    handleClick(e) {
        if (e.key === '1') {
            this.logout();
        } else if (e.key === '2') {
            this.goHome();
        }
    }

    render() {
        return (

            <Layout>
                <Header className="header fixedHeader">
                    <div className="logo applogo">
                        <img src={require('../static/img/logo.png')} alt=""/>
                    </div>
                    <Menu
                        theme="dark"
                        mode="horizontal"
                        style={{lineHeight: '64px', border: 'none'}}
                        className="appMenu"
                        onClick={this.handleClick}
                    >
                        <Menu.Item key="1" className="myLogOut"> Logout </Menu.Item>
                        <Menu.Item key="2" className="myUserName">{this.state.username}
                        </Menu.Item>
                    </Menu>
                </Header>
            </Layout>

        )
    }
}

export default myHeader;