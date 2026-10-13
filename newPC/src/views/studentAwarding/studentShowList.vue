<template>
    <div>
        <div class="app-container calendar-list-container managerStudentList">
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
                          placeholder="请输入学生姓名" icon="el-icon-search"
                          v-model.trim="searchTitle">
                    <el-button slot="append" icon="el-icon-search"></el-button>
                </el-input>
            </backtool>
            <div class="filter-container">
                评优活动：{{activityName}}
                <el-tabs v-model="activeName" @tab-click="tabClickHanlder">
                    <el-tab-pane v-for="(awardItem, awardIndex) in awardList" :label="`${awardItem.applyAwardName}(${awardItem.chooseCount}/${awardItem.studentList.length})`" :name="`${awardIndex}`"></el-tab-pane>
                </el-tabs>
            </div>
            <div>
                <el-table v-if="awardList[activeName]" stripe :data="awardList[activeName].studentList.filter(item => item.studentName.includes(searchTitle))" border fit highlight-current-row
                          style="width: 100%">
                    <el-table-column align="center" label="学生姓名">
                        <template slot-scope="scope">
                    <span >
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
                            <span>{{awardList[activeName].applyAwardName}}</span>
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
                            <span>{{scope.row.totalScore ? scope.row.totalScore.toFixed(2) : '0.00'}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" sortable label="是否上传照片" prop="stuAvatar">
                        <template slot-scope="scope">
                            <span>{{scope.row.stuAvatar ? '是' : '否'}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="班级评比结果" prop="choseAwardName">
                    </el-table-column>
                    <el-table-column align="center" label="操作">
                        <template slot-scope="scope">
                            <el-button size="small" type="text" @click="jumpToPage('studentDetail', {isFromStudent: 1, id, studentId: scope.row.studentId, applyAwardCode: awardList[activeName].applyAwardCode})">查看
                            </el-button>
                            <el-button size="small" type="text" @click="jumpToPage('studentDetailExport', {id, studentId: scope.row.studentId, applyAwardCode: awardList[activeName].applyAwardCode})">导出
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
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
        exportStuBehActivityActionStuAvatarList
    } from '@/api/studentAwarding';
    export default {
        name: 'studentAwardingStudentShowList',

        mixins: [baseMixin, mixin],
        filters: {
            trimTime(datetime){
                return datetime ? datetime.slice(0, datetime.lastIndexOf('.')) : '--';
            }
        },
        created() {
              this.exportUrl = `${global.BasePath}structure/stuBeh/exportStuBehActivityActionStuList?token=${this.$store.getters.token}&activityId=${this.id}`;
            this.init();
        },
        data() {
            return {
                isStartBeh: this.$route.query.isStartBeh,
                 exportUrl: '',
                classId: this.$route.query.classId,
                id: this.$route.query.id,
                activityName: this.$route.query.activityName,
                className: this.$route.query.className,
                curriculumId: this.$route.query.curriculumId,
                awardList: [],
                currInfo: {},
                isShowCommentDialog: false,
                activeName: 0,
                searchTitle: '',
                activityInfo: {},

            }
        },
        methods: {
            exportFunc() {
                exportStuBehActivityActionStuAvatarList({
                    activityId: this.activityInfo.id,
                    classId: this.classId,
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
            checkScoreValid(item, awardItem) {
                console.log('awardItem', awardItem);
                console.log('item', item);

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
            generateSortMethod(key) {
                return function(item1, item2) {
                    const value1 = item1[key] || '0.00';
                    const value2 = item2[key] || '0.00';

                    return parseFloat(value2) - parseFloat(value1);
                }
            },
            tabClickHanlder() {

            },
            init() {
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
                            funcList.push( getPassStuListByClassId({
                                activityId: this.id,
                                applyAwardCode: awardItem.applyAwardCode,
                                classId: this.classId,
                                voteCount: 0
                            })
                                .then(res => res.data)
                                .then(data => {
                                    data.data.forEach(item => {
                                        item.createTime = item.createTime ? item.createTime.slice(0, item.createTime.lastIndexOf('.')) : '';
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
                                                if(this.activityInfo.classStuVote == 1) {
                                                    item.stuVoteTatalScoreScale = _.round(Number.parseFloat((item.stuVoteTatalScore/item.choseStuVoteUserCount) * this.activityInfo.classStuVoteScale), 2)||0;
                                                    totalScore += (item.stuVoteTatalScoreScale||0);
                                                } else {
                                                    item.stuVoteTatalScoreScale = 0;
                                                }

                                        }                           
                                        item.totalScore = totalScore;
                                       
                                    })
                                    awardList[index].studentList = item;
                                });
                                this.awardList = awardList;
                            })
                    })
                     this.tabClickHanlder();
            },

            commentOrRollFunc() {
                this.commentForm.comment = '';
                this.isShowCommentDialog = true;
            },
            commentConfirm() {
                this.$refs.commentForm.validate(isValid => {
                    if(isValid) {
                        this.isShowCommentDialog = false;
                    }
                });
            },
            upToManager() {
                // 您还有未评学生，请填写评语后进行上报！
                this.$confirm('是否确认上报至班主任？', '上报至班主任', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {

                });
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
        padding-top: 10px;
        font-size: 20px;
        padding-bottom: 14px;
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
