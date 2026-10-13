<template>
  <div class="home-page"  :style="`height: ${nobottommaxH}px;`">    
      <div class="home-body">
        <el-container class="full-height"  >
          <el-main class="bg-white no-padding">
             <Main />
          </el-main>
          <el-aside width="453px">
            <Aside />
          </el-aside>
      </el-container>
      </div>      
  </div>
</template>

<script>
/* utils */
import mixin from "@/mixins/windowResize";

/* components */
import Main from "./main";
import Aside from "./aside";

/* api */

export default {
  name: "homePage",
  mixins: [mixin],
  components: {
    Main,
    Aside,
  },
  computed: {},
  data() {
    return {};
  },
  created() {},
  methods: {},
};
</script>
<style lang="scss" scoped>
.home-page {
  box-sizing: border-box;
  min-height: calc(100% - 70px);
  padding: 10px;
  background-color: #f1f1f1;
  overflow: auto;  
  .el-container {
    max-width: calc(8px + 1246px + 8px + 8px + 453px);
    margin: 0 auto;
    .el-main {
      margin-right: 8px;
      min-width: 317px;
    }
  }
  /* 100%高度 */
  /deep/ .full-height {
    height: 100%;
   
  }
  /* 白色背景 */
  /deep/ .bg-white {
    background-color: #fff;
  }
  /* 取消外边距 */
  /deep/ .no-margin {
    margin: 0;
  }
  /* 取消内边距 */
  /deep/ .no-padding {
    padding: 0;
  }
  /* 初始化 */
  /deep/ ul,
  /deep/ ol,
  /deep/ li {
    margin: 0;
    padding: 0;
    list-style: none;
  }
}
</style>