<template>
    <div  class="backbone">
           <back-tool >
               <el-button size="medium" class="filter-item" type="primary" @click="addStudentLeave">保存</el-button>
           </back-tool>
           <div class="mainWrap" :style="`height:${boxH-110}px`">
                    <el-form :model="ruleForm" ref="ruleForm" :rules="rules" label-width="200px" class="demo-ruleForm">                        
                          <el-form-item label="教师骨干类别" prop="userType" >
                                <el-select v-model="ruleForm.userType" >
                                    <el-option :label="item.name" :value="item.code" v-for="item in userTypelist" :key="item.code"></el-option>
                                </el-select>
                            </el-form-item>   
                            <el-form-item label="骨干类型" prop="backboneType" v-if="ruleForm.userType>100">
                                <el-select v-model="ruleForm.backboneType">
                                    <el-option :label="item.name" :value="item.code" v-for="item in backboneTypelist" :key="item.code"></el-option>
                                </el-select>
                            </el-form-item>                           
                            <el-form-item label="骨干评定时间" prop="backboneTypeDate" v-if="ruleForm.userType>100">
                               <el-date-picker
                                        v-model="ruleForm.backboneTypeDate"
                                        type="date"
                                        :clearable="false"
                                        placeholder="选择骨干评定时间">
                                    </el-date-picker>
                            </el-form-item>
                            
                            <el-form-item label="骨干证书图片" v-if="ruleForm.userType>100">
                               <uploader pathPrefix="renlian" module="renlian" moduleCode="20190509" useSysBucket :multiple="false" v-model="files" :extList="['jpeg', 'jpg', 'bmp', 'gif', 'png']" showMode="image" showResult="image"></uploader>
                             </el-form-item>
                    </el-form>
           </div>
    </div>
</template>

<script>
import BackTool from "@/components/BackTool";
import mixin from "@/mixins/windowResize";
import moment from "moment";
import Uploader from '@/components/Uploader/WebUploader';
import {
  getUserBackboneInfo,
  saveBackbone,
  getTeacherTypeList,
  getBackboneTypeList
} from "@/api/faceManage";
export default {
  components: {
    BackTool,Uploader
  },
  data() {
    return {    
      files: [],
      userTypelist: [],
      backboneTypelist: [],
      ruleForm: {
        backboneType: "", //骨干类型	string
        backboneTypeDate: "", //	骨干评定时间	string
        certificateFileId: "", //	证书文件ID	number
        certificateFileUrl: "", //	证书路径	string
        id: 0, //	主键ID	number	新增时可不传
        userId: this.$store.getters.userInfo.id, //	人员ID	number
        userType: "100" //	人员类别 普通教师100 骨干教师200	string
      },

      // 校验
      rules: {
        // 教师骨干类别
        userType: [
          {
            required: true,
            message: "请选择教师骨干类别", //规则提示
            trigger: "change" //何事件触发
          }
        ],
        // 骨干类型
        backboneType: [
          {
            required: true,
            message: "请选择骨干类型", //规则提示
            trigger: "change" //何事件触发
          }
        ],
        //骨干评定时间
        backboneTypeDate: [
          {
            required: true,
            message: "选择骨干评定时间", //规则提示
            trigger: "blur" //何事件触发
          }
        ]
      }
    };
  },
  mixins: [mixin],
  created() {
    this.getUserBackboneInfos();
    this.getBackboneTypeLists();
    this.getTeacherTypeLists();
  },
  methods: {
    //获取骨干信息
    getUserBackboneInfos() {
      getUserBackboneInfo(this.$store.getters.userInfo.id)
        .then(res => {
          let data = res.data.data;
          if (data.id) {
            this.ruleForm.userType = data.userType;
            this.ruleForm.id = data.id;
            if (data.userType == "200") {
              this.ruleForm.backboneTypeDate = data.backboneTypeDate;
              this.ruleForm.backboneType = data.backboneType;
              this.files = [  {fileUrl:data.certificateFileUrl,fileName:data.certificateFileUrl.split('/')[data.certificateFileUrl.split('/').length-1]}];
            }
          }
        })
        .catch(() => {});
    },
    //获得教师类别列表
    getTeacherTypeLists() {
      getTeacherTypeList()
        .then(res => {
          let data = res.data.data;
          this.userTypelist = data;
        })
        .catch(() => {});
    },
    //获得骨干教师类型列表
    getBackboneTypeLists() {
      getBackboneTypeList()
        .then(res => {
          let data = res.data.data;
          this.backboneTypelist = data;
        })
        .catch(() => {});
    },
 
   

    // 保存
    addStudentLeave() {
      if (this.ruleForm.userType == "200") {
        if (this.files.length == 0) {
          this.$message.error("上传骨干证书图片！");
          return false;
        };
        this.ruleForm.certificateFileId = '';
        this.ruleForm.certificateFileUrl = this.files[0].fileUrl;
        if(this.ruleForm.backboneTypeDate){
             this.ruleForm.backboneTypeDate = this.$moment( this.ruleForm.backboneTypeDate).format("YYYY-MM-DD");
        };
      };
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          this.$confirm("确认保存吗？", "提示").then(() => {
            saveBackbone(this.ruleForm)
              .then(res => {
                if (res.data.code === 200) {
                  this.$message({
                    type: "success",
                    message: "保存成功!"
                  });
                  this.$router.push({ path: "personalInfoIndex" });
                } else {
                  this.$message({
                    type: "error",
                    message: res.data.msg
                  });
                }
              })
              .catch(function() {});
          });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.backbone {
  padding:12px;
  box-sizing: border-box;
  .mainWrap {
    overflow: auto;
    padding: 20px 10px;
  }
  .el-date-editor.el-input,
  .el-select {
    width: 500px;
  }
}
</style>
