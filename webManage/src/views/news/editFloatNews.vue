<template>
  <div class="messageJia-wrap">
    <el-row class="menu-row">
      <el-col :span="20">
        <div >
          <el-button size="small" class="filter-item" @click="goBack()">返回
          </el-button>
          <el-button size="small" class="filter-item" type="primary" @click="saveMessage()">保存
          </el-button>
        </div>
      </el-col>
    </el-row>
    <div class="org-main custom—scrollbar" :style="`height:${columnMax-70}px`">
      <el-form :model="ruleForm" ref="addServiceForm" label-width="150px" class="column-ruleForm custom—scrollbar">
        <el-form-item label="主题" class="required">
            <el-input v-model.trim="ruleForm.title" :maxlength="40"  placeholder="不能超过40个字"></el-input>
        </el-form-item>
        <el-form-item label="悬浮图片" class="required">
          <el-col :span="24">
            <uploader useSysBucket pathPrefix="editFloatNews" multiple v-model="files" :extList="['jpeg', 'jpg', 'bmp', 'gif', 'png']" showMode="imageBtn" showResult="image" showModeText="上传图片" showModeNum="one"></uploader>
          </el-col>
        </el-form-item>
        <el-form-item label="开始日期" class="required">
            <el-date-picker
              v-model="ruleForm.startTime"
              type="date"
              placeholder="选择开始日期" :picker-options="pickerOptionsStart">
            </el-date-picker>
        </el-form-item>
        <el-form-item label="截止日期" class="required">
            <el-date-picker
              v-model="ruleForm.endTime"
              type="date"
              placeholder="选择截止日期" :picker-options="pickerOptionsEnd">
            </el-date-picker>
        </el-form-item>
        <el-form-item label="来源">
          <el-radio-group v-model="ruleForm.messageType">
            <el-radio :label="1">网站内容</el-radio>
            <el-radio :label="2">外部链接</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="模块列表" class="required" v-if="ruleForm.messageType==1">
            <el-select class="selectWidth" v-model="ruleForm.moduleName" placeholder="请选择模块" @change="moduleChange">
                <el-option
                        v-for="moduleItem in moduleList"
                        :key="moduleItem.name"
                        :label="moduleItem.name"
                        :value="moduleItem.name">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="消息列表" class="required" v-if="ruleForm.messageType==1&&first||ruleForm.messageType==1&&ruleForm.moduleListen&&ruleForm.moduleListen!==''&&messageList&&messageList.length!==0">
            <el-select class="selectWidth" v-model="ruleForm.messageName" placeholder="请选择消息" >
              <el-option
                      v-for="messageItem in messageList"
                      :key="messageItem.title"
                      :label="messageItem.title"
                      :value="messageItem.title">
              </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="链接url" class="required" v-if="ruleForm.messageType==2">
            <el-input v-model.trim="ruleForm.messageUrl" :maxlength="1000"  placeholder="请输入url信息"></el-input>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import mixins from '@/mixins/windowResize';
import {getSchoolWebModuleListByWebId,getModuleMessageListByModuleId} from '@/api/webManage';
import Uploader from '@/components/Uploader/WebUploader';
import {getSchoolWebSuspendMessageById,updateSchoolWebSuspendMessage} from '@/api/otherMessage';
export default{
  components:{
    Uploader
  },
  data(){
    return{
      messageId:this.$route.query.id,
      UploadPath:global.BasePath+ 'common/addImageUp',////图片上传路径
      ruleForm:{
        title:'',
        fileJson:'',
        startTime:'',
        endTime:'',
        messageType:1,
        messageUrl:'',
        moduleName:'',
        moduleListen:null,
        messageListen:'',
        messageName:'',
        messageJson:{}
      },
      pickerOptionsStart:{
        disabledDate(time){
          return time.getTime() <=Date.now()-8.64e7;
        }
      },
      pickerOptionsEnd:{
        disabledDate(time){
          return time.getTime() <=Date.now()-8.64e7;
        }
      },
      moduleList:[],
      messageList:[],
      first:true,
      files:[]
    }
  },
  created(){

  },
  mounted(){
    this.getSchoolWebModuleListByWebIdFunc();
    var This=this;
    setTimeout(function(){
      This.getSchoolWebSuspendMessageByIdFunc();
    },200);
  },
  mixins:[mixins],
  methods:{
    //处理图片名
    fileNameUse(file){
      return file.indexOf('?') !== -1 ?file.slice(0, file.indexOf('?')) : file;
    },
    getSchoolWebSuspendMessageByIdFunc(){
      //拿详情
      getSchoolWebSuspendMessageById({
        messageId:this.messageId
      }).then(res=>res.data)
      .then(data=>{
        if(data.code===200){
          const floatMesData=data.data;
          this.ruleForm.title=floatMesData.title;
          // this.ruleForm.fileJson=floatMesData.fileJson;
          if(floatMesData.fileJson){
            let fileName=this.fileNameUse(floatMesData.fileJson).replace(/.+\//, "");
            this.files.push({
              fileName:fileName,
              fileUrl:floatMesData.fileJson
            })
          }
          this.ruleForm.startTime=floatMesData.startTime;
          this.ruleForm.endTime=floatMesData.endTime;
          this.ruleForm.messageType=floatMesData.messageType;
          this.ruleForm.messageUrl=floatMesData.messageUrl;
          this.ruleForm.moduleListen=JSON.parse(floatMesData.messageJson).moduleId;
          let This=this;
          this.moduleList.forEach((item)=>{
            if(item.id==This.ruleForm.moduleListen){
             This.ruleForm.moduleName=item.name;
            }
          })
          this.ruleForm.messageName=JSON.parse(floatMesData.messageJson).title;
          //console.log("s",this.ruleForm.messageName);
          if(this.ruleForm.moduleName){
         //   this.moduleChange(this.ruleForm.moduleName,first);
            this.getModuleMessageListByModuleIdFunc(this.ruleForm.moduleListen,this.first);
          }
        }
      })
    },
    moduleChange(val){
      this.first=false;
      let moduleBox=[];
      this.moduleList.forEach((item)=>{
        if(item.name==val){
          moduleBox.push(item);
        }
      })
      this.ruleForm.moduleListen=moduleBox[0].id;
      this.getModuleMessageListByModuleIdFunc(this.ruleForm.moduleListen);
    },
    getModuleMessageListByModuleIdFunc(val,first){
      //val就是模块的id
      getModuleMessageListByModuleId({
        moduleId:val
      }).then(res=>res.data)
      .then(data=>{
        if(data.code===200){
          this.messageList=data.data;
          if(first){

          }else{
             if(data.data&&data.data.length!==0){
              this.ruleForm.messageName=this.messageList[0].title;
            }else{
              this.ruleForm.messageName='';
            }
          }

        }

      })
    },
    getSchoolWebModuleListByWebIdFunc(){
      getSchoolWebModuleListByWebId({
        webId:localStorage.getItem("webId"),
        type:23
      }).then(res=>res.data)
      .then(data=>{
        if(data.code===200){
          this.moduleList=data.data;
        }
      })
    },
    saveMessage(){
      //保存
      let flag = true;
      if(this.ruleForm.title===""){
        this.$alert('标题不能为空!','提示',{
          type: 'error',
          confirmButtonText: '确定'
        })
        return false;
      }
      if(this.files&&this.files.length==0){
        this.$alert('悬浮图片不能为空!','提示',{
          type: 'error',
          confirmButtonText: '确定'
        })
        return false;
      }
      if(this.ruleForm.startTime===""||this.ruleForm.startTime==null){
        this.$alert('请选择开始日期!','提示',{
          type: 'error',
          confirmButtonText: '确定'
        })
        return false;
      }
      if(this.ruleForm.endTime===""||this.ruleForm.endTime==null){
        this.$alert('请选择结束日期!','提示',{
          type: 'error',
          confirmButtonText: '确定'
        })
        return false;
      }

      if(this.$moment(this.ruleForm.endTime).format('YYYY-MM-DD')<this.$moment(this.ruleForm.startTime).format('YYYY-MM-DD')){
        this.$alert('开始时间不能大于结束时间!','提示',{
          type: 'error',
          confirmButtonText: '确定'
        })
        return false;
      }
      if(this.ruleForm.messageType==1&&this.ruleForm.moduleListen==''||this.ruleForm.messageType==1&&this.ruleForm.moduleListen==null){
        this.$alert('请选择模块列表!','提示',{
          type: 'error',
          confirmButtonText: '确定'
        })
        return false;
      }
      if(this.ruleForm.messageType==1&&this.ruleForm.messageName==''||this.ruleForm.messageType==1&&this.ruleForm.messageName==null){
        this.$alert('此模块列表还未创建消息','提示',{
          type: 'error',
          confirmButtonText: '确定'
        })
        return false;
      }
      if(this.ruleForm.messageType==2&&this.ruleForm.messageUrl==''){
        if(this.ruleForm.messageUrl.replace(/^(\s|\u00A0)+/, '').length == 0){
          this.$alert('链接url不能为空!','提示',{
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
      if(this.ruleForm.messageType==2&&this.ruleForm.messageUrl==''){
        if(this.ruleForm.messageUrl.replace(/^(\s|\u00A0)+/, '').length == 0){
          this.$alert('链接url不能为空!','提示',{
            type: 'error',
            confirmButtonText: '确定'
          })
          return false;
        }

      }
      var urlreg = /^(http|https):\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/;
      if(this.ruleForm.messageType==2&&this.ruleForm.messageUrl != null && this.ruleForm.messageUrl != "" && !urlreg.test(this.ruleForm.messageUrl)){
        this.$alert('url格式不正确!', '提示', {
            type: 'error',
            confirmButtonText: '确定'
        });
        return false;
      }

      if(flag){
        let idBox=[];
        for(var i=0;i<this.messageList.length;i++){
          if(this.ruleForm.messageName==this.messageList[i].title){
            idBox.push(this.messageList[i])
          }
        }
        let obj={};
        var This=this;
        idBox.forEach(function(item){
          obj["id"]=item.id;
          obj["title"]=item.title;
          obj["moduleId"]=This.ruleForm.moduleListen;
        })
        this.ruleForm.messageJson=obj;
        if(this.ruleForm.messageType==1){
          this.ruleForm.messageUrl=''
        }else if(this.ruleForm.messageType==2){
          this.ruleForm.moduleName='';
          this.ruleForm.moduleListen=null;
          this.ruleForm.messageName='';
          this.ruleForm.messageJson={}
        }
        this.ruleForm.fileJson=this.files.map(item=>item.fileUrl).toString();
        updateSchoolWebSuspendMessage({
          webId:localStorage.getItem("webId"),
          id:this.messageId,
          title:this.ruleForm.title,
          fileJson:this.ruleForm.fileJson,
          startTime:this.ruleForm.startTime==''?'':this.$moment(this.ruleForm.startTime).format('YYYY-MM-DD'),
          endTime:this.ruleForm.endTime==''?'':this.$moment(this.ruleForm.endTime).format('YYYY-MM-DD'),
          messageType:this.ruleForm.messageType,
          messageUrl:this.ruleForm.messageUrl,
          messageJson:JSON.stringify(this.ruleForm.messageJson)
        }).then(res=>res.data)
        .then(data=>{
          if(data.code===200){
            this.$message({
                type: 'success',
                message: '编辑成功!'
            });
            this.$router.push({
              path:'floatNewsList'
            })
          }
        })
      }
    },
    goBack(){
      this.$router.push({
        path:'floatNewsList'
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
</style>
