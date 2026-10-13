<template>
  <div class="certificate-level-add">
    <div class="filter-wrapper">
      <el-button @click="$router.back()" size="medium">返回</el-button>
      <el-button type="primary" size="medium" @click="submitForm">保存</el-button>
    </div>
    <el-form label-width="150px" ref="form" :model="form" :rules="rules">
      <el-form-item label="级别名称" prop="certLevelName">
        <el-input placeholder="级别名称（1-10个字符）" maxlength="10" v-model.trim="form.certLevelName"></el-input>
      </el-form-item>
      <el-form-item label="权重" prop="weights">
        <el-input placeholder="权重（1-100整数）" maxlength="3" v-model.trim="form.weights"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import mixin from "@/mixins/windowResize";
import {
  insert,
  update,
} from "@/api/systemSet/teacherHonorSetting/certificateLevel/form";

export default {
  name: "certificateLevelAdd",
  mixins: [mixin],
  components: {},
  data() {
    const validateWeights = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入权重"));
      } else {
        if (
          Number(value) > 0 &&
          Number(value) <= 100 &&
          parseFloat(value) == parseInt(value)
        ) {
          callback();
        } else {
          callback(new Error("权重为[1，100]范围内的整数"));
        }
      }
    };
    return {
      // 新增 / 编辑
      type: "add",
      // 请求表单
      form: {
        // 证书id
        id: "",
        // 证书级别
        certLevelName: "",
        // 权重
        weights: "",
      },
      // 校验规则
      rules: {
        certLevelName: [
          { required: true, message: "请输入级别名称", trigger: "blur" },
          {
            min: 1,
            max: 10,
            message: "长度在 1 到 10 个字符",
            trigger: "blur",
          },
        ],
        weights: [
          { required: true, message: "请输入权重", trigger: "blur" },
          { validator: validateWeights, trigger: "blur" },
        ],
      },
    };
  },
  created() {
    let info = this.$route.query.info;
    if (info) {
      this.type = "edit";
      const _info = JSON.parse(info);
      this.form.id = _info.id;
      this.form.certLevelName = _info.certLevelName;
      this.form.weights = _info.weights;
    } else this.type = "add";
  },
  methods: {
    // 保存
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          let form = {};
          form.certLevelName = this.form.certLevelName;
          form.weights = Number(this.form.weights);
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
    // 新增 证书级别
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
          this.$router.back();
        })
        .catch((msg) => {
          this.$message({
            message: msg,
            type: "error",
          });
        });
    },
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
          this.$router.back();
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
.certificate-level-add {
  padding: 12px;
  .filter-wrapper {
    border-bottom: 1px solid #e7eaec;
    padding-bottom: 10px;
    margin-bottom: 10px;
  }
  .el-form {
    width: 810px;
    margin: 0 auto;
  }
}
</style>