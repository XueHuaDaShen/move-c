<template>
  <div class="deviceReg" v-loading.fullscreen="loading">
    <div class="data-content box-shadow">
      <div class="table-content">
        <div class="edit-pwd-inner">
          <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="设备SN" prop="sn">
              <el-input type="text" size="mini" clearable v-model="ruleForm.sn" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="IP地址" prop="ip">
              <el-input type="text" size="mini" clearable v-model="ruleForm.ip" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="设备类型" prop="devType.val">
              <el-select v-model="ruleForm.devType.val" size="mini" clearable placeholder="请选择">
                <el-option
                  v-for="item in ruleForm.devType.data"
                  :key="item.val"
                  :label="item.label"
                  :value="item.val">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="设备名称" prop="deviceName">
              <el-input type="text" size="mini" clearable v-model="ruleForm.deviceName" autocomplete="off"></el-input>
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
import moment from 'moment';
export default {
  name: 'deviceReg',
  data() {
    return {
      loading: false,
      isClick: false,
      ruleForm: {
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
  created() {},
  mounted() {},
  computed: {},
  watch: {},
  methods: {
    submitForm(formName) {
      const vm = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          vm.deviceReg()
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    deviceReg() {
      const vm = this;
      let {
        sn,
        ip,
        devType,
        deviceName,
      } = this.ruleForm;
      vm.loading = true;
      vm.isClick = true;
      this.$http.post('/device/register',
        {
          sn,
          ip,
          devType: devType.val,
          deviceName,
          deviceAt: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        }).then(res => {
        let code = res.body.code;
        vm.loading = false;
        vm.isClick = false;
        if(code === 200){
          vm.resetForm('ruleForm');
          vm.$message({
            message: '设备注册成功',
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

