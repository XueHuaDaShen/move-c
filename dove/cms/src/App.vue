<template>
  <div id="app">
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
  height: 100%;
  /* margin-top: 60px; */
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
.el-table__body-wrapper{
  max-height:408px !important;
}
</style>
