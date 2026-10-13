<template>
  <div class="home-page-main">
    <Banner />
    <Notice v-if="isShowByPermission('/notice')" />
      <br v-else />
    <NormalEntry />
  </div>
</template>

<script>
    import {isShowByPermission, isShowByRole} from '@/utils';

    /* utils */
import mixin from "@/mixins/windowResize";

/* components */
import Banner from "./banner";
import NormalEntry from "./normalEntry";
import Notice from "./notice";

/* api */

export default {
  name: "homePageMain",
  mixins: [mixin],
  components: {
    Banner,
    NormalEntry,
    Notice,
  },
  computed: {},
  filters: {},
  data() {
    return {};
  },
  created() {},
  methods: {
      isShowByPermission
  },
};
</script>
<style lang="scss" scoped>
.home-page-main {
  padding: 8px;

  /deep/ .el-table {
    &::before {
      top: 0;
      left: 0;
      width: 100%;
      height: 1px;
      content: "";
      position: absolute;
      background-color: #ebeef5;
      z-index: 1;
    }
    tbody {
      tr {
        &:last-child {
          td,
          th {
            border: 0;
          }
        }
      }
    }
    td,
    th {
      padding: 12px 0;
      :last-child {
        border: 0;
      }
    }
  }
}
</style>
