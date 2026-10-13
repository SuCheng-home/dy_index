<template>
  <div class="guide_group_list_wrap">
    <div class="header">
      <el-row>
        <el-col :span="19">
          <el-button size="medium" @click.native="goBack">返回</el-button>
          <el-button type="primary" size="medium" @click.native="addNewGroup">新建护导组</el-button>
          <el-button type="danger" size="medium" @click.native="deleteSelectGroup">删除</el-button>
          <el-button type="primary" size="medium" @click.native="guideSet">设置</el-button>
          <a :href="guideExportUrl" target="_blank" download="guideExportName">
            <el-button type="primary" size="medium">护导二维码下载</el-button>
          </a>
        </el-col>
        <el-col :span="5">
          <el-input placeholder="请输入护导组名称" v-model.trim="searchName" size="medium" class="search-input"
                    @keyup.enter.native="searchNameHandler">
            <el-button slot="append" icon="el-icon-search" @click="searchNameHandler"
                       :loading="searchLoading"></el-button>
          </el-input>
        </el-col>
      </el-row>
    </div>

    <div>
      <el-table @select="selectionChangeHandler" @select-all="selectionChangeHandler" :data="guideGroupList" border
                stripe :height="maxH - 1" style="width: 100%">
        <el-table-column type="selection" align="center" width="50"></el-table-column>
        <el-table-column label="护导组名称" align="center" prop="groupName" show-overflow-tooltip></el-table-column>
        <el-table-column label="检查员" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.checkerNames || '--'}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="300">
          <template slot-scope="scope">
            <el-button size="small" type="text" @click="editGuideGroup(scope.row.id)">编辑</el-button>
            <el-button size="small" type="text" @click="deleteGuide(scope.row.id)" class="buttontextred">删除</el-button>
            <el-button size="small" type="text" @click="postMaintenance(scope.row.id)">岗位维护</el-button>
            <el-button size="small" type="text" @click="guideTimeSet(scope.row.id)">护导时间设置</el-button>
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
  import {getSchoolGuideGroupPageList, deleteGuideGroup} from '@/api/systemSet/guide';

  export default {
    name: "guideGroupList",
    data() {
      return {
        guideExportUrl: '',
        searchLoading: false,
        selected: [],
        searchName: '',
        pageNo: 1,
        pageSize: 20,
        total: null,
        guideGroupList: [],
      }
    },
    mixins: [mixins],
    created() {
      this.guideExportUrl = global.BasePath + "structure/guide/downloadGuideQrcode?groupId=0&token=" + this.$store.getters.token;
      this.getSchoolGuideGroupPageList();
    },
    methods: {
      goBack() {
        this.$router.back();
      },
      selectionChangeHandler(selection) {
        this.selected = selection.map(item => item.id);
      },
      addNewGroup() {
        this.$router.push({path: 'guideGroupAdd'});
      },
      guideSet() {
        this.$router.push({path: 'guideGroupSet'});
      },
      editGuideGroup(guideGroupId) {
        this.$router.push({path: 'guideGroupAdd', query: {guideGroupId: guideGroupId}});
      },
      postMaintenance(guideGroupId) {
        this.$router.push({path: 'guideList', query: {guideGroupId: guideGroupId}});
      },
      guideTimeSet(guideGroupId) {
        this.$router.push({path: 'guideTimeSet', query: {guideGroupId: guideGroupId}});
      },
      searchNameHandler() {
        this.pageNo = 1;
        this.getSchoolGuideGroupPageList();
      },
      getSchoolGuideGroupPageList() {
        getSchoolGuideGroupPageList({
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          searchName: this.searchName
        }).then(res => {
          const data = res.data;
          if (data.code === 200) {
            this.guideGroupList = data.data.dataList;
            this.total = data.data.pagination.total;
          }
        }).catch(() => {
        });
      },
      deleteSelectGroup() {
        if (!this.selected.length) {
          this.$message({
            message: '请选择护导组!',
            type: 'warning'
          });
          return;
        }
        this.$confirm('是否删除选中的护导组？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteGuideGroup(this.selected.toString());
        }).catch(() => {
        });
      },
      deleteGuide(guideGroupId) {
        this.$confirm('是否删除该护导组？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteGuideGroup(guideGroupId);
        }).catch(() => {
        });
      },
      deleteGuideGroup(guideGroupId) {
        deleteGuideGroup(guideGroupId).then(res => {
          const data = res.data;
          if (data.code === 200) {
            this.$message({
              type: 'success',
              message: '护导组删除成功'
            });
            this.pageNo = 1;
            this.searchName = '';
            this.getSchoolGuideGroupPageList();
          }
        }).catch(() => {
        });
      },
      handleSizeChange(val) {
        this.pageNo = 1;
        this.pageSize = val;
        this.getSchoolGuideGroupPageList();
      },
      handleCurrentChange(val) {
        this.pageNo = val;
        this.getSchoolGuideGroupPageList();
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
