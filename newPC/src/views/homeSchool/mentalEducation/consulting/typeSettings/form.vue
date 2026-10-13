<template>
  <div class="mental-education-consulting-typeSettings-form">
    <el-row>
      <el-col :span="24">
        <el-button @click="$router.back()" size="medium">返回</el-button>
        <el-button type="primary" size="medium" @click="submitForm"
          >保存</el-button
        >
      </el-col>
    </el-row>

    <el-form label-width="150px" ref="form" :model="form" :rules="rules">
      <el-form-item label="分类名称" prop="name">
        <el-input
          placeholder="1-20个字符"
          maxlength="20"
          show-word-limit
          v-model.trim="form.name"
        ></el-input>
      </el-form-item>
      <el-form-item label="分类描述" prop="remark">
        <el-input
          placeholder="0-200个字符"
          type="textarea"
          maxlength="200"
          show-word-limit
          :rows="5"
          v-model="form.remark"
        ></el-input>
      </el-form-item>
      <el-form-item label="负责人" prop="mangerUserJson">
        <address-book
          :config="configData"
          v-model="form.mangerUserJson"
        ></address-book>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
/* utils */
import mixin from "@/mixins/windowResize";

/* components */
import AddressBook from "@/components/AddressBook/indexExpand";

/* api */
import {
  addHeartEduGroup,
  getHeartEduGroup,
  updateHeartEduGroup,
} from "@/api/homeSchool/mentalEducation/consulting/typeSettings/form";

export default {
  mixins: [],
  components: { AddressBook },
  computed: {},
  data() {
    let validateMangerUserJson = (rule, value, callback) => {
      let userJson = value.userJson;
      if (!userJson || !userJson.length) {
        callback(new Error("请选择负责人"));
      } else {
        callback();
      }
    };

    return {
      // 新增 / 编辑
      type: "add",
      // 保存成功后提示语
      messsage: "保存成功",
      // 地址簿参数
      configData: {
        title: "选择负责人",
        depart: { target: "user", departType: "t", userTypes: "1" },
      },
      // 请求表单
      form: {
        // 分类id
        id: "",
        // 名称
        name: "",
        // 描述
        remark: "",
        // 负责人
        mangerUserJson: {},
      },
      rules: {
        name: [
          { required: true, message: "分类名称不能为空", trigger: "blur" },
        ],
        remark: [
          { required: true, message: "分类描述不能为空", trigger: "blur" },
        ],
        mangerUserJson: [
          {
            validator: validateMangerUserJson,
            required: true,
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    let id = this.$route.query.id;
    if (id) {
      this.type = "edit";
      this.form.id = id;
      this.getHeartEduGroup();
    } else this.type = "add";
  },
  methods: {
    // 提交
    submitForm() {
      this.form.remark = this.form.remark.trim();
      this.$refs["form"].validate((valid) => {
        if (valid) {
          let form = {
            mangerUserJson: this.form.mangerUserJson.userJson,
            name: this.form.name,
            remark: this.form.remark,
          };
          if (this.type == "add") {
            this.addHeartEduGroup(form);
          } else {
            form.id = this.form.id;
            this.updateHeartEduGroup(form);
          }
        } else {
          return false;
        }
      });
    },
    getHeartEduGroup() {
      getHeartEduGroup({
        groupId: this.form.id,
      })
        .then((res) => {
          let _res = res.data;
          if (_res.code != 200) return Promise.reject(_res.msg);
          else return _res.data;
        })
        .then((data) => {
          this.form.name = data.name || "";
          this.form.remark = data.remark || "";
          this.form.mangerUserJson = {
            departJson: [],
            groupJson: [],
            userJson: JSON.parse(data.mangerUserJson || "[]"),
          };
        });
    },
    addHeartEduGroup(form) {
      addHeartEduGroup(form)
        .then((res) => {
          let _res = res.data;
          if (_res.code != 200) return Promise.reject(_res.msg);
          else return _res.data;
        })
        .then((data) => {
          this.$message({
            message: this.messsage,
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
    updateHeartEduGroup(form) {
      updateHeartEduGroup(form)
        .then((res) => {
          let _res = res.data;
          if (_res.code != 200) return Promise.reject(_res.msg);
          else return _res.data;
        })
        .then((data) => {
          this.$message({
            message: this.messsage,
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
.mental-education-consulting-typeSettings-form {
  padding:12px;

  .el-col {
    border-bottom: 1px solid #e7eaec;
    padding-bottom: 10px;
    margin-bottom: 10px;
  }

  .el-form {
    width: 810px;
    margin: 0 auto;

    /deep/ .upload-file-item {
      width: 200px !important;

      img {
        width: 100% !important;
        min-height: 110px;
        margin: 0;
        border: 1px dashed #409eff;
        box-sizing: border-box;
        margin: 0 !important;
      }
      .file-name {
        display: none;
      }
    }
  }
}
</style>