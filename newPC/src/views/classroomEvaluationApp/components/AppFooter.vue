<template>
    <div>
        <div class="tab-container">
            <div class="tab-inner-container">
                <template v-if="isAfter">
                    <span @click="jumpToPage('afterStudentNoEvaluate', routeQueryArgs)" :class="{active: active == 'afterStudentNoEvaluate'}">学号</span>
                    <span @click="jumpToPage('afterScoreItemEvaluate', routeQueryArgs)" :class="{active: active == 'afterScoreItemEvaluate'}">评分项</span>
                </template>
                <template v-else>
                    <span @click="jumpToPage('studentEvaluate', routeQueryArgs)" :class="{active: active == 'studentEvaluate'}">学生</span>
                    <span @click="jumpToPage('studentNoEvaluate', routeQueryArgs)" :class="{active: active == 'studentNoEvaluate'}">学号</span>
                    <span @click="jumpToPage('scoreItemEvaluate', routeQueryArgs)" :class="{active: active == 'scoreItemEvaluate'}">评分项</span>
                    <!--                <span>分组</span>-->
                    <span @click="jumpToPage('summary', routeQueryArgs)" :class="{active: active == 'summary'}">汇总</span>
                    <span @click="jumpToPage('attendance', routeQueryArgs)" :class="{active: active == 'attendance'}">考勤</span>
                </template>

            </div>
        </div>
        <div class="logout-link" @click="logout">
            <img src="https://cdnfile-10043692.file.myqcloud.com/admin/images/class/exit.png">
            下课
        </div>
        <div class="tool_btn"><span @click="jumpToPage('classList')"><i class="fa fa-chevron-left"></i>返回</span></div>
    </div>
</template>

<script>
    export default {
        name: "AppFooter",
        props: {
            active: {
                type: String,
                required: true
            },
            routeQueryArgs: {
                type: Object,
                required: true
            },
            isAfter: {
                type: Boolean,
                default: false
            }
        },
        methods: {
            jumpToPage(path, query = {}) {
                this.$router.push({
                    path,
                    query
                })
            },
            logout() {
                this.$store.dispatch("LogOut").then(() => {
                    this.$router.push('login')
                });
            },
        }
    }
</script>

<style lang="scss" scoped>
    .tab-container {
        background-color: #fff;
        border-top: 1px solid #ccc;
        z-index: 2500;
        line-height: 0;
        text-align: center;
        padding: 5px 0;
        position: fixed;
        bottom: 41px;
        width: 100%;
    }
    .tab-inner-container {
        display: inline-block;
        border: 1px solid #ccc;
        border-radius: 20px;
        overflow: hidden;
    }
    .tab-container span.active {
        background-color: #0099E8;
        color: #fff;
    }
    .tab-container span {
        display: inline-block;
        width: 60px;
        height: 20px;
        font-size: 14px;
        line-height: 20px;
        border-right: 1px solid white;
        cursor: pointer;
    }
    .logout-link {
        position: fixed;
        right: 66px;
        bottom: 45px;
        color: #00AAEE;
        border-radius: 5px;
        font-size: 14px;
        z-index: 3000;
    }
    .tool_btn {
        position: fixed;
        margin: 5px 0 0 20px;
        color: #0099E8;
        bottom: 49px;
        z-index: 3000;
        font-size: 14px;
    }
    .logout-link img {
        width: 24px;
        height: 24px;
        vertical-align: middle;
    }
    .tool_btn i {
        margin-right: 10px;
        vertical-align: middle;
    }
</style>
