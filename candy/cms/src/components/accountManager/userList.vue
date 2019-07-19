<template>
  <div class="userList el-custom">
    <DialogUserInfo
      v-if="dialog"
      :loginname="loginname"
      :userid="userid"
      @closeDialog="handleCloseDialog"
      :dialogVisible="dialog"
    ></DialogUserInfo>
    <div class="content-header">
      <div class="title">
        <h2>{{titleName}}</h2>
      </div>
      <div class="search-wrap">
        <div class="nav-title">
          <span
            :class="item.checked?'current':''"
            v-for="(item, index) in routerArr"
            :key="index"
            @click="handleChangeRouter(item.name)"
          >{{item.title}}</span>
        </div>
        <div class="search-content">
          <div class="search-inner-wrap">
            <el-select
              v-model="searchType.value"
              placeholder="select"
              class="small"
              @change="searchTypeChange"
            >
              <el-option
                v-for="option in searchType.options"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              ></el-option>
            </el-select>
          </div>
          <div class="search-inner-wrap">
            <el-input
              clearable
              v-model.trim="username"
              placeholder="user name"
              style="width:114px"
              v-show="searchType.value == 1"
            ></el-input>
            <el-input
              clearable
              v-model.trim="realname"
              placeholder="real name"
              style="width:114px"
              v-show="searchType.value == 2"
            ></el-input>
            <el-input
              clearable
              v-model.trim="phone"
              placeholder="phone"
              style="width:114px"
              v-show="searchType.value == 3"
            ></el-input>
          </div>
          <div class="search-inner-wrap">
            <label>Status：</label>
            <el-select clearable v-model="status" placeholder="please select" class="small">
              <el-option
                v-for="item in statusArr"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div class="search-inner-wrap">
            <label>Agent：</label>
            <el-input
              clearable
              v-model.trim="superLoginname"
              placeholder="agent"
              style="width:114px"
            ></el-input>
          </div>
          <div class="search-inner-wrap">
            <el-button type="danger" @click="handleSearch" size="medium" class="small yes">Search</el-button>
            <el-button type="info" @click="handleReset" size="medium" class="small no">Reset</el-button>
          </div>
        </div>
      </div>
    </div>
    <!-- table START -->
    <div class="data-table" v-loading="loading">
      <el-table
        :data="userListData"
        align="center"
        header-row-class-name="table-header"
        stripe
        border
        style="width: 100%;font-size:12px;"
        max-height="450"
        :show-summary="true"
        sum-text="Total"
        :summary-method="getSummaries"
      >
        <el-table-column align="center" label="User Name" width="126">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="getUserInfoFn(scope.row)"
            >{{scope.row.loginname}}</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="firstname" width="110" label="First Name">
        </el-table-column>
        <el-table-column align="center" label="Agent" width="94px">
          <template slot-scope="scope">
            <div class="tag-router">
              <span v-for="(item, i) in scope.row.an" :key="i"><el-button type="text" size="small" @click="handleClickTag(item)">{{item.name}}</el-button>{{i != scope.row.an.length-1 ? ' / ' : ''}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="Type" prop="type" :formatter="formatUser">
        </el-table-column>
        <el-table-column align="center" label="Level" prop="level"></el-table-column>
        <el-table-column align="center" label="Balance" prop="cash" :formatter="formatMoney">
        </el-table-column>
        <!-- <el-table-column align="center" label="Frozen Account">
          <template
            slot-scope="scope"
          >{{scope.row.cash_locked?Number(scope.row.cash_locked).toFixed(2) : 0}}</template>
        </el-table-column> -->
        <el-table-column align="center" label="Member Number">
          <template slot-scope="scope">{{scope.row.inferior_num?scope.row.inferior_num : 0}}</template>
        </el-table-column>
        <el-table-column align="center" prop="status" :formatter="isStatusFn" label="Status"></el-table-column>
        <el-table-column
          align="center"
          prop="create_at"
          :formatter="formatTime"
          label="Register time"
          width="130px"
        ></el-table-column>
        <el-table-column align="center" fixed="right" label="Action" width="284px">
          <template slot-scope="scope">
            <el-row class="tr">
              <el-button size="mini" @click="openMsg(scope.row)" class="small edit">Send Msg</el-button>
              <el-button
                size="mini"
                @click="enableChange(scope.row,0)"
                class="small yes"
                v-if="scope.row.status == 1"
              >Enable</el-button>
              <el-button
                size="mini"
                @click="enableChange(scope.row,1)"
                class="small yes"
                v-if="scope.row.status == 0"
              >Disable</el-button>
            </el-row>
            <el-row class="tr">
              <el-button size="mini" @click="tixiaxian(scope.row)" class="small mt-10 no">Logout</el-button>
            </el-row>
            <el-row class="tr">
              <a @click="handleSkip('accountChange',scope.row.loginname)">
                <el-button size="mini" class="small edit mt-10">Account Change</el-button>
              </a>
              <a @click="handleSkip('userLog',scope.row.loginname)" class="ml-15">
                <el-button size="mini" class="small edit mt-10">Log</el-button>
              </a>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
      <div class="fenye">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageNum"
          :page-size="pageSize"
          :page-sizes="[10, 20, 40, 80,160,350,700,1000]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </div>
    <!-- 新增总代 START -->
    <el-dialog title="新增总代" :before-close="closeCreate" :visible.sync="createDialog">
      <div class="body-middle">
        <div class="form">
          <div class="form-row">
            <span class="exp">账号</span>
            <span class="exp-after">:</span>
            <el-input type="text" v-model.trim="createForm.loginname"></el-input>
          </div>
          <div class="form-row">
            <span class="exp">密码</span>
            <span class="exp-after">:</span>
            <el-input type="password" v-model.trim="createForm.password"></el-input>
          </div>
          <div class="form-row">
            <span class="exp">确认密码</span>
            <span class="exp-after">:</span>
            <el-input type="password" v-model.trim="createForm.psd_sure"></el-input>
          </div>
          <!-- <div class="form-row">
            <span class="exp">测试账号</span>
            <span class="exp-after">:</span>
            <el-select v-model="createForm.is_test" placeholder="请选择" class="small" style="float:left">
              <el-option label="是" value="1">
              </el-option>
              <el-option label="否" value="0">
              </el-option>
            </el-select>
          </div>-->
          <div class="form-row">
            <span class="exp">奖金组</span>
            <span class="exp-after">:</span>
            <el-input type="text" v-model.trim="createForm.refund"></el-input>
          </div>
          <div class="form-row">
            <span class="exp"></span>
            <span class="exp-after"></span>
            <p style="font-size: 12px;color: #777777;text-align:left;">奖金组介于1800-2000之间</p>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="submitForm('createForm')"
          class="yes"
          :loading="addzdLoading"
        >Confirm</el-button>
        <el-button @click="closeCreate" class="no">Cancel</el-button>
      </div>
    </el-dialog>
    <!-- 新增总代 END -->
    <!-- 站内信 START -->
    <el-dialog
      title="Msg"
      :before-close="closeMsg"
      :visible.sync="msgVisible"
      class="relative-dialog"
    >
      <div class="body-middle">
        <div class="form">
          <div class="form-row">
            <span class="exp">Title</span>
            <span class="exp-after">:</span>
            <el-input type="text" v-model.trim="msgForm.topic"></el-input>
          </div>
          <div class="form-row file-inner">
            <span class="exp">Content</span>
            <span class="exp-after">:</span>
            <div ref="editor" style="text-align:left" class="flex-all"></div>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="send" class="yes" :loading="msgLoading">Confirm</el-button>
        <el-button @click="closeMsg" class="no">Cancel</el-button>
      </div>
    </el-dialog>
    <!-- 站内信 END -->
  </div>
</template>
<script>
import request from "@/axios/axios.js";
import DialogUserInfo from "../dialog-user-info/DialogUserInfo";
import tableBtn from "../littleStyle/tableBtn.vue";
import moment from "moment";
import * as validator from "@/lib/utils/validator";
import E from "wangeditor";

export default {
  name: "userList",
  title: "用户列表",
  components: {
    tableBtn,
    DialogUserInfo,
    E
  },
  data() {
    var validatorPsd = (rule, value, callback) => {
      if (!validator.regexpPsd(value)) {
        return callback(new Error("请输入6-16位数字和字母组合"));
      } else {
        callback();
      }
    };
    return {
      index1: 0,
      index2: 0,
      addzdLoading: false,
      msgLoading: false,
      msgVisible: false,
      msgForm: {
        loginid: "",
        topic: "",
        content: "测试"
      },
      editor: null,
      createDialog: false,
      titleName: "",
      routerArr: [],
      superLoginname: "",
      loading: false,
      userid: "",
      loginname: "",
      username: "",
      realname: "",
      phone: "",
      isForbid: 0,
      onLine: 0,
      minBlance: "",
      maxBlance: "",
      userListData: [],
      pageNum: 1,
      pageSize: 40,
      total: 0,
      group: {
        value: "",
        options: [],
        loading: false,
        loadingText: "Loading..."
      },
      statusArr: [
        {
          value: "",
          label: "all"
        },
        {
          value: 0,
          label: "enabled"
        },
        {
          value: 1,
          label: "disabled"
        }
      ],
      status: "",
      testUser: [
        {
          value: "",
          label: "全部"
        },
        {
          value: "0",
          label: "不显示"
        },
        {
          value: "1",
          label: "仅显示"
        }
      ],
      is_test: "0",
      duration: 1000,
      dialog: false,
      dialogIsShow: false,
      createForm: {
        loginname: "",
        password: "",
        psd_sure: "",
        is_test: "",
        refund: ""
      },
      searchType: {
        value: 1,
        options: [
          {
            label: "User name",
            value: 1
          },
          {
            label: "Real name",
            value: 2
          },
          {
            label: "Phone",
            value: 3
          }
        ]
      },
      rules: {
        loginname: [
          {
            required: true,
            message: "please input user name",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            trigger: "blur",
            validator: validatorPsd
          }
        ],
        psd_sure: [
          {
            required: true,
            trigger: "blur",
            validator: validatorPsd
          }
        ],
        refund: [
          {
            required: true,
            message: "请输入奖金组",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    this.routerArr = [];
    let query = this.$route.query;
    if (query.param) {
      this.searchType.value = 1;
      this.username = query.param;
    }
    if (query.parent) {
      this.superLoginname = query.parent;
    }
    this.groupFocus();
    this.index1 = Number(query.index1);
    this.index2 = Number(query.index2);
    let data = this.$store.state.formatMenuFn(this.index1, this.index2, 'userList');
    this.routerArr = data.routerArr;
    this.titleName = data.titleName;
  },
  methods: {
    getSummaries(param) {
      const {
        columns,
        data
      } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "Total";
          return;
        }
        let values = data.map(item => Number(item[column.property]));
        if (index === 5) {
          values = data.map(item => Number(item["cash"]));
        }
        if (
          (index === 5) &&
          !values.every(value => isNaN(value))
        ) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          sums[index] = parseFloat(sums[index]).toFixed(2);
          sums[index] += "";
        } else {
          if (index == 5) {
            sums[index] = "0.00";
          } else sums[index] = "--";
        }
      });
      sums.filter((v, vi) => {
        if(v !== 'Total' && v !== '--'){
          sums[vi] = this.$store.state.toThousands(v);
        }
      })
      return sums;
    },
    searchTypeChange() {
      this.username = "";
      this.realname = "";
      this.phone = "";
    },
    formatGroup(row, column, cellValue) {
      if (cellValue) {
        return cellValue;
      }
      return "--";
    },
    send() {
      const vm = this;
      if (!this.msgForm.topic) {
        this.$message({
          message: "please input title",
          type: "error",
          duration: vm.duration,
          center: true
        });
        return;
      }
      if (!this.msgForm.content) {
        this.$message({
          message: "please input content",
          type: "error",
          duration: vm.duration,
          center: true
        });
        return;
      }
      vm.msgLoading = true;
      request.http(
        "post",
        "/user/sendmessage",
        {
          receiverid: vm.msgForm.loginid,
          title: vm.msgForm.topic,
          message: vm.msgForm.content
        },
        success => {
          vm.msgLoading = false;
          let code = success.returncode;
          if (code === 200) {
            vm.msgVisible = false;
          } else if (code === 101 || code === 103 || code === 106) {
            request.loginAgain(vm);
          } else {
            alert(success.returncode);
          }
        },
        error => {
          vm.msgLoading = false;
          vm.error();
        }
      );
    },
    closeMsg() {
      this.msgVisible = false;
    },
    openMsg(row) {
      this.msgVisible = true;
      this.$nextTick(function() {
        // DOM is now updated
        // `this` is bound to the current instance
        this.createEditor();
        this.resetMsg();
        this.msgForm.loginid = row._id;
      });
    },
    // 重置msg form
    resetMsg() {
      this.msgForm.topic = "";
      this.msgForm.loginid = "";
      this.msgForm.content = "";
      this.editor.txt.clear();
    },
    createEditor() {
      if (this.editor) {
        return;
      }
      this.editor = new E(this.$refs.editor);
      this.editor.customConfig.onchange = html => {
        this.msgForm.content = html;
      };
      this.editor.create();
      // console.log(this.msgForm.content)
    },
    enableChange(row, status) {
      const vm = this;
      request.http(
        "post",
        "/user/forbid",
        {
          id: row._id,
          status: status
        },
        success => {
          // console.log('tixiaxian--------',success);
          let code = success.returncode;
          if (code === 200) {
            vm.success();
            vm.getUserList();
          } else if (code === 101 || code === 103 || code === 106) {
            request.loginAgain(vm);
          }
        },
        error => {
          console.log(error);
        }
      );
    },
    submitForm(formName) {
      const vm = this;
      if (!vm.createForm.loginname) {
        vm.message("请输入用户名", "error");
        return;
      }
      if (!validator.regexpInput(vm.createForm.loginname)) {
        vm.message("账号名要求3-20位字母或数字", "error");
        return;
      }
      if (!vm.createForm.password) {
        vm.message("请输入密码", "error");
        return;
      }
      if (!validator.regexpPsd(vm.createForm.password)) {
        vm.message("密码要求包含字母和数字的6-16位组合", "error");
        return;
      }
      if (!vm.createForm.psd_sure) {
        vm.message("Please enter confirmed password", "error");
        return;
      }
      if (!validator.regexpPsd(vm.createForm.psd_sure)) {
        vm.message("确认密码要求包含字母和数字的6-16位组合", "error");
        return;
      }
      if (vm.createForm.password != vm.createForm.psd_sure) {
        vm.message("两次密码必须保持一致", "error");
        return;
      }
      if (!vm.createForm.refund) {
        vm.message("请输入奖金组", "error");
        return;
      }
      if (!validator.positiveInt(vm.createForm.refund)) {
        vm.message("奖金组必须是整数", "error");
        return;
      }
      if (
        Number(vm.createForm.refund) < 1800 ||
        Number(vm.createForm.refund) > 2000
      ) {
        vm.message("奖金组超出范围", "error");
        return;
      }
      let data = {
        type: "1"
      };
      for (let v in vm.createForm) {
        let obj = vm.createForm[v];
        if (v == "password") {
          data[v] = CryptoJS.MD5(obj).toString();
          continue;
        }
        if (v == "psd_sure") {
          continue;
        }
        data[v] = obj;
      }
      vm.addzdLoading = true;
      request.http(
        "post",
        "/agency/user/create",
        data,
        success => {
          let code = success.returncode;
          if (code === 200) {
            vm.addzdLoading = false;
            let code = success.returncode;
            vm.$alert(
              "新增总代成功,用户名:" + success.newuser.loginname,
              "Reminder",
              {
                confirmButtonText: "确定",
                callback: action => {
                  vm.closeCreate();
                }
              }
            );
          } else if (code === 101 || code === 103 || code === 106) {
            request.loginAgain(vm);
          } else if (code == 305) {
            vm.message("User name already exists.", "error");
          } else {
            alert(success.returncode);
          }
        },
        error => {
          vm.addzdLoading = false;
          vm.resetForm("createForm");
          vm.error();
        }
      );
    },
    resetForm(formName) {
      this[formName].loginname = "";
      this[formName].password = "";
      this[formName].psd_sure = "";
      this[formName].is_test = "";
      this[formName].refund = "";
    },
    closeCreate() {
      this.createDialog = false;
      this.resetForm("createForm");
    },
    // 跳转页面
    skip(param, routeName) {
      this.$router.push({
        name: routeName,
        query: {
          param: param
        }
      });
    },
    handleSkip(name, param) {
      let menus = localStorage.getItem("cms-user-menu");
      let menusjson = JSON.parse(menus);
      const vm = this;
      // console.log('menusjson', menusjson);
      let index1, index2;
      let selected = false;
      for (let i = 0; i < menusjson.length; i++) {
        index1 = i;
        let f_obj = menusjson[i];
        for (let j = 0; j < f_obj.child.length; j++) {
          index2 = j;
          let san_ = f_obj.child[j].child;
          for (let h = 0; h < san_.length; h++) {
            let url = san_[h].url;
            if (name === url) {
              selected = true;
              break;
            }
          }
          if (selected) {
            break;
          }
        }
        if (selected) {
          break;
        }
      }
      const { href } = this.$router.resolve({
        name: name,
        query: {
          param: param,
          index1: index1,
          index2: index2
        }
      });
      // console.log('href', href);
      window.open(href, "_blank");
    },
    createUsercount() {
      this.createDialog = true;
      this.resetForm("createForm");
    },
    // 层级
    groupFocus() {
      let vm = this;
      if (vm.group.options.length != 0) {
        return;
      }
      vm.group.loading = true;
      let url = "/group/list";
      request.http(
        "get",
        url,
        {
          PageSize: 1000
        },
        success => {
          vm.group.loading = false;
          if (success.returncode) {
            if (
              success.returncode == 103 ||
              success.returncode == 106 ||
              success.returncode == 101
            ) {
              request.loginAgain(vm);
            } else if (success.returncode == 200) {
              let options = success.data;
              if (options.length != 0) {
                vm.group.options = options;
              }
            } else {
              vm.group.loading = false;
            }
          }
        },
        error => {
          vm.group.loading = false;
        }
      );
    },
    handleChangeRouter(name) {
      this.$router.push({
        name: name,
        query: {
          index1: this.index1,
          index2: this.index2
        }
      });
      // console.log(name)
    },
    success() {
      const vm = this;
      this.$message({
        message: "Load Success",
        type: "success",
        duration: vm.duration,
        center: true
      });
    },
    error() {
      const vm = this;
      this.$message({
        message: "Load Failure",
        type: "error",
        duration: vm.duration,
        center: true
      });
    },
    //message
    message(text, type) {
      const vm = this;
      this.$message({
        message: text,
        type: type,
        duration: vm.duration,
        center: true
      });
    },
    isStatusFn(row, column, cellValue) {
      // console.log(typeof cellValue)
      switch (cellValue) {
        case 0:
          return "Enabled";
        case 1:
          return "Disabled";
      }
    },
    isOnlineFn(row, column, cellValue) {
      // console.log(row)
      switch (cellValue) {
        case 0:
          return "离线";
        case 1:
          return "在线";
      }
    },
    isForbidFn(row, column, cellValue) {
      // console.log(row)
      switch (cellValue) {
        case 0:
          return "Enabled";
        case 1:
          return "Disabled";
      }
    },
    formatTime(row, column, cellValue) {
      return moment(cellValue).format("DD-MM-YYYY HH:mm:ss");
      // return moment(cellValue).format('DD-MM-YYYY')
    },
    formatTestUser(row, column, cellValue) {
      let t = "";
      if (cellValue === 1) {
        t = "是";
      } else {
        t = "否";
      }
      return t;
      // return moment(cellValue).format('DD-MM-YYYY')
    },
    formatMoney(row, column, cellValue) {
      if (cellValue) {
        return this.$store.state.toThousands(Number(cellValue));
      }
      return "0.00";
    },
    formatUser(row, column, cellValue) {
      let t;
      if(cellValue == 1){
        t = 'Agent';
      }else if(cellValue == 0){
        t = 'Member';
      }else if(cellValue == 2){
        t = 'User';
      }
      return t;
      // return moment(cellValue).format('DD-MM-YYYY')
    },
    handleCommand(command) {
      var row = command[0];
      var txt = command[1];
      if (txt == "关闭") {
        this.closeLivehouse(row);
      } else if (txt == "开始") {
        this.startLivehouse(row);
      } else if (txt == "Disabled") {
        this.disabledLivehouse(row);
      } else if (txt == "Enabled") {
        this.enableLivehouse(row);
      }
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.getUserList();
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getUserList();
      // console.log(`当前页: ${val}`);
    },
    getUserInfoFn(row) {
      this.dialog = true;
      this.userid = row._id;
      this.loginname = row.loginname;
    },
    handleCloseDialog(val) {
      this.dialog = val;
    },
    handleDialogShow(val) {
      this.dialogIsShow = val;
    },
    // 登出
    tixiaxian(row) {
      let id = row._id;
      const vm = this;
      request.http(
        "post",
        "/user/kickoff",
        {
          id: id
        },
        success => {
          // console.log('tixiaxian--------',success);
          let code = success.returncode;
          if (code === 200) {
            vm.success();
          } else if (code === 101 || code === 103 || code === 106) {
            request.loginAgain(vm);
          }
        },
        error => {
          console.log(error);
        }
      );
    },
    // Disabled
    limit(row) {
      let id = row._id;
      const vm = this;
      request.http(
        "post",
        "/user/kickoff",
        {
          id: id
        },
        success => {
          // console.log('tixiaxian--------',success);
          let code = success.returncode;
          if (code === 200) {
          } else if (code === 101 || code === 103 || code === 106) {
            request.loginAgain(vm);
          }
        },
        error => {
          console.log(error);
        }
      );
    },
    getUserList() {
      this.loading = true;
      const vm = this;
      request.http(
        "get",
        "/user/list",
        {
          PageNum: vm.pageNum,
          PageSize: vm.pageSize,
          // miniCash: vm.minBlance,
          // maxCash: vm.maxBlance,
          // groupid: vm.group.value,
          loginname: vm.username,
          superior_loginname: vm.superLoginname,
          // is_forbid: vm.isForbid,
          // is_online: vm.onLine,
          status: vm.status,
          // is_test: vm.is_test,
          realname: vm.realname,
          phone: vm.phone
        },
        success => {
          vm.loading = false;
          // console.log('userList--------',success);
          let code = success.returncode;
          if (code === 200) {
            vm.userListData = success.data;
            vm.pageNum = Number(success.PageNum);
            vm.total = success.count;
            vm.success();
          } else if (code === 101 || code === 103 || code === 106) {
            request.loginAgain(vm);
          }
        },
        error => {
          vm.loading = false;
          vm.error();
          console.log(error);
        }
      );
    },
    // 面包屑
    handleClickTag(row) {
      this.dialog = true;
      this.userid = row.loginid;
      this.loginname = row.name;
    },
    handleReset() {
      this.username = "";
      this.status = "";
      this.group.value = "";
      this.superLoginname = "";
      this.is_test = "0";
      this.realname = "";
      this.phone = "";
    },
    handleSearch() {
      this.pageNum = 1;
      this.getUserList();
    }
  },
  mounted() {
    let query = this.$route.query;
    if (query.group) {
      this.group.value = query.group;
    }
    this.getUserList();
  }
};
</script>
<style lang="scss" scoped>
/* @import '../../publicCss/header.css'; */

.mt-10 {
  margin-top: 10px;
}

.tr {
  text-align: right;
}

.ml-15 {
  margin-left: 15px;
}
.tag-router{
  // span{
  //   cursor: pointer;
  //   color:#606266;
  //   &:hover{
  //     color:#000;
  //   }
  // }
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
