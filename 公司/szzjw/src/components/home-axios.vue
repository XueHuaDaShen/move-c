<template>
  <div class="home">
    <div class="menu-wrap">
      <span v-for="(item, i) in defaultMenus" :key="i" @click="changeMenu(item)">{{item.name}}</span>
    </div>
    
    <div class="data-content box-shadow">
      <div class="title-operate-btn">
        <span class="title">设备状态</span>
      </div>
      <div class="table-content">
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="tree-wrap">
              <div class="list">
                <p>项目名称：xxx工地</p>
                <p>场内人数：2000</p>
                <!-- <p>可用空间：200G</p>
                <p>已用空间：100G</p>  -->
              </div>
            </div>
          </el-col>
          <el-col :span="16">
            <div class="table-wrap">
              <el-table
                :data="tableData"
                header-row-class-name="device-header-row"
                style="width: 100%">
                <el-table-column
                  prop="username"
                  label="设备编号">
                </el-table-column>
                <el-table-column
                  prop="username"
                  label="设备IP">
                </el-table-column>
                <el-table-column
                  prop="role.name"
                  label="网络连接状态">
                </el-table-column>
              </el-table>
            </div>
          </el-col>
        </el-row>
      </div>
      <!-- <div class="table-pagination">
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
      </div> -->
    </div>
  </div>
</template>
<script>
// import request from "@/axios/axios";
export default {
  name: 'home',
  data() {
    return {
      defaultMenus: [
        {
          name: '设备管理',
          val: '11',
          url: 'deviceStatus'
        },
        {
          name: '班组管理',
          val: '10',
          url: 'groupManager'
        },
        {
          name: '人员管理',
          val: '3',
          url: 'peopleManager'
        },
        {
          name: '通行记录',
          val: '1',
          url: 'throughLog',
        },
        {
          name: '考勤统计',
          val: '2',
          url: 'workLog'
        },
        // {
        //   name: 'LED公告',
        //   val: '4',
        //   url: 'led'
        // },
        {
          name: '系统设置',
          val: '5',
          url: 'setting'
        },
        {
          name: '用户管理',
          val: '6',
          url: 'userManager',
        },
        {
          name: '修改密码',
          val: '7',
          url: 'editPwd',
        },
      ],
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
    changeMenu(item) {
      this.$router.push({
        name: item.url
      })
    }
  },
}
</script>
<style lang="scss">
.device-header-row{
  tr, th{
    background: #f2f2f2;
  }
}
</style>
<style lang="scss" scoped>
.menu-wrap{
  background:#fff;
  overflow: hidden;
  padding:10px;
  span{
    float: left;
    width: 200px;
    height:100px;
    border-radius:10px;
    background:#5ACAA6;
    margin:25px;
    overflow: hidden;
    color:#fff;
    font-size:18px;
    letter-spacing: 4px;
    text-align: center;
    line-height:100px;
    cursor: pointer;
  }
}
.home{
  .data-content{
    .table-content{
      background:#fff;
      height:300px;
      padding:20px 30px;
    }
    .list{
      padding-top:60px;
      p{
        text-align:left;
        line-height: 30px;
        letter-spacing: 2px;
      }
    }
  }
}
</style>

