<template>
  <div class="mental-education-consulting-addressBook">
    <el-row
      style="
        border-bottom: 1px solid #e7eaec;
        padding-bottom: 10px;
        margin-bottom: 10px;
      "
    >
      <el-col :span="19">
        <el-button @click="$router.back()" size="medium">返回</el-button>
      </el-col>
      <el-col :span="5">
        <el-input
          class="search-input"
          icon="el-icon-search"
          size="medium"
          placeholder="请输入学生姓名"
          clearable
          v-model.trim="form.searchVal"
          @change="handleTitle"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="handleTitle"
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
      :height="maxH - 15 - 10"
      :data="tabList"
      v-loading.body="tabLoading"
    >
      <el-table-column align="center" label="学号" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.learnNum || "--" }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="姓名" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.name || "--" }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="班级" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.className || "--" }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button size="small" type="text" @click="handleParent(scope.row)"
            >查看家长联系方式</el-button
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

    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="45%">
      <el-table
        border
        fit
        stripe
        highlight-current-row
        style="width: 100%"
        height="300"
        :data="dialogTabList"
        v-loading.body="dialogTabLoading"
      >
        <el-table-column align="center" label="姓名" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.nick || "--" }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="性别" show-overflow-tooltip>
          <template slot-scope="scope">
            <i
              class="el-icon-male"
              style="color: #409eff"
              v-if="scope.row.gender == 1"
            ></i>
            <i class="el-icon-female" style="color: #f56c6c" v-else></i>
          </template>
        </el-table-column>
        <el-table-column align="center" label="手机号" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.mobile || "--" }}
          </template>
        </el-table-column>
      </el-table>
      <!-- 
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </span> -->
    </el-dialog>
  </div>
</template>

<script>
/* utils */
import mixin from "@/mixins/windowResize";

/* components */

/* api */
import {
  getAllStudentBySchoolId,
  queryParent,
} from "@/api/homeSchool/mentalEducation/consulting/addressBook";

export default {
  name: "mentalEducationPopularizationComment",
  mixins: [mixin],
  components: {},
  computed: {},
  filters: {
    filterGender(gender) {
      return gender == 2 ? "女" : "男";
    },
    filterDate(val) {
      return val ? moment(val).format("YYYY-MM-DD HH:mm:ss") : "--";
    },
  },
  data() {
    return {
      // dialog title
      dialogTitle: "",
      //  模态框 是否显示
      dialogVisible: false,
      dialogTabLoading: false,
      dialogTabList: [],
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
        searchVal: "",
      },
    };
  },
  created() {
    this.getAllStudentBySchoolId();
  },
  methods: {
    // 根据通知id,用户姓名查询回复列表
    getAllStudentBySchoolId() {
      getAllStudentBySchoolId({
        isFilterNewClass: true,
        searchVal: this.form.searchVal,
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
        });
    },
    // 根据学生查家长
    queryParent(item) {
      this.dialogTabLoading = true;
      queryParent({
        childId: item.id,
      })
        .then((res) => {
          this.dialogTabLoading = false;
          let _res = res.data;
          if (_res.code != 200) return Promise.reject(_res.msg);
          else return _res.data;
        })
        .then((data) => {
          this.dialogTabList = [...data];
        });
    },
    // 查看家长联系方式
    handleParent(item) {
      this.dialogTitle = `${item.name}家长联系方式`;
      this.dialogVisible = true;
      this.queryParent(item);
    },

    // 检索条件 改变
    filterSearch() {
      this.pagination.pageNo = 1;
      this.getAllStudentBySchoolId();
    },
    // 检索主题改变
    handleTitle() {
      this.filterSearch();
    },
    // 分页 - pageSize 改变
    handleSizeChange(pageSize) {
      this.pagination.pageSize = pageSize;
      this.getAllStudentBySchoolId();
    },
    // 分页 - currentPage 改变
    handleCurrentChange(pageNo) {
      this.pagination.pageNo = pageNo;
      this.getAllStudentBySchoolId();
    },
  },
};
</script>
<style lang="scss" scoped>
.mental-education-consulting-addressBook {
  padding:12px;
  .el-table__body-wrapper {
    .delete-btn {
      color: #f56c6c;
    }
  }
}
</style>
