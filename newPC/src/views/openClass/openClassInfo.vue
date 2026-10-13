<template>
    <div class="open_class_info_wrap">
        <div class="header">
            <el-button size="medium" @click="goBack">返回</el-button>
            <el-button size="medium" type="primary" @click="toSignPage"
                       v-if="openClassInfo.state === 4 && (isThGroupLeader || (curUserId === openClassInfo.createUserId) || isInTeacherName(openClassInfo.teacherName))">
                预约及签到信息
            </el-button>
            <el-button size="medium" type="primary" @click="certificateView()"
                       v-if="openClassInfo.subjectTheme&&num==1&&timefun(openClassInfo.listenDate)">查看证书
            </el-button>
        </div>
        <div class="open_class_info_box" :style="`height:${nobottommaxH}px`">
            <div class="info-container">
                <div class="title">
                    公开课详情
                </div>
                <div class="row">
                    <div class="label">
                        时间
                    </div>
                    <div class="value">
                        {{openClassInfo.listenDate}}&nbsp;{{openClassInfo.listenWeek}}&nbsp;{{openClassInfo.classNoName}}
                    </div>
                </div>
                <div class="row">
                    <div class="label">
                        班级
                    </div>
                    <div class="value">
                        {{openClassInfo.className?openClassInfo.className:"无"}}
                    </div>
                </div>
                <div class="row">
                    <div class="label">
                        主讲人
                    </div>
                    <div class="value">
                        {{openClassInfo.teacherName}}
                    </div>
                </div>
                <div class="row">
                    <div class="label">
                        学科
                    </div>
                    <div class="value">
                        {{openClassInfo.subjectName}}
                    </div>
                </div>
                <div class="row" v-if="openClassInfo.subjectTheme">
                    <div class="label">
                        课题
                    </div>
                    <div class="value">
                        {{openClassInfo.subjectTheme}}
                    </div>
                </div>

                <div class="row">
                    <div class="label">
                        地点
                    </div>
                    <div class="value">
                        {{openClassInfo.place}}
                    </div>
                </div>
                <div class="row">
                    <div class="label">
                        级别
                    </div>
                    <div class="value">
                        {{openClassInfo.levelName}}
                    </div>
                </div>
                <div class="row">
                    <div class="label">
                        公开课类型
                    </div>
                    <div class="value">
                        {{openClassInfo.openClassType}}
                    </div>
                </div>
               <div class="row" v-if="openClassInfo.modality">
                    <div class="label">
                        形式
                    </div>
                    <div class="value">
                        {{openClassInfo.modality}}
                    </div>
                </div>
                <div class="row" v-if="openClassInfo.participant">
                    <div class="label">
                        参加对象
                    </div>
                    <div class="value">
                        {{openClassInfo.participant}}
                    </div>
                </div>
                <div class="row" v-if="openClassInfo.supervisoryLeader">
                    <div class="label">
                        督查领导
                    </div>
                    <div class="value">
                        {{openClassInfo.supervisoryLeader}}
                    </div>
                </div>               
                <div class="row" v-if="openClassInfo.applyRemark">
                    <div class="label">
                        备注
                    </div>
                    <div class="value">
                        {{openClassInfo.applyRemark}}
                    </div>
                </div>
                <div class="row"
                     v-if="openClassInfo.qRcode && openClassInfo.state === 4 && (isThGroupLeader || (curUserId === openClassInfo.createUserId) || isInTeacherName(openClassInfo.teacherName))">
                    <div class="label">
                        签到二维码
                    </div>
                    <div class="value">
                        <img :src="openClassInfo.qRcode" class="qr_img image--border" alt="">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import mixins from '@/mixins/windowResize';
    import {registerDetail, getUsersByConstantId} from "@/api/teachingStudy/openClass";

    export default {
        name: 'openClassInfo',
        data() {
            return {
                openClassId: this.$route.query.id,
                num: this.$route.query.num,
                openClassInfo: {},
                isThGroupLeader: false,
                curUserId: this.$store.getters.userInfo.id,
                curUserName: this.$store.getters.userInfo.name
            }
        },
        created() {
            this.getUsersByConstantId();
            this.registerDetail();
        },
        mixins: [mixins],
        methods: {
            goBack() {
                this.$router.back()
            },
            timefun(time){
                    let currentTime = new Date(); // 获取当前时间
                    let inputTime = new Date(time+' 23:59:59'); // 将传入的时间转换为Date对象                
                    if (currentTime > inputTime) {
                      return true;
                    } else if (currentTime < inputTime) {
                       return false;
                    } else {
                       return false;
                    }
            },
            toSignPage() {
                this.$router.push({path: 'signList', query: {id: this.openClassId, isSchoolOpenClass: this.$route.query.isSchoolOpenClass}})
            },
            certificateView() {
                this.$router.push({path: 'certificateView', query: {id: this.openClassId}})
            },
            isInTeacherName(teacherNameStr) {
                return teacherNameStr.indexOf(this.curUserName) > -1;
            },
            // 教务处
            getUsersByConstantId() {
                getUsersByConstantId('7').then(res => {
                    const data = res.data.data;
                    if (res.data.code === 200 && data.map(item => item.id).indexOf(this.curUserId) > -1) {
                        this.isThGroupLeader = true;
                    }
                }).catch();
            },
            registerDetail() {
                registerDetail(this.openClassId).then(res => res.data).then(data => {
                    if (data.code === 200) {
                        this.openClassInfo = data.data;
                    }
                });
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../../src/styles/mixin.scss";

    @include formDetailPageStyles;
    .open_class_info_wrap {
        padding:12px;

        .header {
            padding-bottom: 10px;
            margin-bottom: 10px;
            font-size: 14px;
            border-bottom: 1px solid #eee;
        }

        .open_class_info_box {
            overflow-x: hidden;
            overflow-y: auto;
            @include scrollBar;

            .open_class_info_list {
                width: 810px;
                margin: 0 auto;
                color: #333;

                .qr_img {
                    width: 200px;
                    height: 200px;
                }
            }
        }
    }
</style>
