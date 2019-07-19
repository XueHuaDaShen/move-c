<template>
  <div class="hello">
    <h1>{{ $t("message.chong_zhi_ji_lu") }}</h1>
    <h1>{{ $t("message.tou_zhu_ji_lu") }}</h1>
    <div class="block">
      <span class="demonstration">默认</span>
      <el-date-picker
        v-model="value1"
        type="datetime"
        format="dd-MM-yyyy HH:mm:ss"
        placeholder="选择日期时间">
      </el-date-picker>
    </div>
    <el-button size="small" round @click="changeLanguage">切换语言</el-button>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: '欢迎来到中国',
      pickerOptions1: {
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
      value1: '',
    }
  },
  methods: {
    changeLanguage() {
      let language = this.$i18n.locale;
      // console.log(this.$t("message"))
      if(language === 'zh'){
        this.$i18n.locale = 'th';
        localStorage.setItem('candy-locale', 'th');
      }else{
        this.$i18n.locale = 'zh';
        localStorage.setItem('candy-locale', 'zh');
      }
    }
  }
}
</script>
