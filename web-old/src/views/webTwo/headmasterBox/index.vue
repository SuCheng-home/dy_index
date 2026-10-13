<template>
  <div class="headmaster-box">
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
          <div class="filter-wrapper">
            <el-button type="primary" size="medium" @click="gotoForm">我要留言</el-button>
          </div>
          <ul
            class="table-list"
            v-loading.body="tabLoading"
            v-if="tabLoading || (tabList && tabList.length)"
          >
            <li v-for="(item,index) in tabList" :key="index">
              <span class="list-head"></span>
              <a class="list-title" @click="gotoDetail(item.id)">{{item.title}}</a>
              <span class="list-time">{{item.createTime | filterTime}}</span>
            </li>
          </ul>
          <ul class="no-data" v-else>
            <img src="http://cdn.weixiaojia.cn/mobile/images/nodata.png" alt />
            <p>暂无数据</p>
          </ul>
          <el-pagination
            layout="total, sizes, prev, pager, next, jumper"
            :current-page="pagination.pageNo"
            :page-sizes="pagination.pageSizes"
            :page-size="pagination.pageSize"
            :total="pagination.total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          ></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getPublicSchoolWebLetterBoxList } from "@/api/webTwo/headmasterBox/index";

export default {
  computed: {
    ...mapGetters(["id"]),
  },
  filters: {
    filterTime(date) {
      if (date) {
        return date == "" ? "" : date.slice(0, 19);
      }
    },
  },
  data() {
    return {
      // 表格加载
      tabLoading: true,
      // 表格列表
      tabList: [],
      // 分页
      pagination: {
        pageNo: 1,
        pageSizes: [15, 20, 30, 50],
        pageSize: 15,
        total: 0,
      },
    };
  },
  created() {
    this.getPublicSchoolWebLetterBoxList();
  },
  methods: {
    getPublicSchoolWebLetterBoxList() {
      this.tabLoading = true;
      getPublicSchoolWebLetterBoxList({
        webId: this.id,
        pageNo: this.pagination.pageNo,
        pageSize: this.pagination.pageSize,
      })
        .then((res) => {
          this.tabLoading = false;
          let _res = res.data;
          if (_res.code != 200) return Promise.reject(_res.msg);
          else return _res.data;
        })
        .then((data) => {
          let { dataList, pagination } = data;
          this.tabList = [...dataList];
          this.pagination.total = pagination.total;
        })
        .catch((msg) => {
          this.$message({
            message: msg,
            type: "error",
          });
        });
    },
    // 分页 - pageSize 改变
    handleSizeChange(pageSize) {
      this.pagination.pageSize = pageSize;
      this.getPublicSchoolWebLetterBoxList();
    },
    // 分页 - pageNo 改变
    handleCurrentChange(pageNo) {
      this.pagination.pageNo = pageNo;
      this.getPublicSchoolWebLetterBoxList();
    },
    // 新增/编辑页
    gotoForm() {
      this.$router.push({ path: "form" });
    },
    // 详情页
    gotoDetail(id) {
      this.$router.push({ path: "detail", query: { messageId: id } });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../../styles/mixin.scss";

.headmaster-box {
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
        padding: 10px 25px 25px;
        .filter-wrapper {
          margin-bottom: 10px;
        }
        .table-list {
          min-height: 619px;
          position: relative;
          li {
            width: 100%;
            height: 37px;
            line-height: 36px;
            border-bottom: 1px solid #eee;
            overflow: hidden;
            .list-head {
              display: block;
              float: left;
              width: 3px;
              height: 3px;
              margin-top: 18px;
              margin-right: 10px;
              background: #4c689d;
              color: #4c689d;
            }
            .list-title {
              float: left;
              display: block;
              width: 76%;
              height: 36px;
              line-height: 36px;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
              color: #5c5c5c;
              cursor: pointer;
              &:hover {
                color: #819ed5;
              }
            }
            .list-time {
              width: 18%;
              color: #5c5c5c;
              display: block;
              float: right;
              text-align: right;
              height: 36px;
              font-size: 14px;
              line-height: 36px;
            }
          }
        }
        .el-pagination {
          margin-top: 10px;
        }
        .no-data {
          text-align: center;
          padding: 80px 0 20px 0;
          height: 618px;
          & > img {
            width: auto;
            display: block;
            max-width: 100%;
            margin: 0 auto;
          }
          & > p {
            font-size: 14px;
            color: #000;
          }
        }
      }
    }
  }
}
</style>