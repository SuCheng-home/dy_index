<template>
  <div class="peanutstu">
    <div class="header">
      <el-row>
        <el-col :span="19">
           <el-button size="medium" @click.native="$router.back()">返回</el-button>
           <el-select v-model="pagination.type" placeholder="请选择" size="medium" @change="nameSearch">
            <el-option :value="0" label="全部发放类型"></el-option>
            <el-option :value="1" label="学生评价"></el-option>
            <el-option :value="2" label="家校共育"></el-option>
          </el-select>
            <!-- <el-select v-model="pagination.state" placeholder="请选择" size="medium" @change="nameSearch">
            <el-option :value="0" label="全部审批状态"></el-option>
            <el-option :value="1" label="未审批"></el-option>
            <el-option :value="2" label="已审批"></el-option>
          </el-select> -->
         
        </el-col>
        <el-col :span="5">
          <el-input size="medium" v-model.trim="pagination.studentName" placeholder="请输入学生姓名" @keyup.enter.native="nameSearch">
            <el-button slot="append" icon="el-icon-search" size="medium" @click="nameSearch"></el-button>
          </el-input>
        </el-col>
      </el-row>
    </div>
    <div class="doc_flow_table_box">
      <el-table stripe :data="dataList" border fit highlight-current-row style="width: 100%" :height="maxH-1">
        <el-table-column align="center" label="学生姓名" show-overflow-tooltip>
          <template slot-scope="scope">
          {{scope.row.studentName}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="班级" show-overflow-tooltip>
          <template slot-scope="scope">
          {{scope.row.className}}
          </template>
        </el-table-column>
         <!-- <el-table-column align="center" label="状态">
          <template slot-scope="scope">
            <el-tag  size="mini"   type="success"  v-if="scope.row.state === 2">已审批</el-tag>
            <el-tag  size="mini"   type="danger" v-if="scope.row.state === 1">未审批</el-tag>
          </template>
        </el-table-column> -->
        <el-table-column align="center" label="金额" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.num}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="发放人" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.batchUserName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="发放时间" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.batchTime | formatTime}}</span>
          </template>
        </el-table-column>
         <el-table-column align="center" label="指标">
          <template slot-scope="scope">
            <el-tag  size="mini"   >{{scope.row.indicatorTitle}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="事由" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.title}}</span>
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
  import {getPeanutRecordList} from '@/api/peanut';
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
          batchUserId:this.$route.query.batchUserId,
          studentId:'',
          studentName:'',
          schoolTimeId:this.$route.query.schoolTimeId,
          type:0,
          state:0,
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
        return '';
      }
    },
    created() {
         this.getStatistics()
    },
    methods: {
      nameSearch() {
        this.pagination.pageNo = 1;
        this.getStatistics();
      },
      getStatistics() {
        this.getPeanutRecordList(this.pagination);
      },
      getPeanutRecordList(query) {
        getPeanutRecordList(query).then(res => {
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
  .peanutstu {
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
