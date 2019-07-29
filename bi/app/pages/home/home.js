/**
 * Created by wangleping on 2017/5/3.
 */
import React from 'react';
import {bindActionCreators} from 'redux';
import {AxiosLogin} from '../common/common';
import {connect} from 'react-redux';
import * as Actions from '../../redux/actions';
import {Form, Icon, Input, Button, Card, Row, Col, Alert, Spin} from 'antd';
import './home.less';
import Md5 from 'crypto-js/md5';


const FormItem = Form.Item;

const userid = localStorage['BI-USERID'];


class Home extends React.Component {
    constructor() {
        super();
        this.state = {
            confirmDirty: false,
            status: 'success',
            message: 'succeed!',
            display: 'none',
            loading: false
        };

        // this.renderEditor = this.renderEditor.bind(this);
        // this.showMsg = this.showMsg.bind(this);
        // this.hideMsg = this.hideMsg.bind(this);
        this.saveSubmit = this.saveSubmit.bind(this);
        this.modifySubmit = this.modifySubmit.bind(this);
        this.handleConfirmBlur = this.handleConfirmBlur.bind(this);
        this.checkPassword = this.checkPassword.bind(this);
        this.checkNewPassword = this.checkNewPassword.bind(this);
    }

    componentWillMount() {


        // console.log(this.props);

        const {actions} = this.props;
        // console.log(actions.activePage)
        actions.activePage(0);
        actions.openSub('');

    }

    componentDidMount() {
        // console.log(this.props.num);

    }

    getEmail() {
        return localStorage['BI-USERNAME'];
    }

    handleConfirmBlur(e) {
        const value = e.target.value;
        this.setState({confirmDirty: this.state.confirmDirty || !!value});
    }

    checkPassword(rule, value, callback) {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('newPassword')) {
            callback('Two passwords that you enter is inconsistent!');
        } else {
            callback();
        }
    }

    checkNewPassword(rule, value, callback) {
        const form = this.props.form;
        if (value && value === form.getFieldValue('oldPassword')) {
            callback('New password couldn\'t be same with old password');
        } else {
            callback();
        }
    }

    saveSubmit(e) {
        e.preventDefault();
        this.props.form.validateFields(['email', 'userName', 'phone'], (err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
        });
    }

    modifySubmit(e) {
        e.preventDefault();
        const that = this;
        this.props.form.validateFields(['oldPassword', 'newPassword', 'confirm'], (err, values) => {
            if (!err) {
                // console.log('Received values of form: ', values);
                this.setState({
                    loading: true
                });
                AxiosLogin(
                    'post',
                    '/user/modifypass',
                    {
                        "user_id": userid,
                        "password": Md5(values.oldPassword).toString(),
                        "new_pass": Md5(values.newPassword).toString()
                    },
                    {
                        token: localStorage.getItem('BI-A-TOKEN')
                    },
                    function (data) {
                        console.log(data);
                        that.setState({
                            loading: false,
                            status: 'success',
                            display: 'block',
                            message: 'modifying succeed!'

                        });
                    },
                    function (err) {
                        console.log(err);
                        that.setState({
                            loading: false,
                            status: 'error',
                            display: 'block'
                        });
                        if (err.code === 305) {
                            that.setState({
                                message: 'The old password you enter is wrong'
                            })
                        }
                    }
                )
            }
        });
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <div className="rightView">
                <div style={{padding: '30px'}}>
                    <Row gutter={16} type="flex" justify="center">
                        {/*<Col span={12}>*/}
                        {/*<Card title="个人信息" bordered={false}>*/}
                        {/*<Form className="login-form" onSubmit={this.saveSubmit}>*/}
                        {/*<FormItem label="E-mail" >*/}
                        {/*{getFieldDecorator('email', {*/}
                        {/*rules: [{*/}
                        {/*type: 'email', message: 'The input is not valid E-mail!',*/}
                        {/*}, {*/}
                        {/*required: true, message: 'Please input your E-mail!',*/}
                        {/*}],*/}
                        {/*})(*/}
                        {/*<Input prefix={<Icon type="mail" style={{ fontSize: 13 }} />} placeholder="email" />*/}
                        {/*)}*/}
                        {/*</FormItem>*/}
                        {/*<FormItem label="name" >*/}
                        {/*{getFieldDecorator('userName', {*/}
                        {/*rules: [{ required: true, message: 'Please input your username!' }],*/}
                        {/*})(*/}
                        {/*<Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="Username" />*/}
                        {/*)}*/}
                        {/*</FormItem>*/}
                        {/*<FormItem label="phone" >*/}
                        {/*{getFieldDecorator('phone', {*/}
                        {/*rules: [{ required: true, message: 'Please input your phone number!' }],*/}
                        {/*})(*/}
                        {/*<Input prefix={<Icon type="phone" style={{ fontSize: 13 }} />} placeholder="phone" />*/}
                        {/*)}*/}
                        {/*</FormItem>*/}
                        {/*<FormItem >*/}
                        {/*<Button style={{ float: 'right' }} type="primary" htmlType="submit" className="login-form-button">*/}
                        {/*Save*/}
                        {/*</Button>*/}
                        {/*</FormItem>*/}
                        {/*</Form>*/}
                        {/*</Card>*/}
                        {/*</Col>*/}
                        <Col span={12}>
                            <Card title="Modifying Password" bodyStyle={{padding: 30}}>
                                <Spin tip="loading" size='large' spinning={this.state.loading}>
                                    <Form className="login-form" onSubmit={this.modifySubmit}>
                                        <FormItem label="E-mail">
                                            <Input prefix={<Icon type="mail" style={{fontSize: 13}}/>}
                                                   className="home_email" disabled value={ this.getEmail() }
                                                   placeholder="email"/>

                                        </FormItem>
                                        <FormItem label="Old Password">
                                            {getFieldDecorator('oldPassword', {
                                                rules: [{required: true, message: 'Please input your Old password!'}],
                                            })(
                                                <Input prefix={<Icon type="lock" style={{fontSize: 13}}/>}
                                                       type="password" placeholder="Old password"/>
                                            )}
                                        </FormItem>
                                        <FormItem label="New Password">
                                            {getFieldDecorator('newPassword', {
                                                rules: [{required: true, message: 'Please input your New password!'}, {
                                                    validator: this.checkNewPassword,
                                                }],
                                            })(
                                                <Input prefix={<Icon type="lock" style={{fontSize: 13}}/>}
                                                       type="password" placeholder="New password"/>
                                            )}
                                        </FormItem>
                                        <FormItem label="Confirm Password">
                                            {getFieldDecorator('confirm', {
                                                rules: [{
                                                    required: true, message: 'Please confirm your New password!',
                                                }, {
                                                    validator: this.checkPassword,
                                                }],
                                            })(
                                                <Input prefix={<Icon type="lock" style={{fontSize: 13}}/>}
                                                       onBlur={this.handleConfirmBlur} type="password"
                                                       placeholder="Confirm password"/>
                                            )}
                                        </FormItem>
                                        <Alert message={this.state.message} type={this.state.status}
                                               style={{display: this.state.display}} showIcon/>
                                        <FormItem >
                                            <Button style={{float: 'right', marginTop: 5}} type="primary" htmlType="submit"
                                                    className="login-form-button">
                                                Modify
                                            </Button>
                                        </FormItem>

                                    </Form>
                                </Spin>
                            </Card>
                        </Col>
                    </Row>
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

const _home = Form.create()(Home);
export default connect(mapStateToProps, mapDispatchToProps)(_home);
