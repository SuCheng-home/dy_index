<template>
  <div class="media-coverage-detail">
    <div class="filter-wrapper">
      <el-button @click="$router.back()" size="medium">返回</el-button>
      <el-button type="primary" size="medium" @click="gotoForm">编辑</el-button>
    </div>
    <div class="content-wrapper">
      <div class="ibox article-wrapper" style="width: 810px; margin: 0 auto">
        <div class="ibox-content" style="border-top-width: 0">
          <div class="row">
            <div class="col-lg-12">
              <div class="detail-title">标题</div>
              <div class="detail-value certificate-name">
                {{ reportTitle || "--" }}
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-lg-12">
              <div class="detail-title">媒体名称（类型）</div>
              <div class="detail-value">
                {{ mediaName || "--" }}（{{ mediaType || "--" }}）
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-lg-12">
              <div class="detail-title">报道级别（日期）</div>
              <div class="detail-value">
                {{ reportLevelName || "--" }}（{{ reportDate || "--" }}）
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-lg-12">
              <div class="detail-title">报道内容</div>
              <div class="detail-value">
                <pre v-html="reportContent || '--'"></pre>
              </div>
            </div>
          </div>
          <div class="row" v-if="photoList && photoList.length">
            <div class="col-lg-12">
              <div class="detail-value photo-list">
                <image-previewer
                  class="image-plate"
                  :images="getViewPic(photoList)"
                  tag="img"
                ></image-previewer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import mixin from "@/mixins/windowResize";
import ImagePreviewer from "@/components/ImagePreviewer/ImagePreviewer.vue";
import { getById } from "@/api/teachingStudy/honorManagement/mediaCoverage/detail";

export default {
  name: "mediaCoverageDetail",
  mixins: [mixin],
  components: { ImagePreviewer },
  data() {
    return {
      // 媒体报道id
      id: this.$route.query.id,
      // 媒体报道标题
      reportTitle: "",
      // 媒体类型
      mediaType: "",
      // 媒体名称
      mediaName: "",
      // 报道级别
      reportLevelName: "",
      // 报道日期
      reportDate: "",
      // 报道内容
      reportContent: "",
      // 图片list
      photoList: [],
    };
  },
  created() {
    this.getById();
  },
  methods: {
    // 详情 媒体报道
    getById() {
      getById({
        id: this.id,
      })
        .then((res) => {
          let _res = res.data;
          if (_res.code != 200) return Promise.reject(_res.msg);
          else return _res.data;
        })
        .then((data) => {
          this.reportTitle = data.reportTitle;
          this.mediaType = data.mediaType;
          this.mediaName = data.mediaName;
          this.reportLevelName = data.reportLevelName;
          this.reportDate = data.reportDate;
          this.reportContent = data.reportContent;
          this.photoList = data.photoList;
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
        query: {
          id: this.id,
        },
      });
    },
    getViewPic(photoList) {
      if (photoList) {
        return photoList.map((item) => ({ src: item.fileUrl }));
      }
      return [];
    },
  },
};
</script>
<style lang="scss" scoped>
.media-coverage-detail {
  padding:12px;
  .filter-wrapper {
    border-bottom: 1px solid #e7eaec;
    padding-bottom: 10px;
    margin-bottom: 10px;
  }
  .content-wrapper {
    .article-wrapper {
      width: 80%;
      margin: 0 auto;
      font-size: 15px;
      line-height: 26px;
      color: #676a6c;
      word-wrap: break-word;
      word-break: break-all;
      .detail-title {
        margin: 22px 0 14px 0;
        border-left: 4px solid #409eff;
        padding-left: 12px;
        height: 16px;
        line-height: 16px;
      }
      .detail-value {
        line-height: 38px;
        background-color: #f7fbfd;
        padding: 0 16px;
        color: #777;
        &.photo-list {
          background-color: #fff;
          margin-top: 22px;
          /deep/ img.images {
            width: 100px;
            height: 100px;
            margin-right: 5px;
            margin-bottom: 5px;
          }
        }
        pre {
          margin: 0;
          font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB,
            Microsoft YaHei, Arial, sans-serif;
          white-space: pre-wrap; /* css-3 */
          white-space: -moz-pre-wrap; /* Mozilla, since 1999 */
          white-space: -pre-wrap; /* Opera 4-6 */
          white-space: -o-pre-wrap; /* Opera 7 */
          word-wrap: break-word; /* Internet Explorer 5.5+ */
        }
      }
    }
  }
}
</style>