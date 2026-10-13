<template>
  <div class="guide_group_list_wrap">
    <div class="header">
      <el-row>
        <el-col :span="19">
          <el-button size="medium" @click.native="goBack">返回</el-button>
          <el-button type="primary" size="medium" @click.native="officeadd()">新建办公室</el-button>
        </el-col>
        <el-col :span="5">
          <el-input placeholder="请输入办公室名称" v-model.trim="searchTitle" size="medium" class="search-input"
                    @keyup.enter.native="searchNameHandler">
            <el-button slot="append" icon="el-icon-search" @click="searchNameHandler"></el-button>
          </el-input>
        </el-col>
      </el-row>
    </div>

    <div>
      <el-table  :data="dataList" border stripe :height="maxH - 1" style="width: 100%">
        <el-table-column label="办公室名称" align="center" prop="name" show-overflow-tooltip></el-table-column>
        <el-table-column label="办公室成员" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-for="(item,index) in JSON.parse(scope.row.userJson)" :key="index"> &nbsp;{{item.name}} &nbsp;</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="300">
          <template slot-scope="scope">
            <el-button size="small" type="text" @click="editGuideGroup(scope.row.id)">编辑</el-button>
            <el-button size="small" type="text" @click="delPrintSeniorOffice(scope.row.id)" class="buttontextred">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                       :current-page.sync="pageNo" :page-sizes="[10,20,30, 50]"
                       :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
                       :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import mixins from '@/mixins/windowResize';
  import {getPrintSeniorOfficeList, delPrintSeniorOffice} from '@/api/printApplication';

  export default {
    name: "dataList",
    data() {
      return {
        searchTitle: '',
        pageNo: 1,
        pageSize: 20,
        total: null,
        dataList: [],
      }
    },
    mixins: [mixins],
    created() {
         this.getPrintSeniorOfficeList();
    },
    methods: {
      goBack() {
        this.$router.back();
      },
      officeadd() {
        this.$router.push({path: 'officeadd'});
      },
      editGuideGroup(id) {
        this.$router.push({path: 'officeadd', query: {id: id}});
      },
      searchNameHandler() {
        this.pageNo = 1;
        this.getPrintSeniorOfficeList();
      },
      getPrintSeniorOfficeList() {
        getPrintSeniorOfficeList({
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          searchTitle: this.searchTitle
        }).then(res => {
          const data = res.data;
          if (data.code === 200) {
            this.dataList = data.data.dataList;
            this.total = data.data.pagination.total;
          }
        }).catch(() => {
        });
      },
      delPrintSeniorOffice(id) {
        delPrintSeniorOffice(id).then(res => {
          const data = res.data;
          if (data.code === 200) {
            this.$message({
              type: 'success',
              message: '删除成功'
            });
            this.pageNo = 1;
            this.searchTitle = '';
            this.getPrintSeniorOfficeList();
          }
        }).catch(() => {
        });
      },
      handleSizeChange(val) {
        this.pageNo = 1;
        this.pageSize = val;
        this.getPrintSeniorOfficeList();
      },
      handleCurrentChange(val) {
        this.pageNo = val;
        this.getPrintSeniorOfficeList();
      }
    }
  }
</script>

<style lang="scss" scoped>
  .guide_group_list_wrap {
    padding:12px;

    .header {
      padding-bottom: 10px;
    }
  }
</style>
