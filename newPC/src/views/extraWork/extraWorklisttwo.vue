<template>
  <div class="extraWorklisttwo">
      <div class="header">
          <el-date-picker format="yyyy-MM-dd" value-format="yyyy-MM-dd" size="medium"  v-model="daterange" type="daterange" class="mywidthdaterange" range-separator="-"  start-placeholder="开始日期" end-placeholder="结束日期" @change="loadExtraWorkLists()" :clearable="false"> </el-date-picker>
          <el-button type="primary" size="medium"  @click="jumpToPage('extraWorklistone', {startTime: daterange[0], endTime: daterange[1]})" >查看明细</el-button>
          <el-button type="primary" size="medium"  @click="exportExcel('#outTable', `加班统计.xlsx`)"   v-if="dataList.length>0">导出</el-button>
      </div>
      <div class="schoolWrap scrollStyle" :style="{height: `${maxH-20}px`}">
          <div class="box" v-for="(item,index) in dataList" :key="index" @click="extraWorklistthree(item.workUserId)">
              <img :src="item.workUserPic" alt="">
              <div class="name">{{item.workUserName}}</div>
              <div class="time">
                  <span v-if="item.workDayTime!=0">{{item.workDayTime}}天&nbsp;&nbsp;</span>
                  <span v-if="item.workTime!=0">{{item.workTime}}小时</span>
              </div>
          </div>
      </div>
      <div  id="outTable" style="display: none;">
          <el-table  :data="dataList" >
              <el-table-column   prop="workUserName" label="姓名" align="center"> </el-table-column>
              <el-table-column   prop="workDayTime" label="天" align="center"> </el-table-column>
              <el-table-column   prop="workTime" label="小时" align="center"> </el-table-column>
          </el-table>
      </div>
  </div>
</template>
<script>
import mixins from "@/mixins/windowResize";
import baseMixin from "@/mixins/baseMixin";
import moment from "moment";
import {countDetail} from '@/api/extraWork';
export default {
  data() {
    return {
      dataList: [],
      daterange: ["", ""],
      query: {
        startTime: "",
        endTime: "",
      },
      activeName:'two'
    };
  },
  created() {
     if(this.$route.query.startTime){
            this.daterange = [this.$route.query.startTime,this.$route.query.endTime];
      } else if(this.$route.query.date){
          this.daterange = [this.$route.query.date,this.$route.query.date];
      } else {
         this.daterange = [this.$moment().startOf('month').format("YYYY-MM-DD"),this.$moment().format("YYYY-MM-DD")];
     }
    this.loadExtraWorkLists();
  },
  mixins: [mixins, baseMixin],
  methods: {
    tabsfun() {
      if(this.activeName=='one'){
       this.query.startTime = this.$moment(this.daterange[0]).format("YYYY-MM-DD"); //时间
      this.query.endTime = this.$moment(this.daterange[1]).format("YYYY-MM-DD"); //时间
      this.$router.push({
        path: "extraWorklistone",
        query: {
            endTime:this.query.endTime,
            startTime:this.query.startTime
        }
      });
      }
    },
     extraWorklistthree(workUserId) {
      this.query.startTime = this.$moment(this.daterange[0]).format("YYYY-MM-DD"); //时间
      this.query.endTime = this.$moment(this.daterange[1]).format("YYYY-MM-DD"); //时间
      this.$router.push({
        path: "extraWorklistthree",
        query: {
            endTime:this.query.endTime,
            startTime:this.query.startTime,
            workUserId:workUserId
        }
      });
    },
    //获取列表
    loadExtraWorkLists() {
      this.datalist = [];
      this.query.startTime = this.$moment(this.daterange[0]).format("YYYY-MM-DD"); //时间
      this.query.endTime = this.$moment(this.daterange[1]).format("YYYY-MM-DD"); //时间
      countDetail(this.query).then(res => {
                    this.dataList = res.data.data;
       });
    }
  }
};
</script>
<style scoped>
.el-range-editor--medium .el-range-separator {
  width: 30px;
}
</style>

<style lang="scss" scoped>
.extraWorklisttwo {
  padding: 12px;
  box-sizing: border-box;
  font-size: 14px;

  * {
    box-sizing: border-box;
  }
  .checkbox-box {
    padding-bottom: 10px;
  }
  .box{
    float: left;
    margin-top: 10px;
    margin-left: 20px;
    padding: 10px;
    border-radius: 5px;
    background: #eff6fe;
    width:200px;
    line-height: 12px;   
    color: #409eff;
    cursor:pointer;
     height: 70px;
    div{
       padding-left: 55px;
       line-height: 25px;      
    }
    img{
        width: 50px;
        height: 50px;
        float: left;
    }
    
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
    border-bottom: 1px solid #e7eaec;
    
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

