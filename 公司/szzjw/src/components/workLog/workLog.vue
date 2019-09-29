<template>
  <div class="workLog" v-loading.fullscreen="loading">
    <div class="search-wrap box-shadow">
      <!-- <div class="item">
        <label>工人：</label>
        <el-select v-model="searchData.people.val" size="mini" clearable placeholder="请选择工人">
          <el-option
            v-for="item in searchData.people.data"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </div> -->
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
          <el-col :span="21">
            <div class="table-wrap">
              <p class="no-result" v-if="noresult">暂无数据</p>
              <div class="container" v-if="!noresult">
                <table>
                  <thead>
                    <tr>
                      <th><div class="cell t-t-k">姓名</div></th>
                      <th><div class="cell t-t-k">部门</div></th>
                      <th v-for="(item, i) in titleData" :key="i">
                        <div class="cell">
                          <span><em>{{item.week}}</em><br><em>{{item.day}}</em></span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, i) in contentData" :key="i">
                      <th><div class="cell t-t-k">{{item.name}}</div></th>
                      <th><div class="cell t-t-k">{{item.group}}</div></th>
                      <th class="col-8" v-for="(time, t) in item.list" :key="t">
                        <div class="cell">
                          <span><em>{{time.start}}</em><br><em>{{time.end}}</em></span>
                        </div>
                      </th>
                    </tr>
                  </tbody>
                </table>
              </div>
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
  name: 'workLog',
  data() {
    return {
      scrollNum: 0,
      maxScrollNum: 0,
      leftScroll: null,
      rightScroll: null,
      noresult: false,
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
      titleData: [],
      contentData: [],
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
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getList();
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
      this.$http.post('/attendance/statistics',
        {
          // pageNum: vm.pageNum,
          // pageSize: vm.pageSize,
          ids: [4123,4123],
          // name,
          // sysStartAt: startAt,
          // sysEndAt: endAt,
        }).then(res => {
        let code = res.body.code;
        vm.loading = false;
        console.log(res)
        if(code === 200){
          let data = res.body.data;
          // vm.pageNum = data.pageNum;
          // vm.pageSize = data.pageSize;
          // vm.total = data.total;
          vm.formatData(data)
        }else{
          vm.formatData([])
          vm.$message({
            message: '请求失败,'+res.body.message,
            type: 'error',
            duration: 1500,
          });
        }
      }).catch(err => {
        vm.loading = false;
        console.log(err);
      })
    },
    formatData(data) {
      if(data.length === 0){
        this.noresult = true;
      }else{
        this.titleData = data[0].list;
        for(let i in data){
          let item = data[i];
          this.contentData.push({
            name: item.name,
            group: item.group,
            list: item.list
          })
        }
      }
    },
  },
}
</script>
<style lang="scss">
.workLog{
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
.workLog{
  .workLog-item{
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
.container{
  width:100%;
  overflow-x:scroll;
  .no-result{
    height: 100%;
    line-height: 100%;
  }
  table{
    width:100%;
    font-size:12px;
    border-collapse: collapse;
    // &::-webkit-scrollbar {
    //   display: none;
    // }
    em{
      font-style: normal;
    }
    th, td{
      padding:12px 0;
      position: relative;
    }
    .cell{
      padding:0 10px;
    }
    .t-t-k{
      min-width:50px;
    }
    tr{
      width:100%;
    }
    // th.col-1{
    //   width:10%;
    // }
    // th.col-8{
    //   width:80%;
    // }
    thead{
      th, td{
        background:#5ACAA6;
        color:#fff;
      }
    }
  }
}
</style>

