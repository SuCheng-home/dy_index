<template>
    <div class="app-container calendar-list-container" id="noticeAdd">
        <backtool>
            <el-button type="primary" size="medium" @click.native="onSave()">保存
            </el-button>
        </backtool>
        <div :class="['page-main', isStandalone ? 'page-main--scroller' : '']" :style="{'height':nobottommaxH+'px'}"
             style="overflow: auto">
            <div style="width: 810px;padding-top:20px;margin: 0 auto;">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="140px" class="demo-ruleForm">

                    <el-form-item label="学期" prop="termId">
                        <el-select size="medium" v-model="termId" placeholder="请选择学期">
                            <el-option
                                v-for="item in termList"
                                :key="item.id"
                                :label="item.schoolTimeName"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="批次名称" prop="batchName">
                        <el-input v-model="ruleForm.batchName" :maxlength="20" placeholder="请输入批次名称(1-20字符)"
                                  @blur="ruleForm.batchName = ruleForm.batchName.trim();"></el-input>
                    </el-form-item>
                    <div class="section-title">备课组计划</div>
                    <el-form-item label="上报截止时间" prop="planEndTime">
                        <el-date-picker v-model="ruleForm.planEndTime" :editable='false' :clearable='false' type="date"
                                        placeholder="选择日期" >
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="计划模版">
                        <div style="width: 200px">
                            <uploader pathPrefix="teachingGroupActivity" multiple v-model="planFile" :extList="['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf']"  ></uploader>
                        </div>
                    </el-form-item>
                    <el-form-item label="备注">
                        <el-input
                            type="textarea"
                            :rows="4"
                            :maxlength="200"
                            placeholder="请输入备注(0-200字符)"
                            v-model="ruleForm.planMisc">
                        </el-input>
                    </el-form-item>
                    <div class="section-title">备课组总结</div>
                    <el-form-item label="上报截止时间" prop="summaryEndTime">
                        <el-date-picker v-model="ruleForm.summaryEndTime" :editable='false' :clearable='false' type="date"
                                        placeholder="选择日期" >
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="总结模版">
                        <div style="width: 200px">
                            <uploader pathPrefix="teachingGroupActivity" multiple v-model="summaryFile" :extList="['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf']"  ></uploader>
                        </div>
                    </el-form-item>
                    <el-form-item label="备注">
                        <el-input
                            type="textarea"
                            :rows="4"
                            :maxlength="200"
                            placeholder="请输入备注(0-200字符)"
                            v-model="ruleForm.summaryMisc">
                        </el-input>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
    import moment from 'moment';

    import Backtool from '@/components/BackTool';
    import Uploader from "@/components/Uploader/WebUploader";

    import mixin from '@/mixins/windowResize';
    import {mapGetters} from 'vuex';
    import {getSchoolTimeAllList} from '@/api/system';

    import {
        querySchoolAllCourse,
    } from "@/api/recordbook";
    import {querySchoolGrade} from '@/api/systemSet/tenEvent';

    import {
        teachingResearchUpdate,
        teachingResearchAdd,
        teachingResearchDetail
    } from '@/api/systemSet/teachingGroupSet';

    export default {
        name: "teachingGroupAddEdit",
        mixins: [mixin],
        components: {Backtool, Uploader},
        computed: {
            ...mapGetters(['isStandalone', 'userInfo'])
        },
        data() {
            const summaryEndTimeValidator = (rule, value, callback) => {
                if (!value) {
                    callback(new Error('上报截止时间不能为空'));
                } else if(moment(value).format('YYYY-MM-DD') < moment(this.ruleForm.planEndTime).format('YYYY-MM-DD')) {
                    return callback(new Error('备课组总结上报截止时间不能小于计划截止时间！'));
                }
            };
            const planEndTimeValidator = (rule, value, callback) => {
                if (!value) {
                    callback(new Error('上报截止时间不能为空'));
                } else if(moment(value).format('YYYY-MM-DD') < moment().format('YYYY-MM-DD')) {
                    return callback(new Error('上报截止时间不能小于当前时间！'));
                }
            };
            return {
                pid: this.$route.query.pid,
                id: this.$route.query.id,
                isEdit: !!this.$route.query.id,

                planFile: [],
                summaryFile: [],
                ruleForm: {
                    batchName: '',
                    subjectId: '',
                    planEndTime: '',
                    summaryEndTime: '',
                    planMisc: '',
                    summaryMisc: '',
                },

                rules: {
                    batchName: [
                        {required: true, trigger: 'blur', message: '请输入批次名称'}
                    ],
                    planEndTime: [
                        {required: true, trigger: 'blur', validator: planEndTimeValidator}
                    ],
                    termId: [
                        {required: true, trigger: 'blur', message: '请选择学期'}
                    ],
                    summaryEndTime: [
                        {required: true, validator: summaryEndTimeValidator, trigger: 'blur'}
                    ]
                },


                termList: [],
                termId: 0
            }
        },
        mounted() {
            getSchoolTimeAllList()
                .then(res => res.data)
                .then(data => {
                    this.termList = data.data;
                    if (data.data.length !== 0) {
                        this.termId = data.data.find(item => item.isCurrent === 1).id;
                    }
                });

            if (this.isEdit) {
                teachingResearchDetail({
                    id: this.id
                })
                    .then(res => res.data)
                    .then(data => {
                        const pageData = data.data;
                        const tmgName = pageData.tmgName;
                        const subjectId = pageData.subjectId;
                        const gradeIds = pageData.gradeIds.split(',').map(item => parseInt(item));
                        const leaderData = {
                            userJson: pageData.leaders
                        };
                        const dLeaderData = {
                            userJson: pageData.deputyleaders
                        };
                        const memberData = {
                            userJson: pageData.members
                        };

                        this.ruleForm = {
                            tmgName,
                            subjectId,
                            gradeIds,
                            leaderData,
                            dLeaderData,
                            memberData
                        };

                    })
            }

            querySchoolAllCourse()
                .then(res => res.data)
                .then(data => {
                    const pageData = data.data;
                    this.subjectList = pageData;
                    if (!this.isEdit && pageData && pageData.length !== 0) {
                        this.ruleForm.subjectId = pageData[0].id;
                    }
                });
            querySchoolGrade({
                isFilterNewGrade: false
            })
                .then(res => res.data)
                .then(data => {
                    this.gradeList = data.data;
                });

        },
        methods: {

            onSave() {
                this.$refs.ruleForm.validate(isValid => {
                    if (isValid) {
                        const args = {
                            gradeIds: this.ruleForm.gradeIds.join(','),
                            subjectId: this.ruleForm.subjectId,
                            tmgName: this.ruleForm.tmgName,
                            leaderNames: this.ruleForm.leaderData.userJson.map(item => item.name).join(','),
                            leaderIds: this.ruleForm.leaderData.userJson.map(item => item.id).join(','),
                            deputyleaderNames: this.ruleForm.dLeaderData.userJson.map(item => item.name).join(','),
                            deputyleaderIds: this.ruleForm.dLeaderData.userJson.map(item => item.id).join(','),
                            memberNames: this.ruleForm.memberData.userJson.map(item => item.name).join(','),
                            memberIds: this.ruleForm.memberData.userJson.map(item => item.id).join(',')
                        };
                        args.gradeNames = this.gradeList.filter(item => this.ruleForm.gradeIds.indexOf(item.id) !== -1).map(({name}) => name).join(',');
                        const subjectObj = this.subjectList.find(item => item.id == this.ruleForm.subjectId);
                        args.subjectName = subjectObj ? subjectObj.name : '';
                        new Promise(resolve => {
                            if (this.isEdit) {
                                args.id = this.id;
                                teachingResearchUpdate(args)
                                    .then(resolve)
                            } else {
                                args.pid = this.pid;
                                teachingResearchAdd(args)
                                    .then(resolve)
                            }
                        })
                            .then(res => res.data)
                            .then(data => {
                                if (data.result) {
                                    this.$message.success(`${this.isEdit ? '编辑' : '新增'}成功`);
                                    setTimeout(() => {
                                        this.$router.back();
                                    }, 1000);
                                } else {
                                    this.$message.error(data.msg);
                                }
                            })
                    }
                })
            }
        }
    }
</script>

<style scoped>
    .section-title {
        line-height: 20px;
        font-size: 16px;
        border-left: 4px solid #409eff;
        padding-left: 10px;
        margin: 10px 0;
        margin-left: 60px;
    }
</style>
