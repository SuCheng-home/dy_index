<template>
  <div class="mental-education-publicity-read">
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
          placeholder="请输入姓名"
          clearable
          v-model.trim="form.userName"
          @change="handleUserName"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="handleUserName"
          ></el-button>
        </el-input>
      </el-col>
    </el-row>

    <div
      class="read-box el-table__body-wrapper"
      :style="{ height: maxH - 15 + 'px' }"
    >
      <div class="no_list_msg" v-if="isEmpty">
        <img
          src="https://cdnfile-10043692.file.myqcloud.com/class_brand/gridClasscard/nodata/elastic-nodata2.png"
          alt
        />
        <div>暂无数据</div>
      </div>
      <template v-for="(item, idx) in tabList" v-else>
        <div class="read-box-item" :key="idx">
          <div
            class="read-box-item-header"
            :style="{ backgroundImage: 'url(' + item.avatar + ')' }"
          ></div>
          <div class="read-box-item-footor">
            <div class="name">{{ item.userName || "--" }}</div>
            <template>
              <div class="time">{{ item.readTime | filterDate }}</div>
            </template>
          </div>
        </div>
      </template>
    </div>

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

/* components */

/* api */
import { getHeartEduNoticeReadUserList } from "@/api/homeSchool/mentalEducation/popularization/read";

export default {
  name: "mentalEducationPopularizationRead",
  mixins: [mixin],
  components: {},
  computed: {},
  filters: {
    filterDate(val) {
      return val ? moment(val).format("YYYY-MM-DD HH:mm:ss") : "--";
    },
  },
  data() {
    return {
      // 暂无数据
      isEmpty: false,
      // 通知id
      noticeId: this.$route.query.noticeId,
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
        userName: "",
      },
    };
  },
  created() {
    this.getHeartEduNoticeReadUserList();
  },
  methods: {
    // 根据标题，学校id查询科普通知列表
    getHeartEduNoticeReadUserList() {
      getHeartEduNoticeReadUserList({
        noticeId: this.noticeId,
        userName: this.form.userName,
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
          this.isEmpty = this.tabList.length == 0;
        })
        .catch((msg) => {
          this.$message({
            message: msg,
            type: "error",
          });
        });
    },
    // 检索条件 改变
    filterSearch() {
      this.pagination.pageNo = 1;
      this.getHeartEduNoticeReadUserList();
    },
    // 主题改变
    handleUserName() {
      this.filterSearch();
    },
    // 分页 - pageSize 改变
    handleSizeChange(pageSize) {
      this.pagination.pageSize = pageSize;
      this.getHeartEduNoticeReadUserList();
    },
    // 分页 - currentPage 改变
    handleCurrentChange(pageNo) {
      this.pagination.pageNo = pageNo;
      this.getHeartEduNoticeReadUserList();
    },
  },
};
</script>
<style lang="scss" scoped>
.mental-education-publicity-read {
  padding:12px;

  .read-box {
    overflow-y: auto !important;
    .read-box-item {
      width: 80px;
      height: 120px;
      float: left;
      margin: 10px 0 0 20px;
      .read-box-item-header {
        width: 60px;
        height: 60px;
        background-position: center center;
        background-size: cover;
        border-radius: 50%;
        margin: 0 auto;
      }
      .read-box-item-footor {
        text-align: center;
        padding-top: 4px;
        .name {
          font-size: 14px;
          text-align: center;
        }
        .time {
          font-size: 12px;
          color: #6c6c6c;
        }
      }
    }
  }
  .no_list_msg {
    font-size: 14px;
    text-align: center;
    color: #999;
    overflow: hidden;
    img {
      margin-top: 50px;
    }
    div {
      margin-top: -50px;
    }
  }
}
</style>
