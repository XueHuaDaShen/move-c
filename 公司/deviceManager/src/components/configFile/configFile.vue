<template>
  <div class="suanfa">
    <div class="search-wrap box-shadow">
      <div class="item">
        <el-input size="mini" clearable v-model="searchData.value1" placeholder="查询条件"></el-input>
      </div>
      <div class="item">
        <el-button size="mini" type="primary">Search</el-button>
      </div>
    </div>
    <div class="data-content box-shadow">
      <div class="title-operate-btn">
        <div class="upload-wrap">
          <el-button size="mini" type="primary">Create</el-button>
        </div>
      </div>
      <div class="table-content">
        <el-table
          :data="tableData"
          border
          style="width: 100%">
          <el-table-column
            prop="date"
            label="日期"
            width="180">
          </el-table-column>
          <el-table-column
            prop="name"
            label="姓名"
            width="180">
          </el-table-column>
          <el-table-column
            prop="address"
            label="地址">
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作">
            <template slot-scope="scope">
              <div class="reperate-wrap">
                <div><el-button @click="handleEdit(scope.row)" type="primary" size="mini">编辑</el-button></div>
                <div><el-button @click="handleDel(scope.row)" type="primary" size="mini">删除</el-button></div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'suanfa',
  data() {
    return {
      searchData: {
        value1: '',
      },
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }],
    }
  },
  created() {},
  mounted() {},
  computed: {},
  watch: {},
  methods: {
    handleEdit(row) {
      console.log("edit")
    },
    handleDel(row) {
      console.log("del")
    },
  },
}
</script>
<style lang="scss" scoped>

</style>

