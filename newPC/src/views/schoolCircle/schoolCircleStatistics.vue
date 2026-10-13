<template>
    <div class="campusCirclelistone schoolCircle">
        <el-tabs type="border-card" v-model="activeName">
            <el-tab-pane label="按老师统计" name="one">
                <div class="top">
                    <el-button @click="$router.back()" type="default" size="medium">返回</el-button>
                </div>
                <div class="subject" :style="`height: ${nobottommaxH - 100}px;overflow: auto;`">
                    <div class="title">统计汇总</div>
                    <el-table stripe ref="multipleTable" border :data="teacherNumlist" tooltip-effect="dark">
                        <el-table-column align="center" label="帖子总数">
                            <template slot-scope="scope">
                                {{ scope.row.messageCount }}
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="精华帖">
                            <template slot-scope="scope">
                                {{ scope.row.digestCount }}
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="评论总数">
                            <template slot-scope="scope">
                                {{ scope.row.commentCount }}
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="点赞总数">
                            <template slot-scope="scope">
                                {{ scope.row.fabulousCount }}
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="视频帖数">
                            <template slot-scope="scope">
                                {{ scope.row.videoCount }}
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="图片帖数">
                            <template slot-scope="scope">
                                {{ scope.row.picCount }}
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="title">分类统计</div>
                    <div style="padding: 10px">
                        <el-row>
                            <el-col :span="19">
                                <el-date-picker  :clearable="false" :editable="false" v-model="teacherTimeRange" @change="teacherTimeRangeChange" size="medium"
                                                type="daterange" class="mywidthdaterange" range-separator="~"
                                                start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                                <a target="_blank" :href="teacherExportUrl" download="导出结果"
                                   v-if="teacherDataList.length">
                                    <el-button type="primary" size="medium">导出</el-button>
                                </a>
                            </el-col>
                            <el-col :span="5">
                                <el-input placeholder="请输入老师姓名" v-model="searchTeacherName" class="input-with-select"
                                          size="medium">
                                    <el-button slot="append" @click="teacherAnalysisByTopicId()"
                                               icon="el-icon-search"></el-button>
                                </el-input>
                            </el-col>
                        </el-row>
                    </div>

                    <el-table stripe ref="multipleTable" border :data="teacherDataList" tooltip-effect="dark">
                        <el-table-column prop="userName" align="center" label="姓名"></el-table-column>
                        <el-table-column prop="departNames" align="center" label="部门" :show-overflow-tooltip="true">
                            <template slot-scope="scope">
                                {{ scope.row.departNames || '--' }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="messageCount" align="center" label="帖子数"></el-table-column>
                        <el-table-column prop="digestCount" align="center" label="被加精数"></el-table-column>
                        <el-table-column prop="isTopCount" align="center" label="被置顶数"></el-table-column>
                        <el-table-column prop="fabulousCount" align="center" label="被点赞数"></el-table-column>
                        <el-table-column prop="commentCount" align="center" label="被评论数"></el-table-column>
                    </el-table>
                </div>
                <div style="margin-top: 15px;">
                    <el-pagination @size-change="handleSizeChangeTeacher" @current-change="handleCurrentChangeTeacher"
                                   :page-sizes="[10, 20, 30, 40]" :page-size="10"
                                   layout="total, sizes, prev, pager, next, jumper" :total="total1"></el-pagination>
                </div>
            </el-tab-pane>
            <el-tab-pane label="按学生统计" name="two">
                <div class="top">
                    <el-button @click="$router.back()" type="default" size="medium">返回</el-button>
                </div>
                <div class="subject" :style="`height: ${nobottommaxH - 100}px;overflow: auto;`">
                    <div class="title">统计汇总</div>
                    <el-table stripe ref="multipleTable" border :data="stuNumlist" tooltip-effect="dark">
                        <el-table-column align="center" label="帖子总数">
                            <template slot-scope="scope">
                                {{ scope.row.messageCount }}
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="精华帖">
                            <template slot-scope="scope">
                                {{ scope.row.digestCount }}
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="评论总数">
                            <template slot-scope="scope">
                                {{ scope.row.commentCount }}
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="点赞总数">
                            <template slot-scope="scope">
                                {{ scope.row.fabulousCount }}
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="视频帖数">
                            <template slot-scope="scope">
                                {{ scope.row.videoCount }}
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="图片帖数">
                            <template slot-scope="scope">
                                {{ scope.row.picCount }}
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="title">分类统计</div>
                    <div style="padding: 10px">
                        <el-row>
                            <el-col :span="19">
                                <el-date-picker size="medium"  :clearable="false" :editable="false" v-model="stuTimeRange" @change="stuTimeRangeChange" type="daterange"
                                                class="mywidthdaterange" range-separator="~" start-placeholder="开始日期"
                                                end-placeholder="结束日期"></el-date-picker>
                                <el-select v-model="gradeId" placeholder="请选择" @change="gradeChange" size="medium">
                                    <el-option label="全部年级" value="0"></el-option>
                                    <el-option v-for="item in gradeOptions" :key="item.value" :label="item.label"
                                               :value="item.value"></el-option>
                                </el-select>
                                <el-select v-model="classId" placeholder="请选择" @change="classChange" size="medium">
                                    <el-option label="全部班级" value="0"></el-option>
                                    <el-option v-for="item in classOptions" :key="item.value" :label="item.label"
                                               :value="item.value"></el-option>
                                </el-select>
                                <a target="_blank" :href="stuExportUrl" download="导出结果" v-if="stuDataList.length">
                                    <el-button type="primary" size="medium">导出</el-button>
                                </a>
                            </el-col>
                            <el-col :span="5">
                                <el-input placeholder="请输入学生姓名" v-model="searchStuentName" class="input-with-select"
                                          size="medium">
                                    <el-button slot="append" @click="stuAnalysisByTopicId()"
                                               icon="el-icon-search"></el-button>
                                </el-input>
                            </el-col>
                        </el-row>
                    </div>

                    <el-table stripe ref="multipleTable" border :data="stuDataList" tooltip-effect="dark">
                        <el-table-column prop="userName" align="center" label="姓名"></el-table-column>
                        <el-table-column prop="departNames" align="center" label="班级"></el-table-column>
                        <el-table-column prop="messageCount" align="center" label="帖子数"></el-table-column>
                        <el-table-column prop="digestCount" align="center" label="被加精数"></el-table-column>
                        <el-table-column prop="isTopCount" align="center" label="被置顶数"></el-table-column>
                        <el-table-column prop="fabulousCount" align="center" label="被点赞数"></el-table-column>
                        <el-table-column prop="commentCount" align="center" label="被评论数"></el-table-column>
                    </el-table>
                </div>
                <div style="margin-top: 15px;">
                    <el-pagination @size-change="handleSizeChangeStu" @current-change="handleCurrentChangeStu"
                                   :page-sizes="[10, 20, 30, 40]" :page-size="10"
                                   layout="total, sizes, prev, pager, next, jumper" :total="total2"></el-pagination>
                </div>
            </el-tab-pane>
            <el-tab-pane label="活跃度统计" name="three">
                <div class="top">
                    <el-button @click="$router.back()" type="default" size="medium">返回</el-button>
                </div>
                <div class="subject" :style="`height: ${nobottommaxH - 100}px;overflow: auto;`">
                    <div class="title">统计汇总</div>
                    <el-table stripe ref="multipleTable" border :data="totalNumlist" tooltip-effect="dark">
                        <el-table-column align="center" label="帖子总数">
                            <template slot-scope="scope">
                                {{ scope.row.messageCount }}
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="精华帖">
                            <template slot-scope="scope">
                                {{ scope.row.digestCount }}
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="评论总数">
                            <template slot-scope="scope">
                                {{ scope.row.commentCount }}
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="点赞总数">
                            <template slot-scope="scope">
                                {{ scope.row.fabulousCount }}
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="视频帖数">
                            <template slot-scope="scope">
                                {{ scope.row.videoCount }}
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="图片帖数">
                            <template slot-scope="scope">
                                {{ scope.row.picCount }}
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="title">分类统计</div>
                    <div style="padding: 10px">
                        <el-row>
                            <el-col :span="19">
                                <el-date-picker size="medium" :clearable="false" :editable="false" v-model="activeTimeRange" @change="activeTimeRangeChange" type="daterange"
                                                class="mywidthdaterange" range-separator="~" start-placeholder="开始日期"
                                                end-placeholder="结束日期"></el-date-picker>
                                <el-select v-model="selectType" placeholder="请选择" size="medium" @change="typeChange">
                                    <el-option label="全部" value="0"></el-option>
                                    <el-option label="学生" value="1"></el-option>
                                    <el-option label="老师" value="2"></el-option>
                                </el-select>
                                <el-select v-model="gradeId2" placeholder="请选择" v-if="selectType == 1" size="medium"
                                           @change="gradeId2Change">
                                    <el-option label="全部年级" value="0"></el-option>
                                    <el-option v-for="item in gradeOptions" :key="item.value" :label="item.label"
                                               :value="item.value"></el-option>
                                </el-select>
                                <el-select v-model="classId2" placeholder="请选择" @change="activationAnalysis" size="medium"
                                           v-if="selectType == 1">
                                    <el-option label="全部班级" value="0"></el-option>
                                    <el-option v-for="item in classOptions2" :key="item.value" :label="item.label"
                                               :value="item.value"></el-option>
                                </el-select>
                                <a target="_blank" :href="activeExportUrl" download="导出结果" v-if="activeDataList.length">
                                    <el-button type="primary" size="medium">导出</el-button>
                                </a>
                            </el-col>
                            <el-col :span="5">
                                <el-input placeholder="请输入姓名" v-model="searchActiveName" class="input-with-select"
                                          size="medium">
                                    <el-button slot="append" @click="activationAnalysis()"
                                               icon="el-icon-search"></el-button>
                                </el-input>
                            </el-col>
                        </el-row>
                    </div>

                    <el-table stripe ref="multipleTable" border :data="activeDataList"
                              tooltip-effect="dark">
                        <el-table-column prop="userName" align="center" label="姓名"></el-table-column>
                        <el-table-column prop="userName" align="center" label="身份">
                            <template slot-scope="scope">
                                {{ scope.row.type === 1 ? '学生' : '老师' }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="departNames" align="center" :show-overflow-tooltip="true"
                                         label="班级/部门"></el-table-column>
                        <el-table-column prop="fabulousCount" align="center" label="点赞数"></el-table-column>
                        <el-table-column prop="commentCount" align="center" label="评论数"></el-table-column>
                    </el-table>
                </div>
                <div style="margin-top: 15px;">
                    <el-pagination @size-change="handleSizeChangeActive" @current-change="handleCurrentChangeActive"
                                   :page-sizes="[10, 20, 30, 40]" :page-size="10"
                                   layout="total, sizes, prev, pager, next, jumper" :total="total3"></el-pagination>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
    import mixin from '@/mixins/windowResize'

    import {
        teacherAnalysisByTopicId,
        stuAnalysisByTopicId,
        getGradeByTopicId,
        getClassByTopicIdAndGradeId,
        analysisByTopicId,
        activationAnalysis,
        queryClassByGradeId
    } from '@/api/schoolCircle'

    export default {
        data() {
            return {
                gradeId: '0',
                classId: '0',
                teacherDataList: [],
                stuDataList: [],
                activeName: 'one',
                id: this.$route.query.id,
                namelist: ['帖子总数', '精华贴'],
                stuNumlist: [{list: []}],
                teacherNumlist: [],
                searchTeacherName: '',
                searchStuentName: '',
                gradeOptions: [],
                classOptions: [],
                teacherTimeRange: [],
                stuTimeRange: [],
                pageNo1: 1,
                pageSize1: 10,
                total1: '',
                pageNo2: 1,
                pageSize2: 10,
                total2: '',

                activeTimeRange: [],
                selectType: '0',
                gradeId2: '0',
                classId2: '0',
                searchActiveName: '',
                activeDataList: [],
                total3: 0,
                pageSize3: 10,
                pageNo3: 1,
                totalNumlist: [],
                classOptions2: []

            }
        },
        mixins: [mixin],
        mounted() {
            // this.getSchoolCircleAnalysisDatas()
            this.teacherTimeRange = [
                this.$moment()
                    .startOf('month')
                    .format('YYYY-MM-DD'),
                this.$moment().format('YYYY-MM-DD')
            ]
            this.stuTimeRange = [
                this.$moment()
                    .startOf('month')
                    .format('YYYY-MM-DD'),
                this.$moment().format('YYYY-MM-DD')
            ]
            this.activeTimeRange = [
                this.$moment()
                    .startOf('month')
                    .format('YYYY-MM-DD'),
                this.$moment().format('YYYY-MM-DD')
            ]
            this.teacherAnalysisByTopicId()
            this.stuAnalysisByTopicId()
            this.getGradeByTopicId()
            this.analysisByTopicId(1)
            this.analysisByTopicId(2)
            this.analysisByTopicId(0)
            this.activationAnalysis()
        },
        computed: {
            teacherExportUrl() {
                return `${global.BasePath}structure/schoolfellowCircle/downTeacherAnalysisByTopicId?endDate=${this.$moment(this.teacherTimeRange[1]).format('YYYY-MM-DD')}&searchName=${this.searchTeacherName}&startDate=${this.$moment(this.teacherTimeRange[0]).format('YYYY-MM-DD')}&topicId=${this.id}&token=${this.$store.getters.token}`
            },
            stuExportUrl() {
                return `${global.BasePath}structure/schoolfellowCircle/downStuAnalysisByTopicId?classId=${this.classId}&endDate=${this.$moment(this.stuTimeRange[1]).format('YYYY-MM-DD')}&gradeId=${this.gradeId}&searchName=${this.searchStuentName}&startDate=${this.$moment(this.stuTimeRange[0]).format('YYYY-MM-DD')}&topicId=${this.id}&token=${this.$store.getters.token}`
            },
            activeExportUrl() {
                return `${global.BasePath}structure/schoolfellowCircle/downActivationAnalysis?type=${this.selectType}&classId=${this.classId2 || 0}&gradeId=${this.gradeId2 || 0}&endDate=${this.$moment(this.activeTimeRange[1]).format('YYYY-MM-DD')}&searchName=${this.searchActiveName}&startDate=${this.$moment(this.activeTimeRange[0]).format('YYYY-MM-DD')}&topicId=${this.id}&token=${this.$store.getters.token}`
            }
        },
        watch: {
            gradeId(val) {
                this.getClassByTopicIdAndGradeId()
            }
        },
        methods: {
            typeChange() {
                if (this.selectType == 2) {
                    this.gradeId2 = '0'
                    this.classId2 = '0'
                }
                this.activationAnalysis()
            },
            queryClassByGradeId(type) {
                queryClassByGradeId(this.gradeId2).then(res => {
                    this.classOptions2 = res.data.data.map(v => {
                        return {label: v.name, value: v.id}
                    })
                })
            },
            gradeId2Change() {
                this.classId2 = '0'
                this.classOption2 = []
                if (this.gradeId2 != 0) this.queryClassByGradeId()
                this.activationAnalysis()
            },
            activeTimeRangeChange() {
                this.activationAnalysis()
            },
            activationAnalysis() {
                activationAnalysis({
                    startDate: this.$moment(this.activeTimeRange[0]).format('YYYY-MM-DD'),
                    endDate: this.$moment(this.activeTimeRange[1]).format('YYYY-MM-DD'),
                    pageNo: this.pageNo3,
                    pageSize: this.pageSize3,
                    searchName: this.searchActiveName,
                    classId: this.classId2 || 0,
                    gradeId: this.gradeId2 || 0,
                    type: this.selectType,
                    topicId: this.id
                }).then(res => {
                    this.activeDataList = res.data.data.dataList
                    this.total3 = res.data.data.pagination.total
                })
            },

            //type 1学生 2老师
            analysisByTopicId(type) {
                switch (type) {
                    case 1:
                        analysisByTopicId({topicId: this.id, type: 1}).then(res => {
                            this.stuNumlist = [res.data.data]
                            console.log(this.stuNumlist, '1')
                        })
                        break
                    case 2:
                        analysisByTopicId({topicId: this.id, type: 2}).then(res => {
                            this.teacherNumlist = [res.data.data]
                            console.log(this.teacherNumlist, '2')
                        })
                        break;
                    case 0:
                        analysisByTopicId({topicId: this.id, type: 0}).then(res => {
                            this.totalNumlist = [res.data.data]
                            console.log(this.totalNumlist, '0')
                        })
                        break;
                }
            },
            getGradeByTopicId() {
                getGradeByTopicId({
                    topicId: this.id
                }).then(res => {
                    this.gradeOptions = res.data.data.map(v => {
                        return {label: v.name, value: v.id}
                    })
                })
            },
            getClassByTopicIdAndGradeId() {
                getClassByTopicIdAndGradeId({
                    gradeId: this.gradeId,
                    topicId: this.id
                }).then(res => {
                    this.classOptions = res.data.data.map(v => {
                        return {label: v.name, value: v.id}
                    })
                })
            },
            teacherTimeRangeChange(e) {
                this.teacherAnalysisByTopicId()
            },
            stuTimeRangeChange() {
                this.stuAnalysisByTopicId()
            },
            getSchoolCircleAnalysisDatas() {
                getSchoolCircleAnalysisData(this.id)
                    .then(res => res.data)
                    .then(data => {
                        this.numlist[0].list.push(data.data.circleCount)
                        this.numlist[0].list.push(data.data.digestCount)
                        for (let i = 0; i < data.data.topicOptions.length; i++) {
                            this.namelist.push(data.data.topicOptions[i].optionName)
                            this.numlist[0].list.push(data.data.topicOptions[i].optionCount)
                        }
                        this.numlist[0].list.push(data.data.commentCount)
                        this.numlist[0].list.push(data.data.fabulousCount)
                        this.numlist[0].list.push(data.data.videoCount)
                        this.numlist[0].list.push(data.data.picCount)
                        this.namelist.push('评论总数')
                        this.namelist.push('点赞总数')
                        this.namelist.push('视频总数')
                        this.namelist.push('图片总数')
                    })
            },
            handleSizeChangeTeacher(val) {
                this.pageSize1 = val
                this.pageNo1 = 1
                this.teacherAnalysisByTopicId()
            },
            handleCurrentChangeTeacher(val) {
                this.pageNo1 = val
                this.teacherAnalysisByTopicId()
            },
            teacherAnalysisByTopicId() {
                teacherAnalysisByTopicId({
                    startDate: this.$moment(this.teacherTimeRange[0]).format('YYYY-MM-DD'),
                    endDate: this.$moment(this.teacherTimeRange[1]).format('YYYY-MM-DD'),
                    pageNo: this.pageNo1,
                    pageSize: this.pageSize1,
                    searchName: this.searchTeacherName,
                    topicId: this.id
                })
                    .then(res => res.data)
                    .then(data => {
                        this.teacherDataList = data.data.dataList
                        this.total1 = data.data.pagination.total
                    })
            },
            handleSizeChangeStu(val) {
                this.pageSize2 = val
                this.pageNo2 = 1
                this.stuAnalysisByTopicId()
            },
            handleCurrentChangeStu(val) {
                this.pageNo2 = val
                this.stuAnalysisByTopicId()
            },
            classChange() {
                this.stuAnalysisByTopicId()
            },
            gradeChange() {
                this.classId = '0'
                this.classOptions = []
                this.stuAnalysisByTopicId()
            },
            stuAnalysisByTopicId() {
                stuAnalysisByTopicId({
                    startDate: this.$moment(this.stuTimeRange[0]).format('YYYY-MM-DD'),
                    endDate: this.$moment(this.stuTimeRange[1]).format('YYYY-MM-DD'),
                    pageNo: this.pageNo2,
                    pageSize: this.pageSize2,
                    searchName: this.searchStuentName,
                    topicId: this.id,
                    classId: this.classId || 0,
                    gradeId: this.gradeId || 0
                })
                    .then(res => res.data)
                    .then(data => {
                        this.stuDataList = data.data.dataList
                        this.total2 = data.data.pagination.total
                    })
            },
            handleSizeChangeActive(val) {
                this.pageSize3 = val
                this.pageNo3 = 1
                this.activationAnalysis()
            },
            handleCurrentChangeActive(val) {
                this.pageNo3 = val
                this.activationAnalysis()
            },
        }
    }
</script>
<style lang="scss" scoped>
    .campusCirclelistone {
        padding: 12px;

        .top {
            border-bottom: 1px solid #e7eaec;
            padding-bottom: 10px;
        }

        .title {
            line-height: 20px;
            font-size: 16px;
            border-left: 3px solid #409eff;
            padding-left: 10px;
            margin: 15px 0;
            color: #606266;
        }
    }
</style>
