/* eslint-disable */
import authorization from '../helpers/bridge/authorization';
import fetchData from '../helpers/fetchData';
import Loading from '../components/Loading/wechat';
import url from '../helpers/url';

const login = () => {
  return new Promise((resolve) => {
    fetchData('logon', {}, null, {
      hsh: true,
      loginCallback() {
        const query = url.query2Dict(window.location.href);
        const text = {
          hll: '1/3',
          hlS: '2/3',
          hlT: '3/3',
        }

        Loading.show({
          text: text[query.state] || '登陆中'
        })

        authorization().then(() => {
          Loading.hide();
          resolve();
        });
      },
    }).then(() => {
      Loading.hide();
      resolve();
    });
  });
};

export default login;
