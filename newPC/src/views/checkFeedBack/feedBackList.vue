<template>
  <div class="feedBackList">
    <div class="header-wrap">
      <div class="header">
        <el-row>
          <el-col :span="19">
         
          <!---->
          <template>
              <el-date-picker style="width:220px"
                v-model="daterange"
                type="daterange" class="mywidthdaterange"
                size="medium"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :clearable="false"
                @change="findDate()"
                >
              </el-date-picker>
          </template>
          <template>
              <el-select v-model="checkTypeCode" style="width:135px" placeholder="请选择检查类型" @change="changeCheckType" size="medium">
                  <el-option label="全部检查类型" :value="0"></el-option>
                  <el-option v-for="checkTypeItem in checkTypeList" :key="checkTypeItem.code" :label="checkTypeItem.value" :value="checkTypeItem.code">
                  </el-option>
              </el-select>
          </template>
          <template>
              <el-select v-model="feedTypeCode" style="width:135px" placeholder="请选择反馈类型" @change="changeFeedType" size="medium">
                  <el-option label="全部反馈类型" :value="0"></el-option>
                  <el-option v-for="feedTypeItem in feedTypeList" :key="feedTypeItem.code" :label="feedTypeItem.value" :value="feedTypeItem.code">
                  </el-option>
              </el-select>
          </template>
           <el-button type="primary" size="medium"   @click="jumpTo('addFeedBack')">新增</el-button>
          <a :href="exportURL" download="导出结果" target="_blank" v-if="checkFeedTable&&checkFeedTable.length!==0"  >
              <el-button size="medium" class="filter-item" type="primary" >导出</el-button>
          </a>
          <el-button type="primary" size="medium"   @click="jumpTo('feedBackStatic')" v-if="isShowByPermission('/checkFeedback/statistic')">数据统计</el-button>
          </el-col>
          <el-col :span="5">
          <template>
            <el-input
                      placeholder="姓名" icon="search" size="medium" @keyup.enter.native="handleInputChange"
                      v-model.trim="listQuery.teacherName">
                <el-button slot="append" icon="el-icon-search" @click="handleInputChange"></el-button>
            </el-input>
          </template>
          </el-col>
        </el-row>
      </div>
    </div>
    <el-table stripe :data="checkFeedTable" v-loading.body="listLoading" border fit highlight-current-row
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
                        :current-page.sync="listQuery.pageNo" :page-sizes="[10,20,30, 50]"
                        :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper"
                        :total="total">
        </el-pagination>
    </div>
  </div>
</template>
<script>
import {findSchoolDicsByCode,findCheckFeedbackListByPage,deleteCheckFeedback} from '@/api/checkFeedBack';
import _ from 'lodash';
import mixin from '@/mixins/windowResize';
import moment from "moment";
import {isShowByPermission} from "@/utils";
export default {
  data(){
    return{
      daterange:[new Date(), new Date()],
      listQuery:{
        startDate:'',
        endDate:'',
        teacherName:'',
        pageNo:1,
        pageSize:20
      },
      checkTypeList:[],
      checkTypeCode:'',
      feedTypeList:[],
      feedTypeCode:'',
      listLoading:false,
      checkFeedTable:[],
      total:0,
      exportURL:''
    }
  },
  created(){
    this.daterange[0] = new Date(this.$moment().set('date', 1).valueOf());
    this.listQuery.startDate = this.$moment(this.daterange[0]).format('YYYY-MM-DD'); //时间
    this.listQuery.endDate = this.$moment(this.daterange[1]).format('YYYY-MM-DD');
    this.checkTypeCode=0;
    this.feedTypeCode=0;
    this.checkTypeFunc();
    this.feedBackFunc();
  },
  mounted(){
    //获取表格数据
    this.findCheckFeedbackListByPageFunc();
  },
  mixins: [mixin],
  filters:{
    changeTime(date1){
      return date1?moment(new Date(Number(date1))).format('YYYY-MM-DD hh:mm:ss'):'';
    }
  },
  methods:{
    isShowByPermission,
    findCheckFeedbackListByPageFunc(){
      this.listLoading=true;
      findCheckFeedbackListByPage({
        checkTypeCode:this.checkTypeCode==0?'':this.checkTypeCode,
        feedbackTypeCode:this.feedTypeCode==0?'':this.feedTypeCode,
        pageNo:this.listQuery.pageNo,
        pageSize:this.listQuery.pageSize,
        startDate:this.listQuery.startDate,
        endDate:this.listQuery.endDate,
        teacherName:this.listQuery.teacherName
      }).then(res=>res.data)
      .then(data=>{
        if(data.code===200){
          this.checkFeedTable=data.data.dataList;
          if(this.checkFeedTable.length==0&&this.listQuery.pageNo>1){
            this.listQuery.pageNo--;
            this.findCheckFeedbackListByPageFunc();
          }
          this.total=data.data.pagination.total;
          if(this.checkTypeCode==0){
            this.checkTypeCode='';
          }else{  
            this.checkTypeCode=this.checkTypeCode;
          }
          if(this.feedTypeCode==0){
            this.feedTypeCode='';
          }else{
            this.feedTypeCode=this.feedTypeCode;
          }
          /*导出*/
          this.exportURL=global.BasePath+'structure/checkFeedback/exportFeedBackList?checkTypeCode='+this.checkTypeCode+'&feedbackTypeCode='+this.feedTypeCode+'&startDate='+this.listQuery.startDate+'&endDate='+this.listQuery.endDate+'&teacherName='+this.listQuery.teacherName+'&excelName='+'检查反馈'+'&fields='+'teacherName,checkTypeName,feedbackTypeName,checkDate,departName,createTime'+'&titles='+'教师姓名,检查类型,反馈类型,日期,落款部门,公示时间'+'&token='+ this.$store.getters.token;
          this.listLoading=false;
          if(this.checkTypeCode==''){
            this.checkTypeCode=0;
          }
          if(this.feedTypeCode==''){
            this.feedTypeCode=0;
          }
        }
      }).catch(()=>{
        this.listLoading=false;
      })
    },
    handleCurrentChange(val){
      this.listQuery.pageNo=val;
      this.findCheckFeedbackListByPageFunc();
    },
    handleSizeChange(val){
      this.listQuery.pageSize=val;
      this.findCheckFeedbackListByPageFunc();
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
              this.findCheckFeedbackListByPageFunc();
           }
         })
      }).catch(() => {})
    },
    handleInputChange:_.debounce(
        function () {
           this.findCheckFeedbackListByPageFunc();
        },
        // 这是我们为用户停止输入等待的毫秒数
        500
    ),
    changeCheckType(val){
      if(val==0){
        this.checkTypeCode=val;
        this.feedTypeCode=0;
        this.listQuery.teacherName='';
        this.findCheckFeedbackListByPageFunc();
      }else{
        this.checkTypeCode=val;
        this.feedTypeCode=0;
        this.listQuery.teacherName='';
        this.findCheckFeedbackListByPageFunc();
      }
    },
    checkTypeFunc(){
      findSchoolDicsByCode({
        dicCode:'checkFeedback_checkType'
      }).then(res=>res.data)
      .then(data=>{
        if(data.code===200){
          this.checkTypeList=data.data;
        }
      })
    },
    changeFeedType(val){
      if(val==0){
        this.feedTypeCode=0;
        this.listQuery.teacherName='';
        this.findCheckFeedbackListByPageFunc();
      }else{
        this.feedTypeCode=val;
        this.listQuery.teacherName='';
        this.findCheckFeedbackListByPageFunc();
      }
    },
    feedBackFunc(){
      findSchoolDicsByCode({
        dicCode:'checkFeedback_feedbackType'
      }).then(res=>res.data)
      .then(data=>{
        if(data.code===200){
          this.feedTypeList=data.data;
        }
      })
    },
    findDate(){
      this.listQuery.startDate = this.$moment(this.daterange[0]).format('YYYY-MM-DD'); //时间
      this.listQuery.endDate = this.$moment(this.daterange[1]).format('YYYY-MM-DD'); //时间
      this.checkTypeCode=0;
      this.feedTypeCode=0;
      this.listQuery.teacherName='';
      this.findCheckFeedbackListByPageFunc();
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
}
.header2{
  margin-top:10px;
}
.search-input{
  margin-left:10px;
}
</style>

