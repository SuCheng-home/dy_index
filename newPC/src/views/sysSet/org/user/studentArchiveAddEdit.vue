<template>
    <div class="app-container calendar-list-container panel-box" id="studentArchiveAddEdit">
        <backtool>
            <el-button size="medium" :loading="addLoading" type="primary" @click="saveHandler()">
                保存
            </el-button>
        </backtool>
        <div :style="{'height':nobottommaxH+'px'}" style="overflow: auto">
            <div class="content-box org-teacher">
            <el-form :model="ruleForm" ref="ruleForm" label-width="140px" class="demo-ruleForm">
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
                            <el-form-item label="国籍">
                                <el-select v-model="ruleForm.nationality" placeholder="请选择">
                                    <el-option :key="-1" label="请选择"
                                               :value="''"></el-option>
                                    <el-option v-for="item in nationalityList" :key="item.value" :label="item.value"
                                               :value="item.code"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="港澳台侨外">
                                <el-select v-model="ruleForm.hk_tw_macao" placeholder="请选择">
                                    <el-option :key="-1" label="请选择"
                                               :value="''"></el-option>
                                    <el-option v-for="item in hk_tw_macaoList" :key="item.value" :label="item.value"
                                               :value="item.code"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="出生所在地">
                                <el-input v-model="ruleForm.birthPlace" placeholder="出生所在地"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="籍贯">
                                <el-input v-model="ruleForm.nativenPlace" placeholder="籍贯"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="血型">
                                <el-select v-model="ruleForm.bloodType" placeholder="请选择">
                                    <el-option :key="-1" label="请选择"
                                               :value="''"></el-option>
                                    <el-option v-for="item in bloodTypeList" :key="item.value" :label="item.value"
                                               :value="item.code"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>

                        <el-col :span="12">
                            <el-form-item label="户口性质">
                                <el-select v-model="ruleForm.accountNature" placeholder="请选择">
                                    <el-option :key="-1" label="请选择"
                                               :value="''"></el-option>
                                    <el-option v-for="[value, label] in accountnatureConstants" :key="value" :label="label"
                                               :value="value"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" v-show="ruleForm.accountNature == 2">
                            <el-form-item label="非农业户口">
                                <el-select v-model="ruleForm.nonAgriculture" placeholder="请选择">
                                    <el-option :key="-1" label="请选择"
                                               :value="''"></el-option>
                                    <el-option v-for="[value, label] in nonagricultureConstants" :key="value" :label="label"
                                               :value="value"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="户口所在地">
                                <el-input v-model="ruleForm.houseRegistration" placeholder="户口所在地(所属派出所)"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="家庭住址">
                                <el-input v-model="ruleForm.address" placeholder="家庭住址"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="入校日期">
                                <el-date-picker
                                    v-model="ruleForm.startSchoolDate"
                                    type="date"
                                    placeholder="入校日期">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="就读方式">
                                <el-select v-model="ruleForm.attendSchoolType" placeholder="请选择">
                                    <el-option :key="-1" label="请选择"
                                               :value="''"></el-option>
                                    <el-option v-for="[value, label] in attendSchoolTypeConstants" :key="value" :label="label"
                                               :value="value"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="独生子女">
                                <el-switch v-model="ruleForm.isOnlyChild"
                                           :active-value="1"
                                           :inactive-value="2"
                                >
                                </el-switch>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="留守儿童">
                                <el-switch v-model="ruleForm.isStayChild"
                                           :active-value="1"
                                           :inactive-value="2"
                                >
                                </el-switch>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="进城务工人员子女">
                                <el-switch v-model="ruleForm.isMigrantMorker"
                                           :active-value="1"
                                           :inactive-value="2"
                                >
                                </el-switch>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="健康状况">
                                <el-select v-model="ruleForm.healthType" placeholder="请选择">
                                    <el-option :key="-1" label="请选择"
                                               :value="''"></el-option>
                                    <el-option v-for="item in healthTypeList" :key="item.value" :label="item.value"
                                               :value="item.code"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="残疾幼儿">
                                <el-switch v-model="ruleForm.isDisabilityChild"
                                           :active-value="1"
                                           :inactive-value="2"
                                >
                                </el-switch>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" v-show="ruleForm.isDisabilityChild == 1">
                            <el-form-item label="残疾幼儿类别">
                                <el-select v-model="ruleForm.disabilityChildType" placeholder="请选择">
                                    <el-option :key="-1" label="请选择"
                                               :value="''"></el-option>
                                    <el-option v-for="item in disabilityChildTypeList" :key="item.value" :label="item.value"
                                               :value="item.code"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="孤儿">
                                <el-switch v-model="ruleForm.isOrphan"
                                           :active-value="1"
                                           :inactive-value="2"
                                >
                                </el-switch>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="一寸照片">
                                <uploader pathPrefix="orgManagement" :extList="['bmp', 'png', 'jpg', 'jpeg', 'gif']" showResult="image" showMode="image" v-model="images" :multiple="false"></uploader>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>
            </el-form>
        </div>
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
        accountnatureConstants,
        nonagricultureConstants,
        attendSchoolTypeConstants
    } from '@/utils/constants';
    import Uploader from '@/components/Uploader/WebUploader';
    import mixin from '@/mixins/windowResize';
    import {addOrUpdateStuArchive, getStuDetailArchive} from '@/api/systemSet/org';

    export default {
        name: "studentArchiveAddEdit",
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
                accountnatureConstants,
                nonagricultureConstants,
                attendSchoolTypeConstants,

                ruleForm: {
                    nation: '',
                    nativenPlace: '',
                    nationality: '',
                    hk_tw_macao: '',
                    birthPlace: '',
                    nonAgriculture: '',
                    accountNature: '',
                    bloodType: '',
                    address: '',
                    startSchoolDate: '',
                    attendSchoolType: '',
                    disabilityChildType: '',
                    isOrphan: '2',
                    isOnlyChild: '2',
                    isStayChild: '2',
                    isMigrantMorker: '2',
                    healthType: '',
                    isDisabilityChild: '2',
                    userId: this.$route.query.id,
                    politicalCode: '',
                    houseRegistration: '',
                    idIDPhoto: ''
                },
                nationList: [],
                nationalityList: [],
                hk_tw_macaoList: [],
                bloodTypeList: [],
                healthTypeList: [],
                disabilityChildTypeList: [],

                images: []
            }
        },
        mixins: [mixin],
        created() {
            getDicByCode('national')
                .then(nationList => {
                    this.nationList = nationList;
                });
            getDicByCode('nationality')
                .then(nationalityList => {
                    this.nationalityList = nationalityList;
                });
            getDicByCode('hk_tw_macao')
                .then(hk_tw_macaoList => {
                    this.hk_tw_macaoList = hk_tw_macaoList;
                });
            getDicByCode('bloodType')
                .then(bloodTypeList => {
                    this.bloodTypeList = bloodTypeList;
                });
            getDicByCode('healthType')
                .then(healthTypeList => {
                    this.healthTypeList = healthTypeList;
                });
            getDicByCode('disabilityChildType')
                .then(disabilityChildTypeList => {
                    this.disabilityChildTypeList = disabilityChildTypeList;
                });
            getStuDetailArchive({
                userId: this.id
            })
                .then(res => res.data)
                .then(data => {
                    if(data.result) {
                        this.ruleForm = data.data;
                        if(data.data.idPhoto) {
                            this.images = [{
                                fileUrl: data.data.idPhoto
                            }];
                        }

                    }
                })
        },
        components: {Uploader},
        methods: {
            saveHandler() {
                const args = JSON.parse(JSON.stringify(this.ruleForm));
                args.idPhoto = this.images.length !== 0 ? this.images[0].fileUrl : '';
                args.nonAgriculture = args.accountNature == 2 ? args.nonAgriculture : '';
                args.disabilityChildType = args.isDisabilityChild ? args.disabilityChildType : '';
                args.startSchoolDate = args.startSchoolDate ? this.$moment(args.startSchoolDate).format('YYYY-MM-DD') : '';


                addOrUpdateStuArchive(args)
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
<style>
    #studentArchiveAddEdit .upload-file-item {
        height: 90px;
    }
</style>
