<template>
  <div class="page-container">
    <div class="header">
      <el-button @click="$router.back()" size="medium">返回</el-button>
      <el-button v-if="applyFor" key="1" v-preventReClick :disabled="isLoading" type="primary" @click="handleSaveFor" size="medium">提交</el-button>
      <el-button v-if="currentNode.isSubmit == 1" key="2" v-preventReClick :disabled="isLoading" type="primary" @click="saveHandler(2, currentNode.submitName)" size="medium">{{ currentNode.submitName }}</el-button>
      <el-button v-if="currentNode.isSave == 1" key="3" v-preventReClick :disabled="isLoading" @click="saveHandler(1, currentNode.saveName)" size="medium">{{ currentNode.saveName }}</el-button>
    </div>
    <div class="supply_add_box" :style="`height: ${nobottommaxH}px;`">
      <el-form :model='formData' :rules='rules' ref='form' label-width='150px'>
        <div class="section-title ">请假条</div>
        <el-row>
          <el-col :span="applyFor ? 24 : 12">
            <template v-if="applyFor">
              <el-form-item label='请假人' prop="teacherId">
                <address-book @input="onAddressBookConfirm" ref="addressBook" v-model="addressData" :config="addressDataConfig" ></address-book>
              </el-form-item>
            </template>
            <el-form-item v-else label='请假人' required>
		          {{userInfo.name}}
            </el-form-item>
          </el-col>
          <el-col v-if="!applyFor" :span="12">
            <el-form-item label='所在部门' prop='departId'>
              <el-select v-model="formData.departId" placeholder="请选择">
                <el-option
                  v-for="item in departList"
                  :key="item.key"
                  :label="item.value"
                  :value="item.key">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label='请假类型' prop='leaveType'>
              <el-select v-model="formData.leaveType" placeholder="请选择">
                <el-option
                  v-for="item in leaveTypeList"
                  :key="item.key"
                  :label="item.value"
                  :value="item.key">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-if="formData.classOperatType > 1 && !isEdit" :span="12">
            <el-form-item label='是否需要代班' prop='classOperatType'>
              <el-select v-model="formData.classOperatType" placeholder="请选择">
                <el-option label="是" :value="2"></el-option>
                <el-option label="否" :value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="formData.leaveType == sickLeaveId && isSickTypeGroup == 1">
            <el-form-item label='疾病类型' prop='sickType'>
              <el-select v-model="formData.sickType" placeholder="请选择">
                <el-option
                  v-for="item in sickList"
                  :key="item.key"
                  :label="item.value"
                  :value="item.key">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label='请假方式' prop='leaveType'>
              <el-select v-model="formData.askType" placeholder="请选择">
                <el-option
                  v-for="item in leaveTypeListnew"
                  :key="item.key"
                  :label="item.value"
                  :value="item.key">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <template v-if="formData.askType==1">
            <el-col :span="12">
              <el-form-item label='开始时间' prop='startDatetime'>
                <el-date-picker value-format="yyyy-MM-dd HH:mm"
                  format="yyyy-MM-dd HH:mm"
                  v-model="formData.startDatetime"
                  type="datetime"
                  placeholder="选择日期时间">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label='结束时间' prop='endDatetime'>
                <el-date-picker value-format="yyyy-MM-dd HH:mm"
                  format="yyyy-MM-dd HH:mm"
                  v-model="formData.endDatetime"
                  type="datetime"
                  placeholder="选择日期时间">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </template>
          <template v-else-if="formData.askType==2">
            <el-col :span="24">
              <el-form-item label='请假开始日期' prop='startDate'>
                <div style="display: flex;">
                  <el-date-picker value-format="yyyy-MM-dd"
                    formate="yyyy年MM月dd日"
                    v-model="formData.startDate"
                    type="date"
                    placeholder="请选择日期">
                  </el-date-picker>
                  <span style="margin: 0 10px; white-space: nowrap;">{{ getWeekDay(formData.startDate) }}</span>
                  <el-select v-model="formData.isMoring" placeholder="请选择">
                    <el-option label="上午" :value="1"></el-option>
                    <el-option label="下午" :value="2"></el-option>
                  </el-select>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label='请假时长(工作日)' prop='dayCount'>
                <el-input-number v-model="formData.dayCount" :min="0.5" :step="0.5" step-strictly></el-input-number>
              </el-form-item>
            </el-col>
          </template>
          <el-col :span="24">
            <el-form-item label='请假事由' prop='content'>
              <el-input v-model='formData.content' type="textarea" placeholder="请填写请假事由及工作安排, 例:课务、班主任、护导是否已安排。(1-100个字符)" maxlength="100" :rows="3"></el-input>
              <div v-if="thAskleaveRemark" style="color: red;">请假附件备注:{{thAskleaveRemark}}</div>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="图片" prop="pic">
              <uploader multiple pathPrefix="laoshiqingjiafour" module="laoshiqingjiafour" moduleCode="2053" v-model="images" :extList="['bmp', 'png', 'jpg', 'jpeg', 'gif']" :showFileName="false" showMode="image" :showModeCover="false" showResult="image" ></uploader>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="showAdjustable">
            <el-form-item label='是否需要学校安排课务' prop='adjustClass'>
              <el-select v-model="formData.adjustClass" placeholder="请选择">
                <el-option label="是" :value="1"></el-option>
                <el-option label="否" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="announcement">
            <el-form-item  label='注意事项'>
              {{announcement}}
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <workflow ref="workflow" :currentNode="currentNode"
      :workFlowId="workFlowId"
      :departId="formData.departId"
      :leaveId="newId || id"
      @submitSuccess="submitFlowFunc"/>

    <el-dialog title="请假失败结果" :visible.sync="dialogVisible" width="500px" append-to-body @close="$router.back()">
      <el-table stripe :data="errorList" border style="width: 100%;">
        <el-table-column label="姓名" prop="teacherName" width="120">
        </el-table-column>
        <el-table-column label="错误原因" prop="failMsg"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import workflow from "./workflow.vue";
import {possessRole} from '@/api/supplyClass';
import mixins from '@/mixins/windowResize';
import { queryDepartByUserId2 } from "@/api/system"
import Uploader from '@/components/Uploader/WebUploader';
import { getWorkFlow, getStartStep } from "@/api/workflow"
import AddressBook from '@/components/AddressBook/indexExpand';
import { packgeDepartArray } from '@/api/addressBox'
import { findSchoolDicsByCode, getUserById, getDepartListByUserId } from "@/api/common/common"
import { getThAskLeaveFourInit, addThAskLeaveFour, getThAskLeaveFourById, updateThAskLeaveFour, updateThAskLeaveFourDeal, addThAskLeaveFourList } from "@/api/teacherLeave4"
function getValueByKey(obj, key) {
	const result = obj.find(item => item.key == key)
	return result ? result.value : ""
}

export default {
  name: 'createLeave',
  mixins: [mixins],
  components: {
    Uploader,
    workflow,
    AddressBook
  },
  data() {
    const validator = (rule, value, callback) => {
      if (this.formData.startDatetime && this.formData.endDatetime && this.formData.startDatetime >= this.formData.endDatetime) {
        callback(new Error('结束时间应大于开始时间'))
      } else {
        callback()
      }
    }
    return {
      isLoading: false,
			id: this.$route.query.id,
			isEdit: !!this.$route.query.id,
			applyFor: +this.$route.query.applyFor === 1,
			formData: {
        teacherId: '',
        teacherName: '',
        sex: '',
				leaveType: "",
				sickType: "",
				content: "",
				startDatetime: "",
        startDate: '',
				endDatetime: "",
				departId: "",
				adjustClass: '',
				askType:"",
				dayCount: 0.5,
				isMoring: 1,
				classOperatType:1
			},
      images: [],
      showStopFire: false,
			addressData: { departJson: [], groupJson: [], userJson: [] },
			addressDataConfig: {
				title: "请假人",
        SingleChose: false,
				depart: { target: "user", departType: "t", userTypes: "1" },
				group: false,
			},
      rules: {
        leaveType: { required: true, message: '请选择请假类型', trigger: 'change' },
        sickType: { required: true, message: '请选择疾病类型', trigger: 'change'  },
        content: { required: true, message: '请填写请假内容', trigger: 'change' },
        departId: { required: true, message: '请选择所在部门', trigger: 'change' },
        adjustClass: { required: true, message: '请选择课务安排', trigger: 'change' },
        startDatetime: [
          { required: true, message: '请选择请假开始时间', trigger: 'change' },
          { validator: validator, trigger: 'change' }
        ],
        endDatetime: [
          { required: true, message: '请选择请假结束时间', trigger: 'change' },
          { validator: validator, trigger: 'change' }
        ],
        startDate: [
          { required: true, message: '请选择请假开始日期', trigger: 'change' }
        ],
        dayCount: [
          { required: true, message: '请填写请假时长', trigger: 'change' }
        ]
      },
      workFlowId: '',
      currentNode: {},
      latitude: 0, // 纬度，浮点数，范围为90 ~ -90
      longitude: 0, // 经度，浮点数，范围为180 ~ -180。     
      address: '',
      thAskleaveRemark: '',
      announcement: '',
      leaveTypeList: [],
      sickList: [],
      departList: [],
      sickLeaveId: '-1',
      isSickTypeGroup: false,
      submitState: 0,
      infoData: {},
      newId: '',
      customRangeData: [],
			askTypeClassHonr:false,
			askTypeDay:false,
			askTypeTimeLeng:false,
      dialogVisible: false,
      errorList: []
    }
  },
  computed: {
		...mapGetters(["schoolInfo", "userInfo"]),
		getWeekDay() {
			return function (val) {
				console.log(val)
				if (val) {
					let weekDay = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"]
					return "(" + weekDay[new Date(val.slice(0, 10).replace(/\-/g, "/")).getDay()] + ")"
				} else {
					return ""
				}
			}
		},
  },
  created() {
    this.initDict()
    this.initProcessRole()
    this.initLeaveData()
    if (this.isEdit) {
      getThAskLeaveFourById({
        askId: this.id,
      })
        .then(res => res.data)
        .then(data => {
          const pageData = data.data
          this.formData.leaveType = pageData.leaveType
          this.formData.sickType = pageData.sickType
          this.formData.content = pageData.content
          this.formData.teacherId = pageData.teacherId
          this.initDepart(pageData.teacherId)
          this.formData.teacherName = pageData.teacherName
          this.formData.sex = pageData.sex
          this.images = JSON.parse(pageData.askleavePhotoJson || '[]').map((item, index) => ({
            id: index,
            fileUrl: item
          }))
          this.formData.departId = pageData.departId
          this.formData.adjustClass = pageData.adjustClass
          this.formData.askType=pageData.askType||1
          if(this.formData.askType==1){
            this.formData.startDatetime = pageData.startTime.slice(0, pageData.startTime.lastIndexOf(":"))
            this.formData.endDatetime = pageData.endTime.slice(0, pageData.endTime.lastIndexOf(":"))
          }
          if(this.formData.askType==2){
            this.formData.dayCount = pageData.dayCount
            this.formData.isMoring = pageData.isMoring
            this.formData.startDate = this.$moment( pageData.startDate).format("YYYY-MM-DD")
          }
        })
    } else if (!this.applyFor) {
      this.initProcessFlow()
      this.initDepart()
    }
  },
  methods: {
    async onAddressBookConfirm(obj) {
			if (obj.userJson && obj.userJson.length) {
        const teacherObj = obj.userJson[0]
        this.formData.teacherId = teacherObj.id
        this.formData.teacherName = teacherObj.name
			}
      this.$refs.form.validateField('teacherId')
    },
    async handleSaveFor() {
      try {
        await this.$refs.form.validate()
        this.isLoading = true;
        const [startDate] = this.formData.startDatetime.split(" ")
        const [endDate] = this.formData.endDatetime.split(" ")

        const teacherList = await Promise.all(this.addressData.userJson.map(teacherObj => {
          return new Promise((r) => {
            getUserById({ id: teacherObj.id })
              .then(res => res.data)
              .then(res => r({
                teacherId: res.data.id,
                teacherName: res.data.name,
                sex: res.data.gender,
                departId: res.data.departs[0].id,
                departName: res.data.departs[0].name,
              }))
          })
        }))
        const args = teacherList.map(i => ({
          ...i,
          addType: 1, // 0 自己 1 代请假
          adjustClass: this.formData.adjustClass||0,
          askleavePhotoJson: this.images.map(i => i.fileUrl),
          content: this.formData.content,
          askType:this.formData.askType,
          endDate:this.formData.askType==1?endDate:"",
          endTime: this.formData.askType==1?this.formData.endDatetime:"",
          startDate:this.formData.askType==1?startDate:this.formData.startDate,
          startTime: this.formData.askType==1?this.formData.startDatetime:"",
          dayCount: this.formData.askType==2?this.formData.dayCount.toFixed(1):0,
          isMoring: this.formData.askType==2?this.formData.isMoring:0,
          leaveState: 5, // 已完成
          leaveType: this.formData.leaveType,
          leaveTypeName: getValueByKey(this.leaveTypeList, this.formData.leaveType),
          sickType: this.formData.leaveType == this.sickLeaveId && this.isSickTypeGroup == 1 ? this.formData.sickType : "",
          sickTypeName: this.formData.leaveType == this.sickLeaveId && this.isSickTypeGroup == 1 ? getValueByKey(this.sickList, this.formData.sickType) : "",
          stopFire: 1,
          classOperatType:this.formData.classOperatType 
        }))
        console.log(args)
        const { data } = await addThAskLeaveFourList(args)
        console.log(data, this.$message, this.$message.error)
        if (data.result) {
          if (data.data.length) { // 请假失败结果
            this.errorList = data.data
            this.dialogVisible = true
          } else {
            this.$message.success("提交成功")
            setTimeout(() => {
              this.$router.back()
            }, 500)
          }
        } else {
          this.$message.error(data.msg)
        }
      } catch(err) {
        console.log(err)
      }
      this.isLoading = false;
    },
		async saveHandler(leaveState) {
			try {
        await this.$refs.form.validate()
        this.submitState = leaveState
        this.isLoading = true;
        const [startDate] = this.formData.startDatetime.split(" ")
        const [endDate] = this.formData.endDatetime.split(" ")
        const args = {
          adjustClass: this.formData.adjustClass||0,
          askleavePhotoJson: this.images.map(i => i.fileUrl),
          content: this.formData.content,
          departId: this.formData.departId,
          askType:this.formData.askType,
          departName: getValueByKey(this.departList, this.formData.departId),
          endDate:this.formData.askType==1?endDate:"",
          endTime: this.formData.askType==1?this.formData.endDatetime:"",
          startDate:this.formData.askType==1?startDate:this.formData.startDate,
          startTime: this.formData.askType==1?this.formData.startDatetime:"",
          dayCount: this.formData.askType==2?this.formData.dayCount.toFixed(1):0,
          isMoring: this.formData.askType==2?this.formData.isMoring:0,
          // leaveState: this.submitState,
          leaveType: this.formData.leaveType,
          leaveTypeName: getValueByKey(this.leaveTypeList, this.formData.leaveType),
          sickType: this.formData.leaveType == this.sickLeaveId && this.isSickTypeGroup == 1 ? this.formData.sickType : "",
          sickTypeName: this.formData.leaveType == this.sickLeaveId && this.isSickTypeGroup == 1 ? getValueByKey(this.sickList, this.formData.sickType) : "",
          stopFire: 1,
          classOperatType:this.formData.classOperatType 
        }
        let resultData = null
        if (!this.isEdit) {
          args.leaveState = 1;
					const res = await addThAskLeaveFour(args)
          resultData = res.data
				} else {
					args.id = this.id 
          args.leaveState = this.submitState;
          const res = await updateThAskLeaveFour(args)
          resultData = res.data
				}
        if (resultData.result) {
          this.infoData = resultData.data
          if (!this.isEdit) {
            this.newId = resultData.data.id
          }
          if (leaveState == 2) {
            const dateJson = JSON.parse(this.infoData.timeLengthJson)
            this.$refs.workflow.show({
              adjustClass: this.formData.adjustClass||0,
              condit: dateJson.dateCount,
              conditTw: this.infoData.leaveType
            })
					} else {
						if (resultData.result) {
							this.$message.success("保存成功")
							this.$router.back()
						}
					}
        } else {
          this.$message.error(resultData.msg)
        }
      } catch (err) {
        console.log(err)
      }
      this.isLoading = false
		},
    submitFlowFunc(data) {
      updateThAskLeaveFourDeal({
        ...data,
        createUserId: this.userInfo.id,
        thAskLeaveFour: JSON.stringify({
          id: this.newId || this.id,
          leaveTypeName: getValueByKey(this.leaveTypeList, this.formData.leaveType),
        }),
        stepIdNo: this.currentNode.stepIdNo,
        workFlowId: this.workFlowId,
      })
        .then(res => res.data)
        .then(data => {
          if (data.result) {
            this.$message.success("提交成功")
            setTimeout(() => {
              // if (this.showStopFire == 2 && this.submitState == 2) {
              //   this.$confirm('您的请假单已提交，是否需要进行停伙？', '提示', {
              //     confirmButtonText: '去停伙',
              //     cancelButtonText: '不需要',
              //     type: 'warning'
              //   })
              //   .then(() => {
              //     this.$router.replace({
              //       path: "/stopDiet/stopDiet",
              //       query: {
              //         stopDietLeave4Id: this.infoData.id,
              //       },
              //     })
              //   })
              //   .catch(() => {
              //     this.$router.back()
              //   })
              // } else {
                this.$router.back()
              // }
            }, 500)
          } else {
            this.$message.error(data.msg)
          }
        })
    },
    initDict() {
      findSchoolDicsByCode({
        dicCode: 'thAskleaveRemark',
        schoolId: this.schoolInfo.id,
      }).then(res => res.data)
        .then(data => {
          if (data.code === 200&&data.data.length) {
            this.thAskleaveRemark = data.data[0].remark;

          }
        })
      findSchoolDicsByCode({
				dicCode: "announcement",
				schoolId: this.schoolInfo.id,
			})
				.then(res => res.data)
				.then(data => {
					const resultObj = data.data.find(({ code }) => code === "thAskleaveFour")
					if (resultObj) {
						this.announcement = resultObj.remark
					}
				})
    },
    initProcessRole() {
      // 判断是否是 班主任
			possessRole('11').then(res => {
        if (res.data.data.result) {
          this.formData.classOperatType = 3;
        }
      })
      // 判断是否是 部门主任 部门副主任
			possessRole('8,275').then(res => {
        if (!res.data.data.result && this.applyFor) {
          this.$alert('你没有代请假权限', '提示')
            .then(() => {
              this.$router.replace('leaveTable')
            })
        }
      })
    },
    initProcessFlow() {
      getWorkFlow("askLeave")
				.then(res => res.data)
				.then(data => {
					const workFlowId = data.data.id
					this.workFlowId = workFlowId
					getStartStep(workFlowId)
						.then(res => res.data)
						.then(data => {
							console.log("current", data)
							this.currentNode = data.data
              if(this.currentNode.isAddress==1) {
                setTimeout(() => {
                  this.getAddress()       
                }, 1000);
              }
						})
				})
    },
    initLeaveData() {
      getThAskLeaveFourInit()
				.then(res => res.data)
				.then(data => {
					const pageData = data.data
					this.leaveTypeList = pageData.leaveTypeList.map(({ leaveTypeId, leaveTypeName }) => ({
						key: leaveTypeId,
						value: leaveTypeName,
					}))

					this.sickList = pageData.sickList.map(({ sickType, sickTypeName }) => ({
						key: sickType,
						value: sickTypeName,
					}))
					const resultObj = pageData.leaveTypeList.find(({ leaveTypeName }) => leaveTypeName === "病假")
					this.sickLeaveId = resultObj ? resultObj.leaveTypeId : "-1"
					this.isSickTypeGroup = pageData.isSickTypeGroup
					if (!this.isEdit && this.leaveTypeList.length !== 0) {
						this.formData.leaveType = this.leaveTypeList[0].key
					}
					if (!this.isEdit && this.sickList.length !== 0) {
						this.formData.sickType = this.sickList[0].key
					}
					this.amStartTime = pageData.amStartTime
					this.amEndTime = pageData.amEndTime
					this.pmEndTime = pageData.pmEndTime
					this.pmStartTime = pageData.pmStartTime
					this.showStopFire = pageData.showStopFire
					this.showAdjustable = pageData.showAdjustable==2;
					this.askTypeClassHonr = pageData.askTypeClassHonr==2;
					this.askTypeDay = pageData.askTypeDay==2;
					this.askTypeTimeLeng = pageData.askTypeTimeLeng==2;
					this.leaveTypeListnew=[]
					if(this.askTypeTimeLeng){
						this.leaveTypeListnew.push({
							key:1,
							value:'按时长'
						})
					}
					if(this.askTypeDay){
						this.leaveTypeListnew.push({
							key:2,
							value:'按天'
						})
					}
					if(this.askTypeClassHonr){
						this.leaveTypeListnew.push({
							key:3,
							value:'按节次'
						})
					}
					if(!this.isEdit){
                       this.formData.askType=this.leaveTypeListnew[0].key
					}
				})
    },
    initDepart(userId = '') {
			queryDepartByUserId2(userId, 7)
				.then(res => res.data)
				.then(data => {
					this.departList = data.data.map(({ id, name }) => ({ key: id, value: name }))
          console.log("departList", this.departList)
					if (!this.isEdit && this.departList.length !== 0) {
						this.formData.departId = data.data[0].id
						this.formData.departName = data.data[0].name
					}
				})
    },
    getAddress() {
      // this.$wechat.getLocation({
      //     isHighAccuracy:true,
      //     type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'2
      //     success: async (res) => {
      //         const latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
      //         const longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。

      //         this.latitude = latitude; // 纬度，浮点数，范围为90 ~ -90
      //         this.longitude = longitude; // 经度，浮点数，范围为180 ~ -180。                        
      //         const amap = await loadAMap();
      //         const location =  await getAddressByPosition(amap, [this.longitude, this.latitude])
      //         this.address = location ||'';
      //     },
      //     fail: () => {
      //     }
      // });
    },
  }
}
</script>

<style lang='scss' scoped>
.page-container {
  padding:12px;

  .el-form {
    width: 900px;
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
