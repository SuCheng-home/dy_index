<template>
  <div class="mental-education-consulting-dataStatistics-student">
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
      <div class="detail-title">年级统计报表</div>
      <div class="no_list_msg" v-show="!consultGradeListStShow">
        <img
          src="https://cdnfile-10043692.file.myqcloud.com/class_brand/gridClasscard/nodata/elastic-nodata2.png"
          alt
        />
        <div>暂无数据</div>
      </div>
      <div v-show="consultGradeListStShow">
        <el-row class="chart-wrapper" type="flex" align="middle">
          <el-col :span="12">
            <div class="chart" id="consultGradeListSt" v-if="!imgShow"></div>
            <img id="consultGradeListStImg" class="chart-img" v-if="imgShow" />
          </el-col>
          <el-col :span="12">
            <el-table
              border
              fit
              stripe
              highlight-current-row
              style="width: 100%"
              :data="consultGradeListSt"
            >
              <el-table-column
                align="center"
                :label="item"
                show-overflow-tooltip
                :key="idx"
                v-for="(item, idx) in consultGradeListSt[0].gradeLevelNameList"
              >
                <template slot-scope="scope">
                  {{ scope.row.countList[idx] || "0" }}
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </div>
      <div class="no_list_msg" v-show="!consultGradeGroupListStShow">
        <img
          src="https://cdnfile-10043692.file.myqcloud.com/class_brand/gridClasscard/nodata/elastic-nodata2.png"
          alt
        />
        <div>暂无数据</div>
      </div>
      <div v-show="consultGradeGroupListStShow">
        <el-row class="chart-wrapper" type="flex" align="middle">
          <el-col :span="24">
            <div
              class="chart"
              id="consultGradeGroupListSt"
              v-if="!imgShow"
            ></div>
            <img
              id="consultGradeGroupListStImg"
              class="chart-img"
              v-if="imgShow"
            />
          </el-col>
        </el-row>
      </div>

      <div class="detail-title">学生性别统计报表</div>
      <div class="no_list_msg" v-show="!consultSexGroupListStShow">
        <img
          src="https://cdnfile-10043692.file.myqcloud.com/class_brand/gridClasscard/nodata/elastic-nodata2.png"
          alt
        />
        <div>暂无数据</div>
      </div>
      <div v-show="consultSexGroupListStShow">
        <el-row class="chart-wrapper" type="flex" align="middle">
          <el-col :span="12">
            <div class="chart" id="consultSexListStMale" v-if="!imgShow"></div>
            <img
              id="consultSexListStMaleImg"
              class="chart-img"
              v-if="imgShow"
            />
          </el-col>
          <el-col :span="12">
            <div
              class="chart"
              id="consultSexListStFemale"
              v-if="!imgShow"
            ></div>
            <img
              id="consultSexListStFemaleImg"
              class="chart-img"
              v-if="imgShow"
            />
          </el-col>
        </el-row>
      </div>
      <el-row class="chart-wrapper" type="flex" align="middle">
        <el-col :span="24">
          <el-table
            border
            fit
            stripe
            highlight-current-row
            style="width: 100%"
            :data="consultSexGroupListSt"
          >
            <el-table-column
              align="center"
              :label="item"
              show-overflow-tooltip
              :key="idx"
              v-for="(item, idx) in consultSexGroupListSt[0].groupNameList"
            >
              <el-table-column align="center" label="男">
                <template slot-scope="scope">
                  {{ scope.row.countList[idx].maleCount || "0" }}
                </template>
              </el-table-column>
              <el-table-column align="center" label="女">
                <template slot-scope="scope">
                  {{ scope.row.countList[idx].femaleCount || "0" }}
                </template>
              </el-table-column>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <div class="no_list_msg" v-show="!consultOnlyListStShow">
        <img
          src="https://cdnfile-10043692.file.myqcloud.com/class_brand/gridClasscard/nodata/elastic-nodata2.png"
          alt
        />
        <div>暂无数据</div>
      </div>
      <div v-show="consultOnlyListStShow"></div>
      <div class="detail-title">独生子女统计报表</div>
      <el-row class="chart-wrapper" type="flex" align="middle">
        <el-col :span="24">
          <div class="chart" id="consultOnlyListSt" v-if="!imgShow"></div>
          <img id="consultOnlyListStImg" class="chart-img" v-if="imgShow" />
        </el-col>
      </el-row>

      <div class="no_list_msg" v-show="!consultOnlyGroupListStShow">
        <img
          src="https://cdnfile-10043692.file.myqcloud.com/class_brand/gridClasscard/nodata/elastic-nodata2.png"
          alt
        />
        <div>暂无数据</div>
      </div>
      <div v-show="consultOnlyGroupListStShow">
        <el-row class="chart-wrapper" type="flex" align="middle">
          <el-col :span="24">
            <div
              class="chart"
              id="consultOnlyGroupListSt"
              v-if="!imgShow"
            ></div>
            <img
              id="consultOnlyGroupListStImg"
              class="chart-img"
              v-if="imgShow"
            />
          </el-col>
        </el-row>

        <el-row class="chart-wrapper" type="flex" align="middle">
          <el-col :span="24">
            <el-table
              border
              fit
              stripe
              highlight-current-row
              style="width: 100%"
              :data="consultOnlyGroupListSt"
            >
              <el-table-column
                show-overflow-tooltip
                align="center"
                style="flex: 1"
                :label="item"
                :key="idx"
                v-for="(item, idx) in consultOnlyGroupListSt[0].groupNameList"
              >
                <el-table-column align="center" label="独生子女">
                  <template slot-scope="scope">
                    {{ scope.row.countList[idx].onlyCount || "0" }}
                  </template>
                </el-table-column>
                <el-table-column align="center" label="非独生子女">
                  <template slot-scope="scope">
                    {{ scope.row.countList[idx].noOnlyCount || "0" }}
                  </template>
                </el-table-column>
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

/* components */

/* api */
import {
  getStatisticalConsultGradeListSt,
  getStatisticalConsultGradeGroupListSt,
  getStatisticalConsultSexListSt,
  getStatisticalConsultSexGroupListSt,
  getStatisticalConsultOnlyListSt,
  getStatisticalConsultOnlyGroupListSt,
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
        interval: 0,
      },
      axisLine: {
        onZero: true,
        lineStyle: {
          color: "#a3a3a3",
        },
      },
      axisLabel: {
        interval: 0,
        formatter: function (value) {
          var ret = ""; //拼接加\n返回的类目项
          var maxLength = 7; //每项显示文字个数
          var valLength = value.length; //X轴类目项的文字个数
          var rowN = Math.ceil(valLength / maxLength); //类目项需要换行的行数
          if (rowN > 1) {
            //如果类目项的文字大于n,
            for (var i = 0; i < rowN; i++) {
              var temp = ""; //每次截取的字符串
              var start = i * maxLength; //开始截取的位置
              var end = start + maxLength; //结束截取的位置
              //这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧
              temp = value.substring(start, end) + "\n";
              ret += temp; //凭借最终的字符串
            }
            return ret;
          } else {
            return value;
          }
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

let barOption = ({ title, grid, legend, xAxis, series }) => ({
  title: Object.assign(
    {
      x: "center",
    },
    title
  ),
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "shadow",
    },
  },
  grid: Object.assign(
    {
      height: "200",
    },
    grid
  ),
  xAxis: Object.assign(
    {
      show: true,
      position: "bottom",
      type: "category",
      axisTick: {
        alignWithLabel: true,
      },
      axisLabel: {
        interval: 0,
        show: true,
        formatter: function (value) {
          var ret = ""; //拼接加\n返回的类目项
          var maxLength = 4; //每项显示文字个数
          var valLength = value.length; //X轴类目项的文字个数
          var rowN = Math.ceil(valLength / maxLength); //类目项需要换行的行数
          if (rowN > 1) {
            //如果类目项的文字大于3,
            for (var i = 0; i < rowN; i++) {
              var temp = ""; //每次截取的字符串
              var start = i * maxLength; //开始截取的位置
              var end = start + maxLength; //结束截取的位置
              //这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧
              temp = value.substring(start, end) + "\n";
              ret += temp; //凭借最终的字符串
            }
            return ret;
          } else {
            return value;
          }
        },
      },
    },
    xAxis
  ),
  yAxis: {},
  legend: Object.assign(
    {
      x: "center",
      top: "bottom",
    },
    legend
  ),
  series,
});

export default {
  name: "mentalEducationConsultingDataStatisticsStudent",
  mixins: [mixin],
  components: {},
  data() {
    return {
      printing: false,
      imgShow: false,
      consultGradeListSt: [{}],
      consultOnlyGroupListSt: [{}],
      consultSexGroupListSt: [{}],
      // 请求表单
      form: {
        // 时间范围
        daterange: [
          this.$route.query.startDate || "",
          this.$route.query.endDate || "",
        ],
      },
      echart: {
        consultGradeListSt: null,
        consultGradeGroupListSt: null,
        consultSexListStMale: null,
        consultSexListStFemale: null,
        consultOnlyListSt: null,
        consultOnlyGroupListSt: null,
      },
      consultGradeListStShow: true,
      consultGradeGroupListStShow: true,
      consultSexGroupListStShow: true,
      consultOnlyListStShow: true,
      consultOnlyGroupListStShow: true,
    };
  },
  created() {
    this.getStatisticalConsultGradeListSt();
    this.getStatisticalConsultGradeGroupListSt();
    this.getStatisticalConsultSexListSt();
    this.getStatisticalConsultSexGroupListSt();
    this.getStatisticalConsultOnlyListSt();
    this.getStatisticalConsultOnlyGroupListSt();
  },
  methods: {
    getStatisticalConsultGradeListSt() {
      getStatisticalConsultGradeListSt({
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
            this.consultGradeListStShow = true;
            this.drawConsultGradeListSt([...data]);
            let temp = [{ gradeLevelNameList: [], countList: [] }];
            let sum = 0;
            data.forEach((item) => {
              temp[0].gradeLevelNameList.push(item.gradeLevelName);
              temp[0].countList.push(item.count);
              sum += item.count;
            });
            temp[0].gradeLevelNameList.push("总咨询量");
            temp[0].countList.push(sum);
            this.consultGradeListSt = [...temp];
          } else this.consultGradeListStShow = false;
        });
    },
    getStatisticalConsultGradeGroupListSt() {
      getStatisticalConsultGradeGroupListSt({
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
            this.consultGradeGroupListStShow = true;
            this.drawConsultGradeGroupListSt([...data]);
          } else this.consultGradeGroupListStShow = false;
        });
    },

    getStatisticalConsultSexListSt() {
      getStatisticalConsultSexListSt({
        startDate: this.form.daterange[0] || "",
        endDate: this.form.daterange[1] || "",
      })
        .then((res) => {
          let _res = res.data;
          if (_res.code != 200) return Promise.reject(_res.msg);
          else return _res.data;
        })
        .then((data) => {});
    },

    getStatisticalConsultSexGroupListSt() {
      getStatisticalConsultSexGroupListSt({
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
            this.consultSexGroupListStShow = true;
            this.drawConsultSexListStMale([...data]);
            this.drawConsultSexListStFemale([...data]);

            let temp = [{ groupNameList: [], countList: [] }];
            let sumMale = 0;
            let sumFemale = 0;
            data.forEach((item) => {
              temp[0].groupNameList.push(item.groupName);
              temp[0].countList.push({
                maleCount: item.sexList[0].count,
                femaleCount: item.sexList[1].count,
              });
              sumMale += item.sexList[0].count;
              sumFemale += item.sexList[1].count;
            });
            temp[0].groupNameList.push("总咨询量");
            temp[0].countList.push({
              maleCount: sumMale,
              femaleCount: sumFemale,
            });
            this.consultSexGroupListSt = [...temp];
          } else this.consultSexGroupListStShow = false;
        });
    },

    getStatisticalConsultOnlyListSt() {
      getStatisticalConsultOnlyListSt({
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
            this.consultOnlyListStShow = true;
            this.drawConsultOnlyListSt([...data]);
          } else this.consultOnlyListStShow = false;
        });
    },

    getStatisticalConsultOnlyGroupListSt() {
      getStatisticalConsultOnlyGroupListSt({
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
            this.consultOnlyGroupListStShow = true;
            this.drawConsultOnlyGroupListSt([...data]);
            let temp = [{ groupNameList: [], countList: [] }];
            let sumOnly = 0;
            let sumNoOnly = 0;
            data.forEach((item) => {
              temp[0].groupNameList.push(item.groupName);
              temp[0].countList.push({
                onlyCount: item.onlyList[0].count,
                noOnlyCount: item.onlyList[1].count,
              });
              sumOnly += item.onlyList[0].count;
              sumNoOnly += item.onlyList[1].count;
            });
            temp[0].groupNameList.push("总咨询量");
            temp[0].countList.push({
              onlyCount: sumOnly,
              noOnlyCount: sumNoOnly,
            });
            this.consultOnlyGroupListSt = [...temp];
          } else this.consultOnlyGroupListStShow = false;
        });
    },
    // 检索条件 改变
    filterSearch() {
      this.getStatisticalConsultGradeListSt();
      this.getStatisticalConsultGradeGroupListSt();
      this.getStatisticalConsultSexListSt();
      this.getStatisticalConsultSexGroupListSt();
      this.getStatisticalConsultOnlyListSt();
      this.getStatisticalConsultOnlyGroupListSt();
    },
    // 日期范围改变
    handleDateRange() {
      this.filterSearch();
    },
    print() {
      this.printing = true;
      this.imgShow = true;
      setTimeout(() => {
        var printWrap = document.getElementById("print-wrap");
        this.echart.consultGradeListSt &&
          document
            .getElementById("consultGradeListStImg")
            .setAttribute("src", this.echart.consultGradeListSt.getDataURL());

        this.echart.consultGradeGroupListSt &&
          document
            .getElementById("consultGradeGroupListStImg")
            .setAttribute(
              "src",
              this.echart.consultGradeGroupListSt.getDataURL()
            );

        this.echart.consultSexListStMale &&
          document
            .getElementById("consultSexListStMaleImg")
            .setAttribute("src", this.echart.consultSexListStMale.getDataURL());

        this.echart.consultSexListStFemale &&
          document
            .getElementById("consultSexListStFemaleImg")
            .setAttribute(
              "src",
              this.echart.consultSexListStFemale.getDataURL()
            );

        this.echart.consultOnlyListSt &&
          document
            .getElementById("consultOnlyListStImg")
            .setAttribute("src", this.echart.consultOnlyListSt.getDataURL());

        this.echart.consultOnlyGroupListSt &&
          document
            .getElementById("consultOnlyGroupListStImg")
            .setAttribute(
              "src",
              this.echart.consultOnlyGroupListSt.getDataURL()
            );

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

    // 年级咨询量 - 饼图
    drawConsultGradeListSt(array) {
      this.echart.consultGradeListSt = echarts.init(
        document.getElementById("consultGradeListSt")
      );
      this.echart.consultGradeListSt.setOption(
        pieOption({
          title: {
            text: "年级咨询量",
          },
          legend: {
            data: array.map((item) => {
              return item.gradeLevelName;
            }),
          },
          series: {
            data: array.map((item) => ({
              value: item.count,
              name: item.gradeLevelName,
            })),
          },
        })
      );
    },

    // 年级统计报表 - 柱状图
    drawConsultGradeGroupListSt(array) {
      this.echart.consultGradeGroupListSt = echarts.init(
        document.getElementById("consultGradeGroupListSt")
      );
      this.echart.consultGradeGroupListSt.setOption(
        barOption({
          title: {
            text: "年级统计报表",
          },
          xAxis: {
            data: array.map((item) => item.groupName),
          },
          legend: {
            data: array[0].gradeList.map((item) => item.gradeLevelName),
          },
          series: [
            ...array[0].gradeList.map((grade, idx) => {
              return {
                name: grade.gradeLevelName,
                type: "bar",
                data: array.map((item) => item.gradeList[idx].count),
                itemStyle: {
                  normal: {
                    color: colorList[idx],
                  },
                },
              };
            }),
          ],
        })
      );
    },

    // 学生性别统计报表 - 男 - 饼图
    drawConsultSexListStMale(array) {
      this.echart.consultSexListStMale = echarts.init(
        document.getElementById("consultSexListStMale")
      );
      this.echart.consultSexListStMale.setOption(
        pieOption({
          title: {
            text: "男",
          },
          legend: {
            data: array.map((item) => {
              return item.groupName;
            }),
          },
          series: {
            data: array.map((item, idx) => ({
              value: item["sexList"].find((item) => item.sex == 1).count,
              name: item.groupName,
            })),
          },
        })
      );
    },

    // 学生性别统计报表 - 女 - 饼图
    drawConsultSexListStFemale(array) {
      this.echart.consultSexListStFemale = echarts.init(
        document.getElementById("consultSexListStFemale")
      );
      this.echart.consultSexListStFemale.setOption(
        pieOption({
          title: {
            text: "女",
          },
          legend: {
            data: array.map((item) => {
              return item.groupName;
            }),
          },
          series: {
            data: array.map((item, idx) => ({
              value: item["sexList"].find((item) => item.sex == 2).count,
              name: item.groupName,
            })),
          },
        })
      );
    },

    // 咨询量占比 - 饼图
    drawConsultOnlyListSt(array) {
      this.echart.consultOnlyListSt = echarts.init(
        document.getElementById("consultOnlyListSt")
      );
      this.echart.consultOnlyListSt.setOption(
        pieOption({
          title: {
            text: "咨询量占比",
          },
          legend: {
            data: array.map((item) => {
              // 是否独生子女1独生，2非独生
              return item.isOnly == 1 ? "独生子女" : "非独生子女";
            }),
          },
          series: {
            data: array.map((item, idx) => ({
              value: item.count,
              name: item.isOnly == 1 ? "独生子女" : "非独生子女",
            })),
          },
        })
      );
    },

    // 咨询量占比 - 折线图
    drawConsultOnlyGroupListSt(array) {
      this.echart.consultOnlyGroupListSt = echarts.init(
        document.getElementById("consultOnlyGroupListSt")
      );
      this.echart.consultOnlyGroupListSt.setOption(
        lineOption({
          legend: {
            data: ["独生子女", "非独生子女"],
            top: "top",
          },
          xAxis: {
            data: array.map((item) => {
              return item.groupName;
            }),
          },
          series: [
            {
              name: "独生子女",
              type: "line",
              data: array.map((item) => {
                return item.onlyList[0].count;
              }),
              itemStyle: {
                normal: {
                  color: colorList[0],
                },
              },
            },
            {
              name: "非独生子女",
              type: "line",
              data: array.map((item) => {
                return item.onlyList[1].count;
              }),
              itemStyle: {
                normal: {
                  color: colorList[1],
                },
              },
            },
          ],
        })
      );
    },
  },
};
</script>
<style lang="scss" scoped>
.mental-education-consulting-dataStatistics-student {
  .main-wrapper {
    overflow: auto;
  }

  .chart {
    background-color: #fff;
    width: 100%;
    height: 500px;
    padding: 30px 0;
  }
  .chart-wrapper {
    .el-col {
      padding-right: 30px;
    }
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