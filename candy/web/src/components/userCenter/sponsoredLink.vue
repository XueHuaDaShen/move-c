<template>
  <div class="sponsored-wrap common" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.5)">
    <div class="container">
      <div class="tab">
        <router-link class="tab-item selected" :to="{name:'sponsoredLink'}">
          <div class="item-inner">{{$t('message.tui_guang_lian_jie')}}</div>
        </router-link>
        <router-link class="tab-item" :to="{name:'member'}">
          <div class="item-inner">{{$t('message.member')}}</div>
        </router-link>
      </div>
      <div class="card mt-30">
        <div class="card-body">
          <div class="body-row">
            <div class="row-item">
              <div class="item-media">
                <img class="media-icon" src="../../assets/img/icon_Proportion@3x.png">
                <span class="media-title">{{$t('message.ti_cheng_bi_li')}}</span>
              </div>
              <div class="item-num">{{tuiguang_data.refund ? tuiguang_data.refund : 0}}%</div>
            </div>
            <div class="row-item">
              <div class="item-media">
                <img class="media-icon" src="../../assets/img/icon_Click@3x.png">
                <span class="media-title">{{$t('message.dian_ji_liang')}}</span>
              </div>
              <div class="item-num">{{tuiguang_data.num_clicked ? tuiguang_data.num_clicked :0}}</div>
            </div>
            <div class="row-item">
              <div class="item-media">
                <img class="media-icon" src="../../assets/img/icon_Number@3x.png">
                <span class="media-title">{{$t('message.zhu_ce_liang')}}</span>
              </div>
              <div class="item-num">{{tuiguang_data.num_registered ? tuiguang_data.num_registered :0}}</div>
            </div>
            <div class="row-item">
              <div class="item-media">
                <img class="media-icon" src="../../assets/img/icon_Amount@3x.png">
                <span class="media-title">{{$t('message.zong_tou_zhu')}}</span>
              </div>
              <div class="item-num">{{(tuiguang_data.bid_total ? tuiguang_data.bid_total :0)| filterCash}}</div>
            </div>
            <div class="row-item">
              <div class="item-media">
                <img class="media-icon" src="../../assets/img/icon_income@3x.png">
                <span class="media-title">{{$t('message.yu_qi_shou_ru')}}</span>
              </div>
              <div class="item-num">{{(tuiguang_data.want_amount ? tuiguang_data.want_amount :0)| filterCash}}</div>
            </div>
            <div class="row-item">
              <div class="item-media">
                <img class="media-icon" src="../../assets/img/icon_income@3x.png">
                <span class="media-title">{{$t('message.shi_ji_shou_ru')}}</span>
              </div>
              <div class="item-num">{{(tuiguang_data.refund_amount? tuiguang_data.refund_amount :0)|filterCash}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="card mt-30">
        <div class="card-title">{{$t('message.tui_jian_rule')}}</div>
        <div class="card-body rule-wrap">
          <p class="rule-normal">
            ลิ้งค์ช่วยแชร์รับ {{tuiguang_data.refund ? tuiguang_data.refund : 0}}% ฟรี
            (แค่ก๊อปปี้ลิ้งค์ไปแชร์ก็ได้เงินแล้ว) ยิ่งแชร์มากยิ่งได้มาก
            <br>
            <br>
            ท่านสามารถนำลิ้งค์ด้านล่างนี้หรือนำป้ายแบนเนอร์ ไปแชร์ในช่องทางต่างๆ ไม่ว่าจะเป็น เว็บไชต์ส่วนตัว, Blog,
            Facebook หรือ Social Network อื่นๆ หากมีการสมัครสมาชิกโดยคลิกผ่านลิ้งค์ของท่านเข้ามา
            ลูกค้าที่สมัครเข้ามาก็จะอยู่ภายให้เครือข่ายของท่านทันที
            และหากลูกค้าภายใต้เครือข่ายของท่านมีการเดิมพันเข้ามา ทุกยอดการเดิมพัน ท่านจะได้รับส่วนแบ่งในการแนะนำ
            {{tuiguang_data.refund ? tuiguang_data.refund : 0}}% ทันทีโดยไม่มีเงื่อนไข
          </p>
          <br>
          <p class="rule-normal">
            ตัวอย่างเช่น...
            <br>
            - ลูกค้าท่าน 1 คน แทง 1,000 บาท ท่านจะได้ {{getCommission(tuiguang_data.refund,1000,1) | filterCash}} บาท
            <br>
            - ลูกค้าท่าน 10 คน แทง 1,000 บาท ท่านจะได้รับ {{getCommission(tuiguang_data.refund,1000,10) | filterCash}}
            บาท
            <br>
            - ลูกค้าท่าน 100 คน แทง 1,000 บาท ท่านจะได้รับ {{getCommission(tuiguang_data.refund,1000,100) |
            filterCash}} บาท
          </p>
          <br>
          <p class="rule-normal">
            สามารถทำรายได้เดือน 100,000 บาทง่ายๆเลยทีเดียว เพราะทางเรามีหวยเปิดรับทายผลทุกวัน มีมากกว่าวันละ 200 รอบ
            เปิดรับแทงออนไลน์ตลอด 24 ชม. และรายได้ทุกบาททุกสตางค์ของท่านสามารถตรวจสอบได้ทุกขั้นตอน งานนี้แจกจริง
            จ่ายจริง ที่นี้ที่เดียวที่ให้คุณมากกว่าใคร ก๊อปปี้ลิ้งค์และข้อความด้านล่างนี้ นำไปแชร์ได้เลย
          </p>
          <!-- <br>
          <p class="rule-sp">
            Note: Your referral income can be withdrawn at any time. If the income is more than 500
            baht.
          </p> -->
        </div>
      </div>
      <div class="card mt-30">
        <div class="card-title">{{$t('message.tui_guang_lian_jie')}}</div>
        <div class="card-body">
          <input class="tuiguang-input" v-model="tuiguang_data.url" readonly>
          <button class="copy-btn ml-20" id="tuiguang_link" @click="copyLink('tuiguang_link')" :data-clipboard-text="tuiguang_data.url">{{$t('message.fu_zhi_lian_jie')}}</button>
        </div>
      </div>
      <div class="card mt-30" v-for="(b,index) in banner_data" :key="index">
        <div class="card-title">Banner {{b.width}}x{{b.height}}</div>
        <div class="card-body">
          <div class="banner-wrap">
            <div class="banner">
              <img class="banner-img" :style="{ 'max-width': b.width + 'px' ,'max-height': b.height + 'px'}" :src="b.image">
            </div>
            <p class="banner-tip">HTML Code：</p>
            <textarea class="banner-textarea" v-model="b.htmlCode" readonly></textarea>
            <div style="text-align:right">
              <button class="copy-btn ml-20 mt-20" :id="'banner_link'+index" @click="copyLink('banner_link'+index)"
                :data-clipboard-text="b.htmlCode">{{$t('message.fu_zhi_lian_jie')}}</button>
            </div>
            <p class="banner-tip">BB Code：</p>
            <textarea class="banner-textarea" v-model="b.bbCode" readonly></textarea>
            <div style="text-align:right">
              <button class="copy-btn ml-20 mt-20" :id="'banner_link_bb'+index" :data-clipboard-text="b.bbCode" @click="copyLink('banner_link_bb'+index)">{{$t('message.fu_zhi_lian_jie')}}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import Clipboard from 'clipboard';
  export default {
    name: "sponsoredLink",
    components: {},
    props: {},
    data() {
      return {
        list: [],
        total: 0, //总条数
        pageIndex: 1, //当前页
        pageSize: 20, //单页条数
        loading: false,
        tuiguang_data: {},
        banner_data: [],
        banner_total: 0
      };
    },
    beforeDestroy() {},
    destroyed() {},
    computed: {},
    created() {
      //   如果当前为直客，则显示sponsoredLink
      const vm = this;
      let candy_type = localStorage.getItem("candy-type").toString();
      let window_open = candy_type === "2";
      if (!window_open) {
        setTimeout(function () {
          vm.$router.push({
            name: "home"
          });
        }, 1000);
      }
    },
    mounted() {
      this.getLinkList();
    },
    methods: {
      copyLink(id) {
        const flag = Clipboard.isSupported();
        const vm = this;
        if (flag) {
          var clipboard = new Clipboard(`#${id}`); /*创建方法*/
          clipboard.on('success', e => {
            e.clearSelection();
            vm.$store.state.message(vm.$t("message.copy_success"), 'success', 1500, vm);
            clipboard.destroy();
          })
          clipboard.on('error', e => {
            vm.$store.state.message(vm.$t("message.copy_failed"), 'error', 1500, vm);
            clipboardDemos.destroy();
          })
        } else { /*浏览器不支持时，进入手动复制方法*/
          vm.$store.state.message(vm.$t("message.copy_failed"), 'error', 1500, vm);
          clipboardDemos.destroy();
        }
      },
      getLinkList() {
        const vm = this;
        let data = {
          page_size: vm.pageSize,
          page_num: vm.pageIndex,
          type: [2]
        };
        vm.loading = true;
        let url = "/agency/link/list";
        vm.$http
          .get(url, {
            params: data
          })
          .then(
            response => {
              vm.loading = false;
              let status = response.body.returncode;
              if (status) {
                if (status == 103 || status == 106 || status == 101) {
                  this.$store.state.reLogin(this);
                } else if (status == 200) {
                  vm.total = response.body.data.total;
                  if (vm.total) {
                    vm.tuiguang_data = response.body.data.data[0];
                    vm.getBanner();
                  }
                }
              }
            },
            response => {
              vm.loading = false;
            }
          );
      },
      getBanner() {
        const vm = this;
        vm.loading = true;
        let url = "/material/list";
        vm.$http.get(url, {}).then(
          response => {
            vm.loading = false;
            let status = response.body.returncode;
            if (status) {
              if (status == 103 || status == 106 || status == 101) {
                this.$store.state.reLogin(this);
              } else if (status == 200) {
                vm.banner_total = response.body.totalCount;
                if (vm.banner_total) {
                  // vm.banner_data = response.body.data;
                  response.body.data.filter(v => {
                    v.htmlCode =
                      `<a href="${
                    vm.tuiguang_data.url
                  }" title="KINGLOTTO" target="_blank"><img src="${
                    v.image
                  }" alt="KINGLOTTO" width="${v.width}" height="${
                    v.height
                  }" border="0" /></a>`;
                    v.bbCode =
                      `[url=${vm.tuiguang_data.url}][img]${
                    v.image
                  }[/img][/url]`;
                    vm.banner_data.push(v);
                  });
                } else {
                  vm.banner_data = [];
                }
              }
            }
          },
          response => {
            vm.loading = false;
            vm.banner_data = [];
          }
        );
      },
      getCommission(percentage, cash, multiple) {
        if (!multiple) {
          multiple = 1;
        }
        if (Number(percentage) && Number(cash)) {
          return parseFloat(
            Number(percentage) * Number(cash) * 0.01 * multiple
          ).toFixed(2);
        }
        return 0.0;
      }
    },
    filters: {
      // 金额文本格式化
      // 每千位逗号隔开，不包含小数部分
      filterCash(v) {
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
    }
  };

</script>

<style lang="scss" scoped>
  .sponsored-wrap {
    padding: 60px 0;

    .card-body {
      //   height: 240px;
      margin: 0 auto;
      padding: 40px 20px;

      .body-row {
        display: flex;
        padding: 60px 0;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;

        .row-item {
          height: 100px;
          flex: 1;
          border-right: 1px solid #ddd;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;

          &:last-child {
            border-right: none;
          }

          .item-media {
            width: 100%;
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;

            .media-icon {
              display: inline-block;
              width: 26px;
              height: 26px;
              margin-right: 10px;
            }

            .media-title {
              font-family: PingFangSC-Medium;
              font-size: 16px;
              color: #777777;
              display: inline-block;
            }
          }

          .item-num {
            margin-top: 20px;
            font-family: PingFangSC-Regular;
            font-size: 26px;
            color: #eb5228;
          }
        }
      }

      @media screen and(max-width:768px) {
        .body-row {
          flex-direction: row;
          flex-wrap: wrap;
          padding: 0 !important;

          .row-item {
            width: 100%;
            flex: none;
            border: 1px solid #ddd;

            &:last-child {
              border-right: 1px solid #ddd;
            }
          }
        }
      }
    }

    .rule-wrap {
      padding: 28px 20px 20px;

      .rule-normal {
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: #191919;
        text-align: left;
        line-height: 20px;
      }

      .rule-sp {
        font-family: PingFangSC-Medium;
        font-size: 12px;
        color: #191919;
        text-align: left;
      }
    }

    .banner-wrap {
      max-width: 720px;
      margin: 0 auto;

      .banner-img {
        display: block;
        box-shadow: 0 10px 30px 0 rgba(0, 0, 0, 0.3);
        margin: 0 auto;
      }

      .banner-tip {
        padding-top: 60px;
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #191919;
        text-align: left;
        padding-bottom: 10px;
      }

      .banner-textarea {
        padding: 20px;
        background: #ededed;
        border: 1px solid #d0d0d0;
        width: 100%;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #777777;
        text-align: left;
        outline: none;
        resize: none;
        height: 100px;
        overflow-y: scroll;
      }
    }

    .p-tb-40 {
      padding: 40px 0;
    }

    .mt-20 {
      margin-top: 20px;
    }

    .flex-jc {
      justify-content: center;
    }

    .flex-ac {
      align-items: center;
    }

    .fr {
      float: right;
    }

    .flex {
      display: flex;
    }

    .tuiguang-input {
      background: #ededed;
      border: 1px solid #d0d0d0;
      width: 600px;
      height: 32px;
      display: inline-block;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #777777;
      text-align: center;
    }

    @media screen and (max-width: 1200px) {
      .tuiguang-input {
        width: auto;
        padding: 0 10px;
      }
    }

    .copy-btn {
      background-image: linear-gradient(-180deg, #eb5228 0%, #c14726 100%);
      width: 145px;
      height: 34px;
      display: inline-block;
      text-align: center;
      cursor: pointer;
      border: none;
      outline: none;
      font-family: PingFangSC-Medium;
      font-size: 14px;
      color: #ffffff;
    }

    @media screen and (max-width: 1200px) {
      .copy-btn {
        width: auto;
        padding: 0 10px;
      }
    }

    .ml-20 {
      margin-left: 20px;
    }
  }

</style>
