<template>
    <div class="page news-approval-edit-page">
        <back-tool>
            <el-button type="primary" size="medium" @click="updateAndPublishHandler(2, 0, 0)" :loading="loadingState[0]">保存
            </el-button>
        </back-tool>
        <div class="main-wrap " >
            <div class="article-container scrollBar" :style="{'height':nobottommaxH+'px'}">
                <el-form
                        :model="formData"
                        label-width="120px"
                        :rules="rules"
                        ref="form"
                >
                    <el-form-item label="新闻标题" prop="title">
                        <el-input v-model.trim="formData.title" placeholder="新闻标题（1-100个字符）"></el-input>
                    </el-form-item>
                    <el-form-item label="新闻封面" prop="logoURL">
                        <chose-cover module="xinwen" moduleCode="1202" :sourceCover="coverData" v-model="formData.logoURL"></chose-cover>
                    </el-form-item>
                    <el-form-item label="新闻内容" class="new-editor" prop="content">
                        <br />
                        <ueditor class="rich-editor new-editor" style="width: 690px;position: relative;right: 88px;"  ref="richText" :defaultMes="formData.content" @editModel="richTextEditHandler"></ueditor>
                    </el-form-item>
                    <el-form-item label=""  class="teshuUedit">
                        
                    </el-form-item>

                </el-form>
            </div>
            <phone-preview :phoneContent="phoneContent" :title="formData.title"></phone-preview>
        </div>
    </div>

</template>

<script>
    import Ueditor from '@/components/Ueditor';
    import ChoseCover from '@/components/ChoseCover';
    import mixin from '@/mixins/windowResize';
    import {getBasicInfo, updateAndPublish, getNewsDetailById} from '@/api/news';
    import BackTool from '@/components/BackTool';
    import PhonePreview from '@/components/phonePreview/index';
    export default {
        data: function () {
            return {
                coverData: [
                    'https://wxtestpb-10048617.image.myqcloud.com/42d984d4-af1b-438a-9a5b-c0c209cdceba?imageView2/q/100/w/800',
                    'https://wxtestpb-10048617.image.myqcloud.com/194e0f4a-2681-4c94-9c8e-29d18dfb70b2?imageView2/q/100/w/800',
                    'https://wxtestpb-10048617.image.myqcloud.com/3231acd2-e8b7-445a-85d7-20244d54821c?imageView2/q/100/w/800'
                ],
                showCoverChooser: false,
                customCoverUrl: '',
                loadingState: [false, false],
                formData: {
                    id: '',
                    content: '',
                    departId: '',
                    departName: '',
                    inscribe: 0,
                    isAddSubscrip: 0,
                    isSendToWebsite: 0,
                    isfx: 0,
                    logoURL: 'https://wxtestpb-10048617.image.myqcloud.com/cc455cc3-c292-443d-b809-bf9ccb3b090d?imageView2/q/100/w/800',
                    optType: null, // 保存提交传1；手机预览传2
                    outSide: 0,
                    schoolFellow: 0,
                    state: null, // 保存草稿和预览时传1；提交审核传2
                    title: ''
                },
                rules: {
                    title: [{
                        required: true, message: '新闻标题不能为空', trigger: 'blur'
                    }, {
                        min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur'
                    }],
                    logoURL: [{
                        required: true,
                        message: '请上传封面图片'
                    }],
                    content: [{
                        required: true,
                        message: '请输入新闻内容'
                    }]
                },
                phoneContent:''
            }
        },
        components: {
            BackTool,
            Ueditor,
            ChoseCover,
            PhonePreview
        },
        // watch:{
        //     'formData.content': {
        //         handler: function () {
        //             this.$refs.form.validateField('content');
        //         },
        //         deep: true
        //     }
        // },
        mixins:[mixin],
        methods: {
            richTextEditHandler(content) {
                this.formData.content = content;
                this.phoneContent=content;
            },
            updateAndPublishHandler(optType, state, loadingStateIndex) {
                const args = this.formData;
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        args.optType = optType;
                        args.state = state;
                        this.$set(this.loadingState, loadingStateIndex, true);
                        args.content = this.$refs.richText.getContent();
                        updateAndPublish(args).then((res) => {
                            const data = res.data;
                            if (data.result) {
                                this.$set(this.loadingState, loadingStateIndex, false);
                                this.$message({
                                    message: '新闻编辑成功',
                                    type: 'success'
                                });
                                setTimeout(() => {
                                    window.history.back();
                                }, 500)
                            } else {
                                this.$message.error(data.msg);
                                this.$set(this.loadingState, loadingStateIndex, false);
                            }
                        }).catch(() => {
                            this.$set(this.loadingState, loadingStateIndex, false);
                        })
                    } else {
                        return false;
                    }
                });
            },
        },
        mounted() {
            getNewsDetailById(this.$route.query)
                .then(res => {
                    const data = res.data;
                    if (data.result) {
                        // data.data.content = data.data.content.replace(/url\(['"](.*?)['"]\)/g, 'url(&quot;$1&quot;)');
                        this.formData = Object.assign({}, this.formData, data.data);
                        this.formData.id = this.$route.query.newsId;
                        this.phoneContent=data.data.content;
                        this.$refs.richText.setContent(data.data.content);
                    } else {
                        this.$message.error('error')
                    }
                }, error => {
                    this.$message.error(error);
                });
        },
    }
</script>

<style lang="scss">
    .page {
        padding:12px;
    }
    .news-approval-edit-page {
        .image-hint {
            color: #ff4949;
        }
        .main-wrap{
            width:100%;
            padding-top:0;
            padding-bottom:0px;
            box-sizing: border-box;
            display:flex;
            position: relative;
            background:#F4F4F4;
        }
        .article-container {
            width: 760px;
            padding-top:20px;
            padding-right:10px;
            font-size: 15px;
            margin-right:6px;
            line-height: 26px;
            color: #676A6C;
            word-wrap: break-word;
            word-break: break-all;
            background:#fff;
        }
        // .form-container {
        //     width: 80%;
        //     padding-top: 20px;
        // }

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

    .upload-hint {
        width: 405px;
        height: 216px;
        border: 1px dashed #ccc;
        font-size: 60px;
        color: #ccc;
        line-height: 216px;
    }
    .cover-item img.logo-image {
        width: 405px;
        height: 214px;
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
    .image-hint {
        color: #ff4949;
    }
    .form-container {
        width: 80%;
        padding-top: 20px;
    }

    .logo-image {
        width: 180px;
        height: 100px;
    }

    .rich-editor {
        line-height: 1em;
    }
    
</style>
<style scoped>
.teshuUeditTop{
    position:relative;
    margin-bottom:10px !important;
}
.teshuUeditTop:before{
    position: absolute !important;
    top: 10px;
    left: 72px;
    content: "*" !important;
    color: #f56c6c;
    margin-right: 4px;
}
.teshuUedit .el-form-item__content{
    margin-left:82px !important;
}
.news-approval-edit-page .new-editor .el-form-item__error{
    left:-69px !important;
}
</style>
