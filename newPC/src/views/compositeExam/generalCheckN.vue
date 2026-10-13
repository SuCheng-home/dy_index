<template>
    <div class="generalCheck generalCheckN">
        <div class="el-row menu-tools" v-if="isStar==1">
            <el-button size="medium" @click="$router.back()">返回</el-button>
            <el-button type="primary" size="medium" @click="batchSave(1)" v-if="isDefaultScore">全部{{defaultScore>5?5:defaultScore}}星
            </el-button>
            <el-button type="primary" size="medium" @click="clearSave()">全部清空</el-button>
        </div>
        <div class="el-row menu-tools" v-if="isStar==2">
            <el-button size="medium" @click="$router.back()">返回</el-button>
            <el-button type="primary" size="medium" @click="batchSave(1)" v-if="isDefaultScore">
                <template v-if="Number.parseFloat(defaultScore) > 0">
                    全部{{defaultScore>totalScore?totalScore:defaultScore}}分
                </template>
                <template v-else>全部{{defaultScore}}分</template>
            </el-button>
            <el-button type="primary" size="medium" @click="batchSave(0)">全部满分</el-button>
            <el-button type="primary" size="medium" @click="clearSave()">全部清空</el-button>
        </div>
        <div class="content-wrap scrollBar" :style="`height:${nobottommaxH}px`">
            <div style="margin-top: 1.17647059em" class="card" v-for="(gradeItem,gradeIndex) in classAndGradeList" :key="gradeIndex">
                <div slot="title" class="titleSpace" @click="gradeItem.isShow=!gradeItem.isShow">
                    <span class="delta" :class="{'delta--down':gradeItem.isShow}"></span>
                    <i class="el-icon-arrow-down arrow-icon" v-show="!gradeItem.isShow"></i>
                    <i class="el-icon-arrow-up arrow-icon" v-show="gradeItem.isShow"></i>
                    <span class="grade-name">{{gradeItem.gradeName}}</span>
                </div>
                <div class="classWrap" :style="{height: gradeItem.isShow ? '400px' : 0}" v-show="gradeItem.isShow">
                    <div class="section" v-for="(classItem,classIndex) in gradeItem.classList" :key="classIndex"
                         @click="jumpTo(classItem)">
                        <div class="class-title">
                            {{classItem.className}}
                        </div>
                        <div class="class-score" v-if="isStar==1">
                            <el-rate class="star" disabled-void-color="#cccccc" v-model="classItem.score"
                                     disabled></el-rate>
                        </div>
                        <div class="class-score show-score" slot="child" v-if="isStar === 2&&classItem.score !== null">
                            <span>{{classItem.score}}分</span>
                        </div>
                        <div class="class-score" slot="child" v-if="isStar === 2&&classItem.score === null">
                            <span>暂未评分</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>
<script>
    import mixin from '@/mixins/windowResize';
    import {getDutyById, getCheckClass, batchSaveCheckData, delAllCheckAndCurDate} from '@/api/generalCheckN';

    export default {
        data() {
            return {
                dutyId: this.$route.query.dutyId,
                itemId: this.$route.query.itemId,
                defaultScore: '',//默认分
                isFeedback: null,//是否记录反馈 1-记录
                classAndGradeList: [],
                dataList: [],//存组装数据
                isStar: 1,
                totalScore: null,
                checkTime: null,
                username: '',
                isRemindClassHeader: 0,
                isDefaultScore:false
            }
        },
        created() {
            if (window.sessionStorage.getItem("generalCheckTitle")) {
                document.title = window.sessionStorage.getItem("generalCheckTitle");
            } else {
            }
            this.checkTime = this.$moment().format('YYYY-MM-DD');
        },
        mounted() {
            //值班表详情
            this.getDutyByIdFunc();
        },
        mixins: [mixin],
        methods: {
            jumpTo(classItem) {
                if (classItem.checkId === '' || classItem.checkId === null) {
                    if (this.isStar == 1) {
                        window.sessionStorage.setItem("classItem", JSON.stringify(classItem));
                        this.$router.push({
                            path: 'generalStarAdd',
                            query: {
                                dutyId: this.dutyId,
                                itemId: this.itemId,
                                isRemindClassHeader: this.isRemindClassHeader
                            }
                        })
                    } else if (this.isStar == 2) {
                        window.sessionStorage.setItem("classItem", JSON.stringify(classItem));
                        this.$router.push({
                            path: 'generalScoreAdd',
                            query: {
                                dutyId: this.dutyId,
                                itemId: this.itemId,
                                isRemindClassHeader: this.isRemindClassHeader
                            }
                        })
                    }
                } else {
                    if (this.isStar == 1) {
                        window.sessionStorage.removeItem("classItem");
                        this.$router.push({
                            path: 'generalStarAdd',
                            query: {
                                dutyId: this.dutyId,
                                itemId: this.itemId,
                                checkId: classItem.checkId,
                                isRemindClassHeader: this.isRemindClassHeader
                            }
                        })
                    } else if (this.isStar == 2) {
                        window.sessionStorage.removeItem("classItem");
                        this.$router.push({
                            path: 'generalScoreAdd',
                            query: {
                                dutyId: this.dutyId,
                                itemId: this.itemId,
                                checkId: classItem.checkId,
                                isRemindClassHeader: this.isRemindClassHeader
                            }
                        })
                    }
                }

            },
            clearSave() {
                let That = this;
                if (That.dataList.filter(item => item.id).length == 0) {
                    That.$message({
                        message: '暂无数据！',
                        type: 'error'
                    });
                    return false;
                }
                this.$confirm('确认全部清空吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    var oneCheckItem = That.dataList.filter(item => item.id).map(item => item.id);
                    delAllCheckAndCurDate({
                        checkIdList: oneCheckItem,
                        isStar: That.isStar
                    }).then(res => res.data)
                        .then(data => {
                            if (data.code == 200) {
                                That.$message({
                                    type: 'success',
                                    message: '清空成功！',
                                })
                                That.getCheckClassFunc();
                            } else {
                                That.$message({
                                    message: data.msg,
                                    type: 'warn'
                                });
                            }
                        }).catch(res => {
                        That.$message({
                            message: "清空失败！",
                            type: 'warn'
                        });
                    })
                }).catch(() => {
                });
            },
            batchSave(scoreType) {
                //scoreType2:提交全部 1:一键默认分 0:一键满分New(New新增)
                let That = this;
                // this.$confirm('确认提交么？', '提示', {
                //     type: 'warning'
                // }).then(() => {
                    if (That.isStar === 1) {
                        That.dataList.forEach((dataItem) => {
                            dataItem.score = (That.defaultScore > 5 ? 5 : That.defaultScore);
                            dataItem.scoreType = scoreType;
                            dataItem.batchContent = '';
                            dataItem.batchContentCodes = '';
                            dataItem.isRemindClassHeader = That.isRemindClassHeader;
                        });
                    }
                    if (That.isStar === 2 && scoreType == 0) {
                        That.dataList.forEach((dataItem) => {
                            dataItem.score = That.totalScore;
                            dataItem.scoreType = 0;
                            dataItem.batchContent = '';
                            dataItem.batchContentCodes = '';
                            dataItem.isRemindClassHeader = That.isRemindClassHeader;
                        });
                    } else if (That.isStar === 2 && scoreType == 1) {
                        That.dataList.forEach((dataItem) => {
                            dataItem.score = That.defaultScore;
                            dataItem.scoreType = 1;
                            dataItem.batchContent = '';
                            dataItem.batchContentCodes = '';
                            dataItem.isRemindClassHeader = That.isRemindClassHeader;
                        });
                    }
                    /*全部满分*/
                    batchSaveCheckData({
                        dataList: JSON.stringify(That.dataList)
                    }).then(res => res.data)
                        .then(data => {
                            if (data.code == 200) {
                                That.$message({
                                    type: 'success',
                                    message: '提交成功！',
                                })
                                That.getCheckClassFunc();
                            } else {
                                That.$message({
                                    message: data.msg,
                                    type: 'warn'
                                });
                            }
                        }).catch(res => {
                        That.$message({
                            message: "添加失败！",
                            type: 'warn'
                        });
                    });
                // }).catch(() => {

                // });
            },
            getCheckClassFunc() {
                getCheckClass({
                    dutyId: this.dutyId,
                    itemId: this.itemId
                }).then(res => res.data)
                    .then(data => {
                        if (data.code === 200) {
                            const checkItem = data.data.checkItem;
                            //星分类型
                            this.isStar = checkItem.isStar;
                            //总分
                            this.totalScore = checkItem.totalScore;
                            this.classGradeList = [];
                            this.dataList = [];
                            //年级班级列表
                            const argsArray = [
                                'batchContent',
                                'batchContentCodes',
                                'classId',
                                'className',
                                'classOrder',
                                'dutyId',
                                'gradeId',
                                'gradeName',
                                'gradeOrder',
                                'id',
                                'isStar',
                                'itemId',
                                'itemName',
                                'score',
                                'scoreType',
                                'teacherUserId',
                                'teacherUserName',
                                'toWork',
                                'toWorks'
                            ];
                            //组装数据
                            data.data.classAndGradeList.forEach((gradeItem) => {
                                gradeItem.classList.forEach((classItem) => {
                                    classItem.scoreList = checkItem.checkList.map((item, index) => ({
                                        checkItemId: item.id,
                                        checkItemName: item.checkName,
                                        score: classItem.scoreList[index] ? classItem.scoreList[index].score : ((this.defaultScore > item.checkScore) ? item.checkScore : this.defaultScore),
                                        newScoreMax: item.checkScore,
                                        totalScore: item.checkScore
                                    }));
                                    //值班老师
                                    const nameArray = [], stateArray = [];
                                    classItem.nameAndIsWorkList.forEach(item => {
                                        nameArray.push(item.teacherName);
                                        stateArray.push(item.isWork == '1' ? 1 : 2);
                                        item.isSelected = item.isWork === '1';
                                    });
                                    classItem.teacherUserName = nameArray.join(',');
                                    classItem.toWorks = stateArray.join(',');
                                    classItem.dutyId = this.dutyId;
                                    classItem.id = classItem.checkId || '';
                                    classItem.isStar = this.isStar;
                                    classItem.itemId = this.itemId;
                                    classItem.itemName = window.sessionStorage.getItem("generalCheckTitle");
                                    classItem.picJson = JSON.stringify(classItem.picList || []);
                                    classItem.teacherUserId = '';
                                    classItem.toWork = '';
                                    const dataItem = {};
                                    argsArray.forEach((argItem) => {
                                        dataItem[argItem] = classItem[argItem];

                                        if (argItem === 'score') {
                                            if (classItem["isStar"] === 1) {
                                                dataItem[argItem] = this.defaultScore;
                                            } else {

                                                dataItem[argItem] = classItem.score ? classItem.score : checkItem.totalScore;
                                            }

                                        }
                                    })
                                    this.dataList.push(dataItem);
                                })
                            })
                            this.classAndGradeList = data.data.classAndGradeList;
                            this.classAndGradeList.forEach((item) => {
                                this.$set(item, "isShow", true);
                            })
                        }
                    }).catch(() => {
                })
            },
            getDutyByIdFunc() {
                getDutyById({
                    dutyId: this.dutyId//值班表详情
                }).then(res => res.data)
                    .then(data => {
                        if (data.code === 200) {
                            this.defaultScore = data.data.defaultScore;
                            this.isFeedback = data.data.isFeedback;//是否记录反馈 1-记录
                            this.isRemindClassHeader = data.data.isRemindClassHeader;
                             this.isDefaultScore = data.data.isDefaultScore==1;
                            //获取检查班级与检查数据
                            this.getCheckClassFunc();
                        }
                    }).catch(() => {
                })
            }
        }

    }
</script>
<style lang="scss" scoped>
    .scrollBar {
        overflow-x: hidden;
        overflow-y: auto;

        &::-webkit-scrollbar-track-piece {
            background: #d3dce6;
        }

        &::-webkit-scrollbar {
            width: 6px;
        }

        &::-webkit-scrollbar-thumb {
            background: #99a9bf;
            border-radius: 20px;
        }
    }

    .generalCheck {
        width: 100%;
        padding: 12px;
        box-sizing: border-box;

        .content-wrap {
            padding-top: 20px;
            box-sizing: border-box;



            .titleSpace {
                height: 30px;
                background-color: #f6f6f6;
                line-height: 30px;
            }

            .classWrap {
                background: #fff;
                width: 100%;
                display: flex;
                overflow-y: auto;
                flex-wrap: wrap;
                box-sizing: border-box;

                .section {
                    width: 232px;
                    height: 99px;
                    background-color: #f6f6f6;
                    padding: 0 10px;
                    box-sizing: border-box;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    flex-direction: column;
                    overflow: hidden;
                    margin: 14px 0 0 22px;
                    cursor: pointer;
                    .class-title {
                        font-size: 14px;
                        margin-bottom: 10px;
                    }

                    .class-score {
                        font-size: 14px;
                    }

                    .show-score {
                        color: #fdaa01;
                    }
                }
            }
        }
    }

    .feedback .weui_cells_title {
        margin-top: .77em;
        margin-bottom: .3em;
        padding-left: 15px;
        padding-right: 15px;
        color: #888;
        font-size: 16px;
        word-break: break-all;
    }

    .feedback .color-block {
        display: inline-block;
        vertical-align: middle;
        width: 12px;
        height: 12px;
        background-color: #409efe;
        margin-right: 10px;
    }
    .arrow-icon {
        float: right;
        font-size: 20px;
        color: #c6c6c6;
        margin: 5px 10px 0 0;
    }
    .grade-name {
        margin-left: 10px;
        color: #409efe;
    }

    .btn-wrap {
        width: 100%;
        display: flex;
        background: #fff;
        align-items: center;
        padding: 20px 2%;

        .btn-class {
            width: 140px;
            padding-left: 14px;
            padding-right: 14px;
            background: #409efe;
            line-height: 3;
            margin-top: 0;
            color: #FFFFFF;
            font-size: 14px;
            cursor: pointer;
            box-sizing: border-box;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            border-radius: 5px;
            -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
            overflow: hidden;
            margin-right: 3%;
            text-align: center;
        }

        .btn-class.last-child {
            margin-right: 0;
        }
    }

    .menu-tools {
        border-bottom: 1px solid #e7eaec;
        padding-bottom: 10px;
    }
    .card {
        width: 70%;
        border: 1px solid #ebebeb;
        box-sizing: border-box;
    }
</style>
<style scoped>
    .star .el-rate__icon {
        font-size: 24px;
    }

    .star .el-icon-star-off {
        color: #ccc;
    }
</style>
