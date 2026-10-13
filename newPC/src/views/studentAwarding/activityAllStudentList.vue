<template>
    <div id="noticeIndex" class="app-container calendar-list-container">
        <backtool>
            <el-button
                @click="exportFunc"
                type="primary"
                size="medium"
            >导出获奖学生照片
            </el-button>
            <a :href="exportUrl" download="导出学生获奖名单" target="_blank" >
              <el-button type="primary" size="medium" icon="upload">导出学生获奖名单</el-button>
          </a>
            <el-input class="search-input search-input--right"
                      size="medium"
                      placeholder="请输入学生姓名" icon="el-icon-search" @keyup.enter.native="handleInputChange"
                      v-model.trim="searchTitle">
                <el-button slot="append" icon="el-icon-search" @click="handleInputChange"></el-button>
            </el-input>
        </backtool>
        <div class="filter-container" style="padding: 0">
            <el-tabs v-model="activeName" @tab-click="tabClickHanlder">
                <el-tab-pane v-for="(awardItem, awardIndex) in awardList" :label="`${awardItem.applyAwardName}`"
                             :name="`${awardIndex}`"></el-tab-pane>
            </el-tabs>
        </div>
        <div class="filter-container" style="padding-top: 0">
            <el-select v-model="gradeId" @change="queryClassByGradeIdFunc(true)" placeholder="请选择年级"
                       size="medium">
                <el-option :key="0" label="全部年级" :value="0">
                </el-option>
                <el-option v-for="item in allGradeList" :key="item.gradeId" :label="item.gradeName"
                           :value="item.gradeId">
                </el-option>
            </el-select>
            <span v-show="gradeId != 0">
               <el-select v-model="classId" @change="getList" placeholder="请选择班级"
                          size="medium">
                <el-option :key="0" label="全部班级" :value="0">
                </el-option>
                <el-option v-for="item in allClassList" :key="item.id" :label="item.name"
                           :value="item.id">
                </el-option>
            </el-select>
            </span>
            <el-select v-model="isClassChose" @change="getList" placeholder="请选择结果"
                       size="medium">
                <el-option label="全部结果" :value="0"></el-option>
                <el-option :label="awardList[activeName].applyAwardName" :value="2"></el-option>
            </el-select>
            <span v-show="activityInfo.behType == 2">
            <el-select v-model="isSchChose" @change="getList" placeholder="请选择结果"
                       size="medium">
            <el-option label="全部结果" :value="0"></el-option>
            <el-option :label="awardList[activeName].applyAwardName" :value="2"></el-option>
        </el-select>
                </span>
        </div>
        <div>
            <el-table ref="table" stripe :data="dataList" border fit highlight-current-row
                      style="width: 100%" :height="nobottommaxH - 135">
                <el-table-column align="center" label="学生姓名" show-overflow-tooltip>
                    <template slot-scope="scope">
                    <span>
                        {{scope.row.studentName}}
                    </span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="年级" prop="gradeName">
                </el-table-column>
                <el-table-column align="center" label="班级">
                    <template slot-scope="scope">
                        <span>{{scope.row.className}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" sortable label="班评总成绩" :sort-method="generateSortMethod('totalScore')">
                    <template slot-scope="scope">
                        <span>{{scope.row.totalScore ? scope.row.totalScore.toFixed(2) : '0.00'}}</span>
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip align="center" label="材料审核状态">
                    <template slot-scope="scope">
                        {{['', '草稿', '未审核', '已通过', '被退回'][scope.row.state]}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="班评结果" prop="choseAwardName">
                </el-table-column>
                <el-table-column align="center" sortable label="是否上传照片"  prop="stuAvatar">
                    <template slot-scope="scope">
                        <span>{{scope.row.stuAvatar ? '是' : '否'}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作">
                    <template slot-scope="scope">
                        <el-button size="small" type="text"
                                   @click="jumpToPage('studentDetail', {isFromStudent: 1, id, studentId: scope.row.studentId, applyAwardCode: awardList[activeName].applyAwardCode})">
                            查看
                        </el-button>
                    </template>
                </el-table-column>

            </el-table>
        </div>
        <div class="pagination-container">
            <el-pagination
                @size-change="sizeChangeHandler"
                @current-change="currentChangeHandler"
                :current-page.sync="pagination.pageNo"
                :page-sizes="[10, 20, 30, 50]"
                :page-size.sync="pagination.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="pagination.total"
            >
            </el-pagination>
        </div>
    </div>
</template>

<script>
    import _ from 'lodash';

    import baseMixin from '@/mixins/baseMixin';
    import mixin from '@/mixins/windowResize';
    import {
        getStuBehGradeListByUserId,
        getStuBehActivity,
        getStuBehListAllPum,
        exportStuBehActivityActionStuAvatarList
    } from '@/api/studentAwarding';
    import {queryClassByGradeId} from '@/api/system';

    export default {
        name: 'studentAwardingActivityAllStudentList',
        mixins: [baseMixin, mixin],
        filters: {
            trimTime(datetime) {
                return datetime ? datetime.slice(0, datetime.lastIndexOf('.')) : '--';
            }
        },

        data() {
            return {
                id: this.$route.query.id,
                 exportUrl: '',
                searchTitle: '',
                awardList: [],
                state: 0,
                allGradeList: [],
                allClassList: [],
                gradeId: 0,
                classId: 0,
                batchState: 0,
                dataList: [],
                activeName: 0,
                schoolItemList: [],
                schoolItemForm: {},
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
                isSchChose: 0,
                isClassChose: 0,
                activityInfo: {},
                isChangeId: true

            }
        },
        activated() {
            this.isChangeId = this.id != this.$route.query.id;
            this.id = this.$route.query.id;
            this.exportUrl = `${global.BasePath}structure/stuBeh/exportStuBehActivityActionStuList?token=${this.$store.getters.token}&activityId=${this.id}`;
            this.init();
        },
        created() {
            this.exportUrl = `${global.BasePath}structure/stuBeh/exportStuBehActivityActionStuList?token=${this.$store.getters.token}&activityId=${this.id}`;
            this.init(true);
        },
        methods: {
            exportFunc() {
                exportStuBehActivityActionStuAvatarList({
                    activityId: this.activityInfo.id,
                    classId: 0,
                    title: this.activityInfo.title
                })
                    .then(res => res.data)
                    .then(data => {
                        if(data.result) {
                            if(data.data.key) {
                                const prefixUrl = global.command === 'production' ? 'https://www.zhxiaoyuan.cn/' : 'https://api.weixiaojia.net/';
                                window.open(`${prefixUrl}thunder/archive/getArchiveByKey?archiveName=${data.data.zipName}&key=${data.data.key}&token=${this.$store.getters.token}`, "_blank");
                            } else {
                                this.$message.error('暂无数据');
                            }
                        } else {
                            this.$message.error(data.msg);
                        }
                    })
            },
            init(isChange) {
                getStuBehGradeListByUserId({
                    activityId: this.id
                })
                    .then(res => res.data)
                    .then(data => {
                        this.allGradeList = data.data;
                        if(this.isChangeId || isChange) {
                            this.gradeId = 0;
                        }
                        if (data.data.length !== 0) {
                            this.queryClassByGradeIdFunc();

                        }
                    });
                getStuBehActivity({
                    activityId: this.id
                })
                    .then(res => res.data)
                    .then(data => {

                        this.activityInfo = data.data;

                        this.awardList = JSON.parse(data.data.behProjectJson);
                        const schoolItemList = JSON.parse(data.data.elseBehJson);
                        this.schoolItemList = schoolItemList;
                        this.tabClickHanlder();
                    });
            },
            generateSortMethod(key) {
                return function (item1, item2) {
                    const value1 = item1[key] || '0.00';
                    const value2 = item2[key] || '0.00';

                    return parseFloat(value2) - parseFloat(value1);
                }
            },
            queryClassByGradeIdFunc(isChange) {
                if(this.isChangeId || isChange) {
                    this.classId = 0;
                }
                if (this.gradeId != 0) {
                    queryClassByGradeId({
                        gradeId: this.gradeId
                    })
                        .then(res => res.data)
                        .then(data => {
                            this.allClassList = data.data;
                            this.getList();
                        })
                } else {

                    this.getList();
                }
            },
            tabClickHanlder() {
                this.isClassChose = 0;
                this.isSchChose = 0;
                this.getList();
            },
            sizeChangeHandler() {
                this.pagination.pageNo = 1;
                this.getList();
            },
            currentChangeHandler() {
                this.getList();
            },
            getList() {
                if (!this.awardList[this.activeName].applyAwardCode) {
                    return;
                }
                getStuBehListAllPum({
                    classId: this.classId,
                    gradeId: this.gradeId,
                    activityId: this.id,
                    applyAwardCode: this.awardList[this.activeName].applyAwardCode,
                    batchState: this.batchState,
                    pageNo: this.pagination.pageNo,
                    pageSize: this.pagination.pageSize,
                    studentName: this.searchTitle,
                    isClassChose: this.isClassChose,
                    isSchChose: this.isSchChose,
                    choseAwardCode: (this.isClassChose == 2 || this.isSchChose == 2) ? this.awardList[this.activeName].applyAwardCode : 0,

                })
                    .then(res => res.data)
                    .then(data => {
                        data.data.dataList.forEach(item => {
                           
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
                                    for(let i=0;i<this.awardList.length;i++){
                                        if(this.awardList[i].applyAwardCode==this.awardList[this.activeName].applyAwardCode){
                                            for(let j=0;j<this.awardList[i].conditList.length;j++){
                                                if(this.awardList[i].conditList[j].certTypeId==0){
                                                    maxScore=this.awardList[i].conditList[j].maxScore
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
                        this.dataList = data.data.dataList;
                        this.pagination.total = data.data.pagination.total;
                    })
            },
            handleInputChange() {
                this.pagination.pageNo = 1;
                this.getList();
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
