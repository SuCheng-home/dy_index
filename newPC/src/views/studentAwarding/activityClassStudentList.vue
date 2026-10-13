<template>
    <div id="noticeIndex" class="app-container calendar-list-container">
        <backtool>
            <el-button type="danger" @click="backToClass()" size="medium" v-if="reportState == 2">退回班级重新上报</el-button>
        </backtool>
        <div class="filter-container">
            评优活动：{{activityInfo.title}}
            <el-input class="search-input search-input--right"
                      size="medium"
                      placeholder="请输入学生姓名" icon="el-icon-search"
                      v-model.trim="searchTitle">
                <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
        </div>
        <div v-for="awardItem in awardList">
            <div class="section">
                <div class="section-title">
                    <span class="section-title__text">
                        {{awardItem.applyAwardName}}
                    </span>
                </div>
            </div>
            <el-table stripe :data="awardItem.studentList.filter(item => item.studentName.includes(searchTitle))" border fit highlight-current-row
                      style="width: 100%">
                <el-table-column align="center" label="学生姓名" show-overflow-tooltip>
                    <template slot-scope="scope">
                    <span>
                       {{scope.row.studentName}}
                    </span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="年级" prop="gradeName">
                </el-table-column>
                <el-table-column align="center" label="班级" prop="className">
                </el-table-column>
                <el-table-column align="center" label="班评总成绩"  prop="classScore">
                </el-table-column>
                <el-table-column align="center" label="班评结果" prop="choseAwardName">
                </el-table-column>
                <el-table-column align="center" label="操作">
                    <template slot-scope="scope">
                        <el-button size="small" type="text" @click="jumpToPage('studentDetail', {isFromStudent: 1, id, studentId: scope.row.studentId, applyAwardCode: awardItem.applyAwardCode})">查看
                        </el-button>
                    </template>
                </el-table-column>

            </el-table>
        </div>
        <el-dialog title="退回学生重新上传" :visible.sync="isShowBackCommentDialog" size="tiny" width="600px"
                   :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
            <el-form ref="backForm" :model="backForm" :rules="backFormRules">
                <el-form-item label="退回原因" label-width="100px" prop="comment">
                    <el-input v-model="backForm.comment" @blur="backForm.comment = backForm.comment.trim()"
                              auto-complete="off" type="textarea" maxlength="100" placeholder="请输入退回原因"
                              :rows="4"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="isShowBackCommentDialog = false" size="medium">取 消</el-button>
                <el-button type="primary" @click="backConfirm()" size="medium">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>


<script>
    import _ from 'lodash';
    import baseMixin from '@/mixins/baseMixin';
    import mixin from '@/mixins/windowResize';
    import {
        getReportSchStuListByClassId,
        getStuBehActivity,
        updateStuBehActivityClass
    } from '@/api/studentAwarding';

    export default {
        name: 'studentAwardingActivityClassStudentList',
        mixins: [baseMixin, mixin],
        filters: {
            trimTime(datetime){
                return datetime ? datetime.slice(0, datetime.lastIndexOf('.')) : '--';
            }
        },
        created() {
            this.init()
        },
        data() {
            return {
                classId: this.$route.query.classId,
                id: this.$route.query.id,
                activityName: this.$route.query.activityName,
                className: this.$route.query.className,
                reportState: this.$route.query.reportState,
                awardList: [],
                searchTitle: '',
                state: 0,
                dataList: [],

                activityInfo: {},

                isShowBackCommentDialog: false,
                backForm: {
                    comment: ''
                },
                backFormRules: {
                    comment: [
                        {required: true, message: "请输入退回原因", trigger: "blur"},
                    ],
                },
            }
        },
        methods: {
            init() {
                getStuBehActivity({
                    activityId: this.id
                })
                    .then(res => res.data)
                    .then(data => {
                        const awardList = JSON.parse(data.data.behProjectJson);
                        this.activityInfo = data.data;
                        const funcList = [];
                        awardList.forEach(awardItem => {
                            funcList.push( getReportSchStuListByClassId({
                                gradeId: 0,
                                classId: this.classId,
                                activityId: this.id,
                                applyAwardCode: awardItem.applyAwardCode
                            })
                                .then(res => res.data)
                                .then(data => {
                                    data.data.forEach(item => {
                                       item.applyAwardCode=awardItem.applyAwardCode
                                    });
                                    return data.data;

                                }))
                        });

                        Promise.all(funcList)
                            .then(arr => {
                                arr.forEach((item, index) => {
                                    awardList[index].chooseCount = item.filter(item => item.choseAwardCode == awardList[index].applyAwardCode).length;
                                    item.forEach(item => {

                                        item.updateTime = item.updateTime.slice(0, item.updateTime.lastIndexOf('.'));
                                        item.honTotalScoreScale = _.round(Number.parseFloat(item.honTotalScore * (this.activityInfo.classHonorScale / 100)), 2);
                                        let totalScore =0
                            if(this.activityInfo.scoringFormula==1){
                                  totalScore = item.honTotalScoreScale;
                                
                                    if(this.activityInfo.classThCurr == 1) {
                                        item.voteTotalScoreScale = _.round(Number.parseFloat(item.voteTotalScore * (this.activityInfo.classThCurrScale / 100)), 2);
                                        totalScore += item.voteTotalScoreScale;
                                    } else {
                                        item.voteTotalScoreScale = 0;
                                    }
                                    if(this.activityInfo.classStuVote == 1) {
                                        item.stuVoteTatalScoreScale = _.round(Number.parseFloat(item.stuVoteTatalScore * (this.activityInfo.classStuVoteScale / 100)), 2);
                                        totalScore += item.stuVoteTatalScoreScale;
                                    } else {
                                        item.stuVoteTatalScoreScale = 0;
                                    }
                            }else{
                                    let maxScore=0;                                   
                                    for(let i=0;i<awardList.length;i++){
                                        if(awardList[i].applyAwardCode== item.applyAwardCode){
                                            for(let j=0;j<awardList[i].conditList.length;j++){
                                                if(awardList[i].conditList[j].certTypeId==0){
                                                    maxScore=awardList[i].conditList[j].maxScore
                                                }
                                            }
                                        }
                                    }
                                    item.honTotalScoreScale = (item.honTotalMaxScore/maxScore)*this.activityInfo.classHonorScale;
                                  //荣誉
                                    totalScore =item.honTotalScoreScale||0;
                                    //老师
                                    if(this.activityInfo.classThCurr == 1) {
                                        let newnum1=JSON.parse(this.activityInfo.thCurrJson).length
                                        item.voteTotalScoreScale = _.round(Number.parseFloat((item.voteTotalScore/newnum1) * this.activityInfo.classThCurrScale), 2)||0;
                                        totalScore += (item.voteTotalScoreScale||0);
                                    } else {
                                        item.voteTotalScoreScale = 0;
                                    }
                                    //学生
                                    if(this.activityInfo.classStuVote == 1) {
                                        item.stuVoteTatalScoreScale = _.round(Number.parseFloat((item.stuVoteTatalScore/item.choseStuVoteUserCount) * this.activityInfo.classStuVoteScale), 2)||0;
                                         totalScore += (item.stuVoteTatalScoreScale||0);
                                    } else {
                                        item.stuVoteTatalScoreScale = 0;
                                    }

                            }                           
                            item.totalScore = totalScore;
                                    });
                                    awardList[index].studentList = item;
                                });
                                this.awardList = awardList;
                            })
                    })
            },
            backToClass() {
                this.isShowBackCommentDialog = true;
            },
            backConfirm() {
                this.$refs.backForm.validate(isValid => {
                    if(isValid) {
                        updateStuBehActivityClass({
                            activityId: this.id,
                            classId: this.classId,
                            batchContent: this.backForm.comment,
                            reportState: 4
                        })
                            .then(res => res.data)
                            .then(data => {
                                if(data.result) {
                                    this.$message.success('退回成功');
                                    window.setTimeout(() => {
                                        this.$router.back()
                                    }, 500);
                                } else {
                                    this.$message.error(data.msg)
                                }
                            })
                    }
                })

            }
        }
    }
</script>


<style scoped>
    .filter-container {
        height: 36px;
        padding-top: 10px;
        font-size: 20px;
        padding-bottom: 14px;
        line-height: 36px;
        box-sizing: content-box;
    }
    .section-title {
        padding: 16px 10px 16px 5px;
        background: #F9FBFF;
        margin: 0 0 10PX 0;
        color: #333333;
    }

    .section-title__text {
        border-left: 3px solid #409EFF;
        display: inline-block;
        padding-left: 5px;
        font-weight: bold;
        margin-left: 5px;
    }
</style>
