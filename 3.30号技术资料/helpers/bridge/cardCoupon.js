// import { getSdk } from './utils';
import config from './config';
import MessageBox from '../../components/MessageBox';

class CardCoupon {
  async addCard(options, that) {
    // const sdk = await getSdk();
    const sdk = await config();
    // console.log(sdk)
    sdk.addCard({
      cardList: [{
        cardId: options.cardID,
        cardExt: JSON.stringify(options.cardExt),
      }],
      success: () => {
        if (that) {
          that.init()
        }
      },
      fail: (err) => {
        MessageBox.alert(err, '提示')
      },
    });
  }

  async addCoupon(options, that) {
    const sdk = await config();
    sdk.addCard({
      cardList: options,
      success: () => {
        if (that) {
          that.init()
        }
      },
      fail: (err) => {
        MessageBox.alert(err, '提示')
      },
    });
  }

  async openCard(options, that) {
    const sdk = await config();
    sdk.openCard({
      cardList: [
        {
          cardId: options.cardID,
          code: options.wechatCardCode,
        },
      ],
      success: () => {
        if (that) {
          that.init()
        }
      },
      fail: (err) => {
        MessageBox.alert(err, '提示')
      },
    })
  }
}

const cardCoupon = new CardCoupon();

export default cardCoupon;
