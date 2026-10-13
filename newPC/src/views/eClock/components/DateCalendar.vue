<template>
  <div class="check_calendar_box">
    <el-calendar>
      <!-- 这里使用的是 2.5 slot 语法，对于新项目请使用 2.6 slot 语法-->
      <template slot="dateCell" slot-scope="{date, data}">
        <div :class="`date_new_box ${filterCheck(data.day) ? 'check_date' : ''} ${isBeforeDate(data.day) ? 'disabled_date' : ''}`" @click="changeCheck(data.day)">
          <div class="date_name">{{ data.day.split('-').slice(1).join('-') }}</div>
          <div v-if="filterCheck(data.day)">
            <el-button type="primary" size="small" icon="el-icon-check" circle></el-button>
          </div>
        </div>
      </template>
    </el-calendar>
  </div>
</template>

<script>
  export default {
    name: "date-calendar",
    props: {
      checkDate: {
        type: Array,
        default: []
      }
    },
    data() {
      return {}
    },
    methods: {
      filterCheck(date) {
        return this.checkDate.indexOf(date) > -1;
      },
      changeCheck(date) {
        let dateIndex = this.checkDate.indexOf(date);
        if (dateIndex > -1) {
          this.checkDate.splice(dateIndex, 1);
        } else if (!this.isBeforeDate(date)) {
          this.checkDate.push(date);
        }
      },
      isBeforeDate(date) {
        return new Date(date).getTime() < new Date().getTime() - 8.64e7;
      }
    }
  }
</script>

<style lang="scss" scoped>
  .check_calendar_box{
    width: 95%;
    margin: 10px auto;
    border: 1px solid #f8f8f8;
    .date_new_box{
      width: 100%;
      height: 100%;
      text-align: center;
      .date_name{
        height: 36px;
        line-height: 36px;
      }
    }
    .check_date {
      color: #1989FA;
    }
    .disabled_date {
      color: #C0C4CC;
    }
  }
</style>
