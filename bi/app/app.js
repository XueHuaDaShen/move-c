/**
 * Created by wangleping on 2017/4/27.
 */
import React from 'react';
import {render} from 'react-dom';
import {
    // BrowserRouter as Router,
    HashRouter as Router,
    Route,
    Link
} from 'react-router-dom';

// ant-design 国际化-英文
import {LocaleProvider} from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';
import moment from 'moment';

// 推荐在入口文件全局设置 locale
import 'moment/locale/en-au';
moment.locale('en-au');


import {createStore, combineReducers, applyMiddleware, bindActionCreators, compose} from 'redux';
import {Provider, connect} from 'react-redux';
import * as Reducers from './redux/reducers';
import * as Actions from './redux/actions';
import middleware from './redux/middlewares';



import './pages/common/common'
import './pages/common/common.less';

import Login from './pages/login/login';
import Sidebar  from './components/sidebar';
import MyHeader from './components/myHeader';
import Home from './pages/home/home';
import AppRecharge from './pages/appRecharge/appRecharge';
import AgentRecharge from './pages/agentRecharge/agentRecharge';
import Rush from './pages/rush/rush';
import Gift from './pages/gift/gift';
import Barrage from './pages/barrage/barrage';
import Exchange from './pages/exchange/exchange';
import Withdrawals from './pages/withdrawals/withdrawals';
import Users from './pages/users/users';
import Active from './pages/active/active';
import Increase from './pages/increase/increase';
import Consumption from './pages/consumption/consumption';
import Income from './pages/income/income';
import FansList from './pages/fansList/fansList';
import Share from './pages/share/share';

import Salary from './pages/salary/salary';
import PayAmount from './pages/fish/fish';
import PayNum from "./pages/payNum/payNum";
import Fishball from './pages/fishball/fishball';
import BaseInfo from './pages/baseInfo/baseInfo';
import FishballGet from './pages/fishballGet/fishballGet';
import DiamondsPay from './pages/diamondsPay/diamondsPay';
import DiamondsRecharge from './pages/diamondsRecharge/diamondsRecharge';
import FreeDiamonds from './pages/freeDiamonds/freeDiamonds';
import Live from './pages/live/live';
import FanGift from './pages/fanGift/fanGift';
import Reward from './pages/reward/reward';
import AnchorIncome from './pages/anchorIncome/anchorIncome';
import RechargeProportion from './pages/rechargeProportion/rechargeProportion';
import AppRechargeProportion from './pages/appRechargeProportion/appRechargeProportion';
import AgencyRechargeProportion from './pages/agencyRechargeProportion/agencyRechargeProportion';
import Diamonds from './pages/diamonds/diamonds';
// import Union from './pages/union/union';


const rootReducer = combineReducers(Reducers);
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const configStore = (init) => {
    "use strict";
    const store = createStore(rootReducer, init, composeEnhancers(applyMiddleware(middleware)));
    return store;
};

const store = configStore();

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


class Root extends React.Component {
    constructor() {
        super();
        this.state = {
            // num: 0
        };
    }

    componentWillMount() {
        // console.log(this.props)
    }

    render() {
        return (
            <div style={{minHeight: '100%'}}>
                <MyHeader></MyHeader>
                <Sidebar></Sidebar>

                <Route exact path="/app" component={Home} className="rightView"/>
                <Route path="/app/home" component={Home} className="rightView"/>
                <Route path="/app/appRecharge" component={AppRecharge} className="rightView"/>
                <Route path="/app/agentRecharge" component={AgentRecharge} className="rightView"/>
                <Route path="/app/rush" component={Rush} className="rightView"/>
                <Route path="/app/gift" component={Gift} className="rightView"/>
                <Route path="/app/barrage" component={Barrage} className="rightView"/>
                <Route path="/app/exchange" component={Exchange} className="rightView"/>
                <Route path="/app/withdrawals" component={Withdrawals} className="rightView"/>
                <Route path="/app/users" component={Users} className="rightView"/>
                <Route path="/app/active" component={Active} className="rightView"/>
                <Route path="/app/increase" component={Increase} className="rightView"/>
                <Route path="/app/consumption" component={Consumption} className="rightView"/>
                <Route path="/app/income" component={Income} className="rightView"/>
                <Route path="/app/fansList" component={FansList} className="rightView"/>
                <Route path="/app/share" component={Share} className="rightView"/>
                <Route path="/app/salary" component={Salary} className="rightView"/>
                <Route path="/app/fish" component={PayAmount} className="rightView"/>
                <Route path="/app/payNum" component={PayNum} className="rightView"/>
                <Route path="/app/fishball" component={Fishball} className="rightView"/>
                <Route path="/app/baseInfo" component={BaseInfo} className="rightView"/>
                <Route path="/app/fishballGet" component={FishballGet} className="rightView"/>
                <Route path="/app/diamondsPay" component={DiamondsPay} className="rightView"/>
                <Route path="/app/diamondsRecharge" component={DiamondsRecharge} className="rightView"/>
                <Route path="/app/freeDiamonds" component={FreeDiamonds} className="rightView"/>
                <Route path="/app/live" component={Live} className="rightView"/>
                <Route path="/app/fanGift" component={FanGift} className="rightView"/>
                <Route path="/app/reward" component={Reward} className="rightView"/>
                <Route path="/app/anchorIncome" component={AnchorIncome} className="rightView"/>
                <Route path="/app/rechargeProportion" component={RechargeProportion} className="rightView"/>
                <Route path="/app/appRechargeProportion" component={AppRechargeProportion} className="rightView"/>
                <Route path="/app/agencyRechargeProportion" component={AgencyRechargeProportion} className="rightView"/>

            </div>
        )
    }

}

const connectRoot = connect(mapStateToProps, mapDispatchToProps)(Root);


render(
    <LocaleProvider locale={enUS}>
        <Provider store={store}>
            <Router>
                <div id='myWrap'>
                    <Route exact path="/" component={Login}/>
                    <Route exact path="/login" component={Login}/>
                    <Route path="/app" component={connectRoot}/>
                    {/*<div className="rightView">*/}
                    {/*<Route path="/app/home" component={Home}/>*/}
                    {/*<Route path="/app/test" component={Test}/>*/}
                    {/*</div>*/}
                </div>
            </Router>
        </Provider>
    </LocaleProvider>,
    document.getElementById('root')
)
;

