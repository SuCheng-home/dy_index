<template>
  <div class="app-container">
    <el-row style="padding-bottom:10px">
      <el-col :span="19">
        <el-button class="filter-item" size="medium" type="primary" @click="toAddRecipe('')">添加食谱</el-button>        
        <el-button class="filter-item" size="medium" type="primary" @click="toSchoolDiet">学校菜品库</el-button>
        <el-button class="filter-item" size="medium" v-if="list.length" type="primary" @click="exportFile">导出</el-button>
        <el-button class="filter-item" size="medium" type="danger" @click="handleMultDelete">删除</el-button>
      </el-col>
      <el-col :span="5">
        <el-input size="medium" placeholder="请输入菜谱名称" v-model.trim="listQuery.searchName" @change="handleInputChange">
          <el-button size="medium" slot="append" icon="el-icon-search" @click="handleInputChange"></el-button>
        </el-input>
      </el-col>
    </el-row>

    <el-table stripe :data="list" v-loading.body="listLoading" border fit highlight-current-row :height="maxH - 1"
              @selection-change="handleSelectionChange" ref="mainTable">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column align="center" label="名称" show-overflow-tooltip>
        <template slot-scope="scope">
          <span style="color: #409eff;cursor: pointer;" @click="toDietInfo(scope.row)">{{scope.row.dietMenuName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建人">
        <template slot-scope="scope">
          <span>{{scope.row.userName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="展示时间">
        <template slot-scope="scope">
          <span>{{scope.row.weekMonday}}~{{scope.row.weekSunday}}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="类型">
        <template slot-scope="scope">
          <span>{{scope.row.dietMenuTypename}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态">
        <template slot-scope="scope">
          <span>
            <el-tag  size="mini"  type="success" v-if="scope.row.isShow === 1">已发布</el-tag>
            <el-tag  size="mini"  type="danger" v-else>未发布</el-tag>
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button size="small" type="text" @click="toAddRecipe(scope.row.id,scope.row.isShow)">编辑</el-button>
          <el-button size="small" type="text" @click="deleteRecipe(scope.row.id)" class="buttontextred">删除</el-button>
          <el-button size="small" type="text"  @click="remindRecipe(scope.row.id)">提醒</el-button>
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
  import {queryDietMenuListBySchoolId, deleteDietMenu, remindDiet} from '@/api/dishesPlatform';

  export default {
    name: "recipeManageList",
    components: {
      ImagePreviewer,
      Uploader
    },
    data() {
      return {
        loadConfirm: false,
        isShowAddBox: false,
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          pageNo: 1,
          pageSize: 20,
          searchName: '',
        },
        multipleSelection: []
      }
    },
    mixins: [mixin],
    created() {
      this.getRecipeList();
    },
    methods: {
      toDietInfo(dietItem) {
        this.$router.push({path: 'info', query: {recipeId: dietItem.id, isShow: dietItem.isShow}});
      },
      toAddRecipe(id,isShow) {
        this.$router.push({path: 'add', query: id ? {recipeId: id,isShow:isShow} : {}});
      },
      toSchoolDiet() {
        this.$router.push({path: 'platformList'});
      },
      handleSelectChange() {
        this.getRecipeList()
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      deleteRecipe(id) {
        this.$confirm('确定要删除吗？', '提示', {
          type: 'warning'
        }).then(() => {
          deleteDietMenu({dietMenuIds: id}).then(res => {
            if (res.data.code === 200) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
            }
            this.getRecipeList();
          }).catch(function (error) {
          });
        }).catch(() => {
        });
      },
      remindRecipe(id) {
        this.$confirm('确定要发送提醒吗？', '提示', {
          type: 'warning'
        }).then(() => {
          remindDiet({dietMenuId: id}).then(res => {
            if (res.data.code === 200) {
              this.$message({
                type: 'success',
                message: '发送成功!'
              });
            }
          }).catch((error) => {
          });
        }).catch(() => {
        });
      },
      handleMultDelete() {
        if (!this.multipleSelection.length) {
          this.$message({
            message: '请选择要删除的菜谱',
            type: 'warning'
          });
        } else {
          this.$confirm('确定要删除吗？', '提示', {
            type: 'warning'
          }).then(() => {
            let arr = this.multipleSelection.map(obj => {
              return obj.id
            });
            deleteDietMenu({dietMenuIds: arr.toString()}).then(res => {
              if (res.data.code === 200) {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
              }
              this.getRecipeList();
            }).catch(function (error) {
            });
          }).catch(() => {
          });
        }
      },
      exportFile() {
        if (!this.multipleSelection.length) {
          this.$message({
            message: '请选择要导出的菜谱',
            type: 'warning'
          });
        } else {
          this.$confirm('确定要导出吗？', '提示', {
            type: 'warning'
          }).then(() => {
            let arr = this.multipleSelection.map(obj => {
              return obj.id
            });
            window.location.href = `${global.BasePath}structure/diet/exportDietMenu?dietMenuIds=${arr.toString()}&token=${this.$store.getters.token}`;
          }).catch(() => {
          });
        }
      },
      handleInputChange: _.throttle(
        function () {
          this.getRecipeList()
        },
        1000
      ),
      getRecipeList() {
        this.listLoading = true;
        queryDietMenuListBySchoolId(this.listQuery).then(res => {
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
