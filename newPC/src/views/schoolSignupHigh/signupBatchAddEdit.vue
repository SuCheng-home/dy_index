<!--添加通知-->
<template>
    <div class="app-container calendar-list-container" id="noticeAdd">
        <backtool>
            <el-button type="primary" size="medium" @click.native="saveHandler(1)">保存草稿
            </el-button>
            <el-button type="primary" size="medium" @click.native="saveHandler(2)">发布
            </el-button>
        </backtool>
        <div :class="['page-main']" :style="{'height':nobottommaxH+'px'}"
             style="overflow: auto">
            <div style="width: 810px;padding-top:20px;margin: 0 auto;">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="140px" class="demo-ruleForm">
                    <el-form-item label="主题" prop="title">
                        <el-input v-model="ruleForm.title"></el-input>
                    </el-form-item>
                    <el-form-item label="登记开始时间" prop="addressData">
                        <el-date-picker
                            format="yyyy-MM-dd HH:mm:ss"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            v-model="ruleForm.startTime"
                            align="right"
                            type="datetime"
                            placeholder="选择日期"
                            :picker-options="pickerOptions">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="登记结束时间" prop="endTime">
                        <el-date-picker
                            format="yyyy-MM-dd HH:mm:ss"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            v-model="ruleForm.endTime"
                            align="right"
                            type="datetime"
                            placeholder="选择日期"
                            :picker-options="pickerOptions">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="出生日期限制">
                         <el-date-picker v-model="daterange" size="medium" type="daterange"  range-separator="-"
                            start-placeholder="开始日期" end-placeholder="结束日期" 
                        ></el-date-picker>
                       
                    </el-form-item>
                      
                    <el-form-item label="封面" prop="logoURL">
                        <uploader pathPrefix="zhaoshengbaominggaozhong" module="zhaoshengbaominggaozhong" moduleCode="248" v-model="files"
                                  :extList="['jpeg', 'jpg', 'bmp', 'gif', 'png']" showMode="image" showResult="image"
                                  :lineList="false"></uploader>
                    </el-form-item>
                    <el-form-item label="发布类型" prop="publishType">
                        <el-radio-group v-model="ruleForm.publishType">
                            <el-radio :label="1">测试发布</el-radio>
                            <el-radio :label="2">正式发布</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item class="new-editor" label="登记简章" prop="content">
                        <br/>
                        <ueditor style="width: 740px;position: relative;right: 70px;" class="rich-editor new-editor"
                                 ref="ueditor" :defaultMes="ruleForm.content"
                                 @editModel="richTextEditHandler">
                        </ueditor>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
    import moment from 'moment';
    import Ueditor from '@/components/Ueditor';
    import Backtool from '@/components/BackTool';
    import Uploader from '@/components/Uploader/WebUploader';
    import {addNotice, editNotice, getEnrollStuNoticeById} from '@/api/schoolSignupHigh';
    import mixin from '@/mixins/windowResize';

    export default {
        components: {
            Ueditor,
            Backtool,
            Uploader
        },
        data() {
            const logoURLValidator = (rule, value, callback) => {
                if(this.files ** this.files.length !== 0) {
                    callback();
                } else {
                    callback(new Error('请上传封面'))
                }
            };
            const endTimeValidator = (rule, value, callback) => {
                if(!this.ruleForm.startTime || !this.ruleForm.endTime) {
                    callback();
                } else {
                    if(this.ruleForm.startTime <= this.ruleForm.endTime) {
                        callback();
                    } else {
                        callback('开始日期必须大于结束日期');
                    }
                }
            }
            return {
                noticeId: this.$route.query.noticeId,
                isEdit: !!this.$route.query.noticeId,
                pickerOptions: {
                    disabledDate(time) {
                        return moment(time).format('YYYY-MM-DD') < moment().format('YYYY-MM-DD');
                    },
                },
                ruleForm: {
                    content: '',
                    endTime: '',
                    startTime: '',
                    title: '',
                    state: 1,
                    publishType: 1
                },
                rules: {
                    title: [
                        {required: true, message: '请填写主题', trigger: 'blur'}
                    ],
                    logoURL: [
                        {required: true, validator: logoURLValidator, trigger: 'blur'}
                    ],
                    publishType: [
                        {required: true, message: '请选择发布类型', trigger: 'blur'}
                    ],
                    content: [
                        {required: true, message: '登记简章', trigger: 'change'}
                    ],
                    endTime: [
                        {validator: endTimeValidator, trigger: 'change'}
                    ],
                },
                files: [{
                    fileId: '',
                    fileUrl: 'http://wxtestpb-10048617.image.myqcloud.com/20180525154811_342.jpg?imageView2/q/100/h/800',
                    fileName: 'cover'
                }],
                daterange:['','']
            };
        },
        mixins: [mixin],
        created() {
            if(this.isEdit) {
                getEnrollStuNoticeById({
                    noticeId: this.noticeId
                })
                    .then(res => res.data)
                    .then(data => {
                        this.ruleForm = data.data;
                        if(data.data.beginBirthDate){
                            this.daterange=[data.data.beginBirthDate,data.data.endBirthDate]
                        }
                        this.$refs.ueditor.setContent(data.data.content);
                        this.files = [{
                            fileId: '',
                            fileUrl: data.data.logoURL,
                            fileName: 'cover'
                        }]
                    })
            }

        },
        methods: {
            saveHandler(state) {//添加通知
                this.ruleForm.content = this.$refs.ueditor.getContent();
                this.$refs['ruleForm'].validate(valid => {
                    if (valid) {

                        const args = {
                            
                            content: this.ruleForm.content,
                            endTime: this.ruleForm.endTime,
                            startTime: this.ruleForm.startTime,
                            logoURL: this.files[0].fileUrl,
                            publishType: this.ruleForm.publishType, //如果是发布则改为发布状态
                            title: this.ruleForm.title,
                            yearNum: moment().format('YYYY'),
                            state
                        };
                        if(this.daterange&&this.daterange[0]){
                            args.beginBirthDate=moment(this.daterange[0]).format('YYYY-MM-DD')
                            args.endBirthDate=moment(this.daterange[1]).format('YYYY-MM-DD')
                        }

                        new Promise(resolve => {
                            if(this.isEdit) {
                                args.id = this.noticeId;
                                editNotice(args)
                                    .then(res => res.data)
                                    .then(resolve)
                            } else {
                                addNotice(args)
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
            richTextEditHandler(content) {
                this.ruleForm.content = content;
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
