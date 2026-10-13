<template>
    <div class="newsRebut">
        <div class="el-row menu-tools">
            <el-button size="medium" @click="$router.back()">返回</el-button>
        </div>
        <div class="main-wrap scrollBar" :style="{'height':nobottommaxH+'px'}">
            <div class="demo-ruleForm">
                <div class="section-title">驳回详情</div>
                <div class="title">{{ detailObject.title }}</div>
                <div class="bar_info_lg" v-for="item in newsRebutDetail" :key="item.id">
                    <div class="bar-div">
                        <span class="blueball"></span>
                        <p class="bar_s_t"><strong>原因：</strong>{{item.rejectReason}}</p>
                    </div>
                    <div class="bar-div">
                        <span class="blueball"></span>
                        <p class="bar_s_t"><strong>驳回 :</strong>{{item.examineUserName}}&nbsp;&nbsp;{{item.rejectDate|filterDate}}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import mixin from '@/mixins/windowResize';
    import {mapGetters} from 'vuex';
    import {getNewsDetailById, getNewsRejectList} from '@/api/news';

    export default {
        data() {
            return {
                newsId: this.$route.query.newsId,
                pageNo: 1,
                pageSize: 30,
                detailObject: {},
                newsRebutDetail: []
            }
        },
        created() {
        },
        mounted() {
            this.getNewsDetailByIdFunc();
        },

        mixins: [mixin],
        computed: {
            ...mapGetters([
                'userInfo'
            ])
        },
        filters: {
            filterDate(date) {
                return date ? date.slice(0, 19) : '';
            }
        },
        methods: {
            getNewsDetailByIdFunc() {
                getNewsDetailById({
                    newsId: this.newsId,
                }).then(res => res.data)
                    .then(data => {
                        if (data.code === 200) {
                            this.detailObject = data.data;
                            this.getNewsRejectListFunc();
                        }
                    })
            },
            getNewsRejectListFunc() {
                getNewsRejectList({
                    newsId: this.newsId,
                    pageNo: this.pageNo,
                    pageSize: this.pageSize
                }).then(res => res.data)
                    .then(data => {
                        if (data.code === 200) {
                            if (data.data && data.data.commonPagination.length !== 0) {
                                this.newsRebutDetail = data.data.commonPagination.dataList;
                            }
                        }
                    })
            },
            jumpTo(path, query = {}) {
                this.$router.push({
                    path,
                    query
                })
            }
        }
    }
</script>
<style lang="scss" scoped>
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

    .el-form-item.is-required .el-form-item__label:before {
        content: "*";
        color: #ff4949;
        margin-right: 4px;
    }
    .section-title{
        line-height: 20px;
        font-size: 16px;
        border-left: 4px solid #409EFF;
        padding-left: 10px;
    }
    .newsRebut {
        padding: 12px;
        color: #333;
        box-sizing: border-box;

        .menu-tools {
            border-bottom: 1px solid #e7eaec;
            padding-bottom: 10px;
            position: relative;

            .HTitle {
                display: block;
                position: absolute;
                left: 50%;
                width: 100px;
                height: 24px;
                font-weight: bold;
                font-size: 18px;
                margin-left: -25px;
                margin-top: -12px;
                top: 50%;
            }
        }

        .main-wrap {
            width: 100%;
            padding-top: 20px;
            padding-bottom: 10px;
            box-sizing: border-box;

            .demo-ruleForm {
                width: 810px;
                box-sizing: border-box;
                margin: 0 auto;

                .title {
                    line-height: 1.2em;
                    font-size: 16px;
                    color: rgb(47, 64, 80);
                    margin: 20px 0;
                    text-indent: 2em;
                }

                .bar_info_lg {
                    width: 80%;
                    margin-bottom: 15px;
                    /* height: 80px; */
                    display: block;
                    border: 1px solid #e0e0e0;
                    line-height: 30px;
                    font-size: 15px;
                    border-radius: 5px;
                    display: inline-block;

                    .bar-div {
                        width: 100%;
                        height: auto;
                        padding: 10px 0;
                        clear: both;
                        margin-bottom: 10px;
                    }

                    .blueball {
                        float: left;
                        width: 10px;
                        height: 10px;
                        border-radius: 20px;
                        margin: 10px 10px 0 25px;
                        line-height: 30px;
                        background-color: #4a87c7;
                    }

                    .bar_s_t {
                        width: 90%;
                        line-height: 30px;
                        font-size: 14px;
                        float: left;
                        margin: 0;
                    }
                }
            }
        }
    }

</style>

