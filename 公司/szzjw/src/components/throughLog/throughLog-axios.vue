<template>
  <div class="throughLog" v-loading.fullscreen="loading">
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
                @row-click="handleClickRow"
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
                  <template slot-scope="scope">
                    <span>{{ scope.row.access | formatKey(access, 'name')}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="sn"
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
              <div class="avatar">
                <img v-if="currPerImg" :src="currPerImg" alt="">
              </div>
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
const imgBase64 = 'data:image/jpg;base64,';
import request from "@/axios/axios";
import moment from 'moment';
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
      access: [
        {name: '进', val: 1},
        {name: '出', val: 0}
      ],
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
      ids: [],
      currPerImg: '',
    }
  },
  created() {},
  mounted() {
    this.getList();
    // this.handleClickRow()
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
    // 获取图片
    handleClickRow(row, column, event) {
      const vm = this;
      request({
        url: '/gwuser/picture',
        param: {
          id: row.id ? row.id : 1
        },
        method: 'get',
        onError: err => {
          // vm.loading = false;
          // vm.isClick = false;
        },
        vm,
      }).then(res => {
        let code = res.code;
        console.log(res)
        // vm.loading = false;
        if(code === 200){
          vm.currPerImg = res.data ? imgBase64 + res.data : '';
        }
      });
      // console.log(row, column, event);
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
      let startAt = '',
        endAt = '';
      if(time) {
        if (time.toString() !== '') {
          startAt = new Date(time[0])*1;
          endAt = new Date(time[1])*1;
        }
      }
      request({
        url: '/recognition/accessList',
        // param: {},
        param: {
          pageNum: vm.pageNum,
          pageSize: vm.pageSize,
          ids,
          // name,
          sysStartAt: endAt ? moment(startAt).format('YYYY-MM-DD') : '',
          sysEndAt: startAt ? moment(endAt).format('YYYY-MM-DD') : '',
        },
        method: 'post',
        onError: err => {
          vm.loading = false;
          // vm.isClick = false;
        },
        vm,
      }).then(res => {
        let code = res.code;
        console.log(res)
        vm.loading = false;
        if(code === 200){
          let data = res.data;
          // vm.pageNum = data.pageNum;
          // vm.pageSize = data.pageSize;
          vm.total = data ? data.total : 0;
          vm.tableData = data ? data.query : [];
        }
      });
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

