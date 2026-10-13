<template>
    <div class="teachingPerformancedetails">
       <div class="top"> 
         <el-button @click="$router.back()" type="default" size="medium">返回</el-button> 
         <el-button type="primary" size="medium"   @click="teachingPerformancelistone()">查看统计</el-button>     
      </div>
        <div class="body" :style="`height: ${nobottommaxH}px;`">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="180px" class="demo-ruleForm">
                <div class="ul-top"><span></span>绩效信息</div>
                <el-form-item label="主题" prop="themeName">
                   {{ruleForm.themeName}}
                </el-form-item>                
                <el-form-item label="绩效MAX" prop="performanceMax">
                   {{ruleForm.performanceMax}}
                </el-form-item>
                <el-form-item label="绩效MIN" prop="performanceMin">
                   {{ruleForm.performanceMin}}
                </el-form-item>
                <el-form-item label="均分第一增加百分比" prop="avgPercent">
                   {{ruleForm.avgPercent}}%
                </el-form-item>
                <el-form-item label="优秀率第一增加百分比" prop="goodPercent">
                    {{ruleForm.goodPercent}}%
                </el-form-item>
                <el-form-item label="教师绩效综合值评估方式" prop="appraiseWay">
                    <span v-if="ruleForm.appraiseWay==0">平均</span>
                    <span v-if="ruleForm.appraiseWay==1">占比</span>
                </el-form-item>
                 <el-form-item label="最高绩效综合值占比" prop="maxPercent" v-if="ruleForm.appraiseWay==1">
                    {{ruleForm.maxPercent}}%
                </el-form-item>
                 <el-form-item label="最低绩效综合值占比" prop="minPercent" v-if="ruleForm.appraiseWay==1">
                    {{ruleForm.minPercent}}%
                </el-form-item>
                <el-form-item label="卓越奖比例" prop="excellence">
                   {{ruleForm.excellence}}
                </el-form-item>
                <el-form-item label="优秀奖比例" prop="good">
                    {{ruleForm.good}}
                </el-form-item>
                <el-form-item label="合格奖比例" prop="pass">
                    {{ruleForm.pass}}
                </el-form-item>
                <div class="ul-top"><span></span>考试数据</div>
                <div class="ul">
                    <div class="li"><span class="one">年级</span><span class="two"><span>*</span>本次考试数据</span><span  class="two">上次考试数据</span></div>
                    <div class="li" v-for="(item,index) in relativeJSONlist" :key="index">
                        <span class="one">{{item.gradeName}}</span>
                        <span class="two"> {{item.firstExamName}}</span>
                        <span class="two">{{item.secondExamName?item.secondExamName:'----'}}</span>
                  </div>
                </div>
            </el-form>
        </div> 
          
    </div>
</template>
<script>
    import {getTeacherAppraiseBatchById} from '@/api/teachingPerformance';
    import mixin from '@/mixins/windowResize';
    export default {
        data() {
            return {
               id:this.$route.query.id,
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
                relativeJSONlist:[]
            }
        },
        created() {
           this.getTeacherAppraiseBatchByIds();  
        },
       
        mixins: [mixin],       
        methods: {            
            getTeacherAppraiseBatchByIds(){
              getTeacherAppraiseBatchById(this.id).then(res=>{                
                    let mydata=res.data.data;
                    this.ruleForm=mydata;
                     this.relativeJSONlist=mydata.relativeList
                }).catch();
            },
            //列表
            teachingPerformancelistone(){
                this.$router.replace({
                    path: "teachingPerformancelistone",
                    query: {id: this.id}
                });
            },
       
           
        }
    }
</script>
<style lang="scss" scoped>
.teachingPerformancedetails {
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
        .el-form-item{
                margin-bottom: 10px;
        }
        .ul-top{
            height: 40px;
            line-height: 40px;
            background-color: #ECF8FF;
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
                line-height: 30px;
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
