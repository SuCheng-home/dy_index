<template>
    <div class="open_class_add">
        <div class="header">
            <el-button size="medium" @click="goBack">返回</el-button>
            <el-button size="medium" type="primary" @click="saveOpenClass">提交</el-button>
        </div>
        <div class="open_class_add_box" :style="`height: ${nobottommaxH}px;`">
            <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="120px" class="demo-ruleForm">
                <el-row>
                    <el-col :span="15">
                        <el-form-item label="上课日期" prop="openClassDate">
                            <el-date-picker v-model="ruleForm.openClassDate" type="date" placeholder="选择上课日期"
                                            :clearable="false"
                                            @change="changeDate"
                                            :picker-options="openClassDateOptions"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="年级" prop="gradeId">
                            <el-select v-model="ruleForm.gradeId" placeholder="请选择年级" @change="changeGrade">
                                <el-option v-for="item in gradeList" :key="item.id" :label="item.name" :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="班级" prop="classId">
                            <el-select v-model="ruleForm.classId" placeholder="请选择班级" @change="changeClass">
                                <el-option v-for="item in classList" :key="item.id" :label="item.name" :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="节次" prop="sectionId">
                            <el-select v-model="ruleForm.sectionId" placeholder="请选择节次" @change="changeSection">
                                <el-option v-for="item in schoolSectionList" :key="item.sectionId"
                                           :label="item.sectionNoName"
                                           :value="item.sectionId">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="学科" prop="subjectId">
                            <el-select v-model="ruleForm.subjectId" placeholder="请选择学科">
                                <el-option v-for="item in subjectList" :key="item.id" :label="item.name"
                                           :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="课题" prop="subjectTheme">
                            <el-input v-model.trim="ruleForm.subjectTheme" placeholder="课题(1-30个字符)"
                                      :maxlength="30"></el-input>
                        </el-form-item>
                        <el-form-item label="地点" prop="addressName">
                            <el-select v-model="ruleForm.addressName" placeholder="请选择地点">
                                <el-option v-for="(item, index) in addressList" :key="index" :label="item"
                                           :value="item">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="地点" v-if="ruleForm.addressName=='其他'">
                            <el-input v-model.trim="inputaddressName" placeholder="请输入地点" :maxlength="30"></el-input>
                        </el-form-item>
                        <el-form-item label="级别" prop="level">
                            <el-select v-model="ruleForm.level" placeholder="请选择级别">
                                <el-option v-for="item in levelList" :key="item.id" :label="item.name" :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="公开课类型" prop="classTypeId">
                            <el-select v-model="ruleForm.classTypeId" placeholder="请选择类型">
                                <el-option v-for="item in classTypeList" :key="item.id" :label="item.name"
                                           :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="审批人" prop="approvalId">
                            <el-select v-model="ruleForm.approvalId" placeholder="请选择审批人">
                                <el-option v-for="item in approvalList" :key="item.id" :label="item.name"
                                           :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="备注" prop="applyRemark">
                            <el-input type="textarea" placeholder="请输入内容"
                                      v-model.trim="ruleForm.applyRemark"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8" :offset="1" v-if="openClassId">
                        <div class="header_top_title">审核记录</div>
                        <div class="check_msg_list" :key="index" v-for="(item, index) in openClassInfo.rejectList">
                            <div>
                                <el-tag type="danger" size="medium">驳回</el-tag>&nbsp;&nbsp;{{item.examineUserName}}&nbsp;{{item.rejectDate
                                | timeFilter}}
                            </div>
                            <div class="reject_text">{{item.rejectReason}}</div>
                        </div>
                        <div class="check_msg_list" v-if="openClassInfo.state === 4">
                            <div>
                                <el-tag type="success" size="medium">同意</el-tag>&nbsp;&nbsp;{{openClassInfo.examineUserName}}&nbsp;{{openClassInfo.publishTime
                                | timeFilter}}
                            </div>
                            <div class="reject_text">{{openClassInfo.approveRemark}}</div>
                        </div>
                        <div class="check_msg_list" v-if="openClassInfo.state === 2">暂无记录</div>
                    </el-col>
                </el-row>
            </el-form>
        </div>
    </div>
</template>

<script>
    import mixins from '@/mixins/windowResize';
    import AddressBook from '@/components/AddressBook/indexExpand';
    import { getSchoolTimeAllList } from "@/api/newWorkPlan";
    import {  getMonthDayContainHoliday} from '@/api/schoolTimeList';
    import {
        findDicsByCode,
        registerDetail,
        getClassNoList,
        getClassNoTeacher,
        querySchoolGradeClass,
        queryCoursesByClassId,
        addMyRegister,
        editMyRegister,
        getAuditUser
    } from "@/api/teachingStudy/openClass";
    import {
        querySchoolAllCourse,
    } from "@/api/recordbook";

    export default {
        name: "openClassMyAdd",
        components: {
            AddressBook
        },
        data() {
             const self = this;
            return {
                allowedDates: [],
                openClassId: 0,
                openClassInfo: {},
                openClassDateOptions: {
                    disabledDate(time) {
                        if (self.allowedDates && self.allowedDates.length > 0) {
                            return !self.allowedDates.includes(self.getStrDate(time));
                            }
                            // 禁用今天之前的日期，不包括今天
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            return time.getTime() < today.getTime();
                    }
                },
                schoolSectionList: [],
                gradeList: [],
                classList: [],
                subjectList: [],
                addressList: ['本班教室', '多媒体教室', '操场', '体育馆', '实验室', '合班教室', '录播教室', '计算机教室', '音乐教室', '美术教室', '其他'],
                levelList: [
                     {
                        key: 0,
                        value: '省级'
                    },
                    {
                        id: 1,
                        name: '市级'
                    },
                    {
                        id: 2,
                        name: '区级'
                    },
                    {
                        id: 3,
                        name: '校级'
                    },
                    {
                        id: 4,
                        name: '组级'
                    },
                    {
                        id: 5,
                        name: '其他'
                    }
                ],
                classTypeList: [],
                approvalList: [],
                ruleForm: {
                    openClassDate: '',
                    gradeId: '',
                    classId: '',
                    sectionId: '',
                    subjectId: '',
                    addressName: '本班教室',
                    level: 1,
                    classTypeId: '',
                    approvalId: '',
                    applyRemark: '',
                    subjectTheme: ''
                },
                rules: {
                    openClassDate: [
                        {required: true, message: '请选择上课日期！'}
                    ],
                    subjectTheme: [
                        {required: true, message: '请输入课题！'}
                    ],
                    gradeId: [
                        {required: true, message: '请选择年级！'}
                    ],
                    classId: [
                        {required: true, message: '请选择班级！'}
                    ],
                    sectionId: [
                        {required: true, message: '请选择节次！'}
                    ],
                    subjectId: [
                        {required: true, message: '请选择学科！'}
                    ],
                    addressName: [
                        {required: true, message: '请选择地点！'}
                    ],
                    level: [
                        {required: true, message: '请选择级别！'}
                    ],
                    classTypeId: [
                        {required: true, message: '请选择公开课类型！'}
                    ],
                    approvalId: [
                        {required: true, message: '请选择审批人！'}
                    ]
                },
                inputaddressName: "",
                  schoolTimeId: ''
            }
        },
        mixins: [mixins],
        filters: {
            timeFilter(time) {
                return time ? time.slice(0, 19) : '';
            }
        },
        created() {
            this.openClassId = this.$route.query.id || 0;
              var today = new Date();
            var nextMonth = new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000);
            var year = nextMonth.getFullYear();
            var month = nextMonth.getMonth() + 1;
            var day = nextMonth.getDate();
            if (month < 10) {
            month = "0" + month;
            }
            if (day < 10) {
            day = "0" + day;
            }
            this.ruleForm.openClassDate=year + "-" + month + "-" + day
             this.getSchoolTimeAllList();
            this.getAuditUserFunc();
            this.findDicsByCode();
            this.getClassNoList();
            if (this.openClassId) {
                this.registerDetail();
            } else {
                this.querySchoolGradeClass();
            }
        },
        methods: {
             getSchoolTimeAllList() {
            getSchoolTimeAllList()
                .then(res => res.data)
                .then(data => {
                    if (data.data.length !== 0) {
                        const currentTerm = data.data.find(item => item.isCurrent === 1);
                        this.schoolTimeId = currentTerm.id;
                        if (currentTerm.startDate && currentTerm.endDate) {
                            const dateList = this.getBetweenMonth(currentTerm.startDate, currentTerm.endDate);
                            this.getSchoolCalendar(dateList);
                        } else {
                             this.getSchoolCalendar([this.ruleForm.openClassDate]);
                        }
                    }
                });
        },
         getBetweenMonth(startDate, endDate) {
            let start = new Date(startDate);
            let end = new Date(endDate);
            let startYear = start.getFullYear();
            let startMonth = start.getMonth();
            let endYear = end.getFullYear();
            let endMonth = end.getMonth();
            let result = [];
            
            let curr = new Date(startYear, startMonth, 1);
            let max = new Date(endYear, endMonth, 1);
            
            while (curr <= max) {
                let month = curr.getMonth() + 1;
                let str = curr.getFullYear() + "-" + (month < 10 ? "0" + month : month) + "-01";
                result.push(str);
                curr.setMonth(curr.getMonth() + 1);
            }
            return result;
        },
             getSchoolCalendar(dateList) {
            this.allowedDates = [];
            // 获取今天的日期字符串（YYYY-MM-DD）
            const today = new Date();
            const todayStr = today.toISOString().split('T')[0];
            
            dateList.forEach(date => {
                getMonthDayContainHoliday({
                    schoolTimeId: this.schoolTimeId,
                    date: date
                }).then(res => res.data)
                .then(data => {
                    if (data.data && data.data.length !== 0) {
                        // 过滤出工作日且不早于今天的日期
                        const validDates = data.data.filter(item => 
                            item.weekDate === 1 && item.schoolTimeDate >= todayStr
                        ).map(item => item.schoolTimeDate);
                        
                        validDates.forEach(d => {
                             if (!this.allowedDates.includes(d)) {
                                 this.allowedDates.push(d);
                             }
                        });
                    }
                });
            });
        },
            goBack() {
                this.$router.back();
            },
            changeDate(date) {
                this.ruleForm.openClassDate = this.getStrDate(date);
                this.getClassNoTeacher();
            },
            changeGrade(val) {
                if (val) {
                    this.classList = this.gradeList[this.gradeList.map(item => item.id).indexOf(val)].classList || [];
                    this.classList.push({
                        id: 0,
                        name: "无"
                    });
                    this.ruleForm.classId = this.classList[0].id || '';
                    this.changeClass(this.ruleForm.classId);
                }
            },
            changeClass(val) {
                this.queryCoursesByClassId(val);
                this.getClassNoTeacher();
            },
            changeSection(val) {
                this.getClassNoTeacher();
            },
            // 教务处
            getAuditUserFunc() {
                getAuditUser().then(res => {
                    if (res.data.code === 200) {
                        const data = res.data.data;
                        this.approvalList = data.map((item) => {
                            return {
                                id: item.id,
                                name: item.name
                            }
                        });
                    }
                }).catch();
            },
            // 类型列表
            findDicsByCode() {
                findDicsByCode('openClassType').then(res => {
                    const data = res.data.data;
                    if (res.data.code === 200) {
                        this.classTypeList = data.map((item) => {
                            return {
                                id: item.id,
                                name: item.value
                            }
                        });
                    }
                }).catch();
            },
            // 详情
            registerDetail() {
                registerDetail(this.openClassId).then(res => {
                    const data = res.data.data;
                    if (res.data.code === 200) {
                        this.openClassInfo = data;
                        this.ruleForm = {
                            openClassDate: data.listenDate,
                            gradeId: data.gradeId,
                            classId: data.classId,
                            sectionId: data.classNo,
                            subjectId: data.subjectId,
                            addressName: "",
                            level: Number(data.level),
                            classTypeId: data.openClassTypeId,
                            approvalId: data.examineUserId,
                            applyRemark: data.applyRemark,
                            subjectTheme: data.subjectTheme
                        };
                        for (let i = 0; i < this.addressList.length; i++) {
                            if (data.place == this.addressList[i]) {
                                this.ruleForm.addressName = data.place;
                            }
                        }
                        this.ruleForm.addressName = this.ruleForm.addressName ? this.ruleForm.addressName : "其他";
                        this.inputaddressName = this.ruleForm.addressName == "其他" ? data.place : "";
                    }
                }).then(() => {
                    this.querySchoolGradeClass();
                }).catch();
            },
            // 获取节次
            getClassNoList() {
                getClassNoList().then(res => {
                    const data = res.data;
                    if (res.data.code === 200 && data.data.length) {
                        this.schoolSectionList = data.data;
                        if (!this.openClassId) {
                            this.ruleForm.sectionId = data.data[0].sectionId || '';
                        }
                    }
                }).catch();
            },
            // 选节次 带出学科 老师
            getClassNoTeacher() {
                if (!this.ruleForm.classId || !this.ruleForm.sectionId || !this.ruleForm.openClassDate) {
                    return;
                }
                const query = {
                    classId: this.ruleForm.classId,
                    classNo: this.ruleForm.sectionId,
                    listenDate: this.ruleForm.openClassDate
                };
                getClassNoTeacher(query).then(res => {
                    const data = res.data.data;
                    if (res.data.code === 200) {
                        if (data.subjectId && this.subjectList.length && this.subjectList.map(item => item.id).indexOf(data.subjectId) > -1) {
                            this.ruleForm.subjectId = data.subjectId || '';
                        } else {
                            this.ruleForm.subjectId = '';
                        }
                    }
                }).catch();
            },
            // 获取年级班级列表
            querySchoolGradeClass() {
                querySchoolGradeClass().then((res) => {
                    const data = res.data.data;
                    if (res.data.code === 200) {
                        this.gradeList = data;
                        if (!this.openClassId) {
                            this.classList = data[0].classList || [];
                            this.classList.push({
                                id: 0,
                                name: "无"
                            });
                            this.ruleForm.gradeId = data[0].id || '';
                            this.ruleForm.classId = this.classList[0].id || '';
                        } else {
                            this.classList = data[data.map(item => item.id).indexOf(this.ruleForm.gradeId)].classList || [];
                            this.classList.push({
                                id: 0,
                                name: "无"
                            })
                        }

                        this.queryCoursesByClassId(this.ruleForm.classId);
                    }
                }).catch(() => {
                });
            },
            // 根据班级id查询学科列表
            queryCoursesByClassId(id) {
                if (!id) {
                    querySchoolAllCourse()
                        .then(res => {
                            const data = res.data.data;
                            this.subjectList = data;
                        })
                        .catch(err => {
                        });
                } else {
                    queryCoursesByClassId(id).then((res) => {
                        const data = res.data.data;
                        if (res.data.code === 200) {
                            this.subjectList = data;
                        }
                    }).catch(() => {
                    });
                }
            },
            saveOpenClass() {
                this.$refs['ruleForm'].validate((valid) => {
                    if (valid) {
                        let query = {
                            classId: this.ruleForm.classId,
                            className: (this.ruleForm.classId != 0) ? this.getListName(this.classList, this.ruleForm.classId) : "无",
                            classNo: this.ruleForm.sectionId,
                            classNoName: this.schoolSectionList[this.schoolSectionList.map(item => item.sectionId).indexOf(this.ruleForm.sectionId)].sectionNoName,
                            listenDate: this.ruleForm.openClassDate,
                            gradeId: this.ruleForm.gradeId,
                            gradeName: this.getListName(this.gradeList, this.ruleForm.gradeId),
                            subjectId: this.ruleForm.subjectId,
                            subjectName: this.getListName(this.subjectList, this.ruleForm.subjectId),
                            examineUserId: this.ruleForm.approvalId,
                            examineUserName: this.getListName(this.approvalList, this.ruleForm.approvalId),
                            createType: 1,
                            place: this.ruleForm.addressName == "其他" ? this.inputaddressName : this.ruleForm.addressName,
                            applyRemark: this.ruleForm.applyRemark,
                            level: this.ruleForm.level,
                            levelName: this.getListName(this.levelList, this.ruleForm.level),
                            openClassTypeId: this.ruleForm.classTypeId,
                            openClassType: this.getListName(this.classTypeList, this.ruleForm.classTypeId),
                            subjectTheme: this.ruleForm.subjectTheme
                        };
                        if (this.openClassId) {
                            query.id = this.openClassId;
                            this.editMyRegister(query);
                        } else {
                            this.addMyRegister(query);
                        }
                    }
                });
            },
            addMyRegister(query) {
                addMyRegister(query).then(res => {
                    const data = res.data;
                    if (res.data.code === 200) {
                        this.$message({
                            message: '提交成功',
                            type: 'success'
                        });
                        this.$router.back();
                    } else {
                        this.$message({
                            message: data.msg,
                            type: 'warning'
                        });
                    }
                }).catch();
            },
            editMyRegister(query) {
                editMyRegister(query).then(res => {
                    const data = res.data;
                    if (res.data.code === 200) {
                        this.$message({
                            message: '提交成功',
                            type: 'success'
                        });
                        this.$router.back();
                    } else {
                        this.$message({
                            message: data.msg,
                            type: 'warning'
                        });
                    }
                }).catch();
            },
            getListName(list, selectId) {
                if (list && list.length &&( selectId||selectId===0)) {
                    const selectName = list[list.map(item => item.id).indexOf(selectId)].name;
                    return selectName;
                }
                return '';
            },
            getStrDate(data) {
                let strDate = data.getFullYear() + "-" + this.fillZero(data.getMonth() + 1) + "-" + this.fillZero(data.getDate());
                return strDate;
            },
            fillZero(n) {
                return n < 10 ? '0' + n : n;
            },
        }
    }
</script>

<style lang="scss" scoped>
    .open_class_add {
        padding: 12px;

        .header {
            padding-bottom: 10px;
            border-bottom: 1px solid #eee;
        }

        .open_class_add_box {
            padding: 20px;
            overflow: hidden auto;
        }

        .el-form {
            width: 810px;
            margin: 0 auto;

            .el-select, .el-input {
                width: 100%;
            }
        }

        .header_top_title {
            height: 18px;
            line-height: 18px;
            padding-left: 6px;
            border-left: 4px solid #409eff;
        }

        .check_msg_list {
            padding: 10px;
            color: #555;

            .reject_text {
                margin-top: 8px;
                color: #888;
            }
        }

        .check_msg_list {
            padding: 10px;
            color: #555;

            .reject_text {
                margin-top: 8px;
                color: #888;
            }
        }
    }
</style>
