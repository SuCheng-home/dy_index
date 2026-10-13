<template>
  <div class="addcolumn-wrap">
    <el-row class="menu-row">
      <el-col :span="20">
        <div >
          <el-button size="small" class="filter-item" @click="goBack()">返回
          </el-button>
          <el-button size="small" class="filter-item" type="primary" @click="saveColumn()">保存
          </el-button>
        </div>
      </el-col>
    </el-row>
    <div class="org-main custom—scrollbar" :style="`height:${columnMax-70}px`">
      <el-form :model="ruleForm" ref="addServiceForm" label-width="150px" class="column-ruleForm custom—scrollbar">
        <el-form-item label="模块名称" class="required">
          <el-input v-model.trim="ruleForm.name" :maxlength="10"  placeholder="标题(1-10个字符)"></el-input>
        </el-form-item>
        <el-form-item label="模块类型" class="required">
          <el-select class="selectWidth" v-model="ruleForm.type" placeholder="请选择模块类型">
            <el-option
              v-for="columnItem in columnTypes"
              :key="columnItem.value"
              :label="columnItem.label"
              :value="columnItem.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="模块url" class="required" v-if="ruleForm.type==4">
          <el-input v-model.trim="ruleForm.columnUrl" :maxlength="200"  placeholder="模块url(1-200个字符)"></el-input>
        </el-form-item>
        <el-form-item label="在网站展示" class="required">
          <el-tooltip :content="ruleForm.isShow==true?'显示':'不显示'" placement="top">
            <el-switch
              v-model="ruleForm.isShow">
            </el-switch>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="模块序号" class="required">
          <el-input v-model.trim="ruleForm.orderNo"  placeholder="请输入模块序号" :maxlength="9"></el-input>
        </el-form-item>
        <el-form-item label="模块图标" class="required">
          <el-col :span="24">
            <uploader useSysBucket pathPrefix="editModule" multiple v-model="files" :extList="['jpeg', 'jpg', 'bmp', 'gif', 'png']" showMode="imageBtn" showResult="image" showModeText="上传图标" showModeNum="one"></uploader>
          </el-col>
        </el-form-item>
        <div class="ueditor-wrapper" v-show="ruleForm.type!==4">
          <ueditor class="rich-editor" ref="ueditor" :defaultMes="ruleForm.content" @editModel="richTextEditHandler"></ueditor>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
  import mixins from '@/mixins/windowResize';
  import Ueditor from '@/components/Ueditor';
  import Uploader from '@/components/Uploader/WebUploader';
  import {updateSchoolWebModule,getSchoolWebModuleById} from '@/api/webManage';
  export default{
    components:{
      Ueditor,
      Uploader
    },
    data(){
      return{
        columnId:this.$route.query.id,
        moduleId:this.$route.query.moduleId,

        ruleForm:{
          name:'',
          type:'',
          isShow:true,//	是否显示，1代表显示，2代表不显示
          columnUrl:'',
          orderNo:'',
          logoUrl:'',
          content:''
        },
        columnTypes: [{
          value: 1,
          label: "展示型"
        }, {
          value: 2,
          label: "列表型"
        }, {
          value: 3,
          label: "图片型"
        }, {
          value: 4,
          label: "url型"
        }],
        progressNum:false,
        files:[]
      }
    },
    created(){
      this.ruleForm.type=1;
    },
    mounted(){
      this.getSchoolWebModuleByIdFunc();
    },
    mixins:[mixins],
    methods:{
      //处理图片名
      fileNameUse(file){
        return file.indexOf('?') !== -1 ?file.slice(0, file.indexOf('?')) : file;
      },

      getSchoolWebModuleByIdFunc(){
        getSchoolWebModuleById({
          moduleId:this.moduleId
        }).then(res=>res.data)
          .then(data=>{
            if(data.code===200){             
              const moduleDetailData=data.data;    
              this.$refs.ueditor.setContent(moduleDetailData.content);
               this.ruleForm.content=moduleDetailData.content
              this.ruleForm.name=moduleDetailData.name;
              this.ruleForm.type=moduleDetailData.type;
              this.ruleForm.columnUrl=moduleDetailData.columnUrl;
              if(moduleDetailData.isShow==1){
                this.ruleForm.isShow=true;
              }else if(moduleDetailData.isShow==2){
                this.ruleForm.isShow=false;
              }
              this.ruleForm.orderNo=moduleDetailData.orderNo;
              if(moduleDetailData.logoUrl){
                let fileName=this.fileNameUse(moduleDetailData.logoUrl).replace(/.+\//, "");
                this.files.push({
                  fileName:fileName,
                  fileUrl:moduleDetailData.logoUrl
                })
              }
              //this.ruleForm.logoUrl=moduleDetailData.logoUrl;
              
            }
          })
      },
      richTextEditHandler(content){
        this.ruleForm.content = content;
      },
      saveColumn(){
        //保存
        let flag = true;
        if(this.ruleForm.name===""){
          this.$alert('请输入模块名称!','提示',{
            type: 'error',
            confirmButtonText: '确定'
          })
          return false;
        }
        if(this.ruleForm.type===""){
          this.$alert('请选择模块类型!','提示',{
            type: 'error',
            confirmButtonText: '确定'
          })
          return false;
        }
        if(this.ruleForm.orderNo===""){
          this.$alert('模块序号不能为空!','提示',{
            type: 'error',
            confirmButtonText: '确定'
          })
          return false;
        }
        if(isNaN(this.ruleForm.orderNo)){
          this.$alert('模块序号不合法!','提示',{
            type: 'error',
            confirmButtonText: '确定'
          })
          return false;
        }
        if(this.files&&this.files.length==0){
          this.$alert('请上传模块图标!','提示',{
            type: 'error',
            confirmButtonText: '确定'
          })
          return false;
        }
        if(this.ruleForm.type==1){
          //展示型
          if(this.$refs.ueditor){
            this.ruleForm.content=this.$refs.ueditor.getContent();
            var content=this.$refs.ueditor.getContent();
            if(content.replace(/^(\s|\u00A0)+/, '').length==0){
              this.$alert('展示型模块内容不能为空!','提示',{
                type: 'error',
                confirmButtonText: '确定'
              })
              return false;
            }
          }

        }else if(this.ruleForm.type==4){
          if(this.ruleForm.columnUrl.replace(/^(\s|\u00A0)+/, '').length == 0){
            this.$alert('模块url不能为空!','提示',{
              type: 'error',
              confirmButtonText: '确定'
            })
            return false;
          }
          var urlreg = /^(http|https):\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/;
          if(this.ruleForm.columnUrl != "" && !urlreg.test(this.ruleForm.columnUrl)){
            this.$alert('url格式不正确!', '提示', {
              type: 'error',
              confirmButtonText: '确定'
            });
            return false;
          }
        }

        if(flag){
          this.ruleForm.logoUrl=this.files.map(item=>item.fileUrl).toString();
          updateSchoolWebModule({
            webId:localStorage.getItem("webId"),
            columnId:this.columnId,
            name:this.ruleForm.name,
            type:this.ruleForm.type,
            id:this.moduleId,
            columnUrl:this.ruleForm.columnUrl,
            isShow:this.ruleForm.isShow?1:2,
            orderNo:this.ruleForm.orderNo,
            logoUrl:this.ruleForm.logoUrl,
            content:this.ruleForm.content
          }).then(res=>res.data)
            .then(data=>{
              if(data.code===200){
                this.$message({
                  type: 'success',
                  message: '编辑模块成功!'
                });
                this.$router.push({
                  path:'moduleList',
                  query:{
                    id:this.columnId,
                    leftSide:1
                  }
                })
              }else{
                this.$message({
                  type: 'error',
                  message: '编辑模块失败,请稍后重试!'
                });
              }
            })
        }
      },
      goBack(){
        this.$router.push({
          path:'moduleList',
          query:{
            id:this.columnId
          }
        })
      },

    }
  }
</script>

<style lang="scss" scoped>
  .addcolumn-wrap{
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
  .addcolumn-wrap .el-dialog{
    top:50px;
  }

  .addcolumn-wrap textarea{
    resize: none;
    border:0;
    padding:0;
  }
</style>
