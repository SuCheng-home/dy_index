<template>
    <div class="main-container">
        <div class="el-row menu-tools">
            <el-button @click="$router.back()" size="medium">返回</el-button>
            <el-button v-if="type == 1 && isDealUser" type="primary" size="medium" @click="openApprovalDialog">审批</el-button>
        </div>
        <div class="content-container" :style="{ height: `${maxH + 40}px` }">
            <div class="left-panel" :class="{
                'center-panel': leaveDetail.addType === 1
            }">
                <el-form label-width="140px">
                    <div class="section-title ">请假内容</div>
                    <div class="section section--leave">
                        <el-form-item label="请假人">
                            {{ leaveDetail.teacherName }}
                        </el-form-item>
                        <el-form-item label="部门">
                            {{ leaveDetail.departName }}
                        </el-form-item>
                         <el-form-item label="是否需要代班" v-if="leaveDetail.classOperatType>1">
                            {{ leaveDetail.classOperatType==2?'是':'否'}}
                            <el-button v-if="isClassTeacher && leaveDetail.classOperatType==2" type='text' size='mini' @click="$router.push({
                                path: 'supplyLessonAddEdit',
                                query: {
                                    leaveId: id
                                }
                            })">代班安排</el-button>
                        </el-form-item>
                        <el-form-item label="请假方式">
                           <span v-if="leaveDetail.askType==1">按时长</span>
                           <span v-if="leaveDetail.askType==2">按天</span>
                           <span v-if="leaveDetail.askType==3">按节次</span>
                        </el-form-item>
                        <el-form-item label="开始时间"  v-if="leaveDetail.askType==1">
                            <span v-if="leaveDetail.startTime">
                                {{ leaveDetail.startTime.slice(0, -2) + getWeekDay(leaveDetail.startTime) }}
                            </span>
                        </el-form-item>
                        <el-form-item label="结束时间" v-if="leaveDetail.askType==1">
                             <span v-if="leaveDetail.endTime">
                            {{ leaveDetail.endTime.slice(0, -2) + getWeekDay(leaveDetail.endTime) }}
                            </span>
                        </el-form-item>
                        <el-form-item label="请假开始日期" v-if="leaveDetail.askType==2">
                             <span >
                            {{ leaveDetail.startTime.slice(0, 10)  }}{{ leaveDetail.isMoring==1?'上午':'下午'  }}
                            </span>
                        </el-form-item>
                          <el-form-item label="请假时长(工作日)" v-if="leaveDetail.askType==2">
                             <span >
                            {{ leaveDetail.dayCount}} 天
                            </span>
                        </el-form-item>
                        <el-form-item label="请假时长" v-if="leaveDetail.askType==1">
                            {{ leaveDetail.dateJson ? leaveDetail.dateJson.dateCountName : '' }}
                        </el-form-item>
                        <el-form-item label="类型">
                            {{ leaveDetail.leaveTypeName }}
                        </el-form-item>
                        <el-form-item label="疾病类型" v-if="leaveDetail.sickTypeName">
                            {{ leaveDetail.sickTypeName }}
                        </el-form-item>
                        <el-form-item label="是否需要学校安排课务"  v-if="showAdjustable">
                            {{ leaveDetail.adjustClass == 1 ? '是' : '否' }}
                            <el-button v-if="leaveDetail.adjustClass!==1" type='text' size='mini' @click='classScheduling'>课务安排</el-button>
                        </el-form-item>
                        <el-form-item label="请假内容">
                            {{ leaveDetail.content }}
                        </el-form-item>
                        <el-form-item label="">
                            <span class="weui_uploader_bd leave-photo">
									<span class="weui_uploader_files">
										<image-previewer tag="richtext">
											<img v-for="(photoUrl, indexa) in leaveDetail.photoList" :key="indexa"
                                                 class="weui_uploader_file" :src="photoUrl"/>
										</image-previewer>
									</span>
								</span>
                        </el-form-item>
                    </div>
                    <div class="section-title " v-if="showStopFire == 2">停伙情况</div>
                    <div class="section section--diet" v-if="showStopFire == 2">
                        <el-form-item label=""
                                      style="margin-left: -86px;">
                            <template v-for="(item, index) in stopFireList">
                                <div class="fire-item" v-if="item.state - 1 != 0">{{ item.date }}&nbsp;&nbsp;&nbsp;&nbsp;{{
                                    ['停伙', '未停伙', '不供餐'][item.state - 1] || '' }}
                                </div>
                                <template v-else>
                                    <div v-for="(item2, indexb) in item.fireList" :key="indexb" class="fire-item">{{
                                        item2.fireDate }}&nbsp;&nbsp;&nbsp;&nbsp;{{ ['早餐', '午餐', '课间餐', '晚餐'][item2.mealType] ||
                                        '' }}停伙
                                    </div>
                                </template>
                            </template>
                        </el-form-item>

                    </div>
                    <div class="section-title " v-if="userList.length !== 0">抄送范围及已读名单</div>
                    <div class="section section--batch" v-if="userList.length !== 0">
                        <el-form-item label=""
                                      style="margin-left: -86px;">
                            <div class="user-item" v-for="(userItem, indexc) in userList" :key="indexc">
                                <div class="user-item__avatar" :style="{ backgroundImage: `url(${userItem.avatar})` }"></div>
                                <div class="user-item__name">{{ userItem.userName }}</div>
                            </div>
                        </el-form-item>
                    </div>
                </el-form>
            </div>
            <div class="right-panel" v-if="leaveDetail.addType !== 1">
                <div class="title">操作流程</div>
                <div class="right-panel__inner" :style="{ height: `${workFlowList.length * 170}px`, maxHeight: '600px' }">
                    <el-steps direction="vertical"
                              :active="workFlowList.length + (leaveDetail.leaveState == 5 ? 1 : 0)">
                        <el-step v-for="(workFlowItem, indexd) in workFlowList" :key="indexd">
                            <div class="workflow-item" slot="title">
                                <div class="workflow-item__name">{{ workFlowItem.stepStateName }}</div>
                                <div class="workflow-item__detail">

                                    <div class="workflow-item__time">{{ workFlowItem.dealUserName }}
                                    </div>
                                    <div class="workflow-item__time">{{
                                        workFlowItem.createTime | timeSuffixFilter }}
                                    </div>
                                    <div class="workflow-item__content" v-if="workFlowItem.batchContent">
                                        {{ workFlowItem.batchContent }}
                                    </div>
                                    <div class="workflow-item__photo">
                                        <div class="weui_uploader_bd">
                                            <div class="weui_uploader_files">
                                                <image-previewer tag="richtext">
                                                    <img v-for="(photoUrl, indexe) in workFlowItem.photoList" :key="indexe"
                                                         class="weui_uploader_file" :src="photoUrl"/>
                                                </image-previewer>
                                            </div>
                                        </div>
                                    </div>
                                    <div style="font-size: 14px;">{{workFlowItem.address}}</div>
                                </div>

                            </div>
                            <i class="el-icon-success" slot="icon" v-if="workFlowItem.stepType == 1"></i>
                            <div v-else-if="workFlowItem.stepType == 2"
                                 class="workflow-item__icon workflow-item__icon--back" slot="icon"></div>
                        </el-step>
                        <el-step v-if="leaveDetail.leaveState != 5&&workFlowList.length">
                            <div class="workflow-item__icon" slot="icon"></div>
                            <div class="workflow-item" slot="title">
                                <div class="workflow-item__name">{{workFlowList[workFlowList.length-1].toStepName}}</div>
                                <div class="workflow-item__time">待处理人：
                                     <span v-for="(item,index) in nowDealUserList" :key="index">
                                         {{item.name}}&nbsp;
									 </span>
                                </div>
                            </div>
                        </el-step>
                        <el-step v-if="leaveDetail.leaveState == 5">
                            <div class="workflow-item__icon workflow-item__icon--end" slot="icon"></div>
                            <div class="workflow-item" slot="title">
                                <div class="workflow-item__name">结束</div>
                            </div>
                        </el-step>
                    </el-steps>
                </div>
            </div>
        </div>

        <!-- 审批弹窗 -->
        <el-dialog title="审批处理" :visible.sync="approvalDialogVisible" width="600px" :close-on-click-modal="false">
            <el-form label-width="120px">
                <el-form-item label="销假时间" v-if="currentNode.isHerAsk == 1 && leaveDetail.askType == 1">
                    <el-date-picker
                        v-model="endDatetime"
                        type="datetime"
                        format="yyyy-MM-dd HH:mm"
                        value-format="yyyy-MM-dd HH:mm"
                        placeholder="选择销假时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="实际请假天数" v-if="currentNode.isHerAsk == 1 && leaveDetail.askType == 2">
                    <el-input-number
                        v-model="infoData.dayCount"
                        :step="0.5"
                        :min="0.5"
                        :max="dayCount"
                        :precision="1">
                    </el-input-number>
                </el-form-item>
                <el-form-item label="审批意见" v-if="currentNode.isBatchContent == 1">
                    <el-input
                        type="textarea"
                        :rows="4"
                        :maxlength="100"
                        show-word-limit
                        placeholder="请输入意见"
                        v-model="formData.batchContent">
                    </el-input>
                </el-form-item>
                <el-form-item label="附件" v-if="currentNode.isFile == 1">
                    <uploader multiple pathPrefix="laoshiqingjiafour" module="laoshiqingjiafour" moduleCode="2053" v-model="formData.images" :extList="['bmp', 'png', 'jpg', 'jpeg', 'gif']" :showFileName="false" showMode="image" :showModeCover="false" showResult="image"></uploader>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="approvalDialogVisible = false">取 消</el-button>
                <el-button type="primary" v-if="currentNode.isSubmit == 1 && leaveDetail.leaveState != 3 && leaveDetail.leaveState != 1" @click="dealSubmit(currentNode.submitName)">{{ currentNode.submitName }}</el-button>
                <el-button type="danger" v-if="currentNode.isBack == 1" @click="backHandler(currentNode.backName)">{{ currentNode.backName }}</el-button>
                <el-button type="danger" v-if="currentNode.isHerAsk == 1 && leaveDetail.leaveState != 3 && leaveDetail.leaveState != 1" @click="dealSubmit('销假')">销假</el-button>
               
            </div>
        </el-dialog>

        <!-- 选择下一环节 -->
        <el-dialog title="选择下一环节" :visible.sync="nextNodeDialogVisible" width="500px" :close-on-click-modal="false">
            <el-form label-width="100px">
                <el-form-item label="下一环节：">
                    <el-select v-model="nextNodeId" placeholder="请选择">
                        <el-option v-for="nodeItem in nextNodeList" :key="nodeItem.id" :label="nodeItem.name" :value="nodeItem.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button type="primary" @click="handleNextNodeConfirm">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 选择下一环节处理人 -->
        <el-dialog title="选择下一环节处理人" :visible.sync="dealUserDialogVisible" width="500px" :close-on-click-modal="false">
            <el-form label-width="100px">
                <el-form-item label="处理人：">
                    <el-checkbox-group v-model="nextDealUserId">
                        <el-checkbox v-for="userItem in dealUserList" :key="userItem.id" :label="userItem.id">{{ userItem.name }}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button type="primary" @click="handleDealUserConfirm">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 通讯录选人 -->
        <address-book :hasTolls="false" @input="onAddressBookConfirm" ref="addressBook" v-model="addressData" :config="addressDataConfig"></address-book>

        <!-- 流程引擎组件 -->
        <workflow ref="workflow" :currentNode="currentNode" :workFlowId="workFlowId" :departId="leaveDetail.departId" :leaveId="id" @submitSuccess="workflowSubmitSuccess" v-if="isDealUser"/>
    </div>
</template>

<script>
    import mixins from '@/mixins/windowResize'
    import BaseMixin from '@/mixins/baseMixin'
    import {possessRole} from '@/api/supplyClass';
    import ImagePreviewer from '@/components/ImagePreviewer/ImagePreviewer.vue'
    import Uploader from '@/components/Uploader/WebUploader';
    import workflow from './workflow.vue';
    import AddressBook from '@/components/AddressBook/indexExpand';
    import {viewThAskLeaveFourViewHeader} from '@/api/teacherLeave4'
    import {getThAskLeaveFourById, updateThAskLeaveFourDeal, backThAskLeaveFourDeal} from '@/api/teacherLeave4'
    import {getThAskLeaveFourInit} from '@/api/systemSet/teacherLeave4Setting'
    import {getFireAnalysisByUserIdAndDateRange,isOpenModule} from '@/api/teacherleave'
    import {
        getWorkFlow,
        getStartStep,
        getNowStep,
        getStepByStepIdNo,
        getDealUserList,
        submitWorkFlow,
        sendBackWorkFlow
    } from '@/api/workflow'

    export default {
        name: 'leaveDetail',
        data() {
            return {
                id: this.$route.query.id,
                type: this.$route.query.type||0,
                workFlowList: [],
                userList: [],
                leaveDetail: {},
                stopFireList: [],
                showStopFire: 1,
                showAdjustable:false,
                nowDealUserList:[],
                isClassTeacher: false, // 是否是班主任
                isJiaoWU: false, // 是否是教务处主任

                // 流程引擎相关
                isDealUser: false,
                currentNode: {},
                workFlowId: '',
                startNode: {},
                infoData: {},
                dayCount: '',
                endDatetime: '',
                formData: {
                    batchContent: '',
                    images: []
                },
                approvalDialogVisible: false,
                nextNodeDialogVisible: false,
                dealUserDialogVisible: false,
                nextNodeList: [],
                nextNode: {},
                nextNodeId: '',
                dealUserList: [],
                nextDealUserId: [],
                isHerAskFlag: false, // 是否是销假操作
                addressData: {departJson: [], groupJson: [], userJson: []},
                addressDataConfig: {
                    title: "选择处理人",
                    depart: {target: "user", departType: "t", userTypes: "1"},
                    group: true,
                }
            }
        },
        components: {ImagePreviewer, Uploader, workflow, AddressBook},
        filters: {
            timeFilter(value) {
                return value ? value.slice(0, value.lastIndexOf(':')) : value
            }
        },
        mixins: [mixins, BaseMixin],
        computed: {
            getWeekDay() {
                return function (val) {
                    if (val) {
                        let weekDay = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
                        return '(' + weekDay[new Date(val.slice(0, 10).replace(/\-/g, '/')).getDay()] + ')'
                    } else {
                        return ''
                    }
                }
            }
        },
        created() {
            // 判断是否是 班主任
			possessRole('11').then(res => {
                if (res.data.data.result) {
                    this.isClassTeacher = true
                }
            })
             // 判断是否是 教务处主任
			possessRole('7').then(res => {
                if (res.data.data.result) {
                    this.isJiaoWU = true
                }
            })
            getThAskLeaveFourInit()
                .then(res => res.data)
                .then(data => {
                    this.showStopFire = data.data.showStopFire
                    this.showAdjustable = data.data.showAdjustable==2;
                })
            viewThAskLeaveFourViewHeader({
                askId: this.id
            })
                .then(res => res.data)
                .then(data => {
                    this.workFlowList = data.data.workFlowStepHisList
                    this.leaveDetail = data.data.thAskLeaveFour
                    this.userList = data.data.thAskLeaveFourRemindUserList
                    this.nowDealUserList=data.data.nowDealUserList||[]
                    this.getFireAnalysisByUserIdAndDateRange(this.leaveDetail.teacherId, this.leaveDetail.startDate, this.leaveDetail.endDate)

                    // type==1 时加载流程引擎数据
                    if (this.type == 1) {
                        this.initWorkFlow()
                    }
                })
        },
        methods: {
            // 初始化流程引擎
            initWorkFlow() {
                getThAskLeaveFourById({askId: this.id})
                    .then(res => res.data)
                    .then(data => {
                        const pageData = data.data
                        pageData.askType = pageData.askType || 1
                        this.infoData = pageData
                        this.dayCount = pageData.dayCount - 0
                        this.endDatetime = pageData.endTime ? pageData.endTime.slice(0, pageData.endTime.lastIndexOf(':')) : ''

                        if (pageData.leaveState != 4) {
                            getWorkFlow('askLeave')
                                .then(res => res.data)
                                .then(data => {
                                    const workFlowId = data.data.id
                                    this.workFlowId = workFlowId
                                    getStartStep(workFlowId)
                                        .then(res => res.data)
                                        .then(data => {
                                            this.startNode = data.data
                                        })
                                    getNowStep(pageData.teacherId, pageData.departId, this.id, workFlowId)
                                        .then(res => res.data)
                                        .then(data => {
                                            this.currentNode = data.data
                                            this.isDealUser = this.currentNode.dealUser

                                            getStepByStepIdNo({
                                                adjustClass: this.infoData.adjustClass,
                                                condit: this.infoData.dateJson ? this.infoData.dateJson.dateCount : '',
                                                conditTw: this.infoData.leaveType,
                                                stepIdNo: this.currentNode.stepIdNo,
                                                transfer: this.currentNode.transfer,
                                                workFlowId,
                                                appUserId: this.infoData.teacherId,
                                            })
                                                .then(res => res.data)
                                                .then(data => {
                                                    this.nextNodeList = data.data
                                                })
                                        })
                                })
                        }
                    })
            },
            // 打开审批弹窗
            openApprovalDialog() {
                this.formData.batchContent = ''
                this.formData.images = []
                this.approvalDialogVisible = true
            },
            // 审批提交/销假
            dealSubmit(stepStateName) {
                this.isHerAskFlag = (stepStateName === '销假')
                if (this.isHerAskFlag && this.currentNode.isHerAsk == 1 && this.endDatetime <= this.leaveDetail.startTime.slice(0, -5)) {
                    this.$message.warning('结束时间必须大于开始时间')
                    return
                }
                this.$confirm(`确认${stepStateName}吗？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    if (this.currentNode.transfer == 2) {
                        this.nextNodeDialogVisible = true
                    } else {
                        this.nextNode = this.nextNodeList[0]
                        this.handleNextNodeConfirm()
                    }
                }).catch(() => {})
            },
            // 确认下一环节
            handleNextNodeConfirm() {
                if (this.currentNode.transfer == 2) {
                    this.nextNode = this.nextNodeList.find(i => i.id == this.nextNodeId)
                }
                if (!this.nextNode) return
                if (this.nextNode.deealSelectedType == 2) {
                    this.$refs.addressBook.showAddress()
                } else {
                    getDealUserList(this.infoData.departId, this.nextNode.stepIdNo, this.workFlowId, undefined, this.infoData.teacherId)
                        .then(res => res.data)
                        .then(data => {
                            this.dealUserList = data.data
                            this.nextNodeDialogVisible = false
                            if (JSON.parse(this.nextNode.dealUserJson).userSelectedType == 2) {
                                this.dealUserDialogVisible = true
                            } else {
                                this.nextDealUserId = this.dealUserList.map(i => i.id)
                                this.handleDealUserConfirm()
                            }
                        })
                }
            },
            // 通讯录选人回调
            onAddressBookConfirm(obj) {
                if (obj.userJson && obj.userJson.length === 0) {
                    this.$message.error('请选择处理人')
                    this.$refs.addressBook.showAddress()
                } else {
                    this.dealUserList = obj.userJson
                    this.nextDealUserId = this.dealUserList.map(i => i.id)
                    this.handleDealUserConfirm()
                }
            },
            // 确认处理人
            handleDealUserConfirm() {
                if (this.nextNode.type != 3 && this.nextDealUserId.length === 0) {
                    this.$message.error('请选择下一步处理人')
                    return
                }
                const toStepUserIds = this.nextDealUserId.join(',')
                const args = {
                    batchContent: this.formData.batchContent,
                    fileJson: this.formData.images,
                    operatId: this.id,
                    statusName: this.currentNode.statusName,
                    stepIdNo: this.currentNode.stepIdNo,
                    stepName: this.currentNode.name,
                    stepStateName: this.currentNode.statusName,
                    stepType: 1,
                    toStepIdNo: this.nextNode.stepIdNo,
                    toStepName: this.nextNode.name,
                    toStepUserIds,
                    workFlowId: this.workFlowId,
                    workFlowType: 'askLeave',
                }
                submitWorkFlow(args)
                    .then(res => res.data)
                    .then(data => {
                        if (data.result) {
                            const dealUserListData = this.dealUserList.filter(i => this.nextDealUserId.includes(i.id))
                            const dealArgs = {
                                createUserId: this.infoData.teacherId,
                                dealUserList: JSON.stringify(dealUserListData),
                                thAskLeaveFour: {
                                    id: this.id,
                                    leaveTypeName: this.leaveDetail.leaveTypeName,
                                },
                                stepIdNo: this.currentNode.stepIdNo,
                                toStepIdNo: this.nextNode.stepIdNo,
                                workFlowId: this.workFlowId,
                            }
                            if (this.isHerAskFlag && this.currentNode.isHerAsk == 1) {
                                dealArgs.thAskLeaveFour.isUpdateEndTime = 2
                                dealArgs.thAskLeaveFour.askType = this.infoData.askType
                                if (this.infoData.askType == 1) {
                                    const [endDate, endTime] = this.endDatetime.split(' ')
                                    dealArgs.thAskLeaveFour.endDate = endDate
                                    dealArgs.thAskLeaveFour.endTime = `${endDate} ${endTime}:00`
                                }
                                if (this.infoData.askType == 2) {
                                    dealArgs.thAskLeaveFour.isMoring = this.infoData.isMoring
                                    dealArgs.thAskLeaveFour.dayCount = this.infoData.dayCount.toFixed(1)
                                    dealArgs.thAskLeaveFour.startDate = this.infoData.startDate
                                }
                            } else {
                                dealArgs.thAskLeaveFour.isUpdateEndTime = 1
                            }
                            dealArgs.thAskLeaveFour = JSON.stringify(dealArgs.thAskLeaveFour)
                            updateThAskLeaveFourDeal(dealArgs)
                                .then(res => res.data)
                                .then(data => {
                                    this.$message.success('处理成功')
                                    this.approvalDialogVisible = false
                                    this.dealUserDialogVisible = false
                                    this.nextNodeDialogVisible = false
                                    setTimeout(() => {
                                        this.$router.back()
                                    }, 1000)
                                })
                        } else {
                            this.$message.error(data.msg)
                        }
                    })
            },
            // 驳回
            backHandler(stepStateName) {
                if (!this.formData.batchContent || this.formData.batchContent.trim() === '') {
                    this.$message.warning('请输入意见内容！')
                    return
                }
                this.$confirm(`确认${stepStateName}吗？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    getDealUserList(this.infoData.departId, this.startNode.stepIdNo, this.workFlowId, undefined, this.infoData.teacherId)
                        .then(res => res.data)
                        .then(data => {
                            const dealUserListData = data.data
                            const toStepUserIds = dealUserListData.map(({id}) => id).join(',')
                            const args = {
                                batchContent: this.formData.batchContent,
                                fileJson: this.formData.images,
                                operatId: this.id,
                                statusName: this.currentNode.statusName,
                                stepIdNo: this.currentNode.stepIdNo,
                                stepName: this.currentNode.name,
                                stepStateName: this.currentNode.statusName,
                                stepType: 1,
                                toStepIdNo: this.startNode.stepIdNo,
                                toStepName: this.startNode.name,
                                toStepUserIds,
                                workFlowId: this.workFlowId,
                                workFlowType: 'askLeave',
                            }
                            sendBackWorkFlow(args)
                                .then(res => res.data)
                                .then(data => {
                                    if (data.result) {
                                        const dealArgs = {
                                            createUserId: this.infoData.teacherId,
                                            dealUserList: JSON.stringify(dealUserListData),
                                            thAskLeaveFour: JSON.stringify({
                                                id: this.id,
                                                leaveTypeName: this.leaveDetail.leaveTypeName
                                            }),
                                            stepIdNo: this.currentNode.stepIdNo,
                                            toStepIdNo: this.startNode.stepIdNo,
                                            workFlowId: this.workFlowId,
                                        }
                                        backThAskLeaveFourDeal(dealArgs)
                                            .then(res => res.data)
                                            .then(() => {
                                                this.$message.success('处理成功')
                                                this.approvalDialogVisible = false
                                                setTimeout(() => {
                                                    this.$router.back()
                                                }, 1000)
                                            })
                                    } else {
                                        this.$message.error(data.msg)
                                    }
                                })
                        })
                }).catch(() => {})
            },
            // workflow组件提交成功回调
            workflowSubmitSuccess(data) {
                updateThAskLeaveFourDeal({
                    ...data,
                    createUserId: this.infoData.teacherId,
                    thAskLeaveFour: JSON.stringify({
                        id: this.id,
                        leaveTypeName: this.leaveDetail.leaveTypeName,
                    }),
                    stepIdNo: this.currentNode.stepIdNo,
                    workFlowId: this.workFlowId,
                })
                    .then(res => res.data)
                    .then(data => {
                        if (data.result) {
                            this.$message.success('提交成功')
                            setTimeout(() => {
                                this.$router.back()
                            }, 500)
                        } else {
                            this.$message.error(data.msg)
                        }
                    })
            },
            getFireAnalysisByUserIdAndDateRange(userId, startDate, endDate) {
                isOpenModule()
                .then(res => res.data)
                .then(newmydata => {
                    if(newmydata.data.isOpen){
                         getFireAnalysisByUserIdAndDateRange({
                    startDate: startDate,
                    endDate: endDate,
                    userId: userId,
                    myis:newmydata.data.isOpen
                })
                    .then(res => {
                        if (res.data.code === 200) {
                            this.stopFireList = res.data.data
                        }
                    })
                    .catch()

                    }
                    
                    
                })
                isOpenModule(1225)
                .then(res => res.data)
                .then(newmydata => {
                    if(newmydata.data.isOpen){
                         getFireAnalysisByUserIdAndDateRange({
                    startDate: startDate,
                    endDate: endDate,
                    userId: userId,
                    myis:false
                })
                    .then(res => {
                        if (res.data.code === 200) {
                            this.stopFireList = res.data.data
                        }
                    })
                    .catch()

                    }
                    
                    
                })
               
            },
            classScheduling(){
                console.log('123',this.leaveDetail);
                
                this.$router.push({
                    path: '/main/schoolManage/attenAccounting/teacherLeave4/classScheduling',
                    query: {
                        searchDate: this.leaveDetail.startDate,
                        teacherName:this.leaveDetail.teacherName,
                        teacherId:this.leaveDetail.teacherId,
                        isClassTeacher:this.isJiaoWU
                    }
                })
            }
        }
    }
</script>
<style lang="scss" scoped>
    @import '../../styles/mixin';
    .el-form-item {
        margin-bottom: 10px;
    }
    .section-title {
        font-size: 18px;
        font-weight: bold;
        margin: 12px 0;
        padding-left: 6px;
        border-left: 3px solid #2F95FF;
    }
    .section {
        padding: 20px 0;
    }
    .section--leave {
        background-color: #EFFAFF;
    }
    .section--batch {
        background-color: #FFFFD8;
    }
    .section--diet {
        background-color: #CCFFFF;
    }
    .main-container {
        padding: 12px;
        box-sizing: border-box;

        .menu-tools {
            border-bottom: 1px solid #e7eaec;
            padding-bottom: 10px;
        }
    }

    .title {
        height: 36px;
        line-height: 36px;
        padding-left: 5px;
        box-sizing: border-box;
        color: #fff;
        background-color: #20A0FF;
        width: 100%;
    }

    .left-panel {
        float: left;
        width: 63%;
    }
    .center-panel {
        float: none;
        margin: 0 auto;
    }

    .right-panel {
        margin-left: 50px;
        float: left;
        width: 300px;
        box-sizing: border-box;
        border: 1px solid #FAFAF9;
        background-color: #FAFAF9;
        box-shadow: 0px 1px 10px 0px rgba(92,92,92,0.2);
    }
    .right-panel__inner {
        padding: 10px;
        box-sizing: border-box;
    }

    .content-container {
        @include clearfix;
        margin-top: 10px;
        overflow:auto;
    }

    .row {
        margin: 20px 0;
    }

    .label {
        width: 10em;
        text-align: right;
        display: inline-block;
        vertical-align: top;
    }

    .workflow-item {
        color: #000;
        position: relative;
        overflow: hidden;
        max-width: 320px;
    }

    .workflow-item__content {
        color: #666;
        font-size: 14px;
    }

    .workflow-item__time {
        color: #666;
        font-size: 14px;
    }
    .workflow-item__detail {
        background-color: #F3F3F5;
        box-sizing: border-box;
        padding: 5px;
        border-radius: 4px;
    }


    .workflow-item__icon {
        width: 24px;
        height: 24px;
        background: no-repeat center center / cover;
    }

    .workflow-item__icon--end {
        background-image: url(https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/leave/submit-icon.png);
    }

    .workflow-item__icon--back {
        background-image: url(https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/leave/back-icon.png);
    }

    .workflow-item__icon--submit {
        background-image: url(https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/leave/end-icon.png);
    }

    .user-item {
        width: 80px;

        .user-item__avatar {
            width: 60px;
            height: 60px;
            @include cover-bg;
            border-radius: 50%;
            margin: 0 auto 10px auto;
        }

        text-align: center;
        float: left;
    }

    ul {
        list-style-type: none;
        padding: 0;
    }

    .weui_uploader_files {
        margin: 0;
    }

    .weui_uploader_file {
        float: left;
        margin-right: 9px;
        margin-bottom: 9px;
        width: 79px;
        height: 79px;
        background: no-repeat center center;
        background-size: cover;
        border-radius: 10px;
    }

    .value {
        width: 40%;
        word-break: break-all;
        display: inline-block;
    }

    .leave-photo {
        width: 80%;
        display: inline-block;
    }

    .fire-list {
        padding-left: 50px;

        .fire-item {
            margin: 20px 0;
        }
    }
    .el-icon-success {
        font-size: 24px;
    }

    .right-box {
        border: 1px #e7eaec solid;
        float: right;
        width: 280px;
        margin: 0 10px;

        .el-tag {
            cursor: pointer;
        }

        .right-box-top {
            font-size: 16px;
            text-align: center;
            border-bottom: 1px solid #e7eaec;
            padding: 6px;
            line-height: 28px;
            color: #606266;
        }

        .ul {
            padding: 10px;
            color: #606266;
            overflow: auto;

            .bumen-name {
                font-size: 16px;
                line-height: 20px;
                height: 20px;
                margin: 5px 0 15px 0;
                padding-left: 10px;
                border-left: 3px solid #1fc7cb;

                .el-button {
                    margin-left: 10px;
                }
            }

            .li {
                border: 1px #e7eaec solid;
                border-radius: 3px;
                padding: 5px;
                font-size: 12px;
                margin: 10px 0;

                div {
                    margin: 10px 0;

                    span {
                        float: right;
                    }
                }

                .tag-box {
                    overflow: hidden;

                    span {
                        float: none;
                    }
                }

                .li-name {
                    color: #909399;
                    margin: 15px 0;
                }
            }
        }
    }
</style>
