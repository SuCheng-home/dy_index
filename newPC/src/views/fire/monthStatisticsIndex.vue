<template>
    <div class="statisticsDetail">
        <div class="top">
             <el-select size="medium" v-model="schoolTimeCode" placeholder="请选择学期" @change="changeSchool()" style="width:200px;">
                <el-option v-for="item in schoolYearList" :key="item.id" :label="item.schoolTimeName"
                           :value="item.id"></el-option>
            </el-select>
             <el-select size="medium" v-model="query.monthDate" placeholder="请选择月份" @change="queryStuFireMonthDayAnalysis()" style="width:100px;">
                <el-option v-for="item in diffdate" :key="item" :label="item"
                           :value="item"></el-option>
            </el-select>
            <el-select class="filter-item" size="medium" v-model="query.fireType" @change="statisticssth()" style="width:80px;">
                <el-option label="老师" value="1"></el-option>
                <el-option label="学生" value="2"></el-option>
            </el-select>
            <el-select class="filter-item" size="medium" v-model="query.mealType" v-if="query.fireType == 2 " style="width:110px;"
                       @change="queryStuFireMonthDayAnalysis()">
                       <!-- <el-option label="全部餐次" value="-1" ></el-option> -->
                        <el-option label="早餐" value="0" v-if="stuBreakfast"></el-option>
                        <el-option label="午餐" value="1" v-if="lunch"></el-option>                    
                        <el-option label="课间餐" value="2" v-if="breakMeal"></el-option>
                        <el-option label="晚餐" value="3" v-if="stuSupper"></el-option>
            </el-select>
            <el-select class="filter-item" size="medium" v-model="query.mealType" v-if="query.fireType == 1" style="width:110px;"
                       @change="queryStuFireMonthDayAnalysis()">
                        <!-- <el-option label="全部餐次" value="-1" ></el-option> -->
                <el-option label="早餐" value="0" v-if="breakfast"></el-option>
                <el-option label="午餐" value="1" v-if="teacherLunch"></el-option>
                <el-option label="晚餐" value="3" v-if="supper"></el-option>
            </el-select>
             <el-select style="width: 130px;" v-if="query.fireType == 2" class="header-buttom" @change="gradeChange" v-model="query.gradeId" size="medium"
                   placeholder="请选择年级">
            <el-option
                v-for="item in gradeList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
            >
            </el-option>
        </el-select>
        <el-select v-if="query.gradeId != 0&&query.fireType == 2" style="width: 130px;" class="header-buttom" @change="queryStuFireMonthDayAnalysis()" v-model="query.classId"
                   size="medium"
                   placeholder="请选择班级">
            <el-option
                v-for="item in classList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
            >
            </el-option>
        </el-select>
            <a class="export-btn" :href="exportURL" download="导出" target="_blank" v-if="dateList.length">
                <el-button class="filter-item" type="primary" size="medium" icon="upload">导出</el-button>
            </a>
             <el-input class="search-input" style="width:20%;float: right;"  placeholder="请输入姓名" icon="search" size="medium" @change="queryStuFireMonthDayAnalysis()"
                          v-model.trim="query.searchName">
                          <el-button slot="append" icon="el-icon-search" @click="queryStuFireMonthDayAnalysis()"></el-button>
            </el-input>
        </div>
        <div class="time-table">
            <el-table stripe :data="dateList" v-loading.body="listLoading" border fit highlight-current-row
                      style="width: 100%" ref="table"
                      :height="maxH">
                      <el-table-column fixed width="140" align="center" label="学号" v-if="query.fireType == 2 " show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.stuNo}}</span>
                    </template>
                </el-table-column>
                  <el-table-column fixed width="140" align="center" label="姓名" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.userName}}</span>
                    </template>
                </el-table-column>
                <el-table-column fixed width="140" align="center" label="部门/班级" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.className}}</span>
                    </template>
                </el-table-column>
                <el-table-column v-for="(monthItem, index) in titleList" align="center" :key="index" :label="monthItem.fireDate.split('-')[2]">
                    <template slot-scope="scope">
                        <span v-if="scope.row.fireCountList[index] == 1">1</span>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" align="center" label="总计" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.totalCount}}</span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page.sync="query.pageNo" :page-sizes="[10,20,30, 50]"
                           :page-size="query.pageSize" layout="total, sizes, prev, pager, next, jumper"
                           :total="total">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    import {queryStuFireMonthDayAnalysis, getFireSet} from "@/api/fire";
    import mixin from '@/mixins/windowResize';
    import { queryDepartListTerm} from '@/api/common/common';
    import {getSchoolTimeAllList} from '@/api/classroomEvaluation';

    export default {
        name: "statisticsDetail",
        data: function () {
            return {
                dateList: [],//表格主题数据
                total: null,
                schoolTimeCode: '',
                schoolYearList: [],
                titleList:[],
                exportURL: '',
                query: {
                    fireType: '1', //老师1学生2
                    mealType: '-1', //午餐1课间餐2
                    pageNo: 1, //页数
                    pageSize: 20, //条数
                    searchName:"",
                    monthDate:'',
                    gradeId:0,
                    classId:0
                },
                breakMeal: 0,
                breakfast: 0,
                supper: 0,
                stuSupper: 0,
                stuBreakfast: 0,
                lunch:0,
                teacherLunch:0,
                classList:[],
                gradeList:[],
                diffdate:[],
                numtwo:'',
                numone:'',
                 timer: null
              
            };
        },
        mixins: [mixin],
        //获取渲染数据当数据加载完成后执行(生命周期中的钩子函数)
        created() {
              this.$nextTick(() => {
                this.timer = setTimeout(() => {
                    this.$refs.table.doLayout()
                }, 300)
            })
            getFireSet()
                .then(res => res.data)
                .then(data => {
                    const pageData = data.data;
                    this.breakfast = pageData.breakfast == 1;
                    this.supper = pageData.supper == 1;                  
                    this.teacherLunch = pageData.teacherLunch == 1;
                     if(this.supper){
                         this.numtwo='3'
                    }
                     if(this.teacherLunch){
                         this.numtwo='1'
                    }
                     if(this.breakfast){
                         this.numtwo='0'
                    }                   
                    this.breakMeal=pageData.breakMeal==1;
                    this.stuSupper=pageData.stuSupper==1;
                    this.stuBreakfast=pageData.stuBreakfast==1;
                    this.lunch = pageData.lunch == 1;
                    if(this.stuSupper){
                         this.numone='3'
                    }
                    if(this.breakMeal){
                         this.numone='2'
                    }
                     if(this.lunch){
                         this.numone='1'
                    }
                     if(this.stuBreakfast){
                         this.numone='0'
                    }
                    this.query.mealType=this.numtwo;
                     //学期列表
              getSchoolTimeAllList().then(res => res.data)
                .then(data => {
                    if (data.code === 200) {
                        this.schoolYearList = data.data;
                        this.schoolYearList.forEach(item => {
                            if (item.isCurrent == 1) {
                                this.schoolTimeCode = item.id;
                                this.getArrtime(item.startDate, item.endDate);                            }
                        })
                        if(!this.schoolTimeCode){
                                this.schoolTimeCode = this.schoolYearList[0].id;
                                this.getArrtime( this.schoolYearList[0].startDate,  this.schoolYearList[0].endDate);
                        }
                    }
                })
             });
        },
        methods: {
              //切换学期
            changeSchool() {
                let schoolItem = '';
                for (let i = 0; i < this.schoolYearList.length; i++) {
                    if (this.schoolYearList[i].id == this.schoolTimeCode) {
                        schoolItem = this.schoolYearList[i]
                        this.getArrtime(this.schoolYearList[i].startDate, this.schoolYearList[i].endDate); 
                    }
                }
            },
              gradeChange() {
                this.query.classId = 0;
                this.queryStuFireMonthDayAnalysis();
                const gradeObj = this.gradeList.find(item => item.id == this.query.gradeId);                
                if (gradeObj) {
                     let classList = [{
                            id: 0,
                            name: '全部班级',
                            pid: 0
                        }];
                         classList = [...classList, ...gradeObj.childList];
                        this.classList = classList;
                   
                }
                
            },
             queryDepartListTermFunc() {
               queryDepartListTerm({
                        all: true,
                        currentTerm: true,
                        notlimit: true
                })
                    .then(res => res.data)
                    .then(data => {
                        const pageData = data.data || [];
                         
                        pageData.unshift();
                         let gradeList = [{
                            id: 0,
                            name: '全部年级',
                            pid: 0
                        }];
                        this.gradeList = [...gradeList, ...pageData];
                        this.query.gradeId = 0;
                        this.query.classId = 0;
                        this.queryStuFireMonthDayAnalysis();
                    })
            },
            getArrtime(stime,etime){
                    var diffdate = new Array();
                    for(let i=0;true;i++){                    
                                diffdate[i] = stime.substring(0, 7);
                                var stime_ts = new Date(stime).getTime();
                                var next_date = stime_ts + (24*60*60*1000*31);
                                var next_dates_y = new Date(next_date).getFullYear()+'-';
                                var next_dates_m = (new Date(next_date).getMonth()+1 < 10)?'0'+(new Date(next_date).getMonth()+1):(new Date(next_date).getMonth()+1);
                                stime = next_dates_y+next_dates_m
                
                            if(+new Date(stime)>+new Date(etime)){
                                break
                            }
                    }
                    this.query.monthDate=diffdate[0];
                    this.diffdate=diffdate;
                    this.queryDepartListTermFunc()
            },
            statisticssth(){
                if(this.query.fireType==2){
                     this.query.mealType=this.numone;
                }else{
                     this.query.mealType=this.numtwo;
                }
                 this.queryStuFireMonthDayAnalysis();
            },
            queryStuFireMonthDayAnalysis() {              
                this.exportURL = global.BasePath + 'structure/fire/downStuFireMonthDayAnalysis?classId=' + this.query.classId + '&fireType=' + this.query.fireType + '&mealType=' + this.query.mealType + '&searchName=' + this.query.searchName +'&gradeId=' + this.query.gradeId +'&monthDate='+ this.query.monthDate + '&token=' + this.$store.getters.token;
                queryStuFireMonthDayAnalysis(this.query).then(res => {
                    let data = res.data.data;
                    this.dateList = data.dataList;
                    this.total = data.pagination.total;
                    this.titleList=data.titleList;
                     this.$nextTick(() => {
                                        this.timer = setTimeout(() => {
                                            this.$refs.table.doLayout()
                                        }, 300)
                                    })
                });
            },
            handleSizeChange(val) {
                this.query.pageSize = val;
                this.queryStuFireMonthDayAnalysis();
            },
            handleCurrentChange(val) {
                this.query.pageNo = val;
                this.queryStuFireMonthDayAnalysis();
            }
        }
    };
</script>
<style  lang="scss" scoped>
    .statisticsDetail {
        padding:12px;
        .top{
            padding-bottom:10px;
        }
    }
</style>
