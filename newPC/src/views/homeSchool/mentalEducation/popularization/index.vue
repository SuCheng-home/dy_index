<template>
  <div class="mental-education-publicity-index">
    <el-row style="padding-bottom: 10px">
      <el-col :span="19">
        <el-button
          type="primary"
          size="medium"
          v-if="isShowByPermission('/heartEdu/mangerInit')"
          @click="gotoForm()"
          >新增心育科普</el-button
        >&nbsp;
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
      :height="nobottommaxH - 25"
      :data="tabList"
      v-loading.body="tabLoading"
    >
      <el-table-column align="center" label="主题" show-overflow-tooltip>
        <template slot-scope="scope">
          <span class="link-type" @click="gotoDetail(scope.row)">
            {{ scope.row.title || "--" }}
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建人" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.createUserName || "--" }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.createTime | filterDate }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="已读" show-overflow-tooltip>
        <template slot-scope="scope">
          <span
            class="link-type"
            v-if="scope.row.readCount"
            @click="gotoRead(scope.row)"
            >{{ scope.row.readCount }}</span
          >
          <span v-else>{{ scope.row.state == 1 ? "--" : 0 }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="评论" show-overflow-tooltip>
        <template slot-scope="scope">
          <span
            class="link-type"
            v-if="scope.row.commeCount"
            @click="gotoComment(scope.row)"
            >{{ scope.row.commeCount }}</span
          >
          <span v-else>{{ scope.row.state == 1 ? "--" : 0 }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="点赞" show-overflow-tooltip>
        <template slot-scope="scope">
          <span
            class="link-type"
            v-if="scope.row.raiseCount"
            @click="gotoRaise(scope.row)"
            >{{ scope.row.raiseCount }}</span
          >
          <span v-else>{{ scope.row.state == 1 ? "--" : 0 }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-tag  size="mini" type="info"  v-if="scope.row.state == 1"
            >草稿</el-tag
          >
          <el-tag  size="mini" type="success"  v-else>已发布</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="发布时间" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.sendTime | filterDate }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="操作"
        v-if="isShowByPermission('/heartEdu/mangerInit')"
      >
        <template slot-scope="scope">
          <el-button size="small" type="text" @click="gotoForm(scope.row)"
            >编辑</el-button
          >
          <el-button
            size="small"
            type="text"
            v-if="scope.row.state == 1"
            @click="handleRelease(scope.row)"
            >发布</el-button
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

/* components */

/* api */
import {
  getHeartEduNoticeListAll,
  sendHeartEduNotice,
  delHeartEduNoticeById,
} from "@/api/homeSchool/mentalEducation/popularization/index";

export default {
  name: "mentalEducationPopularizationIndex",
  mixins: [mixin],
  components: {},
  computed: {},
  filters: {
    filterDate(val) {
      return val ? moment(val).format("YYYY-MM-DD HH:mm:ss") : "--";
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
        title: "",
      },
    };
  },
  created() {
    this.getHeartEduNoticeListAll();
  },
  methods: {
    isShowByPermission,
    // 根据标题，学校id查询科普通知列表
    getHeartEduNoticeListAll() {
      getHeartEduNoticeListAll({
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
    // 检索条件 改变
    filterSearch() {
      this.pagination.pageNo = 1;
      this.getHeartEduNoticeListAll();
    },
    // 主题改变
    handleTitle() {
      this.filterSearch();
    },
    // 分页 - pageSize 改变
    handleSizeChange(pageSize) {
      this.pagination.pageSize = pageSize;
      this.getHeartEduNoticeListAll();
    },
    // 分页 - currentPage 改变
    handleCurrentChange(pageNo) {
      this.pagination.pageNo = pageNo;
      this.getHeartEduNoticeListAll();
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
            noticeId: item.id,
          };
          this.delHeartEduNoticeById(form);
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
          let form = {
            id: item.id,
          };
          this.sendHeartEduNotice(form);
        })
        .catch(() => {});
    },
    // 根据id删除科普通知
    delHeartEduNoticeById(form) {
      delHeartEduNoticeById(form)
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
          this.getHeartEduNoticeListAll();
        })
        .catch((msg) => {
          this.$message({
            message: msg,
            type: "error",
          });
        });
    },
    // 发布心育科普通知
    sendHeartEduNotice(form) {
      sendHeartEduNotice(form)
        .then((res) => {
          let _res = res.data;
          if (_res.code != 200) return Promise.reject(_res.msg);
          else return _res.data;
        })
        .then((data) => {
          this.$message({
            message: "发布成功",
            type: "success",
          });
          this.getHeartEduNoticeListAll();
        })
        .catch((msg) => {
          this.$message({
            message: msg,
            type: "error",
          });
        });
    },
    // 创建 / 编辑
    gotoForm(item) {
      const routeParams = {
        path: "publicity/form",
      };
      if (item) routeParams.query = { noticeId: item.id };
      this.$router.push(routeParams);
    },
    // 详情页
    gotoDetail(item) {
      this.$router.push({
        path: "publicity/detail",
        query: {
          noticeId: item.id,
        },
      });
    },
    // 已读
    gotoRead(item) {
      this.$router.push({
        path: "publicity/read",
        query: {
          noticeId: item.id,
        },
      });
    },
    // 评论列表
    gotoComment(item) {
      this.$router.push({
        path: "publicity/comment",
        query: {
          noticeId: item.id,
        },
      });
    },
    // 点赞
    gotoRaise(item) {
      this.$router.push({
        path: "publicity/raise",
        query: {
          noticeId: item.id,
        },
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.mental-education-publicity-index {
  .filter-wrapper {
    margin-bottom: 10px;
  }

  .el-table__body-wrapper {
    .delete-btn {
      color: #f56c6c;
    }
  }
}
</style>
