<template>
  <div class="mental-education-publicity-comment">
    <el-row
      style="
        padding-bottom: 10px;
      "
    >
      <el-col :span="19">
        <el-button @click="$router.back()" size="medium">返回</el-button>
      </el-col>
      <el-col :span="5">
        <el-input
          class="search-input"
          icon="el-icon-search"
          size="medium"
          placeholder="请输入评论人"
          clearable
          v-model.trim="form.userName"
          @change="handleUserName"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="handleUserName"
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
      :height="maxH - 15 - 10"
      :data="tabList"
      v-loading.body="tabLoading"
    >
      <el-table-column align="center" label="评论人" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.userName || "--" }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="评论内容" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.content || "--" }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.createTime | filterDate }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
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

/* components */

/* api */
import {
  getHeartEduNoticeCommeList,
  delHeartEduNoticeComme,
} from "@/api/homeSchool/mentalEducation/popularization/comment";

export default {
  name: "mentalEducationPopularizationComment",
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
      // 通知id
      noticeId: this.$route.query.noticeId,
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
        userName: "",
      },
    };
  },
  created() {
    this.getHeartEduNoticeCommeList();
  },
  methods: {
    // 根据通知id,用户姓名查询回复列表
    getHeartEduNoticeCommeList() {
      getHeartEduNoticeCommeList({
        noticeId: this.noticeId,
        userName: this.form.userName,
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
      this.getHeartEduNoticeCommeList();
    },
    // 主题改变
    handleUserName() {
      this.filterSearch();
    },
    // 分页 - pageSize 改变
    handleSizeChange(pageSize) {
      this.pagination.pageSize = pageSize;
      this.getHeartEduNoticeCommeList();
    },
    // 分页 - currentPage 改变
    handleCurrentChange(pageNo) {
      this.pagination.pageNo = pageNo;
      this.getHeartEduNoticeCommeList();
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
            commeId: item.id,
          };
          this.delHeartEduNoticeComme(form);
        })
        .catch(() => {});
    },
    // 根据回复id删出回复信息
    delHeartEduNoticeComme(form) {
      delHeartEduNoticeComme(form)
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
          this.getHeartEduNoticeCommeList();
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
.mental-education-publicity-comment {
  padding:12px;
  .el-table__body-wrapper {
    .delete-btn {
      color: #f56c6c;
    }
  }
}
</style>
