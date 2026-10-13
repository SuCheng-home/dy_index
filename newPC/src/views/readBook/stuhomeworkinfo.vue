
<template>
  <div class="mental-education-publicity-detail">
    <el-col :span="24">
      <el-button @click="$router.back()" size="medium">返回</el-button>
      <el-button
        type="primary"
        size="medium"
        @click="stuhomeworkadd()"
        >编辑</el-button>
    </el-col>

    <div class="detail-wrapper" :style="{ height: `${nobottommaxH}px` }">
      <div class="title">{{ title || "--" }}</div>
      <div class="info-wrapper">
        学生名单：
        <span v-for="(item, index) in stuJson" :key="index">
            {{item.name}}&nbsp;
        </span>
      </div>
      <div class="content">
        <image-previewer tag="richtext">
          <div class="task-content" v-html="content"></div>
        </image-previewer>
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
import mixin from "@/mixins/windowResize";
import ImagePreviewer from "@/components/ImagePreviewer/ImagePreviewer.vue";
import FileList from "@/components/FileList/FileList.vue";
import {getLanguageBookHomeworkStu} from '@/api/stackRoom';
export default {
  mixins: [mixin],
  components: { ImagePreviewer, FileList },
  data() {
    return {
      // 通知id
      homeworkStuId: "",
      // 状态 1(未发布) | 2(已发布)
      state: 1,
      // 主题
      title: "",
      // 发布时间
      sendTime: "",
      fileJson: [],
      // 富文本编辑器内容
      content: "",
      // 评论数
      commeCount: 0,
      // 点赞数
      raiseCount: 0,
      stuJson:[]
    };
  },
  created() {
    this.homeworkStuId = this.$route.query.homeworkStuId;
    this.getLanguageBookHomeworkStu();
  },
  methods: {
    getLanguageBookHomeworkStu() {
      getLanguageBookHomeworkStu(this.homeworkStuId)
        .then((res) => {
          let _res = res.data;
          if (_res.code != 200) return Promise.reject(_res.msg);
          else return _res.data;
        })
        .then((data) => {
          this.state = data.state;
          this.title = data.title;
          this.content = data.content;
          this.fileJson = JSON.parse(data.fileJson || "[]");
          this.stuJson = JSON.parse(data.stuJson);
        })
        .catch((msg) => {
          this.$message({
            message: msg,
            type: "error",
          });
        });
    },
    // 编辑
    stuhomeworkadd() {
      this.$router.push({
        path: "stuhomeworkadd",
        query:this.$route.query,
      });
    }
  },
};
</script>
<style lang="scss" scoped>
.mental-education-publicity-detail {
  padding:12px;

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

      .row-box {
      }
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
