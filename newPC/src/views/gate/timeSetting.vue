<template>
    <div class="timeSetting">
        <back-tool>
            <el-button type="primary" @click="preservation()" size="medium">保存</el-button>
            <span class="namered" v-if="ishide">（暂未设置请保存设置）</span>
        </back-tool>
        <div class="form-container" :style="{'height':nobottommaxH+'px'}">
            <div class="timeSetting-box">
                <div class="top">进校时间设置<el-checkbox v-model="checkedone">提醒家长</el-checkbox></div>
                <div class="ul">
                    <div class="li" v-for="(item,index) in modelList" :key="index"><span class="name"><span class="red">*</span>{{item.levelName}}</span>
                        <el-time-select placeholder="起始时间" @change="mytimefun(index)"  size="small" :clearable="false" :editable="false" v-model="item.inStartTime" :picker-options="{start: '05:00', step: '00:05', end: '23:00',maxTime:item.inEndTime }"></el-time-select>
                        &nbsp;&nbsp;至&nbsp;&nbsp;
                        <el-time-select size="small" placeholder="结束时间" @change="mytimefun(index)" :clearable="false" :editable="false" v-model="item.inEndTime" :picker-options="{  start: '05:00', step: '00:05', end: '23:00',minTime: item.inStartTime }"></el-time-select>
                       <el-checkbox v-model="item.allowLate">允许迟到</el-checkbox>&nbsp;&nbsp;
                       <el-time-select size="small"  v-if="item.allowLate" placeholder="迟到时间" :clearable="false" :editable="false" v-model="item.lateTime" :picker-options="{  start: '05:00', step: '00:05', end: '23:00',minTime: item.inStartTime,maxTime:item.mytime }"></el-time-select>
                        <span v-if="item.allowLate">&nbsp;&nbsp;后为迟到</span>
                    </div>
                </div>
            </div>
            <div class="timeSetting-box">
                <div class="top">出校时间设置
                    <el-checkbox v-model="checkedtwo">提醒家长</el-checkbox>
                </div>
                <div class="ul">
                    <div class="li" v-for="(item,index) in modelList" :key="index"><span class="name"><span
                        class="red">*</span>{{item.levelName}}</span>
                        <el-time-select size="small" placeholder="起始时间"  @change="mytimefun(index)"  :clearable="false" :editable="false"
                                        v-model="item.outStartTime"
                                        :picker-options="{ start: '05:00', step: '00:05', end: '23:00',maxTime:item.outEndTime }"></el-time-select>
                        &nbsp;&nbsp;至&nbsp;&nbsp;
                        <el-time-select size="small" placeholder="结束时间"  @change="mytimefun(index)"  :clearable="false" :editable="false"
                                        v-model="item.outEndTime"
                                        :picker-options="{start: '05:00', step: '00:05', end: '23:00',minTime: item.outStartTime }"></el-time-select>
                       <el-checkbox v-model="item.allowLeaveEarly">允许早退</el-checkbox>&nbsp;&nbsp;
                       <el-time-select size="small" v-if="item.allowLeaveEarly" placeholder="早退时间" :clearable="false" :editable="false" v-model="item.leaveEarlyTime" :picker-options="{  start: '05:00', step: '00:05', end: '23:00',minTime: item.outStartTime,maxTime:item.outEndTime }"></el-time-select>
                        <span v-if="item.allowLeaveEarly">&nbsp;&nbsp;前为早退</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import BackTool from "@/components/BackTool";
import mixin from "@/mixins/windowResize";
import {
  querySchoolGrade,
  findStuTransferTimeList,
  addStuTransferTime,
  insertOrUpdateStuTransferRemindSet,
  getStuTransferRemindSetBySchoolId
} from "@/api/gate";

export default {
  data: function() {
    return {
      modelList: [],
      checkedone: false,
      checkedtwo: false,
      ishide: false
    };
  },
  created() {
    findStuTransferTimeList().then(res => {
      let data = res.data.data;
      if (data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          let list = data[i].inEndTime.split(":");
          let num =
            list[1] - 0 + 5 > 10 ? list[1] - 0 + 5 : "0" + (list[1] - 0 + 5);
          let time =
            num == 60 ? list[0] - 0 + 1 + ":" + "00" : list[0] + ":" + num;
          this.modelList.push({
            inEndTime: data[i].inEndTime,
            inStartTime: data[i].inStartTime,
            outEndTime: data[i].outEndTime,
            outStartTime: data[i].outStartTime,
            level: data[i].level,
            levelName: data[i].levelName,
            allowLate: data[i].allowLate == 1,
            lateTime: data[i].lateTime?data[i].lateTime:'',
            allowLeaveEarly: data[i].allowLeaveEarly == 1,
            leaveEarlyTime: data[i].leaveEarlyTime?data[i].leaveEarlyTime:'',
            mytime: time
          });
        }
      } else {
        this.querySchoolGrades();
        this.ishide = true;
      }
    });
    getStuTransferRemindSetBySchoolId().then(res => {
      let data = res.data.data;
      if (data) {
        if (data.remindIn == 1) {
          this.checkedone = true;
        }
        if (data.remindOut == 1) {
          this.checkedtwo = true;
        }
      }
    });
  },
  mixins: [mixin],
  components: {
    BackTool
  },
  methods: {
    //保存
    preservation() {
      for (let i = 0; i < this.modelList.length; i++) {
        if (this.modelList[i].inStartTime == "") {
          this.$message({
            type: "warning",
            message: "请选择" + this.modelList[i].levelName + "进校开始时间！"
          });
          return;
        }
        if (this.modelList[i].inEndTime == "") {
          this.$message({
            type: "warning",
            message: "请选择" + this.modelList[i].levelName + "进校结束时间！"
          });
          return;
        }
        if (this.modelList[i].inStartTime == "") {
          this.$message({
            type: "warning",
            message: "请选择" + this.modelList[i].levelName + "进校开始时间！"
          });
          return;
        }
        if (this.modelList[i].allowLate&&this.modelList[i].lateTime=='') {
          this.$message({
            type: "warning",
            message: "请选择" + this.modelList[i].levelName + "允许迟到时间！"
          });
          return;
        }
        if (this.modelList[i].outEndTime == "") {
          this.$message({
            type: "warning",
            message: "请选择" + this.modelList[i].levelName + "出校结束时间！"
          });
          return;
        }
         if (this.modelList[i].allowLeaveEarly&&this.modelList[i].leaveEarlyTime=='') {
          this.$message({
            type: "warning",
            message: "请选择" + this.modelList[i].levelName + "允许早退时间！"
          });
          return;
        }
      }
      let remindIn = 2;
      let remindOut = 2;
      if (this.checkedone) {
        remindIn = 1;
      }
      if (this.checkedtwo) {
        remindOut = 1;
      }
      this.ishide = false;
      let mymodelList=[];
      for(let i=0;i<this.modelList.length;i++){
          mymodelList.push({
            allowLate:this.modelList[i].allowLate?1:2,//	允许迟到 1:允许 2:不允许	number	
            allowLeaveEarly:this.modelList[i].allowLeaveEarly?1:2,//	允许早退 1:允许 2:不允许	number	
            inEndTime:this.modelList[i].inEndTime,//	进校结束时间	string	
            inStartTime:this.modelList[i].inStartTime,//	进校开始时间	string	
            lateTime:this.modelList[i].allowLate?this.modelList[i].lateTime:'',//	迟到时间	string	
            leaveEarlyTime:this.modelList[i].allowLeaveEarly?this.modelList[i].leaveEarlyTime:'',//	早退时间	string	
            level:this.modelList[i].level,//	年级level	number	
            levelName:this.modelList[i].levelName,//	年级名称	string	
            outEndTime:this.modelList[i].outEndTime,//	出校结束时间	number	
            outStartTime:this.modelList[i].outStartTime,//	出校开始时间	string	
          })
      }
      Promise.all([
        insertOrUpdateStuTransferRemindSet({
          remindIn: remindIn,
          remindOut: remindOut
        }).then(res => res.data),
        addStuTransferTime(mymodelList).then(res => res.data)
      ]).then(([data1, data2]) => {
        if (data1.result && data2.result) {
          this.$message({
            type: "success",
            message: "设置成功！"
          });
          this.$router.back();
        } else {
          this.$message({
            type: "error",
            message: data1.msg || data2.msg
          });
        }
      });
    },
    //获取年级
    querySchoolGrades() {
      querySchoolGrade(true).then(res => {
        let data = res.data.data;
        for (let i = 0; i < data.length; i++) {
          this.modelList.push({
            inEndTime: "09:30",
            inStartTime: "07:30",
            outEndTime: "16:30",
            outStartTime: "15:30",
            level: data[i].level,
            levelName: data[i].name,
            allowLate: false,
            lateTime: "",
            allowLeaveEarly: false,
            leaveEarlyTime: "",
            mytime: "09:35",

          });
        }
      });
    },
    //比较两个时间的大小
    comparedate(date1, date2) {
      let oDate1 = new Date("2020-11-11 " + date1);
      let oDate2 = new Date("2020-11-11 " + date2);
      if (oDate1.getTime() == oDate2.getTime()) {
        return false;
      } else if (oDate1.getTime() > oDate2.getTime()) {
        return true;
      } else {
        return false;
      }
    },
     comparedatetwo(date1, date2) {
      let oDate1 = new Date("2020-11-11 " + date1);
      let oDate2 = new Date("2020-11-11 " + date2);
      if (oDate1.getTime() > oDate2.getTime()||oDate1.getTime() == oDate2.getTime()) {
        return true;
      } else {
        return false;
      }
    },
    mytimefun(index) {
      let list = this.modelList[index].inEndTime.split(":");
      let num =list[1] - 0 + 5 > 10 ? list[1] - 0 + 5 : "0" + (list[1] - 0 + 5);
      let time = num == 60 ? list[0] - 0 + 1 + ":" + "00" : list[0] + ":" + num;
      this.modelList[index].mytime = time; //时间
      if (this.modelList[index].lateTime) {
        let is =
          this.comparedate(
            this.modelList[index].lateTime,
            this.modelList[index].inEndTime
          ) ||
          !this.comparedate(
            this.modelList[index].lateTime,
            this.modelList[index].inStartTime
          );
        if (is) {
          this.modelList[index].lateTime = "";
        }
      }
      if (this.modelList[index].leaveEarlyTime) {
        let is =
          this.comparedatetwo(this.modelList[index].leaveEarlyTime,this.modelList[index].outEndTime) ||
          this.comparedatetwo(this.modelList[index].outStartTime,this.modelList[index].leaveEarlyTime);
        if (is) {
          this.modelList[index].leaveEarlyTime = "";
        }
      }
    }
  }
};
</script>
<style lang="scss">
.timeSetting {
  padding:12px;

  .el-checkbox {
    margin-left: 20px;
  }
  .el-date-editor.el-input {
    width: 120px;
  }

  .timeSetting-box {
    width: 810px;
    margin: 0 auto;
  }

  .namered {
    color: red;
    margin-left: 15px;
    font-size: 16px;
    line-height: 26px;
  }

  .form-container {
    overflow: auto;

    .top {
      line-height: 30px;
      font-size: 20px;
      color: #666;
      font-weight: 600;
      margin: 25px 10px;
      padding-left: 10px;
      border-left: 8px solid #409eff;
    }

    .li {
      padding: 10px;
      font-size: 14px;
      color: #606266;
      .name {
        display: inline-block;
        width: 100px;
        text-align: right;
        padding-right: 10px;
        font-size: 15px;
        color: #666;
        font-weight: 600;

        .red {
          color: red;
          margin-right: 5px;
        }
      }
    }
  }
}
</style>
