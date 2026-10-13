<template>
    <div class="schoolTotal">
        <el-tabs type="border-card" v-model="activeName" @tab-click="tabsfun()">
            <el-tab-pane label="全校汇总" name="one">
                <div class="header">
                    <template>
                        <el-select size="medium" v-model="schoolTimeCode" placeholder="请选择学期" @change="changeSchool">
                            <el-option v-for="item in schoolYearList" :key="item.id" :label="item.schoolTimeName"
                                       :value="item.id">
                            </el-option>
                        </el-select>
                    </template>
                    <el-date-picker style="width: 250px;" size="medium" ref="date" v-model="date" type="daterange" class="mywidthdaterange"
                                    :editable="false" :clearable='false' align="right"
                                    unlink-panels placeholder="选择时间范围" @change="dateChange"></el-date-picker>
                    <el-button type="primary" size="medium" @click="examHandler">检索</el-button>
                </div>
                <div class="schoolWrap scrollStyle" :style="`height:${maxH-10}px`">
                    <div class="title"><span class="square"></span>全校汇总</div>
                    <div class="text">
                        <h3>全校总计上报荣誉&nbsp;&nbsp;{{AllTotal}}</h3>
                        <div class="gradeList clearfix">
                            <ul>
                                <li v-for="(gradeItem,gradeIndex) in honourGradeChar" :key="gradeIndex">
                                    <span class="title">{{gradeItem.name}}:</span>
                                    <span class="text">{{gradeItem.y}}</span>
                                </li>
                            </ul>
                        </div>
                        <div class="gradeList clearfix">
                            <ul>
                                <li v-for="(honorItem,honorIndex) in honourAllChar" :key="honorIndex">
                                    <span class="title">{{honorItem.name}}:</span>
                                    <span class="text">{{honorItem.y}}</span>
                                </li>
                            </ul>
                        </div>
                        <div class="picBox clearfix">
                            <div class="picItem honourAllChar" id="honourAllChar">

                            </div>
                            <div class="picItem honourGradeChar" id="honourGradeChar">

                            </div>

                        </div>
                    </div>
                </div>
            </el-tab-pane>
            <el-tab-pane label="学生明细" name="two"></el-tab-pane>
            <el-tab-pane label="年级统计" name="five"></el-tab-pane>
            <el-tab-pane label="班级统计" name="three"></el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
    import mixins from '@/mixins/windowResize';
    import echarts from 'echarts';
    import {getSchoolTimeAllList, gethonorTypeAllChar, gethonorTypeAllGradeChar} from '@/api/honour/index';

    export default {
        data() {
            return {
                date: [],
                schoolName: '',
                schoolTimeCode: '',
                schoolYearList: [],
                honourGradeChar: [],
                honourAllChar: [],
                honourGradeChars: null,
                honourAllChars: null,
                AllTotal: 0,
                schoolTimeId: this.$route.query.schoolTimeId ? this.$route.query.schoolTimeId : '',
                startDateNew: this.$route.query.startDateNew ? this.$route.query.startDateNew : '',
                endDateNew: this.$route.query.endDateNew ? this.$route.query.endDateNew : '',
                activeName: 'one'
            }
        },
        created() {
            this.getSchoolTimeAllListFunc();
        },
        mixins: [mixins],
        methods: {
            tabsfun() {
                if (this.activeName == 'two') {
                    this.$router.push({path: 'studentList',});
                } else if (this.activeName == 'three') {
                    this.$router.push({path: 'classStatistics',});
                } else if (this.activeName == 'five') {
                    this.$router.push({path: 'gradeStatistics',});
                }
            },
            dateChange(val) {
                this.date = [this.$moment(val[0]).format("YYYY-MM-DD"), this.$moment(val[1]).format("YYYY-MM-DD")]; //时间
                this.startDateNew = '';
                this.endDateNew = '';
            },
            AllTotals() {
                //荣誉等级分布图
                this.gethonorTypeAllCharFunc();
                //荣誉分布图
                this.gethonorTypeAllGradeCharFunc();
            },
            gethonorTypeAllCharFunc() {
                gethonorTypeAllChar({
                    schoolTimeId: this.schoolTimeCode,
                    startDate: this.date[0],
                    endDate: this.date[1]
                }).then(res => res.data)
                    .then(data => {
                        if (data.code === 200) {
                            //荣誉等级分布图
                            this.honourAllChar = data.data;
                            this.ModuleAllCharFunc(this.honourAllChar);
                        }
                    })
            },
            ModuleAllCharFunc(array) {
                this.honourAllChars = echarts.init(document.getElementById('honourAllChar'));
                this.honourAllChars.setOption({
                    title: {
                        text: '荣誉等级分布图',
                        textStyle: {
                            fontSize: 18,
                            color: '#333',

                            width: '100%'
                        },
                        x: 'center'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} :{d}%"
                    },
                    color: [
                        "#7CB5EC", "#434348", "#90ED7D", "#F7A35C", "#8085E9", "#F15C80"
                    ],
                    legend: {
                        x: 'center',
                        y: 'bottom',
                        data: array.map(item => {
                            return item.name
                        })
                    },
                    series: [
                        {
                            name: '',
                            type: 'pie',
                            radius: '55%',
                            center: ['50%', '55%'],
                            data: array.map(item => ({
                                value: item.y,
                                name: item.name
                            })),
                            label: {normal: {formatter: '{b}:{c}'}},
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                })
                this.honourAllChars.on("click", this.honourAllDetail);

            },
            honourAllDetail(params) {
                let honorTypeId = this.honourAllChar[params.dataIndex].id;
                if (honorTypeId) {
                    this.$router.push({
                        path: 'schoolTotalDetail',
                        query: {
                            honorTypeId: honorTypeId,
                            schoolTimeCode: this.schoolTimeCode,
                            startDate: this.date[0],
                            endDate: this.date[1]
                        }
                    });
                }
            },
            ModuleGradeCharFunc(array) {
                this.honourGradeChars = echarts.init(document.getElementById('honourGradeChar'));
                this.honourGradeChars.setOption({
                    title: {
                        text: '荣誉分布图',
                        textStyle: {
                            fontSize: 18,
                            color: '#333',

                            width: '100%'
                        },
                        x: 'center'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} :{d}%"
                    },
                    color: [
                        "#7CB5EC", "#434348", "#90ED7D", "#F7A35C", "#8085E9", "#F15C80"
                    ],
                    legend: {
                        x: 'center',
                        y: 'bottom',
                        data: array.map(item => {
                            return item.name
                        })
                    },
                    series: [
                        {
                            name: '',
                            type: 'pie',
                            radius: '50%',
                            center: ['50%', '55%'],
                            data: array.map(item => ({
                                value: item.y,
                                name: item.name
                            })),
                            label: {normal: {formatter: '{b}:{c}'}},
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                })
                this.honourGradeChars.on("click", this.honourGradeDetail);

            },
            honourGradeDetail(params) {
                //右边的图
                let gradeId = this.honourGradeChar[params.dataIndex].id;
                if (gradeId) {
                    this.$router.push({
                        path: 'schoolTotalTypeDetail',
                        query: {
                            gradeId: gradeId,
                            schoolTimeId: this.schoolTimeCode,
                            startDate: this.date[0],
                            endDate: this.date[1]
                        }
                    });
                }
            },
            gethonorTypeAllGradeCharFunc() {
                gethonorTypeAllGradeChar({
                    schoolTimeId: this.schoolTimeCode,
                    startDate: this.date[0],
                    endDate: this.date[1]
                }).then(res => res.data)
                    .then(data => {
                        if (data.code === 200) {
                            //荣誉分布图
                            this.honourGradeChar = data.data;
                            let aa = this.honourGradeChar.map(item => item.y);
                            this.AllTotal = aa.reduce(function (prev, next) {
                                return prev + next
                            });
                            this.ModuleGradeCharFunc(this.honourGradeChar);
                        }
                    })
            },
            getSchoolTimeAllListFunc() {
                //学期列表
                getSchoolTimeAllList().then(res => res.data)
                    .then(data => {
                        if (data.code === 200) {
                            this.schoolYearList = data.data;
                            if (this.schoolTimeId) {
                                this.schoolYearList.forEach((item, index) => {
                                    if (this.schoolTimeId == item.id) {
                                        this.schoolName = item.schoolTimeName;
                                        this.schoolTimeCode = item.id;
                                    }
                                });
                                this.date = [this.startDateNew, this.endDateNew];
                                this.AllTotals();
                            } else {
                                this.schoolYearList.forEach(item => {
                                    if (item.isCurrent == 1) {
                                        this.schoolName = item.schoolTimeName;
                                        this.schoolTimeCode = item.id;
                                         if(item.startDate>(this.$moment(new Date()).format('YYYY-MM-DD')+"")){
                             this.date = [new Date(),item.startDate];
                            }else{
                              this.date = [item.startDate,new Date()];
                            }   
                                        this.AllTotals();
                                    }
                                })
                            }
                        }
                    })
            },
            changeSchool(val) {
                //切换学期
                this.schoolTimeCode = val;
                let schoolItem = this.schoolYearList.find(item => this.schoolTimeCode == item.id);
                this.date[0] = schoolItem.startDate;
                if (schoolItem.isCurrent == 1) {
                    this.date[1] = this.$moment().format('YYYY-MM-DD');
                } else {
                    this.date[1] = schoolItem.endDate;
                }
                this.schoolTimeId = '';
                this.startDateNew = '';
                this.endDateNew = '';
                this.AllTotals();
            },
            examHandler() {
                if (!this.date.length) {
                    this.$message({
                        type: 'error',
                        message: '请选择时间范围!'
                    });
                    return false;
                }
                this.AllTotals();
                //检索
            }
        }
    }
</script>
<style lang="scss" scoped>
    ul {
        list-style-type: none;
    }

    .clearfix:after {
        content: '';
        display: block;
        height: 0;
        clear: both;
        visibility: hidden;
    }

    .schoolTotal {
        padding: 10px;
        box-sizing: border-box;
        font-size: 14px;

        .header {
            padding-bottom: 10px;
            border-bottom: 1px solid #e7eaec;

        }

        .schoolWrap {
            overflow-x: hidden;
            overflow-y: auto;
            padding-top: 10px;
            box-sizing: border-box;

            .title {
                line-height: 34px;
                height: 34px;

                .square {
                    display: inline-block;
                    width: 10px;
                    height: 10px;
                    background: #ACD6FF;
                    margin: 15px 8px 0 0;
                }
            }

            .text {
                padding-left: 18px;
                box-sizing: border-box;

                h3 {
                    font-size: 16px;
                }

            }
        }

        .gradeList {
            width: 100%;

            li {
                float: left;
                font-size: 15px;
                margin-right: 10px;

                .title {
                }

                .text {
                    padding-left: 0;
                }
            }
        }

        .picBox {
            padding-top: 30px;
            padding-bottom: 30px;

            .picItem {
                float: left;
                width: 556px;
                height: 440px;
            }
        }
    }
</style>

