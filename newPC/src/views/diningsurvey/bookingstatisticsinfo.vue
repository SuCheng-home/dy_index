<template>
    <div class="gatelist">
        <div class="top">
                    <el-button @click="$router.back()" type="default" size="medium">返回</el-button>                     
                <el-select size="medium" v-model="listQuery.gradeId" placeholder="请选择年级" style="width:150px"  @change="getSurveyClassByGradeId()">
                            <el-option label="全部年级" :value="0"></el-option>
                    <el-option v-for="item in gradeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
                <el-select size="medium"  v-model="listQuery.classId" style="width:150px"   v-if="listQuery.gradeId!=0" placeholder="请选择班级" @change="querySurveyOrderUser()">
                            <el-option label="全部班级" :value="0"></el-option>
                    <el-option v-for="item in classList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
                 <el-select size="medium" v-model="listQuery.confirmState" placeholder="请选择" @change="querySurveyOrderUser()">
                 <el-option label="全部状态" :value="0"></el-option>
                 <el-option label="未确认" :value="1"></el-option>
                 <el-option label="确认无误" :value="2"></el-option>
                 <el-option label="确认有误" :value="3"></el-option>
            </el-select>
            <el-button type="primary" size="medium" @click="pushConfirm()" v-if="dateList.length" >推送确认</el-button>
                <el-button type="primary" size="medium" @click="numpop=true" v-if="generateState==0&&dateList.length" >生成订单</el-button>
                <a :href="downLoadHref" v-if="dateList.length>0" target="_blank" download="examName">
                    <el-button type="primary" size="medium">导出</el-button>
                </a> 
                <el-input class="search-input search-input--right" size="medium"
                          placeholder="姓名" icon="el-icon-search" @keyup.enter.native="querySurveyOrderUser"
                          v-model.trim="listQuery.searchName">
                    <el-button slot="append" icon="el-icon-search" @click="querySurveyOrderUser"></el-button>
                </el-input>
        </div>
        <div class="time-table">
            <el-table stripe :data="dateList"  border fit highlight-current-row style="width: 100%" :height="maxH">
                <el-table-column align="center" label="学号" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.stuLearnNum}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="姓名" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.userName}}</span>
                    </template>
                </el-table-column>
                 <el-table-column align="center" label="班级" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.className}}</span>
                    </template>
                </el-table-column>
                 <el-table-column align="center" v-if="query.stuBreakfast"  label="早餐次数" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.breakfastRepastCount}}</span>
                    </template>
                </el-table-column>
                   <el-table-column align="center" v-if="query.stuBreakfast"  label="早餐费用" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.breakfastTotalPrice/100}}</span>
                    </template>
                </el-table-column>
                  <el-table-column align="center" v-if="query.breakMeal"  label="课间餐次数" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.breakMealRepastCount}}</span>
                    </template>
                </el-table-column>
                 <el-table-column align="center" v-if="query.breakMeal"  label="课间餐费用" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.breakMealTotalPrice/100}}</span>
                    </template>
                </el-table-column>
                 <el-table-column align="center" v-if="query.lunch"  label="午餐次数" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.lunchRepastCount}}</span>
                    </template>
                </el-table-column>
                 <el-table-column align="center" v-if="query.lunch"  label="午餐费用" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.lunchTotalPrice/100}}</span>
                    </template>
                </el-table-column>
                 <el-table-column align="center" v-if="query.stuSupper"  label="晚餐次数" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.supperRepastCount}}</span>
                    </template>
                </el-table-column>
                  <el-table-column align="center" v-if="query.stuSupper"  label="晚餐费用" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.supperTotalPrice/100}}</span>
                    </template>
                </el-table-column>
                 <el-table-column align="center"   label="总计费用" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.totalPrice/100}}</span>
                    </template>
                </el-table-column>
                 <el-table-column align="center"   label="状态" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <el-tag  size="mini"  v-if="scope.row.confirmState ==2" >确认无误</el-tag>
                        <el-tag  size="mini"  v-if="scope.row.confirmState ==1" type="info">未确认</el-tag>
                        <el-tag  size="mini"  v-if="scope.row.confirmState ==3" type="danger">确认有误</el-tag>
                    </template>
                </el-table-column>
                 <el-table-column align="center"   label="备注" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.feedback}}</span>
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
       <el-dialog title="生成订单" :close-on-press-escape='false' :close-on-click-modal='false' :visible.sync="numpop" width="600px" :lock-scroll="false" :modal-append-to-body='false'>
		      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="120px" class="demo-ruleForm">
             <el-form-item label="订单主题" prop="name">
                    <el-input v-model.trim="ruleForm.name"  size="medium" placeholder="请输入订单主题" :maxlength="30"></el-input>
                </el-form-item>
            <el-form-item label="截止时间" prop="deadlineDate">
              <el-date-picker   v-model="ruleForm.deadlineDate" size="medium" :clearable="false" type="date" placeholder="请选择截止时间" ></el-date-picker>
            </el-form-item> 
             <el-form-item label="审批人" prop="auditId">
                        <el-radio-group v-model="ruleForm.auditId">
                            <el-radio  v-for="item in sprList" :label="item.id"  :key="item.id">{{item.name}}</el-radio>
                        </el-radio-group>
                </el-form-item> 
             <!-- <el-form-item label="收费类型">
                 <el-tag size="medium">伙食费</el-tag>
            </el-form-item>  -->
      </el-form>
			<span slot="footer" class="dialog-footer">
				<el-button  @click="numpop=false">取 消</el-button>
				<el-button type="primary" @click="generateOrder()">确 定</el-button>
			</span>
		</el-dialog> 
      

    </div>
</template>
<script>
    import {getSurveyGrade,getSurveyClassByGradeId,querySurveyOrderUser,getFireSurveyById,generateOrder,pushConfirm} from "@/api/diningsurvey";
    import mixin from "@/mixins/windowResize";
    import {queryChargeNoticeList} from "@/api/campusFees";
    export default {
        name: "gatelist",
        data: function () {
               const repastDatefun = (rule, value, callback) => {
                if(!this.ruleForm.deadlineDate){
                        return callback(new Error("请选择截止时间"));
                }
                 if(moment(this.ruleForm.deadlineDate).format('YYYY-MM-DD')<moment().format('YYYY-MM-DD')){
                        return callback(new Error("截止时间要大于当前时间"));
                    }
                if(moment(this.ruleForm.deadlineDate).format('YYYY-MM-DD')<this.endDate){
                        return callback(new Error("截止时间要大于批次结时间"));
                    }else {
                    return callback();
                }
                };
            return {
                dateList: [], //表格主题数据
                endDate:this.$route.query.endDate,
                startDate:this.$route.query.startDate,  
                total: null,
                listQuery: {
                    pageNo: 1, //页数
                    pageSize: 20, //条数
                    searchName: "",
                    gradeId: this.$route.query.gradeId,
                    classId: this.$route.query.classId,
                    surveyId:this.$route.query.surveyId,
                    surveyOrderId:this.$route.query.surveyOrderId,
                    chargeType:1,
                    searchVal:"",
                    confirmState:0
                },
                sprList: [],
                generateState:this.$route.query.generateState,
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
                ruleForm:{
                    auditId:"",//	审核人id	number	
                    auditName:"",//	审核人名字	string	
                    deadlineDate:"",//	截止时间	string	
                    moduleSn:this.$route.query.surveyOrderId,//	订单批次id	string	
                    name:"",//	主题	string
                },
                  rules: {
                        deadlineDate: [{ validator: repastDatefun, trigger: "change", required: true }],
                        name: [{ required: true, message: '请输入订单主题', trigger: 'blur' }],
                        auditId: [{ required: true, message: '请选择审核人', trigger: 'change' }],
                    },  
                    numpop:false
            };
        },
        mixins: [mixin],
        //获取渲染数据当数据加载完成后执行(生命周期中的钩子函数)
        created() {
            this.ruleForm.name=this.startDate+"~"+this.endDate+ " 伙食费订单"
            let dateTime= new Date(this.endDate) // this.startTime = '2022-05-02'
                dateTime.setDate(dateTime.getDate() + 6)
            this.ruleForm.deadlineDate= dateTime.getFullYear() + '-' + (dateTime.getMonth() + 1) + "-" + dateTime.getDate();
             queryChargeNoticeList(this.listQuery).then(res => {
                let data = res.data.data;
                this.sprList = data.sprList;
                if(data.sprList[0].id){
                    this.ruleForm.auditId = data.sprList[0].id;
                }                
                });
             getFireSurveyById(this.$route.query.surveyId).then(res => {
                    let data = res.data.data;
                  this.query.supper = data.supper == 1; 
                    this.query.stuSupper = data.supper == 1;
                    this.query.breakMeal = data.breakMeal == 1;
                    this.query.stuBreakfast = data.breakfast == 1;                    
                    this.query.breakfast = data.breakfast == 1;
                    this.query.lunch = data.lunch == 1;
                }).catch();
            getSurveyGrade(this.$route.query.surveyId).then(res => res.data).then(data => {
                this.gradeList = data.data;
                if (data.data.length !== 0) {
                    this.getSurveyClassByGradeId(1);
                }
            });
            this.querySurveyOrderUser();
        },
        methods: {   
            pushConfirm() {
                this.$confirm('确定要推送确认吗？', '提示', {
                    type: 'error'
                }).then(() => {
                    pushConfirm(this.$route.query.surveyOrderId).then(res => {
                        if (res.data.code === 200) {
                            this.$message({
                                type: 'success',
                                message: '推送确认成功!'
                            });
                        }
                        this.querySurveyOrderUser();

                    }).catch(function () {
                    });
                }).catch(() => {
                });
            },
            generateOrder() {  
      this.$refs.ruleForm.validate(valid => {        
        if (valid) {   
            let auditName="";
            for(let i=0;i<this.sprList.length;i++){
                if(this.sprList[i].id==this.ruleForm.auditId){
                    auditName=this.sprList[i].name;
                }
                }           
            let obj={
                auditName:auditName,
                deadlineDate:moment(this.ruleForm.deadlineDate).format('YYYY-MM-DD'),//	结束时间	string		
                auditId:this.ruleForm.auditId,//	状态，1保存，2发布，3完成调查	number	
                moduleSn:this.ruleForm.moduleSn,//	1教师，2学生	number	
                 name:this.ruleForm.name,//	1教师，2学生	number
            }       
           generateOrder(obj).then(res => res.data).then(data => {
                                    if(data.result) {
                                        this.$message({
                                            message: '生成订单成功！',
                                            type: 'success',
                                            duration: 1000
                                        });
                                        this.numpop=false;
                                       this.generateState=1
                }else{
                    this.$message({
                                            message: data.msg,
                                            type: 'danger',
                                            duration: 1000
                                        });
                }
            }).catch(() => {})
        }
      });
    }, 
            //获取班级
            getSurveyClassByGradeId(num) {
                this.classList = [];
                if(!num){
                   this.listQuery.classId = 0;
                }
                if (this.listQuery.gradeId != 0) {
                    getSurveyClassByGradeId(this.$route.query.surveyId,this.listQuery.gradeId).then(res => res.data).then(data => {
                        this.classList = data.data;
                        if (data.data.length !== 0) {
                            this.querySurveyOrderUser();
                        }
                    });

                } else {
                    this.querySurveyOrderUser();
                }

            },
            querySurveyOrderUser() {
                this.dateList = [];   
                 this.downLoadHref =
                    global.BasePath +
                    "structure/fire/downSurveyOrderUser?classId=" +
                    this.listQuery.classId +
                    "&confirmState=" +
                    this.listQuery.confirmState +
                    "&gradeId=" +
                   this.listQuery.gradeId+
                   "&searchName=" +
                   this.listQuery.searchName+
                     "&surveyOrderId=" +
                    this.listQuery.surveyOrderId+
                    "&token=" +
                    this.$store.getters.token;             
                querySurveyOrderUser(this.listQuery).then(res => {
                    let data = res.data.data;
                    this.dateList = data.dataList;
                    this.total = data.pagination.total;
                });
            },

            handleSizeChange(val) {
                this.listQuery.pageNo = 1;
                this.listQuery.pageSize = val;
                this.querySurveyOrderUser();
            },
            handleCurrentChange(val) {
                this.querySurveyOrderUser();
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
