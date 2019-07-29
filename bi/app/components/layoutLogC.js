import './layout.less'

import React from 'react';
import {Layout} from 'antd';
const {Header, Footer, Sider, Content} = Layout;

class LayoutLogC extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (

            <Layout className = "myLayout">

                {/*<Header className="myLogH">Header</Header>*/}
                <div className="myLogC">
                    {this.props.children}
                </div>
                <Footer className="myLogF"></Footer>


            </Layout>

        )
    }
}

export default LayoutLogC;
