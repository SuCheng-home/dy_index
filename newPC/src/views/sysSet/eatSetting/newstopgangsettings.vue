<template>
    <div class="page page--schoolTime">
        <div class="header">
            <back-tool>
                 <el-select v-model="gradeId" size="medium" placeholder="请选择年级" @change="changeGrade" v-if="query.isSameSch==2&&fireType==2">
            <el-option v-for="item in gradeList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
           <!-- <el-button size="medium" type="primary" @click="isShowRepublishDialog=true">按月批量设置</el-button> -->
            </back-tool>
        </div>
        <el-dialog title="按月批量设置" :visible.sync="isShowRepublishDialog" size="tiny" width="600px" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
			      <div v-if="query.thFire&&fireType==1" class="groupbox">
                              <el-checkbox-group v-model="mealTypes"  >
                                  <el-checkbox v-if="query.breakfast"  label="0">早餐停伙</el-checkbox>
                                  <el-checkbox v-if="query.teacherLunch"  label="1">午餐停伙</el-checkbox>                                   
                                  <el-checkbox v-if="query.supper"  label="3">晚餐停伙</el-checkbox>                                  
                              </el-checkbox-group>
                        </div>
                        <div v-if="query.stuFire&&fireType==2" class="groupbox">
                              <el-checkbox-group v-model="mealTypes"  >
                                    <el-checkbox v-if="query.stuBreakfast"  label="0">早 餐 停 伙</el-checkbox>
                                    <el-checkbox v-if="query.breakMeal"  label="2">课间餐停伙</el-checkbox>
                                   <el-checkbox v-if="query.lunch"  label="1">午 餐 停 伙</el-checkbox>                                
                                  <el-checkbox v-if="query.stuSupper"  label="3">晚 餐 停 伙</el-checkbox>                              
                              </el-checkbox-group>
                        </div>
                    <div style="color:red">备注：勾选后本月所有供餐日期 供应/停供对应餐次</div>
					<div  slot="footer" class="dialog-footer">
						<el-button  type="default" @click="isShowRepublishDialog = false">取消</el-button>
						<el-button  type="primary" @click="piliangfun()">确定</el-button>
					</div>
		</el-dialog>
        <!-- {{selectedDate}} -->
        <div class="calendar">
            <div class="calendar__header">
                <div class="calendar__header-title">
                    {{ termInfo.schoolYear }}学年&nbsp;&nbsp;第{{ termInfo.term | toChinese }}学期{{fireType==1?"老师":"学生"}}供餐设置
                </div>
                <div class="calendar__header-title--sub">
                    {{ termInfo.startDate }}&nbsp;--&nbsp;{{ termInfo.endDate }}
                </div>
            </div>
            <div class="content-container clearfix" :style="`height: ${nobottommaxH-60}px;`">
                <div class="calendar__container swiper-container">
                    <div class="calendar__year-controller">
                        {{ currentSlideDate.year }}年
                        <el-button class="prev-btn" size="small" @click="slideTo('prev')"><</el-button><el-select @change="changeMonthHandler" size="small" class="month-selector" v-model="currentSlideDate.month">
                        <el-option label="一月" :value="1"></el-option>
                        <el-option label="二月" :value="2"></el-option>
                        <el-option label="三月" :value="3"></el-option>
                        <el-option label="四月" :value="4"></el-option>
                        <el-option label="五月" :value="5"></el-option>
                        <el-option label="六月" :value="6"></el-option>
                        <el-option label="七月" :value="7"></el-option>
                        <el-option label="八月" :value="8"></el-option>
                        <el-option label="九月" :value="9"></el-option>
                        <el-option label="十月" :value="10"></el-option>
                        <el-option label="十一月" :value="11"></el-option>
                        <el-option label="十二月" :value="12"></el-option>

                    </el-select><el-button class="next-btn" size="small" @click="slideTo('next')">></el-button>
                    </div>
                    <div class="calendar__week-header">
                        <ul>
                            <li class="span--gray">日</li>
                            <li>一</li>
                            <li>二</li>
                            <li>三</li>
                            <li>四</li>
                            <li>五</li>
                            <li class="span--gray">六</li>
                        </ul>
                    </div>
                    <div class="swiper-wrapper">
                        <template v-for="year in renderYears">
                            <div class="swiper-slide" v-for="monthEntry in getDateInfoObj(year)">
                                <ul>
                                    <template v-for="dateEntry in monthEntry">
                                        <li v-if="dateEntry.dateIndex <= dateEntry.firstDateOfMonth"></li>
                                        <li class="date-item" :class="{'calendar-today':isNowDate(`${year}-${dateEntry.monthIndex}-${ dateEntry.dateIndex - dateEntry.firstDateOfMonth }`),'date-item--selected':isSelectedDate(`${year}-${dateEntry.monthIndex}-${ dateEntry.dateIndex - dateEntry.firstDateOfMonth }`) }" v-else @click="dateSelectHandler(`${year}-${dateEntry.monthIndex}-${ dateEntry.dateIndex - dateEntry.firstDateOfMonth }`)">
                                            <span :class="dateEntry.dateIndex % 7 === 0 || dateEntry.dateIndex % 7 === 1 ? 'span--gray' : ''">
                                                {{ dateEntry.dateIndex - dateEntry.firstDateOfMonth === 1 ? `${dateEntry.monthIndex}月` : dateEntry.dateIndex - dateEntry.firstDateOfMonth }}
                                            </span>
                                               <span class="office-flag"  v-if="getStatemy(`${year}-${dateEntry.monthIndex}-${ dateEntry.dateIndex - dateEntry.firstDateOfMonth }`)">
                                                  <span class="within blue">餐</span>
                                            </span>
                                        </li>
                                    </template>
                                </ul>
                            </div>
                        </template>
                    </div>
                </div>
                <div class="calendar__side">
                    <div class="side__header">
                        {{ termInfo.schoolYear }}学年
                    </div>
                    <div class="side__date">
                        {{ selectedDate | getDateStr }}
                    </div>
                    <div class="side__date--large" v-if="selectedDate !== null">
                        {{ selectedDate | getDateLarge }}
                    </div>
                    <div class="side__state-container" v-if="selectedDatefun()">
                        <span class="side__state-selector-hint">
                            设置
                        </span>
                        <el-select class="side__state-selector" size="small" v-model="selectedDateState" @change="stateChangeHandler" >
                            <el-option label="就餐" :value="0"></el-option>
                            <el-option label="不就餐" :value="1"></el-option>
                        </el-select>
                          <div v-if="query.thFire&&fireType==1&&selectedDateState==0" class="groupbox">
                              <el-checkbox-group v-model="selectedDateStateobj.mealTypes"  @change="stateChangeHandler">
                                  <div><el-checkbox v-if="query.breakfast"  label="0">早餐停伙</el-checkbox></div>
                                    <div><el-checkbox v-if="query.teacherLunch"  label="1">午餐停伙</el-checkbox></div>                                    
                                    <div> <el-checkbox v-if="query.supper"  label="3">晚餐停伙</el-checkbox></div>                                   
                              </el-checkbox-group>
                        </div>
                        <div v-if="query.stuFire&&fireType==2&&selectedDateState==0" class="groupbox">
                              <el-checkbox-group v-model="selectedDateStateobj.mealTypes"  @change="stateChangeHandler">
                                    <div><el-checkbox v-if="query.stuBreakfast"  label="0">早 餐 停 伙</el-checkbox></div>
                                    <div><el-checkbox v-if="query.breakMeal"  label="2">课间餐停伙</el-checkbox></div>
                                    <div><el-checkbox v-if="query.lunch"  label="1">午 餐 停 伙</el-checkbox></div>                                   
                                    <div> <el-checkbox v-if="query.stuSupper"  label="3">晚 餐 停 伙</el-checkbox></div>                                  
                              </el-checkbox-group>
                        </div>
                    </div>
                    
                </div>
            </div>

        </div>
    </div>
</template>

<script>
    import moment from 'moment';
    import Swiper from 'swiper';
    import 'swiper/dist/css/swiper.min.css';
    import BackTool from '@/components/BackTool';
    import windowResizeMixin from '@/mixins/windowResize';
    import {insertFireManageTw,getMonthDateTw} from "@/api/eatSetting";
    import {getFireSet} from "@/api/fire";
    import { schoolTimeDetails } from '@/api/schoolTimeList';
    import {getSchoolGradeClass} from "@/api/common/common"
    import _ from 'lodash';

    export default {
        data: function () {
            return {
                date: new Date().toLocaleString().split(' ')[0].replace(/\//g, '-'),
                schoolTimeId: this.$route.query.schoolTimeId,
                /*当前学年的信息*/
                termInfo: {
                    endDate: '',
                    startDate: '',
                    term: null,
                    schoolYear: ''
                },
                dateInfoArray: [],
                renderYears: [],//渲染的年份
                currentSlideDate: {
                    year: null,
                    month: 1
                },
                selectedDate: this.$moment(new Date()).format('YYYY-MM-DD'),
                selectedDateState:0,
                swiper: null,
                shouldUpdateState: false,
                adjustDate:'',
                dayMapping:['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
                fireType:this.$route.query.fireType,
                startDate:'',
                endDate:'',
                 query: {
                    samePushDate:0,
                    teacherMilk:0,//	教师牛奶，1代表有牛奶，0代表无牛奶	number
                    supper:"",//	晚餐，0无晚餐，1有晚餐	number
                    schoolId:"",//	学校id	number	
                    stuFireDate:"",//	学生停伙时间	string	
                    stuFireDayState:"",//	,学生停伙标示天，0代表当天，1代表提前一天	number                   
                    teacherFireDate:"",//	教师停伙时间	string	
                    teacherFireDayState:"",//	教师停伙标示天，0代表当天，1代表提前一天	number
                    lunch:true,//	午餐，1代表有午餐，0代表无午餐	number	
                    lunchCheck:true,//	学生午餐餐标，1代表有午餐，0代表无午餐	number	
                    lunchPrice:"",//	学生午餐价位	string
                    breakMeal:"",//	课间餐，1代表有课间餐，0代表无课间餐	number	
                    breakMealCheck:"",//	课间餐餐标，1代表有课间餐，0代表无课间餐	number	
                    breakMealPrice:"",//	课间餐价位	string	
                    stuBreakfast:"",//	学生早餐，1代表有早餐，0代表无早餐	number	
                    stuBreakfastCheck:"",//	学生早餐餐标，1代表有早餐，0代表无早餐	number	
                    stuBreakfastPrice:"",//	学生早餐价位	number	 
                    stuSupper:"",//	学生晚餐，1代表有晚餐，0代表无晚餐	number	
                    stuSupperCheck:"",//	学生晚餐餐标，1代表有晚餐，0代表无晚餐	number	
                    stuSupperPrice:"",//	学生晚餐价位	number
                    teacherLunch:true,//	教师午餐，1代表有午餐，0代表无午餐	number
                    teacherLunchCheck:true,//	教师午餐餐标，1代表有午餐，0代表无午餐	number	
                    teacherLunchPrice:"",//	教师午餐餐标	string	
                    breakfast:"",//	早餐，1代表有早餐，0代表无早餐	number	
                    breakfastCheck:"",//	早餐餐标，1代表有早餐，0代表无早餐	number	
                    breakfastPrice:"",//	早餐价位	string	     
                    supperPrice:"",
                    supperCheck:"",
                    remindHeadTeacher:0,  
                    samePushDate:0,
                    breakMealPushState:0,
                    breakMealPushDate:'',
                    stuLunchPushState:0,
                    stuLunchPushDate:'',
                    teacherLunchPushState:0,
                    teacherLunchPushDate:'',
                    teacherBreakfastPushState:0,
                    teacherBreakfastPushDate:'',
                    teacherSupperPushState:0,
                    teacherSupperPushDate:'',
                    stuBreakfastPushState:0,
                    stuBreakfastPushDate:'',
                    stuSupperPushState:0,
                    stuSupperPushDate:'',
                    thFire:true,
                    stuFire:true,
                    isSameSch:1    
                },               
                selectedDateStateobj:{
                    fireDate:"",//	停伙时间	string	
                    gradeId:"",//	年级id	number	
                    gradeName:"",//	年级名称	string	
                    mealTypes:[],//	停餐类型多个逗号分割，0代表早餐，1代表午餐，2代表课间餐,3代表晚餐	string
                },
                gradeId:0,
                gradeName:'',
                gradeList:[],
                isShowRepublishDialog:false,
                mealTypes:[]
            }
        },
        created: function () {
            //获取学期详情            
            this.currentSlideDate.month = 1;
            
        },
        mixins: [windowResizeMixin],
        mounted: function () {            
            getFireSet().then(res => {
                    let data = res.data.data;                    
                    this.query.supper = data.supper == 1;
                    this.query.thFire = data.thFire == 1;
                    this.query.stuFire = data.stuFire == 1;
                    this.query.stuFireDayState = data.stuFireDayState;
                    this.query.teacherFireDayState = data.teacherFireDayState;
                    this.query.stuFireDate = data.stuFireDate;
                    this.query.teacherFireDate = data.teacherFireDate;
                    this.query.schoolId = data.schoolId;
                    this.query.lunchPrice = data.lunchPrice-0;  
                    this.query.breakMeal = data.breakMeal == 1;
                    this.query.breakMealCheck = data.breakMealCheck == 1;
                    this.query.breakMealPrice = data.breakMealPrice-0;
                    this.query.stuBreakfast = data.stuBreakfast == 1;
                    this.query.stuBreakfastCheck = data.stuBreakfastCheck == 1;
                    this.query.stuBreakfastPrice = data.stuBreakfastPrice-0;
                    this.query.stuSupper = data.stuSupper == 1;
                    this.query.stuSupperCheck = data.stuSupperCheck == 1;
                    this.query.stuSupperPrice = data.stuSupperPrice-0;
                    this.query.teacherLunchPrice = data.teacherLunchPrice-0; 
                    this.query.breakfast = data.breakfast == 1;
                    this.query.breakfastCheck = data.breakfastCheck == 1;
                    this.query.breakfastPrice = data.breakfastPrice-0;
                    this.query.supperCheck=data.supperCheck==1;
                    this.query.supperPrice=data.supperPrice;
                    this.query.remindHeadTeacher=data.remindHeadTeacher;
                    this.query.samePushDate=data.samePushDate;
                    this.query.breakMealPushState=data.breakMealPushState;
                    this.query.breakMealPushDate=data.breakMealPushDate;
                    this.query.stuLunchPushState=data.stuLunchPushState;
                    this.query.stuLunchPushDate=data.stuLunchPushDate;
                    this.query.teacherLunchPushState=data.teacherLunchPushState;
                    this.query.teacherLunchPushDate=data.teacherLunchPushDate;
                    this.query.teacherBreakfastPushState=data.teacherBreakfastPushState;
                    this.query.teacherBreakfastPushDate=data.teacherBreakfastPushDate;
                    this.query.teacherSupperPushState=data.teacherSupperPushState;
                    this.query.teacherSupperPushDate=data.teacherSupperPushDate;
                    this.query.stuBreakfastPushState=data.stuBreakfastPushState;
                    this.query.stuBreakfastPushDate=data.stuBreakfastPushDate;
                    this.query.stuSupperPushState=data.stuSupperPushState;
                    this.query.stuSupperPushDate=data.stuSupperPushDate;
                    this.query.lunch=data.lunch==1;
                    this.query.lunchCheck=data.lunchCheck==1;
                    this.query.teacherLunch=data.teacherLunch==1;
                    this.query.teacherLunchCheck=data.teacherLunchCheck==1;
                    this.query.isSameSch=data.isSameSch?(data.isSameSch-0):1;
                    if(this.query.isSameSch==2&&this.fireType==2){
                         getSchoolGradeClass().then((res) => {
                            const data = res.data.data;
                            if (res.data.code === 200) {
                                this.gradeList = data;
                                this.gradeId=data[0].id;
                                this.gradeName=data[0].name;
                                 const vm = this;
            setTimeout(function() {
                vm.currentSlideDate.year = parseInt(vm.termInfo.startDate);//2020
                if((vm.currentSlideDate.year==new Date().getFullYear())&&(parseInt(vm.termInfo.startDate.split('-')[1])<(new Date().getMonth()+1))){
                    vm.currentSlideDate.month = new Date().getMonth()+1;
                }else{
                    vm.currentSlideDate.month = parseInt(vm.termInfo.startDate.split('-')[1]);//02
                }
                //vm.currentSlideDate.month = parseInt(vm.termInfo.startDate.split('-')[1]);//02
                vm.swiper = new Swiper('.swiper-container', {
                    simulateTouch: false, // 禁用鼠标拖动
                    initialSlide: (vm.currentSlideDate.year - vm.renderYears[0]) * 12 + (vm.currentSlideDate.month - 1)
                });
                vm.changeMonthHandler(vm.currentSlideDate.month);
                vm.swiper.on('slideNextTransitionEnd', function() {
                    const yearLimit = vm.renderYears[vm.renderYears.length - 1];
                    if(vm.currentSlideDate.year < yearLimit ||
                        vm.currentSlideDate.year === yearLimit &&
                        vm.currentSlideDate.month !== 12
                    ) {
                        if(vm.currentSlideDate.month === 12 ) {
                            vm.currentSlideDate = {
                                month: 1,
                                year: vm.currentSlideDate.year + 1
                            };
                        } else {
                            vm.currentSlideDate = {
                                month: vm.currentSlideDate.month + 1,
                                year: vm.currentSlideDate.year
                            };
                        }
                        vm.changeMonthHandler(vm.currentSlideDate.month);
                    }
                    else {
                    }
                });
                vm.swiper.on('slidePrevTransitionEnd', function() {
                    const yearLimit = vm.renderYears[0];
                    if(vm.currentSlideDate.year > yearLimit ||
                        vm.currentSlideDate.year === yearLimit &&
                        vm.currentSlideDate.month !== 1
                    ) {
                        if(vm.currentSlideDate.month === 1 ) {
                            vm.currentSlideDate = {
                                month: 12,
                                year: vm.currentSlideDate.year - 1
                            };
                        } else {
                            vm.currentSlideDate = {
                                month: vm.currentSlideDate.month - 1,
                                year: vm.currentSlideDate.year
                            };
                        }
                        vm.changeMonthHandler(vm.currentSlideDate.month);
                    }
                    else {
                    }
                });
            }, 500)
                            }
                            }).catch(() => {
                            });
                    }else{
                         const vm = this;
            setTimeout(function() {
                vm.currentSlideDate.year = parseInt(vm.termInfo.startDate);//2020
                if((vm.currentSlideDate.year==new Date().getFullYear())&&(parseInt(vm.termInfo.startDate.split('-')[1])<(new Date().getMonth()+1))){
                    vm.currentSlideDate.month = new Date().getMonth()+1;
                }else{
                    vm.currentSlideDate.month = parseInt(vm.termInfo.startDate.split('-')[1]);//02
                }
                //vm.currentSlideDate.month = parseInt(vm.termInfo.startDate.split('-')[1]);//02
                vm.swiper = new Swiper('.swiper-container', {
                    simulateTouch: false, // 禁用鼠标拖动
                    initialSlide: (vm.currentSlideDate.year - vm.renderYears[0]) * 12 + (vm.currentSlideDate.month - 1)
                });
                vm.changeMonthHandler(vm.currentSlideDate.month);
                vm.swiper.on('slideNextTransitionEnd', function() {
                    const yearLimit = vm.renderYears[vm.renderYears.length - 1];
                    if(vm.currentSlideDate.year < yearLimit ||
                        vm.currentSlideDate.year === yearLimit &&
                        vm.currentSlideDate.month !== 12
                    ) {
                        if(vm.currentSlideDate.month === 12 ) {
                            vm.currentSlideDate = {
                                month: 1,
                                year: vm.currentSlideDate.year + 1
                            };
                        } else {
                            vm.currentSlideDate = {
                                month: vm.currentSlideDate.month + 1,
                                year: vm.currentSlideDate.year
                            };
                        }
                        vm.changeMonthHandler(vm.currentSlideDate.month);
                    }
                    else {
                    }
                });
                vm.swiper.on('slidePrevTransitionEnd', function() {
                    const yearLimit = vm.renderYears[0];
                    if(vm.currentSlideDate.year > yearLimit ||
                        vm.currentSlideDate.year === yearLimit &&
                        vm.currentSlideDate.month !== 1
                    ) {
                        if(vm.currentSlideDate.month === 1 ) {
                            vm.currentSlideDate = {
                                month: 12,
                                year: vm.currentSlideDate.year - 1
                            };
                        } else {
                            vm.currentSlideDate = {
                                month: vm.currentSlideDate.month - 1,
                                year: vm.currentSlideDate.year
                            };
                        }
                        vm.changeMonthHandler(vm.currentSlideDate.month);
                    }
                    else {
                    }
                });
            }, 500)
                    }
                }).catch();
            schoolTimeDetails({
                id: this.schoolTimeId
            }).then(res => res.data)
            .then(data => {
                    if (data.result) {
                        this.termInfo = data.data;
                        this.startDate=data.data.beforeStartDate?data.data.beforeStartDate:data.data.startDate
                        this.endDate=data.data.afterEndDate||data.data.endDate
                        const startYear = parseInt(data.data.startDate.split('-')[0]),
                            endYear = parseInt(data.data.endDate.split('-')[0]),
                            renderYears = [];
                        for(let i = startYear; i <= endYear; i++) {
                            renderYears.push(i);
                        }
                        this.renderYears = renderYears;
                        this.currentSlideDate.year = renderYears[0];
                        //获取这个月的时间
                    } else {
                    }
                })
                .catch(() => {
                });
           
        },
        methods: {
            piliangfun(){
              this.isShowRepublishDialog=false
              this.mealTypes=[]
              this.getMonthDateHandler();
            },
            selectedDatefun(){
               if(!this.selectedDate){
                 return false
               }else{
                   if((this.selectedDate==this.startDate)||(this.selectedDate==this.endDate)||((this.selectedDate>this.startDate)&&(this.selectedDate<this.endDate))){
                       return true
                   }else{
                      return false
                   }
                  
               }               
            },
             changeGrade() {
                    if (this.gradeId) {
                    this.gradeName = this.gradeList[this.gradeList.map(item => item.id).indexOf(this.gradeId)].name;
                    }
                    this.getMonthDateHandler();
                },
            getDateInfoObj(year) {
                const resultArray = [];
                for(let monthIndex = 1; monthIndex <= 12; monthIndex++) {
                    const innerArray = [];
                    resultArray.push(innerArray);
                    for(let i = 1, length = this.getFirstDayOfMonth(year, monthIndex) + this.getDatesOfMonth(year, monthIndex); i<= length; i++) {
                        innerArray.push({
                            monthIndex,
                            totalDates: length,
                            dateIndex: i,
                            firstDateOfMonth: this.getFirstDayOfMonth(year, monthIndex)
                        })
                    }
                }
                return resultArray;
            },
            stateChangeHandler(state) {
               var self=this;
                    let manageDateListStr=[];                 
                    if(this.selectedDateState==1){
                        for(let i=0;i<this.dateInfoArray.length;i++){
                            if(this.selectedDate!=this.dateInfoArray[i].fireDate){
                                manageDateListStr.push(this.dateInfoArray[i])
                            }
                        }
                    
                    }else{
                        for(let i=0;i<this.dateInfoArray.length;i++){
                            if(this.selectedDate!=this.dateInfoArray[i].fireDate){
                                manageDateListStr.push(this.dateInfoArray[i])
                            }
                        }
                      manageDateListStr.push({
                          fireDate:this.selectedDateStateobj.fireDate,
                          mealTypes:this.selectedDateStateobj.mealTypes.join(',')
                      });
                      if(this.selectedDateStateobj.mealTypes.length==0){
                           this.$message.error('请选择至少一个餐次！');
                          return
                      }
                    }

                     insertFireManageTw({
                        fireDate: this.selectedDate.split('-')[0]+'-'+this.selectedDate.split('-')[1]+'-01',
                        fireType: this.fireType,
                        gradeId: this.gradeId,
                        gradeName: this.gradeName,
                        manageDateListStr:JSON.stringify(manageDateListStr)   
                    })
                        .then(res => res.data)
                        .then(data => {
                            if(data.result) {
                                this.getMonthDateHandler();
                            }
                        })
            },
            isSelectedDate(date) {
                date = date.split('-').map( datePart => datePart.length < 2 ? `0${ datePart }` : datePart ).join('-'); 
                return date == this.selectedDate;
            },
            isNowDate(date){
                  date = date.split('-').map( datePart => datePart.length < 2 ? `0${ datePart }` : datePart ).join('-'); 
                let nowDate=new Date().getFullYear()+'-'+(new Date().getMonth()+1)+'-'+new Date().getDate();
                return date==nowDate;
            },
            getStatemy(date) {
                date = date.split('-').map( datePart => datePart.length < 2 ? `0${ datePart }` : datePart ).join('-');               
                const resultDateEntry = this.dateInfoArray.find(dateEntry => dateEntry.fireDate === date);
                return resultDateEntry;
            },
            getMonthDateHandler() {
                getMonthDateTw({
                    isManage: true,
                    date: `${ this.currentSlideDate.year }-${ this.currentSlideDate.month }-01`,
                    fireType:this.fireType,
                    gradeId:this.gradeId
                })
                    .then(res => res.data)
                    .then(data => {
                        if(data.result) {
                            //返回这个月的数据
                            this.dateInfoArray = data.data;
                            this.selectedDateState=(this.dateInfoArray.find(dateEntry => dateEntry.fireDate === this.selectedDate))?0:1;
                            this.selectedDateStateobj={
                                gradeId:this.gradeId,
                                gradeName:this.gradeName,
                                fireDate: this.selectedDate,
                                mealTypes:[]
                            }
                            if(this.selectedDateState==0){
                                for(let i=0;i<this.dateInfoArray.length;i++){
                                    if(this.dateInfoArray[i].fireDate == this.selectedDate){
                                        this.selectedDateStateobj.mealTypes=this.dateInfoArray[i].mealTypes.split(',')
                                    }
                                }
                            }
                       } else {
                            this.$message.error('error');
                        }
                    })
                    .catch(() => {
                        this.$message.error('error');
                    });
            },
            dateSelectHandler(selectedDate) {
                this.selectedDate =selectedDate.split('-').map( datePart => datePart.length < 2 ? `0${ datePart }` : datePart ).join('-'); ;
                this.selectedDateState=(this.dateInfoArray.find(dateEntry => dateEntry.fireDate === this.selectedDate))?0:1;
                this.selectedDateStateobj={
                                gradeId:this.gradeId,
                                gradeName:this.gradeName,
                                fireDate: this.selectedDate,
                                mealTypes:[]
                            }
                if(this.selectedDateState==0){
                                for(let i=0;i<this.dateInfoArray.length;i++){
                                    if(this.dateInfoArray[i].fireDate == this.selectedDate){
                                        this.selectedDateStateobj.mealTypes=this.dateInfoArray[i].mealTypes.split(',')
                                    }
                                }
                            }

            },
            changeMonthHandler(value) {
                const yearIndex = this.renderYears.findIndex( year => year === this.currentSlideDate.year );
                this.swiper.slideTo(yearIndex * 12 + value - 1, 300, false);
                if(this.currentSlideDate.year&&this.currentSlideDate.month){
                   
                    let ismy=(this.$moment(new Date()).format('YYYY-MM-DD')+'').split('-')[1]==(this.currentSlideDate.month.length < 2 ?('0'+this.currentSlideDate.month):this.currentSlideDate.month);
                    if(ismy){
                         this.selectedDate=this.$moment(new Date()).format('YYYY-MM-DD');
                    }else{
                        this.selectedDate=this.currentSlideDate.year+'-'+(this.currentSlideDate.month.length < 2 ?('0'+this.currentSlideDate.month):this.currentSlideDate.month)+'-01'
                    }
                    this.getMonthDateHandler();
                    
                   
                }
            },
            slideTo: _.throttle(function(direction) {
                if(direction) {
                    switch(direction) {
                        case 'next':
                            this.swiper.slideNext(300, true);
                            break;
                        case 'prev':
                            this.swiper.slidePrev(300, true);
                            break;
                        default:
                            break;
                    }
                }
            }, 1000, { trailing: false }),
            getDatesOfMonth(year, monthIndex) {
                //计算多少天
                return new Date(year, monthIndex, 0).getDate();
            },
            getFirstDayOfMonth(year, monthIndex) {
                //计算第一天是周几
                if(monthIndex<10){
                    monthIndex='0'+monthIndex;
                }else{
                    monthIndex=monthIndex;
                }
                return new Date(`${ year }-${ monthIndex }-01`).getDay();
            },
        },
        filters: {
            toChinese(value) {
                let result = '';
                if (value) {
                    switch (value) {
                        case 1:
                            result = '一';
                            break;
                        case 2:
                            result = '二';
                            break;
                        default:
                            result = '';
                    }
                }
                return result;
            },
            getDateStr(value) {
                return value !== null ? value.split('-').map( datePart => datePart.length < 2 ? `0${ datePart }` : datePart ).join('-') : '';
            },
            getDateLarge(value) {
                return value !== null ? value.split('-')[2] : '';
            }
        },
        components: {
            BackTool
        }
    }
</script>

<style lang="scss" scoped>
.groupbox{
    background: #fff;
    padding: 10px;
    margin: 10px 0;
    border-radius: 5px;
}
    .page--schoolTime {
        padding:12px;
        .calendar {
            padding-top: 20px;
        }

        .calendar__header {
            text-align: center;
        }

        .calendar__header-title {
            font-size: 20px;
            color: #57ABFF;
        }
        .content-container {
            width: 530px;
            margin: 0 auto;
        }
        .calendar__side {
            text-align: center;
            width: 140px;
            padding-top: 10px;
            float: left;
            background-color: #57ABFF;
            height: 400px;
        }
        .calendar__container {
            float: left;
            width: 389px;
            height: 400px;
            margin: 0 auto;
            position: relative;
            border: 2px solid #57ABFF;
        }
        .calendar__year-controller {
            padding: 10px;
            vertical-align: middle;
            button.el-button {
                height: 32px;
                width: 30px;
                vertical-align: top;
                background-color: #eee;
            }
            .prev-btn.el-button {
                border-radius: 5px 0 0 5px;
            }
            .next-btn.el-button {
                border-radius: 0 5px 5px 0;
            }
            .el-input__inner {
                border-radius: 0;
            }
        }
        .month-selector {
            width: 100px;
        }

        .swiper-slide {
            width: 389px;
            text-align: center;
            font-size: 18px;
            background: #fff;
        }

        .calendar__week-header {
            width: 100%;
        }

        .calendar__container ul {
            width: 100%;
            padding: 0;
            margin: 0;
            list-style-type: none;
        }
        .calendar__container li {
            box-sizing: border-box;
            width: 55px;
            float: left;
            text-align: center;
        }
        .calendar__week-header ul li {
            height: 30px;
            line-height: 30px;
        }
        .content-container {
            margin-top: 20px;
        }
        .swiper-wrapper li {
            height: 50px;
            line-height: 50px;
            border: 1px solid #eee;
        }
        .span--gray {
            color: #aaa;
        }
        .side__header {
            font-weight: bold;
        }
        .side__date, .side__date--large, .side__header {
            color: #fff;
        }
        .side__date {
            padding: 20px 0;
        }
        .date-item {
            cursor: pointer;
        }
        .side__date--large {
            width: 75px;
            height: 75px;
            background-color: #FFBB00;
            margin: 0 auto;
            border-radius: 4px;
            font-size: 50px;
            font-weight: bold;
            text-align: center;
            line-height: 75px;
            color: #fff;
        }
        .calendar-today {
            background-color: #ACD6FF;
        }
        .date-item--selected {
            background-color: #57ABFF !important;
            color: #fff;
        }
        .date-item {
            position: relative;
        }
        .office-flag {
            width: 20px;
            height: 20px;
            display: block;
            position: absolute;
            left: 0;
            top: 0;
            color: #fff;
            line-height: 20px;
            text-align: center;
            font-size: 12px;
            .within{
                display: block;
            }
            .blue{
              background:#409EFF;
            }
            .green{
               background:#67C23A;
            }
        }
        .office-flag--gray {
            background-color: #909399;
        }
        .office-flag--red {
            background-color: #F56C6C;
        }
        .date-item--selected {
            background-color: #57ABFF;
            color: #fff;
        }
        .date-item--selected .span--gray {
            color: #fff;
        }
        .side__state-container {
            margin: 20px 5px;
            .side__state-selector-hint {
                font-size: 13px;
                height: 32px;
                border: 1px solid #BFCBD9;
                line-height: 31px;
                background-color: #eee;
                width: 30%;
                vertical-align: top;
                display: inline-block;
            }
            .el-input__inner {
                border-radius: 0;
            }
        }
        .side__state-selector {
            width: 64%;
            display: inline-block;
            vertical-align: middle;

        }
        .calendar__header-title--sub {
            font-size: 14px;
        }
        .change-date-container{
            width:100%;
            margin-top:10px;
            .el-date-editor.el-input{
                width:90%
            }
        }
        .change-flag{
            width: 20px;
            height: 20px;
            background-color: #FFFF33;
            display: block;
            position: absolute;
            right: 0;
            top: 0;
            color: #000;
            line-height: 20px;
            text-align: center;
            font-size: 12px
        }
        .change-date-info {
            text-align: center;
            color: #fff;
        }
        .calendar-today{
            background-color: #ACD6FF;
        }
    }


</style>
