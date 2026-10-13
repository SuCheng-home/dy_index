<template>
  <div class="goods_manage_wrap">
    <div class="header">
      <el-col :span="19">       
        <el-select v-model="listQuery.type" placeholder="请选择类型" size="medium" @change="getIntegralBankList">
          <el-option v-for="(item, index) in typeList" :key="index" :label="item.name" :value="item.id"></el-option>
        </el-select>
         <el-button type="primary" size="medium" @click="openRecord">批量开户</el-button>
      </el-col>
      <el-col :span="5">
        <el-input placeholder="请输入姓名" size="medium" v-model.trim="listQuery.studentName" @change="getIntegralBankList">
          <el-button slot="append" icon="el-icon-search" @click="getIntegralBankList"></el-button>
        </el-input>
      </el-col>
    </div>
    <el-table stripe :data="dataList" :height="`${maxH - 1}`" border style="width: 100%">
      <el-table-column align="center" label="姓名" prop="studentName" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" label="班级/部门" prop="className" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" label="交易类型" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="scope.row.type === 1">开户</span>
          <span v-else-if="scope.row.type === 2">{{scope.row.depositType !== '0' ? scope.row.depositType+'个月定存' : '活期存款'}}</span>
          <span v-else-if="scope.row.type === 3">兑换存入</span>
          <span v-else-if="scope.row.type === 4">兑换取出</span>
          <span v-else-if="scope.row.type === 5">取款</span>
          <span v-else-if="scope.row.type === 6">积分存款</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="金额" show-overflow-tooltip>
        <template slot-scope="scope">
            <span v-if="scope.row.type === 6">
              {{scope.row.money}}分
            </span>
            <span v-else>
              {{scope.row.type > 1 ? '￥'+(parseFloat(scope.row.money)/100).toFixed(2) : '--'}}
            </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="利息" show-overflow-tooltip>
        <template slot-scope="scope">
            <span v-if="scope.row.type === 6">
              {{scope.row.interest}}分
            </span>
            <span v-else>
              {{(scope.row.type > 1 && scope.row.interest) ? '￥'+(parseFloat(scope.row.interest)/100).toFixed(2) : '/'}}
            </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作员" prop="createUserName" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" label="时间" show-overflow-tooltip>
        <template slot-scope="scope">
            <span>
              {{scope.row.createTime | timeFormat}}
            </span>
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
  import _ from 'lodash';
  import windowResize from "@/mixins/windowResize";
  import {getIntegralBankList, addIntegralBankUserList} from '@/api/integralBank';

  export default {
    name: "operationRecord",
    data() {
      return {
        typeList: [{id: 0, name: '全部状态'}, {id: 2, name: '存款'}, {id: 3, name: '兑换存入'}, {id: 4, name: '兑换取出'}, {id: 5, name: '取款'}, {id: 6, name: '积分存款'}],
        gradeList: [],
        classList: [],
        dataList: [],
        listQuery: {
          pageNo: 1,
          pageSize: 20,
          studentName: '',
          type: 0
        },
        total: null,
      }
    },
    filters: {
      timeFormat(time) {
        return time ? time.substring(0, 19) : "--";
      }
    },
    mixins: [windowResize],
    created() {
      this.getIntegralBankList();
    },
    methods: {
      openRecord: _.throttle(
        function () {
          this.$confirm("确认要批量开户吗？", "开户", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
            lockScroll: false
          }).then(() => {
            addIntegralBankUserList().then(res => res.data).then(data => {
              if (data.code === 200 && data.result) {
                this.$message.success('开户成功！');
                this.listQuery.pageNo = 1;
                this.getIntegralBankList();
              } else {
                this.$message.error(data.msg);
              }
            })
          });
        },
        10000
      ),
      getIntegralBankList() {
        getIntegralBankList(this.listQuery).then(res => res.data).then(data => {
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
        this.getIntegralBankList();
      },
      //切换页数
      handleCurrentChange(val) {
        this.listQuery.pageNo = val;
        this.getIntegralBankList();
      },
    }
  }
</script>

<style lang="scss" scoped>
  .goods_manage_wrap {
    padding: 12px;

    .header {
      padding-bottom: 10px;
      overflow: hidden;
    }

    .picimg {
      display: block;
      width: 28px;
      height: 21px;
      margin: 0 auto;
      cursor: pointer;
    }
  }
</style>
