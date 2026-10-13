<template>
  <div class="addMemorabilia">
    <div class="el-row menu-tools">
      <el-button size="medium" @click="$router.back()">返回</el-button>
      <el-button
        type="primary"
        size="medium"
         
        :loading="save_loading"
        @click="saveHandler(0)"
      >保存草稿</el-button>
      <el-button
        type="primary"
        :loading="up_loading"
        size="medium"
         
        @click="saveHandler(1)"
      >上报</el-button>
    </div>
    <div class="main-wrap scrollBar" :style="{'height':nobottommaxH+'px'}">
      <div class="body">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="140px"
          class="demo-ruleForm"
        >
          <el-form-item label="部门" prop="departCode">
            <el-select v-model="ruleForm.departCode" placeholder="请选择部门" @change="changeDepart">
              <el-option
                v-for="departItem in departList"
                :key="departItem.id"
                :label="departItem.name"
                :value="departItem.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="时间" prop="happenTimeStr">
            <el-date-picker
              v-model="ruleForm.happenTimeStr"
              type="date"
              class="date-width"
              :clearable="false"
              placeholder="请选择日期时间"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="事件" prop="desc">
            <el-input
              type="textarea"
              :rows="4"
              placeholder="日期、地点、主要参与人物、事件概述、取得成就或评价"
              v-model="ruleForm.desc"
            ></el-input>
          </el-form-item>
          <el-form-item label="上传图片">
            <uploader
              pathPrefix="memorabilia"
              multiple
              v-model="files"
              :extList="['jpeg', 'jpg', 'bmp', 'gif', 'png']"
              showMode="image"
              showResult="image"
            ></uploader>
          </el-form-item>
          <el-form-item
            label="行政巡查"
            prop="administrativeInspectionContent"
            v-if="isAdministrativeInspection == 1"
          >
            <el-input
              type="textarea"
              :rows="4"
              placeholder="请输入行政巡查内容"
              v-model="ruleForm.administrativeInspectionContent"
            ></el-input>
          </el-form-item>
          <el-form-item label="上传图片" v-if="isAdministrativeInspection == 1">
            <uploader
              pathPrefix="memorabilia"
              multiple
              v-model="administrativeInspectionPicJson"
              :extList="['jpeg', 'jpg', 'bmp', 'gif', 'png']"
              showMode="image"
              showResult="image"
            ></uploader>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import mixin from "@/mixins/windowResize";
import Uploader from "@/components/Uploader/WebUploader";
import {
  findDepartList,
  addBigEventNote,
  getBySchoolId,
} from "@/api/memorabilia";
export default {
  components: {
    Uploader,
  },
  data() {
    return {
      UploadPath: global.BasePath + "common/addImageUp", //图片上传路径
      departList: [],
      ruleForm: {
        departCode: "",
        departName: "",
        desc: "",
        happenTimeStr: this.$moment().format("YYYY-MM-DD"),
        administrativeInspectionContent: "",
      },
      rules: {
        departCode: [
          {
            required: true,
            message: "部门不能为空", //规则提示
            trigger: "change", //何事件触发
          },
        ],
        happenTimeStr: [
          {
            required: true,
            message: "请假日期不能为空", //规则提示
            trigger: "change", //何事件触发
          },
        ],
        desc: [
          {
            required: true,
            message: "事件不能为空", //规则提示
            trigger: "blur", //何事件触发
          },
        ],
        administrativeInspectionContent: [
          {
            required: true,
            message: "行政巡查内容不能为空", //规则提示
            trigger: "blur", //何事件触发
          },
        ],
      },
      exhibitionImg: [],
      save_loading: false,
      up_loading: false,
      files: [],
      // 是否行政巡查 1:是 2:否
      isAdministrativeInspection: 2,
      administrativeInspectionPicJson: [],
    };
  },
  created() {
    this.findDepartListFunc();
    this.getBySchoolId();
  },
  mixins: [mixin],
  mounted() {},
  computed: {
    ...mapGetters(["userInfo"]),
  },
  methods: {
    changeDepart(val) {
      //切换部门
      this.ruleForm.departCode = val;
      let departItem = this.departList.find((item) => item.id == val);
      this.ruleForm.departName = departItem.name;
    },
    // handleRemove(file) {
    //     let key=file.response.data.id;
    //     this.exhibitionImg.forEach((item,index)=>{
    //         if(item.id==key){
    //             this.exhibitionImg.splice(index,1);
    //         }
    //     })
    // },
    // handleSuccess(res){
    //   let data=res.data;
    //   this.exhibitionImg.push({
    //       fileid:data.fileid,
    //       id:data.id,
    //       accessUrl:data.url
    //   })
    // },
    // beforeAvatarUpload(file) {
    //   if (['image/jpeg', 'image/bmp', 'image/gif', 'image/png'].indexOf(file.type) === -1) {
    //       this.$message.error('上传图片仅支持.jpg .jpeg .gif .png .bmp图片格式！');
    //       return false;
    //   }
    //   return true;
    // },
    saveHandler(state) {
      this.ruleForm.desc = this.ruleForm.desc.trim();
      this.ruleForm.administrativeInspectionContent = this.ruleForm.administrativeInspectionContent.trim();
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          const files = this.files.map((item) => item.fileUrl);
          const administrativeInspectionPicJson = this.administrativeInspectionPicJson.map(
            (item) => item.fileUrl
          );
          // let picList=this.exhibitionImg.map(item=>item.accessUrl);
          if (state == 0) {
            this.save_loading = true;
          } else if (state == 1) {
            this.up_loading = true;
          }
          let params = {
            departId: this.ruleForm.departCode,
            departName: this.ruleForm.departName,
            desc: this.ruleForm.desc,
            happenTimeStr: this.$moment(this.ruleForm.happenTimeStr).format(
              "YYYY-MM-DD"
            ),
            state: state,
            picUrlJson: files,
            isAdministrativeInspection: this.isAdministrativeInspection,
          };
          if (this.isAdministrativeInspection == 1) {
            params.administrativeInspectionContent = this.ruleForm.administrativeInspectionContent;
            params.administrativeInspectionPicJson = administrativeInspectionPicJson;
          }
          addBigEventNote(params)
            .then((res) => res.data)
            .then((data) => {
              if (data.code === 200) {
                if (state == 0) {
                  this.$message({
                    type: "success",
                    message: "保存草稿成功!",
                  });
                } else {
                  this.$message({
                    type: "success",
                    message: "上报成功!",
                  });
                }
                this.$router.push({ path: "memorabiliaList" });
              } else {
                this.$message({
                  type: "error",
                  message: data.msg,
                });
                this.save_loading = false;
                this.up_loading = false;
              }
            })
            .catch(() => {
              this.save_loading = false;
              this.up_loading = false;
            });
        }
      });
    },
    findDepartListFunc() {
      //那部门
      findDepartList({
        isReporter: true,
      }).then((res) => {
        this.departList = res.data;
        this.ruleForm.departCode = this.departList[0].id;
        this.ruleForm.departName = this.departList[0].name;
      });
    },
    getBySchoolId() {
      getBySchoolId()
        .then((res) => {
          let _res = res.data;
          if (_res.code != 200) return Promise.reject(_res.msg);
          else return _res.data;
        })
        .then((data) => {
          this.isAdministrativeInspection = data.isAdministrativeInspection;
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
.scrollBar {
  overflow-x: hidden;
  overflow-y: auto;
  &::-webkit-scrollbar-track-piece {
    background: #d3dce6;
  }
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: #99a9bf;
    border-radius: 20px;
  }
}
.clearfix:after {
  content: "";
  height: 0;
  display: block;
  clear: both;
  visibility: hidden;
}

ul,
li {
  list-style: none;
}
.addMemorabilia {
  padding:12px;
  box-sizing: border-box;
}
.body {
  width: 810px;
  margin: 0 auto;
}
.menu-tools {
  border-bottom: 1px solid #e7eaec;
  padding-bottom: 10px;
}
.main-wrap {
  padding-top: 20px;
}
.demo-ruleForm {
  width: 810px;
  .el-select,
  .date-width {
    width: 100%;
  }
}
</style>
