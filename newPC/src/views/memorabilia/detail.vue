 <!--通知的详情-->
<template>
  <div class="memorabilia-detail">
    <div class="filter-wrapper">
      <el-button @click="$router.back()" size="medium">返回</el-button>
    </div>

    <div class="detail-wrapper" :style="{'height': `${nobottommaxH}px`}">
      <div class="title">
        <span style="margin-right: 10px;">{{ happenTimeStr || "--" }}</span>大事记
      </div>
      <div class="info-wrapper">
        <span class="create-user-name">{{ createUserName || "--" }}</span>
        <span class="depart-name">{{ departName || "--" }}</span>
      </div>
      <div class="content-wrapper">
        <div class="ibox article-wrapper" style="width:810px;margin:0 auto;">
          <div class="ibox-content" style="border-top-width: 0;">
            <div class="row">
              <div class="col-lg-12">
                <div class="detail-title">事件记录</div>
                <div class="detail-value">
                  <pre v-html="desc || '--'"></pre>
                </div>
              </div>
            </div>
            <div class="row" v-if="picUrlList && picUrlList.length">
              <div class="col-lg-12">
                <div class="detail-value photo-list">
                  <image-previewer class="image-plate" :images="getViewPic(picUrlList)" tag="img"></image-previewer>
                </div>
              </div>
            </div>
            <div class="row" v-if="isAdministrativeInspection == 1">
              <div class="col-lg-12">
                <div class="detail-title">行政巡查</div>
                <div class="detail-value">
                  <pre v-html="administrativeInspectionContent || '--'"></pre>
                </div>
              </div>
            </div>
            <div
              class="row"
              v-if="isAdministrativeInspection == 1 && administrativeInspectionPicArray && administrativeInspectionPicArray.length"
            >
              <div class="col-lg-12">
                <div class="detail-value photo-list">
                  <image-previewer
                    class="image-plate"
                    :images="getViewPic(administrativeInspectionPicArray)"
                    tag="img"
                  ></image-previewer>
                </div>
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
import { mapGetters } from "vuex";
import { getBySchoolId, getBigEventNoteInfoById } from "@/api/memorabilia";

export default {
  mixins: [mixin],
  components: {
    ImagePreviewer,
  },
  computed: {
    ...mapGetters(["userInfo"]),
  },
  data() {
    return {
      id: this.$route.query.id,
      happenTimeStr: "",
      createUserName: "",
      departName: "",
      desc: "",
      picUrlList: [],
      isAdministrativeInspection: 2,
      administrativeInspectionContent: "",
      administrativeInspectionPicArray: [],
    };
  },
  created() {
    this.getBySchoolId();
  },
  methods: {
    getBySchoolId() {
      getBySchoolId()
        .then((res) => {
          let _res = res.data;
          if (_res.code != 200) return Promise.reject(_res.msg);
          else return _res.data;
        })
        .then((data) => {
          this.isAdministrativeInspection = data.isAdministrativeInspection;
          this.getBigEventNoteInfoById();
        })
        .catch((msg) => {
          this.$message({
            message: msg,
            type: "error",
          });
        });
    },
    getBigEventNoteInfoById() {
      getBigEventNoteInfoById({
        id: this.id,
      })
        .then((res) => {
          let _res = res.data;
          if (_res.code != 200) return Promise.reject(_res.msg);
          else return _res.data;
        })
        .then((data) => {
          this.happenTimeStr = data.happenTimeStr;
          this.createUserName = data.createUserName;
          this.departName = data.departName;
          this.desc = data.desc;
          this.picUrlList = data.picUrlList;
          this.administrativeInspectionContent =
            data.administrativeInspectionContent;
          this.administrativeInspectionPicArray =
            data.administrativeInspectionPicArray;
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
        return photoList.map((item) => ({ src: item }));
      }
      return [];
    },
  },
};
</script>
<style lang="scss" scoped>
.memorabilia-detail {
  padding: 12px;
  overflow: auto;

  .filter-wrapper {
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
        &.create-user-name {
          margin-right: 20px;
        }
      }
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
            font-family: Helvetica Neue, Helvetica, PingFang SC,
              Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif;
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
}
</style>