<template>
<div class="campusCircleeidt"  >
     <div class="top">
         <el-button @click="$router.back()" type="default" size="medium">返回</el-button>
         <el-button type="primary" size="medium"   @click="editCircleTopics(1)">保存</el-button>
         <el-button type="primary" size="medium"   @click="editCircleTopics(2)">发布</el-button>
      </div>
     <div class="subject Dictionariesadd" :style="`height: ${nobottommaxH}px;`">
            <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="140px" class="demo-ruleForm">
            <el-form-item label="圈子主题" prop="title">
              <el-input type="input" v-model.trim="ruleForm.title" placeholder="请输入圈子主题" :maxlength="20"></el-input>
            </el-form-item>
            <el-form-item label="主题封面" >
              <div class="image-upload-container">
                  <div class="image-upload-container__inner">
                    <uploader module="xiaoyuanquan1" moduleCode="2048" ref="coverUploader" pathPrefix="questionnaire" :extList="['bmp', 'png', 'jpg', 'jpeg', 'gif']" showResult="image" showMode="button" v-model="images" :multiple="false"></uploader>
                    <div v-show="images.length !== 0" class="image-upload__delete" @click="deleteCover">删除图片</div>
                  </div>
                  <div class="cover-hint"><i class="el-icon-info"></i>规格建议:360*180</div>
              </div>
             </el-form-item>
              <el-form-item label="圈子图标">
                  <img class="logoUrl" :src="ruleForm.logoUrl" alt="">
                  <el-button type="primary" plain size="small" @click="imgpop=true">切换图标</el-button>
             </el-form-item>
            <el-form-item label="发布范围" prop="addressDataprop">
              <address-book v-model="ruleForm.addressData" :config="teacherConfigData"  :isSchoolManager="true"></address-book>
            </el-form-item>
            <el-form-item label="是否审批" >
               <el-checkbox v-model="ruleForm.needApprove">需要审批</el-checkbox>
             </el-form-item>
            <el-form-item label="截止时间" >
              <el-date-picker :editable="false"   v-model.trim="ruleForm.offDate" type="date" placeholder="请选择截止时间" format="yyyy-MM-dd" />
            </el-form-item>
            <el-form-item class="new-editor" label="圈子介绍" prop="content">
                        <ueditor  class="rich-editor new-editor" ref="ueditor" :defaultMes="ruleForm.content" @editModel="richTextEditHandler"></ueditor>
             </el-form-item>
      </el-form>
     </div>
     <el-dialog title="圈子图标" :close-on-press-escape='false' :close-on-click-modal='false' :visible.sync="imgpop" width="800px" :lock-scroll="false" :modal-append-to-body='false'>
		    <div class="img-list-box">
          <div class="img" v-for="item in logoUrllist" :key="item.id">
            <el-radio v-model="logoCode" :label="item.code" border>
              <img :src="item.remark" alt="">
            </el-radio>
          </div>
        </div>
			<span slot="footer" class="dialog-footer">
				<el-button  @click="imgpop=false">取 消</el-button>
				<el-button type="primary" @click="imgpopfun()">确 定</el-button>
			</span>
		</el-dialog>
</div>
</template>
<script>
import {
  editCircleTopic,
  listValue,
  getSchoolCircleTopicInfoById
} from "@/api/campusCircle";
import mixin from "@/mixins/windowResize";
import moment from "moment";
import AddressBook from "@/components/AddressBook/indexExpand";
import Ueditor from "@/components/Ueditor";
import Uploader from "@/components/Uploader/WebUploader";
import {strToHtml} from '@/utils/utils';
export default {
  components: { AddressBook, Ueditor, Uploader },
  data() {
    const addressDatapropfun = (rule, value, callback) => {
      if (this.ruleForm.addressData.departJson.length) {
        return callback();
      } else {
        return callback(new Error("请选择发布范围"));
      }
    };
    return {
      teacherConfigData: {
        title: "发布范围",
        depart: { target: "depart", departType: "s", userTypes: "2",notCheckSchool:true,isIgnoreDepart:true},
        group: false
      },
      ruleForm: {
        title: "",
        addressData: { departJson: [], groupJson: [], userJson: [] },
        offDate: "",
        content: "",
        departJson: "",
        state: 1,
        logoUrl: "",
        logoCode: "",
        topicLogo: "",
        id: this.$route.query.id,
        needApprove:false
      },
      logoUrllist: [],
      images: [
        {
          fileName: "",
          fileUrl:
            "https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/newbox/xiaoyuanquan.jpg",
          id: ""
        }
      ],
      imgpop: false,
      rules: {
        title: [{ required: true, message: "请输入圈子主题", trigger: "blur" }],
        addressDataprop: [
          { validator: addressDatapropfun, trigger: "change", required: true }
        ],
        content: [
          { required: true, message: "圈子介绍不能为空", trigger: "change" }
        ]
      },
      logoCode: ""
    };
  },
  mixins: [mixin],
  created() {
    this.listValues();
    this.getSchoolCircleTopicInfoByIds();
  },
  methods: {
    getSchoolCircleTopicInfoByIds() {
      getSchoolCircleTopicInfoById(this.ruleForm.id).then(res => {
        let data = res.data.data;
        this.ruleForm.offDate = data.offDate ? data.offDate : "";
        this.ruleForm.needApprove=data.needApprove==1;
        this.ruleForm.title = data.title;
        this.ruleForm.content = strToHtml(data.content);
        this.$refs.ueditor.setContent(this.ruleForm.content);
        this.images  = [{
            fileUrl: data.topicLogo
        }];
        this.ruleForm.logoCode = data.logoCode;
        this.ruleForm.logoUrl = data.logoUrl;
        this.ruleForm.addressData.departJson =
          data.departJson && data.departJson !== ""
            ? JSON.parse(data.departJson)
            : [];
      });
    },
    editCircleTopics(state) {
      if (this.images.length == 0) {
        this.$message({
          message: "请选择封面！",
          type: "warning"
        });
        return;
      }
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.ruleForm.topicLogo = this.images[0].fileUrl;
          this.ruleForm.state = state;
          this.ruleForm.departJson = JSON.stringify(
            this.ruleForm.addressData.departJson
          );
          this.ruleForm.offDate = this.ruleForm.offDate
            ? moment(this.ruleForm.offDate).format("YYYY-MM-DD")
            : "";
          editCircleTopic(this.ruleForm)
            .then(res => res.data)
            .then(data => {
              if (data.result) {
                this.$message({
                  message: "操作成功！",
                  type: "success",
                  duration: 1000
                });
                this.loading = false;
                this.$router.back();
              }
            })
            .catch(() => {});
        }
      });
    },
    imgpopfun() {
      this.ruleForm.logoCode = this.logoCode;
      this.imgpop = false;
      for (let i = 0; i < this.logoUrllist.length; i++) {
        if (this.logoCode == this.logoUrllist[i].code) {
          this.ruleForm.logoUrl = this.logoUrllist[i].remark;
        }
      }
    },
    deleteCover() {
      this.images = [];
    },
    richTextEditHandler(content) {
      this.ruleForm.content = content;
    },
    listValues() {
      listValue()
        .then(res => res.data)
        .then(data => {
          this.logoUrllist = data.data.dataList;
        });
    }
  }
};
</script>

<style>
.campusCircleeidt .upload-block-container,
.campusCircleeidt .upload-file-item {
  height: 90px !important;
  width: 180px !important;
}
.campusCircleeidt .icon--block-del {
  display: none !important;
}
.campusCircleeidt .image-upload__delete {
  height: 40px;
  line-height: 40px;
  background-color: #409efe;
  color: #fff;
  text-align: center;
  position: absolute;
  bottom: 0;
  width: 100%;
  cursor: pointer;
}
.campusCircleeidt .upload-file-item img {
  width: 100% !important;
  height: 100% !important;
  border: 1px dashed #409eff;
  margin: 0 !important;
}
</style>
<style lang="scss" scoped>
.campusCircleeidt {
  padding:12px;
  .top {
    border-bottom: 1px solid #e7eaec;
    padding-bottom: 10px;
  }
  .img-list-box {
    overflow: hidden;
    .img {
      float: left;
      position: relative;
      margin: 8px;
      img {
        width: 100px;
        height: 100px;
        border-radius: 50%;
      }
      .el-radio.is-bordered {
    height: 130px;
}
    }
  }
  .subject {
    padding-top: 10px;
    overflow: auto;
    .demo-ruleForm {
      width: 810px;
      margin: 0 auto;
      .logoUrl {
        width: 80px;
        float: left;
        margin-right: 10px;
      }
      .image-upload-container {
        display: inline-block;
        vertical-align: top;
        .image-upload-container__inner {
          position: relative;
        }
        .cover-hint {
          position: relative;
          margin-top: 5px;
          font-size: 12px;
          i {
            margin-right: 5px;
          }
        }
      }
    }
  }
}
</style>
