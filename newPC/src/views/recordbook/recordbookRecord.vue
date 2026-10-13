<template>
<div class="recordbookRecord"  >
     <div class="top"> 
         <el-button @click="$router.back()" type="default" size="medium">返回</el-button>      
         <a :href="downLoadHref" target="_blank" download="examName"><el-button type="primary" size="medium">下载模版</el-button></a>          
         <el-upload class="upload-import" :action="uploadPath" :data="uploadData" :show-file-list='false' accept=".xls" :before-upload="beforeAvatarUpload" :on-success="handleAvatarSuccess">
            <el-button type="primary" size="medium">导入成绩</el-button>
         </el-upload>      
      </div>
     <div class="subject">
            <el-table ref="table"  :data="dataList" border :height="nobottommaxH" v-loading.body="listLoading">
                 <el-table-column prop="num"  align="center" label="学号" fixed show-overflow-tooltip></el-table-column>
              <el-table-column  prop="name"  align="center"  label="姓名"  fixed  show-overflow-tooltip></el-table-column>
              <el-table-column  align="center" :label="itemss.currName" v-for="(itemss,indexsss) in currList" :key="indexsss">
                  <el-table-column  align="center" :label="items.typeName" v-for="(items,indexss) in itemss.examTypeList" :key="indexss">
                    <el-table-column v-if="items.joinQuestion" align="center" :label="item.typeName" v-for="(item,indexs) in items.questionTypeList" :key="indexs">
                            <template slot-scope="scope"> 
                                    <el-select v-model="scope.row.list[item.mynum].scoreType" size="mini" placeholder="请选择成绩" @change="insertCurrScoreBookRecords(scope.row.list[item.mynum].id,scope.row.list[item.mynum].scoreType)">
                                      <el-option label=" " :value="0"></el-option>
                                      <el-option label="优" :value="1"></el-option>
                                      <el-option label="良" :value="2"></el-option>
                                      <el-option label="中" :value="3"></el-option>
                                      <el-option label="及格" :value="4"></el-option>
                                      <el-option label="不及格" :value="5"></el-option>
                                      <el-option label="缺考" :value="6"></el-option>
                                    </el-select>    
                              </template>
                    </el-table-column>
                     <template slot-scope="scope" v-if="!items.joinQuestion">
                         <el-select v-model="scope.row.list[items.mynum].scoreType" size="mini" placeholder="请选择成绩" @change="insertCurrScoreBookRecords(scope.row.list[items.mynum].id,scope.row.list[items.mynum].scoreType)">
                                  <el-option label=" " :value="0"></el-option>
                                  <el-option label="优" :value="1"></el-option>
                                  <el-option label="良" :value="2"></el-option>
                                  <el-option label="中" :value="3"></el-option>
                                  <el-option label="及格" :value="4"></el-option>
                                  <el-option label="不及格" :value="5"></el-option>
                                  <el-option label="缺考" :value="6"></el-option>
                                </el-select>   
                     </template> 
                  </el-table-column>
              </el-table-column>
              
           </el-table>
        
     </div>
     <el-dialog title="导入提示" :visible.sync="dialogVisible" size="tiny">
        <span v-html="dataname"></span>
        <span slot="footer" class="dialog-footer">   
            <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
     </el-dialog>
</div> 
</template>
<script>
import {getCurrScoreBookRecord,insertCurrScoreBookRecord} from "@/api/recordbook";
import mixin from "@/mixins/windowResize";
export default {
  data() {   
    return {
      downLoadHref: global.BasePath +"structure/scoreBook/downCurrScoreBookRecord?scoreBookId=" +this.$route.query.id+"&currId="+this.$route.query.currId+"&token=" +this.$store.getters.token, //下载模板
      uploadPath: global.BasePath + "structure/scoreBook/uploadCurrScoreBookRecord",
      uploadData: {
        currId: this.$route.query.currId,
        scoreBookId: this.$route.query.id,
        token: this.$store.getters.token
      },
      listLoading: false,
      dataname:'',
      dialogVisible:false,
      currList:[],
      dataList:[],
       timer:null
    };
  },
  mixins: [mixin],
  created() {
    this.getCurrScoreBookRecords()
  },
  methods: {   
    //获取详情
     getCurrScoreBookRecords(){
       this.listLoading=true;
       this.dataList=[];
        getCurrScoreBookRecord(this.$route.query.id,this.$route.query.currId).then(res => {
          let mydata = res.data.data;
          let datacurr=mydata.curr;
          let num=0;
          let obj={
            currName:datacurr.currName,
            examTypeList:datacurr.scoreBookSet.examTypeList
          }; 
          let questionTypeList=datacurr.scoreBookSet.questionTypeList;
          for(let i=0;i<obj.examTypeList.length;i++){
            if(obj.examTypeList[i].joinQuestion){
              obj.examTypeList[i].questionTypeList=[];              
               for(let j=0;j<datacurr.scoreBookSet.questionTypeList.length;j++){                 
                 obj.examTypeList[i].questionTypeList.push({
                   typeName:datacurr.scoreBookSet.questionTypeList[j].typeName,
                   mynum:num
                 });
                 num++;                 
               };
            }else{
             obj.examTypeList[i].mynum=num;
              num++;
            };
          };
          this.currList =[obj];
          let list = mydata.recordListList;
          for (let i = 0; i < list.length; i++) {
          let obj = {
            name:list[i][0].stuName,
            num:list[i][0].learnNo,
            list:list[i]
          };         
          this.dataList.push(obj);
        };
        this.listLoading=false;
           this.$nextTick(()=>{
                this.timer=setTimeout(()=> {
                this.$refs.table.doLayout()
                },300) 
            })
      });
     },
     //导入
    handleAvatarSuccess(res) {
      if (res.result) {
        this.$message({
          message: "模版导入成功！",
          type: "success"
        });
        this.listLoading = false;
        this.getCurrScoreBookRecords();
      } else {
       this.dialogVisible=true;
       this.dataname=res.msg;
       this.listLoading = false;
       this.getCurrScoreBookRecords();
      }
    },
    beforeAvatarUpload(file) {
      let suffix = file.name.split(".")[file.name.split(".").length - 1];
      if (suffix !== "xls") {
        this.$message.error("请上传后缀为.xls的模版文件!");
        return false;
      } else {
        this.listLoading = true;
      }
    },
    //录分
    insertCurrScoreBookRecords(id,type){
      let list=['','优','良','中','及格','不及格','缺考']
      insertCurrScoreBookRecord(id,list[type],type)
            .then(res => {
              const data = res.data;
              if (data.code == 200) {
                this.$message({
                  message: "录分成功！",
                  type: "success",
                  duration: 1000
                });
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
  }
};
</script>
<style scoped>
  .recordbookRecord .el-table td,
  .recordbookRecord .el-table th {
    padding: 5px 0;
    font-size: 12px;
  }
  .recordbookRecord .el-table .cell,
  .recordbookRecord .el-table th div {
    padding:0;
  }
</style>
<style lang="scss" scoped>
.recordbookRecord {
  padding:12px;
  .top {
    padding-bottom: 10px;
    .upload-import{
        display: inline-block;
    }   
  }
  .subject {
    overflow: auto; 
    .el-select{
      width: 85px;
    }    
  }
}
</style>