<template>
  <div class="er-tong-yan-jiu-ting-ke-evaluate-detail">
    <el-row>
      <el-col :span="24">
        <el-button @click="$router.back()" size="medium">返回</el-button>
        <a :href="exportUrl"  v-if="tabList.length" target="_blank" download="examName">
          <el-button type="primary" size="medium">导出</el-button>
        </a>
        <el-button
          type="primary"
          size="medium"
          v-if="releaseState == 1"
          @click="handleRemind"
          >提醒未评价人员</el-button
        >
      </el-col>
    </el-row>

    <el-table
      border
      fit
      stripe
      highlight-current-row
      style="width: 100%"
      ref="table"
      :height="nobottommaxH - 10"
      :data="tabList"
      v-loading.body="tabLoading"
      v-if="!tabLoading"
    >
      <el-table-column align="center" label="听课人" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.userName }}</template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="appraise.typeName"
        show-overflow-tooltip
        :key="idx"
        v-for="(appraise, idx) in appraiseJson"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.appraiseState == 0"></span>
          <span v-else>
            <span v-if="scope.row.appraiseList[idx].typeLevel == 1">A</span>
            <span v-if="scope.row.appraiseList[idx].typeLevel == 2">B</span>
            <span v-if="scope.row.appraiseList[idx].typeLevel == 3">C</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="等第" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="scope.row.appraiseLevel == 1">优</span>
          <span v-else-if="scope.row.appraiseLevel == 2">良</span>
          <span v-else-if="scope.row.appraiseLevel == 3">及格</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="改进建议" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.appraiseContent }}</template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button
            size="small"
            type="text"
            :class="{ 'delete-btn': scope.row.appraiseState == 1 }"
            :disabled="scope.row.appraiseState == 0"
            @click="handleDelete(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
/* utils */
import mixin from "@/mixins/windowResize";
import { mapGetters } from "vuex";

/* components */

/* api */
import {
  getStudySubjectAppraiseDetails,
  remindAppraise,
  deleteUserAppraise,
} from "@/api/teachingStudy/erTongYanJiuTingKe";

export default {
  name: "erTongYanJiuTingKeDetail",
  mixins: [mixin],
  components: {},
  filters: {},
  watch: {},
  computed: {
    ...mapGetters(["userInfo"]),
    isShowHandleBtn() {
      if (this.isComplaint == 1) {
        return true;
      } else {
        if (
          this.state == 1 &&
          this.batchUserIdList.includes(this.userInfo.id)
        ) {
          return true;
        } else {
          return false;
        }
      }
    },
  },
  data() {
    return {
      // 研究课听课id
      studySubjectId: this.$route.query.studySubjectId,
      exportUrl: "",
      releaseState: 0,
      // 是否正在加载数据 { Boolean }
      tabLoading: false,
      // 表格数据 { Array }
      tabList: [],
      // 评价项
      appraiseJson: [],
      // 请求表单
      form: {},
    };
  },
  created() {
    this.getStudySubjectAppraiseDetails();
  },
  methods: {
    // 获取研究听课评价分析
    getStudySubjectAppraiseDetails() {
      this.tabLoading = true;
      getStudySubjectAppraiseDetails({
        studySubjectId: this.studySubjectId,
      })
        .then((res) => {
          let _res = res.data;
          if (_res.code != 200) return Promise.reject(_res.msg);
          else return _res.data;
        })
        .then((data) => {
          if (data) {
            this.releaseState = data.releaseState;
            let temp = [];
            let appraiseJson = JSON.parse(data.appraiseJson || "[]");
            appraiseJson.forEach((appraise) => {
              temp = temp.concat(appraise.itemList.map((item) => item));
            });
            this.appraiseJson = temp;
            let listenTeacherAppraiseList = data.listenTeacherAppraiseList;
            if (
              Array.isArray(listenTeacherAppraiseList) &&
              listenTeacherAppraiseList.length
            )
              this.tabList = [...listenTeacherAppraiseList];
            // 导出 url
            this.exportUrl = `${global.BasePath}structure/studySubject/downStudySubjectAppraiseDetails?studySubjectId=${this.studySubjectId}&token=${this.$store.getters.token}`;
          }
          this.tabLoading = false;
        });
    },

    remindAppraise(form) {
      remindAppraise(form)
        .then((res) => {
          let _res = res.data;
          if (_res.code != 200) return Promise.reject(_res.msg);
          else return _res.data;
        })
        .then((data) => {
          this.$message({
            message: "提醒成功",
            type: "success",
          });
        })
        .catch((msg) => {
          this.$message({
            message: msg,
            type: "error",
          });
        });
    },

    // 删除研究课听课
    deleteUserAppraise(form) {
      deleteUserAppraise(form)
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
          this.getStudySubjectAppraiseDetails();
        })
        .catch((msg) => {
          this.$message({
            message: msg,
            type: "error",
          });
        });
    },

    // 提醒
    handleRemind() {
      this.$confirm("确认提醒未评价人员吗？", "删除", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        lockScroll: false,
      })
        .then(() => {
          let form = {
            studySubjectId: this.studySubjectId,
          };
          this.remindAppraise(form);
        })
        .catch(() => {});
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
            studySubjectId: this.studySubjectId,
            userId: item.userId,
          };
          this.deleteUserAppraise(form);
        })
        .catch(() => {});
    },
  },
};
</script>
<style lang="scss" scoped>
.er-tong-yan-jiu-ting-ke-evaluate-detail {
  padding:12px;

  .el-col {
    border-bottom: 1px solid #e7eaec;
    padding-bottom: 10px;
    margin-bottom: 10px;
  }

  .el-table__body-wrapper {
    .delete-btn {
      color: #f56c6c;
    }
  }
}
</style>