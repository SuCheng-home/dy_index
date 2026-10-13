<template>
  <div class="memorabiliaList">
    <div class="header">
        <el-col :span="19">
            <!---->
          <template>
            <el-select
              class="select-width"
              v-model="schoolTimeId"
              placeholder="请选择学期"
              @change="schoolTimeIdfun"
              size="medium"
            >
              <el-option
                v-for="(item,index) in schoolYearList"
                :key="index"
                :label="item.schoolTimeName"
                :value="item.id"
              ></el-option>
            </el-select>
          </template>
          <template>
            <el-date-picker
              v-model="daterange"
              type="daterange" class="time-select mywidthdaterange"
              size="medium"
              range-separator="-" :picker-options="pickerOptions"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :clearable="false"
              @change="getClassScheduleTeacherStaticListWeek"
            ></el-date-picker>
          </template>
           <el-select class="filter-item" size="medium" v-model="currId" placeholder="请选择学科"
                       @change="getClassScheduleTeacherStaticListWeek()">
                <el-option label="全部学科" :value="0"></el-option>
                <el-option v-for="item in Courselist" :key="item.id" :label="item.name"
                           :value="item.id"></el-option>
            </el-select>
         <el-button type="primary" size="medium"  @click="exportExcel('#outTable', `课时统计.xlsx`)"   v-if="mydatalist.length>0">导出</el-button>
            </el-col>
            <el-col :span="5">
              <el-input  size="medium" placeholder="请输入老师姓名" v-model.trim="name" @input="handleInputChange">
            <el-button slot="append" icon="el-icon-search" @click="handleInputChange"></el-button>
       </el-input>
            </el-col>
    </div>
    <div class="main-wrap" id="outTable">
      <el-table
        border
        stripe
        style="width: 100%;"
        :height="nobottommaxH"
        :data="mydatalist"
      >
        <el-table-column align="center" label="老师姓名" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.teacherName || '--' }}</template>
        </el-table-column>
        <el-table-column align="center" label="临时停课" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.stopTimes || '--' }}</template>
        </el-table-column>
        <el-table-column align="center" label="代课次数" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.dkTimes|| '--'}}</template>
        </el-table-column>
        <el-table-column align="center" label="被代课次数" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.bkdTimes|| '--'}}</template>
        </el-table-column>
        <el-table-column align="center" label="调课次数" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.tkTimes|| '--'}}</template>
        </el-table-column>
        <el-table-column align="center" label="课时总数" show-overflow-tooltip>
          <template slot-scope="scope">{{Math.round((parseFloat(scope.row.scheduleTimes-scope.row.stopTimes) * 1000)) / 1000 }}</template>
        </el-table-column>
      </el-table>
      </div>
    </div>
  </div>
</template>
<script>
import mixin from "@/mixins/windowResize";
import baseMixin from '@/mixins/baseMixin';
import moment from "moment";
import {getSchoolTimeAllList} from "@/api/memorabilia";
import {getClassScheduleTeacherStaticListWeek} from "@/api/classScheduleCard";
import {querySchoolAllCourse} from '@/api/common/common';
export default {
  data() {
    return {
      daterange: [new Date(), new Date()],
      Courselist:[],
      currId:0,
      schoolYearList: [],
      schoolTimeId: "",
      startDate: "",
      endDate: "",
      datalist: [],
      name:"",
      mydatalist:[], 
      mystartDate:'',
      myendDate:"",
       pickerOptions: {  
        disabledDate: (time) => {
          if (this.daterange!== '') {
            const minTime =( new Date(this.mystartDate)).getTime()-3600 * 1000 * 24 ;
            const maxTime = ( new Date(this.myendDate)).getTime() ;
            return time.getTime() < minTime || time.getTime() > maxTime
          }
        }
        },     
    };
  },
  created() {
      querySchoolAllCourse()
                    .then(res => res.data)
                    .then(data => {
                        this.Courselist = data.data;
                    })
    // this.daterange[0] = new Date(moment().set("date", 1).valueOf());
    this.getSchoolTimeAllListFunc();
  },
  mixins: [mixin,baseMixin],
  methods: {  
      schoolTimeIdfun(){
         this.schoolYearList.forEach((item) => {
            if (this.schoolTimeId == item.id) {
               this.daterange=[new Date(item.startDate), new Date(item.endDate)]
               this.mystartDate=item.startDate;
               this.myendDate=item.endDate;
                if (item.isCurrent == 1) {
                  this.daterange=[new Date(item.startDate), new Date()]
                  this.mystartDate=item.startDate;
                  this.myendDate= this.$moment(this.daterange[1]).format("YYYY-MM-DD");
                }
              this.getClassScheduleTeacherStaticListWeek();
            }
          });
      },
       //前端搜索
    handleInputChange(){
        if(this.name){
               let list=[];
                for(let i=0;i<this.datalist.length;i++){
                    if(this.datalist[i].teacherName.indexOf(this.name) !== -1){
                    list.push(this.datalist[i])
                    };
                };
                this.mydatalist=list;
        }else{
             this.mydatalist=this.datalist;
        }
    

    },  
    getClassScheduleTeacherStaticListWeek() {
      this.startDate = this.$moment(this.daterange[0]).format("YYYY-MM-DD"); //时间
      this.endDate = this.$moment(this.daterange[1]).format("YYYY-MM-DD"); //时间
      getClassScheduleTeacherStaticListWeek({
        endDate: this.endDate,
        startDate: this.startDate,
        schoolTimeId: this.schoolTimeId,
        currId:this.currId
      })
        .then((res) => res.data)
        .then((data) => {
          if (data.code === 200 && data.data) {
            this.datalist = data.data;
            this.handleInputChange()
          }
        })
        .catch(() => {});
    },
    getSchoolTimeAllListFunc() {
      //学期列表
      getSchoolTimeAllList()
        .then((res) => res.data)
        .then((data) => {
          this.schoolYearList = data.data;
          this.schoolYearList.forEach((item) => {
            if (item.isCurrent == 1) {
              this.schoolTimeId = item.id;
               this.daterange=[new Date(item.startDate), new Date()]
               this.mystartDate=item.startDate;
               this.myendDate= this.$moment(this.daterange[1]).format("YYYY-MM-DD");
              this.getClassScheduleTeacherStaticListWeek();
            }
          });
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.el-range-editor--medium.el-input__inner {
  margin: 0;
}
.scrollBar {
  overflow-x: hidden;
  overflow-y: auto;
  &::-webkit-scrollbar-track-piece {
    background: #d3dce6;
  }
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: #99a9bf;
    border-radius: 20px;
  }
}
.clearfix:after {
  content: "";
  height: 0;
  display: block;
  clear: both;
  visibility: hidden;
}

ul,
li {
  list-style: none;
}
.memorabiliaList {
  padding:12px;
  box-sizing: border-box;
  .header {
    padding-bottom: 10px;
    margin-bottom: 0;
        overflow: hidden;
  }
 
}
.main-wrap {
  padding-top: 0;
}
.item-wrap {
  width: 100%;
  padding-right: 6px;
  height: auto;
  padding-top: 20px;
  box-sizing: border-box;
  .item {
    width: 90%;
    height: auto;
    min-width: 810px;
    min-height: 160px;
    padding: 10px 20px;
    box-sizing: border-box;
    margin: 10px auto;
    border: 1px solid #ccc;
    word-break: break-all;
    border-radius: 4px;
    -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
    padding-bottom: 40px;
    padding-top: 40px;
    position: relative;
    .content {
      line-height: 24px;
      width: 100%;
      text-indent: 2em;
    }
  }
  .happenTimeStr {
    position: absolute;
    top: 10px;
    left: 50px;
    font-size: 16px;
  }
  .control-btn {
    position: absolute;
    right: 20px;
    top: 10px;
    max-width: 200px;
  }
  .control-btn a {
    text-align: right;
    display: inline-block;
    vertical-align: middle;
    margin-left: 10px;
    color: #337ab7;
  }
  .control-btn i.fa-edit {
    font-size: 20px;
    margin-top: 4px;
  }
  .control-btn i.fa-fw {
    font-size: 19px;
    margin-top: 3px;
  }
  .bottom-text {
    position: absolute;
    bottom: 10px;
    right: 20px;
    color: #337ab7;
    text-decoration: none;
  }
  .tag-box {
    position: absolute;
    top: 6px;
    left: 3px;
    width: 30px;
    height: 30px;
    background: url(https://cdnfile-10043692.file.myqcloud.com/admin/images/chronicle_of_events/me_edit_btn.png)
      no-repeat;
    background-size: 100% 100%;
    overflow: hidden;
    z-index: -1;
  }
  .tag-edit {
    background: url(https://cdnfile-10043692.file.myqcloud.com/admin/images/chronicle_of_events/me_edit_btn.png)
      no-repeat;
    background-size: 100% 100%;
  }
  .tag-select {
    background: url(https://cdnfile-10043692.file.myqcloud.com/admin/images/chronicle_of_events/me_select_btn.png)
      no-repeat;
    background-size: 100% 100%;
  }
  .tag-important {
    background: url(https://cdnfile-10043692.file.myqcloud.com/admin/images/chronicle_of_events/me_import_btn.png)
      no-repeat;
    background-size: 100% 100%;
  }
  .uploadFiles {
    width: 100%;
    height: auto;

    position: relative;
    padding-top: 10px;
    box-sizing: border-box;
  }
}
.time-select {
  width: 220px !important;
}
.select-width {
  width: 195px !important;
}
</style>
