<template>
    <div id="noticeIndex" class="app-container calendar-list-container managerStudentList">
        <backtool>
            <!--            <el-button type="danger" size="medium">退回班级重新审批</el-button>-->
            <el-select @change="getList" v-model="batchState" placeholder="请选择审核状态" size="medium">
                <el-option label="全部审核状态" :value="0"></el-option>
                <el-option label="未审核" :value="1"></el-option>
                <el-option label="已审核" :value="2"></el-option>
                <el-option label="被退回" :value="3"></el-option>
            </el-select>
            <el-button v-if="isStartBeh==1" type="primary" @click="pushMessageFunc" size="medium">开启任课老师评比</el-button>
            <el-button v-if="isStartBeh==2" type="primary" @click="resetBehActivityThByClassId" size="medium">关闭任课老师评比</el-button>
            <el-input class="search-input search-input--right"
                      size="medium"
                      placeholder="请输入学生姓名" icon="el-icon-search"
                      v-model.trim="searchTitle">
                <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
        </backtool>
        <div class="filter-container">
            {{activityName}}
        </div>
        <el-table ref="table" stripe :data="dataList.filter(item => item.studentName.includes(searchTitle))" border fit highlight-current-row
                  style="width: 100%" :height="nobottommaxH - 35">
                    <el-table-column
                        type="index"
                        label="序号"
                        align="center"
                        width="100">
                    </el-table-column>
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
            <el-table-column align="center" label="报名时间">
                <template slot-scope="scope">
                    <span>{{scope.row.createTime | trimTime}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="申报奖项">
                <template slot-scope="scope">
                    <span>{{scope.row.awardList.join(',')}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="荣誉获奖总分">
                <template slot-scope="scope">
                    <div  v-if="scoringFormula==1">
                        <div v-for="(item,index) in scope.row.maxScoreList" :key="index" v-if="item">
                            {{scope.row.awardList[index]}}：{{item}}
                        </div>
                    </div>
                    <div  v-if="scoringFormula==2">
                        <div v-for="(item,index) in scope.row.maxScoreListFormulaTw" :key="index" v-if="item">
                                {{scope.row.awardList[index]}}：{{item}}
                            </div>
                    </div>
                    
                    
                </template>
            </el-table-column>
            <el-table-column v-for="(certTypeItem,indexs) in certTypeList" align="center" :label="`${certTypeItem.certType}总分`">
                <template slot-scope="scope">
                     <div v-for="(item,index) in scope.row.certTypeList[indexs].maxScoreList" :key="index" v-if="item">
                        {{scope.row.awardList[index]}}：{{item}}
                    </div>
                    <!-- <span v-if="scope.row.certTypeList.find(item => item.certTypeId == certTypeItem.certTypeId)">
                        {{scope.row.certTypeList.find(item => item.certTypeId == certTypeItem.certTypeId).score.toFixed(2)}}
                    </span> -->
                </template>
            </el-table-column>
            <el-table-column align="center" label="材料审核状态">
                <template slot-scope="scope">
                    <span>{{['草稿', '未审核', '已审核', '被退回'][scope.row.batchState]}}</span>

                </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                    <el-button size="small" type="text" v-if="scope.row.state != 3 && scope.row.state != 4" @click="jumpToPage('studentDetail', {id, studentId: scope.row.studentId, isFromManager: 1, isManagerEdit: 1, isStartBeh})">审核
                    </el-button>
                    <el-button size="small" type="text" v-else @click="jumpToPage('studentDetail', {id, studentId: scope.row.studentId, isFromManager: 1, isStartBeh})">查看
                    </el-button>
                </template>
            </el-table-column>

        </el-table>
    </div>
</template>

<script>
    import baseMixin from '@/mixins/baseMixin';
    import mixin from '@/mixins/windowResize';
    import {getManageAndOtherDepart} from '@/api/homework';
    import {
        getStuBehActivity,
        getStuBehActivityActionListByClassId,
        remindBehActivityThByClassId,resetBehActivityThByClassId
    } from '@/api/studentAwarding';
    export default {
        name: 'studentAwardingStudentActivityList',
        mixins: [baseMixin, mixin],
        filters: {
            trimTime(datetime){
                return datetime ? datetime.slice(0, datetime.lastIndexOf('.')) : '--';
            }
        },
         activated() {
            this.getList()
        },
        created() {
            getStuBehActivity({
                activityId: this.id
            })
                .then(res => res.data)
                .then(data => {
                    console.log('ai', data.data);
                    this.activityInfo = data.data;
                    
                    this.scoringFormula=data.data.scoringFormula
                    this.getList();
                });
            getManageAndOtherDepart({
                type: 4
            })
                .then(res => res.data)
                .then(data => {
                    this.allClassList = data.data;
                });
            getStuBehActivityActionListByClassId({
                activityId: this.id,
                batchState: 1,
                classId: this.classId
            })
                .then(res => res.data)
                .then(data => {
                    this.canNotify = data.data.stuList.length == 0;
                })
        },
        data() {
            return {
                isStartBeh: this.$route.query.isStartBeh,
                searchTitle: '',
                title: this.$route.query.title,
                classId: this.$route.query.classId,
                id: this.$route.query.id,
                activityName: this.$route.query.activityName,
                className: this.$route.query.className,
                batchState: 0,
                allClassList: [],
                dataList: [],
                certTypeList: [],
                canNotify: false,
                scoringFormula:""
            }
        },
        methods: {
            checkScoreValid(item) {
                const behProjectList = JSON.parse(this.activityInfo.behProjectJson);

                const totalScore = item.honTotalScore;
                let errorText = '';
                const awardCodeList = JSON.parse(item.awardJson).map(item => item.applyAwardCode);
                behProjectList.forEach(betItem => {
                    if (awardCodeList.includes(betItem.applyAwardCode)) {
                        betItem.conditList.forEach(conditItem => {
                            if (conditItem.certTypeId == 0) {
                                if (parseFloat(totalScore) < parseFloat(conditItem.score)) {
                                    errorText += `${betItem.applyAwardName}总分不符合要求；`;
                                }
                            } else {
                                console.log('conditItem', conditItem)
                                const certTypeItem = item.certTypeList.find(certTypeItem => certTypeItem.certTypeId == conditItem.certTypeId);
                                if (parseFloat(certTypeItem.score) < parseFloat(conditItem.score)) {
                                    errorText += `${conditItem.certType}分数不符合${betItem.applyAwardName}要求；`;
                                }
                            }
                        })
                    }
                });
                if(awardCodeList.find(item => item == 10002)) {
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
                 if(awardCodeList.find(item => item == 10001)) {
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
                 if(awardCodeList.find(item => item == 10003)) {
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
            getList() {
                getStuBehActivityActionListByClassId({
                    activityId: this.id,
                    batchState: this.batchState,
                    classId: this.classId
                })
                    .then(res => res.data)
                    .then(data => {
                        this.certTypeList = data.data.certTypeList;
                        data.data.stuList.forEach(item => {
                            item.awardList = JSON.parse(item.awardJson).map(item => item.applyAwardName);
                            this.checkScoreValid(item);
                        });
                        this.dataList = data.data.stuList;
                    })
            },
            pushMessageFunc() {
                this.$confirm('是否开启任课老师评比？', '开启评比', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    remindBehActivityThByClassId({
                        activityId: this.id,
                        classId: this.classId,
                        title: `${this.className} ${this.title}`
                    })
                        .then(res => res.data)
                        .then(data => {
                            if (data.result) {
                                this.$message.success('开启成功');
                                this.isStartBeh = 2;
                            } else {
                                this.$message.error(data.msg);
                            }
                        })
                });

            },
            resetBehActivityThByClassId() {
                this.$confirm('是否关闭任课老师评比？', '关闭评比', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    resetBehActivityThByClassId({
                        activityId: this.id,
                        classId: this.classId
                    })
                        .then(res => res.data)
                        .then(data => {
                            if (data.result) {
                                this.$message.success('关闭成功');
                                this.isStartBeh = 1;
                            } else {
                                this.$message.error(data.msg);
                            }
                        })
                });

            },
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
        padding-top: 14px;
        font-size: 20px;
        padding-bottom: 14px;
    }
</style>
