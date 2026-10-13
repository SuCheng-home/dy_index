<template>
    <div class="everydayindex">
        <div class="header">
             <el-button @click="$router.back()" type="default" size="medium">返回</el-button>
             <el-button type="primary" size="medium"   @click="print()">打印</el-button>
             <el-button type="primary" size="medium"   @click="exportExcel('#outTable', `${time}${className}订餐报告.xlsx`)">导出</el-button>
        </div>
        <div class="body">
            <div class="bodybox"  ref="print"  style=" width: 810px; margin: 20px auto;">
                <div class="top" style="line-height: 80px; text-align: center;font-size: 30px;border: 1px #ddd solid;border-bottom: none;">
                    {{time}}  {{className}}  订餐报告
                </div>
          <table   style=" width: 100%;border-collapse:collapse;font-size:14px;color:#606266" border="1" >
            <thead style="color:#303133">
                <tr>
                    <th style="height: 40px;text-align: center;border: 1px solid #ddd;">姓名</th>
                    <th style="height: 40px;text-align: center;border: 1px solid #ddd;">部门</th>
                    <th style="height: 40px;text-align: center;border: 1px solid #ddd;"  v-if="query.breakfast">早餐</th>
                    <th style="height: 40px;text-align: center;border: 1px solid #ddd;" v-if="query.teacherLunch">午餐</th>
                    <th style="height: 40px;text-align: center;border: 1px solid #ddd;" v-if="query.supper">晚餐</th>
                    <th style="height: 40px;text-align: center;border: 1px solid #ddd;">备注</th>
                </tr>
            </thead>
        <tbody >
            <tr :key="index"  v-for="(item,index) in dataList">
                <td class="td" style="height: 40px;text-align: center;border: 1px solid #ddd;">{{item.teacherName}}</td>
                <td class="td" style="height: 40px;text-align: center;border: 1px solid #ddd;">{{item.departName}}</td>
                <td  v-if="query.breakfast" style="height: 40px;text-align: center;border: 1px solid #ddd;">  
                    <span v-if="item.fireBreakfast==1">停伙</span>
                <span v-else>
                    <i v-if="item.breakfast==1" class="el-icon-close"></i>
                            <i v-else class="el-icon-check"></i>
                </span>
                </td>
                <td v-if="query.teacherLunch" style="height: 40px;text-align: center;border: 1px solid #ddd;">
                     <span v-if="item.fireLunch==1">停伙</span>
                <span v-else>
                    <i v-if="item.lunch==1" class="el-icon-close"></i>
                    <i v-else class="el-icon-check"></i>
                </span>
                </td>
                <td v-if="query.supper" style="height: 40px;text-align: center;border: 1px solid #ddd;">
                     <span v-if="item.fireSupper==1">停伙</span>
                        <span v-else>
                            <i v-if="item.supper==1" class="el-icon-close"></i>
                            <i v-else class="el-icon-check"></i>
                        </span>
                </td>
                <td class="td" style="height: 40px;text-align: center;border: 1px solid #ddd;"></td>
            </tr>  
        </tbody>
        </table>
        
        <div style="    display: none;">
            <table  id="outTable" style=" width: 100%;border-collapse:collapse;font-size:14px;color:#606266" border="1" >
            <thead style="color:#303133">
                <tr>
                    <th style="height: 40px;text-align: center;border: 1px solid #ddd;">姓名</th>
                    <th style="height: 40px;text-align: center;border: 1px solid #ddd;">部门</th>
                    <th style="height: 40px;text-align: center;border: 1px solid #ddd;"  v-if="query.breakfast">早餐</th>
                    <th style="height: 40px;text-align: center;border: 1px solid #ddd;" v-if="query.teacherLunch">午餐</th>
                    <th style="height: 40px;text-align: center;border: 1px solid #ddd;" v-if="query.supper">晚餐</th>
                    <th style="height: 40px;text-align: center;border: 1px solid #ddd;">备注</th>
                </tr>
            </thead>
        <tbody >
            <tr :key="index"  v-for="(item,index) in dataList">
                <td class="td" style="height: 40px;text-align: center;border: 1px solid #ddd;">{{item.teacherName}}</td>
                <td class="td" style="height: 40px;text-align: center;border: 1px solid #ddd;">{{item.departName}}</td>
                <td  v-if="query.breakfast" style="height: 40px;text-align: center;border: 1px solid #ddd;">  
                    <span v-if="item.fireBreakfast==1">停伙</span>
                <span v-else>
                    <i v-if="item.breakfast==1" class="el-icon-close">不就餐</i>
                            <i v-else class="el-icon-check">就餐</i>
                </span>
                </td>
                <td v-if="query.teacherLunch" style="height: 40px;text-align: center;border: 1px solid #ddd;">
                     <span v-if="item.fireLunch==1">停伙</span>
                <span v-else>
                    <i v-if="item.lunch==1" class="el-icon-close">不就餐</i>
                    <i v-else class="el-icon-check">就餐</i>
                </span>
                </td>
                <td v-if="query.supper" style="height: 40px;text-align: center;border: 1px solid #ddd;">
                     <span v-if="item.fireSupper==1">停伙</span>
                        <span v-else>
                            <i v-if="item.supper==1" class="el-icon-close">不就餐</i>
                            <i v-else class="el-icon-check">就餐</i>
                        </span>
                </td>
                <td class="td" style="height: 40px;text-align: center;border: 1px solid #ddd;"></td>
            </tr>  
        </tbody>
        </table>
        </div>
        
            </div>
        </div>
       
    </div>
</template>

<script>
    import moment from "moment";
    import windowResizeMixin from '@/mixins/windowResize';
    import baseMixin from '@/mixins/baseMixin';
    import {teacherRepastAnalysisByDate,getFireSurveySetByDate} from '@/api/diningsurvey';
    export default {
        data: function () {
            return {
                time: this.$route.query.date,
                className: this.$route.query.className,
                classId: this.$route.query.classId,
                dataList: [],
                numcolspan:1,
                query: {
                    lunch:true,//	午餐，1代表有午餐，0代表无午餐	number
                    stuSupper:"",//	学生晚餐，1代表有晚餐，0代表无晚餐	number
                    stuBreakfast:"",//	学生早餐，1代表有早餐，0代表无早餐	number	
                    breakMeal:"",//	课间餐，1代表有课间餐，0代表无课间餐	number
                    teacherLunch:true,//	教师午餐，1代表有午餐，0代表无午餐	number
                    breakfast:"",//	早餐，1代表有早餐，0代表无早餐	number
                    supper:"",//	晚餐，0无晚餐，1有晚餐	number
              }
            }
        },
        mixins: [windowResizeMixin,baseMixin],
        created() {
           getFireSurveySetByDate(this.time).then(res => {
                    let data = res.data.data;
                    this.query.supper = data.supper == 1; 
                    this.query.breakMeal = data.breakMeal == 1;
                    this.query.stuBreakfast = data.stuBreakfast == 1;
                    this.query.stuSupper = data.stuSupper == 1;
                    this.query.breakfast = data.breakfast == 1;                 
                }).catch(); 
             teacherRepastAnalysisByDate({
                 pageNo: 1,
                pageSize: 500,
                date: this.time
                }).then(res => {
                    let data = res.data.data;
                    this.dataList = data.dataList;             
                }).catch();  
        },
        methods: {   
             print() {
                this.$print(this.$refs.print);
            },             
        }       
    }
</script>

<style lang="scss" scoped>
    .everydayindex {
        padding:12px;
         .header {
            padding-bottom: 10px;
            border-bottom: 1px solid #eee;
        }
        .body {
            overflow: auto;
        }
        .el-icon-close{
            color: #F56C6C;
        }
         .el-icon-check{
            color: #409EFF;
        }
    }
</style>
