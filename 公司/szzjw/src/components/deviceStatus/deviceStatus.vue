<template>
  <div class="deviceStatus">
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
              prop="regRealname"
              label="姓名"
              width="180">
            </el-table-column>
            <el-table-column
              prop="userid"
              label="ID"
              width="180">
            </el-table-column>
            <el-table-column
              prop="sn"
              label="设备号">
            </el-table-column>
            <el-table-column
              prop="deviceAt"
              label="识别时间">
              <template slot-scope="scope">
                <span>{{ scope.row.deviceAt | formatTime}}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <el-dialog :title="formTitle" width="379px" @close="resetForm('dataForm')" :visible.sync="dialogFormVisible">
        <el-form :model="dataForm" status-icon :rules="rules" ref="dataForm" label-width="100px" class="demo-dataForm" size="mini">
          <el-form-item label="设备SN" prop="sn">
            <el-input type="text" size="mini" clearable v-model="dataForm.sn" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="IP地址" prop="ip">
            <el-input type="text" size="mini" clearable v-model="dataForm.ip" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="设备类型" prop="devType.val">
            <el-select v-model="dataForm.devType.val" size="mini" clearable placeholder="请选择">
              <el-option
                v-for="item in dataForm.devType.data"
                :key="item.val"
                :label="item.label"
                :value="item.val">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="设备名称" prop="deviceName">
            <el-input type="text" size="mini" clearable v-model="dataForm.deviceName" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" center>
          <el-button size="mini" @click="resetForm('dataForm')">取 消</el-button>
          <el-button size="mini" type="primary" @click="submitForm('dataForm')">提交</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import moment from 'moment';
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
      dialogFormVisible: false,
      formTitle: '',
      dataForm: {},
      createForm: {
        sn: '',
        ip: '',
        devType: {
          val: '',
          data: [
            {label: 'W200', val: 'W200'},
            {label: 'S320', val: 'S320'},
          ],
        },
        deviceName: '',
      },
      rules: {
        sn: [
          { required: true, message: '请输入设备SN号', trigger: 'blur' },
        ],
        ip: [
          { required: false, message: '请输入IP地址', trigger: 'blur' },
        ],
        "devType.val": [
          { required: true, message: '请选择设备类型', trigger: 'change' },
        ],
        deviceName: [
          { required: false, message: '请输入名称', trigger: 'blur' },
        ]
      }
    }
  },
  created() {
    this.dataForm = this.createForm;
  },
  mounted() {
    this.getDataList();
    // this.formatData();
  },
  computed: {},
  watch: {},
  methods: {
    showCreate() {
      this.dataForm = this.createForm;
      this.formTitle = '添加';
      this.dialogFormVisible = true
    },
    showEdit(row) {
      for(let i in this.updateForm){
        this.dataForm[i] = row[i];
      }
      this.dataForm.id = row.id;
      this.formTitle = '修改';
      this.dialogFormVisible = true
    },
    // 确认创建
    submitForm(formName) {
      const vm = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if(vm.formTitle === '添加'){
            vm.createGroup();
          }else{
            vm.updateGroup();
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.dialogFormVisible = false;
    },
    // 获取数据列表
    getDataList() {
      const vm = this;
      this.$http.get('/recognition/recordList', {
        params: {
          pageSize: 10,
          pageNum: 1
        }
      }).then(res => {
        if(res.body.code === 200){
          let data = res.body.data;
          // vm.pageNum = data.pageNum;
          vm.total = data.total;
          vm.tableData = data.query;
        }
      }).catch(err => {
        console.log(err);
      })
    },
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

