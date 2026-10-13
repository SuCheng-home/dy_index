<template>
  <div class="messageJia-wrap">
    <el-row class="menu-row">
      <el-col :span="20">
        <div >
          <el-button size="small" class="filter-item" @click="goBack()">返回
          </el-button>
          <el-button size="small" class="filter-item" type="primary" @click="saveMessage(1,'add')">存草稿
          </el-button>
          <el-button size="small" class="filter-item" type="primary" @click="saveMessage(2,'add')">发布
          </el-button>
        </div>
      </el-col>
    </el-row>
    <div class="org-main custom—scrollbar" :style="`height:${columnMax-70}px`">
      <el-form :model="ruleForm" ref="addServiceForm" label-width="150px" class="column-ruleForm custom—scrollbar">
        <el-form-item label="标题" class="required">
            <el-input v-model.trim="ruleForm.title" :maxlength="100"  placeholder="不能超过100个字"></el-input>
        </el-form-item>
        <el-form-item label="副标题">
            <el-input v-model.trim="ruleForm.titleMark" :maxlength="100"  placeholder="不能超过100个字"></el-input>
        </el-form-item>
        <el-form-item label="模块" class="required">
          <el-select class="selectWidth" v-model="ruleForm.moduleNames" multiple placeholder="请选择模块">
            <el-option
                    v-for="moduleId in moduleIds"
                    :key="moduleId.name"
                    :label="moduleId.name"
                    :value="moduleId.name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标签">
            <el-input v-model.trim="ruleForm.mark" :maxlength="40"  placeholder="不能超过40个字"></el-input>
        </el-form-item>
        <el-form-item label="排序" class="required" >
            <el-input v-model.trim="ruleForm.orderNo" :maxlength="8" type="number" pattern="[0-9]*"  placeholder="排序序号"></el-input>
        </el-form-item>
        <el-form-item label="发布时间" class="required">
            <el-date-picker
              v-model="ruleForm.createTime"
              type="datetime" format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期时间">
            </el-date-picker>
        </el-form-item>
        <el-form-item label="消息封面">
          <el-col :span="24">
            <uploader useSysBucket pathPrefix="newsJia" multiple v-model="files" :extList="['jpeg', 'jpg', 'bmp', 'gif', 'png']" showMode="imageBtn" showResult="image" showModeText="选择图片" showModeNum="one"></uploader>

          </el-col>
        </el-form-item>
        <el-form-item label="消息类型" class="required">
            <el-select class="selectWidth" v-model="ruleForm.messageType" placeholder="" @change="messageType">
                <el-option
                        v-for="messageItem in messageTypes"
                        :key="messageItem.value"
                        :label="messageItem.label"
                        :value="messageItem.value">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="url信息" class="required" v-if="ruleForm.messageType==2">
            <el-input v-model.trim="ruleForm.messageUrl" :maxlength="1000"  placeholder="请输入url信息"></el-input>
        </el-form-item>

        <div class="ueditor-wrapper" v-if="ruleForm.messageType!==2">
          <ueditor class="rich-editor" ref="ueditor" :defaultMes="ruleForm.content" @editModel="richTextEditHandler"  v-if="ruleForm.messageType!==2"></ueditor>
        </div>
        <el-form-item label="上传附件" v-if="ruleForm.messageType!==2">
          <uploader useSysBucket pathPrefix="newsJia" :extList="allFileTypeList" v-model="ruleForm.fileJson" :multiple="true"></uploader>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import mixins from '@/mixins/windowResize';
import Ueditor from '@/components/Ueditor';
import Uploader from '@/components/Uploader/WebUploader';
import {getSchoolWebModuleListByWebId,addSchoolWebModuleMessage} from '@/api/webManage';
export default{
  components:{
    Ueditor,
    Uploader
  },
  data(){
    return{

      ruleForm:{
        title:'',
        moduleIds:'',
        moduleNames:'',
        createTime:'',
        logoUrl:'',
        messageType:'',
        messageTypeName:'',
        messageUrl:'',
        content:'',
        fileJson:[],
        mark:'',
        titleMark:'',
        orderNo:''
      },
      moduleName:'',
      messageTypes:[{
          value: 1,
          label: "普通类型"
      }, {
          value: 2,
          label: "url类型"
      }],
      moduleIds:[],
      fileIdsList:[],
      sourceFileList:[],
      allFileTypeList: ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf', 'zip', 'rar'],
      progressNum:false,
      files:[]
    }
  },
  created(){
    this.ruleForm.messageType=1;
    this.ruleForm.createTime=this.$moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    this.getSchoolWebModuleListByWebIdFunc();
  },
  mounted(){
    this.ruleForm.orderNo=0;
    this.messageType(this.ruleForm.messageType);
  },
  mixins:[mixins],
  methods:{
    getSchoolWebModuleListByWebIdFunc(){
      getSchoolWebModuleListByWebId({
        webId:localStorage.getItem("webId"),
        type:23
      }).then(res=>res.data)
      .then(data=>{
        this.moduleIds=data.data;
      })
    },

    messageType(val){
      let obj={};
      obj=this.messageTypes.find((item)=>{
        return item.value==val
      })
      this.ruleForm.messageTypeName=obj.label;
      this.ruleForm.messageType=obj.value;
    },
    richTextEditHandler(content){
      this.ruleForm.content = content;
    },
    saveMessage(code,type){
      //保存
      let flag = true;
      if(this.ruleForm.title===""){
        this.$alert('标题不能为空!','提示',{
          type: 'error',
          confirmButtonText: '确定'
        })
        return false;
      }
      if(this.ruleForm.moduleNames==""||this.ruleForm.moduleNames==null){
        this.$alert('请选择模块!','提示',{
          type: 'error',
          confirmButtonText: '确定'
        })
        return false;
      }
      if(this.ruleForm.orderNo===""){
        this.$alert('排序序号不能为空!','提示',{
          type: 'error',
          confirmButtonText: '确定'
        })
        return false;
      }
      if(this.ruleForm.createTime===""){
        this.$alert('请选择发布时间!','提示',{
          type: 'error',
          confirmButtonText: '确定'
        })
        return false;
      }

      if(this.ruleForm.messageType===""){
        this.$alert('请选择消息类型!','提示',{
          type: 'error',
          confirmButtonText: '确定'
        })
        return false;
      }
      if(this.ruleForm.messageType==2){
        if(this.ruleForm.messageUrl.replace(/^(\s|\u00A0)+/, '').length == 0){
          this.$alert('url消息不能为空!','提示',{
            type: 'error',
            confirmButtonText: '确定'
          })
          return false;
        }
        // var urlreg = /^(http|https):\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/;
        // if (this.ruleForm.messageUrl != null && this.ruleForm.messageUrl != "" && !urlreg.test(this.ruleForm.messageUrl)) {
        //     this.$alert('url格式不正确!', '提示', {
        //         type: 'error',
        //         confirmButtonText: '确定'
        //     });
        //     return false;
        // }
      }
      if(this.$refs.ueditor){
        this.ruleForm.content=this.$refs.ueditor.getContent();
        var content=this.$refs.ueditor.getContent();
        if(content.replace(/^(\s|\u00A0)+/, '').length==0){
          this.$alert('模块消息内容不能为空!','提示',{
            type: 'error',
            confirmButtonText: '确定'
          })
          return false;
        }
      }

      let fileJsonList=[];
      this.ruleForm.fileJson.forEach((item)=>{
        fileJsonList.push({
          fileName:item.fileName,
          url:item.fileUrl,
          fileId:item.id
        })
      })
      this.ruleForm.fileJson=fileJsonList;
      if(flag){
        var idBox=[];
        for(var i=0;i<this.ruleForm.moduleNames.length;i++){
          for(var j=0;j<this.moduleIds.length;j++){
            if(this.ruleForm.moduleNames[i]==this.moduleIds[j].name){
              idBox.push(this.moduleIds[j])
            }
          }
        }

        this.ruleForm.moduleIds=idBox.map((item)=>{
          return item.id
        });
        this.ruleForm.logoUrl=this.files.map(item=>item.fileUrl).toString();
        addSchoolWebModuleMessage({
          webId:localStorage.getItem("webId"),
          state:code,
          title:this.ruleForm.title,
          moduleIds:this.ruleForm.moduleIds.toString(),
          createTime:this.ruleForm.createTime==''?'':this.$moment(this.ruleForm.createTime).format('YYYY-MM-DD HH:mm:ss'),
          logoUrl:this.ruleForm.logoUrl,
          messageType:this.ruleForm.messageType,
          messageTypeName:this.ruleForm.messageTypeName,
          messageUrl:this.ruleForm.messageUrl,
          content:this.ruleForm.content,
          fileJson:JSON.stringify(this.ruleForm.fileJson),
          mark:this.ruleForm.mark?this.ruleForm.mark:'',
          titleMark:this.ruleForm.titleMark?this.ruleForm.titleMark:'',
          orderNo:this.ruleForm.orderNo
        }).then(res=>res.data)
        .then(data=>{
          if(data.code===200){
            this.$message({
                type: 'success',
                message: '操作成功!'
            });
            this.$router.push({
              path:'newsList'
            })
          }else{
            this.$message({
                type: 'error',
                message: '操作失败,请稍后重试!'
            });
          }
        })
      }
    },
    goBack(){
      this.$router.push({
        path:'newsList'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.messageJia-wrap{
  .menu-row{
    border-bottom: 1px solid #e7eaec;
    box-sizing: border-box;
    padding-bottom:15px;
    padding-top:15px;
  }
  .menu-row .el-button{
    margin-left: 15px;
  }
  .org-main{
    width:100%;
    padding-bottom:30px;
    box-sizing: border-box;
  }
  .column-ruleForm{
    width:80%;
    padding-top:22px;
    .logoLoading{
      float:left;
      line-height:40px;
      margin:0;
      margin-right:10px;
    }
    .logo{
      float:left;
      display:block;
      height: 100px;
      max-width: 550px;
      margin-right:30px;
    }
    .logo_update{
      display: inline-block;
      line-height: 1;
      white-space: nowrap;
      cursor: pointer;
      background: #fff;
      border: 1px solid #c4c4c4;
      color: #1f2d3d;
      margin: 0;
      padding: 10px 15px;
      border-radius: 4px;
    }
  }
  .selectWidth{
    width:100%;
  }
  .ueditor-wrapper{
    width:100%;
    padding-left:76px;
    margin-bottom:22px;
    box-sizing: border-box;
    .rich-editor{
      width:96%;
    }
  }
}

</style>
<style>
.column-ruleForm .el-form-item__label{
  font-weight: bold;
  color: #666;
  line-height: 40px;
  font-size: 14px;
  position: relative;
  padding-right:20px;
}
.column-ruleForm .required .el-form-item__label:before{
  content:"*";
  font-size:17px;
  position: relative;
  top: 2px;
  display: inline-block;
  color: #f00;
  margin-right: 3px;
}
.messageJia-wrap .el-dialog{
  top:50px;
}
/* .messageJia-wrap .ueditor-wrapper{
  width:740px !important;
} */
.messageJia-wrap textarea{
  resize: none;
  border:0;
  padding:0;
}
.upload-file .el-upload-list{
  width:70% !important;
}
input[type=number] {
-moz-appearance:textfield;
}
input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
</style>
