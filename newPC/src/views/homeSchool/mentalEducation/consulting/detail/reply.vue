<template>
  <div class="mental-education-consulting-detail-reply">
    <el-row>
      <el-col :span="24">
        <el-button @click="$router.back()" size="medium">返回</el-button>
        <el-button type="primary" size="medium" @click="submitForm"
          >提交</el-button
        >
      </el-col>
    </el-row>

    <el-form
      label-width="150px"
      ref="form"
      :model="form"
      :rules="rules"
      :style="{ height: nobottommaxH - 10 + 'px' }"
    >
      <el-form-item label="" prop="content">
        <el-input
          placeholder="请输入回复内容"
          type="textarea"
          maxlength="5000"
          show-word-limit
          :rows="10"
          v-model="form.content"
        ></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
/* utils */
import mixin from "@/mixins/windowResize";
import { mapGetters } from "vuex";

/* components */

/* api */
import { addHeartEduConsultReply } from "@/api/homeSchool/mentalEducation/consulting/detail/reply";

export default {
  name: "mentalEducationConsultingDetailReply",
  mixins: [mixin],
  components: {},
  computed: {
    ...mapGetters(["userInfo"]),
  },
  data() {
    return {
      messsage: "回复成功",
      // 咨询id
      consultId: this.$route.query.consultId,
      // 请求表单
      form: {
        content: "",
      },
      rules: {
        content: [
          {
            required: true,
            message: "请输入回复内容",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {},
  methods: {
    addHeartEduConsultReply(form) {
      addHeartEduConsultReply(form)
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
        });
    },
    // 提交
    submitForm() {
      this.form.content = this.form.content.trim();
      this.$refs["form"].validate((valid) => {
        if (valid) {
          let form = {
            type: 2,
            consultId: this.consultId,
            content: this.form.content,
            photoJson: [],
            voiceJson: [],
          };
          this.addHeartEduConsultReply(form);
        } else {
          return false;
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.mental-education-consulting-detail-reply {
  padding:12px;

  .el-col {
    border-bottom: 1px solid #e7eaec;
    padding-bottom: 10px;
    margin-bottom: 10px;
  }

  .el-form {
    width: 810px;
    margin: 0 auto;
    overflow: auto;
  }
}
</style>