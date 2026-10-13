<template>
    <div class="restaurantRefundindex">
        <div class="top">
            <el-button  type="default" @click="$router.back()" size="medium">返回</el-button>
        </div>
        <div class="time-table">
            <el-table stripe :data="dateList"  border fit highlight-current-row style="width: 100%" :height="maxH">
                <el-table-column align="center" label="积分变动原因" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.sceneName}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="变动方式" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.changeType==1?"获得":"扣除"}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="时间" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.createTime|trimTime}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="变动积分" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.changeScore}}
                    </template>
                </el-table-column>
                  
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
import {getABCPointUserRecordForPage} from '@/api/integralquery';
import mixin from "@/mixins/windowResize";
import moment from 'moment';
export default {
  name: "newrestaurantRefundindex",
  data: function() {
    return {
      dateList: [], //表格主题数据
      total: null,
      query: {
        pageNo: 1, //页数
        pageSize: 20, //条数
        userId:this.$route.query.userId
      }
    };
  },
  mixins: [mixin],
  //获取渲染数据当数据加载完成后执行(生命周期中的钩子函数)
   filters: {
            trimTime(datetime) {
                return moment(datetime).format("YYYY-MM-DD HH:mm");
            },
        },
  created() {
    this.getABCPointUserRecordForPages();
  },
  methods: {
    //搜索
    handleInputChange() {
        this.getABCPointUserRecordForPages();
      },
    //获取列表
    getABCPointUserRecordForPages() {
      this.dateList = [];
      getABCPointUserRecordForPage(this.query).then(res => {
          let data = res.data.data;
          this.dateList = data.dataList;
          this.total = data.pagination.total;
      });
    },
    //切换页码
    handleSizeChange(val) {
      this.query.pageSize = val;
      this.getABCPointUserRecordForPages();
    },
    handleCurrentChange(val) {
      this.getABCPointUserRecordForPages();
    }
  }
};
</script>
<style scoped="scoped">
.restaurantRefundindex {
  padding:12px;
}
.restaurantRefundindex .top {
  padding-bottom:10px;
}
</style>
