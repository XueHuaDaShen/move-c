/* eslint-disable react/style-prop-object */
/* eslint-disable no-undef */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable react/sort-comp */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable class-methods-use-this */
/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
/* eslint-disable no-plusplus */
/* eslint-disable prefer-const */
/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
// import './cj.less';

export default class Personal extends Component {
  componentDidMount() {
    // this.getList();
  };

  componentWillMount() {
    this.reset();
  }

  render() {
    return (
      <div className="personal">人员信息维护</div>
    );
  }
}
