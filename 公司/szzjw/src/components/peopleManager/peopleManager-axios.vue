<template>
  <div class="peopleManager" v-loading.fullscreen="loading">
    <div class="search-wrap box-shadow">
      <div class="item">
        <label>姓名：</label>
        <el-input size="mini" clearable v-model="searchData.realname" placeholder="请输入姓名"></el-input>
      </div>
      <div class="item">
        <label>身份证号：</label>
        <el-input size="mini" clearable v-model="searchData.cardno" placeholder="请输入身份证号"></el-input>
      </div>
      <div class="item">
        <el-button size="mini" type="primary" @click="handleSearch">搜索</el-button>
        <!-- <el-button size="mini" type="primary" @click="searchFn">重置</el-button> -->
      </div>
    </div>
    <div class="data-content box-shadow">
      <div class="title-operate-btn">
        <el-button size="mini" @click="showCreate" type="primary">添加</el-button>
        <el-button size="mini" @click="deleteArr" type="primary">批量删除</el-button>
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
                :header-cell-class-name="setCellname"
                @selection-change="handleSelectionChange"
                style="width: 100%">
                <el-table-column
                  type="selection"
                  width="55">
                </el-table-column>
                <el-table-column
                  prop="realname"
                  label="姓名">
                </el-table-column>
                <el-table-column
                  prop="sex"
                  label="性别">
                  <template slot-scope="scope">
                    <span>{{ scope.row.sex | formatKey(updateForm.sex.data, 'name')}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="groupName"
                  label="部门">
                </el-table-column>
                <el-table-column
                  prop="cardno"
                  label="身份证号">
                </el-table-column>
                <el-table-column
                  prop="careerType"
                  label="工种">
                  <template slot-scope="scope">
                    <span>{{ scope.row.careerType | formatKey(updateForm.careerType.data, 'name')}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="companyName"
                  label="派遣单位">
                </el-table-column>
                <el-table-column
                  prop="groupRecharge"
                  label="班组负责人">
                  <template slot-scope="scope">
                    <span>{{ scope.row.groupRecharge | formatKey(leader, 'name')}}</span>
                  </template>
                </el-table-column>
                <!-- <el-table-column
                  prop="123"
                  label="人脸">
                </el-table-column>
                <el-table-column
                  prop="123"
                  label="虹膜">
                </el-table-column> -->
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
          <el-form-item label="班组负责人" prop="groupRecharge.bln" class="col-4" v-if="!dataForm.projectRecharge.bln">
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
          <el-form-item label="身份证号" prop="cardno" class="col-7">
            <div class="peopleManager-item">
              <el-input size="mini" v-model="dataForm.cardno" placeholder="请输入身份证号"></el-input>
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
              <span class="cardimg-icon"><img :src="dataForm.cardImg"></span>
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
              <el-select v-model="dataForm.companyId.val" size="mini" clearable placeholder="请选择派遣单位" @change="changeCompany">
                <el-option
                  v-for="item in dataForm.companyId.data"
                  :key="item.companyId"
                  :label="item.companyName"
                  :value="item.companyId">
                </el-option>
              </el-select>
            </div>
          </el-form-item>
          <el-form-item label="班组" prop="groupId.val" class="col" v-if="!dataForm.projectRecharge.bln">
            <div class="peopleManager-item">
              <el-select v-model="dataForm.groupId.val" size="mini" clearable placeholder="请选择班组">
                <el-option
                  v-for="item in dataForm.groupId.data"
                  :key="item.groupId"
                  :label="item.groupName"
                  :value="item.groupId">
                </el-option>
              </el-select>
            </div>
          </el-form-item>
          <el-form-item label="项目负责人" prop="projectRecharge.bln" class="col" v-if="!dataForm.groupRecharge.bln">
            <div class="peopleManager-item">
              <div class="select-wrap">
                <el-checkbox v-model="dataForm.projectRecharge.bln">是</el-checkbox>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="职称" prop="title" class="col col-5" v-if="!dataForm.groupRecharge.bln">
            <div class="peopleManager-item">
              <el-input size="mini" v-model="dataForm.title" placeholder="请输入职称"></el-input>
            </div>
          </el-form-item>
          <el-form-item label="证书" prop="certificate" class="col col-5" v-if="!dataForm.groupRecharge.bln">
            <div class="peopleManager-item">
              <el-input size="mini" v-model="dataForm.certificate" placeholder="请输入证书"></el-input>
            </div>
          </el-form-item>
          <el-form-item label="专业" prop="major" class="col col-5" v-if="!dataForm.groupRecharge.bln">
            <div class="peopleManager-item">
              <el-input size="mini" v-model="dataForm.major" placeholder="请输入专业"></el-input>
            </div>
          </el-form-item>
          <div class="img-wrap" style="clear:both;">
            <span v-if="per.leftImg"><img :src="per.leftImg"></span>
            <span v-if="per.rightImg"><img :src="per.rightImg"></span>
            <span v-if="per.perImg"><img :src="per.perImg"></span>
          </div>
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
          <el-button size="mini" type="primary" :disabled="isClick" @click="submitForm('dataForm')">提交</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
const imgBase64 = 'data:image/jpg;base64,';
import MD5 from 'md5';
import request from "@/axios/axios";
export default {
  name: 'peopleManager',
  data() {
    return {
      loading: false,
      isClick: false,
      defaultProps: {
        children: 'list',
        label: 'name'
      },
      searchData: {
        realname: '',
        cardno: '',
      },
      pageNum: 1,
      pageSize: 10,
      total: 1,
      tableData: [],
      dialogFormVisible: false,
      updateFormVisible: false,
      formLabelWidth: '100px',
      formTitle: '',
      dataForm: {},
      per: {
        leftImg: '',
        rightImg: '',
        perImg: '',
      },
      leader: [
        {name: '是', val: 1},
        {name: '否', val: 0}
      ],
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
        cardno: '', // 身份证号
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
          data: []
        },
        groupId: { // 班组
          val: '',
          data: []
        },
        // sign: { // 是否签承诺书
        //   bln: false, // true 是 false 否
        //   str: '0', // 1 是 0 否
        // },
      },
      updateForm: {
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
        cardno: '', // 身份证号
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
          data: []
        },
        groupId: { // 班组
          val: '',
          data: []
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
        cardno: [
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
          { required: false, message: '请输入职称', trigger: 'blur' }
        ],
        certificate: [
          { required: false, message: '请输入证书', trigger: 'blur' }
        ],
        major: [
          { required: false, message: '请输入专业', trigger: 'blur' }
        ],
        "companyId.val": [
          { required: true, message: '请选择派遣单位', trigger: 'change' }
        ],
        "groupId.val": [
          { required: true, message: '请选择班组', trigger: 'change' }
        ],
      },
      checkedArr: [],
      ids: [],
    }
  },
  created() {
    this.dataForm = this.createForm;
    this.getUserList();
  },
  mounted() {},
  computed: {
    treeData() {
      return this.$store.state.treeData;
    }
  },
  watch: {
  },
  methods: {
    handleSearch() {
      this.getUserList();
    },
    // 选择行
    handleSelectionChange(val) {
      // console.log(val);
      this.checkedArr = val;
    },
    deleteArr() {
      if(this.checkedArr.length === 0){
        this.$message({
          message: '请至少选中一个工人',
          type: 'warning',
          duration: 1500,
        })
        return
      }
      let arr = [];
      this.checkedArr.filter(item => {
        arr.push(item.id);
      })
      this.handleDelete({id: arr.join(',')})
    },
    setCellname({row, column, rowIndex, columnIndex}) {
      if(column.type === "selection"){
        return 'check-wrap'
      }
      // console.log({row, column, rowIndex, columnIndex})
    },
    // 获取合作单位列表
    getCompanyList() {
      const vm = this;
      if(this.dataForm.companyId.data.length > 0){
        return;
      }
      // vm.loading = true;
      request({
        url: '/company/simpleList',
        param: {},
        method: 'get',
        onError: err => {
          // vm.loading = false;
          // vm.isClick = false;
        },
        vm,
      }).then(res => {
        console.log(res)
        // vm.loading = false;
        let code = res.code;
        if(code === 200) {
          let data = res.data;
          vm.dataForm.companyId.data = data;
        }
      });
    },
    // 获取合作单位班组列表
    getGroupList() {
      const vm = this;
      if(this.dataForm.groupId.data.length > 0){
        return;
      }
      // console.log(vm.dataForm.companyId.val)
      // vm.loading = true;
      request({
        url: '/group/simpleList',
        param: {
          companyId: vm.dataForm.companyId.val,
        },
        method: 'get',
        onError: err => {
          // vm.loading = false;
          // vm.isClick = false;
        },
        vm,
      }).then(res => {
        console.log(res)
        // vm.loading = false;
        let code = res.code;
        if(code === 200) {
          let data = res.data;
          vm.dataForm.groupId.data = data;
        }
      });
    },
    changeCompany() {
      this.dataForm.groupId.val = '';
      this.dataForm.groupId.data = [];
      this.getGroupList();
    },
    showCreate() {
      this.getCompanyList();
      this.dataForm = this.createForm;
      this.formTitle = '添加';
      this.dialogFormVisible = true
    },
    handleEdit(row) {
      let data = this.updateForm;
      for(let i in this.updateForm){
        if(i === 'groupRecharge' || i === 'projectRecharge') {
          data[i].bln = Number(row[i]) === 1 ? true : false;
        } else if(this.updateForm[i].val !== undefined) {
          data[i].val = row[i] || '123';
        } else {
          data[i] = row[i] || '123';
        }
      }
      this.dataForm = data;
      this.dataForm.id = row.id;
      this.getCompanyList();
      this.getGroupList();
      this.getIri(row.id)
      this.formTitle = '修改';
    },
    getIri(id) {
      const vm = this;
      request({
        url: '/gwuser/detail',
        param: {
          id,
        },
        method: 'get',
        onError: err => {
          // vm.loading = false;
          // vm.isClick = false;
        },
        vm,
      }).then(res => {
        let code = res.code;
        let data = res.data;
        if(code === 200){
          vm.per = {
            leftImg: data.leftEyeImg ? imgBase64 + data.leftEyeImg : '',
            rightImg: data.rightEyeImg ? imgBase64 + data.rightEyeImg : '',
            perImg: data.faceImg ? imgBase64 + data.faceImg : '',
          }
        }
        vm.dialogFormVisible = true;
      });
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
        this.dataForm.cardno = result.cardNo;
        this.dataForm.nation.val = result.nation;
        this.dataForm.birthday = b.substr(0,4)+'-'+b.substr(4,2)+'-'+b.substr(6);
        this.dataForm.hometown = result.address;
        this.dataForm.cardImg = result.img ? imgBase64 + result.img : '';
      }
    },
    handleCheckChange(data, checked, indeterminate) {
      let {level, id, list, $treeNodeId} = data;
      const vm = this;
      vm.ids[$treeNodeId] = [];
      if(Number(level) === 1){
        if(checked){
          if(list.length > 0){
            list.map(item => {
              vm.ids[$treeNodeId].push(item.id);
              // if(item.list.length > 0){
              //   item.list.map(l => {
              //     vm.ids[$treeNodeId].push(l.id);
              //   })
              // }else{
              //   vm.ids[$treeNodeId].push(item.id);
              // }
            })
          }else{
            vm.ids[$treeNodeId].push(id);
          }
        }else{
          vm.ids[$treeNodeId] = [];
        }
      }
      if(Number(level) === 2) {
        // if(list.length === 0){
          let index = vm.ids[$treeNodeId].indexOf(id);
          if(checked){
            if(index < 0){
              vm.ids[$treeNodeId].push(id);
            }
          }else{
            vm.ids[$treeNodeId].splice(index, 1)
          }
        // }
      }
      // if(Number(level) === 3){
      //   let index = vm.ids[$treeNodeId].indexOf(id);
      //   if(checked){
      //     if(index < 0){
      //       vm.ids[$treeNodeId].push(id);
      //     }
      //   }else{
      //     vm.ids[$treeNodeId].splice(index, 1)
      //   }
      // }
      // console.log(vm.ids[$treeNodeId])
      // console.log(vm.ids)
      // console.log($treeNodeId);
      // console.log(data, checked, indeterminate);
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
          for(let i in vm.dataForm) {
            data[i] = vm.dataForm[i] || '123';
            if(i === 'groupRecharge' || i === 'projectRecharge') {
              data[i] = vm.dataForm[i].bln ? '1' : '0';
            }
            if(vm.dataForm[i].val !== undefined) {
              data[i] = vm.dataForm[i].val || '123'
            }
          }
          if(vm.dataForm.cardImg === '') {
            vm.dataForm.cardImg = '123';
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
        // vm.isClick = true;
        request({
          url: '/gwuser/delete',
          param: {
            ids: row.id
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
          // vm.isClick = false;
          if(code === 200){
            vm.$message({
              message: '删除成功',
              type: 'success',
              duration: 1500,
            });
            vm.getUserList();
          }
        });
      }
      this.$alert('确定删除吗？', '温馨提示', {
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
      const { realname, cardno } = this.searchData;
      let arr = [];
      let ids = [];
      this.ids.filter(item => {
        arr.push(...item)
      })
      for(let i=0; i<arr.length; i++){
        if(ids.indexOf(arr[i]) < 0){
          ids.push(arr[i])
        }
      }
      vm.loading = true;
      request({
        url: '/gwuser/list',
        param: {
          pageNum: vm.pageNum,
          pageSize: vm.pageSize,
          groupIdList: ids,
          realname,
          cardno,
          // startAt: '',
          // endAt: '',
        },
        method: 'post',
        onError: err => {
          vm.loading = false;
          // vm.isClick = false;
        },
        vm,
      }).then(res => {
        let code = res.code;
        vm.loading = false;
        console.log(res)
        if(code === 200){
          let data = res.data;
          vm.tableData = data.query;
          vm.total = data.total;
        }
      });
    },
    // 创建用户
    createUser(data) {
      const vm = this;
      vm.loading = true;
      vm.isClick = true;
       request({
        url: '/gwuser/create',
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
          vm.$message({
            message: '创建成功',
            type: 'success',
            duration: 1000,
          });
          vm.dialogFormVisible = false;
          vm.getUserList();
        }
      });
    },
    // 更新用户
    updateUser(data, status = false) {
      console.log(data)
      const vm = this;
      vm.loading = true;
      vm.isClick = true;
       request({
        url: '/gwuser/update',
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
          if(!status){
            vm.dialogFormVisible = false;
            vm.getUserList();
          }
          vm.$message({
            message: '修改成功',
            type: 'success',
            duration: 1500,
          });
        }
      });
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
    img{
      width:100%;
      height:auto;
    }
  }
  .readCard{
    position: absolute;
    left:12%;
    top:-22%;
  }
}
.img-wrap{
  width:100%;
  text-align: center;
  span{
    display:inline-block;
    margin:0 2%;
    width:30%;
    height:auto;
    img{
      width:100%;
    }
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

