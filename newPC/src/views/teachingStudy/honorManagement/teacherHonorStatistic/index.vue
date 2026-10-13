<template>
  <div class="teacher-honor-statistic">
    <div class="filter-wrapper">
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
          @change="filterSearch"
        ></el-date-picker>
      </div>
      <div class="filter-item">
        <el-select
          size="medium"
          placeholder="请选择"
          value-key="id"
          v-model="form.certTypeCode"
          @change="filterSearch"
        >
          <el-option label="全部证书类型" :value="''"></el-option>
          <el-option
            v-for="item in certTypeList"
            :key="item.id"
            :label="item.certTypeName"
            :value="item.id"
          ></el-option>
        </el-select>
      </div>
      <div class="filter-item">
        <el-select
          size="medium"
          placeholder="请选择"
          value-key="id"
          v-model="form.certLevelCode"
          @change="filterSearch"
        >
          <el-option label="全部证书级别" :value="''"></el-option>
          <el-option
            v-for="item in certLevelList"
            :key="item.id"
            :label="item.certLevelName"
            :value="item.id"
          ></el-option>
        </el-select>
      </div>
      <div class="filter-item">
        <el-select
          size="medium"
          placeholder="请选择"
          value-key="id"
          v-model="form.certAwardLLevelCode"
          @change="filterSearch"
        >
          <el-option label="全部获奖等级" :value="''"></el-option>
          <el-option
            v-for="item in awardLevelList"
            :key="item.id"
            :label="item.awardLevelName"
            :value="item.id"
          ></el-option>
        </el-select>
      </div>
      <div class="filter-item">
        <a :href="exportUrl"   v-if="tabList.length" target="_blank" download="examName">
          <el-button type="primary" size="medium">导出</el-button>
        </a>
      </div>
      <el-input
        class="search-input search-input--right"
        size="medium"
        placeholder="请输入教师姓名"
        icon="el-icon-search"
        clearable
        v-model="form.createUserName"
        @change="filterSearch"
      >
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
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
      <el-table-column align="center" label="教师姓名" show-overflow-tooltip>
        <template slot-scope="scope">{{
          scope.row.createUserName || "--"
        }}</template>
      </el-table-column>
      <el-table-column align="center" label="证书名称" show-overflow-tooltip>
        <template slot-scope="scope">
          <span
            class="link-type"
            @click="gotoTeacherHonorStatisticDetail(scope.row)"
            >{{ scope.row.certName || "--" }}</span
          >
        </template>
      </el-table-column>
      <el-table-column align="center" label="证书类型" show-overflow-tooltip>
        <template slot-scope="scope">{{
          scope.row.certTypeName || "--"
        }}</template>
      </el-table-column>
      <el-table-column align="center" label="证书级别" show-overflow-tooltip>
        <template slot-scope="scope">{{
          scope.row.certLevelName || "--"
        }}</template>
      </el-table-column>
      <el-table-column align="center" label="获奖等级" show-overflow-tooltip>
        <template slot-scope="scope">{{
          scope.row.certAwardLLevelName || "--"
        }}</template>
      </el-table-column>
      <el-table-column align="center" label="颁发日期" show-overflow-tooltip>
        <template slot-scope="scope">{{
          scope.row.issueDate || "--"
        }}</template>
      </el-table-column>
      <el-table-column align="center" label="颁发机构" show-overflow-tooltip>
        <template slot-scope="scope">{{
          scope.row.issueOrganizationName || "--"
        }}</template>
      </el-table-column>
      <el-table-column align="center" label="权重" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.weights || "--" }}</template>
      </el-table-column>
      <el-table-column align="center" label="内容" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.content || "--" }}</template>
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
import ImagePreviewer from "@/components/ImagePreviewer/ImagePreviewer.vue";
import {
  listBySchoolIdCertType,
  listBySchoolIdCertLevel,
  listBySchoolIdAwardLevel,
  statisticHonorByModelAndPage,
} from "@/api/teachingStudy/honorManagement/teacherHonorStatistic/index";

export default {
  name: "teacherHonorStatistic",
  mixins: [mixin],
  components: {
    ImagePreviewer,
  },
  data() {
    return {
      // table 是否正在加载
      tabLoading: false,
      // 证书类型列表
      certTypeList: [],
      // 证书级别列表
      certLevelList: [],
      // 获奖等级列表
      awardLevelList: [],
      // 表格列表
      tabList: [],
      // 请求表单
      form: {
        // 证书类型
        certTypeCode: "",
        // 证书级别
        certLevelCode: "",
        // 获奖等级
        certAwardLLevelCode: "",
        // 老师姓名
        createUserName: "",
        dateRange: [
          this.$moment().date(1).format("YYYY-MM-DD"),
          this.$moment().format("YYYY-MM-DD"),
        ],
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
    this.listBySchoolIdCertType();
    this.listBySchoolIdCertLevel();
    this.listBySchoolIdAwardLevel();
    this.statisticHonorByModelAndPage();
  },
  methods: {
    // 列表 证书类型(全部)
    listBySchoolIdCertType() {
      listBySchoolIdCertType()
        .then((res) => {
          let _res = res.data;
          if (_res.code != 200) return Promise.reject(_res.msg);
          else return _res.data;
        })
        .then((data) => {
          this.certTypeList = [...data];
        })
        .catch((msg) => {
          this.$message({
            message: msg,
            type: "error",
          });
        });
    },
    // 列表 证书级别(全部)
    listBySchoolIdCertLevel() {
      listBySchoolIdCertLevel()
        .then((res) => {
          let _res = res.data;
          if (_res.code != 200) return Promise.reject(_res.msg);
          else return _res.data;
        })
        .then((data) => {
          this.certLevelList = [...data];
        })
        .catch((msg) => {
          this.$message({
            message: msg,
            type: "error",
          });
        });
    },
    // 列表 获奖等级(全部)
    listBySchoolIdAwardLevel() {
      listBySchoolIdAwardLevel()
        .then((res) => {
          let _res = res.data;
          if (_res.code != 200) return Promise.reject(_res.msg);
          else return _res.data;
        })
        .then((data) => {
          this.awardLevelList = [...data];
        })
        .catch((msg) => {
          this.$message({
            message: msg,
            type: "error",
          });
        });
    },
    // 列表 教师荣誉(统计)
    statisticHonorByModelAndPage() {
      let startDate = this.form.dateRange ? this.form.dateRange[0] : "";
      let endDate = this.form.dateRange ? this.form.dateRange[1] : "";
      statisticHonorByModelAndPage({
        startDate,
        endDate,
        certTypeCode: this.form.certTypeCode || "",
        certLevelCode: this.form.certLevelCode || "",
        certAwardLLevelCode: this.form.certAwardLLevelCode || "",
        createUserName: this.form.createUserName,
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
          this.exportUrl = `${global.BasePath}structure/teacherHonorRecord/exportTeacherHonorList?certAwardLLevelCode=${this.form.certAwardLLevelCode}&certLevelCode=${this.form.certLevelCode}&certTypeCode=${this.form.certTypeCode}&createUserName=${this.form.createUserName}&startDate=${startDate}&endDate=${endDate}&pageNo=${this.pagination.currentPage}&pageSize=${this.pagination.pageSize}&token=${this.$store.getters.token}`;
        })
        .catch((msg) => {
          this.$message({
            message: msg,
            type: "error",
          });
        });
    },
    // 修改 日期范围 / 标题
    filterSearch() {
      this.pagination.currentPage = 1;
      this.statisticHonorByModelAndPage();
    },
    // 分页 - pageSize 改变
    handleSizeChange(pageSize) {
      this.pagination.pageSize = pageSize;
      this.statisticHonorByModelAndPage();
    },
    // 分页 - currentPage 改变
    handleCurrentChange(currentPage) {
      this.pagination.currentPage = currentPage;
      this.statisticHonorByModelAndPage();
    },
    // 详情页
    gotoTeacherHonorStatisticDetail(info) {
      this.$router.push({
        path: "detail",
        query: {
          id: info.id,
        },
      });
    },
    getViewPic(photoList) {
      if (photoList) {
        return photoList.map((item) => ({ src: item.fileUrl }));
      }
      return [];
    },
  },
};
</script>
<style lang="scss" scoped>
.teacher-honor-statistic {
  padding:12px;
  overflow: hidden;
  .filter-wrapper {
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
      .el-select {
        width: 135px;
      }
    }
  }
  .el-pagination {
    margin-top: 20px;
  }
}
</style>
