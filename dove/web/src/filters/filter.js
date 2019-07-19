import moment from 'moment';

// 时间过滤器 
// 日-月-年 时:分:秒
export const formatTime = v => {
  if (v) {
    return moment(v).format('DD/MM/YYYY HH:mm:ss')
  }
  return '--'
};

// 时间过滤器 
// 日-月-年 
export const formatTimeDay = v => {
  if (v) {
    return moment(v).format('DD/MM/YYYY')
  }
  return '--'
};
// 时间过滤器 
// 月-年 
export const formatMonth = v => {
  if (v) {
    return moment(v).format('MM-YYYY')
  }
  return '--'
};



// 金额文本格式化
// 每千位逗号隔开，不包含小数部分
export const filterCash = v => {
  if (v || v === 0) {
    let num = parseFloat(v).toFixed(2);
    //如果num是负数，则获取她的符号
    var sign = '';
    if (Number(num) < 0) {
      sign = '-';
    }
    // 绝对值
    var numAbs = Math.abs(num);
    var decimal = String(numAbs).split('.')[1] || ''; //小数部分
    var tempArr = [];
    var revNumArr = String(numAbs).split('.')[0].split("").reverse(); //倒序
    for (let i in revNumArr) {
      tempArr.push(revNumArr[i]);
      if ((i + 1) % 3 === 0 && i != revNumArr.length - 1) {
        tempArr.push(',');
      }
    }
    var zs = tempArr.reverse().join(''); //整数部分
    return decimal ? sign + zs + '.' + decimal : sign + zs;
  }
  return '0';
}
