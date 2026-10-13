<template>
  <div class="teacher-honor-statistic-detail">
    <div class="filter-wrapper">
      <el-button @click="$router.back()" size="medium">返回</el-button>
    </div>
    <div class="content-wrapper">
      <div class="ibox article-wrapper" style="width: 810px; margin: 0 auto">
        <div class="ibox-content" style="border-top-width: 0">
          <div class="row">
            <div class="col-lg-12">
              <div class="detail-title">证书名称</div>
              <div class="detail-value certificate-name">
                <span class="text">{{ certName || "--" }}</span>
                <p class="tag-wrapper">
                  <el-tag size="small">{{ certTypeName }}</el-tag>
                  <el-tag size="small">{{ certLevelName }}</el-tag>
                  <el-tag size="small">{{ certAwardLLevelName }}</el-tag>
                </p>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-lg-12">
              <div class="detail-title">颁发机构（日期）</div>
              <div class="detail-value">
                {{ issueOrganizationName || "--" }}（{{ issueDate || "--" }}）
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-lg-12">
              <div class="detail-title">权重</div>
              <div class="detail-value">{{ weights || "" }}</div>
            </div>
          </div>
          <div class="row">
            <div class="col-lg-12">
              <div class="detail-title">内容</div>
              <div class="detail-value">
                <pre v-html="content || '--'"></pre>
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
import { getById } from "@/api/teachingStudy/honorManagement/teacherHonorStatistic/detail";

export default {
  name: "teacherHonorStatisticDetail",
  mixins: [mixin],
  components: { ImagePreviewer },
  data() {
    return {
      // 荣誉id
      id: this.$route.query.id,
      // 证书名称
      certName: "",
      certTypeName: "",
      certLevelName: "",
      certAwardLLevelName: "",
      // 颁发机构
      issueOrganizationName: "",
      // 颁发日期
      issueDate: "",
      // 权重
      weights: "",
      // 内容
      content: "",
      // 图片list
      photoList: [],
    };
  },
  created() {
    this.getById();
  },
  methods: {
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
          this.certName = data.certName;
          this.certTypeName = data.certTypeName;
          this.certLevelName = data.certLevelName;
          this.certAwardLLevelName = data.certAwardLLevelName;
          this.issueOrganizationName = data.issueOrganizationName;
          this.issueDate = data.issueDate;
          this.weights = data.weights;
          this.content = data.content;
          this.photoList = data.photoList;
        })
        .catch((msg) => {
          this.$message({
            message: msg,
            type: "error",
          });
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
.teacher-honor-statistic-detail {
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
        &.certificate-name {
          display: flex;
          align-items: center;
          .text {
            flex: 1;
          }
          .tag-wrapper {
            flex: 0 0 250px;
            width: 250px;
            font-size: 0;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            flex-wrap: wrap;
            .el-tag {
              font-size: 12px;
              margin-left: 5px;
            }
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