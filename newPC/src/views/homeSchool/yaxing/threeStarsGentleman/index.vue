<template>
  <div class="three-stars-gentleman">
    <el-row style="padding-bottom: 10px">
      <el-col :span="19">
        <el-button type="primary" size="medium" @click="gotoForm()"
          >创建评比活动</el-button
        >
        <el-button type="primary" size="medium" @click="gotoStarTypeSettings"
          >评比星设置</el-button
        >
        <el-button type="primary" size="medium" @click="gotoDataStatistics"
          >数据统计</el-button
        >
      </el-col>
      <el-col :span="5">
        <el-input
          class="search-input"
          icon="el-icon-search"
          size="medium"
          placeholder="请输入主题"
          clearable
          v-model.trim="form.title"
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
      :height="maxH"
      :data="tabList"
      v-loading.body="tabLoading"
    >
      <el-table-column align="center" label="主题" show-overflow-tooltip>
        <template slot-scope="scope">
          <span class="link-type" @click="gotoDetail(scope.row)">{{
            scope.row.title || "--"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="评比日期范围"
        show-overflow-tooltip
      >
        <template slot-scope="scope"
          >{{ scope.row.startDate }} 至 {{ scope.row.endDate }}</template
        >
      </el-table-column>
      <el-table-column align="center" label="评比星" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.starName || "--" }}</template>
      </el-table-column>
      <el-table-column align="center" label="状态" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-tag  size="mini" type="info"  v-if="scope.row.state == 1"
            >草稿</el-tag
          >
          <el-tag  size="mini"  v-if="scope.row.state == 2 && isWKS(scope.row)"
            >未开始</el-tag
          >
          <el-tag  size="mini"  v-if="scope.row.state == 2 && isJXZ(scope.row)"
            >进行中</el-tag
          >
          <el-tag  size="mini"  v-if="scope.row.state == 2 && isYJS(scope.row)"
            >已结束</el-tag
          >
          <el-tag  size="mini" type="success"  v-if="scope.row.state == 3"
            >已公示</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="215">
        <template slot-scope="scope">
          <el-button size="small" type="text" @click="gotoForm(scope.row)"
            >编辑</el-button
          >
          <el-button
            class="text-danger"
            size="small"
            type="text"
            @click="handleDelete(scope.row)"
            >删除</el-button
          >
          <el-button
            size="small"
            type="text"
            v-if="scope.row.state == 1"
            @click="handleRelease(scope.row)"
            >发布</el-button
          >
          <el-button
            size="small"
            type="text"
            v-if="scope.row.state == 2"
            @click="handlePublicity(scope.row)"
            >公示</el-button
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
import mixin from "@/mixins/windowResize";
import {
  getThreeStarBatchList,
  delThreeStarBatch,
  updateThreeStarBatch,
} from "@/api/homeSchool/yaxing/threeStarsGentleman/index";

export default {
  name: "threeStarsGentleman",
  mixins: [mixin],
  components: {},
  computed: {
    // 是否未开始
    isWKS() {
      return function (item) {
        return this.$moment() < this.$moment(item.startDate);
      };
    },
    // 是否进行中
    isJXZ() {
      return function (item) {
        return (
          this.$moment() >= this.$moment(item.startDate) &&
          this.$moment() <= this.$moment(item.endDate + " 23:59:59")
        );
      };
    },
    // 是否已结束
    isYJS() {
      return function (item) {
        return this.$moment() > this.$moment(item.endDate + " 23:59:59");
      };
    },
  },
  data() {
    return {
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
        // 状态 { Number } 0(全部) | 1(草稿) |  2(发布) | 3(公示)
        state: 0,
        title: "",
      },
    };
  },
  created() {
    this.getThreeStarBatchList();
  },
  methods: {
    // 根据学校id,标题查询批次列表
    getThreeStarBatchList() {
      getThreeStarBatchList({
        state: this.form.state,
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
    // 修改批次
    updateThreeStarBatch(item, state, message = "修改成功") {
      updateThreeStarBatch({
        id: item.id,
        state,
      })
        .then((res) => {
          let _res = res.data;
          if (_res.code != 200) return Promise.reject(_res.msg);
          else return _res.data;
        })
        .then((data) => {
          this.$message({
            message,
            type: "success",
          });
          this.filterSearch();
        })
        .catch((msg) => {
          this.$message({
            message: msg,
            type: "error",
          });
        });
    },
    // 删除批次记录
    delThreeStarBatch(item) {
      delThreeStarBatch({
        batchId: item.id,
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
          this.filterSearch();
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
      this.getThreeStarBatchList();
    },
    // 主题改变
    handleTitle() {
      this.filterSearch();
    },
    // 分页 - pageSize 改变
    handleSizeChange(pageSize) {
      this.pagination.pageSize = pageSize;
      this.getThreeStarBatchList();
    },
    // 分页 - currentPage 改变
    handleCurrentChange(pageNo) {
      this.pagination.pageNo = pageNo;
      this.getThreeStarBatchList();
    },
    // 点击*删除*
    handleDelete(item) {
      this.$confirm("确认要删除吗？", "删除", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        lockScroll: false,
      })
        .then(() => {
          this.delThreeStarBatch(item);
        })
        .catch(() => {});
    },
    // 点击*发布*
    handleRelease(item) {
      this.$confirm("确认要发布吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        lockScroll: false,
      })
        .then(() => {
          this.updateThreeStarBatch(item, 2, "发布成功");
        })
        .catch(() => {});
    },
    // 点击*公示*
    handlePublicity(item) {
      this.$confirm("确认要公示吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        lockScroll: false,
      })
        .then(() => {
          this.updateThreeStarBatch(item, 3, "公示成功");
        })
        .catch(() => {});
    },
    // 创建 / 编辑 评比活动
    gotoForm(item) {
      const routeParams = {
        path: "form",
      };
      if (item) routeParams.query = { id: item.id };
      this.$router.push(routeParams);
    },
    // 详情页
    gotoDetail(item) {
      this.$router.push({
        path: "detail/index",
        query: {
          id: item.id,
        },
      });
    },
    // 评比星设置
    gotoStarTypeSettings() {
      this.$router.push({
        path: "starTypeSettings/index",
      });
    },
    // 数据统计
    gotoDataStatistics() {
      this.$router.push({
        path: "dataStatistics/index",
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.three-stars-gentleman {
  padding:12px;

  tbody {
    .text-danger {
      /deep/ span {
        color: #f56c6c;
      }
    }
  }
}
</style>
