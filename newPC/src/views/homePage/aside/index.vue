<template>
  <div class="home-page-aside">
    <Top class="bg-white aside-item top" />
    <Middle class="bg-white aside-item middle" />
    <Bottom class="bg-white aside-item bottom" />
  </div>
</template>

<script>
/* utils */
import mixin from "@/mixins/windowResize";

/* components */
import Top from "./top";
import Middle from "./middle";
import Bottom from "./bottom";

/* api */

export default {
  name: "homePageAside",
  mixins: [mixin],
  components: { Top, Middle, Bottom },
  computed: {},
  data() {
    return {};
  },
  created() {},
  methods: {},
};
</script>
<style lang="scss" scoped>
.home-page-aside {
  height: 100%;
  display: flex;
  flex-direction: column;
  .aside-item {
    flex: 1;
    margin-bottom: 8px;
    padding: 20px 35px;
    overflow: auto;
    &:last-child {
      margin: 0;
    }
    &.top {
      min-height: 291px;
    }
    &.middle {
      min-height: 313px;
    }
    &.bottom {
      min-height: 180px;
    }
    /deep/ .aside-content-wrapper {
      .title {
        padding-bottom: 10px;
        margin-bottom: 10px;
        font-family: MicrosoftYahei-Bold;
        font-size: 16px;
        font-weight: bold;
        color: #409eff;
        overflow: hidden;
        border-bottom: 1px solid #e7eaec;
        .title-right {
          float: right;
          font-weight: normal;
        }
      }
      /deep/ .content {
        .el-row {
          margin-bottom: 25px;
          width: 100%;
          .el-col {
            font-family: SourceHanSansCN-Bold;
            font-size: 13px;
            color: #606266;
          }
        }
      }
    }
  }

  /deep/ .el-table {
    &::before {
      height: 0;
    }
    td,
    th {
      border: 0;
    }
  }
}
</style>