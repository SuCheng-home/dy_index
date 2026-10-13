<template>
  <div class="student-list">
    <el-row style="padding-bottom:10px">
      <el-col :span="19">
        <el-button @click="$router.back()" size="medium">返回</el-button>
      </el-col>
      <el-col :span="5">
        <el-input
          class="search-input"
          icon="el-icon-search"
          size="medium"
          placeholder="请输入学生姓名"
          clearable
          v-model.trim="form.studentName"
          @change="handleStudentName"
        >
          <el-button slot="append" icon="el-icon-search" @click="handleStudentName"></el-button>
        </el-input>
      </el-col>
    </el-row>
    <el-row style="padding-bottom:10px; text-align: center; color: #303133; font-size: 24px;">
      <el-col :span="24">{{name}}获得明细</el-col>
    </el-row>
    <el-table
      border
      fit
      stripe
      highlight-current-row
      style="width: 100%;"
      :height="maxH - 37"
      :data="tabList"
      v-loading.body="tabLoading"
    >
      <el-table-column align="center" label="学生姓名" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.studentName || '--' }}</template>
      </el-table-column>
      <el-table-column align="center" label="所在班级" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.className || '--' }}</template>
      </el-table-column>
      <el-table-column align="center" label="获得次数" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.compeCount || '--' }}</template>
      </el-table-column>
    </el-table>

    <el-pagination
      style="margin-top: 20px;"
      layout="total, sizes, prev, pager, next, jumper"
      :current-page.sync="pagination.pageNo"
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
import { getSchoolStarCountDetail } from "@/api/homeSchool/yaxing/threeStarsGentleman/dataStatistics/byStar/studentList/index";

export default {
  name: "studentList",
  mixins: [mixin],
  components: {},
  data() {
    return {
      // 是否正在加载数据 { Boolean }
      tabLoading: false,
      // 评比星名称
      name: this.$route.query.name,
      // 表格数据 { Array }
      tabList: [],
      // 分页
      pagination: {
        pageNo: 1,
        pageSizes: [10, 20, 30, 50],
        pageSize: 20,
        total: 0,
      },
      // 请求表单
      form: {
        // 评比星id
        id: this.$route.query.id,
        // 开始日期
        startDate: this.$route.query.startDate,
        // 结束日期
        endDate: this.$route.query.endDate,
        studentName: "",
      },
    };
  },
  created() {
    this.getSchoolStarCountDetail();
  },
  methods: {
    // 根据学校id,开始日期结束日期查询得星统计详情
    getSchoolStarCountDetail() {
      getSchoolStarCountDetail({
        starId: this.form.id,
        studentName: this.form.studentName,
        startDate: this.form.startDate,
        endDate: this.form.endDate,
        pageNo: this.pagination.pageNo,
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
      this.getSchoolStarCountDetail();
    },
    // 学生姓名改变
    handleStudentName() {
      this.filterSearch();
    },
    // 分页 - pageSize 改变
    handleSizeChange(pageSize) {
      this.pagination.pageSize = pageSize;
      this.getSchoolStarCountDetail();
    },
    // 分页 - currentPage 改变
    handleCurrentChange(pageNo) {
      this.pagination.pageNo = pageNo;
      this.getSchoolStarCountDetail();
    },
  },
};
</script>
<style lang="scss" scoped>
.student-list {
  padding: 12px;
}
</style>