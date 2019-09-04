<template>
  <div class="userManager">
    <!-- <div class="search-wrap box-shadow">
      <div class="item">
        <label>权限：</label>
        <el-input size="mini" v-model="power" placeholder="请输入内容"></el-input>
      </div>
      <div class="item">
        <el-button size="mini" type="primary">Search</el-button>
      </div>
    </div> -->
    <div class="data-content box-shadow">
      <div class="title-operate-btn">
        <el-button size="mini" @click="dialogFormVisible=true" type="primary">Create</el-button>
      </div>
      <div class="table-content">
        <el-table
          :data="tableData"
          @cell-mouse-enter="handleHoverCell"
          border
          style="width: 100%">
          <el-table-column
            prop="username"
            label="用户名">
          </el-table-column>
          <el-table-column
            prop="role.name"
            label="用户类型">
          </el-table-column>
          <el-table-column
            label="状态">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status"
                @change="handelChangeStatus"
                active-value="0"
                inactive-value="1"
                active-color="#13ce66"
                inactive-color="#ff4949">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <div class="reperate-wrap">
                <div><el-button @click="handleEdit(scope.row)" type="primary" size="mini">编辑</el-button></div>
                <div><el-button @click="handleResetPwd(scope.row)" type="primary" size="mini">重置密码</el-button></div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-dialog title="Create" width="379px" @close="resetForm('createForm')" :visible.sync="dialogFormVisible">
        <el-form :model="createForm" :rules="rules" ref="createForm" :label-width="formLabelWidth">
          <el-form-item label="用户名" prop="username">
            <div class="userManager-item">
              <div class="select-wrap">
                <el-input size="mini" clearable v-model="createForm.username" placeholder="请输入用户名"></el-input>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="密码" prop="pwd">
            <div class="userManager-item">
              <div class="select-wrap">
                <el-input type="password" size="mini" clearable v-model="createForm.pwd" placeholder="请输入密码"></el-input>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="确认密码" prop="okPwd">
            <div class="userManager-item">
              <div class="select-wrap">
                <el-input type="password" size="mini" clearable v-model="createForm.okPwd" placeholder="请确认密码"></el-input>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="用户类型" prop="power.val">
            <div class="userManager-item">
              <el-select v-model="createForm.power.val" size="mini" clearable placeholder="请选择用户类型">
                <el-option
                  v-for="item in createForm.power.data"
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
      </el-dialog>
      <el-dialog title="Edit" width="379px" @close="resetForm('updateForm')" :visible.sync="updateFormVisible">
        <el-form :model="updateForm" :rules="rules" ref="updateForm" :label-width="formLabelWidth">
          <el-form-item label="用户名" prop="username">
            <div class="userManager-item">
              <div class="select-wrap">
                <el-input size="mini" clearable v-model="updateForm.username" placeholder="请输入用户名"></el-input>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="用户类型" prop="power.val">
            <div class="userManager-item">
              <el-select v-model="updateForm.power.val" size="mini" clearable placeholder="请选择用户类型">
                <el-option
                  v-for="item in updateForm.power.data"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </div>
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
import MD5 from 'md5';
export default {
  name: 'userManager',
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.createForm.pwd) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      power: '',
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date());
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24);
            picker.$emit('pick', date);
          }
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', date);
          }
        }]
      },
      tableData: [],
      dialogFormVisible: false,
      updateFormVisible: false,
      formLabelWidth: '120px',
      createForm: {
        username: '',
        pwd: '',
        okPwd: '',
        power: {
          val: '',
          data: []
        }
      },
      updateForm: {
        id: '',
        username: '',
        power: {
          val: '',
          data: []
        }
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        pwd: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 18, message: '长度在 3 到 18 个字符', trigger: 'blur' }
        ],
        okPwd: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ],
        "power.val": [
          { required: true, message: '请选择用户类型', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.getPowerList();
    this.getAdminlist();
  },
  mounted() {},
  computed: {},
  watch: {},
  methods: {
    // 确认创建
    submitForm(formName) {
      const vm = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if(formName === 'createForm'){
            vm.createUser();
          }else{
            let {
              id,
              username,
              power
            } = this.updateForm;
            let data = {
              id,
              username,
              roleid: power.val
            }
            vm.updateUser(data);
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
      this.updateFormVisible = false;
    },
    handleHoverCell(row) {
      this.updateForm.id = row.id;
    },
    handleEdit(row) {
      this.updateFormVisible = true;
      this.updateForm.username = row.username;
      this.updateForm.power.val = row.role.name;
    },
    handleResetPwd(row) {
      const vm = this;
      let resetPwd = () => {
        vm.loading = true;
        vm.$http.post('/admin/resetPassword',{
          adminid: row.id
        }).then(res => {
          let code = res.body.code;
          vm.loading = false;
          if(code === 200){
            vm.$message({
              message: '密码重置成功',
              type: 'success'
            });
          }else{
            vm.$message({
              message: '密码重置失败,'+res.body.message,
              type: 'error'
            });
          }
        }).catch(err => {
          vm.loading = false;
          console.log(err);
        })
      }
      this.$alert('确定重置此管理员的密码吗？', '温馨提示', {
        confirmButtonText: '确定',
        callback: action => {
          if(action === 'confirm'){
            resetPwd();
          }
        }
      });
    },
    handelChangeStatus(status) {
      let { id } = this.updateForm;
      let data = {id, status};
      this.updateUser(data, true);
    },
    // 获取管理员
    getAdminlist() {
      const vm = this;
      vm.loading = true;
      this.$http.post('/admin/list',{
        pageNum: 1,
        pageSize: 10
      }).then(res => {
        let code = res.body.code;
        vm.loading = false;
        if(code === 200){
          let data = res.body.content;
          vm.tableData = data.rows;
        }else{
          vm.$message({
          message: '请求失败,'+res.body.message,
          type: 'error'
        });
        }
      }).catch(err => {
        vm.loading = false;
        console.log(err);
      })
    },
    // 获取用户类型
    getPowerList() {
      const vm = this;
      vm.loading = true;
      this.$http.get('/role/list',{}).then(res => {
        let code = res.body.code;
        vm.loading = false;
        if(code === 200){
          let data = res.body.content;
          vm.createForm.power.data = data;
          vm.updateForm.power.data = data;
        }else{
          vm.$message({
          message: '请求失败,'+res.body.message,
          type: 'error'
        });
        }
      }).catch(err => {
        vm.loading = false;
        console.log(err);
      })
    },
    // 创建用户
    createUser() {
      const vm = this;
      let {
        username,
        pwd,
        power
      } = this.createForm;
      vm.loading = true;
      this.$http.post('/admin/register',
        {
          username,
          password: MD5(pwd),
          roleid: power.val
        }).then(res => {
        let code = res.body.code;
        vm.loading = false;
        if(code === 200){
          vm.dialogFormVisible = false;
          vm.getAdminlist();
        }else{
          vm.$message({
          message: '请求失败,'+res.body.message,
          type: 'error'
        });
        }
      }).catch(err => {
        vm.loading = false;
        console.log(err);
      })
    },
    // 更新用户
    updateUser(data, status = false) {
      const vm = this;
      vm.loading = true;
      this.$http.post('/admin/update',data).then(res => {
        let code = res.body.code;
        vm.loading = false;
        if(code === 200){
          if(!status){
            vm.updateFormVisible = false;
            vm.getAdminlist();
          }else{
            vm.$message({
              message: '更改成功',
              type: 'success'
            });
          }
        }else{
          vm.$message({
            message: '请求失败,'+res.body.message,
            type: 'error'
          });
        }
      }).catch(err => {
        vm.loading = false;
        console.log(err);
      })
    }
  },
}
</script>
<style lang="scss">
.userManager{
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
.userManager{
  .userManager-item{
    display:flex;
    >div{
      flex:1;
    }
    .text{
      margin:0 10px;
    }
  }
}
</style>

