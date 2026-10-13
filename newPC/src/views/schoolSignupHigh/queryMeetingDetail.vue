<!--添加通知-->
<template>
    <div class="app-container calendar-list-container" id="noticeAdd">
        <backtool>
            <el-button type="primary" size="medium" @click.native="print()" v-if="state != 1">打印二维码
            </el-button>
        </backtool>
        <div :class="['page-main']" :style="{'height':nobottommaxH+'px'}"
             style="overflow: auto">
            <div style="width: 810px;padding-top:20px;margin: 0 auto;">
                <el-form :model="ruleForm" ref="ruleForm" label-width="140px" class="demo-ruleForm">
                    <el-form-item label="活动名称" prop="activityName">
                        {{ruleForm.activityName}}
                    </el-form-item>
                    <el-form-item label="签到开始时间" prop="addressData">
                        {{ruleForm.signSTime | trimTime}}
                    </el-form-item>
                    <el-form-item label="签到结束时间">
                        {{ruleForm.signETime | trimTime}}
                    </el-form-item>
                    <el-form-item label="访问二维码" v-if="state != 1">
                        {{url}}
                        <div class="qrcode-container" ref="print">
                            <img :src="qrcodeUrl" />
                        </div>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
    import QRCode from 'qrcode';
    import {mapGetters} from 'vuex';

    import Backtool from '@/components/BackTool';
    import {getEnrollNoticeActivityById} from '@/api/schoolSignupHigh';
    import mixin from '@/mixins/windowResize';

    export default {
        components: {
            Backtool,
        },
        filters: {
            trimTime(datetime) {
                return datetime ? datetime.slice(0, datetime.lastIndexOf(':')) : '--';
            }
        },
        computed: {
            ...mapGetters(['schoolInfo'])
        },
        data() {

            return {
                noticeId: this.$route.query.noticeId,
                id: this.$route.query.id,
                qrcodeUrl: '',

                ruleForm: {
                    signETime: '',
                    signSTime: '',
                    activityName: '',
                    state: 1,
                },
                state: 0,
                url: ''

            };
        },
        mixins: [mixin],
        created() {
            const baseHref = window.location.href.indexOf('www.weixiaojia.net') !== -1 || window.location.href.indexOf('localhost') !== -1 ? 'https://www.weixiaojia.net/mobile/#/' : 'https://m.www.weixiaojia.cn/mobile/#/';
            this.url = `${baseHref}schoolSignupHigh/queryMeeting?noticeId=${this.noticeId}&schoolId=${this.schoolInfo.id}&activityId=${this.id}`
            QRCode.toDataURL(`${baseHref}schoolSignupHigh/queryMeeting?noticeId=${this.noticeId}&schoolId=${this.schoolInfo.id}&activityId=${this.id}`)
                .then(url => {
                    this.qrcodeUrl = url;
                })
                .catch(() => {
                });
            getEnrollNoticeActivityById({
                id: this.id
            })
                .then(res => res.data)
                .then(data => {
                    this.state = data.data.state;
                    this.ruleForm = data.data;
                })
        },
        methods: {
            print() {
                this.$print(this.$refs.print)
            },
        }
    }
</script>
<style scoped>
    .el-message-box__message {
        max-height: 720px;
        overflow: hidden auto;
    }
</style>
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
