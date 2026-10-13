<template>
    <div class="fitnessDetail padding">
        <div class="header">
            <el-row>
                <el-col :span="24">
                    <el-button @click="goBack" type="default" size="medium">返回</el-button>
                    <el-button @click="saveInfo" type="primary" size="medium">保存</el-button>
                </el-col>
            </el-row>
        </div>
        <div class="mainContainer" :style="{'height':boxH-110+'px'}">
            <div class="mainWrap" :fitnessInfo="fitnessInfo">
                <div class="h2">
                    <span v-if="fitnessInfo.schoolYear">{{fitnessInfo.schoolYear}}学年</span>学生体质健康登记卡
                </div>
                <div class="g-title">
                    基础信息
                </div>
                <div class="basicInfo">
                    <ul class="clearfix">
                        <li>
                            <span class="title">姓名：</span>
                            <span class="txt">{{name}}</span>
                        </li>
                        <li>
                            <span class="title">性别：</span>
                            <span class="txt">{{gender|filterSex}}</span>
                        </li>
                        <li>
                            <span class="title">学号：</span>
                            <span class="txt">{{learnNum}}</span>
                        </li>
                        <li>
                            <span class="title">班级：</span>
                            <span class="txt">{{className}}</span>
                        </li>
                        <li>
                            <span class="title">出生日期：</span>
                            <span class="txt">{{birthDate}}</span>
                        </li>
                    </ul>
                </div>
                <div class="g-title">
                    体质健康信息
                </div>
                <div class="basicInfo combindScore">
                    <ul class="clearfix" v-for="(project,proIndex) in fitnessInfo.projectList" :key="proIndex">
                        <li v-for="(item,itemIndex) in secondLevelColumns[proIndex].key" :key="itemIndex">
                            <span class="title">{{secondLevelColumns[proIndex].name[itemIndex]}}：</span>
                            <span class="txt" v-if="project.projectType==1">
                <el-input size="medium" class="inputStyle" v-model="project[item]" v-if="item!=='projectLevel'"
                          maxlength="6" @keyup.native="project[item]=project[item].replace(/[^\-?\d.]/g,'')"></el-input>
                <el-select class="inputSelect" v-model="project[item]" placeholder="请选择等级" v-if="item=='projectLevel'">
                  <el-option label="肥胖" value="肥胖"></el-option>
                  <el-option label="超重" value="超重"></el-option>
                  <el-option label="正常" value="正常"></el-option>
                  <el-option label="低体重" value="低体重"></el-option>
                </el-select>  
              </span>
                            <span class="txt" v-if="project.projectType!==1&&project.projectType<8">
                <el-input size="medium" class="inputStyle" v-model="project[item]" v-if="item!=='projectLevel'"
                          maxlength="6" @keyup.native="project[item]=project[item].replace(/[^\-?\d.]/g,'')"></el-input>
                <el-select class="inputSelect" v-model="project[item]" placeholder="请选择等级" v-if="item=='projectLevel'">
                  <el-option label="优秀" value="优秀"></el-option>
                  <el-option label="良好" value="良好"></el-option>
                  <el-option label="及格" value="及格"></el-option>
                  <el-option label="不及格" value="不及格"></el-option>
                </el-select>  
              </span>

                            <span class="txt" v-if="project.projectType!==1&&project.projectType>=8">
                <el-input size="medium" class="inputStyle" v-model="project[item]" v-if="item!=='projectLevel'"
                          maxlength="6" @keyup.native="project[item]=project[item].replace(/[^\-?\d.]/g,'')"></el-input>
                <el-select class="inputSelect" v-model="project[item]" placeholder="请选择等级" v-if="item=='projectLevel'">
                  <el-option label="正常" value="正常"></el-option>
                  <el-option label="轻度视力低下" value="轻度视力低下"></el-option>
                  <el-option label="中度视力低下" value="中度视力低下"></el-option>
                  <el-option label="重度视力低下" value="重度视力低下"></el-option>
                </el-select>  
              </span>
                        </li>
                    </ul>
                </div>
                <div class="basicInfo combindScore">
                    <ul class="clearfix">
                        <li>
                            <span class="title">标准分：</span>
                            <span class="txt"><el-input size="medium" class="inputStyle"
                                                        v-model="fitnessInfo.standardScore" maxlength="6"
                                                        @keyup.native="fitnessInfo.standardScore=fitnessInfo.standardScore.replace(/[^\-?\d.]/g,'')"></el-input></span>
                        </li>
                        <li>
                            <span class="title">附加分：</span>
                            <span class="txt"><el-input size="medium" class="inputStyle"
                                                        v-model="fitnessInfo.additionalScore" maxlength="6"
                                                        @keyup.native="fitnessInfo.additionalScore=fitnessInfo.additionalScore.replace(/[^\-?\d.]/g,'')"></el-input></span>
                        </li>
                        <li>
                            <span class="title">学年总分：</span>
                            <span class="txt"><el-input size="medium" class="inputStyle"
                                                        v-model="fitnessInfo.totalScore" maxlength="6"
                                                        @keyup.native="fitnessInfo.totalScore=fitnessInfo.totalScore.replace(/[^\-?\d.]/g,'')"></el-input></span>
                        </li>
                        <li>
                            <span class="title">等级评定：</span>
                            <span class="txt">
                <el-select class="inputSelect" v-model="fitnessInfo.totalLevel" placeholder="请选择等级">
                  <el-option label="优秀" value="优秀"></el-option>
                  <el-option label="良好" value="良好"></el-option>
                  <el-option label="及格" value="及格"></el-option>
                  <el-option label="不及格" value="不及格"></el-option>
                </el-select>
              </span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    //根据学生id查询健康评价
    import {
        getStudentInfoAndCardById,
        getFitnessDetailStuRecordId,
        addFitnessByStudentId,
        getLevelByGradeId
    } from '@/api/physicalHeadlth/index';
    import mixins from '@/mixins/windowResize';

    export default {
        data() {
            return {
                fitnessInfo: {},
                studentId: this.$route.query.studentId,
                schoolId: this.$route.query.schoolId,
                schoolYear: this.$route.query.schoolYear,
                gradeId: this.$route.query.gradeId,
                classId: this.$route.query.classId,
                name: '',
                gender: '',
                learnNum: '',
                className: '',
                birthDate: '',
                type: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
                secondLevelColumns: [],
                studentresult: {},
                StuInfo: {},
                level: ''
            }
        },
        created() {
            this.getStudentInfoAndCardByIdFunc();
            getLevelByGradeId({
                gradeId: this.gradeId
            }).then(res => res.data)
                .then(data => {
                    if (data.code === 200) {
                        this.level = data.data.level;
                        if (this.level >= 1 && this.level < 3) {
                            this.type = [1, 2, 3, 4, 7, 8, 9, 10, 11, 12, 13];
                        }
                        if (this.level >= 3 && this.level < 5) {
                            this.type = [1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 12, 13];
                        }
                        if (this.level >= 5 && this.level <= 6) {
                            this.type = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
                        }
                        const secondLevelColumns = [];
                        this.type.forEach(item => {
                            switch (Number.parseInt(item)) {
                                case 1:
                                    secondLevelColumns.push({
                                        name: ['身高(cm)', '体重(kg)', '体重评分', '体重等级'],
                                        key: ['projectValue', 'releaseValue', 'projectScore', 'projectLevel']
                                    })
                                    break;
                                case 2:
                                    secondLevelColumns.push({
                                        name: ['肺活量(ml)', '肺活量评分', '肺活量等级'],
                                        key: ['projectValue', 'projectScore', 'projectLevel']
                                    })
                                    break;
                                case 3:
                                    secondLevelColumns.push({
                                        name: ['50米跑(秒)', '50米跑评分', '50米跑等级'],
                                        key: ['projectValue', 'projectScore', 'projectLevel']
                                    })
                                    break;
                                case 4:
                                    secondLevelColumns.push({
                                        name: ['坐位体前屈(cm)', '坐位体前屈评分', '坐位体前屈等级'],
                                        key: ['projectValue', 'projectScore', 'projectLevel']
                                    })
                                    break;
                                case 5:
                                    secondLevelColumns.push({
                                        name: ['1分钟仰卧起坐(次)', '1分钟仰卧起坐评分', '1分钟仰卧起坐等级'],
                                        key: ['projectValue', 'projectScore', 'projectLevel']
                                    })
                                    break;
                                case 6:
                                    secondLevelColumns.push({
                                        name: ['50米*8往返跑(秒)', '50米*8往返跑评分', '50米*8往返跑等级'],
                                        key: ['projectValue', 'projectScore', 'projectLevel']
                                    })
                                    break;
                                case 7:
                                    secondLevelColumns.push({
                                        name: ['一分钟跳绳(次)', '一分钟跳绳评分', '一分钟跳绳等级', '一分钟跳绳附加分'],
                                        key: ['projectValue', 'projectScore', 'projectLevel', 'additionalScore']
                                    });
                                    break;
                                case 8:
                                    secondLevelColumns.push({
                                        name: ['左眼裸眼视力', '左眼裸眼视力等级'],
                                        key: ['projectValue', 'projectLevel']
                                    })
                                    break;
                                case 9:
                                    secondLevelColumns.push({
                                        name: ['右眼裸眼视力', '右眼裸眼视力等级'],
                                        key: ['projectValue', 'projectLevel']
                                    })
                                    break;
                                case 10:
                                    secondLevelColumns.push({
                                        name: ['左眼屈光不正'],
                                        key: ['projectValue']
                                    })
                                    break;
                                case 11:
                                    secondLevelColumns.push({
                                        name: ['右眼屈光不正'],
                                        key: ['projectValue']
                                    })
                                    break;
                                case 12:
                                    secondLevelColumns.push({
                                        name: ['左眼串镜'],
                                        key: ['projectValue']
                                    })
                                    break;
                                case 13:
                                    secondLevelColumns.push({
                                        name: ['右眼串镜'],
                                        key: ['projectValue']
                                    })
                                default:
                                    break;
                            }
                        })
                        this.secondLevelColumns = secondLevelColumns;
                        //根据学生id获取学生信息
                        this.getFitnessDetailStuRecordIdFunc();
                    }
                })

        },
        mixins: [mixins],
        mounted() {

        },
        filters: {
            filterSex(val) {
                if (val) {
                    switch (Number(val)) {
                        case 0:
                            return '未知';
                            break;
                        case 1:
                            return "男";
                            break;
                        case 2:
                            return "女";
                            break;
                        default:
                            break;
                    }
                }
            }
        },
        methods: {
            // proving(item){
            //   item=item.replace(/[^\-?\d.]/g,'');
            //   this.fitnessInfo.standardScore=item;
            // },
            saveInfo() {
                let flag = false;
                this.fitnessInfo.projectList.forEach((item, itemIndex) => {
                    if (item.projectValue !== '' || item.releaseValue !== '' || item.projectScore !== '' || item.projectLevel !== '') {
                        flag = true;
                    }
                })
                if (!flag) {
                    this.$message({
                        type: 'warning',
                        message: '请输入学生体质健康信息!'
                    });
                    return false;
                }
                this.fitnessInfo.projectList.forEach((item) => {
                    delete item.id;
                    delete item.fitnessId;
                    delete item.isDelete;
                    delete item.schoolId;
                })
                let lastResult = {
                    additionalScore: this.fitnessInfo.additionalScore,
                    birthday: this.StuInfo.birthDate ? this.StuInfo.birthDate : '',
                    classId: this.StuInfo.classId,
                    className: this.StuInfo.className,
                    learnNum: this.StuInfo.learnNum,
                    name: this.StuInfo.name,
                    projectList: this.fitnessInfo.projectList,//
                    schoolYear: this.schoolYear,
                    sex: this.StuInfo.gender,
                    standardScore: this.fitnessInfo.standardScore,
                    studentId: this.StuInfo.id,
                    studentRecordId: this.StuInfo.learnJi,
                    totalLevel: this.fitnessInfo.totalLevel,
                    totalScore: this.fitnessInfo.totalScore
                }
                this.studentresult = lastResult;

                addFitnessByStudentId(this.studentresult).then(res => res.data)
                    .then(data => {
                        if (data.code === 200) {
                            this.$message({
                                type: 'success',
                                message: '保存成功!'
                            });
                            this.$router.push({
                                path: 'studentList',
                                query: {
                                    gradeId: this.gradeId,
                                    classId: this.classId
                                }
                            })
                        }
                    }).catch(() => {
                })
            },
            getStudentInfoAndCardByIdFunc() {
                getStudentInfoAndCardById({
                    schoolId: this.schoolId,
                    searchType: '',
                    studentId: this.studentId,
                }).then(res => res.data)
                    .then(data => {
                        if (data.code === 200) {
                            if (data.data) {
                                let StuInfo = data.data.studentInfo;
                                this.StuInfo = StuInfo;
                                this.name = StuInfo.name;
                                this.gender = StuInfo.gender;
                                this.learnNum = StuInfo.learnNum;
                                this.className = StuInfo.className;
                                this.birthDate = StuInfo.birthDate;
                            }
                        }
                    }).catch(() => {
                })
            },
            getFitnessDetailStuRecordIdFunc() {
                getFitnessDetailStuRecordId({
                    schoolId: this.schoolId,
                    schoolYear: this.schoolYear,
                    studentId: this.studentId
                }).then(res => res.data)
                    .then(data => {
                        if (data.code === 200) {
                            let fitnessData = data.data;
                            this.fitnessInfo = fitnessData;
                            if (this.fitnessInfo.projectList.length !== 0) {
                                if (this.fitnessInfo.projectList.length > this.type.length) {
                                    let flags = [];
                                    this.fitnessInfo.projectList.forEach((subItem, subIndex) => {
                                        if (this.type.indexOf(subItem.projectType) == -1) {
                                            flags.unshift(subIndex);
                                        }
                                    })
                                    flags.forEach((flagItem, flagIndex) => {
                                        this.fitnessInfo.projectList.splice(flagItem, 1);
                                    })
                                }
                                if (this.fitnessInfo.projectList.length < this.type.length) {
                                    const convArr = this.type.map(item => {
                                        const xdX = this.fitnessInfo.projectList.filter(j_item => {
                                            return item == j_item.projectType
                                        })[0]
                                        if (xdX) {
                                            return xdX
                                        } else {
                                            return {
                                                additionalScore: '',
                                                projectType: item,
                                                projectValue: '',
                                                releaseValue: '',
                                                projectScore: '',
                                                projectLevel: ''
                                            }
                                        }
                                    })
                                    this.fitnessInfo.projectList = convArr;
                                    // return false;
                                }
                            }
                            if (this.fitnessInfo.projectList.length == 0) {
                                this.type.forEach(item => {
                                    this.fitnessInfo.projectList.push({
                                        additionalScore: '',
                                        projectType: item,
                                        projectValue: '',
                                        releaseValue: '',
                                        projectScore: '',
                                        projectLevel: ''
                                    })
                                })
                            }
                        }
                    }).catch(() => {
                })
            },
            goBack() {
                this.$router.push({
                    path: 'studentList',
                    query: {
                        gradeId: this.gradeId,
                        classId: this.classId
                    }
                })
            }
        }
    }
</script>
<style lang="scss" scoped>
    ul, li {
        list-style: none;
    }

    .clearfix:after {
        content: '';
        display: block;
        height: 0;
        clear: both;
        visibility: hidden;
    }

    .padding {
        padding:12px;
        box-sizing: border-box;
    }

    .fitnessDetail {
        .header {
            padding-bottom: 10px;
            border-bottom: 1px solid #e7eaec;
            margin-bottom: 0px;
        }

        .mainContainer {
            width: 100%;
            overflow-x: hidden;
            overflow-y: auto;
            padding: 20px 0;
            box-sizing: border-box;
        }

        .mainWrap {
            width: 920px;
            height: 100%;

            margin: 0 auto;

            .h2 {
                font-size: 26px;
                text-align: center;
                font-weight: 700;
                position: relative;
                padding-top: 10px;
                margin-bottom: 20px;
            }

            .g-title {
                position: relative;
                height: 40px;
                line-height: 40px;
                font-size: 20px;
                font-weight: 700;
                padding-left: 12px;
            }

            .g-title:before {
                content: '';
                position: absolute;
                left: 0;
                display: block;
                width: 4px;
                height: 20px;
                top: 10px;
                background: #409EFF;
            }

            .title {
                //font-weight: bold;
                color: #333;
            }

            .txt {
                color: #5f5f5f;
            }

            .basicInfo {
                ul {
                    width: 100%;
                    padding: 10px 30px;
                    box-sizing: border-box;
                    box-sizing: border-box;
                }

                li {
                    float: left;
                    width: 33.3%;
                    padding: 5px 5px;
                    box-sizing: border-box;
                    margin-bottom: 16px;
                }
            }

            .combindScore {
                ul {
                    box-sizing: border-box;
                    border-bottom: 1px solid #e7eaec;

                    .title {
                        display: block;
                        float: left;
                        line-height: 36px;
                        width: 150px;
                        text-align: right;
                        white-space: nowrap;
                    }

                    .txt {
                        display: block;
                        float: left;
                        width: 120px;
                    }
                }
            }

            .inputStyle {
                width: 100%;
            }

            .inputSelect {
                width: 100%;
            }
        }
    }
</style>

