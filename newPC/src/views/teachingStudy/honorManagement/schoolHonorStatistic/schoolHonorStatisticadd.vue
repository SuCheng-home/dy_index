<template>
  <div class="media-coverage-form">
    <div class="filter-wrapper">
      <el-button @click="$router.back()" size="medium">返回</el-button>
      <el-button type="primary" size="medium" @click="submitForm"
        >保存</el-button
      >
    </div>
    <el-form label-width="150px" ref="form" :model="form" :rules="rules">
      <el-form-item label="荣誉名称" prop="certificateName">
        <el-input
          placeholder="1-50个字符"
          maxlength="50"
          show-word-limit
          v-model.trim="form.certificateName"
        ></el-input>
      </el-form-item>
       <el-form-item label="项目名称" prop="prejectName">
        <el-input
          placeholder="1-50个字符"
          maxlength="50"
          show-word-limit
          v-model.trim="form.prejectName"
        ></el-input>
      </el-form-item>
       <el-form-item label="证书级别" prop="certificateLevelName">
        <el-select value-key="id" v-model="form.certificateLevelName">
          <el-option
            :key="idx"
            v-for="(level, idx) in certificateLevelList"
            :label="level.text"
            :value="level.text"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="颁布时间" prop="issueTime">
        <el-date-picker
          placeholder="选择日期"
          type="date"
          value-format="yyyy-MM-dd"
          v-model="form.issueTime"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="发布机构" prop="issueGroupName">
        <el-input
          placeholder="1-50个字符"
          maxlength="50"
          show-word-limit
          v-model.trim="form.issueGroupName"
        >
      
       <el-select v-model="form.issueGroupName" slot="append" placeholder="请选择">
       <el-option
            :key="idx"
            v-for="(level, idx) in issueGroupList"
            :label="level.text"
            :value="level.text"
          ></el-option>
    </el-select>
        </el-input>
      </el-form-item>
      <el-form-item label="证书图片" class="is-required">
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
import {addSchoolHonor, updateSchoolHonor} from "@/api/teachingStudy/honorManagement/schoolHonorStatistic/index";
import { findSchoolDicsByCodeStructure } from '@/api/common/common'
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
    return {
      form: {
        id: this.$route.query.honorId,      
        certificateLevelCode: '',
        certificateLevelName: '',       
        certificateName: '',
        issueGroupId: '',
        issueGroupName: '',
        issueTime: '',
        prejectName: '',  
        photoList: [],       
      },
      issueGroupList: [],      
      certificateLevelList: [],      
      // 校验规则
      rules: {
        certificateName: [
          { required: true, message: "请输入荣誉名称", trigger: "blur" },
        ],
        prejectName: [
          { required: true, message: "请输入项目名称", trigger: "blur" },
        ],
        certificateLevelName: [
          { required: true, message: "请选择证书级别", trigger: "change" },
        ],
        issueGroupName: [
          { required: true, message: "请输入颁布机构", trigger: "blur" },
        ],        
        issueTime: [
          { required: true, message: "请选择颁布时间", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.findSchoolDicsByCodeStructure();
    if (this.form.id && sessionStorage.getItem('honorInfo')) {
        this.form = JSON.parse(sessionStorage.getItem('honorInfo'));
        this.form.photoList=JSON.parse(this.form.photoJson)
         for(let i=0;i< this.form.photoList.length;i++){
          if(!this.form.photoList[i].fileUrl){
               this.form.photoList[i].fileUrl= this.form.photoList[i].photoUrl
          }
        }
    }
  },
  methods: {
       findSchoolDicsByCodeStructure() {
        findSchoolDicsByCodeStructure({dicCode: 'school_certificate_level'}).then(res => res.data).then(data => {
          if (data.code === 200 && data.result) {
            this.certificateLevelList = data.data.map(i=>{
              i.text = i.value;
              return i;
            });
          }
        }).catch(() => {});
        findSchoolDicsByCodeStructure({dicCode: 'school_issue_group'}).then(res => res.data).then(data => {
          if (data.code === 200 && data.result) {
            this.issueGroupList = data.data.map(i=>{
              i.text = i.value;
              return i;
            });
          }
        }).catch(() => {});
      },
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
            for(let i=0;i<this.certificateLevelList.length;i++){
                if(this.form.certificateLevelName==this.certificateLevelList[i].value){
                    this.form.certificateLevelCode=this.certificateLevelList[i].code
                }
            }
            if(!this.form.photoList.length){
               this.$message({
            message: '请上传证书图片',
            type: "error",
          });
          return;
            }
            for(let i=0;i<this.form.photoList.length;i++){
              this.form.photoList[i].photoUrl=this.form.photoList[i].fileUrl;
            }
          let form = {
                awardLevelCode: '',
                awardLevelName: '',
                certificateLevelCode: this.form.certificateLevelCode,
                certificateLevelName: this.form.certificateLevelName,
                certificateName: this.form.certificateName,
                certificateTypeCode: '',
                certificateTypeName: '',
                issueGroupId: this.form.issueGroupId,
                issueGroupName: this.form.issueGroupName,
                issueTime: this.form.issueTime,
                photoJson: this.form.photoList,
                prejectName: this.form.prejectName
            };
          if (!this.form.id) {
            this.addSchoolHonor(form);
          } else {
            form.id = this.form.id;
            this.updateSchoolHonor(form);
          }
        } else {
          return false;
        }
      });
    },
    // 新增 媒体报道
    addSchoolHonor(form) {
      addSchoolHonor(form)
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
    updateSchoolHonor(form) {
      updateSchoolHonor(form)
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