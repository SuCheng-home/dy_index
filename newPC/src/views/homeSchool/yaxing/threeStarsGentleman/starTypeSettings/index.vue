<template>
  <div class="star-type-settings">
    <el-row style="padding-bottom: 10px">
      <el-col :span="24">
        <el-button @click="$router.back()" size="medium">返回</el-button>
        <el-button type="primary" size="medium" @click="handleAdd"
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
      :height="nobottommaxH"
      :data="tabList"
      v-loading.body="tabLoading"
    >
      <el-table-column align="center" label="分类名称" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.name || "--" }}</template>
      </el-table-column>
      <el-table-column align="center" label="评比星" show-overflow-tooltip>
        <template slot-scope="scope">{{
          scope.row.threeStarGroupList && scope.row.threeStarGroupList.length
            ? scope.row.threeStarGroupList.map((item) => item.name).join("、")
            : "--"
        }}</template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button size="small" type="text" @click="handleEdit(scope.row)"
            >编辑</el-button
          >
          <el-button
            size="small"
            type="text"
            @click="gotoStarSettings(scope.row)"
            >评比星维护</el-button
          >
          <el-button
            class="text-danger"
            size="small"
            type="text"
            @click="handleDelete(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :title="type == 'add' ? '添加分类' : '编辑分类'"
      :visible.sync="dialogVisible"
      width="30%"
      @closed="reset"
    >
      <el-form label-width="80px" ref="form" :model="form" :rules="rules">
        <el-form-item label="分类名称" prop="name">
          <el-input
            maxlength="10"
            placeholder="请输入分类名称（1-10个字符）"
            v-model.trim="form.name"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import mixin from "@/mixins/windowResize";
import {
  getThreeStarGroupList,
  addThreeStarGroup,
  updateThreeStarGroup,
  delThreeStarGroupById,
} from "@/api/homeSchool/yaxing/threeStarsGentleman/starTypeSettings/index";

export default {
  name: "starTypeSettings",
  mixins: [mixin],
  components: {},
  data() {
    return {
      // 新增 / 编辑
      type: "add",
      //  新增/编辑模态框 是否显示
      dialogVisible: false,
      // 是否正在加载数据 { Boolean }
      tabLoading: false,
      // 表格数据 { Array }
      tabList: [],
      // 请求表单
      form: {
        id: "",
        name: "",
      },
      // 用于重置表单
      defaultForm: {
        id: "",
        name: "",
      },
      // 校验规则
      rules: {
        name: [
          { required: true, message: "分类名称不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getThreeStarGroupList();
  },
  methods: {
    // 查询分组列表
    getThreeStarGroupList() {
      getThreeStarGroupList()
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
    // 保存
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          let form = {
            name: this.form.name,
          };
          if (this.type == "add") {
            form.pid = 0;
            form.type = 1;
            this.addThreeStarGroup(form);
          } else {
            form.id = this.form.id;
            this.updateThreeStarGroup(form);
          }
        } else {
          return false;
        }
      });
    },
    // 新增分组
    addThreeStarGroup(form) {
      addThreeStarGroup(form)
        .then((res) => {
          let _res = res.data;
          if (_res.code != 200) return Promise.reject(_res.msg);
          else return _res.data;
        })
        .then((data) => {
          this.$message({
            message: "添加成功",
            type: "success",
          });
          this.dialogVisible = false;
          this.getThreeStarGroupList();
        })
        .catch((msg) => {
          this.$message({
            message: msg,
            type: "error",
          });
        });
    },
    // 修改分组
    updateThreeStarGroup(form) {
      updateThreeStarGroup(form)
        .then((res) => {
          let _res = res.data;
          if (_res.code != 200) return Promise.reject(_res.msg);
          else return _res.data;
        })
        .then((data) => {
          this.$message({
            message: "修改成功",
            type: "success",
          });
          this.dialogVisible = false;
          this.getThreeStarGroupList();
        })
        .catch((msg) => {
          this.$message({
            message: msg,
            type: "error",
          });
        });
    },
    // 根据id删除分组
    delThreeStarGroupById(item) {
      delThreeStarGroupById({
        groupId: item.id,
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
          this.dialogVisible = false;
          this.getThreeStarGroupList();
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
      let message =
        item.threeStarGroupList.length > 0
          ? "当前分类下含有评比星，是否确认删除？"
          : "确认要删除吗？";
      this.$confirm(message, "删除", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        lockScroll: false,
      })
        .then(() => {
          this.delThreeStarGroupById(item);
        })
        .catch(() => {});
    },
    // 点击新增按钮
    handleAdd() {
      this.type = "add";
      this.dialogVisible = true;
    },
    // 点击编辑按钮
    handleEdit(item) {
      this.type = "edit";
      this.form.id = item.id;
      this.form.name = item.name;
      this.dialogVisible = true;
    },
    // 关闭并重置表单
    reset() {
      Object.keys(this.form).forEach((key) => {
        this.form[key] = this.defaultForm[key];
      });
      setTimeout(() => {
        this.$refs["form"].clearValidate();
      }, 100);
    },
    // 评比星维护
    gotoStarSettings(item) {
      this.$router.push({
        path: "starSettings/index",
        query: {
          id: item.id,
        },
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.star-type-settings {
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
