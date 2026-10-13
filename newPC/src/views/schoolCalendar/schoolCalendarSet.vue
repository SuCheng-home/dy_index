<template>
    <div class="page page--schoolCalendar">
        <back-tool>
        </back-tool>
        <div class="calendar">
            <div class="calendar__header">
                <div class="calendar__header-title">
                    {{ termInfo.schoolYear }}学年
                </div>
                <div class="calendar__header-title--sub">
                    第一学期&nbsp;{{ termInfo.firstStartDate }}&nbsp;--&nbsp;{{ termInfo.firstEndDate }}<br/>
                    第二学期&nbsp;{{ termInfo.secondStartDate }}&nbsp;--&nbsp;{{ termInfo.secondEndDate }}<br/>
                </div>
            </div>
            <div class="content-container">
                <div class="calendar__container swiper-container">
                    <div class="calendar__year-controller">
                        {{ currentSlideDate.year }}年
                        <el-button class="prev-btn" size="small" @click="slideTo('prev')"><</el-button><el-select @change="changeMonthHandler" size="small" class="month-selector"
                                   v-model="currentSlideDate.month">
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

                                        <li class="date-item"
                                            :class="isSelectedDate(`${year}-${dateEntry.monthIndex}-${ dateEntry.dateIndex - dateEntry.firstDateOfMonth }`) ? 'date-item--selected' : ''"
                                            v-else
                                            @click="dateSelectHandler(`${year}-${dateEntry.monthIndex}-${ dateEntry.dateIndex - dateEntry.firstDateOfMonth }`)">
                                            <span :class="dateEntry.dateIndex % 7 === 0 || dateEntry.dateIndex % 7 === 1 ? 'span--gray' : ''">
                                                {{ dateEntry.dateIndex - dateEntry.firstDateOfMonth === 1 ? `${dateEntry.monthIndex}月` : dateEntry.dateIndex - dateEntry.firstDateOfMonth }}
                                            </span>
                                            <span
                                                    class="office-flag"
                                                    v-if="getState(`${year}-${dateEntry.monthIndex}-${ dateEntry.dateIndex - dateEntry.firstDateOfMonth }`) !== -1"
                                                    :class="getState(`${year}-${dateEntry.monthIndex}-${ dateEntry.dateIndex - dateEntry.firstDateOfMonth}` ) === 1 ? 'office-flag--gray' : 'office-flag--red'"
                                            >
                                                {{ getState(`${year}-${dateEntry.monthIndex}-${ dateEntry.dateIndex - dateEntry.firstDateOfMonth }`) === 1 ? '学' : '休' }}
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
                        </span>
                        <el-select class="side__state-selector" size="small" v-model="selectedDateState"
                                   @change="stateChangeHandler" @visible-change="visibleChangeHandler">
                            <el-option label="休" :value="0"></el-option>
                            <el-option label="学" :value="1"></el-option>
                        </el-select>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
    import Swiper from 'swiper';
    import 'swiper/dist/css/swiper.min.css';
    import BackTool from '@/components/BackTool';
    import {getSchoolCalendarDetails, getMonthDate, setCalendarDate} from '@/api/schoolCalendar';
    import {getSchoolTimeAllList} from '@/api/schoolTimeList';
    import _ from 'lodash';

    export default {
        data: function () {
            return {
                date: new Date().toLocaleString().split(' ')[0].replace(/\//g, '-'),
                schoolTimeId: this.$route.query.schoolTimeId,
                termInfo: {
                    firstStartDate: '',
                    firstEndDate: '',
                    secondStartDate: '',
                    secondEndDate: '',
                    schoolYear: ''
                },
                dateInfoArray: [],
                renderYears: [],
                currentSlideDate: {
                    year: null,
                    month: 1
                },
                selectedDate: null,
                selectedDateState: -1,
                swiper: null,
                shouldUpdateState: false
            }
        },
        created: function () {
            getSchoolCalendarDetails(this.$route.query)
                .then(res => res.data)
                .then(data => {
                    if (data.result) {
                        this.termInfo = data.data;
                        getSchoolTimeAllList()
                            .then(res => res.data)
                            .then(data => {
                                if (data.result) {
                                    let minYear = parseInt(new Date().toLocaleString().split('/')[0]),
                                        maxYear = parseInt(new Date().toLocaleString().split('/')[0]);
                                    const renderYears = [];
                                    const firstStartDate = parseInt(this.termInfo.firstStartDate),
                                        secondEndDate = parseInt(this.termInfo.secondEndDate);
                                    for (let year = firstStartDate; year < secondEndDate; year++) {
                                        if (year < minYear) {
                                            minYear = year;
                                        }
                                        if (year > maxYear) {
                                            maxYear = year;
                                        }
                                    }
                                    data.data.forEach(item => {
                                        const startYear = parseInt(item.startDate.split('-')[0]),
                                            endYear = parseInt(item.endDate.split('-')[0]);
                                        if (startYear < minYear) {
                                            minYear = startYear;
                                        }
                                        if (endYear > maxYear) {
                                            maxYear = endYear;
                                        }
                                    });
                                    for (let i = minYear; i <= maxYear; i++) {
                                        renderYears.push(i);
                                    }
                                    this.renderYears = renderYears;
                                    this.currentSlideDate.year = renderYears[0];
                                    this.getMonthDateHandler();
                                }
                            })

                    } else {
                        this.$message.error('error');
                    }
                })
                .catch(() => {
                    this.$message.error('error');
                });
            this.currentSlideDate.month = 1;
        },
        mounted: function () {
            const vm = this;
            setTimeout(function () {
                vm.currentSlideDate.year = parseInt(vm.termInfo.firstStartDate);
                vm.currentSlideDate.month = parseInt(vm.termInfo.firstStartDate.split('-')[1]);
                vm.swiper = new Swiper('.swiper-container', {
                    initialSlide: (vm.currentSlideDate.year - vm.renderYears[0]) * 12 + (vm.currentSlideDate.month - 1)
                });

                vm.swiper.on('slideNextTransitionEnd', function () {
                    const yearLimit = vm.renderYears[vm.renderYears.length - 1];
                    if (vm.currentSlideDate.year < yearLimit ||
                        vm.currentSlideDate.year === yearLimit &&
                        vm.currentSlideDate.month !== 12
                    ) {
                        if (vm.currentSlideDate.month === 12) {
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
                    }
                    else {
                    }
                });
                vm.swiper.on('slidePrevTransitionEnd', function () {
                    const yearLimit = vm.renderYears[0];
                    if (vm.currentSlideDate.year > yearLimit ||
                        vm.currentSlideDate.year === yearLimit &&
                        vm.currentSlideDate.month !== 1
                    ) {
                        if (vm.currentSlideDate.month === 1) {
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
                    }
                    else {
                    }
                });
            }, 100)
        },
        methods: {
            getDateInfoObj(year) {

                const resultArray = [];
                for (let monthIndex = 1; monthIndex <= 12; monthIndex++) {
                    const innerArray = [];
                    resultArray.push(innerArray);
                    for (let i = 1, length = this.getFirstDayOfMonth(year, monthIndex) + this.getDatesOfMonth(year, monthIndex); i <= length; i++) {
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
                if (this.shouldUpdateState) {
                    setCalendarDate({
                        date: this.selectedDate,
                        weekDay: state
                    })
                        .then(res => res.data)
                        .then(data => {
                            if (data.result) {
                                this.getMonthDateHandler();
                            }
                        })
                }
            },
            isSelectedDate(date) {
                return date === this.selectedDate;
            },
            getState(date) {
                date = date.split('-').map(datePart => datePart.length < 2 ? `0${ datePart }` : datePart).join('-');
                const resultDateEntry = this.dateInfoArray.find(dateEntry => dateEntry.calendarDate === date);
                return !resultDateEntry ? -1 : resultDateEntry.weekDate;
            },
            getMonthDateHandler() {
                getMonthDate({
                    date: `${ this.currentSlideDate.year }-${ this.currentSlideDate.month }-01`
                })
                    .then(res => res.data)
                    .then(data => {
                        if (data.result) {
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
                this.selectedDate = selectedDate;
                this.selectedDateState = this.getState(selectedDate);
            },
            changeMonthHandler(value) {
                const yearIndex = this.renderYears.findIndex(year => year === this.currentSlideDate.year);
                this.swiper.slideTo(yearIndex * 12 + value - 1, 300, false);
                this.getMonthDateHandler();
            },
            slideTo: _.throttle(function (direction) {
                if (direction) {
                    switch (direction) {
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
                return new Date(year, monthIndex, 0).getDate();
            },
            getFirstDayOfMonth(year, monthIndex) {
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
                return value !== null ? value.split('-').map(datePart => datePart.length < 2 ? `0${ datePart }` : datePart).join('-') : '';
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

<style lang="scss">
    .page--schoolCalendar {
        padding:12px;
    }

    .page--schoolCalendar {
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
                height: 30px;
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
        .date-item--selected {
            background-color: #57ABFF;
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
        }
        .office-flag--gray {
            background-color: rgba(190, 190, 190, .8);
        }
        .office-flag--red {
            background-color: rgba(255, 64, 64, .8)
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
                height: 30px;
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

    }

</style>