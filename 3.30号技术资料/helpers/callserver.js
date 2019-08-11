/**
 * 配置接口信息
 * 每一条数组对应一条 api
 * api[0]: 前端调用的接口名称
 * api[1]: 对应的后端接口
 * api[2]: 一个配置对象，可配置请求的请求头。method (请求方法 默认为 'POST'), type (请求的 content-type 默认为 'application/json')
 */

const apiCfg = [
  // 收银台支付
  ['/orh5/cashier/preQuickPay', '/orh5/cashier/preQuickPay', {
    type: 'json',
    method: 'POST'
  }],
  // 收银台会员卡列表
  ['/orh5/cashier/getPayCards', '/orh5/cashier/getPayCards', {
    type: 'json',
    method: 'GET'
  }],
  // 收银台储值套餐列表
  ['/orh5/cashier/querySaveMoneySets', '/orh5/cashier/querySaveMoneySets', {
    type: 'json',
    method: 'GET'
  }],
  ['/orh5/qrcode/info', '/orh5/qrcode/info', {
    type: 'json',
    method: 'GET'
  }],
  ['/orh5/cart/getCartInfo', '/orh5/cart/getCartInfo', {
    type: 'json',
    method: 'GET'
  }],
  ['/orh5/cart/save', '/orh5/cart/save', {
    type: 'json',
    method: 'POST'
  }],
  ['/orh5/cart/submitCart', '/orh5/cart/submitCart', {
    type: 'json',
    method: 'POST'
  }],
  // ['/or/food/menu', '/or/food/menu', {
  //   type: 'json',
  //   method: 'GET'
  // }],
  ['/orh5/food/menu', '/orh5/food/menu', {
    type: 'json',
    method: 'POST'
  }],
  // ['/or/food/extra', '/or/food/extra', {
  //   type: 'json',
  //   method: 'GET'
  // }],
  // ['/or/shop/user', '/or/shop/user', {
  //   type: 'json',
  //   method: 'GET'
  // }],
  // ['/or/shop/info', '/or/shop/info', {
  //   type: 'json',
  //   method: 'GET'
  // }],
  ['/orh5/shop/info', '/orh5/shop/info', {
    type: 'json',
    method: 'POST'
  }],
  ['/orh5/shop/user', '/orh5/shop/user', {
    type: 'json',
    method: 'POST'
  }],
  ['/orh5/shop/getFoodDescByShopID', '/orh5/shop/getFoodDescByShopID', {
    type: 'json',
    method: 'POST'
  }],
  ['/orh5/food/extra', '/orh5/food/extra', {
    type: 'json',
    method: 'POST'
  }],
  ['/orh5/reward/info', '/orh5/reward/info', {
    type: 'json',
    method: 'POST'
  }],
  ['/orh5/cashier/preRewardPayment', '/orh5/cashier/preRewardPayment', {
    type: 'json',
    method: 'POST'
  }],
  ['/orh5/cashier/getOrderPayStatusByOrderKey', '/orh5/cashier/getOrderPayStatusByOrderKey', {
    type: 'json',
    method: 'GET'
  }],
  // 新评价查询评价类目设置
  ['/orh5/comment/queryCategory', '/orh5/comment/queryCategory', {
    method: 'GET',
    type: 'json'
  }],
  // 新评价订单详情
  ['/orh5/order/getOrderDetail', '/orh5/order/getOrderDetail', {
    method: 'GET',
    type: 'json'
  }],
  // 新评价提交
  ['/or/comment/submit', '/or/comment/submit', {
    method: 'POST',
    type: 'json'
  }],
  // 评价列表
  ['/orh5/comment/list', '/orh5/comment/list', {
    method: 'POST',
    type: 'json'
  }],
  // 满减促销
  ['/orh5/promotion/saveCartBillFree', '/orh5/promotion/saveCartBillFree', {
    type: 'json',
    method: 'POST'
  }],
  // 会员活动列表
  ['/orh5/promotionEvent/queryEvents', '/orh5/promotionEvent/queryEvents', {
    type: 'json',
    method: 'POST'
  }],
  // 会员活动详情
  ['/orh5/promotionEvent/queryPromotionEventDetail', '/orh5/promotionEvent/queryPromotionEventDetail', {
    type: 'json',
    method: 'POST'
  }],
  // 会员活动参加
  ['/orh5/promotionEvent/joinPromotionEvent', '/orh5/promotionEvent/joinPromotionEvent', {
    type: 'json',
    method: 'POST'
  }],
  // 登录状态
  ['logon', '/or/user/logon', {
    type: 'json'
  }],
  ['login', '/or/user/login', {
    type: 'json'
  }],
  // 获取微信配置
  ['getWXConfig', '/or/wechat/getSign', {
    method: 'GET'
  }],
  // 获取微信授权 url
  ['getWechatOAuthUrl', '/or/wechat/getWechatOAuthUrl', {
    method: 'GET'
  }],
  //
  /**
   * 彩蛋猫先付接口
   * http://wiki.hualala.com/pages/viewpage.action?pageId=28193527
   */
  ['getCdmOrderDetail', '/or/order/getCdmOrderDetail', {
    method: 'GET'
  }],

  // 查询卡权益信息(当前等级和下一等级)
  ['getVipEquity', '/or/card/getCardInterestInfo', {
    method: 'GET',
    type: 'json'
  }],
  // 查询会员卡历史积分
  ['getHistoryIntegral', '/or/card/queryPointHistory', {
    method: 'GET',
    type: 'json'
  }],
  // 查询会员卡交易记录，卡值，卡积分变化的记录
  ['getTransDetail', '/or/card/queryCardTransDetail', {
    method: 'GET',
    type: 'json'
  }],
  // 查询会员卡信息(精简字段)
  ['queryCardList', '/or/card/queryCardList', {
    method: 'GET',
    type: 'json'
  }],
  // 查询会员卡信息
  ['getCardList', '/or/card/queryCard', {
    method: 'GET',
    type: 'json'
  }],
  // 开通会员卡
  ['postCardInfo', '/or/card/openCard', {
    method: 'POST',
    type: 'json'
  }],
  // 套餐储值
  ['postComboTopUp', '/or/card/cardRecharge', {
    method: 'POST',
    type: 'json'
  }],
  // 卡类型查询
  ['getCardTypeList', '/or/card/queryCardTypeList', {
    method: 'GET',
    type: 'json'
  }],
  // 优惠券查询
  ['getVoucherList', '/or/card/queryVoucher', {
    method: 'GET',
    type: 'json'
  }],
  // 优惠券详情查询
  ['postVoucherDetail', '/or/card/getVoucherDetail', {
    method: 'POST',
    type: 'json'
  }],
  // 批量获取券的列表的接口
  ['getVoucherDetail', '/or/card/getVoucherDetail', {
    method: 'get',
    type: 'json'
  }],
  // 查询券的转增状态
  ['getVoucherStatus', '/or/promotion/getVoucherStatus', {
    method: 'get',
    type: 'json'
  }],
  // 发起券转增
  ['transferVoucher', '/or/promotion/transferVoucher', {
    method: 'POST',
    type: 'json'
  }],
  // 领取转赠的券
  ['receiveVoucher', '/or/promotion/receiveVoucher', {
    method: 'POST',
    type: 'json'
  }],
  // 优惠券规则查询
  ['getVoucherRuleList', '/or/card/queryVoucherRule', {
    method: 'GET',
    type: 'json'
  }],
  // 预转增获取转增唯一key
  ['getshareKey', '/or/promotion/shareKeyGen', {
    method: 'POST',
    type: 'json'
  }],
  // 调取微信卡券签名
  ['getSignList', '/or/wechat/genSignList', {
    method: 'POST',
    type: 'json'
  }],
  // 获取会员卡可使用套餐
  ['getComboTopUp', '/or/card/querySaveMoneySetList', {
    method: 'GET',
    type: 'json'
  }],
  // 获取付款动态码
  ['getDynamicPwd', '/or/card/getDynamicPwd', {
    method: 'GET',
    type: 'json'
  }],
  ['getDynamicPwd', '/or/card/getDynamicPwd', {
    method: 'GET',
    type: 'json'
  }],
  // 优惠券详情页获取已注册和未注册的会员卡列表
  ['getCustomerCardList', '/orh5/crm/queryCardAndCardType', {
    method: 'POST',
    type: 'json'
  }],
  // 使用优惠券
  ['useVouchers', '/orh5/promotion/ticketRecharge', {
    method: 'POST',
    type: 'json'
  }],

  // 获取用户信息
  ['getUserInfo', '/or/customer/getUserInfo', {
    method: 'GET',
    type: 'json'
  }],
  // 获取用户地址列表
  ['postNewAddress', '/or/customer/address', {
    method: 'POST',
    type: 'json'
  }],
  // 获取用户常用地址
  ['defaultAddress', '/or/customer/address/usual', {
    method: 'PUT',
    type: 'json'
  }],
  // 获取用户的收货地址列表
  ['getAddressList', '/or/customer/addresses', {
    method: 'GET',
    type: 'json'
  }],
  // 更改用户地址
  ['editAddress', '/or/customer/address', {
    method: 'PUT',
    type: 'json'
  }],
  // 删除用户地址
  ['deleteAddress', '/or/customer/address', {
    method: 'DELETE',
    type: 'json'
  }],

  // 是否能够参加完善资料送礼活动
  ['checkJoin', '/or/promotion/completeEvent/checkJoin', {
    method: 'GET',
    type: 'json'
  }],
  // 获取完善资料活动
  ['getCompleteEventInfo', '/or/promotion/completeEvent/queryEvent', {
    method: 'GET',
    type: 'json'
  }],
  // 完善资料页面调用户信息
  ['getCustomerInfo', '/or/customer/queryCustomerInfo', {
    method: 'GET',
    type: 'json'
  }],
  // 绑定手机号调发送验证码
  ['sendSMSCode', '/or/customer/sendSMSCode', {
    method: 'POST',
    type: 'json'
  }],
  // 俩次点击发送验证码之间的时间接口
  ['getVerCodeTime', '/or/customer/getVerCodeTime', {
    method: 'POST',
    type: 'json'
  }],
  // 更新用户信息
  ['updateCustomerInfo', '/or/customer/updateCustomerInfo', {
    method: 'POST',
    type: 'json'
  }],
  // 验证手机号的验证码
  ['verifyCode', '/or/customer/verifyCode', {
    method: 'POST',
    type: 'json'
  }],


  /**
   * 订单支付
   * http://wiki.hualala.com/pages/viewpage.action?pageId=28196925
   */
  ['payment', '/or/order/payment', {
    method: 'POST',
    type: 'json'
  }],
  // 我的订单列表
  ['getMyOrder', '/or/order/list', {
    method: 'GET',
    type: 'json'
  }],
  // 订单提交
  ['submitOrder', '/or/order/submit', {
    method: 'POST',
    type: 'json'
  }],
  // 订单评价与评价有礼领取优惠券
  // ['evaluateMsg', '/or/order/comment', {
  //   method: 'POST',
  //   type: 'json'
  // }],
  // 评价有礼活动内容
  ['getActiveCont', '/or/order/comment/voucher/activity', {
    method: 'GET',
    type: 'json'
  }],
  // 是否已评价
  ['isComment', '/or/order/comment/voucher/detail', {
    method: 'GET',
    type: 'json'
  }],
  // 支付页面获取会员卡
  ['getPayCards', '/or/card/getPayCards', {
    method: 'POST',
    type: 'json'
  }],

  // 获取找人代付的url
  ['getPayForAnotherUrl', '/or/order/payForAnother/getUrl', {
    method: 'POST',
    type: 'json'
  }],
  // 获取代付信息
  ['getPayForAnotherInfo', '/or/order/payForAnother/detail', {
    method: 'POST',
    type: 'json'
  }],
  // 能否招人代付
  ['isPayForAnother', '/or/order/payForAnother/validate', {
    method: 'POST',
    type: 'json'
  }],
  // 设置开台自动加入状态
  ['setAutoStatus', '/or/shoppingCart/setAutoStatus', {
    type: 'json',
    method: 'POST'
  }],
  // 先付计算优惠券金额
  ['couponCalculate', '/or/shoppingCart/getDiscountAmount', {
    method: 'POST',
    type: 'json'
  }],
  // 获取订单状态
  ['getValidateStatus', '/or/order/validateOrderStatus', {
    method: 'GET',
    type: 'json'
  }],
  // 更新订单为代付订单
  ['updateOrderPayWay', '/or/order/payForAnother/updateOrderPayWay', {
    method: 'GET',
    type: 'json'
  }],

  // 收银台支付时创建订单
  ['collectMoney', '/or/order/collectMoney', {
    method: 'GET',
    type: 'json'
  }],
  // 订单退订
  ['unsubscribeMsg', '/or/order/revoke', {
    method: 'DELETE',
    type: 'json'
  }],
  // 确认订单
  ['confirmRecieve', '/or/order/confirm', {
    method: 'POST',
    type: 'json'
  }],
  // 订单详情
  ['getOrderDetail', '/or/order', {
    method: 'GET',
    type: 'json'
  }],
  // 消费返礼品－礼品列表
  ['getSalePromotion', '/or/promotion/getSalePromotion', {
    method: 'GET',
    type: 'json'
  }],
  // 消费返礼品－领取礼品
  ['getJoinSalePromotion', '/or/promotion/joinSalePromotion', {
    method: 'GET',
    type: 'json'
  }],
  // 再来一单
  ['getOrderAgain', '/or/order/again', {
    method: 'GET',
    type: 'json'
  }],

  // 查询店铺营销活动
  // ['promotionList', '/or/promotion/queryPromotionInfoByShop', {
  //   method: 'GET',
  //   type: 'json'
  // }],

  // 获取店铺列表
  ['getNearbyShop', '/or/shop', {
    method: 'GET',
    type: 'json'
  }],
  // 适用门店
  ['getApplyShop', '/or/shop/availableUseShops', {
    method: 'GET',
    type: 'json'
  }],
  // 获取全部业务
  // ['getAllBusiness', '/or/shop/getAllBusiness', {
  //   method: 'GET',
  //   type: 'json'
  // }],
  // 获取店铺详情
  ['getShopDetail', '/or/shop/getShop', {
    method: 'GET',
    type: 'json'
  }],
  // 获取菜单
  ['getMenuList', '/or/shop/getMenu', {
    method: 'GET',
    type: 'json'
  }],
  // 新获取店铺详情
  ['newGetShopDetail', '/or/newshop/getShop', {
    method: 'GET',
    type: 'json'
  }],
  // 新获取菜单
  // ['newGetMenuList', '/or/newshop/getMenu', {
  //   method: 'GET',
  //   type: 'json'
  // }],
  // 猜你喜欢菜品列表新
  // ['newGetRecommendList', '/or/shoppingCart/getItemRecommendNew', {
  //   method: 'POST',
  //   type: 'json'
  // }],
  // 猜你喜欢菜品列表
  ['getRecommendList', '/or/shoppingCart/getItemRecommend', {
    method: 'POST',
    type: 'json'
  }],
  // 获取菜品详情
  ['getFoodDetail', '/or/shop/getFoodDetail', {
    method: 'GET',
    type: 'json'
  }],
  // 根据桌台二位码查询店铺和桌台信息以及SAAS在线状态信息
  ['getShopByQRCode', '/or/shop/getShopByQRCode', {
    method: 'GET',
    type: 'json'
  }],
  // 获取店铺相应业务的下单日期
  ['getOrderDateList', '/or/shop/getOrderDateList', {
    method: 'GET',
    type: 'json'
  }],
  // 查询活动券信息及列表
  ['getActiveCoupon', '/or/promotion/queryVoucherDetailEnterShop', {
    method: 'GET',
    type: 'json'
  }],
  // 发放活动券
  ['postActiveCoupon', '/or/promotion/obtainVoucherEnterShop', {
    method: 'POST',
    type: 'json'
  }],
  // 获取设置的单注品注列表
  // ['getFoodTasteList', '/or/shop/getFoodDescByShopID', {
  //   method: 'GET',
  //   type: 'json'
  // }],

  // 店铺列表额外信息
  ['getShopListEx', '/or/newshop/getShopListEx', {
    method: 'POST',
    type: 'json'
  }],

  // 开卡 - 发送短信验证码
  ['verifyMobile', '/or/code/openCard/sendSMS', {
    method: 'POST',
    type: 'json'
  }],
  // 开卡-发送语音验证码
  ['verifyVoiMobile', '/or/code/openCard/sendVoiceCode', {
    method: 'POST',
    type: 'json'
  }],

  // 商家评价获取最低分
  ['getScoreShops', '/or/preWarn/getScoreAndShops', {
    method: 'GET',
    type: 'json'
  }],
  // 商家评价列表
  ['getCommentList', '/or/preWarn/getComments', {
    method: 'POST',
    type: 'json'
  }],
  // 商家回复
  ['merchantReply', '/or/preWarn/replay', {
    method: 'PUT',
    type: 'json'
  }],
  // 置顶/隐藏 评价。取消置顶隐藏评价
  ['stickHide', '/or/preWarn/update', {
    method: 'PUT',
    type: 'json'
  }],
  // 获取云端购物车
  // ['getshoppingCartInfo', '/or/shoppingCart/info', {
  //   method: 'POST',
  //   type: 'json'
  // }],
  // 保存购物车信息
  // ['saveShoppingCart', '/or/shoppingCart/save', {
  //   method: 'PUT',
  //   type: 'json'
  // }],
  // 提交购物车
  ['submitShoppingCart', '/or/shoppingCart/submit', {
    method: 'POST',
    type: 'json'
  }],
  // 发起拉取saas账单信息请求
  ['sendMsg', '/or/shoppingCart/sendMsg', {
    method: 'GET',
    type: 'json'
  }],
  // 获取saas账单信息
  ['getBill', '/or/shoppingCart/getBill', {
    method: 'POST',
    type: 'json'
  }],
  // 获取快速扫码点餐菜品组
  ['getQuickFood', '/or/shop/getQuickFood', {
    method: 'GET',
    type: 'json'
  }],
  // 获取快速扫码点餐取餐号
  ['getOrderFlowNo', '/or/order/orderFlowNo', {
    method: 'GET',
    type: 'json'
  }],
  // 获取会员卡对应营销包
  ['getPromotionWrappers', '/or/order/calculateOrderPromotion', {
    method: 'POST',
    type: 'json'
  }],


  // 多人点餐
  // 根据桌台码对用户进行分组
  ['getUserTable', '/or/shoppingCart/getUserTable', {
    method: 'POST',
    type: 'json'
  }],
  ['setPersonTotal', '/or/shoppingCart/setPersonTotal', {
    method: 'POST',
    type: 'json'
  }],
  // 保存购物车信息(多人点餐)
  // ['saveMorePeopleShoppingCart', '/or/shoppingCart/mulSave', {
  //   method: 'PUT',
  //   type: 'json'
  // }],

  // 套餐储值
  ['storeSetValueList', '/or/card/paymentPage/querySaveMoneySetList', {
    method: 'POST',
    type: 'json'
  }],
  // 多人点餐查看订单状态
  ['getOrderStatus', '/or/order/getOrderStatus', {
    method: 'POST',
    type: 'json'
  }],
  // 已下单订单详情
  ['getOrderInfo', '/or/order/orderInfo', {
    method: 'GET',
    type: 'json'
  }],
  // ['catOrderActivity', '/or/shoppingCart/submitByUrl', {
  //   method: 'POST',
  //   type: 'json'
  // }],

  // 检测已下单页面中是否和sass金额不同
  ['checkDueAmount', '/or/order/checkDueAmount', {
    method: 'POST',
    type: 'json'
  }],

  // 根据普通码s获取groupID
  ['getGroupIDByQRCode', '/or/un/getGroupIDByQRCode', {
    method: 'GET',
    type: 'json'
  }],

  // 获取页面配置
  ['getSkin', '/or/shop/getSkin', {
    method: 'GET',
    type: 'json'
  }],
  // 获取默认皮肤
  // ['getDefaultSkin', '/or/shop/getDefaultSkin', {
  //   method: 'GET',
  //   type: 'json'
  // }],
  // 获取服务器时间
  // ['getServerDate', '/or/un/getServerDate', {
  //   method: 'GET',
  //   type: 'json'
  // }],
  // 获取订单赠品估清
  ['checkInventory', '/or/order/checkInventory', {
    method: 'POST',
    type: 'json'
  }],
  // 获取订单推单状态
  ['getOrderPushStatus', '/or/order/getOrderPushStatus', {
    method: 'GET',
    type: 'json'
  }],
  // 绑定店员微信
  ['bindEmpWechat', '/or/order/redpack/bindEmpWechat', {
    method: 'POST',
    type: 'json'
  }],
  // 查询店员信息
  ['getEmp', '/or/order/redpack/getEmp', {
    method: 'POST',
    type: 'json'
  }],
  ['openCardNeedPersonalData', '/or/card/openCardNeedPersonalData', {
    method: 'GET',
    type: 'json'
  }],
  // 获取支付状态
  ['getPayState', '/or/order/pay/state', {
    method: 'GET',
    type: 'json'
  }],
  // 获取业务配置信息
  ['getBusinessSetting', '/or/shop/getBusinessSetting', {
    method: 'POST',
    type: 'json'
  }],
  // 获取基本信息
  ['getCommonSetting', '/or/shop/getCommonSetting', {
    method: 'POST',
    type: 'json'
  }],
  // 验证下单码
  ['checkSubmitCode', '/or/shop/checkSubmitCode', {
    method: 'POST',
    type: 'json'
  }],
  ['getAdBody', '/orh5/advertorial/getAdBody', {
    method: 'GET',
    type: 'json'
  }],
  // 获取听腾讯地图key
  ['getMapKey', '/orh5/base/getMapKey', {
    method: 'GET',
    type: 'json'
  }],
  ['getBaseShop', '/or/baseShop/getBaseShop', {
    method: 'GET',
    type: 'json'
  }],
  // 获取卡余额具体信息
  ['queryCardSimpleInfo', '/or/card/queryCardSimpleInfo', {
    method: 'GET',
    type: 'json'
  }],
  // 获取支付状态页金额
  ['goldenPay','/or/pay/goldenPay',{
    method:'GET',
    type:'json'
  }],
  // 获取金豆金额
  ['queryCanGetBeanNum','/goldenApi/queryCanGetBeanNum',{
    method:'POST',
    type:'json'
  }]
];

const apiCfgMap = apiCfg.reduce((ret, cfg) => {
  if (!cfg || !cfg[0] || !cfg[1]) return ret;
  // eslint-disable-next-line no-param-reassign
  ret[cfg[0]] = cfg;
  return ret;
}, {});

export default function getApiConfig(apiName) {
  const config = apiCfgMap[apiName];
  if (!config) throw new Error(`getApiConfig: cannot found ${apiName} config`);
  const [
    name,
    url,
    {
      method = 'POST',
      type = 'application/json',
      credentials = 'include', // 在请求中带入 cookie
    } = {},
  ] = config;
  return {
    name,
    url,
    options: {
      method,
      type,
      credentials
    },
  };
}
