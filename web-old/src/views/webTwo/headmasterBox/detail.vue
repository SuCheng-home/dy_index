<template>
  <div class="headmaster-box-detail">
    <!--主体内容-->
    <div class="detail-wrapper">
      <div class="detail-wrap">
        <!-- 位置导航 start -->
        <div class="sitemenu">
          <span class="fa fa-map-marker icon fl"></span>
          <span class="fl name">位置：</span>
          <div class="sitemenu-title">
            <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item :to="{ path: '/webTwo/main/index' }">首页</el-breadcrumb-item>
              <template>
                <el-breadcrumb-item>校长信箱</el-breadcrumb-item>
              </template>
            </el-breadcrumb>
          </div>
        </div>
        <!-- 位置导航 end -->
        <div class="content-wrapper">
          <div class="menu-tools">
            <el-button @click="$router.go(-1)" size="medium">返回</el-button>
          </div>
          <div class="content-main">
            <div class="title">
              <h2>{{title}}</h2>
            </div>
            <div class="info-wrapper">
              <span class="time">{{createTime | filterTime}}</span>
            </div>
            <div class="ueditor-wrapper">
              <image-previewer tag="richtext">
                <div class="columnedit-content" v-html="content"></div>
              </image-previewer>
            </div>
            <div class="form-bottom">
              <div class="detail-title">
                <span>答复内容</span>
              </div>
              <div class="detail-content">
                <div class="detail-value">
                  <pre v-html="replyContent || '--'"></pre>
                </div>
                <div class="detail-value inscribe">{{inscribe}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ImagePreviewer from "@/components/ImagePreviewer/ImagePreviewer.vue";
import { getSchoolWebLetterBoxById } from "@/api/webTwo/headmasterBox/detail";

export default {
  components: {
    ImagePreviewer,
  },
  filters: {
    filterTime(dateTime) {
      return dateTime == undefined ? "" : dateTime.split(".")[0];
    },
  },
  data() {
    return {
      // 消息id
      messageId: this.$route.query.messageId,
      // 标题
      title: "",
      // 创建时间
      createTime: "",
      // 内容
      content: "",
      // 状态 1(未回复) | 2(已回复) | 3(已公开)
      status: 1,
      // 回复内容
      replyContent: "",
      // 落款
      inscribe: "",
    };
  },
  created() {
    this.getSchoolWebLetterBoxById();
  },
  methods: {
    // 根据消息id查询校长信箱
    getSchoolWebLetterBoxById() {
      getSchoolWebLetterBoxById({
        messageId: this.messageId,
      })
        .then((res) => {
          let _res = res.data;
          if (_res.code != 200) return Promise.reject(_res.msg);
          else return _res.data;
        })
        .then((data) => {
          this.title = data.title;
          this.createTime = data.createTime;
          this.content = data.content;
          this.status = data.status;
          this.replyContent = data.replyContent;
          this.inscribe = data.inscribe;
        })
        .catch((msg) => {
          this.$message({
            message: msg,
            type: "error",
          });
        });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../../styles/mixin.scss";

.headmaster-box-detail {
  width: 100%;
  min-width: 1200px;
  .detail-wrapper {
    width: 100%;
    min-width: 1200px;
    height: auto;
    background-color: #e5e5e5;
    .detail-wrap {
      width: 1200px;
      height: auto;
      margin: 0 auto;
      padding-top: 10px;
      .sitemenu {
        width: 100%;
        height: 45px;
        border-bottom: 4px solid $column-bottom;
        & > .fl {
          float: left;
          display: block;
        }
        & > .icon {
          font-size: 24px;
          // color:#006442;
          font-weight: bold;
          margin: 4px 6px 0 12px;
        }
        & > .name {
          margin: 8px 0 0 0;
        }
        & > .sitemenu-title {
          padding: 11px 0 0 0;
          width: 60%;
        }
      }
      .content-wrapper {
        position: relative;
        width: 100%;
        height: auto;
        min-height: calc(100vh - 54px - 260px - 45px - 45px - 146px);
        background-color: #fff;
        padding: 10px 25px;
        .menu-tools {
          border-bottom: 1px solid #e7eaec;
          padding-bottom: 10px;
        }
        .content-main {
          position: relative;
          width: 80%;
          min-height: 292px;
          padding-top: 22px;
          padding-bottom: 30px;
          margin: 0 auto;
          box-sizing: border-box;
          overflow-x: hidden;
          overflow-y: auto;
          .title {
            width: 100%;
            text-align: center;
            line-height: 1.428571429;
            color: #333;
          }
          .info-wrapper {
            width: 50%;
            line-height: 36px;
            margin: 0px auto 10px;
            color: #888;
            font-size: 14px;
            overflow: hidden;
            .time {
              float: right;
            }
          }
          .ueditor-wrapper {
            width: 100%;
            .columnedit-content {
              font-size: 15px;
              line-height: 26px;
              color: rgb(103, 106, 108);
              word-wrap: break-word;
              word-break: break-all;
              margin: 0px auto;
              padding: 0px 30px;
              width: 100%;
              box-sizing: border-box;
              /deep/ p {
                margin: 0 0 10px;
                img {
                  display: block;
                  max-width: 100%;
                  width: auto;
                  height: auto;
                }
              }
            }
          }

          .form-bottom {
            padding: 0 30px;
            margin-top: 100px;
            .detail-title {
              margin: 22px 0 14px;
              border-left: 4px solid #409eff;
              padding-left: 12px;
              height: 16px;
              line-height: 16px;
              box-sizing: border-box;
              display: flex;
              align-items: center;
              span {
                margin-right: 20px;
              }
              img {
                cursor: pointer;
              }
            }
            .detail-value {
              line-height: 38px;
              background-color: #f7fbfd;
              padding: 15px 30px;
              color: #777;
              box-sizing: border-box;
              &.inscribe {
                text-align: right;
              }
            }
          }
        }
      }
    }
  }
  pre {
    margin: 0;
    padding: 0;
    border: 0;
    background: transparent;
    color: inherit;
    line-height: 38px;
    font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB,
      Microsoft YaHei, Arial, sans-serif;
    white-space: pre-wrap; /* css-3 */
    white-space: -moz-pre-wrap; /* Mozilla, since 1999 */
    white-space: -pre-wrap; /* Opera 4-6 */
    white-space: -o-pre-wrap; /* Opera 7 */
    word-wrap: break-word; /* Internet Explorer 5.5+ */
  }
}
</style>