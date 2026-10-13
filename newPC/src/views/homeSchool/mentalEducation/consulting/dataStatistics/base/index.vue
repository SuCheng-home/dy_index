<template>
  <div class="mental-education-consulting-dataStatistics-base">
    <el-row
      style="
        border-bottom: 1px solid #e7eaec;
        padding-bottom: 10px;
        margin-bottom: 10px;
      "
    >
      <el-col :span="24">
        <el-button
          @click="
            $router.replace({ path: '/main/homeSchool/mentalEducation/index' })
          "
          size="medium"
          >返回</el-button
        >
        <el-date-picker
          size="medium"
          type="daterange" class="mywidthdaterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          :clearable="false"
          v-model="form.daterange"
          @change="handleDateRange"
        ></el-date-picker>
        <el-button type="primary" size="medium" @click="print()"
          >打印</el-button
        >
      </el-col>
    </el-row>

    <div
      class="main-wrapper"
      :style="{ height: maxH - 30 + 'px' }"
      id="print-wrap"
      v-loading="printing"
    >
      <div class="detail-title">教师回复量统计表</div>
      <el-table
        border
        fit
        stripe
        highlight-current-row
        style="width: 100%"
        :height="275"
        :data="consultListTh"
      >
        <el-table-column align="center" label="教师姓名" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.userName || "--" }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="回复量" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.replyCount || "--" }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="综合评分" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.compeScore || "--" }}
          </template>
        </el-table-column>
      </el-table>

      <div class="detail-title">时段统计报表</div>
      <div class="no_list_msg" v-show="!consultQuantumListThShow">
        <img
          src="https://cdnfile-10043692.file.myqcloud.com/class_brand/gridClasscard/nodata/elastic-nodata2.png"
          alt
        />
        <div>暂无数据</div>
      </div>
      <div v-show="consultQuantumListThShow">
        <el-row class="chart-wrapper" type="flex" align="middle">
          <el-col :span="12" class="">
            <div class="chart" id="consultQuantumListTh" v-if="!imgShow"></div>
            <img
              id="consultQuantumListThImg"
              class="chart-img"
              v-if="imgShow"
            />
          </el-col>
          <el-col :span="12">
            <el-table
              border
              fit
              stripe
              highlight-current-row
              style="width: 100%"
              :data="consultQuantumListTh"
            >
              <el-table-column
                align="center"
                :label="item"
                show-overflow-tooltip
                :key="idx"
                v-for="(item, idx) in consultQuantumListTh[0].timerangeList"
              >
                <template slot-scope="scope">
                  {{ scope.row.countList[idx] || "0" }}
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </div>

      <div class="no_list_msg" v-show="!consultQuantumGroupListThShow">
        <img
          src="https://cdnfile-10043692.file.myqcloud.com/class_brand/gridClasscard/nodata/elastic-nodata2.png"
          alt
        />
        <div>暂无数据</div>
      </div>
      <div v-show="consultQuantumGroupListThShow">
        <div class="chart" id="consultQuantumGroupListTh" v-if="!imgShow"></div>
        <img
          id="consultQuantumGroupListThImg"
          class="chart-img"
          v-if="imgShow"
        />
      </div>

      <div class="detail-title">问题类别统计报表</div>
      <div class="no_list_msg" v-show="!consultGroupListThShow">
        <img
          src="https://cdnfile-10043692.file.myqcloud.com/class_brand/gridClasscard/nodata/elastic-nodata2.png"
          alt
        />
        <div>暂无数据</div>
      </div>
      <div v-show="consultGroupListThShow">
        <el-row class="chart-wrapper" type="flex" align="middle">
          <el-col :span="12">
            <div class="chart" id="consultGroupListTh" v-if="!imgShow"></div>
            <img id="consultGroupListThImg" class="chart-img" v-if="imgShow" />
          </el-col>
          <el-col :span="12">
            <el-table
              border
              fit
              stripe
              highlight-current-row
              style="width: 100%"
              :data="consultGroupListTh"
            >
              <el-table-column
                align="center"
                :label="item"
                show-overflow-tooltip
                :key="idx"
                v-for="(item, idx) in consultGroupListTh[0].groupNameList"
              >
                <template slot-scope="scope">
                  {{ scope.row.countList[idx] || "0" }}
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
/* utils & minx & vux */
import mixin from "@/mixins/windowResize";
import moment from "moment";
import { timeIgnoreSecond } from "@/filters";

/* components */
import echarts from "echarts";

/* api */
import {
  getStatisticalConsultListTh,
  getStatisticalConsultQuantumListTh,
  getStatisticalConsultQuantumGroupListTh,
  getStatisticalConsultGroupListTh,
} from "@/api/homeSchool/mentalEducation/consulting/dataStatistics/index";

/* eachart options */
let colorList = [
  "#63b2ee",
  "#76da91",
  "#f8cb7f",
  "#f89588",
  "#7cd6cf",
  "#cb9bff",
  "#7898e1",
  "#efa666",
  "#eddd86",
  "#9987ce",
];
let pieOption = ({ title, legend, series }) => ({
  title: Object.assign(
    {
      textStyle: {
        fontSize: 18,
        color: "#333",
        width: "100%",
      },
      x: "center",
    },
    title
  ),
  tooltip: {
    trigger: "item",
    formatter: "{b} : {d}%",
  },
  color: colorList,
  legend: Object.assign(
    {
      x: "center",
      top: "300",
    },
    legend
  ),
  series: [
    Object.assign(
      {
        type: "pie",
        radius: "55%",
        height: "300",
        center: ["50%", "150"],
      },
      series
    ),
  ],
});

let lineOption = ({ title, legend, xAxis, series }) => ({
  title: Object.assign(
    {
      x: "center",
    },
    title
  ),
  tooltip: {
    trigger: "axis",
  },
  grid: {
    height: "200",
  },
  xAxis: Object.assign(
    {
      show: true,
      position: "bottom",
      type: "category",
      axisTick: {
        alignWithLabel: true,
        show: true,
      },
      axisLine: {
        onZero: true,
        lineStyle: {
          color: "#a3a3a3",
        },
      },
    },
    xAxis
  ),
  yAxis: [
    {
      type: "value",
      axisLabel: {
        formatter: "{value}",
      },
      axisTick: {
        show: false,
      },
      axisLine: {
        show: false,
        lineStyle: {
          color: "#a3a3a3",
        },
      },
    },
  ],
  legend: Object.assign(
    {
      top: "300",
      left: "5%",
      textStyle: {
        color: "#a3a3a3",
      },
      itemWidth: 20,
      itemHeight: 10,
      orient: "horizontal",
    },
    legend
  ),
  series,
});

export default {
  name: "mentalEducationConsultingDataStatisticsBase",
  mixins: [mixin],
  components: {},
  filters: {},
  props: {
    heartEduInit: {
      type: Object,
      default() {
        return {
          startTime: "08:00:00",
          endTime: "17:00:00",
        };
      },
    },
  },
  computed: {},
  data() {
    return {
      printing: false,
      imgShow: false,
      // 请求表单
      form: {
        // 时间范围
        daterange: [
          this.$route.query.startDate || "",
          this.$route.query.endDate || "",
        ],
      },
      echart: {
        consultQuantumListTh: null,
        consultGroupListTh: null,
        consultQuantumGroupListTh: null,
      },
      // 教师回复量统计表
      consultListTh: [],
      // 时段统计报表
      consultQuantumListTh: [{}],
      consultGroupListTh: [{}],
      consultQuantumGroupListTh: [],
      // 是否有数据
      consultQuantumListThShow: true,
      consultGroupListThShow: true,
      consultQuantumGroupListThShow: true,
    };
  },
  created() {
    this.getStatisticalConsultListTh();
    this.getStatisticalConsultQuantumListTh();
    this.getStatisticalConsultQuantumGroupListTh();
    this.getStatisticalConsultGroupListTh();
  },
  methods: {
    getStatisticalConsultListTh() {
      getStatisticalConsultListTh({
        startDate: this.form.daterange[0] || "",
        endDate: this.form.daterange[1] || "",
      })
        .then((res) => {
          let _res = res.data;
          if (_res.code != 200) return Promise.reject(_res.msg);
          else return _res.data;
        })
        .then((data) => {
          this.consultListTh = [...data];
        });
    },

    getStatisticalConsultQuantumListTh() {
      getStatisticalConsultQuantumListTh({
        startDate: this.form.daterange[0] || "",
        endDate: this.form.daterange[1] || "",
      })
        .then((res) => {
          let _res = res.data;
          if (_res.code != 200) return Promise.reject(_res.msg);
          else return _res.data;
        })
        .then((data) => {
          if (Array.isArray(data) && data.length) {
            this.consultQuantumListThShow = true;
            this.drawConsultQuantumListTh([...data]);
            let temp = [{ timerangeList: [], countList: [] }];
            let sum = 0;
            data.forEach((item) => {
              temp[0].timerangeList.push(
                `${timeIgnoreSecond(item.startTime)} - ${timeIgnoreSecond(
                  item.endTime
                )}`
              );
              temp[0].countList.push(item.count);
              sum += item.count;
            });
            temp[0].timerangeList.push("总咨询量");
            temp[0].countList.push(sum);
            this.consultQuantumListTh = [...temp];
          } else this.consultQuantumListThShow = false;
        });
    },

    getStatisticalConsultQuantumGroupListTh() {
      getStatisticalConsultQuantumGroupListTh({
        startDate: this.form.daterange[0] || "",
        endDate: this.form.daterange[1] || "",
      })
        .then((res) => {
          let _res = res.data;
          if (_res.code != 200) return Promise.reject(_res.msg);
          else return _res.data;
        })
        .then((data) => {
          if (Array.isArray(data) && data.length) {
            this.consultQuantumGroupListThShow = true;
            this.drawConsultQuantumGroupListTh([...data]);
          } else this.consultQuantumGroupListThShow = false;
        });
    },

    getStatisticalConsultGroupListTh() {
      getStatisticalConsultGroupListTh({
        startDate: this.form.daterange[0] || "",
        endDate: this.form.daterange[1] || "",
      })
        .then((res) => {
          let _res = res.data;
          if (_res.code != 200) return Promise.reject(_res.msg);
          else return _res.data;
        })
        .then((data) => {
          if (Array.isArray(data) && data.length) {
            this.consultGroupListThShow = true;
            this.drawConsultGroupListTh([...data]);
            let temp = [{ groupNameList: [], countList: [] }];
            let sum = 0;
            data.forEach((item) => {
              temp[0].groupNameList.push(item.groupName);
              temp[0].countList.push(item.count);
              sum += item.count;
            });
            temp[0].groupNameList.push("总咨询量");
            temp[0].countList.push(sum);
            this.consultGroupListTh = [...temp];
          } else this.consultGroupListThShow = false;
        });
    },
    // 检索条件 改变
    filterSearch() {
      this.getStatisticalConsultListTh();
      this.getStatisticalConsultQuantumListTh();
      this.getStatisticalConsultQuantumGroupListTh();
      this.getStatisticalConsultGroupListTh();
    },
    // 日期范围改变
    handleDateRange() {
      this.filterSearch();
    },
    print() {
      this.printing = true;
      this.imgShow = true;
      var printWrap = document.getElementById("print-wrap");
      setTimeout(() => {
        this.echart.consultQuantumListTh &&
          document
            .getElementById("consultQuantumListThImg")
            .setAttribute("src", this.echart.consultQuantumListTh.getDataURL());
        this.echart.consultQuantumGroupListTh &&
          document
            .getElementById("consultQuantumGroupListThImg")
            .setAttribute(
              "src",
              this.echart.consultQuantumGroupListTh.getDataURL()
            );
        this.echart.consultGroupListTh &&
          document
            .getElementById("consultGroupListThImg")
            .setAttribute("src", this.echart.consultGroupListTh.getDataURL());
        this.printing = false;
        this.$nextTick(() => {
          var newHTML = printWrap.innerHTML;
          var oldHTML = printWrap.innerHTML;
          document.body.innerHTML = newHTML;
          window.print();
          window.location.reload();
          document.body.innerHTML = oldHTML;
          return false;
        });
      }, 3000);
    },

    // 时段统计报表 - 饼图
    drawConsultQuantumListTh(data) {
      this.echart.consultQuantumListTh = echarts.init(
        document.getElementById("consultQuantumListTh")
      );
      this.echart.consultQuantumListTh.setOption(
        pieOption({
          title: "时段统计报表",
          legend: {
            data: data.map((item) => {
              return `${timeIgnoreSecond(item.startTime)} - ${timeIgnoreSecond(
                item.endTime
              )}`;
            }),
          },
          series: {
            data: data.map((item) => ({
              value: item.count,
              name: `${timeIgnoreSecond(item.startTime)} - ${timeIgnoreSecond(
                item.endTime
              )}`,
            })),
          },
        })
      );
    },

    // 时段统计报表 - 折线图
    drawConsultQuantumGroupListTh(array) {
      this.echart.consultQuantumGroupListTh = echarts.init(
        document.getElementById("consultQuantumGroupListTh")
      );
      this.echart.consultQuantumGroupListTh.setOption(
        lineOption({
          title: {
            text: "时间统计报表",
          },
          legend: {
            data: array.map((item) => item.groupName),
          },
          xAxis: {
            data: array[0].dateList.map((item) => {
              return `${timeIgnoreSecond(item.startTime)} - ${timeIgnoreSecond(
                item.endTime
              )}`;
            }),
          },
          series: array.map((item, idx) => ({
            name: item.groupName,
            type: "line",
            data: item.dateList.map((item) => item.count),
            itemStyle: {
              normal: {
                color: colorList[idx] || colorList[0],
              },
            },
          })),
        })
      );
    },

    // 问题类别统计报表 - 饼图
    drawConsultGroupListTh(data) {
      this.echart.consultGroupListTh = echarts.init(
        document.getElementById("consultGroupListTh")
      );
      this.echart.consultGroupListTh.setOption(
        pieOption({
          title: "问题类别统计报表",
          legend: {
            data: data.map((item) => {
              return `${item.groupName}`;
            }),
          },
          series: {
            data: data.map((item) => ({
              value: item.count,
              name: `${item.groupName}`,
            })),
          },
        })
      );
    },
  },
};
</script>
<style lang="scss" scoped>
// @import "../../../../../../styles/mixin";
.mental-education-consulting-dataStatistics-base {
  .main-wrapper {
    overflow: auto;
  }
  .chart {
    background-color: #fff;
    width: 100%;
    height: 500px;
    padding: 30px 0;
  }
}
.chart-wrapper {
  height: 500px;
  .el-col {
    padding-right: 30px;
  }
}
.detail-title {
  margin: 22px auto 14px;
  border-left: 4px solid #409eff;
  padding-left: 12px;
  height: 16px;
  line-height: 16px;
  font-size: 15px;
  color: #676a6c;
  .danger {
    color: #f56c6c;
  }
}
.chart-img {
  width: 100%;
}
.no_list_msg {
  font-size: 14px;
  text-align: center;
  color: #999;
  overflow: hidden;
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  img {
    margin-top: 50px;
  }
  div {
    margin-top: -50px;
  }
}
</style>