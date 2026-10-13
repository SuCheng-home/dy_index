<template>
  <div class="columnList-wrap">
    <el-row class="menu-row">
      <el-col :span="20">
        <div > 
          <el-button size="small" class="filter-item"  type="primary" @click="addColumn">新增模块
          </el-button>
        </div>
      </el-col>
    </el-row>
    <div class="org-main custom—scrollbar" :style="`height:${columnMax-70}px`">
      <el-table
        ref="columnTable"
        :data="columnTable"
        class="columnTable"
        border
        fit highlight-current-row
        v-loading.body="listLoading"
        style="width: 100%" :height="columnMax-100">
        <el-table-column
          label="图标" align="center" show-overflow-tooltip width="100">
          <template slot-scope="scope">
            <img class="moduleImg" @click="showModuleImg(scope.row.logoUrl)" :src="scope.row.logoUrl" alt="">
          </template>
        </el-table-column>
        <el-table-column
          label="模块名称" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column label="模块类型" align="center" >
          <template slot-scope="scope">
            <span v-if="scope.row.type==1">展示型</span>
            <span v-if="scope.row.type==2">列表型</span>
            <span v-if="scope.row.type==3">图片型</span>
            <span v-if="scope.row.type==4">url类型</span>
          </template>
        </el-table-column>
        <el-table-column
          label="上级栏目" align="center" show-overflow-tooltip >
          <template slot-scope="scope">
            {{ scope.row.columnName }}
          </template>
        </el-table-column>
         <el-table-column
          label="在网站展示" align="center" width="150">
          <template slot-scope="scope">
            <span v-if="scope.row.isShow==1">显示</span>
            <span v-if="scope.row.isShow==2">不显示</span>
          </template>
        </el-table-column>
        <el-table-column  label="操作" align="center" width="220">
          <template slot-scope="scope" >
              <el-button size="small" type="text" @click.native="editModule(scope.row.id)">
                编辑
              </el-button>
              <el-button size="small" type="text" @click.native="deleColumn(scope.row.id)">
                删除
              </el-button>
          </template>
        </el-table-column>
       </el-table>
    </div>
    <previewer-dialog ref="previewer" :src="picSrc"></previewer-dialog>
  </div>
</template>

<script>
import mixins from '@/mixins/windowResize';
import {mapGetters} from 'vuex';
import {getSchoolWebModuleListByColumnId,getSchooWebColumnById,delSchoolWebModuleById} from '@/api/webManage';
import PreviewerDialog from '@/components/ImagePreviewer/PreviewerDialogOne.vue';
export default{
  components:{
    PreviewerDialog
  },
  data(){
    return{
      columnTable: [],
      columnId:this.$route.query.id,
      firstIndex:this.$route.query.firstIndex,
      columnName:'',
      listLoading:false,
      picSrc:'',
      manageUser:''
    }
  },
  mounted(){
    this.getSchooWebColumnByIdFunc();
    //模块
    
  },
  computed:{
    ...mapGetters([
      'permission',
      'name'
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
  methods:{
    showModuleImg(src){
      this.picSrc=src;
      this.$refs.previewer.show();
    },
    deleColumn(id){
      this.$confirm('确定要删除选中的模块吗？','提示',{type:'error'}).then(()=>{
          delSchoolWebModuleById({
            moduleId:id
          }).then(res=>res.data)
          .then(data=>{
            if(data.code===200){
              this.getSchooWebColumnByIdFunc();
              this.$message({
                  type: 'success',
                  message: '删除成功!'
              });
              this.$emit('delUpdateSide',id);
            }
          })
      }).catch(() => {})
    },
    editModule(id){
      this.$router.push({
        path:'editModule',
        query:{
          id:this.columnId,
          moduleId:id
        }
      })
    },
    getSchooWebColumnByIdFunc(){
      getSchooWebColumnById({
        columnId:this.columnId
      }).then(res=>res.data)
      .then(data=>{
        if(data.code===200){
          this.columnName=data.data.name;
          this.manageUser=data.data.managerUserJson;
          this.getSchoolWebModuleListByColumnIdFunc(this.columnName);
        }
      })
    },
    getSchoolWebModuleListByColumnIdFunc(columnName){
      this.columnTable=[];
      this.listLoading=true;
      getSchoolWebModuleListByColumnId({
        columnId:this.columnId
      }).then(res=>res.data)
      .then(data=>{
        if(data.code===200){
        // console.log("模块",data.data);
          this.columnTable=data.data;
          this.columnTable.forEach((item)=>{
            item.columnName=columnName;
          })
          this.listLoading=false;
        }
      }).catch(() => {
          this.listLoading = false;
      })
    },
    addColumn(){
      this.$router.push({
        path:'addModule',
        query:{
          id:this.columnId
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.columnList-wrap{
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
  }
  .columnTable{
    margin-top:20px;
    .moduleImg{
      display: inline-block;
      width:25px;
      height:25px;
      cursor: pointer;
    }
  }
}

</style>
<style lang="scss">
.columnTable .el-table__header .has-gutter th{
  background:#EEF1F6;
  font-size: 14px;
  color: #1f2d3d;
}

.el-table--scrollable-y .el-table__body-wrapper::-webkit-scrollbar {
  width: 6px;
  background-color: rgba(255, 255, 255, 0.1);
}

.el-table--scrollable-y .el-table__body-wrapper::-webkit-scrollbar-thumb {
  background-color: #999;
}

.el-table--scrollable-y .el-table__body-wrapper::-webkit-scrollbar-track {
  background-color: rgba(255, 255, 255, 0.1);
}
</style>
