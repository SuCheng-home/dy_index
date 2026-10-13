<template>
    <div class="page newsDetail">
        <back-tool>
<!--            <template v-if="state != 1">-->
<!--                <el-button type="primary" @click="jumpToPage('signupStuList', {noticeId})" size="medium">登记列表</el-button>-->
<!--                <el-button type="primary" @click="jumpToPage('queryMeetingList', {noticeId})" size="medium">咨询会签到</el-button>-->
<!--            </template>-->
        </back-tool>
        <div class="main-wrap scrollBar" :style="{'height':nobottommaxH+'px'}">
            <div class="article-container">
                <div class="title">{{ detailData.title }}</div>
                <div class="sub-title">
                    <span>{{ detailData.createUserName }}</span>
                </div>
                <div class="date-range">
                    <span>登记开始时间：{{ detailData.startTime || '不限制'}}&nbsp;&nbsp;&nbsp;&nbsp;登记截止时间：{{ detailData.endTime || '不限制' }}&nbsp;&nbsp;&nbsp;&nbsp;</span>
                    <spna v-if="detailData.beginBirthDate">出生日期限制：{{detailData.beginBirthDate}} ~ {{detailData.endBirthDate}}</spna>
                    <span v-else>出生日期限制：不限制</span>
                </div>
                <image-previewer tag="richtext">
                    <div class="content" v-html="detailData.content">
                    </div>
                </image-previewer>
                <template v-if="state != 1">
                    <div>
                        <div class="section-title">访问地址</div>
                        <div>
                            <div>
                                {{mobileUrl}}
                            </div>
                        </div>
                    </div>
                    <div>
                        <div class="section-title">二维码</div>
                        <div>
                            <div class="qrcode-container">
                                <img :src="qrcodeUrl" />
                            </div>
                        </div>
                    </div>
                </template>


            </div>

        </div>

    </div>
</template>

<script>
    import QRCode from 'qrcode'
    import {getEnrollStuNoticeById} from '@/api/schoolSignupHigh';
    import BackTool from '@/components/BackTool';
    import mixin from '@/mixins/windowResize';
    import {mapGetters} from 'vuex';
    import ImagePreviewer from '@/components/ImagePreviewer/ImagePreviewer.vue';
    import DefaultPage from '@/components/DefaultPage'

    export default {
        data() {
            return {
                noticeId: this.$route.query.noticeId,
                detailData: {},

                files: [{
                    fileId: '',
                    fileUrl: 'http://wxtestpb-10048617.image.myqcloud.com/20180525154811_342.jpg?imageView2/q/100/h/800',
                    fileName: 'cover'
                }],
                mobileUrl: '',
                qrcodeUrl: '',
                state: 0
            }
        },
        created() {
            getEnrollStuNoticeById({
                noticeId: this.noticeId
            })
                .then(res => res.data)
                .then(data => {
                    this.state = data.data.state;
                    this.detailData = data.data;
                    this.files = [{
                        fileId: '',
                        fileUrl: data.logoURL,
                        fileName: 'cover'
                    }];
                    const baseHref = window.location.href.indexOf('www.weixiaojia.net') !== -1 || window.location.href.indexOf('localhost') !== -1 ? 'https://www.weixiaojia.net/mobile/#/' : 'https://m.www.weixiaojia.cn/mobile/#/';

                    QRCode.toDataURL(`${baseHref}schoolSignupHigh/notice?noticeId=${this.noticeId}&schoolId=${this.schoolInfo.id}`)
                        .then(url => {
                            this.qrcodeUrl = url;
                        })
                        .catch(() => {
                        });

                    this.mobileUrl = `${baseHref}schoolSignupHigh/notice?noticeId=${this.noticeId}&schoolId=${this.schoolInfo.id}`;

                })
        },
        computed: {
            ...mapGetters([
                'userInfo',
                'schoolInfo'
            ])
        },
        mixins: [mixin],
        methods: {
            jumpToPage(path, query = {}) {
                this.$router.push({
                    path,
                    query
                })
            },
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
    .date-range {
        text-align: center;
    }
    .section-title {
        border-left: 4px solid #409eff;
        padding-left: 8px;
        margin-bottom: 8px;
    }
    .article-container .content {
        min-height: 310px !important;
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
