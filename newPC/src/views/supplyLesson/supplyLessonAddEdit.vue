<!--添加通知-->
<template>
    <div class="app-container calendar-list-container" id="noticeAdd">
        <backtool>
            <el-button type="primary" size="medium" @click.native="saveHandler(1)">存草稿
            </el-button>
            <el-button type="primary" size="medium" @click.native="saveHandler(2)">发布
            </el-button>
        </backtool>
        <div :class="['page-main', isStandalone ? 'page-main--scroller' : '']" :style="{'height':nobottommaxH+'px'}"
             style="overflow: auto">
            <div style="width: 810px;padding-top:20px;margin: 0 auto;">
                <el-form :model="formData" :rules="rules" ref="form" label-width="140px" class="demo-ruleForm">
                    <el-form-item label="代班老师" prop="supplyTeacherJson">
                        <address-book v-model="formData.supplyTeacherJson" :config="otherTeacherConfig"></address-book>
                    </el-form-item>                   
                    <el-form-item label="需代班级" prop="adjustClassId">
                        <el-select allow-create v-model="formData.adjustClassId" @change="onClassSelectorConfirm"
                                   placeholder="请选择">
                            <el-option v-for="item in classList" :key="item.id" :label="item.name"
                                       :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="被代班老师" prop="adjustedTeacher">
                        {{adjustedTeacher}}
                    </el-form-item>                    
                    <el-form-item label="代班方式" prop="substituteType">
                        <el-radio-group v-model="formData.substituteType" @change="onTypeSelectorConfirm">
                             <el-radio label="2">按天</el-radio>
                            <el-radio label="1">按节次</el-radio>                           
                        </el-radio-group>
                    </el-form-item>
                     <el-form-item label="开始日期" prop="adjustDate">
                        <el-date-picker type="date" placeholder="开始日期"
                                        format="yyyy-MM-dd" value-format="yyyy-MM-dd" :editable='false' :clearable='false'
                                        v-model="formData.adjustDate" style="width: 100%;"></el-date-picker>
                    </el-form-item>
                     <el-form-item label="开始时间" prop="substituteType" v-show="formData.substituteType == 2" >
                        <el-radio-group v-model="formData.startDayType" >
                            <el-radio :label="1">上午</el-radio>
                            <el-radio :label="2">下午</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="节次" v-show="formData.substituteType == 1" prop="adjustClassNoName">
                        <el-select allow-create v-model="formData.adjustClassNoName" @change="onSectionConfirm"
                                   placeholder="请选择">
                            <el-option v-for="item in sectionList" :key="item.id" :label="item.name"
                                       :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="天数" v-show="formData.substituteType == 2" prop="substituteDayNum">
                        <el-input-number v-model="formData.substituteDayNum" :step="0.5" :min="0.5"></el-input-number>
                    </el-form-item>
                    <el-form-item label="理由" prop="inscribe">
                        <el-input type="textarea" v-model.trim="formData.reason" rows="3" :maxlength="200"></el-input>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    import AddressBook from '@/components/AddressBook/indexExpand';
    import {viewThAskLeaveFourViewHeader} from '@/api/teacherLeave4'
    import {
        querySchoolClass,
        queryManager,
        getClassAndGradeByManagerId
    } from '@/api/common/common';
    import {
        getSchoolClassNoJSONArray,
    } from '@/api/supplyClass';
    import {
        getSupplyAdjustClassInfo,
        addSubstituteClassApply,
        editSubstituteClassApply
    } from '@/api/supplyLesson';

    export default {
        name: "supplyLessonAddEdit",
        data() {
            const checkAddressData = (rule, value, callback) => {
                if ((value.userJson && value.userJson.length > 0) ) {
                    callback();
                } else {
                    return callback(new Error('请选择代班老师！'));
                }
            };
            const adjustedTeacherValidator = (rule, value, callback) => {
                if (!!this.adjustedTeacher) {
                    callback();
                } else {
                    return callback(new Error('该班级无班主任！'));
                }
            };
            const adjustClassNoNameValidator = (rule, value, callback) => {
                if (this.formData.substituteType == 2 || this.formData.adjustClassNoName) {
                    callback();
                } else {
                    return callback(new Error('请选择节次！'));
                }
            };
            const substituteDayNumValidator = (rule, value, callback) => {
                if (this.formData.substituteType == 1 || this.formData.substituteDayNum) {
                    callback();
                } else {
                    return callback(new Error('请选择天数！'));
                }
            };
            return {
                id: this.$route.query.id,
                isEdit: !!this.$route.query.id,
                leaveId: this.$route.query.leaveId || '', // 老师请假4 跳转过来携带的请假id
                leaveDetail: {},
                active: 1,
                adjustedTeacher: '',

                otherTeacherConfig: {
                    title: '选择老师',
                    depart: {target: 'user', departType: 't', userTypes: '1'},
                    group: false,
                    SingleChose: true
                },
                isShowCalendar: false,
                classList: [],
                isShowClassSelector: false,
                isShowType: false,
                typeList: [{
                    name: '按节次',
                    id: '1'
                }, {
                    name: '按天',
                    id: '2'
                }],
                isShowSection: false,
                sectionList: [],
                formData: {
                    supplyTeacherJson: {
                        userJson: []
                    },
                    adjustDate: '',
                    adjustClassId: '',
                    adjustClassName: '',
                    substituteType: '2',
                    substituteTypeName: '按天',
                    adjustClassNo: '',
                    adjustClassNoName: '',
                    substituteDayNum: 0.5,
                    reason: '',
                    startDayType:1
                },
                rules: {
                    supplyTeacherJson: [
                        {required: true, validator: checkAddressData, trigger: 'blur'}
                    ],
                    adjustDate: [
                        {required: true, message: '请选择开始日期', trigger: 'blur'}
                    ],
                    adjustClassId: [
                        {required: true, message: '请选择需代班级', trigger: 'blur'}
                    ],
                    adjustedTeacher: [{
                        required: true, validator: adjustedTeacherValidator
                    }],
                    substituteType: [
                        {required: true, message: '请选择代班方式', trigger: 'blur'}
                    ],
                    adjustClassNoName: [{
                        required: true, validator: adjustClassNoNameValidator
                    }],
                    substituteDayNum: [{
                        required: true, validator: substituteDayNumValidator
                    }],
                },
            }
        },
        components: {
            AddressBook
        },
        computed: {
            ...mapGetters(['userInfo'])
        },
         watch: {
      'formData.supplyTeacherJson': {
        handler: function () {
          this.$refs.form.validateField('supplyTeacherJson');
        },
        deep: true
      }
    },
        mounted() {
            document.title = '代班';

            if(this.isEdit) {
                getSupplyAdjustClassInfo({
                    id: this.id
                })
                    .then(res => res.data)
                    .then(data => {
                        data.data.supplyTeacherJson = {
                            userJson: data.data.supplyTeacherList
                        };
                        data.data.substituteType = `${data.data.substituteType}`;
                        data.data.substituteTypeName = data.data.substituteType == 1 ? '按节次' : '按天';

                        this.formData = data.data;
                    });
            }
            
            if (this.leaveId) {
                // 老师请假4 跳转过来携带的请假id
                viewThAskLeaveFourViewHeader({
                    askId: this.leaveId
                })
                    .then(res => res.data)
                    .then(data => {
                        this.leaveDetail = data.data.thAskLeaveFour
                        this.adjustedTeacher = this.leaveDetail.teacherName;
                        this.formData.adjustDate = this.leaveDetail.startDate;
                        if (this.leaveDetail.askType==2) {
                            this.formData.startDayType = this.leaveDetail.isMoring
                        }
                        getClassAndGradeByManagerId(this.leaveDetail.teacherId)
                            .then(res => res.data)
                            .then(res => {
                                console.log(res);
                                this.classList = res.data.map(i => ({
                                    name: i.className,
                                    id: i.classId
                                }));
                                this.formData.adjustClassId = this.classList[0].id;
                                this.formData.adjustClassName = this.classList[0].name;
                            })
                    })
            } else {
                querySchoolClass()
                    .then(res => res.data)
                    .then(data => {
                        const pageData = data.data;
                        this.classList = pageData;
                        if (this.classList && this.classList.length !== 0) {
                            if(!this.isEdit) {
                                this.formData.adjustClassId = this.classList[0].id;
                                this.formData.adjustClassName = this.classList[0].name;
                            }
                            this.queryManagerFunc();
                        }
                    })
            }

            getSchoolClassNoJSONArray()
                .then(res => res.data)
                .then(data => {
                    const pageData = data.data;
                    this.sectionList = pageData.map(item => ({
                        id: item.sectionId,
                        name: item.sectionNoName
                    }));
                    if (!this.isEdit && pageData && pageData.length !== 0) {
                        this.formData.adjustClassNo = pageData[0].sectionId;
                        this.formData.adjustClassNoName = pageData[0].sectionNoName;
                    }
                })
                .catch(() => {
                });
        },
        methods: {
           weekfun(day){
             if(day){
                let myDate = new Date(day)
                let wk = myDate.getDay()
                let weeks = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
                return day + weeks[wk]
             }            
            },
            onClassSelectorConfirm(id) {

                this.formData.adjustClassId = id;
                this.formData.adjustClassName = this.classList.find(item => item.id == id).name;
                this.queryManagerFunc();
            },
            onTypeSelectorConfirm(id) {
                this.formData.substituteType = id;
                this.formData.substituteTypeName = id == 1 ? '按节次' : '按天';
            },
            onSectionConfirm(id) {
                this.formData.adjustClassNo = id;
                this.formData.adjustClassNoName =  this.sectionList.find(item => item.id == id).name;
            },
            queryManagerFunc() {
                console.log(111111111, this.formData.adjustClassId)
                if(this.formData.adjustClassId) {
                    queryManager({
                        departId: this.formData.adjustClassId
                    })
                        .then(res => res.data)
                        .then(data => {
                            if(data.data) {
                                this.adjustedTeacher = data.data.name;
                            } else {
                                this.adjustedTeacher = '';
                            }
                        })
                }

            },
            saveHandler(state) {
                this.$refs.form.validate(isValid => {
                    if(isValid) {
                        const args = {
                            adjustClassId: this.formData.adjustClassId,
                            startDayType: this.formData.startDayType,
                            adjustClassName: this.formData.adjustClassName,
                            adjustClassNo: this.formData.substituteType == 1 ? this.formData.adjustClassNo : '',
                            adjustClassNoName: this.formData.substituteType == 1 ? this.formData.adjustClassNoName : '',
                            adjustDate: this.formData.adjustDate,
                            createUserType: 1,
                            reason: this.formData.reason,
                            state,
                            substituteType: this.formData.substituteType,
                            substituteDayNum: this.formData.substituteType == 2 ? this.formData.substituteDayNum : '',
                            supplyDate: this.formData.adjustDate,
                            supplyTeacherJson: JSON.stringify(this.formData.supplyTeacherJson.userJson)
                        };
                        new Promise(resolve => {
                            if(this.isEdit) {
                                args.id = this.id;
                                editSubstituteClassApply(args)
                                    .then(res => res.data)
                                    .then(resolve)
                            } else {
                                addSubstituteClassApply(args)
                                    .then(res => res.data)
                                    .then(resolve)
                            }
                        })
                            .then(data => {
                                if (data.result) {
                                    this.$message.success(`${state == 1 ? '保存' : '提交'}成功`);
                                } else {
                                    this.$message.error (data.msg);
                                }
                                setTimeout(() => {
                                    this.$router.back();
                                }, 1000);
                            });
                    }
                })

            }
        }
    }
</script>
<style scoped>
    .img-item {
        width: 160px;
        height: 200px;
        float: left;
        margin-right: 10px;
        margin-top: 10px;
        background-position: center center;
        background-size: cover;
        position: relative;
        border: 1px solid #d0d0d0;
    }


    .img-box-item-close {
        width: 36px;
        height: 36px;
        display: block;
        float: right;
        background-size: cover;
        background-position: center center;
        background-image: url(https://cdnfile-10043692.file.myqcloud.com/vuewxcep/common_img/wxcep_phone_close.png);
        cursor: pointer;
    }
</style>
