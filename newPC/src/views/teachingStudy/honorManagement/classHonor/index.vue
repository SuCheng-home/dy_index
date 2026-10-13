<template>
  <div class="class-honor">
    <div class="filter-wrapper">
      <div class="filter-item">
        <el-select
          class="semester"
          size="medium"
          placeholder="请选择"
          value-key="id"
          v-model="form.schoolTerm"
          @change="handleTermChange"
        >
          <el-option
            v-for="(item, idx) in schoolTermList"
            :key="idx"
            :label="item.schoolTimeName"
            :value="item"
          ></el-option>
        </el-select>
      </div>
      <div class="filter-item">
        <el-date-picker
          size="medium"
          type="daterange" class="mywidthdaterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          :clearable="false"
          v-model="form.dateRange"
          @change="handleDateRangeChange"
        ></el-date-picker>
      </div>
      <div class="filter-item">
        <el-select
          size="medium"
          placeholder="请选择"
          v-model="form.gradeId"
          @change="handleGradeChange"
        >
          <el-option label="全部年级" :value="''"></el-option>
          <el-option
            v-for="(item, idx) in gradeList"
            :key="idx"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </div>
      <div class="filter-item">
        <el-select
          size="medium"
          placeholder="请选择"
          v-model="form.classId"
          @change="handleClassChange"
        >
          <el-option label="全部班级" :value="''"></el-option>
          <el-option
            v-for="(item, idx) in classList"
            :key="idx"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </div>
      <div class="filter-item">
        <el-select
          size="medium"
          placeholder="请选择"
          v-model="form.certificateLevelCode"
          @change="handleCertificateLevelChange"
        >
          <el-option label="全部证书级别" :value="''"></el-option>
          <el-option
            v-for="(item, idx) in certificateLevel"
            :key="idx"
            :label="item.value"
            :value="item.code"
          ></el-option>
        </el-select>
      </div>
      <div class="filter-item">
        <a :href="exportUrl" target="_blank" download="examName" v-if="tabList.length">
          <el-button type="primary" size="medium">导出</el-button>
        </a>
      </div>
    </div>
    <el-table
      border
      stripe
      highlight-current-row
      style="width: 100%"
      :height="maxH"
      :data="tabList"
      v-loading.body="tabLoading"
    >
      <el-table-column align="center" label="班级" show-overflow-tooltip>
        <template slot-scope="scope">{{
          scope.row.className || "--"
        }}</template>
      </el-table-column>
      <el-table-column align="center" label="证书名称" show-overflow-tooltip>
        <template slot-scope="scope">{{
          scope.row.certificateName || "--"
        }}</template>
      </el-table-column>
      <el-table-column align="center" label="证书级别" show-overflow-tooltip>
        <template slot-scope="scope">{{
          scope.row.certificateLevelName || "--"
        }}</template>
      </el-table-column>
      <el-table-column align="center" label="颁发时间" show-overflow-tooltip>
        <template slot-scope="scope">{{
          scope.row.issueTime || "--"
        }}</template>
      </el-table-column>
      <el-table-column align="center" label="颁发机构" show-overflow-tooltip>
        <template slot-scope="scope">{{
          scope.row.issueGroupName || "--"
        }}</template>
      </el-table-column>
      <el-table-column align="center" label="证书图片" show-overflow-tooltip>
        <template slot-scope="scope">
          <div
            style="color: #409eff"
            v-if="scope.row.photoList && scope.row.photoList.length"
          >
            <image-previewer
              :images="getViewPic(scope.row.photoList)"
              tag="img"
              text="查看图片"
            ></image-previewer>
          </div>
          <div v-else>--</div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page.sync="pagination.currentPage"
      :page-sizes="pagination.pageSizes"
      :page-size="pagination.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pagination.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    ></el-pagination>
  </div>
</template>

<script>
import mixin from "@/mixins/windowResize";
import { mapGetters } from "vuex";
import ImagePreviewer from "@/components/ImagePreviewer/ImagePreviewer.vue";
import {
  findSchoolDicsByCode,
  getSchoolTimeAllList,
  getGradeByTermId,
  getClassByGradeId,
  statisticsClassHonorListByModel,
} from "@/api/teachingStudy/honorManagement/classhonor/index";

export default {
  name: "classHonor",
  mixins: [mixin],
  components: {
    ImagePreviewer,
  },
  computed: {
    ...mapGetters(["schoolInfo"]),
  },
  data() {
    return {
      // table 是否正在加载
      tabLoading: false,
      // 学期列表
      schoolTermList: [],
      // 年级列表
      gradeList: [],
      // 班级列表
      classList: [],
      // 证书级别列表
      certificateLevel: [],
      // 表格列表
      tabList: [],
      // 请求表单
      form: {
        // 学期id
        schoolTerm: {},
        // 年级id
        gradeId: "",
        // 班级id
        classId: "",
        // 证书级别
        certificateLevelCode: "",
        dateRange: ["", ""],
      },
      // 分页
      pagination: {
        currentPage: 1,
        pageSizes: [10, 20, 30, 50],
        pageSize: 20,
        total: 0,
      },
    };
  },
  created() {
    this.findSchoolDicsByCode();
    this.getSchoolTimeAllList();
  },
  methods: {
    findSchoolDicsByCode() {
      findSchoolDicsByCode({
        dicCode: "certificate_level",
        schoolId: this.schoolInfo.id,
      })
        .then((res) => {
          let _res = res.data;
          if (_res.code != 200) return Promise.reject(_res.msg);
          else return _res.data;
        })
        .then((data) => {
          this.certificateLevel = [...data];
        })
        .catch((msg) => {
          this.$message({
            message: msg,
            type: "error",
          });
        });
    },
    // 查询学校所有学期列表
    getSchoolTimeAllList() {
      getSchoolTimeAllList()
        .then((res) => {
          let _res = res.data;
          if (_res.code != 200) return Promise.reject(_res.msg);
          else return _res.data;
        })
        .then((data) => {
          this.schoolTermList = [...data];
          this.form.schoolTerm = this.schoolTermList.find(
            (term) => term.isCurrent == 1
          );
          this.setDateRange();
          this.statisticsClassHonorListByModel();
          this.getGradeByTermId();
        })
        .catch((msg) => {
          this.$message({
            message: msg,
            type: "error",
          });
        });
    },
    // 根据学校id和学期id获取年级列表
    getGradeByTermId() {
      getGradeByTermId({
        termId: this.form.schoolTerm.id,
        schoolId: this.schoolInfo.id,
      })
        .then((res) => {
          let _res = res.data;
          if (_res.code != 200) return Promise.reject(_res.msg);
          else return _res.data;
        })
        .then((data) => {
          this.gradeList = [...data];
          this.getClassByGradeId();
        })
        .catch((msg) => {
          this.$message({
            message: msg,
            type: "error",
          });
        });
    },
    // 根据学校id，学期id，年级id获取班级列表
    getClassByGradeId() {
      if (!this.form.gradeId) {
        this.classList = [];
        this.form.classId = "";
        return;
      }
      getClassByGradeId({
        termId: this.form.schoolTerm.id,
        gradeId: this.form.gradeId,
        schoolId: this.schoolInfo.id,
      })
        .then((res) => {
          let _res = res.data;
          if (_res.code != 200) return Promise.reject(_res.msg);
          else return _res.data;
        })
        .then((data) => {
          this.classList = [...data];
        })
        .catch((msg) => {
          this.$message({
            message: msg,
            type: "error",
          });
        });
    },
    // 列表 教师荣誉(统计)
    statisticsClassHonorListByModel() {
      let startDate = this.form.dateRange ? this.form.dateRange[0] : "";
      let endDate = this.form.dateRange ? this.form.dateRange[1] : "";
      statisticsClassHonorListByModel({
        startDate,
        endDate,
        gradeId: this.form.gradeId,
        classId: this.form.classId,
        certificateLevelCode: this.form.certificateLevelCode,
        pageNo: this.pagination.currentPage,
        pageSize: this.pagination.pageSize,
      })
        .then((res) => {
          let _res = res.data;
          if (_res.code != 200) return Promise.reject(_res.msg);
          else return _res.data;
        })
        .then((data) => {
          let { dataList, pagination } = data;
          this.tabList = [...dataList];
          this.pagination.total = pagination.total;
          this.exportUrl = `${global.BasePath}structure/classHonor/exportStatisticsClassHonorList?gradeId=${this.form.gradeId}&classId=${this.form.classId}&certificateLevelCode=${this.form.certificateLevelCode}&startDate=${startDate}&endDate=${endDate}&pageNo=${this.pagination.currentPage}&pageSize=${this.pagination.pageSize}&token=${this.$store.getters.token}`;
        })
        .catch((msg) => {
          this.$message({
            message: msg,
            type: "error",
          });
        });
    },
    // 检索条件改变
    filterSearch() {
      this.pagination.currentPage = 1;
      this.statisticsClassHonorListByModel();
    },
    // 学期改变
    handleTermChange() {
      this.setDateRange();
      this.form.gradeId = "";
      this.gradeList = [];
      this.form.classId = "";
      this.classList = [];
      this.filterSearch();
      this.getGradeByTermId();
    },
    // 年级改变
    handleGradeChange() {
      this.form.classId = "";
      this.classList = [];
      this.filterSearch();
      this.getClassByGradeId();
    },
    // 班级改变
    handleClassChange() {
      this.filterSearch();
    },
    // 日期范围改变
    handleDateRangeChange() {
      this.filterSearch();
    },
    // 证书级别改变
    handleCertificateLevelChange() {
      this.filterSearch();
    },
    // 分页 - pageSize 改变
    handleSizeChange(pageSize) {
      this.pagination.pageSize = pageSize;
      this.statisticsClassHonorListByModel();
    },
    // 分页 - currentPage 改变
    handleCurrentChange(currentPage) {
      this.pagination.currentPage = currentPage;
      this.statisticsClassHonorListByModel();
    },
    // 设置日期范围
    setDateRange() {
      this.form.dateRange = [
        this.$moment(this.form.schoolTerm.startDate).format("YYYY-MM-DD"),
        this.$moment(this.form.schoolTerm.endDate).format("YYYY-MM-DD"),
      ];
    },
    getViewPic(photoList) {
      if (photoList) {
        return photoList.map((item) => ({ src: item.photoUrl }));
      }
      return [];
    },
  },
};
</script>
<style lang="scss" scoped>
.class-honor {
  padding:12px;
  overflow: hidden;
  .filter-wrapper {
    position: relative;
    font-size: 0;
    .filter-item {
      display: inline-block;
      font-size: 14px;
      margin-right: 5px;
      margin-bottom: 10px;
      .el-date-editor,
      .el-input__inner {
        width: 240px;
      }
      .el-select:not(.semester) {
        width: 130px;
      }
    }
    .filter-right {
      position: absolute;
      top: 0;
      right: 0;
    }
  }
  .el-pagination {
    margin-top: 20px;
  }
}
</style>
