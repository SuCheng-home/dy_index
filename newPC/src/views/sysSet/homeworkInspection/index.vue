<template>
  <div class="homework-inspection">
    <el-row>
      <el-col :span="24">
        <el-button @click="$router.back()" size="medium">返回</el-button>
        <el-button type="primary" size="medium" @click="submitForm"
          >保存</el-button
        >
      </el-col>
    </el-row>

    <div class="main-wrapper" :style="{ height: nobottommaxH - 10 + 'px' }">
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item prop="classTime">
          <div>
            <el-checkbox
              :true-label="1"
              :false-label="2"
              v-model="form.pushToStatistician"
              >检查结果推送给统计员</el-checkbox
            >
          </div>
          <div>
            <el-checkbox
              :true-label="1"
              :false-label="2"
              v-model="form.pushToTeacher"
              >检查结果推送给被检查老师</el-checkbox
            >
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
/* utils */
import mixin from "@/mixins/windowResize";
import { mapGetters } from "vuex";

/* components */

/* api */
import { getBySchoolId, insert } from "@/api/systemSet/homeworkInspection";

export default {
  mixins: [mixin],
  components: {},
  filters: {},
  watch: {},
  computed: {
    ...mapGetters(["userInfo"]),
  },
  data() {
    return {
      // 请求表单
      form: {
        // 	推送给统计员 1:是 2:否
        pushToStatistician: "",
        // 	推送诶被检查老师 1:是 2:否
        pushToTeacher: "",
      },
      // 校验规则
      rules: {},
    };
  },
  created() {
    this.getBySchoolId();
  },
  methods: {
    // 设置详情
    getBySchoolId() {
      getBySchoolId()
        .then((res) => {
          let _res = res.data;
          if (_res.code != 200) return Promise.reject(_res.msg);
          else return _res.data;
        })
        .then((data) => {
          if (data) {
            this.form.pushToStatistician = data.pushToStatistician;
            this.form.pushToTeacher = data.pushToTeacher;
          }
        });
    },

    insert(form) {
      insert(form)
        .then((res) => {
          let _res = res.data;
          if (_res.code != 200) return Promise.reject(_res.msg);
          else return _res.data;
        })
        .then((data) => {
          this.$message({
            message: "保存成功",
            type: "success",
            duration: "1500",
            onClose: () => {
              this.$router.back();
            },
          });
        });
    },

    // 提交
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          let form = {
            pushToStatistician: this.form.pushToStatistician,
            pushToTeacher: this.form.pushToTeacher,
          };
          this.insert(form);
        } else {
          return false;
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.homework-inspection {
  padding:12px;

  .el-col {
    border-bottom: 1px solid #e7eaec;
    padding-bottom: 10px;
    margin-bottom: 10px;
  }

  .el-form {
    width: 810px;
    margin: 0 auto;
    .el-form-item {
      margin-bottom: 0;
    }
    /deep/ .el-form-item__label {
      color: #909399;
    }
    /deep/ .el-form-item__content {
      padding-left: 18px;
    }
  }

  .detail-wrapper {
    overflow: auto;
    padding-bottom: 50px;
  }

  .detail-title {
    width: 810px;
    margin: 22px auto 14px;
    border-left: 4px solid #409eff;
    padding-left: 12px;
    height: 16px;
    line-height: 16px;
    font-size: 15px;
    color: #676a6c;
    font-weight: bold;
    .danger {
      color: #f56c6c;
    }
  }
}
</style>