<template>
    <div class="campusFeesadd">
        <back-tool>
           
        </back-tool>
        <div :style="'overflow: auto;padding-top:20px;height:'+nobottommaxH+'px'"  >
          <div class="body">
              <el-form ref="query" label-width="140px" :rules="rules" v-loading="loading">           
                     <el-form-item label="退款名称" >
                    <el-input v-model.trim="uploadData.refundname" placeholder="请输入退款名称" :maxlength="30"></el-input>
                </el-form-item>
                   <el-form-item label="退款模板" >
                      <a :href="downLoadHref"  target="_blank" download="examName"><el-button type="primary" size="medium">退款模板下载</el-button></a>
                      </el-form-item>
                   <el-form-item label="退费名单" >
                   <el-upload
                      class="upload-import"
                      :action="uploadPath"
                      :data="uploadData"
                      :show-file-list='false'
                      accept=".xls"
                      :before-upload="beforeAvatarUpload"
                      :on-success="handleAvatarSuccess"
                    >
                      <el-button
                        type="primary"
                        size="medium"
                      >导入退款</el-button>
                        </el-upload> 
                </el-form-item>      
            </el-form>
          </div>            
        </div>
            <el-dialog  title="补发提示内容" :visible.sync="dialogVisible" >
            <div class="content-box" v-html="content"></div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import BackTool from "@/components/BackTool";
import {
  addReissue
} from "@/api/campusFees";
import mixin from "@/mixins/windowResize";
export default {
  name: "campusFeesadd",
  //引入返回模块
  components: { BackTool },
  data: function() {
   
    return {
      content:"",
      fileJson:[],
      downLoadHref:
      global.BasePath + "chargeNotice/refundtTemplateDownload?chargeId=" +  this.$route.query.id +  "&token=" +  this.$store.getters.token,     
      allFileTypeList: ["xls"],
      is: true,
      dialogVisible: false,
      loading: false,
      uploadPath: global.BasePath + "chargeNotice/updateBatchRefund",
      uploadData: {
        cid: this.$route.query.id,
        token: this.$store.getters.token,
        chargeType: this.$route.query.num,
        refundname:""
        
      },
    };
  },
  mixins: [mixin],
  created() {
  },
  methods: {   
    //导入
    handleAvatarSuccess(res) {
      if (res.code == 200) {
        this.$message({
          message: "导入成功，共导入"+res.data.total+"条！",
          type: "success"
        });
         this.$router.back();
      } else {
        this.dialogVisible = true;
        this.content = res.msg;
      }
      this.loading=false;
    },
    beforeAvatarUpload(file) {
         if (!this.uploadData.refundname) {
        this.$message.error("退款名称不能为空!");
        return false;
      } 
      let suffix = file.name.split(".")[file.name.split(".").length - 1];
      if (suffix !== "xls") {
        this.$message.error("请上传后缀为.xls的模版文件!");
        return false;
      } 
      this.loading=true;
    },
  }
};
</script>
<style scoped>
.campusFeesadd {
  padding:12px;
}
.body{
  width: 810px;
  margin: 0 auto;
}
</style>
