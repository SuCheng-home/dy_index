<template>
  <div class="school-honor-statistic">
    <div class="filter-wrapper">
      <div class="filter-item">
        <el-date-picker
          size="medium"
          type="daterange" class="mywidthdaterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          :clearable="false"
          v-model="form.dateRange"
          @change="filterSearch"
        ></el-date-picker>
      </div>
      <div class="filter-item">
        <el-select
          size="medium"
          placeholder="请选择"
          v-model="form.certificateLevelCode"
          @change="filterSearch"
        >
          <el-option label="全部证书级别" :value="''"></el-option>
          <el-option
            v-for="(item, idx) in schoolCertificateLevel"
            :key="idx"
            :label="item.value"
            :value="item.code"
          ></el-option>
        </el-select>
      </div>
      <div class="filter-item">
      <el-button type="primary" size="medium" @click="schoolHonorStatisticadd()">新增</el-button>
      </div>
      
      <div class="filter-item">
        <a :href="exportUrl"  v-if="tabList.length" target="_blank" download="examName">
          <el-button type="primary" size="medium">导出</el-button>
        </a>
      </div>
    </div>
    <el-table
      border
      stripe
      highlight-current-row
      style="width: 100%"
      :height="maxH"
      :data="tabList"
      v-loading.body="tabLoading"
    >
      <el-table-column align="center" label="证书名称" show-overflow-tooltip>
        <template slot-scope="scope">{{
          scope.row.certificateName || "--"
        }}</template>
      </el-table-column>
      <el-table-column align="center" label="项目名称" show-overflow-tooltip>
        <template slot-scope="scope">{{
          scope.row.prejectName || "--"
        }}</template>
      </el-table-column>
      <el-table-column align="center" label="证书级别" show-overflow-tooltip>
        <template slot-scope="scope">{{
          scope.row.certificateLevelName || "--"
        }}</template>
      </el-table-column>
      <el-table-column align="center" label="颁发时间" show-overflow-tooltip>
        <template slot-scope="scope">{{
          scope.row.issueTime || "--"
        }}</template>
      </el-table-column>
      <el-table-column align="center" label="颁发机构" show-overflow-tooltip>
        <template slot-scope="scope">{{
          scope.row.issueGroupName || "--"
        }}</template>
      </el-table-column>
      <el-table-column align="center" label="证书" show-overflow-tooltip>
        <template slot-scope="scope">
          <div
            style="color: #409eff"
            v-if="scope.row.photoJson&&JSON.parse(scope.row.photoJson) && JSON.parse(scope.row.photoJson).length"
          >
            <image-previewer
              :images="getViewPic(JSON.parse(scope.row.photoJson))"
              tag="img"
              text="查看图片"
            ></image-previewer>
          </div>
          <div v-else>--</div>
        </template>
      </el-table-column>
        <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button size="small" type="text" @click="schoolHonorStatisticedit(scope.row)"
            >编辑</el-button
          >
          <el-button
            class="delete-btn"
            size="small"
            type="text"
            @click="handleDelete(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page.sync="pagination.currentPage"
      :page-sizes="pagination.pageSizes"
      :page-size="pagination.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pagination.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    ></el-pagination>
  </div>
</template>

<script>
import mixin from "@/mixins/windowResize";
import { mapGetters } from "vuex";
import ImagePreviewer from "@/components/ImagePreviewer/ImagePreviewer.vue";
import {
  findSchoolDicsByCode,
  statisticsSchoolHonorListByModel,deleteSchoolHonor
} from "@/api/teachingStudy/honorManagement/schoolHonorStatistic/index";

export default {
  name: "schoolHonorStatistic",
  mixins: [mixin],
  components: {
    ImagePreviewer,
  },
  computed: {
    ...mapGetters(["schoolInfo"]),
  },
  data() {
    return {
      // table 是否正在加载
      tabLoading: false,
      // 证书级别列表
      schoolCertificateLevel: [],
      // 表格列表
      tabList: [],
      // 请求表单
      form: {
        // 证书级别
        certificateLevelCode: "",
        dateRange: [
          this.$moment().date(1).format("YYYY-MM-DD"),
          this.$moment().format("YYYY-MM-DD"),
        ],
      },
      // 分页
      pagination: {
        currentPage: 1,
        pageSizes: [10, 20, 30, 50],
        pageSize: 20,
        total: 0,
      },
    };
  },
  created() {
    this.findSchoolDicsByCode();
    this.statisticsSchoolHonorListByModel();
  },
  methods: {
    schoolHonorStatisticadd(){
       sessionStorage.setItem('honorInfo', '');
       this.$router.push({path: 'schoolHonorStatisticadd'})
    },
     schoolHonorStatisticedit(info){
      sessionStorage.setItem('honorInfo', JSON.stringify(info));
      this.$router.push({path: 'schoolHonorStatisticadd',query:{honorId:info.id}})
    },
     // 删除
    handleDelete(item) {
      this.$confirm("确认要删除吗？", "删除", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        lockScroll: false,
      }).then(() => {
        this.deleteSchoolHonor(item);
      });
    },
    deleteSchoolHonor(item) {
      deleteSchoolHonor({
        id: item.id,
      })
        .then((res) => {
          let _res = res.data;
          if (_res.code != 200) return Promise.reject(_res.msg);
          else return _res.data;
        })
        .then((data) => {
          this.$message({
            message: "删除成功",
            type: "success",
          });
          this.statisticsSchoolHonorListByModel();
        })
        .catch((msg) => {
          this.$message({
            message: msg,
            type: "error",
          });
        });
    },
    findSchoolDicsByCode() {
      findSchoolDicsByCode({
        dicCode: "school_certificate_level",
        schoolId: this.schoolInfo.id,
      })
        .then((res) => {
          let _res = res.data;
          if (_res.code != 200) return Promise.reject(_res.msg);
          else return _res.data;
        })
        .then((data) => {
          this.schoolCertificateLevel = [...data];
        })
        .catch((msg) => {
          this.$message({
            message: msg,
            type: "error",
          });
        });
    },
    // 列表 教师荣誉(统计)
    statisticsSchoolHonorListByModel() {
      let startDate = this.form.dateRange ? this.form.dateRange[0] : "";
      let endDate = this.form.dateRange ? this.form.dateRange[1] : "";
      statisticsSchoolHonorListByModel({
        startDate,
        endDate,
        certificateLevelCode: this.form.certificateLevelCode,
        pageNo: this.pagination.currentPage,
        pageSize: this.pagination.pageSize,
      })
        .then((res) => {
          let _res = res.data;
          if (_res.code != 200) return Promise.reject(_res.msg);
          else return _res.data;
        })
        .then((data) => {
          let { dataList, pagination } = data;
          this.tabList = [...dataList];
          this.pagination.total = pagination.total;
          this.exportUrl = `${global.BasePath}structure/schoolHonor2/exportStatisticsSchoolHonorList?certificateLevelCode=${this.form.certificateLevelCode}&startDate=${startDate}&endDate=${endDate}&pageNo=${this.pagination.currentPage}&pageSize=${this.pagination.pageSize}&token=${this.$store.getters.token}`;
        })
        .catch((msg) => {
          this.$message({
            message: msg,
            type: "error",
          });
        });
    },
    // 修改 日期范围 / 标题
    filterSearch() {
      this.pagination.currentPage = 1;
      this.statisticsSchoolHonorListByModel();
    },
    // 分页 - pageSize 改变
    handleSizeChange(pageSize) {
      this.pagination.pageSize = pageSize;
      this.statisticsSchoolHonorListByModel();
    },
    // 分页 - currentPage 改变
    handleCurrentChange(currentPage) {
      this.pagination.currentPage = currentPage;
      this.statisticsSchoolHonorListByModel();
    },
    getViewPic(photoList) {
      if (photoList) {
        return photoList.map((item) => ({ src: item.photoUrl||item.fileUrl}));
      }
      return [];
    },
  },
};
</script>
<style lang="scss" scoped>
.school-honor-statistic {
  padding:12px;
  overflow: hidden;
  .filter-wrapper {
    position: relative;
    font-size: 0;
    .filter-item {
      display: inline-block;
      font-size: 14px;
      margin-right: 5px;
      margin-bottom: 10px;
    }
    .filter-right {
      position: absolute;
      top: 0;
      right: 0;
    }
  }
  .el-pagination {
    margin-top: 20px;
  }
}
</style>
