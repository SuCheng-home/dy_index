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
      <el-date-picker size="medium" @change="getStatistics"
        v-model="month"
        type="month"
        :picker-options="options"
        value-format="yyyy-MM"
        placeholder="选择月">
      </el-date-picker>
      <el-select size="medium" style="width: 150px;"
        v-model="groupId"
        placeholder="请选择检查组"
        @change="getStatistics"
      >
        <el-option
          v-for="item in groupList"
          :key="item.id"
          :label="item.title"
          :value="item.id"
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
      <el-table stripe :data="tableList" ref="table"
        border
        fit
        highlight-current-row
        style="width: 100%"
        :height="maxHeight"
      >
        <el-table-column min-width="120" fixed="left"
          align="center"
          prop="dormName"
          label="宿舍名称"
        ></el-table-column>
        <el-table-column v-for="(column, index) in titleList" :key="column.statisticalDate"
          align="center"
           min-width="100"
          :label="`${column.weekNamer}(${column.statisticalDate})`"
        >
          <template slot-scope="{row}">
            {{row.dateScoreList[index]}}
          </template>
        </el-table-column>
        <el-table-column min-width="80" fixed="right"
          align="center"
          prop="totalScore"
          label="总分"
        ></el-table-column>
        <el-table-column min-width="80" fixed="right"
          align="center"
          prop="rank"
          label="排名"
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
} from "@/api/classScheduleCard";
import { getGroupList, getRecordStaticDormListByWeekOrMonth } from '@/api/dormitoryInspection'
import { getSchoolDormBuildingList } from "@/api/dormitoryManage";

export default {
  name: "StatisticByMonthByDorm",
  data() {
    return {
      isManager: false,
      schoolYearList:[],
      groupList: [],
      dormName: '',
      month: this.$moment().format('YYYY-MM'),
      schoolTimeId: '',
      buildId: "",
      schoolBuildingList: [],
      pagination: {
        pageNo: 1,
        pageSize: 20,
        total: null,
      },
      exportUrl: "",
      tableList: [],
      titleList: [],
      options: {
        disabledDate: (date) => {
          const termObj = this.schoolYearList.find(i => i.id === this.schoolTimeId)
          if (!termObj) return false

          return date < new Date(termObj.startDate.replace(/\-/g, '/')) || date > new Date(termObj.endDate.replace(/\-/g, '/'))
        }
      }
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
    await this.initGroupList()
    await this.getSchoolDormBuildingList()
    this.getStatistics()
  },
  methods: {
    async initTermList() {
      const res = await getSchoolTimeAllList()
      this.schoolYearList = res.data.data;
      const currentTerm = this.schoolYearList.find(i => i.isCurrent === 1)
      this.schoolTimeId = currentTerm ? currentTerm.id : this.schoolYearList[0].id
    },
    async handleTermChange() {
      this.getStatistics()
    },
    async initGroupList() {
      const res = await getGroupList({
        title: '',
        pageNo: 1,
        pageSize: 9999
      })
      this.groupList = res.data.data.dataList
      if (this.groupList.length) {
        this.groupId = this.groupList[0].id
      }
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
        checkType: 1, //  1宿舍2 住宿生
        schoolTimeId: this.schoolTimeId,
        month: this.month,
        groupId: this.groupId,
        dormName: this.dormName
      };
      this.exportUrl = `${global.BasePath}structure/dormCheck/exportRecordStaticDormListByWeekOrMonth?token=${this.$store.getters.token}`
      for (const key in query) {
        this.exportUrl += `&${key}=${query[key]}`
      }
      this.getDormStaticsData(query);
    },
    getDormStaticsData(query) {
      getRecordStaticDormListByWeekOrMonth(query)
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
