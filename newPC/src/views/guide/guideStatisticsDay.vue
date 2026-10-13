<template>
    <div class="guide_day_wrap" style="padding:10px">
        <div class="guide_content_box">
            <div class="time_header">
                <!-- <el-button @click="$router.back()" type="default" size="medium">返回</el-button> -->
                <el-date-picker v-model="searchDay" type="date" placeholder="选择日期" :clearable="false" size="medium"
                                :picker-options="pickerOptions" @change="getGuideStaticsDataByDay"></el-date-picker>
            </div>
            <div class="guide_statistics_box" :style="`height: ${maxH}px;`">
                <div class="guide_group_list clearfix">
                    <div class="guide_group_item" :key="index" v-for="(item, index) in guideGroupList">
                        <div class="header_item_line">
                            <div class="header_item_title">
                                <i class="el-icon-s-home"></i>{{item.guideName}}
                            </div>
                            <div class="header_item_name" :title="item.guideUserName">
                                <i class="el-icon-user-solid"></i>{{item.guideUserName}}
                            </div>
                        </div>
                        <div class="guide_sign_list clearfix">
                            <div :key="timeIndex" v-for="(timeItem, timeIndex) in item.guideTimes">
                                <div class="guide_sign_item" :key="recordIndex"
                                     v-for="(recordItem, recordIndex) in timeItem.numGuideRecords"
                                     :style="guideType !== 0 ? 'height: 65px;' : ''">
                                    <div v-if="guideType === 0">
                                        <div class="record_text">{{recordItem.scanUserName}}</div>
                                        <div v-if="recordItem.status === 1 || recordItem.status === 0">
                                            <div class="record_text">{{recordItem.scanTime | recordTimeFilter}}</div>
                                            <div class="record_text" :title="recordItem.remark || '--'">
                                                备注：{{recordItem.remark || '--'}}
                                            </div>

                                            <div class="check_img_box" v-show="recordItem.recordPics.length">
                                                <image-previewer :images="getViewPic(recordItem.recordPics)" tag="img"
                                                                 text="查看图片"></image-previewer>
                                            </div>
                                        </div>
                                        <div v-else>
                                            <i class="el-icon-warning">&nbsp;&nbsp;缺岗</i>
                                        </div>
                                    </div>
                                    <div v-else>
                                        <i class="el-icon-success" v-if="recordItem.status === 1">&nbsp;&nbsp;到岗</i>
                                        <i class="el-icon-success"
                                           v-else-if="recordItem.status === 0">&nbsp;&nbsp;被替岗</i>
                                        <i class="el-icon-warning" v-else>&nbsp;&nbsp;缺岗</i>
                                    </div>
                                    <div class="record_num">
                                        <div>{{recordItem.timeNum}}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="no_guide_list_msg" v-if="!guideGroupList.length">当日暂无统计</div>
            </div>
        </div>
    </div>
</template>

<script>
    import windowResizeMixin from '@/mixins/windowResize';
    import ImagePreviewer from '@/components/ImagePreviewer/ImagePreviewer.vue';
    import {getSchoolGuideRemindSetInfo} from '@/api/systemSet/guide';
    import {getGuideStaticsDataByDay} from '@/api/guide';

    export default {
        name: "guideStatisticsDay",
        data() {
            return {
                guideType: 0,
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    }
                },
                searchDay: new Date(),
                guideGroupList: []
            }
        },
        components: {ImagePreviewer},
        mixins: [windowResizeMixin],
        filters: {
            recordTimeFilter(time) {
                return time ? time.substring(11, 16) : '--';
            }
        },
        created() {
            if (window.sessionStorage.getItem('guideType') === '0' || window.sessionStorage.getItem('guideType') === '1') {
                this.guideType = Number(window.sessionStorage.getItem('guideType')) || 0;
            } else {
                this.getSchoolGuideRemindSetInfo();
            }
            this.getGuideStaticsDataByDay();
        },
        methods: {
            getSchoolGuideRemindSetInfo() {
                getSchoolGuideRemindSetInfo().then(res => {
                    let data = res.data.data;
                    if (res.data.code === 200) {
                        this.guideType = data.guideType;
                        window.sessionStorage.setItem('guideType', data.guideType);
                    }
                }).catch(() => {
                });
            },
            getGuideStaticsDataByDay() {
                getGuideStaticsDataByDay(this.$moment(this.searchDay).format('YYYY-MM-DD')).then(res => {
                    const data = res.data.data;
                    if (res.data.code === 200) {
                        this.guideGroupList = data;
                    }
                })
            },
            getViewPic(picList) {
                if (picList) {
                    return picList.map((item) => {
                        return {'src': item.picUrl}
                    });
                }
                return [];
            }
        }
    }
</script>

<style lang="scss" scoped>
    .clearfix:after {
        content: "";
        display: block;
        font-size: 0;
        height: 0;
        clear: both;
        visibility: hidden
    }

    .clearfix {
        zoom: 1;
    }

    .guide_day_wrap {
        .guide_content_box {
            .time_header {
                padding-bottom: 10px;
                border-bottom: 1px solid #eee;
            }

            .guide_statistics_box {
                padding-top: 10px;
                overflow-x: hidden;
                overflow-y: auto;

                .guide_group_list {
                    .guide_group_item {
                        float: left;
                        width: 352px;
                        margin-bottom: 10px;
                        margin-left: 10px;
                        border: 1px solid #eee;
                        color: #333;
                        background: #fff;

                        .header_item_line {
                            display: flex;
                            height: 40px;
                            line-height: 40px;
                            padding-left: 10px;

                            .header_item_title {
                                flex: 2;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                            }

                            .header_item_name {
                                flex: 1;
                                text-align: right;
                                padding-right: 10px;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                            }

                            i {
                                margin-right: 5px;
                                color: #409eff;
                            }
                        }

                        .guide_sign_list {
                            color: #666;

                            .guide_sign_item {
                                position: relative;
                                float: left;
                                width: 160px;
                                height: 85px;
                                margin-bottom: 10px;
                                margin-left: 10px;
                                padding: 10px 15px;
                                border: 1px solid #409eff;
                                overflow: hidden;
                                font-size: 14px;

                                .record_text {
                                    margin-top: 5px;
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                    white-space: nowrap;
                                }

                                .record_num {
                                    position: absolute;
                                    top: -3px;
                                    left: -13px;
                                    width: 40px;
                                    height: 20px;
                                    line-height: 20px;
                                    text-align: center;
                                    color: #fff;
                                    background: #409eff;
                                    transform: rotate(-45deg);

                                    div {
                                        transform: rotate(45deg);
                                    }
                                }

                                .check_img_box {
                                    position: absolute;
                                    top: 10px;
                                    right: 5px;
                                    color: #409eff;
                                }

                                i {
                                    margin-top: 15px;
                                    font-size: 16px;
                                    color: #F56C6C;
                                }

                                .el-icon-success {
                                    color: #67C23A;
                                }
                            }
                        }
                    }
                }

                .no_guide_list_msg {
                    color: #999;
                    text-align: center;
                }
            }
        }
    }
</style>
