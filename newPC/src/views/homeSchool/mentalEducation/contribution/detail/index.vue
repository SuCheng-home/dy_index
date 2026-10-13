<template>
  <div class="mental-education-publicity-detail">
    <el-col :span="24">
      <el-button @click="$router.back()" size="medium">返回</el-button>
      <el-button type="primary" size="medium" v-if="state == 1" @click="handleRelease">采用</el-button>
    </el-col>

    <div class="detail-wrapper" :style="{ height: `${maxH - 20}px` }">
      <div class="title">{{ title || "--" }}</div>
      <div class="info-wrapper">
        <div class="info-wrapper-span">
          投稿人：
          <span>{{ createUserName || "--" }}</span>
        </div>
        <div class="info-wrapper-span">
          投稿时间：
          <span>{{ sendTime || "--" }}</span>
        </div>
      </div>

      <div class="content">
        <div class="task-content">{{ noticeContent }}</div>
      </div>
      <div class="row" v-if="fileJson && fileJson.length">
        <h2>附件</h2>
        <div class="row-box">
          <file-list :fileList="fileJson"></file-list>
        </div>
      </div>
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
import {
  getHeartEduDark, updateHeartEduDark
} from "@/api/homeSchool/mentalEducation/contribution/index";
import {
  addHeartEduNotice
} from "@/api/homeSchool/mentalEducation/popularization/form";

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
      darkId: "",
      // 状态 1(未发布) | 2(已发布)
      state: 1,
      // 主题
      title: "",
      // 发布时间
      sendTime: "",
      createUserName: "",
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
    };
  },
  created() {
    this.darkId = this.$route.query.darkId;
    this.getHeartEduDarkEvent();
  },
  methods: {
    isShowByPermission,
    // 根据id查询科普通知
    getHeartEduDarkEvent() {
      getHeartEduDark({
        darkId: this.darkId,
      })
        .then((res) => {
          let _res = res.data;
          if (_res.code != 200) return Promise.reject(_res.msg);
          else return _res.data;
        })
        .then((data) => {
          this.state = data.state;
          this.title = data.title;
          this.sendTime = data.createTime;
          this.createUserName = data.createUserName;
          this.noticeContent = data.content;
          this.fileJson = JSON.parse(data.fileJson || "[]");
          this.commeCount = data.commeCount;
          this.raiseCount = data.raiseCount;
        })
        .catch((msg) => {
          this.$message({
            message: msg,
            type: "error",
          });
        });
    },
    // 点击*采用*
    handleRelease() {
      this.$confirm("确认要采纳吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        lockScroll: false,
      })
        .then(() => {
          updateHeartEduDark({
            id: this.darkId,
            state: 2,
          })
            .then((res) => {
              let _res = res.data;
              if (_res.code != 200) return Promise.reject(_res.msg);
              else return _res.data;
            })
            .then((data) => {
              this.$message({
                message: "采纳成功",
                type: "success",
              });
              this.kequEvent()
            })
            .catch((msg) => {
              this.$message({
                message: msg,
                type: "error",
              });
            });
        })
        .catch(() => { });
    },
    // 采纳后 新增科普通知列表
    kequEvent() {
      let form = {
        state: 1,
        title: this.title,
        logoUrl: '',
        fileJson: JSON.stringify(this.fileJson),
        content: this.noticeContent,
      };

      addHeartEduNotice(form)
        .then((res) => {
          let _res = res.data;
          if (_res.code != 200) return Promise.reject(_res.msg);
          else return _res.data;
        })
        .then((data) => { 
          this.$router.push({
            path: "/main/homeSchool/mentalEducation/publicity/detail",
            query: {
              noticeId: data,
            },
          });
        })
        .catch((msg) => {
          console.log(msg);
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
      display: flex;
      text-align: center;
      color: #606266;
      align-items: center;
      justify-content: center;
      gap: 60px;
      margin-bottom: 20px;

      .info-wrapper-span {
        display: inline-block;

        &.star-name {
          margin-right: 20px;
        }
      }
    }

    .content {
      padding-bottom: 15px;
      width: 100%;

      .task-content {
        width: 100%;
        word-wrap: break-word;
        word-break: break-all;
      }

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
