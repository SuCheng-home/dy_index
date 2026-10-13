<template>
  <div class="addcolumn-wrap">
    <el-row class="menu-row">
      <el-col :span="20">
        <div > 
          <el-button size="small" class="filter-item"  type="primary" @click="editColumn()">编辑模块
          </el-button>
          <el-button size="small" class="filter-item" type="primary" @click="delColumn()">删除模块
          </el-button>
        </div>
      </el-col>
    </el-row>
    <div class="org-main custom—scrollbar" :style="`height:${columnMax-70}px`" :moduleList="moduleList">
      <el-form ref="addServiceForm" label-width="150px" class="column-ruleForm custom—scrollbar">
        <div class="g-top-title" v-if="moduleList.name&&!newDetalTeshu">
          <h2>{{moduleList.name}}</h2>
        </div>
        <div class="g-right-time" v-if="moduleList.createTime&&!newDetalTeshu">
          <span>{{moduleList.createTime|filterTime}}</span>
        </div>
        <image-previewer tag="richtext">
          <div class="columnedit-content" v-html="moduleList.content" v-if="moduleList.type!==4">
        </div>
        </image-previewer>
        <div class="columnedit-content" v-if="moduleList.type==4">
          {{moduleList.columnUrl}}
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import mixins from '@/mixins/windowResize';
import {mapGetters} from 'vuex';
import ImagePreviewer from '@/components/ImagePreviewer/ImagePreviewer.vue';
import {getSchoolWebModuleById,delSchoolWebModuleById,getSchooWebColumnById} from '@/api/webManage';
import moduleListVue from './moduleList.vue';
export default{
  components:{
    ImagePreviewer
  },
  data(){
    return{
      moduleId:this.$route.query.moduleId,
      columnId:this.$route.query.id,
      UploadPath:global.BasePath+ 'common/addImageUp',////图片上传路径
      moduleList:{},
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
      manageUser:'',
      newDetalTeshu:false
    }
  },
  computed:{
    ...mapGetters([
      'permission',
      'name'
    ])
  },
  created(){
  },
  mounted(){
    this.getSchoolWebModuleByIdFunc();
    this.getSchooWebColumnByIdFunc();
  },
  watch:{
    $route(to,from){
      if(to.query){
        this.columnId=to.query.id;
        this.moduleId=to.query.moduleId;
        this.getSchoolWebModuleByIdFunc();
        this.getSchooWebColumnByIdFunc();
      }
    }
  },
  filters:{
    filterTime(date){
      if(date){
        return date==''?'':date.slice(0,19);
      }
    }
  },
  mixins:[mixins],
  methods:{
    getSchooWebColumnByIdFunc(){
      getSchooWebColumnById({
        columnId:this.columnId
      }).then(res=>res.data)
      .then(data=>{
        if(data.code===200){
          this.manageUser=data.data.managerUserJson;
        }
      })
    },
    delColumn(){
      this.$confirm('确定要删除选中的模块吗？','提示',{type:'error'}).then(()=>{
          delSchoolWebModuleById({
            moduleId:this.moduleId
          }).then(res=>res.data)
          .then(data=>{
            if(data.code===200){
              this.$message({
                  type: 'success',
                  message: '删除成功!'
              });
              this.$router.push({
                path:'moduleList',
                query:{
                  id:this.columnId,
                  leftSide:1
                }
              })
            }
          })
      }).catch(() => {})
    },
    editColumn(){
      this.$router.push({
        path:'editModule',
        query:{
          id:this.columnId,
          moduleId:this.moduleId
        }
      })
    },
    getSchoolWebModuleByIdFunc(){
      getSchoolWebModuleById({
        moduleId:this.moduleId
      }).then(res=>res.data)
      .then(data=>{
        if(data.code===200){
         this.moduleList=data.data;
         //做校史介绍的特殊处理
         if(this.moduleList.name.indexOf("校史介绍")!==-1||this.moduleList.name.indexOf("领导班子")!==-1){
           this.newDetalTeshu=true;
         }else{
           this.newDetalTeshu=false;
         }
        }
      })
    },
    goBack(){
      this.$router.push({
        path:'moduleList',
        query:{
          id:this.columnId
        }
      })
    },
    handleLogo(res){
      this.ruleForm.logoUrl =res.data.url;
    }
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
    margin:0 auto;
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
    margin-left:76px;
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
