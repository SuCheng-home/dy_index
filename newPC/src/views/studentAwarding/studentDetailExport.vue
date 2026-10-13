<template>
    <div class="app-container calendar-list-container">
        <backtool>
            <el-button type="primary" @click="printHandler" size="medium">打印</el-button>

        </backtool>
        <div class="header">
            <div class="table" ref="print">

                <el-row :gutter="0">
                    <div class="baseinfo">
                        <div class="line line--baseinfo">
                            <el-col :span="2">
                                <div class="cell">
                                    <div class="cell__inner">姓名</div>
                                </div>
                            </el-col>
                            <el-col :span="4">
                                <div class="cell">
                                    <div class="cell__inner">{{studentDetail.studentName}}</div>
                                </div>
                            </el-col>
                            <el-col :span="2">
                                <div class="cell">
                                    <div class="cell__inner">性别</div>
                                </div>
                            </el-col>
                            <el-col :span="5">
                                <div class="cell">
                                    <div class="cell__inner">{{['', '男', '女'][studentDetail.gender]}}</div>
                                </div>
                            </el-col>
                            <el-col :span="2">
                                <div class="cell">
                                    <div class="cell__inner">所在<br/>班级</div>
                                </div>
                            </el-col>
                            <el-col :span="4">
                                <div class="cell">
                                    <div class="cell__inner">{{studentDetail.className}}</div>
                                </div>
                            </el-col>
                            <el-col :span="5">
                                <div class="cell cell--photo">
                                    <div class="photo-container">
                                        <img class="stu-avatar" :src="studentDetail.stuAvatar || 'https://cdnfile-10043692.file.myqcloud.com/vuewxcep/common_img/user_teacher_head.jpg'" />
                                    </div>
                                </div>
                            </el-col>
                        </div>
                        <div class="line line--baseinfo">
                            <el-col :span="2">
                                <div class="cell">
                                    <div class="cell__inner">出生<br/>年月</div>
                                </div>
                            </el-col>
                            <el-col :span="4">
                                <div class="cell">
                                    <div class="cell__inner">{{studentDetail.birthDate}}</div>
                                </div>
                            </el-col>
                            <el-col :span="2">
                                <div class="cell">
                                    <div class="cell__inner">民族</div>
                                </div>
                            </el-col>
                            <el-col :span="5">
                                <div class="cell">
                                    <div class="cell__inner">{{studentDetail.national}}</div>
                                </div>
                            </el-col>
                            <el-col :span="2">
                                <div class="cell">
                                    <div v-if="applyAwardCode == 10002" class="cell__inner">入队<br/>时间</div>
                                    <div v-else class="cell__inner">现任<br/>职务</div>
                                </div>
                            </el-col>
                            <el-col :span="4">
                                <div class="cell">
                                    <div class="cell__inner">
                                        <div v-if="applyAwardCode == 10002" class="cell__inner">{{studentDetail.teamTime}}</div>
                                        <div v-else class="cell__inner">{{studentDetail.positionName}}</div>
                                    </div>
                                </div>
                            </el-col>
                            <el-col :span="5">
                                <div class="cell "></div>
                            </el-col>
                        </div>
                    </div>
                    <template v-if="applyAwardCode == 10002">
                        <div class="hint">
                            <div class="line line--hint">
                                <el-col :span="24">
                                    <div class="cell">
                                        <div class="cell__inner">
                                            <div class="hint-text">本学期我全面发展，已经获得以下素质单项奖（打√）：</div>
                                        </div>
                                    </div>
                                </el-col>
                            </div>
                        </div>
                        <div class="line line--baseinfo" v-for="lineCount in Math.ceil(miscAwardNames.length / 2)">
                            <el-col :span="10">
                                <div class="cell">
                                    <div class="cell__inner">{{miscAwardNames[(lineCount - 1) * 2]}}</div>
                                </div>
                            </el-col>
                            <el-col :span="2">
                                <div class="cell" style="justify-content: center">
                                    <div class="cell__inner" v-if="studentDetail.diathAwardJson.includes(miscAwardNames[(lineCount - 1) * 2])">√</div>
                                    <div class="cell__inner" v-else></div>
                                </div>
                            </el-col>
                            <el-col :span="10">
                                <div class="cell">
                                    <div class="cell__inner">{{miscAwardNames[(lineCount - 1) * 2 + 1]}}</div>
                                </div>
                            </el-col>
                            <el-col :span="2">
                                <div class="cell" style="justify-content: center">
                                    <div class="cell__inner" v-if="studentDetail.diathAwardJson.includes(miscAwardNames[(lineCount - 1) * 2 + 1])">√</div>
                                    <div class="cell__inner" v-else></div>
                                </div>
                            </el-col>
                        </div>
                    </template>
                    <div class="hint">
                        <div class="line line--hint">
                            <el-col :span="24">
                                <div class="cell">
                                    <div class="cell__inner">
                                        <div class="hint-text">请在下面几栏填写本学期获奖情况</div>
                                        <div class="hint-text">
                                            （交纸质材料时请附以下获奖证书复印件，学校组织的集体类奖项请相关教师提供证书照片并证明，
                                            校外集体奖不用填写；
                                            证书获奖时间为{{activityInfo.classBehStartDate}}至{{activityInfo.classBehEndDate}}）
                                        </div>
                                    </div>
                                </div>
                            </el-col>
                        </div>
                    </div>
                    <div class="honor">
                        <div class="line line--honor-head">
                            <el-col :span="5">
                                <div class="cell">
                                    <div class="cell__inner">获奖类别</div>
                                </div>
                            </el-col>
                            <el-col :span="5">
                                <div class="cell">
                                    <div class="cell__inner">获奖时间</div>
                                </div>
                            </el-col>
                            <el-col :span="5">
                                <div class="cell">
                                    <div class="cell__inner">获奖名称</div>
                                </div>
                            </el-col>
                            <el-col :span="5">
                                <div class="cell">
                                    <div class="cell__inner">颁奖单位(部门)</div>
                                </div>
                            </el-col>
                            <el-col :span="4">
                                <div class="cell ">得分</div>
                            </el-col>
                        </div>
                        <div class="line line--honor" v-for="(honorItem, honorIndex) in honorTypeList">
                            <template v-for="(certItem, certIndex) in honorItem.certList">
                                <el-col :span="5">
                                    <div class="cell" :style="{
                                    position: 'relative',
                                    borderBottomWidth: certIndex == honorItem.certList.length - 1 ? '1px' : 0
                                }">
                                        <div class="cell__inner">
                                            <span v-if="certIndex == 0" :style="{
                                                display: 'block',
                                                position: 'absolute',
                                                top: `${(honorItem.certList.length * 100 - 20) / 2}px`
                                            }">{{honorItem.certType}}</span>
                                            <span v-else>&nbsp;</span>
                                        </div>
                                    </div>
                                </el-col>
                                <el-col :span="5">
                                    <div class="cell">
                                        <div class="cell__inner">{{certItem.issueDate}}</div>
                                    </div>
                                </el-col>
                                <el-col :span="5">
                                    <div class="cell">
                                        <div class="cell__inner">{{certItem.honorName}}</div>
                                    </div>
                                </el-col>
                                <el-col :span="5">
                                    <div class="cell">
                                        <div class="cell__inner">{{certItem.issueOrgan}}</div>
                                    </div>
                                </el-col>
                                <el-col :span="4">
                                    <div class="cell ">{{certItem.score ? parseFloat(certItem.score).toFixed(2) :
                                        '0.00'}}
                                    </div>
                                </el-col>
                            </template>
                        </div>
                    </div>
                    <div class="hint">
                        <div class="line line--hint">
                            <el-col :span="20">
                                <div class="cell">
                                    <div class="cell__inner">
                                        <div class="hint-text">本学期获奖总计得分</div>
                                    </div>
                                </div>
                            </el-col>
                            <el-col :span="4">
                                <div class="cell">
                                    <div class="cell__inner">
                                        {{parseFloat(getTotalScore()).toFixed(2)}}
                                    </div>
                                </div>
                            </el-col>
                        </div>
                    </div>
                    <div>
                        <div class="line line--score">
                            <el-col :span="5">
                                <div class="cell">
                                    <div class="cell__inner">
                                        班&nbsp;&nbsp;&nbsp;&nbsp;级<br/>
                                        得票数
                                    </div>
                                </div>
                            </el-col>
                            <el-col :span="19">
                                <div class="cell">
                                    <div class="cell__inner" style="width: 100%;">
                                        <div>
                                            <span v-if="stuVoteCount">{{stuVoteCount}}</span>
                                            <span v-else>&nbsp;</span>
                                        </div>
                                        <div style="text-align: right;">班主任签字：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
                                    </div>
                                </div>
                            </el-col>
                        </div>
                    </div>
                    <div>
                        <div class="line line--score">
                            <el-col :span="5">
                                <div class="cell">
                                    <div class="cell__inner">
                                        主学科<br/>
                                        教师<br/>
                                        意见
                                    </div>
                                </div>
                            </el-col>
                            <el-col :span="6">
                                <div class="cell">
                                    <div class="cell__inner" style="width: 100%;">
                                        <div>语文：{{mainTeacherInfoList[0] && mainTeacherInfoList[0].stuBehActivityTh && mainTeacherInfoList[0].stuBehActivityTh.isVote == 2 ? '已同意' : ''}}</div>
                                        <div>&nbsp;</div>
                                        <div style="text-align: right;">签字：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
                                        <div style="text-align: right;">&nbsp;&nbsp;&nbsp;&nbsp;年&nbsp;&nbsp;&nbsp;&nbsp;月&nbsp;&nbsp;&nbsp;&nbsp;日&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
                                    </div>
                                </div>
                            </el-col>
                            <el-col :span="6">
                                <div class="cell">
                                    <div class="cell__inner" style="width: 100%;">
                                        <div>数学：{{mainTeacherInfoList[1] && mainTeacherInfoList[1].stuBehActivityTh && mainTeacherInfoList[0].stuBehActivityTh.isVote == 2 ? '已同意' : ''}}</div>
                                        <div>&nbsp;</div>
                                        <div style="text-align: right;">签字：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
                                        <div style="text-align: right;">&nbsp;&nbsp;&nbsp;&nbsp;年&nbsp;&nbsp;&nbsp;&nbsp;月&nbsp;&nbsp;&nbsp;&nbsp;日&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
                                    </div>
                                </div>
                            </el-col>
                            <el-col :span="7">
                                <div class="cell">
                                    <div class="cell__inner" style="width: 100%;">
                                        <div>英语：{{mainTeacherInfoList[2] && mainTeacherInfoList[2].stuBehActivityTh && mainTeacherInfoList[0].stuBehActivityTh.isVote == 2 ? '已同意' : ''}}</div>
                                        <div>&nbsp;</div>
                                        <div style="text-align: right;">签字：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
                                        <div style="text-align: right;">&nbsp;&nbsp;&nbsp;&nbsp;年&nbsp;&nbsp;&nbsp;&nbsp;月&nbsp;&nbsp;&nbsp;&nbsp;日&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
                                    </div>
                                </div>
                            </el-col>
                        </div>
                    </div>
                    <div>
                        <div class="line line--score" v-for="(subTeacherInfoItem, index) in subTeacherInfoList">
                            <el-col :span="5">
                                <div class="cell"
                                :style="{
                                borderBottomWidth: index == subTeacherInfoList.length - 1 ? '1px' : 0,
                                position: 'relative'
                                }"
                                >
                                    <div class="cell__inner">
                                        <span v-if="index === 0"
                                              :style="{
                                                display: 'block',
                                                position: 'absolute',
                                                top: `${(subTeacherInfoList.length * 80 - 20) / 2}px`
                                            }"
                                        >
                                            综合学<br/>
                                            科教师<br/>
                                            意见
                                        </span>
                                        <span v-else>&nbsp;</span>
                                    </div>
                                </div>
                            </el-col>
                            <el-col :span="19">
                                <div class="cell">
                                    <div class="cell__inner" style="width: 100%;">
                                        <div>{{subTeacherInfoItem.curriculumName}}：{{subTeacherInfoItem.stuBehActivityTh && subTeacherInfoItem.stuBehActivityTh.isVote == 2 ? '已同意' : ''}}</div>
                                        <div>&nbsp;</div>
                                        <div style="text-align: right;">签字：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
                                    </div>
                                </div>
                            </el-col>
                        </div>
                    </div>
                    <div>
                        <div class="line line--score">
                            <el-col :span="5">
                                <div class="cell">
                                    <div class="cell__inner">
                                        班级<br />评语
                                    </div>
                                </div>
                            </el-col>
                            <el-col :span="19">
                                <div class="cell">
                                    <div class="cell__inner" style="width: 100%;">
                                        {{studentDetail.behClassContent}}
                                    </div>
                                </div>
                            </el-col>
                        </div>
                    </div>
                    <div>
                        <div class="line line--score">
                            <el-col :span="5">
                                <div class="cell">
                                    <div class="cell__inner">
                                        学校<br/>
                                        意见
                                    </div>
                                </div>
                            </el-col>
                            <el-col :span="19">
                                <div class="cell">
                                    <div class="cell__inner" style="width: 100%;">
                                        <div v-if="studentDetail.stuBehActivityClass.reportState == 2">已同意</div>
                                        <div v-else>&nbsp;</div>
                                        <div style="text-align: right;">签章：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
                                        <div style="text-align: right;">&nbsp;&nbsp;&nbsp;&nbsp;年&nbsp;&nbsp;&nbsp;&nbsp;月&nbsp;&nbsp;&nbsp;&nbsp;日&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
                                    </div>
                                </div>
                            </el-col>
                        </div>
                    </div>
                </el-row>
            </div>
        </div>
    </div>
</template>

<script>
    import moment from 'moment';
    import {mapGetters} from 'vuex';
    import {
        getStuBehActivityAction,
        getStuBehActivityActionHonorList,
        getStuBehActivity,
        getStuBehActivityThList,
        getStuApplyAward
    } from '@/api/studentAwarding';
    import {
        getSchoolHonorTitleList,
        findSchoolHonorTypeList,
        getSchoolHonorTypeIssueorganList,
        getLevelByGradeId
    } from '@/api/honour/honourGradeSet';
    import baseMixin from '@/mixins/baseMixin';

    export default {
        name: "studentAwardingStudentDetailExport",
        mixins: [baseMixin],
        computed: {
            ...mapGetters(['userInfo']),
        },
        data() {

            return {
                isStartBeh: this.$route.query.isStartBeh,

                applyAwardCode: this.$route.query.applyAwardCode,
                studentScore: [0],

                id: this.$route.query.id,
                studentId: this.$route.query.studentId,
                studentDetail: {
                    awardText: [],
                    stuBehActivityClass: {}
                },
                honorTypeList: [],
                activityInfo: {},

                currentHonorItem: {},
                allSelectedCertIds: [],
                dialogCertList: [],
                selectedCertIds: [],
                isShowHonorDetail: false,

                honorList: [],
                voteTotalScore: 0,
                stuVoteTatalScore: 0,
                stuVoteCount: 0,

                isShowDialog: false,
                isShowBackCommentDialog: false,
                teacherInfoData: [],
                teacherInfoList: [],
                elseInfoList: [],
                elseInfoData: [],

                miscAwardNames: [
                    '青松奖——学习小标兵',
                    '樱花奖——勤劳小当家',
                    '桂枝奖——快乐小书迷',
                    '梅花奖——科艺小新星',
                    '翠竹奖——岗位小能手',
                    '白杨奖——健康小达人',
                    '银杏奖——文明小天使',
                    '香樟奖——爱心小公民'
                ],
                organList: [],
                files: [],
                miscAwardList: [],
                mainTeacherInfoList: [],
                subTeacherInfoList: []
            }
        },
        created() {
            findSchoolHonorTypeList()
                .then((res) => res.data)
                .then((data) => {
                    // 证书级别honorType
                    if (data.code === 200) {
                        console.log('allHonorTypeList', data.data)
                        this.allHonorTypeList = data.data;
                    }
                });


            getStuBehActivityAction({
                activityId: this.id,
                studentId: this.studentId
            })
                .then(res => res.data)
                .then(data => {
                    data.data.awardText = JSON.parse(data.data.awardJson).map(item => item.applyAwardName);
                    if (data.data.eleTypeScoreJson) {
                        const elseInfoList = [{}];
                        const elseInfoData = [];
                        const eleTypeScoreJson = JSON.parse(data.data.eleTypeScoreJson);

                        eleTypeScoreJson.forEach((item, index) => {
                            elseInfoData.push({
                                behTypeName: item.behTypeName,
                                behTypeScale: item.behTypeScale
                            });
                            elseInfoList[0][`col${index}`] = item.score;
                        });
                        this.elseInfoData = elseInfoData;
                        this.elseInfoList = elseInfoList;
                    }
                    let miscAwardList = [];

                    if (data.data.diathAwardJson && data.data.diathAwardJson.length !== 0) {
                        if (data.data.diathAwardJson[0] == '[') {
                            miscAwardList = JSON.parse(data.data.diathAwardJson);
                            miscAwardList.forEach(item => {
                                item.photoList = item.photoList.map(src => ({
                                    src
                                }))
                            });
                        } else {
                            miscAwardList = data.data.diathAwardJson.split(',').map(title => ({
                                title,
                                photoList: []
                            }));
                        }
                    }
                    console.log('data.data', data.data)
                    this.miscAwardList = miscAwardList;
                    this.studentDetail = data.data;

                    getLevelByGradeId({
                        gradeId: this.studentDetail.gradeId
                    })
                        .then(res => res.data)
                        .then(data => {
                            this.gradeLearnLevel = data.data.level;
                            getSchoolHonorTitleList({
                                gradeLeave: this.gradeLearnLevel
                            })
                                .then(res => res.data)
                                .then(data => {
                                    // 所有荣誉证书
                                    console.log('allAwardList', data.data)
                                    this.allAwardList = data.data;
                                })
                        });
                });

            if (this.applyAwardCode) {
                getStuBehActivityThList({
                    activityId: this.id,
                    applyAwardCode: this.applyAwardCode,
                    studentId: this.studentId
                })
                    .then(res => res.data)
                    .then(data => {
                        console.log('data.data', data.data)
                        const pageData = data.data;
                        const mainTeacherInfoList = new Array(3),
                            subTeacherInfoList = [];
                        pageData.forEach(item => {
                            if(item.courseCode == 'X001') {
                                mainTeacherInfoList[0] = item;
                            } else if(item.courseCode == 'X002') {
                                mainTeacherInfoList[1] = item;
                            } else if(item.courseCode == 'X003') {
                                mainTeacherInfoList[2] = item;
                            } else {
                                subTeacherInfoList.push(item);
                            }
                        });
                        this.mainTeacherInfoList = mainTeacherInfoList;
                        this.subTeacherInfoList = subTeacherInfoList;
                    });
                getStuApplyAward({
                    activityId: this.id,
                    applyAwardCode: this.applyAwardCode,
                    studentId: this.studentId
                })
                    .then(res => res.data)
                    .then(data => {
                        const pageData = data.data;
                        console.log('pageData', pageData)
                        this.voteTotalScore = pageData.voteTotalScore;
                        this.stuVoteTatalScore = pageData.stuVoteTatalScore;
                        this.stuVoteCount = pageData.stuVoteCount;
                    });
            }

            this.init();

        },
        methods: {
            init() {
                this.allSelectedCertIds = [];
                getStuBehActivity({
                    activityId: this.id
                })
                    .then(res => res.data)
                    .then(data => {
                        data.data.classBehEndDate = moment(data.data.classBehEndDate).format('YYYY年MM月');
                        data.data.classBehStartDate = moment(data.data.classBehStartDate).format('YYYY年MM月');

                        this.activityInfo = data.data;
                        const honorTypeList = JSON.parse(data.data.honorTypeJson);
                        honorTypeList.forEach(item => {
                            item.certList = [];
                        });
                        this.honorTypeList = honorTypeList;
                        getStuBehActivityActionHonorList({
                            activityId: this.id,
                            studentId: this.studentId
                        })
                            .then(res => res.data)
                            .then(data => {
                                data.data.forEach(item => {
                                    if (typeof item.fileJson === 'string') {
                                        item.pics = JSON.parse(item.fileJson);
                                    } else {
                                        item.pics = item.fileJson;
                                    }
                                    if (item.pics && item.pics.forEach) {
                                        item.pics.forEach(item => {
                                            item.src = item.accessUrl || item.fileUrl;
                                        })
                                    }
                                    this.allSelectedCertIds.push(item.honorId);
                                    const honorObj = this.honorTypeList.find(honorItem => honorItem.certTypeId == item.certTypeId);
                                    if (honorObj) {
                                        honorObj.certList.push(item);
                                    }
                                });
                            });


                    });
            },

            getSchoolHonorTypeIssueorganListFunc(honorTypeId) {
                const honorTypeObj = this.allHonorTypeList.find(item => item.honorTypeCode == honorTypeId);
                if (honorTypeObj) {
                    getSchoolHonorTypeIssueorganList({
                        honorTypeId: honorTypeObj.id,
                        pageNo: 1,
                        pageSize: 1000,
                    })
                        .then((res) => res.data)
                        .then((data) => {
                            if (data.code === 200) {
                                let organData = data.data;
                                console.log('organData', organData);
                                this.organList = organData.schoolHonorTypeIssueorganList;
                            }
                        });
                } else {
                    console.log('无 honotTypeObj');
                }

            },
            getTotalScore() {
                let score = 0;
                this.honorTypeList.forEach(item => {
                    score += this.getScore(item);
                });
                return score;
            },
            getScore(honorItem) {
                let score = 0;
                honorItem.certList.forEach(item => {
                    score += item.score;
                });
                return score;
            },
            printHandler() {
                this.$print(this.$refs.print);
            },
        }
    }
</script>

<style scoped>
    .header {
        margin: 5px 0;
        font-size: 14px;
        background: #F9FBFF;

    }

    ul {
        list-style-type: none;
        margin: 0;
    }
    @media print {

    }
</style>
<style scoped lang="scss">
    .cell--photo {
        height: 200px;
    }

    .line--baseinfo .cell {
        box-sizing: border-box;
        height: 100px;
        text-align: center;

        &.cell--photo {
            border-bottom: 0;
        }

        .photo-container {
        }
    }

    .line--honor .cell {
        height: 100px;
    }

    .line--score .cell {
        height: 80px;
    }

    .cell {
        padding: 10px;
        border-right: 1px solid #000;
        border-bottom: 1px solid #000;
        display: flex;
        align-items: center;
        /*justify-content: center;*/
    }

    .table {
        width: 100%;
        border-top: 1px solid #000;
        border-left: 1px solid #000;
    }

    .tr--hint div {
        text-align: center;
    }

    .hint-text {
        text-align: center;
    }

    .honor {
        .line--honor-head {
            height: 50px;
        }

    }
    .cell--photo {
        position: relative;
    }
    .photo-container {
        height: 200px;
        width: 200px;
        position: absolute;
        max-width: 100%;
        top: 0;
        left: 0;
    }
    .photo-container img {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translateX(-50%) translateY(-50%);
        max-width: 100%;
        max-height: 100%;
    }

</style>
