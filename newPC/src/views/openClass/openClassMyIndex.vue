<template>
    <div style="    padding: 10px;">
        <div class="open_class_my_wrap">
            <div class="search_line_wrap">
                 <template>
                    <el-select v-model="schoolName" size="medium" placeholder="请选择学期"
                               @change="changeSchoolTimeCode">
                        <el-option v-for="item in schoolYearList" :key="item.schoolTimeCode" :label="item.label"
                                   :value="item.schoolTimeName">
                        </el-option>
                    </el-select>
                </template>
                <el-button type="primary" size="medium" @click="toOpenClassAdd">新建公开课</el-button>
                <a :href="exportURL" download="导出结果" target="_blank"  v-if="myClassList.length">
                    <el-button class="filter-item" size="medium" type="primary">导出</el-button>
                </a>
                
            </div>
            <div class="open_class_my_list">
                <el-table stripe :data="myClassList" border style="width: 100%;" :height="notbmaxH - 75">
                    <el-table-column label="时间" show-overflow-tooltip width="240">
                        <template slot-scope="scope">
                                    <span style="color: #409eff;cursor:pointer;"
                                          @click="toOpenClassInfo(scope.row.id, scope.row.state)">{{scope.row.listenDate}}&nbsp;{{scope.row.listenWeek}}&nbsp;{{scope.row.classNoName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="公开课级别">
                        <template slot-scope="scope">
                            <span>{{scope.row.levelName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="公开课类型" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span>{{scope.row.openClassType || '--'}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="上课班级" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.className}}</span>
                    </template>
                </el-table-column>
                    <el-table-column label="上课地点" show-overflow-tooltip>
                        <template slot-scope="scope">
                             <span>{{scope.row.place}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="学科">
                        <template slot-scope="scope">
                            <span>{{scope.row.subjectName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="课题" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span v-if="scope.row.subjectTheme">《{{scope.row.subjectTheme}}》</span>
                            <span v-else>--</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="状态">
                        <template slot-scope="scope">
                            <el-tag  size="mini"  type="info" v-if="scope.row.state===1">草稿</el-tag>
                            <el-tag  size="mini"  type="warning" v-else-if="scope.row.state===2">待审核</el-tag>
                            <el-tag  size="mini"  type="danger" v-else-if="scope.row.state===3">驳回</el-tag>
                            <el-tag  size="mini"  type="success" v-else-if="scope.row.state===4">已发布</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="证书">
                        <template slot-scope="scope">
                            <el-button size="small" type="text"
                                       v-if="timefun(scope.row.listenDate)&&(scope.row.subjectTheme&&scope.row.state===4)"
                                       @click="certificateView(scope.row.id)">查看证书
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="pagination-container">
                    <el-pagination @size-change="sizeChangeHandler" @current-change="currentChangeHandler"
                                   :current-page.sync="pagination.pageNo" :page-sizes="[10, 20, 30, 50]"
                                   :page-size.sync="pagination.pageSize"
                                   layout="total, sizes, prev, pager, next, jumper"
                                   :total="pagination.total">
                    </el-pagination>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import mixins from '@/mixins/windowResize';
    import BaseMixin from '@/mixins/baseMixin';
    import {myClassRegisterList,getSchoolTimeList} from "@/api/teachingStudy/openClass";
    export default {
        name: 'openClassMyIndex',
        data() {
            return {
                myClassList: [],
                exportURL: '',
                searchName: '',
                pagination: {
                    pageNo: 1,
                    pageSize: 20,
                    total: ''
                },
                  schoolYearList: [],
                  schoolTimeCode: '',
                  schoolName: ''
            }
        },
        mixins: [mixins, BaseMixin],
        created() {
              this.getSchoolTimeList();
        },
        mounted() {
        },
        methods: {
              changeSchoolTimeCode(val) {
                const self = this;
                this.schoolName = val;
                this.schoolYearList.forEach(function (item) {
                    console.log('changeSchoolTimeCode1',item);
                    
                    if (item.schoolTimeName === val) {
                        self.schoolTimeCode = item.id;
                    }
                });
                this.myClassRegisterList();
            },
             getSchoolTimeList() {
                getSchoolTimeList().then(res => {
                    this.schoolYearList = res.data.data;
                    let self = this;
                    this.schoolYearList.forEach(function (item) {
                           console.log('changeSchoolTimeCode2',item);
                        if (item.isCurrent === 1) {
                            self.schoolName = item.schoolTimeName;
                            self.schoolTimeCode = item.id;
                            self.supplyDate = [item.startDate, self.getDate(0)]; // 列表日期
                            self.myClassRegisterList();
                             console.log('changeSchoolTimeCode3',self.schoolTimeCode);
                        }
                    });
                }).catch();
            },
              timefun(time){
                    let currentTime = new Date(); // 获取当前时间
                    let inputTime = new Date(time+' 23:59:59'); // 将传入的时间转换为Date对象                
                    if (currentTime > inputTime) {
                      return true;
                    } else if (currentTime < inputTime) {
                       return false;
                    } else {
                       return false;
                    }
            },
            certificateView(id) {
                this.$router.push({path: 'certificateView', query: {id: id}})
            },
            toOpenClassAdd() {
                this.$router.push({path: 'myAdd'});
            },
            toOpenClassInfo(id, state) {
                if (state === 4) {
                    this.$router.push({path: 'info', query: {id: id, num: 1}});
                } else if (state === 3) {
                    this.$router.push({path: 'myAdd', query: {id: id}});
                } else if (state === 2) {
                    this.$router.push({path: 'approvalInfo', query: {id: id}});
                }
            },
            myClassRegisterList() {
                 console.log('changeSchoolTimeCode4',this.schoolTimeCode);
                this.exportURL = global.BasePath + 'structure/listenClassRegister/downRegisterListByTeacherId?teacherName='
                    + this.searchName +'&schoolTimeId=' + this.schoolTimeCode + '&token=' + this.$store.getters.token;
                let query = {
                    pageNo: this.pagination.pageNo,
                    pageSize: this.pagination.pageSize,
                    teacherName: this.searchName,
                    schoolTimeId: this.schoolTimeCode
                };
                  console.log('changeSchoolTimeCode5',query);
                myClassRegisterList(query).then(res => res.data).then(data => {
                    if (data.code === 200) {
                        this.myClassList = data.data.dataList;
                        this.pagination.total = data.data.pagination.total;
                    } else {
                        this.$message({
                            message: data.msg,
                            type: 'warning'
                        });
                    }
                }).catch(() => {
                });
            },
            sizeChangeHandler() {
                this.pagination.pageNo = 1;
                this.myClassRegisterList();
            },
            currentChangeHandler() {
                this.myClassRegisterList();
            }
        }
    }
</script>

<style lang="scss" scoped>
    .header {
        .statistics_title {
            display: flex;
            margin: 10px 0;

            .btn_group {
                flex: 1;
                text-align: center;

                .btn {
                    height: 40px;
                    line-height: 40px;
                    border: 1px solid #ccc;
                    border-left-width: 0;
                    color: #333;
                    cursor: pointer;
                }

                .btn_selected {
                    color: #fff;
                    background: #409EFF;
                    border: 1px solid #409EFF;
                }
            }

            .btn_group:first-child {
                .btn {
                    border-radius: 4px 0 0 4px;
                    border-left-width: 1px;
                }
            }

            .btn_group:last-child {
                .btn {
                    border-radius: 0 4px 4px 0;
                }
            }
        }
    }

    .open_class_my_wrap {


        .search_line_wrap {
            margin-bottom: 10px;
        }
    }
</style>
