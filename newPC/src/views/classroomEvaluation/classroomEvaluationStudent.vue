<template>
    <div class="classroomEvaluationStudent">
        <div class="header">
            <term-grade-class-selector :isGradeShowAll='true' :queryArgs="queryArgs" @input="queryTeacherCourseListTerm()" ref="selector"
                                       v-model="obj"></term-grade-class-selector>
            <el-select class="filter-item" size="medium" v-model="currId" placeholder="请选择科目"
                       @change="classBehEvalCurrBehTypeStuScores()">
                <el-option v-for="item in Courselist" :key="item.id" :label="item.name"
                           :value="item.id"></el-option>
            </el-select>
            <el-button type="primary" size="medium"   @click="classroomEvaluationImport()">导入
            </el-button>
            <el-button type="primary" size="medium" @click="exportExcel('#outTable', obj.className+currName+'.xlsx')"
                         v-if="datalist.length>0">导出
            </el-button>
              <el-button type="primary" size="medium" @click="InitialScore()">期初分数设置
            </el-button>
        </div>
        <div class="schoolWrap scrollStyle">
            <div class="checkbox-box" v-if="behaviorTypeList.length>0">
                <el-checkbox v-model="is[index]" :key="index" v-for="(item,index) in behaviorTypeList"
                             @change="changefun()">{{item.title}}
                </el-checkbox>
            </div>
            <el-table :data="datalist" border stripe :height="maxH" ref="table">
                <el-table-column fixed prop="studentNo" label="学号" sortable align="center"
                                 min-width="100"></el-table-column>
                <el-table-column fixed prop="studentName" label="姓名" align="center"
                                 min-width="100"></el-table-column>
                <el-table-column sortable :prop="`stuScoreStringList${index}`" :key="index"
                                 v-for="(item,index) in behaviorTypeList" :label="item.title" min-width="135"
                                 align="center" v-if="is[index]">
                    <template slot-scope="scope">
                        <span class="red" v-if="item.type==1"> {{scope.row.stuScoreStringList[index]}}</span>
                        <span class="green" v-if="item.type==0"> {{scope.row.stuScoreStringList[index]}}</span>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" prop="stuScore" align="center" label="得分总计" sortable
                                 min-width="100">
                    <template slot-scope="scope">
                        <el-button
                            @click="classroomEvaluationStatisticalchart(scope.row.stuScoreStringList,scope.row.studentId,scope.row.studentName)"
                            type="text" size="small">{{scope.row.stuScore}}
                        </el-button>
                    </template>
                </el-table-column>
                 <el-table-column fixed="right"  align="center" label="期初分" min-width="100">
                    <template slot-scope="scope">
                      {{scope.row.initScore}}
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div id="outTable" style="display: none;">
            <el-table :data="datalist">
                <el-table-column prop="studentNo" label="学号" align="center" min-width="100"></el-table-column>
                <el-table-column prop="studentName" label="姓名" align="center" min-width="100"></el-table-column>
                <el-table-column :key="index" v-for="(item,index) in behaviorTypeList" :label="item.title"
                                 min-width="135" align="center" v-if="is[index]">
                    <template slot-scope="scope">
                        <span class="red" v-if="item.type==1"> {{scope.row.stuScoreStringList[index]+''}}</span>
                        <span class="green"
                              v-if="item.type==0"> {{scope.row.stuScoreStringList[index]+''}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="得分总计" min-width="100">
                    <template slot-scope="scope">
                        <el-button @click="classroomEvaluationStatisticalchart(scope.row.studentId)" type="text"
                                   size="small">{{scope.row.stuScore+''}}
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="期初分" min-width="100">
                    <template slot-scope="scope">
                      {{scope.row.initScore}}
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script>
    import mixins from '@/mixins/windowResize';
    import baseMixin from '@/mixins/baseMixin';
    import TermGradeClassSelector from "@/components/TermGradeClassSelector";
    import {possessRole} from "@/api/classroomEvaluationtwo";
    import {
        getSchoolTimeAllList,
        queryTeacherCourseListTerm,
        classBehEvalCurrBehTypeStuScore
    } from '@/api/classroomEvaluation';

    export default {
        data() {
            return {
                schoolName: '',
                schoolTimeCode: '',
                classId: '',
                currId: '',
                schoolYearList: [],
                startDate: '',
                endDate: '',
                classlist: [],
                Courselist: [],
                datalist: [],
                behaviorTypeList: [],
                is: [],
                daterange: ['', ''],
                timer: null,
                mybehaviorTypeList: [],
                queryArgs: {
                    all: false, //所有班级年级
                    manager: true, //班主任
                    notlimit: false, //所有班级年级
                    submanager: true, //副班主任
                    teacher: true //普通所交
                },
                obj: {
                    termId: "",
                    duration: ["", ""],
                    gradeId: "",
                    classId: "",
                    className:''
                },
                currName:''
            }
        },
        created() {
            possessRole(231).then(res => {
        this.queryArgs.all=res.data.data.result;
     this.queryArgs.notlimit=res.data.data.result;
     this.queryArgs.manager=!res.data.data.result;
     this.queryArgs.submanager=!res.data.data.result;  
     this.queryArgs.teacher=!res.data.data.result; 
     this.queryTeacherCourseListTerm();
     //学期列表
            getSchoolTimeAllList().then(res => res.data)
                .then(data => {
                    if (data.code === 200) {
                        this.schoolYearList = data.data;
                    }
                })
      });
            
        },
        mixins: [mixins, baseMixin],
        components: {TermGradeClassSelector},
        mounted() {
            this.$nextTick(() => {
                this.timer = setTimeout(() => {
                    this.$refs.table.doLayout()
                }, 300)
            })
        },
        beforeDestroy() {
            clearTimeout(this.timer);
        },
        methods: {
            //导入
            classroomEvaluationImport() {
                this.$router.push({
                    path: "classroomEvaluationImport",
                    query: {}
                });
            },
            InitialScore() {
                this.$router.push({
                    path: "InitialScore"
                });
            },

            //科目列表
            queryTeacherCourseListTerm() {
                this.currId = '';
                this.Courselist = [];
                let schoolItem = {};
                if(this.obj.termId){
                     for (let i = 0; i < this.schoolYearList.length; i++) {
                    if (this.schoolYearList[i].id == this.obj.termId) {
                        schoolItem = this.schoolYearList[i]
                    }
                }
                 queryTeacherCourseListTerm({
                        classId: this.obj.classId||0,
                        gradeId: this.obj.gradeId||0,
                        currentTerm: schoolItem.isCurrent == 1,
                        school: false,
                        termId: this.obj.termId
                    }).then(res => res.data).then(data => {
                        if (data.code === 200) {
                            this.Courselist = data.data;
                            if (data.data.length > 0) {
                                this.currId = data.data[0].id;
                            } else {
                                this.currId = ''
                            }
                            this.dataList = [];
                            this.behaviorTypeList = [];
                            this.classBehEvalCurrBehTypeStuScores();
                        }
                    })

                }
               
            },
            //获取列表
            classBehEvalCurrBehTypeStuScores() {
                this.datalist = [];
                this.startDate = this.$moment(this.obj.duration[0]).format('YYYY-MM-DD'); //时间
                this.endDate = this.$moment(this.obj.duration[1]).format('YYYY-MM-DD'); //时间
                if (this.currId == '') {
                    return
                }
               for(let i=0;i<this.Courselist.length;i++){
                   if(this.currId ==this.Courselist[i].id){
                       this.currName = this.Courselist[i].name
                   }
               }
                classBehEvalCurrBehTypeStuScore(this.obj.classId, this.currId, this.obj.termId, this.startDate, this.endDate,this.obj.gradeId).then(res => res.data).then(data => {
                    if (data.code === 200) {
                        this.datalist = data.data.behEvalStuList;
                        this.mybehaviorTypeList = data.data.behaviorTypeList;
                        for (let i = 0; i < data.data.behaviorTypeList.length; i++) {
                            this.is.push(true);
                            if (data.data.behaviorTypeList[i].type == 0) {
                                data.data.behaviorTypeList[i].title = data.data.behaviorTypeList[i].title + '(加)';
                            } else {
                                data.data.behaviorTypeList[i].title = data.data.behaviorTypeList[i].title + '(减)';
                            }

                        }
                        this.behaviorTypeList = data.data.behaviorTypeList;
                        this.$nextTick(() => {
                            this.timer = setTimeout(() => {
                                this.$refs.table.doLayout()
                            }, 300)
                        })
                    }
                })
            },
            changefun() {
                this.$nextTick(() => {
                    this.timer = setTimeout(() => {
                        this.$refs.table.doLayout()
                    }, 300)
                })
            },
            //评分详情
            classroomEvaluationStatisticalchart(numlist, studentId, stuName) {
                let obj = {mybehaviorTypeList: this.mybehaviorTypeList, numlist: numlist};
                localStorage.setItem("mystuobjlist", JSON.stringify(obj));
                this.$router.push({
                    path: "classroomEvaluationStatisticalchart",
                    query: {
                        classId: this.obj.classId,
                        currId: this.currId,
                        schoolTimeCode: this.obj.termId,
                        startDate: this.startDate,
                        endDate: this.endDate,
                        studentId: studentId,
                        stuName: stuName
                    }
                });
            }
        }
    }
</script>
<style scoped>
    .el-range-editor--medium .el-range-separator {
        width: 30px;
    }
</style>

<style lang="scss" scoped>
    .classroomEvaluationStudent {
        padding: 12px;
        box-sizing: border-box;
        font-size: 14px;

        * {
            box-sizing: border-box;
        }

        .checkbox-box {
            padding-bottom: 10px;

        }

        .el-date-editor.el-input, .el-date-editor.el-input__inner {
            width: 240px;
        }

        .el-select {
            width: 175px;
        }

        .red {
            color: #f56c6c;
        }

        .green {
            color: #67c23a;
        }

        .filter-item {
            width: 150px;
        }

        .header {
            padding-bottom: 10px;
            border-bottom: 1px solid #e7eaec;

        }

        .schoolWrap {
            overflow-x: hidden;
            overflow-y: auto;
            padding-top: 10px;
            box-sizing: border-box;

            .title {
                line-height: 34px;
                height: 34px;

                .square {
                    display: inline-block;
                    width: 10px;
                    height: 10px;
                    background: #ACD6FF;
                    margin: 15px 8px 0 0;
                }
            }

            .text {
                padding-left: 18px;
                box-sizing: border-box;

                h3 {
                    font-size: 16px;
                }

            }
        }
    }
</style>

