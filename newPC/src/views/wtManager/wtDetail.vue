<template>
  <div class="wtDetail">
    <div class="el-row menu-tools">
      <el-button @click="goback()" size="medium">返回</el-button>
      <a :href="exportURL"   download="导出结果" target="_blank" v-if="productList&&productList.length!==0">
        <el-button class="filter-item" type="primary" size="medium">导出</el-button>
      </a>
    </div>
    <el-table stripe :data="productList" v-loading.body="listLoading" border fit highlight-current-row
              style="width: 100%" :height="maxH">
      <el-table-column align="center" label="姓名" show-overflow-tooltip>
          <template slot-scope="scope">
              <span>{{scope.row.stuName}}</span>
          </template>
      </el-table-column>
      <el-table-column align="center" label="班级" show-overflow-tooltip>
          <template slot-scope="scope">
              <span>{{scope.row.className}}</span>
          </template>
      </el-table-column>
      <el-table-column align="center" label="物品名称" show-overflow-tooltip>
          <template slot-scope="scope">
              <span>{{scope.row.goodName}}</span>
          </template>
      </el-table-column>
      <el-table-column align="center" label="兑换数量" show-overflow-tooltip>
          <template slot-scope="scope">
              <span>{{scope.row.goodCount}}</span>
          </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                      :current-page.sync="pageNo" :page-sizes="[10,20,30, 50]"
                      :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
                      :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import {stuGoodAnalysisByGoodId} from '@/api/wtManager';
import Cookies from "js-cookie";
import mixin from '@/mixins/windowResize';
export default{
  data(){
    return{
      gooId:'',
      classId:'',
      gradeId:'',
      schoolYearId:'',
      startDate:'',
      endDate:'',
      pageNo:1,
      pageSize:20,
      searchName:'',
      productList:[],
      total:null,
      exportURL:'',
      listLoading:false
    }
  },
  mixins: [mixin],
  created(){
    this.stuGoodAnalysisByGoodIdFunc();
  },
  watch:{
    '$route':{
      handler:function(to,from){
        if(to.query){
          let params=to.query;
          this.goodId=params.goodId;
          this.classId=params.classId;
          this.gradeId=params.gradeId;
          this.schoolYearId=params.schoolYearId;
          this.startDate=params.startDate;
          this.endDate=params.endDate;
        }
      },
      immediate:true
    }
  },
  methods:{
    handleSizeChange(val){
      this.pageSize = val;
      this.stuGoodAnalysisByGoodIdFunc();
    },
    handleCurrentChange(val){
      this.pageNo = val;
      this.stuGoodAnalysisByGoodIdFunc();
    },
    stuGoodAnalysisByGoodIdFunc(){
      stuGoodAnalysisByGoodId({
        pageNo:this.pageNo,
        pageSize:this.pageSize,
        schoolYearId:this.schoolYearId,
        schoolId:this.$store.getters.schoolInfo.id,
        goodId:this.goodId,
        gradeId:this.gradeId,
        classId:this.classId,
        searchName:this.searchName,
        startDate:this.startDate,
        endDate:this.endDate
      }).then(res=>res.data)
      .then(data=>{
        if(data.code===200){
          let productData=data.data;
          this.productList=productData.dataList;
          this.total=productData.pagination.total;
          /*导出*/
          this.exportURL=global.BasePath+'structure/creditPoint/downStuGoodAnalysisByGoodId?classId='+this.classId+'&gradeId='+this.gradeId+'&schoolId='+this.$store.getters.schoolInfo.id+'&goodId='+this.goodId+'&schoolYearId='+this.schoolYearId+'&startDate='+this.startDate+'&endDate='+this.endDate+'&searchName='+this.searchName+'&token='+ this.$store.getters.token;
        }
      })
    },
    goback(){
      this.$router.back();
    }
  }
}
</script>
<style lang="scss" scoped>
.wtDetail{
  padding:12px;
  box-sizing: border-box;
}
.menu-tools {
  padding-bottom: 10px;
}
</style>
