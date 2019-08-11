import coordtransform from 'coordtransform';
import { ua } from "..";
import config from './config';
import { getSdk, getQQMap } from './utils';

const ErrorCode = {
  1: '用户拒绝展示位置信息',
  2: '无法获取用户位置',
  3: '获取用户位置超时',
}

class LocationClass {
  // 获取地理位置
  async getLocation() {
    return this[ua]();
  }

  /**
   * 显示地图
   * @param { lat, lng, title, address } options
   */
  openLocation(options) {
    const bd09togcj02 = coordtransform.bd09togcj02(options.lng, options.lat);
    const lat = bd09togcj02[1];
    const lng = bd09togcj02[0];
    // eslint-disable-next-line
    window.location.href = `http://apis.map.qq.com/tools/poimarker?type=0&marker=coord:${lat},${lng};title:${options.title};addr:${options.address}&key=OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77&referer=myapp`;
  }

  /**
   * 地图选点
   * @param { backurl } options
   */
  chooseLocation(options) {
    window.location.href = `http://apis.map.qq.com/tools/locpicker?search=1&type=0&backurl=${options.backurl}&key=TPJBZ-UJSKK-LLCJS-AKHGX-7IDNF-RWFKP&referer=wx`
  }

  async getAddress(options) {
    const QQMap = await getQQMap();
    return new Promise((resolve) => {
      const wgs84togcj02 = coordtransform.wgs84togcj02(options.lng, options.lat);
      const geocoder = new QQMap.maps.Geocoder({
        complete: (result) => {
          resolve(result.detail.addressComponents.street);
          // this.mapAddress = result.detail.addressComponents.street
        },
      })
      const coord = new QQMap.maps.LatLng(wgs84togcj02[1], wgs84togcj02[0]);
      geocoder.getAddress(coord);
    })
  }

  // 微信
  async wechat() {
    const sdk = await config()

    return new Promise((resolve, reject) => {
      sdk.getLocation({
        type: 'wgs84',
        success: (pos) => {
          resolve(pos)
        },
        cancel: () => {
          const code = 1;
          const positionError = new Error({
            code,
            message: ErrorCode[code],
          })
          reject(positionError)
        },
        fail: (error) => {
          reject(error)
        },
      });
    });
  }

  async alipay() {
    const sdk = await getSdk();
    return new Promise((resolve, reject) => {
      sdk.call('getCurrentLocation', { requestType: 0, bizType: 'hll' }, (result) => {
        if (result.error) {
          reject(result.error)
        }
        resolve(result);
      });
    })
  }
}

const Location = new LocationClass()

export default Location
