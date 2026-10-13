<template>
    <div class="classevaluateindex">
        <div class="classevaluateindex-header">
            <el-button @click="$router.back()" type="default" size="medium">返回</el-button>
            <el-button type="primary" size="medium" @click="Preservation('query')">保存</el-button>
        </div>
        <div class="classevaluateindex-main" :style="{height: `${nobottommaxH}px`}">
            <el-form :model="query" :rules="rules" ref="query" label-width="140px" class="demo-ruleForm">
                <el-form-item label="提醒设置">
                    <el-checkbox v-model="query.isFeedBackReport">一周反馈报告(周五 20：00 发布)</el-checkbox>
                    <el-checkbox v-model="query.isRemindCheckTeacher">提醒任课老师未评价(17：00 提醒老师)</el-checkbox>
                    <el-checkbox v-model="query.isRemindHeadTeacher">扣分提醒班主任(实时提醒 )</el-checkbox>
                </el-form-item>
                <el-form-item label="接收人" prop="workStuJson" v-if="query.isFeedBackReport">
                    <div class="classevaluateindex-box">
                        <address-book v-model="query.workStuJson" :config="managerConfigData"></address-book>
                    </div>

                </el-form-item>
                <el-form-item prop="descriptions" label="评分规则">
                    <div class="classevaluateindex-box">
                        <ueditor class="rich-editor new-editor" ref="ueditor" :defaultMes="query.judgingRules"
                                 @editModel="richTextEditHandler"></ueditor>
                    </div>
                </el-form-item>

            </el-form>

        </div>
    </div>
</template>

<script>
    import AddressBook from '@/components/AddressBook/indexExpand';
    import Ueditor from '@/components/Ueditor';
    import mixin from "@/mixins/windowResize";
    import {getClassRatingSet, addClassRatingSet, updateClassRatingSet} from '@/api/systemSet/classevaluate';

    export default {
        name: "classevaluateindex",
        data() {
            const workStuJsonValidator = (rule, value, callback) => {
                if (this.query.isFeedBackReport && (JSON.stringify(this.query.workStuJson) === '{}' || this.query.workStuJson.userJson.length === 0)) {
                    callback(new Error('请选择接收人'));
                } else {
                    callback();
                }
            };
            const descriptionValidata = (rule, value, callback) => {
                if (this.query.judgingRules == "") {
                    callback(new Error('请输入内容'));
                } else {
                    callback();
                }
            };
            return {
                containerHeight: '',
                managerConfigData: {title: '请选择接收人', depart: {target: 'user', departType: 't', userTypes: '1'}},
                query: {
                    feedBackReporters: [],//	反馈报告人	string	@mock=[{'id':'10008744','loginname':'abc1','name':'字aa','avatar':'https://rescdn.qqmail.com/node/wwmng/wwmng/style/images/independent/DefaultAvatar$73ba92b5.png','mobile':'13123123456','type':'0'}]'
                    id: '',//	记录id	number
                    isFeedBackReport: false,//	发送反馈报告 1:发送 2:不发送	number	@mock=1
                    isRemindCheckTeacher: false,//	提醒任课老师 1:提醒 2:不提醒	number	@mock=1
                    isRemindHeadTeacher: false,//	提醒班主任 1:提醒 2:不提醒	number	@mock=1
                    judgingRules: '',//	评分规则	string	@mock=规则
                    workStuJson: {},

                },
                rules: {
                    workStuJson: [{
                        required: true,
                        validator: workStuJsonValidator
                    }],
                    descriptions: [
                        {required: true, trigger: 'blur,change', validator: descriptionValidata}
                    ],

                },
                isadd: false,
            }
        },
        components: {
            AddressBook,
            Ueditor
        },
        mixins: [mixin],
        created() {
            this.getClassRatingSets()
        },
        mounted() {
            this.containerHeight = window.innerHeight - 200;
        },
        methods: {
            getClassRatingSets() {
                getClassRatingSet()
                    .then(res => res.data)
                    .then(data => {
                        if (data.data != null) {
                            if (data.data.feedBackReporters) {
                                this.query.workStuJson.userJson = JSON.parse(data.data.feedBackReporters);
                            }
                            this.query.id = data.data.id;
                            if (data.data.isFeedBackReport == 1) {
                                this.query.isFeedBackReport = true;
                            }
                            if (data.data.isRemindCheckTeacher == 1) {
                                this.query.isRemindCheckTeacher = true;
                            }
                            if (data.data.isRemindHeadTeacher == 1) {
                                this.query.isRemindHeadTeacher = true;
                            }
                            if (data.data.judgingRules) {
                                this.query.judgingRules = data.data.judgingRules;
                                this.$refs.ueditor.setContent(data.data.judgingRules);
                            }
                        } else {
                            this.isadd = true;
                        }

                    });
            },
            richTextEditHandler(judgingRules) {
                this.query.judgingRules = judgingRules;
            },
            //保存
            Preservation(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.query.judgingRules = this.$refs.ueditor.getContent();
                        if (this.isadd) {
                            let obj = {
                                feedBackReporters: '',//	反馈报告人	string	@mock=[{'id':'10008744','loginname':'abc1','name':'字aa','avatar':'https://rescdn.qqmail.com/node/wwmng/wwmng/style/images/independent/DefaultAvatar$73ba92b5.png','mobile':'13123123456','type':'0'}]'
                                // id:this.query.id,//	记录id	number
                                isFeedBackReport: 2,//	发送反馈报告 1:发送 2:不发送	number	@mock=1
                                isRemindCheckTeacher: 2,//	提醒任课老师 1:提醒 2:不提醒	number	@mock=1
                                isRemindHeadTeacher: 2,//	提醒班主任 1:提醒 2:不提醒	number	@mock=1
                                judgingRules: this.query.judgingRules,//	评分规则	string	@mock=规则
                            };
                            if (this.query.workStuJson.userJson) {
                                obj.feedBackReporters = this.query.workStuJson.userJson
                            }
                            if (this.query.isFeedBackReport == true) {
                                obj.isFeedBackReport = 1;
                            }
                            if (this.query.isRemindCheckTeacher == true) {
                                obj.isRemindCheckTeacher = 1;
                            }
                            if (this.query.isRemindHeadTeacher == true) {
                                obj.isRemindHeadTeacher = 1;
                            }
                            //新增
                            addClassRatingSet(obj).then(res => {
                                if (res.data.code === 200) {
                                    this.$message({
                                        type: 'success',
                                        message: '新增成功！'
                                    });
                                    this.$router.back();
                                }
                            }).catch(function () {
                            })

                        } else {
                            let obj = {
                                feedBackReporters: '',//	反馈报告人	string	@mock=[{'id':'10008744','loginname':'abc1','name':'字aa','avatar':'https://rescdn.qqmail.com/node/wwmng/wwmng/style/images/independent/DefaultAvatar$73ba92b5.png','mobile':'13123123456','type':'0'}]'
                                id: this.query.id,//	记录id	number
                                isFeedBackReport: 2,//	发送反馈报告 1:发送 2:不发送	number	@mock=1
                                isRemindCheckTeacher: 2,//	提醒任课老师 1:提醒 2:不提醒	number	@mock=1
                                isRemindHeadTeacher: 2,//	提醒班主任 1:提醒 2:不提醒	number	@mock=1
                                judgingRules: this.query.judgingRules,//	评分规则	string	@mock=规则
                            };
                            if (this.query.workStuJson.userJson) {
                                obj.feedBackReporters = this.query.workStuJson.userJson
                            }
                            if (this.query.isFeedBackReport == true) {
                                obj.isFeedBackReport = 1;
                            } else {
                                obj.feedBackReporters = []
                            }
                            if (this.query.isRemindCheckTeacher == true) {
                                obj.isRemindCheckTeacher = 1;
                            }
                            if (this.query.isRemindHeadTeacher == true) {
                                obj.isRemindHeadTeacher = 1;
                            }
                            updateClassRatingSet(obj).then(res => {
                                if (res.data.code === 200) {
                                    this.$message({
                                        type: 'success',
                                        message: '编辑成功！'
                                    });
                                    this.num = obj.isCurr;
                                    this.$router.back();
                                }
                            }).catch(function () {
                            })

                        }


                    }
                });
            }

        }
    }
</script>

<style lang="scss" scoped>
    .classevaluateindex {
        padding:12px;
    }

    .classevaluateindex-main {
        border-top: 1px #eee solid;
        padding-top: 20px;
        margin-top: 10px;
        overflow: auto;
    }

    .demo-ruleForm {
        width: 810px;
        margin: 0 auto;
    }
</style>
