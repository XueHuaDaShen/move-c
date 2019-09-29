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
          type="month"
          placeholder="选择月">
        </el-date-picker>
        <!-- <el-date-picker
          v-model="searchData.time"
          size="mini"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions">
        </el-date-picker> -->
      </div>
      <!-- <div class="item">
        <label>报表类型：</label>
        <el-select v-model="searchData.tableType.val" size="mini" clearable placeholder="请选择报表类型">
          <el-option
            v-for="item in searchData.tableType.data"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </div> -->
      <div class="item">
        <el-button size="mini" @click="handleSearch" type="primary">搜索</el-button>
        <!-- <el-button size="mini" @click="handleReset" type="primary">重置</el-button> -->
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
                          <!-- <span v-if="time">{{t}}</span> -->
                          <span v-if="time"><em>{{time.start}}</em><br><em>{{time.end}}</em></span>
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
import request from "@/axios/axios";
import moment from 'moment';
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
      ids: [],
      titleData: [],
      contentData: [],
    }
  },
  created() {
    this.searchData.time = moment(new Date()).format("YYYY-MM");
  },
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
      let {level, id, list, $treeNodeId} = data;
      const vm = this;
      vm.ids[$treeNodeId] = [];
      if(Number(level) === 1){
        if(checked){
          if(list.length > 0){
            list.map(item => {
              vm.ids[$treeNodeId].push(item.id);
              // if(item.list.length > 0){
              //   item.list.map(l => {
              //     vm.ids[$treeNodeId].push(l.id);
              //   })
              // }else{
              //   vm.ids[$treeNodeId].push(item.id);
              // }
            })
          }else{
            vm.ids[$treeNodeId].push(id);
          }
        }else{
          vm.ids[$treeNodeId] = [];
        }
      }
      if(Number(level) === 2) {
        // if(list.length === 0){
          let index = vm.ids[$treeNodeId].indexOf(id);
          if(checked){
            if(index < 0){
              vm.ids[$treeNodeId].push(id);
            }
          }else{
            vm.ids[$treeNodeId].splice(index, 1)
          }
        // }
      }
      // if(Number(level) === 3){
      //   let index = vm.ids[$treeNodeId].indexOf(id);
      //   if(checked){
      //     if(index < 0){
      //       vm.ids[$treeNodeId].push(id);
      //     }
      //   }else{
      //     vm.ids[$treeNodeId].splice(index, 1)
      //   }
      // }
      // console.log(vm.ids[$treeNodeId])
      // console.log(vm.ids)
      // console.log($treeNodeId);
      // console.log(data, checked, indeterminate);
    },
    handleSearch() {
      this.getList();
    },
    handleReset() {},
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
      let arr = [];
      let ids = [];
      this.ids.filter(item => {
        arr.push(...item)
      })
      for(let i=0; i<arr.length; i++){
        if(ids.indexOf(arr[i]) < 0){
          ids.push(arr[i])
        }
      }
      request({
        url: '/attendance/statistics',
        param: {
          pageNum: vm.pageNum,
          pageSize: vm.pageSize,
          ids,
          month: time ? moment(time).format('YYYY-MM') : '',
        },
        method: 'post',
        onError: err => {
          vm.loading = false;
          // vm.isClick = false;
        },
        vm,
      }).then(res => {
        let code = res.code;
        vm.loading = false;
        console.log(res)
        if(code === 200){
          let data = res.data;
          // vm.pageNum = data.pageNum;
          // vm.pageSize = data.pageSize;
          vm.total = data ? data.total : 0;
          // vm.titleData = data.titleList;
          let arr1 = data ? data.data : [];
          let arr2 = data ? data.titleList : [];
          vm.formatData(arr1, arr2)
        }else{
          vm.formatData([])
        }
      });
    },
    formatData(data, titleList) {
      this.contentData = [];
      if(data.length === 0){
        this.noresult = true;
      }else{
        this.noresult = false;
        this.titleData = titleList;
        for(let i in data){
          let item = data[i];
          let arr = [];
          for(let i in item.list) {
            arr[item.list[i].day-1] = item.list[i];
          }
          this.contentData.push({
            name: item.name,
            group: item.group,
            list: arr
          })
        }
      }
      console.log(this.contentData)
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

