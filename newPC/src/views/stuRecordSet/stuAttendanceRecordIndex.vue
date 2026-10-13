<template>
  <div class="stu_attendance_record_index app-container">
    <div class="header"> 
      <div class="top_middle_title">今日出勤</div>
      <!-- <el-row>
        <el-col :span="5">
          <el-button type="primary"  size="medium" @click="toAttendanceDetail" style="margin-right: 5px;color:#fff">考勤明细</el-button>
          <el-button type="primary" size="medium" @click="toAttendanceSum"  style="color:#fff">统计汇总</el-button>
        </el-col>
        <el-col :span="15">
          <div class="top_middle_title">今日考勤</div>
        </el-col>
      </el-row> -->
    </div>
    <div class="record_sum_box">
      <div class="record_sum_item"><div class="sum_num">{{dataMsg.stuTotalCount}}</div><div class="sum_text">全校总人数</div></div>
      <!-- <div class="record_sum_item"><div class="sum_num">{{dataMsg.inShoolCount}}</div><div class="sum_text">入校人数</div></div> -->
      <div class="record_sum_item" @click="stuAttendanceRecordDetail(1)" style="cursor:pointer"><div class="sum_num">{{dataMsg.normalCount}}</div><div class="sum_text">入校正常人数</div></div>
      <div class="record_sum_item"  @click="stuAttendanceRecordDetail(3)"  style="cursor:pointer"><div class="sum_num">{{dataMsg.lateCount}}</div><div class="sum_text">入校迟到人数</div></div>
      <div class="record_sum_item"><div class="sum_num">{{dataMsg.notInShoolCount}}</div><div class="sum_text">未入校人数</div></div>
      <div class="record_sum_item"><div class="sum_num" style="cursor:pointer" @click="studentLeaveIndex()">{{dataMsg.sickCount}}</div><div class="sum_text">病假人数</div></div>
      <div class="record_sum_item"><div class="sum_num" style="cursor:pointer" @click="studentLeaveIndex()">{{dataMsg.notSickCount}}</div><div class="sum_text">非病假人数</div></div>
      <div class="record_sum_item"><div class="sum_num">{{dataMsg.outShoolCount}}</div><div class="sum_text">离校人数</div></div>
      <div class="record_sum_item"><div class="sum_num">{{dataMsg.curInSchoolCount}}</div><div class="sum_text">当前在校人数</div></div>
    </div>
    <div class="record_list_box">
      <el-table ref="multipleTable" :data="dataList" border stripe :height="maxH - 80" style="width: 100%">
        <el-table-column label="班级" align="center" prop="className"></el-table-column>
        <el-table-column label="总人数" align="center" prop="stuTotalCount"></el-table-column>
        <el-table-column label="入校人数" align="center" prop="inShoolCount"></el-table-column>
        <el-table-column label="迟到" align="center" prop="lateCount"></el-table-column>
        <el-table-column label="未入校人数" align="center" prop="notInShoolCount"></el-table-column>
        <el-table-column label="病假人数" align="center" prop="sickCount"></el-table-column>
        <el-table-column label="非病假人数" align="center" prop="notSickCount"></el-table-column>
        <el-table-column label="离校人数" align="center" prop="outShoolCount"></el-table-column>
        <el-table-column label="当前在校人数" align="center" prop="curInSchoolCount"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import mixins from '@/mixins/windowResize';
  import baseMixin from '@/mixins/baseMixin';
  import {statisticByClassId} from "@/api/schoolManage/stuAttendanceRecord";

  export default {
    name: "stuAttendanceRecordIndex",
    data() {
      return {
        dataMsg: {},
        dataList: []
      }
    },
    mixins: [mixins, baseMixin],
    created() {
      this.statisticByClassId();
    },
    methods: {
      stuAttendanceRecordDetail(stateAttendance) {
        this.$router.push({path: 'detail',query:{stateAttendance:stateAttendance}});
      },
      studentLeaveIndex() {
        this.$router.push({path: 'newindex'});
      },
      statisticByClassId() {
        statisticByClassId().then(res => {
          const data = res.data;
          if (res.data.code === 200) {
            this.dataMsg = data.data.data;
            this.dataList = data.data.dataList;
          }
        }).catch(() => {
        });
      }
    }
  }
</script>

<style lang="scss" scoped>
.el-button{
    outline:none;
}
  .stu_attendance_record_index {
    .header {
      padding-bottom: 10px;
      border-bottom: 1px solid #eee;
      margin-bottom: 10px;

      .top_middle_title {
        text-align: center;
        font-weight: 700;
        height: 36px;
        line-height: 36px;
      }
    }

    .record_sum_box {
      display: flex;
      .record_sum_item{
        flex: 1;
        text-align: center;
        margin: 0 5px 10px;
        padding: 10px 0;
        color: #fff;
        background: #409EFF;
        border-radius: 5px;
        .sum_num{
          height: 40px;
          line-height: 40px;
          font-size: 36px;
          font-weight: 700;
        }
        .sum_text{
          height: 24px;
          line-height: 24px;
          font-size: 18px;
          overflow: hidden;
        }
        &:nth-child(1) {
                     background: #2376DE;
                }
                 &:nth-child(2) {
                     background: #1BB27F;
                }
                  &:nth-child(6) {
                     background: #FFC875;
                } 
                &:nth-child(3) {
                    background: #DA3752;
                }
                 &:nth-child(4) {
                     background: #54B4C4;
                }
                &:nth-child(5) {
                    background: #BFA12F;
                }
               
                  &:nth-child(7) {
                     background: #6F3CD5;
                } 
                  &:nth-child(8) {
                     background: #FD881F;
                } 
                  &:nth-child(9) {
                     background: #FC6C6B;
                } 
      }
      
    }
  }
</style>
