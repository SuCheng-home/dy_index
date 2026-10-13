<template>
  <div>
    <div class="header-wrap">
      <div class="header">
        <el-row>
          <el-col :span="19">
            <el-button
              size="medium"
              @click="$router.back()"
            >返回</el-button>
            <term-grade-class-selector :isShowDuration="false" :queryArgs="queryArgs"   @input="getHomeworkStuStaticsForLeader()"
              ref="selector"
              v-model="obj"
            ></term-grade-class-selector>

                <a
                  :href="exportURL"
                  download="导出结果"
                  target="_blank" v-if="homeworkData.length"
                >
                  <el-button
                    size="medium"

                    type="primary"
                    icon="upload"
                  >导出</el-button>
                    </a>
          </el-col>
          <el-col :span="5">
            <template>
              <el-input
                placeholder="学生姓名"
                icon="search"
                size="medium"
                @keyup.enter.native="handleInputChange"
                v-model.trim="listQuery.stuName"
              >
                <el-button
                  slot="append"
                  icon="el-icon-search"
                  @click="handleInputChange"
                ></el-button>
                  </el-input>
            </template>
          </el-col>
        </el-row>
      </div>
    </div>
    <div>
      <el-table
        stripe
        :data="homeworkData"
        v-loading.body="listLoading"
        border
        fit
        highlight-current-row
        style="width: 100%"
        :height="maxH-56"
      >
        <el-table-column
          align="center"
          label="学生姓名"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span>{{scope.row.stuName}}</span>
          </template>
          </el-table-column>
          <el-table-column
          align="center"
          label="已提交"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span>{{scope.row.submitCount}}</span>
          </template>
          </el-table-column>
           <el-table-column
          align="center"
          label="未提交"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span>{{scope.row.unSubmitCount}}</span>
          </template>
          </el-table-column>    
      <el-table-column
          align="center"
          label="提交率"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span>{{scope.row.submitRatio?scope.row.submitRatio:'--'}}</span>
          </template>
          </el-table-column>
           <el-table-column
          align="center"
          label="已订正"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span>{{scope.row.revisedCount}}</span>
          </template>
          </el-table-column>
           <el-table-column
          align="center"
          label="未订正"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span>{{scope.row.unRevisedCount}}</span>
          </template>
          </el-table-column>
          <el-table-column
          align="center"
          label="订正率"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span>{{scope.row.revisedRatio?scope.row.revisedRatio:'--'}}</span>
          </template>
          </el-table-column>
        <el-table-column
          align="center"
          show-overflow-tooltip
        >
          <template slot="header" slot-scope="scope">
            <span>平均评价</span>
            <i class="el-icon-star-on"></i>
          </template>
          <template slot-scope="scope">
            <span>{{scope.row.avgEvaluateScore}}</span>
          </template>
          </el-table-column>
        <el-table-column
          align="center"
          show-overflow-tooltip
        >
          <template slot="header" slot-scope="scope">
            <span>作业总评价</span>
            <i class="el-icon-star-on"></i>
          </template>
          <template slot-scope="scope">
            <span>{{scope.row.allEvaluateScore}}</span>
          </template>
          </el-table-column>
      </el-table>
      <div
        v-show="!listLoading"
        class="pagination-container"
      >
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="listQuery.pageNo"
          :page-sizes="[10,20,30, 50]"
          :page-size="listQuery.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
          </el-pagination>
     </div>
   </div>
  </div>
</template>
<script>
import mixin from "@/mixins/windowResize";
import {
  queryRoleList,
  getHomeworkStaticsPageDatas,
  getHomeworkStuStaticsForLeader,
  getSchoolHomeworkSet
} from "@/api/homework";
import { mapGetters } from "vuex";
import TermGradeClassSelector from "@/components/TermGradeClassSelector";
import _ from "lodash";
export default {
  components: { TermGradeClassSelector },
  data() {
    return {
      listQuery: {
        stuName: "",
        pageNo: 1,
        pageSize: 20,
        roleId: 0,
        schoolTimeId: ""
      },
      gradeList: [],
      gradeName: "",
      gradeCode: 0,
      classList: [],
      classCode: 0,
      className: "",
      total: 0,
      homeworkData: [],
      listLoading: false,
      exportURL: "",
      termList: [],
      queryArgs: {
        all: true, //所有班级年级
        manager: false, //班主任
        notlimit: true, //所有班级年级
        submanager: false, //副班主任
        teacher: false //普通所交
      },
      obj: {
        termId: "",
        duration: ["", ""],
        gradeId: "",
        classId: ""
      }
    };
  },
  created() {
    //角色权限
      this.queryRoleListFunc();
  },
  mounted() {},
  computed: {
    ...mapGetters(["userInfo"])
  },
  mixins: [mixin],
  methods: {
    getHomeworkStuStaticsForLeader() {
      this.listLoading = true;
      this.listQuery.schoolTimeId=this.obj.termId;
      this.gradeCode=this.obj.gradeId;
      this.classCode=this.obj.classId;
       if(this.obj.classId&&this.obj.gradeId&&this.obj.termId){

      }else{
        this.homeworkData = [];
        this.total =null;
        this.listLoading = false;
        return;
      }
      sessionStorage.setItem("homeworkschoolTimeId", this.listQuery.schoolTimeId);
      getHomeworkStuStaticsForLeader({
        // roleId: this.listQuery.roleId,
        pageNo: this.listQuery.pageNo,
        pageSize: this.listQuery.pageSize,
        stuName: this.listQuery.stuName,
        gradeId: this.gradeCode,
        classId: this.classCode,
        schoolTimeId: this.listQuery.schoolTimeId
      })
        .then(res => res.data)
        .then(data => {
          if (data.code === 200) {
            const tableData = data.data;
            this.homeworkData = tableData.dataList;
            this.total = tableData.pagination.total;
            this.exportURL = 
              global.homeworkfetch + 'structure/homeWork/exportHomeworkStuStaticsForLeader?classId='+this.classCode
              +'&gradeId='+this.gradeCode +'&stuName='+this.listQuery.stuName +'&token=' + this.$store.getters.token+'&schoolTimeId='+sessionStorage.getItem("homeworkschoolTimeId")
            this.listLoading = false;
          }
          console.log( this.exportURL)
        })
        .catch(() => {
          this.listLoading = false;
        });
    },
    queryRoleListFunc() {
      //角色
      queryRoleList({
        userId: this.userInfo.id
      })
        .then(res => res.data)
        .then(data => {
          if (data.code === 200) {
            const userArray = data.data;
            const userRoleList = [];
            if (userArray && userArray.length !== 0) {
              userArray.forEach(item => {
                userRoleList.push(item.constantId);
              });
              //角色constantId 306作业管理员 280校领导 7教务处 9年级组长 10年级副组长 11班主任 131副班主任
              this.queryArgs.all=(userRoleList.indexOf(306) !== -1 )||(userRoleList.indexOf(280) !== -1) ||(userRoleList.indexOf(7) !== -1);
              this.queryArgs.notlimit=(userRoleList.indexOf(306) !== -1 )||(userRoleList.indexOf(280) !== -1) ||(userRoleList.indexOf(7) !== -1);
              this.queryArgs.manager=!(userRoleList.indexOf(306) !== -1 )||(userRoleList.indexOf(280) !== -1) ||(userRoleList.indexOf(7) !== -1);
              this.queryArgs.submanager=!(userRoleList.indexOf(306) !== -1 )||(userRoleList.indexOf(280) !== -1) ||(userRoleList.indexOf(7) !== -1);
            }
          }
        })
        .catch(() => {});
    },

    handleCurrentChange(val) {
      this.listQuery.pageNo = val;
      this.getHomeworkStuStaticsForLeader();
    },
    handleSizeChange(val) {
      this.listQuery.pageNo = 1;
      this.listQuery.pageSize = val;
      this.getHomeworkStuStaticsForLeader();
    },
    handleInputChange: _.debounce(
      function() {
        this.listQuery.pageNo = 1;
        this.getHomeworkStuStaticsForLeader();
      },
      // 这是我们为用户停止输入等待的毫秒数
      300
    )

  }
};
</script>
<style lang="scss" scoped>
.homeworkStatis {
  padding:12px;
  background-color: #fff;
  .header {
    margin-bottom: 10px;
    font-size: 14px;

  }
  .header2 {
    margin-top: 10px;
  }
}
</style>
