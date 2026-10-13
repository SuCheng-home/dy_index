<template>
  <div class="homeworkStatis">
    <div class="header-wrap">
      <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
        <el-tab-pane label="教师统计" name="1">
            <div class="header">
              <el-row>
                <el-col :span="19">
                  <el-button
                    size="medium"
                    @click="$router.back()"
                  >返回</el-button>
                  <term-grade-class-selector isGradeShowAll :isShowDuration="false" :queryArgs="queryArgs"   @input="getHomeworkStaticsPageDatasFunc()"
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
                      placeholder="教师姓名"
                      icon="search"
                      size="medium"
                      @keyup.enter.native="handleInputChange"
                      v-model.trim="listQuery.teacherName"
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
              label="教师姓名"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <span>{{scope.row.name}}</span>
              </template>
              </el-table-column>
               <el-table-column
              align="center"
              label="学科"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <span>{{scope.row.curriculumName}}</span>
              </template>
              </el-table-column>
              <el-table-column
                align="center"
                label="发布作业数"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.publishCount===0">{{scope.row.publishCount}}</span>
                  <span
                    class="link-type"
                    @click="$router.push({path:'homeworkNumList',query:{id:scope.row.id,startTime:listQuery.startDate,endTime:listQuery.endDate}})"
                    v-else
                  >{{scope.row.publishCount}}</span>
                </template>
                </el-table-column>
                <el-table-column
                  label="学生提交情况"
                  align="center"
                >
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
                        <span>{{scope.row.noSubmitCount}}</span>
                      </template>
                      </el-table-column>
                      </el-table-column>
                      <el-table-column
                        label="老师批改情况"
                        align="center"
                      >
                        <el-table-column
                          align="center"
                          label="已批改无需订正"
                          show-overflow-tooltip
                        >
                          <template slot-scope="scope">
                            <span>{{scope.row.evaluateCount}}</span>
                          </template>
                          </el-table-column>
                          <el-table-column
                          align="center"
                          label="已批改未订正"
                          show-overflow-tooltip
                        >
                          <template slot-scope="scope">
                            <span>{{scope.row.evaluateWdCount}}</span>
                          </template>
                          </el-table-column>
                          <el-table-column
                            align="center"
                            label="未批改人数"
                            show-overflow-tooltip
                          >
                            <template slot-scope="scope">
                              <span>{{scope.row.noEvaluateCount}}</span>
                            </template>
                            </el-table-column>
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
        </el-tab-pane>
        <el-tab-pane label="学生统计" name="2">
           <student-statis></student-statis>
        </el-tab-pane>
      </el-tabs>

    </div>
    <div>
  </div>
  </div>
</template>
<script>
import mixin from "@/mixins/windowResize";
import {
  queryRoleList,
  getHomeworkStaticsPageDatas,
  getSchoolHomeworkSet
} from "@/api/homework";
import { mapGetters } from "vuex";
import TermGradeClassSelector from "@/components/TermGradeClassSelector";
import studentStatis from './homeworkStudentStatis'
import _ from "lodash";
export default {
  components: { TermGradeClassSelector, studentStatis },
  data() {
    return {
      activeName: '1',
      listQuery: {
        teacherName: "",
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
     handleClick(tab, event) {
        console.log(tab.$options.propsData, event);
      },
    getHomeworkStaticsPageDatasFunc() {
      this.listLoading = true;
      this.listQuery.schoolTimeId=this.obj.termId;
      this.gradeCode=this.obj.gradeId||0;
      this.classCode=this.obj.classId||0;
       if(this.obj.termId){

      }else{
        this.homeworkData = [];
        this.total =null;
        this.listLoading = false;
        return;
      }
      sessionStorage.setItem("homeworkschoolTimeId", this.listQuery.schoolTimeId);
      getHomeworkStaticsPageDatas({
        roleId: this.listQuery.roleId,
        pageNo: this.listQuery.pageNo,
        pageSize: this.listQuery.pageSize,
        searchName: this.listQuery.teacherName,
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
            this.exportURL = `${
              global.homeworkfetch
            }structure/homeWork/exportHomeworkStatics?classId=${
              this.classCode
            }&gradeId=${
              this.gradeCode
            }&roleId=${this.listQuery.roleId}&searchName=${
              this.listQuery.teacherName
            }&token=${
              this.$store.getters.token
            }&schoolTimeId=${sessionStorage.getItem("homeworkschoolTimeId")}`;
            this.listLoading = false;
          }
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
      this.getHomeworkStaticsPageDatasFunc();
    },
    handleSizeChange(val) {
      this.listQuery.pageNo = 1;
      this.listQuery.pageSize = val;
      this.getHomeworkStaticsPageDatasFunc();
    },
    handleInputChange: _.debounce(
      function() {
        this.listQuery.pageNo = 1;
        this.getHomeworkStaticsPageDatasFunc();
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
