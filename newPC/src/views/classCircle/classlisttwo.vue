<template>
  <div class="classlistone">    
 <el-tabs type="border-card"  v-model="activeName" @tab-click="tabsfun()">
      <el-tab-pane label="按老师统计" name="one"></el-tab-pane>
      <el-tab-pane label="按班级统计" name="two">
        <div class="header"><el-button size="medium" @click="classCircleListIndex()">返回</el-button> 
      <el-date-picker size="medium"  v-model="daterange" type="daterange" class="mywidthdaterange" range-separator="-"  start-placeholder="开始日期" end-placeholder="结束日期" @change="inputsearchNametime()" :clearable="false"> </el-date-picker>
      <a :href="downLoadHref" target="_blank" download="examName" v-if="dataList.length"><el-button type="primary"  size="medium">导出</el-button></a> 
      <el-input class="search-input search-input--right" size="medium" placeholder="请输入班级名称" v-model.trim="query.searchName" @input="inputsearchNametime()">
            <el-button slot="append" icon="el-icon-search" @click="inputsearchNametime()"></el-button>
       </el-input>
    </div>
    <div class="schoolWrap scrollStyle" >
           <el-table  :data="dataList"  border stripe  :height="maxH-70">
                <el-table-column   prop="className" label="班级"  align="center" show-overflow-tooltip> </el-table-column>
                <el-table-column   prop="circleCount" label="发帖数"  align="center" show-overflow-tooltip> </el-table-column>
                <el-table-column   prop="digestCount" label="被加精数"  align="center" show-overflow-tooltip> </el-table-column>
                <el-table-column   prop="fabulousCount" label="被点赞数"  align="center" show-overflow-tooltip> </el-table-column>
                <el-table-column   prop="commentCount" label="被评论数"  align="center" show-overflow-tooltip> </el-table-column>
            </el-table>   
    </div>
     <div class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page.sync="query.pageNo" :page-sizes="[10,20,30, 50]"
                           :page-size="query.pageSize" layout="total, sizes, prev, pager, next, jumper"
                           :total="total">
            </el-pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane label="按学生统计" name="three"></el-tab-pane>
</el-tabs>
    
    
  </div>
</template>
<script>
import mixins from "@/mixins/windowResize";
import baseMixin from "@/mixins/baseMixin";
import moment from "moment";
import {getSchoolCircleStaticPageData} from '@/api/classCircle';
export default {
  data() {
    return {
      dataList: [],
      daterange: ["", ""],
      total: null,
      query: {
        byType:'2',
        startTime: "",
        endTime: "",
        pageNo: 1, //页数
        pageSize: 20, //条数
        searchName:'',
        classId:0
      },
      downLoadHref:'',
      activeName:'two'
    };
  },
  created() {           
      if(this.$route.query.startTime){
            this.daterange = [this.$route.query.startTime,this.$route.query.endTime];
      }else{
          this.daterange = [this.$moment().format("YYYY-MM-DD"),this.$moment().format("YYYY-MM-DD")];
      };    
     this.getSchoolCircleStaticPageDatas();
  },  
  mixins: [mixins, baseMixin],
  methods: {
      //返回
    classCircleListIndex() {
     this.$router.push({
        path: "classCircleListIndex"
      });
    },
    //班级统计
    tabsfun() {
      this.query.startTime = this.$moment(this.daterange[0]).format("YYYY-MM-DD"); //时间
      this.query.endTime = this.$moment(this.daterange[1]).format("YYYY-MM-DD"); //时间
      if(this.activeName=='one'){
          this.$router.push({
        path: "classlistone",
        query: {
            endTime:this.query.endTime,
             startTime:this.query.startTime
        }
      });
      }else if(this.activeName=='three'){
         this.$router.push({
        path: "classlistthree",
        query: {
            endTime:this.query.endTime,
             startTime:this.query.startTime
        }
      });
      }
      
    },
    //获取列表
    getSchoolCircleStaticPageDatas() {
      this.datalist = [];
      this.query.startTime = this.$moment(this.daterange[0]).format("YYYY-MM-DD"); //时间
      this.query.endTime = this.$moment(this.daterange[1]).format("YYYY-MM-DD"); //时间
      this. downLoadHref=global.BasePath + "structure/classCircle/exportCircleStaticsDataToXls?startTime=" +this.query.startTime +"&byType=2&classId=0"+"&endTime=" +this.query.endTime+"&token=" +this.$store.getters.token;
         getSchoolCircleStaticPageData(this.query).then(res => {
                    let data = res.data.data;
                    this.dataList = data.dataList;
                    this.total = data.pagination.total;
       });
    },
    inputsearchNametime(){
      this.query.pageSize = 20;
      this.query.pageNo = 1;
      this.getSchoolCircleStaticPageDatas();
    },
    //切换条数
    handleSizeChange(val) {
      this.query.pageSize = val;
      this.query.pageNo = 1;
      this.getSchoolCircleStaticPageDatas();
    },
    //切换页数
    handleCurrentChange() {
      this.getSchoolCircleStaticPageDatas();
    }
  }
};
</script>
<style lang="scss" scoped>
.classlistone {
  padding: 12px;
  box-sizing: border-box;
  font-size: 14px;

  * {
    box-sizing: border-box;
  }
  .checkbox-box {
    padding-bottom: 10px;
  }
  .button-top{
      float: left;
  }
  .search-input--right{
    width: 20%  !important;
  }
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 240px;
  }
  .el-select {
    width: 175px;
  }
  .red {
    color: #f56c6c;
  }
  .green {
    color: #67c23a;
  }
  .filter-item {
    width: 100px;
  }
  .header {
    padding-bottom: 10px;
   
   
  }
  .schoolWrap {
    overflow-x: hidden;
    overflow-y: auto;
    box-sizing: border-box;
    .title {
      line-height: 34px;
      height: 34px;
      .square {
        display: inline-block;
        width: 10px;
        height: 10px;
        background: #acd6ff;
        margin: 15px 8px 0 0;
      }
    }
    .text {
      padding-left: 18px;
      box-sizing: border-box;
      h3 {
        font-size: 16px;
      }
    }
  }
}
</style>

