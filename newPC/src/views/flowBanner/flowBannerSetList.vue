<template>
  <div class="flow_banner_set_list_wrap">
    <div class="header">
      <el-button size="medium" @click="goBack">返回</el-button>
      <el-button size="medium" type="primary" @click="toSetIndex">添加</el-button>
    </div>
    <div class="flow_banner_set_table_wrap">
      <el-table stripe :data="dataList" style="width: 100%" border highlight-current-row :height="boxH - 200">
        <el-table-column label="流动红旗图标" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.logo" alt="" class="flow_img">
          </template>
        </el-table-column>
        <el-table-column label="流动红旗名称" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.name || '--'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="排序" prop="orderNo" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="small" type="text" @click="deleteFlowBanner(scope.row.id)" class="buttontextred">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import mixins from '@/mixins/windowResize';
  import {getFlowBannerTypeBySchoolId, deleteFlowBannerTypeById} from '@/api/flowBanner';

  export default {
    name: "flowBannerSetList",
    data() {
      return {
        searchLoading: false,
        selectWeek: null,
        currentWeek: null,
        schoolTimeId: null,
        weekList: [],
        dataList: []
      }
    },
    mixins: [mixins],
    created() {
      this.getFlowBannerTypeBySchoolId();
    },
    methods: {
      goBack() {
        this.$router.back();
      },
      toSetIndex() {
        this.$router.push({path: 'typeAdd'});
      },
      getFlowBannerTypeBySchoolId() {
        getFlowBannerTypeBySchoolId().then(res => {
          if (res.data.code === 200) {
            this.dataList = res.data.data;
          }
        }).catch();
      },
      deleteFlowBanner(flowBannerId) {
        this.$confirm('是否删除该流动红旗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteFlowBannerTypeById(flowBannerId);
        }).catch(() => {
        });
      },
      deleteFlowBannerTypeById(flowBannerId) {
        deleteFlowBannerTypeById({id: flowBannerId}).then(res => {
          if (res.data.code === 200) {
            this.$message({
              message: '删除成功',
              type: 'success'
            });
            this.getFlowBannerTypeBySchoolId();
          } else {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            });
          }
        }).catch();
      },
    }
  }
</script>

<style lang="scss" scoped>
  .flow_banner_set_list_wrap {
    padding:12px;

    .header {
      padding-bottom: 10px;
      margin-bottom: 0;
    }

    .flow_banner_set_table_wrap {
      margin: 0 auto;

      .flow_img{
        display: block;
        width: 24px;
        height: 24px;
        margin: 0 auto;
      }
    }
  }
</style>
