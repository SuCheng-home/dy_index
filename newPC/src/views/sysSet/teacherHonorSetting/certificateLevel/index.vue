<template>
  <div class="certificate-level">
    <div class="filter-wrapper">
      <el-button @click="$router.back()" size="medium">返回</el-button>
      <el-button type="primary" size="medium" @click="gotoForm()">添加</el-button>
    </div>
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
      <el-table-column align="center" label="级别" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.certLevelName || "--" }}</template>
      </el-table-column>
      <el-table-column align="center" label="权重" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.weights || "--" }}</template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button size="small" type="text" @click="gotoMechanism(scope.row)">机构列表</el-button>
          <el-button size="small" type="text" @click="gotoForm(scope.row)">编辑</el-button>
          <el-button  size="small" type="text" @click="handleDelete(scope.row)" class="delete-btn buttontextred">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import mixin from "@/mixins/windowResize";
import {
  listBySchoolId,
  del,
} from "@/api/systemSet/teacherHonorSetting/certificateLevel/index";

export default {
  name: "certificateLevel",
  mixins: [mixin],
  components: {},
  data() {
    return {
      // table 是否正在加载
      tabLoading: false,
      // 表格列表
      tabList: [],
    };
  },
  created() {
    this.listBySchoolId();
  },
  methods: {
    // 列表 证书级别(全部)
    listBySchoolId() {
      listBySchoolId()
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
    // 机构列表
    gotoMechanism(info) {
      this.$router.push({
        path: "certificateLevel/mechanism",
        query: {
          certLevelId: info.id,
        },
      });
    },
    // 新增/编辑页
    gotoForm(info) {
      const routeParams = {
        path: "certificateLevel/form",
      };
      if (info) routeParams.query = { info: JSON.stringify(info) };
      this.$router.push(routeParams);
    },
    // 删除
    handleDelete(item) {
      this.$confirm("确认要删除吗？", "删除", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        lockScroll: false,
      }).then(() => {
        this.del(item);
      });
    },
    del(item) {
      del({
        id: item.id,
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
          this.listBySchoolId();
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
.certificate-level {
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