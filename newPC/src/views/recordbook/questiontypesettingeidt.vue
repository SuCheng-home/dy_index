<template>
<div class="questiontypesettingeidt"  >
     <div class="top"> 
         <el-button @click="$router.back()" type="default" size="medium">返回</el-button>      
         <el-button type="primary" @click="updateScoreBookSets('ruleForm')"  size="medium" >保存</el-button>   
         <el-button type="primary" size="medium" @click="questiontypesettingSetupone()">题型设置</el-button> 
         <el-button type="primary" size="medium" @click="questiontypesettingSetuptwo()">考试类型设置</el-button>   
      </div>
     <div class="subject Dictionariesadd" :style="`height: ${nobottommaxH}px;`">
       <div class="body">
         <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="140px" class="demo-ruleForm">
                    <el-form-item label="学科" prop="currId">
                       <el-select v-model="ruleForm.currId" filterable placeholder="请选择学科">
                         <el-option :label="item.name" :value="item.id"  v-for="(item,index) in currlist" :key="index"></el-option>
                       </el-select>
                    </el-form-item>
                     <el-form-item label="年级" prop="level">
                       <el-select v-model="ruleForm.level" placeholder="请选择年级">
                         <el-option :label="item.name" :value="item.level"  v-for="(item,index) in gradelist" :key="index"></el-option>
                       </el-select>
                    </el-form-item>
                    <el-form-item label="考试类型" prop="onelist">
                        <el-checkbox-group v-model="ruleForm.onelist">
                            <el-checkbox :label="item.id" name="type" v-for="(item,index) in examTypelist" :key="index">{{item.value}}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item label="题型" prop="twolist">
                        <el-checkbox-group v-model="ruleForm.twolist">
                            <el-checkbox :label="item.id" name="type" v-for="(item,index) in questionTypelist" :key="index">{{item.value}}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
        </el-form>
       </div>         
     </div>
</div> 
</template>
<script>
import { querySchoolAllCourse,querySchoolGrade,updateScoreBookSet,findSchoolDicsByCode,getScoreBookSetInfo} from "@/api/recordbook";
import mixin from "@/mixins/windowResize";
export default {
  data() {   
    return {
      ruleForm: {
        currId:'',//科目id	number	
        currLogo:'',//	科目图片	string	
        currName:'',//	科目名称	string	
        examTypeJSon:[],//	考试类型	array<object>
        level:1,//	等级	number	
        levelName:'',//	等级名称	string	
        questionTypeJSon:[],//	题型	array<object>
        onelist:[],
        twolist:[],
        id: this.$route.query.id, //	主键ID	number
      },
      currlist:[],
      gradelist:[],
      examTypelist:[],
      questionTypelist:[],
      rules: {
          currId: [{ required: true, message: '请选择学科', trigger: 'change' }],
          level: [{ required: true, message: '请选择年级', trigger: 'change' }],
          onelist: [{ type: 'array', required: true, message: '请至少选择一个考试类型', trigger: 'change' }],
          twolist: [{ type: 'array', required: true, message: '请至少选择一个题型', trigger: 'change' }]
      }
    };
  },
  mixins: [mixin],
  created() {
      this.querySchoolAllCourses();
      this.querySchoolGrades();
      this.findSchoolDicsByCodes();
      this.getScoreBookSetInfos();
  },
  methods: {
    //获取详情
    getScoreBookSetInfos(){
        getScoreBookSetInfo(this.ruleForm.id).then(res => {
           const data = res.data.data;
           this.ruleForm.level=data.level;
           this.ruleForm.currId=data.currId;
           for(let i=0;i<data.examTypeList.length;i++){
             if(data.examTypeList[i].joinQuestion){
                this.ruleForm.onelist.push(data.examTypeList[i].typeId)
             }
           };
           for(let i=0;i<data.questionTypeList.length;i++){
               this.ruleForm.twolist.push(data.questionTypeList[i].typeId)
           };
        })
        .catch(err => {});
    },
    //获取所有科目
    querySchoolAllCourses(){
        querySchoolAllCourse().then(res => {
           const data = res.data.data;
           this.currlist=data;
        })
        .catch(err => {});
    },
    //获取年级
    querySchoolGrades(){
        querySchoolGrade().then(res => {
            const data = res.data.data;
            this.gradelist=data;
            
        })
        .catch(err => {});
    },
     //题型设置
    questiontypesettingSetupone() {
      this.$router.push({
        path: "questiontypesettingSetupone"
      });
    },
    //考试类型设置
    questiontypesettingSetuptwo() {
      this.$router.push({
        path: "questiontypesettingSetuptwo"
      });
    },
    //获取考试类型,题型
    findSchoolDicsByCodes(){
        findSchoolDicsByCode('scoreBookExamType').then(res => {
           const data = res.data.data;
           this.examTypelist=data;
        }).catch(err => {});
        findSchoolDicsByCode('scoreBookQuestionType').then(res => {
           const data = res.data.data;
           this.questionTypelist=data;
        }).catch(err => {});
    },
    //保存
    updateScoreBookSets(ruleForm) {
      this.$refs[ruleForm].validate(valid => {
        if (valid) {
            this.ruleForm.examTypeJSon=[];
            this.ruleForm.questionTypeJSon=[];
          for(let i=0;i<this.currlist.length;i++){
              if(this.ruleForm.currId==this.currlist[i].id){
                  this.ruleForm.currName=this.currlist[i].name;
                  this.ruleForm.currLogo=this.currlist[i].logoUrl;
              };
          };
          for (let i = 0; i < this.gradelist.length; i++) {
            if (this.ruleForm.level == this.gradelist[i].level) {
              this.ruleForm.levelName = this.gradelist[i].name;
            }
          }
          let is = false;
          for (let i = 0; i < this.examTypelist.length; i++) {
            is = false;
            for (let j = 0; j < this.ruleForm.onelist.length; j++) {
              if (this.ruleForm.onelist[j] == this.examTypelist[i].id) {
                this.ruleForm.examTypeJSon.push({
                  typeId: this.examTypelist[i].id,
                  typeName: this.examTypelist[i].value,
                  joinQuestion: 1
                });
                is = true;
              }
            }
            if (!is) {
              this.ruleForm.examTypeJSon.push({
                typeId: this.examTypelist[i].id,
                typeName: this.examTypelist[i].value,
                joinQuestion: 0
              });
            }
          };
          for(let i=0;i<this.ruleForm.twolist.length;i++){
              for(let j=0;j<this.questionTypelist.length;j++){
                 if(this.ruleForm.twolist[i]==this.questionTypelist[j].id){
                  this.ruleForm.questionTypeJSon.push({
                      typeId:this.questionTypelist[j].id,	
                      typeName:this.questionTypelist[j].value
                  })
                 };
              };              
          };
          this.ruleForm.questionTypeJSon=JSON.stringify(this.ruleForm.questionTypeJSon);
          this.ruleForm.examTypeJSon=JSON.stringify(this.ruleForm.examTypeJSon);
          updateScoreBookSet(this.ruleForm)
            .then(res => {
              const data = res.data;
              if (data.code == 200) {
                this.$message({
                  message: "保存成功！",
                  type: "success",
                  duration: 1000
                });
                this.$router.back();
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
    }
  }
};
</script>
<style lang="scss" scoped>
.questiontypesettingeidt {
 padding:12px;
  .top {
    border-bottom: 1px solid #e7eaec;
    padding-bottom: 10px;
  }
  .subject {
    padding-top: 10px;
    overflow: auto;
    .body{
      width: 810px;
      margin: 0 auto;
    }
    .el-form {
      padding-top: 20px;
      .el-select {
        width: 100%;
      }
    }
  }
}
</style>