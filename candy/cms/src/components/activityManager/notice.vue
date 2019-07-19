<template>
  <div class="el-custom banner">
    <div class="content-header">
      <div class="title" style="position:relative;">
        <h2>{{titleName}}</h2>
      </div>
      <div class="search-wrap">
        <div class="nav-title">
          <span :class="item.checked?'current':''" v-for="(item, index) in routerArr" :key="index" @click="handleChangeRouter(item.name)">{{item.title}}</span>
        </div>
        <div class="search-content">
          <div class="search-inner-wrap">
            <label>Status：</label>
            <el-select clearable v-model="enabled.value" placeholder="Status" class="small">
              <el-option v-for="item in enabled.options" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="search-inner-wrap">
            <el-button @click="handleSearch" class="small yes">Search</el-button>
            <el-button @click="handleReset" class="small no">Reset</el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="content-middle">
      <div class="search-wrap">
        <div class="search-inner-wrap">
          <el-button type="success" @click="openDialog()" size="medium" class="edit">Create</el-button>
        </div>
      </div>
    </div>
    <div class="data-table" v-loading="loading">
      <el-table :data="activityLogListData" header-row-class-name="table-header" stripe border style="width: 100%;fong-size:12px;"
        @cell-mouse-enter="mouseOver" max-height="450">
        <el-table-column align="center" prop="order" label="Order">
        </el-table-column>
        <el-table-column align="center" prop="title" label="Title">
        </el-table-column>
        <el-table-column align="center" label="Status">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.enabled" @change="enableChange(scope.row.enabled)" :active-value="1"
              :inactive-value="0" active-color="#2D996E" inactive-color="#C83A4C">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column align="center" label="isRoll">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.isRoll" @change="scrollChange(scope.row.isRoll)" :active-value="1"
              :inactive-value="0" active-color="#2D996E" inactive-color="#C83A4C">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column align="center" label="Popup">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.popup" @change="popupChange(scope.row.popup)" :active-value="1"
              :inactive-value="0" active-color="#2D996E" inactive-color="#C83A4C">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column align="center" label="Notice Time">
          <template slot-scope="scope">
            <span>{{formatTime2(scope.row.start_at)}}</span>
            <span>--</span>
            <span>{{formatTime2(scope.row.stop_at)}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="create_at" :formatter="formatTime" label="Create Time">
        </el-table-column>
        <el-table-column align="center" label="Operate">
          <template slot-scope="scope">
            <el-button @click="editForm(scope.row)" class="small edit">Edit</el-button>
            <!-- <el-button type="text" @click="deleteActivity(scope.row)" size="small">删除</el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <div class="fenye">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum"
          :page-size="pageSize" :page-sizes="[10, 20, 40, 80,160,350,700,1000]" layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
      <!-- <editor v-if="showEditor" @closeEditor="handlecloseEditor" :activityParam="activityParam"></editor> -->
    </div>
    <!-- 新增 S-->
    <el-dialog :title="formTitle" :before-close="closeForm" :visible.sync="formVisible" class="relative-dialog">
      <div class="body-middle">
        <div class="form">
          <div class="form-row">
            <span class="exp">Title</span>
            <span class="exp-after">:</span>
            <el-input type="text" v-model.trim="form.title"></el-input>
          </div>
          <div class="form-row">
            <span class="exp">Order</span>
            <span class="exp-after">:</span>
            <el-input type="text" v-model.trim="form.order"></el-input>
          </div>
          <div class="form-row">
            <span class="exp">Roll</span>
            <span class="exp-after">:</span>
            <el-switch v-model="form.isRoll" :active-value="1" :inactive-value="0" active-color="#2D996E" inactive-color="#C83A4C"></el-switch>
          </div>
          <div class="form-row">
            <span class="exp">Popup</span>
            <span class="exp-after">:</span>
            <el-switch v-model="form.popup" :active-value="1" :inactive-value="0" active-color="#2D996E" inactive-color="#C83A4C"></el-switch>
          </div>
          <div class="form-row">
            <span class="exp">Notice time</span>
            <span class="exp-after">:</span>
            <el-date-picker format="dd-MM-yyyy HH:mm:ss" v-model="form.time" type="daterange" align="right" unlink-panels range-separator="-"
              start-placeholder="Begin" end-placeholder="End" :picker-options="pickerOptions" :disabled="timeDisabled"
              style="margin-right:10px;">
            </el-date-picker>
            <el-checkbox v-model="forever">Forever</el-checkbox>
          </div>
          <div class="form-row file-inner">
            <span class="exp">Content photo</span>
            <span class="exp-after">:</span>
            <el-upload class="upload-demo" :action="form.photo.action" :on-change="handleCoPhotoChange"
              :file-list="form.photo.filterList" :list-type="form.photo.listStyle" :limit="form.photo.limit"
              :auto-upload="false" :on-remove="handleRemoveCo">
              <el-button size="small" class="small edit">Upload</el-button>
            </el-upload>
            <span class="tip-after">Please upload 100x100 image size in PNG /jpeg/ JPG</span>
            <!-- <span class="tip-after">请上传100x100的图片尺寸，格式为png/jpeg/jpg</span> -->
          </div>
          <div class="form-row file-inner">
            <span class="exp">Content text</span>
            <span class="exp-after">:</span>
            <div ref="editor" style="text-align:left" class="flex-all">
            </div>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <div v-show="formCreate">
          <el-button type="primary" @click="createActivity()" class="yes" :loading="dialogLoading">Confirm</el-button>
          <el-button @click="closeForm()" class="no">Cancel</el-button>
        </div>
        <div v-show="!formCreate">
          <el-button type="primary" @click="editActivity()" class="yes" :loading="dialogLoading">Confirm</el-button>
          <el-button @click="closeForm()" class="no">Cancel</el-button>
        </div>
      </div>
    </el-dialog>
    <!-- 新增 END -->
  </div>
</template>
<script>
  import request from '@/axios/axios.js'
  import DialogUserInfo from '../dialog-user-info/DialogUserInfo';
  import tableBtn from '../littleStyle/tableBtn';
  import moment from 'moment'
  import E from 'wangeditor'
  export default {
    name: 'notice',
    components: {
      tableBtn,
      DialogUserInfo,
      E
    },
    data() {
      return {
        index1: 0,
        index2: 0,
        formTitle: "Create",
        formCreate: true,
        titleName: '',
        routerArr: [],
        loading: false,
        dialogLoading: false,
        pageNum: 1,
        pageSize: 40,
        enabled: {
          value: "",
          options: [{
              label: "all",
              value: ""
            },
            {
              label: "enabled",
              value: 1
            },
            {
              label: "disabled",
              value: 0
            },
          ]
        },
        total: 0,
        activityLogListData: [],
        pickerOptions: {
          shortcuts: [{
            text: 'Today',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: 'Yesterday',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              end.setTime(start.getTime() - 3600 * 1000 * 24);
              start.setTime(start.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: 'Recent 1 Week',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: 'Recent 1 Month',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: 'Recent 3 Months',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        duration: 1000,
        dialog: false,
        dialogIsShow: false,
        // 用于 新增和编辑的form
        form: {
          title: "",
          order: "",
          isRoll: '0',
          popup: '0',
          time: '',
          content: "",
          photo: {
            action: "",
            filterList: [],
            limit: 1,
            listStyle: 'picture',
            file: {},
            url: "",
            isFile: false,
          },
        },
        forever: false,
        timeDisabled: false,
        start_at: "",
        stop_at: "",
        formVisible: false,
        rowKey: "",
        editor: ""
      }
    },
    created() {
      this.routerArr = [];
      let query = this.$route.query;
      this.index1 = Number(query.index1);
      this.index2 = Number(query.index2);
      let data = this.$store.state.formatMenuFn(this.index1, this.index2, 'notice');
      this.routerArr = data.routerArr;
      this.titleName = data.titleName;
      this.getActivityLogList();
    },
    mounted() {},
    watch: {
      forever() {
        if (this.forever) {
          this.timeDisabled = true;
          // this.rules.time = [{
          //   required: false,
          //   message: '请选择活动时间',
          //   trigger: 'blur',
          // }]
          let end = new Date();
          end.setFullYear(end.getFullYear() + 10);
          this.stop_at = end.toString();
          this.start_at = new Date().toString();
        } else {
          this.timeDisabled = false;
          // this.rules.time = [{
          //   required: true,
          //   message: '请选择活动时间',
          //   trigger: 'blur',
          // }]
        }
      }
    },
    methods: {
      handleRemoveCo(file, fileList) {
        // console.log("file", file);
        // console.log("fileList", fileList);
        if (fileList.length == 0) {
          this.form.photo.url = "";
          this.form.photo.file = {};
          this.form.photo.isFile = true;
        }
      },
      createEditor() {
        if (this.editor) {
          return;
        }
        this.editor = new E(this.$refs.editor)
        this.editor.customConfig.onchange = (html) => {
          this.form.content = html
        }
        this.editor.create()
        // console.log(this.form.content)
      },
      mouseOver(row, column, cell, event) {
        this.rowKey = row._id;
      },
      enableChange(value) {
        // console.log("value", value);
        this.modifiedEnabled("enabled", value.toString(), this.rowKey);
      },
      scrollChange(value) {
        // console.log("value", value);
        this.modifiedEnabled("isRoll", value.toString(), this.rowKey);
      },
      popupChange(value) {
        // console.log("value", value);
        this.modifiedEnabled("popup", value.toString(), this.rowKey);
      },
      //是否开启
      modifiedEnabled(key, value, id) {
        let self = this,
          data = {};
        let url = "/notice/update";
        data["id"] = id;
        data[key] = value;
        request.http(
          "post",
          url,
          data,
          success => {
            self.loading = false;
            let code = success.returncode;
            if (code === 200) {
              self.message("success", "success");
            } else if (code === 101 || code === 103 || code === 106) {
              request.loginAgain(self);
            }
          },
          error => {
            self.loading = false;
            self.message("error", "error");
          }
        );
      },
      formatImg(row, column, cellValue) {
        let buffer = new ArrayBuffer();
        buffer = cellValue;
        let blob = new Blob([buffer]);
        var reader = new FileReader();
        reader.readAsText(blob, 'utf-8');
        reader.onload = function (e) {
          console.info(reader.result);
          return reader.result;
        }
      },
      openDialog() {
        this.formTitle = "Create";
        this.formCreate = true;
        this.formVisible = true;
        this.$nextTick(function () {
          this.createEditor();
          this.resetForm();
        })
      },
      resetForm() {
        this.form.title = "";
        this.form.order = "";
        this.form.time = "";
        this.form.content = "";
        this.form.isRoll = "0";
        this.form.popup = "0";
        this.editor.txt.clear();
        this.form.photo.filterList = [];
        this.form.photo.url = "";
        this.form.photo.file = {};
        this.form.photo.isFile = false;
        this.forever = false;
      },
      handleCoPhotoChange(file, fileList) {
        const vm = this;
        this.form.photo.file = fileList[0];
      },
      closeForm() {
        this.formVisible = false
        this.resetForm();
      },
      handleChangeRouter(name) {
        this.$router.push({
          name: name,
          query: {
            index1: this.index1,
            index2: this.index2
          }
        })
        // console.log(name)
      },
      succee() {
        const vm = this;
        this.$message({
          message: 'Load Success',
          type: 'success',
          duration: vm.duration,
          center: true
        })
      },
      message(value, type) {
        const vm = this;
        this.$message({
          message: value,
          type: type,
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
        this.getActivityLogList();
      },
      handleCurrentChange(val) {
        this.pageNum = val;
        this.getActivityLogList();
        // console.log(`当前页: ${val}`);
      },
      handlecloseEditor(val) {
        // this.showEditor = val;
      },
      editForm(row) {
        this.formCreate = false;
        this.formVisible = true;
        this.$nextTick(function () {
          this.createEditor();
          this.resetForm();
          this.formTitle = "Edit";
          for (let i in this.form) {
            if (i == "time") {
              this.form.time = [new Date(row["start_at"]), new Date(row["stop_at"])];
              continue;
            }
            if (i == "photo") {
              if (row[i]) {
                this.form[i].isFile = false;
                this.form[i].filterList = [{
                  name: "",
                  url: row[i]
                }];
                this.form[i].url = row[i];
              } else {
                this.form[i].isFile = true;
                this.form[i].filterList = [];
                this.form[i].url = "";
              }
              continue;
            }
            if (i == "content" && row[i]) {
              this.editor.txt.html(row[i]);
            }
            this.form[i] = row[i];
          }
          this.rowKey = row._id;
        })
      },
      editActivity(item) {
        const vm = this;
        if (!this.form.title) {
          this.$message({
            message: 'Please enter the title',
            type: 'error',
            duration: vm.duration,
            center: true
          })
          return;
        }
        if (!this.form.order) {
          this.$message({
            message: 'Please enter a sort value',
            type: 'error',
            duration: vm.duration,
            center: true
          })
          return;
        }
        if (!this.forever) {
          if (!this.form.time.toString()) {
            this.$message({
              message: 'Please select time',
              type: 'error',
              duration: vm.duration,
              center: true
            })
            return;
          }
        }
        // if (JSON.stringify(this.form.photo.file) == "{}" && !this.form.photo.url) {
        //   this.$message({
        //     message: '请上传内容图片',
        //     type: 'error',
        //     duration: vm.duration,
        //     center: true
        //   })
        //   return;
        // }
        if (!this.form.content) {
          this.$message({
            message: 'Please enter the content text',
            type: 'error',
            duration: vm.duration,
            center: true
          })
          return;
        }
        vm.dialogLoading = true;
        let start_at, stop_at;
        if (this.forever) {
          start_at = this.start_at;
          stop_at = this.stop_at;
        } else {
          start_at = this.form.time[0];
          stop_at = this.form.time[1];
        }
        vm.dialogLoading = true;
        let photo = this.form.photo.file.raw;
        let content_true = JSON.stringify(this.form.photo.file) == "{}" && !this.form.photo.url;
        let formdata = new FormData();
        formdata.append("picture", photo);
        let isFile1 = this.form.photo.isFile;
        if (isFile1) {
          if (!content_true) {
            request.upload(
              "post",
              "/uploadFile",
              formdata,
              success => {
                vm.form.photo.url = success.toString();
                request.http(
                  'post',
                  '/notice/update', {
                    title: vm.form.title,
                    order: vm.form.order,
                    start_at: start_at,
                    stop_at: stop_at,
                    photo: vm.form.photo.url,
                    content: vm.form.content,
                    enabled: 1,
                    isRoll: vm.form.isRoll,
                    popup: vm.form.popup,
                    id: vm.rowKey
                  },
                  (success) => {
                    vm.dialogLoading = false;
                    let code = success.returncode;
                    if (code === 200) {
                      vm.formVisible = false;
                      vm.form.photo.isFile = false;
                      vm.getActivityLogList();
                    } else if (code === 101 || code === 103 || code === 106) {
                      request.loginAgain(vm)
                    } else {
                      alert(success.returncode)
                    }
                  },
                  (error) => {
                    vm.dialogLoading = false;
                    vm.error();
                  }
                )
              },
              error => {
                vm.dialogLoading = false;
                vm.error();
              }
            );
          } else {
            request.http(
              'post',
              '/notice/update', {
                title: vm.form.title,
                order: vm.form.order,
                start_at: start_at,
                stop_at: stop_at,
                photo: "",
                content: vm.form.content,
                enabled: 1,
                isRoll: vm.form.isRoll,
                popup: vm.form.popup,
                id: vm.rowKey
              },
              (success) => {
                vm.dialogLoading = false;
                let code = success.returncode;
                if (code === 200) {
                  vm.formVisible = false;
                  vm.form.photo.isFile = false;
                  vm.getActivityLogList();
                } else if (code === 101 || code === 103 || code === 106) {
                  request.loginAgain(vm)
                } else {
                  alert(success.returncode)
                }
              },
              (error) => {
                vm.dialogLoading = false;
                vm.error();
              }
            )
          }
        } else {
          if (!content_true) {
            request.http(
              'post',
              '/notice/update', {
                title: vm.form.title,
                order: vm.form.order,
                start_at: start_at,
                stop_at: stop_at,
                photo: vm.form.photo.url,
                content: vm.form.content,
                enabled: 1,
                isRoll: vm.form.isRoll,
                popup: vm.form.popup,
                id: vm.rowKey
              },
              (success) => {
                vm.dialogLoading = false;
                let code = success.returncode;
                if (code === 200) {
                  vm.formVisible = false;
                  vm.form.photo.isFile = false;
                  vm.getActivityLogList();
                } else if (code === 101 || code === 103 || code === 106) {
                  request.loginAgain(vm)
                } else {
                  alert(success.returncode)
                }
              },
              (error) => {
                vm.dialogLoading = false;
                vm.error();
              }
            )
          } else {
            request.http(
              'post',
              '/notice/update', {
                title: vm.form.title,
                order: vm.form.order,
                start_at: start_at,
                stop_at: stop_at,
                photo: "",
                content: vm.form.content,
                enabled: 1,
                isRoll: vm.form.isRoll,
                popup: vm.form.popup,
                id: vm.rowKey
              },
              (success) => {
                vm.dialogLoading = false;
                let code = success.returncode;
                if (code === 200) {
                  vm.formVisible = false;
                  vm.form.photo.isFile = false;
                  vm.getActivityLogList();
                } else if (code === 101 || code === 103 || code === 106) {
                  request.loginAgain(vm)
                } else {
                  alert(success.returncode)
                }
              },
              (error) => {
                vm.dialogLoading = false;
                vm.error();
              }
            )
          }
        }
      },
      createActivity() {
        const vm = this;
        if (!this.form.title) {
          this.$message({
            message: 'Please enter the title',
            type: 'error',
            duration: vm.duration,
            center: true
          })
          return;
        }
        if (!this.form.order) {
          this.$message({
            message: 'Please enter a sort value',
            type: 'error',
            duration: vm.duration,
            center: true
          })
          return;
        }
        if (!this.forever) {
          if (!this.form.time.toString()) {
            this.$message({
              message: 'Please select time',
              type: 'error',
              duration: vm.duration,
              center: true
            })
            return;
          }
        }
        // if (JSON.stringify(this.form.photo.file) == "{}" && !this.form.photo.url) {
        //   this.$message({
        //     message: '请上传内容图片',
        //     type: 'error',
        //     duration: vm.duration,
        //     center: true
        //   })
        //   return;
        // }
        if (!this.form.content) {
          this.$message({
            message: 'Please enter the content text',
            type: 'error',
            duration: vm.duration,
            center: true
          })
          return;
        }
        vm.dialogLoading = true;
        let start_at, stop_at;
        if (this.forever) {
          start_at = this.start_at;
          stop_at = this.stop_at;
        } else {
          start_at = this.form.time[0];
          stop_at = this.form.time[1];
        }
        let photo = this.form.photo.file.raw;
        let formdata = new FormData();
        if (photo) {
          formdata.append("picture", photo);
          request.upload(
            "post",
            "/uploadFile",
            formdata,
            success => {
              vm.form.photo.url = success.toString();
              request.http(
                'post',
                '/notice/create', {
                  title: vm.form.title,
                  order: vm.form.order,
                  start_at: start_at,
                  stop_at: stop_at,
                  photo: vm.form.photo.url,
                  content: vm.form.content,
                  enabled: 1,
                  isRoll: vm.form.isRoll,
                  popup: vm.form.popup
                },
                (success) => {
                  vm.dialogLoading = false;
                  let code = success.returncode;
                  if (code === 200) {
                    vm.formVisible = false;
                    vm.getActivityLogList();
                  } else if (code === 101 || code === 103 || code === 106) {
                    request.loginAgain(vm)
                  } else {
                    alert(success.returncode)
                  }
                },
                (error) => {
                  vm.dialogLoading = false;
                  vm.error();
                }
              )
            },
            error => {
              vm.dialogLoading = false;
              vm.error();
            }
          );
        } else {
          request.http(
            'post',
            '/notice/create', {
              title: vm.form.title,
              order: vm.form.order,
              start_at: start_at,
              stop_at: stop_at,
              content: vm.form.content,
              enabled: 1,
              isRoll: vm.form.isRoll,
              popup: vm.form.popup
            },
            (success) => {
              vm.dialogLoading = false;
              let code = success.returncode;
              if (code === 200) {
                vm.formVisible = false;
                vm.getActivityLogList();
              } else if (code === 101 || code === 103 || code === 106) {
                request.loginAgain(vm)
              } else {
                alert(success.returncode)
              }
            },
            (error) => {
              vm.dialogLoading = false;
              vm.error();
            }
          )
        }
      },
      deleteActivity(item) {
        const vm = this;
        this.$alert('Are you sure you want to continue this operation?', 'Reminder', {
          showCancelButton: true,
          center: true,
          confirmButtonText: 'Confirm',
          callback: action => {
            if (action === 'confirm') {
              request.http(
                'post',
                '/notice/delete', {
                  id: item._id
                },
                (success) => {
                  let code = success.returncode;
                  if (code === 200) {
                    vm.getActivityLogList();
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
            }
          }
        });
      },
      formatTime(row, column, cellValue) {
        return moment(cellValue).format('DD-MM-YYYY HH:mm:ss')
        // return moment(cellValue).format('DD-MM-YYYY')
      },
      formatTime2(time) {
        return moment(time).format('DD-MM-YYYY HH:mm:ss')
      },
      getActivityLogList() {
        const vm = this;
        vm.loading = true;
        request.http(
          'get',
          '/notice/list', {
            PageNum: vm.pageNum,
            PageSize: vm.pageSize,
            enabled: vm.enabled.value,
          },
          (success) => {
            vm.loading = false;
            let code = success.returncode;
            if (code === 200) {
              vm.activityLogListData = success.data;
              vm.pageNum = Number(success.PageNum);
              vm.total = success.count;
              vm.succee();
            } else if (code === 101 || code === 103 || code === 106) {
              request.loginAgain(vm)
            } else {
              alert(success.returncode)
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
        this.username = '';
        this.searchTime = '';
        this.ip = '';
        this.keywords = '';
      },
      handleSearch() {
        this.getActivityLogList();
      },
    }
  }

</script>
<style lang="scss">
  /* @import '../../publicCss/header.css'; */

  .banner {
    .el-custom .el-form-item {
      justify-content: flex-start;
    }

    .el-custom .el-form-item .el-form-item__content {
      display: flex;
      /* justify-content: space-around; */
      align-items: center;
    }

    .el-form-item {
      justify-content: flex-start;
    }

    .el-form-item__content {
      flex: 1;
      width: auto;
    }

    .el-form-item__label {
      width: 60px;
      font-size: 12px;
      color: #191919;
      /* letter-spacing: 6px; */
      text-align: justify;
      text-align-last: justify;
    }
  }

</style>
