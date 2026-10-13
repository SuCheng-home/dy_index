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
        <el-form-item label="栏目名称" class="required">
          <el-input v-model.trim="ruleForm.name" :maxlength="10"  placeholder="标题(1-10个字符)"></el-input>
        </el-form-item>
        <el-form-item label="栏目类型" class="required">
          <el-select class="selectWidth" v-model="ruleForm.type" placeholder="请选择栏目类型">
            <el-option
              v-for="columnItem in columnTypes"
              :key="columnItem.value"
              :label="columnItem.label"
              :value="columnItem.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="栏目url" class="required" v-if="ruleForm.type==4">
          <el-input v-model.trim="ruleForm.columnUrl" :maxlength="200"  placeholder="栏目url(1-200个字符)"></el-input>
        </el-form-item>
        <el-form-item label="管理员" class="required" v-if="ruleForm.type==2||ruleForm.type==3">
          <div class="addressWidth">
            <address-book v-model="ruleForm.managerUserJson" :config="configPushData" ref="address"></address-book>
          </div>
        </el-form-item>
        <el-form-item label="栏目序号" class="required">
          <el-input v-model.trim="ruleForm.orderNo"  placeholder="请输入栏目序号"></el-input>
        </el-form-item>
        <el-form-item label="栏目图标">
          <el-col :span="24">
            <p class="logoLoading" v-if="progressNum">图片过大,上传中,请稍后...</p>
            <div class="logoBox" v-if="ruleForm.logoUrl">
              <img :src="ruleForm.logoUrl" class="logo">
              <div class="img-del-btn" @click="clearLogo">
                <div class="del-box">
                  <i class="fa fa-trash-o" aria-hidden="true"></i>
                </div>
              </div>
            </div>
            <uploader useSysBucket pathPrefix="editColumn" multiple v-model="files" :extList="['jpeg', 'jpg', 'bmp', 'gif', 'png']" showMode="imageBtn" showResult="image" showModeText="上传图标" showModeNum="one"></uploader>
          </el-col>
        </el-form-item>
        <div class="ueditor-wrapper" v-if="ruleForm.type!==4">
          <ueditor class="rich-editor" ref="ueditor" :defaultMes="ruleForm.content" @editModel="richTextEditHandler" v-if="ruleForm.type!==4"></ueditor>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
  import mixins from '@/mixins/windowResize';
  import Ueditor from '@/components/Ueditor';
  import Uploader from '@/components/Uploader/WebUploader';
  import AddressBook from '@/components/AddressBook/indexExpand';
  import {updateSchooWebColumn,getSchooWebColumnById} from '@/api/webManage';
  export default{
    components:{
      Ueditor,
      AddressBook,
      Uploader
    },
    data(){
      return{
        columnId:this.$route.query.id,
        //UploadPath:global.BasePath+ 'common/addImageUp',////图片上传路径
        ruleForm:{
          name:'',
          type:'',
          columnUrl:'',
          managerUserJson:{},
          orderNo:'',
          logoUrl:'',
          content:''
        },
        managerUserJson:{},
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
        configPushData:{title: '请选择管理员', depart: {target: 'user', departType: 't', userTypes: '1'}},
        progressNum:false,
        files:[]
      }
    },
    created(){
      this.ruleForm.type=1;
    },
    mounted(){
      this.getSchooWebColumnByIdFunc();
    },
    mixins:[mixins],
    methods:{
      //处理图片名
      fileNameUse(file){
        return file.indexOf('?') !== -1 ?file.slice(0, file.indexOf('?')) : file;
      },

      clearLogo(){
        this.ruleForm.logoUrl=''
      },
      getSchooWebColumnByIdFunc(){
        getSchooWebColumnById({
          columnId:this.columnId
        }).then(res=>res.data)
          .then(data=>{
            if(data.code===200){
              const columnData=data.data;
              this.ruleForm.name=columnData.name;
              this.ruleForm.type=columnData.type;
              this.ruleForm.managerUserJson={
                departJson:[],
                userJson:JSON.parse(columnData.managerUserJson),
                groupJson:[]
              }
              this.ruleForm.columnUrl=columnData.columnUrl;
              this.ruleForm.orderNo=columnData.orderNo;
              if(columnData.logoUrl){
                let fileName=this.fileNameUse(columnData.logoUrl).replace(/.+\//, "");
                this.files.push({
                  fileName:fileName,
                  fileUrl:columnData.logoUrl
                })
              }

              // this.ruleForm.logoUrl=columnData.logoUrl;
              this.ruleForm.content=columnData.content;
              this.$refs.ueditor.setContent(this.ruleForm.content);
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
          this.$alert('请输入栏目名称!','提示',{
            type: 'error',
            confirmButtonText: '确定'
          })
          return false;
        }
        if(this.ruleForm.type===""){
          this.$alert('请选择栏目类型!','提示',{
            type: 'error',
            confirmButtonText: '确定'
          })
          return false;
        }

        if(this.ruleForm.type==2||this.ruleForm.type==3){

          if((this.ruleForm.managerUserJson.userJson&&this.ruleForm.managerUserJson.userJson.length>0)||(this.ruleForm.managerUserJson.departJson&&this.ruleForm.managerUserJson.departJson.length>0)||(this.ruleForm.managerUserJson.groupJson&&this.ruleForm.managerUserJson.groupJson.length>0)){
            //
          }else{
            this.$alert('请选择管理员!','提示',{
              type: 'error',
              confirmButtonText: '确定'
            })
            return false;
          }

        }

        if(this.ruleForm.orderNo===""){
          this.$alert('栏目序号不能为空!','提示',{
            type: 'error',
            confirmButtonText: '确定'
          })
          return false;
        }
        if(isNaN(this.ruleForm.orderNo)){
          this.$alert('栏目序号不合法!','提示',{
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
              this.$alert('展示型栏目内容不能为空!','提示',{
                type: 'error',
                confirmButtonText: '确定'
              })
              return false;
            }
          }

        }else if(this.ruleForm.type==4){
          if(this.ruleForm.columnUrl.replace(/^(\s|\u00A0)+/, '').length == 0){
            this.$alert('栏目url不能为空!','提示',{
              type: 'error',
              confirmButtonText: '确定'
            })
            return false;
          }
        }

        if(flag){
          if(this.ruleForm.managerUserJson){
            this.managerUserJson =this.ruleForm.managerUserJson.userJson;
          }
          this.ruleForm.logoUrl=this.files.map(item=>item.fileUrl).toString();
          updateSchooWebColumn({
            id:this.columnId,
            webId:localStorage.getItem("webId"),
            name:this.ruleForm.name,
            type:this.ruleForm.type,
            columnUrl:this.ruleForm.columnUrl,
            managerUserJson:this.managerUserJson,
            orderNo:this.ruleForm.orderNo,
            logoUrl:this.ruleForm.logoUrl,
            content:this.ruleForm.content
          }).then(res=>res.data)
            .then(data=>{
              if(data.code===200){
                this.$message({
                  type: 'success',
                  message: '编辑栏目成功!'
                });
                this.$router.push({
                  path:'columnList',
                  query:{
                    leftSide:1
                  }
                })
              }else{
                this.$message({
                  type: 'error',
                  message: '编辑栏目失败,请稍后重试!'
                });
              }
            })
        }
      },
      goBack(){
        this.$router.push({
          path:'columnList'
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
      .logoBox{
        position: relative;
        float:left;
        height: 100px;
        max-width: 550px;
        margin-right:30px;
        .img-del-btn{
          position: absolute;
          right:0;
          top:0;
          width:100%;
          height:100px;
          z-index:2;
          background:rgba(0,0,0,0.5);
          line-height: 0;
          cursor: pointer;
          transition: 0.3s linear;
          opacity: 0;
          .del-box{
            position: absolute;
            left:50%;
            top:50%;
            width:40px;
            height:40px;
            text-align: center;
            line-height:40px;
            margin:-20px 0 0 -20px;
            background:#f56c6c;
            border-radius: 50%;
            overflow: hidden;

          }
          i{
            font-size:20px;
            color:#fff;
          }
        }
      }
      .logoBox:hover .img-del-btn{
        opacity: 1;
      }
      .logo{
        display:block;
        max-width:100%;
        height:100px;
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
