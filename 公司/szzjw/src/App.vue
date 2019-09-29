<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss">
html,body{
  width:100%;
  height:100%;
}
img{
  display:block;
}
*{
  margin:0;
  padding:0;
  box-sizing: border-box;
}
ul,ol,li{
  list-style: none;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height:100%;
  // margin-top: 60px;
}
body .el-table th.gutter {
  display: table-cell !important
}
</style>
