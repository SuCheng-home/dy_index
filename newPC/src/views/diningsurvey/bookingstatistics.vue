<template>
    <div class="diningsurveyindex">
        <div class="top">
             <el-select size="medium" v-model="listQuery.schoolTimeId" placeholder="请选择学期" @change="queryFireSurveyOrder()">
                <el-option v-for="item in schoolYearList" :key="item.id" :label="item.schoolTimeName"
                           :value="item.id"></el-option>
            </el-select>
            <el-button class="filter-item" size="medium" type="primary" v-if="myschoolTimeId==listQuery.schoolTimeId" @click="bookingstatisticsadd()">新建</el-button>
        </div>          
            <el-table stripe :data="list"  border fit highlight-current-row :height="maxH" ref="mainTable">
                <el-table-column prop="title" align="center" label="统计时间范围">
                    <template slot-scope="scope">
                        <span class="link" @click="bookingstatisticsinfo(scope.row)">{{scope.row.startDate}}~{{scope.row.endDate}}</span>
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip align="center" label="面向对象">
                    <template slot-scope="scope">
                        <span>{{scope.row.type==1?"老师":"学生" }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="createUser" align="center" label="统计人">
                    <template slot-scope="scope">
                        <span>{{scope.row.createName}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="createDate" align="center" label="创建时间">
                    <template slot-scope="scope">
                        <span>{{scope.row.createDate.split(".")[0]}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="status" align="center" label="状态">
                    <template slot-scope="scope">                        
                        <el-tag  size="mini"  v-if="scope.row.generateState ==1" >已生成订单</el-tag>
                        <el-tag  size="mini"  v-if="scope.row.generateState ==0" type="info">未生成订单</el-tag>
                    </template>
                </el-table-column>
                <el-table-column  label="操作" align="center" width="150">
                    <template slot-scope="scope">
                        <el-button size="small"  v-if="scope.row.generateState ==0" type="text" @click="deleteSurveyOrderAnalysis(scope.row)" class="buttontextred">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <div class="pagination-container">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                               :current-page.sync="listQuery.pageNo" :page-sizes="[10,20,30, 50]"
                               :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper"
                               :total="total">
                </el-pagination>
            </div>
    </div>
</template>
<script>   
    import {queryFireSurveyOrder, deleteSurveyOrderAnalysis} from '@/api/diningsurvey';
    import {getSchoolTimeAllList} from '@/api/classroomEvaluation';
    import mixin from '@/mixins/windowResize'    
    export default {
        data: function () {
            return {
                list: null,
                total: null,
                listQuery: {
                    pageNo: 1,
                    pageSize: 20,
                    schoolTimeId:""
                },
                schoolYearList:[],
                myschoolTimeId:""
            }
        },
        mixins: [mixin],
        created() {
            getSchoolTimeAllList().then(res => res.data)
                .then(data => {
                    if (data.code === 200) {
                        this.schoolYearList=data.data;
                        data.data.forEach(item => {
                            if (item.isCurrent == 1) {                                
                                 this.listQuery.schoolTimeId = item.id;
                                 this.myschoolTimeId=item.id;
                                this.queryFireSurveyOrder();
                            }
                        })
                    }
                })
           
        },     
        methods: {
            bookingstatisticsadd() {
                this.$router.push({
                    path: 'bookingstatisticsadd',
                    query:{
                        schoolTimeId:this.listQuery.schoolTimeId
                    }
                });
            },
            bookingstatisticsinfo(val) {
                if(val.type==2){
                    this.$router.push({
                    path: 'bookingstatisticsinfoclass',
                    query: {
                        surveyOrderId: val.id,
                        state:val.state,
                        startDate:val.startDate,
                        endDate:val.endDate,
                        surveyId:val.surveyId,
                        generateState:val.generateState
                    }
                });
                }else{
                     this.$router.push({
                    path: 'bookingstatisticsinfotwo',
                    query: {
                         surveyOrderId: val.id,
                         state:val.state,
                         startDate:val.startDate,
                         endDate:val.endDate,
                         surveyId:val.surveyId,
                         generateState:val.generateState
                    }
                });
                }
                
            },           
            deleteSurveyOrderAnalysis(val) {
                this.$confirm('确定要删除吗？', '提示', {
                    type: 'error'
                }).then(() => {
                    deleteSurveyOrderAnalysis(val.id).then(res => {
                        if (res.data.code === 200) {
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                        }
                        this.queryFireSurveyOrder();

                    }).catch(function () {
                    });
                }).catch(() => {
                });
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            queryFireSurveyOrder() {
                queryFireSurveyOrder(this.listQuery).then(res => {
                    this.list = res.data.data.dataList;
                    if(this.list.length==0&&this.listQuery.pageNo!==1){
                        this.listQuery.pageNo--;
                        this.queryFireSurveyOrder();
                    }
                    this.total = res.data.data.pagination.total;

                })
            },
            handleSizeChange(val) {
                this.listQuery.pageSize = val;
                this.queryFireSurveyOrder();
            },
            handleCurrentChange(val) {
                this.listQuery.pageNo = val;
                this.queryFireSurveyOrder();
            }          
        }
    }
</script>
<style scoped lang="scss">
 .diningsurveyindex{
     padding: 12px;
     .top {
            padding-bottom: 10px;
            overflow: hidden;
        }

        .link {
            color: #409eff;
            cursor: pointer;
        }
 }
</style>
