<template>
  <div class="by-student">
    <el-row style="padding-bottom:10px">
      <el-col :span="19">
        <el-button @click="$router.back()" size="medium">返回</el-button>
        <el-date-picker
          size="medium"
          type="daterange" class="mywidthdaterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          :clearable="false"
          v-model="form.daterange"
          @change="handleDateRange"
        ></el-date-picker>
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

    <el-table
      border
      fit
      stripe
      highlight-current-row
      style="width: 100%;"
      :height="maxH - 36 - 10 - 15 - 10"
      :data="tabList"
      v-loading.body="tabLoading"
    >
      <el-table-column align="center" label="学号" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.studentNo || '--' }}</template>
      </el-table-column>
      <el-table-column align="center" label="学生姓名" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.studentName || '--' }}</template>
      </el-table-column>
      <el-table-column align="center" label="所在班级" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.className || '--' }}</template>
      </el-table-column>
      <el-table-column
        align="center"
        show-overflow-tooltip
        :key="idx"
        :label="star.name"
        v-for="(star, idx) in starList"
      >
        <template slot-scope="scope">{{ scope.row.starStrList[idx] || '0' }}</template>
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
import {
  getCurrentSchoolTimeBySchoolId,
  getStuStarCountDetail,
  getThreeStarGroupListAll,
} from "@/api/homeSchool/yaxing/threeStarsGentleman/dataStatistics/byStudent/index";

export default {
  name: "byStudent",
  mixins: [mixin],
  components: {},
  data() {
    return {
      // 是否正在加载数据 { Boolean }
      tabLoading: false,
      // 评比星列表
      starList: [],
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
        studentName: "",
        daterange: [],
      },
    };
  },
  created() {
    this.getThreeStarGroupListAll();
  },
  methods: {
    // 根据学校id查询所有二级分组
    getThreeStarGroupListAll() {
      getThreeStarGroupListAll()
        .then((res) => {
          let _res = res.data;
          if (_res.code != 200) return Promise.reject(_res.msg);
          else return _res.data;
        })
        .then((data) => {
          this.starList = [...data];
          this.getCurrentSchoolTimeBySchoolId();
        })
        .catch((msg) => {
          this.$message({
            message: msg,
            type: "error",
          });
        });
    },
    // 获取当前学期
    getCurrentSchoolTimeBySchoolId() {
      getCurrentSchoolTimeBySchoolId()
        .then((res) => {
          let _res = res.data;
          if (_res.code != 200) return Promise.reject(_res.msg);
          else return _res.data;
        })
        .then((data) => {
          this.form.daterange = [
            this.$moment(data.startDate).format("YYYY-MM-DD"),
            this.$moment().format("YYYY-MM-DD"),
          ];
          this.getStuStarCountDetail();
        })
        .catch((msg) => {
          this.$message({
            message: msg,
            type: "error",
          });
        });
    },
    // 根据学校id,得得id,开始日期结束日期查询得星统计详情
    getStuStarCountDetail() {
      getStuStarCountDetail({
        studentName: this.form.studentName,
        startDate: this.form.daterange[0],
        endDate: this.form.daterange[1],
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
      this.getStuStarCountDetail();
    },
    // 学生姓名改变
    handleStudentName() {
      this.filterSearch();
    },
    // 日期范围改变
    handleDateRange() {
      this.filterSearch();
    },
    // 分页 - pageSize 改变
    handleSizeChange(pageSize) {
      this.pagination.pageSize = pageSize;
      this.getStuStarCountDetail();
    },
    // 分页 - currentPage 改变
    handleCurrentChange(pageNo) {
      this.pagination.pageNo = pageNo;
      this.getStuStarCountDetail();
    },
  },
};
</script>
<style lang="scss" scoped>
.by-student {
  .filter-wrapper {
    margin-bottom: 10px;
  }
  tbody {
    .text-danger {
      /deep/ span {
        color: #f56c6c;
      }
    }
  }
}
</style>