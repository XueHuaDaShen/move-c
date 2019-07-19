<template>
  <!-- <div class="hello" :class="$i18n.locale == 'th' ? 'thai-lang-wrap' : 'chinese-lang-wrap'" style="background:#000;"> -->
  <div class="hello normal-font-wrap common" style="background:#000;">
    <div class="home-content-wrap width-1234">
      <div class="border-left-bj"><img src="@/assets/img/home/border-left-bj.png" alt=""></div>
      <div class="border-right-bj"><img src="@/assets/img/home/border-left-bj.png" alt=""></div>
      <div class="banner-wrap">
        <img src="@/assets/img/home/banner-new.png" alt="">
      </div>
      <div class="about-us">
        <img src="@/assets/img/home/about-us-bj.png" alt="">
        <div class="inner">
          <p class="us-title font-pslx">{{$t("message.guan_yu_wo_men")}}</p>
          <p class="us-desc font-pslx">{{$t("message.guan_yu_wo_men_desc")}}</p>
        </div>
      </div>
      <div class="user-operate-wrap">
        <img src="@/assets/img/home/country-bj.png" alt="">
        <div class="inner">
          <p class="operate-title font-pslx">4 ขั้นตอนการเเทงหวยกับ Kinglotto</p>
          <ul class="operate-list font-pslx">
            <li>
              <dl>
                <dt>
                  <img src="@/assets/img/operate-user.png" alt="" class="operate-icon">
                  <img src="@/assets/img/right-jiantou.png" alt="" class="right-jiantou">
                </dt>
                <dd>
                  <span class="order">ขั้นตอน 1</span>
                  <span class="name">สมัครสมาชิก</span>
                  <span class="use-to">เพื่อเข้าสู่ระบบ</span>
                </dd>
              </dl>
            </li>
            <li>
              <dl>
                <dt>
                  <img src="@/assets/img/operate-trans.png" alt="" class="operate-icon">
                  <img src="@/assets/img/right-jiantou.png" alt="" class="right-jiantou">
                </dt>
                <dd>
                  <span class="order">ขั้นตอน 2</span>
                  <span class="name">สมัครสมาชิก</span>
                  <span class="use-to">เพื่อเข้าสู่ระบบ</span>
                </dd>
              </dl>
            </li>
            <li>
              <dl>
                <dt>
                  <img src="@/assets/img/operate-click.png" alt="" class="operate-icon">
                  <img src="@/assets/img/right-jiantou.png" alt="" class="right-jiantou">
                </dt>
                <dd>
                  <span class="order">ขั้นตอน 3</span>
                  <span class="name">สมัครสมาชิก</span>
                  <span class="use-to visibility-hidden">เพื่อเข้าสู่ระบบ</span>
                </dd>
              </dl>
            </li>
            <li>
              <dl>
                <dt>
                  <img src="@/assets/img/operate-cash.png" alt="" class="operate-icon">
                </dt>
                <dd>
                  <span class="order">ขั้นตอน 4</span>
                  <span class="name">สมัครสมาชิก</span>
                  <span class="use-to">เพื่อเข้าสู่ระบบ</span>
                </dd>
              </dl>
            </li>
          </ul>
        </div>
      </div>
      <div class="country-wrap">
        <img src="@/assets/img/home/country-bj.png" alt="">
        <div class="inner">
          <ul class="country-list font-pslx">
            <li @click="changeCountry('taiguo', 3)">
              <dt><img src="@/assets/img/country-1.png" alt=""></dt>
              <dd>หวยไทย</dd>
            </li>
            <li @click="changeCountry('laowo', 2)">
              <dt><img src="@/assets/img/country-2.png" alt=""></dt>
              <dd>หวยลาว</dd>
            </li>
            <li @click="changeCountry('yuenan', 2)">
              <dt><img src="@/assets/img/country-3.png" alt=""></dt>
              <dd>หวยเวียดนาม</dd>
            </li>
            <li @click="changeCountry('shishicai', 2)">
              <dt><img src="@/assets/img/country-4.png" alt=""></dt>
              <dd>หวยยี่กี่</dd>
            </li>
          </ul>
        </div>
      </div>
      <div class="change-country-inner-wrap">
        <img src="@/assets/img/home/change-country-bj.png" alt="">
        <span v-if="contentIndex != 0" class="left-sanjiao" @click="leftClick"><img src="@/assets/img/jiantou-icon.png"
            alt=""></span>
        <span v-if="contentIndex != contentLength-1" class="right-sanjiao" @click="rightClick"><img src="@/assets/img/jiantou-icon.png"
            alt=""></span>
        <div class="area-tag">
          <span v-for="(v, vi) in contentLength" :key="v" :class="vi==contentIndex ? 'active':''" @click="contentIndex=vi"></span>
        </div>
        <div v-if="showCountry === 'taiguo'" class="taiguo-wrap inner-wrap" :style="{transform: 'translate(-'+contentIndex*100+'%, 0)'}">
          <div class="content">
            <dl>
              <dt><img src="@/assets/img/country-inner-icon.png" alt=""></dt>
              <dd>
                <p class="change-country-title font-pslx">แนะนำเกี่ยวกับหวยไทย</p>
                <p class="desc font-pslx">
                  หวยไทย การออกผลรางวัล ออกทุกวันที่ 1 และ 16 ของทุกเดือน(หากบางเดือนเปลี่ยนแปลงวันหรือเวลา
                  ติดตามได้ที่หน้าเว็บไซต์) ปิดรับการแทงหวย 15.20 น. ของวันหวยออก - 2 ตัวบน ใช้ 2 ตัวท้ายของรางวัลที่1
                  เช่นหวยออก 123456 2 ตัวบน คือ 56 - 2 ตัวล่าง ใช้ รางวัลเลขท้าย 2 ตัว หมุน 1 ครั้ง เช่นหวยออก 12 2
                  ตัวล่าง คือ 12
                </p>
              </dd>
            </dl>
          </div>
          <div class="content">
            <dl>
              <dt><img src="@/assets/img/country-inner-icon.png" alt=""></dt>
              <dd>
                <p class="change-country-title font-pslx">แนะนำเกี่ยวกับหวยไทย</p>
                <p class="desc font-pslx">
                  - 3 ตัวบน ใช้ 3 ตัวท้ายของรางวัลที่1 เช่นหวยออก 123456 3 ตัวบน คือ 456 - 3 ตัวบนโต๊ด ใช้ 3
                  ตัวท้ายของรางวัลที่1 สลับตำแหน่ง x3 x6 เช่นหวยออก 123456 3 ตัวบนโต๊ด คือ 456,465,546,564,645,654 - 3
                  ตัวล่าง ใช้รางวัล 3 ตัวล่าง หมุน 2 ครั้ง เช่นหวยออก 123 456 3 ตัวล่าง คือ 123 456 - วิ่ง 3 ตัวบน ใช้ 3
                  ตัวท้ายของรางวัลที่1 เช่นหวยออก 123456 วิ่ง 3 ตัวบน คือ 4 และ 5 และ 6 ออกเลขเบิ้ลได้ต่อเดียว
                </p>
              </dd>
            </dl>
          </div>
          <div class="content">
            <dl>
              <dt><img src="@/assets/img/country-inner-icon.png" alt=""></dt>
              <dd>
                <p class="change-country-title font-pslx">แนะนำเกี่ยวกับหวยไทย</p>
                <p class="desc font-pslx">
                  - วิ่ง 2 ตัวบน ใช้ 2 ตัวท้ายของรางวัลที่1 เช่นหวยออก 123456 วิ่ง 2 ตัวบน คือ 5 และ 6
                  ออกเลขเบิ้ลได้ต่อเดียว - วิ่ง 2 ตัวล่าง ใช้ รางวัลเลขท้าย 2 ตัว หมุน 1 ครั้ง เช่นหวยออก 12 วิ่ง 2
                  ตัวล่าง คือ 1 และ 2 ออกเลขเบิ้ลได้ต่อเดียว
                </p>
              </dd>
            </dl>
          </div>
        </div>
        <div v-if="showCountry === 'laowo'" class="laowo-wrap inner-wrap" :style="{transform: 'translate(-'+contentIndex*100+'%, 0)'}">
          <div class="content">
            <dl>
              <dt><img src="@/assets/img/country-inner-icon.png" alt=""></dt>
              <dd>
                <p class="change-country-title font-pslx">แนะนำเกี่ยวกับหวยลาว</p>
                <p class="desc font-pslx">
                  การออกรางวัลออก "ทุกวันพุธ ของทุกสัปดาห์ ออกทุกวันพุธ ปิดรับ 20.00น.หรือ สามารถฟังผลทางวิทยุได้ที่
                  ทางสถานีวิทยุ นครหลวงเวียงจันทร์ คลื่นความถี่ AM 567 kHz ช่วงเวลา 20.00 น.ถึง 20.30 น. เป็นต้นไป
                </p>
              </dd>
            </dl>
          </div>
          <div class="content">
            <dl>
              <dt><img src="@/assets/img/country-inner-icon.png" alt=""></dt>
              <dd>
                <p class="change-country-title font-pslx">แนะนำเกี่ยวกับหวยลาว</p>
                <p class="desc-img"><img src="@/assets/img/laowo-img-1.png" alt=""></p>
                <p class="desc font-pslx">
                  หมายเหตุ **ถ้าวันพุธ ไหนไม่มีการออก 5 ตัว ให้เอาคู่หน้าของเลข 4 ตัว เป็น 2 ตัวล่าง เสมอ
                </p>
              </dd>
            </dl>
          </div>
        </div>
        <div v-if="showCountry === 'yuenan'" class="yuenan-wrap inner-wrap" :style="{transform: 'translate(-'+contentIndex*100+'%, 0)'}">
          <div class="content">
            <dl>
              <dt><img src="@/assets/img/country-inner-icon.png" alt=""></dt>
              <dd>
                <p class="change-country-title font-pslx">แนะนำเกี่ยวกับหวยเวียดนาม</p>
                <p class="desc font-pslx">
                  การออกรางวัลออก ทุกวัน ทุกสัปดาห์ ออกทุกวัน ปิดรับ 18.00น. ผลรางวัลดูตามภาพด้านล่าง
                </p>
              </dd>
            </dl>
          </div>
          <div class="content">
            <dl>
              <dt><img src="@/assets/img/country-inner-icon.png" alt=""></dt>
              <dd>
                <p class="change-country-title font-pslx">แนะนำเกี่ยวกับหวยเวียดนาม</p>
                <p class="desc-img"><img src="@/assets/img/yuenan-img-1.png" alt=""></p>
                <p class="desc font-pslx">
                  หมายเหตุ **ถ้างวดไหนไม่มีการออกรางวัล ถือว่า เป็นการแทงงวดถัดไป
                </p>
              </dd>
            </dl>
          </div>
        </div>
        <div v-if="showCountry === 'shishicai'" class="shishicai-wrap inner-wrap" :style="{transform: 'translate(-'+contentIndex*100+'%, 0)'}">
          <div class="content">
            <dl>
              <dt><img src="@/assets/img/country-inner-icon.png" alt=""></dt>
              <dd>
                <p class="change-country-title font-pslx">แนะนำเกี่ยวกับหวยยี่กี่</p>
                <p class="desc font-pslx">1. แทงเลข 1-12 ออกผลทุก ๆ 15 นาที วันละ 96 รอบ</p>
                <p class="desc font-pslx">2. ออกผลทุกวัน ตั้งแต่ 09.00-21.00 น. (และทำการปิดรอบสุดท้ายดึกยิ่งขึ้นจนถึงตี
                  2)</p>
                <p class="desc font-pslx">3. แทงเลข 1-12 ขั้นต่ำ 20 บาท ขึ้นไปจ่าย 11 ต่อ (รวมทุน)</p>
                <p class="desc font-pslx">4. (เช่น แทง 100 จ่าย 1100) (รวมทุน)</p>
                <p class="desc font-pslx">5. เลขต่ำ (แดง) 1,2,3,4,5,6 แทงขั้นต่ำ 120 บาท จ่าย 220 บาท (รวมทุน)</p>
              </dd>
            </dl>
          </div>
          <div class="content">
            <dl>
              <dt><img src="@/assets/img/country-inner-icon.png" alt=""></dt>
              <dd>
                <p class="change-country-title font-pslx">แนะนำเกี่ยวกับหวยยี่กี่</p>
                <p class="desc font-pslx">6. เลขสูง (ดำ) 7,8,9,10,11,12 แทงขั้นต่ำ 120 บาท จ่าย 220 บาท (รวมทุน)</p>
                <p class="desc font-pslx">7. เลขคู่ 2,4,6,8,10,12 แทงขั้นต่ำ 120 บาท จ่าย 220 บาท (รวมทุน)</p>
                <p class="desc font-pslx">8. เลขคี่ 1,3,5,7,9,11 แทงขั้นต่ำ 120 บาท จ่าย 220 บาท (รวมทุน)</p>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
    <el-dialog :visible.sync="hasNotice" :before-close="handleClose" top="0" custom-class="common-dialog" center>
      <div slot="title" class="dialog-header">
        <span class="title">{{newstNotice.title}}</span>
      </div>
      <div class="body">
        <p>{{newstNotice.start_at | filterTime}} - {{newstNotice.stop_at | filterTime}}</p>
        <img :src="newstNotice.photo" v-if="newstNotice.photo" class="notice-photo" />
        <p v-html="newstNotice.content" v-if="newstNotice.content" class="notice-content"></p>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {
    consoleFn
  } from '../assets/js/console';
  import moment from "moment";
  export default {
    name: 'newHome',
    components: {},
    props: {},
    data() {
      return {
        login: false,
        showCountry: 'taiguo',
        contentIndex: 0,
        contentLength: 3,
        contentWrapStyle: '',
        newstNotice: {},
        hasNotice: false
      }
    },
    beforeDestroy() {},
    destroyed() {},
    watch: {
      $route(t, f) {
        // console.log(t, f)
        this.login = localStorage.getItem('candy-login') === 'true';
      }
    },
    computed: {},
    created() {
      this.login = localStorage.getItem('candy-login') === 'true';
      if (this.login) {
        this.getNewstNotice();
      }
    },
    mounted() {},
    methods: {
      getNewstNotice() {
        const vm = this;
        let data = {
          pageSize: 15,
          pageNum: 1,
        };
        let url = '/notice/list';
        vm.$http.get(url, {
          params: data
        }).then(response => {
          let status = response.body.returncode;
          if (status) {
            if (status == 103 || status == 106 || status == 101) {
              this.$store.state.reLogin(this);
            } else if (status == 200) {
              if (response.body.data.total) {
                let noticeShowed = sessionStorage.getItem('noticeShowed');
                if (noticeShowed === 'true') {
                  vm.hasNotice = false;
                } else {
                  vm.hasNotice = true;
                }
                vm.newstNotice = response.body.data.data[0];
              }
            }
          }
        }, response => {
          vm.hasNotice = false;
          vm.newstNotice = {};
        });
      },
      handleClose() {
        this.hasNotice = false;
        sessionStorage.setItem('noticeShowed', 'true');
      },
      changeCountry(country, len) {
        if (this.showCountry == country) {
          return false;
        }
        this.showCountry = country;
        this.contentLength = len;
        this.contentIndex = 0;
      },
      leftClick() {
        if (this.contentIndex != 0) {
          this.contentIndex -= 1;
        }
      },
      rightClick() {
        if (this.contentIndex < this.contentLength - 1) {
          this.contentIndex += 1;
        }
      },
      toReg() {
        this.$router.push('/reg/3qjrntu5t')
      },
      toLog() {
        this.$router.push({
          name: 'login'
        })
      },
    },
    filters: {
      filterTime(v) {
        if (v) {
          return moment(v).format("DD-MM-YYYY HH:mm:ss");
        }
        return "--";
      }
    }
  }

</script>

<style lang="scss">
  .normal-font-wrap.common {
    .el-dialog__wrapper {
      padding: 0 20px;
    }

    .common-dialog {
      min-width: auto;
    }

    .el-dialog__body {
      padding: 25px 25px 30px;
    }
  }

</style>

<style lang="scss" scoped>
  .notice-photo {
    margin: 20px 0;
  }

  .notice-content {
    text-align: left;
  }

  .width-1200 {
    max-width: 1200px;
    margin: 0 auto;
  }
  .width-1234 {
    max-width: 1234px;
    margin: 0 auto;
  }
  .home-content-wrap{
    position: relative;
    padding:0 17px;
    .border-left-bj, .border-right-bj{
      position: absolute;
      width:17px;
      height:100%;
      top:0;
    }
    .border-left-bj{
      left:0;
    }
    .border-right-bj{
      right:0;
    }
  }

  p {
    text-align: center;
  }

  .visibility-hidden {
    visibility: hidden;
  }

  .font-pslx {
    font-family: PSLxDisplay-Bold;
    // font-family: 'Avenir', Helvetica, Arial, sans-serif;
    font-style: normal;
    background: -webkit-linear-gradient(#f6ca79, #fbeabe, #cda660);
    /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(#f6ca79, #fbeabe, #cda660);
    /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(#f6ca79, #fbeabe, #cda660);
    /* Firefox 3.6 - 15 */
    background: linear-gradient(#f6ca79, #fbeabe, #cda660);
    /* 标准的语法 */
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: normal;
    font-stretch: normal;
    height: auto;
  }

  .inner {
    width: 100%;
    position: absolute;
    left: 0;
    // bottom:0;
  }

  .hello {
    .left-sanjiao {
      position: absolute;
      width: 5rem;
      height: 5rem;
      transform: rotate(-180deg);
      -ms-transform: rotate(-180deg);
      /* IE 9 */
      -moz-transform: rotate(-180deg);
      /* Firefox */
      -webkit-transform: rotate(-180deg);
      /* Safari 和 Chrome */
      -o-transform: rotate(-180deg);
      left: 0;
      top: 50%;
      margin-top: -2.5rem;
      cursor: pointer;
      z-index: 5;
      // display:none;
    }

    .right-sanjiao {
      position: absolute;
      width: 5rem;
      height: 5rem;
      right: 0;
      top: 50%;
      margin-top: -2.5rem;
      cursor: pointer;
      z-index: 5;
      // display:none;
    }

    .banner-wrap {
      position: relative;

      >.inner {
        bottom: 20%;
      }

      .p_button {
        width: 100%;
        display: -wekbit-box;
        -webkit-box-pack: center;

        button {
          width: 10.8rem;
          cursor: pointer;
          background-image: linear-gradient(rgba(222, 167, 42, 0.8),
            rgba(222, 167, 42, 0.8)),
            linear-gradient(0deg,
            #ae7036 0%,
            rgba(178, 119, 64, 0.5) 3%,
            rgba(215, 184, 155, 0.27) 25%,
            rgba(255, 255, 255, 0.01) 50%,
            #ffffff 51%,
            rgba(255, 255, 255, 0.5) 51%,
            #ffffff 51%),
            linear-gradient(0deg,
            #ad6e2a 0%,
            #ffffff 100%),
            linear-gradient(#ffc928,
            #ffc928);
          background-blend-mode: normal,
            normal,
            normal,
            normal;
          border-radius: 0.5rem;
          border: solid 0.4rem rgba(255, 255, 255, 0.1);
          font-size: 2.1rem;
          font-weight: normal;
          font-stretch: normal;
          letter-spacing: 0rem;
          color: #422411;
        }

        .reg {
          margin-right: 8.9rem;
        }
      }
    }

    .about-us {
      position: relative;

      .inner {
        top: 0;
      }

      p {
        display: block;
        margin: 0;
        padding: 0;
      }
    }

    .lottery-list {
      position: relative;

      .inner {
        top: 0;
      }

      .list-wrap {
        padding: 0 0;
        display: -webkit-box;
        -webkit-box-pack: center;

        ul {
          width: 33rem;
          padding: 0 3.4rem;
          list-style: none;

          &:first-child {
            border-right: solid 0.1rem #ffffff;
          }

          li {
            display: -webkit-box;
            -webkit-box-pack: justify;

            &:last-child {
              margin-bottom: 0;
            }

            span {
              display: block;
            }
          }
        }
      }
    }

    .user-operate-wrap {
      position: relative;

      .inner {
        top: 0;
      }

      .operate-list {
        margin-top: 6.6rem;
        display: -webkit-box;
        -webkit-box-pack: justify;

        li {
          width: 25%;

          dt {
            position: relative;
            display: -webkit-box;
            -webkit-box-pack: center;

            .operate-icon {
              width: 9.9rem;
              height: auto;
              display: inline-block;
            }

            .right-jiantou {
              position: absolute;
              height: 3.3rem;
              width: auto;
              right: -2.3vw;
              top: 50%;
              margin-top: -2.15vw;
            }
          }

          dd {
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-box-align: center;
            -webkit-box-pack: center;
            border-right: solid 0.1vw #ffffff;

            span {
              display: block;
            }
          }

          &:last-child {
            dd {
              border-right: none;
            }
          }
        }
      }
    }

    .cuxiao-wrap {
      position: relative;

      .inner {
        top: 0;
      }

      .desc {
        line-height: 3rem;
        margin-top: 4rem;
        padding: 0 3rem;
      }
    }

    .country-wrap {
      position: relative;

      .inner {
        top: 13rem;
      }

      .country-list {
        display: -webkit-box;
        -webkit-box-pack: center;

        li {
          width: 14.3rem;
          margin-right: 3.2rem;
          cursor: pointer;

          &:last-child {
            margin-right: 0;
          }
        }
      }
    }

    .change-country-inner-wrap {
      position: relative;
      overflow: hidden;

      // &:hover{
      //   .left-sanjiao, .right-sanjiao{
      //     display:block;
      //   }
      // }
      .area-tag {
        width: 100%;
        display: -webkit-box;
        -webkit-box-pack: center;
        position: absolute;
        left: 0;
        bottom: 1rem;
        z-index: 5;

        span {
          display: block;
          width: 1rem;
          height: 1rem;
          background: #999;
          border-radius: 50%;
          margin-right: 1vw;
          cursor: pointer;

          &:last-child {
            margin-right: 0;
          }
        }

        span.active {
          background: #fff;
        }
      }

      .inner-wrap {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        display: -webkit-box;
        transition: all .3s;
      }

      .laowo-wrap {
        .content .desc-img {
          margin-top: 1.8rem;
          margin-bottom: 1rem;
        }
      }

      .yuenan-wrap {
        .content .desc-img {
          margin-top: 3.8rem;
          margin-bottom: 1rem;
        }
      }

      .content {
        margin-top: 3rem;

        .desc-img {
          width: 35rem;
        }
      }

      dl {
        dt {
          width: 35.1rem;
          float: left;
        }

        dd {
          padding-left: 35.1rem;

          p {
            text-align: left;
          }
        }
      }
    }

    .introdution-wrap {
      position: relative;

      >.inner {
        width: auto;
        left: 3.9rem;
        top: 6rem;
      }
    }

    .contact-us {
      position: relative;

      .inner {
        top: 0;
      }
    }
  }

  .normal-font-wrap {
    .about-us {
      .us-title {
        font-size: 6.2rem;
      }

      .us-desc {
        margin-top: 4rem;
        font-size: 2rem;
        line-height: 4.6rem;
        padding: 0 4.8rem;
      }
    }

    .lottery-list {
      .list-title {
        font-size: 7.4rem;
      }

      .list-wrap {
        ul {
          li {
            font-size: 2.6rem;
            line-height: 4.1rem;
          }
        }
      }
    }

    .user-operate-wrap {
      .operate-title {
        font-size: 4.5rem;
        margin-top: 2.5rem;
      }

      .operate-list {
        li {
          dd {
            margin-top: 3rem;

            span {
              font-size: 2.1rem;
              line-height: 2.7rem;
            }
          }
        }
      }
    }

    .cuxiao-wrap {
      .cuxiao-title {
        font-size: 6rem;
      }

      .desc {
        font-size: 2.1rem;
      }
    }

    .country-wrap {
      position: relative;

      .country-list {
        li {
          dd {
            margin-top: 1.7rem;
            font-size: 2.3rem;
            line-height: 3.2rem;
          }
        }
      }
    }

    .change-country-inner-wrap {
      dl {
        dd {
          .change-country-title {
            font-size: 3.3rem;
            margin-bottom: 2rem;
          }

          .desc {
            font-size: 2.1rem;
            line-height: 3rem;
            padding-right: 1.8rem;
          }
        }
      }
    }

    .introdution-wrap {
      .desc {
        width: 31.1rem;
        font-size: 2.8rem;
        line-height: 4.2rem;
        letter-spacing: 0.1rem;
      }
    }

    .contact-us {
      p {
        margin-top: 3rem;
        font-size: 3.7rem;
        line-height: 5.5rem;
      }

      .us-title {
        font-size: 5.4rem;
        line-height: 3.2rem;
      }
    }
  }

  .chinese-lang-wrap {
    .about-us {
      .us-title {
        font-size: 6.2rem;
      }

      .us-desc {
        margin-top: 4rem;
        font-size: 2.1rem;
        line-height: 4.6rem;
        padding: 0 4.8rem;
      }
    }

    .lottery-list {
      .list-title {
        font-size: 13.4rem;
      }

      .list-wrap {
        ul {
          li {
            font-size: 3.6rem;
            line-height: 4.1rem;
          }
        }
      }
    }

    .user-operate-wrap {
      .operate-title {
        font-size: 6.9rem;
        margin-top: 2.5rem;
      }

      .operate-list {
        li {
          dd {
            margin-top: 3rem;

            span {
              font-size: 2.1rem;
              line-height: 2.7rem;
            }
          }
        }
      }
    }

    .cuxiao-wrap {
      .cuxiao-title {
        font-size: 7.3rem;
      }

      .desc {
        font-size: 3.1rem;
      }
    }

    .country-wrap {
      position: relative;

      .country-list {
        li {
          dd {
            margin-top: 1.7rem;
            font-size: 3.3rem;
            line-height: 3.2rem;
          }
        }
      }
    }

    .change-country-inner-wrap {
      dl {
        dd {
          .change-country-title {
            font-size: 5.3rem;
          }

          .desc {
            font-size: 3.1rem;
            line-height: 3rem;
            padding-right: 1.8rem;
          }
        }
      }
    }

    .introdution-wrap {
      .desc {
        width: 31.1rem;
        font-size: 4.8rem;
        line-height: 4.2rem;
        letter-spacing: 0.1rem;
      }
    }

    .contact-us {
      p {
        margin-top: 3rem;
        font-size: 5.7rem;
        line-height: 5.5rem;
      }

      .us-title {
        font-size: 7.4rem;
        line-height: 3.2rem;
      }
    }
  }

  .thai-lang-wrap {
    .about-us {
      .us-title {
        font-size: 9.2rem;
      }

      .us-desc {
        margin-top: 2vw;
        font-size: 3.1rem;
        line-height: 4.6rem;
        padding: 0 4.8rem;
      }
    }

    .lottery-list {
      .list-title {
        font-size: 13.4rem;
      }

      .list-wrap {
        ul {
          li {
            font-size: 3.6rem;
            line-height: 4.1rem;
          }
        }
      }
    }

    .user-operate-wrap {
      .operate-title {
        font-size: 6.9rem;
        margin-top: 2.5rem;
      }

      .operate-list {
        li {
          dd {
            margin-top: 3rem;

            span {
              font-size: 2.1rem;
              line-height: 2.7rem;
            }
          }
        }
      }
    }

    .cuxiao-wrap {
      .cuxiao-title {
        font-size: 7.3rem;
      }

      .desc {
        font-size: 3.1rem;
      }
    }

    .country-wrap {
      position: relative;

      .country-list {
        li {
          dd {
            margin-top: 1.7rem;
            font-size: 3.3rem;
            line-height: 3.2rem;
          }
        }
      }
    }

    .change-country-inner-wrap {
      dl {
        dd {
          .change-country-title {
            font-size: 5.3rem;
          }

          .desc {
            font-size: 3.1rem;
            line-height: 3.6rem;
            padding-right: 1.8rem;
          }
        }
      }
    }

    .introdution-wrap {
      .desc {
        width: 31.1rem;
        font-size: 4.8rem;
        line-height: 4.2rem;
        letter-spacing: 0.1rem;
      }
    }

    .contact-us {
      p {
        margin-top: 3rem;
        font-size: 5.7rem;
        line-height: 5.5rem;
      }

      .us-title {
        font-size: 7.4rem;
        line-height: 3.2rem;
      }
    }
  }

  // @media screen and (max-width: 1200px) {
  //   .hello {
  //     .left-sanjiao {
  //       width: 5vw;
  //       height: 5vw;
  //       margin-top: -2.5vw;
  //       left: 1vw;
  //     }

  //     .right-sanjiao {
  //       width: 5vw;
  //       height: 5vw;
  //       margin-top: -2.5vw;
  //       right: 1vw;
  //     }

  //     .banner-wrap {
  //       .p_button {
  //         button {
  //           width: 14.3vw;
  //           font-size: 2.8vw;
  //         }

  //         .reg {
  //           margin-right: 11.8vw;
  //         }
  //       }
  //     }

  //     .lottery-list {
  //       position: relative;

  //       .inner {
  //         top: 0;
  //       }

  //       .list-wrap {
  //         padding: 0 10vw;
  //         display: -webkit-box;
  //         -webkit-box-pack: center;

  //         ul {
  //           width: 39.8vw;
  //           padding: 0 3.4vw;
  //           list-style: none;

  //           &:first-child {
  //             border-right: solid 0.1vw #ffffff;
  //           }

  //           li {
  //             display: -webkit-box;
  //             -webkit-box-pack: justify;

  //             &:last-child {
  //               margin-bottom: 0;
  //             }

  //             span {
  //               display: block;
  //             }
  //           }
  //         }
  //       }
  //     }

  //     .user-operate-wrap {
  //       position: relative;

  //       .inner {
  //         top: 0;
  //       }

  //       .operate-list {
  //         margin-top: 6.8vw;
  //         display: -webkit-box;
  //         -webkit-box-pack: justify;

  //         li {
  //           width: 25%;

  //           dt {
  //             position: relative;
  //             display: -webkit-box;
  //             -webkit-box-pack: center;

  //             .operate-icon {
  //               width: 13.2vw;
  //               height: auto;
  //               display: inline-block;
  //             }

  //             .right-jiantou {
  //               position: absolute;
  //               height: 4.3vw;
  //               width: auto;
  //               right: -3.3vw;
  //               top: 50%;
  //               margin-top: -2.15vw;
  //             }
  //           }

  //           dd {
  //             display: -webkit-box;
  //             -webkit-box-orient: vertical;
  //             -webkit-box-align: center;
  //             -webkit-box-pack: center;
  //             border-right: solid 0.1vw #ffffff;

  //             span {
  //               display: block;
  //             }
  //           }

  //           &:last-child {
  //             dd {
  //               border-right: none;
  //             }
  //           }
  //         }
  //       }
  //     }

  //     .cuxiao-wrap {
  //       position: relative;

  //       .inner {
  //         top: 0;
  //       }

  //       .desc {
  //         line-height: 4.3vw;
  //         margin-top: 5vw;
  //         padding: 0 3vw;
  //       }
  //     }

  //     .country-wrap {
  //       position: relative;

  //       .inner {
  //         top: 19vw;
  //       }

  //       .country-list {
  //         display: -webkit-box;
  //         -webkit-box-pack: center;

  //         li {
  //           width: 19.1vw;
  //           margin-right: 4.3vw;
  //           cursor: pointer;

  //           &:last-child {
  //             margin-right: 0;
  //           }
  //         }
  //       }
  //     }

  //     .change-country-inner-wrap {
  //       position: relative;

  //       .laowo-wrap {
  //         .content .desc-img {
  //           width: 46.7vw;
  //           margin-top: 4vw;
  //           margin-bottom: 3vw;
  //         }
  //       }

  //       .yuenan-wrap {
  //         .content .desc-img {
  //           width: 47vw;
  //           margin-top: 7.7vw;
  //           margin-bottom: 4.4vw;
  //         }
  //       }

  //       .content {
  //         margin-top: 3vw;
  //       }

  //       .area-tag {
  //         bottom: 1vw;

  //         span {
  //           width: 2vw;
  //           height: 2vw;
  //         }
  //       }

  //       dl {
  //         dt {
  //           width: 47.1vw;
  //           float: left;
  //         }

  //         dd {
  //           padding-left: 47.1vw;

  //           p {
  //             text-align: left;
  //           }
  //         }
  //       }
  //     }

  //     .introdution-wrap {
  //       position: relative;

  //       >.inner {
  //         width: auto;
  //         left: 4.9vw;
  //         top: 9vw;
  //       }
  //     }

  //     .contact-us {
  //       position: relative;

  //       .inner {
  //         top: 0;
  //       }
  //     }
  //   }

  //   .normal-font-wrap {
  //     .about-us {
  //       .us-title {
  //         font-size: 8.3vw;
  //       }

  //       .us-desc {
  //         margin-top: 2.9vw;
  //         font-size: 2.2vw;
  //         line-height: 5.1vw;
  //         letter-spacing: 0.1vw;
  //         padding: 0 6.6vw;
  //       }
  //     }

  //     .lottery-list {
  //       .list-title {
  //         font-size: 10.8vw;
  //       }

  //       .list-wrap {
  //         margin-top: 0.9vw;

  //         ul {
  //           li {
  //             font-size: 2.9vw;
  //             line-height: 4.5vw;
  //           }
  //         }
  //       }
  //     }

  //     .user-operate-wrap {
  //       .operate-title {
  //         font-size: 6vw;
  //         margin-top: 3.3vw;
  //       }

  //       .operate-list {
  //         li {
  //           dd {
  //             margin-top: 6.7vw;

  //             span {
  //               font-size: 3.2vw;
  //               line-height: 3.9vw;
  //             }
  //           }
  //         }
  //       }
  //     }

  //     .cuxiao-wrap {
  //       .cuxiao-title {
  //         font-size: 6.7vw;
  //       }

  //       .desc {
  //         font-size: 2.2vw;
  //         // line-height: 4.3vw;
  //         // margin-top:5vw;
  //         // padding:0 3.1vw;
  //       }
  //     }

  //     .country-wrap {
  //       .country-list {
  //         li {
  //           dd {
  //             margin-top: 1.3vw;
  //             font-size: 3vw;
  //             line-height: 4.3vw;
  //           }
  //         }
  //       }
  //     }

  //     .change-country-inner-wrap {
  //       dl {
  //         dd {
  //           .change-country-title {
  //             font-size: 5vw;
  //             margin-bottom: 0;
  //           }

  //           .desc {
  //             font-size: 2.7vw;
  //             line-height: 4vw;
  //             padding-right: 7.7vw;
  //           }
  //         }
  //       }
  //     }

  //     .introdution-wrap {
  //       position: relative;

  //       .desc {
  //         width: 41.4vw;
  //         font-size: 4vw;
  //         line-height: 5.3vw;
  //         letter-spacing: 0.1vw;
  //       }
  //     }

  //     .contact-us {
  //       p {
  //         margin-top: 4.8vw;
  //         font-size: 5.6vw;
  //         line-height: 7.3vw;
  //       }

  //       .us-title {
  //         height: auto;
  //         font-size: 6.8vw;
  //         line-height: 4.3vw;
  //       }
  //     }
  //   }

  //   .chinese-lang-wrap {
  //     .about-us {
  //       .us-title {
  //         font-size: 8.3vw;
  //       }

  //       .us-desc {
  //         margin-top: 2.9vw;
  //         font-size: 2.2vw;
  //         line-height: 5.1vw;
  //         letter-spacing: 0.1vw;
  //         padding: 0 6.6vw;
  //       }
  //     }

  //     .lottery-list {
  //       .list-title {
  //         font-size: 10.8vw;
  //       }

  //       .list-wrap {
  //         margin-top: 0.9vw;

  //         ul {
  //           li {
  //             font-size: 2.9vw;
  //             line-height: 4.5vw;
  //           }
  //         }
  //       }
  //     }

  //     .user-operate-wrap {
  //       .operate-title {
  //         font-size: 6vw;
  //         margin-top: 3.3vw;
  //       }

  //       .operate-list {
  //         li {
  //           dd {
  //             margin-top: 6.7vw;

  //             span {
  //               font-size: 3.2vw;
  //               line-height: 3.9vw;
  //             }
  //           }
  //         }
  //       }
  //     }

  //     .cuxiao-wrap {
  //       .cuxiao-title {
  //         font-size: 6.7vw;
  //       }

  //       .desc {
  //         font-size: 2.2vw;
  //         // line-height: 4.3vw;
  //         // margin-top:5vw;
  //         // padding:0 3.1vw;
  //       }
  //     }

  //     .country-wrap {
  //       .country-list {
  //         li {
  //           dd {
  //             margin-top: 1.3vw;
  //             font-size: 3vw;
  //             line-height: 4.3vw;
  //           }
  //         }
  //       }
  //     }

  //     .change-country-inner-wrap {
  //       dl {
  //         dd {
  //           .change-country-title {
  //             font-size: 6vw;
  //           }

  //           .desc {
  //             font-size: 2.7vw;
  //             line-height: 4vw;
  //             padding-right: 7.7vw;
  //           }
  //         }
  //       }
  //     }

  //     .introdution-wrap {
  //       position: relative;

  //       .desc {
  //         width: 41.4vw;
  //         font-size: 4vw;
  //         line-height: 5.3vw;
  //         letter-spacing: 0.1vw;
  //       }
  //     }

  //     .contact-us {
  //       p {
  //         margin-top: 4.8vw;
  //         font-size: 5.6vw;
  //         line-height: 7.3vw;
  //       }

  //       .us-title {
  //         height: auto;
  //         font-size: 6.8vw;
  //         line-height: 4.3vw;
  //       }
  //     }
  //   }

  //   .thai-lang-wrap {
  //     .about-us {
  //       .us-title {
  //         font-size: 12.3vw;
  //       }

  //       .us-desc {
  //         margin-top: 0;
  //         font-size: 4.2vw;
  //         line-height: 6.1vw;
  //         padding: 0 6.4vw;
  //       }
  //     }

  //     .lottery-list {
  //       .list-title {
  //         font-size: 17.8vw;
  //       }

  //       .list-wrap {
  //         ul {
  //           li {
  //             font-size: 4.9vw;
  //             line-height: 5.5vw;
  //           }
  //         }
  //       }
  //     }

  //     .user-operate-wrap {
  //       .operate-title {
  //         font-size: 9.2vw;
  //         margin-top: 2.3vw;
  //       }

  //       .operate-list {
  //         li {
  //           dd {
  //             margin-top: 3.7vw;

  //             span {
  //               font-size: 4.2vw;
  //               line-height: 4.9vw;
  //             }
  //           }
  //         }
  //       }
  //     }

  //     .cuxiao-wrap {
  //       .cuxiao-title {
  //         font-size: 9.7vw;
  //       }

  //       .desc {
  //         font-size: 4.2vw;
  //         // line-height: 4.3vw;
  //         // margin-top:5vw;
  //         // padding:0 3vw;
  //       }
  //     }

  //     .country-wrap {
  //       position: relative;

  //       .country-list {
  //         li {
  //           dd {
  //             margin-top: 1.3vw;
  //             font-size: 4.5vw;
  //             line-height: 4.3vw;
  //           }
  //         }
  //       }
  //     }

  //     .change-country-inner-wrap {
  //       dl {
  //         dd {
  //           .change-country-title {
  //             font-size: 6.3vw;
  //           }

  //           .desc {
  //             font-size: 2.7vw;
  //             line-height: 4vw;
  //             padding-right: 7.7vw;
  //           }
  //         }
  //       }
  //     }

  //     .introdution-wrap {
  //       .desc {
  //         width: 41.4vw;
  //         font-size: 5.4vw;
  //         line-height: 6.3vw;
  //         letter-spacing: 0.1vw;
  //       }
  //     }

  //     .contact-us {
  //       p {
  //         margin-top: 4.8vw;
  //         font-size: 7.6vw;
  //         line-height: 7.3vw;
  //       }

  //       .us-title {
  //         font-size: 9.8vw;
  //         line-height: 4.3vw;
  //       }
  //     }
  //   }
  // }

</style>
