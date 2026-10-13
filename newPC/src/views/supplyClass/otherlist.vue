<template>
  <div class="extraWorklistone">
    <div class="header">
      <el-button @click="$router.back()" type="default" size="medium">返回</el-button>
    </div>
    <div class="schoolWrap scrollStyle">
      <el-table :data="dataList" border stripe :height="maxH">
        <el-table-column prop="supplyTeacherName" label="姓名" show-overflow-tooltip></el-table-column>
        <el-table-column prop="supplyDate" label="日期" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="节次/天数" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.substituteType === 2">{{scope.row.substituteDayNum}}天</span>
            <span v-else>{{scope.row.supplyClassNoName || '--'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="reason" label="备注" show-overflow-tooltip></el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page.sync="query.pageNo" :page-sizes="[10,20,30, 50]"
                     :page-size="query.pageSize" layout="total, sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  import mixins from "@/mixins/windowResize";
  import baseMixin from "@/mixins/baseMixin";
  import moment from "moment";
  import {getThOtherSupplyClassPageList} from '@/api/supplyClass';

  export default {
    data() {
      return {
        dataList: [],
        total: null,
        query: {
          startDate: this.$route.query.startDate,
          endDate: this.$route.query.endDate,
          pageNo: 1, //页数
          pageSize: 20, //条数
          teacherId: this.$route.query.teacherId
        },
      };
    },
    created() {
      this.getThOtherSupplyClassPageLists();
    },
    mixins: [mixins, baseMixin],
    methods: {
      //获取列表
      getThOtherSupplyClassPageLists() {
        this.dataList = [];
        getThOtherSupplyClassPageList(this.query).then(res => {
          let data = res.data.data;
          this.dataList = data.dataList;
          this.total = data.pagination.total;
        });
      },
      //切换条数
      handleSizeChange(val) {
        this.query.pageSize = val;
        this.query.pageNo = 1;
        this.getThOtherSupplyClassPageLists();
      },
      //切换页数
      handleCurrentChange() {
        this.getThOtherSupplyClassPageLists();
      }
    }
  };
</script>
<style lang="scss" scoped>
  .extraWorklistone {
    padding:12px;

    .header {
      padding-bottom: 10px;

    }
  }
</style>

