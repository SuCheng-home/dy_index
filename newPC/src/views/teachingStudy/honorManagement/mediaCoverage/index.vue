<template>
  <div class="media-coverage">
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
          v-model="form.reportLevelCode"
          @change="filterSearch"
        >
          <el-option label="全部报道级别" value></el-option>
          <el-option
            :key="idx"
            v-for="(level, idx) in reportLevelList"
            :label="level.value"
            :value="level.code"
          ></el-option>
        </el-select>
      </div>
      <div class="filter-item">
        <a :href="exportUrl"  v-if="tabList.length" target="_blank" download="examName">
          <el-button type="primary" size="medium">导出</el-button>
        </a>
      </div>
         <div class="filter-item">
        <el-button type="primary" size="medium" @click="gotoForm()"
          >新增</el-button
        >
      </div>
      <el-input
        class="search-input search-input--right"
        size="medium"
        placeholder="请输入标题"
        icon="el-icon-search"
        clearable
        v-model="form.reportTitle"
        @change="filterSearch"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="filterSearch"
        ></el-button>
      </el-input>
    </div>
    <el-table
      border
      fit
      stripe
      highlight-current-row
      style="width: 100%"
      :height="maxH"
      :data="tabList"
      v-loading.body="tabLoading"
    >
      <el-table-column align="center" label="标题" show-overflow-tooltip>
        <template slot-scope="scope">
          <span class="link-type" @click="gotoDetail(scope.row)">{{
            scope.row.reportTitle || "--"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="媒体类型" show-overflow-tooltip>
        <template slot-scope="scope">{{
          scope.row.mediaType || "--"
        }}</template>
      </el-table-column>
      <el-table-column align="center" label="报道级别" show-overflow-tooltip>
        <template slot-scope="scope">{{
          scope.row.reportLevelName || "--"
        }}</template>
      </el-table-column>
      <el-table-column align="center" label="报道日期" show-overflow-tooltip>
        <template slot-scope="scope">{{
          scope.row.reportDate || "--"
        }}</template>
      </el-table-column>
      <el-table-column align="center" label="报道内容" show-overflow-tooltip>
        <template slot-scope="scope">{{
          scope.row.reportContent || "--"
        }}</template>
      </el-table-column>
      <el-table-column align="center" label="媒体名称" show-overflow-tooltip>
        <template slot-scope="scope">{{
          scope.row.mediaName || "--"
        }}</template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button size="small" type="text" @click="gotoForm(scope.row)"
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
      layout="total, sizes, prev, pager, next, jumper"
      :current-page.sync="pagination.currentPage"
      :page-sizes="pagination.pageSizes"
      :page-size="pagination.pageSize"
      :total="pagination.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    ></el-pagination>
  </div>
</template>

<script>
import mixin from "@/mixins/windowResize";
import { mapGetters } from "vuex";
import {
  findSchoolDicsByCode,
  listByModelAndPage,
  del,
} from "@/api/teachingStudy/honorManagement/mediaCoverage/index";

export default {
  name: "mediaCoverage",
  mixins: [mixin],
  computed: {
    ...mapGetters(["schoolInfo"]),
  },
  data() {
    return {
      // 报道级别列表
      reportLevelList: [],
      // 导出链接
      exportUrl: "",
      // table 是否正在加载
      tabLoading: false,
      // 表格列表
      tabList: [],
      // 分页
      pagination: {
        currentPage: 1,
        pageSizes: [10, 20, 30, 50],
        pageSize: 20,
        total: 0,
      },
      // 请求表单
      form: {
        // 报道标题
        reportTitle: "",
        // 报道级别
        reportLevelCode: "",
        // 日期范围
        dateRange: [
          this.$moment().date(1).format("YYYY-MM-DD"),
          this.$moment().format("YYYY-MM-DD"),
        ],
      },
    };
  },
  created() {
    this.getReportLevel();
    this.listByModelAndPage();
  },
  methods: {
    // 报道级别字典
    getReportLevel() {
      findSchoolDicsByCode({
        dicCode: "reportLevel",
        schoolId: this.schoolInfo.id,
      })
        .then((res) => {
          let _res = res.data;
          if (_res.code != 200) return Promise.reject(_res.msg);
          else return _res.data;
        })
        .then((data) => {
          this.reportLevelList = [...data];
        });
    },
    // 列表 媒体报道
    listByModelAndPage() {
      let startDate = this.form.dateRange ? this.form.dateRange[0] : "";
      let endDate = this.form.dateRange ? this.form.dateRange[1] : "";
      listByModelAndPage({
        startDate,
        endDate,
        reportTitle: this.form.reportTitle,
        reportLevelCode: this.form.reportLevelCode,
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
          this.exportUrl = `${global.BasePath}structure/mediaReport/exportMediaReportList?startDate=${startDate}&endDate=${endDate}&reportTitle=${this.form.reportTitle}&reportLevelCode=${this.form.reportLevelCode}&token=${this.$store.getters.token}`;
        })
        .catch((msg) => {
          this.$message({
            message: msg,
            type: "error",
          });
        });
    },
    // 修改 日期范围 / 报道等级 / 标题
    filterSearch() {
      this.pagination.currentPage = 1;
      this.listByModelAndPage();
    },
    // 分页 - pageSize 改变
    handleSizeChange(pageSize) {
      this.pagination.pageSize = pageSize;
      this.listByModelAndPage();
    },
    // 分页 - currentPage 改变
    handleCurrentChange(currentPage) {
      this.pagination.currentPage = currentPage;
      this.listByModelAndPage();
    },
    // 详情
    gotoDetail(info) {
      this.$router.push({
        path: "detail",
        query: {
          id: info.id,
        },
      });
    },
    // 新增/编辑
    gotoForm(info) {
      const routeParams = {
        path: "form",
      };
      if (info) routeParams.query = { id: info.id };
      this.$router.push(routeParams);
    },
    // 删除
    handleDelete(item) {
      this.$confirm("确认要删除吗？", "删除", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        lockScroll: false,
      }).then(() => {
        this.del(item);
      });
    },
    del(item) {
      del({
        id: item.id,
      })
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
          this.listByModelAndPage();
        })
        .catch((msg) => {
          this.$message({
            message: msg,
            type: "error",
          });
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.media-coverage {
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
      .el-select {
        width: 165px;
      }
    }
  }
  .el-pagination {
    margin-top: 20px;
  }
  .el-table__body-wrapper {
    .delete-btn {
      color: #f56c6c;
    }
  }
}
</style>
