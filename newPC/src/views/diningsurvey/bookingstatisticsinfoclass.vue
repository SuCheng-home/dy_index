<template>
    <div class="gatelist">
        <div class="top">
                    <el-button @click="$router.back()" type="default" size="medium">返回</el-button> 
            <el-button type="primary" size="medium" @click="pushConfirm()" v-if="dateList.length" >推送确认</el-button>
                <el-button type="primary" size="medium" @click="numpop=true" v-if="generateState==0&&dateList.length" >生成订单</el-button>
                <a :href="downLoadHref" v-if="dateList.length>0" target="_blank" download="examName">
                    <el-button type="primary" size="medium">导出</el-button>
                </a> 
        </div>
        <div class="time-table">
            <el-table stripe :data="dateList"  border fit highlight-current-row style="width: 100%" :height="maxH">               
                 <el-table-column align="center" label="班级" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span class="link" @click="bookingstatisticsinfo(scope.row)">{{scope.row.className}}</span>
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
            </el-table>
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
    import {surveyOrderAnalysisGroupByClassId,getFireSurveyById,generateOrder,pushConfirm} from "@/api/diningsurvey";
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
                    gradeId: 0,
                    classId: 0,
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
            this.surveyOrderAnalysisGroupByClassId();
        },
        methods: {   
            bookingstatisticsinfo(obj){
                    this.$router.push({
                    path: 'bookingstatisticsinfo',
                    query: {
                        surveyOrderId: this.$route.query.surveyOrderId,
                        state:this.$route.query.state,
                        startDate:this.$route.query.startDate,
                        endDate:this.$route.query.endDate,
                        surveyId:this.$route.query.surveyId,
                        generateState:this.$route.query.generateState,
                        gradeId:obj.gradeId,
                        classId:obj.classId
                    }
            })
            },
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
                        this.surveyOrderAnalysisGroupByClassId();

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
        
            surveyOrderAnalysisGroupByClassId() {
                this.dateList = [];   
                 this.downLoadHref =
                    global.BasePath +
                    "structure/fire/downSurveyOrderAnalysisGroupByClassId?surveyOrderId=" +
                    this.listQuery.surveyOrderId +
                    "&token=" +
                    this.$store.getters.token;             
                surveyOrderAnalysisGroupByClassId(this.listQuery.surveyOrderId).then(res => {
                    let data = res.data.data;
                    this.dateList = data;
                });
            },
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
