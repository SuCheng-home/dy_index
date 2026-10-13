<!--添加通知-->
<template>
    <div class="app-container calendar-list-container" id="noticeAdd">
        <backtool>
            <el-button size="medium" type="primary" @click="forwardInnerFunc" v-if="isShowByRole('2022052703')">转发本校</el-button>
            <el-button size="medium" type="primary" @click="forwardOuterFunc" v-if="isShowByRole('2022052703') && schoolInfo.schoolType != 3">转发校外</el-button>
            <el-button size="medium" type="primary" @click="feedbackFunc">回执</el-button>
        </backtool>
        <div :class="['page-main', isStandalone ? 'page-main--scroller' : '']">
            <div style="width: 1000px;padding-top:20px;margin: 0 auto;">
                <div class="title">发文处理单</div>
                <el-form ref="ruleForm" label-width="0" class="demo-ruleForm">
                    <el-form-item prop="textInfo">
                        <table class="text-info-table">
                            <colgroup>
                                <col width="150px"/>
                                <col width="350px"/>
                                <col width="150px"/>
                                <col width="350px"/>
                            </colgroup>
                            <tr>
                                <td class="td--label">* 文号：</td>
                                <td>
                                    {{formData.docNo}}
                                </td>
                                <td class="td--label">* 发文人：</td>
                                <td>
                                    {{formData.sendDepart}}
                                    ——{{formData.createUser}}
                                </td>
                            </tr>
                            <tr>
                                <td class="td--label">* 公文标题：</td>
                                <td colspan="3">
                                    {{formData.docTitle}}
                                </td>
                            </tr>
                            <tr>
                                <td class="td--label">* 密级：</td>
                                <td>
                                    {{formData.secretLevel}}
                                </td>
                                <td class="td--label">* 优先级：</td>
                                <td>
                                    {{formData.priorityLevel}}
                                </td>
                            </tr>
                            <tr>
                                <td class="td--label">备注：</td>
                                <td colspan="3">
                                    {{formData.remark}}
                                </td>
                            </tr>
                        </table>
                    </el-form-item>
                    <div class="section-title">正文</div>
                    <div class="section-content">
                        <div class="uploader-container">
                            <el-form-item prop="zhengwen">
                                <uploader only-display key="up1" buttonText="上传正文" buttonMode="none" :useDelete="false"
                                          :useSuccessIcon="false" resultMode="list" accept="*/*"
                                          pathPrefix="distText" :multiple="true" downloadable
                                          :value="textFilesJson"></uploader>
                            </el-form-item>
                        </div>
                    </div>
                    <div class="section-title">附件</div>
                    <div class="section-content">
                        <div class="uploader-container">
                            <el-form-item prop="fujian">
                                <uploader only-display key="up2" buttonText="上传附件" buttonMode="none" :useDelete="false"
                                          :useSuccessIcon="false" resultMode="list" accept="*/*"
                                          pathPrefix="distText" :multiple="true" downloadable
                                          :value="annexFilesJson"></uploader>
                            </el-form-item>

                        </div>
                    </div>
                    <div class="section-title">接收范围</div>
                    <div class="section-content">
                        <div class="uploader-container">
                            <el-form-item prop="jieshoufanwei">
                                <address-book-display v-model="receiveSchoolsJson"></address-book-display>
                            </el-form-item>
                        </div>
                    </div>
                    <template v-if="feedData.receiptContent">
                        <div class="section-title">回执内容</div>
                        <div class="section-content">
                            <div class="uploader-container">
                                <div class="line">
                                    <span class="label">回执内容：</span>{{feedData.receiptContent}}
                                </div>
                                <div class="line">
                                    <span class="label">回执附件：</span>
                                    <span class="value">
                                    <uploader only-display key="up2" buttonText="上传附件" buttonMode="none" :useDelete="false"
                                              :useSuccessIcon="false" resultMode="list" accept="*/*"
                                              pathPrefix="distText" :multiple="true" downloadable
                                              :value="feedData.receiptFilesJson"></uploader>
                                </span>
                                </div>
                            </div>
                        </div>
                    </template>

                </el-form>
            </div>

        </div>
        <address-book ref="addressBook" v-model="addressBookData" :config="addressBookConfig" :has-tolls="false"
                      @confirm="forwardInnerConfirm"></address-book>
        <union-address-book ref="unionAddressBook" :hasSearch="false" checkOnlySchool v-model="unionAddressBookData"
                            :config="unionAddressBookConfig" :has-tolls="false"
                            @confirm="forwardOuterConfirm"></union-address-book>
        <el-dialog title="回执" :visible.sync="isShowFeedbackDialog" :close-on-press-escape='false'
                   :close-on-click-modal='false' :modal-append-to-body='false' width="600px">
            <div class="form-box parent-form-box">
                <el-form :model="feedbackForm" :rules="feedbackRules" ref="feedbackForm" label-width="120px">
                    <el-form-item label="回执内容" prop="receiptContent">
                        <el-input type="textarea" maxlength="200" :rows="3" v-model="feedbackForm.receiptContent"
                                  placeholder="请输入回执内容"></el-input>
                    </el-form-item>
                    <el-form-item label="回执附件" prop="receiptFilesJson">
                        <uploader buttonText="上传附件" buttonMode="button" resultMode="list" accept="*/*"
                                  pathPrefix="distText" :multiple="true" :extList="allFileTypeList"
                                  :value="feedbackForm.receiptFilesJson"></uploader>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button size="medium" @click="isShowFeedbackDialog = false">取 消</el-button>
                <el-button size="medium" type="primary" @click="feedbackConfirm">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import Backtool from '@/components/BackTool';
    import Uploader from '@/components/Uploader/WebUploader2';
    import AddressBookDisplay from '@/components/AddressBook/AddressBookDisplay';
    import UnionAddressBook from '@/components/AddressBook/indexSchoolUnion';
    import AddressBook from '@/components/AddressBook/indexExpand';
    import {isShowByPermission, isShowByRole} from '@/utils';
    import {
        getBureauDocEduInfoById,
        saveBureauDocForwardUserReadData,
        saveSchoolUserReadData,
        forwardEduBureauDocToSelfSchool,
        forwardEduBureauDocToBranchSchool,
        saveSchoolUserReceiptData,
        saveBureauDocForwardUserReceiptData,
        getSchoolUserReadReceiptInfo,
        getUserDocReadReceiptInfo
    } from '@/api/distText';

    import {mapGetters} from 'vuex';

    export default {
        components: {
            UnionAddressBook,
            AddressBook,
            Backtool,
            AddressBookDisplay,
            Uploader
        },
        computed: {
            ...mapGetters(['isStandalone', 'userInfo', 'schoolInfo'])
        },
        data() {

            return {
                id: this.$route.query.id,
                isForward: this.$route.query.isForward == 1,

                addressBookData: {},
                unionAddressBookData: {},
                addressBookConfig: {
                    title: '请选择发布学校',
                    depart: {target: 'all', departType: 't', userTypes: '1'},
                    group: false,
                },
                unionAddressBookConfig: {
                    title: '请选择发布学校',
                    depart: {target: 'all', departType: 't', userTypes: '1'},
                    group: false,
                },
                loading: false,

                formData: {},
                textFilesJson: [],
                annexFilesJson: [],
                receiveSchoolsJson: [],

                feedbackForm: {
                    receiptContent: '',
                    receiptFilesJson: []
                },
                feedbackRules: {
                    receiptContent: [
                        {required: true, message: '请输入回执内容', trigger: 'blur'}
                    ],
                },
                isShowFeedbackDialog: false,

                feedData: {}
            };
        },
        created() {
            if (this.isForward) {
                saveBureauDocForwardUserReadData({
                    docId: this.id
                })
            } else {
                saveSchoolUserReadData({
                    docId: this.id
                })
            }
            getBureauDocEduInfoById({
                id: this.id
            })
                .then(res => res.data)
                .then(data => {
                    const pageData = data.data;
                    this.formData = pageData;
                    this.textFilesJson = JSON.parse(pageData.textFilesJson);
                    this.annexFilesJson = JSON.parse(pageData.annexFilesJson);
                    this.receiveSchoolsJson = JSON.parse(pageData.receiveSchoolsJson);
                });
            this.getFeedback();
        },
        methods: {
            isShowByRole,
            getFeedback() {
                new Promise(resolve => {
                    if(this.isForward) {
                        getUserDocReadReceiptInfo({
                            docId: this.id
                        })
                            .then(resolve)
                    } else {
                        getSchoolUserReadReceiptInfo({
                            docId: this.id
                        })
                            .then(resolve)
                    }
                })
                    .then(res => res.data)
                    .then(data => {
                        data.data.receiptFilesJson = JSON.parse(data.data.receiptFilesJson);
                        this.feedData = data.data;
                    })
            },
            forwardInnerFunc() {
                this.addressBookData = {};
                this.unionAddressBookData = {};
                this.$refs.addressBook.showAddress();
            },
            forwardOuterFunc() {
                this.addressBookData = {};
                this.unionAddressBookData = {};
                this.$refs.unionAddressBook.showAddress();
            },
            forwardInnerConfirm() {
                if (this.addressBookData.departJson.length === 0 && this.addressBookData.userJson.length === 0) {
                    this.$message.error('请选择要转发的人员或部门');
                } else {
                    forwardEduBureauDocToSelfSchool({
                        docId: this.id,
                        scopeJson: JSON.stringify(this.addressBookData)
                    })
                        .then(res => res.data)
                        .then(data => {
                            if (data.result) {
                                this.$message.success('转发成功');
                            } else {
                                this.$message.error(data.msg);
                            }
                        })
                }
            },
            forwardOuterConfirm() {
                if (this.unionAddressBookData.schoolJson.length === 0 &&
                    this.unionAddressBookData.userJson.length === 0 &&
                    this.unionAddressBookData.departJson.length === 0
                ) {
                    this.$message.error('请选择要转发的人员或部门');
                } else {
                    forwardEduBureauDocToBranchSchool({
                        docId: this.id,
                        scopeJson: JSON.stringify(this.unionAddressBookData)
                    })
                        .then(res => res.data)
                        .then(data => {
                            if (data.result) {
                                this.$message.success('转发成功');
                            } else {
                                this.$message.error(data.msg);
                            }
                        })
                }
            },

            feedbackFunc() {
                this.feedbackForm = {
                    receiptContent: this.feedData.receiptContent || '',
                    receiptFilesJson: this.feedData.receiptFilesJson ? JSON.parse(JSON.stringify(this.feedData.receiptFilesJson)) : []
                };
                this.isShowFeedbackDialog = true;
            },
            feedbackConfirm() {
                this.$refs.feedbackForm.validate(isValid => {
                    if (isValid) {
                        new Promise(resolve => {
                            const args = {
                                docId: this.id,
                                receiptContent: this.feedbackForm.receiptContent,
                                receiptFilesJson: JSON.stringify(this.feedbackForm.receiptFilesJson),
                            };
                            if(this.isForward) {
                                saveBureauDocForwardUserReceiptData(args)
                                    .then(resolve)
                            } else {
                                saveSchoolUserReceiptData(args)
                                    .then(resolve)
                            }
                        })
                            .then(res => res.data)
                            .then(data => {
                                if (data.result) {
                                    this.$message.success('回执成功');
                                    this.isShowFeedbackDialog = false;
                                    this.getFeedback();
                                } else {
                                    this.$message.error(data.msg);
                                }
                            })


                    }
                });
            },
            btnLoadState(state) {
                this.loading = state;
            },
        }
    }
</script>
<style scoped lang="scss">
    .el-button + .el-button {
        margin-left: 0;
    }

    .title {
        text-align: center;
        font-size: 20px;
        margin-bottom: 10px;
    }

    .text-info-table {
        table-layout: fixed;
        width: 100%;
        border: 1px solid #ff0000;
        border-collapse: collapse;

        td {
            border: 1px solid #ff0000;
            padding: 5px;
        }

        .td--label {
            color: #ff0000;
        }
    }

    .section-title {
        line-height: 20px;
        font-size: 16px;
        border-left: 4px solid #409EFF;
        padding-left: 10px;
        margin-bottom: 10px;
    }

    .section-content {
        margin-left: 14px;
    }

    .uploader-container {
        width: 500px;
        margin-bottom: 10px;
    }

    .td--label {
        text-align: right;
    }

    .label {
        display: inline-block;
        vertical-align: top;
        width: 6em;
    }
    .value {
        display: inline-block;
        vertical-align: top;
        width: 390px;
    }

    .line {
        margin-bottom: 14px;
    }
</style>
<style lang="scss">
    #noticeAdd {
        .editor-container .el-form-item__error {
            margin-left: -70px;
        }
    }
</style>
