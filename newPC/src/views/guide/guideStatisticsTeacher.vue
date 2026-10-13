<template>
    <div class="guide_teacher_wrap" style="padding:10px">
        <div class="guide_content_box">
            <div class="time_header">
                <!-- <el-button @click="$router.back()" type="default" size="medium">返回</el-button> -->
                <el-date-picker v-model="dateRange" type="daterange" class="mywidthdaterange" range-separator="-" :clearable="false" @change="getGuideStaticsDataByTeacher()"
                                size="medium"
                                start-placeholder="开始日期" end-placeholder="结束日期">
                </el-date-picker>
                <!-- <el-button type="primary" size="medium" @click="getGuideStaticsDataByTeacher">统计</el-button> -->
                <a :href="exportURL" download="导出" target="_blank" v-if="guideGroupList.length">
                    <el-button class="filter-item" type="primary" size="medium" icon="upload">导出</el-button>
                </a>
                <a :href="twoexportURL" download="导出" target="_blank" >
                    <el-button class="filter-item" type="primary" size="medium" icon="upload">按岗位导出</el-button>
                </a>
            </div>

            <div class="guide_statistics_box">
                <el-table stripe :data="guideGroupList" border style="width: 100%;" :height="maxH">
                    <el-table-column prop="managerUserName" label="教师姓名" align="center"></el-table-column>
                    <el-table-column label="应护导岗" align="center" show-overflow-tooltip>
                        <template slot-scope="scope">{{scope.row.stationTitle || '--'}}</template>
                    </el-table-column>
                    <el-table-column label="护导安排（天）" align="center">
                        <template slot-scope="scope">{{scope.row.arriveDayNum ? scope.row.arriveDayNum : '--'}}
                        </template>
                    </el-table-column>
                     <el-table-column label="应到岗" align="center">
                        <template slot-scope="scope">{{scope.row.stationTitle ? scope.row.arriveCount : '--'}}
                        </template>
                    </el-table-column>
                    <el-table-column label="实到岗" align="center">
                        <template slot-scope="scope">{{scope.row.stationTitle ? scope.row.comeCount : '--'}}</template>
                    </el-table-column>
                    <el-table-column label="被替岗" align="center">
                        <template slot-scope="scope">{{scope.row.stationTitle ? scope.row.postCount : '--'}}</template>
                    </el-table-column>
                    <el-table-column label="缺岗" align="center">
                        <template slot-scope="scope">{{scope.row.stationTitle ? scope.row.absenceCount : '--'}}
                        </template>
                    </el-table-column>
                    <el-table-column label="替其他岗" align="center">
                        <template slot-scope="scope">{{scope.row.replaceCount}}</template>
                    </el-table-column>
                    <el-table-column label="出勤率" align="center">
                        <template slot-scope="scope">{{scope.row.stationTitle ? scope.row.attendRate + '%' : '--'}}
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
    import {getGuideStaticsDataByTeacher} from '@/api/guide';

    export default {
        name: "guideStatisticsTeacher",
        data() {
            return {
                guideType: 0,
                dateRange: [this.$moment(new Date()).format('YYYY-MM') + '-01', new Date()],
                exportURL: '',
                twoexportURL:'',
                pageNo: 1,
                pageSize: 10,
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
            this.getGuideStaticsDataByTeacher();
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
            getGuideStaticsDataByTeacher() {
                this.exportURL = global.BasePath + 'structure/guide/downloadThGuideDataXls?endTime=' + this.$moment(this.dateRange[1]).format('YYYY-MM-DD') + '&startTime=' + this.$moment(this.dateRange[0]).format('YYYY-MM-DD') + '&token=' + this.$store.getters.token;
                this.twoexportURL = global.BasePath + 'structure/guide/downloadThGuideDataXlsStation2?endTime=' + this.$moment(this.dateRange[1]).format('YYYY-MM-DD') + '&startTime=' + this.$moment(this.dateRange[0]).format('YYYY-MM-DD') + '&token=' + this.$store.getters.token;
                getGuideStaticsDataByTeacher({
                    startTime: this.$moment(this.dateRange[0]).format('YYYY-MM-DD'),
                    endTime: this.$moment(this.dateRange[1]).format('YYYY-MM-DD'),
                    pageNo: this.pageNo,
                    pageSize: this.pageSize
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
                this.getGuideStaticsDataByTeacher();
            },
            currentChangeHandler() {
                this.getGuideStaticsDataByTeacher();
            }
        }
    }
</script>

<style lang="scss" scoped>
    .guide_teacher_wrap {
        .guide_content_box {
            .time_header {
                padding-bottom: 10px;
            }

            .guide_statistics_box {
                overflow-x: hidden;
                overflow-y: auto;
            }
        }
    }
</style>
