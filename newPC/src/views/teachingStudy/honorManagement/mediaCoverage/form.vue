<template>
  <div class="media-coverage-form">
    <div class="filter-wrapper">
      <el-button @click="$router.back()" size="medium">返回</el-button>
      <el-button type="primary" size="medium" @click="submitForm"
        >保存</el-button
      >
    </div>
    <el-form label-width="150px" ref="form" :model="form" :rules="rules">
      <el-form-item label="标题" prop="reportTitle">
        <el-input
          placeholder="1-50个字符"
          maxlength="50"
          show-word-limit
          v-model.trim="form.reportTitle"
        ></el-input>
      </el-form-item>
      <el-form-item label="媒体类型" prop="mediaType">
        <el-input
          placeholder="1-50个字符"
          maxlength="50"
          show-word-limit
          v-model.trim="form.mediaType"
        ></el-input>
      </el-form-item>
      <el-form-item label="媒体名称" prop="mediaName">
        <el-input
          placeholder="1-50个字符"
          maxlength="50"
          show-word-limit
          v-model.trim="form.mediaName"
        ></el-input>
      </el-form-item>
      <el-form-item label="报道级别" prop="reportLevel">
        <el-select value-key="id" v-model="form.reportLevel">
          <el-option
            :key="idx"
            v-for="(level, idx) in reportLevelList"
            :label="level.value"
            :value="level"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="报道日期" prop="reportDate">
        <el-date-picker
          placeholder="选择日期"
          type="date"
          value-format="yyyy-MM-dd"
          v-model="form.reportDate"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="报道内容" prop="reportContent">
        <el-input
          placeholder="0-500个字符"
          type="textarea"
          maxlength="500"
          show-word-limit
          :rows="5"
          v-model="form.reportContent"
        ></el-input>
      </el-form-item>
      <el-form-item label="上传图片">
        <uploader
          showMode="image"
          showResult="image"
          :multiple="true"
          :value="form.photoList"
          :extList="['png', 'jpg', 'jpeg', 'bmp']"
        ></uploader>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import mixin from "@/mixins/windowResize";
import { mapGetters } from "vuex";
import Uploader from "@/components/Uploader/WebUploader";
import {
  findSchoolDicsByCode,
  getById,
  insert,
  update,
} from "@/api/teachingStudy/honorManagement/mediaCoverage/form";

export default {
  name: "mediaCoverage",
  mixins: [mixin],
  components: {
    Uploader,
  },
  computed: {
    ...mapGetters(["schoolInfo"]),
  },
  data() {
    // 校验报道级别不为空
    const validateReportLevel = (rule, value, callback) => {
      if (!value.code) {
        callback(new Error("请选择报道级别"));
      } else {
        callback();
      }
    };
    // 校验 报道内容 和 图片 不能同时为空
    const validateReportContentAndPhotoList = (rule, value, callback) => {
      if (!this.form.reportContent && !this.form.photoList.length) {
        callback(new Error("报道内容和图片不能同时为空"));
      } else {
        this.$refs["form"].clearValidate("reportContent");
        callback();
      }
    };
    return {
      // 新增 / 编辑
      type: "add",
      // 报道级别列表
      reportLevelList: [],
      // 请求表单
      form: {
        // 媒体报道id
        id: "",
        // 媒体报道标题
        reportTitle: "",
        // 媒体类型
        mediaType: "",
        // 媒体名称
        mediaName: "",
        // 报道级别
        reportLevel: {},
        // 报道日期
        reportDate: this.$moment().format("YYYY-MM-DD"),
        // 报道内容
        reportContent: "",
        // 图片list
        photoList: [],
      },
      // 校验规则
      rules: {
        reportTitle: [
          { required: true, message: "请输入标题", trigger: "blur" },
        ],
        mediaType: [
          { required: true, message: "请输入媒体类型", trigger: "blur" },
        ],
        mediaName: [
          { required: true, message: "请输入媒体名称", trigger: "blur" },
        ],
        reportLevel: [
          { required: true },
          { validator: validateReportLevel, trigger: "change" },
        ],
        reportDate: [
          { required: true, message: "请选择报道日期", trigger: "blur" },
        ],
        reportContent: [
          { validator: validateReportContentAndPhotoList, trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getReportLevel();
  },
  methods: {
    // 报道级别字典
    getReportLevel() {
      findSchoolDicsByCode({
        dicCode: "reportLevel",
        schoolId: this.schoolInfo.id,
      })
        .then((res) => {
          let _res = res.data;
          if (_res.code != 200) return Promise.reject(_res.msg);
          else return _res.data;
        })
        .then((data) => {
          this.reportLevelList = [...data];
          let id = this.$route.query.id;
          if (id) {
            this.type = "edit";
            this.form.id = id;
            this.getById();
          } else this.type = "add";
        });
    },
    // 详情 媒体报道
    getById() {
      getById({
        id: this.form.id,
      })
        .then((res) => {
          let _res = res.data;
          if (_res.code != 200) return Promise.reject(_res.msg);
          else return _res.data;
        })
        .then((data) => {
          this.form.reportTitle = data.reportTitle;
          this.form.mediaType = data.mediaType;
          this.form.mediaName = data.mediaName;
          this.form.reportDate = data.reportDate;
          this.form.reportContent = data.reportContent;
          this.form.photoList = JSON.parse(data.photoJson);
          this.reportLevelList.forEach((level) => {
            if (level.code == data.reportLevelCode)
              this.form.reportLevel = level;
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
          let form = {
            reportTitle: this.form.reportTitle,
            mediaType: this.form.mediaType,
            mediaName: this.form.mediaName,
            reportLevelCode: this.form.reportLevel.code,
            reportLevelName: this.form.reportLevel.value,
            reportDate: this.form.reportDate,
            reportContent: this.form.reportContent,
            photoJson: this.form.photoList,
          };
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
    // 新增 媒体报道
    insert(form) {
      insert(form)
        .then((res) => {
          let _res = res.data;
          if (_res.code != 200) return Promise.reject(_res.msg);
          else return _res.data;
        })
        .then((data) => {
          this.$message({
            message: "新增成功",
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
    // 修改 媒体报道
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
.media-coverage-form {
  padding:12px;
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