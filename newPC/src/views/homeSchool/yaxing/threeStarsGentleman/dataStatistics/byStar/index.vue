<template>
  <div class="by-star">
    <el-row style="padding-bottom:10px">
      <el-col :span="24">
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
    </el-row>

    <el-table
      border
      fit
      stripe
      highlight-current-row
      style="width: 100%;"
      :height="nobottommaxH - 36 - 10 - 15"
      :data="tabList"
      v-loading.body="tabLoading"
    >
      <el-table-column align="center" label="评价星" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.name || '--' }}</template>
      </el-table-column>
      <el-table-column align="center" label="获得人数" show-overflow-tooltip>
        <template slot-scope="scope">
          <span class="link-type" @click="gotoStudentList(scope.row)">{{ scope.row.stuCount }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="获得人次" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.compeCount }}</template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import mixin from "@/mixins/windowResize";
import {
  getCurrentSchoolTimeBySchoolId,
  getSchoolStarCount,
} from "@/api/homeSchool/yaxing/threeStarsGentleman/dataStatistics/byStar/index";

export default {
  name: "byStar",
  mixins: [mixin],
  components: {},
  data() {
    return {
      // 是否正在加载数据 { Boolean }
      tabLoading: false,
      // 表格数据 { Array }
      tabList: [],
      // 请求表单
      form: {
        daterange: [],
      },
    };
  },
  created() {
    this.getCurrentSchoolTimeBySchoolId();
  },
  methods: {
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
          this.getSchoolStarCount();
        })
        .catch((msg) => {
          this.$message({
            message: msg,
            type: "error",
          });
        });
    },
    // 根据学校id,开始日期结束日期查询得星统计
    getSchoolStarCount() {
      getSchoolStarCount({
        startDate: this.form.daterange[0],
        endDate: this.form.daterange[1],
      })
        .then((res) => {
          let _res = res.data;
          if (_res.code != 200) return Promise.reject(_res.msg);
          else return _res.data;
        })
        .then((data) => {
          this.tabList = [...data];
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
      this.getSchoolStarCount();
    },
    // 日期范围改变
    handleDateRange() {
      this.filterSearch();
    },
    // 获得人数
    gotoStudentList(item) {
      this.$router.push({
        path: "byStar/studentList/index",
        query: {
          id: item.id,
          name: item.name,
          startDate: this.form.daterange[0],
          endDate: this.form.daterange[1],
        },
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.by-star {
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