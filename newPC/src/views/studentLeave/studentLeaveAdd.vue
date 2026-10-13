<template>
    <div class="leaveAddContent">
        <div class="leaveAddHeade">
            <back-tool>
                <el-button size="medium" class="filter-item" type="primary" @click="addStudentLeave">保存</el-button>
            </back-tool>
            <div class="mainWrap" :style="`height:${nobottommaxH}px`">
                <div class="leaveAdd">
                    <el-form :model="ruleForm" ref="ruleForm" :rules="rules" label-width="150px" class="demo-ruleForm">
                        <el-form-item label="请假学生" prop="addressName">
                            <address-book v-model="ruleForm.addressData" :config="configData"
                                          ref="address"></address-book>
                        </el-form-item>
                       
                        <el-form-item label="请假类型" prop="leaveType">
                            <el-select v-model="ruleForm.leaveType" @change="selectCheckFun">
                                <el-option :label="item.stuAskleaveTypeName" :value="item.stuAskleaveTypeId"
                                           v-for="item in stuAskleaveTypeList"
                                           :key="item.stuAskleaveTypeId"></el-option>
                            </el-select>
                        </el-form-item>
                         <el-form-item label="就读类型" prop="liveType" v-if="isLiveRemind == 2&&ruleForm.leaveType !== 8&&ruleForm.leaveType !== 9&&ruleForm.leaveType !== 10">
                            <el-radio-group v-model="ruleForm.liveType">
                                <el-radio label="1" >走读</el-radio>
                                <el-radio label="2" >住宿</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="病假类型" v-if="ruleForm.leaveType === 1&&isSickTypeGroup==1" prop="sickType">
                            <el-select v-model="ruleForm.sickType" @change="sickTypeChange">
                                <el-option :label="item.stuAskleaveTypeName" :value="item.stuAskleaveTypeId"
                                           v-for="item in stuAskleaveSickTypeList"
                                           :key="item.stuAskleaveTypeId"></el-option>
                            </el-select>
                        </el-form-item>
                          <el-form-item label="填写疾病类型" v-if="ruleForm.leaveType === 1&&(ruleForm.sickType==3)" prop="newsickTypeName">
                            <el-input type="text" v-model.trim="ruleForm.newsickTypeName"  placeholder="请填写疾病类型" ></el-input>
                        </el-form-item>
                         <el-form-item label="病假症状" v-if="ruleForm.leaveType === 1&&symptomHav==2" prop="symptomJsonlist">
                            <el-checkbox-group v-model="ruleForm.symptomJsonlist">
                                    <el-checkbox :label="item.stuAskleaveTypeName"  name="type" :key="index" v-for="(item,index) in symptomJsonlist"></el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                        <el-form-item label="最高体温（°C）" v-if="ruleForm.leaveType === 1&&symptomHav==2&&namefun(1)" prop="temperature">
                           <el-input-number v-model.trim="ruleForm.temperature"  :precision="1"   controls-position="right" :min="35" :max="45"></el-input-number>
                        </el-form-item>
                        <el-form-item label="24小时内几次（次）" v-if="ruleForm.leaveType === 1&&symptomHav==2&&namefun(2)" prop="sickNum">
                           <el-input-number v-model.trim="ruleForm.sickNum"  :precision="0"  step-strictly controls-position="right" :min="1" :max="100" :step="1"></el-input-number>
                        </el-form-item>
                         <el-form-item label="就医情况" v-if="ruleForm.leaveType === 1" prop="medicalType">
                           <el-select v-model="ruleForm.medicalType">
                                <el-option :label="item.stuAskleaveTypeName" :value="item.stuAskleaveTypeName"
                                           v-for="item in medicalTypelist"
                                           :key="item.stuAskleaveTypeId"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="就诊医院" v-if="ruleForm.leaveType === 1&&(ruleForm.medicalType=='门诊'||ruleForm.medicalType=='住院')" prop="hospital">
                            <el-input type="text" v-model.trim="ruleForm.hospital"  placeholder="请填写就诊医院" ></el-input>
                        </el-form-item>
                        <el-form-item label=""  v-if="ruleForm.showStopFire!==1&&(lunch === 1||breakMeal === 1)&&ruleForm.leaveType !== 7&&ruleForm.leaveType !== 8&&ruleForm.leaveType !== 9&&ruleForm.leaveType !== 10"
                                      prop="havingDinner">
                            <el-checkbox-group v-model="ruleForm.havingDinner">
                                <el-checkbox label="停早餐伙" name="type" v-if="stuBreakfast === 1"></el-checkbox>
                                <el-checkbox label="停课间餐" name="type" v-if="breakMeal === 1"></el-checkbox>
                                <el-checkbox label="停午餐伙" name="type" v-if="lunch === 1"></el-checkbox>
                                <el-checkbox label="停晚餐伙" name="type" v-if="stuSupper === 1"></el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                         <el-form-item label="请假方式" v-if="ruleForm.leaveType !== 8&&ruleForm.leaveType !== 9&&ruleForm.leaveType !== 10">
                              <el-radio-group v-model="ruleForm.isClassHour">
                              <el-radio :label="0">天数请假</el-radio>
                              <el-radio :label="1">节次请假</el-radio>
                        </el-radio-group>
                        </el-form-item>
                        <el-form-item label="请假日期" prop="startDate">
                            <div class="leaveTime">
                                <el-date-picker @change="listTimeByWeekDays()"
                                    v-model="ruleForm.startDate"
                                    type="date"
                                    :clearable="false"
                                    placeholder="选择日期">
                                </el-date-picker>
                                <el-select v-model="ruleForm.isMorningName" style="width: 100px; margin-left: 20px"
                                           v-if="(ruleForm.leaveType !== 7)&&ruleForm.leaveType !== 8&&ruleForm.leaveType !== 9&&ruleForm.leaveType !== 10&&(ruleForm.isClassHour==0)">
                                    <el-option label="上午" value="上午"></el-option>
                                    <el-option label="下午" value="下午"></el-option>
                                </el-select>
                            </div>
                        </el-form-item>
                        <el-form-item label="请假天数" prop="leaveDateCount" v-if="(ruleForm.leaveType !== 7)&&(ruleForm.leaveType !== 20)&&(ruleForm.isClassHour==0)&&ruleForm.leaveType !== 8&&ruleForm.leaveType !== 9&&ruleForm.leaveType !== 10">
                            <el-select v-model="ruleForm.leaveDateCount">
                                <el-option label="0.5" value=0.5></el-option>
                                <el-option label="1" value=1></el-option>
                                <el-option label="1.5" value=1.5></el-option>
                                <el-option label="2" value=2></el-option>
                                <el-option label="2.5" value=2.5></el-option>
                                <el-option label="3" value=3></el-option>
                            </el-select>
                        </el-form-item>
                         <el-form-item label="请假节次" v-if="ruleForm.isClassHour==1&&ruleForm.leaveType !== 8&&ruleForm.leaveType !== 9&&ruleForm.leaveType !== 10">
                            <el-slider  v-model="slidervalue"  :marks="slidermarks"  :max="courseListFull.length-1" show-stops  range  :format-tooltip="formatTooltip" ></el-slider>
                        </el-form-item>
                        <el-form-item label="请假事由" v-show="ruleForm.leaveType ==0&&reasonHav==2">
                            <el-radio-group v-model="ruleForm.nametype" @change="nametypefun()">
                                <el-radio :label="item.stuAskleaveTypeName" :key="index" v-for="(item,index) in reasonJsonlist">{{item.stuAskleaveTypeName}}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="事件描述" prop="content">
                            <el-input type="textarea" v-model.trim="ruleForm.content" placeholder="请填写请假事由及描述(1-100个字符)"
                                      :rows="4" resize="none" :maxlength="100"></el-input>
                        </el-form-item>
                        <el-form-item label="上传图片">
                            <uploader pathPrefix="xueshengqingjia2" module="xueshengqingjia2" moduleCode="1247" multiple v-model="files" :extList="['jpeg', 'jpg', 'bmp', 'gif', 'png']" showMode="image" showResult="image" :lineList="false"></uploader>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import BackTool from '@/components/BackTool';
    import AddressBook from '@/components/AddressBook/indexExpand';
    import mixin from '@/mixins/windowResize';
    import Uploader from '@/components/Uploader/WebUploader';
    import moment from "moment";
    import {getFireSet, getStuAskleaveInitInfo, addStuAskleaveByClassHeader,listTimeByWeekDay,addStuAskleaveByClassHeaderList} from '@/api/studentLeave';

    const LeaveState = {NO: 1, AGREE: 2, Her: 3};
    const IsBatch = {YES: 1, NO: 2};//是否审批（1代表需要审批,2代表不需要审批）
    export default {
        components: {
            BackTool,
            AddressBook,
            Uploader
        },
        data() {
            const checkTitle = (rule, value, callback) => {
                if (!this.ruleForm.addressData.userJson || this.ruleForm.addressData.userJson.length < 1) {
                    callback(new Error('请选择学生'));
                } else {
                    callback()
                }
            };
            const liveTypeValidator = (rule, value, callback) => {
                if (this.isLiveRemind == 2 && !this.ruleForm.liveType) {
                    callback(new Error('请选择就读类型'));
                } else {
                    callback()
                }
            };
            return {
                isLiveRemind: 1,
                reasonHav:1,
                isSickTypeGroup:0,
                symptomHav:'1',
                symptomJsonlist:[],
                medicalTypelist:[],
                files: [],
                configData: {
                    title: '请选择学生',
                    depart: {target: 'user', departType: 's', userTypes: '2'},
                    // SingleChose: true
                },
                stuAskleaveTypeList: [],
                stuAskleaveSickTypeList: [],
                reasonJsonlist:[],
                ruleForm: {
                    liveType: '',
                    addressData: {userJson: []},//学生姓名
                    leaveType: 0,//请假类型
                    leaveTypeName: '',
                    sickTypeName: '',
                    sickType: 0,
                    hospital: '',
                    havingDinner: [],
                    startDate: moment().format('YYYY-MM-DD'),
                    isMorning: '',
                    isMorningName: '上午',
                    leaveDateCount: 0.5,
                    isHer: 0,
                    isBatch: 2,
                    content: '',
                    showStopFire: 0,
                    nametype:'',
                    symptomJsonlist:[],
                    medicalType:'',
                    isClassHour:0,
                    newsickTypeName:"",
                    temperature:'',
                    sickNum:''

                },
                slidervalue:[0,0],
                slidermarks:{},
                courseListFull: [],
                // 校验
                rules: {
                    addressName: [{
                        required: true,
                        validator: checkTitle
                    }],
                    symptomJsonlist: [
                        { type: 'array', required: true, message: '请至少选择一个症状', trigger: 'change' }
                    ],
                    // 请假类型
                    leaveType: [
                        {
                            required: true,
                            message: '请假类型不能为空', //规则提示
                            trigger: 'change'  //何事件触发
                        }
                    ],
                    // 病假类型
                    sickType: [
                        {
                            required: true,
                            message: '病假类型不能为空', //规则提示
                            trigger: 'change'  //何事件触发
                        }
                    ],
                    medicalType: [
                        {
                            required: true,
                            message: '就医情况不能为空', //规则提示
                            trigger: 'change'  //何事件触发
                        }
                    ],
                    // 请假日期
                    startDate: [
                        {
                            required: true,
                            message: '请假日期不能为空', //规则提示
                            trigger: 'blur'  //何事件触发
                        }
                    ],
                    // 请假天数
                    leaveDateCount: [
                        {
                            required: true,
                            message: '请假天数不能不写', //规则提示
                            trigger: 'change'  //何事件触发
                        }
                    ],
                    newsickTypeName: [
                        {
                            required: true,
                            message: '请填写疾病类型', //规则提示
                            trigger: 'change'  //何事件触发
                        }
                    ],
                     temperature: [
                        {
                            required: true,
                            message: '请输入最高体温', //规则提示
                            trigger: 'blur'  //何事件触发
                        }
                    ],
                    sickNum: [
                        {
                            required: true,
                            message: '请输入24小时内几次', //规则提示
                            trigger: 'blur'  //何事件触发
                        }
                    ],
                    hospital: [
                        {
                            required: true,
                            message: '请填写就诊医院', //规则提示
                            trigger: 'change'  //何事件触发
                        }
                    ],
                    content: [
                        {
                            required: true,
                            message: '请假事由不能为空', //规则提示
                            trigger: 'blur'  //何事件触发
                        }
                    ],
                    liveType: [{
                        required: true,
                        validator: liveTypeValidator
                    }],

                },
                stopFire: 1,
                stopFireClassNum: 1,
                isMorning: 0,
                breakMeal: 0, //课间餐
                lunch: 0, //午餐
                showStopLimit:1,
                stuSupper:0,
                stuBreakfast:0,
                mysupper:1,
                mybreakMeal:1

            }
        },
        mixins: [mixin],
        watch: {
            'ruleForm.addressData': {
                handler: function (val, oldVal) {
                    this.$refs.ruleForm.validateField('addressName');
                },
                deep: true
            }
        },
        created() {
            // 数据回显
            getFireSet().then(res => res.data)
                .then(data => {
                    this.breakMeal = data.data.breakMeal;
                    this.lunch = data.data.lunch;
                    this.stuSupper = data.data.stuSupper;
                    this.stuBreakfast = data.data.stuBreakfast;
                }).catch(() => {
            });
            getStuAskleaveInitInfo().then(res => {
                const data = res.data.data;
                this.isLiveRemind = data.isLiveRemind
                this.stuAskleaveTypeList = data.stuAskleaveTypeList;
                if (this.stuAskleaveTypeList.length > 0) {
                    this.ruleForm.leaveType = data.stuAskleaveTypeList[0].stuAskleaveTypeId;
                    this.ruleForm.leaveTypeName = data.stuAskleaveTypeList[0].stuAskleaveTypeName;

                }
                this.ruleForm.showStopFire = data.showStopFire;
                this.ruleForm.isBatch = data.isBatch;
                this.showStopLimit=data.showStopLimit;
                this.ruleForm.isHer = data.isHer;
                this.reasonHav=data.reasonHav;
                this.symptomHav=data.symptomHav;
                this.isSickTypeGroup=data.isSickTypeGroup;
                this.reasonJsonlist =JSON.parse(data.reasonJson);
                this.symptomJsonlist=JSON.parse(data.symptomJson);
                this.medicalTypelist=JSON.parse(data.medicalTypeJson);
                for(let i=0;i<JSON.parse(data.sickTypeJson).length;i++){
                    if(JSON.parse(data.sickTypeJson)[i].stuAskleaveTypeName){
                       this.stuAskleaveSickTypeList.push(JSON.parse(data.sickTypeJson)[i])
                    }else{
                      this.stuAskleaveSickTypeList.push({
                          stuAskleaveTypeName:JSON.parse(data.sickTypeJson)[i].stuAskleaveSickTypeName,
                          stuAskleaveTypeId:JSON.parse(data.sickTypeJson)[i].stuAskleaveSickTypeId
                      })
                    }
                };
            })
            this.listTimeByWeekDays();
        },
        methods: {
            namefun(num){
              if(num==1){
                  for(let i=0;i<this.ruleForm.symptomJsonlist.length;i++){
                        if(this.ruleForm.symptomJsonlist[i]=='发热'){
                               return true;
                        }
                  }
              }
              if(num==2){
                   for(let i=0;i<this.ruleForm.symptomJsonlist.length;i++){
                        if(this.ruleForm.symptomJsonlist[i]=='呕吐'||this.ruleForm.symptomJsonlist[i]=='腹泻'){
                               return true;
                        }
                  }
              }
              return false;
            },
            listTimeByWeekDays(){
                this.slidermarks={};
                this.courseListFull=[];
                this.slidervalue=[0,0]
              const weekDay = this.$moment(this.ruleForm.startDate).weekday();
                    listTimeByWeekDay(weekDay).then(res => res.data).then(data => {
                            const pageData = data.data.filter(({type}) => type === 2 || type === 4);
                            this.courseListFull = pageData;
                            if(pageData.length==4){
                                this.slidermarks={0:'1',1:'2',2:'3',3:'4'}
                            }
                            if(pageData.length==5){
                                this.slidermarks={0:'1',1:'2',2:'3',3:'4',4:'5'}
                            }
                            if(pageData.length==6){
                                this.slidermarks={0:'1',1:'2',2:'3',3:'4',4:'5',5:'6'}
                            }
                            if(pageData.length==7){
                                this.slidermarks={0:'1',1:'2',2:'3',3:'4',4:'5',5:'6',6:'7'}
                            }
                            if(pageData.length==8){
                                this.slidermarks={0:'1',1:'2',2:'3',3:'4',4:'5',5:'6',6:'7',7:'8'}
                            }
                            if(pageData.length==9){
                                this.slidermarks={0:'1',1:'2',2:'3',3:'4',4:'5',5:'6',6:'7',7:'8',8:'9'}
                            }
                            if(pageData.length==10){
                                this.slidermarks={0:'1',1:'2',2:'3',3:'4',4:'5',5:'6',6:'7',7:'8',8:'9',9:'10'}
                            }
                        });
            },
              formatTooltip(val) {
                  if(this.courseListFull[val].alias){
                    return this.courseListFull[val].alias;
                  }

             },
            nametypefun(){
                 this.ruleForm.content=this.ruleForm.nametype;
            },
            sickTypeChange(val) {
                this.ruleForm.sickType = val;
                let sickTypeNameList = this.stuAskleaveSickTypeList.find(item => item.stuAskleaveTypeId == val);
                this.ruleForm.sickTypeName = sickTypeNameList.stuAskleaveTypeName;

            },
            selectCheckFun(val) {
                this.ruleForm.leaveType = val;

                if (this.ruleForm.leaveType == 1) {
                    if (this.stuAskleaveSickTypeList.length > 0) {
                        this.ruleForm.sickType = this.stuAskleaveSickTypeList[0].stuAskleaveTypeId;
                        this.ruleForm.sickTypeName = this.stuAskleaveSickTypeList[0].stuAskleaveTypeName;
                    }
                } else {
                    this.ruleForm.sickType = 0;
                    this.ruleForm.sickTypeName = '';
                }
                let sickTypeLevelList = this.stuAskleaveTypeList.find(item => item.stuAskleaveTypeId == val);
                this.ruleForm.leaveTypeName = sickTypeLevelList.stuAskleaveTypeName;
               },

            // 保存
            addStudentLeave() {
                if(this.courseListFull.length==0&&this.ruleForm.isClassHour==1){
                    this.$message({
                        type: "error",
                        message: "当前日期暂未设置节次！"
                        });
                        return false;
                }
              if (this.ruleForm.showStopFire == 1) {
                    this.stopFireClassNum = 1;
                    this.stopFire = 1;
                    this.mysupper = 1;
                    this.mybreakMeal = 1;
                } else {
                    this.stopFireClassNum = this.ruleForm.havingDinner.indexOf('停课间餐') == -1 ? 1 : 2;
                    this.stopFire = this.ruleForm.havingDinner.indexOf('停午餐伙') == -1 ? 1 : 2;
                    this.mysupper = this.ruleForm.havingDinner.indexOf('停晚餐伙') == -1 ? 1 : 2;
                    this.mybreakMeal = this.ruleForm.havingDinner.indexOf('停早餐伙') == -1 ? 1 : 2;
                };
                let leaveState;
                let leaveStateName;
                if (this.isBatch == IsBatch.NO) {
                    leaveState = LeaveState.AGREE
                    leaveStateName = '同意'
                } else {
                    leaveState = LeaveState.AGREE
                    leaveStateName = '同意'
                };
                this.isMorning = this.ruleForm.isMorningName === '上午' ? 0 : 1;

                if (this.ruleForm.leaveType == 7||this.ruleForm.leaveType == 8||this.ruleForm.leaveType == 9||this.ruleForm.leaveType == 10) {
                    this.stopFireClassNum = 1;
                    this.stopFire = 1;
                     this.mysupper = 1;
                    this.mybreakMeal = 1;
                    this.isMorning = 3;
                    this.ruleForm.isMorningName =this.ruleForm.leaveType == 7? "放学后":'';
                    this.ruleForm.leaveDateCount = 0;
                };
                if(this.ruleForm.leaveType == 20){
                  this.ruleForm.leaveDateCount=0
                };
               
                this.$refs['ruleForm'].validate(valid => {
                    if (valid) {
                        if ((this.ruleForm.leaveType == 1)&&(this.ruleForm.medicalType=='门诊'||this.ruleForm.medicalType=='住院')&&(this.files.length==0)) {
                            this.$message({
                                type: "error",
                                message: "门诊或住院请上传病例！"
                                });
                            return  
                        }
                        const files = this.files.map(item => {
                            item.accessUrl = item.fileUrl;
                            return item;
                        });
                        let symptomJson='';
                        let mymedicalType=this.ruleForm.medicalType;
                        for(let i=0;i<this.ruleForm.symptomJsonlist.length;i++){
                            if(i<this.ruleForm.symptomJsonlist.length-1){
                                symptomJson+=this.ruleForm.symptomJsonlist[i]+',';
                            }else{
                                symptomJson+=this.ruleForm.symptomJsonlist[i];
                            }
                        }
                        if(this.ruleForm.leaveType!=1){
                            symptomJson='';
                            mymedicalType='';
                        }
                        let hospital='';
                        if(this.ruleForm.leaveType==1){
                            if(this.ruleForm.medicalType=='门诊'||this.ruleForm.medicalType=='住院'){
                                hospital = this.ruleForm.hospital;
                            }

                        }
                        let classHourCount=0;
                        let startTime="";
                        let endTime="";
                        let classHourName="";
                        if(this.ruleForm.isClassHour==1){
                            classHourCount=this.slidervalue[1]-this.slidervalue[0]+1;
                            startTime=this.$moment(this.ruleForm.startDate).format("YYYY-MM-DD")+" "+this.courseListFull[this.slidervalue[0]].startTime+":00";
                            endTime=this.$moment(this.ruleForm.startDate).format("YYYY-MM-DD")+" "+this.courseListFull[this.slidervalue[1]].endTime+":00";
                            for(let i=this.slidervalue[0];i<(this.slidervalue[1]+1);i++){
                                if(i<this.slidervalue[1]){
                                   classHourName=classHourName+(i+1)+",";
                                }else{
                                    classHourName=classHourName+(i+1);
                                }
                            }
                        }else{
                            classHourCount=0;
                            startTime="";
                            endTime="";
                            classHourName="";
                        }
                        let mylist=[]
                        
                        for(let i=0;i<this.ruleForm.addressData.userJson.length;i++){
                            let newobj={
                            temperature:(this.ruleForm.leaveType === 1&&this.symptomHav==2&&this.namefun(1))?this.ruleForm.temperature:"",
                            sickNum:(this.ruleForm.leaveType === 1&&this.symptomHav==2&&this.namefun(2))?this.ruleForm.sickNum:0,
                            isWorkDate:(this.ruleForm.leaveType !== 8&&this.ruleForm.leaveType !== 9&&this.ruleForm.leaveType !== 10)?1:2,
                            studentId: this.ruleForm.addressData.userJson[i].id,
                            stopFireClassNum: this.stopFireClassNum,
                            stopFire: this.stopFire,
                            endDate: this.$moment(this.ruleForm.startDate).format("YYYY-MM-DD"),
                            startDate: this.$moment(this.ruleForm.startDate).format("YYYY-MM-DD"),
                            leaveType: this.ruleForm.leaveType,
                            leaveTypeName: this.ruleForm.leaveTypeName,
                            sickType: this.ruleForm.sickType,
                            sickTypeName:this.ruleForm.sickType==3?this.ruleForm.newsickTypeName: this.ruleForm.sickTypeName,
                            leaveStateName,
                            leaveState,
                            leaveDateCount: this.ruleForm.isClassHour==1?0:this.ruleForm.leaveDateCount,
                            isMorningName: this.ruleForm.isClassHour==1?'节次':this.ruleForm.isMorningName,
                            isMorning: this.ruleForm.isClassHour==1?4:this.isMorning,
                            isHer: this.ruleForm.isHer,
                            isBatch: 2,
                            hospital:hospital,
                            content: this.ruleForm.content,
                            askPhotoListJson: JSON.stringify(files),
                            symptomJson:symptomJson,
                            medicalType:mymedicalType,
                            showStopLimit:this.showStopLimit,
                            breakMeal:this.mybreakMeal,
                            supper:this.mysupper,
                            classHourCount:classHourCount,
                            isClassHour: this.ruleForm.isClassHour,
                            classHourName:classHourName,
                        }
                        if(this.ruleForm.leaveType !== 8&&this.ruleForm.leaveType !== 9&&this.ruleForm.leaveType !== 10){
                            newobj.startTime=startTime
                            newobj.endTime=endTime
                             newobj.liveType=this.isLiveRemind == 2 ? this.ruleForm.liveType : 1
                        }
                              mylist.push(newobj)
                        }
                        addStuAskleaveByClassHeaderList(mylist).then(res => {
                            if (res.data.code === 200) {
                                this.$message({
                                    type: 'success',
                                    message: '操作成功!'
                                });
                                // this.$router.back();
                                this.$router.push({path: 'studentLeaveIndex'});
                            } else {
                                this.$message({
                                    type: 'error',
                                    message: res.data.msg
                                });
                            }
                        }).catch(function () {
                        })
                    }
                })
            }
        }

    }
</script>

<style lang="scss" scoped>
    .leaveAddContent {
        padding:12px;
        box-sizing: border-box;

        .leaveAdd {
           width: 810px;
           margin: 0 auto;
        }
        .el-select {
            width: 100%;
        }
        .leaveTime {
            display: flex;
        }

        .mainWrap {
            padding-top: 20px;
            overflow-x: hidden;
            overflow-y: auto;
        }
    }

</style>
