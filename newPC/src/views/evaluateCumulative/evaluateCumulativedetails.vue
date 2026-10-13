<template>
<div class="evaluateCumulativedetails"  >
     <div class="top"> 
          <el-row>
            <el-col :span="6">
               <el-button @click="$router.back()" type="default" size="medium">返回</el-button>
            </el-col>
            <el-col :span="12">            
               <div class="name">{{name}}</div>
            </el-col>
        </el-row>
      </div>
     <div class="subject Dictionariesadd" :style="`height: ${nobottommaxH}px;`">
         <div class="top-box">
           <div class="left">
              <img class="Hat" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/evaluateCumulative/Hat.png" alt="">
              <img class="img" :src="myobj.stuLogo">
          <div class="top-name">
              <div>姓名：{{myobj.stuName}}</div>
              <div>班级：{{myobj.className}}</div>
              <div>称号：{{myobj.nowMedal}}&nbsp;&nbsp; 
                <span v-if="myobj.nextMedal">
                 <el-progress :text-inside="true" style="top: 3px;" :show-text="false" :stroke-width="16" :percentage="myobj.mynum"></el-progress>
                  &nbsp;&nbsp;{{myobj.nextMedal}} &nbsp;&nbsp;</span>                   
              </div>
              <div @click="evaluateCumulativeStatistics()">积分：{{myobj.stuPoint}}</div>
          </div>
           </div>
           <div  class="chart-container" id="chart"></div>   
          </div>   
          <div class="body">
            <div class="box-top">被助力记录</div>
             <div class="header">
      <el-date-picker size="small" v-model="daterange" type="daterange" class="mywidthdaterange" range-separator="-"  start-placeholder="开始日期" end-placeholder="结束日期" @change="timefun()" :clearable="false"> </el-date-picker>
      <a :href="downLoadHref" v-if="dataList.length" target="_blank" download="examName"><el-button type="primary"  size="small">导出</el-button></a> 
      
    </div>
    <div class="schoolWrap scrollStyle" >
           <el-table  :data="dataList"  border stripe  :height="maxH-390">
                <el-table-column   prop="stuName" label="助力人"  align="center" show-overflow-tooltip> </el-table-column>
                <el-table-column   prop="dimensionName" label="助力维度"  align="center" show-overflow-tooltip> </el-table-column>
                <el-table-column   prop="operateTime" label="助力时间"  align="center" show-overflow-tooltip> 
                  <template slot-scope="scope">
                      {{scope.row.operateTime|filterDate}}
                    </template>
                </el-table-column>
                <el-table-column   prop="operateRemark" label="助力理由"  align="center" show-overflow-tooltip> </el-table-column>
                <el-table-column    label="助力结果"  align="center" show-overflow-tooltip> 
                  <template slot-scope="scope">
                    <el-tag  size="mini" type="success" v-if="scope.row.scoreType==1" >+{{scope.row.score}}分</el-tag>
                    <el-tag  size="mini" type="danger" v-if="scope.row.scoreType==2" >-{{scope.row.score}}分</el-tag>
                    </template>
                </el-table-column>
                <el-table-column   label="操作"  align="center" width="120">
                    <template slot-scope="scope">
                       <el-button size="small" type="text" @click="deleteStuAssessRecordByRecordIds(scope.row.id)" class="buttontextred">删除</el-button>
                    </template>
                  </el-table-column>
            </el-table>   
    </div>
     <div class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page.sync="query.pageNo" :page-sizes="[10,20,30,50]"
                           :page-size="query.pageSize" layout="total, sizes, prev, pager, next, jumper"
                           :total="total">
            </el-pagination>
        </div>
            
          </div>    
        
     </div>     
</div> 
</template>
<script>
import {
  getStuAllDimensionDataList,
  getStuAssessPointInfoData,
  getCurrentSchoolTimeBySchoolId,
  getStuAssessRecordPageList,deleteStuAssessRecordByRecordId
} from "@/api/evaluateCumulative";
import mixin from "@/mixins/windowResize";
import echarts from "echarts";
export default {
  data() {
    return {
      dataList: [],
      id: this.$route.query.id,
      myobj: {
        nextFlowerNum: "",
        nextMedalLogo: "",
        nextMedal: "",
        nowMedal: "",
        nowMedalLogo: "",
        badDimensionNotice: "",
        mynum:""
      },
      daterange: [],
      query: {
        startDate: "",
        endDate: "",
        pageNo: 1, //页数
        pageSize: 20, //条数
        userId: this.$route.query.id
      },
      downLoadHref: "",
      total: null,
    };
  },
  mixins: [mixin],
  filters:{
    filterDate(date){
      return date?date.slice(0,19):'';
    },
  },
  created() {
    this.getStuAllDimensionDataLists();
    this.getStuAssessPointInfoDatas();
    getCurrentSchoolTimeBySchoolId().then(res => {
      this.daterange = [
        res.data.data.startDate,
        this.$moment().format("YYYY-MM-DD")
      ];
      this.getStuAssessRecordPageLists();
    });
  },
  methods: {
    deleteStuAssessRecordByRecordIds(id) {
      this.$confirm("确认要删除吗？", "删除", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        lockScroll: false
      }).then(() => {         
          deleteStuAssessRecordByRecordId(id).then(res => {
            if (res.data.code === 200) {
              this.$message.success("删除成功！");
               this.getStuAssessRecordPageLists();
            } else {
              this.$message.error(res.data.msg);
            }
          });
        })
        .catch(() => {});
    },
    getStuAssessRecordPageLists() {
      this.dataList = [];
      this.query.startDate = this.$moment(this.daterange[0]).format(
        "YYYY-MM-DD"
      ); //时间
      this.query.endDate = this.$moment(this.daterange[1]).format("YYYY-MM-DD"); //时间
      this.downLoadHref =
        global.BasePath +
        "structure/cumulAssess/downloadStuAssessRecordList?endDate=" +
        this.query.endDate +
        "&startDate=" +
        this.query.startDate +
        "&userId=" +
        this.query.userId +
        "&token=" +
        this.$store.getters.token;
      getStuAssessRecordPageList(this.query).then(res => {
        let data = res.data.data;
        this.dataList = data.dataList;
        this.total = data.pagination.total;
      });
    },
    //切换条数
    handleSizeChange(val) {
      this.query.pageNo = 1;
      this.query.pageSize = val;
      this.getStuAssessRecordPageLists();
    },
    timefun(){
       this.query.pageNo = 1;
      this.getStuAssessRecordPageLists();
    },
    //切换页数
    handleCurrentChange(val) {      
      this.query.pageNo = val;
      this.getStuAssessRecordPageLists();
    },
    getStuAssessPointInfoDatas() {
      getStuAssessPointInfoData(this.id)
        .then(res => res.data)
        .then(data => {
          if (data.code === 200) {
            this.myobj = data.data;
            if (!this.myobj.nowMedal) {
              this.myobj.nowMedal = "暂无";
            }            
            if(this.myobj.nextMedal){
               this.myobj.mynum=parseFloat((this.myobj.flowerNum*100)/this.myobj.nextFlowerNum).toFixed(2);
            }
           
          }
        });
    },
    getStuAllDimensionDataLists() {
      getStuAllDimensionDataList(this.id)
        .then(res => res.data)
        .then(data => {
          if (data.code === 200) {
            let mydata = data.data;
            let max = 0;
            for (let i = 0; i < mydata.length; i++) {
              if (mydata[i].score - 0 > max) {
                max = mydata[i].score - 0;
              }
            }
            max = max + 10;
            let listone = [];
            let listtwo = [];
            for (let i = 0; i < mydata.length; i++) {
              listone.push({ name: mydata[i].dimensionName, max: max });
              listtwo.push(mydata[i].score - 0);
            }
            this.echartsBoxfun(listone, listtwo);
          }
        });
    },
    //渲染折线图
    echartsBoxfun(listone, listtwo) {
      echarts.init(document.getElementById("chart")).setOption({
        tooltip: {},
        radar: {
          name: {
            textStyle: {
              color: "#409EFF",
              backgroundColor: "#ecf5ff",
              borderRadius: 3,
              padding: [3, 5]
            }
          },
          grid: {
            top: "5%",
            left: "15%",
            right: "15%",
            bottom: "5%",
            containLabel: true
          },
          indicator: listone
        },
        series: [
          {
            name: "分数",
            type: "radar",
            label: {
              normal: {
                show: true
              }
            },
            data: [
              {
                value: listtwo,
                name: "得分"
              }
            ],
            color: "#409EFF"
          }
        ]
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.evaluateCumulativedetails {
  padding:12px;
  .el-progress{
   display: inline-block;
    width: 100px;
  }
  .box-top {
    line-height: 30px;
    font-size: 16px;
    border-left: 4px solid #409eff;
    padding-left: 10px;
    background: #ecf5ff;
    margin-bottom: 10px;
  }
  .top {
    border-bottom: 1px solid #e7eaec;
    padding-bottom: 10px;
    .name {
      line-height: 36px;
      font-size: 20px;
      text-align: center;
    }
  }
  .header {
    padding-bottom: 10px;
  }
  .subject {
    overflow: auto;
    .top-box {
      height: 280px;
      width: 800px;
      margin: 5px auto;
      .left {
        width: 400px;
        float: left;
        height: 280px;
        position: relative;
        .top-name {
          width: 100%;
          padding: 50px 0 50px 80px;
          line-height: 30px;
          font-size: 14px;
          color: #303133;
          i {
            color: #409eff;
          }
        }
        .img {
          width: 60px;
          height: 60px;
          position: absolute;
          top: 60px;
          left: 10px;
          border-radius: 30px;
        }
        .Hat{
            width: 70px;
            left: 4px;
            top: 38px;
            position: absolute;
            z-index: 100;
        }
      }
    }
    .chart-container {
      width: 400px;
      height: 280px;
      float: left;
    }
  }
}
</style>