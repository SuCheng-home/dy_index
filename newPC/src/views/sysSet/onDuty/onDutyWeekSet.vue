<template>
  <div class="duty_week_box">
    <div class="header">
      <el-button size="medium" @click="goBack">返回</el-button>
    </div>
    <div class="week_list_box"  :style="{'height':nobottommaxH+'px'}" style="overflow: auto">
      <div class="week_list clearfix">
        <div class="week_item" :class="{'no_check_item': item.watchTeacherStatus !== 1, 'now_week_item': item.nowWeek === 1}" :key="index" v-for="(item, index) in weekList" @click="toWeekdaySet(item.week)">
          <div class="bottom_msg_week">第{{item.week}}周</div>
          <div class="bottom_msg_date">{{item.startDate}}&nbsp;到&nbsp;{{item.endDate}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {getCampusManWeekList} from '@/api/systemSet/onDuty';
  import mixin from '@/mixins/windowResize';
  export default {
    name: "onDutyWeekSet",
    data() {
      return {
        weekList: []
      }
    },
    created() {
      this.getCampusManWeekList();
    },
    mixins:[mixin],
    methods: {
      goBack() {
        this.$router.back();
      },
      // 周次
      getCampusManWeekList() {
        getCampusManWeekList().then(res => {
          if (res.data.code === 200) {
            this.weekList = res.data.data;
          }
        }).catch()
      },
      toWeekdaySet(week) {
        this.$router.push({path: 'weekdaySet', query: {week: week}});
      },
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../../styles/style";
  .duty_week_box {
    padding:12px;
    .header {
      padding-bottom: 10px;
      border-bottom: 1px solid #eee;
    }

    .week_list_box{
      padding: 20px;
      .week_list{
        .week_item{
          float: left;
          width: 240px;
          height: 120px;
          margin-top: 15px;
          margin-left: 30px;
          text-align: center;
          color: #409EFF;
          background: #ECF5FF;
          border: 1px solid #B7DAFF;
          cursor: pointer;
          border-radius: 5px;
          overflow: hidden;
          .bottom_msg_week{
            height: 60px;
            line-height: 60px;
            margin-top: 10px;
            font-size: 22px;
            font-weight: 700;
          }
          .bottom_msg_date{
            height: 40px;
            line-height: 40px;
          }
        }

        .no_check_item{
          color: #E6A440;
          background: #FDF6EC;
          border: 1px solid #F5DCB5;
        }
        .now_week_item{
          color: #fff;
          background: #409eff;
          border: 1px solid #B7DAFF;
        }
      }
    }
  }
</style>
