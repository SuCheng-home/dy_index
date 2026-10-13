<template>
    <div class="everydayindex">
        <div class="header">
            <el-date-picker
                type="date"
                v-model="time"
                placeholder="选择日期"
                :clearable="false"
                :editable="false"
                @change="dateChangeHandler" size="medium"
            >
            </el-date-picker>
             <el-button type="primary" size="medium"  v-if="query.id==0&&(query.teacherRepast==1||query.stuRepast==1)"  @click="print()">打印</el-button>
             <el-button type="primary" size="medium"   v-if="query.id==0&&(query.teacherRepast==1||query.stuRepast==1)"  @click="exportExcel('#outTable', `${time}订餐报告.xlsx`)">导出</el-button>
        </div>
        <default-page  v-if="query.id ==-1" Mes="当前日期未发布订餐"></default-page> 
       <default-page  v-if="query.id==0&&(query.teacherRepast==0&&query.stuRepast==0)" Mes="当前日期不就餐"></default-page>
        <div class="body" v-if="query.id==0&&(query.teacherRepast==1||query.stuRepast==1)">
            <div class="bodybox"  ref="print"  style=" width: 810px; margin: 20px auto;">
                <div class="top" style="line-height: 80px; text-align: center;font-size: 30px;border: 1px #ddd solid;border-bottom: none;">
                    {{time}}订餐报告
                </div>
          <table  id="outTable" style=" width: 100%;border-collapse:collapse;font-size:14px;color:#606266" border="1" >
            <thead style="color:#303133">
                <tr>
                    <th style="height: 30px;text-align: center;border: 1px solid #ddd;" :rowspan="2">班级</th>
                    <th style="height: 30px;text-align: center;border: 1px solid #ddd;"  v-if="query.stuBreakfast" :colspan ="2">
                       早餐
                    </th>
                    <th style="height: 30px;text-align: center;border: 1px solid #ddd;" v-if="query.breakMeal" :colspan ="2">
                     课间餐
                        </th>
                    <th style="height: 30px;text-align: center;border: 1px solid #ddd;" v-if="query.lunch" :colspan ="2">
                       午餐
                        </th>
                    <th style="height: 30px;text-align: center;border: 1px solid #ddd;" v-if="query.stuSupper" :colspan ="2">
                       晚餐
                    </th>
                    <th style="height: 30px;text-align: center;border: 1px solid #ddd;" :rowspan="2">订餐备注</th>
                </tr>
                 <tr>
                    <!-- <th style="height: 30px;text-align: center;border: 1px solid #ddd;"></th> -->
                    <th style="height: 30px;text-align: center;border: 1px solid #ddd;"  v-if="query.stuBreakfast" >
                       就餐
                    </th>
                     <th style="height: 30px;text-align: center;border: 1px solid #ddd;"  v-if="query.stuBreakfast" >
                       停伙
                    </th>
                    <th style="height: 30px;text-align: center;border: 1px solid #ddd;" v-if="query.breakMeal" >
                     就餐
                        </th>
                          <th style="height: 30px;text-align: center;border: 1px solid #ddd;" v-if="query.breakMeal" >
                     停伙
                        </th>
                    <th style="height: 30px;text-align: center;border: 1px solid #ddd;" v-if="query.lunch">
                       就餐
                        </th>
                     <th style="height: 30px;text-align: center;border: 1px solid #ddd;" v-if="query.lunch">
                       停伙
                        </th>
                    <th style="height: 30px;text-align: center;border: 1px solid #ddd;" v-if="query.stuSupper">
                       就餐
                    </th>
                    <th style="height: 30px;text-align: center;border: 1px solid #ddd;" v-if="query.stuSupper">
                       停伙
                    </th>
                    <!-- <th style="height: 30px;text-align: center;border: 1px solid #ddd;"></th> -->
                </tr>
            </thead>
        <tbody >
            <tr :key="index"  v-for="(item,index) in dataList" v-if="query.stuRepast==1">
                <td class="td" @click="everydayinfo(item.classId,item.className)" style="height: 40px;text-align: center;border: 1px solid #ddd;">{{item.className}}</td>
                <td v-if="query.stuBreakfast" style="height: 40px;text-align: center;border: 1px solid #ddd;">  {{item.breakfastCount}}</td>
                <td v-if="query.stuBreakfast" style="height: 40px;text-align: center;border: 1px solid #ddd;">  {{item.fireBreakfastCount}}</td>
                <td v-if="query.breakMeal" style="height: 40px;text-align: center;border: 1px solid #ddd;">{{item.breakCount}}</td>
                <td v-if="query.breakMeal" style="height: 40px;text-align: center;border: 1px solid #ddd;">{{item.fireBreakCount}}</td>
                <td v-if="query.lunch" style="height: 40px;text-align: center;border: 1px solid #ddd;">{{item.lunchCount}}</td>
                <td v-if="query.lunch" style="height: 40px;text-align: center;border: 1px solid #ddd;">{{item.fireLunchCount}}</td>
                <td v-if="query.stuSupper" style="height: 40px;text-align: center;border: 1px solid #ddd;">{{item.supperCount}}</td>
                <td v-if="query.stuSupper" style="height: 40px;text-align: center;border: 1px solid #ddd;">{{item.fireSupperCount}}</td>
                <td class="td" style="height: 40px;text-align: center;border: 1px solid #ddd;"></td>
            </tr>   
             <tr  v-if="query.stuRepast==1">
                <td style="height: 40px;text-align: center;border: 1px solid #ddd;">学生订餐总计</td>
                <td :colspan ="(query.stuBreakfast+query.breakMeal+query.lunch+query.stuSupper)*2" style="padding-left: 10px;height: 40px;border: 1px solid #ddd;">
                      <span v-if="query.stuBreakfast">
                              <span>早餐数</span><span>{{myobj.stuBreakfastCount}}</span>停伙<span>{{myobj.stuFireBreakfastCount}}</span>；                          
                        </span>
                        <span v-if="query.breakMeal" >
                             <span>课间餐数</span><span>{{myobj.stuBreakMealCount}}</span>停伙<span>{{myobj.stuFireBreakMealCount}}</span>；                           
                        </span>
                        <span v-if="query.lunch">
                             <span>午餐数</span><span>{{myobj.stuLunchCount}}</span>停伙<span>{{myobj.stuFireLunchCount}}</span>；                           
                        </span>
                        <span v-if="query.stuSupper">
                             <span>晚餐数</span><span>{{myobj.stuSupperCount}}</span>停伙<span>{{myobj.stuFireSupperCount}}</span>；
                        </span>   
                </td>
                <td style="height: 40px;text-align: center;border: 1px solid #ddd;"></td>
            </tr> 
             <tr  v-if="query.teacherRepast==1">
                <td class="td" @click="everydayinfo(0,'老师订餐')" style="height: 40px;text-align: center;border: 1px solid #ddd;">老师订餐总计</td>
                <td :colspan ="(query.stuBreakfast+query.breakMeal+query.lunch+query.stuSupper)*2" style="padding-left: 10px;height: 40px;border: 1px solid #ddd;">
                        <span v-if="query.breakfast">
                           <span>早餐数</span> <span>{{myobj.teacherBreakfastCount}}</span>停伙<span>{{myobj.teacherFireBreakfastCount}}</span>；                           
                        </span>
                        <span v-if="query.teacherLunch" >
                            <span>午餐数</span><span>{{myobj.teacherLunchCount}}</span>停伙<span>{{myobj.teacherFireLunchCount}}</span>；                           
                        </span>
                        <span v-if="query.supper" >
                            <span>晚餐数</span><span>{{myobj.teacherSupperCount}}</span>停伙<span>{{myobj.teacherFireSupperCount}}</span>；
                        </span>
                </td>
                <td  style="height: 40px;text-align: center;border: 1px solid #ddd;"></td>
            </tr> 
        </tbody>
        </table>
            </div>
        </div>
       
    </div>
</template>

<script>
    import moment from "moment";
    import DefaultPage from "@/components/DefaultPage";
    import windowResizeMixin from '@/mixins/windowResize';
    import baseMixin from '@/mixins/baseMixin';
    import {fireClassSurveyAnalysisByDate,getFireSurveySetByDate,fireSurveyAnalysisByDate} from '@/api/diningsurvey';
    export default {
        data: function () {
            return {
                time: this.$moment().format('YYYY-MM-DD'),
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
                    id:1,   
                    stuRepast:-1,  
                    teacherRepast:-1  
              },  
               myobj:{
                    stuBreakMealCount:0,//	学生课间餐数	number	
                    stuBreakfastCount:0,//	学生早餐数	number	
                    stuFireBreakMealCount:0,//	学生课间餐停伙数	number	
                    stuFireBreakfastCount:0,//	学生早餐停伙数	number	
                    stuFireLunchCount:0,//	学生午餐停伙数	number	
                    stuFireSupperCount:0,//	学生晚餐停伙数	number	
                    stuLunchCount:0,//	学生午餐数	number	
                    stuSupperCount:0,//	学生晚餐数	number	
                    teacherBreakfastCount:0,//	教师早餐数	number	
                    teacherFireBreakfastCount:0,//	教师早餐停伙数	number	
                    teacherFireLunchCount:0,//	教师午餐停伙数	number	
                    teacherFireSupperCount:0,//	教师晚餐停伙数	number	
                    teacherLunchCount:0,//	教师午餐数	number	
                    teacherSupperCount:0,//	教师晚餐数	number
                }  
            }
        },
        mixins: [windowResizeMixin,baseMixin],
        components: { DefaultPage },
        created() {
            this.loadDataHandler(this.time);
        },
        methods: { 
            everydayinfo(classId,className){
                if(classId!=0){
                    this.$router.push({
                    path: 'everydayinfo',
                    query: {
                         classId: classId,
                         className:className,
                         date:this.time,
                    }})
                    
                }else{
                 this.$router.push({
                    path: 'everydayinfotwo',
                    query: {
                         className:className,
                         date:this.time,
                    }})
                }
                 
            }, 
             print() {
                this.$print(this.$refs.print);
            },        
            loadDataHandler(time) {
                fireClassSurveyAnalysisByDate(time).then(res => {
                    let data = res.data.data;
                    this.dataList = data;             
                }).catch();  
                getFireSurveySetByDate(time).then(res => {
                    let data = res.data.data;
                    this.query.supper = data.supper == 1; 
                    this.query.breakMeal = data.breakMeal == 1;
                    this.query.stuBreakfast = data.stuBreakfast == 1;
                    this.query.stuSupper = data.stuSupper == 1;
                    this.query.breakfast = data.breakfast == 1; 
                     this.query.id = data.id; 
                    this.query.teacherRepast = data.teacherRepast;
                    this.query.stuRepast = data.stuRepast;                
                }).catch(); 
                 fireSurveyAnalysisByDate(time).then(res => {
                    let data = res.data.data;
                    this.myobj=data;                   
                  }).catch();
            },
            dateChangeHandler(value) {
                this.time = this.$moment(value).format('YYYY-MM-DD');
                this.loadDataHandler(this.time);
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
        .td{
              color: #409eff;
            cursor: pointer;
        }
    }
</style>
