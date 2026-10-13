<template>
  <div class="newsIndexWrapper" :style="`height:${columnMax}px`">
    <el-row class="menu-row">
      <el-col :span="19">
        <el-button
          v-if="permission.indexOf('/schoolWebTwo/webManager')!==-1"
          size="small"
          class="filter-item"
          type="primary"
          @click="delMessages()"
        >删除</el-button>
        <el-select
          style="width: 120px;"
          size="small"
          placeholder="请选择"
          v-model="form.status"
          @change="handleStatusChange"
        >
          <el-option label="全部" :value="0"></el-option>
          <el-option
            :key="idx"
            v-for="(status, idx) in statusList"
            :label="status.label"
            :value="status.value"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="5">
        <el-input
          size="small"
          placeholder="请输入消息标题"
          v-model.trim="form.title"
          @change="handleTitleChange"
        >
          <i slot="suffix" class="el-input__icon el-icon-search"></i>
        </el-input>
      </el-col>
    </el-row>
    <div class="message-main custom—scrollbar" :style="`height:${columnMax-70}px`">
      <el-table
        class="tabList custom—scrollbar"
        style="width: 100%"
        ref="tabList"
        border
        fit
        highlight-current-row
        :data="tabList"
        :height="`${columnMax-160}`"
        v-loading.body="listLoading"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" align="center" width="55"></el-table-column>
        <el-table-column label="主题" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <router-link
              class="link-type"
              :to="{ path: 'headmasterNewsDetail', query: { id:scope.row.id} }"
            >
              <span>{{scope.row.title}}</span>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column label="联系方式" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.email || '--'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="反馈时间" align="center" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.createTime | filterTime}}</template>
        </el-table-column>
        <el-table-column label="状态" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.status == 1">未回复</span>
            <span v-else-if="scope.row.status == 2">已回复</span>
            <span v-else-if="scope.row.status == 3">已公开</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              size="small"
              type="text"
              v-if="scope.row.status == 2"
              @click="handleStatus3(scope.row.id)"
            >公开</el-button>
            <el-button
              size="small"
              type="text"
              v-if="scope.row.status == 3"
              @click="handleStatus2(scope.row.id)"
            >撤回</el-button>
            <el-button size="small" type="text" @click="deleOneMessage(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div v-show="!listLoading" class="pagination-container">
        <el-pagination
          layout="total, sizes, prev, pager, next, jumper"
          :current-page.sync="pagination.pageNo"
          :page-sizes="pagination.pageSizes"
          :page-size="pagination.pageSize"
          :total="pagination.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import mixins from "@/mixins/windowResize";
import {
  getSchoolWebLetterBoxList,
  delSchoolWebLetterBoxByIds,
} from "@/api/news/headmasterNewsList/index";
import { updateSchoolWebLetterBox } from "@/api/news/headmasterNewsList/detail";
import { mapGetters } from "vuex";

export default {
  mixins: [mixins],
  computed: {
    ...mapGetters(["webId", "webName", "permission"]),
  },
  filters: {
    filterTime(date) {
      return date == "" ? "" : date.split(".")[0];
    },
  },
  activated(){
      this.getSchoolWebLetterBoxList();
    },
  mounted() {
    this.getSchoolWebLetterBoxList();
    localStorage.setItem("webId", this.webId);
  },
  data() {
    return {
      listLoading: false,
      // 公开按钮 loading
      btn2Loading: false,
      // 撤回按钮 loading
      btn3Loading: false,
      // 表格列表
      tabList: [],
      // 多选框选中列表
      multipleSelection: [],
      // 状态列表
      statusList: [
        { label: "未回复", value: 1 },
        { label: "已回复", value: 2 },
        { label: "已公开", value: 3 },
      ],
      // 分页
      pagination: {
        pageNo: 1,
        pageSize: 20,
        pageSizes: [10, 20, 30, 50],
        total: 0,
      },
      // 请求表单
      form: {
        // 状态 { number } 1(未回复) | 2(已回复) | 3(已公开)
        status: 0,
        // 主题 { string }
        title: "",
      },
    };
  },
  methods: {
    // 根据网站Id,标题查询校长信箱列表
    getSchoolWebLetterBoxList() {
      this.listLoading = true;
      getSchoolWebLetterBoxList({
        status: this.form.status,
        title: this.form.title,
        webId: this.webId,
        pageNo: this.pagination.pageNo,
        pageSize: this.pagination.pageSize,
      })
        .then((res) => {
          this.listLoading = false;
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
    // 根据消息ids删除删除校长信箱
    delSchoolWebLetterBoxByIds(ids) {
      delSchoolWebLetterBoxByIds({
        messageIds: ids,
      })
        .then((res) => {
          this.listLoading = false;
          let _res = res.data;
          if (_res.code != 200) return Promise.reject(_res.msg);
          else return _res.data;
        })
        .then((data) => {
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          this.getSchoolWebLetterBoxList();
        })
        .catch((msg) => {
          this.$message({
            message: msg,
            type: "error",
          });
        });
    },
    // 删除所有选中的项
    delMessages() {
      if (!this.multipleSelection.length)
        this.$message({
          type: "warning",
          message: "请选择要删除的消息",
        });
      else {
        this.$confirm("删除此消息网站上将不再展示？", "提示", { type: "error" })
          .then(() => {
            let arr = this.multipleSelection.map((obj) => obj.id);
            this.delSchoolWebLetterBoxByIds(arr.toString());
          })
          .catch(() => {});
      }
    },
    // 删除当前行项
    deleOneMessage(id) {
      this.$confirm("删除此消息网站上将不再展示？", "提示", { type: "error" })
        .then(() => {
          this.delSchoolWebLetterBoxByIds(id);
        })
        .catch(() => {});
    },
    // 筛选项改变
    filterSearch() {
      this.pagination.pageNo = 1;
      this.getSchoolWebLetterBoxList();
    },
    // 状态改变
    handleStatusChange() {
      this.filterSearch();
    },
    // 标题改变
    handleTitleChange() {
      this.filterSearch();
    },
    // 选中项改变
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 分页 - pageSize 改变
    handleSizeChange(pageSize) {
      this.pagination.pageSize = pageSize;
      this.getSchoolWebLetterBoxList();
    },
    // 分页 - currentPage 改变
    handleCurrentChange(currentPage) {
      this.pagination.currentPage = currentPage;
      this.getSchoolWebLetterBoxList();
    },
    // 修改校长信箱
    updateSchoolWebLetterBox(form) {
      updateSchoolWebLetterBox(form)
        .then((res) => {
          let _res = res.data;
          if (_res.code != 200) return Promise.reject(_res.msg);
          else return _res.data;
        })
        .then((data) => {
          this.$message({
            message: "保存成功",
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
    // 点击公开按钮
    handleStatus3(id) {
      this.$confirm("确认公开吗？", "提示", { type: "warning" })
        .then(() => {
          this.updateSchoolWebLetterBox({
            id,
            status: 3,
            webId: this.webId,
          });
        })
        .catch(() => {});
    },
    // 点击撤回按钮
    handleStatus2(id) {
      this.$confirm("确认撤回吗？", "提示", { type: "warning" })
        .then(() => {
          this.updateSchoolWebLetterBox({
            id,
            status: 2,
            webId: this.webId,
          });
        })
        .catch(() => {});
    },
  },
};
</script>

<style lang="scss" scoped>
.newsIndexWrapper {
  .menu-row {
    border-bottom: 1px solid #e7eaec;
    box-sizing: border-box;
    padding-bottom: 15px;
    padding-top: 15px;
  }
  .message-main {
    margin-top: 20px;
  }
  .pagination-container {
    margin-top: 20px;
  }
}
.newList-wrap {
  width: 100%;
  padding: 20px 15px;
  overflow-x: hidden;
  overflow-y: auto;
  box-sizing: border-box;
}
.menu-row {
  border-bottom: 1px solid #e7eaec;
  box-sizing: border-box;
  padding-bottom: 20px;
}
.menu-row .el-button {
  margin-left: 15px;
}
.tabList {
  .moduleImg {
    display: inline-block;
    width: 25px;
    height: 25px;
    vertical-align: middle;
  }
}
.el-table__body-wrapper {
  overflow-x: hidden;
  overflow-y: auto;
}

.el-table__body-wrapper::-webkit-scrollbar {
  width: 6px;
  background-color: rgba(255, 255, 255, 0.1);
}

.el-table__body-wrapper::-webkit-scrollbar-thumb {
  background-color: #999;
}

.el-table__body-wrapper::-webkit-scrollbar-track {
  background-color: rgba(255, 255, 255, 0.1);
}
</style>
<style lang="scss">
.el-table-filter__list-item:nth-child(1) {
  display: none !important;
}
.tabList .el-table__header .has-gutter th {
  background: #eef1f6;
  font-size: 14px;
  color: #1f2d3d;
}
</style>
