<!--通知的详情-->
<template>
  <div class="mental-education-publicity-detail">
    <el-col :span="24">
      <el-button @click="$router.back()" size="medium">返回</el-button>
      <el-button type="primary" size="medium" v-if="isShowByPermission('/heartEdu/mangerInit')"
        @click="gotoForm">编辑</el-button>
      <el-button type="primary" size="medium" v-if="isShowByPermission('/heartEdu/mangerInit') && state == 1"
        @click="handleRelease">发布</el-button>
    </el-col>

    <div class="detail-wrapper" :style="{ height: `${maxH - 20}px` }">
      <div class="title">{{ title || "--" }}</div>
      <div class="info-wrapper">
        发布时间：
        <span>{{ sendTime | filterDate }}</span>
      </div>
      <div class="content">
        <image-previewer tag="richtext">
          <div class="task-content" v-html="noticeContent"></div>
        </image-previewer>
      </div>
      <div class="row" v-if="fileJson && fileJson.length">
        <h2>附件</h2>
        <div class="row-box">
          <file-list :fileList="fileJson"></file-list>
        </div>
      </div>
    </div>
    <div class="bottom" v-if="state == 2">
      <span class="comment" @click="viewEvent">
        <img src="https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/electiveCourse/eye2.png" alt />
        <span>{{ readCountSt || 0 }}/{{ readCountNotSt || 0 }}</span>
      </span>
      <span class="comment" @click="gotoComment">
        <img src="https://cdnfile-10043692.file.myqcloud.com/admin/images/mentalDducation/pinglun.png" alt />
        <span>{{ commeCount || 0 }}</span>
      </span>
      <span class="like" @click="gotoRaise">
        <img src="https://cdnfile-10043692.file.myqcloud.com/admin/images/mentalDducation/dianzan.png" alt />
        <span>{{ raiseCount || 0 }}</span>
      </span>
    </div>
  </div>
</template>
<script>
/* utils */
import mixin from "@/mixins/windowResize";
import { isShowByPermission } from "@/utils";

/* components */
import ImagePreviewer from "@/components/ImagePreviewer/ImagePreviewer.vue";
import FileList from "@/components/FileList/FileList.vue";

/* api */
import { getHeartEduNoticeById } from "@/api/homeSchool/mentalEducation/popularization/detail";
import { sendHeartEduNotice } from "@/api/homeSchool/mentalEducation/popularization/detail";

export default {
  mixins: [mixin],
  components: { ImagePreviewer, FileList },
  computed: {},
  filters: {
    filterDate(val) {
      return val ? moment(val).format("YYYY-MM-DD HH:mm:ss") : "--";
    },
  },
  data() {
    return {
      // 通知id
      noticeId: "",
      // 状态 1(未发布) | 2(已发布)
      state: 1,
      // 主题
      title: "",
      // 发布时间
      sendTime: "",
      /* 上传文件列表
            {
                fileName: '',
                fileUrl: '',
                id: ''
            }
        */
      fileJson: [],
      // 富文本编辑器内容
      noticeContent: "",
      // 评论数
      commeCount: 0,
      // 点赞数
      raiseCount: 0,
      // 已读学生数
      readCountSt: 0,
      // 未读学生数
      readCountNotSt: 0,
      schoolTimeId: "",
    };
  },
  created() {
    this.noticeId = this.$route.query.noticeId;
    this.getHeartEduNoticeById();
  },
  methods: {
    isShowByPermission,
    // 根据id查询科普通知
    getHeartEduNoticeById() {
      getHeartEduNoticeById({
        noticeId: this.noticeId,
      })
        .then((res) => {
          let _res = res.data;
          if (_res.code != 200) return Promise.reject(_res.msg);
          else return _res.data;
        })
        .then((data) => {
          console.log(123, data);

          this.state = data.state;
          this.title = data.title;
          this.sendTime = data.sendTime;
          this.noticeContent = data.content;
          this.fileJson = JSON.parse(data.fileJson || "[]");
          this.commeCount = data.commeCount;
          this.raiseCount = data.raiseCount;
          this.readCountSt = data.readCountSt;
          this.readCountNotSt = data.readCountNotSt;
          this.schoolTimeId = data.schoolTimeId;
        })
        .catch((msg) => {
          this.$message({
            message: msg,
            type: "error",
          });
        });
    },

    // 点击*发布*
    handleRelease() {
      this.$confirm("确认要发布吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        lockScroll: false,
      })
        .then(() => {
          let form = {
            id: this.noticeId,
          };
          this.sendHeartEduNotice(form);
        })
        .catch(() => { });
    },
    // 发布心育科普通知
    sendHeartEduNotice(form) {
      sendHeartEduNotice(form)
        .then((res) => {
          let _res = res.data;
          if (_res.code != 200) return Promise.reject(_res.msg);
          else return _res.data;
        })
        .then((data) => {
          this.$message({
            message: "发布成功",
            type: "success",
          });
          this.$router.back();
        })
        .catch((msg) => {
          this.$message({
            message: msg,
            type: "error",
          });
        });
    },
    // 编辑
    gotoForm() {
      this.$router.push({
        path: "form",
        query: { noticeId: this.noticeId },
      });
    },
    // 评论列表
    gotoComment(item) {
      if (!this.commeCount) return;
      this.$router.push({
        path: "comment",
        query: {
          noticeId: this.noticeId,
        },
      });
    },
    // 点赞
    gotoRaise(item) {
      if (!this.raiseCount) return;
      this.$router.push({
        path: "raise",
        query: {
          noticeId: this.noticeId,
        },
      });
    },
    // 查看详情
    viewEvent(item) {
      if (!this.readCountSt && !this.readCountNotSt) return;
      this.$router.push({
        path: "view",
        query: {
          noticeId: this.noticeId,
          schoolTimeId: this.schoolTimeId,
        },
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.mental-education-publicity-detail {
  padding: 12px;

  .el-col {
    border-bottom: 1px solid #e7eaec;
    padding-bottom: 10px;
    margin-bottom: 10px;
  }

  .detail-wrapper {
    width: 810px;
    overflow: auto;
    box-sizing: border-box;
    padding-top: 20px;
    padding-bottom: 20px;
    margin: 0 auto;

    .title {
      line-height: 1.2em;
      font-size: 26px;
      text-align: center;
      color: rgb(47, 64, 80);
      margin: 20px 0 20px;
    }

    .info-wrapper {
      text-align: center;
      color: #606266;

      span {
        display: inline-block;

        &.star-name {
          margin-right: 20px;
        }
      }
    }

    .content {
      padding-bottom: 15px;

      /deep/ p {
        word-wrap: break-word;
        word-break: break-all;
      }

      /deep/ ol {
        list-style: decimal outside none;

        li {
          list-style: decimal outside none;
        }
      }

      /deep/ ul {
        list-style: disc outside none;

        li {
          list-style: disc outside none;
        }
      }

      /deep/ img {
        display: block;
        max-width: 100%;
        width: auto;
        height: auto;
      }

      /deep/ table {
        border-collapse: collapse;

        td,
        th {
          padding: 5px 10px;
          border: 1px solid #ddd;
          box-sizing: content-box;
        }
      }
    }

    .row {
      margin-top: 15px;

      .row-box {}
    }
  }

  .bottom {
    width: 810px;
    margin: 20px auto 0;

    img {
      width: 20px;
      vertical-align: middle;
      margin-right: 10px;
    }

    span {
      vertical-align: middle;
      color: #606266;
      cursor: pointer;
    }

    .comment {
      margin-right: 50px;
    }
  }
}
</style>
