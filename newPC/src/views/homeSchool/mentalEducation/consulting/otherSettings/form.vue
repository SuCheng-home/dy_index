<template>
  <div class="mental-education-consulting-otherSettings-form">
    <el-row>
      <el-col :span="24">
        <el-button @click="$router.back()" size="medium">返回</el-button>
        <el-button type="primary" size="medium" @click="submitForm"
          >保存</el-button
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
      <div class="detail-title">咨询时间设置</div>
      <el-form-item label="开放咨询日期">
        <el-checkbox-group v-model="form.weekDays">
          <el-checkbox :label="1">周一</el-checkbox>
          <el-checkbox :label="2">周二</el-checkbox>
          <el-checkbox :label="3">周三</el-checkbox>
          <el-checkbox :label="4">周四</el-checkbox>
          <el-checkbox :label="5">周五</el-checkbox>
          <el-checkbox :label="6">周六</el-checkbox>
          <el-checkbox :label="7">周日</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="开放时间" prop="timeRange">
        <el-time-picker
          is-range
          size="medium"
          range-separator="-"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          value-format="HH:mm"
          :clearable="false"
          :picker-options="{
            format: 'HH:mm',
          }"
          v-model="form.timeRange"
        ></el-time-picker>
      </el-form-item>
      <div class="detail-title">
        信息展示设置<span class="danger">（勾选展示，不勾选则不展示）</span>
      </div>
      <el-form-item label="">
        <el-checkbox v-model="form.isShowName" :false-label="1" :true-label="2"
          >学生姓名</el-checkbox
        >
        <el-checkbox v-model="form.isShowGrade" :false-label="1" :true-label="2"
          >学生所在年级</el-checkbox
        >
        <el-checkbox
          v-model="form.isShowReplayName"
          :false-label="1"
          :true-label="2"
          >回复人姓名</el-checkbox
        >
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
/* utils */
import mixin from "@/mixins/windowResize";
import { timeIgnoreSecond } from "@/filters";

/* components */

/* api */
import {
  getHeartEduInit,
  addAndUpdateHeartEduInit,
} from "@/api/homeSchool/mentalEducation/consulting/otherSettings/form";

export default {
  mixins: [mixin],
  components: {},
  computed: {},
  data() {
    return {
      // 新增 / 编辑
      type: "add",
      // 保存成功后提示语
      messsage: "保存成功",
      // 请求表单
      form: {
        // 周几，用“,”分割，1代表周日,2代表周二，依次类推
        weekDays: [],
        // 日期范围
        timeRange: ["", ""],
        // 是否展示学生年级，1不展示，2展示
        isShowGrade: 1,
        // 是否展示学生姓名，1不展示，2展示
        isShowName: 1,
        // 	是否展示回复人姓名，1不展示，2展示
        isShowReplayName: 1,
      },
      rules: {
        timeRange: [
          {
            type: "array",
            required: true,
            message: "请选择开放时间范围",
            trigger: "change",
          },
        ],
      },
    };
  },
  created() {
    this.getHeartEduInit();
  },
  methods: {
    // 提交
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          let form = {
            weekDays: this.form.weekDays.sort((a, b) => a - b),
            startTime: this.form.timeRange[0] + ":00",
            endTime: this.form.timeRange[1] + ":00",
            isShowGrade: this.form.isShowGrade,
            isShowName: this.form.isShowName,
            isShowReplayName: this.form.isShowReplayName,
          };
          this.addAndUpdateHeartEduInit(form);
        } else {
          return false;
        }
      });
    },
    getHeartEduInit() {
      getHeartEduInit()
        .then((res) => {
          let _res = res.data;
          if (_res.code != 200) return Promise.reject(_res.msg);
          else return _res.data;
        })
        .then((data) => {
          if (data) {
            this.form.weekDays = JSON.parse(data.weekDays || "[]");
            if (data.startTime)
              this.form.timeRange = [
                timeIgnoreSecond(data.startTime),
                timeIgnoreSecond(data.endTime),
              ];
            this.form.isShowGrade = data.isShowGrade || 1;
            this.form.isShowName = data.isShowName || 1;
            this.form.isShowReplayName = data.isShowReplayName || 1;
          }
        });
    },
    addAndUpdateHeartEduInit(form) {
      addAndUpdateHeartEduInit(form)
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
  },
};
</script>
<style lang="scss" scoped>
.mental-education-consulting-otherSettings-form {
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

    .detail-title {
      width: 810px;
      margin: 22px auto 14px;
      border-left: 4px solid #409eff;
      padding-left: 12px;
      height: 16px;
      line-height: 16px;
      font-size: 15px;
      color: #676a6c;
      .danger {
        color: #f56c6c;
      }
    }

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