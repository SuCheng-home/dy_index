<!--通知的详情-->
<template>
    <div class="app-container calendar-list-container">
        <backtool>
            <el-button type="primary" size="medium"   @click="jumpToPage('yaxingAddEdit', {id})">编辑</el-button>
            <el-button type="primary" v-if="state == 1" size="medium"   @click="publishHandler">发布</el-button>
        </backtool>
        <div :class="['page-main', isStandalone ? 'page-main--scroller' : '']" :style="{'height':nobottommaxH+'px'}" style="overflow: auto">
            <div class="ibox article" style="width:810px;margin:0 auto;" >
                <div class="ibox-content" style="border-top-width: 0;">
                    <div class="text-center article-title">
                        <h1>{{title}} </h1>
                        <div class="sub-title">
                            {{createTime|trimTime}}
                        </div>
                        <div class="clear"></div>
                    </div>
                    <image-previewer tag="richtext">
                        <div class="notice-content" v-html="content"></div>
                        <div class="notice-img">
                            <img class="img-item" :src="item.url" :key="item.picId" v-for="item in pics"/>
                            <div class="clear"></div>
                        </div>
                    </image-previewer>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import {publishYaxing, getYaxingById} from '@/api/yaxing';
    import Backtool from '@/components/BackTool';
    import ImagePreviewer from '@/components/ImagePreviewer/ImagePreviewer.vue';
    import {mapGetters} from 'vuex';
    import mixin from '@/mixins/windowResize';

    export default {
        components: {
            Backtool,
            ImagePreviewer,
        },
        computed: {
            ...mapGetters(['isStandalone', 'userInfo'])
        },
        data() {
            return {
                id: this.$route.query.id,
                title: '',
                content: '',
                createTime: '',
                state: 1,
            }
        },
        mixins:[mixin],
        filters: {
            trimTime(datetime) {
                return datetime ? datetime.slice(0, datetime.lastIndexOf('.')) : '--';
            }
        },
        created() {
            getYaxingById({
                id: this.id
            })
                .then(res => res.data)
                .then(data => {
                    const pageData = data.data;
                    this.state = pageData.state;
                    this.content = pageData.content;
                    this.title = pageData.title;
                    this.createTime = pageData.createTime;

                })
        },
        methods: {
            jumpToPage (path, query) {
                this.$router.push({
                    path,
                    query
                })
            },
            publishHandler() {
                this.$confirm('确认发布该条目吗？', '删除', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    publishYaxing({
                        id: this.id
                    })
                        .then(res => res.data)
                        .then(data => {
                            if(data.result) {
                                this.$message.success('发布成功');
                                setTimeout(() => {
                                    this.$router.back();
                                }, 1000);
                            } else {
                                this.$message.error(data.msg);
                            }
                        })
                        .catch(error => {
                            this.$message.error(error);
                        })
                });
            }
        }
    }
</script>
<style lang="scss" scoped>
    .article {
        margin: 0 auto;
        font-size: 15px;
        line-height: 26px;
        color: #676A6C;
        word-wrap: break-word;
        word-break: break-all;
    }

    .article h1 {
        font-size: 38px;
        color: #2f4050;
        line-height: 1.1em;
        text-align: center;
        margin-bottom: 10px;
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
        text-align: center;
        color: #606266;
        font-weight: bold;
        margin-bottom: 10px;
        font-size: 15px;
        line-height: 26px;
        word-break: break-all;
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
    .page-main--scroller {
        overflow-y: auto;
        height: 600px;
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
</style>
<style scoped>
    .notice-content a {
        color: #337ab7 !important;
        text-decoration: underline !important;
    }

    .notice-content img {
        display: block;
        max-width: 100%;
    }

    .notice-content ol, .notice-content ul {
        padding-left: 30px;
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

    .read-part {
        display: flex;
        margin-right: 100px;
    }
    .read-part span:first-child {
        margin-right: 100px;
    }
    .reply-part {
        display: flex;
    }

    .is-active {
        color: #337ab7;
        cursor: pointer;
    }
</style>

