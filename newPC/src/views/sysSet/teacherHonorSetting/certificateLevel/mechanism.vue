<template>
  <div class="certificate-level-mechanism">
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
      :height="nobottommaxH"
      :data="tabList"
      v-loading.body="tabLoading"
    >
      <el-table-column align="center" label="机构名称" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.organizationName || "--" }}</template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button size="small" type="text" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button  size="small" type="text" @click="handleDelete(scope.row)" class="delete-btn buttontextred">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="机构名称设置" :visible.sync="dialogVisible" width="30%" @closed="cancel">
      <el-form label-width="80px" ref="form" :model="form" :rules="rules">
        <el-form-item label="机构名称" prop="organizationName">
          <el-input v-model.trim="form.organizationName" placeholder="级别名称（1-50个字符）"></el-input>
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
  listByCertLevelId,
  insert,
  update,
  del,
} from "@/api/systemSet/teacherHonorSetting/certificateLevel/mechanism";

export default {
  name: "certificateLevelMechanism",
  mixins: [mixin],
  components: {},
  data() {
    return {
      // 新增 / 编辑
      type: "add",
      //  新增/编辑模态框 是否显示
      dialogVisible: false,
      // 表格列表
      tabList: [],
      // 请求表单
      form: {
        // 机构id
        id: "",
        // 证书级别id
        certLevelId: this.$route.query.certLevelId,
        // 机构名称
        organizationName: "",
      },
      // 用于重置表单
      defaultForm: {
        id: "",
        certLevelId: this.$route.query.certLevelId,
        organizationName: "",
      },
      // 校验规则
      rules: {
        organizationName: [
          { required: true, message: "请输入机构名称", trigger: "blur" },
          {
            min: 1,
            max: 50,
            message: "长度在 1 到 50 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.listByCertLevelId();
  },
  methods: {
    // 列表 机构列表(不分页)
    listByCertLevelId() {
      listByCertLevelId({
        certLevelId: this.form.certLevelId,
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
    // 点击新增按钮
    handleAdd() {
      this.type = "add";
      this.dialogVisible = true;
    },
    // 点击编辑按钮
    handleEdit(item) {
      this.type = "edit";
      this.form.id = item.id;
      this.form.organizationName = item.organizationName;
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
          form.certLevelId = this.form.certLevelId;
          form.organizationName = this.form.organizationName;
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
          this.listByCertLevelId();
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
          this.listByCertLevelId();
        })
        .catch((msg) => {
          this.$message({
            message: msg,
            type: "error",
          });
        });
    },
    // 删除 机构
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
          this.listByCertLevelId();
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
.certificate-level-mechanism {
  padding: 12px;
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