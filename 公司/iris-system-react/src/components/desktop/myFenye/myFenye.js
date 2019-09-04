/* eslint-disable consistent-return */
/* eslint-disable no-shadow */
/* eslint-disable no-const-assign */
/* eslint-disable no-loop-func */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/prop-types */
/* eslint-disable react/button-has-type */
/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
/* eslint-disable no-new */
/* eslint-disable prefer-const */
/* eslint-disable one-var */
/* eslint-disable no-param-reassign */
/* eslint-disable no-redeclare */
/* eslint-disable eqeqeq */
/* eslint-disable no-plusplus */
/* eslint-disable vars-on-top */
/* eslint-disable no-var */
/* eslint-disable block-scoped-var */
/* eslint-disable no-unused-expressions */
/* eslint-disable func-names */
/* eslint-disable no-undef */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable prefer-destructuring */
/* eslint-disable camelcase */
/* eslint-disable react/no-unused-state */
/* eslint-disable react/no-children-prop */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable react/sort-comp */
/* eslint-disable class-methods-use-this */
import React, { Component } from 'react';
import Select, { Option } from 'rc-select';
import 'rc-select/assets/index.css';
import Pagination from 'rc-pagination'
import 'rc-pagination/assets/index.css';
import './myFenye.less';

export default class MyDatepicker extends Component {
  static defaultProps = {
    sizeArr: [
      {val: '10'},
      {val: '30'},
      {val: '50'},
      {val: '100'},
    ],
    pageSize: 10,
    pageNum: 1,
    total: 1,
  };

  constructor(props) {
    super(props);
    this.state = {
      sizeArr: [],
      pageSize: '',
      pageNum: '',
      total: '',
    };
    this.handleSelect = this.handleSelect.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
  }

  componentWillMount() {
    // console.log(this.props)
    const {
      sizeArr,
      pageSize,
      pageNum,
      total,
    } = this.props;
    this.setState({
      sizeArr,
      pageSize,
      pageNum,
      total,
    })
  }

  componentDidMount() {
    // this.createDate();
  }

  componentWillReceiveProps() {
    const {
      total,
      pageNum,
      pageSize,
    } = this.props;
    this.setState({
      total,
      pageNum,
      pageSize,
    })
    // console.log(this.props)
  }
  
  handleSelect(val, key) {
    this.setState({
      [key]: val || ''
    })
    this.props.onPageChange({page: 1, pageSize: val});
  }

  handlePageChange (page) {
    const { pageSize } = this.state;
    this.setState({
      pageNum: page
    })
    this.props.onPageChange({page, pageSize});
  }

  render() {
    const { sizeArr, pageNum, pageSize } = this.state;
    // console.log(total)
    // console.log(this.props)
    const { total } = this.props;
    return (
      <div className="my-pagination-wrap">
        <div className="total-wrap">
          <span>一共{total}条</span>
          <Select
            defaultValue={`每页${pageSize}条`}
            value={`每页${pageSize}条`}
            onChange={e => {
              this.handleSelect(e && e.target ? e.target.value : e, 'pageSize');
            }}
            dropdownMenuStyle={{ maxHeight: 200 }}
          >
            {sizeArr.map(current => (
              <Option key={`${current.val}`} value={`${current.val}`}>
                每页{current.val}条
              </Option>
            ))}
          </Select>
        </div>
        <Pagination current={pageNum} total={total} pageSize={Number(pageSize)} onChange={this.handlePageChange}/>
      </div>
    );
  }
}
