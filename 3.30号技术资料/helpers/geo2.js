import MiniQQMap from '../assets/js/qqmap-wx-jssdk';
import MessageBox from '../components/MessageBox';
import wxConfig from './bridge/config';
import ua from './ua';
import fetch from './fetchData';

let mapKey = null;
let QQmap = null;

const getKey = () => {
  if (mapKey) return Promise.resolve(mapKey);
  return fetch('getMapKey', {}, null, { path: 'data', disablePrompt: true }).then(res => {
    mapKey = res && res.key ? res.key : 'SWLBZ-UXA63-TDN3S-YHCEO-JWCYV-P2B2Z';
    return mapKey;
  }).catch((e) => {
    mapKey = 'SWLBZ-UXA63-TDN3S-YHCEO-JWCYV-P2B2Z';
    return mapKey;
  })
}

const getQQMapInstance = () => {
  if (QQmap) return Promise.resolve(QQmap);
  return getKey().then(key => {
    QQmap = new MiniQQMap({ key })
    return QQmap;
  })
};

const getDistance = (lat1, lng1, lat2, lng2) => {
  const radLat1 = lat1 * Math.PI / 180.0;
  const radLat2 = lat2 * Math.PI / 180.0;
  const a = radLat1 - radLat2;
  const b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
  // eslint-disable-next-line
  let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
  s *= 6378.137;// EARTH_RADIUS;
  s = Math.round(s * 10000) / 10000;
  return s.toFixed(2);
}

const withmeDistance = (lat, lng) => {
  const address = JSON.parse(window.localStorage.getItem('hll-or-address'));
  if (!address) return 0;
  return getDistance(lat, lng, address.lat, address.lng);
}

const transAddress = (addressInfo) => {
  // eslint-disable-next-line camelcase
  const { ad_info, formatted_addresses, location, title, city, address } = addressInfo;

  return {
    // eslint-disable-next-line camelcase
    selectCity: ad_info ? ad_info.city : city,
    // eslint-disable-next-line camelcase
    currentCity: ad_info ? ad_info.city : city,
    // eslint-disable-next-line camelcase
    formatAddress: formatted_addresses ? formatted_addresses.recommend : title,
    lng: location.lng,
    lat: location.lat,
    detail: address,
    username: '',
    phone: '',
    sex: '',
    myAddress: false,
    distance: withmeDistance(location.lat, location.lng)
  }
}

const getLocationFactory = {
  wechat() {
    return new Promise((resolve, reject) => {
      wxConfig().then((sdk) => {
        sdk.getLocation({
          type: 'gcj02',
          success(data) {
            resolve(data)
            // resolve({ errMsg: 'x' })
          },
          cancel(e) {
            resolve(e);
          },
          fail() {
            resolve(e);
          }
        });
      }).catch(() => {
        MessageBox.alert('获取微信配置失败, 请重试')
      })
    });
  },
  async alipay(sdk) {
    return new Promise((resolve, reject) => {
      sdk.call('getCurrentLocation', { requestType: 0, bizType: 'hll' }, (result) => {
        if (result.error) {
          reject(result.error);
        }
        resolve(result);
      });
    });
  },
}

// 当前位置信息
const getAddress = async (position) => {
  const QQMapInstance = await getQQMapInstance();

  return new Promise((resolve, reject) => {
    QQMapInstance.reverseGeocoder({
      get_poi: 0,
      coord_type: 5,
      location: {
        latitude: position.latitude,
        longitude: position.longitude,
      },
      success(rs) {
        resolve(rs);
        // resolve({});
      },
      fail(error) {
        reject(error);
      },
    });
  })
};

// 默认为搜索附近位置
const nearByAddress = async (position) => {
  const QQMapInstance = await getQQMapInstance();

  return new Promise((resolve, reject) => {
    QQMapInstance.reverseGeocoder({
      get_poi: 1,
      coord_type: 5,
      poi_options: 'address_format=short',
      location: {
        latitude: position.latitude,
        longitude: position.longitude,
      },
      success(rs) {
        resolve(rs);
        // resolve({});
      },
      fail(error) {
        resolve(error);
      },
    });
  });
}

const inputTips = async (input, city = '') => {
  if (!input) return Promise.resolve([]);

  const QQMapInstance = await getQQMapInstance();

  return new Promise((resolve, reject) => {
    QQMapInstance.getSuggestion({
      keyword: input,
      region: city,
      policy: 1,
      success(rs) {
        resolve(rs);
        // resolve({});
      },
      fail(error) {
        resolve(error);
      },
    });
  });
}

export default {
  getLocation: getLocationFactory[ua],
  getDistance,
  withmeDistance,
  transAddress,
  getAddress,
  nearByAddress,
  inputTips,
}
