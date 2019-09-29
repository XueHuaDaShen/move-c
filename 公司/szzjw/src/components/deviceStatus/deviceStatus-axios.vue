<template>
  <div class="deviceStatus" v-loading.fullscreen="loading">
    <!-- <div class="search-wrap box-shadow">
      <div class="item">
        <el-input size="mini" clearable v-model="searchData.value1" placeholder="查询条件"></el-input>
      </div>
      <div class="item">
        <el-button size="mini" type="primary">Search</el-button>
      </div>
    </div> -->
    <div class="data-content box-shadow">
      <div class="title-operate-btn">
        <el-button size="mini" @click="showCreate" type="primary">添加</el-button>
      </div>
      <div class="echart-table-wrap">
        <div class="table-content">
          <el-table
            :data="tableData"
            border
            style="width: 100%">
            <el-table-column
              prop="deviceName"
              label="设备名称">
            </el-table-column>
            <el-table-column
              prop="sn"
              label="设备编号">
            </el-table-column>
            <el-table-column
              prop="ip"
              label="设备IP">
            </el-table-column>
            <el-table-column
              prop="access"
              :formatter="formatType"
              label="进出">
            </el-table-column>
            <el-table-column
              label="操作">
              <template slot-scope="scope">
                <div class="reperate-wrap">
                  <div><el-button @click="showEdit(scope.row)" type="primary" size="mini">修改</el-button></div>
                  <div><el-button @click="handleDelete(scope.row)" type="primary" size="mini">删除</el-button></div>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <el-dialog title="添加" width="379px" @close="resetForm('createForm')" :visible.sync="createFormVisible">
        <el-form :model="createForm" status-icon :rules="rules" ref="createForm" label-width="100px" class="demo-createForm" size="mini">
          <el-form-item label="设备编号" prop="sn">
            <el-input type="text" size="mini" clearable v-model="createForm.sn" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="设备类型" prop="devType.val">
            <el-select v-model="createForm.devType.val" size="mini" clearable placeholder="请选择" @focus="getDeviceType">
              <el-option
                v-for="item in createForm.devType.data"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="IP地址" prop="ip">
            <el-input type="text" size="mini" clearable v-model="createForm.ip" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="出入口" prop="access.val">
            <el-select v-model="createForm.access.val" size="mini" clearable placeholder="请选择">
              <el-option
                v-for="item in createForm.access.data"
                :key="item.val"
                :label="item.label"
                :value="item.val">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="设备名称" prop="deviceName">
            <el-input type="text" size="mini" clearable v-model="createForm.deviceName" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" center>
          <el-button size="mini" @click="resetForm('createForm')">取 消</el-button>
          <el-button size="mini" type="primary" @click="submitForm('createForm')">提交</el-button>
        </div>
      </el-dialog>
      <el-dialog title="修改" width="379px" @close="resetForm('updateForm')" :visible.sync="updateFormVisible">
        <el-form :model="updateForm" status-icon :rules="rules" ref="updateForm" label-width="100px" class="demo-updateForm" size="mini">
          <el-form-item label="IP地址" prop="ip">
            <el-input type="text" size="mini" clearable v-model="updateForm.ip" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="出入口" prop="access.val">
            <el-select v-model="updateForm.access.val" size="mini" clearable placeholder="请选择">
              <el-option
                v-for="item in updateForm.access.data"
                :key="item.val"
                :label="item.label"
                :value="item.val">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="设备名称" prop="deviceName">
            <el-input type="text" size="mini" clearable v-model="updateForm.deviceName" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" center>
          <el-button size="mini" @click="resetForm('updateForm')">取 消</el-button>
          <el-button size="mini" type="primary" @click="submitForm('updateForm')">提交</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import moment from 'moment';
import request from "@/axios/axios";
export default {
  name: 'deviceStatus',
  data() {
    return {
      isClick: false,
      loading: false,
      moment: moment,
      searchData: {
        value1: '',
      },
      tableData: [],
      createFormVisible: false,
      updateFormVisible: false,
      createForm: {
        sn: '',
        ip: '',
        devType: {
          val: '',
          data: [],
        },
        access: {
          val: '',
          data: [
            {label: '入口', val: '0'},
            {label: '出口', val: '1'},
          ],
        },
        deviceName: '',
      },
      updateForm: {
        sn: '',
        ip: '',
        access: {
          val: '',
          data: [
            {label: '入口', val: '0'},
            {label: '出口', val: '1'},
          ],
        },
        deviceName: '',
      },
      rules: {
        sn: [
          { required: true, message: '请输入设备编号号', trigger: 'blur' },
        ],
        ip: [
          { required: true, message: '请输入IP地址', trigger: 'blur' },
        ],
        "devType.val": [
          { required: true, message: '请选择设备类型', trigger: 'change' },
        ],
        "access.val": [
          { required: true, message: '请选择出入口', trigger: 'change' },
        ],
        deviceName: [
          { required: true, message: '请输入名称', trigger: 'blur' },
        ]
      }
    }
  },
  created() {
    this.dataForm = this.createForm;
  },
  mounted() {
    this.getDataList();
    this.getDeviceType();
    // this.formatData();
  },
  computed: {},
  watch: {},
  methods: {
    formatType(row, column, cellValue, index) {
      let data = this.updateForm.access.data;
      if(cellValue.toString()){
        return data.filter(item => item.val == cellValue)[0].label;
      }
      return '--'
    },
    showCreate() {
      this.createFormVisible = true
    },
    showEdit(row) {
      for(let i in this.updateForm){
        if(i === 'access'){
          // console.log(this.dataForm[i])
          this.updateForm[i].val = row[i].toString();
        }else{
          this.updateForm[i] = row[i];
        }
      }
      this.updateFormVisible = true
    },
    // 确认创建
    submitForm(formName) {
      const vm = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let url = '';
          let data = {};
          if(formName === 'createForm'){
            let {
              sn,
              ip,
              devType,
              access,
              deviceName,
            } = vm[formName];
            url = '/device/register';
            data = {sn, ip, devType: devType.val, access: access.val, deviceName, deviceAt: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')}
          }else{
            let {
              sn,
              ip,
              access,
              deviceName,
            } = vm[formName];
            url = '/device/update';
            data = {sn, ip, access: access.val, deviceName}
          }
          vm.deviceReg(url, data, formName);
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.createFormVisible = false;
      this.updateFormVisible = false
    },
    handleDelete(row) {
      const vm = this;
      let resetPwd = () => {
        vm.loading = true;
        request({
          url: '/device/delete',
          param: {
            sn: row.sn
          },
          method: 'get',
          onError: err => {
            vm.loading = false;
          },
          vm,
        }).then(res => {
          let code = res.code;
          vm.loading = false;
          if(code === 200){
            vm.$message({
              message: '删除成功',
              type: 'success',
              duration: 1500,
            });
            vm.getDataList();
          }
        });
      }
      this.$alert('确定删除当前班组吗？', '温馨提示', {
        confirmButtonText: '确定',
        callback: action => {
          if(action === 'confirm'){
            // alert('已删除')
            resetPwd();
          }
        }
      });
    },
    // 获取设备类型
    getDeviceType() {
      const vm = this;
      // vm.loading = true;
      if(vm.createForm.devType.data.length > 0){
        return
      }
      request({
        url: '/device/groupList',
        param: {},
        method: 'get',
        onError: err => {
          // vm.loading = false;
          // vm.isClick = false;
        },
        vm,
      }).then(res => {
        // console.log(res)
        // vm.loading = false;
        if(res.code === 200){
          // let data = res.data;
          // // vm.pageNum = data.pageNum;
          // vm.total = data.total;
          // vm.tableData = data.query;
          vm.createForm.devType.data = res.data;
        }
      });
    },
    // 获取数据列表
    getDataList() {
      const vm = this;
      vm.loading = true;
      request({
        url: '/device/list',
        param: {
          pageSize: 10,
          pageNum: 1
        },
        method: 'get',
        onError: err => {
          vm.loading = false;
          // vm.isClick = false;
        },
        vm,
      }).then(res => {
        vm.loading = false;
        if(res.code === 200){
          let data = res.data;
          // vm.pageNum = data.pageNum;
          vm.total = data.total;
          vm.tableData = data.query;
        }
      });
    },
    deviceReg(url, data, formName) {
      const vm = this;
      vm.loading = true;
      vm.isClick = true;
      request({
        url,
        param: data,
        method: 'post',
        onError: err => {
          vm.loading = false;
          vm.isClick = false;
        },
        vm,
      }).then(res => {
        let code = res.code;
        vm.loading = false;
        vm.isClick = false;
        if(code === 200){
          vm.resetForm(formName);
          vm.$message({
            message: '提交成功',
            type: 'success',
            duration: 1500,
          });
          vm.getDataList();
        }
      });
    }
  },
}
</script>
<style lang="scss" scoped>
.echart-table-wrap{
  width:100%;
  overflow: hidden;
  .echart-wrap{
    width:100%;
    height:500px;
    // float: left;
    >div{
      width:100%;
      height:100%;
    }
  }
  .table-content{
    padding: 20px 0;
    // width:100%;
    // float: right;
  }
}
</style>

