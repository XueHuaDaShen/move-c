<template>
  <div class="peopleManager">
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
        <el-button size="mini" @click="showCreate" type="primary">添加</el-button>
      </div>
      <div class="table-content">
        <el-row :gutter="20">
          <el-col :span="3">
            <div class="tree-wrap">
              <el-tree :data="treeData" show-checkbox :props="defaultProps" @check-change="handleCheckChange"></el-tree>
            </div>
          </el-col>
          <el-col :span="21">
            <div class="table-wrap">
              <el-table
                :data="tableData"
                header-row-class-name="header-row"
                max-height="600px"
                style="width: 100%">
                <el-table-column
                  prop="realname"
                  label="姓名">
                </el-table-column>
                <el-table-column
                  prop="sex"
                  label="性别">
                </el-table-column>
                <el-table-column
                  prop="groupId"
                  label="部门">
                </el-table-column>
                <el-table-column
                  prop="cardno"
                  label="身份证号">
                </el-table-column>
                <el-table-column
                  prop="careerType"
                  label="工种">
                </el-table-column>
                <el-table-column
                  prop="companyIdId"
                  label="派遣单位">
                </el-table-column>
                <el-table-column
                  prop="groupRecharge"
                  label="班组负责人">
                </el-table-column>
                <el-table-column
                  prop="123"
                  label="人脸">
                </el-table-column>
                <el-table-column
                  prop="123"
                  label="虹膜">
                </el-table-column>
                <el-table-column
                  label="操作">
                  <template slot-scope="scope">
                    <div class="reperate-wrap">
                      <!-- <div><el-button @click="handleInfo(scope.row)" type="primary" size="mini">资料</el-button></div> -->
                      <div><el-button @click="handleEdit(scope.row)" type="primary" size="mini">修改</el-button></div>
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
      <el-dialog :title="formTitle" width="570px" @close="resetForm('dataForm')" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
        <el-form :model="dataForm" :rules="rules" ref="dataForm" :label-width="formLabelWidth" size="mini">
          <el-form-item label="姓名" prop="realname" class="col-5">
            <div class="peopleManager-item">
              <el-input size="mini" v-model="dataForm.realname" placeholder="请输入姓名"></el-input>
            </div>
          </el-form-item>
          <el-form-item label="性别" prop="sex.val" class="col-5">
            <div class="peopleManager-item">
              <el-select v-model="dataForm.sex.val" size="mini" clearable placeholder="请选择性别">
                <el-option
                  v-for="item in dataForm.sex.data"
                  :key="item.val"
                  :label="item.name"
                  :value="item.val">
                </el-option>
              </el-select>
            </div>
          </el-form-item>
          <el-form-item label="班组负责人" prop="groupRecharge.bln" class="col-4">
            <div class="peopleManager-item">
              <div class="select-wrap">
                <el-checkbox v-model="dataForm.groupRecharge.bln">是</el-checkbox>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="手机号" prop="phone" class="col-5">
            <div class="peopleManager-item">
              <el-input size="mini" v-model="dataForm.phone" placeholder="请输入手机号"></el-input>
            </div>
          </el-form-item>
          <el-form-item label="身份证号" prop="cardNo">
            <div class="peopleManager-item">
              <el-input size="mini" v-model="dataForm.cardNo" placeholder="请输入身份证号"></el-input>
            </div>
          </el-form-item>
          <el-form-item label="生日" prop="birthday" class="col col-5">
            <div class="peopleManager-item">
              <el-date-picker
                v-model="dataForm.birthday"
                type="date"
                size="mini"
                placeholder="选择生日">
              </el-date-picker>
            </div>
          </el-form-item>
          <el-form-item label="民族" prop="nation.val" class="col col-5">
            <div class="peopleManager-item">
              <el-select v-model="dataForm.nation.val" size="mini" clearable placeholder="请选择民族">
                <el-option
                  v-for="item in dataForm.nation.data"
                  :key="item.val"
                  :label="item.name"
                  :value="item.val">
                </el-option>
              </el-select>
            </div>
          </el-form-item>
          <el-form-item prop="cardImg" class="cardImg col">
            <div class="peopleManager-item" style="position:relative;">
              <span class="cardimg-icon"></span>
              <el-button size="mini" @click="readCard" type="primary" class="readCard">读取身份证</el-button>
            </div>
          </el-form-item>
          <el-form-item label="身份证地址" prop="hometown" style="clear:both;">
            <div class="peopleManager-item">
              <el-input size="mini" v-model="dataForm.hometown" placeholder="请输入身份证地址"></el-input>
            </div>
          </el-form-item>
          <el-form-item label="暂住地址" prop="homeAddress">
            <div class="peopleManager-item">
              <el-input size="mini" v-model="dataForm.homeAddress" placeholder="请输入暂住地址"></el-input>
            </div>
          </el-form-item>
          <el-form-item label="工种" prop="careerType.val" class="col col-5">
            <div class="peopleManager-item">
              <el-select v-model="dataForm.careerType.val" size="mini" clearable placeholder="请选择工种">
                <el-option
                  v-for="item in dataForm.careerType.data"
                  :key="item.val"
                  :label="item.name"
                  :value="item.val">
                </el-option>
              </el-select>
            </div>
          </el-form-item>
          <el-form-item label="单价" prop="salary" class="col col-5">
            <div class="peopleManager-item">
              <el-input size="mini" v-model="dataForm.salary" placeholder="请输入单价"></el-input>
            </div>
          </el-form-item>
          <el-form-item label="派遣单位" prop="companyId.val" class="col col-7">
            <div class="peopleManager-item">
              <el-select v-model="dataForm.companyId.val" size="mini" clearable placeholder="请选择派遣单位">
                <el-option
                  v-for="item in dataForm.companyId.data"
                  :key="item.val"
                  :label="item.name"
                  :value="item.val">
                </el-option>
              </el-select>
            </div>
          </el-form-item>
          <el-form-item label="班组" prop="groupId.val" class="col">
            <div class="peopleManager-item">
              <el-select v-model="dataForm.groupId.val" size="mini" clearable placeholder="请选择班组">
                <el-option
                  v-for="item in dataForm.groupId.data"
                  :key="item.val"
                  :label="item.name"
                  :value="item.val">
                </el-option>
              </el-select>
            </div>
          </el-form-item>
          <el-form-item label="项目负责人" prop="projectRecharge.bln" class="col">
            <div class="peopleManager-item">
              <div class="select-wrap">
                <el-checkbox v-model="dataForm.projectRecharge.bln">是</el-checkbox>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="职称" prop="title" class="col col-5">
            <div class="peopleManager-item">
              <el-input size="mini" v-model="dataForm.title" placeholder="请输入职称"></el-input>
            </div>
          </el-form-item>
          <el-form-item label="证书" prop="certificate" class="col col-5">
            <div class="peopleManager-item">
              <el-input size="mini" v-model="dataForm.certificate" placeholder="请输入证书"></el-input>
            </div>
          </el-form-item>
          <el-form-item label="专业" prop="major" class="col col-5">
            <div class="peopleManager-item">
              <el-input size="mini" v-model="dataForm.major" placeholder="请输入专业"></el-input>
            </div>
          </el-form-item>
          <!-- <el-form-item label="承诺书" prop="sign.bln">
            <div class="peopleManager-item">
              <div class="select-wrap">
                <el-checkbox v-model="dataForm.sign.bln">已签字</el-checkbox>
              </div>
            </div>
          </el-form-item> -->
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
const imgBase64 = 'data:image/jpg;base64,';
import MD5 from 'md5';
export default {
  name: 'peopleManager',
  data() {
    return {
      defaultProps: {
        children: 'list',
        label: 'name'
      },
      power: '',
      pageNum: 1,
      pageSize: 10,
      total: 1,
      tableData: [],
      dialogFormVisible: false,
      updateFormVisible: false,
      formLabelWidth: '100px',
      formTitle: '',
      dataForm: {},
      createForm: {
        realname: '', // 姓名
        sex: {
          val: '',
          data: [
            {name: '男', val: '1'},
            {name: '女', val: '2'},
          ]
        }, // 性别
        groupRecharge: { // 是否是班组负责人
          bln: false, // true 是 false 否
          str: '0', // 1 是 0 否
        },
        phone: '', // 手机号
        cardNo: '', // 身份证号
        nation: {
          val: '',
          data: [
            {name: '汉族', val: '1'},
            {name: '少数民族', val: '2'},
          ]
        }, // 民族
        birthday: '', // 生日
        hometown: '', // 身份证地址
        homeAddress: '', // 暂住地址
        careerType: { // 工种
          val: '',
          data: [
            {name: '木工', val: '1'},
            {name: '瓦工', val: '2'},
          ]
        },
        salary: '', // 单价
        projectRecharge: { // 是否是项目负责人
          bln: false, // true 是 false 否
          str: '0', // 1 是 0 否
        },
        title: '', // 职称
        certificate: '', // 证书
        major: '', // 专业
        cardImg: '123', // 证件照
        companyId: { // 派遣单位
          val: '',
          data: [
            {name: '天津', val: '1'},
            {name: '北京', val: '2'},
          ]
        },
        groupId: { // 班组
          val: '',
          data: [
            {name: '朝阳', val: '1'},
            {name: '海淀', val: '2'},
          ]
        },
        // sign: { // 是否签承诺书
        //   bln: false, // true 是 false 否
        //   str: '0', // 1 是 0 否
        // },
      },
      rules: {
        realname: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        "sex.val": [
          { required: true, message: '请选择性别', trigger: 'change' }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' }
        ],
        cardNo: [
          { required: true, message: '请输入身份证号', trigger: 'blur' }
        ],
        "nation.val": [
          { required: true, message: '请输入民族', trigger: 'change' }
        ],
        birthday: [
          { required: true, message: '请输入生日', trigger: 'blur' }
        ],
        hometown: [
          { required: true, message: '请输入身份证地址', trigger: 'blur' }
        ],
        homeAddress: [
          { required: true, message: '请输入暂住地址', trigger: 'blur' }
        ],
        "careerType.val": [
          { required: true, message: '请选择工种', trigger: 'change' }
        ],
        salary: [
          { required: true, message: '请选择单价', trigger: 'blur' }
        ],
        title: [
          { required: true, message: '请输入职称', trigger: 'blur' }
        ],
        certificate: [
          { required: true, message: '请输入证书', trigger: 'blur' }
        ],
        major: [
          { required: true, message: '请输入专业', trigger: 'blur' }
        ],
        "companyId.val": [
          { required: true, message: '请选择派遣单位', trigger: 'change' }
        ],
        "groupId.val": [
          { required: true, message: '请选择班组', trigger: 'change' }
        ],
      }
    }
  },
  created() {
    // this.getPowerList();
    this.dataForm = this.createForm;
    this.getUserList();
  },
  mounted() {},
  computed: {
    treeData() {
      return this.$store.state.treeData;
    }
  },
  watch: {},
  methods: {
    showCreate() {
      this.dataForm = this.createForm;
      this.formTitle = '添加';
      this.dialogFormVisible = true
    },
    handleEdit(row) {
      let data = this.createForm;
      for(let i in this.createForm){
        if(i === 'groupRecharge' || i === 'projectRecharge') {
          data[i].bln = Number(row[i]) === 1 ? true : false;
        } else if(this.createForm[i].val !== undefined) {
          data[i].val = row[i].toString() || '123';
        } else {
          data[i] = row[i] || '123';
        }
      }
      this.dataForm = data;
      this.dataForm.id = row.id;
      this.formTitle = '修改';
      this.dialogFormVisible = true
    },
    // 读取身份证
    readCard() {
      const vm = this;
      let result = window.readCard();
      if(result.empty){
        vm.$message({
          message: result.error,
          type: 'error',
          duration: 1500
        })
      }else{
        let b = result.birth;
        this.dataForm.realname = result.name;
        this.dataForm.sex.val = result.sex;
        this.dataForm.cardNo = result.cardNo;
        this.dataForm.nation.val = result.nation;
        this.dataForm.birthday = b.substr(0,4)+'-'+b.substr(4,2)+'-'+b.substr(6);
        this.dataForm.hometown = result.address;
        this.dataForm.cardImg = result.img ? imgBase64 + result.img : '';
      }
    },
    handleCheckChange(data, checked, indeterminate) {
      console.log(data, checked, indeterminate);
    },
    handleSizeChange(val) {
      this.pageNum = 1;
      this.pageSize = val;
      this.getUserList();
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getUserList();
    },
    // 确认创建
    submitForm(formName) {
      const vm = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let data = {};
          vm.createForm.cardImg = '123';
          for(let i in vm.createForm) {
            data[i] = vm.createForm[i] || '123';
            if(i === 'groupRecharge' || i === 'projectRecharge') {
              data[i] = vm.createForm[i].bln ? '1' : '0';
            }
            if(vm.createForm[i].val) {
              data[i] = vm.createForm[i].val || '123'
            }
          }
          if(vm.formTitle === '添加'){
            vm.createUser(data);
          }else{
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
    },
    handleInfo(row) {
      const vm = this;
      vm.loading = true;
      vm.$http.get('/user/getUserInfo',{
        params: {
          userid: 'sdfsankj'
        }
      }).then(res => {
        // let code = res.body.code;
        console.log(res);
        // vm.loading = false;
        // if(code === 200){
        //   vm.$message({
        //     message: '密码重置成功',
        //     type: 'success'
        //   });
        // }else{
        //   vm.$message({
        //     message: '密码重置失败,'+res.body.message,
        //     type: 'error'
        //   });
        // }
      }).catch(err => {
        vm.loading = false;
        console.log(err);
      })
    },
    handleDelete(row) {
      const vm = this;
      let deleteUser = () => {
        vm.loading = true;
        vm.$http.get('/gwuser/delete',{
          params: {
            ids: row.id
          }
        }).then(res => {
          let code = res.body.code;
          vm.loading = false;
          if(code === 200){
            vm.$message({
              message: '删除成功',
              type: 'success',
              duration: 1500,
            });
            vm.getUserList();
          }else{
            vm.$message({
              message: '删除失败,'+res.body.message,
              type: 'error',
              duration: 1500,
            });
          }
        }).catch(err => {
          vm.loading = false;
          console.log(err);
        })
      }
      this.$alert('确定删除当前工人吗？', '温馨提示', {
        confirmButtonText: '确定',
        callback: action => {
          if(action === 'confirm'){
            // alert('已删除')
            deleteUser();
          }
        }
      });
    },
    // 获取管理员
    getUserList() {
      const vm = this;
      vm.loading = true;
      this.$http.post('/gwuser/list',{
        pageNum: vm.pageNum,
        pageSize: vm.pageSize,
        groupid: '',
        startAt: '',
        endAt: '',
      }).then(res => {
        let code = res.body.code;
        vm.loading = false;
        console.log(res)
        if(code === 200){
          let data = res.body.data;
          vm.tableData = data.query;
          vm.total = data.total;
        }else{
          vm.$message({
            message: '请求失败,'+res.body.message,
            type: 'error',
            duration: 1500,
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
          // let data = res.body.content;
        }else{
          vm.$message({
            message: '请求失败,'+res.body.message,
            type: 'error',
            duration: 1500,
          });
        }
      }).catch(err => {
        vm.loading = false;
        console.log(err);
      })
    },
    // 创建用户
    createUser(data) {
      const vm = this;
      vm.loading = true;
      this.$http.post('/gwuser/create', data).then(res => {
        let code = res.body.code;
        vm.loading = false;
        if(code === 200){
          vm.$message({
            message: '创建成功',
            type: 'success',
            duration: 1000,
          });
          vm.dialogFormVisible = false;
          vm.getUserList();
        }else{
          vm.$message({
            message: '请求失败,'+res.body.message,
            type: 'error',
            duration: 1500,
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
      this.$http.post('/gwuser/update',data).then(res => {
        let code = res.body.code;
        vm.loading = false;
        if(code === 200){
          if(!status){
            vm.dialogFormVisible = false;
            vm.getUserList();
          }
          vm.$message({
            message: '修改成功',
            type: 'success',
            duration: 1500,
          });
        }else{
          vm.$message({
            message: '请求失败,'+res.body.message,
            type: 'error',
            duration: 1500,
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
.peopleManager{
  .el-form{
    overflow: hidden;
  }
  .el-form-item{
    margin-bottom:10px;
  }
  .el-dialog__body{
    padding: 10px 20px;
    // overflow: hidden;
    position: relative;
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
.peopleManager{
  .peopleManager-item{
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
.cardImg{
  position: absolute;
  top:0;
  right:50px;
  .cardimg-icon{
    display:block;
    width:120px;
    height:150px;
    background: #ccc;
  }
  .readCard{
    position: absolute;
    left:12%;
    top:40%;
  }
}

.col{
  float: left;
}
.col-3{
  width:30%;
}
.col-4{
  width:40%;
}
.col-5{
  width:50%;
}
.col-7{
  width:70%;
}
</style>

