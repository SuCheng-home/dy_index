<template>
    <div class="restaurantRefundindex">
        <div class="top">
            <el-col :span="24">
                <el-input class="search-input search-input--right"  size="medium" placeholder="请输入老师姓名" icon="el-icon-search" @change="handleInputChange" v-model.trim="query.keywords">
                    <el-button slot="append" icon="el-icon-search" @click="handleInputChange"></el-button>
                </el-input>
            </el-col>
        </div>
        <div class="time-table">
            <el-table stripe :data="dateList"  border fit highlight-current-row style="width: 100%" :height="maxH">
                <el-table-column align="center" label="姓名" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span class="link-type" @click="integralquerylist(scope.row.userId)">{{scope.row.userName}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="departName"  label="部门"  show-overflow-tooltip></el-table-column>
                <el-table-column align="center" prop="currentScore"  label="当前分值"></el-table-column>
                <el-table-column align="center" prop="accScore"  label="累积分值"></el-table-column>               
                <el-table-column align="center" prop="benefit"  label="获得权益"></el-table-column>  
                  
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
import {getABCPointUserForPage} from '@/api/integralquery';
import mixin from "@/mixins/windowResize";
export default {
  name: "newrestaurantRefundindex",
  data: function() {
    return {
      dateList: [], //表格主题数据
      total: null,
      query: {
        pageNo: 1, //页数
        pageSize: 20, //条数
        keywords: ""
      }
    };
  },
  mixins: [mixin],
  //获取渲染数据当数据加载完成后执行(生命周期中的钩子函数)
  created() {
    this.getABCPointUserForPages();
  },
  methods: {
    //搜索
    handleInputChange() {
        this.getABCPointUserForPages();
      },
    //获取列表
    getABCPointUserForPages() {
      this.dateList = [];
      getABCPointUserForPage(this.query).then(res => {
          let data = res.data.data;
          this.dateList = data.dataList;
          this.total = data.pagination.total;
      });
    },
    //切换页码
    handleSizeChange(val) {
      this.query.pageSize = val;
      this.getABCPointUserForPages();
    },
    handleCurrentChange(val) {
      this.getABCPointUserForPages();
    },
    //详情
    integralquerylist(userId) {
      this.$router.push({
        path: "integralquerylist",
        query: {
          userId: userId
        }
      });
    }
  }
};
</script>
<style scoped="scoped">
.restaurantRefundindex {
  padding:12px;
}
.restaurantRefundindex .top {
  height: 46px;
}
.is-link {
  color: #67c23a;
  cursor: pointer;
}
</style>
