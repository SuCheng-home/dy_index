<template>
    <div class="page news-add-page">
        <back-tool>
            <el-button type="primary" @click="addNewsHandler(1, 1, 0)" :disabled="isButtonDisabled" size="medium"
                       :loading="loadingState[0]">存草稿
            </el-button>
            <el-button type="primary" size="medium" @click="addNewsHandler(1, 2, 1)" :disabled="isButtonDisabled"
                       :loading="loadingState[1]">提交审核
            </el-button>
            <el-button type="primary" size="medium" @click="addNewsHandler(2, 1, 2)" :disabled="isButtonDisabled"
                       :loading="loadingState[2]">手机预览
            </el-button>
        </back-tool>
        <div class="main-wrap ">
            <div class="article-container scrollBar" :style="{'height':nobottommaxH+'px'}">
                <el-form
                    :model="formData"
                    label-width="120px"
                    :rules="rules"
                    ref="form"
                >
                    <el-form-item label="新闻标题" prop="title">
                        <el-input v-model.trim="formData.title" placeholder="新闻标题（1-100个字符）"
                                  :maxlength="100"></el-input>
                    </el-form-item>
                    <el-form-item label="新闻封面" prop="logoURL">
                        <chose-cover module="xinwen" moduleCode="1202" :sourceCover="coverData"
                                     v-model="formData.logoURL"></chose-cover>
                    </el-form-item>
                    <el-form-item label="审批人" prop="examineUserId">
                        <el-radio v-for="(apprUser, index) in apprUserList" :label="apprUser.id"
                                  v-model="formData.examineUserId" :key="index">
                            {{ apprUser.name }}
                        </el-radio>
                    </el-form-item>

                    <el-form-item label="开启落款部门" >
                        <el-tooltip :content="formData.inscribe === 1 ? '以部门落款' : '不以部门落款'" placement="top">
                            <el-switch v-model="formData.inscribe" :active-value="1" :inactive-value="0" on-text="是"
                                       off-text="否"></el-switch>
                        </el-tooltip>
                    </el-form-item>
                     <el-form-item label="落款部门" prop="departName"  v-if="formData.inscribe === 1" >
                        <el-input v-model="formData.departName" placeholder="请输入落款部门"  :maxlength="50"></el-input>                       
                    </el-form-item>
                    <el-form-item label="新闻内容" prop="content" class="new-editor">
                        <br/>
                        <ueditor class="rich-editor new-editor" style="width: 690px;position: relative;right: 88px;"
                                 ref="ueditor" :defaultMes="formData.content"
                                 @editModel="richTextEditHandler"></ueditor>
                    </el-form-item>
                    <el-form-item v-if="schoolFellow === 1 || outSide === 1" label="限制范围">
                        <span v-if="schoolFellow === 1">
                            校友
                            <el-tooltip :content="formData.schoolFellow === 1 ? '对校友开放' : '不对校友开放'" placement="top">
                                <el-switch v-model="formData.schoolFellow" :active-value="1" :inactive-value="0"
                                           on-text="是"
                                           off-text="否"></el-switch>
                            </el-tooltip>
                        </span>
                        <span v-if="outSide === 1">
                            &nbsp;&nbsp;校外
                            <el-tooltip :content="formData.outSide === 1 ? '对校外开放' : '不对校外开放'" placement="top">
                                <el-switch v-model="formData.outSide" :active-value="1" :inactive-value="0" on-text="是"
                                           off-text="否"></el-switch>
                            </el-tooltip>
                        </span>
                    </el-form-item>
                    <el-form-item label="新闻设置">
                        <el-checkbox v-model="formData.isAddSubscrip" v-if="hvaeSubscription==1">添加到订阅号列表</el-checkbox>
                        <el-checkbox v-model="formData.isSendToWebsite" v-if="isSendToWebsite==1">发布至网站</el-checkbox>
                        <el-checkbox v-model="formData.isfx">允许分享</el-checkbox>
                        <el-checkbox v-model="formData.comment">允许评论</el-checkbox>
                    </el-form-item>
                </el-form>
            </div>
            <!-- <div class="pcBox"> -->
            <phone-preview :phoneContent="phoneContent" :title="formData.title"></phone-preview>
            <!-- </div> -->
        </div>
    </div>
</template>

<script>
    import ChoseCover from '@/components/ChoseCover';
    import Ueditor from '@/components/Ueditor';
    import mixin from '@/mixins/windowResize';
    import BackTool from '@/components/BackTool';
    import {getBasicInfo, addNews} from '@/api/news';
    import PhonePreview from '@/components/phonePreview/index.vue';

    export default {
        components: {
            Ueditor,
            BackTool,
            ChoseCover,
            PhonePreview
        },
        data: function () {
            return {
                coverData: [
                    'https://wxtestpb-10048617.image.myqcloud.com/42d984d4-af1b-438a-9a5b-c0c209cdceba?imageView2/q/100/w/800',
                    'https://wxtestpb-10048617.image.myqcloud.com/194e0f4a-2681-4c94-9c8e-29d18dfb70b2?imageView2/q/100/w/800',
                    'https://wxtestpb-10048617.image.myqcloud.com/3231acd2-e8b7-445a-85d7-20244d54821c?imageView2/q/100/w/800'
                ],
                basePath: global.BasePath,
                isButtonDisabled: false,
                loadingState: [false, false, false],
                hvaeSubscription: 0,
                isSendToWebsite: 0,
                outSide: 0,
                schoolFellow: 0,
                formData: {
                    id: 0,
                    content: '',
                    departId: '',
                    departName: '',
                    examineUserId: '',
                    examineUserName: '',
                    inscribe: 0,//0-不落款；1-落款
                    comment: false,//评论，1代表可以评论，0代表不可评论
                    isAddSubscrip: false,//0-不发订阅号，1-发订阅号
                    isSendToWebsite: false,//0-不发网站，1-发网站
                    isfx: false,//0-不允许，1-允许
                    logoURL: 'https://wxtestpb-10048617.image.myqcloud.com/cc455cc3-c292-443d-b809-bf9ccb3b090d?imageView2/q/100/w/800',
                    optType: null, // 保存提交传1；手机预览传2
                    outSide: 0,
                    schoolFellow: 0,
                    state: null, // 保存草稿和预览时传1；提交审核传2
                    title: ''
                },
                apprUserList: [],
                departList: [],
                rules: {
                    title: [{
                        required: true, message: '新闻标题不能为空', trigger: 'blur'
                    },                    
                    {
                        min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur'
                    }],
                    departName: [{
                        required: true, message: '请输入落款部门', trigger: 'blur'
                    }], 
                    logoURL: [{
                        required: true,
                        message: '封面图片不能为空'
                    }],
                    examineUserId: [{
                        required: true,
                        message: '审批人不能为空!'
                    }],
                    content: [{
                        required: true,
                        message: '新闻内容不能为空'
                    }]
                },
                phoneContent: ''
            }
        },
        created() {
            //window.top.basePath = global.BasePath;
            getBasicInfo().then((res) => {
                const data = res.data;
                if (data.result) {
                    this.hvaeSubscription = data.data.hvaeSubscription;
                    this.isSendToWebsite = data.data.isSendToWebsite;
                    this.outSide = data.data.outSide;
                    this.schoolFellow = data.data.schoolFellow;
                    this.apprUserList = data.data.apprUserList;
                    this.departList = data.data.departList;
                    this.formData.examineUserId = this.apprUserList[0].id;
                    this.formData.departId = this.departList[0].id;
                    this.formData.departName= this.departList[0].name;
                } else {
                    this.$message.error('error');
                }
            }, (error) => {
                this.$message.error(error.msg);
            })

        },
        mixins: [mixin],
        // watch:{
        //     'formData.content': {
        //         handler: function () {
        //             this.$refs.form.validateField('content');
        //         },
        //         deep: true
        //     }
        // },
        methods: {
            richTextEditHandler(content) {
                this.formData.content = content;
                this.phoneContent = content;
                //this.$refs.form.validateField('content');
            },
            inputBlurHandler() {
                this.formData.title = this.formData.title.trim();
            },
            addNewsHandler(optType, state, loadingStateIndex) {
                this.formData.isAddSubscrip = this.formData.isAddSubscrip ? 1 : 0;
                this.formData.isSendToWebsite = this.formData.isSendToWebsite ? 1 : 0;
                this.formData.isfx = this.formData.isfx ? 1 : 0;
                this.formData.comment = this.formData.comment ? 1 : 0;
                const args = this.formData;
                let message = '';
                switch (loadingStateIndex) {
                    case 0:
                        message = '保存草稿成功';
                        break;
                    case 1:
                        message = '提交审核成功';
                        break;
                    case 2:
                        message = '保存成功！预览新闻请在手机上查看';
                        break;
                }
                this.$refs.form.validate((valid) => {
                    args.content = this.$refs.ueditor.getContent();
                    this.phoneContent = this.$refs.ueditor.getContent();
                    if (valid) {
                        const apprUserEntry = this.apprUserList.find(apprUser => apprUser.id === this.formData.examineUserId);
                        args.examineUserName = apprUserEntry !== undefined ? apprUserEntry.name : '';
                        if (this.formData.inscribe === 0) {
                            this.formData.departName = '';
                            this.formData.departId = 0;
                        } else {
                            args.departName = this.formData.departName;
                        }

                        args.optType = optType;
                        args.state = state;
                        this.$set(this.loadingState, loadingStateIndex, true);
                        this.isButtonDisabled = true;
                        addNews(args).then((res) => {
                            const data = res.data;
                            if (data.result) {
                                this.$set(this.loadingState, loadingStateIndex, false);
                                this.$message({
                                    message,
                                    type: 'success'
                                });
                                if (loadingStateIndex !== 2) {
                                    // setTimeout(() => {
                                    //     // window.history.back();
                                    //     this.$router.back();
                                    // }, 500)
                                } else {
                                    this.isButtonDisabled = false;
                                    this.formData.id = data.data.id;
                                }
                                this.$router.push({
                                    path: 'newsIndex'
                                })
                            } else {
                                this.$message.error(data.msg);
                                this.isButtonDisabled = false;
                                this.$set(this.loadingState, loadingStateIndex, false);
                            }
                        }).catch(() => {
                            this.isButtonDisabled = false;
                            this.$set(this.loadingState, loadingStateIndex, false);
                        })
                    } else {
                        return false;
                    }
                });
            }
        }
    }
</script>

<style lang="scss" scoped>
    .scrollBar {
        overflow-x: hidden;
        overflow-y: auto;

        &::-webkit-scrollbar-track-piece {
            background: #d3dce6;
        }

        &::-webkit-scrollbar {
            width: 6px;
        }

        &::-webkit-scrollbar-thumb {
            background: #99a9bf;
            border-radius: 20px;
        }
    }

    .page {
        padding:12px;
    }

    .news-add-page {
        .image-hint {
            color: #ff4949;
        }

        .main-wrap {
            width: 100%;
            padding-top: 0;
            padding-bottom: 0px;
            box-sizing: border-box;
            display: flex;
        }

        .article-container {
            width: 760px;
            padding-top: 20px;
            padding-right: 10px;
            font-size: 15px;
            margin-right: 6px;
            line-height: 26px;
            background: #fff;
            color: #676A6C;
            word-wrap: break-word;
            word-break: break-all;
        }

        .logo-image {
            width: 180px;
            height: 100px;
        }

        .rich-editor {
            line-height: 1em;
        }

    }

    .logo-uploader {
        height: 216px;
    }

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

    .upload-hint {
        width: 405px;
        height: 216px;
        border: 1px dashed #ccc;
        font-size: 60px;
        color: #ccc;
        line-height: 216px;
    }

    .custom-cover__radio {
        position: absolute;
        right: 25px;
        top: 2px;
    }

    .form-item--cover {
        vertical-align: middle;
    }

    .dialog-button-container {
        margin-top: 10px;
        text-align: right;
    }
</style>
<style scoped>
    .teshuUeditTop {
        position: relative;
        margin-bottom: 10px !important;
    }

    .teshuUeditTop:before {
        position: absolute !important;
        top: 10px;
        left: 72px;
        content: "*" !important;
        color: #f56c6c;
        margin-right: 4px;
    }

    .teshuUedit .el-form-item__content {
        margin-left: 82px !important;
    }

    .news-add-page .new-editor .el-form-item__error {
        left: -69px !important;
    }
</style>
