<template>
    <div class="app-container calendar-list-container panel-box">
        <backtool>
            <el-button size="medium" :loading="addLoading" type="primary" @click="saveHandler()">
                保存
            </el-button>
        </backtool>
        <div class="content-box org-teacher">
            <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <div class="section-title">档案信息</div>
                <div class="section-content">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="民族">
                                <el-select v-model="ruleForm.nation" placeholder="请选择">
                                    <el-option :key="-1" label="请选择"
                                               :value="''"></el-option>
                                    <el-option v-for="item in nationList" :key="item.value" :label="item.value"
                                               :value="item.code"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="籍贯">
                                <el-input v-model="ruleForm.nativenPlace" placeholder="请填写籍贯"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="政治面貌">
                                <el-select v-model="ruleForm.politicalCode" placeholder="请选择">
                                    <el-option :key="-1" label="请选择"
                                               :value="''"></el-option>
                                    <el-option v-for="[value, label] in politicalCodeConstants" :key="value" :label="label"
                                               :value="value"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="专业">
                                <el-select v-model="ruleForm.major" placeholder="请选择">
                                    <el-option :key="-1" label="请选择"
                                               :value="''"></el-option>
                                    <el-option v-for="[value, label] in teacherMajorConstants" :key="value" :label="label"
                                               :value="value"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="学历">
                                <el-select v-model="ruleForm.education" placeholder="请选择">
                                    <el-option :key="-1" label="请选择"
                                               :value="''"></el-option>
                                    <el-option v-for="[value, label] in educationConstants" :key="value" :label="label"
                                               :value="value"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="学位">
                                <el-select v-model="ruleForm.degree" placeholder="请选择">
                                    <el-option :key="-1" label="请选择"
                                               :value="''"></el-option>
                                    <el-option v-for="[value, label] in educationDegreeConstants" :key="value" :label="label"
                                               :value="value"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>

                        <el-col :span="12">
                            <el-form-item label="职称">
                                <el-select v-model="ruleForm.professionalTitle" placeholder="请选择">
                                    <el-option :key="-1" label="请选择"
                                               :value="''"></el-option>
                                    <el-option v-for="[value, label] in honoraryTitleConstants" :key="value" :label="label"
                                               :value="value"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="荣誉称号">
                                <el-input v-model="ruleForm.honoraryTitle" placeholder="可以同时填写多个称号,以英文逗号隔开"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="教师编制">
                                <el-select v-model="ruleForm.teacherOrg" placeholder="请选择">
                                    <el-option :key="-1" label="请选择"
                                               :value="''"></el-option>
                                    <el-option v-for="[value, label] in teacherOrgConstants" :key="value" :label="label"
                                               :value="value"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="从教年月">
                                <el-date-picker
                                    v-model="ruleForm.teachDate"
                                    type="month"
                                    placeholder="选择月">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="教师资格证">
                                <el-select v-model="ruleForm.certificateType" placeholder="请选择">
                                    <el-option :key="-1" label="请选择"
                                               :value="''"></el-option>
                                    <el-option v-for="[value, label] in teacherCertTypeConstants" :key="value" :label="label"
                                               :value="value"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="教师资格证号">
                                <el-input v-model="ruleForm.certificateNum" placeholder="可以同时填写多个号,以英文逗号隔开"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>

                        <el-col :span="12">
                            <el-form-item label="上岗资质">
                                <el-switch v-model="ruleForm.isPermission"
                                           active-value="1"
                                           inactive-value="2"
                                >
                                </el-switch>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
    import {getDicByCode} from '@/utils/utils';
    import {
        educationConstants,
        educationDegreeConstants,
        teacherMajorConstants,
        positionConstants,
        honoraryTitleConstants,
        teacherOrgConstants,
        teacherCertTypeConstants,
        politicalCodeConstants
    } from '@/utils/constants';
    import {addOrUpdateTeaArchive, getUserDetailArchive} from '@/api/systemSet/org';

    export default {
        name: "teacherArchiveAddEdit",
        data() {
            return {
                id: this.$route.query.id,
                addLoading: false,
                educationConstants,
                educationDegreeConstants,
                teacherMajorConstants,
                positionConstants,
                honoraryTitleConstants,
                teacherOrgConstants,
                teacherCertTypeConstants,
                politicalCodeConstants,
                ruleForm: {
                    name: '',
                    nation: '',
                    nativenPlace: '',
                    education: '',
                    degree: '',
                    major: '',
                    honoraryTitle: '',
                    professionalTitle: '',
                    teacherOrg: '',
                    certificateType: '',
                    certificateNum: '',
                    teachDate: '',
                    peopleSchoolState: '',
                    isPermission: '2',
                    userId: this.$route.query.id,
                    politicalCode: ''
                },
                nationList: []
            }
        },
        created() {
            getDicByCode('national')
                .then(nationList => {
                    this.nationList = nationList;
                });
            getUserDetailArchive({
                userId: this.id
            })
                .then(res => res.data)
                .then(data => {
                    data.data.isPermission = data.data.isPermission ? data.data.isPermission.toString() : '';
                    this.ruleForm = data.data;
                });
        },
        methods: {
            saveHandler() {
                const args = JSON.parse(JSON.stringify(this.ruleForm));
                args.teachDate = args.teachDate ? this.$moment(args.teachDate).format('YYYY-MM') : '';
                addOrUpdateTeaArchive(args)
                    .then(res => res.data)
                    .then(data => {
                        if(data.result) {
                            this.$message.success('保存成功');
                            setTimeout(() => {
                                this.$router.back();
                            });
                        } else {
                            this.$message.error(data.msg);
                        }
                    });
            }
        }
    }
</script>

<style scoped>
     .content-box {
            width: 810px;
    padding-top: 20px;
    margin: 0 auto;
}
    .section-title{
        line-height: 20px;
        font-size: 16px;
        border-left: 4px solid #409EFF;
        padding-left: 10px;
    }
    .el-select,.el-input {
    width: 100%;
}
</style>
