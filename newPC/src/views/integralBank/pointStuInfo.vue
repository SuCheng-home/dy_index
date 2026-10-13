<template>
  <div class="goods_manage_wrap">
    <div class="header">
      <el-button size="medium" @click="goBack">返回</el-button>
      <el-date-picker v-model.trim="pointDate" type="daterange" class="mywidthdaterange" :clearable="false" size="medium" placeholder="请选择日期" @change="changePointDate"></el-date-picker>
      <a :href="downLoadUrl" v-if="dataList && dataList.length" target="_blank" download="examName">
        <el-button type="primary" size="medium">导出</el-button>
      </a>
    </div>
    <div  :style="`height: ${boxH - 201}px;`">
      <div class="chart_box">
        <div class="point_chart_title">{{dateStr}}获得积分雷达图</div>
        <div class="point_chart_title point_chart_desc">总积分：{{stuGainPoint}}</div>
        <div id="pointRadarChart" style="height: 240px;margin: 10px auto;"></div>
      </div>
      <el-table stripe :data="dataList" height="500px" border style="width: 100%">
        <el-table-column align="center" label="积分卡" prop="cardName" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" label="时间" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.useTime | timeFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="获得积分" prop="point" show-overflow-tooltip></el-table-column>
      </el-table>

      <el-pagination class="pagination-container" @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page.sync="listQuery.pageNo" :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.pageSize"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import echarts from 'echarts';
  import DefaultPage from '@/components/DefaultPage';
  import windowResize from "@/mixins/windowResize";
  import {getStuGainCardPointPageList, getStuGainIntegralCardPointData2} from '@/api/integralBank';

  export default {
    name: "pointStuInfo",
    components: {DefaultPage},
    data() {
      return {
        stuId: this.$route.query.stuId,
        classId: this.$route.query.classId,
        downLoadUrl: '',
        dateStr: '',
        pointDate: [],
        gainCardPointList: [],
        stuGainPoint: 0,
        dataList: [],
        listQuery: {
          pageNo: 1,
          pageSize: 20
        },
        total: null,
        pointRadarChart: null
      }
    },
    filters: {
      timeFormat(time) {
        return time ? time.substring(0, 19) : "--";
      }
    },
    mixins: [windowResize],
    created() {
      this.pointDate = [this.getMonthOne(), new Date()];
      // this.pointDate = [new Date('2021-08-01'), new Date()];
      this.getStuGainCardPointPageList();
    },
    methods: {
      goBack() {
        this.$router.back();
      },
      getMonthOne() {
        const date = new Date();
        date.setDate(1);
        return date;
      },
      changePointDate() {
        this.getStuGainCardPointPageList();
      },
      getStuGainCardPointPageList() {
        this.getStuGainIntegralCardPointData2();
        const query = {
          pageNo: this.listQuery.pageNo,
          pageSize: this.listQuery.pageSize,
          stuId: this.stuId,
          startDate: this.$moment(this.pointDate[0]).format('YYYY-MM-DD'),
          endDate: this.$moment(this.pointDate[1]).format('YYYY-MM-DD')
        };
        this.dateStr = query.startDate + '至' + query.endDate;
        this.downLoadUrl = global.BasePath + "structure/integralBank/exportStuGainCardRecordDatas?stuId=" + query.stuId + "&startDate=" + query.startDate + "&endDate=" + query.endDate + "&token=" + this.$store.getters.token;
        getStuGainCardPointPageList(query).then(res => res.data).then(data => {
          if (data.code === 200 && data.result) {
            this.dataList = data.data.dataList;
            this.total = data.data.pagination.total;
          }
        });
      },
      getStuGainIntegralCardPointData2() {
        getStuGainIntegralCardPointData2({
          classId: this.classId,
          stuId: this.stuId,
          startDate: this.$moment(this.pointDate[0]).format('YYYY-MM-DD'),
          endDate: this.$moment(this.pointDate[1]).format('YYYY-MM-DD')
        }).then(res => res.data).then(data => {
          if (data.code === 200 && data.result) {
            this.gainCardPointList = data.data.gainCardPointList;
            this.stuGainPoint = data.data.stuGainPoint;
            const gainCardPointList = data.data.gainCardPointList;
            const pointList = gainCardPointList.length && gainCardPointList.map(item => item.stuPoint);
            const maxCount = pointList.length ? Math.max(...pointList) : 0;
            const nameList = gainCardPointList.length && gainCardPointList.map(item => {
              return {name: item.groupName, max: maxCount}
            });

            const chartDom = document.getElementById('pointRadarChart');
            this.pointRadarChart = echarts.init(chartDom);
            maxCount && gainCardPointList.length && this.drawPointRadarChart(nameList, pointList);
          }
        });
      },
      drawPointRadarChart(indicator, pointList) {
        const option = {
          radar: {
            indicator: indicator
          },
          series: [
            {
              type: 'radar',
              data: [
                {
                  value: pointList
                }
              ]
            }
          ]
        };
        this.pointRadarChart.setOption(option);
      },
      //切换码数
      handleSizeChange(val) {
        this.listQuery.pageNo = 1;
        this.listQuery.pageSize = val;
        this.getStuGainCardPointPageList();
      },
      //切换页数
      handleCurrentChange(val) {
        this.listQuery.pageNo = val;
        this.getStuGainCardPointPageList();
      },
    }
  }
</script>

<style lang="scss" scoped>
  .goods_manage_wrap{
    padding: 12px;

    .header {
      padding-bottom: 10px;
      overflow: hidden;
    }
    .chart_box{
      .point_chart_title{
        line-height: 30px;
        font-size: 17px;
        color: #333;
        text-align: center;
      }
      .point_chart_desc{
        font-size: 15px;
        color: #666;
      }
    }
  }
</style>
