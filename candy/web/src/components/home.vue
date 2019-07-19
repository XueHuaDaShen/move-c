<template>
  <div class="hello">
    <div class="banner-wrap">
      <div class="banner-text">
        <p class="p_king">{{$t("message.banner_king").toUpperCase()}}</p>
        <p class="p_text">
          <span class="text-color">{{$t("message.banner_text_color")}}</span>
          {{$t("message.banner_text_default")}}
        </p>
        <p class="p_english">{{$t("message.banner_text_english").toUpperCase()}}</p>
        <p class="p_button" v-if="!login">
          <button class="reg" @click="toReg">{{$t("message.zhu_ce")}}</button>
          <button class="log" @click="toLog">{{$t("message.deng_lu")}}</button>
        </p>
      </div>
    </div>
    <div class="about-us">
      <div class="width-1200">
        <p class="us-title">{{$t("message.guan_yu_wo_men")}}</p>
        <p class="us-desc">{{$t("message.guan_yu_wo_men_desc")}}</p>
      </div>
    </div>
    <div class="lottery-kind-of-wrap">
      <div class="width-1200">
        <div class="lottery-nav">
          <ul class="lottery-kind-of-list">
            <li :class="item[key_lang] === kindName ? 'active':''" v-for="(item, index) in lotteryList" :key="index"
              @click="changeNav(item, index)">
              <em></em>
              <img v-if="item.code === 'thailotto'" src="@/assets/img/thailotto.png">
              <img v-if="item.code === 'laoslotto'" src="@/assets/img/laoslotto.png">
              <img v-if="item.code === 'vietnamlotto'" src="@/assets/img/vietnamlotto.png">
              <img v-if="item.code === 'quicklotto'" src="@/assets/img/quicklotto.png">
              <span>{{$t("message."+item.code)}}</span>
            </li>
          </ul>
          <div class="nav-tag-wrap">
            <span :class="tagName"></span>
          </div>
        </div>
        <dl class="lottery-desc" v-if="item[key_lang] === kindName" v-for="(item, index) in lotteryList" :key="index">
          <dt>
            <img src="@/assets/img/cai_piao_desc.png">
          </dt>
          <dd>
            <h2>{{$t("message."+lotteryKindOf[index]+"_title")}}</h2>
            <p class="desc">{{$t("message."+lotteryKindOf[index]+"_desc")}}</p>
            <p class="add" v-for="i in 4" :key="i">{{$t("message."+lotteryKindOf[index]+"_add")}}</p>
          </dd>
        </dl>
        <div class="lottery-bj-shadow"></div>
      </div>
    </div>
    <div class="activity-wrap">
      <div class="width-1200">
        <p class="huo-dong-cu-xiao">{{$t("message.huo_dong_cu_xiao")}}</p>
        <p class="huo-dong-cu-xiao-desc">{{$t("message.huo_dong_cu_xiao_desc")}}</p>
        <ul class="activity-list">
          <li v-for="(list, l) in activityList" :key="l">
            <div class="activity-title">
              <img src="@/assets/img/bell.png" class="bell">
              <span class="title-text">{{list.title}}</span>
            </div>
            <dl>
              <dt>
                <img :src="list.activity_photo">
              </dt>
              <dd>
                <p class="title">{{list.title}}</p>
                <p class="desc" v-html="list.content"></p>
              </dd>
            </dl>
            <div class="btn-box">
              <button class="li-ji-can-jia">{{$t("message.li_ji_can_jia")}}</button>
            </div>
          </li>
          <!-- <li>
            <div class="activity-title">
              <img src="@/assets/img/bell.png" class="bell">
              <span class="title-text">{{$t("message.huo_dong_er")}}</span>
            </div>
            <dl>
              <dt>
                <img src="@/assets/img/activity2.png">
              </dt>
              <dd>
                <p class="title">{{$t("message.huo_dong_er_title")}}</p>
                <p class="desc">{{$t("message.huo_dong_er_desc")}}</p>
                <button class="li-ji-can-jia">{{$t("message.li_ji_can_jia")}}</button>
              </dd>
            </dl>
          </li>-->
        </ul>
      </div>
    </div>
    <div class="contact-us">
      <p class="us-title">{{$t("message.lian_xi_wo_men")}}</p>
      <p class="us-desc">{{$t("message.lian_xi_wo_men_desc")}}</p>
    </div>
    <!-- <el-button size="small" round @click="changeLanguage">切换语言</el-button> -->
  </div>
</template>

<script>
  import config from "@/http/config";
  export default {
    name: "home",
    data() {
      return {
        consoleFn: this.$store.state.consoleFn,
        msg: "欢迎来到中国",
        key_lang: "",
        lotteryKindOf: [
          "guo_jia_cai_piao",
          "shi_shi_cai",
          "lao_wo_cai_piao",
          "yua_nan_cai_piao"
        ],
        kindName: "guo_jia_cai_piao",
        tagName: "tag0",
        login: false,
        activityList: [],
        lotteryList: []
      };
    },
    watch: {
      $route(t, f) {
        // console.log(t, f)
        this.login = localStorage.getItem("candy-login") === "true";
      }
    },
    created() {
      let local_lang = this.$i18n.locale;
      if (local_lang === "th") {
        this.key_lang = "name_th";
      } else {
        this.key_lang = "name_cn";
      }
      let url = sessionStorage.getItem("th_tag_url");
      if (url) {
        this.$router.push({
          name: url
        });
      }
      this.getLotteryKind();
      this.getActivityList();
    },
    mounted() {
      this.login = localStorage.getItem("candy-login") === "true";
    },
    methods: {
      // 彩票列表
      getLotteryKind() {
        this.$http
          .get("/lottery/list", {})
          .then(res => {
            this.consoleFn(res);
            let code = res.data.returncode;
            let data = res.data.data;
            if (code == 200) {
              this.lotteryList = data;
              this.changeNav(data[0], 0);
            } else {
              this.lotteryList = [];
            }
          })
          .then(error => {
            this.consoleFn(error);
          });
      },
      // 活动列表
      getActivityList() {
        this.$http
          .get("/activity/list", {
            params: {
              title: ""
            }
          })
          .then(res => {
            if (res.data.returncode == 200) {
              this.activityList = res.data.data.data;
            } else {
              this.activityList = [];
            }
            // this.consoleFn(res)
          })
          .then(err => {});
      },
      changeLanguage() {
        let language = this.$i18n.locale;
        this.consoleFn(this.$t("message"));
        if (language === "zh") {
          this.$i18n.locale = "th";
          localStorage.setItem("candy-locale", "th");
        } else {
          this.$i18n.locale = "zh";
          localStorage.setItem("candy-locale", "zh");
        }
      },
      changeNav(item, index) {
        this.kindName = item[this.key_lang];
        this.tagName = "tag" + index;
      },
      toReg() {
        this.$router.push("/reg/3qjrntu5t");
      },
      toLog() {
        this.$router.push({
          name: "login"
        });
      }
    }
  };

</script>

<style lang="scss" scoped>
  .banner-wrap {
    position: relative;
    width: 100%;
    height: calc(100vh - 122px);
    // background-image: url(http://placehold.it/1920x830);
    background-image: url("../assets/img/banner.png");
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;

    .banner-text {
      width: 100%;
      position: absolute;
      left: 0;
      top: 0;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-box-align: center;
      -webkit-box-pack: center;
      color: #fff;

      p {
        padding: 0;
        margin: 0;
      }

      .p_king {
        font-size: 30px;
        margin-top: 230px;
        // margin-top:5.1%;
      }

      .p_text {
        font-size: 85px;
        margin-top: 30px;
        // margin-top:.7%;
        letter-spacing: 1px;

        .text-color {
          color: #c59a37;
        }
      }

      .p_english {
        font-size: 20px;
        margin-top: 30px;
        // margin-top:.7%;
      }

      .p_button {
        margin-top: 100px;
        display: -webkit-box;
        -webkit-box-pack: justify;

        // margin-top:2.2%;
        button {
          border: none;
          outline: none;
          width: 180px;
          height: 60px;
          // width:1.8rem;
          // height:.6rem;
          font-size: 18px;
          color: #fff;
          cursor: pointer;
        }

        .reg {
          background: rgba(197, 154, 55, 0.1);
          border: 2px solid #c59a37;
          margin-right: 77px;
          color: #c59a37;
          // margin-bottom:10px;
        }

        .log {
          background: rgba(255, 255, 255, 0.1);
          border: 2px solid #ffffff;
        }
      }
    }
  }

  .width-1200 {
    max-width: 1200px;
    margin: 0 auto;
  }

  .about-us,
  .contact-us {
    background: #252525;
    padding: 102px 0;

    .us-title {
      text-align: center;
      font-size: 20px;
      color: #ffffff;
    }

    .us-desc {
      max-width: 1058px;
      padding: 0 10px;
      text-indent: 1em;
      margin: 0 auto;
      font-size: 14px;
      color: #ffffff;
      letter-spacing: 1.56px;
      text-align: center;
      margin-top: 60px;
      line-height: 40px;
    }
  }

  .lottery-bj-shadow {
    width: 100%;
    height: 200px;
    position: absolute;
    z-index: 1;
    left: 0;
    bottom: 0;
    background-image: linear-gradient(-180deg, rgba(0, 0, 0, 0) 0%, #000000 100%);
  }

  .huo-dong-cu-xiao {
    text-align: center;
    font-size: 20px;
    color: #fff;
  }

  .huo-dong-cu-xiao-desc {
    max-width: 970px;
    font-size: 14px;
    margin: 0 auto;
    color: #ffffff;
    letter-spacing: 1.56px;
    text-align: center;
    line-height: 50px;
    padding-top: 40px;
    padding-bottom: 63px;
  }

  .lottery-kind-of-wrap {
    position: relative;
    width: 100%;
    padding: 120px 0;
    background: #1e1e1e;

    .lottery-nav {
      // max-width:1200px;
      width: 100%;
      padding: 0 10px;
      margin: 0 auto;
      position: relative;
      z-index: 2;
      margin-bottom: 80px;

      .lottery-kind-of-list {
        width: 100%;
        margin-bottom: 30px;
        display: -webkit-box;

        li {
          width: 25%;
          cursor: pointer;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-box-align: center;
          -webkit-box-pack: center;

          img {
            width: 40%;
            height: auto;
            margin-bottom: 30px;
          }

          span {
            color: #fff;
            display: block;
            font-size: 20px;
          }
        }

        li.active {
          span {
            color: #c59a37;
          }
        }
      }

      .nav-tag-wrap {
        position: relative;
        width: 100%;
        height: 6px;
        background: #252525;

        span {
          position: absolute;
          bottom: 0;
          width: 25%;
          height: 100%;
          background: #c59a37;
          transition: all 0.3s;
        }

        .tag0 {
          left: 0;
        }

        .tag1 {
          left: 25%;
        }

        .tag2 {
          left: 50%;
        }

        .tag3 {
          left: 75%;
        }
      }
    }

    .lottery-desc {
      // max-width:1200px;
      width: 100%;
      padding: 0 10px;
      margin: 0 auto;

      dt {
        float: left;
        margin-right: 69px;

        img {
          max-width: 500px;
          height: auto;
        }
      }

      dd {
        h2 {
          font-size: 18px;
          color: #fff;
          font-weight: normal;
          text-align: left;
        }

        p.desc {
          font-size: 14px;
          color: #ffffff;
          text-align: left;
          line-height: 40px;
          margin: 30px 0;
          padding-right: 138px;
        }

        p.add {
          font-size: 14px;
          color: #777777;
          text-align: left;
          line-height: 30px;
        }
      }
    }

    .lottery-bj-shadow {
      width: 100%;
      height: 200px;
      position: absolute;
      z-index: 1;
      left: 0;
      bottom: 0;
      background-image: linear-gradient(-180deg,
        rgba(0, 0, 0, 0) 0%,
        #000000 100%);
    }
  }

  .activity-wrap {
    width: 100%;
    padding-top: 102px;
    // padding-bottom:130px;
    background: #1e1e1e;

    .huo-dong-cu-xiao {
      text-align: center;
      font-size: 20px;
      color: #fff;
    }

    .huo-dong-cu-xiao-desc {
      max-width: 970px;
      font-size: 14px;
      margin: 0 auto;
      color: #ffffff;
      letter-spacing: 1.56px;
      text-align: center;
      line-height: 50px;
      margin-top: 40px;
      padding-bottom: 63px;
    }

    .activity-list {
      // max-width:1200px;
      width: 100%;
      padding: 0 10px;
      margin: 0 auto;

      li {
        // padding-bottom:195px;
        position: relative;

        &:last-child {
          // padding-bottom:0;
        }

        .activity-title {
          position: relative;
          margin-bottom: 71px;

          .bell {
            position: absolute;
            left: 0;
            top: -10px;
            width: 72px;
            height: auto;
          }

          .title-text {
            display: block;
            width: 200px;
            height: 58px;
            line-height: 58px;
            text-align: center;
            border: 2px solid #c59a37;
            box-shadow: 0 30px 50px 0 rgba(0, 0, 0, 0.3);
            font-size: 20px;
            border-radius: 0 100px 100px 0;
            color: #c59a37;
            margin-left: 35px;
          }
        }

        dl {
          display: table;
          width: 100%;
          height: auto;
        }

        dt {
          float: left;
          margin-right: 30px;

          img {
            max-width: 600px;
            height: auto;
          }
        }

        dd {
          p.title {
            font-size: 30px;
            padding-right: 160px;
            color: #c59a37;
            font-weight: normal;
            text-align: left;
            line-height: 45px;
          }

          p.desc {
            font-size: 14px;
            color: #ffffff;
            text-align: left;
            line-height: 40px;
            margin-top: 30px;
            padding-right: 104px;
          }
        }

        .btn-box {
          width: 100%;
          display: -webkit-box;
          -webkit-box-pack: center;
          margin-top: 60px;
          padding-bottom: 75px;
        }

        button {
          border: 2px solid #c59a37;
          width: 180px;
          height: 60px;
          font-size: 18px;
          color: #c59a37;
          background: #1f1f1f;
          cursor: pointer;
          display: block;
          // margin-left:40px;
          // margin-left:20%;
          // margin-top:60px;
        }
      }
    }
  }

  @media screen and (max-width: 768px) {
    .banner-wrap {
      .banner-text {
        .p_king {
          margin-top: 120px;
          font-size: 20px;
        }

        .p_text {
          font-size: 47px;
          // margin-top:20px;
        }

        .p_english {
          font-size: 15px;
          // margin-top:20px;
        }

        .p_button {
          // margin-top:20px;
          margin-top: 60px;

          button {
            width: 120px;
            height: 40px;
            font-size: 16px;
          }

          .reg {
            background: rgba(197, 154, 55, 0.1);
            border: 2px solid #c59a37;
            margin-right: 45px;
            color: #c59a37;
            margin-bottom: 10px;
          }
        }
      }
    }

    .about-us,
    .contact-us {
      padding: 30px 0;

      .us-title {
        font-size: 16px;
      }

      .us-desc {
        font-size: 12px;
        margin-top: 20px;
      }
    }

    .lottery-kind-of-wrap {
      padding: 50px 0;

      .lottery-nav {
        margin-bottom: 10px;

        .lottery-kind-of-list {
          margin-bottom: 10px;

          li {
            img {
              width: 50%;
              height: auto;
              margin-bottom: 10px;
            }

            span {
              font-size: 14px;
            }
          }

          li.active {
            span {
              color: #c59a37;
            }
          }
        }
      }

      .lottery-desc {
        dt {
          float: left;
          padding: 20px;
          margin: 0 auto;

          img {
            max-width: 500px;
            height: auto;
          }
        }

        dd {
          h2 {
            font-size: 16px;
            padding-left: 20px;
          }

          p {
            padding: 20px;
          }

          p.desc {
            font-size: 14px;
            color: #ffffff;
            text-align: left;
            line-height: 40px;
            margin: 0 0;
            padding-right: 10px;
          }

          p.add {
            font-size: 14px;
            color: #777777;
            text-align: left;
            line-height: 30px;
            padding: 0 20px;
          }
        }
      }

      .lottery-bj-shadow {
        width: 100%;
        height: 200px;
        position: absolute;
        z-index: 1;
        left: 0;
        bottom: 0;
        background-image: linear-gradient(-180deg,
          rgba(0, 0, 0, 0) 0%,
          #000000 100%);
      }
    }

    .activity-wrap {
      padding-top: 30px;

      .huo-dong-cu-xiao {
        font-size: 18px;
      }

      .huo-dong-cu-xiao-desc {
        font-size: 12px;
        margin-top: 10px;
        padding-bottom: 15px;
        line-height: 30px;
      }

      .activity-list {
        li {

          // padding-bottom:50px;
          &:last-child {
            // padding-bottom:0;
          }

          .activity-title {
            margin-bottom: 30px;
            left: 10px;

            .bell {
              width: 52px;
            }

            .title-text {
              display: block;
              width: 115px;
              height: 40px;
              line-height: 40px;
              font-size: 14px;
            }
          }

          dt {
            padding: 10px;
            margin: 0 auto;
          }

          dd {
            p {
              padding: 20px;
            }

            p.title {
              font-size: 24px;
              padding-right: 20px;
              line-height: 45px;
            }

            p.desc {
              font-size: 12px;
              margin-top: 0;
              padding-right: 20px;
            }

            button {
              font-size: 16px;
              margin-top: 20px;
              margin-left: 0;
            }
          }
        }
      }
    }
  }

</style>
