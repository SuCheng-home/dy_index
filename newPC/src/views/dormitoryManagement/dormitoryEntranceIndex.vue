<template>
    <div class="entrance_wrap">
        <div class="entrance_list clearfix">
            <div class="entrance_item" v-if="isShowByPermission('/dormManage/dormBuildingList')">
                <a @click="loadNextPage('manage')">
                    <img :src="require('@/assets/images/dorm_manage/dorm_manage.png')">
                    <div>宿舍管理</div>
                </a>
            </div>
            <div class="entrance_item" v-if="isShowByPermission('/dormManage/dormInOutList')">
                <a @click="loadNextPage('entryExitRecords')">
                    <img :src="require('@/assets/images/dorm_manage/entry_exit_records.png')">
                    <div>进出记录</div>
                </a>
            </div>
            <div class="entrance_item" v-if="isShowByPermission('/dormManage/dormList')">
                <a @click="loadNextPage('checkInStatistics')">
                    <img :src="require('@/assets/images/dorm_manage/live_statistics.png')">
                    <div>入住统计</div>
                </a>
            </div>
            <div class="entrance_item" v-if="isShowByPermission('/dormManage/dormWarnSet')">
                <a @click="loadNextPage('retirementWarning')">
                    <img :src="require('@/assets/images/dorm_manage/retire_warn.png')">
                    <div>归寝预警</div>
                </a>
            </div>
            <div class="entrance_item" v-if="isShowByPermission('/dormCheck/dormCheckStaticMan')">
                <a @click="loadNextPage('statisticByWeekOrMonth')">
                    <img src="https://cdnfile-10043692.file.myqcloud.com/productVersion/WXJ/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20260401154933_32_482.png" style="background-color: #ff6161; border-radius: 5px;">
                    <div>宿舍检查</div>
                </a>
            </div>
            
        </div>
    </div>
</template>

<script>
    import {isShowByPermission} from "@/utils";

    export default {
        name: "dormitoryEntranceIndex",
        data() {
            return {
            }
        },
        created() {
        },
        methods: {
            isShowByPermission,
            loadNextPage(pagePath) {
                this.$router.push({path: pagePath});
            }
        }
    }
</script>

<style scoped>
    .clearfix:after {
        content: "";
        display: block;
        font-size: 0;
        height: 0;
        clear: both;
        visibility: hidden;
    }

    .clearfix {
        zoom: 1;
    }
</style>
<style lang="scss" scoped>
    .entrance_wrap{
        .entrance_list{
            padding:12px;
            .entrance_item{
                float: left;
                width: 120px;
                height: 120px;
                a{
                    display: block;
                    width: 100%;
                    height: 100%;
                    overflow: hidden;
                    img{
                        width: 80px;
                        height: 80px;
                        display: block;
                        margin: 10px auto;
                    }
                    div{
                        height: 20px;
                        line-height: 20px;
                        text-align: center;
                        color: #333;
                    }
                }
            }
        }
    }
</style>
