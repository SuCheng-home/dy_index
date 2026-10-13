<template>
    <div id="noticeIndex" class="app-container calendar-list-container">
        <backtool>

        </backtool>
        <div class="filter-container" style="padding: 0">
            <el-tabs v-model="activeName" @tab-click="tabClickHanlder">
                <el-tab-pane v-for="(awardItem, awardIndex) in awardList" :label="`${awardItem.applyAwardName}`"
                             :name="`${awardIndex}`"></el-tab-pane>
            </el-tabs>
        </div>
        <div class="filter-container" style="padding-top: 0">
            <el-select v-model="gradeId" @change="queryClassByGradeIdFunc" placeholder="请选择年级"
                                     size="medium">
            <el-option :key="0" label="全部年级" :value="0">
            </el-option>
            <el-option v-for="item in allGradeList" :key="item.gradeId" :label="item.gradeName" :value="item.gradeId">
            </el-option>

        </el-select>
            <template v-show="gradeId != 0">
                <el-select v-model="classId" @change="getList" placeholder="请选择年级"
                                         size="medium">
                <el-option :key="0" label="全部班级" :value="0">
                </el-option>
                <el-option v-for="item in allClassList" :key="item.id" :label="item.name"
                           :value="item.id">
                </el-option>
            </el-select>
            </template>
            <el-input class="search-input search-input--right"
                      size="medium"
                      placeholder="请输入学生姓名" icon="el-icon-search" @keyup.enter.native="handleInputChange"
                      v-model.trim="searchTitle">
                <el-button slot="append" icon="el-icon-search" @click="handleInputChange"></el-button>
            </el-input>
        </div>
        <div>
            <el-table stripe :data="dataList" border fit highlight-current-row
                      style="width: 100%" :height="nobottommaxH - 25">
                <el-table-column align="center" label="学生姓名" show-overflow-tooltip>
                    <template slot-scope="scope">
                    <span>
                        {{scope.row.studentName}}
                    </span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="班级" prop="className">
                </el-table-column>
                <el-table-column align="center" label="年级">
                    <template slot-scope="scope">
                        <span>{{scope.row.gradeName}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="班评总成绩">
                    <template slot-scope="scope">
                        <span>{{parseFloat(scope.row.classScore).toFixed(2) }}</span>
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip align="center" label="班评结果" prop="choseAwardName">
                </el-table-column>
                <el-table-column show-overflow-tooltip align="center" label="校评总成绩">
                    <template slot-scope="scope">
                        {{scope.row.schScore ? parseFloat(scope.row.schScore).toFixed(2) : parseFloat(scope.row.schoolTotalScore).toFixed(2) }}
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip align="center" label="校评结果">
                    <template slot-scope="scope">
                        <span v-if="scope.row.isSchChose == 2">{{scope.row.choseAwardName}}</span>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="操作">
                    <template slot-scope="scope">
                        <el-button size="small" type="text" @click="showSchoolItem(scope.row)">录入校评分数
                        </el-button>
                        <el-button size="small" type="text"
                                   @click="jumpToPage('studentDetail', {isFromSchool: 1, id, studentId: scope.row.studentId, applyAwardCode: awardList[activeName].applyAwardCode})">查看
                        </el-button>
                        <el-button size="small" type="text" v-if="scope.row.isSchChose != 2" @click="awardFunc(scope.row)">入选
                        </el-button>
                        <el-button v-else size="small" type="text" v-else @click="cancelAwardFunc(scope.row)">取消入选</el-button>
                    </template>
                </el-table-column>

            </el-table>
        </div>
        <el-dialog title="录入校评分数" :visible.sync="isShowSchoolItemDialog" size="tiny" width="350px"
                   :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
            <el-form ref="schoolItemForm" :model="schoolItemForm" :rules="schoolItemFormRules">
                <el-form-item :label="`${schoolItem.behTypeName}(${schoolItem.behTypeScale}%)`" label-width="120px"
                              :prop="`value${index}`" v-for="(schoolItem, index) in schoolItemList">
                    <el-input-number size="small" v-model="schoolItemForm[`value${index}`]" :min="0"
                                     :max="100"></el-input-number>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="isShowSchoolItemDialog = false" size="medium">取 消</el-button>
                <el-button type="primary" @click="schoolItemConfirm()" size="medium">确 定</el-button>
            </div>
        </el-dialog>
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
    </div>
</template>

<script>
    import _ from 'lodash';
    import baseMixin from '@/mixins/baseMixin';
    import mixin from '@/mixins/windowResize';
    import {
        getStuBehGradeListByUserId,
        getStuBehActivity,
        getReportSchStuListByClassId,
        updarteStuBehActivityAction
    } from '@/api/studentAwarding';
    import {queryClassByGradeId} from '@/api/system';

    export default {
        name: 'studentAwardingActivitySchoolStudentList',
        mixins: [baseMixin, mixin],
        filters: {
            trimTime(datetime) {
                return datetime ? datetime.slice(0, datetime.lastIndexOf('.')) : '--';
            }
        },

        data() {
            return {
                _,
                id: this.$route.query.id,
                searchTitle: '',
                awardList: [],
                state: 0,
                allGradeList: [],
                allClassList: [],
                gradeId: 0,
                classId: 0,
                dataList: [],
                isShowCommentDialog: false,
                isRoll: false,
                activeName: 0,
                schoolItemList: [],
                schoolItemForm: {},
                isShowSchoolItemDialog: false,
                isShowAwardDialog: false,
                awardForm: {
                    comment: ''
                },
                awardFormRules: {
                    comment: [
                        {required: true, message: "请输入入选理由", trigger: "blur"},
                    ],
                },
                schoolItemFormRules: {},
                currentStudent: {},
            }
        },
        created() {
            getStuBehGradeListByUserId({
                activityId: this.id
            })
                .then(res => res.data)
                .then(data => {
                    this.allGradeList = data.data;
                });
            getStuBehActivity({
                activityId: this.id
            })
                .then(res => res.data)
                .then(data => {

                    this.activityInfo = data.data;

                    this.awardList = JSON.parse(data.data.behProjectJson);
                    const schoolItemList = JSON.parse(data.data.elseBehJson);
                    const schoolItemFormRules = {}, schoolItemForm = {};
                    schoolItemList.forEach((item, index) => {
                        schoolItemForm[`value${index}`] = 0;
                        schoolItemFormRules[`value${index}`] = [
                            {required: true, message: "请输入校评分数", trigger: "blur"},
                        ]
                    });
                    this.schoolItemFormRules = schoolItemFormRules;
                    this.schoolItemForm = schoolItemForm;
                    this.schoolItemList = schoolItemList;
                    this.getList();
                });
                 
        },
        methods: {
            queryClassByGradeIdFunc() {
                this.classId = 0;
                if (this.gradeId != 0) {
                    queryClassByGradeId({
                        gradeId: this.gradeId
                    })
                        .then(res => res.data)
                        .then(data => {
                            this.allClassList = data.data;
                            this.getList();
                        })
                }
            },
            tabClickHanlder() {
                this.getList();
            },
            getList() {
                 if( !this.awardList[this.activeName].applyAwardCode){
                  return;
                }
                getReportSchStuListByClassId({
                    classId: this.classId,
                    gradeId: this.gradeId,
                    activityId: this.id,
                    applyAwardCode: this.awardList[this.activeName].applyAwardCode
                })
                    .then(res => res.data)
                    .then(data => {
                        data.data.forEach(item => {
                            let schoolTotalScore = _.round(Number.parseFloat(item.honTotalMaxScore * (this.activityInfo.schHonorScale / 100)), 2);
                            if(this.activityInfo.schThCurr == 1) {
                                schoolTotalScore += _.round(Number.parseFloat(item.choseVoteTotalScore * (this.activityInfo.schThCurrScale / 100)), 2);
                            }
                            if(this.activityInfo.schStuVote == 1) {
                                schoolTotalScore += _.round(Number.parseFloat(item.choseStuVoteTatalScore * (this.activityInfo.schStuVoteScale / 100)), 2);
                            }
                            if(item.eleTypeScoreJson) {
                                JSON.parse(item.eleTypeScoreJson).forEach(item => {
                                    schoolTotalScore += _.round(Number.parseFloat(item.score * (item.behTypeScale / 100)), 2);
                                });
                            }
                            item.schoolTotalScore = schoolTotalScore;
                        });
                        this.dataList = data.data;
                    })
            },
            handleInputChange() {
                this.getList();
            },

            awardFunc(studentItem) {
                this.currentStudent = studentItem;
                this.awardForm.comment = '';
                this.isShowAwardDialog = true;

            },
            cancelAwardFunc(studentItem) {
                this.currentStudent = studentItem;
                const args = {
                    activityId: this.id,
                    classId: this.classId,
                    gradeId: this.currentStudent.gradeId,
                    studentId: this.currentStudent.studentId,
                    isSchChose: 1,
                    behSchContent: '',
                };
                updarteStuBehActivityAction(args)
                    .then(res => res.data)
                    .then(data => {
                        if (data.result) {
                            this.$message.success('取消成功');
                            this.getList();
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
                            isSchChose: 2,
                            behSchContent: this.awardForm.comment,
                            schScore: this.currentStudent.schoolTotalScore,
                        };
                        updarteStuBehActivityAction(args)
                            .then(res => res.data)
                            .then(data => {
                                if (data.result) {
                                    this.$message.success('入选成功');
                                    this.getList();
                                } else {
                                    this.$message.error(data.msg)
                                }
                            })
                    }
                });
            },
            showSchoolItem(item) {
                this.currentStudent = item;
                if(item.eleTypeScoreJson) {
                    const eleTypeScoreJson = JSON.parse(item.eleTypeScoreJson);
                    eleTypeScoreJson.forEach((item, index) => {
                        this.schoolItemForm[`value${index}`] = item.score;
                    })
                }
                this.isShowSchoolItemDialog = true;
            },
            schoolItemConfirm() {
                this.$refs.schoolItemForm.validate(isValid => {
                    if (isValid) {
                        this.isShowSchoolItemDialog = false;
                        const eleTypeScoreJson = [];
                        this.schoolItemList.forEach((item, index) => {
                            eleTypeScoreJson.push({
                                behTypeName: item.behTypeName,
                                behTypeScale: item.behTypeScale,
                                score: this.schoolItemForm[`value${index}`]
                            });
                        });
                        updarteStuBehActivityAction({
                            activityId: this.id,
                            classId: this.currentStudent.classId,
                            studentId: this.currentStudent.studentId,
                            gradeId: this.currentStudent.gradeId,
                            eleTypeScoreJson
                        })
                            .then(res => res.data)
                            .then(data => {
                                if(data.result) {
                                    this.$message.success('录入成功');
                                    this.getList();
                                } else {
                                    this.$message.error(data,msg)
                                }
                            })
                    }
                });
            }
        }
    }
</script>

<style scoped>
    .filter-container {
        padding-top: 10px;
    }

    .section-title {
        padding: 16px 10px;
        background: #ECF8FF;
        margin-bottom: 5px;
    }

    .section-title__score {
        float: right;
    }

</style>
