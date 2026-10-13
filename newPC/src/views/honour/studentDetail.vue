<template>
  <div class="studentDetail padding">
    <div class="header clearfix">
      <el-row>
        <el-col :span="24">
          <el-button class="goBack" @click="goBack" type="default" size="medium">返回</el-button>
          <span class="h1">{{detailName}}的创新才能</span>
        </el-col>
      </el-row>
    </div>
    <div>
      <el-table
        ref="multipleTable"
        :data="honourTable"
        border
        stripe
        class="honourTable"
        :height="maxH"
        style="width: 100%">
        <el-table-column
          label="学号" align="center" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.studentNo }}</template>
        </el-table-column>
        <el-table-column
          label="姓名" align="center" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.studentName }}</template>
        </el-table-column>
        <el-table-column
          label="证书名称" align="center" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.honorName }}</template>
        </el-table-column>
        <el-table-column
          label="证书等级" align="center" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.honorTypeName }}</template>
        </el-table-column>
        <el-table-column
          label="证书类型" align="center" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.certType }}</template>
        </el-table-column>

        <el-table-column
          label="获奖类型" align="center" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.awardTypeName }}</template>
        </el-table-column>
        <el-table-column
          label="获奖等级" align="center" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.awardLevelName }}</template>
        </el-table-column>

        <el-table-column
          label="颁发机构" align="center" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.issueOrgan }}</template>
        </el-table-column>
        <el-table-column
          label="颁发时间" align="center" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.issueDate }}</template>
        </el-table-column>
        <el-table-column
          align="center"
                prop="previewImage"
                label="证书图片"
                :resizable="false"
        >
            <template slot-scope="scope">
                <image-previewer
                        class="image-plate"
                        :images="scope.row.schoolHonorStuFileList"
                        tag="img"
                        text="图片预览"
                        v-if="scope.row.schoolHonorStuFileList.length !== 0"
                        style="color: #1992FB"
                >
                </image-previewer>
                <span v-else>--</span>
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
  </div>
</template>
<script>
import mixins from '@/mixins/windowResize';
import {stuSchoolHonorListPage} from '@/api/honour/index';
import ImagePreviewer from '@/components/ImagePreviewer/ImagePreviewer.vue';
export default {
  components: {
      ImagePreviewer
  },
  data(){
    return{
      pageNo:1,
      pageSize:20,
      schoolTimeId:this.$route.query.schoolTimeId,
      gradeId:this.$route.query.gradeId,
      classId:this.$route.query.classId,
      stuId:this.$route.query.stuId,
      honourTable:[],
      total:null,
      listLoading:false,
      detailName:this.$route.query.name
    }
  },
  created(){
    // document.title="机构列表";
    this.stuSchoolHonorListPageFunc();
  },
  mixins:[mixins],
  mounted(){

  },
  methods:{
    goBack(){
      this.$router.push({
        path:'studentList',
        query:{
          schoolTimeId:this.$route.query.schoolTimeId,
          gradeId:this.$route.query.gradeId,
          classId:this.$route.query.classId,
        }
      })
    },
    handleCurrentChange(val){
      this.pageNo=val;
      this.stuSchoolHonorListPageFunc();
    },
    handleSizeChange(val){
      this.pageSize=val;
      this.pageNo=1;
      this.stuSchoolHonorListPageFunc();
    },
    stuSchoolHonorListPageFunc(){
      this.listLoading=true;
      stuSchoolHonorListPage({
        pageNo:this.pageNo,
        pageSize:this.pageSize,
        schoolTimeId:this.schoolTimeId,
        stuId:this.stuId
      }).then(res=>res.data)
      .then(data=>{
        if(data.code===200){
          let honourData=data.data;
          this.honourTable=honourData.schoolHonorStuList;
          // this.detailName=this.honourTable[0].studentName;
          this.honourTable.forEach((item) => {
              if (item.schoolHonorStuFileList !== "" && item.schoolHonorStuFileList.length > 0) {
                  item.schoolHonorStuFileList.forEach((pic) => {
                      pic.src = pic.accessUrl;
                  })
              }
          });
          if(this.honourTable.length==0&&this.pageNo>1){
            this.pageNo--;
            this.stuSchoolHonorListPageFunc();
          }
          this.total=honourData.pagination.total;
          this.listLoading=false;
        }
      }).catch(()=>{
        this.listLoading=false;
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.clearfix:after{
    content:'';
    display: block;
    height:0;
    clear: both;
    visibility: hidden;
}
.padding{
  padding:12px;
  box-sizing: border-box;
}
.studentDetail{
  .header{
    padding-bottom:10px;
    text-align: center;
    .goBack{
      display: block;
      float:left;
    }
    .h1{
      font-size:20px;
      text-align: center;
      font-weight: bold;
      margin-left:40px;
    }
    //border-bottom:1px solid  #e7eaec;
    //margin-bottom:20px;
  }
  .pagination-container{
    margin-top:20px;
  }
}
.addOrganFrom{
  width:80%;
}

</style>
<style scoped>
  .studentDetail  .image-previewer__content img {
        max-height: 100%;
    }
</style>


