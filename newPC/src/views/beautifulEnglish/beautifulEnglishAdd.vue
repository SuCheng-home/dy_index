<template>
    <div class="beautiful_english_add_wrap">
        <div class="header">
            <el-button size="medium" @click.native="goBack">返回</el-button>
            <el-button size="medium" type="primary" @click="saveReaction">保存</el-button>
        </div>
        <div class="beautiful_english_add_box" :style="`height: ${nobottommaxH}px;`">
            <div class="beautiful_english_box">
                <el-form label-width="100px" class="demo-ruleForm">
                    <el-form-item label="学生姓名">
                        <address-book v-model="addressData" :config="configData"></address-book>
                    </el-form-item>
                    <el-form-item>
                        <div slot="label">附件</div>
                        <uploader pathPrefix="yingyumeiwen" moduleCode="20200907" module="yingyumeiwen" :multiple="false" :extList="allFileTypeList"
                                  v-model="fileJson"></uploader>
                    </el-form-item>
                    <el-form-item>
                        <div slot="label">美文</div>
                    </el-form-item>
                    <el-form-item label-width="40px">
                        <ueditor class="rich-editor" ref="ueditor" :defaultMes="content"
                                 @editModel="richTextEditHandler"></ueditor>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
    import mixins from '@/mixins/windowResize';
    import AddressBook from '@/components/AddressBook/indexExpand';
    import Ueditor from "@/components/Ueditor";
    import Uploader from '@/components/Uploader/WebUploader';
    import {articleInsert, getArticleById, articleUpdateByModel} from '@/api/beautifulEnglish';

    export default {
        name: "beautifulEnglishAdd",
        components: {
            AddressBook,
            Ueditor,
            Uploader
        },
        data() {
            return {
                btnLoading: false,
                articleId: this.$route.query.articleId,
                treeNodeId: this.$route.query.treeNodeId,
                folderCode: this.$route.query.currentFolderCode,
                configData: {
                    title: '请选择学生',
                    depart: {target: 'user', departType: 's', userTypes: '2'},
                    SingleChose: true
                },
                addressData: {
                    userJson: []
                },
                fileJson: [],
                allFileTypeList: ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf'],
                content: ''
            }
        },
        mixins: [mixins],
        created() {
            if (this.articleId) {
                this.getArticleById();
            }
        },
        methods: {
            goBack() {
                this.$router.back();
            },
            getArticleById() {
                getArticleById({id: this.articleId}).then(res => {
                    const data = res.data.data;
                    if (res.data.code === 200 && res.data.result) {
                        this.content = data.content;
                        this.$refs.ueditor.setContent(data.content);
                        this.fileJson = data.fileList;
                        this.addressData = {
                            userJson: [JSON.parse(data.stuJson)]
                        };
                        let self = this;
                        setTimeout(() => {
                            self.$refs.ueditor.setContent(data.content);
                        }, 300)
                    }
                });
            },
            saveReaction() {
                if (!this.addressData.userJson.length) {
                    this.$message.error('选择学生');
                    return;
                }
                if (!this.fileJson.length && !this.content) {
                    this.$message.error('请上传附件或添加美文内容');
                    return;
                }
                let query = {
                    content: this.$refs.ueditor.getContent(),
                    fileJson: this.fileJson,
                    stuJson: this.addressData.userJson[0]
                };

                if (this.articleId) {
                    query.id = this.articleId;
                    this.articleUpdateByModel(query);
                } else {
                    query.folderCode = this.folderCode;
                    query.treeNodeId = this.treeNodeId;
                    this.articleInsert(query);
                }
            },
            articleInsert(query) {
                if (this.btnLoading) {
                    return;
                }
                this.btnLoading = true;
                articleInsert(query).then(res => {
                    if (res.data.code === 200 && res.data.result) {
                        this.$message.success('添加成功');
                        this.goBack();
                    } else {
                        this.btnLoading = false;
                        this.$message.warning(res.data.msg);
                    }
                });
            },
            articleUpdateByModel(query) {
                if (this.btnLoading) {
                    return;
                }
                this.btnLoading = true;
                articleUpdateByModel(query).then(res => {
                    if (res.data.code === 200 && res.data.result) {
                        this.$message.success('编辑成功');
                        this.goBack();
                    } else {
                        this.btnLoading = false;
                        this.$message.warning(res.data.msg);
                    }
                });
            },
            richTextEditHandler(content) {
                this.content = content;
            }
        }
    }
</script>

<style lang="scss" scoped>
    .beautiful_english_add_wrap {
        padding: 12px;

        .header {
            padding-bottom: 10px;
            border-bottom: 1px solid #eee;
        }

        .beautiful_english_add_box {
            padding-top: 20px;
            overflow-x: hidden;
            overflow-y: auto;

            .beautiful_english_box {

                width: 820px;
                margin: 0 auto;
            }
        }
    }
</style>
