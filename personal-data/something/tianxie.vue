<template>
  <div>
    <div v-for="(v, i) in inputArr" :key="i">
      <el-input v-model="v.value" placeholder="请输入" :disabled="v.disabled" @blur="handleBlurFn(v)"></el-input>
    <!--  <el-input  v-model="phone2" placeholder="请输入内容" value="aa" :disabled="disabled2"></el-input>
      <el-input  v-model="phone3" placeholder="请输入内容" value="aa" :disabled="disabled3"></el-input>
      <el-input  v-model="phone4" placeholder="请输入内容" value="aa" :disabled="disabled4"></el-input>-->
    </div>
    <el-button @click="eee">默认按钮</el-button>
    <div v-html="e">

    </div>
    <el-input  v-model="phone" placeholder="请输入内容" value="aa"></el-input>
  </div>
</template>
<script>
  import {Tooltip, Input, Dropdown, DropdownMenu, DropdownItem,Button} from 'element-ui';

  export default {
    components: {
      'el-input': Input,
      'el-button':Button
    },
    data() {
      return {
        e:'ssssss<span style="color: red">ddd</span>ssssss',
        disabled1:false,
        disabled2:false,
        disabled3:false,
        disabled4:false,
        phone:'',
        phone1:'',
        phone2:'',
        phone3:'',
        phone4:'',
        nameSys: {
          uploadLogId:'sadasdasdasd',
          downLoadCount:'',
          reward:'sdadasdasdad',
          shared:'dasdasd',
        },
        inputName: '',
        inputValue: '',
        inputArr: [
          {name: 'www', value: '123', disabled: true},
          {name: 'eee', value: '456', disabled: true},
          {name: '', value: '', disabled: false},
          {name: 'ggg', value: '2', disabled: true},
          {}
        ]
      }
    },
    //计算属性
    computed: {},
    mounted() {

    },
    methods: {
      handleInput(ev, eve) {
        console.log(ev, eve)
      },
      eee(){
        console.log(this.inputArr)
        // console.log(this.phone2)
      },
      handleBlurFn(item) {
        if(item.value){
          item.disabled = true;
        }else{
          item.disabled = false;
        }
      },
    }
  }
</script>
<style lang="scss">

</style>
