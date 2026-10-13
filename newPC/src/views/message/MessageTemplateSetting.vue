<template>
    <div id="area-setting" class="app-container calendar-list-container">
        <backtool>
            <el-button type="primary" @click="addHandler()" size="medium">创建模板</el-button>
        </backtool>
        <div :class="[ 'custom—scrollbar']" :style="{height: `${maxH}px`}">
            <div class="main-container">
                <div class="message-template-list">
                    <div class="message-template-item" v-for="templateItem in messageTemplateList">
                        <div class="message-template-item__inner">
                            <div class="tag-container">
                                <el-tag v-if="templateItem.statusCode == 1">待审核</el-tag>
                                <el-tag v-else-if="templateItem.statusCode == 0" type="success">已通过</el-tag>
                                <el-tag v-else-if="templateItem.statusCode == -1" type="danger">未通过</el-tag>
                            </div>
                            <h4 class="message-template-item__title">{{templateItem.title}}</h4>
                            <div class="message-template-item__content">{{templateItem.content}}</div>
                            <div class="message-template-item__footer">
                                <span class="edit-btn" v-if="templateItem.statusCode == 1 || templateItem.statusCode == -1"  @click="editHandler(templateItem)">
                                    <i class="fa fa-edit"></i>
                                </span>
                                <span class="delete-btn" @click="deleteHandler(templateItem.id, templateItem.templateId)">
                                    <i class="fa fa-trash"></i>
                                </span>
                                <span v-if="templateItem.statusCode == -1">
                                    <span class="link" @click="showFailMessage(templateItem.reviewReply)">查看失败原因</span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <el-dialog @close="cancelHandler" :close-on-click-modal='false' title="短信" :visible.sync="isShowMessageDialog" width="600px">
            <div>
                <el-form :model="formData" label-width="78px" :rules="formRules" ref="form">
                    <el-form-item label="模板名称" prop="title">
                        <el-input @blur.stop="blurInput('title')" :maxlength="20" style="width: 480px;" v-model="formData.title"></el-input>
                    </el-form-item>
                    <el-form-item label="模板内容" prop="content">
                        <el-input @blur.stop="blurInput('content')" :maxlength="500" type="textarea" style="width: 480px;" v-model="formData.content" :rows="3"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="medium" @click="cancelHandler">取 消</el-button>
                <el-button size="medium" type="primary" @click="confirmHandler()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {
        queryTemplateBySchoolId,
        deleteTemplate,
        addTemplate,
        editTemplate
    } from '@/api/messageTemplate';
    import mixin from '@/mixins/windowResize';

    export default {
        name: "messageTemplateList",
        mixins: [mixin],
        data() {
            return {
                isPrimary: window.location.href.indexOf('primary') !== -1,
                messageTemplateList: [],
                isShowMessageDialog: false,
                formData: {
                    content: '',
                    title: ''
                },
                formRules: {
                    title: [{
                        required: true, message: '模板名称不能为空', trigger: 'blur'
                    }],
                    content: [{
                        required: true, message: '模板内容不能为空', trigger: 'blur'
                    }]
                },
                mode: 'add',
                editTemplateId: null,
                editId: null
            }
        },
        mounted() {
            this.mainContainerHeight = `${window.innerHeight - 280}px`;
            this.queryTemplateBySchoolIdFunc();

        },
        methods: {
            blurInput(key) {
                this.$set(this.formData, key, this.formData[key].trim());
            },
            addHandler() {
                this.mode = 'add';
                this.isShowMessageDialog = true;
            },
            queryTemplateBySchoolIdFunc() {
                queryTemplateBySchoolId()
                    .then(res => res.data)
                    .then(data => {
                        this.messageTemplateList = data.data;
                    });
            },
            deleteHandler(id, templateId) {
                this.$confirm('是否确认删除?', '删除', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteTemplate({
                        templateId: id,
                        templateMessageId: templateId
                    })
                        .then(res => res.data)
                        .then(data => {
                            if(data.result) {
                                this.$message({
                                    message: '删除成功',
                                    type: 'success'
                                });
                                this.queryTemplateBySchoolIdFunc();
                            }
                        })
                });
            },
            editHandler({content, title, id, templateId}) {
                this.formData = {
                    content,
                    title
                };
                this.mode = 'edit';
                this.editId = id;
                this.editTemplateId = templateId;
                this.isShowMessageDialog = true;
            },
            cancelHandler() {
                this.isShowMessageDialog = false;
                setTimeout(() => {
                    this.formData = {
                        content: '',
                        title: ''
                    };
                }, 300);
            },
            showFailMessage(message) {
                this.$alert(message, '未通过原因');
            },
            confirmHandler() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        new Promise((resolve => {
                            if(this.mode === 'add') {
                                addTemplate(this.formData)
                                    .then(res => res.data)
                                    .then(resolve)
                            } else {
                                const args = Object.assign({}, this.formData, {
                                    id: this.editId,
                                    templateId: this.editTemplateId
                                });
                                editTemplate(args)
                                    .then(res => res.data)
                                    .then(resolve)
                            }
                        }))
                            .then(data => {
                                if(data.result) {
                                    this.$message({
                                        type: 'success',
                                        message: `${this.mode === 'add' ? '新增' : '编辑'}成功!`
                                    });
                                    this.isShowMessageDialog = false;
                                    this.queryTemplateBySchoolIdFunc();
                                    setTimeout(() => {
                                        this.formData = {
                                            content: '',
                                            title: ''
                                        };
                                    }, 300);
                                }
                            })

                    }
                });
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../styles/mixin.scss";

    @include reset-global;

    .second-header-wrap {
        width: 92%;
        min-width: 1200px;
        height: 60px;
        line-height: 60px;
        padding: 5px 4%;
        background-color: #fff;
        z-index: 1000;
    }
    .second-header-wrap--primary {
        left: 0;
        width: 92%;
        min-width: 1200px;
        background-color: #fff;
        z-index: 1000;
        padding: 20px 0 0 0;
    }
    .main-wrap {
        width: 100%;
    }
    .main-wrap--primary {
        width: 100%;
    }
    .main-container {
        /*width: 1320px;*/
        margin: 0 auto;

        padding: 0 10px;
        min-height: 560px;
    }

    .custom—scrollbar {
        overflow-x: hidden;
        overflow-y: auto;
    }

    .custom—scrollbar::-webkit-scrollbar {
        width: 6px;
        background-color: rgba(255, 255, 255, 0.1);
    }

    .custom—scrollbar::-webkit-scrollbar-thumb {
        background-color: #999;
    }

    .custom—scrollbar::-webkit-scrollbar-track {
        background-color: rgba(255, 255, 255, 0.1);
    }
    .message-template-item {
        float: left;
        width: 24.5%;
        margin-bottom: 20px;
        padding: 10px;
        font-size: 13px;
        .message-template-item__inner {
            /*width: 80%;*/
            height: 300px;
            background: #fff;
            position: relative;
            box-sizing: border-box;
            padding: 10px;
            margin: 0 auto;
            border: 1px solid #ddd;
            /*box-shadow: 0 1px 2px #c5c5c5;*/
            &:hover {
                /*box-shadow: 1px 4px 10px 2px #CCC;*/
                transform: translateY(-1%);
                transition: all .4s;
            }
        }
        .message-template-item__title {
            font-size: 19px;
            font-weight: bold;
            line-height: 1.1;
            margin-top: 10px;
            margin-bottom: 10px;
            text-align:center;
            color:rgb(51, 51, 51);
            display:block;
        }
        .message-template-item__content {
            height: 200px;
            color: #333;
            overflow-y: auto;
        }
        .message-template-item__footer {
            position: absolute;
            bottom: 3px;
        }
        .edit-btn {
            margin-right: 10px;
            color: #409EFF;
            cursor: pointer;
        }
        .delete-btn {
            color: #f08080;
            cursor: pointer;
        }
    }
    .tag-container {
        position: absolute;
        right: 10px;
        top: 10px;
    }
    .fa {
        font-size: 18px;
    }
    .link {
        color: #409EFF;
        cursor: pointer;
        margin-left: 10px;
    }
</style>

