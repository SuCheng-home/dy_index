<template>
    <div class="teachingPerformanceadd">
       <div class="top"> 
         <el-button @click="$router.back()" type="default" size="medium">返回</el-button> 
         <el-button type="primary" size="medium"   @click="teachingPerformancelistone('ruleForm')">存并生成绩效表</el-button>     
      </div>
        <div class="body" :style="`height: ${nobottommaxH}px;`">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="180px" class="demo-ruleForm">
                <el-form-item label="主题" prop="themeName">
                    <el-input v-model.trim="ruleForm.themeName"  placeholder="请输入主题" :maxlength='30'></el-input>
                </el-form-item>                
                <el-form-item label="绩效MAX" prop="performanceMax">
                    <el-input-number v-model="ruleForm.performanceMax" :precision="0" :step="1" :min="1" :max="999"></el-input-number>
                </el-form-item>
                <el-form-item label="绩效MIN" prop="performanceMin">
                    <el-input-number v-model="ruleForm.performanceMin" :precision="0" :step="1" :min="1" :max="999"></el-input-number>
                </el-form-item>
                <el-form-item label="均分第一增加百分比" prop="avgPercent">
                    <el-input-number v-model="ruleForm.avgPercent" :precision="0" :step="1" :min="1" :max="999"></el-input-number>%
                </el-form-item>
                <el-form-item label="优秀率第一增加百分比" prop="goodPercent">
                    <el-input-number v-model="ruleForm.goodPercent" :precision="0" :step="1" :min="1" :max="999"></el-input-number>%
                </el-form-item>
                <el-form-item label="教师绩效综合值评估方式" prop="appraiseWay">
                    <el-select v-model="ruleForm.appraiseWay" placeholder="请选择教师绩效综合值评估方式">
                    <el-option label="平均" value="0"></el-option>
                    <el-option label="占比" value="1"></el-option>
                    </el-select>
                </el-form-item>
                 <el-form-item label="最高绩效综合值占比" prop="maxPercent" v-if="ruleForm.appraiseWay==1">
                    <el-input-number v-model="ruleForm.maxPercent" :precision="0" :step="1" :min="1" :max="100"></el-input-number>%
                </el-form-item>
                 <el-form-item label="最低绩效综合值占比" prop="minPercent" v-if="ruleForm.appraiseWay==1">
                    <el-input-number v-model="ruleForm.minPercent" :precision="0" :step="1" :min="1" :max="100"></el-input-number>%
                </el-form-item>
                <el-form-item label="卓越奖比例" prop="excellence">
                    <el-input-number v-model="ruleForm.excellence" :precision="0" :step="1" :min="1" :max="10"></el-input-number>
                </el-form-item>
                <el-form-item label="优秀奖比例" prop="good">
                    <el-input-number v-model="ruleForm.good" :precision="0" :step="1" :min="1" :max="10"></el-input-number>
                </el-form-item>
                <el-form-item label="合格奖比例" prop="pass">
                    <el-input-number v-model="ruleForm.pass" :precision="0" :step="1" :min="1" :max="10"></el-input-number>
                </el-form-item>
                <div class="ul-top"><span></span>考试数据</div>
                <div class="ul">
                    <div class="li"><span class="one">年级</span><span class="two"><span>*</span>本次考试数据</span><span  class="two">上次考试数据</span></div>
                    <div class="li" v-for="(item,index) in relativeJSONlist" :key="index">
                        <span class="one">{{item.gradeName}}</span>
                        <span class="two"> <el-link type="primary" @click="popfun(index,1,item.gradeId)">{{item.firstExamName?item.firstExamName:'请选择考试'}}</el-link></span>
                        <span class="two"> <el-link type="primary" :disabled="!item.firstExamName" @click="popfun(index,2,item.gradeId)">{{item.secondExamName?item.secondExamName:'请选择考试'}}</el-link></span>
                  </div>
                </div>
            </el-form>
        </div> 
        <el-dialog title="选择考试（仅能选择一个或不选）" :close-on-press-escape='false' :close-on-click-modal='false' :visible.sync="dialogVisible" width="800px" :lock-scroll="false" :modal-append-to-body='false'>
			  <div class="list-box">
                 <el-checkbox-group  v-model="checkedCities" :max="1">
                    <el-checkbox v-for="item in checkedlist" :label="item.id" :key="item.id">{{item.examName}}</el-checkbox>
                </el-checkbox-group>
              </div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="cancel()">取 消</el-button>
				<el-button type="primary" @click="determine()">确 定</el-button>
			</span>
		</el-dialog>        
    </div>
</template>
<script>
    import {querySchoolGrade,getCurrentSchoolTimeBySchoolId,getExamListByGradeId,saveTeacherAppraiseBatch} from '@/api/teachingPerformance';
    import mixin from '@/mixins/windowResize';
    import {mapGetters} from 'vuex';
    export default {
        data() {
            return {
               ruleForm:{
                    appraiseWay:'0',//	评选方式，0平均，1占比	number	
                    avgPercent:0,//	均分第一增加百分比	number	
                    excellence:0,//		卓越奖	number	
                    good:0,//		优秀奖	number	
                    goodPercent:0,//		优秀率第一增加百分比	number	
                    maxPercent:0,//		最高绩效综合占比	number	
                    minPercent:0,//		最低绩效综合占比	number	
                    pass:0,//		及格奖	number	
                    performanceMax:0,//		绩效最大值	number	
                    performanceMin:0,//		绩效最小值	number	
                    relativeJSON:'',//		对应考试关系	array<object>	
                    schoolYear:0,//		学年	string	
                    schoolYearId:0,//		学年id	number	
                    themeName:'',//		主题名称	string	
               },
                rules: {
                    themeName: [{ required: true, message: '请输入主题', trigger: 'blur' }],
                    appraiseWay: [{ required: true, message: '请选择教师绩效综合值评估方式', trigger: 'change' }],
                    performanceMax:  [{ required: true, message: '请输入绩效MAX', trigger: 'blur' }],
                    performanceMin:  [{ required: true, message: '请输入绩效MIN', trigger: 'blur' }],
                    avgPercent:  [{ required: true, message: '请输入均分第一增加百分比', trigger: 'blur' }],
                    goodPercent:  [{ required: true, message: '请输入优秀率第一增加百分比', trigger: 'blur' }],
                    maxPercent:  [{ required: true, message: '请输入最高绩效综合值占比', trigger: 'blur' }],
                    minPercent:  [{ required: true, message: '请输入最低绩效综合值占比', trigger: 'blur' }],
                    excellence:  [{ required: true, message: '请输入卓越奖比例', trigger: 'blur' }],
                    good:  [{ required: true, message: '请输入优秀奖比例', trigger: 'blur' }],
                    pass:  [{ required: true, message: '请输入合格奖比例', trigger: 'blur' }],
                },
                relativeJSONlist:[],
                myindex:'',
                mynum:'',
                checkedCities:[],
                dialogVisible:false,
                checkedlist:[]
            }
        },
        computed: {...mapGetters(['schoolInfo']),},
        created() {
           this.getCurrentSchoolTimeBySchoolIds();  
           this.querySchoolGrades();         
        },
       
        mixins: [mixin],       
        methods: { 
            //弹框
            popfun(index,num,id){
                this.myindex=index;
                this.mynum=num;
                if(num==1&&this.relativeJSONlist[index].firstExamName){
                  this.checkedCities=[this.relativeJSONlist[index].firstExamId]
                }
                if(num==2&&this.relativeJSONlist[index].secondExamName){
                  this.checkedCities=[this.relativeJSONlist[index].secondExamId]
                }
                this.dialogVisible=true;                
                this.getExamListByGradeIds(id);
            },
            getExamListByGradeIds(id){
              getExamListByGradeId(id).then(res=>{                
                    let mydata=res.data.data;
                    this.checkedlist=mydata;
                }).catch();
            },
            determine(){
              if(this.checkedCities.length){
                  if(this.mynum==1){                                            
                      this.relativeJSONlist[this.myindex].firstExamId=this.checkedCities[0];
                      for(let i=0;i<this.checkedlist.length;i++){
                          if(this.checkedlist[i].id==this.checkedCities[0]){
                            this.relativeJSONlist[this.myindex].firstExamName=this.checkedlist[i].examName;
                          }
                      }
                  }else{    
                      this.relativeJSONlist[this.myindex].secondExamId=this.checkedCities[0];                  
                      for(let i=0;i<this.checkedlist.length;i++){
                          if(this.checkedlist[i].id==this.checkedCities[0]){
                            this.relativeJSONlist[this.myindex].secondExamName=this.checkedlist[i].examName;
                          }
                      }                      
                  }

              }else{
                  if(this.mynum==1){
                      this.relativeJSONlist[this.myindex].firstExamName='';                      
                      this.relativeJSONlist[this.myindex].firstExamId='0';
                      this.relativeJSONlist[this.myindex].secondExamName='';
                      this.relativeJSONlist[this.myindex].secondExamId='0';
                  }else{
                      this.relativeJSONlist[this.myindex].secondExamName='';
                      this.relativeJSONlist[this.myindex].secondExamId='0';
                  }
              }
              this.checkedCities=[];
              this.dialogVisible=false;
            },
            cancel(){
              this.checkedCities=[];
              this.dialogVisible=false;
            },
            //获取年级
            querySchoolGrades(){
               querySchoolGrade().then(res=>{                
                    let mydata=res.data.data;
                    for(let i=0;i<mydata.length;i++){
                       this.relativeJSONlist.push({
                            firstExamId:'0',	
                            firstExamName:'',
                            gradeId:mydata[i].id,	
                            gradeName:mydata[i].name,	
                            secondExamId:'0',		
                            secondExamName:'',	
                       }) 
                    }
                   
                }).catch();
            },
            //获取当前学年
            getCurrentSchoolTimeBySchoolIds(){
                  getCurrentSchoolTimeBySchoolId().then(res=>{                
                    let mydata=res.data.data;
                    this.ruleForm.schoolYearId=mydata.schoolYearId;
                    this.ruleForm.schoolYear=mydata.schoolYear;
                }).catch();
            },
            //保存
             teachingPerformancelistone(formName) {
                if((this.ruleForm.performanceMin-0)>(this.ruleForm.performanceMax-0)){
                            this.$message.error('绩效MAX需要大于等于绩效MIN！');
                            return;
                }
                if(((this.ruleForm.maxPercent-0)+(this.ruleForm.minPercent-0)!=100)&&(this.ruleForm.appraiseWay==1)){
                            this.$message.error('最高绩效综合值和最低绩效综合值之和要等于100！');
                            return;
                }
                if(((this.ruleForm.excellence-0)+(this.ruleForm.good-0)+(this.ruleForm.pass-0))>10){
                            this.$message.error('卓越奖、优秀奖、合格奖之和要小于等于10！');
                            return;
                }
                let list=[];
                for(let i=0;i<this.relativeJSONlist.length;i++){
                    if(this.relativeJSONlist[i].firstExamName){
                        list.push(this.relativeJSONlist[i])
                    }
                }
                if(list.length==0){
                    this.$message.error('至少要有一个年级选择考试！');
                    return;
                }
               this.ruleForm.relativeJSON=JSON.stringify(list)
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        saveTeacherAppraiseBatch(this.ruleForm).then(res => res.data).then(data => {
                            if(data.code==200) {
                                this.$message({type: 'success', message: '保存成功!' });
                                this.$router.replace({ path: "teachingPerformancelistone", query: {id: data.data} });
                             }
                        })
                    } 
                });
            },    
           
        }
    }
</script>
<style>
.teachingPerformanceadd  .el-checkbox{
    min-width: 215px;
}
</style>

<style lang="scss" scoped>
.teachingPerformanceadd {
  padding:12px;
  .top {
    border-bottom: 1px solid #e7eaec;
    padding-bottom: 10px;
  }
  .list-box{
      max-height: 400px;
      overflow: auto;
  }
  .body {
    padding-top: 10px;
    overflow: auto;
    .demo-ruleForm{
        width: 810px;
        margin: 0 auto;
        .el-select{
            width: 100%;
        }
        .ul-top{
            height: 40px;
            line-height: 40px;
            span{
                width: 4px;
                height: 18px;
                background-color: #409EFF;
                display: block;
                float: left;
                margin: 8.5px 10px 12.5px 15px;
            }
        }
        .ul{
            overflow: hidden;
            width: 100%;
            padding: 20px 10px;
            .li{
                width: 100%;
                overflow: hidden;
                color: #303133;
                line-height: 40px;
                padding: 5px 0;
                font-size: 14px;
                .one{
                        width: 20%;
                         float: left;
                 }
                .two{
                        width: 40%;
                         float: left;
                         span{
                             color: #F56C6C;
                         }
                }
            }
        }
    }
  }
}
</style>
