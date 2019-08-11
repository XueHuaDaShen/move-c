/**
 * 根据 ua 判断当前运行环境
 */
const UA = navigator.userAgent.toLowerCase();
const UAlist = {
  wechat: /micromessenger/,
  alipay: /alipayclient/,
};
const test = (context, item) => key => context[key].test(item);
const UAtest = test(UAlist, UA);

const _ua = Object.keys(UAlist).filter(item => UAtest(item))[0];
const ua = _ua || 'browser';

export default ua;
