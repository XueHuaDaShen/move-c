<template>
  <div id="app" style="margin:0;height:100%;">
    <input type="text" class="display-none-input">
    <input type="password" class="display-none-input">
    <router-view/>
  </div>
</template>

<script>
  export default {
    name: 'App'
  }

</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
    position: relative;
  }
  .display-none-input {
    position: absolute;
    left: 0;
    top: 0;
    z-index: -5;
    width: 1px;
    height: 1px;
    opacity: 0;
  }


  .el-date-range-picker table {
    table-layout: auto;
  }

  input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 1000px white inset !important;
  }
  #app .display-none-input{
    position: absolute;
    left: 0;
    top: 0;
    z-index: -5;
    width: 0;
    height: 0;
    opacity: 0;
  }

</style>
