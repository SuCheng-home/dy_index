<template>
    <div class="app-container">
        <backtool>
            <el-select class="filter-item" v-model="schoolTimeId" placeholder="请选择" size="medium"
                       @change="getStuScoreBySchoolTimeIdAndCurrId">
                <el-option v-for="item in schoolTimeList" :key="item.id" :label="item.schoolTimeName"
                           :value="item.id"></el-option>
            </el-select>
            <el-select class="filter-item" v-model="classId" placeholder="请选择" size="medium" @change="classChange">
                <el-option v-for="item in classList" :key="item.id" :label="item.name"
                           :value="item.id"></el-option>
            </el-select>
            <el-select class="filter-item" v-model="courseId" placeholder="请选择" size="medium"
                       @change="getStuScoreBySchoolTimeIdAndCurrId">
                <el-option v-for="item in courseList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
            <a target="_blank" :href="exportURL" download="导出结果"  v-if="list.length">
                <el-button class="filter-item" type="primary" size="medium" icon="upload">导出</el-button>
            </a>
        </backtool>
        <el-table stripe :key='tableKey'  ref="table" :data="list" v-loading.body="listLoading" border highlight-current-row
                  style="width: 100%" :height="nobottommaxH">
            <el-table-column label="学号" fixed width="150" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{scope.row.stuLearnNum}}
                </template>
            </el-table-column>
            <el-table-column align="left" fixed width="150" label="姓名">
                <template slot-scope="scope">
                    <span class="link-type" @click="loadStuScoreAnalysisBySchoolTimeIdAndCurrId(scope.row.stuId)">{{scope.row.stuName }}</span>
                </template>
            </el-table-column>
            <el-table-column min-width="300px" v-if="examList.length>0" :key="index" v-for="(item,index) in examList"
                             align="left" :label="item.name.length>16?item.name.substring(0,16)+'...':item.name">
                <template slot-scope="scope">
                    {{scope.row.scoreList[index]}}
                </template>
            </el-table-column>
            <el-table-column v-if="examList.length === 0" label="暂无考试成绩">
            </el-table-column>

        </el-table>
    </div>
</template>
<script>
    import Backtool from '@/components/BackTool';
    import {getSchoolTimeAllList, queryClassGrade, queryCourseByClassIds} from '@/api/system';
    import {
        getStuScoreBySchoolTimeIdAndCurrId,
        getCurrentSchoolTimeBySchoolId,
        changeDepart,
        getTeacherDepart
    } from '@/api/systemSet/exam';
    import mixin from '@/mixins/windowResize';

    export default {
        components: {
            Backtool
        },
        data() {
            return {
                tableKey: 'examScoreCollect',
                list: null,
                listLoading: false,
                schoolTimeId: '',
                schoolTimeList: [],
                classId: '',
                classList: [],
                courseId: '',
                courseList: [],
                exportURL: '',
                examList: []
            }
        },
        created() {
            getSchoolTimeAllList().then(res => {
                this.schoolTimeList = res.data.data;
            }).catch();
            getCurrentSchoolTimeBySchoolId().then(res => {
                let data = res.data.data;
                this.schoolTimeId = data.id;
            }).catch();
            getTeacherDepart().then(res => {
                let data = res.data;
                this.classList = data;
                this.classId = data.length > 0 ? data[0].id : '';               
                this.classChange()
               
            }).catch();
        },
        mixins: [mixin],
        mounted(){
            this.$nextTick(()=>{
                this.timer=setTimeout(()=> {
                this.$refs.table.doLayout()
                },300) 
            })
        },
        methods: {
            classChange() {
                 if(this.classId){
                    changeDepart(this.classId).then(res => {
                        let data = res.data;
                        this.courseList = data;
                        this.courseId = data.length > 0 ? data[0].id : '';
                        this.getStuScoreBySchoolTimeIdAndCurrId();
                    }).catch();
                 }
            },
            getStuScoreBySchoolTimeIdAndCurrId() {//获取一个学期某个班级某个科目的学生成绩
                    this.list = [];
                    this.examList = [];
                if (this.schoolTimeId.length === 0) {
                    return;
                }
                if (this.classId.length === 0) {
                    return;
                }
                if (this.courseId.length === 0) {
                    return;
                }

                let query = {
                    classId: this.classId,
                    currId: this.courseId,
                    schoolTimeId: this.schoolTimeId,
                    classType: 0
                };
                let className = this.classList.find(item => item.id === this.classId).name;
                let currName = this.courseList.find(item => item.id === this.courseId).name;
                this.exportURL = global.BasePath + 'structure/exam/downStuScoreBySchoolTimeIdAndCurrId?classId=' + this.classId + '&className=' + className + '&classType=' + 0 + '&currId=' + this.courseId + '&currName=' + currName + '&schoolTimeId=' + this.schoolTimeId + '&token=' + this.$store.getters.token;
                getStuScoreBySchoolTimeIdAndCurrId(query).then(res => {
                    this.list = res.data.data.stuScoreList;
                    this.examList = res.data.data.examList;
                    this.$nextTick(()=>{
                                    this.timer=setTimeout(()=> {
                                    this.$refs.table.doLayout()
                                        },300) 
                                    })
                }).catch();
            },
            loadStuScoreAnalysisBySchoolTimeIdAndCurrId(id) {
                this.$router.push({
                    path: 'loadStuScoreAnalysisBySchoolTimeIdAndCurrId',
                    query: {
                        stuId: id,
                        classId: this.classId,
                        currId: this.courseId,
                        schoolTimeId: this.schoolTimeId,
                        classType: 0
                    }
                });

            }
        }
    }
</script>

<style scoped>
    .filter-container td {
        width: 230px;
        padding-top: 10px;
    }
</style>
