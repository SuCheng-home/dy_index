<template>
<div class="growthArchivesindextwo">
 <!-- <el-tabs type="border-card" v-model="activeName"  @tab-click="activeNamefun()">
  <el-tab-pane label="园内" name="one"></el-tab-pane>
  <el-tab-pane label="家长" name="two"> -->
      <div class="top">
         <el-col :span="19">
            <el-select class="filter-item" style="width:220px" size="medium" v-model="query.schoolTimeId" placeholder="请选择学期" @change="getGradeByTermIds()">
                <el-option v-for="item in schoolTimelist" :key="item.id" :label="item.schoolTimeName"  :value="item.id"></el-option>
            </el-select>
            <el-select class="filter-item"  size="medium" v-model="query.activityTypeCode" placeholder="请选择类型"  @change="searchHandler()">
                <el-option label="全部类型"  value="0"></el-option>
                <el-option v-for="item in typelist" :key="item.typeCode" :label="item.typeName"  :value="item.typeCode"></el-option>
            </el-select>
             <el-select v-if="myisclass"  size="medium" v-model="query.gradeId" placeholder="请选择年级" @change="getClassByGradeIds()">
                      <el-option label="全部年级" :value="0"></el-option>
                      <el-option v-for="item in gradeList" :key="item.id" :label="item.name" :value="item.id">
                      </el-option>
        </el-select>
        <el-select size="medium" v-model="query.classId" placeholder="请选择班级" @change="searchHandler()" v-if="query.gradeId&&myisclass">
                      <el-option label="全部班级" :value="0"></el-option>
                      <el-option v-for="item in classList" :key="item.id" :label="item.name" :value="item.id">
                      </el-option>
                  </el-select>
             <el-select  v-if="(!myisclass)&&classList.length"   size="medium" v-model="query.classId" placeholder="请选择班级" @change="searchHandler()" >
                      <el-option v-for="item in classList" :key="item.departId" :label="item.clazzName" :value="item.departId">
                      </el-option>
                  </el-select>
        </el-col>
        <el-col :span="5">
           <el-input size="medium" placeholder="请输入活动名称" v-model.trim="query.searchTitle"  @change="searchHandler()">
            <el-button slot="append" icon="el-icon-search"  @click="searchHandler()"></el-button>
          </el-input>
        </el-col>
      </div>
      <div class="body">          
          <el-table stripe :data="dataList" border fit highlight-current-row   style="width: 100%" :height="`${maxH}px`">               
           <el-table-column align="center" label="类型" width="100" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{scope.row.typeName}}</span>
                </template>
            </el-table-column>
             <el-table-column align="center" label="活动名称"  show-overflow-tooltip>
                <template slot-scope="scope">
                    <span class="link" @click="growthArchivesindextwodetails(scope.row.id,scope.row.createUserId)">{{scope.row.activityName}}</span>
                </template>
            </el-table-column> 
            <el-table-column align="center" label="日期" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{scope.row.activityDate}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="发布者" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{scope.row.createUser}}（{{scope.row.classNames}}）</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="150" v-if="myishide">
                <template slot-scope="scope">
                     <el-button size="small" type="text" @click.native="deleteGrowthArchivesActivityByIds(scope.row.id)"  class="buttontextred">删除</el-button>
                </template>
            </el-table-column>
        </el-table>  
           <div class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="query.pageNo" :page-sizes="[10,20,30, 50]" :page-size.sync="query.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="query.total"> </el-pagination>
        </div> 
      </div>
  <!-- </el-tab-pane>
</el-tabs> -->
</div> 
</template>
<script>
import mixin from "@/mixins/windowResize";
import { mapGetters } from "vuex";
import {
  getSchoolTimeAllList,
  getGrowthArchivesActivityPageList,
  deleteGrowthArchivesActivityById,possessRole,getSchoolGrowthTypeDicList,getGradeByTermId,getClassByGradeId,queryClassManagerListByTermIdAndUid
} from "@/api/growthArchives";
export default {
  data() {
    return {
      activeName: "two",
      query: {
        activityKeys: "", //	关键字","分割	string
        activityTypeCode: "0", //	活动类型code	string
        classId: 0, //	班级ID	number
        gradeId: 0, //	年级ID	number
        pageNo: 1, //	pageNo	number
        pageSize: 20, //	pageSize	number
        schoolTimeId: "", //	学期ID	number
        searchTitle: "", //	模糊查询	string
        type: "2", //	类型 1园内 2个人	number
        total: null
      },
      dataList: [],  
      myishide:false,
      myisclass:false,
      typelist:[],
      classList:[],
      gradeList:[]
    };
  },
   computed: {
    ...mapGetters(["userInfo","schoolInfo"])
  },
  mixins: [mixin],
  mounted() {
    //是不是可以删除
    possessRole('11,131,10086').then(res => {
         this.myishide = res.data.data.result;
    });    
    getSchoolGrowthTypeDicList()
      .then(res => res.data)
      .then(data => {
        this.typelist = data.data;
      });
    getSchoolTimeAllList()
      .then(res => {
        for (let item of res.data.data) {
          if (item.isCurrent == 1) {
            this.query.schoolTimeId = item.id;
          }
        }
        this.schoolTimelist = res.data.data;
        //拿全部年级班级
        possessRole('29,10086').then(res => {
           this.myisclass=res.data.data.result;
           this.getGradeByTermIds();
        });
       
      })
      .catch(err => {});
  },
  methods: {
    //获取班主任副班主任负责班级
    queryClassManagerListByTermIdAndUids(){
         queryClassManagerListByTermIdAndUid(this.query.schoolTimeId).then(res => res.data).then(data => {
            this.classList = data.data;
            this.query.total = 0;
            this.dataList = [];
            this.query.gradeId=this.classList[0].gradeId;
            this.query.classId=this.classList[0].departId;
             this.getGrowthArchivesActivityPageLists();
       });
    },
     //获取年级
    getGradeByTermIds(){
      if(this.myisclass){
           getGradeByTermId(this.schoolInfo.id,this.query.schoolTimeId).then(res => res.data).then(data => {
            this.gradeList = data.data;
            this.query.gradeId=0;
            this.getGrowthArchivesActivityPageLists();
          });
      }else{
         this.queryClassManagerListByTermIdAndUids();
      }      

    },
    //获取班级
    getClassByGradeIds(){
    if(this.query.gradeId!=0){        
       getClassByGradeId(this.schoolInfo.id,this.query.schoolTimeId,this.query.gradeId).then(res => res.data).then(data => {
            this.classList = data.data;
       });
      }else{
        this.classList=[]
      }
      this.query.classId=0;
      this.searchHandler();
    },
    growthArchivesindextwodetails(id,stuId){
      this.$router.push({path: "growthArchivesindextwodetails",query: {id: id,stuId:stuId}});     
    },   
    //删除
    deleteGrowthArchivesActivityByIds(id) {
      this.$confirm("确认要删除吗？", "删除", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        lockScroll: false
      }).then(() => {         
          deleteGrowthArchivesActivityById(id).then(res => {
            if (res.data.code === 200) {
              this.$message.success("删除成功！");
               this.searchHandler();
            } else {
              this.$message.error(res.data.msg);
            }
          });
        })
        .catch(() => {});
    },  
    getGrowthArchivesActivityPageLists() {
      if(!this.myisclass){
        for(let i=0;i<this.classList.length;i++){
          if(this.query.classId==this.classList[i].departId){
            this.query.gradeId=this.classList[i].gradeId;
          }
        }
      }
      
      getGrowthArchivesActivityPageList(this.query)
        .then(res => res.data)
        .then(data => {
          this.query.total = data.data.pagination.total;
          this.dataList = data.data.dataList;
        });
    },
    activeNamefun() {
      if (this.activeName == "one") {
        this.$router.push({
          path: "growthArchivesindexone"
        });
      }
      if (this.activeName == "two") {
        this.$router.push({
          path: "growthArchivesindextwo"
        });
      }
    },
    //搜索
    searchHandler() {
      this.query.pageNo = 1;
      this.getGrowthArchivesActivityPageLists();
    },
    //码数
    handleSizeChange() {
      this.query.pageNo = 1;
      this.getGrowthArchivesActivityPageLists();
    },
    //页数
    handleCurrentChange() {
      this.getGrowthArchivesActivityPageLists();
    }
  }
};
</script>
<style lang="scss" scoped>
.growthArchivesindextwo {
  padding: 10px;
  .top {
    padding-bottom: 10px;
    overflow: hidden;
  }
  .el-select {
    width: 180px;
}
  .link {
    color: #409EFF;
    cursor: pointer;
  }
  * {
    box-sizing: border-box;
    word-break: break-all;
    word-wrap: break-word;
  }
  
}
</style>
