<template>
  <div class="work-reminder-suspended">
    <el-row style="padding-bottom: 10px">
      <el-col :span="19">
        <el-button @click="$router.back()" size="medium">返回</el-button>

        <el-select
          class="el-select-short"
          size="medium"
          placeholder="请选择"
          v-model="form.moduleCode"
          @change="handleModuleCode"
        >
          <el-option label="全部来源" :value="0"></el-option>
          <el-option
            v-for="(item, idx) in moduleList"
            :key="idx"
            :label="item.moduleName"
            :value="item.moduleCode"
          ></el-option>
        </el-select>
      </el-col>

      <el-col :span="5">
        <el-input
          class="search-input"
          icon="el-icon-search"
          size="medium"
          placeholder="请输入主题/内容"
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
      :height="maxH - 36 - 15 - 10"
      :data="tabList"
      v-loading.body="tabLoading"
    >
      <el-table-column align="center" label="来源" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.moduleName || "--" }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="主题/内容" show-overflow-tooltip>
        <template slot-scope="scope">
          <span
            class="link-type"
            @click="gotoDetail(scope.row)"
            v-if="scope.row.title"
          >
            {{ scope.row.title }}
          </span>
          <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="提交人" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.createUserName || "--" }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="提交时间" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | filterDate }}</span>
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
import { mapGetters } from "vuex";
import { isShowByPermission } from "@/utils";

/* components */

/* api */
import {
  getBackLogModuleList,
  getBackLogNotList,
} from "@/api/homePage/aside/middle/workReminder";

export default {
  name: "workReminderSuspended",
  mixins: [mixin],
  components: {},
  computed: {
    ...mapGetters(["userInfo"]),
  },
  filters: {
    filterDate(val) {
      return val ? moment(val).format("YYYY-MM-DD HH:mm:ss") : "--";
    },
  },
  data() {
    return {
      // 模块列表
      moduleList: [],
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
        moduleCode: 0,
        title: "",
      },
    };
  },
  created() {
    this.getBackLogModuleList();
  },
  methods: {
    isShowByPermission,
    // 根据学校id查询模块列表
    getBackLogModuleList() {
      getBackLogModuleList()
        .then((res) => {
          let _res = res.data;
          if (_res.code != 200) return Promise.reject(_res.msg);
          else return _res.data;
        })
        .then((data) => {
          if (data) {
            this.moduleList = [...data];
            this.getBackLogNotList();
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
        .catch((err) => {
          this.tabLoading = false;
        });
    },

    // 检索条件 改变
    filterSearch() {
      this.pagination.pageNo = 1;
      this.getBackLogNotList();
    },

    // 主题改变
    handleTitle() {
      this.filterSearch();
    },

    // moduleCode改变
    handleModuleCode(val) {
      this.filterSearch();
    },

    // 分页 - pageSize 改变
    handleSizeChange(pageSize) {
      this.pagination.pageSize = pageSize;
      this.getBackLogNotList();
    },

    // 分页 - currentPage 改变
    handleCurrentChange(pageNo) {
      this.pagination.pageNo = pageNo;
      this.getBackLogNotList();
    },

    // 待办详情
    gotoDetail(item) {
      this.$router.push({
        path: item.pcUrl,
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.work-reminder-suspended {
}
</style>
