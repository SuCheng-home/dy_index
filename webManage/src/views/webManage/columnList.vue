<template>
  <div class="columnList-wrap">
    <el-row class="menu-row">
      <el-col :span="20">
        <div > 
          <el-button v-if="permission.indexOf('/schoolWebTwo/webManager')!==-1" size="small" class="filter-item" type="primary" @click="addColumn">新增栏目
          </el-button>
        </div>
      </el-col>
    </el-row>
    <div class="org-main custom—scrollbar" :style="`height:${columnMax-70}px`">
      <el-table ref="columnTable"
        :data="columnTable"
        class="columnTable" v-loading.body="listLoading"
        border
        fit highlight-current-row
        style="width: 100%" :height="columnMax-100">
        <el-table-column
          label="栏目名称" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column label="栏目排序" align="center" >
          <template slot-scope="scope">
            {{scope.row.orderNo}}
          </template>
        </el-table-column>
        <el-table-column label="栏目类型" align="center" >
          <template slot-scope="scope">
            <span v-if="scope.row.type==1">展示型</span>
            <span v-if="scope.row.type==2">列表型</span>
            <span v-if="scope.row.type==3">图片型</span>
            <span v-if="scope.row.type==4">url类型</span>
          </template>
        </el-table-column>
        <el-table-column label="管理人员" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <template v-for="usename in JSON.parse(scope.row.managerUserJson)">
              {{usename.name}}
            </template>
          </template>
        </el-table-column>
        <el-table-column  label="操作" align="center" width="220">
          <template slot-scope="scope" v-if="permission.indexOf('/schoolWebTwo/webManager')!==-1">
              <el-button size="small" type="text" @click.native="editColumn(scope.row.id)">
                编辑
              </el-button>
              <el-button size="small" type="text" @click.native="deleColumn(scope.row.id)">
                删除
              </el-button>
          </template>
        </el-table-column>
       </el-table>
    </div>
  </div>
</template>

<script>
import mixins from '@/mixins/windowResize';
import {mapGetters} from 'vuex';
import {getSchooWebColumnListByWebId,delSchooWebColumnById} from '@/api/webManage';
export default{
  data(){
    return{
      columnTable: [],
      listLoading:false
    }
  },
  mounted(){
    var This=this;
    setTimeout(function(){
      This.getSchooWebColumnListByWebIdFunc()
    },200);
  },
  computed:{
    ...mapGetters([
      'permission',
      'webId'
    ])
  },
  mixins:[mixins],
  methods:{
    deleColumn(id){
      this.$confirm('删除栏目后相应的模块将会被删除!确定要删除选中的栏目吗？','提示',{type:'error'}).then(()=>{
          delSchooWebColumnById({
            columnId:id
          }).then(res=>res.data)
          .then(data=>{
            if(data.code===200){
              this.getSchooWebColumnListByWebIdFunc();
              this.$message({
                  type: 'success',
                  message: '删除成功!'
              });
              this.$emit('delUpdateSide',id);
            }
          })
      }).catch(() => {})
    },
    editColumn(id){
      this.$router.push({
        path:'editColumn',
        query:{
          id:id
        }
      })
    },
    getSchooWebColumnListByWebIdFunc(){
      this.columnTable=[];
      this.listLoading = true;
      getSchooWebColumnListByWebId({
        webId:this.webId
      }).then(res=>res.data)
      .then(data=>{
        if(data.code===200){
         // console.log("ssdsadas",data.data);
          this.columnTable=data.data;
          this.listLoading = false;
        }
      }).catch(() => {
          this.listLoading = false;
      })
    },
    addColumn(){
      this.$router.push({
        path:'addColumn'
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
