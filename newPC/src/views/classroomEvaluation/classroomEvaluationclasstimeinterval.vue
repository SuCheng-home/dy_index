<template>
    <div class="classroomEvaluationclasstimeinterval">
        <div class="header">
            <el-select size="medium" v-model="week" placeholder="请选择周次" @change="changeweek()">
                <el-option v-for="item in weeklist" :key="item.week" :label="'第'+item.week+'周'"
                           :value="item.week"></el-option>
            </el-select>
            <el-date-picker
                size="medium"
                v-model="daterange"
                type="daterange" class="mywidthdaterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="listByDateStrs()"
                :clearable="false"
            >
            </el-date-picker>
            <a :href="downLoadHref" v-if="datalist.length" target="_blank" download="examName">
                <el-button type="primary" size="medium">导出</el-button>
            </a>
        </div>
        <div>
            <el-table :data="datalist" border stripe :height="nobottommaxH">
                <el-table-column label="班级" align="center">
                    <template slot-scope="scope">
                        <el-button @click="classroomEvaluationclasslist(scope.row.classId)" type="text" size="small">
                            {{scope.row.className}}
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="gradeName" label="年级" align="center"></el-table-column>
                <el-table-column prop="ratingTotalScore" label="总分" align="center"></el-table-column>
                <el-table-column prop="avgScore" label="平均分" align="center"></el-table-column>
            </el-table>
        </div>

    </div>
</template>
<script>
    import mixins from '@/mixins/windowResize';
    import baseMixin from '@/mixins/baseMixin';
    import moment from "moment";
    import {listByDateStr, findSeveralWeekListBySchoolTimeId} from '@/api/classroomEvaluation';

    export default {
        data() {
            return {
                startDate: '',
                endDate: '',
                datalist: [],
                weeklist: [],
                week: '',
                daterange: [this.$route.query.startDate, this.$route.query.endDate],
                downLoadHref: ''
            }
        },
        created() {
            //获取周次
            findSeveralWeekListBySchoolTimeId().then(res => res.data).then(data => {
                if (data.code === 200) {
                    this.weeklist = data.data;
                    this.week = data.data[data.data.length - 1].week;
                    this.daterange = [data.data[data.data.length - 1].startDateStr, data.data[data.data.length - 1].endDateStr];
                    this.listByDateStrs();
                }
            })


        },
        mixins: [mixins, baseMixin],
        methods: {
            classroomEvaluationclasslist(classId) {
                this.startDate = this.$moment(this.daterange[0]).format("YYYY-MM-DD"); //时间
                this.endDate = this.$moment(this.daterange[1]).format("YYYY-MM-DD"); //时间
                this.$router.push({
                    path: "classroomEvaluationclasslist",
                    query: {classId: classId, startDate: this.startDate, endDate: this.endDate}
                })
            },

            //切换周次
            changeweek() {
                this.daterange = [this.weeklist[this.week - 1].startDateStr, this.weeklist[this.week - 1].endDateStr];
                this.listByDateStrs();
            },

            //获取列表
            listByDateStrs() {
                this.datalist = [];
                this.startDate = this.$moment(this.daterange[0]).format("YYYY-MM-DD"); //时间
                this.endDate = this.$moment(this.daterange[1]).format("YYYY-MM-DD"); //时间
                this.downLoadHref = global.BasePath + "structure/classRating/exportClassRatingRecordByClassIdData?endTimeStr=" + this.endDate + "&startTimeStr=" + this.startDate + "&token=" + this.$store.getters.token ,//导出全部名单
                    listByDateStr(this.endDate, this.startDate).then(res => res.data).then(data => {
                        if (data.code === 200) {
                            this.datalist = data.data;
                        }
                    })
            },

        }
    }
</script>
<style lang="scss" scoped>
    .classroomEvaluationclasstimeinterval {
        padding: 12px;
        box-sizing: border-box;
        font-size: 14px;

        * {
            box-sizing: border-box;
        }

        .checkbox-box {
            padding-bottom: 10px;

        }

        .red {
            color: #f56c6c;
        }

        .green {
            color: #67c23a;
        }

        .filter-item {
            width: 100px;
        }

        .header {
            padding-bottom: 10px;

        }

    }
</style>

