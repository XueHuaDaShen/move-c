<template>
  <div class="joinUs limit-width">
    <div class="title"><img :src="joinUs" alt=""></div>
    <div class="content">
      <div class="title-img"><img :src="banner" alt=""></div>
      <el-row :gutter="10">
        <el-col :span="4">
          <div class="left">
            <div class="top">
              <h5>加入虹星</h5>
              <ul>
                <li v-for="(item, i) in joinUsList" :key="i" :class="tag == item.name ? 'active' : ''" @click="changePeople(item.name)">{{item.name}}</li>
              </ul>
            </div>
            <div class="bot">
              <h5>联系我们</h5>
              <p>{{email}}</p>
              <p>{{phone}}</p>
            </div>
          </div>
        </el-col>
        <el-col :span="20">
          <div class="right">
            <div class="fuli" v-show="tag == '福利待遇'">
              <h5>{{joinData.name}}</h5>
              <div class="wrap">
                <div class="inner clear-float" v-for="(item, i) in joinData.list" :key="i">
                  <div class="item" v-for="(v, k) in item" :key="k">
                    <span><img :src="v.img" alt=""></span>
                    <p>{{v.name}}</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="zhaopin" v-show="tag == '社会招聘' || tag == '校园招聘'">
              <h5>{{joinData.name}}</h5>
              <div class="wrap">
                <ul>
                  <li class="table-title">
                    <div class="title"><span v-for="(tit, t) in joinData.titleList" :key="t">{{tit.val}}</span></div>
                  </li>
                  <li v-for="(job, j) in joinData.job" :key="j">
                    <div class="title" @click="changeJob(job)"><span v-for="(tit, t) in joinData.titleList" :key="t">{{job[tit.key]}}</span></div>
                    <div class="work" v-show="job.workShow">
                      <div class="inner" v-for="(work, w) in job.work" :key="w">
                        <p>{{work.name}}：</p>
                        <p v-for="(p, pi) in work.data" :key="pi">{{p}}</p>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div class="join-us" v-show="tag == '办公环境'">
              <div v-for="(item, i) in joinData.data" :key="i">
                <img :src="item.img" alt="">
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import joinUsList from './joinUsList'
export default {
  name: 'joinUs',
  data() {
    return {
      joinUs: require('@/assets/img/title/joinUs.png'),
      banner: require('@/assets/img/joinUs/banner.png'),
      joinUsList: joinUsList,
      type: '',
      joinData: null,
      workShowIndex: '',
      email: 'hr@iristar.com.cn',
      phone: '010-82087021'
    }
  },
  created() {
    let joinType = localStorage.getItem('joinType') || '福利待遇';
    this.tag = joinType;
    this.changePeople(this.tag);
  },
  mounted() {
  },
  computed: {},
  watch: {},
  methods: {
    changePeople(tag) {
      this.tag = tag;
      localStorage.setItem('joinType', tag)
      this.joinData = this.joinUsList.filter(v => v.name === tag)[0];
    },
    changeJob(job) {
      job.workShow = !job.workShow;
    }
  },
}
</script>
<style lang="scss" scoped>
.joinUs{
  color:#666;
  background:#f7f7f7;
  .content{
    padding:.25rem 1rem;
    text-align:left;
    padding-top:0;
  }
  .title-img{
    margin:0 auto;
    margin-bottom:.3rem;
    img{
      width:100%;
    }
  }
  h5{
    padding:.15rem 0;
  }
  .left{
    .top{
      background:#fff;
      padding:0 .25rem .25rem;
      li{
        text-align:center;
        padding:.2rem 0;
        color: #769bf6;
        border:1px solid #769bf6;
        border-radius:5px;
        cursor: pointer;
      }
      li.active{
        background:#769bf6;
        color:#fff;
      }
      li+li{
        margin-top:.05rem;
      }
    }
    .bot{
      background:#fff;
      margin-top:.2rem;
      padding:0 .25rem .25rem;
      p{
        margin:.15rem 0;
      }
    }
  }
  .right{
    background:#fff;
    h5{
      padding-left:.2rem;
    }
    .fuli{
      .wrap{
        .item{
          float: left;
          text-align:center;
          margin:3.3% 6.65%;
          width:11.7%;
          span{
            display:block;
            margin-bottom:.2rem;
            img{
              width:100%;
            }
          }
        }
      }
    }
    .zhaopin{
      padding:0  0 .25rem 0;
      .wrap{
        padding:0 .25rem;
        .table-title{
          .title{
            cursor: inherit;
          }
        }
        li{
          width:100%;
          .title{
            width:100%;
            padding:.1rem 0;
            display:table;
            border-bottom:1px solid #ccc;
            cursor: pointer;
            user-select: none;
          }
          .work{
            padding:.15rem 0;
            border-bottom:1px solid #ccc;
            // display: none;
            .inner+.inner{
              margin-top:.2rem;
            }
          }
          span{
            &:first-child{
              width:40%;
              float: left;
            }
            &:nth-child(2) {
              width:20%;
              float: left;
              text-align:center;
            }
            &:last-child{
              width:30%;
              float: right;
              text-align:center;
            }
          }
        }
      }
    }
    .join-us{
      padding: .2rem 0;
      >div{
        text-align:center;
        margin-bottom:.2rem;
        img{
          width:9rem;
          height:auto;
        }
      }
    }
  }
}
</style>

