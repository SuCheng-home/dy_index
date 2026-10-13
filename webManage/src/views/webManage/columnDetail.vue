<template>
  <div class="columndetail-wrap">
    <el-row class="menu-row">
      <el-col :span="20" v-if="permission.indexOf('/schoolWebTwo/webManager')!==-1">
        <div > 
          <el-button size="small" class="filter-item" type="primary" @click="editColumn()">编辑栏目
          </el-button>
          <el-button size="small" class="filter-item" type="primary" @click="delColumn()">删除栏目
          </el-button>
        </div>
      </el-col>
    </el-row>
    <div class="org-main custom—scrollbar" :style="`height:${columnMax-70}px`" :columnList="columnList">

      <el-form ref="addServiceForm" label-width="150px" class="column-ruleForm custom—scrollbar">
        
        <div class="g-top-title">
          <h2>{{columnList.name}}</h2>
        </div>
        <div class="g-right-time">
          <span>{{columnList.createTime|filterTime}}</span>
        </div>
        <image-previewer tag="richtext">
          <div class="columnedit-content" v-html="columnList.content" v-if="columnList.type!==4"></div>
        </image-previewer>
        <div class="columnedit-content" v-if="columnList.type==4">
          {{columnList.columnUrl}}
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import mixins from '@/mixins/windowResize';
import {mapGetters} from 'vuex';
import ImagePreviewer from '@/components/ImagePreviewer/ImagePreviewer.vue';
import AddressBook from '@/components/AddressBook/indexExpand';
import {getSchooWebColumnById,delSchooWebColumnById} from '@/api/webManage';
export default{
  components:{
    AddressBook,
    ImagePreviewer
  },
  data(){
    return{
      columnId:this.$route.query.id,
      managerUserJson:[],
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
      columnList:{}
    }
  },
  mounted(){
    this.getSchooWebColumnByIdFunc();
  },
  computed:{
    ...mapGetters([
      'permission'
    ])
  },
  mixins:[mixins],
  watch:{
    $route(to,from){
      if(to.query){
        this.columnId=to.query.id;
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
  methods:{
    delColumn(){
      this.$confirm('删除栏目后相应的模块将会被删除!确定要删除选中的栏目吗？','提示',{type:'error'}).then(()=>{
          delSchooWebColumnById({
            columnId:this.columnId
          }).then(res=>res.data)
          .then(data=>{
            if(data.code===200){
              this.$message({
                  type: 'success',
                  message: '删除成功!'
              });
              this.$router.push({
                path:'columnList',
                query:{
                  leftSide:1
                }
              })
            }
          })
      }).catch(() => {})
      // delSchooWebColumnById({

      // })
    },
    editColumn(){
      this.$router.push({
        path:'editColumn',
        query:{
          id:this.columnId
        }
      })
    },
    getSchooWebColumnByIdFunc(){
      this.columnList={};
      getSchooWebColumnById({
        columnId:this.columnId
      }).then(res=>res.data)
      .then(data=>{
        if(data.code===200){
          this.columnList=data.data;
          this.managerUserJson=JSON.parse(this.columnList.managerUserJson)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.columndetail-wrap{
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
.columndetail-wrap .el-dialog{
  top:50px;
}
/* .columndetail-wrap .ueditor-wrapper{
  width:740px !important;
} */
</style>
