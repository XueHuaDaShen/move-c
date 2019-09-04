/* eslint-disable prefer-destructuring */
/* eslint-disable eqeqeq */
/* eslint-disable no-console */
/* eslint-disable no-undef */
// 数据映射， 根据 name 的 val 返回 所需要的 key 的值
const dataMapFn = (data, name, val, key) => {
  let arr = [];
  if (Number(val)) {
    arr = data.filter(item => item[name] == val)[0];
  } else {
    arr = data.filter(
      item => item[name] == val || `${item[name]}`.indexOf(val) > -1
    )[0];
  }
  let value = '';
  $.each(arr, (k, v) => {
    if (k === key) {
      value = v;
    }
  });
  return value;
};
export default dataMapFn;
