<template>
    <div class="classroomEvaluationclasslistdetails">
        <div class="top">
            <el-col :span="24">
                <el-button  @click="$router.back()" type="default" size="medium">返回</el-button>
              
            </el-col>

        </div>
        <div class="time-table">				
           <div class="ul">
               <div class="li">
                   <div class="name">日期</div>{{dateList.checkDateStr}}
               </div>
               <div class="li">
                   <div class="name">年级</div>{{dateList.gradeName}}
               </div>
               <div class="li">
                   <div class="name">班级</div>{{dateList.className}}
               </div>
               <div class="li">
                   <div class="name">节次</div>{{dateList.sectionName}}
               </div>
               <div class="li">
                   <div class="name">学科</div>{{dateList.subjectName}}
               </div>
               <div class="li">
                   <div class="name">任课老师</div>{{dateList.teacherName}}
               </div>
               <div class="li">
                   <div class="name">总分</div>{{dateList.ratingTotalScore}}
               </div>
           </div>
        </div>
    </div>
</template>
<script>
    import moment from "moment";
    import {getScoreDetailById} from '@/api/classroomEvaluation';
    import mixin from '@/mixins/windowResize';
    export default {
        name: "gatelist",
        data: function () {
            return {
                id: this.$route.query.id, 
                dateList: {
                    className:'',
                    gradeName:'',
                    ratingTotalScore:'',
                    remark:'',
                    sectionName:'',
                    createTime:'',
                    subjectName:'',
                    teacherName:'',
                }               
            };
        },
        mixins: [mixin],
        //获取渲染数据当数据加载完成后执行(生命周期中的钩子函数)
        created() {
            this.getScoreDetailByIds()
        },
        methods: {
           
            getScoreDetailByIds() {               
                getScoreDetailById(this.id).then(res => {
                    this.dateList = res.data.data;
                });
            },

        }
    };
</script>
<style lang="scss" scoped>
    .classroomEvaluationclasslistdetails {
        padding:12px;
         .top {
        border-bottom: 1px solid #e7eaec;
       padding-bottom: 10px;
       overflow: hidden;
       }
       .li{
         padding: 10px 0;
         position: relative;
         color:#888;
         font-size: 14px;
         line-height: 20px;
         padding-left: 150px;
         min-height: 40px;
         width: 810px;
         margin: 0 auto;
         .name{
             position: absolute;
             width: 140px;
             color:#666;
             font-weight: 600;
             top:10px;
             left: 0;
             text-align: right;
         }
       }
    }

</style>
