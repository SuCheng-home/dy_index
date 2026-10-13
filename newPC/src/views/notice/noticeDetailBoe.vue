<!--通知的详情-->
<template>
    <div class="app-container calendar-list-container">
        <backtool>
            <el-button type="primary" @click="isShowCommitDialog = true" size="medium" v-if="isShowByPermission('/notice/submit')">
                提交审批
            </el-button>
            <el-button type="primary" @click="isShowReview = true" size="medium" v-if="isShowByPermission('/notice/approval')">审批
            </el-button>
            <address-book v-model="addressData" :config="configData" :isbutton="true"
                          v-if="isShowByPermission('/notice/forward')">转发
            </address-book>
        </backtool>
        <div :class="['page-main', isStandalone ? 'page-main--scroller' : '']"  :style="{'height':nobottommaxH+'px'}" style="overflow: auto">
            <default-page v-if="(isDelete||isOver) && !isOwnCreate" Mes="无法查看，消息可能过期或被删除！"></default-page>
            <div style="width: 1100px; margin: 0 auto;display: flex;" v-else>
                <div class="ibox article" style="width:810px;">
                    <div class="ibox-content" style="border-top-width: 0;">
                        <div class="text-center article-title">
                            <h1>{{noticeTitle}} </h1>
                            <div class="sub-title">
                                {{releaseDate | trimTime}} <span v-if="!inscribe">{{releaseUserName}}</span>
                                <span class="departName" v-if="inscribe">{{departName}}</span>
                            </div>
                            <div class="clear"></div>
                        </div>
                        <image-previewer tag="richtext">
                            <div class="notice-content" :class="{'has-img':pics.length === 0}"
                                 v-html="noticeContent"></div>
                            <div class="notice-img">
                                <img class="img-item" :src="item.url" :key="item.picId" v-for="item in pics"/>
                                <div class="clear"></div>
                            </div>
                        </image-previewer>
                        <hr>
                        <div class="row">
                            <div class="col-lg-12">
                                <h2>发布范围：</h2>
                                <div class="social-feed-box">
                                    <div class="range-list">
                                        <template v-for="item in postJsonList">
                                            <div class="range-item">
                                        <span class="range-item-img"
                                              :style="{backgroundImage:'url('+require('@/assets/images/depart.png')+')'}"
                                              style="background-image: url(https://cdnfile-10043692.file.myqcloud.com/testimg/photo.jpg);"></span>
                                                <span class="range-item-des">{{item}}</span>
                                            </div>
                                        </template>
                                        <template v-for="item in schoolTypeJson">
                                            <div class="range-item">
                                        <span class="range-item-img"
                                              :style="{backgroundImage:'url('+require('@/assets/images/depart.png')+')'}"
                                              style="background-image: url(https://cdnfile-10043692.file.myqcloud.com/testimg/photo.jpg);"></span>
                                                <span class="range-item-des">{{item.name}}</span>
                                            </div>
                                        </template>
                                        <template v-for="item in schoolJson">
                                            <div class="range-item">
                                        <span class="range-item-img"
                                              :style="{backgroundImage:'url('+require('@/assets/images/group.png')+')'}"
                                              style="background-image: url(https://cdnfile-10043692.file.myqcloud.com/testimg/photo.jpg);"></span>
                                                <span class="range-item-des">{{item.name}}</span>
                                            </div>
                                        </template>
                                        <template v-for="item in userJson">
                                            <div class="range-item">
                                        <span class="range-item-img"
                                              :style="{backgroundImage:'url('+item.avatar+')'}"></span>
                                                <span
                                                    class="range-item-des">{{`${item.name}(${item.schoolName})`}}</span>
                                            </div>
                                        </template>
                                        <template v-for="item in departJson">
                                            <div class="range-item">
                                        <span class="range-item-img"
                                              :style="{backgroundImage:'url('+require('@/assets/images/depart.png')+')'}"
                                              style="background-image: url(https://cdnfile-10043692.file.myqcloud.com/testimg/photo.jpg);"></span>
                                                <span
                                                    class="range-item-des">{{`${item.name}(${item.schoolName})`}}</span>
                                            </div>
                                        </template>
                                        <template v-for="item in groupJson">
                                            <div class="range-item">
                                        <span class="range-item-img"
                                              :style="{backgroundImage:'url('+require('@/assets/images/group.png')+')'}"
                                              style="background-image: url(https://cdnfile-10043692.file.myqcloud.com/testimg/photo.jpg);"></span>
                                                <span class="range-item-des">{{`${item.name}`}}</span>
                                            </div>
                                        </template>
                                        <div class="clear"></div>
                                    </div>

                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-lg-12">
                                <h2>附件：</h2>
                                <div class="social-feed-box">
                                    <div class="file-list">
                                        <template v-if="files.length>0" v-for="item in files">
                                            <div
                                                v-if="getFileSuffix(item.originalFileName)==='doc'||getFileSuffix(item.originalFileName)=='docx'"
                                                class="file-item">
                                                <span class="file-item-img file-item-img-word"></span>
                                                <span class="file-item-des">
                                            <a :href="item.accessUrl" :download="item.originalFileName">{{item.originalFileName}}</a>
                                        </span>
                                            </div>
                                            <div
                                                v-if="getFileSuffix(item.originalFileName)=='ppt'||getFileSuffix(item.originalFileName)=='pptx'"
                                                class="file-item">
                                                <span class="file-item-img file-item-img-ppt"></span>
                                                <span class="file-item-des">
                                            <a :href="item.accessUrl" :download="item.originalFileName">{{item.originalFileName}}</a>
                                        </span>
                                            </div>
                                            <div v-if="getFileSuffix(item.originalFileName)=='pdf'" class="file-item">
                                                <span class="file-item-img file-item-img-pdf"></span>
                                                <span class="file-item-des">
                                            <a :href="item.accessUrl" :download="item.originalFileName">{{item.originalFileName}}</a>
                                        </span>
                                            </div>
                                            <div
                                                v-if="getFileSuffix(item.originalFileName)=='xls'||getFileSuffix(item.originalFileName)=='xlsx'"
                                                class="file-item">
                                                <span class="file-item-img file-item-img-excel"></span>
                                                <span class="file-item-des">
                                            <a :href="item.accessUrl" :download="item.originalFileName">{{item.originalFileName}}</a>
                                        </span>
                                            </div>
                                            <div
                                                v-if="getFileSuffix(item.originalFileName)=='zip'||getFileSuffix(item.originalFileName)=='rar'"
                                                class="file-item">
                                                <span class="file-item-img file-item-img-zip"></span>
                                                <span class="file-item-des">
                                            <a :href="item.accessUrl" :download="item.originalFileName">{{item.originalFileName}}</a>
                                        </span>
                                            </div>
                                        </template>
                                        <template v-if="files.length==0">无</template>
                                        <div class="clear"></div>
                                    </div>
                                </div>
                            </div>

                            <div class="read">
                                <template v-if="isAnswer != 1">
                                    <div class="reply-part" v-if="replyNum == 0">
                                        <div>回复：</div>
                                        <div>0</div>
                                    </div>
                                    <div v-else class="reply-part is-active" @click="replyNumBtn">
                                        <div>回复：</div>
                                        <div>{{replyNum}}</div>
                                    </div>
                                </template>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="misc-info" v-if="isShowByPermission('/notice/forward') || isShowByPermission('/notice/approval') || isShowByPermission('/notice/submit')">
                    <div class="misc-info-section" v-if="submitList && submitList.length !== 0">
                        <div class="misc-info-section__header">
                            <div class="misc-info-section__block"></div>
                            <div class="misc-info-section__title">提交信息</div>
                        </div>
                        <div class="misc-info-section__list submit-list">
                            <div v-for="submitItem in submitList" class="misc-info-item submit-item">

                                <div class="submit-item__line">
                                    {{submitItem.content}}
                                </div>
                                <div class="submit-item__line">
                                    <div class="submit-item__name">
                                        {{submitItem.createUserName}}
                                    </div>
                                    <div class="submit-item__time">
                                        {{submitItem.createTime | parseTimestamp}}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="misc-info-section" v-if="approvalList && approvalList.length !== 0">
                        <div class="misc-info-section__header">
                            <div class="misc-info-section__block"></div>
                            <div class="misc-info-section__title">批复信息</div>
                        </div>
                        <div class="misc-info-section__list review-list">
                            <div v-for="reviewItem in approvalList" class="misc-info-item review-item">
                                <div class="review-item__line">
                                    {{reviewItem.approvalContent}}
                                </div>
                                <div class="review-item__line">
                                    <div class="review-item__name">
                                        {{reviewItem.approverName}}
                                    </div>
                                    <div class="review-item__time">
                                        {{reviewItem.approvalTime | parseTimestamp}}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="misc-info-section" v-if="forwardUserList && forwardUserList.length !== 0">
                        <div class="misc-info-section__header">
                            <div class="misc-info-section__block"></div>
                            <div class="misc-info-section__title">已转发至人员名单</div>
                        </div>
                        <div class="misc-info-section__list forward-list">
                            <div class="forward-item__line forward-item__line--header">
                                <div class="forward-item__name">
                                    姓名
                                </div>
                                <div class="forward-item__time">
                                    转发时间
                                </div>
                            </div>
                            <div v-for="forwardItem in forwardUserList" class="misc-info-item forward-item">
                                <div class="forward-item__line">
                                    <div class="forward-item__name">
                                        {{forwardItem.name}}
                                    </div>
                                    <div class="forward-item__time">
                                        {{forwardItem.forwardTime | trimTime}}
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <el-dialog title="提交审批" :visible.sync="isShowCommitDialog" size="tiny" width="800px">
            <el-form :model="commitReviewForm" :rules="commitReviewFormRule" ref="commitReviewForm" label-width="100px"
                     class="demo-ruleForm">
                <el-form-item label="提交内容" prop="content">
                    <el-input v-model.trim="commitReviewForm.content" :maxlength="100" type="textarea" :rows="4"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="isShowCommitDialog = false">取 消</el-button>
                <el-button type="primary" @click="commitToReview">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="审批" :visible.sync="isShowReview" size="tiny" width="800px">
            <el-form :model="reviewForm" :rules="reviewFormRule" ref="reviewForm" label-width="100px"
                     class="demo-ruleForm">
                <el-form-item label="审批意见" prop="content">
                    <el-input v-model.trim="reviewForm.content" :maxlength="100" type="textarea" :rows="4"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="isShowReview = false">取 消</el-button>
                <el-button type="primary" @click="reviewHandler">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import {isShowByPermission} from '@/utils'
    import moment from 'moment';
    import {strToHtml} from '@/utils/utils';
    import {
        getNoticeInfo,
        forwardNotice,
        addNoticeSubmit,
        findSubmitAndApprovalAndForwardUser,
        addNoticeApproval,
        findAreaNoticeReplyList
    } from '@/api/notice';
    import Backtool from '@/components/BackTool';
    import DefaultPage from "@/components/DefaultPage";
    import AddressBook from '@/components/AddressBook/indexExpand';
    import ImagePreviewer from '@/components/ImagePreviewer/ImagePreviewer.vue';
    import {mapGetters} from 'vuex';
    import mixin from '@/mixins/windowResize';

    const DELETE_FLAG = {OK: 2, NO: 1};//1代表未删除，2代表已删除
    const OVER_FLAG = {OK: 1, NO: 0};//是否过期 0 未过期 1已过期
    export default {
        components: {
            Backtool,
            DefaultPage,
            ImagePreviewer,
            AddressBook
        },
        computed: {
            ...mapGetters(['isStandalone', 'userInfo'])
        },
        mixins:[mixin],
        data() {
            return {
                isShowCommitDialog: false,
                isShowReview: false,
                commitReviewForm: {
                    content: ''
                },
                commitReviewFormRule: {
                    content: [
                        {required: true, message: '请填写提交审核的内容', trigger: 'blur'}
                    ],
                },
                reviewForm: {
                    content: ''
                },
                reviewFormRule: {
                    content: [
                        {required: true, message: '请填写审批意见', trigger: 'blur'}
                    ],
                },


                configData: {
                    title: '选择通知范围',
                    depart: {target: 'all', departType: 't', userTypes: '1'},
                    group: {
                        groupTarget: 'all',
                        groupScope: [1, 2]
                    }                },
                addressData: {},

                noticeId: this.$route.query.id,
                noticeTitle: '',
                releaseUserName: '',
                releaseDate: '',
                noticeContent: '',
                schoolTypeJson: [],
                schoolJson: [],
                userJson: [],
                groupJson: [],
                departJson: [],
                postJsonList: [],
                files: [],
                isDelete: false,
                isOver: false,
                inscribe: '',
                departName: '',
                pics: [],
                isOwnCreate: false,//是否是自己创建的通知，是则显示
                noticeState: 0,
                isAnswer: 1,//回复
                notReadCount: 0,
                readCount: 0,
                replyNum: 0,

                approvalList: [],
                submitList: [],
                forwardUserList: []
            }
        },
        filters: {
            trimTime(datetime) {
                return datetime ? datetime.slice(0, datetime.lastIndexOf('.')) : '--';
            },
            parseTimestamp(timestamp) {
                return moment(new Date(parseInt(timestamp))).format('YYYY-MM-DD HH:mm:ss');
            }
        },
        watch: {
            addressData(addressData) {
                if (addressData.departJson.length !== 0 || addressData.userJson.length !== 0 || addressData.groupJson.length !== 0) {
                    forwardNotice({
                        fromArea: 2,
                        commonGroup: addressData,
                        noticeId: this.noticeId
                    })
                        .then(res => res.data)
                        .then(data => {
                            if (data.result) {
                                this.$message({
                                    message: '转发成功！',
                                    type: 'success'
                                });
                                this.findSubmitAndApprovalAndForwardUserFunc();
                            }
                        });
                } else {
                    this.$message.error('请选择转发人员！');
                }

            },
        },
        created() {
            // let submitRead = this.isReceive ? 1 : 0;
            getNoticeInfo(this.noticeId, 1).then(res => {
                let data = res.data.data;
                this.noticeTitle = data.noticeTitle;
                this.noticeState = data.noticeState;
                this.isAnswer = data.isAnswer;
                this.notReadCount = data.notReadCount;
                this.readCount = data.readCount;
                this.releaseUserName = data.releaseUserName;
                this.releaseDate = data.releaseDate;
                this.noticeContent = strToHtml(data.noticeContent);
                this.schoolTypeJson = data.areaDepartJson && data.areaDepartJson !== '' ? JSON.parse(data.areaDepartJson).schoolTypeJson : [];
                this.schoolJson = data.areaDepartJson && data.areaDepartJson !== '' ? JSON.parse(data.areaDepartJson).schoolJson : [];
                let userJsonArray = data.areaDepartJson && data.areaDepartJson !== '' ? JSON.parse(data.areaDepartJson).userJson : [];
                if (userJsonArray) {
                    userJsonArray.forEach(item => {
                        this.userJson.push(...item.userList)
                    })
                }
                let schoolJsonArray = data.areaDepartJson && data.areaDepartJson !== '' ? JSON.parse(data.areaDepartJson).departJson : [];
                if (schoolJsonArray) {
                    schoolJsonArray.forEach(item => {
                        this.departJson.push(...item.departList)
                    })
                }
                this.groupJson = data.areaDepartJson && data.areaDepartJson !== '' ? JSON.parse(data.areaDepartJson).groupJson : [];

                let postJsonList = data.areaDepartJson && data.areaDepartJson !== '' ? JSON.parse(data.areaDepartJson).postJson : {};
                if (postJsonList && JSON.stringify(postJsonList) != "{}") {
                    this.postJsonList.push(postJsonList.name)
                }
                if(!!data.fileJson) {
                    const files = [];
                    JSON.parse(data.fileJson).forEach((item) => {
                        files.push({
                            accessUrl: item.fileUrl,
                            createTime: null,
                            fileMime: item.fileName.slice(item.fileName.lastIndexOf('.') + 1),
                            fileName: null,
                            fileType: 0,
                            fileUrl: null,
                            id: item.id,
                            isDelete: 0,
                            originalFileName: item.fileName,
                            resourcePath: null,
                            updateTime: null
                        })
                    });
                    this.files = files;
                } else {
                    this.files = data.files;
                }
                this.isDelete = data.isDelete === DELETE_FLAG.OK;
                this.isOver = data.isOver === OVER_FLAG.OK;
                this.inscribe = data.inscribe;
                this.departName = data.departName;
                this.pics = data.pics;
                this.isOwnCreate = data.createUserId == this.userInfo.id;
            });
            findAreaNoticeReplyList({
                noticeId: this.noticeId
            })
                .then(res => res.data)
                .then(data => {
                    this.replyNum = data.data.length;
                });
            this.findSubmitAndApprovalAndForwardUserFunc();
        },
        methods: {
            isShowByPermission,
            findSubmitAndApprovalAndForwardUserFunc() {
                findSubmitAndApprovalAndForwardUser({
                    noticeId: this.noticeId
                })
                    .then(res => res.data)
                    .then(data => {
                        this.approvalList = data.data.approvalList;
                        this.submitList = data.data.submitList;
                        this.forwardUserList = data.data.forwardUserList;
                    });
            },
            commitToReview() {
                this.$refs.commitReviewForm.validate((valid) => {
                    if (valid) {
                        addNoticeSubmit({
                            content: this.commitReviewForm.content,
                            noticeId: this.noticeId
                        })
                            .then(res => res.data)
                            .then(data => {
                                if (data.result) {
                                    this.commitReviewForm.content = '';
                                    this.isShowCommitDialog = false;
                                    this.findSubmitAndApprovalAndForwardUserFunc();

                                    this.$message({
                                        message: '提交审批成功！',
                                        type: 'success'
                                    })
                                }
                            })
                    }
                });

            },
            reviewHandler() {
                this.$refs.reviewForm.validate((valid) => {
                    if (valid) {
                        addNoticeApproval({
                            approvalContent: this.reviewForm.content,
                            noticeId: this.noticeId
                        })
                            .then(res => res.data)
                            .then(data => {
                                if (data.result) {
                                    this.reviewForm.content = '';
                                    this.isShowReview = false;
                                    this.findSubmitAndApprovalAndForwardUserFunc();

                                    this.$message({
                                        message: '审核成功！',
                                        type: 'success'
                                    });
                                }
                            })
                    }
                });
            },
            getFileSuffix(fileName) {
                return fileName.replace(/.+\./, "").toLowerCase();
            },
            jumpToPage(path, query = {}) {
                this.$router.push({
                    path,
                    query
                })
            },
            toReadList(isRead, count, isOwnCreate) {
                if (count != 0 && isOwnCreate) {
                    this.jumpToPage('noticeReadList', {id: this.noticeId, isRead, noticeState: this.noticeState})
                }
            },
            //回复跳转
            replyNumBtn() {
                let type = this.isOwnCreate ? 1 : 2;
                this.$router.push({path: 'noticeReplyBoe', query: {id: this.noticeId, type: type}});
            }
        }
    }
</script>
<style lang="scss" scoped>
    @import "../../styles/mixin.scss";

    .article {
        font-family: "宋体" !important;
        width: 80%;
        margin: 0 auto;
        font-size: 15px;
        line-height: 26px;
        color: #676A6C;
        word-wrap: break-word;
        word-break: break-all;
    }

    .article h1 {
        font-size: 38px;
        color: rgb(47, 64, 80);
        line-height: 1.1em;
    }

    .article h2 {
        font-size: 16px;
        color: rgb(47, 64, 80);
    }

    .article hr {
        height: 1px;
        border: 0;
        border-top: 1px solid #d0d0d0;
    }

    .article-title {
        text-align: center;
    }

    .article p {
        font-size: 15px;
        line-height: 26px;
        color: #676A6C;
        word-wrap: break-word;
        word-break: break-all;
    }

    .sub-title {
        text-align: right;
        color: #676A6C
    }

    .hasread-small {
        border: 1px solid #e7eaec;
        padding: 2px;
        border-radius: 2px;
        display: inline-block;
        padding-right: 4px;
    }

    .notice-content {
        min-height: 100px;
    }

    .has-img {
        min-height: 250px;
    }

    .clear {
        clear: both;
    }

    .file-list,
    .range-list {
        margin: 10px;
    }

    .article .social-feed-box:last-child {
        margin-bottom: 0;
        border-bottom: 1px solid rgb(231, 234, 236);
    }

    .range-item {
        height: 30px;
        display: block;
        float: left;
        margin-left: 4px;
        margin-top: 4px;
        margin-right: 20px;
    }

    .range-item-img {
        height: 28px;
        width: 28px;
        display: block;
        float: left;
        background-position: center center;
        background-size: cover;
    }

    .range-item-des {
        padding-left: 4px;
        line-height: 30px;
        padding-right: 4px;
        color: #676A6C;
        font-size: 13px;
    }

    .social-feed-box {
        border: 1px solid #e7eaec;
        background: #fff;
        margin-bottom: 15px;
    }

    .file-item-img {
        height: 28px;
        width: 28px;
        display: block;
        float: left;
        background-position: center center;
        background-size: cover;
    }

    .file-item {
        height: 30px;
        display: block;
        border-bottom: 1px solid #e7eaec;
        margin-left: 4px;
        margin-top: 4px;
    }

    .file-item-des {
        padding-left: 4px;
        line-height: 30px;
        padding-right: 4px;
    }

    .image {
        max-width: 50% !important;
    }

    .video {
        max-width: 50% !important;
    }

    .departName {
        padding: 2px 4px;
    }

    .img-item {
        width: 160px;
        height: 200px;
        float: left;
        margin-right: 10px;
        margin-top: 10px;
    }

    .page-main {
        position: relative;
    }

    .page-main--scroller {
        overflow-y: auto;
        height: 610px;
        overflow-x: hidden;
    }

    .page-main--scroller::-webkit-scrollbar {
        width: 6px;
    }

    .page-main--scroller::-webkit-scrollbar-thumb {
        background: #99a9bf;
        border-radius: 20px;
    }

    .page-main--scroller::-webkit-scrollbar-track-piece {
        background: #d3dce6;
    }

    .misc-info {
        width: 280px;
        margin-top: 30px;
        padding-left: 20px;
        height: 570px;
        overflow-y: auto;
        color: #333;
        @include scrollBar;

        .misc-info-section__header {
            margin-bottom: 10px;

            & > * {
                @include middleIB;
            }
        }

        .misc-info-section__block {
            background-color: #409EFE;
            @include wh(20px, 20px);
            margin-right: 10px;
        }

        .misc-info-item {
            border-bottom: 1px solid #ccc;

            &:last-child {
                border: 0;
            }
        }

        .submit-item__line, .forward-item__line, .review-item__line {
            margin: 8px 0;
            overflow-wrap: break-word;
            word-wrap: normal;
            word-break: break-all;
            & > * {
                @include middleIB;
            }
        }

        .submit-item__name, .submit-item__time,
        .review-item__name, .review-item__time {
            font-size: 14px;
        }
        .review-item__line {
            .review-item__time {
                float: right;
            }
        }

        .submit-item__line {
            .submit-item__time {
                float: right;
            }
        }

        .forward-item__line {
            text-align: center;

            &.forward-item__line--header {
                color: #aaa;
            }

            .forward-item__name {
                width: 30%;
            }

            .forward-item__time {
                width: 68%;
            }
        }
    }
</style>
<style scoped>
    .notice-content a {
        color: #409EFF !important;
        text-decoration: underline !important;
    }

    .notice-content img {
        display: block;
        max-width: 100%;
    }

    .notice-content ol, .notice-content ul {
        padding-left: 30px;
    }
    .notice-content ol li {
        list-style-type: decimal !important;
    }
    .notice-content ul li {
        list-style-type: disc !important;
    }

    .notice-content td, .notice-content th {
        padding: 5px 10px;
        border: 1px solid #DDD;
    }

    .notice-content p {
        margin: 0 0 10px;
    }

    .notice-content table {
        border-collapse: collapse;
        border-spacing: 0;
        margin-bottom: 10px;
    }

    .read {
        display: flex;
        padding-top: 20px;
        font-size: 16px;
    }

    .reply-part {
        display: flex;
    }

    .is-active {
        color: #409EFF;
        cursor: pointer;
    }
</style>

