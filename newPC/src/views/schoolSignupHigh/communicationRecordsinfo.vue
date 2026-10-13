<template>
    <div class="communicationRecordsinfo">
        <div class="top">
            <el-button  @click="$router.back()" type="default" size="medium">返回</el-button>
        </div>
        <div  class="content" :style="`height:${nobottommaxH}px`">
            <div class="body">
                <div class="box" v-for="(item,index) in dataList" :key="index">
                    <div class="title">
                         {{item.createTime.substring(0, 19)}}
                         <el-tag  size="mini" type="warning">{{item.commMark}}</el-tag>
                    </div>
                   <el-form label-width="120px">
                        <el-form-item label="沟通方式">{{item.commType}}</el-form-item>
                        <el-form-item label="沟通老师">{{item.createUser}}</el-form-item>
                        <el-form-item label="指标生">{{item.quotaStuType}}</el-form-item>
                        <el-form-item label="A志愿">{{item.preferenceA}}</el-form-item>
                        <el-form-item label="B志愿"> {{item.preferenceB}}</el-form-item>
                        <el-form-item label="C志愿">{{item.preferenceC}}</el-form-item>
                        <el-form-item label="待解决问题">{{item.waitSloveIssue}}&nbsp;&nbsp;&nbsp;&nbsp;{{item.waitSloveIssueBz}}</el-form-item>
                        <el-form-item label="承诺">{{item.promiseType}}&nbsp;&nbsp;&nbsp;&nbsp; {{item.promiseLevel}}&nbsp;&nbsp;&nbsp;&nbsp; {{item.promiseRemark}}</el-form-item>
                        <el-form-item label="标记备注">{{item.commMarkRemark}}</el-form-item>                                   
                    </el-form>
                </div>

            </div>
        </div>        
    </div>
</template>
<script>
    import windowResize from "@/mixins/windowResize";
    import {getStudentCommRecordList} from "@/api/schoolSignupHigh";
    export default {
        data() {
            return {
              id: this.$route.query.id,
              dataList:[]
            }
        },
        mixins: [windowResize],       
        created() {
          getStudentCommRecordList(this.id).then(res => res.data)
                .then(data => {
                    this.dataList = data.data;
                });                 
        },
        methods: {
            
        },
    }
</script>
<style>
 .communicationRecordsinfo  .el-form-item{
    margin-bottom: 0
}
</style>

<style lang="scss" scoped>
   .communicationRecordsinfo{
       padding:12px;
       .top{
           padding-bottom: 10px;
           border-bottom: 1px solid #e7eaec;
       }
       .content{
            overflow:auto;
           
            .body{
                margin: 0 auto;
                 width: 810px;
                 margin-top: 10px;
                 .box{
                    background: #efefef;
                    padding: 15px;
                    border-radius: 5px;
                    margin-bottom: 10px;
                     .title{
                    font-size: 16px;
                    line-height: 16px;
                    font-weight: 600;
                    color: #606266;
                    padding-left: 15px;
                    border-left: 3px solid #409EFF;
                        margin: 10px 5px;
                    }
                 }
            }
       } 
   }   
</style>
