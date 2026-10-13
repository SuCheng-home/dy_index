<template>
  <div class="home-page-aside-middle">
    <div class="aside-content-wrapper">
      <div class="title">
        <span>工作提醒</span>
        <a class="title-right" @click="gotoWorkReminderIndex"
          ><i class="el-icon-more-outline"></i>&nbsp;更多</a
        >
      </div>
      <div class="content">
        <el-table
          style="width: 100%"
          size="medium"
          :show-header="false"
          :data="planContentList"
          v-show="planContentList && planContentList.length"
        >
          <el-table-column show-overflow-tooltip>
            <template slot-scope="scope">
              <span class="link-type" @click="handlePlan(scope.row)">
                <span style="color: #f56c6c; font-weight: bold"
                  >[ 今日工作日程 ]</span
                >
                {{ scope.row.content || "--" }}</span
              >
            </template>
          </el-table-column>
        </el-table>

        <el-table
          style="width: 100%"
          size="medium"
          :show-header="false"
          :data="tabList"
        >
          <el-table-column show-overflow-tooltip>
            <template slot-scope="scope">
              <span class="link-type" @click="gotoDetail(scope.row)">
                <span style="color: #e6a23c"
                  >[ {{ scope.row.moduleName || "--" }} ]</span
                >
                {{ scope.row.title || "--" }}</span
              >
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip align="right">
            <template slot-scope="scope">{{
              scope.row.createTime | filterDate
            }}</template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <el-dialog
      title="计划详情"
      top="25vh"
      width="45%"
      style="min-height: 500px"
      :visible.sync="dialogVisible"
    >
      <el-form label-width="140px">
        <el-form-item label="负责部门">{{ department || "--" }}</el-form-item>
        <el-form-item label="参与人">{{ principals || "--" }}</el-form-item>
        <el-form-item label="计划内容">{{ content || "--" }}</el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
/* utils */
import mixin from "@/mixins/windowResize";

/* api */
import {
  getBackLogNotList,
  getSelfDayPlanContentList,
} from "@/api/homePage/aside/middle/workReminder";

export default {
  name: "homePageAsideMiddle",
  mixins: [mixin],
  components: {},
  filters: {
    filterDate(val) {
      return val ? moment(val).format("YYYY-MM-DD HH:mm:ss") : "--";
    },
  },
  computed: {},
  data() {
    return {
      //  模态框
      dialogVisible: false,
      department: "",
      principals: "",
      content: "",
      // 工作计划列表
      planContentList: [],
      // 表格数据 { Array }
      tabList: [],
      // 请求表单
      form: {
        // 	模块code
        moduleCode: 0,
        // 	标题
        title: "",
      },
      // 分页
      pagination: {
        pageNo: 1,
        pageSize: 5,
        pageSizes: [10, 20, 30, 50],
        total: 0,
      },
    };
  },
  created() {
    this.getBackLogNotList();
    this.getSelfDayPlanContentList();
  },
  methods: {
    // 获得个人日工作计划内容列表
    getSelfDayPlanContentList() {
      getSelfDayPlanContentList({
        searchDate: this.$moment().format("YYYY-MM-DD"),
      })
        .then((res) => {
          let _res = res.data;
          if (_res.code != 200) return Promise.reject(_res.msg);
          else return _res.data;
        })
        .then((data) => {
          if (data && data.length) {
            this.planContentList = [data[0]];
          }
        });
    },

    // 根据用户id，模块code,主题查询待办
    getBackLogNotList() {
      this.tabLoading = true;
      getBackLogNotList({
        moduleCode: this.form.moduleCode,
        title: this.form.title,
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
            this.tabList = [...dataList];
            this.pagination.total = pagination.total;
          }
          this.tabLoading = false;
        })
        .catch((msg) => {
          this.tabLoading = false;
        });
    },

    // 计划详情
    handlePlan(item) {
      this.department = item.department;
      this.principals = item.principals;
      this.content = item.content;
      this.dialogVisible = true;
    },

    // 待办详情
    gotoDetail(item) {
      this.$router.push({
        path: item.pcUrl,
      });
    },

    // 工作提醒
    gotoWorkReminderIndex() {
      sessionStorage.removeItem("workReminderTabActiveName");
      this.$router.push({
        path: "/main/homePage/workReminder/index",
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.home-page-aside-middle {
  .title {
    padding-right: 40px;
  }
  .el-form {
    width: 100%;
    margin: 0 auto;
    overflow: auto;
    .el-form-item {
      margin-bottom: 0;
    }
    /deep/ .el-form-item__label {
      color: #909399;
    }
    /deep/ .el-form-item__content {
      padding-left: 18px;
    }
  }
}
</style>