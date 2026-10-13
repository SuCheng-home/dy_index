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
                    <el-form-item label="名称" prop="tmgName">
                        <el-input v-model="ruleForm.tmgName" :maxlength="15" placeholder="请输入名称(1-15字符)" @blur="ruleForm.tmgName = ruleForm.tmgName.trim();"></el-input>
                    </el-form-item>
                    <el-form-item label="学科" prop="subjectId">
                        <el-select v-model="ruleForm.subjectId">
                            <el-option :label="subjectItem.name" :value="subjectItem.id" v-for="(subjectItem,indexa) in subjectList" :key="indexa"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="年级" prop="gradeIds">
                        <el-select v-model="ruleForm.gradeIds" multiple="multiple">
                            <el-option :label="gradeItem.name" :value="gradeItem.id" v-for="(gradeItem,indexb) in gradeList" :key="indexb"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="组长" prop="leaderData">
                        <address-book v-model="ruleForm.leaderData" :config="leaderConfig"></address-book>
                    </el-form-item>
                    <el-form-item label="副组长">
                        <address-book v-model="ruleForm.dLeaderData" :config="dLeaderConfig"></address-book>
                    </el-form-item>
                    <el-form-item label="组员" prop="memberData">
                        <address-book v-model="ruleForm.memberData" :config="memeberConfig"></address-book>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
    import Backtool from '@/components/BackTool';
    import AddressBook from '@/components/AddressBook/indexExpand';

    import mixin from '@/mixins/windowResize';
    import {mapGetters} from 'vuex';
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
        components: {Backtool, AddressBook},
        computed: {
            ...mapGetters(['isStandalone', 'userInfo'])
        },
        data() {
            const checkAddressData = (rule, value, callback) => {
                if ((value.userJson && value.userJson.length > 0) || (value.departJson && value.departJson.length > 0) || (value.groupJson && value.groupJson.length > 0)) {
                    callback();
                } else {
                    return callback(new Error('地址簿不能为空！'));
                }
            };
            const gradeIdValidator = (rule, value, callback) => {
                if (value && value.length !== 0) {
                    callback();
                } else {
                    return callback(new Error('年级不能为空！'));
                }
            };
            return {
                pid: this.$route.query.pid,
                id: this.$route.query.id,
                isEdit: !!this.$route.query.id,

                subjectList: [],
                gradeList: [],
                ruleForm: {
                    tmgName: '',
                    subjectId: '',
                    gradeIds: [],
                    leaderData: {
                        userJson: []
                    },
                    dLeaderData: {
                        userJson: []
                    },
                    memberData: {
                        userJson: []
                    },
                },
                leaderConfig: {
                    SingleChose: true,
                    title: '组长选择',
                    depart: {target: 'user', departType: 't', userTypes: '1', notCheckSchool: true},
                    group: false
                },
                dLeaderConfig: {
                    title: '副组长选择',
                    depart: {target: 'user', departType: 't', userTypes: '1', notCheckSchool: true},
                    group: false
                },
                memeberConfig: {
                    title: '组员选择',
                    depart: {target: 'user', departType: 't', userTypes: '1', notCheckSchool: true},
                    group: false
                },
                rules: {
                    tmgName: [
                        {required: true,  trigger: 'blur', message: '请输入名称'}
                    ],
                    memberData: [
                        {required: true, validator: checkAddressData, trigger: 'blur'}
                    ],
                    subjectId: [
                        {required: true,  trigger: 'blur', message: '请选择学科'}
                    ],
                    gradeIds: [
                        {required: true, trigger: 'blur', validator: gradeIdValidator}
                    ],
                    leaderData: [
                        {required: true, validator: checkAddressData, trigger: 'blur'}
                    ]
                },
            }
        },
        mounted() {
            if(this.isEdit) {
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
                    if(!this.isEdit && pageData && pageData.length !== 0) {
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
                    if(isValid) {
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
                            if(this.isEdit) {
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
                                if(data.result) {
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

</style>
