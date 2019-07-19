<template>
  <div class="el-custom banner">
    <textarea class="display-none-input" name="" id="recommend-copy-url-input" cols="30" rows="10"></textarea>
    <div class="content-header">
      <div class="title" style="position:relative;">
        <h2>{{titleName}}</h2>
      </div>
      <div class="search-wrap">
        <div class="nav-title">
          <span :class="item.checked?'current':''" v-for="(item, index) in routerArr" :key="index" @click="handleChangeRouter(item.name)">{{item.title}}</span>
        </div>
        <!-- <div class="search-content">
          <div class="search-inner-wrap">
            <label>Status：</label>
            <el-select clearable v-model="enabled.value" placeholder="Status" class="small">
              <el-option v-for="item in enabled.options" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="search-inner-wrap">
            <el-button @click="handleSearch" class="small yes">Search</el-button>
            <el-button @click="handleReset" class="small no">Reset</el-button>
          </div>
        </div> -->
      </div>
    </div>
    <div class="content-middle">
      <div class="search-wrap">
        <div class="search-inner-wrap">
          <!-- <el-button type="success" @click="openDialog()" size="medium" class="edit">Create</el-button> -->
        </div>
      </div>
    </div>
    <div class="tag-router">
      <span v-for="(item, i) in breadcrumbArr" :key="i" @click="handleClickTag(item)">{{item}} <i class="right-jiantou" v-if="i != breadcrumbArr.length-1"></i></span>
    </div>
    <div class="data-table" v-loading="loading">
      <el-table :data="linkList" header-row-class-name="table-header" stripe border style="width: 100%;fong-size:12px;" max-height="450">
        <el-table-column align="center" prop="loginid.loginname" label="User">
          <template slot-scope="scope">
            <el-button type="text" @click="getUserChildren(scope.row)">{{scope.row.loginid.loginname}}</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="loginid.firstname" width="110" label="First Name">
        </el-table-column>
        <el-table-column align="center" prop="code" label="Code">
        </el-table-column>
        <el-table-column align="center" label="Link">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <p>{{scope.row.url}}</p>
              <div slot="reference" class="name-wrapper">
                <el-button type="success" size="mini" class="edit" @click="handleCopyUrl(scope.row.url)">Copy</el-button>
                <!-- <el-button size="mini" type="primary">Copy</el-button> -->
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="refund" label="Rebate PCT">
        </el-table-column>
        <el-table-column align="center" prop="num_clicked" label="Click">
        </el-table-column>
        <el-table-column align="center" prop="num_registered" label="Registered">
        </el-table-column>
        <el-table-column align="center" prop="bid_total" label="Bet">
          <template slot-scope="scope">
            {{scope.row.bid_total ? scope.row.bid_total : 0}}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="refund_amount" label="Rebate">
        </el-table-column>
        <!-- <el-table-column align="center" prop="want_amount" label="Want Amount">
        </el-table-column> -->
      </el-table>
      <div class="fenye">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum"
          :page-size="pageSize" :page-sizes="[10, 20, 40, 80,160,350,700,1000]" layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
  import request from '@/axios/axios.js'
  import DialogUserInfo from '../dialog-user-info/DialogUserInfo';
  import tableBtn from '../littleStyle/tableBtn';
  import moment from 'moment'
  export default {
    name: 'recommendLink',
    components: {
      tableBtn,
      DialogUserInfo
    },
    data() {
      return {
        index1: 0,
        index2: 0,
        loginname: 'KINGU',
        titleName: '',
        routerArr: [],
        breadcrumbArr: [],
        loading: false,
        pageNum: 1,
        pageSize: 40,
        enabled: {
          value: "",
          options: [{
              label: "all",
              value: ""
            },
            {
              label: "enabled",
              value: 1
            },
            {
              label: "disabled",
              value: 0
            },
          ]
        },
        total: 0,
        duration: 1000,

        linkList: [],
      }
    },
    created() {
      this.routerArr = [];
      let query = this.$route.query;
      this.index1 = Number(query.index1);
      this.index2 = Number(query.index2);
      let data = this.$store.state.formatMenuFn(this.index1, this.index2, 'recommendLink');
      this.routerArr = data.routerArr;
      this.titleName = data.titleName;
      this.breadcrumbArr.push("ROOT")
      this.getDataList();
    },
    mounted() {},
    watch: {},
    methods: {
      // 面包屑
      handleClickTag(tag) {
        if(tag == 'ROOT'){
          this.breadcrumbArr = [];
          this.breadcrumbArr.push(tag);
          this.loginname = 'KINGU';
          this.getDataList();
        }else{
          let index = this.breadcrumbArr.indexOf(tag);
          if(index == (this.breadcrumbArr.length-1)){
            // 点击当前的用户
          }else{
            // 点击上一层用户
            this.loginname = tag;
            let arr = this.breadcrumbArr.splice(0, index);
            this.breadcrumbArr = [];
            this.breadcrumbArr.push(...arr, tag);
            this.getDataList();
          }
        }
      },
      getUserChildren(row) {
        this.loginname = row.loginid.loginname;
        if(this.breadcrumbArr.indexOf(this.loginname) > -1){
          return false;
        }
        this.breadcrumbArr.push(this.loginname)
        this.getDataList();
      },
      
      //
      getDataList() {
        const vm = this;
        request.http(
          'get',
          '/agency/link/list',
          {
            page_num: vm.page_num,
            page_size: vm.page_size,
            superiorname: vm.loginname,
            type: [2]
          },
          success => {
            let code = success.returncode;
            if (code === 200) {
              vm.linkList = success.data.child;
              vm.total = success.data.total;
            } else if (code === 101 || code === 103 || code === 106) {
              request.loginAgain(vm)
            } else{
              vm.linkList = [];
            }
          },
          error => {}
        )
      },
      handleCopyUrl(url) {
        var input = document.getElementById("recommend-copy-url-input");
        input.value = url; // 修改文本框的内容
        input.select(); // 选中文本
        document.execCommand("copy"); // 执行浏览器复制命令
        this.message("Copy success", "success")
      },
      handleChangeRouter(name) {
        this.$router.push({
          name: name,
          query: {
            index1: this.index1,
            index2: this.index2
          }
        })
        // console.log(name)
      },
      succee() {
        const vm = this;
        this.$message({
          message: 'Load Success',
          type: 'success',
          duration: vm.duration,
          center: true
        })
      },
      message(value, type) {
        const vm = this;
        this.$message({
          message: value,
          type: type,
          duration: vm.duration,
          center: true
        })
      },
      error() {
        const vm = this;
        this.$message({
          message: 'Load Failure',
          type: 'error',
          duration: vm.duration,
          center: true
        })
      },
      handleSizeChange(val) {
        // console.log(`每页 ${val} 条`);
        this.pageSize = val;
        this.getActivityLogList();
      },
      handleCurrentChange(val) {
        this.pageNum = val;
        this.getActivityLogList();
        // console.log(`当前页: ${val}`);
      },
      formatTime(row, column, cellValue) {
        return moment(cellValue).format('DD-MM-YYYY HH:mm:ss')
        // return moment(cellValue).format('DD-MM-YYYY')
      },
      handleReset() {
        // this.enabled.value = '';
      },
      handleSearch() {
        this.getDataList();
      },
    }
  }

</script>
<style lang="scss">
  /* @import '../../publicCss/header.css'; */

  .banner {
    .el-custom .el-form-item {
      justify-content: flex-start;
    }

    .el-custom .el-form-item .el-form-item__content {
      display: flex;
      /* justify-content: space-around; */
      align-items: center;
    }

    .el-form-item {
      justify-content: flex-start;
    }

    .el-form-item__content {
      flex: 1;
      width: auto;
    }

    .el-form-item__label {
      width: 60px;
      font-size: 12px;
      color: #191919;
      /* letter-spacing: 6px; */
      text-align: justify;
      text-align-last: justify;
    }
  }

</style>

<style lang="scss" scoped>
.tag-router{
  width:100%;
  padding:20px;
  background:#fff;
  text-align:left;
  span{
    cursor: pointer;
    color:#606266;
    &:hover{
      color:#000;
    }
  }
}
.right-jiantou{
  font-family: element-icons!important;
  speak: none;
  font-style: normal;
  font-weight: 400;
  font-variant: normal;
  text-transform: none;
  line-height: 1;
  vertical-align: baseline;
  display: inline-block;
  -webkit-font-smoothing: antialiased;
  font-size:14px;
  margin: 0 6px;
  font-weight: 400;
  color: #c0c4cc;
  &::before{
    content: "\E604";
  }
}
</style>