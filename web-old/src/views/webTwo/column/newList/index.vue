<template>
  <div class="newList">
    <ul
      class="newList-ul"
      v-loading.body="listLoading"
      v-if="columnList&&columnList.length!==0 &&query.type!==4"
    >
      <li v-for="(listItem,index) in columnList" :key="index">
        <span class="list-head"></span>
        <!--二级栏目列表-->
        <template v-if="query.id&&query.secondColumn&&!query.indexid">
          <a
            href="javascript:;"
            v-if="listItem.messageType===1"
            @click="subjumpTo('/webTwo/main/column/newdetail',query,listItem)"
            v-html="listItem.title"
          ></a>
        </template>
        <!--首页消息列表-->
        <template v-if="query.messageId&&query.id&&query.messageType&&query.moduleType==2">
          <a
            href="javascript:;"
            v-if="listItem.messageType===1"
            @click="firstMesTo('/webTwo/main/column/newdetail',query,listItem)"
            v-html="listItem.title"
          ></a>
        </template>
        <!--首页栏目列表-->
        <template v-if="query.id&&query.secondColumn&&query.indexid">
          <a
            href="javascript:;"
            v-if="listItem.messageType===1"
            @click="nosubjumpTo('/webTwo/main/column/newdetail',query,listItem)"
            v-html="listItem.title"
          ></a>
        </template>
        <a
          :href="listItem.messageUrl"
          target="_blank"
          v-if="listItem.messageType===2"
        >{{listItem.title}}</a>
        <span class="time">{{listItem.createTime}}</span>
      </li>
      <!-- <li>
        <span class="fa fa-caret-right list-head"></span> 
        <a href="javascript:;">南京日报：边背《锄禾》边插秧 方知&amp;ldquo;粒粒皆辛苦&amp;rdquo;</a> 
        <span class="time">2017-08-24  09:30:17</span>
      </li>-->
    </ul>
    <div class="pagination-container" v-show="!listLoading&&total!==0">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="listQuery.pageNo"
        :page-sizes="[15, 20, 30, 50]"
        :page-size="listQuery.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
    <ul class="no-data" v-if="columnList==''|| query.type==4">
      <img src="http://cdn.weixiaojia.cn/mobile/images/nodata.png" alt />
      <p>暂无数据</p>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getSchoolWebModuleMessageList } from "@/api/firstPage";
export default {
  data() {
    return {
      query: null,
      total: null,
      listLoading: true,
      listQuery: {
        pageNo: 1,
        pageSize: 15,
      },
      columnList: null,
    };
  },
  mounted() {
    //console.log("ss",this.$route.query);
    // this.query=this.$route.query;
    // if(this.query.id&&this.query.secondColumn){
    //   if(this.query.type==2){
    //     this.getSchoolWebModuleMessageListFunc();
    //   }
    //   if(this.query.type==4){
    //    // console.log('')
    //   }
    // }else if(this.query.messageId&&this.query.messageType&&this.query.id&&this.query.moduleType==2){
    //   this.getSchoolWebModuleMessageListFunc();
    // }
  },
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.query) {
          this.query = to.query;
          if (this.query.id && this.query.secondColumn) {
            if (this.query.type == 2) {
              this.getSchoolWebModuleMessageListFunc();
            }
            if (this.query.type == 4) {
              // console.log('')
            }
          } else if (
            this.query.messageId &&
            this.query.messageType &&
            this.query.id &&
            this.query.moduleType == 2
          ) {
            this.getSchoolWebModuleMessageListFunc();
          }
        }
      },
      immediate: true,
    },
  },
  methods: {
    //nav中二级栏目消息列表跳转
    subjumpTo(url, parquery, query) {
      console.log("ss", parquery, query);
      this.$router.push({
        path: url,
        query: {
          parentsid: parquery.parentid,
          parentid: parquery.id,
          id: query.id,
          messageType: query.messageType,
          secondColumn: parquery.secondColumn,
          type: parquery.type,
        },
      });
    },
    firstMesTo(url, parquery, query) {
      console.log("dadadda");
      this.$router.push({
        path: url,
        query: {
          id: parquery.id,
          columnName: parquery.columnName,
          moduleType: 2,
          messageId: query.id,
          messageType: query.messageType,
        },
      });
    },
    //首页栏目消息跳转
    nosubjumpTo(url, parquery, query) {
      this.$router.push({
        path: url,
        query: {
          columnName: parquery.columnName,
          id: query.id,
          messageType: query.messageType,
          moduleOnly: parquery.id,
          type: parquery.type,
          secondColumn: parquery.secondColumn,
          indexid: parquery.indexid,
        },
      });
    },
    getSchoolWebModuleMessageListFunc() {
      this.listLoading = true;
      getSchoolWebModuleMessageList({
        pageNo: this.listQuery.pageNo,
        pageSize: this.listQuery.pageSize,
        moduleId: this.query.id,
      })
        .then((res) => res.data)
        .then((res) => {
          //console.log(res.data.dataList);
          let dataList = res.data.dataList;
          for (var i = 0; i < dataList.length; i++) {
            dataList[i].createTime = dataList[i].createTime.substring(0, 19);
          }
          this.columnList = dataList;
          this.total = res.data.pagination.total;
          this.listLoading = false;
        });
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val;
      this.getSchoolWebModuleMessageListFunc();
    },
    handleCurrentChange(val) {
      this.listQuery.pageNo = val;
      this.getSchoolWebModuleMessageListFunc();
    },
  },
  computed: {
    ...mapGetters(["schoolId"]),
  },
};
</script>

<style lang="scss" scoped>
@import "../../../../styles/mixin.scss";
.newList {
  width: 100%;
  padding: 0 25px;
  height: auto;
  min-height: 619px;
  padding-bottom: 66px;
  position: relative;
  .newList-ul {
    width: 100%;
    height: 558px;
    margin: 0 auto;
    padding-right: 6px;
    box-sizing: border-box;
    overflow: auto;
    & > li {
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
        // background:#006442;
        // color: #006442;
        margin-right: 10px;
      }
      & > a {
        float: left;
        display: block;
        width: 76%;
        height: 36px;
        line-height: 36px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        color: #5c5c5c;
      }
      & > a:hover {
        text-decoration: none;
        // color: #007a6c;
      }
      & > .time {
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
  .pagination-container {
    position: absolute;
    left: 0;
    bottom: 20px;
    width: 100%;
    padding: 0 25px;
    margin: 0 auto;
  }
  .no-data {
    text-align: center;
    padding: 80px 0 20px 0;
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
</style>
