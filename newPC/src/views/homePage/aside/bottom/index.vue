<template>
  <div class="home-page-aside-bottom" ref="asideItem">
    <div class="aside-content-wrapper">
      <div class="title" ref="title">
        <span>我的常用组</span>
        <a class="title-right" @click="gotoGroupManagerIndex"
          ><i class="el-icon-s-tools"></i>&nbsp;管理</a
        >
      </div>
      <div class="content">
        <el-table
          style="width: 100%"
          size="medium"
          :show-header="false"
          :height="tabHeight"
          :data="tabList"
        >
          <el-table-column width="46px">
            <template slot-scope="scope" class="icon">
              <img
                class="icon"
                :src="scope.row.type ? ['',
                             'https://cdnfile-10043692.file.myqcloud.com/misc/address/address_teacher_group.jpg',
                             'https://cdnfile-10043692.file.myqcloud.com/misc/address/address_stu_group.jpg',
                             'https://cdnfile-10043692.file.myqcloud.com/misc/address/address_parent_group.jpg'][scope.row.type] : ' https://cdnfile-10043692.file.myqcloud.com/admin/images/homePage/icon-default-group.png'"
                alt=""
            /></template>
          </el-table-column>
          <el-table-column show-overflow-tooltip>
            <template slot-scope="scope" class="text">
              <span>
                {{ scope.row.groupName || "--" }}
              </span></template
            >
          </el-table-column>
          <el-table-column width="100" show-overflow-tooltip>
            <template slot-scope="scope">
              <span
                class="link-type"
                @click="gotoGroupManagerIndexBySelectIndex(scope.row)"
              >
                {{ scope.row.userCount }} </span
              >&nbsp;&nbsp;人</template
            >
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
/* utils */
import mixin from "@/mixins/windowResize";

/* api */
import { getGroupByUserCount } from "@/api/homePage/aside/bottom/index";

export default {
  name: "homePageAsideBottom",
  mixins: [mixin],
  components: {},
  computed: {},
  data() {
    return {
      // 表格数据
      tabList: [],
      tabHeight: "",
    };
  },
  created() {
    this.getGroupByUserCount();
  },
  methods: {
    // 获得常用组名称列表和人数
    getGroupByUserCount() {
      getGroupByUserCount()
        .then((res) => {
          let _res = res.data;
          if (_res.code != 200) return Promise.reject(_res.msg);
          else return _res.data;
        })
        .then((data) => {
          if (Array.isArray(data) && data.length) {
            this.tabList = [...data];
            let titleH = this.$refs["title"].offsetHeight;
            this.tabHeight =
              this.$refs["asideItem"].clientHeight - 40 - titleH - 10;
          }
        })
        .catch((msg) => {
          this.$message({
            message: msg,
            type: "error",
          });
        });
    },
    // 常用组
    gotoGroupManagerIndex() {
      this.$router.push({
        path: "/main/homeSchool/group/groupManagerIndex",
      });
    },
    // 指定常用组
    gotoGroupManagerIndexBySelectIndex(item) {
      this.$router.push({
        path: "/main/homeSchool/group/groupManagerIndex",
        query: {
          groupId: item.groupId,
        },
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.home-page-aside-bottom {
  .aside-content-wrapper {
    .title {
      padding-right: 40px;
    }
    .el-table {
      .icon {
        width: 26px;
        height: 26px;
        display: inline-block;
        vertical-align: middle;
        margin-right: 10px;
      }
      .text {
        display: inline-block;
        vertical-align: middle;
      }
    }
  }
}
</style>
