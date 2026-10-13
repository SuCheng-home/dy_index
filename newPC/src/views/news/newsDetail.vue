<template>
    <div class="page newsDetail">
        <back-tool>
            <el-button v-if="dataObj.state==1||dataObj.state==3" type="primary" size="medium"
                       @click="jumpToPage('newsEdit',{newsId:newsId})">编辑
            </el-button>
            <el-button v-if="dataObj.state==2&&(userInfo.name.indexOf(dataObj.createUser)!==-1)" type="primary"
                       size="medium"
                       @click="revokeHandler(dataObj.id)">撤回审批
            </el-button>
            <el-button v-if="dataObj.state === 1" size="medium" type="primary" @click="updateNewsHandler"
                       :loading="isLoading">提交审核
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
                    <span v-else-if="dataObj.createUser">{{ dataObj.createUser }}</span>
                    <span>
                        {{(!dataObj.releaseDate?"":dataObj.releaseDate)| trimTime}}
                    </span>
                </div>
                <image-previewer tag="richtext">
                    <div class="content" v-html="dataObj.content">
                    </div>
                </image-previewer>

            </div>
        </div>
    </div>
</template>

<script>
    import $ from 'jquery';

    import {getNewsDetailById, getNewsRejectList, updateNewsById, revoke} from '@/api/news';
    import {getVodInfo} from '@/api/common/common';
    import BackTool from '@/components/BackTool';
    import mixin from '@/mixins/windowResize';
    import {mapGetters} from 'vuex';
    import ImagePreviewer from '@/components/ImagePreviewer/ImagePreviewer.vue';
    import DefaultPage from '@/components/DefaultPage'

    export default {
        data() {
            return {
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
                    id: '',
                    isDelete: 1
                },
                newsId: this.$route.query.newsId,
                isLoading: false,
                rejectList: []
            }
        },
        created() {
            getNewsDetailById({
                newsId: this.newsId
            }).then(res => {
                const data = res.data;
                if (data.result) {
                    if (data.data.content) {
                        // data.data.content = data.data.content.replace(/url\(['"](.*?)['"]\)/g, 'url(&quot;$1&quot;)');
                    }
                    this.dataObj = data.data;
                    if (this.dataObj.isDelete === 1) {
                        getNewsRejectList({
                            newsId: this.newsId,
                            pageSize: 20,
                            pageNo: 1
                        }).then(res => {
                            const data = res.data;
                            if (data.result) {
                                this.rejectList = data.data.commonPagination.dataList;
                            }
                        })
                    }
                    setTimeout(() => {
                        const $audios = $('audio');
                        $audios.each(function (index, audio) {
                            const $audio = $(audio);
                            const src = $audio.prop('src');
                            if (src.indexOf('myqcloud') !== -1) {
                                const audioName = $audio.prop('src').slice($audio.prop('src').lastIndexOf('/') + 1);
                                const $namePart = $(`<div>${window.decodeURI(audioName)}</div>`);
                                $audio.before($namePart).add($namePart).wrapAll('<div class="audio-container"></div>');
                            }
                        });
                        const $videos = $('video');
                        $videos.each(function (index, video) {
                            const $video = $(video);
                            if ($video.prop('src').indexOf('myqcloud') !== -1) {
                                const matched = $video.prop('class').match(/\sid-(\d+)\s/);
                                if (matched && matched[1]) {
                                    const fileId = matched[1];
                                    if (!!fileId) {
                                        getVodInfo({
                                            fileId
                                        })
                                            .then(res => res.data)
                                            .then(data => {
                                                if (data.result) {
                                                    const pageData = JSON.parse(data.data);
                                                    $video.prop('poster', pageData.basicInfo.coverUrl);
                                                }
                                            });
                                    }
                                }
                            }

                        });
                    }, 200);
                }
            })
                .catch(() => {
                })
        },
        computed: {
            ...mapGetters([
                'userInfo'
            ])
        },
        mixins: [mixin],
        methods: {
            revokeHandler(id) {
                // revoke()
                this.$confirm('是否确定要撤回该新闻审批', '撤回审批', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    revoke({
                        newsId: id
                    })
                        .then((res) => {
                            const data = res.data;
                            if (data.result) {
                                this.$message({
                                    message: '撤回审批成功',
                                    type: 'success'
                                });
                                setTimeout(() => {
                                    this.$router.push({path: 'newsIndex'});
                                }, 300);
                            } else {
                                this.$message({
                                    message: `${data.msg}`,
                                    type: 'error'
                                });
                            }
                        })
                        .catch(() => {
                            this.$message({
                                message: `${data.msg}`,
                                type: 'error'
                            });
                        });
                }).catch(() => {
                });
            },
            jumpToPage(path, query = {}) {
                this.$router.push({
                    path,
                    query
                })
            },
            updateNewsHandler() {
                this.isLoading = true;
                updateNewsById({
                    id: this.dataObj.id,
                    state: 2,
                    optType: 3
                })
                    .then(res => {
                        const data = res.data;
                        this.isLoading = false;
                        if (data.result) {
                            this.$message({
                                message: '提交审核成功',
                                type: 'success'
                            });
                            setTimeout(() => {
                                this.$router.push({path: 'newsIndex'});
                            }, 500);
                        }
                    })
                    .catch(() => {
                        this.isLoading = false;
                        this.$message.error('error');
                    })
            },
            jumpToEditHanlder() {
                this.$router.push({
                    path: 'newsEdit',
                    query: {
                        newsId: this.newsId
                    }
                });
            }
        },
        filters: {
            trimTime(datetime) {
                return datetime ? datetime.slice(0, datetime.lastIndexOf('.')) : '';
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

    @include articleDetailPageStyles;
    @include globalstyle();
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

    .clearfix:after {
        content: "";
        height: 0;
        display: block;
        clear: both;
        visibility: hidden;
    }

    .page.newsDetail {
        padding: 12px;
        .meta-info {
            font-size: 13px;
            text-align: right;

            span {
                margin-left: 10px;
            }
        }


        .reject-container li {
            margin-bottom: 5px;
            border-bottom: 1px solid #e7eaec;
            padding: 10px 0;

            .reject-info {
                font-size: 13px;
                text-align: right
            }
        }
    }

</style>
<style lang="scss">
    .newsDetail {
        .audio-container {
            background-color: #F1F3F4;
            padding: 5px 5px 0 5px;
            margin: 10px 0;
        }
    }
</style>
