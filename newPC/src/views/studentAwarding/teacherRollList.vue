<template>
    <div>
        <div v-show="isStartBeh == 2">
            <div class="app-container calendar-list-container">
                <backtool>
                    <el-button type="primary" @click="upToManager()" size="medium">完成评比并上报至班主任</el-button>
                    <el-input class="search-input search-input--right"
                              size="medium"
                              placeholder="请输入学生姓名" icon="el-icon-search"
                              v-model.trim="searchTitle">
                        <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </backtool>
                <div class="filter-container">
                    评优活动：{{activityName}}
                </div>
                <div v-for="awardItem in awardList">
                    <div class="section">
                        <div class="section-title">
                            <span class="section-title__text">{{awardItem.applyAwardName}}（{{currInfo.curriculumName}}老师您可参与投票数为{{awardItem.voteCount}}/{{awardItem.classLimitCount}}  需评价{{awardItem.handleCount}}/{{awardItem.studentList.length}}）</span>
                        </div>
                    </div>
                    <el-table stripe :data="awardItem.studentList.filter(item => item.studentName.includes(searchTitle))" border fit highlight-current-row
                              style="width: 100%">
                        <el-table-column align="center" label="学生姓名" show-overflow-tooltip>
                            <template slot-scope="scope">
                    <span >
                        {{scope.row.studentName}}
                    </span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="荣誉分数">
                            <template slot-scope="scope">
                              <span v-if="scoringFormula==1">{{scope.row.honTotalMaxScore ? scope.row.honTotalMaxScore.toFixed(2) : '0.00'}}</span>
                                <span v-if="scoringFormula==2">{{scope.row.honTotalMaxScoreFormulaTw ? (scope.row.honTotalMaxScoreFormulaTw-0).toFixed(2) : '0.00'}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="申报时间">
                            <template slot-scope="scope">
                                <span>{{scope.row.updateTime | trimTime}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="评语">
                            <template slot-scope="scope">
                                <span v-if="scope.row.stuBehActivityTh">{{scope.row.stuBehActivityTh.behContent}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip align="center" label="是否投票">
                            <template slot-scope="scope">
                                <i v-if="scope.row.stuBehActivityTh && scope.row.stuBehActivityTh.isVote == 2" class="el-icon-success" style="font-size: 16px;color: #409EFF"></i>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="操作">
                            <template slot-scope="scope">
                                <template v-if="!scope.row.stuBehActivityTh || !scope.row.stuBehActivityTh.behContent">
                                    <el-button size="small" type="text" @click="commentOrRollFunc( awardItem, scope.row)">评语
                                    </el-button>
                                </template>
                                <template v-else>
                                    <el-button size="small" type="text" @click="commentOrRollFunc( awardItem, scope.row)">编辑评语
                                    </el-button>
                                    <el-button size="small" type="text" @click="deleteComment( awardItem, scope.row)">删除评语
                                    </el-button>
                                </template>
                            </template>
                        </el-table-column>

                    </el-table>
                </div>
                <el-dialog title="教师评语" :visible.sync="isShowCommentDialog" size="tiny" width="600px"
                           :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
                    <el-form ref="commentForm" :model="commentForm" :rules="commentFormRules">
                        <el-form-item label="评语备注" label-width="100px" prop="comment">
                            <el-input v-model="commentForm.comment" @blur="commentForm.comment = commentForm.comment.trim()" auto-complete="off" type="textarea" maxlength="100" placeholder="请输入评语备注" :rows="4"></el-input>
                        </el-form-item>
                        <el-form-item label="是否投票" label-width="100px" prop="isRoll">
                            <el-switch v-model="commentForm.isRoll">
                            </el-switch>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="isShowCommentDialog = false" size="medium">取 消</el-button>
                        <el-button type="primary" @click="commentConfirm()" size="medium">确 定</el-button>
                    </div>
                </el-dialog>
            </div>
        </div>
        <div v-show="isStartBeh == 1">
            <div class="app-container calendar-list-container">
                <backtool>
                </backtool>
                <default-page Mes="暂未开启评比"></default-page>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    import baseMixin from '@/mixins/baseMixin';
    import mixin from '@/mixins/windowResize';
    import {
        getStuBehListByTh,
        getStuBehActivity,
        updateStuBehActivityTh,
        updateStuBehClassCurr
    } from '@/api/studentAwarding';
    import DefaultPage from '@/components/DefaultPage';

    export default {
        name: 'studentAwardingTeacherRollList',

        mixins: [baseMixin, mixin],
        components: {DefaultPage},
        filters: {
            trimTime(datetime){
                return datetime ? datetime.slice(0, datetime.lastIndexOf('.')) : '--';
            }
        },
        computed: {
            ...mapGetters(['userInfo'])
        },
        created() {
            this.init();
        },
        data() {
            return {
                isStartBeh: this.$route.query.isStartBeh,

                classId: this.$route.query.classId,
                id: this.$route.query.id,
                activityName: this.$route.query.activityName,
                className: this.$route.query.className,
                curriculumId: this.$route.query.curriculumId,
                awardList: [],
                currInfo: {},

                searchTitle: '',
                isShowCommentDialog: false,
                isRoll: false,
                currentAward: null,
                currentStudent: null,
                commentId: '',
                commentForm: {
                    comment: '',
                    isRoll: false
                },
                commentFormRules: {
                    comment: [
                        {required: true, message: "请输入评语备注", trigger: "blur"},
                    ],
                    isRoll: [
                        {required: true, message: "请选择是否投票", trigger: "blur"},
                    ],
                },
                scoringFormula:1,
            }
        },
        methods: {
            init() {
                getStuBehActivity({
                    activityId: this.id
                })
                    .then(res => res.data)
                    .then(data => {
                        this.scoringFormula =data.data.scoringFormula
                        this.currInfo = JSON.parse(data.data.thCurrJson).find(({curriculumId}) => curriculumId == this.curriculumId);
                        const awardList = JSON.parse(data.data.behProjectJson);
                        const funcList = [];
                        awardList.forEach(awardItem => {
                            funcList.push( getStuBehListByTh({
                                activityId: this.id,
                                applyAwardCode: awardItem.applyAwardCode,
                                classId: this.classId,
                                curriculumId: this.curriculumId,
                                voteCount: 0
                            })
                                .then(res => res.data)
                                .then(data => data.data))
                        });

                        Promise.all(funcList)
                            .then(arr => {
                                arr.forEach((item, index) => {
                                    awardList[index].studentList = item;
                                    awardList[index].handleCount = item.filter(item => item.stuBehActivityTh && item.stuBehActivityTh.behContent).length;
                                    awardList[index].voteCount = item.filter(item => item.stuBehActivityTh && item.stuBehActivityTh.isVote == 2).length;
                                });
                                this.awardList = awardList;
                            })
                    })
            },
            commentOrRollFunc(awardItem, studentItem) {
                this.currentAward = awardItem;
                this.currentStudent = studentItem;
                this.commentForm.comment = studentItem.stuBehActivityTh ? studentItem.stuBehActivityTh.behContent : '';
                this.commentForm.isRoll = studentItem.stuBehActivityTh ? studentItem.stuBehActivityTh.isVote == 2 : false;
                this.isShowCommentDialog = true;

            },
            deleteComment(awardItem, studentItem) {
                this.$confirm('确认删除后将删除评语及投票状态？', '删除评语', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.currentAward = awardItem;
                    this.currentStudent = studentItem;
                    this.commentForm.comment = studentItem.stuBehActivityTh ? studentItem.stuBehActivityTh.behContent : '';
                    this.commentForm.isRoll = studentItem.stuBehActivityTh ? studentItem.stuBehActivityTh.isVote == 2 : false;

                    const args = {
                        activityId: this.id,
                        applyAwardName: this.currentAward.applyAwardName,
                        applyAwardCode: this.currentAward.applyAwardCode,
                        behContent: '',
                        behState: 1,
                        classId: this.classId,
                        curriculumId: this.curriculumId,
                        curriculumName: this.currInfo.curriculumName,
                        isVote: 1,
                        score: 0,
                        studentId: this.currentStudent.studentId,
                    };
                    updateStuBehActivityTh(args)
                        .then(res => res.data)
                        .then(data => {
                            if(data.result) {
                                this.isShowCommentDialog = false;
                                this.$message.success('删除成功');
                                this.init();
                            } else {
                                this.$message.error(data.msg)
                            }
                        })
                });
            },
            commentConfirm() {
                new Promise(resolve => {
                    this.$refs.commentForm.validate(isValid => {
                        if(isValid) {
                            if(this.commentForm.isRoll && this.currentAward.voteCount >= this.currentAward.classLimitCount) {
                                this.$message.error('已到达投票数目上限');
                            } else {
                                resolve()
                            }
                        }
                    });
                })
                    .then(() => {
                        const args = {
                            activityId: this.id,
                            applyAwardName: this.currentAward.applyAwardName,
                            applyAwardCode: this.currentAward.applyAwardCode,
                            behContent: this.commentForm.comment,
                            behState: 2,
                            classId: this.classId,
                            curriculumId: this.curriculumId,
                            curriculumName: this.currInfo.curriculumName,
                            isVote: this.commentForm.isRoll ? 2 : 1,
                            score: this.commentForm.isRoll ?  this.currInfo.score : 0,
                            studentId: this.currentStudent.studentId,
                        };
                        updateStuBehActivityTh(args)
                            .then(res => res.data)
                            .then(data => {
                                if(data.result) {
                                    this.isShowCommentDialog = false;
                                    this.$message.success('操作成功');
                                    this.init();
                                } else {
                                    this.$message.error(data.msg)
                                }
                            })
                    });
            },
            upToManager() {
                //您还有未评学生，请填写评语后进行上报！
                let isValid = true;
                this.awardList.forEach(awardItem => {
                    awardItem.studentList.forEach(studentItem => {
                        if(!studentItem.stuBehActivityTh) {
                            isValid = false;
                        }
                    })
                });
                let notEmpty = true;
                notEmpty = this.awardList.some(awardItem => awardItem.studentList.length !== 0);

                if(!isValid) {
                    this.$message.error('您还有未评学生，请填写评语后进行上报！');
                } else if(!notEmpty) {
                    this.$message.error('暂无学生！');
                } else {
                    this.$confirm('是否确认上报至班主任？', '上报至班主任', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        updateStuBehClassCurr({
                            activityId: this.id,
                            batchContent: '',
                            classId: this.classId,
                            curriculumId: this.curriculumId,
                            reportState: 2,
                            teacherUserId: this.userInfo.id
                        })
                            .then(res => res.data)
                            .then(data => {
                                if(data.result) {
                                    this.$message.success('上报成功');
                                    window.setTimeout(() => {
                                        this.$router.back();
                                    }, 500);
                                } else {
                                    this.$message.error(data.msg)
                                }
                            })
                    });
                }

            }
        }
    }
</script>

<style scoped>
    .filter-container {
        padding-top: 10px;
        font-size: 20px;
        padding-bottom: 14px;
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
    .section-title__score {
        float: right;
    }

</style>
