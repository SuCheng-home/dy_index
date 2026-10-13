<template>
    <div>
        <div class="app-container calendar-list-container managerStudentList">
            <backtool>
                <el-button type="primary" @click="upToSchool()" size="medium">完成班级评分，上报至学校</el-button>
                <el-button v-if="activityInfo.classThCurr == 1" type="primary" @click="isShowCurrTeacherDialog = true" size="medium">管理任课老师评比</el-button>
            </backtool>
            <div class="filter-container">
                评优活动：{{activityName}}&nbsp;&nbsp;&nbsp;&nbsp;
                <span v-if="false">共<span class="link" @click="isShowCurrTeacherDialog = true">{{currTeacherList.length}}</span>名任课老师参与评分   已有<span
                    class="link"
                    @click="isShowCurrTeacherDialog = true">{{currTeacherReportList.length}}</span>名任课老师完成评分</span>
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
                        （可推荐至学校名额：{{awardItem.classLimitCount}}人  已评选{{awardItem.chooseCount}}人）
                    </span>
                    </div>
                </div>
                <el-table stripe :data="awardItem.studentList.filter(item => item.studentName.includes(searchTitle))" border
                          fit highlight-current-row
                          style="width: 100%">
                    <el-table-column align="center" label="学生姓名">
                        <template slot-scope="scope">
                      <span>
                        {{scope.row.studentName}}&nbsp;&nbsp;
                         <el-alert
                                 v-if="scope.row.scoreNotValid&&(activityInfo.isDiathAward==1)"
                                :title="'不达标：'+scope.row.errorText"
                                type="error"  :closable="false"
                                >
                            </el-alert>
                    </span>
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="报名时间" sortable prop="createTime">
                    </el-table-column>
                    <el-table-column align="center" label="申报奖项">
                        <template slot-scope="scope">
                            <span>{{awardItem.applyAwardName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="荣誉获奖分" sortable :sort-method="generateSortMethod('honTotalScoreScale')">
                        <template slot-scope="scope">
                            <span>{{scope.row.honTotalScoreScale ? scope.row.honTotalScoreScale.toFixed(2) : '0.00'}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" v-if="activityInfo.classThCurr == 1" label="教师评分" sortable :sort-method="generateSortMethod('voteTotalScoreScale')">
                        <template slot-scope="scope">
                            <span>{{scope.row.voteTotalScoreScale ? scope.row.voteTotalScoreScale.toFixed(2) : '0.00'}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" v-if="activityInfo.classStuVote == 1" label="学生投票得分" sortable :sort-method="generateSortMethod('stuVoteTatalScoreScale')">
                        <template slot-scope="scope">
                            <span>{{scope.row.stuVoteTatalScoreScale ? scope.row.stuVoteTatalScoreScale.toFixed(2) : '0.00'}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="总评成绩" sortable :sort-method="generateSortMethod('totalScore')">
                        <template slot-scope="scope">
                            <span>{{scope.row.totalScore ? parseFloat(scope.row.totalScore).toFixed(2) : '0.00'}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="班级评比结果" prop="choseAwardName">
                    </el-table-column>
                    <el-table-column align="center" label="操作">
                        <template slot-scope="scope">
                            <el-button size="small" type="text" @click="rollFunc(awardItem, scope.row)"
                                       v-if="activityInfo.classStuVote == 1">录入学生得票数
                            </el-button>
                            <el-button size="small" type="text"
                                       @click="jumpToPage('studentDetail', {isFromStudent: 1, id, studentId: scope.row.studentId, applyAwardCode: awardItem.applyAwardCode})">
                                查看
                            </el-button>
                            <el-button size="small" type="text" v-if="!scope.row.choseAwardCode"
                                       @click="awardFunc(awardItem, scope.row)">入选
                            </el-button>
                            <el-button size="small" type="text" @click="cancelAwardFunc(awardItem, scope.row)"
                                       v-else-if="scope.row.choseAwardCode == awardItem.applyAwardCode">取消入选
                            </el-button>
                            <el-button size="small" type="text" @click="jumpToPage('studentDetailExport', {id, studentId: scope.row.studentId, applyAwardCode: awardItem.applyAwardCode})">导出
                            </el-button>
                        </template>
                    </el-table-column>

                </el-table>
            </div>
            <el-dialog title="入选理由" :visible.sync="isShowAwardDialog" size="tiny" width="600px"
                       :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
                <el-form ref="awardForm" :model="awardForm" :rules="awardFormRules">
                    <el-form-item label="入选理由" label-width="100px" prop="comment">
                        <el-input v-model="awardForm.comment" @blur="awardForm.comment = awardForm.comment.trim()"
                                  auto-complete="off" type="textarea" maxlength="100"
                                  placeholder="请输入入选理由，记录材料问题和批复意见。如果班评分和自评分有差别，请务必填写" :rows="4"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="isShowAwardDialog = false" size="medium">取 消</el-button>
                    <el-button type="primary" @click="awardConfirm()" size="medium">确 定</el-button>
                </div>
            </el-dialog>
            <el-dialog :title="`录入学生得票数分值占比(${activityInfo.classStuVoteScale}%)`" :visible.sync="isShowStudentRollDialog"
                       size="tiny" width="400px"
                       :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
                <el-form ref="studentRollForm" :model="studentRollForm" :rules="studentRollFormRules">
                    <el-form-item label="参与投票人数" label-width="120px" prop="choseStuVoteUserCount">
                        <el-input-number size="small" v-model="studentRollForm.choseStuVoteUserCount"
                                         @blur="studentRollForm.choseStuVoteUserCount = studentRollForm.choseStuVoteUserCount || 0" auto-complete="off"
                                         type="textarea" :max="200" :min="0"></el-input-number>人
                    </el-form-item>
                    <el-form-item label="赞成票数" label-width="120px" prop="ticket">
                        <el-input-number size="small" v-model="studentRollForm.ticket"
                                         @blur="studentRollForm.ticket = studentRollForm.ticket || 0" auto-complete="off"
                                         type="textarea" :max="200" :min="0"></el-input-number>人
                    </el-form-item>
                    <el-form-item label="反对票数" label-width="120px">
                        0
                    </el-form-item>
                    <el-form-item label="弃权票数" label-width="120px">
                        0
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="isShowStudentRollDialog = false" size="medium">取 消</el-button>
                    <el-button type="primary" @click="rollConfirm()" size="medium">确 定</el-button>
                </div>
            </el-dialog>
            <el-dialog title="上报至学校" :visible.sync="isShowUpDialog" size="tiny" width="600px"
                       :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
                <div style="margin-bottom: 5px;">只能把符合评优条件学生上报至学校。</div>
                <div class="dialog-content">
                    <div v-for="awardItem in awardList">
                        <div class="section">
                            <div class="section-title" style="padding: 5px;">
                    <span class="section-title__text">
                        {{awardItem.applyAwardName}}
                    </span>
                            </div>
                        </div>
                        <el-table stripe
                                  :data="awardItem.studentList.filter(item => item.choseAwardCode == awardItem.applyAwardCode)"
                                  border fit highlight-current-row
                                  style="width: 100%">
                            <el-table-column align="center" label="学生姓名" show-overflow-tooltip>
                                <template slot-scope="scope">
                    <span>
                       {{scope.row.studentName}}
                    </span>
                                </template>
                            </el-table-column>
                            <!-- <el-table-column align="center" label="班评成绩" sortable prop="totalScore">
                            </el-table-column> -->
                            <el-table-column align="center" label="总评成绩" sortable >
                        <template slot-scope="scope">
                            <span>{{scope.row.totalScore ? parseFloat(scope.row.totalScore).toFixed(2) : '0.00'}}</span>
                        </template>
                    </el-table-column>
                            <el-table-column align="center" label="班级评比结果" prop="choseAwardName">
                            </el-table-column>
                            <el-table-column align="center" label="是否推荐至学校">
                                <template slot-scope="scope">
                                    <el-checkbox v-model="upStudentList" :disabled="activityInfo.behType == 1"
                                                 :label="scope.row"><span style="display: none;">1</span>
                                    </el-checkbox>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>

                <div slot="footer" class="dialog-footer">
                    <el-button @click="isShowUpDialog = false" size="medium">取 消</el-button>
                    <el-button type="primary" @click="upConfirm()" size="medium">上 报</el-button>
                </div>
            </el-dialog>
            <el-dialog title="任课老师投票情况" :visible.sync="isShowCurrTeacherDialog" size="tiny" width="600px"
                       :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
                <el-table stripe
                          height="500"
                          :data="currTeacherList"
                          border fit highlight-current-row
                          style="width: 100%">
                    <el-table-column align="center" label="老师" show-overflow-tooltip>
                        <template slot-scope="scope">
                            {{scope.row.teacherUserName}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="学科" prop="curriculumName">
                    </el-table-column>
                    <el-table-column align="center" label="状态">
                        <template slot-scope="scope">
                            <el-tag type="success" v-if="scope.row.reportState == 2" size='mini' plain>完成评比</el-tag>
                            <el-tag type="danger" v-else size='mini' plain>未完成评比</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="操作">
                        <template slot-scope="scope">
                            <el-button size="small" type="text" :disabled="scope.row.reportState != 2" @click="backToTeacher(scope.row)">退回</el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <div slot="footer" class="dialog-footer">
                    <el-button @click="isShowCurrTeacherDialog = false" size="medium">取 消</el-button>
                    <el-button type="primary" @click="isShowCurrTeacherDialog = false" size="medium">确 定</el-button>
                </div>
            </el-dialog>

            <el-dialog title="退回原因" :visible.sync="isShowBackContentDialog"
                       size="tiny" width="600px"
                       :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
                <el-form ref="backContentForm" :model="backContentForm" :rules="backContentFormRule">
                    <el-form-item label="退回原因" label-width="120px" prop="batchContent">
                        <el-input v-model="backContentForm.batchContent"
                                  @blur="backContentForm.batchContent = backContentForm.batchContent.trim()" auto-complete="off"
                                  type="textarea" :rows="4" :max="200" :min="0"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="isShowBackContentDialog = false" size="medium">取 消</el-button>
                    <el-button type="primary" @click="backToTeacherConfirm()" size="medium">确 定</el-button>
                </div>
            </el-dialog>
        </div>

    </div>

</template>

<script>
    import _ from 'lodash';
    import baseMixin from '@/mixins/baseMixin';
    import mixin from '@/mixins/windowResize';
    import {
        getPassStuListByClassId,
        getStuBehActivity,
        updateStuBehActivityAward,
        updarteStuBehActivityAction,
        getStuBehActivityCurrList,
        updateStuBehActivityClass,
        updateStuBehActivityActionList,
        updateStuBehClassCurr,
        checkStuApplyAwardChoose
    } from '@/api/studentAwarding';

    export default {
        name: 'studentAwardingStudentRollList',

        mixins: [baseMixin, mixin],
        filters: {
            trimTime(datetime) {
                return datetime ? datetime.slice(0, datetime.lastIndexOf('.')) : '--';
            }
        },
        created() {
            this.init()
        },
        data() {
            return {
                isStartBeh: this.$route.query.isStartBeh,
                classId: this.$route.query.classId,
                id: this.$route.query.id,
                activityName: this.$route.query.activityName,
                className: this.$route.query.className,
                awardList: [],
                currInfo: {},
                searchTitle: '',
                state: 0,
                dataList: [],
                currTeacherList: [],
                currTeacherReportList: [],
                currTeacherNoReportList: [],
                isShowAwardDialog: false,
                isShowCurrTeacherDialog: false,

                activityInfo: {},

                awardForm: {
                    comment: ''
                },
                awardFormRules: {
                    comment: [
                        {required: true, message: "请输入入选理由", trigger: "blur"},
                    ],
                },

                isShowStudentRollDialog: false,

                studentRollForm: {
                    ticket: 0,
                    choseStuVoteUserCount:0
                },
                studentRollFormRules: {
                    ticket: [{
                        required: true, message: '请输入赞成票数', trigger: 'blur'
                    }],
                    choseStuVoteUserCount: [{
                        required: true, message: '请输入参与投票人数', trigger: 'blur'
                    }],
                },

                isShowUpDialog: false,
                upStudentList: [],
                currentStudent: {},
                currentAward: {},
                isShowBackContentDialog: false,
                backContentForm: {
                    batchContent: ''
                },
                backContentFormRule: {
                    batchContent: [{
                        required: true, message: '请输入退回原因', trigger: 'blur'
                    }]
                },
                currentBackToTeacherItem: {}
            }
        },
        methods: {
            checkScoreValid(item, awardItem) {
                const totalScore = item.honTotalScore;
                let errorText = '';
                awardItem.conditList.forEach(conditItem => {
                    if (conditItem.certTypeId == 0) {
                        if (parseFloat(totalScore) < parseFloat(conditItem.score)) {
                            errorText += `${awardItem.applyAwardName}总分不符合要求；`;
                        }
                    } else {
                        const certTypeItem = item.certTypeList.find(certTypeItem => certTypeItem.certTypeId == conditItem.certTypeId);
                        if (parseFloat(certTypeItem.score) < parseFloat(conditItem.score)) {
                            errorText += `${conditItem.certType}分数不符合${awardItem.applyAwardName}要求；`;
                        }
                    }
                });
                if(awardItem.applyAwardCode == 10002) {
                    if(item.diathAwardJson && item.diathAwardJson.length !== 0) {
                        if(item.diathAwardJson[0] == '[') {
                            const miscAwardList = JSON.parse(item.diathAwardJson);
                            if(miscAwardList.length < 2) {
                                errorText += '三叶草素质奖数目不足；';
                            }
                        } else {
                            const miscAwardList = item.diathAwardJson.split(',');
                            if(miscAwardList.length < 2) {
                                errorText += '三叶草素质奖数目不足；';
                            }
                        }
                    }
                }
                if(awardItem.applyAwardCode == 10001) {
                    if(item.diathAwardJson && item.diathAwardJson.length !== 0) {
                        if(item.diathAwardJson[0] == '[') {
                            const miscAwardList = JSON.parse(item.diathAwardJson);
                            if(miscAwardList.length < 3) {
                                errorText += '三好学生素质奖数目不足；';
                            }
                        } else {
                            const miscAwardList = item.diathAwardJson.split(',');
                            if(miscAwardList.length < 3) {
                                errorText += '三好学生素质奖数目不足；';
                            }
                        }
                    }
                }
                if(awardItem.applyAwardCode == 10003) {
                    if(item.diathAwardJson && item.diathAwardJson.length !== 0) {
                        if(item.diathAwardJson[0] == '[') {
                            const miscAwardList = JSON.parse(item.diathAwardJson);
                            if(miscAwardList.length < 3) {
                                errorText += '优秀班干素质奖数目不足；';
                            }
                        } else {
                            const miscAwardList = item.diathAwardJson.split(',');
                            if(miscAwardList.length < 3) {
                                errorText += '优秀班干素质奖数目不足；';
                            }
                        }
                    }
                }

                if(errorText) {
                    item.scoreNotValid = true;
                    item.errorText = errorText;

                }
            },
            backToTeacher(item) {
                this.currentBackToTeacherItem = item;
                this.backContentForm.batchContent = '';
                this.isShowBackContentDialog = true;
            },
            backToTeacherConfirm() {
                this.$refs.backContentForm.validate(isValid => {
                    if(isValid) {
                        updateStuBehClassCurr({
                            activityId: this.id,
                            batchContent: this.backContentForm.batchContent,
                            classId: this.classId,
                            curriculumId: this.currentBackToTeacherItem.curriculumId,
                            reportState: 4,
                            teacherUserId: this.currentBackToTeacherItem.teacherUserId
                        })
                            .then(res => res.data)
                            .then(data => {
                                if (data.result) {
                                    this.$message.success('退回成功');
                                    this.isShowCurrTeacherDialog = false;
                                    this.isShowBackContentDialog = false;
                                    this.init();
                                } else {
                                    this.$message.error(data.msg)
                                }
                            })
                    }
                })
            },
            generateSortMethod(key) {
                return function(item1, item2) {
                    const value1 = item1[key] || '0.00';
                    const value2 = item2[key] || '0.00';

                    return parseFloat(value2) - parseFloat(value1);
                }
            },
            init() {
                getStuBehActivityCurrList({
                    activityId: this.id,
                    classId: this.classId
                })
                    .then(res => res.data)
                    .then(data => {
                        this.currTeacherList = data.data;
                        this.currTeacherReportList = data.data.filter(({reportState}) => reportState == 2);
                        this.currTeacherNoReportList = data.data.filter(({reportState}) => reportState != 2);
                    });
                getStuBehActivity({
                    activityId: this.id
                })
                    .then(res => res.data)
                    .then(data => {
                        this.currInfo = JSON.parse(data.data.thCurrJson).find(({curriculumId}) => curriculumId == this.curriculumId);
                        const awardList = JSON.parse(data.data.behProjectJson);
                        this.activityInfo = data.data;
                        const funcList = [];
                        awardList.forEach(awardItem => {
                            funcList.push(getPassStuListByClassId({
                                activityId: this.id,
                                applyAwardCode: awardItem.applyAwardCode,
                                classId: this.classId,
                                voteCount: 0
                            })
                                .then(res => res.data)
                                .then(data =>  {
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
                                        this.checkScoreValid(item, awardList[index]);

                                        item.createTime = item.createTime.slice(0, item.createTime.lastIndexOf('.'));
                                       
                                        let totalScore =0
                            if(this.activityInfo.scoringFormula==1){
                                 item.honTotalScoreScale = _.round(Number.parseFloat(item.honTotalMaxScore * (this.activityInfo.classHonorScale / 100)), 2);
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
                                    if(this.activityInfo.classStuVote == 1&&item.choseStuVoteUserCount) {
                                        item.stuVoteTatalScoreScale = _.round(Number.parseFloat((item.stuVoteTatalScore/item.choseStuVoteUserCount) * this.activityInfo.classStuVoteScale), 2)||0;
                                         totalScore += (item.stuVoteTatalScoreScale||0);
                                    } else {
                                        item.stuVoteTatalScoreScale = 0;
                                    }

                            }                           
                            item.totalScore = totalScore;
                                        // item.totalScore = parseFloat(totalScore).toFixed(2);
                                    });
                                    awardList[index].studentList = item;
                                });
                                this.awardList = awardList;
                            })
                    })
            },
            awardFunc(awardItem, studentItem) {
                if (awardItem.chooseCount >= awardItem.classLimitCount) {
                    this.$message.error('已达到入选名额限制');
                } else {
                     const args = {
                    activityId: this.id,
                    applyAwardCode:awardItem.applyAwardCode,
                    studentId:studentItem.studentId,
                };
                   checkStuApplyAwardChoose(args)
                    .then(res => res.data)
                    .then(data => {
                        if (data.result) {
                           this.currentAward = awardItem;
                            this.currentStudent = studentItem;
                            this.awardForm.comment = '';
                            this.isShowAwardDialog = true;
                        } else {
                            this.$message.error(data.msg)
                        }
                    })
                    
                }

            },
            cancelAwardFunc(awardItem, studentItem) {
                this.currentAward = awardItem;
                this.currentStudent = studentItem;
                const args = {
                    activityId: this.id,
                    classId: this.classId,
                    gradeId: this.currentStudent.gradeId,
                    studentId: this.currentStudent.studentId,
                    isClassChose: 1,
                    behClassContent: '',
                };
                updarteStuBehActivityAction(args)
                    .then(res => res.data)
                    .then(data => {
                        if (data.result) {
                            this.$message.success('取消成功');
                            this.init();
                        } else {
                            this.$message.error(data.msg)
                        }
                    })
            },
            awardConfirm() {
                this.$refs.awardForm.validate(isValid => {
                    if (isValid) {
                        this.isShowAwardDialog = false;
                        const args = {
                            activityId: this.id,
                            classId: this.classId,
                            gradeId: this.currentStudent.gradeId,
                            studentId: this.currentStudent.studentId,
                            isClassChose: 2,
                            behClassContent: this.awardForm.comment,
                            classScore: this.currentStudent.totalScore,
                            choseAwardCode: this.currentAward.applyAwardCode,
                            choseAwardName: this.currentAward.applyAwardName,
                            choseStuVoteCount: this.currentStudent.stuVoteCount,
                            choseStuVoteTatalScore: this.currentStudent.stuVoteTatalScore,
                            choseVoteTotalScore: this.currentStudent.voteTotalScore
                        };
                        updarteStuBehActivityAction(args)
                            .then(res => res.data)
                            .then(data => {
                                if (data.result) {
                                    this.$message.success('入选成功');
                                    this.init();
                                } else {
                                    this.$message.error(data.msg)
                                }
                            })
                    }
                });
            },
            rollFunc(awardItem, studentItem) {
                this.currentAward = awardItem;
                this.currentStudent = studentItem;
                this.studentRollForm.ticket = studentItem.stuVoteCount || 1;
                 this.studentRollForm.choseStuVoteUserCount = studentItem.choseStuVoteUserCount || 1;
                this.isShowStudentRollDialog = true;
            },
            rollConfirm() {
                this.isShowStudentRollDialog = false;
                updateStuBehActivityAward({
                    activityId: this.id,
                    applyAwardCode: this.currentAward.applyAwardCode,
                    stuVoteCount: this.studentRollForm.ticket,
                    stuVoteTatalScore: this.studentRollForm.ticket * this.activityInfo.stuVoteScore,
                    studentId: this.currentStudent.studentId,
                    choseStuVoteUserCount:this.studentRollForm.choseStuVoteUserCount,
                    classId: this.classId
                })
                    .then(res => res.data)
                    .then(data => {
                        if (data.result) {
                            this.$message.success('录入成功');
                            this.init();
                        } else {
                            this.$message.error(data.msg)
                        }
                    })
            },
            updateStuBehActivityClassFunc() {
                updateStuBehActivityClass({
                    activityId: this.id,
                    batchContent: '',
                    classId: this.classId,
                    reportState: 2
                })
                    .then(res => res.data)
                    .then(data => {
                        if (data.result) {
                            this.$message.success('上报成功');
                            window.setTimeout(() => {
                                this.$router.back();
                            }, 500);
                        } else {
                            this.$message.error(data.msg)
                        }
                    })
            },
            upToSchool() {
                // 您还有未评学生，请填写评语后进行上报！
                if (this.activityInfo.behType == 1) {
                    let upStudentList = [];
                    this.awardList.forEach(awardItem => {
                        upStudentList = [...upStudentList, ...awardItem.studentList.filter(item => item.choseAwardCode == awardItem.applyAwardCode)];
                    })
                    this.upStudentList = upStudentList;
                }
                this.isShowUpDialog = true;
            },
            upConfirm() {
                if (this.upStudentList.length !== 0) {
                    const args = [];
                    this.upStudentList.forEach(item => {
                        args.push({
                            activityId: this.id,
                            classId: item.classId,
                            gradeId: item.gradeId,
                            studentId: item.studentId,
                            isReportSch: 2
                        })
                    });
                    updateStuBehActivityActionList(args)
                        .then(res => res.data)
                        .then(data => {
                            if (data.result) {
                                this.isShowUpDialog = false;
                                this.updateStuBehActivityClassFunc();
                            } else {
                                this.$message.error(data.msg);
                            }
                        })

                } else {
                    this.$message.error('至少选择一个上报学生');
                }
            }
        }
    }
</script>
<style>
.managerStudentList .el-alert--error.is-light{
        padding: 0;
    }
</style>
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

    .dialog-content {
        max-height: 600px;
        overflow-y: auto;
    }
</style>
