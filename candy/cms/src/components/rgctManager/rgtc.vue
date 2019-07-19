<!--人工提出-->
<template>
  <div class="el-custom">
    <div class="content-header">
      <div class="title">
        <h2>{{titleName}}</h2>
      </div>
      <div class="search-wrap">
        <div class="nav-title">
          <span :class="item.checked?'current':''" v-for="(item, index) in routerArr" :key="index" @click="handleChangeRouter(item.name)">{{item.title}}</span>
        </div>
        <div class="search-content">
          <div class="rgcr-content" v-loading="loading">
            <div class="tl clearfix content-row">
              <span class="exp">User name</span>
              <span>:</span>
              <el-input type="text" v-model.trim="ruleForm.loginname" style="width:114px;"></el-input>
              <el-button type="primary" @click="searchLoginname()" class="yes small" style="margin-left:30px;">Search</el-button>
            </div>
            <div v-if="hasLoginname">
              <div class="tl content-row pt-30 line-top">
                <span class="exp">User type</span>
                <span>:</span>
                <span class="warning-color cont">{{user.type | filterType}}</span>
              </div>
              <div class="tl content-row">
                <span class="exp">User name</span>
                <span>:</span>
                <span class="warning-color cont">{{user.loginname}}</span>
              </div>
              <div class="tl content-row line-down">
                <span class="exp">Balance</span>
                <span>:</span>
                <span class="warning-color cont">{{user.cash}}</span>
              </div>
              <div class="tl content-row mt-30">
                <span class="exp">Deduction type</span>
                <span>:</span>
                <el-select clearable v-model="ruleForm.type.value" placeholder="type" class="small">
                  <el-option v-if="item.label === '手动申请出款'" v-for="item in ruleForm.type.options" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </div>
              <div v-show="ruleForm.type.value">
                <div class="tl content-row">
                  <span class="exp">Amount</span>
                  <span>:</span>
                  <el-input v-model.trim="ruleForm.amount" style="width:114px;"></el-input>
                </div>
                <div class="tl content-row">
                  <span class="exp">Remark</span>
                  <span>:</span>
                  <el-input v-model.trim="ruleForm.message" style="width:228px;"></el-input>
                </div>
                <!-- <div class="tl content-row">
                <span class="exp">备注：</span>
                <el-input type="text" v-model="ruleForm.message" placeholder="备注" style="width:300px"></el-input>
              </div> -->
                <div class="tl content-row clearfix">
                  <el-button type="primary" @click="recharge()" class="yes fr" :disabled="disabled">Confirm</el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import request from "@/axios/axios.js";
  import {
    trim,
    price
  } from '@/lib/utils/validator';
  export default {
    name: 'rgtc',
    data() {
      return {
        disabled: false,
        index1: 0,
        index2: 0,
        titleName: '',
        routerArr: [],
        ruleForm: {
          loginname: "", // 用户名
          amount: "", // 存入金额
          // 类型
          type: {
            options: [{
              label: '手动申请出款',
              value: 15,
            }, {
              label: '人工撤销-派奖',
              value: 11,
            }, {
              label: '人工撤销-返点',
              value: 13,
            }, {
              label: '人工撤销-分红',
              value: 30,
            }, {
              label: '人工撤销-其他',
              value: 64,
            }],
            value: ""
          },
          message: "", // 备注
        },
        rechargeType: '充值',
        duration: 1000,
        hasLoginname: false,
        hasTypeSearched: false,
        user: {
          type: '',
          cash: '',
          loginname: ""
        },
        loading: false,
      }
    },
    created() {
      this.routerArr = [];
      let query = this.$route.query;
      this.index1 = Number(query.index1);
      this.index2 = Number(query.index2);
      let data = this.$store.state.formatMenuFn(this.index1, this.index2, 'rgtc');
      this.routerArr = data.routerArr;
      this.titleName = data.titleName;
    },
    filters: {
      filterType: function (value) {
        if (value) {
          return "Member";
        }
        return "Agent";
      }
    },
    watch: {
      "ruleForm.amount"() {
        if (this.ruleForm.amount) {
          let cash = this.user.cash;
          if (parseFloat(this.ruleForm.amount) > parseFloat(cash)) {
            this.ruleForm.amount = "";
          }
        }
      }
    },
    methods: {
      handleChangeRouter(name) {
        this.$router.push({
          name: name,
          query: {
            index1: this.index1,
            index2: this.index2
          }
        })
      },
      success() {
        const vm = this;
        this.$message({
          message: 'Load Success',
          type: 'success',
          duration: vm.duration,
          center: true
        })
      },
      error() {
        const vm = this;
        this.$message({
          message: 'Load Failure',
          type: 'error',
          duration: vm.duration,
          center: true
        })
      },
      rechargeFn() {
        const vm = this;
        let data = {
          loginname: vm.ruleForm.loginname,
          type: vm.ruleForm.type.value,
          amount: vm.ruleForm.amount,
          message: vm.ruleForm.message,
        };
        request.http(
          'post',
          '/trade/user/cash/decrease',
          data,
          (success) => {
            let code = success.returncode;
            if (code === 200) {
              vm.$message({
                message: 'success',
                type: 'success',
                duration: vm.duration,
                center: true
              })
              vm.resetForm();
            } else if (code === 101 || code === 103 || code === 106) {
              request.loginAgain(vm)
            } else {
              alert(success.returncode)
            }
          },
          (error) => {
            vm.error();
            console.log(error)
          }
        )
      },
      resetForm() {
        this.ruleForm.loginname = "";
        this.ruleForm.type.value = "";
        this.ruleForm.amount = "";
        this.ruleForm.message = "";
        this.user.cash = "";
        this.user.type = "";
        this.user.loginname = "";
        this.hasLoginname = false;
      },
      // 充值
      recharge() {
        const vm = this;
        vm.disabled = true;
        setTimeout(() => {
          vm.disabled = false;
        }, 1000);
        if (!vm.ruleForm.loginname) {
          this.$message({
            message: 'please input user name',
            type: 'error',
            duration: vm.duration,
            center: true
          })
          return;
        }
        if (!vm.ruleForm.type.value) {
          this.$message({
            message: 'please select user type',
            type: 'error',
            duration: vm.duration,
            center: true
          })
          return;
        }
        if (!vm.ruleForm.amount) {
          this.$message({
            message: 'please input amount',
            type: 'error',
            duration: vm.duration,
            center: true
          })
          return;
        }
        if (!price(vm.ruleForm.amount)) {
          this.$message({
            message: 'Incorrect amount format',
            type: 'error',
            duration: vm.duration,
            center: true
          })
          return;
        }
        if (!vm.ruleForm.message) {
          this.$message({
            message: 'please input remark',
            type: 'error',
            duration: vm.duration,
            center: true
          })
          return;
        }
        vm.rechargeFn();
      },
      // 查询当前用户存在否
      searchLoginname() {
        const vm = this;
        if (!vm.ruleForm.loginname) {
          this.$message({
            message: 'please input user name',
            type: 'error',
            duration: vm.duration,
            center: true
          })
          return;
        }
        vm.loading = true;
        request.http(
          'get',
          '/user/list', {
            loginname: trim(vm.ruleForm.loginname),
          },
          (success) => {
            vm.loading = false;
            let code = success.returncode;
            if (code === 200) {
              if (success.count != 0) {
                vm.hasLoginname = true;
                let data = success.data[0];
                vm.user.cash = Number(data.cash).toFixed(2);
                vm.user.type = data.type;
                vm.user.loginname = data.loginname;
              } else {
                vm.hasLoginname = false;
                vm.$message({
                  message: 'No this user',
                  type: 'error',
                  duration: vm.duration,
                  center: true
                })
              }
            } else if (code === 101 || code === 103 || code === 106) {
              vm.hasLoginname = false;
              request.loginAgain(vm)
            } else {
              vm.hasLoginname = false;
              vm.$message({
                message: 'No this user',
                type: 'error',
                duration: vm.duration,
                center: true
              })
            }
          },
          (error) => {
            vm.loading = false;
            vm.hasLoginname = false;
            vm.error();
          }
        )
      },
    }
  }

</script>
<style scoped>
  /* @import '../../publicCss/header.css '; */

  .warning-color {
    color: #C83A4C;
  }

  .fr {
    float: right;
  }

  .tl {
    text-align: left;
  }

  .line-down {
    border-bottom: 1px solid #ddd;
  }

  .line-top {
    border-top: 1px solid #ddd;
  }

  .pt-30 {
    padding-top: 30px;
  }

  .mt-30 {
    margin-top: 30px;
  }

  .rgcr-content {
    margin-bottom: 30px;
    width: 100%;
  }

  .rgcr-content .content-row {
    padding-bottom: 30px;
  }

  .exp {
    font-size: 12px;
    color: #191919;
    width: 60px;
    margin-right: 5px;
    display: inline-block;
    text-align: justify;
    text-align-last: justify;
  }

  .demo-ruleForm {
    margin-top: 20px;
  }

  .cont {
    font-size: 12px;
  }

</style>
