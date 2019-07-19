<template>
  <div class="el-custom">
    <DialogUserInfo v-if="dialog" @sendDiglogShow="handleDialogShow" @closeDialog="handleCloseDialog"></DialogUserInfo>
    <div class="content-header">
      <div class="title">
        <h2>{{titleName}}</h2>
      </div>
      <div class="search-wrap">
        <div class="nav-title">
          <span :class="item.checked?'current':''" v-for="(item, index) in routerArr" :key="index" @click="handleChangeRouter(item.name)">{{item.title}}</span>
        </div>
        <div class="search-content">
          <div class="search-inner-wrap">
            <label>Lotto：</label>
            <el-select v-model="type.value" clearable placeholder="lotto" class="small" @focus="typeFocus()" @change="typeChange">
              <el-option v-for="(item,index) in type.options" :key="index" :label="item.name_en" :value="item._id">
              </el-option>
            </el-select>
          </div>
          <!-- <div class="search-inner-wrap">
            <label>彩种：</label>
            <el-select v-model="lotteryType.value" clearable placeholder="彩种" class="small">
              <el-option v-for="(item,index) in lotteryType.options" :key="index" :label="item.name" :value="item._id">
              </el-option>
            </el-select>
          </div> -->
          <div class="search-inner-wrap">
            <label>Period：</label>
            <el-date-picker format="dd-MM-yyyy HH:mm:ss" v-model="searchTime" type="daterange" align="right" unlink-panels range-separator="-"
              start-placeholder="begin" end-placeholder="end" :picker-options="pickerOptions" :default-time="pickerDefaultTime">
            </el-date-picker>
          </div>
          <div class="search-inner-wrap">
            <el-button type="danger" @click="handleSearch" size="medium" class="small yes">Search</el-button>
            <el-button type="info" @click="handleReset" size="medium" class="small no">Reset</el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="content-middle">
      <div class="search-wrap">
        <div class="search-inner-wrap">
          <el-button class="edit" @click="openManual()">Draw a lotto</el-button>
          <!-- <el-button class="edit" @click="openSpecial()">异常开奖</el-button> -->
        </div>
      </div>
    </div>
    <div class="data-table" v-loading="loading">
      <el-table :data="logListData" header-row-class-name="table-header" stripe border style="width: 100%;font-size:12px;">
        <el-table-column align="center" prop="l2_en" label="Lotto">
        </el-table-column>
        <el-table-column align="center" prop="issue_no" label="Issue">
        </el-table-column>
        <el-table-column align="center" prop="open_at" :formatter="formatTime" label="Drawing Time">
        </el-table-column>
        <el-table-column align="center" prop="luck_no" label="Winning Number">
        </el-table-column>
        <el-table-column align="center" label="Operate">
          <template slot-scope="scope">
            <el-button size="small" @click="exportFn(scope.row)" class="small edit">Export</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="fenye">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum"
          :page-size="pageSize" :page-sizes="[10, 20, 40, 80,160,350,700,1000]" layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </div>
    <el-dialog title="Draw a lotto" :before-close="closeManual" :visible.sync="dialogVisible">
      <div class="body-middle">
        <div class="form">
          <div class="form-row">
            <span class="exp">Lotto</span>
            <span class="exp-after">：</span>
            <el-select clearable v-model="form.lotteryKind.value" placeholder="please select" class="small" :loading="form.lotteryKind.loading"
              :loading-text="form.lotteryKind.loadingText" @focus="formgameTypeFocus()" @change="formLotteryTypeChange">
              <el-option v-for="(item,index) in form.lotteryKind.options" :key="index" :label="item.name_en" :value="item._id +'-'+ item.name_cn">
              </el-option>
              <!-- <el-option-group v-for="(group,index) in form.lotteryKind.options" :key="index" :label="group.name">
                <el-option v-for="(item,index) in group.childLotterys" :key="index" :label="item.name" :value="item._id">
                </el-option>
              </el-option-group> -->
            </el-select>
          </div>
          <!-- <div class="form-row">
            <span class="exp">彩期</span>
            <span class="exp-after">：</span>
            <el-date-picker format="dd-MM-yyyy HH:mm:ss" v-model="dialogTime" type="date" align="right" value-format="yyyyMMdd"
              placeholder="begin" @change="dateChange()">
            </el-date-picker>
          </div> -->
          <div class="form-row">
            <span class="exp">Issue</span>
            <span class="exp-after" style="width:12px;"></span>
            <el-select clearable v-model="form.lotteryNo.value" :placeholder="form.lotteryNo.placeholder" class="small"
              @focus="formLotteryNoFocus()" :loading-text="form.lotteryNo.loadingText" :loading="form.lotteryNo.loading">
              <el-option v-for="(item,index) in form.lotteryNo.options" :key="index" :label="item.issue_no"
                :value="item">
              </el-option>
            </el-select>
            <!-- <el-input v-model.trim="form.lotteryNo.value"></el-input> -->
          </div>
          <div class="form-row">
            <span class="exp">Winning Number</span>
            <span class="exp-after">：</span>
            <el-input v-for="(lottery, l) in lotteryNumArr" :key="l" type="text" v-model.trim="lottery.value" :maxlength="lottery.max"></el-input>
            <!-- <el-input type="text" v-model.trim="form.awardNo" placeholder="开奖号码需以 , 号隔开"></el-input> -->
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="submitForm()" class="yes">Confirm</el-button>
        <el-button @click="closeManual()" class="no">Cancel</el-button>
      </div>
    </el-dialog>
    <el-dialog title="异常开奖" :before-close="closeSpecial" :visible.sync="dialogVisibleS">
      <div class="body-middle">
        <div class="form">
          <div class="form-row">
            <span class="exp">彩种</span>
            <span class="exp-after">：</span>
            <el-select clearable v-model="formS.lotteryKind.value" placeholder="please select lottery" class="small" :loading="formS.lotteryKind.loading"
              :loading-text="formS.lotteryKind.loadingText" @focus="formgameTypeFocusS()" @change="formLotteryTypeChangeS">
              <el-option v-for="(item,index) in formS.lotteryKind.options" :key="index" :label="item.name_en" :value="item._id">
              </el-option>
              <!-- <el-option-group v-for="(group,index) in formS.lotteryKind.options" :key="index" :label="group.name">
                <el-option v-for="(item,index) in group.childLotterys" :key="index" :label="item.name" :value="item._id">
                </el-option>
              </el-option-group> -->
            </el-select>
          </div>
          <div class="form-row">
            <span class="exp">彩期</span>
            <span class="exp-after">：</span>
            <el-date-picker format="dd-MM-yyyy HH:mm:ss" v-model="dialogTimeS" type="daterange" align="right" unlink-panels range-separator="-"
              start-placeholder="begin" end-placeholder="end" :picker-options="pickerOptions" @change="dateChangeS()">
            </el-date-picker>
          </div>
          <div class="form-row">
            <span class="exp"></span>
            <span class="exp-after" style="width:12px;"></span>
            <el-select clearable v-model="formS.lotteryNo.value" :placeholder="formS.lotteryNo.placeholder" class="small"
              @focus="formLotteryNoFocusS()" :loading-text="formS.lotteryNo.loadingText" :loading="formS.lotteryNo.loading">
              <el-option v-for="(item,index) in formS.lotteryNo.options" :key="index" :label="item.issue_no +'--' + formatTime2(item.open_at)"
                :value="item.issue_no">
              </el-option>
            </el-select>
            <el-input v-model.trim="formS.lotteryNo.value"></el-input>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="submitFormS()" class="yes" :loading="specialLoading">Confirm</el-button>
        <el-button @click="closeSpecial()" class="no">Cancel</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import request from "@/axios/axios.js";
  import config from '@/config/config.js';
  import TableExport from 'tableexport';
  import DialogUserInfo from '../dialog-user-info/DialogUserInfo';
  import tableBtn from '../littleStyle/tableBtn.vue';
  import moment from 'moment'
  export default {
    name: 'lottery',
    components: {
      tableBtn,
      DialogUserInfo
    },
    data() {
      return {
        index1: 0,
        index2: 0,
        specialLoading: false,
        titleName: '',
        routerArr: [],
        dialogTime: "",
        dialogTimeS: "",
        loading: false,
        pageNum: 1,
        pageSize: 40,
        total: 0,
        logListData: [],
        username: '',
        searchTime: '',
        pickerDefaultTime: ['00:00:00', '23:59:59'],
        pickerOptions: {
          shortcuts: [{
              text: "Yesterday",
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(new Date(new Date(new Date().toLocaleDateString('en-US')).getTime()) - 3600 * 1000 * 24 * 1);
                end.setTime(new Date(new Date(new Date().toLocaleDateString('en-US')).getTime() + 24 * 60 * 60 * 1000 - 1) -
                  3600 * 1000 * 24 * 1);
                picker.$emit("pick", [start, end]);
              }
            }, {
              text: "Today",
              onClick(picker) {
                const end = new Date();
                const start = new Date(new Date(new Date().toLocaleDateString('en-US')).getTime());
                end.setTime(new Date(new Date(new Date().toLocaleDateString('en-US')).getTime() + 24 * 60 * 60 * 1000 - 1));
                picker.$emit("pick", [start, end]);
              }
            },
            {
              text: "This Week",
              onClick(picker) {
                let now = new Date();
                let nowDayOfWeek = now.getDay(); //今天本周的第几天
                let nowDay = now.getDate(); //当前日
                let nowMonth = now.getMonth(); //当前月
                let nowYear = now.getFullYear(); //当前年
                let getWeekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek);
                let getWeekEndDate = new Date(new Date(new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek)).toLocaleDateString('en-US'))
                  .getTime() + 24 * 60 * 60 * 1000 - 1);
                picker.$emit("pick", [getWeekStartDate, getWeekEndDate]);
              }
            }, {
              text: "Last Week",
              onClick(picker) {
                let now = new Date();
                let nowDayOfWeek = now.getDay(); //今天本周的第几天
                let nowDay = now.getDate(); //当前日
                let nowMonth = now.getMonth(); //当前月
                let nowYear = now.getFullYear(); //当前年
                let getWeekStartDate = new Date(new Date(new Date(nowYear, nowMonth, nowDay - nowDayOfWeek).toLocaleDateString('en-US'))
                  .getTime() -
                  3600 * 1000 * 24 * 7);
                let getWeekEndDate = new Date(new Date(new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek)).toLocaleDateString('en-US'))
                  .getTime() + 24 * 60 * 60 * 1000 - 1 - 3600 * 1000 * 24 * 7);
                picker.$emit("pick", [getWeekStartDate, getWeekEndDate]);
              }
            },
            {
              text: "This Month",
              onClick(picker) {
                let now = new Date();
                let nowMonth = now.getMonth(); //当前月
                let nowYear = now.getFullYear(); //当前年
                //获得本月的开始日期
                let getMonthStartDate = new Date(nowYear, nowMonth, 1);
                var monthStartDate = new Date(nowYear, nowMonth, 1);
                var monthEndDate = new Date(nowYear, nowMonth + 1, 1);
                var days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
                //获得本月的结束日期
                let getMonthEndDate = new Date(new Date(new Date(nowYear, nowMonth, days).toLocaleDateString('en-US')).getTime() +
                  24 * 60 * 60 * 1000 - 1);
                picker.$emit("pick", [getMonthStartDate, getMonthEndDate]);
              }
            },
            {
              text: "Last Month",
              onClick(picker) {
                var firstdate = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1);
                var date = new Date();
                var day = new Date(date.getFullYear(), date.getMonth(), 0).getDate();
                var enddate = new Date(new Date(new Date(new Date().getFullYear(), new Date().getMonth() - 1, day).toLocaleDateString('en-US'))
                  .getTime() + 24 * 60 * 60 * 1000 - 1);
                picker.$emit("pick", [firstdate, enddate]);
              }
            },
            {
              text: "Recent 1 Week",
              onClick(picker) {
                const end = new Date(new Date(new Date().toLocaleDateString('en-US')).getTime() + 24 * 60 * 60 * 1000 - 1);
                const start = new Date(new Date(new Date().toLocaleDateString('en-US')).getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit("pick", [start, end]);
              }
            },
            {
              text: "Recent 1 Month",
              onClick(picker) {
                const end = new Date(new Date(new Date().toLocaleDateString('en-US')).getTime() + 24 * 60 * 60 * 1000 - 1);
                const start = new Date(new Date(new Date().toLocaleDateString('en-US')).getTime() - 3600 * 1000 * 24 * 30);
                picker.$emit("pick", [start, end]);
              }
            },
            {
              text: "Recent 3 Months",
              onClick(picker) {
                const end = new Date(new Date(new Date().toLocaleDateString('en-US')).getTime() + 24 * 60 * 60 * 1000 - 1);
                const start = new Date(new Date(new Date().toLocaleDateString('en-US')).getTime() - 3600 * 1000 * 24 * 90);
                picker.$emit("pick", [start, end]);
              }
            }
          ]
        },
        duration: 1000,
        dialog: false,
        dialogIsShow: false,
        type: {
          value: "",
          options: [],
          loading: false,
          loadingText: "Loading...",
        },
        lotteryType: {
          value: "",
          options: [],
        },
        dialogVisible: false,
        form: {
          lotteryKind: {
            options: [],
            value: "",
            loading: false,
            loadingText: "Loading...",
          },
          lotteryNo: {
            options: [],
            value: "",
            loading: false,
            loadingText: "Loading...",
            placeholder: "please select Issue"
          }, // 彩期
          awardNo: "" //彩票号码
        },
        dialogVisibleS: false,
        formS: {
          lotteryKind: {
            options: [],
            value: "",
            loading: false,
            loadingText: "Loading...",
          },
          lotteryNo: {
            options: [],
            value: "",
            loading: false,
            loadingText: "Loading...",
            placeholder: "please select Issue"
          }, // 彩期
        },
        lotteryNumArr: [],
      }
    },
    created() {
      this.routerArr = [];
      let query = this.$route.query;
      this.index1 = Number(query.index1);
      this.index2 = Number(query.index2);
      let data = this.$store.state.formatMenuFn(this.index1, this.index2, 'lottery');
      this.routerArr = data.routerArr;
      this.titleName = data.titleName;
      this.getLotteryList();
    },
    methods: {
      // 降序
      descOrder(arr) {
        return arr.sort((a, b) => {return b-a})
      },
      //
      dateChange() {
        this.form.lotteryNo.options = [];
        this.form.lotteryNo.value = "";
      },
      dateChangeS() {
        this.formS.lotteryNo.options = [];
        this.formS.lotteryNo.value = "";
      },
      splitLotteryNum(num) {
        let str = num.slice(0, 3) +'-'+ num.slice(num.length-3);
        return str;
      },
      submitForm() {
        const vm = this;
        let numArr = [];
        let isOk = this.lotteryNumArr.every(v => v.value.length==v.max);
        this.lotteryNumArr.filter(v => {
          let str;
          if(v.max == 6){
            str = vm.splitLotteryNum(v.value);
          }else{
            str = v.value;
          }
          numArr.push(str);
        })
        // console.log(numArr.join(','))
        // console.log(vm.dialogTime)
        if (!vm.form.lotteryKind.value) {
          vm.message('please select lottery', "error");
          return;
        }
        if (!vm.form.lotteryNo.value) {
          vm.message('please select Issue', "error");
          return;
        }
        if (!isOk) {
          vm.message('Please set the lottery number.', "error");
          // vm.message('Winning number should be separated by comma', "error");
          return;
        }
        // let luck_no = [];
        // vm.form.awardNo.split(',').filter(v => {
        //   if(v.length === 6){
        //     v = v.slice(0,3)+'-'+v.slice(3,6)
        //   }
        //   luck_no.push(v)
        // })
        request.http(
          "post",
          "/lottery/game/open", {
            gameid: vm.form.lotteryKind.value.split('-')[0],
            issue_no: vm.form.lotteryNo.value,
            luck_no: numArr.join(',')
          },
          success => {
            let code = success.returncode;
            if (code === 200) {
              vm.closeManual();
              vm.getLotteryList();
            } else if (code === 101 || code === 103 || code === 106) {
              request.loginAgain(vm);
            } else if (code === 302) {
              vm.message(vm.form.lotteryNo.value + "The award date has already won the prize.", "error")
              // vm.message(vm.form.lotteryNo.value + "奖期已经开过奖了", "error")
            } else if (code === 301) {
              vm.message("Incorrect format. Winning number should be separated by comma", "error")
            } else {
              alert(success.returncode);
            }
          },
          error => {
            vm.error();
            console.log(error);
          }
        )
      },
      submitFormS() {
        const vm = this;
        // console.log(vm.dialogTime)
        if (!vm.formS.lotteryKind.value) {
          vm.message('please select lottery', "error");
          return;
        }
        if (!vm.formS.lotteryNo.value) {
          vm.message('please select Issue', "error");
          return;
        }
        vm.specialLoading = true;
        request.http(
          "post",
          "/lottery/game/abnormal", {
            gameid: vm.formS.lotteryKind.value,
            issue_no: vm.formS.lotteryNo.value,
          },
          success => {
            vm.specialLoading = false;
            let code = success.returncode;
            if (code === 200) {
              vm.closeSpecial();
              vm.getLotteryList();
            } else if (code === 101 || code === 103 || code === 106) {
              request.loginAgain(vm);
            } else if (code === 302) {
              vm.message(vm.formS.lotteryNo.value + "The award date has already won the prize.", "error")
            } else if (code === 301) {
              vm.message("Incorrect format. Winning number should be separated by comma", "error")
            } else {
              alert(success.returncode);
            }
          },
          error => {
            vm.specialLoading = false;
            vm.error();
            console.log(error);
          }
        )
      },
      message(text, type) {
        const vm = this
        this.$message({
          message: text,
          type: type,
          duration: vm.duration,
          center: true
        })
      },
      openManual() {
        this.dialogVisible = true;
        this.resetForm();
      },
      openSpecial() {
        this.dialogVisibleS = true;
        this.resetFormS();
      },
      closeManual() {
        this.dialogVisible = false;
        this.resetForm();
      },
      closeSpecial() {
        this.dialogVisibleS = false;
        this.resetFormS();
      },
      resetForm() {
        this.form.lotteryKind.value = "";
        this.form.lotteryNo.options = [];
        this.form.lotteryNo.value = "";
        this.form.awardNo = "";
        this.dialogTime = "";
      },
      resetFormS() {
        this.form.lotteryKind.value = "";
        this.form.lotteryNo.options = [];
        this.form.lotteryNo.value = "";
      },
      typeFocus() {
        if (this.type.options.length === 0) {
          this.getType();
        }
      },
      //彩票种类
      getType() {
        const vm = this;
        vm.type.loading = true;
        request.http(
          'get',
          '/lottery/game/list', {},
          (success) => {
            vm.type.loading = false;
            let code = success.returncode;
            if (code === 200) {
              vm.type.options = success.data;
            } else if (code === 101 || code === 103 || code === 106) {
              request.loginAgain(vm)
            }
          },
          (error) => {
            vm.type.loading = false;
          }
        )
      },
      typeChange(value) {
        if (value) {
          let obj = {};
          obj = this.type.options.find((item) => {
            return item._id === value;
          });
          this.lotteryType.options = obj.childLotterys;
          this.lotteryType.value = '';
        } else {
          this.lotteryType.options = [];
          this.lotteryType.value = '';
        }
      },
      formgameTypeFocus() {
        if (this.form.lotteryKind.options.length === 0) {
          this.formgetGameType();
        }
      },
      formgameTypeFocusS() {
        if (this.formS.lotteryKind.options.length === 0) {
          this.formgetGameTypeS();
        }
      },
      //彩票种类
      formgetGameType() {
        const vm = this;
        vm.form.lotteryKind.loading = true;
        request.http(
          'get',
          '/lottery/game/list', {},
          (success) => {
            vm.form.lotteryKind.loading = false;
            let code = success.returncode;
            if (code === 200) {
              vm.form.lotteryKind.options = success.data;
            } else if (code === 101 || code === 103 || code === 106) {
              request.loginAgain(vm)
            }
          },
          (error) => {
            vm.form.lotteryKind.loading = false;
          }
        )
      },
      //彩票种类
      formgetGameTypeS() {
        const vm = this;
        vm.formS.lotteryKind.loading = true;
        request.http(
          'get',
          '/lottery/game/list', {},
          (success) => {
            vm.formS.lotteryKind.loading = false;
            let code = success.returncode;
            if (code === 200) {
              vm.formS.lotteryKind.options = success.data;
            } else if (code === 101 || code === 103 || code === 106) {
              request.loginAgain(vm)
            }
          },
          (error) => {
            vm.formS.lotteryKind.loading = false;
          }
        )
      },
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
      handleSizeChange(val) {
        // console.log(`每页 ${val} 条`);
        this.pageSize = val;
        this.getLotteryList();
      },
      handleCurrentChange(val) {
        this.pageNum = val;
        this.getLotteryList();
        // console.log(`当前页: ${val}`);
      },
      getUserInfoFn(row) {
        this.dialog = true;
      },
      handleCloseDialog(val) {
        this.dialog = val;
      },
      handleDialogShow(val) {
        this.dialogIsShow = val;
      },
      formatTime(row, column, cellValue) {
        if (cellValue) {
          return moment(cellValue).format('DD-MM-YYYY HH:mm:ss')
        }
        return '--'
      },
      formatTime2(value) {
        if (value) {
          return moment(value).format('DD-MM-YYYY HH:mm:ss')
        }
        return '--'
      },
      formLotteryTypeChange(value) {
        this.form.lotteryNo.options = [];
        this.form.lotteryNo.value = "";
        let type = value.split('-')[1];
        this.lotteryNumArr = [];
        if(type === '泰国官方彩'){
          for(let i=0; i<3; i++){
            this.lotteryNumArr.push({
              max: 6,
              value: ''
            })
          }
          this.lotteryNumArr.push({
            max: 2,
            value: ''
          })
        }else{
          this.lotteryNumArr.push({max: 3, value: ''}, {max: 2, value: ''})
        }
      },
      formLotteryTypeChangeS(value) {
        this.formS.lotteryNo.options = [];
        this.formS.lotteryNo.value = "";
      },
      formLotteryNoFocus() {
        // if (!this.form.lotteryKind.value || !this.dialogTime) {
        //   return;
        // }
        const vm = this;
        vm.form.lotteryNo.loading = true;
        let beginTime = vm.dialogTime ? new Date(vm.dialogTime):'';
        let endTime = vm.dialogTime ? new Date(vm.dialogTime[1]):'';
        request.http(
          'get',
          '/lottery/issue/three', {
            PageNum: 1,
            PageSize: 1000000,
            id: vm.form.lotteryKind.value.split('-')[0],
          },
          (success) => {
            vm.form.lotteryNo.loading = false;
            let code = success.returncode;
            if (code === 200) {
              vm.form.lotteryNo.options = vm.descOrder(success.data);
            } else if (code === 101 || code === 103 || code === 106) {
              request.loginAgain(vm)
            }
          },
          (error) => {
            vm.form.lotteryNo.loading = false;
            vm.error();
            console.log(error)
          }
        )
      },
      formLotteryNoFocusS() {
        // if (!this.formS.lotteryKind.value || !this.dialogTimeS) {
        //   return;
        // }
        const vm = this;
        vm.formS.lotteryNo.loading = true;
        let beginTime = vm.dialogTimeS ? new Date(vm.dialogTimeS[0]):'';
        let endTime = vm.dialogTimeS ? new Date(vm.dialogTimeS[1]):'';
        request.http(
          'get',
          '/lottery/issue/list', {
            PageNum: 1,
            PageSize: 1000000,
            gameid: vm.formS.lotteryKind.value,
            beginOpen: beginTime,
            endOpen: endTime,
          },
          (success) => {
            vm.formS.lotteryNo.loading = false;
            let code = success.returncode;
            if (code === 200) {
              vm.formS.lotteryNo.options = success.data;
            } else if (code === 101 || code === 103 || code === 106) {
              request.loginAgain(vm)
            }
          },
          (error) => {
            vm.formS.lotteryNo.loading = false;
            vm.error();
            console.log(error)
          }
        )
      },
      getLotteryList() {
        const vm = this;
        let beginTime = '',
          endTime = '';
        if (vm.searchTime !== '') {
          beginTime = new Date(vm.searchTime[0]);
          endTime = new Date(vm.searchTime[1]);
        }
        vm.loading = true;
        request.http(
          'get',
          '/lottery/issue/list', {
            beginOpen: beginTime,
            endOpen: endTime,
            PageNum: vm.pageNum,
            PageSize: vm.pageSize,
            gameid: vm.type.value
            // gameid: vm.lotteryType.value
          },
          (success) => {
            vm.loading = false;
            // console.log('lotteryList--------', success);
            let code = success.returncode;
            if (code === 200) {
              vm.logListData = success.data;
              vm.pageNum = Number(success.PageNum);
              vm.total = success.count;
              vm.success();
            } else if (code === 101 || code === 103 || code === 106) {
              request.loginAgain(vm)
            }
          },
          (error) => {
            vm.loading = false;
            vm.error();
            console.log(error)
          }
        )
      },
      handleReset() {
        this.searchTime = '';
        this.type.value = "";
        this.lotteryType.options = "";
        this.lotteryType.value = "";
      },
      // 导出
      exportFn(row) {
        const vm = this;
        var url = config.login + '/lottery/issue/export';
        var data = "gameid=" + row.gameid + "&issue_no=" + row.issue_no;
        window.location = url + "?" + data;
      },
      handleSearch() {
        this.getLotteryList();
      },
    }
  }

</script>
<style>
  /* @import '../../publicCss/header.css'; */

</style>
