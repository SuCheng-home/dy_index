<template>
    <div class="gatelist">
        <div class="top">
                    <el-button @click="$router.back()" type="default" size="medium">返回</el-button> 
                     <el-select size="medium"  v-model="listQuery.type"     placeholder="请选择类型" @change="querySurveyTeacher()">
                            <el-option label="全部订餐餐次" :value="0"></el-option>
                            <el-option label="早餐" v-if="query.breakfast" :value="1"></el-option>
                            <el-option label="午餐" v-if="query.teacherLunch" :value="2"></el-option>
                            <el-option label="晚餐"    v-if="query.supper" :value="4"></el-option>  
                            <el-option label="不订餐" :value="5"></el-option>                  
                </el-select>
                    <el-button type="primary" size="medium" @click="diningsurveyaddpeople()">添加人员</el-button>
                <el-button type="primary" size="medium" v-if="state!=3" @click="finishSurvey()">完成调查</el-button>
                <el-button type="primary" size="medium" @click="remindUnSubmitUser()">提醒未订人员</el-button>
                <a :href="downLoadHref" v-if="dateList.length>0" target="_blank" download="examName">
                    <el-button type="primary" size="medium">导出</el-button>
                </a>
                <el-input class="search-input search-input--right" size="medium"
                          placeholder="姓名" icon="el-icon-search" @keyup.enter.native="querySurveyTeacher"
                          v-model.trim="listQuery.searchName">
                    <el-button slot="append" icon="el-icon-search" @click="querySurveyTeacher"></el-button>
                </el-input>
        </div>
        <div class="time-table">
            <el-table stripe :data="dateList"  border fit highlight-current-row style="width: 100%" :height="maxH">
             
                <el-table-column align="center" label="姓名" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.teacherName}}</span>
                    </template>
                </el-table-column>
                 <el-table-column align="center" label="部门" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.departName}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="订餐内容">
                    <template slot-scope="scope">
                        <span v-if="scope.row.submitState==2">
                            <span v-if="scope.row.repastState==1">不订餐</span>
                            <span v-else>
                                <span v-if="scope.row.breakfast==2&&(listQuery.type==0||listQuery.type==1)">早餐 &nbsp;</span>
                                <span v-if="scope.row.lunch==2&&(listQuery.type==0||listQuery.type==2)">午餐 &nbsp;</span>
                                <span v-if="scope.row.breakMeal==2&&(listQuery.type==0||listQuery.type==3)">课间餐 &nbsp;</span>
                                <span v-if="scope.row.supper==2&&(listQuery.type==0||listQuery.type==4)">晚餐 &nbsp;</span>
                            </span>
                        </span>
                        <span v-else>----</span>
                    </template>
                </el-table-column>
                 <el-table-column  label="操作" align="center" width="150">
                    <template slot-scope="scope">
                        <el-button size="small"  type="text" @click="deleteSurveyUser(scope.row)" class="buttontextred">删除</el-button>
                         <el-button size="small" type="text" @click="diningsurveyeidt(scope.row)">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
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
    import {querySurveyTeacher,remindUnSubmitUser,finishSurvey,deleteSurveyUser,getFireSurveyById} from "@/api/diningsurvey";
    import mixin from "@/mixins/windowResize";
    import ImagePreviewer from "@/components/ImagePreviewer/ImagePreviewer.vue";
    export default {
        name: "gatelist",
        data: function () {
            return {
                state:this.$route.query.state,
                dateList: [], //表格主题数据
                total: null,
                listQuery: {
                    pageNo: 1, //页数
                    pageSize: 20, //条数
                    searchName: "",
                    gradeId: 0,
                    classId: 0,
                    surveyId:this.$route.query.surveyId,
                    type:0
                },
                downLoadHref: "",
                gradeList: [],
                classList: [],
                query: {
                    lunch:true,//	午餐，1代表有午餐，0代表无午餐	number
                    stuSupper:"",//	学生晚餐，1代表有晚餐，0代表无晚餐	number
                    stuBreakfast:"",//	学生早餐，1代表有早餐，0代表无早餐	number	
                    breakMeal:"",//	课间餐，1代表有课间餐，0代表无课间餐	number
                    teacherLunch:true,//	教师午餐，1代表有午餐，0代表无午餐	number
                    breakfast:"",//	早餐，1代表有早餐，0代表无早餐	number
                    supper:"",//	晚餐，0无晚餐，1有晚餐	number
                },      
            };
        },
        mixins: [mixin],
        //获取渲染数据当数据加载完成后执行(生命周期中的钩子函数)
        created() {
             getFireSurveyById(this.$route.query.surveyId).then(res => {
                    let data = res.data.data;
                   this.query.supper = data.supper == 1; 
                    this.query.stuSupper = data.supper == 1;
                    this.query.breakMeal = data.breakMeal == 1;
                    this.query.stuBreakfast = data.breakfast == 1;                    
                    this.query.breakfast = data.breakfast == 1;
                    this.query.teacherLunch = data.lunch == 1;
                }).catch();
            this.querySurveyTeacher();
        },
        methods: {
              diningsurveyeidt(obj){
                this.$router.push({
                    path: 'diningsurveyeidt',
                    query:{
                        surveyId:this.$route.query.surveyId,
                        type:1,
                        userId:obj.teacherId,
                        id:obj.id
                    }
                });
            },
            diningsurveyaddpeople(){
                this.$router.push({
                    path: 'diningsurveyaddpeople',
                    query:{
                        surveyId:this.$route.query.surveyId,
                        type:1,
                        startDate:this.$route.query.startDate,
                        endDate:this.$route.query.endDate,
                        state:this.$route.query.state,
                    }
                });
            },
            deleteSurveyUser(val) {
                this.$confirm('确定要删除吗？', '提示', {
                    type: 'error'
                }).then(() => {
                    deleteSurveyUser(val.id).then(res => {
                        if (res.data.code === 200) {
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                        }
                        this.querySurveyTeacher();

                    }).catch(function () {
                    });
                }).catch(() => {
                });
            },
            finishSurvey() {
                this.$confirm('确定要完成调查吗？', '提示', {
                    type: 'success'
                }).then(() => {
                    finishSurvey(this.$route.query.surveyId).then(res => {
                        if (res.data.code === 200) {
                            this.$message({
                                type: 'success',
                                message: '完成调查成功!'
                            });
                            this.state=3;
                        }
                        this.querySurveyTeacher();

                    }).catch(function () {
                    });
                }).catch(() => {
                });
            },
             remindUnSubmitUser() {
                this.$confirm('确定要提醒未订人员吗？', '提示', {
                    type: 'success'
                }).then(() => {
                    remindUnSubmitUser(this.$route.query.surveyId,1).then(res => {
                        if (res.data.code === 200) {
                            this.$message({
                                type: 'success',
                                message: '提醒成功!'
                            });
                        }
                        this.querySurveyTeacher();

                    }).catch(function () {
                    });
                }).catch(() => {
                });
            },
            querySurveyTeacher() {
                this.dateList = [];
                this.downLoadHref =
                    global.BasePath +
                    "structure/fire/downSurveyTeacher?searchName=" +
                    this.listQuery.searchName +
                    "&surveyId=" +
                    this.listQuery.surveyId +
                    '&pageNo=' +
                    this.listQuery.pageNo +
                    '&pageSize=' +
                    this.listQuery.pageSize +
                     "&state=" +
                   this.listQuery.type+
                    "&token=" +
                    this.$store.getters.token;
                querySurveyTeacher(this.listQuery).then(res => {
                    let data = res.data.data;
                    this.dateList = data.dataList;
                    this.total = data.pagination.total;
                });
            },

            handleSizeChange(val) {
                this.listQuery.pageNo = 1;
                this.listQuery.pageSize = val;
                this.querySurveyTeacher();
            },
            handleCurrentChange(val) {
                this.querySurveyTeacher();
            }
        }
    };
</script>
<style scoped>
    .gatelist {
        padding: 12px;
    }

    .gatelist .top {
        padding-bottom: 10px;
        overflow: hidden;
    }

</style>
