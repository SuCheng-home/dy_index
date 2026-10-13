<template>
  <div class="mental-education-consulting-index">
    <el-row>
      <el-col :span="24">
        <el-button
          type="primary"
          size="medium"
          style="margin-bottom: 15px"
          v-if="isMangerInit"
          @click="gotoTypeSettings"
          >分类设置</el-button
        >
        <el-button
          type="primary"
          size="medium"
          style="margin-bottom: 15px"
          v-if="isMangerInit"
          @click="gotoOtherSettings"
          >其他设置</el-button
        >
        <el-button
          type="primary"
          size="medium"
          style="margin-bottom: 15px"
          v-if="isMangerInit"
          @click="gotoDataStatistics"
          >数据统计</el-button
        >
        <el-button
          type="primary"
          size="medium"
          style="margin-bottom: 15px"
          v-if="isMangerInit || isParentCommunte"
          @click="gotoAddressBook"
          >家长通讯录</el-button
        >
      </el-col>
    </el-row>
    <el-row style="padding-bottom: 10px">
      <el-col :span="19">
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

        <el-select
          class="el-select-short"
          size="medium"
          placeholder="请选择"
          v-model="form.searchType"
          @change="handleSearchType"
        >
          <el-option label="全部类型" :value="0"></el-option>
          <el-option
            v-for="(item, idx) in searchTypeList"
            :key="idx"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>

        <el-select
          size="medium"
          placeholder="请选择"
          v-show="form.searchType != 3 && (isMangerInit || isParentCommunte)"
          v-model="form.groupId"
          @change="filterSearch"
        >
          <el-option label="全部状态" :value="0" v-show="isMangerInit"></el-option>
          <el-option
            v-for="(item, idx) in groupList"
            :key="idx"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>

        <el-select
          class="el-select-short"
          size="medium"
          placeholder="请选择"
          v-model="form.state"
          @change="filterSearch"
        >
          <el-option label="全部状态" :value="0"></el-option>
          <el-option
            v-for="(item, idx) in stateList"
            :key="idx"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <a :href="exportUrl" v-if="tabList.length" target="_blank" download="examName">
          <el-button type="primary" size="medium">导出</el-button>
        </a>
      </el-col>
      <el-col :span="5">
        <el-input
          class="search-input"
          icon="el-icon-search"
          size="medium"
          placeholder="请输入咨询内容"
          clearable
          v-model.trim="form.content"
          @change="handleContent"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="handleContent"
          ></el-button>
        </el-input>
      </el-col>
    </el-row>

    <el-table
      border
      fit
      stripe
      highlight-current-row
      style="width: 100%"
      :height="nobottommaxH - 80"
      :data="tabList"
      v-loading.body="tabLoading"
    >
      <el-table-column align="center" label="咨询内容" show-overflow-tooltip>
        <template slot-scope="scope">
          <span class="link-type" @click="gotoDetail(scope.row)">
            {{ scope.row.content | filterContent }}
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="家长身份" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.nick || "--" }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="问题类别" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.groupName || "--" }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="咨询时间" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.updateTime | filterDate }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-tag  size="mini" type="warning"  v-if="scope.row.state == 1"
            >待回复</el-tag
          >
          <el-tag  size="mini" type="success"  v-if="scope.row.state == 2"
            >已回复</el-tag
          >
          <el-rate
            disabled
            v-if="scope.row.state == 4"
            v-model="scope.row.score"
          ></el-rate>
        </template>
      </el-table-column>
      <el-table-column align="center" label="回复人" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="scope.row.state == 1"> -- </span>
          <span v-else>{{ scope.row.userName || "--" }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" v-if="isMangerInit">
        <template slot-scope="scope">
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
      style="margin-top: 20px"
      layout="total, sizes, prev, pager, next, jumper"
      :current-page.sync="pagination.pageNo"
      :page-size="pagination.pageSize"
      :page-sizes="pagination.pageSizes"
      :total="pagination.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    ></el-pagination>
  </div>
</template>

<script>
/* utils */
import mixin from "@/mixins/windowResize";
import { mapGetters } from "vuex";
import { isShowByPermission } from "@/utils";

/* components */

/* api */
import {
  getHeartEduConsultListByDateScope,
  getHeartEduGroupList,
  getCurrentSchoolTimeBySchoolId,
  delHeartEduConsultById,
} from "@/api/homeSchool/mentalEducation/consulting/index";

export default {
  name: "mentalEducationConsultingIndex",
  mixins: [mixin],
  components: {},
  computed: {
    ...mapGetters(["userInfo"]),
    // 是否是心育之窗管理员
    isMangerInit() {
      return isShowByPermission("/heartEdu/mangerInit");
    },
    // 是否是分类管理员
    isParentCommunte() {
      return isShowByPermission("/heartEdu/parentCommunte");
    },
  },
  filters: {
    filterDate(val) {
      return val ? moment(val).format("YYYY-MM-DD HH:mm:ss") : "--";
    },
    filterContent(val) {
      let maxLen = 100;
      if (val) {
        if (val.length > maxLen) {
          let temp = val.split("");
          temp.splice(maxLen, temp.length - maxLen, "...");
          return temp.join("");
        }
        return val;
      }
      return "--";
    },
  },
  data() {
    return {
      // 分类列表
      groupList: [],
      // 状态筛选列表
      stateList: [
        { label: "待回复", value: 1 },
        { label: "已回复", value: 2 },
        { label: "已评价", value: 4 },
      ],
      searchTypeList: [
        { label: "我回复的", value: 2 },
        { label: "转办给我的", value: 3 },
      ],
      // 是否正在加载数据 { Boolean }
      tabLoading: false,
      // 表格数据 { Array }
      tabList: [],
      // 分页
      pagination: {
        pageNo: 1,
        pageSize: 20,
        pageSizes: [10, 20, 30, 50],
        total: 0,
      },
      // 请求表单
      form: {
        daterange: [],
        groupId: 0,
        state: 0,
        searchType: 0,
        content: "",
      },
    };
  },
  created() {
    this.getCurrentSchoolTimeBySchoolId();
  },
  methods: {
    isShowByPermission,
    getCurrentSchoolTimeBySchoolId() {
      getCurrentSchoolTimeBySchoolId()
        .then((res) => {
          let _res = res.data;
          if (_res.code != 200) return Promise.reject(_res.msg);
          else return _res.data;
        })
        .then((data) => {
          if (data) {
            this.form.daterange = [
              this.$moment(data.startDate).format("YYYY-MM-DD"),
              this.$moment().format("YYYY-MM-DD"),
            ];
            this.getHeartEduGroupList();
          }
        });
    },
    getHeartEduGroupList() {
      getHeartEduGroupList()
        .then((res) => {
          let _res = res.data;
          if (_res.code != 200) return Promise.reject(_res.msg);
          else return _res.data;
        })
        .then((data) => {
          if (data) {
            if (this.isMangerInit) {
              this.groupList = [...data];
              this.form.groupId = 0;
            } else if (this.isParentCommunte) {
              let temp = [];
              data.forEach((item) => {
                let mangerUserJson = JSON.parse(item.mangerUserJson || "[]");
                mangerUserJson.forEach((manger) => {
                  if (manger.id == this.userInfo.id) temp.push(item);
                });
              });
              this.groupList = temp;
              this.form.groupId = this.groupList[0].id;
            }
            this.getHeartEduConsultListByDateScope();
          }
        });
    },
    // 根据标题，学校id查询科普通知列表
    getHeartEduConsultListByDateScope() {
      let startDate = this.form.daterange ? this.form.daterange[0] : "";
      let endDate = this.form.daterange ? this.form.daterange[1] : "";
      getHeartEduConsultListByDateScope({
        content: this.form.content,
        state: this.form.state,
        groupId: this.form.searchType != 3 ? this.form.groupId : 0,
        searchType: this.form.searchType,
        startDate,
        endDate,
        pageNo: this.pagination.pageNo,
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

          this.exportUrl = `${global.BasePath}structure/heartEdu/exportHeartEduConsultListByDateScope?content=${this.form.content}&state=${this.form.state}&groupId=${this.form.groupId}&searchType=${this.form.searchType}&startDate=${startDate}&endDate=${endDate}&token=${this.$store.getters.token}`;
        });
    },
    // 检索条件 改变
    filterSearch() {
      this.pagination.pageNo = 1;
      this.getHeartEduConsultListByDateScope();
    },
    // 主题改变
    handleContent() {
      this.filterSearch();
    },
    // searchType改变
    handleSearchType(val) {
      this.filterSearch();
    },
    // 日期范围改变
    handleDateRange() {
      this.filterSearch();
    },
    // 分页 - pageSize 改变
    handleSizeChange(pageSize) {
      this.pagination.pageSize = pageSize;
      this.getHeartEduConsultListByDateScope();
    },
    // 分页 - currentPage 改变
    handleCurrentChange(pageNo) {
      this.pagination.pageNo = pageNo;
      this.getHeartEduConsultListByDateScope();
    },
    // 点击*删除*
    handleDelete(item) {
      this.$confirm("确认要删除吗？", "删除", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "error",
        lockScroll: false,
      })
        .then(() => {
          let form = {
            consultId: item.id,
          };
          this.delHeartEduConsultById(form);
        })
        .catch(() => {});
    },
    // 根据咨询id删除咨询
    delHeartEduConsultById(form) {
      delHeartEduConsultById(form)
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
          this.getHeartEduConsultListByDateScope();
        })
        .catch((msg) => {
          this.$message({
            message: msg,
            type: "error",
          });
        });
    },
    // 详情页
    gotoDetail(item) {
      this.$router.push({
        path: "consulting/detail/index",
        query: {
          consultId: item.id,
        },
      });
    },
    // 分类设置
    gotoTypeSettings() {
      this.$router.push({
        path: "consulting/typeSettings/index",
      });
    },
    // 其他设置
    gotoOtherSettings() {
      this.$router.push({
        path: "consulting/otherSettings/form",
      });
    },
    // 数据统计
    gotoDataStatistics() {
      this.$router.push({
        path: "consulting/dataStatistics/index",
        query: {
          startDate: this.form.daterange[0],
          endDate: this.form.daterange[1],
        },
      });
    },
    // 家长通讯录
    gotoAddressBook() {
      this.$router.push({
        path: "consulting/addressBook/index",
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.mental-education-consulting-index {
  .el-date-editor {
    width: 220px;
  }
  .el-select {
    width: 180px;
  }
  .el-select-short {
    width: 120px;
  }
  .el-table__body-wrapper {
    .delete-btn {
      color: #f56c6c;
    }
  }
}
</style>
