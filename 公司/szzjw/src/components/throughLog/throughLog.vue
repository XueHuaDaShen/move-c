<template>
  <div class="throughLog" v-loading.fullscreen="loading">
    <div class="search-wrap box-shadow">
      <div class="item">
        <label>工人：</label>
        <el-select v-model="searchData.people.val" size="mini" clearable placeholder="请选择工人">
          <el-option
            v-for="item in searchData.people.data"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </div>
      <div class="item">
        <label>时间：</label>
        <el-date-picker
          v-model="searchData.time"
          size="mini"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions">
        </el-date-picker>
      </div>
      <div class="item">
        <label>报表类型：</label>
        <el-select v-model="searchData.tableType.val" size="mini" clearable placeholder="请选择报表类型">
          <el-option
            v-for="item in searchData.tableType.data"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </div>
      <div class="item">
        <el-button size="mini" @click="handleSearch" type="primary">搜索</el-button>
      </div>
    </div>
    <div class="data-content box-shadow">
      <div class="table-content">
        <el-row :gutter="20">
          <el-col :span="3">
            <div class="tree-wrap">
              <el-tree :data="treeData" show-checkbox :props="defaultProps" @check-change="handleCheckChange"></el-tree>
            </div>
          </el-col>
          <el-col :span="16">
            <div class="table-wrap">
              <el-table
                :data="tableData"
                header-row-class-name="header-row"
                max-height="600px"
                style="width: 100%">
                <el-table-column
                  prop="username"
                  label="姓名">
                </el-table-column>
                <el-table-column
                  prop="groupName"
                  label="部门">
                </el-table-column>
                <el-table-column
                  prop="passTime"
                  label="识别时间">
                </el-table-column>
                <el-table-column
                  prop="access"
                  label="进出">
                </el-table-column>
                <el-table-column
                  prop="deviceid"
                  label="设备编号">
                </el-table-column>
                <el-table-column
                  prop="detail"
                  label="操作">
                </el-table-column>
              </el-table>
            </div>
          </el-col>
          <el-col :span="5">
            <div class="photo-wrap">
              <div class="avatar"></div>
              <!-- <div class="tag-wrap">
                <el-row :gutter="20">
                  <el-col :span="6"><div class="tag-div"></div></el-col>
                  <el-col :span="6"><div class="tag-div"></div></el-col>
                  <el-col :span="6"><div class="tag-div"></div></el-col>
                  <el-col :span="6"><div class="tag-div"></div></el-col>
                </el-row>
              </div> -->
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="table-pagination">
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
      </div>
    </div>
  </div>
</template>
<script>
import config from '@/config/config';
export default {
  name: 'throughLog',
  data() {
    return {
      defaultProps: {
        children: 'list',
        label: 'name'
      },
      isClick: false,
      loading: false,
      pageNum: 1,
      pageSize: 10,
      total: 1,
      searchData: {
        people: { // 工人
          val: '',
          data: []
        },
        time: '', // 时间
        tableType: { // 报表类型
          val: '',
          data: []
        }
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
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
      tableData: [],
    }
  },
  created() {},
  mounted() {
    this.getList();
  },
  computed: {
    treeData() {
      return this.$store.state.treeData;
    }
  },
  watch: {},
  methods: {
    handleCheckChange(data, checked, indeterminate) {
      console.log(data, checked, indeterminate);
    },
    handleSearch() {
      this.getList();
    },
    handleSizeChange(val) {
      this.pageNum = 1;
      this.pageSize = val;
      this.getList();
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getList();
      console.log(`当前页: ${val}`);
    },
    getList() {
      const vm = this;
      vm.loading = true;
      let {time} = this.searchData;
      let startAt = '',
        endAt = '';
      if(time) {
        if (time.toString() !== '') {
          startAt = new Date(time[0])*1;
          endAt = new Date(time[1])*1;
        }
      }
      this.$http.get('/recognition/accessList',{}).then(res => {
        let code = res.body.code;
        console.log(res)
        vm.loading = false;
        if(code === 200){
          let data = res.body.data;
          // vm.pageNum = data.pageNum;
          // vm.pageSize = data.pageSize;
          vm.total = data.total;
          vm.tableData = data.query;
        }else{
          vm.$message({
            message: '请求失败,'+res.body.msg,
            type: 'error',
            duration: 1500,
          });
        }
      }).catch(err => {
        vm.loading = false;
        console.log(err);
      })
    },
  },
}
</script>
<style lang="scss">
.throughLog{
  .el-form-item{
    margin-bottom:10px;
  }
  .el-dialog__body{
    padding: 10px 20px;
  }
  .el-select{
    width:100%;
  }
  .el-form-item__error{
    padding-top:0;
  }
}
</style>
<style lang="scss" scoped>
.throughLog{
  .throughLog-item{
    display:flex;
    .upload-close-file{
      position: absolute;
      right: 10px;
      z-index: 10;
      top: 14px;
      color: #fff;
      cursor: pointer;
    }
    >div{
      flex:1;
    }
    .text{
      margin:0 10px;
    }
  }
}
</style>

