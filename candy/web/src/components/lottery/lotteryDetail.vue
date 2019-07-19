<template>
  <div class="lottery-detail">
    <div class="lottery-detail-wrap">
      <div class="play-kind-wrap">
        <ul class="play-kind" v-if="lotteryDisabled">
          <li :class="showRuler ? 'active' : ''" @click="changeRuler"><span>{{$t("message.gui_ze_jie_shao")}}</span></li>
        </ul>
        <ul class="play-kind" v-if="!lotteryDisabled">
          <li :class="showRuler ? 'active' : ''" @click="changeRuler"><span>{{$t("message.gui_ze_jie_shao")}}</span></li>
          <li v-for="(kind, k) in playKind.children" :key="k" @click="changePlayKind(kind)" :class="(kind_id === kind._id && !showRuler) ? 'active' : ''"><span>{{kind[key_lang]}}</span></li>
        </ul>
      </div>
      <div class="bets-wrap">
        <div class="bets-area-wrap">
          <div class="lottery-box" v-if="lotteryName==='时时彩'">
            <div class="inner-box">
              <div class="box-left">
                <div class="inner-left">
                  <table>
                    <thead>
                      <tr>
                        <td class="order">{{$t("message.xu_lie")}}</td>
                        <td class="num">{{$t("message.shu_zi")}}</td>
                        <td class="name">{{$t("message.yong_hu_ming")}}</td>
                        <td class="time">{{$t("message.ti_jiao_shi_jian")}}</td>
                      </tr>
                    </thead>
                    <tbody>
                      <tr :class="(i==0 || i==15) ? 'success' : ''" v-for="(item, i) in lotteryNumList" :key="i">
                        <td>{{i+1}}</td>
                        <td>{{item.serial_no}}</td>
                        <td>{{setUserName(item.loginname)}}</td>
                        <td>{{item.create_at?moment(item.create_at).format("DD-MM-YYYY HH:mm:ss"):'--'}}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div class="box-right">
                <div class="inner-right">
                  <div class="top">
                    <p class="inner-title">{{$t("message.huo_de_shu_zi_jiang")}}</p>
                    <p class="inner-countdown">{{formatTimeFn(countDownTime.hour)}}:{{formatTimeFn(countDownTime.min)}}:{{formatTimeFn(countDownTime.sec)}}</p>
                    <p class="inner-lottery-txt">{{$t("message.zong_shu")}}</p>
                    <p class="inner-lottery-num">{{totalCount}}</p>
                  </div>
                  <div class="bot">
                    <input type="text" maxlength="5" :placeholder="$t('message.qing_shu_ru')+$t('message.wu_wei_zheng_shu')" :class="isMatch?'has-error':''" @input="handleInputNumFn" @focus="handleInputFocus" class="input-num" v-model="inputNum">
                    <p style="color:#ed5565" v-if="isMatch">{{$t("message.qing_shu_ru")+$t("message.wu_wei_zheng_shu")}}</p>
                    <button class="add-num" @click="addLotteryNumFn" :disabled="isClick">{{$t("message.tian_jia_hao_ma")}}</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="bets-area" v-if="!showRuler">
            <div class="search-bets-number-wrap">
              <input type="number" v-model="searchNum" class="search-num">
              <button class="search-num-btn" :class="selected?'selected':''" @click="selected=!selected">{{$t("message.guan_lian_number")}}</button>
            </div>
            <div class="play-type">
              <span v-for="(play, p) in limited" :key="p" @click="changePlayType(play)" :class="setPlayTitleClass(play)?'active':''">{{play[key_lang]}} ({{play.prize}})</span>
            </div>
            <div class="select-num-area">
              <div class="bj" v-if="selectedPlay.length==0"><div class="inner"></div></div>
              <div class="bets-num-title-wrap" v-if="kind_code.indexOf('three') > -1">
                <nav class="bets-num-title">
                  <span @click="selectBetsNumTitle(i)" :class="betsNumTitle==i?'active':''" v-for="(v, i) in betsTitle" :key="i">{{i+'00'}}</span>
                </nav>
              </div>
              <div class="bets-num-title-wrap" v-if="kind_code.indexOf('two') > -1">
                <div class="two-title-div">
                  <strong>{{$t("message.liang_wei_hang_lie")}}</strong>
                  <div class="btn-group">
                    <button @click="selectBetsTwoNumTitle(i, 'and')" v-for="(v, i) in betsTitle" :key="i">{{i}}</button>
                  </div>
                </div>
                <div class="two-title-div">
                  <strong>{{$t("message.liang_wei_hang")}}</strong>
                  <div class="btn-group">
                    <button @click="selectBetsTwoNumTitle(i, 'row')" v-for="(v, i) in betsTitle" :key="i">{{i}}</button>
                  </div>
                </div>
                <div class="two-title-div">
                  <strong>{{$t("message.liang_we_lie")}}</strong>
                  <div class="btn-group">
                    <button @click="selectBetsTwoNumTitle(i, 'col')" v-for="(v, i) in betsTitle" :key="i">{{i}}</button>
                  </div>
                </div>
              </div>
              <p class="two-title-dec" v-if="kind_code.indexOf('two') > -1">{{$t("message.liang_wei_rule")}}</p>
              <div class="bets-num-wrap" v-if="kind_code.indexOf('three') > -1">
                <div v-if="searchNum ? randerBetsNym(i, 'three').toString().indexOf(searchNum) > -1 : true" v-for="(v, i) in betsNum" :class="setSelectedNumStyle(randerBetsNym(i, 'three'))" :key="i" @click="selectedNumFn(randerBetsNym(i, 'three'))"><button>{{randerBetsNym(i, 'three')}}</button></div>
              </div>
              <div class="bets-num-wrap" v-if="kind_code.indexOf('two') > -1">
                <div v-if="searchNum ? randerBetsNym(i, 'two').toString().indexOf(searchNum) > -1 : true" v-for="(v, i) in betsNum" :class="setSelectedNumStyle(randerBetsNym(i, 'two'))" :key="i" @click="selectedNumFn(randerBetsNym(i, 'two'))"><button>{{randerBetsNym(i, 'two')}}</button></div>
              </div>
              <div class="bets-num-wrap" v-if="kind_code.indexOf('run') > -1">
                <div v-if="searchNum ? randerBetsNym(i, 'run').toString().indexOf(searchNum) > -1 : true" v-for="(v, i) in betsTitle" :class="setSelectedNumStyle(randerBetsNym(i, 'run'))" class="run" :key="i" @click="selectedNumFn(randerBetsNym(i, 'run'), true, true)"><button>{{randerBetsNym(i, 'run')}}</button></div>
              </div>
            </div>
          </div>
          <div class="bets-ruler" v-if="!showRuler">
            <h2 class="ruler-title">{{$t("message.tou_zhu_xu_zhi")}}</h2>
            <div class="ruler-inner">
              <div class="ruler-desc" v-for="(play, p) in limited" :key="p">
                <strong>{{play[key_lang]}} ●</strong>
                <ul>
                  <li>{{$t("message.dan_zhu_zui_xiao_jin_e")}}：{{play.min_bet}}</li>
                  <li>{{$t("message.dan_zhu_zui_da_jin_e")}}：{{play.max_bet}}</li>
                  <li>{{$t("message.dan_zhu_zui_da_zhu_shu")}}：{{play.total_bet}}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div class="shopping-cart-wrap" v-if="lotteryName==='时时彩'?true:!showRuler">
          <div class="shopping-cart">
            <h2 class="shopping-cart-title">
              {{$t("message.gou_cai_lan")}}
              <!-- <div class="import-excel" v-if="lotteryName === '泰国官方彩'&&userType!=1"> -->
              <div class="import-excel" v-if="lotteryName === '泰国官方彩'">
                <input type="file" @change="handleImportText($event)" class="import-file">
                <span class="import-btn">{{$t("message.importEXCEL")}}</span>
              </div>
            </h2>
            <div class="shopping-cart-options" v-for="(option, o) in shoppingCart" :key="o">
              <h3 class="play-title" v-if="option.nums.length > 0"><span>{{option.play_name}}</span><span style="color:#EB5228">{{$t("message.discount")}}：{{option.discount}}%</span></h3>
              <ul class="num-list" v-if="option.nums.length > 0">
                <li v-for="(num, n) in option.nums" :key="n">
                  <span>{{num.num}}</span>
                  <input type="text" :value="num.money" @blur="handleLeaveSingleInput(option, num)" @input="handleInputSingleMoney(num, $event)">
                  <span>WIN: {{(num.money*num.win).toFixed(2)}}</span>
                  <em @click="deleteNum(option, n, o)">×</em>
                </li>
              </ul>
            </div>
            <div class="repeat-money">
              <input type="text" v-model="publicMoney" @blur="handleLeaveMoney($event)" @input="handleInputMoney($event)">
              <span>{{$t("message.chong_she_tou_zhu_jin_e")}}</span>
            </div>
            <p class="bets-all-money">{{$t("message.tou_zhu_zong_e")}}：{{countAllMoneyFn().toFixed(2)}}{{$t("message.money")}}</p>
            <p class="bets-all-money">{{$t("message.zhe_kou_zong_e")}}：{{discountMoneyFn().toFixed(2)}}{{$t("message.money")}}</p>
            <p class="bets-all-money">{{$t("message.ying_fu_jin_e")}}：{{(countAllMoneyFn()-discountMoneyFn()).toFixed(2)}}{{$t("message.money")}}</p>
            <div class="operate-btn">
              <button class="to-bets" :disabled="userType==1" :class="userType==1?'disabled' : ''" @click="toBets">{{$t("message.li_ji_tou_zhu")}}</button>
              <button class="clear-shopping" @click="clearShoppingcar">{{$t("message.qing_kong")+$t("message.gou_cai_lan")}}</button>
            </div>
            <!-- <p class="lottery-time"><img src="@/assets/img/time.png" class="time-icon"><span>{{formatTimeFn(countDownTime.hour)}}:{{formatTimeFn(countDownTime.min)}}:{{formatTimeFn(countDownTime.sec)}}</span></p> -->
          </div>
        </div>
        
      </div>
      <div class="ruler-inner rule-inner-wrap-img" v-if="showRuler">
        <div v-html="ruler">{{ruler}}</div>
      </div>
    </div>
    <div class="alert-confirm-bets-wrap" id="confirm-bets-wrap" :style="betsConfirm" v-show="showConfirm">
      <h1 class="bets-title"><img src="@/assets/img/confirm.png"><span>{{$t("message.que_ren_tou_zhu")}}</span></h1>
      <h2 class="lottery-name">{{lotteryName_th + ' ' + $t("message.di") + ' ' + issue + ' ' + $t("message.qi")}}</h2>
      <div class="split-line"></div>
      <div style="max-height:200px;overflow-y:auto;">
        <ul class="confirm-bets-list" v-for="(play, p) in shoppingCart" :key="p" :style="{marginBottom: p===shoppingCart.length-1?'20px':'0px'}">
          <li class="confirm-bets-title">
            <strong class="xu_hao">{{$t("message.xu_hao")}}</strong>
            <strong class="nums">{{play.play_name}}</strong>
            <strong class="discount">{{$t("message.discount")}}</strong>
            <strong class="price">{{$t("message.price")}}</strong>
          </li>
          <li v-for="(num, n) in play.nums" :key="n">
            <span class="xu_hao">{{num.number}}</span>
            <span class="nums">{{num.num}}</span>
            <span class="discount">{{play.discount}}%</span>
            <span class="price">{{num.money}}</span>
          </li>
        </ul>
      </div>
      <div class="split-line"></div>
      <p class="bets-all-money">{{$t("message.tou_zhu_zong_e")}}：{{countAllMoneyFn().toFixed(2)}}{{$t("message.money")}}</p>
      <p class="bets-all-money">{{$t("message.zhe_kou_zong_e")}}：{{discountMoneyFn().toFixed(2)}}{{$t("message.money")}}</p>
      <p class="bets-all-money">{{$t("message.ying_fu_jin_e")}}：{{(countAllMoneyFn()-discountMoneyFn()).toFixed(2)}}{{$t("message.money")}}</p>
      <div class="confirm-wrap">
        <button class="confirm-btn" @click="confirmBets" :disabled="isClick">{{$t("message.confirm")}}</button>
        <button class="cancel-btn" @click="cancelBets">{{$t("message.cancel")}}</button>
      </div>
    </div>
    <div class="alert-confirm-bets-wrap" id="bets-success-wrap" style="min-height:0" :style="betsSuccess" v-show="showSuccess">
      <h1 class="bets-title"><img src="@/assets/img/confirm.png"><span>{{$t("message.tou_zhu_cheng_gong")}}</span></h1>
      <div class="confirm-wrap">
        <button class="confirm-btn" @click="cancelBets" :disabled="isClick">{{$t("message.confirm")}}</button>
        <button class="cancel-btn" @click="cancelBets">{{$t("message.cancel")}}</button>
      </div>
    </div>
    <div class="alert-confirm-bets-wrap" id="bets-error-wrap" style="min-height:0" :style="betsError" v-show="showErrorNum">
      <h1 class="bets-title"><span>{{$t("message.errorNum")}}:</span></h1>
      <ul class="error-num-list">
        <li v-for="(item, i) in errorImportNum" :key="i">
          <span v-for="(n, ni) in item" :key="ni">{{n}}</span>
        </li>
      </ul>
      <div class="confirm-wrap">
        <button class="confirm-btn" @click="cancelBets" :disabled="isClick">{{$t("message.confirm")}}</button>
        <button class="cancel-btn" @click="cancelBets">{{$t("message.cancel")}}</button>
      </div>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
import paramCryptFn from '@/assets/js/cryptData'
import XLSX from 'xlsx'
import { setTimeout } from 'timers';
import { throws, ifError } from 'assert';
const localReg = /(^[0\.\W]+)|([\.\W]+)/g;
export default {
  name: 'lotteryDetail',
  components: {},
  props: {},
  data() {
    return {
      consoleFn: this.$store.state.consoleFn,
      moment: moment,

      isLogin: false,
      lotteryDisabled: false,

      showRuler: true,
      ruler: '',

      isMatch: false,

      showConfirm: false,
      showSuccess: false,

      isClick: false, // 重复提交

      lotteryName: '',
      lotteryName_th: '',
      issue: '',
      countDownTime: null,

      selected: false, // 是否关联
      searchNum: '',

      selectedPlay: [],

      key_lang: '', // 显示哪一种语言 的 key
      parent_key_lang: '', // 显示哪一种语言 的 key

      gameid: '',

      inputNum: '',
      totalCount: '',
      lotteryNumList: [],

      playKind: [], // 玩法
      kind_id: '',
      kind_name: '',
      kind_code: '',

      playTypeNav: [], // 类型
      play_id: '',
      play_name: '',
      
      copy_shoppingCart: [], // 购彩篮镜像，用来存储导入的投注号码
      errorImportNum: [], // 存放错误的导入号码
      showErrorNum: false,
      shoppingCart: [], // 购彩篮
      pushLength: 0,

      bets_wrap_w: '', // 投注区 宽度

      limited: [],
      one_min_money: 1, // 单注最小金额
      one_max_money: 100, // 单注最大金额
      one_max_bets: 100, // 单注最大注数

      prize: 300,
      discount: 0, // 折扣

      publicMoney: '', // 重设金额

      allMoney: 0, // 投注总金额

      betsTitle: new Array(10),
      betsNum: new Array(100),
      betsNumTitle: '0',

      myInterval: null,

      betsConfirm: {
        left: 0,
        top: 0
      },
      betsSuccess: {
        left: 0,
        top: 0
      },
      betsError: {
        left: 0,
        top: 0
      },
      userType: '', // 用户类型

      allLimit: [],
      importNumArr: []
    }
  },
  beforeDestroy() {},
  destroyed() {
    // console.log(123)
    const vm = this;
    clearInterval(vm.myInterval)
    sessionStorage.removeItem('candy-countDownTime');
  },
  computed: {
    getModelStatus() {
      return this.$store.state.betModel
    }
  },
  created() {
    let local_lang = this.$i18n.locale;
    if (local_lang === 'th') {
      this.key_lang = 'name_th';
      this.parent_key_lang = 'parent_th';
      this.lotteryName_th = this.$route.query.lotteryName_th;
    } else {
      this.key_lang = 'name_cn';
      this.parent_key_lang = 'parent_cn';
      this.lotteryName_th = this.$route.query.lotteryName;
    }
    this.$store.dispatch('setBetModel', false);
    // console.log(this.$router.query)
    this.isLogin = localStorage.getItem('candy-login') === 'true';
    this.userType = localStorage.getItem("candy-type");
    this.gameid = this.$route.query.id;
    this.issue = this.$route.query.issue;
    this.lotteryDisabled = this.$route.query.status==0;
    this.countDownTime = JSON.parse(sessionStorage.getItem('candy-countDownTime'));
    // this.countDownTime.min = this.countDownTime.min*1+2;
    this.lotteryName = this.$route.query.lotteryName;
    // sessionStorage.setItem("candy-query", JSON.stringify(this.$route.query));
    sessionStorage.setItem('th_tag_url', 'lotteryDetail');
    
    this.getLotteryNumListFn();
    // this.newIssueInterval();
    this.getLotteryDetail(local_lang);

    this.consoleFn(this.lotteryName, this.issue);
    this.getAllLimited();
  },
  mounted() {
    const vm = this;
    window.onresize = function (e) {
      vm.setAlertSize();
    }
    if(this.$route.query.orderid && !this.lotteryDisabled){
      this.getHistoryNum(this.$route.query.orderid)
    }
  },
  methods: {
    // 获取历史投注的订单号码
    getHistoryNum(id) {
      const vm = this;
      let data = {
        orderid: id
      };
      let url = '/user/lottery/order/detail';
      vm.$http.get(url, {
        params: data
      }).then(response => {
        let status = response.body.returncode;
        if (status) {
          if (status == 103 || status == 106 || status == 101) {
            this.$store.state.reLogin(this);
          } else if (status == 200) {
            let total = response.body.data.length;
            if (total) {
              vm.joinHistoryNumToShoppingCart(response.body.data)
            }
          }
        }
      }, response => {
      });
    },
    // 将历史号码添加到购彩篮
    joinHistoryNumToShoppingCart(historyNumArr) {
      // console.log(historyNumArr)
      const vm = this;
      let cart = [];
      this.pushLength = 0;
      let pushLen = this.pushLength;
      for(let i in historyNumArr){
        pushLen += 1;
        let num = historyNumArr[i].vote_no;
        let cash = historyNumArr[i].vote_cash;
        let discount = historyNumArr[i].vote_cash_discount;
        let play = historyNumArr[i].lotteryid;
        let prize = play.prize;
        let obj = {};
        var createObjJoinNum = function() {
          let obj = {
            kind_id: play.parentid, // 设置号码样式，是否是选中的
            kind_name: historyNumArr[i][vm.parent_key_lang],
            play_id: play._id,
            play_name: play[vm.key_lang],
            one_min_money: play.min_bet,
            one_max_money: play.max_bet,
            one_max_bets: play.max_bet,
            prize: prize,
            discount: discount,
            nums: []
          }
          obj.nums.push({
            num: num,
            money: cash,
            win: prize,
            discount: discount,
            number: pushLen
          });
          cart.push(obj)
        }
        if(cart.length !== 0){
          let obj = cart.filter(v => {return v.play_id === play._id});
          if(obj.length !== 0){
            obj[0].nums.push({
              num: num,
              money: cash,
              win: prize,
              discount: discount,
              number: pushLen
            });
          }else{
            createObjJoinNum();
          }
        }else{
          createObjJoinNum();
        }
      }
      this.pushLength = pushLen;
      this.shoppingCart = cart;
    },
    //
    getAllLimited() {
      this.$http.get('/game/limit', {
        params: {
          gameid: this.gameid,
          loginid: localStorage.getItem('candy-loginid')
        }
      }).then(res => {
        let code = res.body.returncode;
        if(code == 200){
          this.allLimit = res.body.data;
        }else{
          this.allLimit = [];
        }
        // console.log(res.body)
      }).then(err => {})
    },
    // 导入Excel
    handleImportText(e) {
      var files = e.target.files;
      if (files) {
        this.loadBetsFile(files)
        // this.loading = true;
        e.target.value = '';
      }
    },
    loadBetsFile(files) {
      var vm = this;
      if(files.length<=0){//如果没有文件名
        return false;
      }else if(!/\.(xls|xlsx)$/.test(files[0].name.toLowerCase())){
        alert(vm.$t("message.import_geshi_error"));
        return false;
      }
      this.pushLength = 0;
      this.importNumArr = [];
      this.errorImportNum = [];
      this.shoppingCart = [];
      this.copy_shoppingCart = [];
      const fileReader = new FileReader();
      fileReader.onload = (ev) => {
        try {
          var data = ev.target.result;
          data = new Uint8Array(data);
          // const workbook = XLSX.read(data, {
          //   type: 'array'
          // });
          // const wsname = workbook.SheetNames[0];//取第一张表
          // const ws = XLSX.utils.sheet_to_json(workbook.Sheets[wsname], { raw:true, header:1});//生成json表格内容
          // console.log(ws)
          var result = {};
          var workbook = XLSX.read(data, {type: 'array'});
          workbook.SheetNames.forEach(function(sheetName) {
            var roa = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {header:1});
            if(roa.length) result[sheetName] = roa;
          });
          let resultArr = [];
          for(let i in result){
            vm.importNumArr.push(...result[i])
          }
          setTimeout(() => {
            vm.formatImportNum()
          }, 100)
          // console.log(this.importNumArr)
          // // console.log(JSON.stringify(result, 2, 2));
        } catch (e) {
          return false;
        }
      };
      fileReader.readAsArrayBuffer(files[0]);
    },
    formatImportNum() {
      var vm = this;
      var arr = this.importNumArr;
      let isError = false;
      arr.forEach(item => {
        // console.log(item)
        if(item.length!=0){
          if(item.length>3){
            isError = true;
            return;
          }else{
            let val = item[0];
            // let tag = item[1], moeny = item[2];
            // if(!val || !tag || !moeny){
            //   isError = true;
            //   return
            // }
            if(isNaN(val)){
              isError = true;
              return;
            }
          }
        }
      })
      if(isError){
        alert(vm.$t("message.delete_row_cos"));
        return false;
      }
      var t1 = '=', t2 = ':', t3 = '-', t4 = '\/';
      // 投注号码总共三列， 分为 号码 标识 金额
      // 号码有 三位，两位，一位
        // 三位 各不相同 两个相同 全部相同
        // 两位 各不相同 全部相同
      // 标识分为4种 '='，上三位; ':'，下三位; '-'：两位; '/'，跑位; 注: 每种大玩法 都各有两个小玩法
      // 金额类型 如: A,20*20 或者 B,0*20 或者 C,20 或者 D,20*20*20 注: 自定义 为 E 的时候，说明格式不对 / 新增 F,20*20*20*20*20*20 3个数字全排列的号码 3个数字都不相同
        // A 代表当前 玩法 的 两个 不同小玩法，如 正三位，反三位
        // B 代表当前 玩法 的 最后 一个小玩法，如 反三位
        // C 代表当前 玩法 的 第一个 小玩法， 如 正三位
        // D 为特殊金额，只有在 大玩法 上三位>正三位 中会出现 并且 三个号码中 有两个相同 代表 当前号码 的不同排列 各 投一注
      // uid 玩法的uid，用来标识玩法
      var uid = {
        zsw: 'thailotto.upthree.upper', // 正三位
        fsw: 'thailotto.upthree.counter', // 反三位
        gw: 'thailotto.lowthree.upper', // 高位
        dw: 'thailotto.lowthree.counter', // 低位
        slw: 'thailotto.two.upper', // 上两位
        xlw: 'thailotto.two.lower', // 下两位
        psw: 'thailotto.run.upper', // 跑三位
        plw: 'thailotto.run.lower' // 跑两位
      }
      // 判断是否为合法的 金额
      var testCash = function(cash) {
        let ok = false;
        if(!isNaN(Number(cash)) && cash.indexOf('.')<0 && cash.indexOf('-')<0){
          ok = true;
        }
        return ok
      }
      
      // 判断当前的金额 属于哪一种 类型
      var moneyType = function(money, val) {
        let type = 'E', cash;
        let upCash, lowCash;
        if (money.length === 1) {
          upCash = money[0];
          if(testCash(upCash) && upCash !== '0'){
            type = 'C';
          }
        }
        if (money.length === 2) {
          let cash1 = money[0], cash2 = money[1];
          if(testCash(cash1) && testCash(cash2) && cash2 !== '0'){
            if(cash1 == '0'){
              type = 'B';
              lowCash = cash2;
            }else{
              type = 'A';
              upCash = cash1;
              lowCash = cash2;
            }
          }
        }
        if (money.length === 3) {
          let cash = money[0];
          let ok = false;
          if(testCash(cash) && cash !== '0'){
            ok = money.every(n => { return n === cash})
          }
          if(ok){
            type = 'D';
            upCash = cash;
          }
        }
        if (money.length === 6 && val.length === 3) {
          let cash = money[0];
          let ok = false;
          if(testCash(cash) && cash !== '0'){
            ok = money.every(n => { return n === cash})
          }
          if(ok){
            var s = val[0], c = val[1], e = val[2];
            if(s !== c && s !== e && c !== e){
              type = 'F';
              upCash = cash;
            }
          }
        }
        if(type === 'D'){
          // D 类型的投注号码 只能为 3位数字，而且必须有两个数字相同，却不能三个数字都相同。如：121 112
          if(val.length !== 3){
            type = 'E';
          }else{
            var s = val[0], c = val[1], e = val[2];
            if(s === c && s === e && c === e){
              type = 'E';
            }else if(s !== c && s !== e && c !== e){
              type = 'E';
            }
          }
        }
        if(val.length === 3){
          var s = val[0], c = val[1], e = val[2];
          if(s === c && s === e && c === e){
            if(money.length === 1){
              upCash = money[0];
              if(testCash(upCash) && upCash !== '0'){
                type = 'C';
              }else{
                type = 'E'
              }
            }else{
              type = 'E';
            }
          }
        }
        // if(val.length === 2){
        //   var s = val[0], e = val[1];
        //   if(s === e){
        //     if(money.length === 1){
        //       upCash = money[0];
        //       if(testCash(upCash) && upCash !== '0'){
        //         type = 'C';
        //       }else{
        //         type = 'E'
        //       }
        //     }else{
        //       type = 'E';
        //     }
        //   }
        // }
        return {type, upCash, lowCash};
      }
      // 获取 当前号码 的 玩法 选项
      var playOption = function(uid, val, cash, full = false) {
        let play;
        for(let i=0; i<vm.allLimit.length; i++){
          let item = vm.allLimit[i];
          if(item.uid === uid){
            play = item;
            break
          }
        }
        let data = {};
        try{
          data.play_id = play._id;
          data.kind_id = play.parentid;
          data.play_name = play[vm.key_lang];
          data.one_min_money = play.min_bet;
          data.one_max_money = play.max_bet;
          data.one_max_bets = play.max_bet;
          data.prize = play.prize;
          data.discount = play.discount || 0;
        }catch(e){}
        vm.importNumAddToShop(data, val, cash, full);
      }
      arr.forEach(item => {
        if(item.length===0){
          return false;
        }
        let val = item[0].toString();
        var tag = item[1], money = item[2].toString().split('*');
        let {type, upCash, lowCash} = moneyType(money, val);
        if(type === 'E' || val.length > 3){
          this.errorImportNum.push(item)
        }else{
          if (tag === t1) {
            if (type === 'A') {
              playOption(uid.zsw, val, upCash);
              playOption(uid.fsw, val, lowCash);
            }
            if (type === 'B') {
              playOption(uid.fsw, val, lowCash);
            }
            if (type === 'C') {
              playOption(uid.zsw, val, upCash);
            }
            if (type === 'D') {
              playOption(uid.zsw, val, upCash, true);
            }
            if (type === 'F') {
              playOption(uid.zsw, val, upCash, true);
            }
          } else if (tag === t2) {
            if (type === 'A') {
              playOption(uid.gw, val, upCash);
              playOption(uid.dw, val, lowCash);
            }
            if (type === 'B') {
              playOption(uid.dw, val, lowCash);
            }
            if (type === 'C') {
              playOption(uid.gw, val, upCash);
            }
          } else if (tag === t3) {
            if (type === 'A') {
              playOption(uid.slw, val, upCash);
              playOption(uid.xlw, val, lowCash);
            }
            if (type === 'B') {
              playOption(uid.xlw, val, lowCash);
            }
            if (type === 'C') {
              playOption(uid.slw, val, upCash);
            }
          } else if (tag === t4) {
            if (type === 'A') {
              playOption(uid.psw, val, upCash);
              playOption(uid.plw, val, lowCash);
            }
            if (type === 'B') {
              playOption(uid.plw, val, lowCash);
            }
            if (type === 'C') {
              playOption(uid.psw, val, upCash);
            }
          }else{
            this.errorImportNum.push(item)
          }
        }
      })
      if(this.errorImportNum.length>0){
        this.showErrorNum = true;
        this.$nextTick(() => {
          this.setAlertSize();
        })
      }else{
        this.shoppingCart = this.copy_shoppingCart;
      }
    },
    importNumAddToShop(option, val, cash, full) {
      let pushLen = this.pushLength;
      let nums = [];
      let isFind = false;
      this.copy_shoppingCart.filter(shop => {
        if(shop.play_id === option.play_id){
          isFind = true;
          nums = shop.nums;
        }
      })
      if(!isFind){
        let obj = {
          kind_id: option.kind_id,
          // kind_name: this.kind_name,
          play_id: option.play_id,
          play_name: option.play_name,
          one_min_money: option.one_min_money,
          one_max_money: option.one_max_money,
          one_max_bets: option.one_max_bets,
          prize: option.prize,
          discount: option.discount,
          nums: []
        }
        if(full){
          let numArr = this.groupSelectNum(val);
          numArr.filter(n => {
            pushLen++
            obj.nums.push({
              num: n,
              money: cash,
              win: option.prize,
              discount: option.discount,
              number: pushLen
            });
          })
        }else{
          pushLen++
          obj.nums.push({
            num: val,
            money: cash,
            win: option.prize,
            discount: option.discount,
            number: pushLen
          });
        }
        this.copy_shoppingCart.push(obj)
      }else{
        if(full){
          this.isAllInArr(nums, val, false, false, cash);
        }else{
          let index = -1;
          nums.filter((v, i) => {
            if (v.num == val) {
              index = i;
            }
          })
          if(index < 0){
            pushLen++
            nums.push({
              num: val,
              money: cash,
              win: option.prize,
              discount: option.discount,
              number: pushLen
            });
          }else{
            nums[index].money = (nums[index].money*1)+(cash*1)
          }
        }
      }
      this.pushLength = pushLen;
    },
    newIssueInterval() {
      const vm = this;
      this.$http.get('/lottery/latest/issue', {
        params: {
          gameid: this.gameid,
          preIssue: 1
        }
      }).then(res => {
        // console.log(res)
      }).then(err => {})
    },
    // 设置用户名*显示
    setUserName(name) {
      let str = name.slice(0, 2) + name.slice(2, name.length-2).replace(/./g,'*') + name.slice(name.length-2);
      return str;
    },
    formatTime1(row, column, cellValue) {
      return moment(cellValue).format("DD-MM-YYYY HH:mm:ss");
    },
    //格式化 时分秒
    formatTimeFn(time) {
      let t;
      if (time < 10) {
        t = '0' + time;
      } else {
        t = time;
      }
      return t;
    },
    // 开始计时
    startTime() {
      const vm = this;
      let {
        hour,
        min,
        sec
      } = this.countDownTime;
      if(hour === 0 && min === 0 && sec === 0){
        return false;
      }
      this.myInterval = setInterval(() => {
        sec--;
        if (sec < 0 && min > 0) {
          min--;
          sec = 59;
        } else if (min <= 0 && hour > 0) {
          hour--;
          min = 59;
          sec = 59;
        }
        if (hour === 0 && min === 0 && sec === 0) {
          clearInterval(vm.myInterval)
          // clearInterval(vm.myInterval);
          // vm.getNewIssue();
        }
        vm.countDownTime = {
          hour,
          min,
          sec
        };
        sessionStorage.setItem('candy-countDownTime', JSON.stringify(this.countDownTime))
      }, 1000)
    },
    isPlayIdSame(play) {
      let isExist = false;
      this.selectedPlay.filter(v => {
        if(v.play_id === play.play_id){
          isExist = true;
        }
      })
      return isExist;
    },
    // 选中号码的样式
    setSelectedNumStyle(val) {
      let style = '';
      let kind_same = false,
        play_same = false,
        num_same = false;
      for (let shop in this.shoppingCart) {
        let v = this.shoppingCart[shop];
        for (let i in v.nums) {
          if (v.nums[i].num == val) {
            num_same = true;
            play_same = this.isPlayIdSame(v);
            kind_same = v.kind_id === this.kind_id;
            break;
          }
        }
        if (kind_same && play_same && num_same) {
          style = 'active';
          break;
        }
      }
      // this.consoleFn(kind_same, play_same, num_same, style)
      return style;
    },
    // 选择投注号码 的 位数， 000,100,200
    selectBetsNumTitle(i) {
      this.betsNumTitle = i;
    },
    // 渲染 投注的号码 001,002,003
    randerBetsNym(i, type) {
      let num;
      if (type === 'three') {
        if (this.betsNumTitle == 0) {
          num = i < 10 ? '00' + i : '0' + i
        } else {
          num = Number(100 * this.betsNumTitle) + Number(i)
        }
      } else if (type === 'two') {
        num = i < 10 ? '0' + i : i
      } else if (type === 'run') {
        num = i
      }
      return num.toString()
    },
    groupSelectNum(val) {
      let arr = [];
      let newArr = [];
      if(val.length === 1){
        arr.push(val);
      }
      if(val.length === 2){
        let s = val[0];
        let e = val[1];
        arr.push(
          [s, e].join(''), [e, s].join('')
        )
      }
      if(val.length === 3){
        let s = val[0];
        let c = val[1];
        let e = val[2];
        arr.push(
          [s, c, e].join(''), [s, e, c].join(''), [c, s, e].join(''), [c, e, s].join(''), [e, s, c].join(''), [e, c, s].join('')
        )
      }
      for(let i in arr){
        if(newArr.indexOf(arr[i]) < 0){
          newArr.push(arr[i])
        }
      }
      // debugger
      return newArr
    },
    // 当前的号码组合是否都存在，是 删除所有存在项，否 添加未存在项
    isAllInArr(nums, val, isRowCol, isRun, cash) {
      let pushLen = this.pushLength;
      let money = cash || nums[0].money;
      let win = nums[0].win;
      let discount = nums[0].discount;
      let numArr = this.groupSelectNum(val);
      let selectNumArr = [];
      let indexArr = [];
      nums.filter(n => {
        selectNumArr.push(n.num);
      })
      numArr.filter(num => {
        indexArr.push(selectNumArr.indexOf(num));
      })
      let allExist = indexArr.every(n => (n>-1));
      // console.log(nums, money, win, numArr, selectNumArr, indexArr, allExist)
      if(allExist){
        for(let i=nums.length-1; i>=0; i--){
          let n = nums[i].num;
          if(numArr.indexOf(n) > -1){
            if(isRowCol){
              if(isRun){
                nums.splice(i, 1)
              }
            }else{
              nums.splice(i, 1)
            }
          }
        }
      }else{
        if(!isRowCol){
          for(let i in indexArr){
            if(indexArr[i] < 0){
              pushLen++
              nums.push({
                num: numArr[i],
                money: money,
                win: win,
                discount: discount,
                number: pushLen
              })
            }
          }
        }else{
          pushLen++
          nums.push({
            num: val,
            money: money,
            win: win,
            discount: discount,
            number: pushLen
          })
        }
      }
      this.pushLength = pushLen;
      // return nums;
    },
    selectBetsTwoNumTitle(num, type) {
      if(type === 'and'){
        for(let i=0; i<10; i++){
          let val = num+''+i;
          this.selectedNumFn(val, true);
        }
        for(let i=0; i<10; i++){
          let val = i+''+num;
          this.selectedNumFn(val, true);
        }
      }
      if(type === 'row'){
        for(let i=0; i<10; i++){
          let val = num+''+i;
          this.selectedNumFn(val, true);
        }
      }
      if(type === 'col'){
        for(let i=0; i<10; i++){
          let val = i+''+num;
          this.selectedNumFn(val, true);
        }
      }
    },
    // 选中投注号码
    selectedNumFn(val, isRowCol=false, isRun=false, selected = false) {
      this.consoleFn(this.kind_name, this.kind_id, this.play_name, this.play_id);
      let pushLen = this.pushLength;
      let len = this.shoppingCart.length;
      let selectedPlay = this.selectedPlay; // 选中的玩法
      let shoppingCart = this.shoppingCart; // 购彩篮
      // 是否开启关联号码 即 号码是否 全排列
      let full = selected ? selected : this.selected;
      // isRowCol 点击的是否是 两位玩法里面的 title，row+col / row / col
      // 是，只添加，不删除
      // isRun 点击的是否是 跑位 玩法的 数字
      // 是，不计算 关联 数字
      // 获取 购彩篮中 当前所选中的玩法的 投注号码 集合
      let nums = [];
      for(let i in selectedPlay){
        let c_play = selectedPlay[i];
        let isFind = false;
        let shopNums = [];
        for(let j in shoppingCart){
          let shop = shoppingCart[j];
          if(shop.play_id === c_play.play_id){
            isFind = true;
            shopNums = shop.nums;
          }
        }
        if(isFind){
          nums.push({
            c_play: c_play,
            nums: shopNums
          })
        }else{
          nums.push({
            c_play: c_play,
            nums: []
          })
        }
      }
      let existNum = 0;
      nums.filter(v => {
        v.nums.filter(nv => {
          if(nv.num == val){
            existNum ++
          }
        })
      })
      if(nums.length === 0){
        // 购彩没有当前玩法
        for(let i in selectedPlay){
          let v = selectedPlay[i];
          let obj = {
            kind_id: this.kind_id,
            kind_name: this.kind_name,
            play_id: v.play_id,
            play_name: v.play_name,
            one_min_money: v.one_min_money,
            one_max_money: v.one_max_money,
            one_max_bets: v.one_max_bets,
            prize: v.prize,
            discount: v.discount,
            nums: []
          }
          // debugger
          if(full && !isRowCol){ // 是否开启 号码关联
            let numArr = this.groupSelectNum(val);
            numArr.filter(n => {
              pushLen++
              obj.nums.push({
                num: n,
                money: v.one_min_money,
                win: v.prize,
                discount: v.discount,
                number: pushLen
              });
            })
            // debugger
            this.shoppingCart.push(obj);
            // break;
          }else{
            pushLen++
            obj.nums.push({
              num: val,
              money: v.one_min_money,
              win: v.prize,
              discount: v.discount,
              number: pushLen
            });
            // debugger
            this.shoppingCart.push(obj);
            // break;
          }
        }
      }else if(existNum == nums.length){
        // 说明 都存在当前选中的号码，那就要删除
        nums.filter(v => {
          if(full){
            // debugger
            this.isAllInArr(v.nums, val, isRowCol, isRun);
          }else{
            if(!isRowCol){
              for(let i=v.nums.length-1; i>=0; i--){
                if(v.nums[i].num == val){
                  v.nums.splice(i, 1)
                }
              }
            }
          }
        })
      }else{
        // 否则，对于未存在当前号码的数组，要添加
        nums.filter(v => {
          let count = 0;
          v.nums.filter(nv => {
            if(nv.num != val){
              count ++
            }
          })
          if(count == v.nums.length){
            // 当前项不存在 当前选中的号码
            //v.nums.push()
            if(full && !isRowCol){
              // debugger
              let numArr = this.groupSelectNum(val);
              numArr.filter(n => {
                pushLen++
                v.nums.push({
                  num: n,
                  money: v.c_play.one_min_money,
                  win: v.c_play.prize,
                  discount: v.c_play.discount,
                  number: pushLen
                });
              })
            }else{
              // debugger
              pushLen++
              v.nums.push({
                num: val,
                money: v.c_play.one_min_money,
                win: v.c_play.prize,
                discount: v.c_play.discount,
                number: pushLen
              });
            }
          }else{
            // 需要再次判断 当前是否需要全排列，如果是，当前数组 是否存在 改号码的 全排列号码
            if(full && !isRowCol){
              // debugger
              let numArr = this.groupSelectNum(val);
              numArr.filter(n => {
                pushLen++
                v.nums.push({
                  num: n,
                  money: v.c_play.one_min_money,
                  win: v.c_play.prize,
                  discount: v.c_play.discount,
                  number: pushLen
                });
              })
            }
          }
        })
      }
      
      for(let i in nums){
        let c_play = nums[i].c_play;
        let isFind = false;
        let shopNums = [];
        for(let j in shoppingCart){
          let shop = shoppingCart[j];
          if(shop.play_id === c_play.play_id){
            isFind = true;
            shop.nums = nums[i].nums;
          }
        }
        if(!isFind){
          let obj = {
            kind_id: this.kind_id,
            kind_name: this.kind_name,
            play_id: c_play.play_id,
            play_name: c_play.play_name,
            one_min_money: c_play.one_min_money,
            one_max_money: c_play.one_max_money,
            one_max_bets: c_play.one_max_bets,
            prize: c_play.prize,
            discount: c_play.discount,
            nums: nums[i].nums
          }
          shoppingCart.push(obj)
        }
      }
      shoppingCart.filter(shop => {
        let numsArr = []; // 购彩篮 每一项的nums 的集合
        let arr = []; // 每一项 nums 里num 的集合
        shop.nums.filter(n => {
          if(arr.indexOf(n.num) < 0){
            arr.push(n.num);
            numsArr.push(n);
          }
        })
        shop.nums = numsArr;
      })
      this.pushLength = pushLen;
    },
    // 计算总钱数
    countAllMoneyFn() {
      let money = 0;
      this.shoppingCart.filter(v => {
        // console.log(v.nums.money)
        v.nums.filter(k => {
          money += Number(k.money)
        })
      })
      return money;
    },
    discountMoneyFn() {
      let money = 0;
      // let discount = 0;
      this.shoppingCart.filter(v => {
        // console.log(v.nums.money)
        v.nums.filter(k => {
          money += Number(k.money)*(v.discount/100)
        })
      })
      return money;
    },
    realyMoneyFn() {},
    // 手动输入 单个 钱数
    handleInputSingleMoney(item, e) {
      item.money = e.target.value
    },
    // 失焦 判断
    handleLeaveSingleInput(option, item) {
      // console.log(option)
      let money = item.money.toString().replace(localReg, '');
      let one_min_money = option.one_min_money;
      let one_max_money = option.one_max_money;
      if(money == ''){
        item.money = one_min_money;
      }else{
        if(isNaN(money)){
          item.money = one_min_money;
        }else{
          if(money > one_max_money){
            item.money = one_max_money;
          }else{
            item.money = money;
          }
        }
      }
      // isNaN(money) ? item.money = this.one_min_money : item.money = money;
    },
    // 设置所有的 单个 钱数
    handleInputMoney(e) {
      this.publicMoney = e.target.value;
      this.shoppingCart.filter(v => {
        v.nums.filter(k => {
          k.money = this.publicMoney
        })
      })
    },
    // 设置所有的 单个 钱数 失焦 判断
    handleLeaveMoney(e) {
      if (this.publicMoney != '') {
        let money = this.publicMoney.toString().replace(localReg, '');
        this.shoppingCart.filter(v => {
          v.nums.filter(k => {
            this.handleLeaveSingleInput(v, k)
            // k.money = this.publicMoney
          })
        })
        this.publicMoney = e.target.value = '';
      }
    },
    // 删除号码
    deleteNum(obj, i, o) {
      obj.nums.splice(i, 1);
      if (obj.nums.length === 0) {
        this.shoppingCart.splice(o, 1)
      }
    },
    //
    handleInputFocus() {
      if(isNaN(this.inputNum) || this.inputNum.length != 5){
        this.isMatch = true;
      }else{
        this.isMatch = false;
      }
    },
    handleInputNumFn() {
      if(isNaN(this.inputNum) || this.inputNum.length != 5){
        this.isMatch = true;
      }else{
        this.isMatch = false;
      }
    },
    // 添加lottery号码
    addLotteryNumFn() {
      const vm = this;
      let {
        hour,
        min,
        sec
      } = this.countDownTime;
      if (!this.isLogin) {
        var isOk = confirm(vm.$t("message.chong_xin_deng_lu"))
        if(isOk){
          this.$router.push({
            name: 'login'
          })
        }
        // alert('请登录')
        return false;
      }
      if (hour == 0 && min <= 2 && sec == 0) {
        alert(vm.$t("message.qi_hao_guo_qi"))
        return false
      }
      if(this.isMatch){
        return false;
      }
      if(!this.inputNum){
        return false;
      }
      this.isClick = true;
      this.$http.post('/ssc/serial/create', {
        gameid: this.gameid,
        issue_no: this.issue,
        serial_no: this.inputNum
      }).then(res => {
        this.isClick = false;
        this.inputNum = '';
        this.getLotteryNumListFn();
        // this.consoleFn(res)
      }).then(err => {
        if(err){
          this.isClick = false;
        }
      })
    },
    // 获取 号码列表
    getLotteryNumListFn() {
      this.$http.get('/ssc/serial/list', {
        params: {
          gameid: this.gameid,
          issue_no: this.issue
        }
      }).then(res => {
        if(res.data.returncode == 200){
          this.lotteryNumList = res.data.data;
          this.totalCount = res.data.sum;
        }else{
          this.lotteryNumList = [];
          this.totalCount = '0';
        }
        this.consoleFn(res)
      }).then(err => {})
    },
    changeRuler() {
      this.showRuler = true;
      this.kind_id = '';
    },
    // 选择 彩票类型 三位，两位，跑位
    changePlayKind(kind) {
      this.showRuler = false;
      this.selectedPlay = [];
      this.kind_id = kind._id;
      this.kind_name = kind[this.key_lang];
      this.kind_code = kind.code;
      this.matchData(kind._id);

      this.consoleFn(kind, this.kind_name, kind.code)
    },
    setPlayTitleClass(play) {
      let isExist = false;
      this.selectedPlay.filter(v => {
        if(v.play_id === play._id){
          isExist = true;
        }
      })
      return isExist;
    },
    // 选择 玩法：正三位，反三位
    changePlayType(play) {
      let index;
      this.selectedPlay.filter((v, vi) => {
        if(v.play_id === play._id){
          index = vi;
        }
      })
      if(index > -1){
        this.selectedPlay.splice(index, 1);
      }else{
        let data = {};
        data.play_id = play._id;
        data.kind_id = this.kind_id;
        data.play_name = play[this.key_lang];
        data.one_min_money = play.min_bet;
        data.one_max_money = play.max_bet;
        data.one_max_bets = play.max_bet;
        data.prize = play.prize;
        data.discount = play.discount || 0;
        this.selectedPlay.push(data);
      }
      // console.log(play, this.selectedPlay)
    },
    // 获取投注限制，最小金额，最大金额，奖金
    getBetsLimit(id) {
      this.$http.get('/lottery/limited/gameid', {
        params: {
          lotteryid: id,
          loginid: localStorage.getItem('candy-loginid')
        }
      }).then(res => {
        let code = res.data.returncode;
        let data = res.data.data;
        if (code == 200) {
          this.limited = data;
          this.one_min_money = data[0].min_bet;
          this.one_max_money = data[0].max_bet;
          this.one_max_bets = data[0].max_bet;
          this.prize = data[0].prize;
          this.discount = data[0].discount || 0;
        }
        this.consoleFn(res)
      }).then(err => {})
    },
    // 获取彩票内容
    getLotteryDetail(local_lang) {
      this.startTime();
      this.$http.get('/lottery/detail', {
        params: {
          gameid: this.gameid
        }
      }).then(res => {
        let code = res.data.returncode;
        if (code == 200) {
          this.playKind = res.data.data;
          this.kind_id = res.data.data.children[0]._id;
          this.kind_name = res.data.data.children[0][this.key_lang];
          this.kind_code = res.data.data.children[0].code;
          if(this.$route.query.orderid && !this.lotteryDisabled){
            this.changePlayKind(this.playKind.children[0])
          }
          if(local_lang === 'th'){
            this.ruler = res.data.data.rule_th.replace(/\<img/g, '<img class="ruler-img"');
            // this.ruler = res.data.data.rule_th;
          }else{
            this.ruler = res.data.data.rule_cn;
          }
          // this.matchData(this.kind_id)
        }
        this.consoleFn(res.data)
      }).then(err => {
        this.consoleFn(err)
      })
    },
    // 匹配需要的相应数据；
    matchData(kind_id) {
      this.playKind.children.filter(v => {
        if (v._id === kind_id) {
          this.playTypeNav = v.children;
          this.play_id = v.children[0]._id;
          this.play_name = v.children[0][this.key_lang];
          this.getBetsLimit(kind_id)
        }
      })
    },
    // 投注
    toBets() {
      const vm = this;
      let {
        hour,
        min,
        sec
      } = this.countDownTime;
      if (!this.isLogin) {
        var isOk = confirm(vm.$t("message.chong_xin_deng_lu"))
        if(isOk){
          this.$router.push({
            name: 'login'
          })
        }
        // alert('请登录')
        return false;
      }
      if (hour == 0 && min <= 2 && sec == 0) {
        alert(vm.$t("message.qi_hao_guo_qi"))
        return false
      }
      if (this.shoppingCart.length === 0) {
        return false;
      }
      if (Number(localStorage.getItem('candy-cash')) === 0) {
        alert(vm.$t("message.yu_e_bu_zu"))
        return false;
      }
      this.$store.dispatch('setBetModel', true);
      this.showConfirm = true;
      this.$nextTick(() => {
        this.consoleFn(window.innerWidth, window.innerHeight, document.getElementsByClassName('bet-success'))
        this.setAlertSize();
      })
    },
    setAlertSize() {
      // let el = document.getElementsByClassName('alert-confirm-bets-wrap')[0];
      // betsConfirm betsSuccess betsError
      const vm = this;
      var setEleSize = function(id, param) {
        let el = document.getElementById(id);
        try {
          let left = window.innerWidth / 2 - 520 / 2;
          let top = (window.innerHeight - el.offsetHeight) / 2;
          left = left < 0 ? 0 : left;
          top = top < 0 ? 0 : top;
          vm[param].left = left + 'px';
          vm[param].top = top + 'px';
        } catch (error) {}
        document.getElementById('app').appendChild(el)
      }
      setEleSize('confirm-bets-wrap', 'betsConfirm')
      setEleSize('bets-success-wrap', 'betsSuccess')
      setEleSize('bets-error-wrap', 'betsError')
    },
    clearShoppingcar() {
      this.shoppingCart = [];
      this.pushLength = 0;
    },
    // 确认投注
    confirmBets() {
      let votelist = [];
      this.shoppingCart.filter(v => {
        v.nums.filter((n, ni) => {
          let vote = {
            lotteryid: v.play_id,
            vote_no: n.num,
            vote_cash_discount: Number(n.money*(1-(v.discount/100))).toFixed(2),
            vote_cash: n.money,
            number: n.number
          }
          votelist.push(vote);
        })
      })
      let data = {
        voteList: votelist,
        gameid: this.gameid,
        issue_no: this.issue
      }
      // console.log(data);
      // return false;
      this.isClick = true;
      this.$http.post('/lottery/issue/vote', paramCryptFn(data), {
        headers: {
          authorization: localStorage.getItem('candy-token')
        }
      }, {
        emulateJSON: true
      }).then(res => {
        this.showConfirm = false;
        this.isClick = false;
        let code = res.data.returncode;
        if (code == 200) {
          localStorage.setItem('candy-cash', res.data.data.cash.toFixed(2));
          this.$store.dispatch('setCash', res.data.data.cash)
          this.clearShoppingcar();
          this.showSuccess = true;
          this.$nextTick(() => {
            this.setAlertSize();
          })
        } else if (code == 103 || code == 106 || code == 101) {
          this.$store.dispatch('setBetModel', false);
          this.$store.state.reLogin(this);
          // alert('请登录')
          return false;
        } else if (code === 304) {
          this.$store.state.message(this.$t("message.yu_e_bu_zu"), 'error', 1500, this);
          this.$store.dispatch('setBetModel', false);
        } else if (code === 301) {
          this.$store.state.message(this.$t("message.can_shu_cuo_wu"), 'error', 1500, this);
          this.$store.dispatch('setBetModel', false);
        } else if (code === 302 || code === 303) {
          this.betsFail302(res.data.data, code)
        } else if (code === 305) {
          this.$store.state.message(this.$t("message.qi_hao_guo_qi"), 'error', 1500, this);
          this.$store.dispatch('setBetModel', false);
        } else if (code === 500) {
          this.$store.state.message(this.$t("message.server_cuo_wu"), 'error', 1500, this);
          this.$store.dispatch('setBetModel', false);
        }
        this.consoleFn(res)
      }).then(err => {
        if(err){
          this.isClick = false;
          this.showConfirm = false;
          this.$store.dispatch('setBetModel', false);
        }
      })
      // this.consoleFn(this.shoppingCart, votelist)
      // this.$store.dispatch('setBetModel', false);
    },
    // 取消投注
    cancelBets() {
      this.isClick = false;
      this.showConfirm = false;
      this.showSuccess = false;
      this.showErrorNum = false;
      this.$store.dispatch('setBetModel', false);
    },
    // 投注 数 超过设定 302 
    betsFail302(data, code) {
      let vote_no, vote_cash, voted_amount, total_bet;
      if(code === 302){
        vote_no = data.vote_no;
        vote_cash = data.vote_cash;
        voted_amount = data.voted_amount;
        total_bet = data.total_bet;
      }else{
        vote_no = data.vote_no;
        vote_cash = data.vote_cash;
        voted_amount = data.sum;
        total_bet = data.all_bet;
      }
      let txt = '';
      if(this.$i18n.locale === 'th'){
        txt = 'หมายเลข '+vote_no+' ปัจจุบันได้รับยอดแทงทั้งหมด '+(voted_amount-vote_cash)+'บาทเเล้ว รวมกับยอดแทงของท่านรอบนี้ '+vote_cash+'บาท รวมเป็น '+voted_amount+'บาท เกินยอดแทง '+total_bet+' ที่เว็บกำหนด';
      }else{
        txt = 'Number '+vote_no+', rounding the previous round, already stabbed '+(voted_amount-vote_cash)+' plus this round, '+vote_cash+' is '+voted_amount+', you bet the price over which the system is set to '+total_bet;
      }
      this.$alert(txt, 'Error', {
        confirmButtonText: 'Confirm',
        type: 'error',
        center: true,
        callback: action => {
          this.$store.dispatch('setBetModel', false);
        }
      });
    },
  },
}

</script>
<style lang="scss">

.ruler-img{
  width:100%;
  max-width:800px;
}
</style>

<style lang="scss" scoped>
  .lottery-detail {
    width: 100%;
    background: #EFEFEF;
    padding: 60px 0;
    color: #191919;

    .lottery-detail-wrap {
      // max-width:1200px;
      padding: 0 15px;
      width: 100%;
      margin: 0 auto;
      .play-kind-wrap{
        padding: 0 15px;
      }
      .play-kind {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        background: #FFFFFF;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.20);

        li {
          width: 176px;
          height: 50px;
          padding: 10px 0;
          font-size: 14px;
          cursor: pointer;

          span {
            display: block;
            text-align: center;
            line-height: 30px;
            border-right: 1px solid #D0D0D0;
          }

          &:last-child {
            span {
              border-right: none;
            }
          }
        }

        li.active {
          color: #fff;
          background-image: linear-gradient(-180deg, #7C7C7C 0%, #464646 100%);

          span {
            border-right: none;
          }
        }
      }
      .ruler-inner{
        margin-top:20px;
        padding:0 15px;
        >div{
          background:#fff;
          padding:20px;
          text-align:left;
        }
      }
      .lottery-box{
        // width:70%;
        // padding: 0 15px;
        // float:left;
        margin-bottom:30px;
        .inner-box{
          width:100%;
          background:#fff;
          display:table;
        }
        .box-left, .box-right{
          padding:20px;
          width:50%;
          float:left;
        }
        .inner-left{
          width:100%;
          table{
            width:100%;
            border-collapse: collapse;
            // border: 1px solid #DDD;
          }
          td{
            padding:8px;
            border: 1px solid #DDD;
          }
          tr.success{
            td{
              background-color: #dff0d8;
            }
          }
          tr{
            &:nth-of-type(odd){
              background-color: #f9f9f9;
            }
          }
        }
        .inner-right{
          width:100%;
          .top{
            margin-top:40px;
            display:-webkit-box;
            -webkit-box-orient:vertical;
            -webkit-box-pack:center;
            -webkit-box-align:center;
            p{
              display:block;
              color:#000;
              margin-top:5px;
              margin-bottom:10px;
            }
            .inner-title{
              font-size: 20px;
              color: #ed5565;
            }
            .inner-countdown{
              font-size: 42px;
              color: #ed5565;
              margin-bottom:30px;
            }
            .inner-lottery-txt{
              font-size: 24px;
            }
            .inner-lottery-num{
              font-size: 62px;
            }
          }
          .bot{
            display:-webkit-box;
            -webkit-box-orient:vertical;
            -webkit-box-pack:center;
            -webkit-box-align:center;
            input,button{
              display:block;
              width:100%;
              outline: none;
              border:none;
              border-radius:2px;
            }
            input{
              font-size: 20px;
              border:1px solid;
              border-color: #1ab394;
              height: 46px;
              padding: 6px 12px;
              color:#000;
              font-size:20px;
              margin-bottom:15px;
              text-align:center;
            }
            .has-error{
              border-color: #ed5565;
              color: #ed5565;
            }
            button{
              background-image: linear-gradient(#338aa7, #256378);
              border-color: #256378 #256378 hsl(0, 69%, 15%);
              color: #fff;
              text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.19);
              padding: 10px 16px;
              font-size: 18px;
              line-height: 1.3333333;
              margin-top:5px;
            }
          }
        }
      }
      .bets-wrap {
        width: 100%;
        display: table;
        // display:flex;
        // flex-wrap:wrap;
        margin-top: 30px;
        
         @media screen and (max-width: 768px) {
          .lottery-box{
            .box-left, .box-right{
              width:100%;
            }
          }
        }
        .bets-area-wrap{
          width:70%;
          padding: 0 15px;
          float: left;
        }
        .shopping-cart-wrap{
          width:30%;
          padding: 0 15px;
          float: right;
        }
        .bets-area {
          padding-top: 20px;
          padding-bottom: 10px;
          background: #FFFFFF;
          box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.20);
          .search-bets-number-wrap{
            width:100%;
            padding:20px;
            padding-top:0;
            text-align:right;
            .search-num{
              width:160px;
              height:36px;
              border:1px solid #ccc;
              padding:0 15px;
              &:focus{
                border-color:#1ab394;
              }
            }
            .search-num-btn{
              width:80px;
              height:36px;
              border:1px solid #ccc;
              background:#fff;
              color:#000;
              cursor: pointer;
              float:right;
              margin-left:20px;
            }
            .selected{
              background-image: linear-gradient(#338aa7, #256378);
              border-color: #256378 #256378 #410c0c;
              color: #fff;
              text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.19);
            }
          }
          .play-type {
            display: -webkit-box;
            -webkit-box-pack: justify;
            padding: 0 20px;
            margin-bottom:20px;

            span {
              display: block;
              font-size: 14px;
              -webkit-box-flex: 1;
              padding: 15px 0;
              border: 1px solid #D0D0D0;
              color: #777777;
              cursor: pointer;
              margin-right: 20px;

              &:last-child {
                margin-right: 0;
              }
            }

            span.active {
              background-image: linear-gradient(-180deg, #EB5228 0%, #C14726 100%);
              color: #FFFFFF;
            }
          }
          .select-num-area{
            width:100%;
            position: relative;
            .bj{
              width:100%;
              height:100%;
              position: absolute;
              left:0;
              top:0;
              padding:0 20px;
              padding-bottom: 10px;
              z-index:3;
              .inner{
                background:#000;
                opacity:.5;
                width:100%;
                height:100%;
              }
            }
          }

          .bets-num-title-wrap {
            padding: 0 20px;
            width:100%;
            display:table;
          }
          .two-title-div{
            padding:0 20px;
            margin-top:20px;
            width:33.333333%;
            float:left;
            strong{
              font-size:13px;
            }
            .btn-group{
              display:inline-block;
              text-align:left;
              button{
                padding:5px 10px;
                font-size:12px;
                border:1px solid #e7eaec;
                background:#fff;
                color:#000;
                cursor: pointer;
                margin-left:-1px;
                position: relative;
                z-index:1;
                &:first-child{
                  margin-left:0;
                  border-radius:3px 0 0 3px;
                }
                &:last-child{
                  border-radius:0 3px 3px 0;
                }
                &:hover{
                  border-color:#bbb;
                  z-index:2;
                }
              }
            }
          }
          p.two-title-dec{
            color:red;
            text-align:center;
            margin:20px;
          }

          .bets-num-title {
            // margin-right:10px;
            margin-top: 0;
            margin-bottom: 20px;
            // margin:20px 10px 10px 0;
            border-bottom: 1px solid #D0D0D0;
            display: flex;
            flex-wrap: wrap;

            span {
              display: block;
              width: 10%;
              padding: 15px 0px;
              cursor: pointer;

              &:first-child {
                margin-left: 0;
              }
            }

            span.active {
              border: 1px solid #D0D0D0;
              border-bottom: none;
              background: #fff;
              margin-bottom: -1px;
            }
          }

          .bets-num-wrap {
            width: 100%;
            display: table;
            padding: 0 15px;

            div.run {
              width: 20%;
            }

            div {
              float: left;
              width: 10%;
              display: block;
              padding: 0 5px;
              margin-bottom: 10px;

              button {
                width: 100%;
                padding: 7px 0;
                border: 1px solid #D0D0D0;
                background: #fff;
                cursor: pointer;
              }
            }

            div.active {
              button {
                background: #409EFF;
                color: #fff;
              }
            }
          }
        }

        .shopping-cart {
          // margin-left:30px;
          padding-bottom: 30px;
          background: #FFFFFF;
          box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.20);

          .shopping-cart-title {
            line-height: 62px;
            padding-left: 20px;
            font-size: 16px;
            border-bottom: 1px solid #D0D0D0;
            text-align: left;
            position: relative;
            .import-excel{
              position: absolute;
              right:10px;
              padding:0 10px;
              height:30px;
              top:50%;
              margin-top:-15px;
              border: 1px solid #D0D0D0;
              background-image: linear-gradient(-180deg, #EB5228 0%, #C14726 100%);
              color:#fff;
              .import-file{
                position: absolute;
                left:0;
                top:0;
                width:100%;
                height:100%;
                display:block;
                z-index:2;
                opacity: 0;
              }
              .import-btn{
                display:block;
                white-space: nowrap;
                line-height:30px;
              }
            }
          }

          .shopping-cart-options {
            padding: 0 20px;

            .play-title {
              // text-align: left;
              font-size: 14px;
              margin-top: 20px;
              display:-webkit-box;
              -webkit-box-pack:justify;
              span{
                display:block;
              }
            }

            .num-list {
              li {
                display: -webkit-box;
                margin-top: 10px;
                border-radius: 2px;
                overflow: hidden;

                span {
                  display: block;
                  padding: 7px 17px;
                  border: 1px solid #D0D0D0;
                  border-right: none;
                  font-size: 14px;
                }

                input {
                  display: block;
                  padding: 8px 17px;
                  -webkit-box-flex: 1;
                  border: 1px solid #D0D0D0;
                  border-right: none;
                  font-size: 14px;
                }

                em {
                  width: 34px;
                  height: 34px;
                  display: block;
                  background-image: linear-gradient(-180deg, #AFAFAF 0%, #777777 100%);
                  font-size: 30px;
                  color: #fff;
                  text-align: center;
                  line-height: 34px;
                  cursor: pointer;
                }
              }
            }
          }

          .repeat-money {
            display: -webkit-box;
            margin-top: 20px;
            border-radius: 2px;
            overflow: hidden;
            width: 100%;
            padding: 0 20px;

            input {
              display: block;
              padding: 8px 17px;
              -webkit-box-flex: 1;
              border: 1px solid #D0D0D0;
              border-right: none;
              font-size: 14px;
            }

            span {
              display: block;
              width: 47%;
              background-image: linear-gradient(-180deg, #AFAFAF 0%, #777777 100%);
              text-align: center;
              padding: 7px 0;
              color: #fff;
              font-size: 14px;
            }
          }

          .bets-all-money {
            width: 100%;
            padding: 0 20px;
            font-size: 16px;
            color: #EB5228;
            // margin-top: 30px;
            margin-top:20px;
            margin-bottom: 20px;
            text-align: left;
          }

          .operate-btn {
            width: 100%;
            padding: 0 20px;
            display: -webkit-box;
            -webkit-box-pack: justify;

            button {
              width: 45%;
              height: 44px;
              font-size: 14px;
              color: #FFFFFF;
              display: block;
              cursor: pointer;
            }

            .to-bets {
              background-image: linear-gradient(-180deg, #EB5228 0%, #C14726 100%);
            }

            .clear-shopping, .disabled {
              background-image: linear-gradient(-180deg, #AFAFAF 0%, #777777 100%);
            }
          }

          .lottery-time {
            margin-top: 20px;
            font-size: 26px;
            color: #EB5228;
            display: -webkit-box;
            -webkit-box-pack: center;

            span {
              display: block;
            }

            .time-icon {
              width: 28px;
              height: 28px;
              margin-right: 5px;
            }
          }
        }
      }

      .bets-ruler {
        margin-top: 30px;
        background: #FFFFFF;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.20);

        .ruler-title {
          height: 62px;
          line-height: 62px;
          text-align: left;
          padding-left: 20px;
          font-size: 16px;
          color: #191919;
          border-bottom: 1px solid #D0D0D0;
        }

        .ruler-inner {
          padding: 34px 2px;
          display: -webkit-box;

          .ruler-desc {
            -webkit-box-flex: 1;
            display: -webkit-box;
            -webkit-box-align: center;
            -webkit-box-pack: center;

            &:first-child {
              border-right: 1px solid #D0D0D0;
            }

            strong {
              font-size: 14px;
              margin-right: 30px;
            }

            ul {
              text-align: left;

              li {
                font-size: 14px;
                margin: 10px 0;
              }
            }
          }
        }
      }
    }
  }

  @media screen and (max-width: 980px) {
    .lottery-detail {
      .lottery-detail-wrap {
        .bets-wrap {

          // display:-webkit-box;
          // -webkit-box-orient:vertical;
          .lottery-box{
            width:100%;
          }
          .bets-area-wrap {
            width: 100%;
          }
          .two-title-div{
            width:100% !important;
          }

          .shopping-cart-wrap {
            // width:350px;
            width: 100%;
            margin-left: 0;
            margin-top: 30px;
          }
        }
      }
    }
  }

  @media screen and (max-width: 720px) {
    .lottery-detail {
      .lottery-detail-wrap {
        // max-width:1200px;
        padding: 0 10px;
        width: 100%;
        margin: 0 auto;

        .play-kind {
          width: 100%;
          display: flex;
          flex-wrap: wrap;
          background: #FFFFFF;
          box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.20);

          li {
            width: 50%;
            height: 50px;
            padding: 10px 0;
            font-size: 14px;
            cursor: pointer;

            span {
              display: block;
              text-align: center;
              line-height: 30px;
              border-right: 1px solid #D0D0D0;
            }

            &:last-child {
              span {
                border-right: none;
              }
            }
          }

          li.active {
            color: #fff;
            background-image: linear-gradient(-180deg, #7C7C7C 0%, #464646 100%);

            span {
              border-right: none;
            }
          }
        }

        .bets-wrap {
          width: 100%;
          margin-top: 30px;

          .bets-area {
            padding-top: 20px;
            padding-bottom: 10px;
            background: #FFFFFF;
            box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.20);

            .play-type {
              display: -webkit-box;
              -webkit-box-pack: justify;
              padding: 0 20px;

              span {
                display: block;
                font-size: 14px;
                -webkit-box-flex: 1;
                padding: 15px 0;
                border: 1px solid #D0D0D0;
                color: #777777;
                cursor: pointer;
                margin-right: 20px;

                &:last-child {
                  margin-right: 0;
                }
              }

              span.active {
                background-image: linear-gradient(-180deg, #EB5228 0%, #C14726 100%);
                color: #FFFFFF;
              }
            }

            .bets-num-title-wrap {
              padding: 0 20px;
            }

            .bets-num-title {
              margin: 20px 0;
              border-bottom: none;

              span {
                width: 20%;
              }

              span.active {
                border: 1px solid #D0D0D0;
                margin-bottom: 0;
              }
            }

            .bets-num-wrap {
              div {
                width: 20%;
              }
            }
          }
        }

        .bets-ruler {
          .ruler-inner {
            -webkit-box-orient: vertical;

            .ruler-desc {
              &:first-child {
                border-right: none;
              }
            }
          }
        }
      }
    }
  }
  @media screen and (max-width: 420px) {
    .lottery-detail {
      .lottery-detail-wrap {
        .bets-wrap {
          .shopping-cart {
            .shopping-cart-options {
              .num-list {
                li {
                  input {
                    max-width:100px;
                  }
                }
              }
            }
          }
        }
      }
    }
  }

</style>
