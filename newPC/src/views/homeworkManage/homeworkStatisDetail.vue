<!--通知的详情-->
<template>
    <div v-if="homework.isDelete === 1" class="app-container calendar-list-container homeworkDetail">
        <backtool>
        </backtool>
        <div :style="'height:'+nobottommaxH+'px;overflow: auto;'">
            <div class="ibox article" style="width:810px;margin:0 auto;'">
                <div class="ibox-content" style="border-top-width: 0;">
                    <div class="text-center article-title">
                        <h1>{{homework.title}}作业 </h1>
                        <div class="pull-right">
                            发布人:{{homework.createUser}}
                            <span
                                v-if="homework.releaseDateTime!=null">发布时间:{{homework.releaseDateTime | formatTime}}</span>
                            <span v-if="homework.releaseDateTime==null">创建时间:{{homework.createTime | formatTime}}</span>

                        </div>
                        <div class="clear"></div>
                    </div>
                    <div>
                        <image-previewer tag="richtext" v-if="homework.homeworkType === 0">
                            <div v-html="homework.content"></div>
                        </image-previewer>
                        <div v-if="homework.homeworkType === 1">
                            <image-previewer tag="richtext">
                                <div v-html="homework.content"></div>
                            </image-previewer>

                        </div>
                        <div class="row" v-if="!!homework.files && homework.files.length !== 0">
                            <div class="col-lg-12">
                                <h2>附件：</h2>
                                <div class="social-feed-box">
                                    <file-list :fileList="homework.files"></file-list>
                                </div>
                            </div>
                        </div>
                        <div class="row" v-if="!!homework.pics && homework.pics.length !== 0">
                            <div class="col-lg-12">
                                <h2>图片：</h2>
                                <div class="social-feed-box">
                                    <image-previewer tag="richtext">
                                        <div style="margin-top:20px">
                                            <img style="width: 100px!important;height: 100px;margin-right: 10px;"
                                                 v-for="picItem in homework.pics" :src="picItem.maxPic"
                                                 :key="picItem.id">
                                        </div>
                                    </image-previewer>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div class="col-lg-12" v-if="homework.homeworkState != 1">
                            <div>
                         <span class="list-link--finish">
                                <router-link
                                    v-if="Number.parseInt(homework.readCount) !== 0"
                                    :to="{path: 'homeworkManageReplyList', query: {type:0, homeworkId: this.$route.query.id}}">
                                    已读人数：{{ homework.readCount }}
                                </router-link>
                                <span v-else>已读人数：{{ homework.readCount }}</span>
                            </span>
                                <span class="list-link--unfinish">
                                <router-link
                                    v-if="Number.parseInt(homework.unReadCount) !== 0"
                                    :to="{path: 'homeworkManageReplyList', query: {type:2, homeworkId: this.$route.query.id}}">
                                    未读人数：{{ homework.unReadCount }}
                                </router-link>
                                <span v-else>未读人数：{{ homework.unReadCount }}</span>
                            </span>
                                <span class="list-link--finish">
                                <router-link
                                    :to="{path: 'homeworkManageReplyList', query: {type:1, homeworkId: this.$route.query.id,statis:1}}">
                                    回复：{{ homework.replyCount }}
                                </router-link>
                            </span>
                                <span class="list-link--finish"
                                      v-if="homework.homeworkState===2 && homework.isTurn === 1">
                                <a
                                    v-if="Number.parseInt(homework.finishCount) !== 0"
                                    href="javascript:;" @click="homeworkFinishHandle(homework,1)"
                                    >
                                    已完成人数：{{ homework.finishCount }}
                                </a>
                                <span v-else>已完成人数：{{ homework.finishCount }}</span>
                            </span>
                                <span class="list-link--unfinish"
                                      v-if="homework.homeworkState===2 && homework.isTurn === 1">
                                <a
                                    v-if="Number.parseInt(homework.unfinishCount) !== 0"
                                    href="javascript:;" @click="homeworkFinishHandle(homework,0)"
                                    >
                                    未完成人数：{{ homework.unfinishCount }}
                                </a>
                                <!-- <router-link
                                    
                                    :to="{path: 'homeworkManageFinishList', query: {type: 0, homeworkId: this.$route.query.id}}">
                                    未完成人数：{{ homework.unfinishCount }}
                                </router-link> -->
                                <span v-else>未完成人数：{{ homework.unfinishCount }}</span>
                            </span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

        </div>

    </div>
    <div v-else class="app-container calendar-list-container homeworkDetail">
        <backtool>
        </backtool>
        <default-page Mes="新闻已被删除！"></default-page>
    </div>
</template>
<script>
    import {getHomeworkById, updateAndPubHomework} from '@/api/homework';
    import Backtool from '@/components/BackTool';
    import ImagePreviewer from '@/components/ImagePreviewer/ImagePreviewer.vue';
    import FileList from '@/components/FileList/FileList.vue';

    import mixin from '@/mixins/windowResize';
    import DefaultPage from '@/components/DefaultPage';

    const recipeTypeMap = {
        1: "公共",
        2: "教师",
        3: "学生"
    };
    export default {
        data() {
            return {
                homework: {
                    isDelete: 1,
                    files: []
                },
                isShowBtnLoading: false,
                sendClass: []
            }
        },
        filters: {
            statusFilter(type) {
                return recipeTypeMap[type]
            },
            formatTime(type) {
                return !!type ? type.substring(0, 10) : "暂未发布";
            }
        },
        components: {
            ImagePreviewer,
            Backtool,
            DefaultPage,
            FileList
        },
        mixins: [mixin],
        created() {
            getHomeworkById({
                homeworkId: this.$route.query.id
            },sessionStorage.getItem("homeworkschoolTimeId"))
                .then(res => res.data)
                .then(data => {
                    data.data.content = data.data.content.replace(/url\(['"](.*?)['"]\)/g, 'url(&quot;$1&quot;)');
                    this.homework = data.data;
                    this.homework.files.forEach(fileItem => {
                        fileItem.fileName = fileItem.fileName ? fileItem.fileName : fileItem.originalFileName;
                    });
                    this.sendClass = data.data.departs.map(departItem => {
                        return departItem.name
                    })
                })

        },
        methods: {
            homeworkFinishHandle(homework,type){
                if(homework.publishType===0&&homework.walkClassIds.length==0&&homework.departs&&homework.departs.length!==1){
                    this.$router.push({
                        path:'homeworkClassList',
                        query:{
                            type: type, 
                            homeworkId: this.$route.query.id,
                            statis:1
                        }
                    })
                }else{
                    this.$router.push({
                        path:'homeworkManageFinishList',
                        query:{
                            type: type, 
                            homeworkId: this.$route.query.id,
                            statis:1
                        }
                    })
                }
            },
            updateAndPubHomeworkHandler() {
                this.isShowBtnLoading = true;
                updateAndPubHomework(this.$route.query.id,sessionStorage.getItem("homeworkschoolTimeId"))
                    .then(res => {
                        this.isShowBtnLoading = false;
                        if (res.data.code === 200) {
                            this.$message({
                                type: 'success',
                                message: '发布成功!'
                            });
                            this.$router.back();
                        }
                    })

            },
        }
    }
</script>
<style lang="scss">
    @import "../../styles/mixin";

    .homeworkDetail {
        .article {
            @include richtext;
            font-family: "宋体", serif !important;
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
            text-align: center;
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

        .article p {
            font-size: 15px;
            line-height: 26px;
            color: #676A6C;
            word-wrap: break-word;
            word-break: break-all;
        }

        .article img {
            width: 100%;
        }

        .article table {
            width: 100%;
        }

        .article table td {
            border: 1px solid black;
        }

        .pull-right {
            float: right;
            font-size: 13px;
            color: #676A6C;
            padding-right: 60px;
        }

        .hasread-small {
            border: 1px solid #e7eaec;
            padding: 2px;
            border-radius: 2px;
            display: inline-block;
            padding-right: 4px;
        }

        .notice-content {
            min-height: 250px;
        }

        .clear {
            clear: both;
        }

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
            border: 1px solid #e7eaec;
            margin-left: 4px;
            margin-top: 4px;
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
            padding: 0px 10px 20px 10px;
        }


        .image {
            max-width: 50% !important;
        }

        .video {
            max-width: 50% !important;
        }

        .el-form-item__content {
            line-height: inherit !important;
        }


        .list-link--finish a, .list-link--finish span {
            color: #337AB7 !important;
            margin-right: 20px;
        }

        .list-link--unfinish a, .list-link--unfinish span {
            color: #EF4F4F !important;
            margin-right: 20px;
        }
    }

</style>

