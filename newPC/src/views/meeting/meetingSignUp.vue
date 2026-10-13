<template>
    <div class="meetingDetail">
        <!--    <div class="el-row menu-tools">-->
        <!--      <el-button type="default" size="medium" @click="$router.back()">返回</el-button>-->
        <!--    </div>-->
        <div class="main-wrap scrollBar" :style="{'height':nobottommaxH+'px'}">
            <div class="sign-des">
                本次会议应到<span class="sign-des-num">{{allCountPeople}}</span>人，现已签到<span class="hasSign"><span
                class="sign-des-num" id="signUserTotalCount">{{signUserTotalCount?signUserTotalCount:0}}</span></span>人
                <img class="qrcode-img" v-if="meetDetail.signQrCode" :src="meetDetail.signQrCode"/>
                <img class="qrcode-img" v-if="meetDetail.abcSignQrCode" :src="meetDetail.abcSignQrCode"/>
            </div>
            <div class="sign-list">
                <div class="sign-item" v-for="(signItem,index) in signUserList" :key="index">
                    <div class="sign-photo" :style="{backgroundImage: `url(${signItem.avatar})`}"></div>
                    <div class="sign-name">{{signItem.userName}}</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import mixin from '@/mixins/windowResize';
    import {mapGetters} from 'vuex';
    import {
        getJoinMeetingUserCount,
        getMeetingSignUserData,
        getMeetingInfo
    } from '@/api/metting';

    export default {
        data() {
            return {
                meetingType: this.$route.query.meetingType,
                listQuery: {
                    maxId: 0,
                    meetingId: this.$route.query.id,
                    signDate: ''
                },
                allCountPeople: 0,
                signUserList: [],
                signUserTotalCount: 0,
                timer: null,
                meetDetail: {}
            }
        },
        created() {
        },
        mounted() {
            if (this.meetingType == 1) {
                this.listQuery.signDate = this.$moment(new Date()).format("YYYY-MM-DD");
            } else {
                this.listQuery.signDate = '';
            }
            this.getJoinMeetingUserCountFunc();
            this.timer = setInterval(() => {
                this.getMeetingSignUserDataFunc();
            }, 3000);
            getMeetingInfo({
                meetingId: this.listQuery.meetingId
            })
                .then(res => res.data)
                .then(data => {
                    this.meetDetail = data.data;
                })
        },
        beforeDestroy() {//取消监听事件
            clearInterval(this.timer);
            this.timer = null;
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
            },
            filterDate2(date) {
                return date ? date.slice(0, 16) : '';
            },
            filterDate3(date) {
                return date ? date.slice(0, 10) : '';
            }
        },
        methods: {
            getJoinMeetingUserCountFunc() {
                getJoinMeetingUserCount({
                    meetingId: this.listQuery.meetingId,
                    signDate: this.listQuery.signDate
                }).then(res => res.data)
                    .then(data => {
                        if (data.code === 200) {
                            this.allCountPeople = data.data;
                            this.getMeetingSignUserDataFunc();
                        }
                    })
            },
            jumpTo(path, query = {}) {
                this.$router.push({
                    path,
                    query
                })
            },
            getMeetingSignUserDataFunc() {
                getMeetingSignUserData({
                    signUserShow: JSON.stringify(this.listQuery)
                }).then(res => res.data)
                    .then(data => {
                        if (data.code === 200) {
                            let signUseDate = JSON.parse(data.data);
                            for (let i = 0; i < signUseDate.signUserList.length; i++) {
                                this.signUserList.push(signUseDate.signUserList[i])
                            }
                            ;
                            this.listQuery.maxId = signUseDate.maxId;
                            this.signUserTotalCount = signUseDate.signUserTotalCount;
                        }
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

    .meetingDetail {
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

            .sign-des {
                font-size: 40px;
                height: 100px;
                line-height: 100px;
                border-bottom: 1px solid #eee;
                text-align: center;

                .sign-des-num {
                    font-size: 50px;
                    color: #3cc51f;
                    animation: sign-fade-in 2s;
                    padding-left: 10px;
                    padding-right: 10px;
                    font-weight: bold;
                }

            }

            .sign-list {
                padding: 10px;
            }

            .sign-item {
                animation: sign-fade-in 1s;
                width: 100px;
                height: 150px;
                float: left;
                margin-right: 20px;
                margin-bottom: 20px;
                cursor: pointer;
            }

            .sign-photo {
                width: 100px;
                height: 100px;
                border-radius: 50px;
                background-position: center center;
                background-size: cover;
                margin: 0 auto;
            }

            .sign-name {
                text-align: center;
                margin-top: 5px;
                font-size: 20px;
            }

            @keyframes sign-fade-in {
                from {
                    opacity: 0;
                    transform: scale(0, 0);
                }
                to {
                    opacity: 1;
                    transform: scale(1, 1);
                }
            }
        }
    }
    .qrcode-img {
        width: 150px;
        height: 150px;
        vertical-align: middle;
        position: absolute;
        top: 15px;
    }
    .qrcode-img:nth-of-type(2) {
        right: 180px;
    }
    .qrcode-img:nth-of-type(1) {
        right: 20px;
    }
</style>

