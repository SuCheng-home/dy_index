<template>
  <div class="mental-education-consulting-dataStatistics-parent">
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
      <div class="detail-title">家长年龄段统计报表</div>
      <div class="no_list_msg" v-show="!consultAgeListParentShow">
        <img
          src="https://cdnfile-10043692.file.myqcloud.com/class_brand/gridClasscard/nodata/elastic-nodata2.png"
          alt
        />
        <div>暂无数据</div>
      </div>
      <div v-show="consultAgeListParentShow">
        <el-row class="chart-wrapper" type="flex" align="middle">
          <el-col :span="12">
            <div class="chart" id="consultAgeListParent" v-if="!imgShow"></div>
            <img
              class="chart-img"
              id="consultAgeListParentImg"
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
              :data="consultAgeListParent"
            >
              <el-table-column
                align="center"
                :label="item"
                show-overflow-tooltip
                :key="idx"
                v-for="(item, idx) in consultAgeListParent[0].agerangeList"
              >
                <template slot-scope="scope">
                  {{ scope.row.countList[idx] || "0" }}
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </div>

      <div class="no_list_msg" v-show="!consultAgeGroupListParentShow">
        <img
          src="https://cdnfile-10043692.file.myqcloud.com/class_brand/gridClasscard/nodata/elastic-nodata2.png"
          alt
        />
        <div>暂无数据</div>
      </div>
      <div v-show="consultAgeGroupListParentShow">
        <el-row class="chart-wrapper" type="flex" align="middle">
          <el-col :span="24">
            <div
              class="chart"
              id="consultAgeGroupListParent"
              v-if="!imgShow"
            ></div>
            <img
              class="chart-img"
              id="consultAgeGroupListParentImg"
              v-if="imgShow"
            />
          </el-col>
        </el-row>
      </div>

      <div class="no_list_msg" v-show="!consultEducationListParentShow">
        <img
          src="https://cdnfile-10043692.file.myqcloud.com/class_brand/gridClasscard/nodata/elastic-nodata2.png"
          alt
        />
        <div>暂无数据</div>
      </div>
      <div v-show="consultEducationListParentShow">
        <div class="detail-title">家长学历统计报表</div>
        <el-row class="chart-wrapper" type="flex" align="middle">
          <el-col :span="24">
            <div
              class="chart"
              id="consultEducationListParent"
              v-if="!imgShow"
            ></div>
            <img
              class="chart-img"
              id="consultEducationListParentImg"
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
            :data="consultEducationListParent"
          >
            <el-table-column
              align="center"
              :label="item"
              show-overflow-tooltip
              :key="idx"
              v-for="(item, idx) in consultEducationListParent[0].educationList"
            >
              <template slot-scope="scope">
                {{ scope.row.countList[idx] || "0" }}
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>

      <div class="no_list_msg" v-show="!consultEducationGroupListParentShow">
        <img
          src="https://cdnfile-10043692.file.myqcloud.com/class_brand/gridClasscard/nodata/elastic-nodata2.png"
          alt
        />
        <div>暂无数据</div>
      </div>
      <div v-show="consultEducationGroupListParentShow">
        <el-row class="chart-wrapper" type="flex" align="middle">
          <el-col :span="24">
            <div
              class="chart"
              id="consultEducationGroupListParent"
              v-if="!imgShow"
            ></div>
            <img
              class="chart-img"
              id="consultEducationGroupListParentImg"
              v-if="imgShow"
            />
          </el-col>
        </el-row>
      </div>
      <div class="no_list_msg" v-show="!consultEducationGroupListParentShow">
        <img
          src="https://cdnfile-10043692.file.myqcloud.com/class_brand/gridClasscard/nodata/elastic-nodata2.png"
          alt
        />
        <div>暂无数据</div>
      </div>
      <div v-show="consultEducationGroupListParentShow">
        <el-row class="chart-wrapper" type="flex" align="middle">
          <el-col :span="24">
            <div
              class="chart bar-chart"
              id="consultEducationGroupListParentBar"
              v-if="!imgShow"
            ></div>
            <img
              class="chart-img"
              id="consultEducationGroupListParentBarImg"
              v-if="imgShow"
            />
          </el-col>
        </el-row>
      </div>

      <div class="detail-title">身份统计报表</div>
      <div class="no_list_msg" v-show="!consultNickListParentShow">
        <img
          src="https://cdnfile-10043692.file.myqcloud.com/class_brand/gridClasscard/nodata/elastic-nodata2.png"
          alt
        />
        <div>暂无数据</div>
      </div>
      <div v-show="consultNickListParentShow">
        <el-row class="chart-wrapper" type="flex" align="middle">
          <el-col :span="12">
            <div class="chart" id="consultNickListParent" v-if="!imgShow"></div>
            <img
              class="chart-img"
              id="consultNickListParentImg"
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
              :data="consultNickListParent"
            >
              <el-table-column
                align="center"
                :label="item"
                show-overflow-tooltip
                :key="idx"
                v-for="(item, idx) in consultNickListParent[0].nickList"
              >
                <template slot-scope="scope">
                  {{ scope.row.countList[idx] || "0" }}
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </div>
      <div class="no_list_msg" v-show="!consultNickGroupListParentBarShow">
        <img
          src="https://cdnfile-10043692.file.myqcloud.com/class_brand/gridClasscard/nodata/elastic-nodata2.png"
          alt
        />
        <div>暂无数据</div>
      </div>
      <div v-show="consultNickGroupListParentBarShow">
        <el-row class="chart-wrapper" type="flex" align="middle">
          <el-col :span="24">
            <div
              class="chart"
              id="consultNickGroupListParentBar"
              v-if="!imgShow"
            ></div>
            <img
              class="chart-img"
              id="consultNickGroupListParentBarImg"
              v-if="imgShow"
            />
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
  getStatisticalConsultAgeListParent,
  getStatisticalConsultAgeGroupListParent,
  getStatisticalConsultEducationListParent,
  getStatisticalConsultEducationGroupListParent,
  getStatisticalConsultNickListParent,
  getStatisticalConsultNickGroupListParent,
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
  name: "mentalEducationConsultingDataStatisticsParent",
  mixins: [mixin],
  components: {},
  data() {
    return {
      printing: false,
      imgShow: false,
      consultAgeListParent: [{}],
      consultEducationListParent: [{}],
      consultNickListParent: [{}],
      // 请求表单
      form: {
        // 时间范围
        daterange: [
          this.$route.query.startDate || "",
          this.$route.query.endDate || "",
        ],
      },
      echart: {
        consultAgeListParent: null,
        consultEducationListParent: null,
        consultNickListParent: null,
        consultAgeGroupListParent: null,
        consultEducationGroupListParent: null,
        consultEducationGroupListParentBar: null,
        consultNickGroupListParentBar: null,
      },
      // 是否有数据
      consultAgeListParentShow: true,
      consultAgeGroupListParentShow: true,
      consultEducationListParentShow: true,
      consultEducationGroupListParentShow: true,
      consultNickListParentShow: true,
      consultNickGroupListParentBarShow: true,
    };
  },
  created() {
    this.getStatisticalConsultAgeListParent();
    this.getStatisticalConsultAgeGroupListParent();
    this.getStatisticalConsultEducationListParent();
    this.getStatisticalConsultEducationGroupListParent();
    this.getStatisticalConsultNickListParent();
    this.getStatisticalConsultNickGroupListParent();
  },
  methods: {
    getStatisticalConsultAgeListParent() {
      getStatisticalConsultAgeListParent({
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
            this.drawConsultAgeListParent([...data]);
            let temp = [{ agerangeList: [], countList: [] }];
            let sum = 0;
            data.forEach((item) => {
              temp[0].agerangeList.push(`${item.startAge} - ${item.endAge}`);
              temp[0].countList.push(item.count);
              sum += item.count;
            });
            temp[0].agerangeList.push("总咨询量");
            temp[0].countList.push(sum);
            this.consultAgeListParent = [...temp];
          } else this.consultQuantumListThShow = false;
        });
    },

    getStatisticalConsultAgeGroupListParent() {
      getStatisticalConsultAgeGroupListParent({
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
            this.consultAgeGroupListParentShow = true;
            this.drawConsultAgeGroupListParent([...data]);
          } else this.consultAgeGroupListParentShow = false;
        });
    },

    getStatisticalConsultEducationListParent() {
      getStatisticalConsultEducationListParent({
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
            this.consultEducationListParentShow = true;
            this.drawConsultEducationListParent([...data]);
            let temp = [{ educationList: [], countList: [] }];
            let sum = 0;
            data.forEach((item) => {
              temp[0].educationList.push(item.education);
              temp[0].countList.push(item.count);
              sum += item.count;
            });
            temp[0].educationList.push("总咨询量");
            temp[0].countList.push(sum);
            this.consultEducationListParent = [...temp];
          } else this.consultEducationListParentShow = false;
        });
    },
    getStatisticalConsultEducationGroupListParent() {
      getStatisticalConsultEducationGroupListParent({
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
            this.consultEducationGroupListParentShow = true;
            this.drawConsultEducationGroupListParent([...data]);
            this.drawconsultEducationGroupListParentBar([...data]);
          } else this.consultEducationGroupListParentShow = false;
        });
    },

    getStatisticalConsultNickListParent() {
      getStatisticalConsultNickListParent({
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
            this.consultNickListParentShow = true;
            this.drawConsultNickListParent([...data]);
            let temp = [{ nickList: [], countList: [] }];
            let sum = 0;
            data.forEach((item) => {
              temp[0].nickList.push(item.nick);
              temp[0].countList.push(item.count);
              sum += item.count;
            });
            temp[0].nickList.push("总咨询量");
            temp[0].countList.push(sum);
            this.consultNickListParent = [...temp];
          } else this.consultNickListParentShow = false;
        });
    },
    getStatisticalConsultNickGroupListParent() {
      getStatisticalConsultNickGroupListParent({
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
            this.consultNickGroupListParentBarShow = true;
            this.drawconsultNickGroupListParentBar([...data]);
          } else this.consultNickGroupListParentBarShow = false;
        });
    },
    // 检索条件 改变
    filterSearch() {
      this.getStatisticalConsultAgeListParent();
      this.getStatisticalConsultAgeGroupListParent();
      this.getStatisticalConsultEducationListParent();
      this.getStatisticalConsultEducationGroupListParent();
      this.getStatisticalConsultNickListParent();
      this.getStatisticalConsultNickGroupListParent();
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
        this.echart.consultAgeListParent &&
          document
            .getElementById("consultAgeListParentImg")
            .setAttribute("src", this.echart.consultAgeListParent.getDataURL());
        this.echart.consultEducationListParent &&
          document
            .getElementById("consultEducationListParentImg")
            .setAttribute(
              "src",
              this.echart.consultEducationListParent.getDataURL()
            );
        this.echart.consultNickListParent &&
          document
            .getElementById("consultNickListParentImg")
            .setAttribute(
              "src",
              this.echart.consultNickListParent.getDataURL()
            );
        this.echart.consultAgeGroupListParent &&
          document
            .getElementById("consultAgeGroupListParentImg")
            .setAttribute(
              "src",
              this.echart.consultAgeGroupListParent.getDataURL()
            );
        this.echart.consultEducationGroupListParent &&
          document
            .getElementById("consultEducationGroupListParentImg")
            .setAttribute(
              "src",
              this.echart.consultEducationGroupListParent.getDataURL()
            );
        this.echart.consultEducationGroupListParentBar &&
          document
            .getElementById("consultEducationGroupListParentBarImg")
            .setAttribute(
              "src",
              this.echart.consultEducationGroupListParentBar.getDataURL()
            );
        this.echart.consultNickGroupListParentBar &&
          document
            .getElementById("consultNickGroupListParentBarImg")
            .setAttribute(
              "src",
              this.echart.consultNickGroupListParentBar.getDataURL()
            );
        this.printing = false;
        this.$nextTick(() => {
          var newHTML = printWrap.innerHTML;
          document.body.innerHTML = newHTML;
          window.print();
          window.location.reload();
          document.body.innerHTML = oldHTML;
          return false;
        });
      }, 3000);
    },

    // 不同年龄段咨询量 - 饼图
    drawConsultAgeListParent(array) {
      this.echart.consultAgeListParent = echarts.init(
        document.getElementById("consultAgeListParent")
      );
      this.echart.consultAgeListParent.setOption(
        pieOption({
          title: {
            text: "不同年龄段咨询量",
          },
          legend: {
            data: array.map((item) => {
              return `${item.startAge} - ${item.endAge}`;
            }),
          },
          series: {
            data: array.map((item) => ({
              value: item.count,
              name: `${item.startAge} - ${item.endAge}`,
            })),
          },
        })
      );
    },

    // 家长年龄段统计报表 - 折线图
    drawConsultAgeGroupListParent(array) {
      this.echart.consultAgeGroupListParent = echarts.init(
        document.getElementById("consultAgeGroupListParent")
      );
      this.echart.consultAgeGroupListParent.setOption(
        lineOption({
          title: {
            text: "家长年龄段统计报表",
          },
          legend: {
            data: array.map((item) => item.groupName),
          },
          xAxis: {
            data: array[0].ageList.map((item) => {
              return `${item.startAge} - ${item.endAge}`;
            }),
          },
          series: array.map((item, idx) => ({
            name: item.groupName,
            type: "line",
            data: item.ageList.map((item) => item.count),
            itemStyle: {
              normal: {
                color: colorList[idx] || colorList[0],
              },
            },
          })),
        })
      );
    },

    // 家长学历统计报表 - 饼图
    drawConsultEducationListParent(array) {
      this.echart.consultEducationListParent = echarts.init(
        document.getElementById("consultEducationListParent")
      );
      this.echart.consultEducationListParent.setOption(
        pieOption({
          title: {
            text: "家长学历统计报表",
          },
          legend: {
            data: array.map((item) => {
              return item.education;
            }),
          },
          series: {
            data: array.map((item) => ({
              value: item.count,
              name: item.education,
            })),
          },
        })
      );
    },

    // 家长学历统计报表 - 折线图
    drawConsultEducationGroupListParent(array) {
      this.echart.consultEducationGroupListParent = echarts.init(
        document.getElementById("consultEducationGroupListParent")
      );
      this.echart.consultEducationGroupListParent.setOption(
        lineOption({
          title: {
            text: "家长学历统计报表",
          },
          legend: {
            data: array.map((item) => item.groupName),
          },
          xAxis: {
            data: array[0].educationList.map((item) => {
              return item.education;
            }),
          },
          series: array.map((item, idx) => ({
            name: item.groupName,
            type: "line",
            data: item.educationList.map((item) => item.count),
            itemStyle: {
              normal: {
                color: colorList[idx] || colorList[0],
              },
            },
          })),
        })
      );
    },

    // 家长学历统计报表 - 柱状图
    drawconsultEducationGroupListParentBar(array) {
      this.echart.consultEducationGroupListParentBar = echarts.init(
        document.getElementById("consultEducationGroupListParentBar")
      );
      this.echart.consultEducationGroupListParentBar.setOption(
        barOption({
          title: {
            text: "家长学历统计报表",
          },
          xAxis: {
            data: array.map((item) => item.groupName),
          },
          legend: {
            data: array[0].educationList.map((item) => item.education),
          },
          series: [
            ...array[0].educationList.map((education, idx) => {
              return {
                name: education.education,
                type: "bar",
                data: array.map((item) => item.educationList[idx].count),
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

    // 身份统计报表 - 饼图
    drawConsultNickListParent(array) {
      this.echart.consultNickListParent = echarts.init(
        document.getElementById("consultNickListParent")
      );
      this.echart.consultNickListParent.setOption(
        pieOption({
          title: {
            text: "身份统计报表",
          },
          legend: {
            data: array.map((item) => {
              return item.nick;
            }),
          },
          series: {
            data: array.map((item) => ({
              value: item.count,
              name: item.nick,
            })),
          },
        })
      );
    },

    // 身份统计报表 - 柱状图
    drawconsultNickGroupListParentBar(array) {
      this.echart.consultNickGroupListParentBar = echarts.init(
        document.getElementById("consultNickGroupListParentBar")
      );
      this.echart.consultNickGroupListParentBar.setOption(
        barOption({
          title: {
            text: "身份统计报表",
          },
          legend: {
            data: array[0].nickList.map((item) => item.nick),
          },
          xAxis: {
            data: array.map((item) => item.groupName),
          },
          series: [
            ...array[0].nickList.map((nick, idx) => {
              return {
                name: nick.nick,
                type: "bar",
                data: array.map((item) => item.nickList[idx].count),
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
  },
};
</script>
<style lang="scss" scoped>
.mental-education-consulting-dataStatistics-parent {
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