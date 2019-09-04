<template>
  <div class="deviceReg" v-loading.fullscreen="loading">
    <div class="data-content box-shadow">
      <div class="table-content">
        <div class="edit-pwd-inner">
          <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="设备SN" prop="deviceSN">
              <el-input type="password" v-model="ruleForm.deviceSN" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="IP地址" prop="pcip">
              <el-input type="password" v-model="ruleForm.pcip" autocomplete="off"></el-input>
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
  name: 'deviceReg',
  data() {
    return {
      loading: false,
      isClick: false,
      ruleForm: {
        deviceSN: '',
        pcip: '',
      },
      rules: {
        deviceSN: [
          { required: true, message: '请输入设备SN号', trigger: 'blur' },
        ],
        pcip: [
          { required: true, message: '请输入IP地址', trigger: 'blur' },
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
        deviceSN,
        pcip,
      } = this.ruleForm;
      vm.loading = true;
      vm.isClick = true;
      this.$http.post('/admin/changePassword',
        {
          deviceSN: deviceSN,
          pcip: MD5(pcip),
        }).then(res => {
        let code = res.body.code;
        vm.loading = false;
        vm.isClick = false;
        if(code === 200){
          vm.resetForm('ruleForm');
          vm.$message({
            message: '设备注册成功',
            type: 'success'
          });
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

