<template>
  <div class="study-subject-autonomy-detail">
    <el-row>
      <el-col :span="19">
        <el-button @click="$router.back()" size="medium">返回</el-button>
        <el-select
          class="el-select-short"
          size="medium"
          placeholder="请选择学期"
          value-key="id"
          v-model="form.schoolTime"
          @change="handleSchoolTime"
        >
          <el-option
            v-for="(item, idx) in schoolTimeAllList"
            :key="idx"
            :label="item.schoolTimeName"
            :value="item"
          ></el-option>
        </el-select>
        <el-select
          class="el-select-short"
          size="medium"
          placeholder="请选择"
          value-key="week"
          v-model="form.weekObj"
          @change="handleWeek"
        >
          <el-option label="全部周次" :value="{ week: 0 }"></el-option>
          <el-option
            v-for="(item, idx) in weekList"
            :key="idx"
            :label="`第${item.week}周`"
            :value="item"
          ></el-option>
        </el-select>

        <a :href="exportUrl"  v-if="tabList.length" target="_blank" download="examName">
          <el-button type="primary" size="medium">导出</el-button> </a
        >&nbsp;
      </el-col>
      <el-col :span="5">
        <el-input
          class="search-input"
          icon="el-icon-search"
          size="medium"
          placeholder="请输入听课人"
          clearable
          v-model.trim="form.searchName"
          @change="handleTitle"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="handleTitle"
          ></el-button>
        </el-input>
      </el-col>
    </el-row>

    <el-table
      border
      fit
      stripe
      highlight-current-row
      style="width: 100%"
      ref="table"
      :height="nobottommaxH - 61"
      :data="tabList"
      v-loading.body="tabLoading"
      v-if="!tabLoading"
    >
      <el-table-column align="center" label="听课人" show-overflow-tooltip>
        <template slot-scope="scope">{{
          scope.row.createName || "--"
        }}</template>
      </el-table-column>
      <el-table-column align="center" label="听课时间" show-overflow-tooltip>
        <template slot-scope="scope">
          第{{ scope.row.week }}周 星期{{ scope.row.weekDay | filerWeek }}
          {{ scope.row.dayStage | filteDayStage }}（第{{ scope.row.seq }}节）
        </template>
      </el-table-column>
      <el-table-column align="center" label="听课班级" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.className || "--" }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="执教教师" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.classTeacherJson | filterTeacherJson }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="课题" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.subjectName || "--" }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="subAppraise.typeName"
        show-overflow-tooltip
        :key="idx"
        v-for="(subAppraise, idx) in subAppraiseJson"
      >
        <template slot-scope="scope">
          <span
            :key="appraiseIdx"
            v-for="(appraise, appraiseIdx) in scope.row.appraiseList"
          >
            <span
              v-if="
                subAppraise.typeId == appraise.typeId && appraise.typeLevel == 1
              "
              >A</span
            >
            <span
              v-if="
                subAppraise.typeId == appraise.typeId && appraise.typeLevel == 2
              "
              >B</span
            >
            <span
              v-if="
                subAppraise.typeId == appraise.typeId && appraise.typeLevel == 3
              "
              >C</span
            >
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="等第" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="scope.row.appraiseLevel == 1">优</span>
          <span v-else-if="scope.row.appraiseLevel == 2">良</span>
          <span v-else-if="scope.row.appraiseLevel == 3">及格</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="改进建议" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.appraiseContent }}</template>
      </el-table-column>
    </el-table>

    <el-pagination
      style="margin-top: 20px"
      layout="total, sizes, prev, pager, next, jumper"
      :current-page.sync="pagination.pageNo"
      :page-size="pagination.pageSize"
      :page-sizes="pagination.pageSizes"
      :total="pagination.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    ></el-pagination>
  </div>
</template>

<script>
/* utils */
import mixin from "@/mixins/windowResize";
import { mapGetters } from "vuex";

/* components */

/* api */
import {
  getSchoolDicDetailsByTypeCode,
  findSchoolDicsByCode,
  getSchoolTimeAllListBySchoolId,
  getSeveralWeekListBySchoolTImeId,
  queryStudySubjectOwnBySchoolTimeIdAndWeek,
} from "@/api/teachingStudy/erTongYanJiuTingKe";

export default {
  mixins: [mixin],
  components: {},
  filters: {
    filterDate(val) {
      return val ? moment(val).format("YYYY-MM-DD HH:mm:ss") : "--";
    },
    filterTeacherJson(val) {
      return val
        ? JSON.parse(val)
            .map((item) => item.name)
            .join("，")
        : "--";
    },
    filerWeek(val) {
      let map = ["一", "二", "三", "四", "五", "六", "日"];
      return map[val - 1];
    },
    filteDayStage(val) {
      let map = ["早自习", "上午", "午自习", "下午", "晚自习"];
      return map[val - 1];
    },
  },
  watch: {},
  computed: {
    ...mapGetters(["schoolInfo", "userInfo"]),
  },
  data() {
    return {
      isEmpty: false,
      // 研究课听课id
      studySubjectId: this.$route.query.studySubjectId,
      exportUrl: "",
      // 是否正在加载数据 { Boolean }
      tabLoading: false,
      subAppraiseJson: [],
      // 表格数据 { Array }
      tabList: [],
      // 分页
      pagination: {
        pageNo: 1,
        pageSize: 20,
        pageSizes: [10, 20, 30, 50],
        total: 0,
      },
      // 请求表单
      form: {
        schoolTime: {},
        weekObj: { week: 0 },
        searchName: "",
      },
    };
  },
  created() {
    this.tabLoading = true;
    this.getSchoolDicDetailsByTypeCode();
  },
  methods: {
    getSchoolDicDetailsByTypeCode() {
      getSchoolDicDetailsByTypeCode({
        typeCode: "studySubject",
      })
        .then((res) => {
          let _res = res.data;
          if (_res.code != 200) return Promise.reject(_res.msg);
          else return _res.data;
        })
        .then((data) => {
          if (Array.isArray(data) && data.length) {
            this.appraiseJson = data.map((item) => ({
              typeId: item.id,
              typeName: item.name,
              code: item.code,
              itemList: [],
            }));
            let temp = Promise.all(
              this.appraiseJson.map((item) =>
                findSchoolDicsByCode({
                  dicCode: item.code,
                }).then((res) => {
                  let _res = res.data;
                  if (_res.code != 200) return Promise.reject(_res.msg);
                  else return _res.data;
                })
              )
            );
            temp
              .then((res) => {
                this.appraiseJson.forEach((item, idx) => {
                  item.itemList = res[idx].map((sub) => ({
                    typeId: sub.id,
                    typeName: sub.remark
                      ? `${sub.value}：${sub.remark}`
                      : sub.value,
                  }));
                });
                this.getSchoolTimeAllListBySchoolId();
              })
              .catch(() => {
                this.tabLoading = false;
                this.$message({
                  message: msg,
                  type: "error",
                });
              });
          }
        });
    },

    // 根据学校id获取学期列表
    getSchoolTimeAllListBySchoolId() {
      getSchoolTimeAllListBySchoolId({
        schoolId: this.schoolInfo.id,
      })
        .then((res) => {
          let _res = res.data;
          if (_res.code != 200) return Promise.reject(_res.msg);
          else return _res.data;
        })
        .then((data) => {
          if (Array.isArray(data) && data.length) {
            this.schoolTimeAllList = [...data];
            let schoolTime = this.schoolTimeAllList.find(
              (item) => item.isCurrent
            );
            if (schoolTime) this.form.schoolTime = schoolTime;
            else this.form.schoolTime = this.schoolTimeAllList[0];
            this.getSeveralWeekListBySchoolTImeId();
          }
        })
        .catch((msg) => {
          this.tabLoading = false;
          this.$message({
            message: msg,
            type: "error",
          });
        });
    },

    // 根据学校id获取学期列表
    getSchoolTimeAllListBySchoolId() {
      getSchoolTimeAllListBySchoolId({
        schoolId: this.schoolInfo.id,
      })
        .then((res) => {
          let _res = res.data;
          if (_res.code != 200) return Promise.reject(_res.msg);
          else return _res.data;
        })
        .then((data) => {
          if (Array.isArray(data) && data.length) {
            this.schoolTimeAllList = [...data];
            let schoolTime = this.schoolTimeAllList.find(
              (item) => item.isCurrent
            );
            if (schoolTime) this.form.schoolTime = schoolTime;
            else this.form.schoolTime = this.schoolTimeAllList[0];
            this.getSeveralWeekListBySchoolTImeId();
          }
        })
        .catch((msg) => {
          this.tabLoading = false;
          this.$message({
            message: msg,
            type: "error",
          });
        });
    },

    // 根据schoolTimeId获取学期的周次
    getSeveralWeekListBySchoolTImeId() {
      getSeveralWeekListBySchoolTImeId({
        schoolTimeId: this.form.schoolTime.id,
      })
        .then((res) => {
          let _res = res.data;
          if (_res.code != 200) return Promise.reject(_res.msg);
          else return _res.data;
        })
        .then((data) => {
          if (Array.isArray(data) && data.length) {
            this.weekList = [...data];
            this.queryStudySubjectOwnBySchoolTimeIdAndWeek();
          }
        })
        .catch((msg) => {
          this.$message({
            message: msg,
            type: "error",
          });
        });
    },

    // 根据学期和周分页获取自主听课,week=0代表全部周
    queryStudySubjectOwnBySchoolTimeIdAndWeek() {
      queryStudySubjectOwnBySchoolTimeIdAndWeek({
        week: this.form.weekObj.week,
        schoolTimeId: this.form.schoolTime.id,
        searchName: this.form.searchName,
        pageNo: this.pagination.pageNo,
        pageSize: this.pagination.pageSize,
      })
        .then((res) => {
          let _res = res.data;
          if (_res.code != 200) return Promise.reject(_res.msg);
          else return _res.data;
        })
        .then((data) => {
          if (data) {
            let subAppraiseJson = [];
            subAppraiseJson = subAppraiseJson.concat(
              ...this.appraiseJson.map((item) => item.itemList)
            );
            this.subAppraiseJson = subAppraiseJson;
            let { dataList, pagination } = data;
            this.tabList = [...dataList];
            this.pagination.total = pagination.total;
            // 导出 url
            this.exportUrl = `${global.BasePath}structure/studySubject/downStudySubjectOwnBySchoolTimeIdAndWeek?schoolTimeId=${this.form.schoolTime.id}&searchName=${this.form.searchName}&week=${this.form.weekObj.week}&token=${this.$store.getters.token}`;
          }
          this.tabLoading = false;
        });
    },

    // 检索条件 改变
    filterSearch() {
      this.pagination.pageNo = 1;
      this.queryStudySubjectOwnBySchoolTimeIdAndWeek();
    },
    // 主题改变
    handleTitle() {
      this.filterSearch();
    },
    // 学期改变
    handleSchoolTime() {
      this.pagination.pageNo = 1;
      this.form.weekObj = { week: 0 };
      this.getSeveralWeekListBySchoolTImeId();
    },
    // 周次改变
    handleWeek() {
      this.filterSearch();
    },
    // 分页 - pageSize 改变
    handleSizeChange(pageSize) {
      this.pagination.pageSize = pageSize;
      this.queryStudySubjectOwnBySchoolTimeIdAndWeek();
    },
    // 分页 - currentPage 改变
    handleCurrentChange(pageNo) {
      this.pagination.pageNo = pageNo;
      this.queryStudySubjectOwnBySchoolTimeIdAndWeek();
    },
  },
};
</script>
<style lang="scss" scoped>
.study-subject-autonomy-detail {
  padding:12px;

  .el-row {
    border-bottom: 1px solid #e7eaec;
    padding-bottom: 10px;
    margin-bottom: 10px;
  }

  .el-table__body-wrapper {
    .delete-btn {
      color: #f56c6c;
    }
  }
}
</style>