<template>
  <div class="groupManager" v-loading.fullscreen="loading">
    <!-- <div class="search-wrap box-shadow">
      <div class="item">
        <el-button size="mini" @click="searchList" type="primary">搜索</el-button>
      </div>
    </div> -->
    <div class="data-content box-shadow">
      <div class="title-operate-btn">
        <el-button size="mini" @click="showCreate" type="primary">添加</el-button>
      </div>
      <div class="table-content">
        <el-row :gutter="20">
          <el-col :span="3">
            <div class="tree-wrap">
              <el-radio-group v-model="createForm.companyId" @change="searchList">
                <el-radio :label="item.id" v-for="(item, i) in treeData" :key="i">{{item.name}}</el-radio>
              </el-radio-group>
              <!-- <el-tree :data="treeData" show-checkbox :props="defaultProps" @check-change="handleCheckChange"></el-tree> -->
            </div>
          </el-col>
          <el-col :span="21">
            <div class="table-wrap">
              <el-table
                :data="tableData"
                header-row-class-name="header-row"
                style="width: 100%">
                <el-table-column
                  prop="groupName"
                  label="部门名称">
                </el-table-column>
                <el-table-column
                  prop="message"
                  label="备注">
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
          </el-col>
        </el-row>
      </div>
      <div class="table-pagination">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageNum"
          size="mini"
          :page-sizes="[10, 30, 50, 100]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
      <el-dialog :title="formTitle" width="379px" @close="resetForm('dataForm')" :visible.sync="dialogFormVisible">
        <el-form :model="dataForm" :rules="rules" ref="dataForm" :label-width="formLabelWidth" size="mini">
          <el-form-item label="班组" prop="groupName">
            <div class="groupManager-item">
              <el-input size="mini" v-model="dataForm.groupName" placeholder="请输入班组名"></el-input>
            </div>
          </el-form-item>
          <el-form-item label="负责人" prop="leaderName">
            <div class="groupManager-item">
              <el-input size="mini" v-model="dataForm.leaderName" placeholder="请输入负责人姓名"></el-input>
            </div>
          </el-form-item>
          <el-form-item label="负责人证件号" prop="leaderIdCard">
            <div class="groupManager-item">
              <el-input size="mini" v-model="dataForm.leaderIdCard" placeholder="请输入负责人证件号"></el-input>
            </div>
          </el-form-item>
          <el-form-item label="负责人手机号" prop="leaderPhone">
            <div class="groupManager-item">
              <el-input size="mini" v-model="dataForm.leaderPhone" placeholder="请输入负责人手机号"></el-input>
            </div>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" center>
          <el-button size="mini" @click="resetForm('dataForm')">取 消</el-button>
          <el-button size="mini" :disabled="isClick" type="primary" @click="submitForm('dataForm')">提交</el-button>
        </div>
      </el-dialog>
      <!-- <el-dialog title="Create" width="379px" @close="resetForm('createForm')" :visible.sync="dialogFormVisible">
        <el-form :model="createForm" :rules="rules" ref="createForm" :label-width="formLabelWidth">
          <el-form-item label="班组" prop="group.val">
            <div class="groupManager-item">
              <el-select v-model="createForm.group.val" size="mini" clearable placeholder="请选择班组">
                <el-option
                  v-for="item in createForm.group.data"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </div>
          </el-form-item>
          <el-form-item label="负责人" prop="groupUser.val">
            <div class="groupManager-item">
              <el-select v-model="createForm.groupUser.val" size="mini" clearable placeholder="请选择班组负责人">
                <el-option
                  v-for="item in createForm.groupUser.data"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </div>
          </el-form-item>
          <el-form-item label="承诺书" prop="sign.bln">
            <div class="groupManager-item">
              <div class="select-wrap">
                <el-checkbox v-model="createForm.sign.bln">已签字</el-checkbox>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="工种" prop="workerType.val">
            <div class="groupManager-item">
              <el-select v-model="createForm.workerType.val" size="mini" clearable placeholder="请选择工种">
                <el-option
                  v-for="item in createForm.workerType.data"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </div>
          </el-form-item>
          <el-form-item label="单价" prop="workerPrice.val">
            <div class="groupManager-item">
              <el-select v-model="createForm.workerPrice.val" size="mini" clearable placeholder="请选择单价">
                <el-option
                  v-for="item in createForm.workerPrice.data"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </div>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" center>
          <el-button size="mini" @click="resetForm('createForm')">取 消</el-button>
          <el-button size="mini" type="primary" @click="submitForm('createForm')">提交</el-button>
        </div>
      </el-dialog> -->
    </div>
  </div>
</template>
<script>
import MD5 from 'md5';
import request from "@/axios/axios";
export default {
  name: 'groupManager',
  data() {
    return {
      loading: false,
      isClick: false,
      groupTtree: [],
      defaultProps: {
        label: 'name'
      },
      power: '',
      pageNum: 1,
      pageSize: 10,
      total: 1,
      tableData: [],
      dialogFormVisible: false,
      updateFormVisible: false,
      formLabelWidth: '120px',
      dataForm: {},
      formTitle: '',
      createForm: {
        companyId: '', // 所属公司id
        groupName: '', // 班组名
        leaderName: '', // 负责人姓名
        leaderIdCard: '', // 负责人证件号
        leaderPhone: '', // 负责人电话号
        // message: '', // 预留字段
        // enterAt: '', // 预留字段
      },
      updateForm: {
        groupId: '', // 所属公司id
        groupName: '', // 班组名
        leaderName: '', // 负责人姓名
        leaderIdCard: '', // 负责人证件号
        leaderPhone: '', // 负责人电话号
        // message: '', // 预留字段
        // enterAt: '', // 预留字段
      },
      rules: {
        groupName: [
          { required: true, message: '请输入班组名', trigger: 'blur' }
        ],
        leaderName: [
          { required: true, message: '请输入负责人姓名', trigger: 'blur' }
        ],
        leaderIdCard: [
          { required: true, message: '请输入负责人证件号', trigger: 'blur' }
        ],
        leaderPhone: [
          { required: true, message: '请输入负责人手机号', trigger: 'blur' }
        ],
      }
      // createForm: {
      //   group: { // 班组
      //     val: '',
      //     data: []
      //   },
      //   groupUser: { // 班组负责人
      //     val: '',
      //     data: []
      //   },
      //   sign: { // 是否签承诺书
      //     bln: false, // true 是 false 否
      //     str: '0', // 1 是 0 否
      //   },
      //   workerType: { // 工种
      //     val: '',
      //     data: []
      //   },
      //   workerPrice: { // 单价
      //     val: '',
      //     data: []
      //   },
      // },
      // rules: {
      //   "group.val": [
      //     { required: true, message: '请选择班组', trigger: 'change' }
      //   ],
      //   "groupUser.val": [
      //     { required: true, message: '请选择班组负责人', trigger: 'change' }
      //   ],
      //   "workerType.val": [
      //     { required: true, message: '请选择工种', trigger: 'change' }
      //   ],
      //   "workerPrice.val": [
      //     { required: true, message: '请选择单价', trigger: 'change' }
      //   ],
      // }
    }
  },
  created() {
    // this.getPowerList();
    // this.getGroupList();
  },
  mounted() {},
  computed: {
    treeData() {
      return this.$store.state.treeData;
    }
  },
  watch: {},
  methods: {
    // 获取树形 数据
    getTreeData() {
      const vm = this;
      request({
        url: '/companyGroupUser/structureList',
        param: {},
        method: 'get',
        onError: err => {
          // vm.loading = false;
          // vm.isClick = false;
        },
        vm,
      }).then(res => {
        console.log(res)
        let code = res.code;
        let data = [];
        if(code === 200) {
          data = res.data;
        }
        vm.$store.dispatch('setTreeData', data)
      });
    },
    showCreate() {
      if(!this.createForm.companyId){
        this.$message({
          message: '请选择所属公司',
          type: 'warning',
          duration: 1000,
        })
        return
      }
      this.dataForm = this.createForm;
      this.formTitle = '添加';
      this.dialogFormVisible = true
    },
    showEdit(row) {
      this.dataForm = this.updateForm;
      // console.log(row)
      for(let i in this.updateForm){
        if(i === 'groupId'){
          this.dataForm[i] = row.id || '';
        }else{
          this.dataForm[i] = row[i] || '';
        }
      }
      // console.log((this.dataForm))
      this.formTitle = '修改';
      this.dialogFormVisible = true
    },
    searchList(val) {
      // console.log(val)
      if(!this.createForm.companyId){
        this.$message({
          message: '请选择所属公司',
          type: 'warning',
          duration: 1000,
        })
        return
      }
      this.getGroupList();
    },
    handleCheckChange(data, checked, indeterminate) {
      this.createForm.companyId = data.id;
      // console.log(data, checked, indeterminate);
    },
    handleSizeChange(val) {
      this.pageNum = 1;
      this.pageSize = val;
      this.getGroupList();
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getGroupList();
      console.log(`当前页: ${val}`);
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
    handleDelete(row) {
      const vm = this;
      let resetPwd = () => {
        vm.loading = true;
        request({
          url: '/group/delete',
          param: {
            groupId: row.id
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
            vm.getGroupList();
            vm.getTreeData();
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
    // 获取班组
    getGroupList() {
      const vm = this;
      vm.loading = true;
      request({
        url: '/group/list',
        param: {
          parentId: vm.createForm.companyId,
          pageNum: vm.pageNum,
          pageSize: vm.pageSize
        },
        method: 'get',
        onError: err => {
          vm.loading = false;
          // vm.isClick = false;
        },
        vm,
      }).then(res => {
        let code = res.code;
        vm.loading = false;
        if(code === 200){
          let data = res.data;
          vm.tableData = data.query;
          vm.total = data.total;
        }
      });
    },
    // 创建用户
    createGroup() {
      const vm = this;
      vm.loading = true;
      request({
        url: '/group/add',
        param: vm.dataForm,
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
          vm.dialogFormVisible = false;
          vm.getGroupList();
          vm.getTreeData();
        }
      });
    },
    // 更新用户
    updateGroup() {
      const vm = this;
      vm.loading = true;
      vm.isClick = true;
      request({
        url: '/group/update',
        param: vm.dataForm,
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
          vm.dialogFormVisible = false;
          vm.getGroupList();
          vm.getTreeData();
        }
      });
    }
  },
}
</script>
<style lang="scss">
.groupManager{
  .el-form-item{
    margin-bottom:10px;
  }
  .el-dialog__body{
    padding: 10px 20px;
  }
  .el-select{
    width:100%;
  }
  .el-form-item__error{
    padding-top:0;
  }
}
</style>
<style lang="scss" scoped>
.groupManager{
  .groupManager-item{
    // display:flex;
    >div{
      text-align:left;
      // width:auto;
      // flex:1;
    }
    .text{
      margin:0 10px;
    }
  }
}
</style>

