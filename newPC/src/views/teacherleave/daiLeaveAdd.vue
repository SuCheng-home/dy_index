<template>
  <div class="page-container">
    <div class="header">
      <el-button @click="$router.back()" size="medium">返回</el-button>
      <el-button :disabled="isLoading" type="primary" @click="addTeacherAskleave()" size="medium">请假</el-button>
    </div>
    <div class="supply_add_box" :style="`height: ${nobottommaxH}px;`">
      <el-form :model='formData' :rules='rules' ref='form' label-width='150px'>
        <!-- <div class="section-title ">请假信息</div> -->
         <el-form-item label='请假人'  class="is-required" prop="teacherId">
                <address-book @input="onAddressBookConfirm" ref="addressBook" v-model="addressData" :config="addressDataConfig" ></address-book>
         </el-form-item>
         <el-form-item label='所在部门' prop='departId'>
              <el-select v-model="formData.departId" placeholder="请选择">
                <el-option
                  v-for="item in departList"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          <el-form-item label='请假类别' prop='leaveType'>
              <el-select v-model="formData.leaveType" placeholder="请选择" @change="leaveTypeValueChangeHandler()">
                <el-option
                  v-for="item in leaveTypeList"
                  :key="item.leaveTypeId"
                  :label="item.leaveTypeName"
                  :value="item.leaveTypeId">
                </el-option>
              </el-select>
            </el-form-item>
         <el-form-item label='疾病类型' prop='sickType' v-if="formData.leaveType==1&&isSickTypeGroup==1">
              <el-select v-model="formData.sickType" placeholder="请选择">
                <el-option
                  v-for="item in sickTypeJson"
                  :key="item.thAskleaveTypeId"
                  :label="item.thAskleaveTypeName"
                  :value="item.thAskleaveTypeId">
                </el-option>
              </el-select>
            </el-form-item>
          
          <el-form-item label='请假事由' prop='content'>
              <el-input v-model='formData.content' type="textarea" placeholder="请假事由及工作安排" maxlength="200" :rows="3"></el-input>
           </el-form-item>
            <el-form-item label="附件图片" prop="pic">
                <div v-if="thAskleaveRemark" style="color: red;">请假附件备注:{{thAskleaveRemark}}</div>
              <uploader multiple pathPrefix="laoshiqingjiathree" module="laoshiqingjiathree" moduleCode="12003" v-model="images" :extList="['bmp', 'png', 'jpg', 'jpeg', 'gif']" :showFileName="false" showMode="image" :showModeCover="false" showResult="image" ></uploader>
            </el-form-item>
             <el-form-item label='请假方式' prop='isClassHour'>
              <el-select v-model="formData.isClassHour" placeholder="请选择">
                <el-option
                  v-for="item in timeType"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label='请假开始日期' prop='startDate' >
                <div style="display: flex;">
                  <el-date-picker value-format="yyyy-MM-dd"
                    formate="yyyy年MM月dd日"
                    v-model="formData.startDate"
                    type="date"
                    placeholder="请选择日期">
                  </el-date-picker>
                  <span style="margin: 0 10px; white-space: nowrap;">{{ getWeekDay(formData.startDate) }}</span>
                  <el-select v-model="formData.isMorning" placeholder="请选择" v-if="formData.isClassHour==0">
                    <el-option label="上午" :value="0"></el-option>
                    <el-option label="下午" :value="1"></el-option>
                  </el-select>
                </div>
              </el-form-item>
              <el-form-item label='请假时长(工作日)' prop='leaveDateCount' v-if="formData.isClassHour==0">
                <el-input-number v-model="formData.leaveDateCount" :min="0.5" :step="0.5" step-strictly></el-input-number>
              </el-form-item>
              <el-form-item label='请假开始课时' prop='courseValueone' v-if="formData.isClassHour==1">
              <el-select v-model="formData.courseValueone" placeholder="请选择">
                <el-option
                  v-for="item in courseListfun"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label='请假结束课时' prop='courseValuetwo' v-if="formData.isClassHour==1">
              <el-select v-model="formData.courseValuetwo" placeholder="请选择">
                <el-option
                  v-for="item in courseListfun"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
             <el-form-item label='请假开始时间' prop='leaveStartTime' v-if="formData.isClassHour==2">               
              <el-time-select   v-model="formData.leaveStartTime"  placeholder="请假开始时间" :picker-options="{start: amStartTime, step: '00:5', end: pmEndTime }"></el-time-select>
            </el-form-item>
            <el-form-item label='请假结束时间' prop='leaveEndTime' v-if="formData.isClassHour==2">
              <el-time-select   v-model="formData.leaveEndTime"  placeholder="请假结束时间"   :picker-options="{start: amStartTime, step: '00:5', end: pmEndTime }"></el-time-select>
            </el-form-item>
            <el-form-item label='请假时长（小时）' v-if="formData.isClassHour==2">
              {{getTimeLength()}}
            </el-form-item>
            <el-form-item label='是否由学校安排课务' class="is-required" v-if="showAdjustable==2">               
              <el-select v-model="formData.isAdjustable" placeholder="请选择">
                <el-option  label="否" :value="1"></el-option>
                <el-option  label="是" :value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label='课务备注' prop='adjustableRemark' v-if="showAdjustable==2">
              <el-input v-model='formData.adjustableRemark' type="textarea" placeholder="请填写自己已安排的工作事项或需要学校协助安排的工作事项" maxlength="200" :rows="3"></el-input>
            </el-form-item>
            <!-- <el-form-item label='是否请假抵扣' class="is-required" v-if="isDeductionOn&&formData.isAdjustable==1">               
              <el-select v-model="formData.isDeduction" placeholder="请选择">
                <el-option  label="否" :value="1"></el-option>
                <el-option  label="是" :value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label='请假抵扣条' class="is-required" v-if="isDeductionOn&&formData.isDeduction==2&&formData.isAdjustable==1">               
              {{selectedTicketText()}}  <el-button size="mini"  @click="imgpop=true" icon="el-icon-plus" circle></el-button>
            </el-form-item> -->
            <el-dialog title="请假抵扣条" :close-on-press-escape='false' :close-on-click-modal='false' :visible.sync="imgpop" width="800px" :lock-scroll="false" :modal-append-to-body='false'>
		        <el-form   label-width="300px">
              <el-form-item  :label="`${item.deductionName}(剩${item.sendNum}张)`" :key="index"  v-for="(item,index) in ticketList">
                <el-input-number v-model="item.count" :min="0" :max="item.sendNum" size="mini"  :precision="0" :step="1"></el-input-number>
              </el-form-item>
             </el-form>
              <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="imgpop=false">关 闭</el-button>
              </span>
            </el-dialog>

              <!-- <el-form-item label='请假审批人' prop='batchUserId'>
              <el-select v-model="formData.batchUserId" placeholder="请选择">
                <el-option
                  v-for="item in batchUserList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item> -->
             
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import mixins from '@/mixins/windowResize';
import Uploader from '@/components/Uploader/WebUploader';
import AddressBook from '@/components/AddressBook/indexExpand';
import { findSchoolDicsByCode, queryDepartListTerm} from "@/api/common/common"
import {queryDepartByUserId} from '@/api/system';
import {
    getTeacherAskleaveInitInfo,
    addTeacherAskleave,
    listTimeByWeekDayByDate,
    getTeacherCanUseLeaveDeductionList
} from '@/api/systemSet/TeacherLeave3Set'
import {getDropDownList} from '@/utils/utils';
import {getSchoolTimeAllList} from "@/api/workPlan";
function getValueByKey(obj, key) {
	const result = obj.find(item => item.key == key)
	return result ? result.value : ""
}

export default {
  name: 'daiLeaveAdd',
  mixins: [mixins],
  components: {
    Uploader,
    AddressBook
  },
  data() {
    const validator = (rule, value, callback) => {
      if (this.formData.leaveStartTime && this.formData.leaveEndTime && this.formData.leaveStartTime >= this.formData.leaveEndTime) {
        callback(new Error('结束时间应大于开始时间'))
      } else {
        callback()
      }
    }
    const courseValue = (rule, value, callback) => {
      if ((this.formData.courseValueone-0)>(this.formData.courseValuetwo-0)) {
        callback(new Error('结束课时要大于开始课时！'))
      } else {
        callback()
      }
    }
    const teacherIdvalidator = (rule, value, callback) => {
      if (this.addressData.userJson && this.addressData.userJson.length==0) {
        callback(new Error('请选择请假人'))
      } else {
        callback()
      }
    }
    
    return {
      	addressData: { departJson: [], groupJson: [], userJson: [] },
        addressDataConfig: {
            title: "请假人",
            depart: {target: "user", departType: "t", userTypes: "1", notCheckSchool: true},
                    SingleChose: true,
                    group: false,
        },
        isSickTypeGroup: "1",
        departList:[],
        leaveTypeList:[],
        sickTypeJson:[],
        images:[],
        batchUserList: [],
        timeType: [],
        courseListfun:[], 
        ticketList: [],   
         amStartTime: '',
            amEndTime: '',
            pmEndTime: '',
            pmStartTime: '',   
        showAdjustable:1,
        isDeductionOn: false,
        imgpop:false,
    	  formData: {
            leaveState: 2,//	请假状态(1未审批，2同意，4销假,3驳回）	number	
            isHer: '',//	是否销假（0代表不需要销假，1代表需要销假）	number	
            teacherId: '',
            teacherName: '', 
            departId: '',
            departName: '',
            leaveType: '',//	请假类型	number	
            leaveTypeName: '',//	请假类型名称	string	
            sickType: '',//	疾病类型	number	
            sickTypeName: '',//	疾病类型名称	string
            content: '',//	内容	string
            askleavePhotoJson: [],//	请假上传附件json	string
            batchUserId: '',//审批人
            batchUserName: '',  
            isClassHour: '',//	0代表按天请假，1代表按课时	number
            startDate: '',//	请假开始日期	string
            isMorning: 0,//	是否上午(0代表上午，1代表下午）	number	
            isMorningName: '',//	上下午名称	string	  
            leaveDateCount: '',//	请假天数	string
            courseValuetwo:'0',
            courseValueone:'0',
            leaveStartTime:'',
            leaveEndTime: '',
            isAdjustable: 1,//	是否课务安排 1否 2是	number	 
            isDeduction: 1,//	是否需要请假抵扣 1不需要 2需要	number 

            classHourCount: '',//	课时数量	number	
            classHourName: '',//	课时名称列表	string	
            adjustableRemark: '',//	课务备注	string
            deductionJson: '',//	请假抵扣json列表请假抵扣json列表	array<object>	
                      	
            
            endTime: '',
            startTime: '',
            timeLenth: '',           
            deductionHour: '',
			},
      rules: {
        leaveType: { required: true, message: '请选择请假类型', trigger: 'change' },
        sickType: { required: true, message: '请选择疾病类型', trigger: 'change'  },
        content: { required: true, message: '请填写请假内容', trigger: 'change' },
        departId: { required: true, message: '请选择所在部门', trigger: 'change' },
        batchUserId: { required: true, message: '请选择请假审批人门', trigger: 'change' },
        isClassHour: { required: true, message: '请选择请假方式', trigger: 'change' },
        leaveDateCount: { required: true, message: '请填写请假时长', trigger: 'change' },
        courseValueone: [{ required: true, message: '请选择请假开始课时', trigger: 'change' }, { validator: courseValue, trigger: 'change' }],
        courseValuetwo: [{ required: true, message: '请选择请假结束课时', trigger: 'change' }, { validator: courseValue, trigger: 'change' }],
        leaveStartTime: [{ required: true, message: '请选择请假开始时间', trigger: 'change' }, { validator: validator, trigger: 'change' }],
        leaveEndTime: [{ required: true, message: '请选择请假结束时间', trigger: 'change' }, { validator: validator, trigger: 'change' }],
        startDate: [{ required: true, message: '请选择请假开始日期', trigger: 'change' }],
        adjustableRemark: { required: true, message: '请输入课务备注', trigger: 'change' },
        teacherId: [{ validator: validator, trigger: 'change' }],
      },
            isShowHint: false,
            isInit: false,
            isShowStopFire: false,
            sliceValue: 100,
            leaveType: [],
            sickType: [],
            showPickerone:false,
            showPickertwo:false,            
            dayType: [
                {
                    name: "上午",
                    value: "0",
                },
                {
                    name: "下午",
                    value: "1",
                },
            ],
            //courseList: ['第一节课', '第二节课', '第三节课', '第四节课', '第五节课', '第六节课', '第七节课', '第八节课', '第九节课', '第十节课'],
            classList: [],
            courseList: [],
            examineValue: [],
            time: this.$moment().format("YYYY-MM-DD"),
            nowTime: this.$moment().format("YYYY-MM-DD"),
            reason: "",
            courseValue: ['',''],
            leaveDateCount: 0.5,
            courseListFull: [],
            leaveSetting: {},
            timeLenth: '',
            timePickerList: [[]],

            selectedClass: [],
            allClassList: [],
          
            isShowTicket: false,
            ticketIds: [],
            afterNoonHour: 1,
            moringHour: 1,

            departId: '',
            departList: [],
            thAskleaveRemark:'',
            
            leaveHours:0,
            adjustableRemark:'',
           
    }
  },
  computed: {
		...mapGetters(["schoolInfo", "userInfo"]),
     getWeekDay() {
            return function (val) {
                if (val) {
                    let weekDay = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"]
                    return "(" + weekDay[new Date(val.slice(0, 10).replace(/-/g, "/")).getDay()] + ")"
                } else {
                    return ""
                }
            }
        },
  },
  created() {
   findSchoolDicsByCode({
                    dicCode: 'thAskleaveRemark'
                }).then(res => res.data)
                    .then(data => {
                        if (data.code === 200&&data.data.length) {
                            this.thAskleaveRemark = data.data[0].remark;

                        }
                    })
    queryDepartListTerm({
                all: false,
                currentTerm: true,
                departType: 4,
                manager: true,
                notlimit: false,
                submanager: true,
                teacher: false,
            })
                .then(res => res.data)
                .then(data => {
                    const pageData = [];
                    data.data.forEach(item => {
                        item.childList.forEach(classItem => {
                            pageData.push(classItem);
                        })
                    })
                    this.allClassList = pageData;
                    this.classList = pageData.map(item => ({
                        name: `${item.name}`,
                        value: `${item.id}`
                    }))
                })

            let timePickerList = [];
            for (let i = 0; i < 48; i++) {
                let str = '';
                let hour = Math.floor(i / 2);
                if (hour < 10) {
                    str += `0${hour}`
                } else {
                    str += hour;
                }
                if (i % 2 === 0) {
                    str += ':00';
                } else {
                    str += ':30';
                }
                timePickerList.push(str);
            }
            this.timePickerList = [timePickerList];
            getTeacherAskleaveInitInfo()
                .then(res => {
                    let data = res.data.data;
                    this.leaveTypeList = data.leaveTypeList;
                    this.formData.leaveType =  data.leaveTypeList[0].leaveTypeId;
                    this.formData.isHer = data.isHer;
                    this.isSickTypeGroup = data.isSickTypeGroup;
                    this.sickTypeJson=JSON.parse(data.sickTypeJson || "[]")                   
                    this.formData.sickType =this.sickTypeJson[0].thAskleaveTypeId;                                     
                    this.batchUserList = data.batchUserList;                    
                    this.formData.batchUserId = data.batchUserList[0].id;
                    const timeType = [];
                    if (data.isDateAsk == 2) {
                        timeType.push({
                            name: "按时段请假",
                            value: "0",
                        })
                    }
                    if (data.isClassHourAsk == 2) {
                        timeType.push({
                            name: "按课时请假",
                            value: "1",
                        })
                    }
                    if (data.isTimeLenth == 2) {
                        timeType.push({
                            name: "按时长请假",
                            value: "2",
                        })
                    }
                    this.timeType = timeType;
                    this.formData.isClassHour = timeType[0].value;
                     this.amEndTime =data.amEndTime
                    this.amStartTime =data.amStartTime
                    this.pmEndTime =data.pmEndTime
                    this.pmStartTime =data.pmStartTime
                    this.showAdjustable=data.showAdjustable;
                    this.isDeductionOn = data.isDeduction == 2;
                    this.leaveSetting = data;  
                    this.moringHour = data.moringHour || 1;
                    this.afterNoonHour = data.afterNoonHour || 1;  
                    //  this.formData.isDeduction=(data.isDeduction == 2)?2:1 
                    this.leaveTypeValueChangeHandler()

                   
                    
                                  
                    this.isShowStopFire = data.showStopFire === 2;
                   
                })
                .catch()
                 this.setSlideRange()
  },
  methods: {
    addTeacherAskleave() {
        if(this.addressData.userJson && this.addressData.userJson.length==0){
            this.$message.error( "请选择请假人！")
            return
        }
      this.$refs['form'].validate(valid => {
                    if (valid) { 
            let classHourCount = 0,
                classHourName = "",
                startTime = "",
                endTime = "";
            let newTime = "";
            let timeLenth = 0;
            newTime = this.formData.startDate
            if (this.formData.isClassHour === "1") {
                this.courseValue=[]
                this.courseValue.push(this.courseList[this.formData.courseValueone-0])
                this.courseValue.push(this.courseList[this.formData.courseValuetwo-0])
                let startFlag = false
                const selectedCourseList = [],
                    selectedIndexList = []
                this.courseListFull.forEach((item, index) => {
                    if (`${["", "", "上午", "", "下午"][item.type]} ${item.nodeLevelName}` === this.courseValue[0]) {
                        startFlag = true
                    }
                    if (startFlag) {
                        selectedCourseList.push(item)
                        selectedIndexList.push(index + 1)
                    }
                    if (`${["", "", "上午", "", "下午"][item.type]} ${item.nodeLevelName}` === this.courseValue[1]) {
                        startFlag = false
                    }
                })

                classHourCount = selectedCourseList.length
                classHourName = selectedIndexList.join(",")
                endTime = `${newTime} ${selectedCourseList[selectedCourseList.length - 1].endTime}:00`
                startTime = `${newTime} ${selectedCourseList[0].startTime}:00`
            }
            if (this.formData.isClassHour === "2") {
                endTime = `${newTime} ${this.formData.leaveEndTime}:00`;
                startTime = `${newTime} ${this.formData.leaveStartTime}:00`;
                timeLenth = timeLenth = Math.round(this.getTimeLength() * 60);
            }
            if(this.formData.isAdjustable==2){
                this.formData.isDeduction=1
            }
            if (this.isDeductionOn && this.formData.isDeduction == 2) {
                if(this.ticketList.every(item => item.count == 0)) {
                     this.$message.error( "请选择抵扣券！")
                    return undefined
                }
            }
            const isValid = this.validateTicket();
            let deductionHour=0
            if(!this.isDeductionOn || this.formData.isDeduction == 1){
                deductionHour=0
            }else{
                deductionHour=this.leaveHours
            }
             this.$confirm((!this.isDeductionOn || this.formData.isDeduction == 1 || isValid )? "确认提交吗？" : '抵扣券不足以抵扣请假，是否仍然继续？','提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                  const classCurrJson = [];
                    if (this.schoolInfo.type == 30) {
                        this.selectedClass.forEach(id => {
                            const obj = this.allClassList.find(item => id == item.id);
                            if (obj) {
                                classCurrJson.push(obj);
                            }
                        })
                    }
                    let askleavePhotoJson=[]
                    for(let i=0;i<this.images.length;i++){
                        askleavePhotoJson.push(this.images[i].fileUrl)
                    }
                     let query = {
                        deductionHour:deductionHour,
                        teacherId: this.formData.teacherId,
                        teacherName: this.formData.teacherName,
                        content: this.formData.content,
                        leaveType:  this.formData.leaveType,
                        leaveTypeName:this.leaveTypeList.find(item => item.leaveTypeId == this.formData.leaveType).leaveTypeName,
                        startDate: newTime,
                        leaveDateCount: this.formData.isClassHour == 0 ? this.formData.leaveDateCount : 0,
                        isMorning: this.formData.isMorning,
                        isMorningName: this.formData.isMorning==0?"上午":"下午",
                        isHer:this.formData.isHer,
                        isClassHour: this.formData.isClassHour,
                        classHourCount:classHourCount,
                        classHourName:classHourName,
                        endTime:endTime,
                        startTime:startTime,
                        askleavePhotoJson: JSON.stringify(askleavePhotoJson),
                        leaveState: 2,
                        batchUserId:this.userInfo.id,
                        batchUserName: this.userInfo.name,
                        timeLenth:timeLenth,
                        classCurrJson: JSON.stringify(classCurrJson),
                        isDeduction: this.isDeductionOn && isValid ? this.formData.isDeduction : 1,
                        isAdjustable: this.formData.isAdjustable,
                        departId:this.formData.departId,
                        departName:this.departList.find(item => item.value == this.formData.departId).name,
                        adjustableRemark:this.formData.adjustableRemark,
                    }

                    if (this.formData.leaveType == 1 && this.isSickTypeGroup == 1) {
                        query.sickType = this.formData.sickType
                        query.sickTypeName = this.sickTypeJson.find(item => item.thAskleaveTypeId == this.formData.sickType).thAskleaveTypeName
                    } else {
                        query.sickType = 0
                        query.sickTypeName = ""
                    }
                    if (this.isDeductionOn && this.formData.isDeduction == 2 && isValid) {
                        const deductionJson = [];
                        this.ticketList.forEach(item => {
                            if (item.count != 0) {
                                deductionJson.push({
                                    deductionId: item.deductionId,
                                    deductionName: item.deductionName,
                                    sendNum: item.count,
                                    overTimeType: item.overTimeType,
                                    standardNum: item.standardNum
                                });
                            }
                        });
                        query.deductionJson = JSON.stringify(deductionJson)
                    } else {
                        query.deductionJson = '[]';
                    }
                    addTeacherAskleave(query).then(res => {
                            if (res.data.code === 200) {
                                this.$message({
                                    type: 'success',
                                    message: '请假成功!'
                                });
                                this.$router.back();
                            } else {
                                this.$message({
                                    type: 'error',
                                    message: res.data.msg
                                });
                            }
                        }).catch(function () {
                        })
                    
                });
                        
                    }
                })
    },
     validateTicket() {
            const timeType = this.formData.isClassHour;
            const morningHour = this.moringHour;
            const afterNoonHour = this.afterNoonHour;
            const halfDayHour = Math.max(morningHour, afterNoonHour);
            const dayHour = morningHour + afterNoonHour;
            let days = 0, hdays = 0, hours = 0;
            let leaveHours = 0;

            this.ticketList.forEach(item => {
                if (item.overTimeType == 2) {
                    if (item.standardNum == 0.5) {
                        hdays += (item.count-0);
                    } else {
                        days += (item.count-0);
                    }
                } else {
                    hours += (item.count-0);
                }
            });
            days += Math.floor(hdays / 2);
            hdays = hdays % 2;
            hours += days * dayHour;

            if (timeType == 0) {
                leaveHours += Math.floor(this.formData.leaveDateCount) * dayHour;
                if (this.formData.isMorning == 0) {
                    hours += morningHour * hdays;
                    leaveHours += morningHour * (this.formData.leaveDateCount % 1 * 2);
                } else {
                    hours += afterNoonHour * hdays;
                    leaveHours += afterNoonHour * (this.formData.leaveDateCount % 1 * 2);
                }
            } else if (timeType == 1) {
                let startFlag = false;
                let classHourCount = 0;
                this.courseListFull.forEach((item, index) => {
                    if (`${["", "", "上午", "", "下午"][item.type]} ${item.nodeLevelName}` === this.courseValue[0]) {
                        startFlag = true
                    }
                    if (startFlag) {
                        classHourCount++;
                    }
                    if (`${["", "", "上午", "", "下午"][item.type]} ${item.nodeLevelName}` === this.courseValue[1]) {
                        startFlag = false
                    }
                })

                leaveHours += classHourCount;
                hours += halfDayHour * hdays;
            } else {
                if (this.formData.leaveStartTime < '12:00') {
                    hours += morningHour * hdays;
                } else {
                    hours += afterNoonHour * hdays;
                }
                leaveHours += parseFloat(this.getTimeLength());
            }
            this.leaveHours=leaveHours
            return hours >= leaveHours;
        },
    selectedTicketText() {
            const textArray = [];
            this.ticketList.forEach(item => {
                if(item.count != 0) {
                    textArray.push(`${item.deductionName}*${item.count}张`);
                }
            });
            return textArray.length !== 0 ? textArray.join(',') : ''

        },
      calculateLeaveDuration(startTime, endTime) {  
            const start = this.timeToMinutes(startTime);
            const end = this.timeToMinutes(endTime);
            const workPeriod1Start = this.timeToMinutes(this.amStartTime);
            const workPeriod1End = this.timeToMinutes(this.amEndTime);
            const workPeriod2Start = this.timeToMinutes(this.pmStartTime);
            const workPeriod2End = this.timeToMinutes(this.pmEndTime);
            let leaveDuration = 0;
            //都在上午范围
            if (start >= workPeriod1Start&&start <= workPeriod1End && end >= workPeriod1Start&& end <= workPeriod1End) {
                leaveDuration = end - start;
            }
            //都在下午范围
            if (start >= workPeriod2Start&& start <= workPeriod2End && end <= workPeriod2End&&end >= workPeriod2Start) {
                leaveDuration = end - start;
            }
            //在上午前面超过后面在上午
            if (start <= workPeriod1Start && end >= workPeriod1Start&&end <= workPeriod1End) {
                leaveDuration = end - workPeriod1Start;
            }
            //在上午后面超过前面在上午
            if (start >= workPeriod1Start && start<= workPeriod1End && end >= workPeriod1End&& end <= workPeriod2Start) {
                leaveDuration = workPeriod1End - start;
            }
            //在上午前后都超过
            if (start <= workPeriod1Start && end >= workPeriod1End && end <= workPeriod2Start) {
                leaveDuration = workPeriod1End - workPeriod1Start;
            }
            //在下午后面超过前面在下午
            if (start >= workPeriod2Start&& start <= workPeriod2End &&end >= workPeriod2End) {
                leaveDuration = workPeriod2End - start;
            }
            //在下午前面超过后面在下午
            if (start >= workPeriod1End&& start <= workPeriod2Start &&end <= workPeriod2End&&end >= workPeriod2Start) {
                leaveDuration = end - workPeriod2Start;
            }
             //在下午前后都超过
            if (start>=workPeriod1End&&start <= workPeriod2Start &&end >= workPeriod2End) {
                leaveDuration = workPeriod2End - workPeriod2Start;
            }

            if (start >= workPeriod1Start&&start <= workPeriod1End && end >= workPeriod2Start&& end <= workPeriod2End) {
                leaveDuration = end - start-(workPeriod2Start-workPeriod1End);
            }
            if (start <= workPeriod1Start&&start <= workPeriod1End && end >= workPeriod2Start&& end <= workPeriod2End) {
                leaveDuration = end - workPeriod1Start-(workPeriod2Start-workPeriod1End);
            }            
            if (start >= workPeriod1Start&&start <= workPeriod1End && end >= workPeriod2Start&& end >= workPeriod2End) {
                leaveDuration = workPeriod2End - start-(workPeriod2Start-workPeriod1End);
            }
            if (start <= workPeriod1Start&&end >= workPeriod2End) {
                leaveDuration = workPeriod2End - workPeriod1Start-(workPeriod2Start-workPeriod1End);
            }
            return leaveDuration/60;
        },
        timeToMinutes(time) {
                const [hours, minutes] = time.split(':').map(Number);
                return hours * 60 + minutes;
        },
        getTimeLength() {           
            let timeLenth = '';
            if (this.formData.isClassHour == 2 && this.formData.leaveStartTime && this.formData.leaveEndTime) {
                let inter =this.calculateLeaveDuration(this.formData.leaveStartTime,this.formData.leaveEndTime)           
                if (inter > 0) {
                    timeLenth = inter.toFixed(2);
                } else {
                    this.$message.error('请假时间必须包含在上班时间')
                    this.formData.leaveStartTime ='';
                    this.formData.leaveEndTime = '';
                }
            }
            return `${timeLenth}`;
        },
    leaveTypeValueChangeHandler() {
            let timeType = [];
            if (this.leaveSetting.isDateAsk == 2) {               
                timeType.push({
                    name: "按时段请假",
                    value: "0",
                })
            }
            if (this.leaveSetting.isClassHourAsk == 2 && this.formData.leaveType != 60) {
                timeType.push({
                    name: "按课时请假",
                    value: "1",
                })
            }
            if (this.leaveSetting.isTimeLenth == 2) {
                timeType.push({
                    name: "按时长请假",
                    value: "2",
                })
            }
            this.formData.isClassHour=timeType[0].value
            this.timeType = timeType;
            this.getTeacherCanUseLeaveDeductionListFunc();
        },
          getTeacherCanUseLeaveDeductionListFunc() {
             getSchoolTimeAllList()
                .then(res => {
                    for (let item of res.data.data) {
                        if (item.isCurrent == 1) {
                            getTeacherCanUseLeaveDeductionList({
                          leaveType: this.formData.leaveType,
                          schoolTimeId: item.id,
                          searchDay: ''
                      })
                          .then(res => res.data)
                          .then(data => {
                              // const ticketList = [];
                              data.data.forEach(item => {
                                  item.count = 0;
                              });
                              this.ticketList = data.data;
                          })
                        }
                    }
                })
                .catch(err => {
                });
            
        },
      setSlideRange() {
             this.courseList = []
                            this.courseListfun=[]
                            this.courseValueone=''
                            this.courseValuetwo=''
            const weekDay = this.$moment(this.time).weekday()
             const myDay = this.$moment(this.time).format('YYYY-MM-DD')
             listTimeByWeekDayByDate({
                    secrchDate:myDay
                })
                    .then(res => res.data)
                    .then(data => {
                        const pageData = data.data.filter(({type}) => type === 2 || type === 4)
                        this.courseListFull = pageData
                        if (pageData && pageData.length !== 0) {
                            this.courseList = pageData.map(item => `${["", "", "上午", "", "下午"][item.type]} ${item.nodeLevelName}`)
                            this.courseValue = [`${["", "", "上午", "", "下午"][pageData[0].type]} ${pageData[0].nodeLevelName}`, `${["", "", "上午", "", "下午"][pageData[0].type]} ${pageData[0].nodeLevelName}`]
                            this.courseListfun=[]
                            this.courseValueone='0'
                            this.courseValuetwo='0'
                            for(let i=0;i<this.courseList.length;i++){
                                this.courseListfun.push({
                                    name:this.courseList[i],
                                    value:i+''
                                })
                            }
                        } else {
                            this.courseList = []
                            this.courseListfun=[]
                            this.courseValueone=''
                            this.courseValuetwo=''
                        }
                    })
        },
    onAddressBookConfirm(obj) {
         this.formData.teacherId=''
          this.formData.teacherName=''
          this.formData.departId=''
		if (obj.userJson && obj.userJson.length) {
                const teacherObj = obj.userJson[0]
                this.formData.teacherId = teacherObj.id
                this.formData.teacherName = teacherObj.name
                  queryDepartByUserId(teacherObj.id, 7)
                .then(res => res.data)
                .then(data => {
                    const pageData = data.data;
                    const departList = pageData.map(item => ({
                        name: `${item.name}`,
                        value: `${item.id}`
                    }))
                    this.departList = departList;
                    if(departList.length !== 0) {
                        this.formData.departId =departList[0].value
                    }
                })
		}
    },
  }
}
</script>

<style lang='scss' scoped>
.page-container {
  padding:12px;

  .el-form {
    width: 810px;
    margin: 0 auto;
  }

  .el-input, .el-select {
      width: 100%;
  }

  .header {
      padding-bottom: 10px;
      border-bottom: 1px solid #eee;
  }

  .supply_add_box {
      padding: 20px;
      overflow: auto;
  }
}

.section-title {
    font-size: 18px;
    font-weight: bold;
    margin: 12px 0;
    padding-left: 6px;
    border-left: 3px solid #2F95FF;
}
</style>
