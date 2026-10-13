<template>
  <div class="mental-education-consulting-typeSettings-index">
    <el-row>
      <el-col :span="24">
        <el-button @click="$router.back()" size="medium">返回</el-button>
        <el-button type="primary" size="medium" @click="gotoForm"
          >添加分类</el-button
        >
      </el-col>
    </el-row>

    <el-table
      border
      fit
      stripe
      highlight-current-row
      style="width: 100%"
      :height="nobottommaxH - 10"
      :data="tabList"
      v-loading.body="tabLoading"
    >
      <el-table-column align="center" label="分类名称" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.name || "--" }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="描述" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.remark || "--" }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="负责老师" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.mangerUserJson | filterMangerUserJson }}
        </template>
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
  </div>
</template>

<script>
/* utils */
import mixin from "@/mixins/windowResize";

/* components */

/* api */
import {
  getHeartEduGroupList,
  delHeartEduGroup,
} from "@/api/homeSchool/mentalEducation/consulting/typeSettings/index";

export default {
  name: "mentalEducationConsultingTypeSettingsIndex",
  mixins: [mixin],
  components: {},
  computed: {},
  filters: {
    filterMangerUserJson(mangerUserJson) {
      return mangerUserJson
        ? JSON.parse(mangerUserJson)
            .map((item) => {
              return item.name;
            })
            .join("，")
        : "--";
    },
  },
  data() {
    return {
      // 是否正在加载数据 { Boolean }
      tabLoading: false,
      // 表格数据 { Array }
      tabList: [],
    };
  },
  created() {
    this.getHeartEduGroupList();
  },
  methods: {
    // 根据标题，学校id查询科普通知列表
    getHeartEduGroupList() {
      getHeartEduGroupList()
        .then((res) => {
          let _res = res.data;
          if (_res.code != 200) return Promise.reject(_res.msg);
          else return _res.data;
        })
        .then((data) => {
          if (Array.isArray(data)) this.tabList = [...data];
        })
        .catch((msg) => {
          this.$message({
            message: msg,
            type: "error",
          });
        });
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
            groupId: item.id,
          };
          this.delHeartEduGroup(form);
        })
        .catch(() => {});
    },
    // 根据id删除科普通知
    delHeartEduGroup(form) {
      delHeartEduGroup(form)
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
          this.getHeartEduGroupList();
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
        path: "./form",
      };
      if (item) routeParams.query = { id: item.id };
      this.$router.push(routeParams);
    },
  },
};
</script>
<style lang="scss" scoped>
.mental-education-consulting-typeSettings-index {
  padding:12px;

  .el-row {
    border-bottom: 1px solid #e7eaec;
    padding-bottom: 10px;
    margin-bottom: 10px;
  }

  .el-table__body-wrapper {
    .delete-btn {
      color: #f56c6c;
    }
  }
}
</style>
