<template>
    <div class="campusFeesadd">
        <back-tool>
            <el-button type="primary" size="medium" @click="addReissues(1)">补发</el-button>
        </back-tool>
        <div :style="'overflow: auto;padding-top:20px;height:'+nobottommaxH+'px'"  >
          <div class="body">
              <el-form ref="query" :model="query" label-width="140px" :rules="rules" v-loading="loading">            
                 <el-form-item label="收费方式">
                        <el-radio-group v-model="query.payUserType">
                            <el-radio :label="0">收费金额相同</el-radio>
                            <el-radio :label="1">收费金额不同</el-radio>
                        </el-radio-group>
                </el-form-item>                   
                  <div  v-if="query.payUserType==0">
                    <el-form-item label="收费金额（元）" prop="money">
                    <el-input v-model.trim="query.money" placeholder="请输入收费金额（例如：365.55）" :maxlength="7"></el-input>
                </el-form-item>
                 <el-form-item label="缴费人群"  prop="membersInformation" >
                    <div class="myaddress-box">
                           <address-book v-model="query.membersInformation" :config="configData"></address-book>
                    </div>  
                 </el-form-item>
                </div>   
                  <el-form-item label="缴费模板" v-if="query.payUserType==1">
                      <a :href="downLoadHref"  target="_blank" download="examName"><el-button type="primary" size="medium">交费名单模板下载</el-button></a>
                      </el-form-item>
                <el-form-item label="缴费名单" v-if="query.payUserType==1">
                   <uploader pathPrefix="xiaoyuanshoufei" module="xiaoyuanshoufei" moduleCode="1227" :extList="allFileTypeList" v-model="query.fileJson" :multiple="false"></uploader>
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
import AddressBook from "@/components/AddressBook/indexExpand";
//	返回按钮
import BackTool from "@/components/BackTool";
import Uploader from '@/components/Uploader/WebUploader';
import {
  addReissue
} from "@/api/campusFees";
import mixin from "@/mixins/windowResize";
export default {
  name: "campusFeesadd",
  //引入返回模块
  components: { BackTool, AddressBook, Uploader, },
  data: function() {
    const checkAddressData = (rule, value, callback) => {
      if (
        (value.userJson && value.userJson.length > 0) ||
        (value.departJson && value.departJson.length > 0) ||
        (value.groupJson && value.groupJson.length > 0)
      ) {
        callback();
      } else {
        return callback(new Error("缴费人群不能为空！"));
      }
    };
    return {
      rules: {
        money: [
          {
            required: true,
            message: "请输入收费金额！",
            trigger: "blur"
          },
          {
            pattern: /^[0-9]+([.]{1}[0-9]+){0,1}$/,
            message: "请输入正确的收费金额！",
            trigger: "blur"
          }
        ],
        membersInformation: [
          { required: true, validator: checkAddressData, trigger: "blur" }
        ],
      },
      content:"",
      query: {
        money: "", //	收费金额	number
        payUserType: 0, //	收费方式	number	0所有人收费金额相同 1所有人收费金额不完全相同
        payUserListName: "", //	交费名单	string
        payUserListUrl: "", //	交费名单	string
        membersInformation: {}, //	交费人群	string	数据格式 {"departs":[{"id":"944","name":"总校高二（1）班"}],"users":[],"groups":[]}
        fileJson: [],
        membersInformations: {},
        typeId: "",
        typeName: "",
        chargeType: 1,
        teachers: ""
      },
      downLoadHref:global.BasePath + "chargeNotice/getTemplateDownload?chargeType=" + this.$route.query.num+"&token=" +this.$store.getters.token,
      configData: {
        title: "选择缴费人群",
        depart: this.$route.query.num==1?{
          target: "all",
          departType: "s",
          userTypes: "2",
          group: "show", notCheckSchool: true
        }: {
          target: "all",
          departType: "t",
          userTypes: "1",
          group: "show", notCheckSchool: true
        },
        group: false
      },
      allFileTypeList: ["xls"],
      is: true,
      dialogVisible: false,
      loading: false
    };
  },
  mixins: [mixin],
  created() {
  },
  methods: {   
    //保存
    addReissues() {
      let $this = this;
      let myobj={};
      if (this.query.payUserType == 1) {
        if (this.query.fileJson.length == 0) {
          this.$message({
            type: "warning",
            message: "请上传补交名单！"
          });
          return;
        }
        myobj={
          cid:this.$route.query.id,
          datasource:2,
          data:{
            filename: this.query.fileJson[0].fileName,
            fileurl:this.query.fileJson[0].fileUrl
          },
          reissueName:""
        }
        this.query.membersInformations = {};
        this.query.money = "";
      } else {
        let departIds="";
        let uids="";
        for(let i=0;i<this.query.membersInformation.departJson.length;i++){
          if(i<this.query.membersInformation.departJson.length-1){
            departIds=departIds+this.query.membersInformation.departJson[i].id+",";
          }else{
            departIds=departIds+this.query.membersInformation.departJson[i].id;
          }
        }
        for(let i=0;i<this.query.membersInformation.userJson.length;i++){
          if(i<this.query.membersInformation.userJson.length-1){
            uids=uids+this.query.membersInformation.userJson[i].id+",";
          }else{
            uids=uids+this.query.membersInformation.userJson[i].id;
          }
        }
         myobj={
          cid:this.$route.query.id,
          datasource:1,
          data:this.query.membersInformation,
          reissueName:"",
          uids:uids,
          departIds:departIds,
          fee:this.query.money
        }
      };
     
      this.$refs["query"].validate(valid => {
        if (valid) {
          this.loading = true;
          if (this.is) {
            this.is = false;
            addReissue(myobj)
              .then(res => {
                this.loading = false;
                this.is = true;
                if (res.data.code === 200) {
                  this.$message({
                    type: "success",
                    message: "补发成功!"
                  });
                  this.$router.back();
                }
                if (res.data.code === 1005) {
                  this.dialogVisible = true;
                  this.content = res.data.msg;
                }
              })
              .catch(function() {
                $this.loading = false;
                $this.is = true;
              });
          }
        }
      });
    }
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
  overflow: hidden;
}
</style>
