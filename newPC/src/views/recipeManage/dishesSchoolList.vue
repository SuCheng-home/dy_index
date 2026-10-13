<template>
  <div class="app-container">
    <el-row style="padding-bottom:10px">
      <el-col :span="19">
        <el-button class="filter-item" size="medium" @click="goBack">返回</el-button>
        <el-button class="filter-item" size="medium" type="primary" @click="handleMultAdd">添加到菜品列表</el-button>
      </el-col>
      <el-col :span="5">
        <el-input size="medium" placeholder="请输入菜品名称" v-model.trim="listQuery.searchName" @change="handleInputChange">
          <el-button size="medium" slot="append" icon="el-icon-search" @click="handleInputChange"></el-button>
        </el-input>
      </el-col>
    </el-row>

    <el-table stripe :data="list" v-loading.body="listLoading" border fit highlight-current-row :height="maxH - 1"
              @selection-change="handleSelectionChange" ref="mainTable">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column align="center" label="菜品">
        <template slot-scope="scope">
          <span>{{scope.row.dietName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="图片">
        <template slot-scope="scope">
            <span v-if="scope.row.dietLogo" class="link-type">
              <image-previewer :images="getViewPic(scope.row.dietLogo)" tag="img" text="预览"></image-previewer>
            </span>
          <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="类型">
        <template slot-scope="scope">
          <span>{{scope.row.dietTypeName}}</span>
        </template>
      </el-table-column>
    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page.sync="listQuery.pageNo" :page-sizes="[10,20,30, 50]"
                     :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import _ from 'lodash';
  import mixin from '@/mixins/windowResize';
  import ImagePreviewer from '@/components/ImagePreviewer/ImagePreviewer.vue';
  import Uploader from "@/components/Uploader/WebUploader";
  import {queryCommonDietList, batchInsertDietSchool} from '@/api/dishesPlatform';

  export default {
    name: "dishesSchoolList",
    components: {
      ImagePreviewer,
      Uploader
    },
    data: function () {
      return {
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          pageNo: 1,
          pageSize: 20,
          searchName: '',
        },
        multipleSelection: [],
      }
    },
    mixins: [mixin],
    created() {
      this.getRecipeList();
    },
    methods: {
      goBack() {
        this.$router.back();
      },
      handleMultAdd() {
        if (!this.multipleSelection.length) {
          this.$message({
            message: '请选择要添加到列表的菜品',
            type: 'warning'
          });
        } else {
          this.$confirm('确定要载入选中的菜品吗？', '提示', {
            type: 'success'
          }).then(() => {
            let arr = this.multipleSelection.map(obj => {
              return obj.id
            });
            batchInsertDietSchool({dietCommonIds: arr.toString()}).then(res => {
              if (res.data.code === 200) {
                this.$message({
                  type: 'success',
                  message: '载入成功!'
                });
              }
              this.getRecipeList();
            }).catch(function (error) {
            });
          }).catch(() => {
          });
        }
      },
      handleSelectChange() {
        this.getRecipeList()
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handleInputChange: _.throttle(
        function () {
          this.getRecipeList()
        },
        1000
      ),
      getRecipeList() {
        this.listLoading = true;
        queryCommonDietList(this.listQuery).then(res => {
          this.list = res.data.data.dataList;
          if (this.list.length === 0 && this.listQuery.pageNo !== 1) {
            this.listQuery.pageNo--;
            this.getRecipeList();
          }
          this.total = res.data.data.pagination.total;
          this.listLoading = false;

        })
      },
      handleSizeChange(val) {
        this.listQuery.pageSize = val;
        this.getRecipeList();
      },
      handleCurrentChange(val) {
        this.listQuery.pageNo = val;
        this.getRecipeList();
      },
      getViewPic(picUrl) {
        return [{'src': picUrl}];
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  .redColor {
    color: red;
  }

  .recipe_img_wrapper img {
    width: 200px;
  }
</style>
