<template>
  <div class="peanutth">
    <div class="header">
      <el-row>
        <el-col :span="19">
           <el-select v-model="schoolName" placeholder="请选择学期" size="medium" @change="changeSchool">
            <el-option v-for="item in schoolYearList" :key="item.schoolTimeCode" :label="item.label"
                       :value="item.schoolTimeName">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="5">
          <el-input size="medium" v-model.trim="content" placeholder="请输入事由" @keyup.enter.native="nameSearch">
            <el-button slot="append" icon="el-icon-search" size="medium" @click="nameSearch"></el-button>
          </el-input>
        </el-col>
      </el-row>
    </div>
    <div class="doc_flow_table_box">
      <el-table stripe :data="dataList" border fit highlight-current-row style="width: 100%" :height="maxH-1">
        <el-table-column align="center" label="事由" show-overflow-tooltip>
          <template slot-scope="scope">
          {{scope.row.content}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="发放范围" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-for="(item,index) in JSON.parse(scope.row.userScope).departList" :key="index">{{item.name}}；</span>
            <span v-for="(item,index) in JSON.parse(scope.row.userScope).userList" :key="index">{{item.name}}；</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="发放金额" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.num}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="发放人" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.createUserName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="发放时间" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.createTime | formatTime}}</span>
          </template>
        </el-table-column>
         <el-table-column align="center" label="状态">
          <template slot-scope="scope">
            <el-tag  size="mini"   type="success"  v-if="scope.row.status === 1">已发放</el-tag>
            <el-tag  size="mini"   type="danger" v-if="scope.row.status === 2">已撤回</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
             <el-button type="text"  v-if="scope.row.status === 1"  @click.native.prevent="recallPanutGrantList(scope.row.id)" class="buttontextred">撤回</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container" style="margin-top: 15px;">
        <el-pagination @size-change="sizeChangeHandler" @current-change="currentChangeHandler"
                       :current-page.sync="pagination.pageNo" :page-sizes="[10, 20, 30, 50]"
                       :page-size.sync="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper"
                       :total="pagination.total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import baseMixin from '@/mixins/baseMixin';
  import mixins from '@/mixins/windowResize';
  import {getSchoolTimeList} from '@/api/record';
  import {getPanutGrantList, recallPanutGrantList} from '@/api/peanut';
  export default {
    name: "documentFlowIndex",
    data() {
      return {
        content: '',
        schoolName: '',
        schoolTimeCode: '',
        schoolYearList: [],
        pagination: {
          pageNo: 1,
          pageSize: 20,
          total: null
        },
        dataList: [],
        isSchoolLeader: false
      }
    },
    mixins: [baseMixin, mixins],
    filters: {
      formatTime(date) {
        if (date) {
          return date.substring(0, 19);
        }
        return '--';
      }
    },
    created() {
      this.getSchoolTimeList();
    },
    methods: {
      changeSchool(val) {
        const self = this;
        this.schoolName = val;
        this.schoolYearList.forEach((item) => {
          if (item.schoolTimeName === val) {
            self.schoolTimeCode = item.id;
          }
        });
         this.getStatistics()
      },
      getSchoolTimeList() {
        getSchoolTimeList().then(res => {
          const data = res.data.data;
          if (res.data.code === 200) {
            this.schoolYearList = data;
            data.forEach((item) => {
              if (item.isCurrent === 1) {
                this.schoolName = item.schoolTimeName;
                this.schoolTimeCode = item.id;
              }
            });
             if(!this.schoolTimeCode){
                this.schoolTimeCode=this.schoolYearList[0].id
            }
            this.getStatistics()
          }
        }).catch();
      },
      recallPanutGrantList(id) {
        this.$confirm('是否撤回?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          recallPanutGrantList(id).then(res => {
            if (res.data.code === 200) {
              this.$message({
                type: 'success',
                message: '撤回成功!'
              });
              this.getStatistics();
            } else {
              this.$message.error(res.data.msg);
            }
          }).catch();
        }).catch(() => {
        });
      },
      nameSearch() {
        this.pagination.pageNo = 1;
        this.getStatistics();
      },
      getStatistics() {
         let query = {
          pageNo: this.pagination.pageNo,
          pageSize: this.pagination.pageSize,
          content: this.content,
          schoolTimeId: this.schoolTimeCode
        };
        this.getPanutGrantList(query);
      },
      getPanutGrantList(query) {
        getPanutGrantList(query).then(res => {
          const data = res.data;
          if (res.data.code === 200) {
            this.dataList = data.data.dataList;
            this.pagination.total = data.data.pagination.total;
          } else {
            this.$message({
              message: data.msg,
              type: 'warning'
            });
          }
        }).catch();
      },
      sizeChangeHandler() {
        this.pagination.pageNo = 1;
        this.getStatistics();
      },
      currentChangeHandler() {
        this.getStatistics();
      }
    }
  }
</script>

<style lang="scss" scoped>
  .peanutth {
    .header {
      padding: 12px 12px 10px 12px;
    }

    .doc_flow_table_box {
      padding: 0 15px 15px 15px;
      margin: 0 auto;
      .name_title{
        color: #409eff;
        cursor: pointer;
      }
    }
  }
</style>
