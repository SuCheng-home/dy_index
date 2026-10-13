<template>
  <div class="reminder-settings">
    <el-row style="
        border-bottom: 1px solid #e7eaec;
        padding-bottom: 10px;
        margin-bottom: 10px;
      ">
      <el-col :span="19">
        <el-button
          @click="$router.back()"
          size="medium"
        >返回</el-button>
        <el-button
          size="medium"
          type="primary"
          @click="submitForm"
        >保存</el-button>
      </el-col>
    </el-row>
    <div
      class="form-wrapper"
      :style="{ width: '100%', height: nobottommaxH + 'px' }"
    >
      <el-form
        label-width="150px"
        ref="form"
        :model="form"
      >
        <el-form-item prop="title">
          <el-checkbox v-model="form.checked">每天早上08:50提醒报修负责人</el-checkbox>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
/* utils */
import mixin from "@/mixins/windowResize";

/* components */

/* api */
import { getBySchoolId, insertOrUpdate } from "@/api/reminderSettings";

export default {
  mixins: [mixin],
  components: {},
  computed: {},
  filters: {},
  data() {
    return {
      // 请求表单
      form: {
        checked: false,
      },
    };
  },
  created() {
    this.getBySchoolId();
  },
  methods: {
    getBySchoolId() {
      getBySchoolId()
        .then((res) => {
          let _res = res.data;
          if (_res.code != 200) return Promise.reject(_res.msg);
          else return _res.data;
        })
        .then((data) => {
          if (data) {
            if (data.remind == 1) this.form.checked = true;
            else this.form.checked = false;
          } else {
            this.form.checked = false;
          }
        })
        .catch((msg) => {
          this.$message({
            message: msg,
            type: "error",
          });
        });
    },
    insertOrUpdate(form) {
      insertOrUpdate(form)
        .then((res) => {
          let _res = res.data;
          if (_res.code != 200) return Promise.reject(_res.msg);
          else return _res.data;
        })
        .then((data) => {
          this.$message({
            message: "保存成功",
            type: "success",
          });
        })
        .catch((msg) => {
          this.$message({
            message: msg,
            type: "error",
          });
        });
    },
    // 提交
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.insertOrUpdate({
            remind: this.form.checked ? 1 : 2,
          });
        } else {
          return false;
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.reminder-settings {
  padding:12px;
}
</style>
