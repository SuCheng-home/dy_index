<template>
  <div class="newsIndexWrapper" :style="`height:${columnMax}px`">
    <el-row class="menu-row">
      <el-col :span="18">
        <div> 
          <el-button size="small" class="filter-item" type="primary" @click="addmessage()">新增
          </el-button>
          <el-button size="small" class="filter-item" type="primary" @click="delMessages()">删除
          </el-button>
        </div>
      </el-col>
      <el-col :span="6">
        <el-input size="small" placeholder="请输入消息主题" v-model.trim="listQuery.title"
                 @change="handleInputChange" ><i slot="suffix" class="el-input__icon el-icon-search" ></i>
        </el-input>
      </el-col>
    </el-row>
    <div class="message-main custom—scrollbar" :style="`height:${columnMax-70}px`">
      <el-table
        ref="messageTable"
        :data="messageTable"
        class="messageTable custom—scrollbar"
        border
        :height="`${columnMax-160}`"
        fit highlight-current-row
        v-loading.body="listLoading"
        style="width: 100%" 
        @selection-change="handleSelectionChange"
        >
        <el-table-column
          type="selection" align="center"
          width="55">
        </el-table-column>
        <el-table-column
          label="主题" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.title}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="创建人" align="center" show-overflow-tooltip width="100">
          <template slot-scope="scope">
            {{ scope.row.createUserName }}
          </template>
        </el-table-column>
        <el-table-column
          label="开始时间" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.startTime | filterTime}}
          </template>
        </el-table-column>
        <el-table-column
          label="结束时间" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.endTime | filterTime}}
          </template>
        </el-table-column>
        <el-table-column
          label="悬浮图片" align="center" show-overflow-tooltip >
          <template slot-scope="scope">
            <img v-if="scope.row.fileJson" @click="showModuleImg(scope.row.fileJson)" class="moduleImg" :src="scope.row.fileJson" alt="">
            <img v-else class="moduleImg" src="https://cdnfile-10043692.file.myqcloud.com/httpsresources/picinput.png" alt="">
          </template>
        </el-table-column>
        <el-table-column  label="操作" align="center" width="220">
          <template slot-scope="scope">
              <el-button size="small" type="text" @click.native="editOneMessage(scope.row.id)">
                编辑
              </el-button>
              <el-button size="small" type="text" @click="deleOneMessage(scope.row.id)">
                删除
              </el-button>
          </template>
        </el-table-column>
       </el-table>
       <div v-show="!listLoading" class="pagination-container">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                          :current-page.sync="listQuery.pageNo" :page-sizes="[10,20,30, 50]"
                          :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper"
                          :total="total">
          </el-pagination>
      </div>
    </div>
    <previewer-dialog ref="previewer" :src="picSrc"></previewer-dialog>
  </div>
</template>

<script>
import _ from 'lodash';
import {mapGetters} from 'vuex';
import mixins from '@/mixins/windowResize';
import {getSchoolWebSuspendMessageList,delSchoolWebSuspendMessageByIds} from '@/api/otherMessage';
import PreviewerDialog from '@/components/ImagePreviewer/PreviewerDialogOne.vue';
export default{
  components:{
    PreviewerDialog
  },
  data(){
    return{
      listQuery:{
        pageNo:1,
        pageSize:10,
        title:''
      },
      listLoading:false,
      messageTable: [],
      total:null,
      multipleSelection:[],
      picSrc:''
    }
  },
   activated(){
      this.getSchoolWebSuspendMessageListFunc();
    },
  mounted(){
    this.getSchoolWebSuspendMessageListFunc();
  },
  mixins:[mixins],
  filters:{
    filterTime(date){
      return date==''?'':date.slice(0,10);
    }
  },
  computed:{
    ...mapGetters([
      'permission'
    ])
  },
  methods:{
    showModuleImg(src){
      this.picSrc=src;
      this.$refs.previewer.show();
    },
    delMessages(){
      if(!this.multipleSelection.length){
        this.$message({
          type:'warning',
          message:'请选择要删除的消息'
        })
      }else{
        this.$confirm('删除此消息网站上将不再展示？','提示',{type:'error'}).then(()=>{
          let arr=this.multipleSelection.map(obj=>{
            return obj.id;
          })
          delSchoolWebSuspendMessageByIds({
            messageIds:arr.toString()
          }).then(res=>res.data)
          .then(data=>{
            if(data.code===200){
              this.getSchoolWebSuspendMessageListFunc();
              this.$message({
                  type: 'success',
                  message: '删除成功!'
              });
            }
          })
        }).catch(() => {})
      }
    },
    deleOneMessage(id){
      this.$confirm('删除此消息网站上将不再展示？','提示',{type:'error'}).then(()=>{
        delSchoolWebSuspendMessageByIds({
          messageIds:id
        }).then(res=>res.data)
        .then(data=>{
          if(data.code===200){
            this.getSchoolWebSuspendMessageListFunc();
            this.$message({
                type: 'success',
                message: '删除成功!'
            });
          }
        })
      }).catch(() => {})
    },
    handleCurrentChange(val){
      this.listQuery.pageNo=val;
      this.getSchoolWebSuspendMessageListFunc();
    },
    handleSizeChange(val){
      this.listQuery.pageSize=val;
      this.getSchoolWebSuspendMessageListFunc();
    },
    handleInputChange:_.debounce(function(val){
      this.getSchoolWebSuspendMessageListFunc();
    },500),
    getSchoolWebSuspendMessageListFunc(){
      this.listLoading=true;
      getSchoolWebSuspendMessageList({
        pageNo:this.listQuery.pageNo,
        pageSize:this.listQuery.pageSize,
        title:this.listQuery.title,
        webId:localStorage.getItem("webId")
      }).then(res=>res.data)
      .then(data=>{
        if(data.code===200){
          this.messageTable=data.data.dataList;
          this.total=data.data.pagination.total;
          this.listLoading=false;
        }
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    addmessage(){
      //新增
      this.$router.push({
        path:'floatNewsJia'
      })
    },
    editOneMessage(id){
      //编辑
      this.$router.push({
        path:'editFloatNews',
        query:{
          id:id
        }
      })
    },
    setNew(){
      //设置
    }
  }
}
</script>

<style lang="scss" scoped>
.newsIndexWrapper{
  .menu-row{
    border-bottom: 1px solid #e7eaec;
    box-sizing: border-box;
    padding-bottom:15px;
    padding-top:15px;
  }
  .message-main{
    margin-top:20px;
  }
  .pagination-container{
    margin-top: 20px;
  }
}
.newList-wrap{
  width:100%;
  padding:20px 15px;
  overflow-x: hidden;
  overflow-y: auto;
  box-sizing: border-box;
}
.menu-row{
  border-bottom: 1px solid #e7eaec;
  box-sizing: border-box;
  padding-bottom:20px;
}
.menu-row .el-button{
  margin-left: 15px;
}
.messageTable{
  .moduleImg{
    width:50px;
    height:25px;
    cursor: pointer;
    vertical-align: middle;
  }
}

</style>
<style lang="scss">
.el-table-filter__list-item:nth-child(1){
  display:none !important;
}
.el-table__body-wrapper {
  overflow-x: hidden;
  overflow-y: auto;
}

.el-table__body-wrapper::-webkit-scrollbar {
  width: 6px;
  background-color: rgba(255, 255, 255, 0.1);
}

.el-table__body-wrapper::-webkit-scrollbar-thumb {
  background-color: #999;
}

.el-table__body-wrapper::-webkit-scrollbar-track {
  background-color: rgba(255, 255, 255, 0.1);
}
</style>
