<template>
    <div class="statisticsDetail">
        <div class="top">
            <el-date-picker
                v-model="daterange" size="medium"
                type="daterange" class="mywidthdaterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"  @change="statisticssth()"
                :clearable="false" style="width:220px;"
            >
            </el-date-picker>
            <el-select class="filter-item" size="medium" v-model="query.fireType" @change="newstatisticssth()" style="width:120px;">
                <el-option label="老师" value="1"></el-option>
                <el-option label="学生" value="2"></el-option>
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
        <el-select v-if="query.gradeId != 0&&query.fireType == 2" style="width: 130px;" class="header-buttom" @change="statisticssth()" v-model="query.classId"
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

         <el-select style="width: 130px;" v-if="query.fireType == 2" class="header-buttom" @change="statisticssth" v-model="query.operateType" size="medium"
                   placeholder="停伙方式">
            <el-option label="全部停伙方式" value="-1" ></el-option>
            <el-option label="家长申请停伙" value="0" ></el-option>
            <el-option label="老师代停伙" value="1" ></el-option>
        </el-select>
            <el-select class="filter-item" size="medium" v-model="query.mealType" v-if="query.fireType == 2 " style="width:120px;"
                       @change="statisticss()">
                       <el-option label="全部餐次" value="-1" ></el-option>
                        <el-option label="早餐" value="0" v-if="stuBreakfast"></el-option>
                        <el-option label="午餐" value="1" v-if="lunch"></el-option>                    
                        <el-option label="课间餐" value="2" v-if="breakMeal"></el-option>
                        <el-option label="晚餐" value="3" v-if="stuSupper"></el-option>
            </el-select>
            <el-select class="filter-item" size="medium" v-model="query.mealType" v-if="query.fireType == 1" style="width:120px;"
                       @change="statisticss()">
                        <el-option label="全部餐次" value="-1" ></el-option>
                <el-option label="早餐" value="0" v-if="breakfast"></el-option>
                <el-option label="午餐" value="1" v-if="teacherLunch"></el-option>
                <el-option label="晚餐" value="3" v-if="supper"></el-option>
            </el-select>
            <!-- <el-button type="primary" @click="statisticss()" size="medium">统计</el-button> -->
            <a class="export-btn" :href="exportURL" download="导出" target="_blank" v-if="dateList.length">
                <el-button class="filter-item" type="primary" size="medium" icon="upload">导出</el-button> 
            </a>
             <el-button class="filter-item" type="primary" size="medium" v-if="query.fireType==2&&isShowByPermission('/fire/updateStuClassInfoList')"  @click="mydialogVisibletime=true" >刷新学生班级</el-button> 
            <el-button class="filter-item" type="primary" size="medium" icon="upload" @click="cancelFireByIds()" v-if="isShowByPermission('/fire/cancelFirePc')">批量取消停伙</el-button>
             <el-button class="filter-item" type="primary" size="medium" icon="upload" @click="stopDietForStu()">代学生停伙</el-button>
             <el-button class="filter-item" type="primary" size="medium" icon="upload" @click="stopDietForTh()" v-if="isShowByPermission('/fire/addFireTh')">代老师停伙</el-button>
               <el-input class="search-input" style="width:20%;float: right;"  placeholder="请输入姓名" icon="search" size="medium" @change="statisticss()"
                          v-model.trim="query.searchName">
                          <el-button slot="append" icon="el-icon-search" @click="statisticss()"></el-button>
            </el-input>
            <h3 class="h3">在{{daterange[0] | getFormatedDate}}至{{daterange[1] |
                getFormatedDate}}期间内，共计停伙次数为{{total}},详情如下：</h3>
        </div>
        <el-dialog
                                    title="刷新学生班级"
                                    :visible.sync="mydialogVisibletime"
                                    width="40%"
                                  >
                                    <el-form
                                      label-width="100px"
                                      class="demo-ruleForm"
                                    >
                                      <el-form-item label="刷新时间">
                                        <el-date-picker
                                          v-model.trim="deadlineTime"
                                          :clearable="false"
                                          :editable="false"
                                          type="date"
                                          placeholder="选择截止时间"
                                        ></el-date-picker>
                                        <div class="red" style="color:red">
                                            （从之前日期到选中日期刷新）
                                        </div>
                                      </el-form-item>
                                      </el-form>
                                      <span
                                        slot="footer"
                                        class="dialog-footer"
                                      >
                                        <el-button @click="mydialogVisibletime = false">取 消</el-button>
                                        <el-button
                                          type="primary"
                                          @click="updateStuClassInfoList()"
                                        >确 定</el-button>
                                          </span>
                                          </el-dialog>
        <div class="time-table">
            <el-table stripe :data="dateList" v-loading.body="listLoading" border fit highlight-current-row
                      style="width: 100%"
                      :height="maxH-40"
                       @select="selectionChangeHandler"
                            @select-all="selectionChangeHandler"
                      >
                       <el-table-column type="selection" width="55" ></el-table-column>
                <el-table-column align="center" label="姓名" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.userName}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="部门/班级" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.className}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="日期">
                    <template slot-scope="scope">
                        <span>{{scope.row.fireDate}}</span>
                    </template>
                </el-table-column>
                 <el-table-column align="center" label="类型">
                    <template slot-scope="scope">
                         <span v-if="scope.row.mealType==0">早餐</span>
                         <span v-if="scope.row.mealType==1">午餐</span>
                         <span v-if="scope.row.mealType==2">课间餐</span>
                         <span v-if="scope.row.mealType==3">晚餐</span>
                    </template>
                </el-table-column>
                <!-- /fire/cancelFirePc -->
                <el-table-column align="center" label="备注">
                    <template slot-scope="scope">
                        <span>{{scope.row.remark}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="停伙方式" >
                     <template slot-scope="scope">
                         <el-tag  size="mini" v-if="scope.row.operateType == 1">代停伙</el-tag>
                        <el-tag  size="mini"  type="success" v-if="scope.row.operateType == 0">自己申请</el-tag>
                     </template>
                 </el-table-column>
                  <el-table-column align="center" label="提交时间">
                    <template slot-scope="scope">
                        <span>{{scope.row.createDate?scope.row.createDate.split(".")[0]:'----'}}</span>
                    </template>
                </el-table-column>
                 <el-table-column align="center" label="操作" width="120"  v-if="isShowByPermission('/fire/cancelFirePc')">
                <template slot-scope="scope">
                    <el-button size="small" type="text"  @click="cancelFireById(scope.row.id)">取消停伙
                    </el-button>
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
    import {statistics, getFireSet,cancelFireById,cancelFireByIds,updateStuClassInfoList} from "@/api/fire";
    import {isShowByPermission} from '@/utils';
    //	返回按钮
    import BackTool from "@/components/BackTool";
    import moment from "moment";
    import mixin from '@/mixins/windowResize';
    import { queryDepartListTerm} from '@/api/common/common';
    export default {
        name: "statisticsDetail",
        //引入返回模块
        components: {
            BackTool
        },
        data: function () {
            return {
                mydialogVisibletime: false,
                daterange: [new Date(), new Date()],
                listLoading: false,
                dateList: [],//表格主题数据
                total: null,
                isnum: 0,
                exportURL: '',
                deadlineTime: this.$moment().format("YYYY-MM-DD"),
                query: {
                    startDate: this.$moment().format("YYYY-MM-DD"), //开始时间
                    endDate: this.$moment().format("YYYY-MM-DD"), //结束时间
                    fireType: '1', //老师1学生2
                    mealType: '-1', //午餐1课间餐2
                    pageNo: 1, //页数
                    pageSize: 20, //条数
                    searchName:"",
                    gradeId:0,
                    classId:0,
                    operateType:'-1'
                },
                breakMeal: 0,
                breakfast: 0,
                supper: 0,
                stuSupper: 0,
                stuBreakfast: 0,
                lunch:0,
                teacherLunch:0,
                selected:[],
                 classList:[],
                gradeList:[],
              
            };
        },
        filters: {
            getFormatedDate(date) {
                return moment(date).format('YYYY-MM-DD');
            }
        },
        mixins: [mixin],
        //获取渲染数据当数据加载完成后执行(生命周期中的钩子函数)
        created() {
            this.daterange[0] = new Date(moment().set('date', 1).valueOf());

            if (this.$route.query.code) {
                this.isnum = this.$route.query.code;
            }

            let date = new Date();
            // 获取间隔月
            let gapMonth = date.getMonth();
            // 获取间隔月月初
            let gapMonthFirstDay = new Date(date.getFullYear(), gapMonth, 1);
            this.query.startDate = moment(gapMonthFirstDay).format('YYYY-MM-DD');
            this.statisticss();
            getFireSet()
                .then(res => res.data)
                .then(data => {
                    const pageData = data.data;
                    this.breakfast = pageData.breakfast == 1;
                    this.supper = pageData.supper == 1;
                    this.breakMeal=pageData.breakMeal==1;
                    this.stuSupper=pageData.stuSupper==1;
                    this.stuBreakfast=pageData.stuBreakfast==1;
                    this.lunch = pageData.lunch == 1;
                    this.teacherLunch = pageData.teacherLunch == 1;
                });
                this.queryDepartListTermFunc()
        },
        methods: {
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
                    })
            },
              gradeChange() {
                this.query.classId = 0;
                this.statisticss();
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
              updateStuClassInfoList() {
                this.deadlineTime = this.$moment(this.deadlineTime).format("YYYY-MM-DD"); //时间
                updateStuClassInfoList(this.deadlineTime).then(
                    res => {
                    let data = res.data;
                    if (data.code === 200) {
                        this.$message({
                        type: "success",
                        message: "刷新学生班级成功!"
                        });
                        this.mydialogVisibletime = false;
                        this.statisticss()
                    }
                    }
                );
                },
             cancelFireByIds() {
                if(this.selected.length === 0) {
                    this.$message.error('请选择要取消的停伙');
                } else {                   
                    this.$confirm(' 取消停伙无法恢复，请确认要取消这些人员的停伙信息！', '批量取消停伙', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        cancelFireByIds(this.selected.map(item => item.id))
                            .then(res => res.data)
                            .then(data => {
                                if (data.result) {
                                    this.$message.success('批量取消停伙成功');
                                    this.statisticss();
                                }
                            })
                    });
                }
            },
              selectionChangeHandler(selection) {
                this.selected = selection;
            },
             cancelFireById(id){
         this.$confirm('此操作将永久取消此停伙, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    cancelFireById(id).then(res => {
                        this.$message({
                            type: 'success',
                            message: '取消停伙成功!'
                        });
                        this.statisticss();
                    }).catch();

                }).catch(() => {
                });
    },
             stopDietForStu(){
                this.$router.push({
                    path: "stopDietForStu"
                });
            },
            stopDietForTh(){
                this.$router.push({
                    path: "stopDietForTh"
                });
            },
            //权限
            isShowByPermission,
             statisticssth(){
                 this.statisticss();
            },
            newstatisticssth(){
                this.query.gradeId = 0;
                this.query.classId = 0;
                this.query.operateType = '-1';                
                this.statisticss();
            },
            statisticss() {
              
                this.query.startDate = this.$moment(this.daterange[0]).format("YYYY-MM-DD"); //时间
                this.query.endDate = this.$moment(this.daterange[1]).format("YYYY-MM-DD"); //时间
                this.exportURL = global.BasePath + 'structure/fire/downFire?endDate=' + this.query.endDate +'&operateType=' + this.query.operateType+'&gradeId=' + this.query.gradeId+'&classId=' + this.query.classId+ '&fireType=' + this.query.fireType + '&mealType=' + this.query.mealType + '&searchName=' + this.query.searchName +'&startDate=' + this.query.startDate + '&token=' + this.$store.getters.token;
                statistics(this.query).then(res => {
                    let data = res.data.data;
                    this.dateList = data.dataList;
                    this.total = data.pagination.total;
                });
            },

            handleSizeChange(val) {
                this.query.pageSize = val;
                this.statisticss();
            },
            handleCurrentChange(val) {
                this.query.pageNo = val;
                this.statisticss();
            }
        }
    };
</script>
<style scoped>

    .statisticsDetail {
        padding:12px;
    }

    .statisticsDetail .h3 {
        line-height: 40px;
        margin: 0;
    }

    .statisticsDetail .el-select {
        width: 100px;
    }

    .el-date-editor .el-range-separator {
        box-sizing: content-box;
    }
</style>
