<template>
    <div class="activitySignShow">
        <div class="main-wrap scrollBar" :style="{'height':boxH-110+'px'}">
            <div class="sign-des">
                <!-- 本次会议应到<span class="sign-des-num">{{allCountPeople}}</span>人，-->本次活动现已签到<span class="hasSign"><span
                class="sign-des-num" id="signUserTotalCount">{{signUserTotalCount?signUserTotalCount:0}}</span></span>人
                <img class="qrcode-img" :src="activityDetail.signQrCode"/>
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
    import {signUserShow, getActivityInfo} from '@/api/activity';

    export default {
        data() {
            return {
                activityId: this.$route.query.activityId,
                signTimeId: this.$route.query.signTimeId,
                activityType: this.$route.query.activityType,
                signUserList: [],
                signUserTotalCount: 0,
                timer: null,
                maxId: 0,
                signUserShow: {
                    activityId: 0,
                    activityType: 0,
                    maxId: 0,
                    signTimeId: 0
                },
                activityDetail: {}
            }
        },
        created() {
            if (!this.maxId) {
                this.maxId = 0;
            }
        },
        mounted() {
            getActivityInfo({
                activityId:this.activityId
            })
                .then(res=>res.data)
                .then(data=>{
                    this.activityDetail = data.data;
                });
            this.signUserList = [];
            this.signUserShowFunc();
            this.timer = setInterval(() => {
                this.signUserShowFunc();
            }, 3000);
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
            signUserShowFunc() {
                this.signUserShow.maxId = this.maxId;
                this.signUserShow.activityId = this.activityId;
                this.signUserShow.signTimeId = this.signTimeId;
                this.signUserShow.activityType = this.activityType;
                signUserShow({
                    signUserShow: JSON.stringify(this.signUserShow)
                }).then(res => res.data)
                    .then(data => {
                        if (data.code === 200 && data.data) {
                            const signUserData = JSON.parse(data.data);
                            this.signUserList = [...this.signUserList, ...signUserData.signUserList];
                            this.maxId = signUserData.maxId;
                            this.signUserTotalCount = signUserData.signUserTotalCount;
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

    .activitySignShow {
        padding: 20px;
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
            padding-top: 0px;
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

