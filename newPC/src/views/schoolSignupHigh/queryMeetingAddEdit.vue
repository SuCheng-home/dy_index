<!--添加通知-->
<template>
    <div class="app-container calendar-list-container" id="noticeAdd">
        <backtool>
            <el-button type="primary" size="medium" @click.native="saveHandler(1)" v-if="state == 1">保存草稿
            </el-button>
            <el-button type="primary" size="medium" @click.native="saveHandler(2)">发布
            </el-button>
        </backtool>
        <div :class="['page-main']" :style="{'height':nobottommaxH+'px'}"
             style="overflow: auto">
            <div style="width: 810px;padding-top:20px;margin: 0 auto;">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="140px" class="demo-ruleForm">
                    <el-form-item label="活动名称" prop="activityName">
                        <el-input v-model="ruleForm.activityName"></el-input>
                    </el-form-item>
                    <el-form-item label="签到开始时间" prop="signSTime">
                        <el-date-picker
                            format="yyyy-MM-dd HH:mm"
                            value-format="yyyy-MM-dd HH:mm"
                            v-model="ruleForm.signSTime"
                            align="right"
                            type="datetime"
                            placeholder="选择日期"
                            :picker-options="pickerOptions">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="签到结束时间" prop="signETime">
                        <el-date-picker
                            format="yyyy-MM-dd HH:mm"
                            value-format="yyyy-MM-dd HH:mm"
                            v-model="ruleForm.signETime"
                            align="right"
                            type="datetime"
                            placeholder="选择日期"
                            :picker-options="pickerOptions">
                        </el-date-picker>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
    import moment from 'moment';
    import Backtool from '@/components/BackTool';
    import {addEnrollNoticeActivity, editEnrollNoticeActivity, getEnrollNoticeActivityById} from '@/api/schoolSignupHigh';
    import mixin from '@/mixins/windowResize';

    export default {
        components: {
            Backtool,
        },
        data() {
            const signETimeValidator = (rule, value, callback) => {
                if(!this.ruleForm.signSTime || !this.ruleForm.signETime) {
                    callback('结束日期不能为空');
                } else {
                    if(this.ruleForm.signSTime <= this.ruleForm.signETime) {
                        callback();
                    } else {
                        callback('开始日期必须大于结束日期');
                    }
                }
            };
            return {
                noticeId: this.$route.query.noticeId,
                id: this.$route.query.id,
                isEdit: !!this.$route.query.id,

                state: 1,
                pickerOptions: {
                    disabledDate(time) {
                        return moment(time).format('YYYY-MM-DD') < moment().format('YYYY-MM-DD');
                    },
                },
                ruleForm: {
                    signETime: '',
                    signSTime: '',
                    activityName: '',
                    state: 1,
                },
                rules: {
                    activityName: [
                        {required: true, message: '请填写活动名称', trigger: 'blur'}
                    ],
                    publishType: [
                        {required: true, message: '请选择发布类型', trigger: 'blur'}
                    ],
                    content: [
                        {required: true, message: '登记简章', trigger: 'change'}
                    ],
                    signSTime: [
                        {required: true, message: '开始日期不能为空', trigger: 'change'}
                    ],
                    signETime: [
                        {required: true, validator: signETimeValidator, trigger: 'change'}
                    ],
                }
            };
        },
        mixins: [mixin],
        created() {
            if(this.isEdit) {
                getEnrollNoticeActivityById({
                    id: this.id
                })
                    .then(res => res.data)
                    .then(data => {
                        this.state = data.data.state;
                        this.ruleForm = data.data;
                    })
            }

        },
        methods: {
            saveHandler(state) {//添加通知
                this.$refs['ruleForm'].validate(valid => {
                    if (valid) {
                        const args = {
                            signETime: this.ruleForm.signETime,
                            signSTime: this.ruleForm.signSTime,
                            activityName: this.ruleForm.activityName,
                            state,
                        };

                        new Promise(resolve => {
                            if(this.isEdit) {
                                args.id = this.id;
                                editEnrollNoticeActivity(args)
                                    .then(res => res.data)
                                    .then(resolve)
                            } else {
                                args.noticeId = this.noticeId
                                addEnrollNoticeActivity(args)
                                    .then(res => res.data)
                                    .then(resolve)
                            }
                        })
                            .then(data => {
                                if(data.result ) {
                                    this.$message.success(`${this.isEdit ? '编辑' : '新增'}成功`);
                                    setTimeout(() => {
                                        this.$router.back();
                                    }, 500)
                                } else {
                                    this.message.error(data.msg);
                                }
                            });
                    }
                });
            },
        }
    }
</script>
<style scoped>
    .el-message-box__message {
        max-height: 720px;
        overflow: hidden auto;
    }
</style>
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
