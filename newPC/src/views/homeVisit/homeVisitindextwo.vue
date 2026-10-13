<template>
<div class="homeVisitindextwo">
      <div class="top">
         <el-col :span="19">
            <el-select class="filter-item" style="width:200px" size="medium" v-model="query.schoolTimeId" placeholder="请选择学期" @change="getGradeByTermIds()">
                <el-option v-for="item in schoolTimelist" :key="item.id" :label="item.schoolTimeName"  :value="item.id"></el-option>
            </el-select>
             <el-select v-if="myisclass"   style="width:200px" size="medium" v-model="query.gradeId" placeholder="请选择年级" @change="getClassByGradeIds()">
                      <el-option label="全部年级" :value="0">
                      </el-option>
                      <el-option v-for="item in gradeList" :key="item.id" :label="item.name" :value="item.id">
                      </el-option>
        </el-select>
        <el-select size="medium"  style="width:200px" v-model="query.classId" placeholder="请选择班级" @change="searchHandler()" v-if="myisclass&&query.gradeId">
                       <el-option label="全部班级" :value="0"></el-option>
                      <el-option v-for="item in classList" :key="item.id" :label="item.name" :value="item.id">
                      </el-option>
                  </el-select>
             <el-select  v-if="(!myisclass)&&classList.length"   style="width:200px"  size="medium" v-model="query.classId" placeholder="请选择班级" @change="searchHandler()" >
                      <el-option v-for="item in classList" :key="item.departId" :label="item.clazzName" :value="item.departId">
                      </el-option>
                  </el-select>
                  <el-button @click="homeVisitindextwoup()"  v-if="myisclass"  type="primary" size="medium" >家访字段</el-button>
                  <el-button @click="homeVisitindextwoadd()" type="primary" size="medium" >添加记录</el-button>
                  <a class="export-btn" :href="exportUrl" download="导出" target="_blank" v-if="dataList.length">
                  <el-button class="filter-item" type="primary" icon="upload" size="medium">导出</el-button>
            </a>
        </el-col>
        <el-col :span="5">
           <el-input size="medium" placeholder="请输入学生姓名称" v-model.trim="query.stuName"  @change="searchHandler()">
            <el-button slot="append" icon="el-icon-search"  @click="searchHandler()"></el-button>
          </el-input>
        </el-col>
      </div>
      <div class="body">          
          <el-table stripe :data="dataList" border fit highlight-current-row   style="width: 100%" :height="`${maxH}px`">               
           <el-table-column align="center" label="学号" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.stuNum}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="姓名" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span class="link-type"  @click="homeVisitindextwoinfo(scope.row.id,scope.row.visitState)">{{scope.row.stuName}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="班级" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.className}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="家访状态" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <el-tag  size="mini" v-if="scope.row.visitState==2">已家访</el-tag>
                        <el-tag  size="mini" type="danger"  v-else>未家访</el-tag>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="家访老师" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.visitTeacher?scope.row.visitTeacher:'--'}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="家访方式" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.visitType?scope.row.visitType:'--'}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="家访时间" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.visitTime?scope.row.visitTime:'--'}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="家访地址" show-overflow-tooltip>
                    <template slot-scope="scope">
                       <span >{{scope.row.visitSite?scope.row.visitSite:'--'}}</span>
                    </template>
                </el-table-column>   
                  <el-table-column align="center" label="操作" width="170px" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="delHomeVisitRecord(scope.row.id)" class="buttontextred">删除</el-button>
                        <el-button type="text" size="small" @click="homeVisitindextwoeidt(scope.row.id)">编辑</el-button>
                    </template>
                </el-table-column>  
        </el-table>  
           <div class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="query.pageNo" :page-sizes="[10,20,30, 50]" :page-size.sync="query.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="query.total"> </el-pagination>
        </div> 
      </div>
</div> 
</template>
<script>
import mixin from "@/mixins/windowResize";
import { mapGetters } from "vuex";
import {
  getSchoolTimeAllList,
  possessRole,getGradeByTermId,getClassByGradeId,queryClassManagerListByTermIdAndUid
} from "@/api/growthArchives";
import {getBatchStuHomeVisitPageList,delHomeVisitRecord} from "@/api/homeVisit";
export default {
  data() {
    return {
      exportUrl: '',
      query: {
        classId: 0, //	班级ID	number
        gradeId: 0, //	年级ID	number
        pageNo: 1, //	pageNo	number
        pageSize: 20, //	pageSize	number
        schoolTimeId: "", //	学期ID	number
        batchId:0,//	批次ID	number	
        receiptState:2,//	回执状态 1未回执(未上报) 2已回执(已上报)	number	
        stuName:"",//	学生姓名	string	
        visitState:2,//	家访状态 1未家访 2已家访	number	
        visitTypeId:"",//家访方式 全部传空	string
        addType:2,//
        total: null
      },
      dataList: [],  
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
    getSchoolTimeAllList()
      .then(res => {
        for (let item of res.data.data) {
          if (item.isCurrent == 1) {
            this.query.schoolTimeId = item.id;
          }
        }
        this.schoolTimelist = res.data.data;
        //拿全部年级班级
        possessRole('2').then(res => {
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
             this.getBatchStuHomeVisitPageList();
       });
    },
     //获取年级
    getGradeByTermIds(){
      if(this.myisclass){
           getGradeByTermId(this.schoolInfo.id,this.query.schoolTimeId).then(res => res.data).then(data => {
            this.gradeList = data.data;
            this.getClassByGradeIds();
          });
      }else{
         this.queryClassManagerListByTermIdAndUids();
      }      

    },
    //获取班级
    getClassByGradeIds(){
      this.query.classId=0
    if(this.query.gradeId!=0){        
       getClassByGradeId(this.schoolInfo.id,this.query.schoolTimeId,this.query.gradeId).then(res => res.data).then(data => {
            this.classList = data.data;
            
       });
      }else{
        this.classList=[]
      }
       this.searchHandler();
     
    },
    homeVisitindextwoadd(id,stuId){
      this.$router.push({path: "homeVisitindextwoadd"});     
    },   
    homeVisitindextwoinfo(id){
      this.$router.push({path: "homeVisitindextwoinfo",query: {id: id}});     
    },  
    homeVisitindextwoup(){
      this.$router.push({path: "homeVisitindextwoup"});     
    }, 
     homeVisitindextwoeidt(id){
      this.$router.push({path: "homeVisitindextwoadd",query: {id: id}});     
    },  
     
    //删除
    delHomeVisitRecord(id) {
      this.$confirm("确认要删除吗？", "删除", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        lockScroll: false
      }).then(() => {         
          delHomeVisitRecord(id).then(res => {
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
    getBatchStuHomeVisitPageList() {
      if(!this.myisclass){
        for(let i=0;i<this.classList.length;i++){
          if(this.query.classId==this.classList[i].departId){
            this.query.gradeId=this.classList[i].gradeId;
          }
        }
      }    
       this.exportUrl = `${global.BasePath}structure/homevisit/exportHomeVisitListXls?&addType=2&classId=${this.query.classId}&schoolTimeId=${this.query.schoolTimeId}&gradeId=${this.query.gradeId}&receiptState=${this.query.receiptState}&stuName=${this.query.stuName}&visitState=${this.query.visitState}&token=${this.$store.getters.token}`;  
      getBatchStuHomeVisitPageList(this.query)
        .then(res => res.data)
        .then(data => {
          this.query.total = data.data.pagination.total;
          this.dataList = data.data.dataList;
        });
    },
    //搜索
    searchHandler() {
      this.query.pageNo = 1;
      this.getBatchStuHomeVisitPageList();
    },
    //码数
    handleSizeChange() {
      this.query.pageNo = 1;
      this.getBatchStuHomeVisitPageList();
    },
    //页数
    handleCurrentChange() {
      this.getBatchStuHomeVisitPageList();
    }
  }
};
</script>
<style lang="scss" scoped>
.homeVisitindextwo {
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
