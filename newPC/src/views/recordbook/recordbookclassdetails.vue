<template>
<div class="recordbookclassdetails" >
     <div class="top"> 
          <el-button  @click="$router.back()" type="default" size="medium">返回</el-button>  
          <el-button type="primary" size="medium" @click="examTypenumfun()"  v-if="(currList.length>0)&&(termList.length>0)&&isShowByPermission('/structure/scoreBook/insertClassScoreBook')">创建记分册</el-button> 
     </div>        
     <div class="subject" :style="`height:${maxH+50}px`">
       <div class="ul">
         <div class="li" v-for="(item,index) in dataList" :key="index" >
           <i class="el-icon-delete" @click="deleteClassScoreBooks(item.id)" v-if="isShowByPermission('/structure/scoreBook/deleteClassScoreBook')"></i>
           <span @click="recordbookclassdetailsdetails(item.id,item.schoolTimeName)">{{item.schoolTimeName}}</span>           
         </div>
       </div>
        <div class="Notime" v-if="dataList.length==0">暂无数据</div>  
     </div>
     <el-dialog title="创建记分册" :visible.sync="dialogVisible" size="tiny" :close-on-press-escape='false' :close-on-click-modal='false' :modal-append-to-body='false' top="10%">
           <el-form :model="query" ref="query" label-width="100px" class="demo-ruleForm">
             <el-form-item label="学期" prop="schoolTimeId" :rules="[ { required: true, message: '请选择学期', trigger: 'change' }]">
                <el-select v-model.number="query.schoolTimeId" placeholder="请选择学期">
                  <el-option :label="item.schoolTimeName" :value="item.id"  v-for="(item,index) in termList" :key="index"></el-option>
                </el-select>
             </el-form-item>
             <el-form-item label="考试学科" prop="currlist" :rules="[ { type: 'array', required: true, message: '请至少选择一个考试学科', trigger: 'change' }]">
                <el-checkbox-group v-model="query.currlist">
                            <el-checkbox :label="item.id" name="type" v-for="(item,index) in currList" :key="index">{{item.name}}</el-checkbox>
                 </el-checkbox-group>
             </el-form-item> 
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="insertClassScoreBooks('query')">确定</el-button>
            </span>
        </el-dialog>
</div> 
</template>
<script>
import mixin from "@/mixins/windowResize";
import { isShowByPermission } from "@/utils";
import { findSchoolDicsByCode,queryScoreBookByClassId,getSchoolTimeAllList,insertClassScoreBook,deleteClassScoreBook,getScoreBookSetByGradeId,queryCoursesByClassId} from "@/api/recordbook";
export default {
  data() {
    return {
      dataList: [],
      query:{
        className:this.$route.query.className,
        classId:this.$route.query.classId,
        gradeName:this.$route.query.gradeName,
        gradeId:this.$route.query.gradeId,
        schoolTimeId:'',
        schoolTimeName:'',
        currlist:[],
        currJSon:[]
      },
      dialogVisible:false,
      termList:[],
      currList:[],
      examTypenum:0
    };
  },
  mixins: [mixin],
  mounted() {
    this.queryScoreBookByClassIds();
    this.getSchoolTimeAllLists();
    this.queryCoursesByClassIds();
    findSchoolDicsByCode("scoreBookExamType")
        .then(res => {
          const data = res.data.data;
          if(data){
             this.examTypenum = data.length;
          }          
        })
        .catch(err => {});
  },
  methods: {
    //判断考试类型
    examTypenumfun(){       
       if(this.examTypenum==0){
           this.$message.error("请设置考试类型!");
           return;
       };
       this.dialogVisible = true;
    },
    isShowByPermission,
   //获取详情
    queryScoreBookByClassIds() {
      queryScoreBookByClassId(this.query.classId).then(res => {
        let mydata = res.data.data;
        this.dataList=mydata;
      });
    },
    //获取全部学期
    getSchoolTimeAllLists(){
       getSchoolTimeAllList().then(res => {
            let mydata = res.data.data;
            this.termList = mydata;
            if (mydata.length !== 0) {
               this.query.schoolTimeId = mydata.find(item => item.isCurrent === 1).id;
             }
        });
    },
    //获取科目
    queryCoursesByClassIds(){
        queryCoursesByClassId(this.query.classId).then(res => {
            let mydata = res.data.data;
            this.currList = mydata;
            
        });
    },
    //创建
    insertClassScoreBooks(formName){
      this.$refs[formName].validate((valid) => {
          if (valid) {
              this.query.currJSon=[];
              for(let i=0 ;i<this.currList.length;i++){
                  for(let j=0;j<this.query.currlist.length;j++){
                    if(this.query.currlist[j]==this.currList[i].id){
                            this.query.currJSon.push({
                                currId:this.currList[i].id,//	科目id	number	
                                currLogo:this.currList[i].logoUrl,//	科目图片url	string	
                                currName:this.currList[i].name,//	科目名称
                            })
                    };
                  };    
              };
              this.query.currJSon=JSON.stringify(this.query.currJSon);
              for(let i=0;i<this.termList.length;i++){
                  if(this.query.schoolTimeId==this.termList[i].id){
                      this.query.schoolTimeName=this.termList[i].schoolTimeName;
                    };
              };            
            insertClassScoreBook(this.query).then(res => {
              const data = res.data;
              if (data.code == 200) {
                this.$message({
                  message: "创建成功！",
                  type: "success",
                  duration: 1000
                });
                this.dialogVisible=false;
                this.query.currlist=[];
                this.queryScoreBookByClassIds();
              } else {
                this.$message({
                  message: data.msg,
                  type: "error",
                  duration: 1000
                });
              }
            })
            .catch(err => {});
          } 
        });
      
    },
    //删除
    deleteClassScoreBooks(id){
      this.$confirm("确定要删除吗？", "提示", { type: "warning" })
        .then(() => {
          deleteClassScoreBook(id)
            .then(res => {
              if (res.data.code === 200) {
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
                this.queryScoreBookByClassIds();
              }
            })
            .catch(function(error) {});
        })
        .catch(() => {});
    },
    //详情
    recordbookclassdetailsdetails(id,name){
       this.$router.push({path: 'recordbookclassdetailsdetails', query: { id:id,name:name,className:this.query.className} })
    }
  }
};
</script>
<style lang="scss" scoped>
.recordbookclassdetails {
  padding:12px;
  .top {
    border-bottom: 1px solid #e7eaec;
    padding-bottom: 10px ;
  }
  .subject{
    overflow: auto;
    .ul{
      overflow: auto;      
      .li{
        float: left;
        width: 200px;
        padding: 25px 20px;
        margin: 10px;
        border-radius: 5px;
        color: #409eff;
        background: #ecf5ff;
        border: 1px solid #b3d8ff;
        font-size: 23px;
        text-align: center;
        position: relative;
        cursor:pointer;
        i{
          position: absolute;
          top: 5px;
          right: 5px;
          font-size: 20px;
          color: #f56c6c; 
          
        }
      }
    }
    .Notime{
      text-align: center;
      color: #666;
      line-height: 280px;
      font-size: 16px;
    }
  }
}
</style>