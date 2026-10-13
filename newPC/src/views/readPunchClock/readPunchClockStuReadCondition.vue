<template>
  <div class="readPunchClockStuReadCondition">
    <div class="top">
      <el-row style="padding-bottom: 10px">
        <el-col :span="20">
          <el-button @click="goBack" size="medium">返回</el-button>
        </el-col>
      </el-row>
    </div>
    <div>
      <div class="table_title">{{studentName}}阅读计划完成情况</div>
      <div class="table_title">{{className}}</div>
      <div>
        <el-table stripe :data="tableList" border :height="maxH-40">
          <el-table-column prop="weekIndex" label="日期"></el-table-column>
          <el-table-column label="阅读计划">
            <template slot-scope="scope">
              <span v-if="scope.row.id">
                {{scope.row.bookName}}&nbsp;{{scope.row.startPageNo}}页到{{scope.row.endPageNo}}页
              </span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column label="打卡详情">
            <template slot-scope="scope">
              <span v-if="scope.row.readStuClock.id">
                <span :key="cellIndex" v-for="(cellItem, cellIndex) in scope.row.readStuClock.relativeList">
                  {{cellItem.bookName}}&nbsp;{{cellItem.startPageNo}}页到{{cellItem.endPageNo}}页
                  <span v-if="cellIndex < scope.row.readStuClock.relativeList.length - 1">,</span>
                </span>
              </span>
              <span v-else>-</span>
            </template>
          </el-table-column>

          <el-table-column label="阅读执行情况">
            <template slot-scope="scope">
              <span v-if="scope.row.readStuClock && scope.row.readStuClock.finished === 1">已完成</span>
              <span v-else>未完成</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
  import mixin from '@/mixins/windowResize';
  import { getStuWeekPlanInfo } from '@/api/readPunchClock';

  export default {
    name: 'readPunchClockStuReadCondition',
    data() {
      return {
        weekDayNames: ['一', '二', '三', '四', '五', '六', '日'],
        weekPlanInfo: {},
        tableList: [],
        studentName: '',
        className: ''
      }
    },
    mixins: [mixin],
    created() {
      this.studentName = this.$route.query.stuName;
      this.className = this.$route.query.className;
      this.getStuWeekPlanInfo();
    },
    methods: {
      goBack() {
        this.$router.back();
      },
      getStuWeekPlanInfo() {
        let query = {
          stuId: parseInt(this.$route.query.stuId),
          schoolTimeId: parseInt(this.$route.query.teamId),
          week: parseInt(this.$route.query.week),
        };
        getStuWeekPlanInfo(query).then((res) => {
          const data= res.data.data;
          if (res.data.code === 200) {
            this.weekPlanInfo = data;
            data.dayPlanList.forEach((item, index) => {
              let newItem = Object.assign({}, item, {
                weekIndex: '周' + this.weekDayNames[index]
              });
              this.tableList.push(newItem);
            });
          }
        }).catch(() => {});
      },
    }
  }
</script>

<style lang="scss" scoped>
  .table_title{
    text-align: center;
    font-size: 20px;
    font-weight: 700;
    line-height: 40px;
  }
  .top{
    border-bottom: 1px solid #e7eaec;
  }
  .readPunchClockStuReadCondition{
    padding:12px;
  }
</style>
