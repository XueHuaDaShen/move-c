
export function toThousands(num) {
  let sign = '';
  // 如果为负数，获取负号
  if(num<0){
    sign = '-';
  }
  num = Math.abs(num).toFixed(2);
  var re = /\d{1,3}(?=(\d{3})+$)/g;
  var n1 = (num || 0).toString().replace(/^(\d+)((\.\d+)?)$/, function(s, s1, s2) { return s1.replace(re, "$&,") + s2; });
  return sign+n1
}