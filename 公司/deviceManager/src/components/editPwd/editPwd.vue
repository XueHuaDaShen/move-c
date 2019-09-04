<template>
  <div class="editPwd" v-loading.fullscreen="loading">
    <div class="data-content box-shadow">
      <div class="table-content">
        <div class="edit-pwd-inner">
          <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="旧密码" prop="oldPass">
              <el-input type="password" v-model="ruleForm.oldPass" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="newPass">
              <el-input type="password" v-model="ruleForm.newPass" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="确认新密码" prop="okNewPass">
              <el-input type="password" v-model="ruleForm.okNewPass" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button size="mini" type="primary" :disabled="isClick" @click="submitForm('ruleForm')">提交</el-button>
              <el-button size="mini" @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import MD5 from 'md5';
export default {
  name: 'editPwd',
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.ruleForm.newPass) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      loading: false,
      isClick: false,
      ruleForm: {
        oldPass: '',
        newPass: '',
        okNewPass: '',
      },
      rules: {
        oldPass: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 18, message: '长度在 3 到 18 个字符', trigger: 'blur' }
        ],
        newPass: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 18, message: '长度在 3 到 18 个字符', trigger: 'blur' }
        ],
        okNewPass: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ]
      }
    }
  },
  created() {},
  mounted() {},
  computed: {},
  watch: {},
  methods: {
    submitForm(formName) {
      const vm = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          vm.editPwd()
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    editPwd() {
      const vm = this;
      let {
        oldPass,
        newPass,
      } = this.ruleForm;
      vm.loading = true;
      vm.isClick = true;
      this.$http.post('/admin/changePassword',
        {
          oldPass: CryptoJS.HmacMD5(CryptoJS.MD5(oldPass).toString(), '12345').toString(),
          newPass: MD5(newPass),
          random: '12345'
        }).then(res => {
        let code = res.body.code;
        vm.loading = false;
        vm.isClick = false;
        if(code === 200){
          vm.resetForm('ruleForm');
          vm.$message({
            message: '密码修改成功，请重新登陆',
            type: 'success'
          });
          vm.$router.push({
            name: 'login'
          })
        }else{
          vm.$message({
            message: '请求失败,'+res.body.message,
            type: 'error'
          });
        }
      }).catch(err => {
        vm.loading = false;
        vm.isClick = false;
        console.log(err);
      })
    }
  },
}
</script>
<style lang="scss" scoped>
.edit-pwd-inner{
  width:40%;
  padding-top:50px;
  margin:0 auto;
}
</style>

