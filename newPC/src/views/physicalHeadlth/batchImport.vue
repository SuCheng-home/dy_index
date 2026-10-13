<template>
  <div class="batchImport padding addTabSwitch" >
    <div class="botton" v-if="isStandalone">
        <span @click="jumpPage('fitnessList')" >数据汇总</span>
        <span class="tab-left tabcolor">批量导入</span>
        <span  @click="jumpPage('itemEnter')">按项录入</span>
        <span class="tab-right" @click="jumpPage('studentEnter')">按学生录入</span>
    </div> 
    <div class="main-wrap">
      <div class="title">说明：</div>
      <ul class="introduct clearfix">
        <li>1、导入的数据为国家体质考评网上导出的数据格式经过编辑得到。</li>
        <li>2、文件格式请保存成CSV格式</li>
        <li>3、用户优先按照姓名进行匹配，若有重名再根据学籍号匹配</li>
        <li>4、导入前请先选择要导入的数据是哪个学年，哪个学期的考核结果。</li>
        <li>5、导入失败的数据请下载下来查看</li>
        <li>
          <a :href="moduleDown" class="moduleDown" download="模板下载" target="_blank">
            <i class="el-icon-download"></i>
              模板下载
          </a>
        </li>
      </ul>
      <div>
        <el-form class="batchForm" ref="form"  label-width="100px">
          <el-form-item class="required"  label="请选择学年">
            <el-select size="medium" disabled="disabled" v-model="schoolYearCode" placeholder="请选择学年" @change="changeSchoolYear">
                <el-option v-for="item in schoolYearList" :key="item.id" :label="item.year" :value="item.id">
                </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="required"  label="选择">
            <div class="clearfix">
            <div id="fileBox" v-if="fileName">
                <div class="for-box clearfix"><span class="upload-img"></span><span class="file-name" >{{fileAllName}}</span></div>
            </div>
            <a href="javascript:;" class="file">上传附件
                <input ref="fileUpload" type="file" name="" id="fileUpload" @change="uploadFile">
            </a>
            </div>
          </el-form-item>
          <el-form-item class="required" label="" v-if="controlBtn">
            <el-button type="primary" size="medium"  @click="importHandler">导入</el-button>
          </el-form-item>
          <div class="errInfoWrap" v-if="errMsg">
            <p>本次导入共计：{{totalCount}}人</p>
            <p>成功导入：{{totalCount-errorCount}}人</p>
            <p>导入失败：{{errorCount}}人</p>
            <a href="javascript:;" class="moduleDown" @click="dialogVisible=true">
                查看导入失败信息
            </a>
          </div>
          <div class="errInfoWrap" v-if="success">
            <p>本次导入共计：{{totalCount}}人</p>
            <p>成功导入：{{totalCount-errorCount}}人</p>
            <p>导入失败：{{errorCount}}人</p>
          </div>
        </el-form>
      </div>
    </div>
    <el-dialog
      title="导入失败信息"
      :visible.sync="dialogVisible">
      <span class="dia-content" v-html='errMsg.replace(/;/g,"<br/>")'></span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import mixins from '@/mixins/windowResize';
import {mapGetters} from 'vuex';
import {getSchoolYear,getCurrentSchoolTimeBySchoolId,uploadScore} from '@/api/physicalHeadlth/index';
import axios from 'axios';
export default {
  data(){
    return{
      moduleDown:'',
      schoolYearName:'',
      schoolYearCode:'',
      schoolYearList:[],
      listLoading:false,
      uploadFilePath:"",
      schoolYear:'',
      file:null,
      fileName:'',
      fileAllName:'',
      errMsg:'',
      errorCount:null,
      totalCount:null,
      moduleDownError:'',
      controlBtn:false,
      success:false,
      dialogVisible:false
    }
  },
  created(){
    this.moduleDown=global.BasePath+'structure/schoolFitnessTest/download?token='+ this.$store.getters.token;
    this.uploadFilePath=global.BasePath + 'common/uploadFilesUp';
    //获取学年
    this.getSchoolYearFunc();
  },
  mounted(){
    
  },
  computed: {
      ...mapGetters([
          'userInfo',
          'isStandalone'
      ])
  },
  mixins:[mixins],
  methods:{
    jumpPage(path,query={}){
      this.$router.push({
          path,
          query
      })
    },
    uploadFile(e){
      this.controlBtn=true;
      this.file=e.target.files[0];
     if(this.file){
       this.fileAllName=this.file.name;
        this.fileName=this.file.name.split(".")[this.file.name.split(".").length-1];
        if(this.fileName!=="csv"){
          this.$message.error("请上传后缀为.csv的模版文件!");
          return false;
        }else {
          event.target.value = '';
        }
     }
    },
    importHandler(){
      this.controlBtn=false;
      var fd = new FormData();
      fd.append('file',this.file);
      fd.append("schoolYear",this.schoolYear);
      fd.append("token",this.$store.getters.token);
      let config = {
        headers: {
        'Content-Type': 'multipart/form-data'
        }
      };
      axios.post(global.BasePath+"structure/schoolFitnessTest/uploadScore",fd,config).then(res=>res.data)
      .then(data=>{
        if(data.code===200){
          let errData=data.data;
          this.errMsg=errData.errMsg;
          if(this.errMsg){
            this.errorCount=errData.errorCount;
            this.totalCount=errData.totalCount;
            //this.moduleDownError=global.BasePath+'structure/schoolFitnessTest/downloadErrorMsg?token='+ this.$store.getters.token+'&errMsgStr='+this.errMsg;
            this.success=false;
          }else if(!this.errMsg){
            this.errorCount=errData.errorCount;
            this.totalCount=errData.totalCount;
            this.success=true;
          }
        }
      }).catch(()=>{})
    },
    handleFileSuccess(res){
      if(res.code===200){
        this.uploadData.uploadFile = {
          fileName: res.data.fileName,
          url: res.data.accessUrl
        }
      }
    },
    beforeFileUpload(file) {
        let suffix = file.name.split(".")[file.name.split(".").length - 1];
        if (suffix !== "csv") {
            this.$message.error("请上传后缀为.csv的模版文件!");
            return false;
        } else {
            this.listLoading = true;
        }
    }, 
    getSchoolYearFunc(){
      getSchoolYear().then(res=>res.data)
      .then(data=>{
        if(data.code===200){
          this.schoolYearList=data.data;
          getCurrentSchoolTimeBySchoolId().then(res=>{
            let data=res.data;
            if(data.code===200){
              let currentYearData=data.data;
              this.currentYear=currentYearData.schoolYear;
              this.schoolYearList.forEach(item=>{
                if(item.year==this.currentYear){
                  this.schoolYearName=item.year;
                  this.schoolYearCode=item.id;
                }
              })
              this.schoolYear=this.schoolYearName;
            }
          })

        }
      }).catch(()=>{})
    },
    changeSchoolYear(val){
      this.schoolYearCode=val;
      let schoolYearItem=this.schoolYearList.find(item=>{
        return item.id==val;
      });
      this.schoolYearName=schoolYearItem.year;
    }
  }
}
</script>
<style lang="scss" scoped>
ul,li{
  list-style: none;
}
.addTabSwitch .botton {
    width: 80%;
    overflow: hidden;
    margin:0 auto 20px;
}
.addTabSwitch .botton span {
    width: 25%;
    line-height: 34px;
    float: left;
    font-size:16px;
    text-align: center;
    background: #fff;
    border: 1px solid #bfcbd9;
    box-sizing: border-box;
    cursor: pointer;
}
.addTabSwitch .botton .tabcolor {
    color: #fff;
    background-color: #20a0ff;
    border-color: #20a0ff;
    -webkit-box-shadow: -1px 0 0 0 #20a0ff;
    box-shadow: -1px 0 0 0 #20a0ff;
}
.addTabSwitch .botton .tab-right {
  border-radius: 0 4px 4px 0;
}
.addTabSwitch .botton .tab-left {
  border-radius: 4px 0 0 4px;
}
.clearfix:after{
    content:'';
    display: block;
    height:0;
    clear: both;
    visibility: hidden;
}
.padding{
  padding:12px;
  box-sizing: border-box;
}
.batchImport{
  .main-wrap{
    padding-left:10%;
  }
  .title{
    font-size:18px;
    padding-top:20px;
  }
  .introduct{
    li{
      padding:5px 0;
    }
    .moduleDown{
      color:#20A0FF;
      padding-left:24px;
      cursor: pointer;
    }
  }
  .batchForm{
    margin-top:20px;
  }
  #fileBox{
    .for-box{
      width: auto;
      float: left;
      .upload-img{
        display:inline-block;
        width: 28px;
        height:28px;
        vertical-align: middle;
        margin-right:6px;
        background-position: 50%;
        text-align: center;
        background-size: cover;
        background-image: url(https://cdnfile-10043692.file.myqcloud.com/admin/images/upload/excle.png);
      }
      .file-name{
        width: 100px;
        line-height:43px;
        display:inline-block;
        vertical-align: middle;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        margin-right:6px;
      }
    }
  }
  .upload-import{
    float:left;
    width:auto;
  }
  .file {
      position: relative;
      display: inline-block;
      background: #409EFF;
      box-sizing: border-box;
      border-radius: 4px;
      padding:11px 20px;
      text-align: center;
      line-height: 1;
      margin-top:3px;
      overflow: hidden;
      color: #fff;
      text-decoration: none;
  }
  .file input {
      position: absolute;
      font-size: 100px;
      right: 0;
      top: 0;
      opacity: 0;
  }
  .errInfoWrap{
    width:482px;
    padding:20px;
    box-sizing: border-box;
    background:#F2DEDE;
    color:#a94442;
    border-color: 1px solid #ebccd1;
    border-radius:6px;
    p{
      padding:2px 0;
    }
    .moduleDown{
      color: #20A0FF;
      margin-top:4px;
      display: block;
    }
  }
}
</style>
<style lang="scss">
.batchForm .required .el-form-item__label:before{
  content:"*";
  font-size:17px;
  position: relative;
  top: 2px;
  display: inline-block;
  color: #f00;
  margin-right: 3px;
}
.batchImport .el-dialog__body{
  height:400px !important;
  overflow-x: hidden;
  overflow-y: auto;
}
</style>
