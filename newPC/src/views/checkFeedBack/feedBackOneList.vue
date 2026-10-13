<template>
  <div class="feedBackList">
    <back-tool>
    </back-tool>
    <el-table class="tableOne" stripe :data="checkFeedTable" v-loading.body="listLoading" border fit highlight-current-row
              style="width: 100%" :height="maxH">
        <el-table-column align="center" label="教师姓名" show-overflow-tooltip>
            <template slot-scope="scope">
                <span class="link-type" @click="jumpTo('feedBackDetail',{
                  id:scope.row.id
                })">{{scope.row.teacherName}}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="检查类型" show-overflow-tooltip >
            <template slot-scope="scope">
                <span>{{scope.row.checkTypeName}}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="反馈类型" show-overflow-tooltip>
            <template slot-scope="scope">
                <span>{{scope.row.feedbackTypeName}}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="日期" show-overflow-tooltip>
            <template slot-scope="scope">
                <span>{{scope.row.checkDate}}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="落款部门" show-overflow-tooltip>
            <template slot-scope="scope">
                <span>{{scope.row.departName}}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="公示时间" show-overflow-tooltip>
            <template slot-scope="scope">
                <span>{{scope.row.createTime|changeTime}}</span>
            </template>
        </el-table-column>
        <el-table-column
                label="操作"
                align="center"
                width="120px"
                :resizable="false"
        >
            <template slot-scope="scope">
                <el-button size="small" type="text" @click="backHandler(scope.row.id)">撤销通报
                </el-button>
            </template>
        </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                        :current-page.sync="pageNo" :page-sizes="[10,20,30, 50]"
                        :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
                        :total="total">
        </el-pagination>
    </div>
  </div>
</template>
<script>
import {findOneTeacherListByPage,deleteCheckFeedback} from '@/api/checkFeedBack';
import mixin from '@/mixins/windowResize';
import BackTool from '@/components/BackTool';
import moment from "moment";
export default {
  components: {
    BackTool
  },
  data(){
    return{
      startDate:this.$route.query.startDate,
      endDate:this.$route.query.endDate,
      teacherId:this.$route.query.teacherId,
      pageNo:1,
      pageSize:20,
      listLoading:false,
      checkFeedTable:[],
      total:0,
      exportURL:''
    }
  },
  created(){
    
  },
  mounted(){
    this.findOneTeacherListByPageFunc();
  },
  mixins: [mixin],
  filters:{
    changeTime(date1){
      return date1?moment(new Date(Number(date1))).format('YYYY-MM-DD hh:mm:ss'):'';
    }
  },
  methods:{
    findOneTeacherListByPageFunc(){
      this.listLoading=true;
      findOneTeacherListByPage({
        pageNo:this.pageNo,
        pageSize:this.pageSize,
        startDate:this.startDate,
        endDate:this.endDate,
        teacherId:this.teacherId
      }).then(res=>res.data)
      .then(data=>{
        if(data.code===200){
          this.checkFeedTable=data.data.dataList;
          if(this.checkFeedTable.length==0&&this.pageNo>1){
            this.pageNo--;
            this.findOneTeacherListByPageFunc();
          }
          this.total=data.data.pagination.total;
          this.listLoading=false;
        }
      }).catch(()=>{
        this.listLoading=false;
      })
    },
    handleCurrentChange(val){
      this.pageNo=val;
      this.findOneTeacherListByPageFunc();
    },
    handleSizeChange(val){
      this.pageSize=val;
      this.findOneTeacherListByPageFunc();
    },
    backHandler(id){
      this.$confirm('是否确定要撤销通报？','提示',{type:'error'}).then(()=>{
         deleteCheckFeedback({
           id:id
         }).then(res=>res.data)
         .then(data=>{
           if(data.code===200){
              this.$message({
                  type: 'success',
                  message: '撤销成功!'
              });
              this.findOneTeacherListByPageFunc();
           }
         })
      }).catch(() => {})
    },
    jumpTo(path,query={}){
      this.$router.push({
        path,
        query
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.feedBackList{
  padding:12px;
  box-sizing: border-box;
}
.header {
  margin-bottom: 10px;
  font-size:14px;
  .el-input{
      width:auto;
  }
}
.header2{
  margin-top:10px;
}
.search-input{
  margin-left:10px;
}
</style>

