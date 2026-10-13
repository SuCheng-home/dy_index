<template>
    <div class="page page--schoolTime">
        <div class="header">
            <back-tool>
            </back-tool>
        </div>
        <div class="calendar">
            <div class="calendar__header">
                <div class="calendar__header-title">
                    {{ termInfo.schoolYear }}学年&nbsp;&nbsp;第{{ termInfo.term | toChinese }}学期
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
                                            <span class="change-flag" v-if="getJustState(`${year}-${dateEntry.monthIndex}-${ dateEntry.dateIndex - dateEntry.firstDateOfMonth }`).isAdjust==2">调</span>
                                            <span class="office-flag"  v-if="getStatemy(`${year}-${dateEntry.monthIndex}-${ dateEntry.dateIndex - dateEntry.firstDateOfMonth }`) !== -1"
                                                    :class="getStatemy(`${year}-${dateEntry.monthIndex}-${ dateEntry.dateIndex - dateEntry.firstDateOfMonth}`).weekDate === 1 ? 'office-flag--gray' : 'office-flag--red'">
                                                    <span v-if="getStatemy(`${year}-${dateEntry.monthIndex}-${ dateEntry.dateIndex - dateEntry.firstDateOfMonth }`).weekDate !== 1">
                                                       休
                                                    </span>
                                                    <span v-else>
                                                       <span class="within" v-show="getStatemy(`${year}-${dateEntry.monthIndex}-${ dateEntry.dateIndex - dateEntry.firstDateOfMonth }`).dayType==0">学</span>
                                                       <span class="within blue" v-show="getStatemy(`${year}-${dateEntry.monthIndex}-${ dateEntry.dateIndex - dateEntry.firstDateOfMonth }`).dayType==1">预</span>                                                      
                                                       <span class="within green" v-show="getStatemy(`${year}-${dateEntry.monthIndex}-${ dateEntry.dateIndex - dateEntry.firstDateOfMonth }`).dayType==2">加</span>
                                                    </span>
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
                    <div class="side__state-container" v-if="selectedDateState !== -1">
                        <span class="side__state-selector-hint">
                            设置
                        </span><el-select class="side__state-selector" size="small" v-model="selectedDateState" @change="stateChangeHandler" @visible-change="visibleChangeHandler">
                            <el-option label="休" :value="0"></el-option>
                            <el-option :label="transfername" :value="1"></el-option>
                        </el-select>
                    </div>
                    <div class="change-date-info" :adjustDateShow="adjustDateShow" v-if="adjustDateShow">
                        <div>调：<span>{{adjustDateShow}}</span></div>
                        <div class="change-date-info__day">{{dayMapping[new Date(adjustDateShow).getDay()]}}</div>
                    </div>
                    <el-button class="btn--change-date-btn" size="small" v-if="!adjustDateFlag&&selectedDateState == 1&&(new Date(selectedDate).getDay()==0||new Date(selectedDate).getDay()==6)" @click="setJustBtn">调课设置</el-button>
                    <div class="change-date-container" v-if="selectedDate&&adjustDateFlag">
                        <el-date-picker v-model="adjustDate" type="date"  size="mini"
                        :clearable="false" placeholder="调课日期" @change="adjustHandler">
                        </el-date-picker>
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
    import { schoolTimeDetails, setSchoolTimeDate ,setAdjustDate,getMonthDayContainHoliday} from '@/api/schoolTimeList';
    import _ from 'lodash';

    export default {
        data: function () {
            return {
                date: new Date().toLocaleString().split(' ')[0].replace(/\//g, '-'),
                schoolTimeId: this.$route.query.schoolTimeId,
                transfername:'学',
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
                selectedDate: null,
                selectedDateState: -1,
                swiper: null,
                shouldUpdateState: false,
                adjustDateFlag:false,
                adjustDate:'',
                adjustDateShow:'',
                dayMapping:['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
            }
        },
        created: function () {
            //获取学期详情
            
            this.currentSlideDate.month = 1;
            
        },
        mixins: [windowResizeMixin],
        mounted: function () {
            schoolTimeDetails({
                id: this.schoolTimeId
            }).then(res => res.data)
            .then(data => {
                    if (data.result) {
                        this.termInfo = data.data;
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
            const vm = this;
            setTimeout(function() {
                // 获取当前日期
                const today = new Date();
                const todayStr = today.toISOString().split('T')[0]; // 格式：YYYY-MM-DD
                
                // 检查当前日期是否在学期范围内
                if (todayStr >= vm.termInfo.startDate && todayStr <= vm.termInfo.endDate) {
                    // 当前日期在学期范围内，定位到今天
                    vm.currentSlideDate.year = today.getFullYear();
                    vm.currentSlideDate.month = today.getMonth() + 1;                    
                    setTimeout(() => {
                        vm.dateSelectHandler(moment().format('YYYY-MM-DD'))
                    }, 1000)
                } else {
                    // 当前日期不在学期范围内，保持原有逻辑
                    vm.currentSlideDate.year = parseInt(vm.termInfo.startDate.split('-')[0]);//2020
                    if((vm.currentSlideDate.year==new Date().getFullYear())&&(parseInt(vm.termInfo.startDate.split('-')[1])<(new Date().getMonth()+1))){  
                        vm.currentSlideDate.month = new Date().getMonth()+1;
                    }else{
                        vm.currentSlideDate.month = parseInt(vm.termInfo.startDate.split('-')[1]);//02
                    }
                }
                
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
        },
        methods: {
            adjustHandler(val){
                if(val){
                    var day=new Date(val).getDay();
                    var self=this;
                    if(day==0||day==6){
                        this.$message({
                            message: '不可与双休日调课！',
                            type: 'error'
                        });
                        this.adjustDate='';
                        return false;
                    }else{
                        setAdjustDate({
                            adjustDate: moment(val).format('YYYY-MM-DD'),
                            date:this.selectedDate,
                            isAdjust:2,
                            schoolTimeId:this.schoolTimeId
                        }).then(res=>{
                            if(res.data.code===200){
                                getMonthDayContainHoliday({
                                    schoolTimeId: this.schoolTimeId,
                                    date: `${ this.currentSlideDate.year }-${ this.currentSlideDate.month }-01`
                                })
                                    .then(res => res.data)
                                    .then(data => {
                                        if(data.result) {
                                            //返回这个月的数据
                                            this.dateInfoArray = data.data;
                                            self.adjustDateShow=self.getJustState(self.selectedDate).adjustDate;
                                        } else {
                                            this.$message.error('error');
                                        }
                                    })
                                    .catch(() => {
                                        this.$message.error('error');
                                    });
                            }
                        })
                    }
                }
                
            },
            setJustBtn(){
                //设置调课

                this.adjustDateFlag=true;
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
            visibleChangeHandler(visible) {
                this.shouldUpdateState = visible;
            },
            stateChangeHandler(state) {
                if(state==0){
                    this.adjustDateFlag=false;
                    this.adjustDateShow='';
                }
                if(this.shouldUpdateState) {
                    var self=this;
                    setSchoolTimeDate({
                        date: this.selectedDate,
                        schoolTimeId: this.schoolTimeId,
                        weekDay: state
                    })
                        .then(res => res.data)
                        .then(data => {
                            if(data.result) {
                                if(state==0){
                                    let changeResult=this.getJustState(this.selectedDate);
                                    if(changeResult.isAdjust){
                                        changeResult.isAdjust=1;
                                        changeResult.adjustDate='';
                                    }
                                    setAdjustDate({
                                        adjustDate: changeResult.adjustDate !== '' ? moment(changeResult.adjustDate).format('YYYY-MM-DD') : changeResult.adjustDate,
                                        date:this.selectedDate,
                                        isAdjust:changeResult.isAdjust,
                                        schoolTimeId:this.schoolTimeId
                                    }).then(res=>{
                                        if(res.data.code===200){
                                            self.getMonthDateHandler();
                                        }
                                    })
                                }else{
                                    this.getMonthDateHandler();
                                }
                            }
                        })
                }
            },
            isSelectedDate(date) {
                return date === this.selectedDate;
            },
            isNowDate(date){
                let nowDate=new Date().getFullYear()+'-'+(new Date().getMonth()+1)+'-'+new Date().getDate();
                return date==nowDate;
            },
            getStatemy(date) {//周壮壮写的新方法
                //获取状态(学，休)
                date = date.split('-').map( datePart => datePart.length < 2 ? `0${ datePart }` : datePart ).join('-');               
                const resultDateEntry = this.dateInfoArray.find(dateEntry => dateEntry.schoolTimeDate === date);
                return !resultDateEntry ? -1 : resultDateEntry;
            },
            getState(date) {
                //获取状态(学，休)
                date = date.split('-').map( datePart => datePart.length < 2 ? `0${ datePart }` : datePart ).join('-');               
                const resultDateEntry = this.dateInfoArray.find(dateEntry => dateEntry.schoolTimeDate === date);
                return !resultDateEntry ? -1 : resultDateEntry.weekDate;
            },
            getJustState(date){
                date = date.split('-').map( datePart => datePart.length < 2 ? `0${ datePart }` : datePart ).join('-');
                const resultJustEntry = this.dateInfoArray.find(dateEntry => dateEntry.schoolTimeDate === date);
                return !resultJustEntry ? -1 : {isAdjust:resultJustEntry.isAdjust,adjustDate:resultJustEntry.adjustDate};
            },
            getMonthDateHandler() {
                getMonthDayContainHoliday({
                    schoolTimeId: this.schoolTimeId,
                    date: `${ this.currentSlideDate.year }-${ this.currentSlideDate.month }-01`
                })
                    .then(res => res.data)
                    .then(data => {
                        if(data.result) {
                            //返回这个月的数据
                            this.dateInfoArray = data.data;
                        } else {
                            this.$message.error('error');
                        }
                    })
                    .catch(() => {
                        this.$message.error('error');
                    });
            },
            dateSelectHandler(selectedDate) { 
                if(this.getStatemy(selectedDate).dayType==0){
                     this.transfername='学'
                }else if(this.getStatemy(selectedDate).dayType==1){
                     this.transfername='预'
                }else{
                    this.transfername='加'
                }
                this.adjustDate='';
                this.selectedDate = selectedDate;
                this.adjustDateFlag=false;
                this.selectedDateState = this.getState(selectedDate);
                this.adjustDateShow=this.getJustState(selectedDate).adjustDate;

            },
            changeMonthHandler(value) {
                const yearIndex = this.renderYears.findIndex( year => year === this.currentSlideDate.year );
                this.swiper.slideTo(yearIndex * 12 + value - 1, 300, false);
                if(this.currentSlideDate.year&&this.currentSlideDate.month){
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
            width: 48%;
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
