<template>
  <div class="task_info_not_wrap">
    <div class="clock_user_box" :style="`height: ${maxH-20}px;`">
      <div class="user_box clearfix" v-if="listData && listData.length">
        <div class="user_name" v-for="(item, index) in listData" :key="index">{{item.userName}}&nbsp;{{item.classDepartName}}</div>
      </div>
      <default-page Mes="暂无人员" v-else></default-page>
    </div>
    <div class="pagination-container" style="text-align: right;">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page.sync="listQuery.pageNo" :page-sizes="[20, 30, 50, 100]"
                     :page-size.sync="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper"
                     :total="total"></el-pagination>
    </div>
  </div>
</template>

<script>
  import mixin from '@/mixins/windowResize'
  import DefaultPage from '@/components/DefaultPage';
  import {getEcardUserDateList} from '@/api/eClock';

  export default {
    name: "card-not",
    components: {DefaultPage},
    props: {
      cardDate: {
        type: [String, Number],
        default: ''
      },
      cardId: {
        type: [String, Number],
        default: ''
      }
    },
    mixins: [mixin],
    data() {
      return {
        showMask: false,
        loading: false,
        finishLoad: false,
        listData: [],
        listQuery: {
          state: 1,
          pageNo: 1,
          pageSize: 50
        },
        total: null
      }
    },
    mounted() {
      this.getList();
    },
    methods: {
      getList() {
        if (!this.cardDate || !this.cardId) {
          return;
        }
        getEcardUserDateList({
          ...{
            cardDate: this.cardDate,
            eCardId: this.cardId
          },
          ...this.listQuery
        }).then(res => {
          let data = res.data.data;
          if (res.data.code === 200 && res.data.result) {
            this.listData = data.dataList;
            this.total = data.pagination.total;
          } else {
            this.$message({type: 'error', message: res.data.msg})
          }
        }).catch(() => {})
      },
      handleSizeChange(val) {
        this.listQuery.pageNo = 1;
        this.listQuery.pageSize = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.pageNo = val;
        this.getList();
      }
    }
  }
</script>

<style scoped>
  .clearfix:after {
    content: "";
    display: block;
    font-size: 0;
    height: 0;
    clear: both;
    visibility: hidden;
  }
  .clearfix {
    zoom: 1;
  }
</style>
<style lang="scss" scoped>
  .task_info_not_wrap{
    position: relative;
    padding: 10px 15px;
    background-color: #fff;
    overflow: hidden;
    .clock_user_box{
      overflow-x: hidden;
      overflow-y: auto;
      .user_box{
        overflow: hidden;
        .user_name{
          float: left;
          width: 200px;
          height: 30px;
          line-height: 30px;
          margin-right: 20px;
          margin-bottom: 13px;
          text-align: center;
          font-size: 14px;
          color: #53A2EC;
          background-color: #E3F1FE;
          border-radius: 3px;
          overflow: hidden;
        }
      }
    }
  }
</style>
