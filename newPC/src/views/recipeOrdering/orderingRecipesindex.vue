<template>
  <div class="orderingRecipesindex">
    <div class="header">              
        <el-select   v-model="schoolTimeId"  placeholder="请选择学期"  @change="changeSchool" size="medium">
            <el-option v-for="(item,index) in schoolYearList" :key="index" :label="item.schoolTimeName" :value="item.id" ></el-option>
        </el-select>
        <el-button type="primary"      size="medium" @click="orderingRecipesadd()">发布食谱</el-button>
          <template v-if="isStandalone">
                <el-button type="primary" size="medium"  @click="jumpToPage('foodbankindex')">菜品库</el-button>
                <el-button type="primary" size="medium" @click="jumpToPage('packageLibraryindex')">套餐库</el-button>
            </template>  
        
    </div>
    <el-table border fit stripe  highlight-current-row style="width: 100%;" :height="maxH" :data="listData">
      <el-table-column align="center" label="食谱周次" show-overflow-tooltip>
        <template slot-scope="scope">
          <span  class="link-type"   @click="orderingRecipesdetails(scope.row.id,scope.row.menuType)">第 {{scope.row.week}} 周</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="类型" show-overflow-tooltip>
        <template slot-scope="scope">
            <span v-if="scope.row.menuType==1">公共</span>
            <span v-if="scope.row.menuType==2">老师</span>
            <span v-if="scope.row.menuType==3">学生</span>
            <span v-if="scope.row.menuType==4">指定范围</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="发布人" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.createName || '--' }}</template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.createDate}}</template>
      </el-table-column>
      <el-table-column align="center" label="状态" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-tag  size="mini" type="info"  v-if="scope.row.isShow == 0">草稿</el-tag>
          <el-tag  size="mini"  v-if="scope.row.isShow == 1">已发布</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="240">
        <template slot-scope="scope">
          <el-button size="small" type="text"   @click="orderingRecipesclone(scope.row.id)">复制</el-button>
          <el-button size="small" type="text"  :disabled="scope.row.isShow==1"  @click="orderingRecipeseidt(scope.row.id)">编辑</el-button>
          <el-button size="small" type="text"  @click="deleteMealMenus(scope.row.id)" class="buttontextred">删除</el-button>
       </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="pageNo"
        :page-sizes="[10,20,30, 50]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import mixin from "@/mixins/windowResize";
import moment from "moment";
import {mapGetters} from 'vuex';
import { deleteMealMenu, getSchoolTimeAllList,queryMealMenu} from "@/api/recipeOrdering";
export default {
  data() {
    return {
      schoolYearList: [],
      schoolTimeId: "",
      pageNo: 1,
      pageSize: 20,
      listData: [],
      total: 0,
      myschoolTimeId:'',
      myschoolTimeName:''
    };
  },
  created() {
    this.departCode = 0;
    this.departName = "";
    this.getSchoolTimeAllListFunc();
  },
  computed: {
            ...mapGetters(['isStandalone'])
        },
  mounted() {},
  mixins: [mixin],
  methods: {
     jumpToPage(path, query = {}) {
                this.$router.push({
                    path,
                    query
                })
            },
    deleteMealMenus(id) {
      let _this = this;
      this.$confirm("您确定删除吗?", "删除", {
        type: "error"
      })
        .then(() => {
          deleteMealMenu(id).then(res => {
            let data = res.data;
            if (data.code === 200) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.queryMealMenus();
            } else {
              this.$message({
                type: "error",
                message: data.msg
              });
            }
          });
        })
        .catch(() => {});
    },
    handleSizeChange(val) {
      this.pageNo = 1;
      this.pageSize = val;
      this.queryMealMenus();
    },
    handleCurrentChange(val) {
      this.pageNo = val;
      this.queryMealMenus();
    },
    queryMealMenus() {
      queryMealMenu({
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        schoolTimeId: this.schoolTimeId
      })
        .then(res => res.data)
        .then(data => {
          if (data.code === 200 && data.data) {
            let goData = data.data;
            this.listData = goData.dataList;
            this.total = goData.pagination.total;
          }
        })
        .catch(() => {});
    },
    changeSchool(val) {
      this.pageNo = 1;
      this.schoolTimeId = val;
      let schoolItem = this.schoolYearList.find(item => item.id == val);
      this.schoolName = schoolItem.schoolTimeName;
      this.queryMealMenus();
    },
    getSchoolTimeAllListFunc() {
      //学期列表
      getSchoolTimeAllList()
        .then(res => res.data)
        .then(data => {
          this.schoolYearList = data.data;
          this.schoolYearList.forEach(item => {
            if (item.isCurrent == 1) {
              this.myschoolTimeName = item.schoolTimeName;
              this.schoolTimeId = item.id;
              this.myschoolTimeId=item.id;
              this.queryMealMenus();
            }
          });
        });
    },
    // 详情页
    orderingRecipesdetails(id,menuType) {
      this.$router.push({
        path: "orderingRecipesdetails",
        query: {id: id,menuType:menuType}
      });
    },
    //编辑
    orderingRecipeseidt(id) {
      this.$router.push({
        path: "orderingRecipeseidt",
        query: {id: id}
      });
    },
    //复制
    orderingRecipesclone(id) {
      this.$router.push({
        path: "orderingRecipesclone",
        query: {id: id,schoolTimeId: this.myschoolTimeId,schoolTimeName:this.myschoolTimeName}
      });
    },
    //新增
    orderingRecipesadd() {
      this.$router.push({
        path: "orderingRecipesadd",
        query: {schoolTimeId: this.myschoolTimeId,schoolTimeName:this.myschoolTimeName}
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.orderingRecipesindex {
  padding:12px;
  box-sizing: border-box;
  .header {
    padding-bottom: 10px;
  }
}
</style>
