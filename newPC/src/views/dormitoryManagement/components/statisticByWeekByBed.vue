<template>
  <div class="check_in_statistics_wrap">
    <div class="header">
      <el-select size="medium"
        v-model="schoolTimeId"
        placeholder="请选择学期"
        @change="handleTermChange"
      >
        <el-option
          v-for="item in schoolYearList"
          :key="item.id"
          :label="item.schoolTimeName"
          :value="item.id"
        >
        </el-option>
      </el-select>
      <el-select size="medium" style="width: 150px;"
        v-model="severalWeek"
        placeholder="请选择学期周"
        @change="getStatistics"
      >
        <el-option
          v-for="item in weekList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <el-select  size="medium" v-model="buildId" placeholder="请选择宿舍楼" @change="getStatistics">
        <el-option v-for="item in schoolBuildingList" :key="item.id" :label="item.name" :value="item.id">
        </el-option>
      </el-select>
      <el-button type="primary" size="medium" @click="getStatistics"
        >检索</el-button
      >
      <a :href="exportUrl"
        download="导出结果"
        target="_blank"
        v-if="tableList.length"
      >
        <el-button type="primary" size="medium" icon="upload">导出</el-button>
      </a>
      <el-input class="search-input" style="width:20%;float: right;"
        placeholder="请输入宿舍名称" icon="search" size="medium"  @change="getStatistics()"
        v-model.trim="dormName">
        <el-button slot="append" icon="el-icon-search" @click="getStatistics" ></el-button>
      </el-input>  
    </div>
    <div class="check_in_statistics_table_box">
      <el-table ref="table"
        stripe
        :data="tableList"
        border
        fit
        highlight-current-row
        style="width: 100%"
        :height="maxHeight"
      >
        <el-table-column
          align="center"
          prop="stuName"
          label="学生姓名"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="dormName"
          label="所属宿舍"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="className"
          label="所属班级"
        ></el-table-column>
        <el-table-column v-for="(column, index) in titleList" :key="column.statisticalDate"
          align="center"
          :label="`${column.weekNamer}(${column.statisticalDate})`"
        >
          <template slot-scope="{row}">
            {{row.dateScoreList[index]}}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="totalScore"
          label="总分"
        ></el-table-column>
      </el-table>
      <div class="pagination-container" style="margin-top: 15px">
        <el-pagination
          @size-change="sizeChangeHandler"
          @current-change="currentChangeHandler"
          :current-page.sync="pagination.pageNo"
          :page-sizes="[10, 20, 30, 50]"
          :page-size.sync="pagination.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.total"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import mixins from "@/mixins/windowResize";
import {
  getSchoolTimeAllList,
  getSeveralWeekListBySchoolTImeId,
} from "@/api/classScheduleCard";
import { getRecordStaticStuListByWeekOrMonth } from '@/api/dormitoryInspection'
import { getSchoolDormBuildingList } from "@/api/dormitoryManage";

export default {
  name: "StatisticByWeekByBed",
  data() {
    return {
      isManager: false,
      schoolYearList:[],
      weekList:[],
      dormName: '',
      schoolTimeId: '',
      severalWeek: 0,
      buildId: "",
      schoolBuildingList: [],
      pagination: {
        pageNo: 1,
        pageSize: 20,
        total: null,
      },
      exportUrl: "",
      tableList: [],
      titleList: []
    };
  },
  mixins: [mixins],
  computed: {
    maxHeight() {
      return this.maxH - 50
    }
  },
  async created() {
    await this.initTermList();
    await this.getSchoolDormBuildingList()
    this.getStatistics()
  },
  methods: {
    async initTermList() {
      const res = await getSchoolTimeAllList()
      this.schoolYearList = res.data.data;
      const currentTerm = this.schoolYearList.find(i => i.isCurrent === 1)
      this.schoolTimeId = currentTerm ? currentTerm.id : this.schoolYearList[0].id
      if (this.schoolTimeId) {
        await this.initTermWeekList()
      }
    },
    async initTermWeekList() {
      const res = await getSeveralWeekListBySchoolTImeId(this.schoolTimeId)
      const data = res.data.data;
      this.weekList = data.map((item) => {
        return {
          value: item.week,
          label: "第" + item.week + "周",
        };
      });
      if (data.map((item) => item.nowWeek).indexOf(1) > -1) {
        this.severalWeek =
          data[data.map((item) => item.nowWeek).indexOf(1)].week;
      } else {
        this.severalWeek = data[0].week;
      }
    },
    async handleTermChange() {
      await this.initTermWeekList()
      this.getStatistics()
    },
    // 宿舍楼列表
    async getSchoolDormBuildingList() {
      const res = await getSchoolDormBuildingList()
      const data = res.data.data;
      this.schoolBuildingList = data
      if (data.length) {
        this.buildId = data[0].id
      }
    },
    getStatistics() {
      let query = {
        pageNo: this.pagination.pageNo,
        pageSize: this.pagination.pageSize,
        buildId: this.buildId,
        checkType: 2, //  1宿舍2 住宿生
        schoolTimeId: this.schoolTimeId,
        severalWeek: this.severalWeek,
        dormName: this.dormName
      };
      this.exportUrl = `${global.BasePath}structure/dormCheck/exportRecordStaticStuListByWeekOrMonth?token=${this.$store.getters.token}`
      for (const key in query) {
        this.exportUrl += `&${key}=${query[key]}`
      }
      this.getDormStaticsData(query);
    },
    getDormStaticsData(query) {
      getRecordStaticStuListByWeekOrMonth(query)
        .then((res) => {
          const data = res.data;
          if (res.data.code === 200) {
            this.tableList = data.data.dataList;
            this.titleList = data.data.titleList;
            this.pagination.total = data.data.pagination.total;
            this.$nextTick(() => {
              this.$refs.table.doLayout()
            })
          } else {
            this.$message({
              message: data.msg,
              type: "warning",
            });
          }
        })
        .catch();
    },
    sizeChangeHandler() {
      this.pagination.pageNo = 1
      this.getStatistics();
    },
    currentChangeHandler() {
      this.getStatistics();
    },
  },
};
</script>

<style scoped>
</style>
<style lang="scss" scoped>
.check_in_statistics_wrap {
  .header {
    padding-bottom: 10px;
  }
}
</style>
