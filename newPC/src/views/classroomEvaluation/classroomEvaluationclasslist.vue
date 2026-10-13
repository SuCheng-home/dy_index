<template>
    <div class="classroomEvaluationclasslist">
        <div class="top">
            <el-col :span="24">
                <el-button  @click="$router.back()" type="default" size="medium">返回</el-button>
                <el-date-picker
                   size="medium"
                    v-model="daterange"
                    type="daterange" class="mywidthdaterange"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    @change="findClassRatingRecordLists()"
                    :clearable="false"
                >
                </el-date-picker>
                 <a :href="downLoadHref" v-if="dateList.length" target="_blank" download="examName"><el-button type="primary"  size="medium">导出</el-button></a>
            </el-col>

        </div>
        <div class="time-table">
            <el-table stripe :data="dateList" border fit highlight-current-row  style="width: 100%" :height="maxH">
                <el-table-column align="center" label="日期" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <el-button @click="classroomEvaluationclasslistdetails(scope.row.id)" type="text" size="small">{{scope.row.checkDateStr}}</el-button>
                      </template>
                </el-table-column>
                <el-table-column align="center" label="年级" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.gradeName}}</span>
                    </template>
                </el-table-column><el-table-column align="center" label="班级" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.className}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="节次" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.isMorningAndSectionName}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="学科" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.subjectName}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="任课老师" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.teacherName}}</span>
                    </template>
                </el-table-column>
                 <el-table-column align="center" label="总分" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.ratingTotalScore}}</span>
                    </template>
                </el-table-column>

            </el-table>
        </div>
        <div class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page.sync="query.pageNo" :page-sizes="[10,20,30, 50]"
                           :page-size="query.pageSize" layout="total, sizes, prev, pager, next, jumper"
                           :total="total">
            </el-pagination>
        </div>
    </div>
</template>
<script>
    import moment from "moment";
    import {findClassRatingRecordList} from '@/api/classroomEvaluation';
    import mixin from '@/mixins/windowResize';
    export default {
        name: "gatelist",
        data: function () {
            return {
                dateList: [],//表格主题数据
                total: null,
                daterange: [this.$route.query.startDate, this.$route.query.endDate],
                query: {
                    startDate: this.$route.query.startDate, //开始时间
                    endDate: this.$route.query.endDate, //结束时间
                    classId: this.$route.query.classId, //结束时间
                    pageNo: 1, //页数
                    pageSize: 20,//条数
                },
                downLoadHref:'',//导出全部名单
            };
        },
        mixins: [mixin],
        //获取渲染数据当数据加载完成后执行(生命周期中的钩子函数)
        created() {
            this.findClassRatingRecordLists()
        },
        methods: {
            classroomEvaluationclasslistdetails(id){
                this.$router.push({
                            path: "classroomEvaluationclasslistdetails",
                            query: {id:id}
                    })
                    },

            findClassRatingRecordLists() {
                this.dateList = [];
                this.query.startDate = this.$moment(this.daterange[0]).format('YYYY-MM-DD'); //时间
                this.query.endDate = this.$moment(this.daterange[1]).format('YYYY-MM-DD'); //时间
                this.downLoadHref= global.BasePath + "structure/classRating/exportClassRatingRecordData?endTimeStr=" +this.query.endDate +"&startTimeStr=" +this.query.startDate+"&classId=" +this.query.classId+"&token=" +this.$store.getters.token ,//导出全部名单
                
               findClassRatingRecordList(this.query).then(res => {
                    let data = res.data.data;
                    this.dateList = data.dataList;
                    this.total = data.pagination.total;
                });
            },

            handleSizeChange(val) {
                this.findClassRatingRecordLists();
            },
            handleCurrentChange(val) {
                this.findClassRatingRecordLists();
            }

        }
    };
</script>
<style lang="scss" scoped>
    .classroomEvaluationclasslist {
        padding:12px;
    }

    .classroomEvaluationclasslist .top {
        padding-bottom: 10px;
        overflow: hidden;
    }

</style>
