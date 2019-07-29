/**
 * Created by wangleping on 2017/5/4.
 */
import  '../common/common.less';
import './login.less';

import {AxiosLogin, getToken} from '../common/common';
import Hmac from 'crypto-js/hmac-md5';
import Md5 from 'crypto-js/md5';

import React from 'react';
import {Spin, Alert, Card, Form, Icon, Input, Button, Checkbox} from 'antd';
import LayoutLogC from '../../components/layoutLogC';
const FormItem = Form.Item;

class NormalLoginForm extends React.Component {
    constructor() {
        super();
        this.state = {
            isShow: 'none',
            message: '',
            loading: false
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.login = this.login.bind(this);

    }

    componentWillMount() {

    }

    handleSubmit(e) {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.login(this.props.form.getFieldValue('email'), this.props.form.getFieldValue('password'));
                // console.log('Received values of form: ', values);
            }
        });
    }

    login(email, password) {
        const that = this;
        that.setState({
            loading: true
        });
        AxiosLogin(
            'get',
            '/user/random',
            {
                email: email,
            },
            {
                "authorization": ''
            },
            function (data) {
                const salt = data.salt;
                AxiosLogin(
                    'post',
                    '/user/login',
                    {
                        username: email,
                        password: Hmac(Md5(password).toString(), salt).toString()
                    },
                    {
                        "authorization": ''
                    },
                    function (data) {
                        getToken(data.bearer, data.id, email, function () {
                            that.setState({
                                loading: false,
                                isShow: 'none',
                                message: ''
                            });
                        });
                        // console.log(data.username)
                        // that.setState({
                        //     loading: false,
                        //     isShow: 'none',
                        //     message: ''
                        // });
                    },
                    function (err) {
                        that.setState({
                            isShow: 'block',
                            message: err.err
                        });
                        that.setState({
                            loading: false
                        });
                    }
                )
            }

        )
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <LayoutLogC>
                <Card className="myCard" style={{width: 400}} bodyStyle={{padding: 60}}>
                    <Spin tip="loading" size='large' spinning={this.state.loading}>
                        <div className="myLogo">
                            <img src={require('../../static/img/logo.png')} alt=""/>
                            <h2>Analytics Platform</h2>
                        </div>
                        <Form onSubmit={this.handleSubmit} className="login-form">
                            <FormItem>
                                {getFieldDecorator('email', {
                                    rules: [{
                                        type: 'email', message: 'The input is not valid E-mail!',
                                    }, {
                                        required: true, message: 'Please input your E-mail!',
                                    }],
                                })(
                                    <Input prefix={<Icon type="mail" style={{fontSize: 13}}/>} placeholder="Email"
                                           className='height40'/>
                                )}
                            </FormItem>
                            <FormItem>
                                {getFieldDecorator('password', {
                                    rules: [{required: true, message: 'Please input your Password!'}],
                                })(
                                    <Input prefix={<Icon type="lock" style={{fontSize: 13}}/>} type="password"
                                           placeholder="Password" className='height40'/>
                                )}
                            </FormItem>
                            <FormItem className="myLoginBtnWrap">
                                {/*{getFieldDecorator('remember', {*/}
                                {/*valuePropName: 'checked',*/}
                                {/*initialValue: true,*/}
                                {/*})(*/}
                                {/*<Checkbox>Remember me</Checkbox>*/}
                                {/*)}*/}
                                {/*<a className="login-form-forgot" href="">Forgot password</a>*/}
                                <Button type="primary" htmlType="submit"
                                        className="login-form-button myLoginBtn height40" size="large">
                                    Log in
                                </Button>
                                {/*Or <a href="">register now!</a>*/}
                            </FormItem>
                            <Alert message={this.state.message} type="warning" showIcon
                                   style={{display: this.state.isShow}}/>
                        </Form>
                    </Spin>
                </Card>
            </LayoutLogC>
        )
    }
}

const Login = Form.create()(NormalLoginForm);


export default Login;
