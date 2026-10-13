<template>
  <div class="goods_manage_wrap">
    <div class="header">
      <el-col :span="19">
        <el-button size="medium" @click="goBack">返回</el-button>
      </el-col>
      <el-col :span="5">
        <el-input placeholder="请输入商品名称" size="medium" v-model.trim="listQuery.goodsName" @change="getIntegralGoodsWareRecordPageList">
          <el-button slot="append" icon="el-icon-search" @click="getIntegralGoodsWareRecordPageList"></el-button>
        </el-input>
      </el-col>
    </div>
    <el-table stripe :data="dataList" :height="`${maxH - 1}`" border style="width: 100%">
      <el-table-column align="center" label="商品名称" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.goodsName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="所属分类" prop="typeName" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" label="入库数量" prop="wareCount" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" label="操作员" prop="operatorName" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" label="入库时间" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.operateTime | timeFormat}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="备注" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.remark || '--'}}
        </template>
      </el-table-column>
    </el-table>

    <el-pagination class="pagination-container" @size-change="handleSizeChange" @current-change="handleCurrentChange"
      :current-page.sync="listQuery.pageNo" :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.pageSize"
      layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
  </div>
</template>

<script>
  import windowResize from "@/mixins/windowResize";
  import {getIntegralGoodsWareRecordPageList} from '@/api/integralBank';

  export default {
    name: "goodsInputRecord",
    data() {
      return {
        dataList: [],
        listQuery: {
          pageNo: 1,
          pageSize: 20,
          goodsId: '',
          goodsName: ''
        },
        total: null
      }
    },
    filters: {
      timeFormat(time) {
        return time ? time.substring(0, 19) : "--";
      }
    },
    mixins: [windowResize],
    created() {
      this.getIntegralGoodsWareRecordPageList();
    },
    methods: {
      goBack() {
        this.$router.back()
      },
      getIntegralGoodsWareRecordPageList() {
        getIntegralGoodsWareRecordPageList(this.listQuery).then(res => res.data).then(data => {
          if (data.code === 200 && data.result) {
            this.dataList = data.data.dataList;
            this.total = data.data.pagination.total;
          }
        });
      },
      //切换码数
      handleSizeChange(val) {
        this.listQuery.pageNo = 1;
        this.listQuery.pageSize = val;
        this.getIntegralGoodsWareRecordPageList();
      },
      //切换页数
      handleCurrentChange(val) {
        this.listQuery.pageNo = val;
        this.getIntegralGoodsWareRecordPageList();
      },
    }
  }
</script>

<style lang="scss" scoped>
  .goods_manage_wrap{
    padding: 12px;

    .header {
      padding-bottom: 10px;
      overflow: hidden;
    }
    .picimg{
      display: block;
      width: 28px;
      height: 21px;
      margin: 0 auto;
      cursor: pointer;
    }
  }
</style>
