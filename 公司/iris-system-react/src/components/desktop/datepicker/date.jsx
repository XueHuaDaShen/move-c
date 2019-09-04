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
import Button from '../../communal/JrButton';
import './date.less';

export default class MyDatepicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      staticY: '', // 此刻的年月日
      staticM: '',
      staticD: '',
      year: '', // 记录的年月日
      month: '',
      date: '',
      selectYear: '', // 选择的年月日
      selectMonth: '',
      selectDate: '',
      html: [],
      dateTime: '',
      showDate: false,
    };
    this.hideDate = this.hideDate.bind(this);
    this.total = this.total.bind(this);
    this.oneDay = this.oneDay.bind(this);
    this.createTime = this.createTime.bind(this);
    this.initDate = this.initDate.bind(this);
    this.renderDate = this.renderDate.bind(this);
    this.showDateWrap = this.showDateWrap.bind(this);
    this.nextMonth = this.nextMonth.bind(this);
    this.prevMonth = this.prevMonth.bind(this);
    this.nowMonth = this.nowMonth.bind(this);
    this.nextYear = this.nextYear.bind(this);
    this.prevYear = this.prevYear.bind(this);
    this.nowYear = this.nowYear.bind(this);
  }

  componentWillMount() {
    this.state.dateTime = this.props.value;
    this.state.showDate = this.props.visible;
  }

  componentDidMount() {
    // this.createDate();
    this.createTime();
  }

  // 选择年份月份
  selectYear() {
    let translated = this.scrollTime(2019);
    console.log(translated);
    let maxMove = $('.scroll-bar').offset().top - $('.select-month').offset().top;
    let wrapH = $(".year-list").height()-5*24;
    console.log(wrapH);
    // 滚动条最大可移动的距离为 45px; 分为三个级别，0-10，10-30，30-45；
    let speedLeve = 0.1;
    // let mouseDown = false;
    let st = null; // 定时器
    $('.scroll-bar').on('mousedown', d => {
      document.onmousemove = function(e){
        let move = e.pageY-d.pageY;
        let absM = Math.abs(move);
        if(absM > 0){
          speedLeve = 0.1;
        }
        if(absM > 10){
          speedLeve = 1.1;
        }
        if(absM > 30){
          speedLeve = 2.1;
        }
        if(absM > maxMove){
          absM = maxMove;
        }
        if(move<0){
          absM = -absM;
          speedLeve = -speedLeve;
        }
        if(absM === 0){
          speedLeve = 0; // 停止移动
        }
        $(".scroll-bar").css({
          transform: `translateY(${absM}px)`
        })
        st = setInterval(() => {
          translated -= speedLeve;
          // let scrollY = Math.abs(translated);
          // if(scrollY>wrapH){
          //   scrollY = wrapH;
          // }
          // if(translated>0){
          //   translated = 0;
          // }
          // if(translated<0){
          //   translated = -scrollY;
          // }
          $(".year-list").css({
            transform: `translateY(${translated}px)`
          })
        }, 200);
      }
      // 
    });
    $(document).on('mouseup', () => {
      // mouseDown = false;
      document.onmousemove = null;
      $(".scroll-bar").css({
        transform: `translateY(0px)`
      })
      clearInterval(st);
    });
  }

  // 滚动时间表
  scrollTime(num) {
    const h = -24;
    const translate = (num - 3) * h;
    $('.year-list').css({
      transform: `translateY(${translate}px)`,
    });
    return translate;
  }

  hideDate() {
    this.setState({
      showDate: false
    })
  }

  createDate() {
    const rc = this;
    // const { dateTime, showDate } = this.state;
    function MyDateClass(hotel) {
      this.nowTime = new Date();
      this.nowYear = this.nowTime.getFullYear();
      this.prevMonth = this.nowTime.getMonth();
      this.nowMonth = this.prevMonth + 1;
      this.month = this.prevMonth + 1;
      this.date = this.nowTime.getDate();
      this.init(this.nowYear, this.nowMonth, this.date);
      this.hotel = typeof hotel === 'boolean' ? hotel : false;
      this.calendar = !this.hotel;
      this.bindEvent();
      this.ok = $('.time-body>div').length === 1;
      this.clickNum = 1;

      const that = this;
      $('.nextBtn').on('click', function() {
        const bindClick = $(this).attr('class');
        that.ok && that.bindNext(bindClick);
      });
      $('.nowBtn').on('click', () => {
        that.bindNow();
      });
      $('.prevBtn').on('click', function() {
        const bindClick = $(this).attr('class');
        that.ok && that.bindPrev(bindClick);
      });
    }
    MyDateClass.prototype = {
      init(year, month, date, bindClick, checkDate) {
        this.nowTime = new Date(year, month - 1, date);
        this.nowYear = this.nowTime.getFullYear();
        this.nowMonth = this.nowTime.getMonth() + 1;
        this.ok = false;
        this.renderTime(this.nowYear, this.nowMonth, bindClick, checkDate);
      },

      total(year, month) {
        return new Date(year, month, 0).getDate(); // 获取当月的总天数；
      },

      oneDay(year, month) {
        let date = new Date(year, month, 1).getDay(); // 获取当月的一号是周几；这里的month代表下个月，所以获取的的时候要-1；
        date = date > 0 ? date : 7;
        return date;
      },

      renderTime(year, month, bindClick, checkDate) {
        const that = this;
        const totalDay = this.total(year, month); // 总天数
        const date = this.oneDay(year, month - 1); // 周几
        const day =
          month == this.nowTime.getMonth() + 1 ? this.nowTime.getDate() : ''; // 今天的日期
        let str = '<div>';
        let nextI = 1;
        const prevI = this.total(year, month - 1);
        for (var i = 1; i < date; i++) {
          str += `<span class="prevMonth"><a href="javascript:;">${prevI -
            (date - i) +
            1}</a></span>`;
        }
        let currentDayClass = '';
        for (var i = 1; i < 43 - date + 1; i++) {
          if (i == checkDate) {
            currentDayClass = 'currentCheck';
          } else {
            currentDayClass = '';
          }
          if (i > totalDay) {
            str += `<span class="nextMonth ${currentDayClass}"><a href="javascript:;">${nextI}</a></span>`;
            nextI++;
          } else if (day == this.date && i == day) {
            str += `<span class="nowMonth nowDate"><a href="javascript:;">${i}</a></span>`;
          } else {
            str += `<span class="nowMonth ${currentDayClass}"><a href="javascript:;">${i}</a></span>`;
          }
        }
        str += '</div>';
        if (bindClick == 'nextBtn') {
          $('.time-body').append(str);
          $('.time-body')
            .find('div')
            .eq(0)
            .css({
              marginTop: '-108px',
              transition: 'all .3s',
            });
          setTimeout(() => {
            $('.time-body')
              .find('div')
              .eq(0)
              .remove();
            $('.time-body')
              .find('div')
              .eq(0)
              .css({
                marginTop: '0',
                transition: 'none',
              });
            that.ok = $('.time-body>div').length == 1;
          }, 500);
        } else if (bindClick == 'prevBtn') {
          $('.time-body').prepend(str);
          $('.time-body')
            .find('div')
            .eq(0)
            .css({
              marginTop: '-109px',
              transition: 'none',
            });
          setTimeout(() => {
            $('.time-body')
              .find('div')
              .eq(0)
              .css({
                marginTop: '0',
                transition: 'all .3s',
              });
          }, 50);
          setTimeout(() => {
            $('.time-body')
              .find('div')
              .eq(1)
              .remove();
            that.ok = $('.time-body>div').length == 1;
          }, 500);
        } else {
          $('.time-body').html(str);
          that.ok = $('.time-body>div').length == 1;
        }
        $('.yy').html(year);
        if (month < 10) {
          $('.mm').html(`0${month}`);
        } else {
          $('.mm').html(month);
        }
        checkDate = checkDate || this.date;
        rc.setState({
          year,
          month,
          dateTime: `${year}/${month}/${checkDate}`,
        })
        // $('#myDateClass').val(`${$('.title').text() + checkDate}日`);
      },

      bindNext(bindClick, checkDate) {
        this.nowMonth += 1;
        const date = this.nowMonth == this.month ? this.date : 1;

        this.init(this.nowYear, this.nowMonth, date, bindClick, checkDate);
      },

      bindNow() {
        let time = new Date(),
          year = time.getFullYear(),
          month = time.getMonth() + 1,
          date = time.getDate();
        // num = 1;
        this.clickNum = 1;
        this.init(year, month, date);
      },

      bindPrev(bindClick, checkDate) {
        this.nowMonth -= 1;
        const date = this.nowMonth == this.month ? this.date : 1;
        this.init(this.nowYear, this.nowMonth, date, bindClick, checkDate);
      },

      bindEvent() {
        const that = this;
        // $(document).on('mouseover', '.time-body span', function() {
        //   $(this)
        //     .addClass('active')
        //     .siblings()
        //     .removeClass('active');
        // });
        // $(document).on('mouseout', '.time-body span', function() {
        //   $(this).removeClass('active');
        // });
        $(document).on('click', '.time-body span', function() {
          const { year, month } = rc.state;
          $(this)
            .addClass('active')
            .siblings()
            .removeClass('active');
          const spanClass = $(this).attr('class');
          const checkDate = $(this)
            .find('a')
            .text();
          if (spanClass.indexOf('nextMonth') > -1) {
            that.ok && that.bindNext('nextBtn', checkDate);
          } else if (spanClass.indexOf('prevMonth') > -1) {
            that.ok && that.bindPrev('prevBtn', checkDate);
          } else if (spanClass.indexOf('nowMonth') > -1) {
            $(this)
              .addClass('currentCheck')
              .siblings()
              .removeClass('currentCheck');
            // $('#myDateClass').val(`${$('.title').text() + checkDate}日`);
            rc.setState({
              dateTime: `${year}/${month}/${checkDate}`,
              showDate: false
            })
          }
        });
      },
    };

    new MyDateClass();
  }

  total(year, month) {
    return new Date(year, month, 0).getDate(); // 获取当月的总天数；
  }

  oneDay(year, month) {
    let date = new Date(year, month, 1).getDay(); // 获取当月的一号是周几；
    date = date > 0 ? date : 7;
    return date;
  }

  // 创建时间
  createTime() {
    // 获取当前年月日
    let time = new Date();
    let year = time.getFullYear();
    let prevMonth = time.getMonth();
    let month = prevMonth + 1;
    let date = time.getDate();
    this.setState({
      staticY: year, // 此刻的年月日
      staticM: month,
      staticD: date,
    }, () => { 
      this.initDate(year, month, date);
    })
  }

  // 初始化日历
  initDate(year, month, date) {
    // 日历时间变化
    let nowTime = new Date(year, month - 1, date);
    let nowYear = nowTime.getFullYear();
    let nowMonth = nowTime.getMonth() + 1;
    this.renderDate(nowTime, nowYear, nowMonth, date);
  }

  // 渲染日历
  renderDate(nowTime, year, month, nowDate) {
    // const rc = this;
    // 记录当前时间
    this.setState({
      year,
      month,
      date: nowDate
    })
    const { staticM, staticD, selectMonth, selectDate, } = this.state;
    // console.log(staticM, staticD, year, month, nowDate, selectMonth, selectDate,)
    const totalDay = this.total(year, month); // 总天数
    const date = this.oneDay(year, month - 1); // 周几
    const day =
      month == nowTime.getMonth() + 1 ? nowTime.getDate() : ''; // 今天的日期
    let nextI = 1; // 下个月的初始
    const prevI = this.total(year, month - 1); // 上个月的总天数
    var html = [];
    for (var i = 1; i < date; i++) {
      let time = prevI - (date - i) + 1;
      let c = (month-1) === selectMonth && time === Number(selectDate) ? 'active' : '';
      html.push(
        <span onClick={(e) => {this.selectDateTime('prev', e)}} className={`prevMonth ${c}`} key={`p ${i}`}><a>{time}</a></span>
      )
    }
    for (var i = 1; i < 43 - date + 1; i++) {
      if (i > totalDay) {
        let c = (month+1) === selectMonth && nextI === Number(selectDate) ? 'active' : '';
        html.push(
          <span onClick={(e) => {this.selectDateTime('next', e)}} className={`nextMonth ${c}`} key={`n ${i}`}><a>{nextI}</a></span>
        )
        nextI++;
      } else if (day == staticD && i == day && month == staticM) {
        let c = (month === selectMonth && i === Number(selectDate)) ? 'active' : '';
        html.push(
          <span onClick={(e) => {this.selectDateTime('now', e)}} className={`nowMonth nowDate ${c}`} key={`n ${i}`}><a>{i}</a></span>
        )
      } else {
        let c = (month === selectMonth && i === Number(selectDate)) ? 'active' : '';
        html.push(
          <span onClick={(e) => {this.selectDateTime('now', e)}} className={`nowMonth ${c}`} key={`n ${i}`}><a>{i}</a></span>
        )
      }
    }
    this.setState({
      year,
      month,
      html,
    })
  }

  // 选中时间
  selectDateTime(str, time) {
    const { year, month } = this.state;
    let ele = $(time.target);
    let val = ele.text();
    let m = month;
    let callback = this.nowMonth;
    if(str === 'prev'){
      callback = this.prevMonth;
      m = month - 1;
    }
    if(str === 'next'){
      callback = this.nextMonth;
      m = month + 1;
    }
    this.setState({
      selectYear: year,
      selectMonth: m,
      selectDate: val,
      dateTime: `${year}/${m}/${val}`,
      showDate: false,
    },() => {
      callback&&callback()
    })
    const { dataName } = this.props;
    this.props.onChange(dataName, `${year}/${m}/${val}`)
  }

  // 下一月
  nextMonth() {
    const { year, month, date } = this.state;
    this.initDate(year, month+1, date);
  }

  // 上一月
  prevMonth() {
    const { year, month, date } = this.state;
    this.initDate(year, month-1, date);
  }

  // 本月
  nowMonth() {
    this.createTime();
  }

  // 下一年
  nextYear() {}

  // 上一年
  prevYear() {}

  // 本年
  nowYear() {}

  showDateWrap() {
    this.setState({
      showDate: true
    })
  }

  render() {
    const { dateTime, showDate, year, month, html } = this.state;
    return (
      <div className="myDatepicker">
        <input type="text" id="myDateClass" onFocus={this.showDateWrap} autoComplete="off" value={dateTime} />
        <div className="date-wrap" style={{display: showDate ? 'block' : 'none'}}>
          <div className="date-head">
            <div className="year-month">
              <h2>
                <p className="title">
                  <span>
                    <em className="yy">{year}</em>年<em className="mm">{month}</em>月
                  </span>
                  <span className="triangle" />
                </p>
                <p className="ctrlBtn">
                  <span className="prevBtn" onClick={this.prevMonth}>◀</span>
                  <span className="nowBtn" onClick={this.nowMonth}>●</span>
                  <span className="nextBtn" onClick={this.nextMonth}>▶</span>
                </p>
              </h2>
            </div>
          </div>
          <div className="date-body select-date">
            <div className="week">
              <b>周一</b>
              <b>周二</b>
              <b>周三</b>
              <b>周四</b>
              <b>周五</b>
              <b>周六</b>
              <b>周日</b>
            </div>
            <div className="time-body">
              <div>
                {html}
              </div>
            </div>
            {/* <div className="select-date" /> */}
            {/* <div className="select-ym" /> */}
          </div>
          {/* <div className="date-body select-month">
            <span className="scroll-bar" />
            <ul className="year-list">{data}</ul>
          </div> */}
          <div className="date-footer">
            <Button onClick={this.hideDate}>取消</Button>
          </div>
        </div>
      </div>
    );
  }
}
