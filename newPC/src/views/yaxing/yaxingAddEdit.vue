<!--添加通知-->
<template>
    <div class="app-container calendar-list-container" id="noticeAdd">
        <backtool>
            <template v-if="state == 1">
                <el-button type="primary" size="medium" :disabled="loading" :loading="loading" @click.native="saveHandler(1)">保存</el-button>
                <el-button type="primary" size="medium" :disabled="loading" :loading="loading" @click.native="saveHandler(2)">发布</el-button>
            </template>
            <template v-else>
                <el-button type="primary" size="medium" :disabled="loading" :loading="loading" @click.native="saveHandler(2)">保存</el-button>
            </template>
        </backtool>
        <div :class="['page-main', isStandalone ? 'page-main--scroller' : '']"  :style="{'height':nobottommaxH+'px'}" style="overflow: auto">
            <div style="width: 810px;padding-top:20px;margin: 0 auto;">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="140px" class="demo-ruleForm">
                    <el-form-item label="标题" prop="title">
                        <el-input :maxlength="30" @blur="titleBlurHandler" v-model="ruleForm.title"></el-input>
                    </el-form-item>
                    <el-form-item label="宣传信息" prop="content" class="new-editor">
                        <br />
                        <ueditor class="rich-editor new-editor" style="width: 740px;position: relative;right: 70px;" ref="ueditor" :defaultMes="ruleForm.content"
                                 @editModel="richTextEditHandler"></ueditor>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
    import Ueditor from '@/components/Ueditor';
    import Backtool from '@/components/BackTool';
    import {insertYaxing, updateYaxing, getYaxingById} from '@/api/yaxing';
    import mixin from '@/mixins/windowResize';

    import {mapGetters} from 'vuex';

    export default {
        components: {
            Ueditor,
            Backtool
        },
        computed: {
            ...mapGetters(['isStandalone'])
        },
        data() {
            return {
                loading: false,
                id: this.$route.query.id,
                isEdit: !!this.$route.query.id,
                type: this.$route.params.type,
                state: 1,

                ruleForm: {
                    content: '',
                    title: ''
                },
                rules: {
                    title: [
                        {required: true, message: '标题不能为空', trigger: 'blur'}
                    ],
                    content: [
                        {required: true, message: '宣传信息不能为空', trigger: 'change'}
                    ]
                },
            };
        },
        mixins:[mixin],
        created() {
            if(this.isEdit) {
                getYaxingById({
                    id: this.id
                })
                    .then(res => res.data)
                    .then(data => {
                        const pageData = data.data;
                        this.state = pageData.state;
                        this.ruleForm.content = pageData.content;
                        this.$refs.ueditor.setContent(pageData.content);
                        this.ruleForm.title = pageData.title;
                    })
            }

        },
        methods: {
            titleBlurHandler() {
                this.ruleForm.title = this.ruleForm.title.trim()
            },
            richTextEditHandler(content) {
                this.ruleForm.content = content;
            },
            saveHandler(state) {
                this.$refs.ruleForm.validate(isValid => {
                    if(isValid) {
                        this.loading = true;
                        new Promise(resolve => {
                            const args = {
                                state,
                                content: this.$refs.ueditor.getContent(),
                                title: this.ruleForm.title
                            };
                            if(this.isEdit) {
                                args.id = this.id;
                                updateYaxing(args).then(resolve);
                            } else {
                                args.type = this.type;
                                insertYaxing(args).then(resolve);
                            }
                        })
                            .then(res => res.data)
                            .then(data => {
                                if(data.result) {
                                    this.$message.success(`${this.isEdit ? '编辑' : (state == 1 ? '保存' : '发布')}成功`);
                                    this.$router.back();
                                } else {
                                    this.$message.error(data.msg);
                                    this.loading = false;
                                }
                            })
                            .catch(error => {
                                this.$message.error(error);
                                this.loading = false;
                            })
                    }
                })

            }
        }
    }
</script>
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
<style lang="scss">
    #noticeAdd .form-item--richtext {
        .el-form-item__content {
            transform: translateX(1px);
        }
    }
</style>
