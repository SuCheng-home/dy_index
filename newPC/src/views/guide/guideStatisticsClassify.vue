<template>
    <div class="guide_day_wrap" style="padding:10px">
        <div class="guide_content_box">
            <div class="time_header">
                <!-- <el-button @click="$router.back()" type="default" size="medium">返回</el-button> -->
                <el-date-picker v-model="dateRange" type="daterange" class="mywidthdaterange" range-separator="-" :clearable="false"
                                size="medium"  @change="getGuideStaticsDataByType()"
                                start-placeholder="开始日期" end-placeholder="结束日期">
                </el-date-picker>
                <el-select v-model="selectType" placeholder="请选择类型" size="medium"  @change="getGuideStaticsDataByType()">
                    <el-option v-for="item in typeList" :key="item.value" :label="item.label"
                               :value="item.value">
                    </el-option>
                </el-select>
                <!-- <el-button type="primary" size="medium" @click="getGuideStaticsDataByType">统计</el-button> -->
                <a :href="exportURL" download="导出" target="_blank" v-if="guideGroupList.length">
                    <el-button class="filter-item" type="primary" size="medium" icon="upload">导出</el-button>
                </a>
            </div>

            <div class="guide_statistics_box">
                <el-table stripe :data="guideGroupList" border style="width: 100%;" :height="maxH">
                    <el-table-column prop="statisticalDate" label="日期" align="center"></el-table-column>
                    <el-table-column prop="weekNamer" label="周次" align="center"></el-table-column>
                    <el-table-column prop="stationTitle" label="岗位名称" align="center"
                                     show-overflow-tooltip></el-table-column>
                    <el-table-column label="护导批次" align="center">
                        <template slot-scope="scope">
                            第{{scope.row.timeNum}}次
                        </template>
                    </el-table-column>
                    <el-table-column prop="managerUserName" label="护导员" align="center"></el-table-column>
                    <el-table-column label="备注" align="center" show-overflow-tooltip>
                        <template slot-scope="scope">
                            {{scope.row.remark || '--'}}
                        </template>
                    </el-table-column>
                    <el-table-column label="签到人员" align="center">
                        <template slot-scope="scope">
                            <span v-if="scope.row.status === 2">--</span>
                            <span v-else>{{scope.row.realScanUsers || scope.row.scanUserName || '--'}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="签到时间" align="center">
                        <template slot-scope="scope">
                  <span v-if="scope.row.status === 2" style="color: #F56C6C;">
                    <i class="el-icon-warning">缺岗</i>
                  </span>
                            <span v-else>{{scope.row.scanTime | recordTimeFilter}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="拍照">
                        <template slot-scope="scope">
                            <div style="color: #409eff;"
                                 v-if="scope.row.recordPics && scope.row.recordPics.length">
                                <image-previewer :images="getViewPic(scope.row.recordPics)" tag="img"
                                                 text="查看图片"></image-previewer>
                            </div>
                            <div v-else>--</div>
                        </template>
                    </el-table-column>
                </el-table>
                <div style="margin-top: 10px;">
                    <el-pagination @size-change="sizeChangeHandler" @current-change="currentChangeHandler"
                                   :current-page.sync="pageNo" :page-sizes="[10, 20, 30, 50]"
                                   :page-size.sync="pageSize" layout="total, sizes, prev, pager, next, jumper"
                                   :total="total">
                    </el-pagination>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import windowResizeMixin from '@/mixins/windowResize';
    import ImagePreviewer from "@/components/ImagePreviewer/ImagePreviewer.vue";
    import {getSchoolGuideRemindSetInfo} from '@/api/systemSet/guide';
    import {getGuideStaticsDataByType} from '@/api/guide';

    export default {
        name: "guideStatisticsClassify",
        data() {
            return {
                guideType: 0,
                dateRange: [this.$moment(new Date()).format('YYYY-MM') + '-01', new Date()],
                selectType: 2,
                typeList: [
                    {
                        value: 2,
                        label: '缺岗'
                    },
                    {
                        value: 0,
                        label: '被替岗'
                    },
                    {
                        value: 1,
                        label: '到岗'
                    }
                ],
                exportURL: '',
                pageNo: 1,
                pageSize: 20,
                total: null,
                guideGroupList: []
            }
        },
        mixins: [windowResizeMixin],
        components: {
            ImagePreviewer
        },
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
            this.getGuideStaticsDataByType();
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
            getGuideStaticsDataByType() {
                this.exportURL = global.BasePath + 'structure/guide/downloadTypeGuideDataXls?endTime=' + this.$moment(this.dateRange[1]).format('YYYY-MM-DD') + '&startTime=' + this.$moment(this.dateRange[0]).format('YYYY-MM-DD') + '&state=' + this.selectType + '&token=' + this.$store.getters.token;
                getGuideStaticsDataByType({
                    startTime: this.$moment(this.dateRange[0]).format('YYYY-MM-DD'),
                    endTime: this.$moment(this.dateRange[1]).format('YYYY-MM-DD'),
                    pageNo: this.pageNo,
                    pageSize: this.pageSize,
                    state: this.selectType
                }).then(res => {
                    const data = res.data.data;
                    if (res.data.code === 200) {
                        this.guideGroupList = data.dataList;
                        this.total = data.pagination.total;
                    }
                })
            },
            sizeChangeHandler() {
                this.pageNo = 1;
                this.getGuideStaticsDataByType();
            },
            currentChangeHandler() {
                this.getGuideStaticsDataByType();
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
    .guide_day_wrap {
        .guide_content_box {
            .time_header {
                padding-bottom: 10px;
            }

            .guide_statistics_box {
                overflow-x: hidden;
                overflow-y: auto;

                .chose_teacher {
                    line-height: 25px;
                    color: #409eff;
                }

                .no_chose_teacher {
                    line-height: 50px;
                    color: #F56C6C;
                }
            }
        }
    }
</style>
