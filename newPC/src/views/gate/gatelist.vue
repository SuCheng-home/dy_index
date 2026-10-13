<template>
    <div class="gatelist">
        <div class="top">
            <el-col :span="24">
                <el-date-picker
                    v-model="daterange"
                    type="daterange" class="mywidthdaterange" size="medium"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    @change="findGateInfoLists()"
                    :clearable="false" style="width:220px"
                >
                </el-date-picker>

                <el-select class="filter-item" v-model="query.userTypeStr" @change="findGateInfoLists()" size="medium"
                           style="width:120px">
                    <el-option label="老师" value="1"></el-option>
                    <el-option label="学生" value="2"></el-option>
                    <el-option label="家长" value="3"></el-option>
                </el-select>
                <el-select size="medium" v-if="query.userTypeStr==2" v-model="query.gradeId" placeholder="请选择年级"
                           style="width:120px" @change="queryClassByGradeIds()">
                    <el-option label="全部年级" :value="0"></el-option>
                    <el-option v-for="item in gradeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
                <el-select size="medium" v-if="query.userTypeStr==2&&query.gradeId!=0" v-model="query.classId"
                           style="width:120px" placeholder="请选择班级" @change="findGateInfoLists()">
                    <el-option label="全部班级" :value="0"></el-option>
                    <el-option v-for="item in classList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
                <el-select class="filter-item" v-model="query.gateType" @change="findGateInfoLists()" size="medium"
                           style="width:120px">
                    <el-option label="全部进出类型" value="0"></el-option>
                    <el-option label="进门" value="1"></el-option>
                    <el-option label="出门" value="2"></el-option>
                </el-select>

                <a :href="downLoadHref" v-if="dateList.length>0" target="_blank" download="examName">
                    <el-button type="primary" size="medium">导出</el-button>
                </a>
                <el-input class="search-input search-input--right" size="medium"
                          placeholder="姓名" icon="el-icon-search" @keyup.enter.native="handleInputChange"
                          v-model.trim="query.userName">
                    <el-button slot="append" icon="el-icon-search" @click="handleInputChange"></el-button>
                </el-input>
            </el-col>

        </div>
        <div class="time-table">
            <el-table stripe :data="dateList" v-loading.body="listLoading" border fit highlight-current-row
                      style="width: 100%" :height="maxH">
                <el-table-column align="center" label="姓名" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.userName}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="用户类型" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if="scope.row.userType==1">老师</span>
                        <span v-if="scope.row.userType==2">学生</span>
                        <span v-if="scope.row.userType=='3'">家长</span>
                        <span v-if="scope.row.userType=='13'">老师/家长</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="时间">
                    <template slot-scope="scope">
                        <span>{{scope.row.timeStamp.split('.')[0]}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="进出类型">
                    <template slot-scope="scope">
                        <span v-if="scope.row.gateType===1">进门</span>
                        <span v-else-if="scope.row.gateType===2">出门</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="进出位置">
                    <template slot-scope="scope">
                        <span>{{scope.row.deviceLocation || '--'}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="图片">
                    <template slot-scope="scope">
                        <image-previewer tag="richtext"><span class="img"><img :src="scope.row.picture"> </span>
                        </image-previewer>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="体温">
                    <template slot-scope="scope">
                        <span>{{scope.row.temperature || '--'}}</span>
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
    import {findGateInfoList} from "@/api/gate";
    import {querySchoolGrade, queryClassByGradeId} from "@/api/recordsofconsumption";
    import _ from "lodash";
    import mixin from "@/mixins/windowResize";
    import ImagePreviewer from "@/components/ImagePreviewer/ImagePreviewer.vue";

    export default {
        name: "gatelist",
        data: function () {
            return {
                listLoading: false,
                dateList: [], //表格主题数据
                total: null,
                daterange: [new Date(), new Date()],
                query: {
                    startDate: this.$moment().format("YYYY-MM-DD"), //开始时间
                    endDate: this.$moment().format("YYYY-MM-DD"), //结束时间
                    userTypeStr: "1", //老师1学生2
                    gateType: "0", //进门1出门2
                    pageNo: 1, //页数
                    pageSize: 20, //条数
                    userName: "",
                    gradeId: 0,
                    classId: 0
                },
                downLoadHref: "",
                gradeList: [],
                classList: [],
            };
        },
        components: {
            ImagePreviewer
        },
        mixins: [mixin],
        //获取渲染数据当数据加载完成后执行(生命周期中的钩子函数)
        created() {
            querySchoolGrade().then(res => res.data).then(data => {
                this.gradeList = data.data;
                if (data.data.length !== 0) {
                    this.queryClassByGradeIds();
                }
            });
            this.findGateInfoLists();
        },
        methods: {
            handleInputChange: _.debounce(
                function () {
                    this.findGateInfoLists();
                },
                // 这是我们为用户停止输入等待的毫秒数
                1000
            ),
            //获取班级
            queryClassByGradeIds() {
                this.classList = [];
                this.query.classId = 0;
                if (this.query.gradeId != 0) {
                    queryClassByGradeId(this.query.gradeId).then(res => res.data).then(data => {
                        this.classList = data.data;
                        if (data.data.length !== 0) {
                            this.findGateInfoLists();
                        }
                    });

                } else {
                    this.findGateInfoLists();
                }

            },
            findGateInfoLists() {
                this.dateList = [];
                this.query.startDate = this.$moment(this.daterange[0]).format("YYYY-MM-DD"); //时间
                this.query.endDate = this.$moment(this.daterange[1]).format("YYYY-MM-DD"); //时间
                this.downLoadHref =
                    global.BasePath +
                    "structure/gateNew/exportGateInfoList?endDate=" +
                    this.query.endDate +
                    "&startDate=" +
                    this.query.startDate +
                    "&userName=" +
                    this.query.userName +
                    "&userTypeStr=" +
                    this.query.userTypeStr +
                    "&gradeId=" +
                    (this.query.userTypeStr == 2 ? this.query.gradeId : 0) +
                    "&classId=" +
                    (this.query.userTypeStr == 2 ? this.query.classId : 0) +
                    "&gateType=" +
                    this.query.gateType +
                    "&token=" +
                    this.$store.getters.token;
                findGateInfoList(this.query).then(res => {
                    let data = res.data.data;
                    this.dateList = data.gateInfoList;
                    this.total = data.pagination.total;
                });
            },

            handleSizeChange(val) {
                this.query.pageNo = 1;
                this.query.pageSize = val;
                this.findGateInfoLists();
            },
            handleCurrentChange(val) {
                this.findGateInfoLists();
            }
        }
    };
</script>
<style scoped>
    .gatelist {
        padding: 12px;
    }

    .gatelist .top {
        padding-bottom: 10px;
        overflow: hidden;
    }

    .gatelist .img img {
        height: 30px;
    }

    .gatelist .el-select {
        width: 125px;
    }
</style>
