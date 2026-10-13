<template>
    <div class="diningsurveyindex">
        <div class="top">
             <el-select size="medium" v-model="listQuery.schoolTimeId" placeholder="请选择学期" @change="queryFireSurvey()">
                <el-option v-for="item in schoolYearList" :key="item.id" :label="item.schoolTimeName"
                           :value="item.id"></el-option>
            </el-select>
            <el-button class="filter-item" size="medium" type="primary" v-if="myschoolTimeId==listQuery.schoolTimeId" @click="diningsurveyadd()">新建</el-button>
        </div>          
            <el-table stripe :data="list"  border fit highlight-current-row :height="maxH" ref="mainTable">
                <el-table-column prop="title" align="center" label="订餐时间范围">
                    <template slot-scope="scope">
                        <span class="link" @click="diningsurveyinfo(scope.row)">{{scope.row.startDate}}~{{scope.row.endDate}}</span>
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip align="center" label="面向对象">
                    <template slot-scope="scope">
                        <span>{{scope.row.type==1?"老师":"学生" }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="createUser" align="center" label="发布人">
                    <template slot-scope="scope">
                        <span>{{scope.row.createName}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="createDate" align="center" label="发布时间">
                    <template slot-scope="scope">
                        <span>{{scope.row.createDate.split(".")[0]}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="status" align="center" label="状态">
                    <template slot-scope="scope">                        
                        <el-tag  size="mini" v-if="scope.row.state ==2" >调查中</el-tag>
                        <el-tag  size="mini" v-if="scope.row.state ==3" type="success">已完成</el-tag>
                    </template>
                </el-table-column>
                <el-table-column  label="操作" align="center" width="150">
                    <template slot-scope="scope">
                        <el-button size="small" type="text" @click="deleteRecipe(scope.row)" class="buttontextred">删除</el-button>
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
    import {queryFireSurvey, deleteRecipe} from '@/api/diningsurvey';
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
                                this.queryFireSurvey();
                            }
                        })
                    }
                })
           
        },     
        methods: {
            diningsurveyadd() {
                this.$router.push({
                    path: 'diningsurveyadd',
                    query:{
                        schoolTimeId:this.listQuery.schoolTimeId
                    }
                });
            },
            diningsurveyinfo(val) {
                if(val.type==2){
                    this.$router.push({
                    path: 'diningsurveyinfo',
                    query: {
                        surveyId: val.id,
                        state:val.state,
                        startDate:val.startDate,
                         endDate:val.endDate,
                    }
                });
                }else{
                     this.$router.push({
                    path: 'diningsurveyinfotwo',
                    query: {
                        surveyId: val.id,
                         state:val.state,
                         startDate:val.startDate,
                         endDate:val.endDate,
                    }
                });
                }
                
            },           
            deleteRecipe(val) {
                this.$confirm('确定要删除吗？', '提示', {
                    type: 'error'
                }).then(() => {
                    deleteRecipe(val.id).then(res => {
                        if (res.data.code === 200) {
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                        }
                        this.queryFireSurvey();

                    }).catch(function () {
                    });
                }).catch(() => {
                });
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            queryFireSurvey() {
                queryFireSurvey(this.listQuery).then(res => {
                    this.list = res.data.data.dataList;
                    if(this.list.length==0&&this.listQuery.pageNo!==1){
                        this.listQuery.pageNo--;
                        this.queryFireSurvey();
                    }
                    this.total = res.data.data.pagination.total;

                })
            },
            handleSizeChange(val) {
                this.listQuery.pageSize = val;
                this.queryFireSurvey();
            },
            handleCurrentChange(val) {
                this.listQuery.pageNo = val;
                this.queryFireSurvey();
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
