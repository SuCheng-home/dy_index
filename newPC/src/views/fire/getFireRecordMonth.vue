<template>
    <div class="statisticsDetail">
        <div class="top">
             <el-select size="medium" v-model="schoolTimeCode" placeholder="请选择学期" @change="changeSchool()">
                <el-option v-for="item in schoolYearList" :key="item.id" :label="item.schoolTimeName"
                           :value="item.id"></el-option>
            </el-select>
             <el-select size="medium" v-model="query.month" placeholder="请选择月份" @change="getFireRecordMonthList()">
                <el-option v-for="item in diffdate" :key="item" :label="item"
                           :value="item"></el-option>
            </el-select>
            <el-select class="filter-item" size="medium" v-model="query.fireType" @change="getFireRecordMonthList()" style="width:80px;">
                <el-option label="老师" :value="1"></el-option>
                <el-option label="学生" :value="2"></el-option>
            </el-select>
            <el-button class="filter-item" type="primary" size="medium" icon="upload" @click="addFireRecordMonthList()">生成统计</el-button>
            <el-button class="filter-item" type="primary" size="medium" icon="upload"  v-if="dateList.length" @click="remindFireRecordMonth()">提醒用户确认</el-button>
            <a class="export-btn" :href="exportURL" download="导出" target="_blank" v-if="dateList.length">
                <el-button class="filter-item" type="primary" size="medium" icon="upload">导出</el-button>
            </a>
             <!-- <el-input class="search-input" style="width:20%;float: right;"  placeholder="请输入姓名" icon="search" size="medium" @change="getFireRecordMonthList()"
                          v-model.trim="query.searchName">
                          <el-button slot="append" icon="el-icon-search" @click="getFireRecordMonthList()"></el-button>
            </el-input> -->
        </div>
        <div class="time-table" v-show="query.fireType == 1 ">
            <el-table stripe :data="dateList" v-loading.body="listLoading" border fit highlight-current-row
                      style="width: 100%" ref="table"
                      :height="maxH">                     
                  <el-table-column   align="center" label="姓名" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.userName}}</span>
                    </template>
                </el-table-column>
                <el-table-column   align="center" label="部门/班级" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.className}}</span>
                    </template>
                </el-table-column>
                 <el-table-column   align="center" v-if="(query.fireType==2&&stuBreakfast)||(query.fireType==1&&breakfast)" label="早餐停伙次数" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.breakfastCount}}</span>
                    </template>
                </el-table-column>
                <el-table-column   align="center" v-if="query.fireType==2&&breakMeal" label="课间餐停伙次数" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.breakMealCount}}</span>
                    </template>
                </el-table-column>
                <el-table-column   align="center" v-if="(query.fireType==2&&lunch)||(query.fireType==1&&teacherLunch)" label="午餐停伙次数" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.lunchCount}}</span>
                    </template>
                </el-table-column>
                <el-table-column   align="center" v-if="(query.fireType==2&&stuSupper)||(query.fireType==1&&supper)" label="晚餐停伙次数" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.supperCount}}</span>
                    </template>
                </el-table-column>
                <el-table-column   align="center" label="应退金额" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.totalPrice}}</span>
                    </template>
                </el-table-column>
                <el-table-column  align="center" label="确认情况" show-overflow-tooltip>
                    <template slot-scope="scope">
                         <el-tooltip class="item"  v-if="scope.row.confirmStatus==2" effect="dark" :content="scope.row.feedbackContent" placement="top">
                        <el-tag  size="mini" type="warning" >已反馈</el-tag>
                        </el-tooltip>
                        
                        <el-tag  size="mini" type="success"  v-if="scope.row.confirmStatus==3">已确认</el-tag>
                        <el-tag  size="mini" type="danger"  v-if="scope.row.confirmStatus==1">未确认</el-tag>
                    </template>
                </el-table-column>
                <el-table-column  align="center" label="操作" show-overflow-tooltip>
                    <template slot-scope="scope">
                       <el-button size="small" type="text"  v-if="scope.row.confirmStatus!=3" @click="refreshFireRecordMonth(scope.row.userId,scope.row.fireType)">刷新</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="time-table" v-show="query.fireType == 2 ">
            <el-table stripe :data="dateList" v-loading.body="listLoading" border fit highlight-current-row
                      style="width: 100%" ref="table"
                      :height="maxH">
                      <el-table-column   align="center" label="学号"  show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.stuNo}}</span>
                    </template>
                </el-table-column>
                  <el-table-column   align="center" label="姓名" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.userName}}</span>
                    </template>
                </el-table-column>
                <el-table-column   align="center" label="部门/班级" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.className}}</span>
                    </template>
                </el-table-column>
                 <el-table-column   align="center" v-if="(query.fireType==2&&stuBreakfast)||(query.fireType==1&&breakfast)" label="早餐停伙次数" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.breakfastCount}}</span>
                    </template>
                </el-table-column>
                <el-table-column   align="center" v-if="query.fireType==2&&breakMeal" label="课间餐停伙次数" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.breakMealCount}}</span>
                    </template>
                </el-table-column>
                <el-table-column   align="center" v-if="(query.fireType==2&&lunch)||(query.fireType==1&&teacherLunch)" label="午餐停伙次数" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.lunchCount}}</span>
                    </template>
                </el-table-column>
                <el-table-column   align="center" v-if="(query.fireType==2&&stuSupper)||(query.fireType==1&&supper)" label="晚餐停伙次数" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.supperCount}}</span>
                    </template>
                </el-table-column>
                <el-table-column   align="center" label="应退金额" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.totalPrice}}</span>
                    </template>
                </el-table-column>
                <el-table-column  align="center" label="确认情况" show-overflow-tooltip>
                    <template slot-scope="scope">
                         <el-tooltip class="item"  v-if="scope.row.confirmStatus==2" effect="dark" :content="scope.row.feedbackContent" placement="top">
                        <el-tag  size="mini" type="warning" >已反馈</el-tag>
                        </el-tooltip>
                        
                        <el-tag  size="mini" type="success"  v-if="scope.row.confirmStatus==3">已确认</el-tag>
                        <el-tag  size="mini" type="danger"  v-if="scope.row.confirmStatus==1">未确认</el-tag>
                    </template>
                </el-table-column>
                <el-table-column  align="center" label="操作" show-overflow-tooltip>
                    <template slot-scope="scope">
                       <el-button size="small" type="text" v-if="scope.row.confirmStatus!=3" @click="refreshFireRecordMonth(scope.row.userId,scope.row.fireType)">刷新</el-button>
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
    import {getFireRecordMonthList,getFireSet,addFireRecordMonthList,remindFireRecordMonth,refreshFireRecordMonth} from "@/api/fire";
    import mixin from '@/mixins/windowResize';
    import {getSchoolTimeAllList} from '@/api/classroomEvaluation';

    export default {
        name: "statisticsDetail",
        data: function () {
            return {
                dateList: [],//表格主题数据
                total: null,
                schoolTimeCode: '',
                schoolYearList: [],
                diffdate:[],
                exportURL: '',
                query: {
                    fireType: 1, //老师1学生2
                    pageNo: 1, //页数
                    pageSize: 20, //条数
                    searchName:"",
                    month:'',
                    moduleType:this.$route.query.moduleType
                },
                 breakMeal: 0,
                breakfast: 0,
                supper: 0,
                stuSupper: 0,
                stuBreakfast: 0,
                lunch:0,
                teacherLunch:0,
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
                    this.breakMeal=pageData.breakMeal==1;
                    this.stuSupper=pageData.stuSupper==1;
                    this.stuBreakfast=pageData.stuBreakfast==1;
                    this.lunch = pageData.lunch == 1;
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
         refreshFireRecordMonth(userId,fireType){
         this.$confirm('是否刷新用户停伙月数据?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    refreshFireRecordMonth({
                        moduleType:this.query.moduleType,
                        month:this.query.month,
                        userId:userId,
                        fireType:fireType
                    }).then(res => {
                         if(res.data.result){
                             this.$message({
                            type: 'success',
                            message: '刷新成功!'
                        });
                        this.getFireRecordMonthList();

                        }else{
                             this.$message.error(res.data.msg);
                        }
                        
                    }).catch();

                }).catch(() => {
                });
    },
        addFireRecordMonthList(){
         this.$confirm('是否生成停伙确认月数据?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    addFireRecordMonthList({
                        moduleType:this.query.moduleType,
                        month:this.query.month,
                    }).then(res => {
                        if(res.data.result){
                           this.$message({
                            type: 'success',
                            message: '生成成功!'
                        });
                        this.getFireRecordMonthList();
                        }else{
                             this.$message.error(res.data.msg);
                        }
                        
                    }).catch();

                }).catch(() => {
                });
    },
     remindFireRecordMonth(){
         this.$confirm('是否提醒停伙确认月数据?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    remindFireRecordMonth({
                        moduleType:this.query.moduleType,
                        fireType:this.query.fireType,
                        month:this.query.month,
                    }).then(res => {
                         if(res.data.result){
                           this.$message({
                            type: 'success',
                            message: '提醒成功!'
                        });
                        this.getFireRecordMonthList();
                        }else{
                             this.$message.error(res.data.msg);
                        }
                        
                    }).catch();

                }).catch(() => {
                });
    },
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
                    this.query.month=diffdate[0];
                    this.diffdate=diffdate;
                    this.getFireRecordMonthList()
            },
            getFireRecordMonthList() {              
                this.exportURL = global.BasePath + 'structure/fire/downFireRecordMonth?fireType=' + this.query.fireType + '&moduleType=' + this.query.moduleType + '&month=' + this.query.month + '&token=' + this.$store.getters.token;
                getFireRecordMonthList(this.query).then(res => {
                    let data = res.data.data;
                    this.dateList = data.dataList;
                    this.total = data.pagination.total;
                     this.$nextTick(() => {
                                        this.timer = setTimeout(() => {
                                            this.$refs.table.doLayout()
                                        }, 300)
                                    })
                });
            },
            handleSizeChange(val) {
                this.query.pageSize = val;
                this.getFireRecordMonthList();
            },
            handleCurrentChange(val) {
                this.query.pageNo = val;
                this.getFireRecordMonthList();
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
