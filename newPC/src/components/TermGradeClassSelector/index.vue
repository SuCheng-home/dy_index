<template>
    <span>
        <el-select class="header-buttom" v-model="obj.termId" size="medium" placeholder="请选择学期"
                   @change="termChange">
            <el-option
                v-for="item in termList"
                :key="item.id"
                :label="item.schoolTimeName"
                :value="item.id"
            >
            </el-option>
        </el-select>
        <el-date-picker
            v-show="isShowDuration"
            v-model="obj.duration"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            size="medium"
            type="daterange"
            range-separator="-"
            :picker-options="pickerOptions"
            @change="dateChange"
            start-placeholder="开始日期" style="width: 240px;"
            end-placeholder="结束日期">
        </el-date-picker>
        <el-select style="width: 140px;" class="header-buttom" @change="gradeChange" v-model="obj.gradeId" size="medium"
                   placeholder="请选择年级">
            <el-option
                v-for="item in gradeList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
            >
            </el-option>
        </el-select>
        <el-select v-if="isClassShow"  v-show="obj.gradeId != 0" style="width: 140px;" class="header-buttom" @change="classChange" v-model="obj.classId"
                   size="medium"
                   placeholder="请选择班级">
            <el-option
                v-if="isGradeShowAll"
                label="全部班级"
                :value="0"
            >
            </el-option>
            <el-option
                v-for="item in classList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
            >
            </el-option>
        </el-select>
    </span>
</template>

<script>
    import moment from 'moment';
    import {
        termlist
    } from '@/api/readBookSet';
    import {
        queryDepartListTerm,
    } from '@/api/common/common';

    export default {
        name: "TermGradeClassSelector",
        data() {
            return {
                allGradeClassList: [],

                termList: [],
                isCurrentTerm: false,
                gradeList: [],
                allClassList: [],
                pickerOptions: {
                    disabledDate(time) {
                        return (time.getTime() >= new Date('2010-08-31')) || (time.getTime() <= new Date('2030-09-01'));
                    }
                },
                obj: {
                    termId: '',
                    duration: ['', ''],
                    gradeId: '',
                    classId: '',
                    className:""
                }
            }
        },
        props: {
            value: {
                type: Object,
                required: true
            },
            queryArgs: {
                type: Object,
                default: function () {
                    return {
                        all: true,
                        manager: false,
                        notlimit: true,
                        submanager: false,
                        teacher: false
                    }
                }
            },
            isShowDuration: {
                default: true,
                type: Boolean
            },
            isGradeShowAll: {
                default: false,
                type: Boolean
            },
            isClassShow: {
                default: true,
                type: Boolean
            }
        },
        watch: {
            queryArgs() {
                this.init();
            },
            value(val) {
                this.obj = JSON.parse(JSON.stringify(val));
                this.$forceUpdate();
                this.setPickerOptions();
            }
        },
        mounted() {
            this.obj = JSON.parse(JSON.stringify(this.value));
            this.init();
        },
        computed: {
            classList() {
                const gradeObj = this.allGradeClassList.find(gradeItem => gradeItem.id == this.obj.gradeId);
                return gradeObj ? gradeObj.childList : [];
            }
        },
        methods: {
            init() {
                termlist()
                    .then(res => res.data)
                    .then(data => {
                        const pageData = data.data;
                        this.termList = pageData;
                        if(!this.obj.termId) {
                            const currentTerm = pageData.find(item => item.isCurrent == 1);
                            this.currentTerm = currentTerm;

                            if (currentTerm && !this.obj.termId) {
                                this.obj = Object.assign(this.obj, {
                                    termId: currentTerm.id
                                });
                            }
                        } else {
                            this.currentTerm = pageData.find(item => item.id == this.obj.termId);
                        }

                        this.setPickerOptions();
                        this.setDefaultDate(true);
                        this.queryDepartListTermFunc()
                            .then(() => {
                                this.setGradeClass();

                            });
                    })
            },
            termChange() {
                this.currentTerm = this.termList.find(item => item.id == this.obj.termId);
                this.obj.classId = 0;
                this.obj.gradeId = 0;
                this.setPickerOptions();
                this.setDefaultDate();
                this.queryDepartListTermFunc()
                    .then(() => {
                        this.setGradeClass();
                    });
            },
            dateChange() {
                this.$emit('input', JSON.parse(JSON.stringify(this.obj)));
            },
            gradeChange() {
                
                const gradeObj = this.allGradeClassList.find(item => item.id == this.obj.gradeId);
                if (gradeObj) {
                    let classId = gradeObj.childList && gradeObj.childList.length !== 0 ? gradeObj.childList[0].id : '';

                    if(this.isGradeShowAll) {
                        classId = 0;
                    }
                    this.$set(this.obj, 'classId', classId);
                }
                if(this.obj.gradeId){
                    this.$set(this.obj, 'className', this.getClassName());
                }else{
                    this.$set(this.obj, 'className', '全部班级');
                }               
                this.$emit('input', JSON.parse(JSON.stringify(this.obj)));
            },
            setPickerOptions() {
                this.pickerOptions = {
                    disabledDate: (time) => {
                        const date = moment(time.getTime()).format('YYYY-MM-DD');
                        return (date < this.currentTerm.startDate || date > this.currentTerm.endDate);
                    }
                }
            },
            setDefaultDate(isInit = false) {
                if(isInit && this.obj.duration[0] && this.obj.duration[1]) {
                    return undefined;
                }
                if (this.currentTerm.isCurrent == 1) {
                    const todayDate = moment().format('YYYY-MM-DD');
                    if(todayDate < this.currentTerm.startDate) {
                        this.$set(this.obj, 'duration', [moment().startOf('month').format('YYYY-MM-DD'), todayDate]);
                    } else {
                        const startDate = this.currentTerm.startDate;
                        const endDate = todayDate <= this.currentTerm.endDate ? todayDate : this.currentTerm.endDate;
                        this.$set(this.obj, 'duration', [startDate, endDate]);
                    }
                } else {
                    this.$set(this.obj, 'duration', [this.currentTerm.startDate, this.currentTerm.endDate]);
                }
            },
            queryDepartListTermFunc() {
                return queryDepartListTerm(Object.assign({}, {
                    currentTerm: this.currentTerm.isCurrent == 1,
                    termId: this.currentTerm.id
                }, this.queryArgs))
                    .then(res => res.data)
                    .then(data => {
                        const pageData = data.data || [];
                        if(this.isGradeShowAll) {
                            pageData.unshift({
                                id: 0,
                                name: '全部年级'
                            })
                        }
                        this.allGradeClassList = pageData || [];
                        this.gradeList = pageData || [];
                    })
            },
            setGradeClass() {
                if (!this.obj.gradeId && !this.obj.classId) {
                    let gradeId = '', classId = '';
                    if (this.gradeList && this.gradeList.length !== 0) {
                        gradeId = this.gradeList[0].id;
                    }
                    this.$set(this.obj, 'gradeId', gradeId);
                    if (gradeId) {
                        const gradeObj = this.allGradeClassList.find(item => item.id == gradeId);
                        if (gradeObj) {
                            classId = gradeObj.childList && gradeObj.childList.length !== 0 ? gradeObj.childList[0].id : '';
                        }

                    }
                    if(this.isGradeShowAll && this.obj.gradeId == 0) {
                        classId = 0;
                    }
                    this.$set(this.obj, 'classId', classId);                    
                }
                this.$set(this.obj, 'className', this.getClassName());
                this.$emit('input', JSON.parse(JSON.stringify(this.obj)));

            },
            classChange() {
                this.$set(this.obj, 'className', this.getClassName());
                this.$emit('input', JSON.parse(JSON.stringify(this.obj)));
            },
            getClassName() {
                if(this.obj.classId){
                     const classObj = this.classList.find(item => item.id == this.obj.classId);
                     return classObj ? classObj.name : ''
                }else{
                    return '全部班级'
                }
               
            }
        }
    }
</script>

<style scoped>

</style>
