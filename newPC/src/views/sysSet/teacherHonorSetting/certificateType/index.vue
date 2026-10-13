<template>
  <div class="certificate-type">
    <div class="filter-wrapper">
      <el-button @click="$router.back()" size="medium">返回</el-button>
      <el-button type="primary" size="medium" @click="handleAdd">添加</el-button>
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
      <el-table-column align="center" label="类别名称" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.certTypeName || "--" }}</template>
      </el-table-column>
      <el-table-column align="center" label="创建人" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.createUserName || "--" }}</template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button size="small" type="text" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button  size="small" type="text" @click="handleDelete(scope.row)" class="delete-btn buttontextred">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="证书类型" :visible.sync="dialogVisible" width="30%" @closed="cancel">
      <el-form label-width="80px" ref="form" :model="form" :rules="rules">
        <el-form-item label="类型名称" prop="certTypeName">
          <el-input maxlength="10" placeholder="类型名称（1-10个字符）" v-model.trim="form.certTypeName"></el-input>
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
  listBySchoolId,
  insert,
  update,
  del,
} from "@/api/systemSet/teacherHonorSetting/certificateType/index";

export default {
  name: "certificateType",
  mixins: [mixin],
  components: {},
  data() {
    return {
      // 新增 / 编辑
      type: "add",
      //  新增/编辑模态框 是否显示
      dialogVisible: false,
      // table 是否正在加载
      tabLoading: false,
      // 表格列表
      tabList: [],
      // 请求表单
      form: {
        // 证书类型id
        id: "",
        // 证书名称
        certTypeName: "",
      },
      // 用于重置表单
      defaultForm: {
        id: "",
        certTypeName: "",
      },
      // 校验规则
      rules: {
        certTypeName: [
          { required: true, message: "请输入类型名称", trigger: "blur" },
          {
            min: 1,
            max: 10,
            message: "长度在 1 到 10 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.listBySchoolId();
  },
  methods: {
    // 列表 证书类型(全部)
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
    // 点击新增按钮
    handleAdd() {
      this.type = "add";
      this.dialogVisible = true;
    },
    // 点击编辑按钮
    handleEdit(item) {
      this.type = "edit";
      this.form.id = item.id;
      this.form.certTypeName = item.certTypeName;
      this.dialogVisible = true;
    },
    // 点击删除按钮
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
    // 点击取消按钮
    cancel() {
      this.reset();
    },
    // 保存
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          let form = {};
          form.certTypeName = this.form.certTypeName;
          if (this.type == "add") {
            this.insert(form);
          } else {
            form.id = this.form.id;
            this.update(form);
          }
        } else {
          return false;
        }
      });
    },
    // 新增 机构列表
    insert(form) {
      insert(form)
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
          this.listBySchoolId();
        })
        .catch((msg) => {
          this.$message({
            message: msg,
            type: "error",
          });
        });
    },
    // 修改 机构
    update(form) {
      update(form)
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
          this.listBySchoolId();
        })
        .catch((msg) => {
          this.$message({
            message: msg,
            type: "error",
          });
        });
    },
    // 删除 证书类型
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
          this.dialogVisible = false;
          this.listBySchoolId();
        })
        .catch((msg) => {
          this.$message({
            message: msg,
            type: "error",
          });
        });
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
.certificate-type {
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