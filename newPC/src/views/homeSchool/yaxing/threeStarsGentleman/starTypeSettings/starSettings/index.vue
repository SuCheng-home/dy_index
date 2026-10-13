<template>
  <div class="star-settings">
    <el-row style="padding-bottom: 10px">
      <el-col :span="24">
        <el-button @click="$router.back()" size="medium">返回</el-button>
        <el-button type="primary" size="medium" @click="handleAdd"
          >添加评比星</el-button
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
      <el-table-column align="center" label="评比星名称" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.name || "--" }}</template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button size="small" type="text" @click="handleEdit(scope.row)"
            >编辑</el-button
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
      :title="type == 'add' ? '添加评比星' : '编辑评比星'"
      :visible.sync="dialogVisible"
      width="30%"
      @closed="reset"
    >
      <el-form label-width="100px" ref="form" :model="form" :rules="rules">
        <el-form-item label="评比星名称" prop="name">
          <el-input
            maxlength="10"
            placeholder="请输入评比星（1-10个字符）"
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
  getThreeStarGroupListByPid,
  addThreeStarGroup,
  updateThreeStarGroup,
  delThreeStarGroupById,
} from "@/api/homeSchool/yaxing/threeStarsGentleman/starTypeSettings/starSettings/index";

export default {
  name: "starSettings",
  mixins: [mixin],
  components: {},
  data() {
    return {
      // 分类id
      id: this.$route.query.id,
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
          { required: true, message: "评比星名称不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getThreeStarGroupListByPid();
  },
  methods: {
    // 查询分组列表
    getThreeStarGroupListByPid() {
      getThreeStarGroupListByPid({
        pid: this.id,
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
    // 保存
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          let form = {
            name: this.form.name,
          };
          if (this.type == "add") {
            form.pid = this.id;
            form.type = 2;
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
          this.getThreeStarGroupListByPid();
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
          this.getThreeStarGroupListByPid();
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
          this.getThreeStarGroupListByPid();
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
      // 当前分类下含有评比星，是否确认删除？
      this.$confirm("确认要删除吗？", "删除", {
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
  },
};
</script>
<style lang="scss" scoped>
.star-settings {
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
