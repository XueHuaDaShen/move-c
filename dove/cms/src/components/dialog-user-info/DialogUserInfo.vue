<template>
  <el-dialog class="el-custom relative-dialog userDialog" title="User Profile" :before-close="handleCloseClick" :visible.sync="dialogVisible_">
    <div class="content-header">
      <div class="search-wrap">
        <div class="nav-title">
          <span :class="active === 1?'current':''" @click="activeToggle(1)">Basic</span>
          <!-- <span :class="active === 2?'current':''" @click="activeToggle(2)">Bank</span> -->
          <!-- <span :class="active === 3?'current':''" @click="activeToggle(3)">Remark</span> -->
          <!-- <span :class="active === 4?'current':''" @click="activeToggle(4)">Setting</span> -->
        </div>
        <div class="search-content">
          <div style="width:100%;height:100%" v-loading="loading" v-if="active === 1">
            <table id="ziliao-table" v-if="showTable">
              <tbody>
                <tr>
                  <td style="width:50%;">
                    <label>User name：</label>
                    <el-input disabled v-model.trim="data.loginname" style="width:150px"></el-input>
                  </td>
                  <td>
                    <label>Phone：</label>
                    <el-input v-model.trim="data.phone" style="width:150px"></el-input>
                  </td>
                </tr>
                <tr>
                  <td>
                    <label>First name：</label>
                    <el-input v-model.trim="data.firstname" style="width:150px"></el-input>
                  </td>
                  <td>
                    <label>Line ID：</label>
                    <el-input v-model.trim="data.lineid" style="width:150px"></el-input>
                  </td>
                </tr>
                <tr>
                  <td>
                    <label>Last name：</label>
                    <el-input v-model.trim="data.lastname" style="width:150px"></el-input>
                  </td>
                  <td>
                    <label>Email：</label>
                    <el-input v-model.trim="data.email" style="width:150px"></el-input>
                  </td>
                </tr>
                <tr>
                  <td style="text-align:right;">
                    <el-button class="small yes" @click="updateUserinfo">Save</el-button>
                  </td>
                </tr>
              </tbody>
            </table>
            <table id="ziliao-table" v-if="showTable" style="border-top:1px solid #ddd">
              <tbody>
                <tr>
                  <td style="width:50%;">
                    <label style="width:130px">Login Password：</label>
                    <span>{{isSet(hasSetPsd?1:0)}}</span>
                    <el-button class="small yes" @click="handleResetLogin" style="margin-left:10px">Reset</el-button>
                  </td>
                  <td></td>
                </tr>
                <!-- <tr>
                  <td>
                    <label>支付密码：</label>
                    <span>{{isSet(hasSetCashPsd?1:0)}}</span>
                    <el-button class="small yes" @click="handleResetPay" style="margin-left:10px">Reset</el-button>
                  </td>
                  <td></td>
                </tr> -->
              </tbody>
            </table>
            <table id="ziliao-table" v-if="showTable" style="border-top:1px solid #ddd">
              <tbody>
                <tr>
                  <td style="width:50%;">
                    <label style="width:120px;">Bank Name：</label>
                    <el-input disabled v-model.trim="data.accounts[0].bank" style="width:150px"></el-input>
                  </td>
                </tr>
                <tr>
                  <td>
                    <label style="width:120px;">Bank Account：</label>
                    <el-input disabled v-model.trim="data.accounts[0].card_no" style="width:150px"></el-input>
                  </td>
                </tr>
              </tbody>
            </table>
            <table id="ziliao-table" v-if="showTable" style="border-top:1px solid #ddd">
              <tbody>
                <!-- <tr>
                  <td colspan="2">
                    <div class="tag-router">
                      <span v-for="(item, i) in breadcrumbArr" :key="i">{{item.name}} <i class="right-jiantou" v-if="i != breadcrumbArr.length-1"></i></span>
                    </div>
                  </td>
                </tr> -->
                <!-- <tr>
                  <td style="width:50%;">
                    <label>User type：</label>
                    <span>{{data.type == 1?'Agent':'Member'}}</span>
                  </td>
                  <td></td>
                </tr> -->
                <!-- <tr>
                  <td>
                    <label>Credit：</label>
                    <span>{{formatcash(data.cash_credit)}}</span>
                  </td>
                  <td>
                  </td>
                </tr> -->
                <tr>
                  <td>
                    <label>Balance：</label>
                    <span>{{formatcash(data.cash)}}</span>
                  </td>
                  <td>
                  </td>
                </tr>
                <tr>
                  <td>
                    <label>Slot：</label>
                    <span>{{formatcash(data.cash_slot)}}</span>
                  </td>
                  <td>
                  </td>
                </tr>
                <tr>
                  <td>
                    <label>Live：</label>
                    <span>{{formatcash(data.cash_live)}}</span>
                  </td>
                  <td>
                  </td>
                </tr>
              </tbody>
            </table>
            <dialogEditUp v-if="dialogEditUpModel" @closeDialog="handleCloseDialog"></dialogEditUp>
          </div>
          <!-- <statusyinhangka :loginname="loginname" :userid="userid" v-if="active === 2"></statusyinhangka> -->
          <!-- <statusxinxi v-if="active === 3" :userid="userid"></statusxinxi> -->
          <!-- <statussetting :loginname="loginname" :userType="Number(userType)" v-if="active === 4"></statussetting> -->
        </div>
      </div>
    </div>
  </el-dialog>
</template>
<script>
  import statusziliao from '../dialog-user-info/ziliao';
  import statusxinxi from '../dialog-user-info/xinxi';
  import statusjilu from '../dialog-user-info/jilu';
  import statuszijin from '../dialog-user-info/zijin';
  import statuszhanghu from '../dialog-user-info/zhanghu';
  import statusrizhi from '../dialog-user-info/rizhi';
  import statusyinhangka from '../dialog-user-info/yinhangka';
  import statuszhanneixin from '../dialog-user-info/zhanneixin';
  import statusbaobiao from '../dialog-user-info/baobiao';
  import statustiaozheng from '../dialog-user-info/tiaozheng';
  import statusshebei from '../dialog-user-info/shebei';
  import statussetting from '../dialog-user-info/setting';

  import request from "@/axios/axios.js";
  import tableInput from '../littleStyle/tableInput.vue';
  import tableBtn from '../littleStyle/tableBtn.vue';
  import switchbar from '../littleStyle/switchbar.vue';
  import dialogEditUp from './dialogEditUp.vue';
  import moment from 'moment'

  export default {
    components: {
      statusziliao,
      statusxinxi,
      statusjilu,
      statuszijin,
      statuszhanghu,
      statusrizhi,
      statusyinhangka,
      statuszhanneixin,
      statusbaobiao,
      statustiaozheng,
      statusshebei,
      statussetting,
    },
    props: {
      userid: {
        type: String,
      },
      loginname: {
        type: String,
      },
      dialogVisible: {
        type: Boolean,
        default: false
      },
    },
    created() {
      this.getziiao();
    },
    data() {
      return {
        isClick: false,
        cash: 0,
        cash_ky: 0,
        cash_ag: 0,
        data: null,
        ziliao: false,
        xinxi: false,
        jilu: false,
        zijin: false,
        zhanghu: false,
        rizhi: false,
        yinhangka: false,
        zhanneixin: false,
        baobiao: false,
        tiaozheng: false,
        shebei: false,
        dialogVisible_: this.dialogVisible,
        active: 1,

        loading: false,
        showTable: false,
        dialogEditUpModel: false,
        isCeshi: false,
        lockStatus: {
          title: '锁定状态(正常)：',
          data: [{
              text: '登录',
              val: false
            },
            {
              text: '充值',
              val: false
            },
            {
              text: '投注',
              val: false
            },
            {
              text: '提现',
              val: false
            },
            {
              text: '转账',
              val: false
            },
            {
              text: '契约',
              val: false
            }
          ],
          text: '选中即为锁定该操作类型'
        },
        abilityOpen: {
          title: '功能开放：',
          data: [{
              text: '上级转账',
              val: false
            },
            {
              text: '下级转账',
              val: false
            },
            {
              text: '总代分红',
              val: false
            }
          ],
          text: '选中即为开放该功能'
        },
        userType: '',
        username: 'hang5324',
        // userID: '35464',
        drawingUser: '',
        returnNum: '1960',
        phone: '18518460112',
        email: '839033104@qq.com',
        nickname: '雪花',
        QQ: '839033104',
        rent: '测试分组',
        nexus: 'ceshi110',
        createAt: '2018/4/19 15:19:00',
        createIp: '113.109.233.211 (广东省广州市电信)',
        loginAt: '2018/4/19 15:19:00',
        loginIp: '113.109.233.211 (广东省广州市电信)',
        loginPwdStatus: 1,
        payPwdStatus: 0,
        bankCard: 0,
        chromeCode: 0,
        totalAssets: '￥0.00元',
        lockMoney: '￥0.00元',
        balance: '￥0.00元',
        cash: '0.000',
        wallet: '￥0.00元',
        duration: 1000,
        hasSetPsd: false,
        hasSetCashPsd: false,

        breadcrumbArr: []
      }
    },
    methods: {
      activeToggle(key) {
        this.active = key;
      },
      handleClickUserStatus(ref) {
        this.setUserInfoStatus(ref);
      },
      handleCloseClick() {
        this.active = -1;
        this.dialogVisible_ = false;
        this.$emit('closeDialog', this.dialogVisible_);
      },
      handleDialogShow(val) {
        this.$emit('sendDiglogShow', val);
      },
      setUserInfoStatus(ref) {
        this.ziliao = false;
        this.xinxi = false;
        this.jilu = false;
        this.zijin = false;
        this.zhanghu = false;
        this.rizhi = false;
        this.yinhangka = false;
        this.zhanneixin = false;
        this.baobiao = false;
        this.tiaozheng = false;
        this.shebei = false;
        this[ref] = true;
      },
      enableChange(value) {
        // console.log('value', value);
        this.forbid(value, this.data._id);
      },
      formatcash(cash) {
        if (cash) {
          return Number(cash).toFixed(2);
        }
        return "0.00"
      },
      forbid(value, id) {
        const vm = this;
        request.http(
          'post',
          '/user/forbid', {
            id: id,
            is_forbid: value
          },
          (success) => {
            let code = success.returncode;
            if (code === 200) {
              vm.success('success');
            } else if (code === 101 || code === 103 || code === 106) {
              request.loginAgain(vm)
            }
          },
          (error) => {
            console.log(error)
          }
        )
      },
      handleResetLogin() {
        const vm = this;
        request.http(
          'post',
          '/user/reset/password', {
            id: vm.data._id,
          },
          (success) => {
            let code = success.returncode;
            if (code === 200) {
              vm.success('success');
              vm.hasSetPsd = true;
            } else if (code === 101 || code === 103 || code === 106) {
              request.loginAgain(vm)
            }
          },
          (error) => {
            console.log(error)
          }
        )
      },
      handleResetPay() {
        const vm = this;
        request.http(
          'post',
          '/user/reset/cashPassword', {
            id: vm.data._id,
          },
          (success) => {
            let code = success.returncode;
            if (code === 200) {
              vm.success('success');
              vm.hasSetCashPsd = true;
            } else if (code === 101 || code === 103 || code === 106) {
              request.loginAgain(vm)
            }
          },
          (error) => {
            console.log(error)
          }
        )
      },
      isSet(val) {
        switch (val) {
          case 0:
            return 'Unset';
          case 1:
            return 'Set';
        }
      },
      success(message) {
        const vm = this;
        this.$message({
          message: message,
          type: 'success',
          duration: vm.duration,
          center: true
        })
      },
      formatTime(time) {
        return moment(time).format('DD-MM-YYYY HH:mm:ss')
        // return moment(cellValue).format('DD-MM-YYYY')
      },
      handleEditUp() {
        this.dialogEditUpModel = true;
      },
      handleCloseDialog() {
        this.dialogEditUpModel = false;
      },
      handleSwitchCheck(data) {
        // console.log(data)
      },
      updateUserinfo() {
        // '/user/update/user/profile'
        var vm = this;
        let update = {
          firstname: vm.data.firstname,
          lastname: vm.data.lastname,
          email: vm.data.email,
          lineid: vm.data.lineid,
          phone: vm.data.phone,
          birthday: vm.data.birthday,
          id: vm.data._id,
        }
        vm.loading = true;
        request.http(
          'post',
          '/user/update/user/profile',
          update,
          (success) => {
            vm.loading = false;
            let code = success.returncode;
            if (code === 200) {
              vm.success('Load Success');
              // vm.data = success.data;
              // vm.hasSetCashPsd = vm.data.cash_password ? true : false;
              // vm.hasSetPsd = vm.data.password ? true : false;
              // vm.showTable = true;
            } else if (code === 101 || code === 103 || code === 106) {
              request.loginAgain(vm)
            }
          },
          (error) => {
            vm.loading = false;
            vm.success('Load Success');
            console.log(error)
          }
        )
      },
      getziiao() {
        var vm = this;
        vm.loading = true;
        request.http(
          'get',
          '/user/profile', {
            id: vm.userid
          },
          (success) => {
            vm.loading = false;
            let code = success.returncode;
            if (code === 200) {
              vm.success('Load Success');
              vm.data = success.data;
              if(vm.data.accounts.length == 0){
                vm.data.accounts.push({
                  bank: '',
                  card_no: ''
                })
              }
              // vm.breadcrumbArr = vm.data.an;
              vm.userType = vm.data.type;
              vm.hasSetCashPsd = vm.data.cash_password ? true : false;
              vm.hasSetPsd = vm.data.password ? true : false;
              vm.showTable = true;
            } else if (code === 101 || code === 103 || code === 106) {
              request.loginAgain(vm)
            }
          },
          (error) => {
            vm.loading = false;
            vm.success('Load Success');
            console.log(error)
          }
        )
      },
    },
    watch: {
      dialogVisible(newValue, oldValue) {
        if (newValue) {
          this.dialogVisible_ = newValue;
          this.active = 1;
        }
      },
      active() {
        if (this.active) {
          if (this.active === 1) {
            this.getziiao();
          }
        }
      }
    },
  }

</script>

<style scoped lang="scss">
  #ziliao-table {
    width: 100%;
    border: none;
    border-spacing: 0;
    border-collapse: separate;
    max-width: 100%;
    background-color: transparent;
    empty-cells: show;
    padding: 20px 10px;
  }


  #ziliao-table tr>td {
    padding: .5rem;
    text-align: left;
  }

  #ziliao-table tr:first-child {
    border-top: none;
  }

  #ziliao-table tr>td.table-text-center {
    text-align: center;
  }

  .table-text-primary {
    color: #409EFF;
  }

  .table-text-lg {
    font-size: 1.5rem;
  }

  .table-float {
    float: right;
  }

  #ziliao-table label {
    display: inline-block;
    font-weight: 600;
    width: 100px;
  }

  #ziliao-table strong {
    display: inline-block;
    font-weight: 600;
    color: #F56C6C;
  }

  .el-aside .el-menu .el-submenu .el-submenu__title {
    display: -webkit-box !important;
  }

  .el-header,
  .el-footer {
    color: #333;
  }

  .el-aside {
    background-color: #D3DCE6;
    color: #333;
  }

  * {
    box-sizing: border-box;
  }

  .dialog-user-info {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
  }

  .dialog-user-info>.dialog-bj {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    z-index: 100;
    background: #000;
    opacity: .3;
  }

  .dialog-user-info>.dialog-content {
    width: 900px;
    height: 600px;
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    z-index: 102;
    border-radius: 5px;
    box-shadow: 0px 0px 5px #000;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
  }

  .dialog-user-info .dialog-close {
    position: absolute;
    top: 12px;
    right: 12px;
    cursor: pointer;
    /* z-index:101; */
    color: #fff;
  }

  .dialog-user-info .dialog-title {
    width: 100%;
    height: 48px;
    line-height: 48px;
    color: #fff;
    text-align: left;
    padding-left: 20px;
    background: #409EFF;
  }

  .dialog-user-info .user-info-title {
    width: 100%;
    height: 64px;
    color: #fff;
    background: #409EFF;
    display: -webkit-box;
    -webkit-box-pack: end;
  }

  .user-info-title .user-status {
    padding: .5rem 0;
    margin: 0 12px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-box-pack: justify;
    -webkit-box-align: center;
    cursor: pointer;
  }

  .user-status>i {
    font-size: 26px;
  }

  .user-info-title .user-status:hover {
    color: lightsalmon;
  }

  .user-info-title .user-status-active {
    color: lightsalmon;
  }

  .user-status>span {
    font-weight: normal;
    font-size: 12px;
    display: block;
    line-height: normal;
  }

  .dialog-user-info .user-info-content {
    -webkit-box-flex: 1;
    background: #fff;
    overflow-y: auto;
  }
  
  .tag-router{
    width:100%;
    // padding:20px;
    background:#fff;
    text-align:left;
    span{
      cursor: pointer;
      color:#606266;
      // &:hover{
      //   color:#000;
      // }
    }
  }
  .right-jiantou{
    font-family: element-icons!important;
    speak: none;
    font-style: normal;
    font-weight: 400;
    font-variant: normal;
    text-transform: none;
    line-height: 1;
    vertical-align: baseline;
    display: inline-block;
    -webkit-font-smoothing: antialiased;
    font-size:14px;
    margin: 0 6px;
    font-weight: 400;
    color: #c0c4cc;
    &::before{
      content: "\E604";
    }
  }

</style>

<style lang="scss">
  .userDialog {
    .content-header {
      width: 100%;
      padding: 10px;

      .search-wrap {
        width: 100%;
        min-width: 100%;

        .search-content {
          padding: 0;
          min-height: 450px;
        }
      }
    }
  }

</style>
