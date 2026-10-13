<template>
    <div class="class-scheduling">
        <div class="header">
            <el-button @click="goBack" size="medium">返回</el-button>
            <el-button type="primary" @click="saveSupply(isClassTeacher ? 2 : -2)" size="medium">发布</el-button>
        </div>

        <div class="scheduling-box">
            <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="120px" class="demo-ruleForm">
                <el-form-item label="代调课类型" prop="type" class="is-required">
                    <el-radio-group v-model="ruleForm.type" @change="handleTypeChange">
                        <el-radio :label="1">代课</el-radio>
                        <el-radio :label="2">调课</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-row>
                    <el-col :span="12">
                        <el-form-item :label="ruleForm.type === 1 ? '被代课教师' : '调课教师'">
                            {{ $route.query.teacherName }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="ruleForm.type === 1 ? '代课日期' : '调课日期'">
                            {{ $route.query.searchDate }}
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-form-item v-if="ruleForm.type === 1" label="可代课节次" required>
                    <div v-if="scheduleList.length === 0" class="no-data">暂无排课信息</div>
                    <div v-for="(item, index) in scheduleList" :key="index" class="schedule-item">
                        <el-checkbox v-model="item.checked" @change="handleSubstituteCheckChange(item)">
                            {{ item.sectionNoName }} {{ item.className }} {{ item.currName }}
                        </el-checkbox>

                        <div v-if="item.checked" class="teacher-select">
                            <address-book v-model="item.targetTeacherData" :config="teacherConfigData"
                                placeholder="请设置代课老师"></address-book>
                        </div>
                    </div>
                </el-form-item>

                <el-form-item v-if="ruleForm.type === 2" label="可调课节次" required>
                    <div v-if="scheduleList.length === 0" class="no-data">暂无排课信息</div>
                    <div v-for="(item, index) in scheduleList" :key="index" class="schedule-item">
                        <el-checkbox v-model="item.checked" @change="handleAdjustmentCheckChange(item)">
                            {{ item.sectionNoName }} {{ item.className }} {{ item.currName }}
                        </el-checkbox>
                        <div v-if="item.checked" class="adjustment-info">
                            <span v-if="item.targetInfo" class="target-info-text">
                                调 {{ item.targetInfo.date }} {{ item.targetInfo.sectionName }} {{
                                    item.targetInfo.className }} {{ item.targetInfo.currName }} {{
                                    item.targetInfo.teacherName }}
                            </span>
                            <el-button type="text" @click="openAdjustmentDialog(item)">设置调课</el-button>
                        </div>
                    </div>
                </el-form-item>

                <el-form-item label="备注" prop="reason">
                    <el-input type="textarea" :rows="4" placeholder="与请假备注相同" v-model.trim="ruleForm.reason"></el-input>
                </el-form-item>

                <el-form-item label="附件" prop="pic">
                    <uploader multiple v-model="adjustPics" pathPrefix="daiketiaoke" module="daiketiaoke"
                        moduleCode="2009" :extList="['bmp', 'png', 'jpg', 'jpeg', 'gif']" showMode="image"
                        :showModeCover="false" showResult="image"></uploader>
                </el-form-item>

            </el-form>
        </div>

        <el-dialog title="被调课人设置" :visible.sync="dialogVisible" width="500px" append-to-body>
            <el-form :model="dialogForm" ref="dialogForm" label-width="100px">
                <el-form-item label="日期" prop="date" :rules="{ required: true, message: '请选择日期', trigger: 'change' }">
                    <el-date-picker v-model="dialogForm.date" type="date" placeholder="选择日期" :clearable="false"
                        @change="handleDialogDateChange" :picker-options="dateOptions"
                        style="width: 100%"></el-date-picker>
                </el-form-item>
                <el-form-item label="被调课老师" prop="teacherData"
                    :rules="{ required: true, message: '请选择老师', trigger: 'change' }">
                    <address-book v-model="dialogForm.teacherData" :config="teacherConfigData"
                        @confirm="handleDialogTeacherChange"></address-book>
                </el-form-item>
                <el-form-item label="可调课节次" prop="sectionKey"
                    :rules="{ required: true, message: '请选择可调课节次', trigger: 'change' }">
                    <el-select v-model="dialogForm.sectionKey" placeholder="请选择可调课节次" style="width: 100%">
                        <el-option v-for="(item, index) in dialogScheduleList" :key="index"
                            :label="item.sectionNoName + ' ' + item.className + ' ' + item.currName" :value="item.key">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmAdjustment">确 定</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
import { getUserById } from "@/api/common/common"
import AddressBook from '@/components/AddressBook/indexExpand';
import Uploader from '@/components/Uploader/WebUploader';
import {
    getScheduleCurrByTeacherIdAndDate,
    addOrPublishSupplyAdjustClassList,
    addOrSubmitSupplyAdjustClassApplyList
} from '@/api/supplyClass';

export default {
    name: 'ClassScheduling',
    components: {
        AddressBook,
        Uploader
    },
    data() {
        return {
            isClassTeacher: false,
            ruleForm: {
                type: 1,

                reason: ''
            },
            adjustPics: [],
            scheduleList: [],
            dialogVisible: false,
            dialogForm: {
                date: '',
                teacherData: { userJson: [] },
                sectionKey: ''
            },
            dialogScheduleList: [],
            currentAdjustmentItem: null,

            teacherConfigData: {
                title: '选择老师',
                depart: { target: 'user', departType: 't', userTypes: '1' },
                SingleChose: true,
                group: false
            },
            dateOptions: {
                disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7;
                }
            },

        };
    },
    mounted() {
        this.isClassTeacher = JSON.parse(this.$route.query.isClassTeacher)
        this.fetchSchedule();
    },
    methods: {
        goBack() {
            this.$router.back();
        },
        handleTypeChange() {
            this.scheduleList = [];
            this.fetchSchedule();
        },
        fetchSchedule() {
            getScheduleCurrByTeacherIdAndDate({
                searchDate: this.$route.query.searchDate,
                teacherId: this.$route.query.teacherId
            }).then(res => {
                if (res.data.result) {
                    const namelist = ['', '早自习', '上午', '午自习', '下午', '晚自习'];
                    this.scheduleList = res.data.data.map(item => ({
                        ...item,
                        sectionId: item.dayStage + ',' + item.seq,
                        sectionNoName: namelist[item.dayStage] + '(第' + item.seq + '节)',
                        checked: false,
                        targetTeacherData: { userJson: [] },
                        targetInfo: null
                    }));
                } else {
                    this.scheduleList = [];
                    this.$message.warning(res.data.msg || '获取课表失败');
                }
            });
        },

        handleSubstituteCheckChange(item) {
            if (!item.checked) {
                item.targetTeacherData = { userJson: [] };
            }
        },


        handleAdjustmentCheckChange(item) {
            if (!item.checked) {
                item.targetInfo = null;
            }
        },
        openAdjustmentDialog(item) {
            this.currentAdjustmentItem = item;
            this.dialogVisible = true;


            if (item.targetInfo) {
                this.dialogForm = {
                    date: item.targetInfo.date,
                    teacherData: { userJson: JSON.parse(JSON.stringify(item.targetInfo.teacherJson)) },
                    sectionKey: item.targetInfo.key
                };
                this.fetchDialogSchedule();
            } else {
                this.dialogForm = {
                    date: '',
                    teacherData: { userJson: [] },
                    sectionKey: ''
                };
                this.dialogScheduleList = [];
            }

            this.$nextTick(() => {
                if (this.$refs.dialogForm) this.$refs.dialogForm.clearValidate();
            });
        },
        handleDialogDateChange(date) {
            this.dialogForm.date = this.getStrDate(date);
            this.dialogForm.sectionKey = '';
            this.fetchDialogSchedule();
        },
        handleDialogTeacherChange() {
            this.dialogForm.sectionKey = '';
            this.fetchDialogSchedule();
        },
        fetchDialogSchedule() {
            if (!this.dialogForm.date) return;

            if (!this.dialogForm.teacherData.userJson.length) {
                this.dialogScheduleList = [];
                return;
            }

            getScheduleCurrByTeacherIdAndDate({
                searchDate: this.dialogForm.date,
                teacherId: this.dialogForm.teacherData.userJson[0].id
            }).then(res => {
                if (res.data.result) {
                    const namelist = ['', '早自习', '上午', '午自习', '下午', '晚自习'];
                    this.dialogScheduleList = res.data.data.map(item => ({
                        ...item,
                        sectionId: item.dayStage + ',' + item.seq,
                        sectionNoName: namelist[item.dayStage] + '(第' + item.seq + '节)',
                        key: item.gradeId + '-' + item.classId + '-' + (item.dayStage + ',' + item.seq) + '-' + item.currId
                    }));
                } else {
                    this.dialogScheduleList = [];
                }
            });
        },
        confirmAdjustment() {
            // 先校验被调课老师是否为空
            if (!this.dialogForm.teacherData.userJson || this.dialogForm.teacherData.userJson.length === 0) {
                this.$message.warning('请选择被调课老师！');
                return;
            }

            // 再校验其他字段
            this.$refs.dialogForm.validate(valid => {
                if (valid) {
                    const { date, teacherData, sectionKey } = this.dialogForm;

                    const targetItem = this.dialogScheduleList.find(i => i.key === sectionKey);

                    if (targetItem) {
                        this.currentAdjustmentItem.checked = true;
                        this.$set(this.currentAdjustmentItem, 'targetInfo', {
                            date: date,
                            teacherId: teacherData.userJson[0].id,
                            teacherName: teacherData.userJson[0].name,
                            teacherJson: teacherData.userJson,
                            gradeId: targetItem.gradeId,
                            gradeName: targetItem.gradeName,
                            classId: targetItem.classId,
                            className: targetItem.className,
                            sectionId: targetItem.sectionId,
                            sectionName: targetItem.sectionNoName,
                            currId: targetItem.currId,
                            currName: targetItem.currName,
                            key: sectionKey
                        });
                        this.dialogVisible = false;
                    }
                }
            });
        },

        async saveSupply(state) {
            this.$refs.ruleForm.validate(async valid => {
                if (valid) {
                    const checkedItems = this.scheduleList.filter(item => item.checked);
                    if (checkedItems.length === 0) {
                        this.$message.warning('请选择节次！');
                        return;
                    }
                    let list = [];
                    const { data: teacherObj } = await getUserById({ id: this.$route.query.teacherId })
                    const sourceTeacherJson = [
                        {
                            id: teacherObj.data.id,
                            name: teacherObj.data.name,
                            loginname: teacherObj.data.loginname,
                            dataType: 'user',
                            avatar: teacherObj.data.avatar,
                            mobile: teacherObj.data.mobile,
                            type: teacherObj.data.type
                        }
                    ]
                    const myadjustPics = this.adjustPics.map(i => ({ picUrl: i.fileUrl }));
                    // 代课
                    if (this.ruleForm.type === 1) {
                        const invalidItems = checkedItems.filter(item =>
                            !item.targetTeacherData || !item.targetTeacherData.userJson.length
                        );
                        if (invalidItems.length > 0) {
                            this.$message.warning('请为所有选中的节次选择代课老师！');
                            return;
                        }
                        list = checkedItems.map(item => ({
                            chooseType: 1,
                            type: 1,
                            typeName: '代课',
                            state: state,
                            createUserType: this.isClassTeacher ? 1 : 2,
                            reason: this.ruleForm.reason,
                            adjustPics: JSON.stringify(myadjustPics),
                            adjustDate: this.$route.query.searchDate,
                            adjustGradeId: item.gradeId,
                            adjustGradeName: item.gradeName,
                            adjustClassId: item.classId,
                            adjustClassName: item.className,
                            adjustClassNo: item.sectionId,
                            adjustClassNoName: item.sectionNoName,
                            adjustSubjectId: item.currId,
                            adjustSubjectName: item.currName,
                            adjustTeacherJson: JSON.stringify(sourceTeacherJson),
                            supplyTeacherJson: JSON.stringify(item.targetTeacherData.userJson),

                        }));

                    } else {
                        const invalidItems = checkedItems.filter(item => !item.targetInfo);
                        if (invalidItems.length > 0) {
                            this.$message.warning('请为选中的节次设置调课信息！');
                            return;
                        }
                        list = checkedItems.map(item => ({
                            chooseType: 1,
                            type: 2,
                            typeName: '调课',
                            state: state,
                            createUserType: this.isClassTeacher ? 1 : 2,
                            reason: this.ruleForm.reason,
                            adjustPics: JSON.stringify(myadjustPics),
                            supplyDate: this.$route.query.searchDate,
                            supplyGradeId: item.gradeId,
                            supplyGradeName: item.gradeName,
                            supplyClassId: item.classId,
                            supplyClassName: item.className,
                            supplyClassNo: item.sectionId,
                            supplyClassNoName: item.sectionNoName,
                            supplySubjectId: item.currId,
                            supplySubjectName: item.currName,
                            supplyTeacherJson: JSON.stringify(sourceTeacherJson),
                            adjustDate: item.targetInfo.date,
                            adjustGradeId: item.targetInfo.gradeId,
                            adjustGradeName: item.targetInfo.gradeName,
                            adjustClassId: item.targetInfo.classId,
                            adjustClassName: item.targetInfo.className,
                            adjustClassNo: item.targetInfo.sectionId,
                            adjustClassNoName: item.targetInfo.sectionName,
                            adjustSubjectId: item.targetInfo.currId,
                            adjustSubjectName: item.targetInfo.currName,
                            adjustTeacherJson: JSON.stringify(item.targetInfo.teacherJson)
                        }));
                    }

                    if (!this.isClassTeacher) {
                        console.log(123, '我是老师', list);
                        addOrSubmitSupplyAdjustClassApplyList(list).then(res => {
                            if (res.data.result) {
                                if (!res.data.data || res.data.data.length === 0) {
                                    this.$message.success('发布成功');
                                    this.goBack();
                                } else {
                                    const failReasons = res.data.data.map(item => item.failReaon || '未知原因').join('<br>');
                                    const successCount = list.length - res.data.data.length;
                                    this.$confirm(`成功${successCount}条，失败${res.data.data.length}条<br>${failReasons}`, '结果', {
                                        dangerouslyUseHTMLString: true,
                                        type: 'warning'
                                    }).then(() => this.goBack());
                                }
                            } else {
                                this.$message.warning(res.data.msg || '操作失败');
                            }
                        });
                    } else {
                        console.log(123, '我是教务处主任', list);
                        addOrPublishSupplyAdjustClassList(list).then(res => {
                            if (res.data.result) {
                                if (!res.data.data || res.data.data.length === 0) {
                                    this.$message.success('发布成功');
                                    this.goBack();
                                } else {
                                    const failReasons = res.data.data.map(item => item.failReaon || '未知原因').join('<br>');
                                    const successCount = list.length - res.data.data.length;
                                    this.$confirm(`成功${successCount}条，失败${res.data.data.length}条<br>${failReasons}`, '结果', {
                                        dangerouslyUseHTMLString: true,
                                        type: 'warning'
                                    }).then(() => this.goBack());
                                }
                            } else {
                                this.$message.warning(res.data.msg || '操作失败');
                            }
                        });
                    }
                }
            });
        },
        getStrDate(data) {
            let strDate = data.getFullYear() + "-" + this.fillZero(data.getMonth() + 1) + "-" + this.fillZero(data.getDate());
            return strDate;
        },
        fillZero(n) {
            return n < 10 ? '0' + n : n;
        }
    }
};
</script>

<style lang="scss" scoped>
.class-scheduling {
    padding: 20px;
    background: #fff;
    min-height: 100vh;

    .header {
        padding-bottom: 20px;
        border-bottom: 1px solid #eee;
        margin-bottom: 20px;
        display: flex;
        gap: 15px;
    }

    .scheduling-box {
        max-width: 800px;
        margin: 0 auto;
    }

    .schedule-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 20px;
        padding: 10px;
        border: 1px solid #eee;
        border-radius: 4px;
        margin-bottom: 10px;

        .teacher-select {
            width: 350px;
        }

        .adjustment-info {
            display: flex;
            align-items: center;

            .target-info-text {
                font-size: 12px;
                color: #666;
                margin-right: 10px;
            }
        }
    }

    .no-data {
        text-align: center;
        color: #999;
        padding: 20px;
    }
}
</style>