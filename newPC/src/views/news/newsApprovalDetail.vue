<template>
    <div class="page newsApprovalDetail">
        <back-tool>
            <el-button v-if="dataObj.state === 2" size="medium" type="primary" @click="jumpToEditHanlder">编辑</el-button>
            <el-button v-if="dataObj.state === 4" size="medium" type="primary" @click="jumpToReleaseEditHanlder">编辑
            </el-button>
            <el-button v-if="dataObj.state === 2" size="medium" type="primary" :loading="releaseLoading"
                       @click="releaseHandler">发布
            </el-button>
            <el-button v-if="dataObj.state === 2" size="medium" type="primary" :loading="rejectLoading"
                       @click="rejectHandler">驳回
            </el-button>
            <el-button v-if="rejectList&&rejectList.length!==0" type="primary" size="medium"
                       @click="jumpToPage('newsRebut',{newsId:newsId})">驳回原因
            </el-button>
        </back-tool>
        <div class="main-wrap scrollBar" :style="{'height':nobottommaxH+'px'}">
            <div class="article-container">
                <div class="title">{{ dataObj.title }}</div>
                <div class="sub-title">
                    <span v-if="dataObj.inscribe === 1">{{ dataObj.departName }}</span>
                    <span v-else>{{ dataObj.createUser }}</span>
                    <span>{{ dataObj.createTime | trimTime }}</span>
                </div>
                <image-previewer tag="richtext">
                    <div class="content" v-html="dataObj.content">
                    </div>
                </image-previewer>
            </div>
        </div>
        <el-dialog title="驳回" :visible.sync="isShowRejectDialog" @close="dialogCloseHandler">
            <div>
                <el-input
                    type="textarea"
                    :rows="3"
                    placeholder="请输入驳回原因"
                    v-model="rejectReason"
                    :maxlength="50"
                >
                </el-input>
                <div class="reject-button-container">
                    <el-button type="primary" @click="confirmClickHandler">确定</el-button>
                    <el-button type="default" @click="cancelClickHandler">取消</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import $ from 'jquery';

    import {getNewsDetailById, getNewsRejectList, updatePubOrReject} from '@/api/news';
    import {getVodInfo} from '@/api/common/common';
    import BackTool from '@/components/BackTool';
    import mixin from '@/mixins/windowResize';
    import ImagePreviewer from '@/components/ImagePreviewer/ImagePreviewer.vue';
    import DefaultPage from '@/components/DefaultPage';

    export default {
        data: function () {
            return {
                newsId: this.$route.query.newsId,
                dataObj: {
                    commentCount: 0,
                    content: '',
                    createTime: '',
                    updatetTime: '',
                    createUser: '',
                    updateUser: '',
                    departName: '',
                    inscribe: null,
                    showRejectBut: null,
                    state: null,
                    title: '',
                    viewCount: '',
                    isDelete: 1
                },
                isShowRejectDialog: false,
                releaseLoading: false,
                rejectLoading: false,
                rejectReason: '',
                rejectList: []
            }
        },
        mixins: [mixin],
        methods: {
            jumpToPage(path, query = {}) {
                this.$router.push({
                    path,
                    query
                })
            },
            dialogCloseHandler() {
                this.rejectReason = '';
            },
            rejectHandler() {
                this.isShowRejectDialog = true;
            },
            cancelClickHandler() {
                this.isShowRejectDialog = false;
            },
            confirmClickHandler() {
                this.rejectLoading = true;
                updatePubOrReject({
                    newsId: this.newsId,
                    optType: 2,
                    rejectReason: this.rejectReason
                })
                    .then((res) => {
                        this.rejectLoading = false;
                        const data = res.data;
                        if (data.result) {
                            this.$message.success('已驳回此新闻！');
                            this.isShowRejectDialog = true;
                            window.history.back();
                        } else {
                            this.$message.error(data.msg);
                        }
                    })
                    .catch(() => {
                        this.rejectLoading = false;
                        this.isShowRejectDialog = true;
                    });
            },
            releaseHandler() {
                this.releaseLoading = true;
                updatePubOrReject({
                    newsId: this.newsId,
                    optType: 1
                })
                    .then((res) => {
                        const data = res.data;
                        this.releaseLoading = false;
                        if (data.result) {
                            this.$message.success('发布成功');
                            this.$router.push('newsApprovalList');
                        }
                    })
                    .catch(() => {
                        this.releaseLoading = false;
                    })
            },
            jumpToEditHanlder() {
                this.$router.push({
                    path: 'newsApprovalEdit',
                    query: {
                        newsId: this.newsId
                    }
                });
            },
            jumpToReleaseEditHanlder() {
                this.$router.push({
                    path: 'newsApprovalPubEdit',
                    query: {
                        newsId: this.newsId
                    }
                });
            }

        },
        created() {
            getNewsDetailById({
                newsId: this.newsId,
            })
                .then(res => {
                    const data = res.data;
                    if (data.result) {
                        if (data.data.content) {
                            // data.data.content = data.data.content.replace(/url\(['"](.*?)['"]\)/g, 'url(&quot;$1&quot;)');
                        }
                        this.dataObj = data.data;
                        if (this.dataObj.isDelete === 1) {
                            getNewsRejectList({
                                newsId: this.newsId,
                                pageSize: 30,
                                pageNo: 1
                            }).then(res => {
                                const data = res.data;
                                if (data.result) {
                                    this.rejectList = data.data.commonPagination.dataList;
                                } else {
                                    this.$message.error('error');
                                }
                            })
                        }
                        setTimeout(() => {
                            const $audios = $('audio');
                            $audios.each(function (index, audio) {
                                const $audio = $(audio);
                                const src = $audio.prop('src');
                                if(src.indexOf('myqcloud') !== -1) {
                                    const audioName = $audio.prop('src').slice($audio.prop('src').lastIndexOf('/') + 1);
                                    const $namePart = $(`<div>${window.decodeURI(audioName)}</div>`);
                                    $audio.before($namePart).add($namePart).wrapAll('<div class="audio-container"></div>');
                                }
                            });
                            const $videos = $('video');
                            $videos.each(function(index, video) {
                                const $video = $(video);
                                if($video.prop('src').indexOf('myqcloud') !== -1) {
                                    const matched = $video.prop('class').match(/\sid-(\d+)\s/);
                                    if(matched && matched[1]) {
                                        const fileId = matched[1];
                                        if(!!fileId) {
                                            getVodInfo({
                                                fileId
                                            })
                                                .then(res => res.data)
                                                .then(data => {
                                                    if(data.result) {
                                                        const pageData = JSON.parse(data.data);
                                                        $video.prop('poster', pageData.basicInfo.coverUrl);
                                                    }
                                                });
                                        }
                                    }
                                }

                            });
                        }, 200);
                    } else {
                        this.$message.error('error');
                    }
                })
        },
        filters: {
            trimTime(datetime) {
                return datetime.slice(0, datetime.lastIndexOf('.'));
            },
        },
        components: {
            BackTool,
            ImagePreviewer,
            DefaultPage
        }
    }
</script>

<style lang="scss">
    @import '../../styles/mixin.scss';

    @include globalstyle();
    @include articleDetailPageStyles;
    .newsApprovalDetail.page {
        padding:12px;

        .reject-container li {
            margin-bottom: 5px;
            border-bottom: 1px solid #e7eaec;
            padding: 10px 0;

            .reject-info {
                font-size: 13px;
                text-align: right
            }
        }

        textarea.reject-reason {
            width: 100%;
            height: 100px;
        }

        .reject-button-container {
            margin-top: 10px;
            text-align: right;
        }
    }


</style>
<style lang="scss">
    .content-container ol, .content-container ul {
        padding-left: 30px;
    }

    .content-container td, .content-container th {
        padding: 5px 10px;
        border: 1px solid #DDD;
    }

    .content-container p {
        margin: 0 0 10px;
    }

    .content-container img {
        display: block;
        max-width: 100%;
        height: auto;
    }

    .newsApprovalDetail {
        .audio-container {
            background-color: #F1F3F4;
            padding: 5px 5px 0 5px;
            margin: 10px 0;
        }
    }
</style>
