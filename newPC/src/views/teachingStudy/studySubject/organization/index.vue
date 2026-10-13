<template>
  <div class="er-tong-yan-jiu-ting-ke-index">
    <el-row style="padding-bottom: 10px">
      <el-col :span="19">
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

        <el-button type="primary" size="medium" @click="gotoForm()"
          >创建</el-button
        >&nbsp;
      </el-col>
      <el-col :span="5">
        <el-input
          class="search-input"
          icon="el-icon-search"
          size="medium"
          placeholder="请输入课题"
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
      :height="maxH "
      :data="tabList"
      v-loading.body="tabLoading"
    >
      <el-table-column align="center" label="课题" show-overflow-tooltip>
        <template slot-scope="scope">
          <span class="link-type" @click="gotoDetail(scope.row)">
            {{ scope.row.subjectName || "--" }}
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="执教教师" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.classTeacherJson | filterTeacherJson }}
        </template>
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
      <el-table-column align="center" label="听课教师" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.listenList | filterTeacherJson }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-tag  size="mini" type="info" v-if="scope.row.releaseState == 0"
            >草稿</el-tag
          >
          <el-tag  size="mini" type="success"  v-else>已发布</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button
            size="small"
            type="text"
            :disabled="scope.row.releaseState == 1"
            @click="gotoForm(scope.row)"
            >编辑</el-button
          >
          <el-button
            class="delete-btn"
            size="small"
            type="text"
            @click="handleDelete(scope.row)"
            >删除</el-button
          >
        </template>
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
import { isShowByPermission } from "@/utils";
import { mapGetters } from "vuex";

/* components */

/* api */
import {
  getSchoolTimeAllListBySchoolId,
  getSeveralWeekListBySchoolTImeId,
  queryStudySubject,
  deleteStudySubject,
} from "@/api/teachingStudy/erTongYanJiuTingKe";

export default {
  name: "erTongYanJiuTingKeIndex",
  mixins: [mixin],
  components: {},
  computed: {
    ...mapGetters(["schoolInfo"]),
  },
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
  data() {
    return {
      // 学期列表
      schoolTimeAllList: [],
      // 周次列表
      weekList: [],
      // 是否正在加载数据 { Boolean }
      tabLoading: false,
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
    this.getSchoolTimeAllListBySchoolId();
  },
  methods: {
    isShowByPermission,

    // 根据学校id获取学期列表
    getSchoolTimeAllListBySchoolId() {
      this.tabLoading = true;
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
          this.tabLoading = false;
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
            this.queryStudySubject();
          }
        })
        .catch((msg) => {
          this.$message({
            message: msg,
            type: "error",
          });
        });
    },

    // pc端分页获取学校研究听课,week=0时代表全部周次
    queryStudySubject() {
      queryStudySubject({
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
            let { dataList, pagination } = data;
            dataList.forEach((item) => {
              let listenDepart = JSON.parse(item.listenDepartJson || "[]");
              let listenTeacher = JSON.parse(item.listenTeacherJson || "[]");
              item.listenList = JSON.stringify(
                listenDepart.concat(listenTeacher)
              );
            });
            this.tabList = [...dataList];
            this.pagination.total = pagination.total;
          }
        })
        .catch((msg) => {
          this.$message({
            message: msg,
            type: "error",
          });
        });
    },

    // 删除研究课听课
    deleteStudySubject(form) {
      deleteStudySubject(form)
        .then((res) => {
          let _res = res.data;
          if (_res.code != 200) return Promise.reject(_res.msg);
          else return _res.data;
        })
        .then((data) => {
          this.$message({
            message: "删除成功",
            type: "success",
          });
          this.queryStudySubject();
        })
        .catch((msg) => {
          this.$message({
            message: msg,
            type: "error",
          });
        });
    },

    // 检索条件 改变
    filterSearch() {
      this.pagination.pageNo = 1;
      this.queryStudySubject();
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
      this.queryStudySubject();
    },
    // 分页 - currentPage 改变
    handleCurrentChange(pageNo) {
      this.pagination.pageNo = pageNo;
      this.queryStudySubject();
    },
    // 点击*删除*
    handleDelete(item) {
      this.$confirm("确认要删除吗？", "删除", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "error",
        lockScroll: false,
      })
        .then(() => {
          let form = {
            studySubjectId: item.id,
          };
          this.deleteStudySubject(form);
        })
        .catch(() => {});
    },

    // 创建 / 编辑
    gotoForm(item) {
      const routeParams = {
        path: "organization/form",
      };
      if (item) routeParams.query = { studySubjectId: item.id };
      this.$router.push(routeParams);
    },
    // 详情页
    gotoDetail(item) {
      if (item.releaseState == 0) {
        this.gotoForm(item);
      } else {
        this.$router.push({
          path: "organization/detail/index",
          query: {
            studySubjectId: item.id,
          },
        });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.er-tong-yan-jiu-ting-ke-index {
  .el-table__body-wrapper {
    .delete-btn {
      color: #f56c6c;
    }
  }
}
</style>
