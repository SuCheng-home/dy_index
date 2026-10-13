<template>
    <div class="supply_class_add">
        <div class="header">
            <el-button @click="goBack" size="medium">返回</el-button>
            <!-- <el-button type="primary" @click="saveSupply(1)" size="medium">存草稿</el-button> -->
            <el-button type="primary" @click="saveSupply(2)" size="medium">发布</el-button>
            <div class="button_wrap" v-show="!supplyId">
                <span class="tab_left" @click="indexChange">代课</span>
                <span class="tab_color">调课</span>
                <span class="tab_right" @click="otheradd">其他</span>
            </div>
        </div>
        <div class="supply_add_box"  >
            <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="140px" class="demo-ruleForm">
                 <el-form-item label="选择方式" class="is-required">
                    <el-radio-group v-model="ruleForm.chooseType" @change="getScheduleCurrByTeacherIdAndDate(4)" :disabled="supplyId!=0">
                        <el-radio :label="1">按照课表</el-radio>
                        <el-radio :label="0">手动选择</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="调课老师" prop="supplyAddressData">
                    <address-book v-model="ruleForm.supplyAddressData" :config="teacherConfigData"  @confirm="getScheduleCurrByTeacherIdAndDate(3)"></address-book>
                </el-form-item>
                <el-form-item label="日期" prop="supplyDate">
                    <el-date-picker v-model="ruleForm.supplyDate" type="date" placeholder="选择日期" :clearable="false"
                                    @change="changeSupplyDate" :picker-options="supplyDateOptions"></el-date-picker>
                </el-form-item>
                 <el-form-item label="可调班节次" required v-if="ruleForm.chooseType==1">
                    <div v-for="(item, index) in newchooseTypeList" :key="index" class="class-item">
                        <el-checkbox v-model="item.checked" @change="handleCheckboxChange(item)">
                            {{ item.className }}--{{ item.sectionNoName }}--{{ item.currName }}
                        </el-checkbox>
                        <span v-if="item.targetInfo" style="margin-left: 10px; font-size: 14px; color: #666;">
                            调 {{ item.targetInfo.date }} {{ item.targetInfo.className }}--{{ item.targetInfo.sectionName }}--{{ item.targetInfo.currName }}--{{ item.targetInfo.teacherName }}
                        </span>
                        <el-button type="text" v-if="item.checked" @click="openSettingDialog(item)" style="margin-left: 10px;">设置调课</el-button>
                    </div>
                </el-form-item>
                <div v-if="ruleForm.chooseType==0">
                  <el-form-item label="年级" prop="supplyGradeId">
                    <el-select v-model="ruleForm.supplyGradeId" placeholder="请选择年级" @change="changeSupplyGrade">
                        <el-option v-for="item in gradeList" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="班级" prop="supplyClassId">
                    <el-select v-model="ruleForm.supplyClassId" placeholder="请选择班级" @change="changeSupplyClass">
                        <el-option v-for="item in supplyClassList" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="节次" prop="supplySectionId">
                    <el-select v-model="ruleForm.supplySectionId" placeholder="请选择节次" @change="changeSupplySection">
                        <el-option v-for="item in schoolSectionList" :key="item.sectionId" :label="item.sectionNoName"
                                   :value="item.sectionId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="课程" prop="supplySubjectId">
                    <el-select v-model="ruleForm.supplySubjectId" placeholder="请选择课程">
                        <el-option v-for="item in supplySubjectList" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="调课信息">
                    <div class="class-item">
                        <el-checkbox v-model="manualItem.checked" @change="handleManualCheckboxChange">
                            {{ getListName(supplyClassList, ruleForm.supplyClassId) }}--{{ schoolSectionList[schoolSectionList.map(item => item.sectionId).indexOf(ruleForm.supplySectionId)] ? schoolSectionList[schoolSectionList.map(item => item.sectionId).indexOf(ruleForm.supplySectionId)].sectionNoName : '' }}--{{ getListName(supplySubjectList, ruleForm.supplySubjectId) }}
                        </el-checkbox>
                        <span v-if="manualItem.targetInfo" style="margin-left: 10px; font-size: 14px; color: #666;">
                            调 {{ manualItem.targetInfo.date }} {{ manualItem.targetInfo.className }}--{{ manualItem.targetInfo.sectionName }}--{{ manualItem.targetInfo.currName }}--{{ manualItem.targetInfo.teacherName }}
                        </span>
                        <el-button type="text" v-if="manualItem.checked" @click="openManualSettingDialog" style="margin-left: 10px;">设置调课</el-button>
                    </div>
                </el-form-item>
                </div>
                <el-form-item label="原因">
                    <el-radio v-model="ruleForm.reasonType" label="因公">因公</el-radio>
                     <el-radio v-model="ruleForm.reasonType" label="因私">因私</el-radio>
                </el-form-item>
                <el-form-item label="备注" prop="reason">
                    <el-input type="textarea" :rows="4" placeholder="请输入备注" v-model.trim="ruleForm.reason"></el-input>
                </el-form-item>
                  <el-form-item label="图片" prop="pic">
                <uploader multiple  v-model="adjustPics" pathPrefix="daiketiaoke" module="daiketiaoke" moduleCode="2009" :extList="['bmp', 'png', 'jpg', 'jpeg', 'gif']" showMode="image" :showModeCover="false" showResult="image" ></uploader>
            </el-form-item>
            </el-form>
        </div>
        
        <el-dialog title="请选择课节次" :visible.sync="settingDialogVisible" width="500px" append-to-body>
            <el-form :model="settingForm" ref="settingForm" label-width="100px">
                <el-form-item label="日期" prop="adjustDate" :rules="{required: true, message: '请选择日期', trigger: 'change'}">
                    <el-date-picker v-model="settingForm.adjustDate" type="date" placeholder="选择日期" :clearable="false"
                                    @change="changeDialogDate" :picker-options="supplyDateOptions" style="width: 100%;"></el-date-picker>
                </el-form-item>
                <el-form-item label="老师" prop="adjustAddressData" :rules="{required: true, message: '请选择老师', trigger: 'change'}">
                    <address-book v-model="settingForm.adjustAddressData" :config="teacherConfigData" @confirm="changeDialogTeacher"></address-book>
                </el-form-item>
                <el-form-item label="可调班节次" prop="adjustSectionKey" :rules="{required: true, message: '请选择可调班节次', trigger: 'change'}">
                    <el-select v-model="settingForm.adjustSectionKey" placeholder="请选择可调班节次" style="width: 100%;">
                        <el-option v-for="(item,index) in targetScheduleList" :key="index" 
                            :label="item.className+'--'+item.sectionNoName+'--'+item.currName" 
                            :value="item.gradeId+'-'+item.classId+'-'+item.sectionId+'-'+item.currId">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="settingDialogVisible = false">返 回</el-button>
                <el-button type="primary" @click="confirmSetting">确 定</el-button>
            </div>
        </el-dialog>
        
        <el-dialog title="请选择课节次" :visible.sync="manualSettingDialogVisible" width="500px" append-to-body>
            <el-form :model="settingForm" ref="settingForm" label-width="80px">
                <el-form-item label="日期" prop="adjustDate" :rules="{required: true, message: '请选择日期', trigger: 'change'}">
                    <el-date-picker v-model="settingForm.adjustDate" type="date" placeholder="选择日期" :clearable="false"
                                    @change="changeDialogDate" :picker-options="supplyDateOptions" style="width: 100%;"></el-date-picker>
                </el-form-item>
                <el-form-item label="老师" prop="adjustAddressData" :rules="{required: true, message: '请选择老师', trigger: 'change'}">
                    <address-book v-model="settingForm.adjustAddressData" :config="teacherConfigData" @confirm="changeDialogTeacher"></address-book>
                </el-form-item>
                <el-form-item label="年级" prop="adjustGradeId" :rules="{required: true, message: '请选择年级', trigger: 'change'}">
                    <el-select v-model="settingForm.adjustGradeId" placeholder="请选择年级" @change="changeAdjustGrade" style="width: 100%;">
                        <el-option v-for="item in gradeList" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="班级" prop="adjustClassId" :rules="{required: true, message: '请选择班级', trigger: 'change'}">
                    <el-select v-model="settingForm.adjustClassId" placeholder="请选择班级" @change="changeAdjustClass" style="width: 100%;">
                        <el-option v-for="item in adjustClassList" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="节次" prop="adjustSectionId" :rules="{required: true, message: '请选择节次', trigger: 'change'}">
                    <el-select v-model="settingForm.adjustSectionId" placeholder="请选择节次" @change="changeAdjustSection" style="width: 100%;">
                        <el-option v-for="item in schoolSectionList" :key="item.sectionId" :label="item.sectionNoName"
                                   :value="item.sectionId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="课程" prop="adjustSubjectId" :rules="{required: true, message: '请选择课程', trigger: 'change'}">
                    <el-select v-model="settingForm.adjustSubjectId" placeholder="请选择课程" style="width: 100%;">
                        <el-option v-for="item in adjustSubjectList" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="manualSettingDialogVisible = false">返 回</el-button>
                <el-button type="primary" @click="confirmManualSetting">确 定</el-button>
            </div>
        </el-dialog>
            </el-form>
        </div>
    </div>
</template>

<script>
    import mixins from '@/mixins/windowResize';
    import AddressBook from '@/components/AddressBook/indexExpand';
    import Uploader from '@/components/Uploader/WebUploader';
    import {
        getSupplyAdjustClassInfo,
        getSchoolClassNoJSONArray,
        getClassSubjectAndTeacherByClassNo,
        querySchoolGradeClass,
        queryCoursesByClassId,
        addOrPublishSupplyAdjustClass,getDicDetailValuePageList,
        editOrPublishSupplyAdjustClass,getScheduleCurrByTeacherIdAndDate,
        addOrPublishSupplyAdjustClassList
    } from '@/api/supplyClass';

    export default {
        name: "supplyClassAddChange",
        components: {
            AddressBook,Uploader
        },
        data() {
            return {
                supplyId: 0,
                supplyDateOptions: {
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 8.64e7;
                    }
                },
                teacherConfigData: {
                    title: '选择老师',
                    depart: {target: 'user', departType: 't', userTypes: '1'},
                    SingleChose: true,
                    group: false
                },
                schoolSectionList: [],
                gradeList: [],
                supplyClassList: [],
                adjustClassList: [],
                supplySubjectList: [],
                adjustSubjectList: [],
                ruleForm: {
                    reason: '',
                    reasonType:'',
                    supplyAddressData: {},
                    supplyDate: '',
                    supplyGradeId: '',
                    supplyClassId: '',
                    supplySectionId: '',
                    supplySubjectId: '',
                    adjustDate: '',
                    adjustGradeId: '',
                    adjustClassId: '',
                    adjustSectionId: '',
                    adjustSubjectId: '',
                    adjustAddressData: {},
                    chooseType:1,
                    ischooseType:'',
                    newischooseType:'',
                },
                chooseTypeList:[],
                newchooseTypeList:[],
                settingDialogVisible: false,
                settingForm: {
                    adjustAddressData: { userJson: [] },
                    adjustDate: '',
                    adjustSectionKey: '',
                    adjustGradeId: '',
                    adjustClassId: '',
                    adjustSectionId: '',
                    adjustSubjectId: ''
                },
                currentTargetItem: null,
                targetScheduleList: [],
                editTargetInfo: null,
                manualItem: {
                    checked: false,
                    targetInfo: null
                },
                manualSettingDialogVisible: false,
                rules: {
                    supplyAddressData: [
                        {required: true}
                    ],
                    adjustAddressData: [
                        {required: true}
                    ],
                    supplyDate: [
                        {required: true, message: '请选择日期！'}
                    ],
                    supplyGradeId: [
                        {required: true, message: '请选择年级！'}
                    ],
                    supplyClassId: [
                        {required: true, message: '请选择班级！'}
                    ],
                    supplySectionId: [
                        {required: true, message: '请选择节次！'}
                    ],
                    supplySubjectId: [
                        {required: true, message: '请选择课程！'}
                    ],
                    adjustDate: [
                        {required: true, message: '请选择日期！'}
                    ],
                    adjustGradeId: [
                        {required: true, message: '请选择年级！'}
                    ],
                    adjustClassId: [
                        {required: true, message: '请选择班级！'}
                    ],
                    adjustSectionId: [
                        {required: true, message: '请选择节次！'}
                    ],
                    adjustSubjectId: [
                        {required: true, message: '请选择课程！'}
                    ],
                    ischooseType: [
                        {required: true, message: '请选择可调班节次！'}
                    ],
                    newischooseType: [
                        {required: true, message: '请选择可调班节次！'}
                    ]
                },
                adjustPics:[]
            }
        },
        mixins: [mixins],
        created() {
            this.supplyId = this.$route.query.id || 0;
            if (this.supplyId) {
                this.getSupplyAdjustClassInfo();
            } else {
                this.getSchoolClassNoJSONArray();
                this.querySchoolGradeClass();
            }
              if(!this.$route.query.id){
                 getDicDetailValuePageList('SupplyAdjustClassReason')
            .then(res => res.data)
            .then(data => {
               if(data.data){
                 if(data.data.dataList[0]){
                   this.ruleForm.reason=data.data.dataList[0].value;
                 }
              }else{
                 this.$toast(data.msg);
              }
              
            })

            }
        },
        methods: {
            getScheduleCurrByTeacherIdAndDate(num){
                if(this.ruleForm.chooseType==0){
                 return;
                }
                if((this.ruleForm.adjustDate&&this.ruleForm.adjustAddressData.userJson.length)||(this.ruleForm.supplyDate&&this.ruleForm.supplyAddressData.userJson.length)){
                   
                    if((num==2||num==1||num==4)&&(this.ruleForm.adjustDate&&this.ruleForm.adjustAddressData.userJson.length)){
                         if(num!=1){
                        this.ruleForm.ischooseType='';
                    }
                        getScheduleCurrByTeacherIdAndDate({
                        searchDate:this.ruleForm.adjustDate,
                        teacherId:this.ruleForm.adjustAddressData.userJson[0].id
                    }).then(res => {
                            const data = res.data;
                            if (res.data.result) {
                                let namelist=['','早自习','上午','午自习','下午','晚自习',]
                                for(let i=0;i<data.data.length;i++){
                                    data.data[i].sectionId=data.data[i].dayStage+','+data.data[i].seq;
                                    data.data[i].sectionNoName=namelist[data.data[i].dayStage-0]+'(第'+data.data[i].seq+'节)';
                                }
                                this.chooseTypeList=data.data;
                            } else {
                                this.$message({
                                    message: data.msg,
                                    type: 'warning'
                                });
                            }
                        }).catch();
                    }
                     if((num==3||num==1||num==4)&&(this.ruleForm.supplyDate&&this.ruleForm.supplyAddressData.userJson.length)){
                          if(num!=1){
                        this.ruleForm.newischooseType='';
                    }
                         getScheduleCurrByTeacherIdAndDate({
                        searchDate:this.ruleForm.supplyDate,
                        teacherId:this.ruleForm.supplyAddressData.userJson[0].id
                    }).then(res => {
                            const data = res.data;
                            if (res.data.result) {
                                let namelist=['','早自习','上午','午自习','下午','晚自习',]
                                for(let i=0;i<data.data.length;i++){
                                    data.data[i].sectionId=data.data[i].dayStage+','+data.data[i].seq;
                                    data.data[i].sectionNoName=namelist[data.data[i].dayStage-0]+'(第'+data.data[i].seq+'节)';
                                    data.data[i].checked = false;
                                    data.data[i].targetInfo = null;
                                    if (this.supplyId && this.ruleForm.newischooseType === (data.data[i].gradeId+'-'+data.data[i].classId+'-'+data.data[i].sectionId+'-'+data.data[i].currId)) {
                                        data.data[i].checked = true;
                                        data.data[i].targetInfo = this.editTargetInfo;
                                    }
                                }
                                this.newchooseTypeList=data.data;
                            } else {
                                this.$message({
                                    message: data.msg,
                                    type: 'warning'
                                });
                            }
                        }).catch();
                    }
                   
                }
            
            },
            goBack() {
                this.$router.back();
            },
            indexChange() {
                this.$router.replace({path: 'addReplace'});
            },
            otheradd() {
                this.$router.replace({path: 'otheradd'});
            },
            // 调课
            changeSupplyDate(date) {
                this.ruleForm.supplyDate = this.getStrDate(date);
                
                 if(this.ruleForm.chooseType==1){
                   this.getScheduleCurrByTeacherIdAndDate(3);
                }else{
                   this.getClassSubjectAndTeacherByClassNo('supply');
                }
            },
            changeSupplyGrade(val) {
                if (val) {
                    this.supplyClassList = this.gradeList[this.gradeList.map(item => item.id).indexOf(val)].classList || [];
                    this.ruleForm.supplyClassId = this.supplyClassList[0].id || '';
                    this.queryCoursesByClassId(this.ruleForm.supplyClassId, 'supply');
                }
            },
            changeSupplyClass(val) {
                this.queryCoursesByClassId(val, 'supply');
                this.getClassSubjectAndTeacherByClassNo('supply');
            },
            changeSupplySection(val) {
                this.getClassSubjectAndTeacherByClassNo('supply');
            },
            // 被调课
            changeAdjustDate(date) {
                this.ruleForm.adjustDate = this.getStrDate(date);               
                  if(this.ruleForm.chooseType==1){
                   this.getScheduleCurrByTeacherIdAndDate(2);
                }else{
                   this.getClassSubjectAndTeacherByClassNo('adjust');
                }
            },
            changeAdjustGrade(val) {
                if (val) {
                    this.adjustClassList = this.gradeList[this.gradeList.map(item => item.id).indexOf(val)].classList || [];
                    this.settingForm.adjustClassId = this.adjustClassList[0].id || '';
                    this.queryCoursesByClassId(this.settingForm.adjustClassId, 'adjust');
                }
            },
            changeAdjustClass(val) {
                this.queryCoursesByClassId(val, 'adjust');
                this.getClassSubjectAndTeacherByClassNo('adjust');
            },
            changeAdjustSection(val) {
                this.getClassSubjectAndTeacherByClassNo('adjust');
            },

            getListName(list, selectId) {
                if (list && list.length && selectId) {
                    const selectName = list[list.map(item => item.id).indexOf(selectId)].name;
                    return selectName;
                }
                return '';
            },
            // 提交
            saveSupply(state) {
                this.$refs['ruleForm'].validate((valid) => {
                    if (valid) {
                         let myadjustPics=[]
                        for(let i=0;i<this.adjustPics.length;i++){
                               myadjustPics.push({
                                    picUrl:this.adjustPics[i].fileUrl
                                })
                            }
                        
                        if (this.ruleForm.chooseType == 1) {
                            if (!this.ruleForm.supplyAddressData.userJson || !this.ruleForm.supplyAddressData.userJson.length) {
                                this.$message.warning('请选择调课老师！');
                                return;
                            }

                            const checkedItems = this.newchooseTypeList.filter(item => item.checked);
                            if (checkedItems.length === 0) {
                                this.$message.warning('请选择可调班节次！');
                                return;
                            }
                            
                            const invalidItems = checkedItems.filter(item => !item.targetInfo);
                            if (invalidItems.length > 0) {
                                this.$message.warning('请为选中的节次设置调课信息！');
                                return;
                            }
                            
                            const list = checkedItems.map(item => {
                                let query = {
                                    reason: this.ruleForm.reason,
                                    reasonType: this.ruleForm.reasonType,
                                    // Source (Supply) Info
                                    supplyDate: this.ruleForm.supplyDate,
                                    supplyGradeId: item.gradeId,
                                    supplyGradeName: item.gradeName,
                                    supplyClassId: item.classId,
                                    supplyClassName: item.className,
                                    supplyClassNo: item.sectionId,
                                    supplyClassNoName: item.sectionNoName,
                                    supplySubjectId: item.currId,
                                    supplySubjectName: item.currName,
                                    supplyTeacherJson: JSON.stringify(this.ruleForm.supplyAddressData.userJson),

                                    // Target (Adjust) Info
                                    adjustDate: item.targetInfo.date,
                                    adjustGradeId: item.targetInfo.gradeId,
                                    adjustGradeName: item.targetInfo.gradeName,
                                    adjustClassId: item.targetInfo.classId,
                                    adjustClassName: item.targetInfo.className,
                                    adjustClassNo: item.targetInfo.sectionId,
                                    adjustClassNoName: item.targetInfo.sectionName,
                                    adjustSubjectId: item.targetInfo.currId,
                                    adjustSubjectName: item.targetInfo.currName,
                                    adjustTeacherJson: JSON.stringify(item.targetInfo.teacherJson),

                                    adjustPics: JSON.stringify(myadjustPics),
                                    createUserType: 1,
                                    state: state,
                                    type: 2,
                                    typeName: '调课',
                                    chooseType: this.ruleForm.chooseType,
                                };
                                
                                if (this.supplyId && this.ruleForm.newischooseType === (item.gradeId+'-'+item.classId+'-'+item.sectionId+'-'+item.currId)) {
                                    query.id = this.supplyId;
                                }
                                return query;
                            });

                            addOrPublishSupplyAdjustClassList(list).then(res => {
                                console.log(123,res);
                                
                                if (res.data.result) {
                                    const msgText = state === 2 ? '发布' : '保存';
                                    
                                    // 检查res.data.data是否为空数组
                                    if (!res.data.data || res.data.data.length === 0) {
                                        this.$message.success(msgText + '成功');
                                        this.$router.back();
                                    } else {
                                        // 有数据时，显示确认框，每一条数据的failReaon独占一行
                                        const totalCount = list.length;
                                        const failCount = res.data.data.length;
                                        const successCount = totalCount - failCount;
                                        const failReasons = res.data.data.map(item => item.failReaon || '无失败原因').join('<br>');
                                        const messageHtml = `成功${successCount}条，失败${failCount}条<br><br>${failReasons}`;
                                        this.$confirm(messageHtml, '发布结果', {
                                            confirmButtonText: '确定',
                                            showCancelButton: false,
                                             type: 'warning',
                                            dangerouslyUseHTMLString: true
                                        }).then(() => {
                                            this.$router.back();
                                        }).catch(() => {
                                            // 取消操作，不做处理
                                        });
                                    }
                                } else {
                                    this.$message.warning(res.data.msg || '操作失败');
                                }
                            });

                        } else {
                            if (!this.manualItem.checked) {
                                this.$message.warning('请选择调课信息！');
                                return;
                            }
                            
                            if (!this.manualItem.targetInfo) {
                                this.$message.warning('请为选中的节次设置调课信息！');
                                return;
                            }
                            
                            let query = {
                                reason: this.ruleForm.reason,
                                reasonType: this.ruleForm.reasonType,
                                adjustClassId: this.manualItem.targetInfo.classId,
                                adjustClassName: this.manualItem.targetInfo.className,
                                adjustClassNo: this.manualItem.targetInfo.sectionId,
                                adjustClassNoName: this.manualItem.targetInfo.sectionName,
                                adjustDate: this.manualItem.targetInfo.date,
                                adjustGradeId: this.manualItem.targetInfo.gradeId,
                                adjustGradeName: this.manualItem.targetInfo.gradeName,
                                adjustSubjectId: this.manualItem.targetInfo.currId,
                                adjustSubjectName: this.manualItem.targetInfo.currName,
                                adjustTeacherJson: JSON.stringify(this.manualItem.targetInfo.teacherJson),

                                supplyClassId: this.ruleForm.supplyClassId,
                                supplyClassName: this.getListName(this.supplyClassList, this.ruleForm.supplyClassId),
                                supplyClassNo: this.ruleForm.supplySectionId,
                                supplyClassNoName: this.schoolSectionList[this.schoolSectionList.map(item => item.sectionId).indexOf(this.ruleForm.supplySectionId)] ? this.schoolSectionList[this.schoolSectionList.map(item => item.sectionId).indexOf(this.ruleForm.supplySectionId)].sectionNoName : '',
                                supplyDate: this.ruleForm.supplyDate,
                                supplyGradeId: this.ruleForm.supplyGradeId,
                                supplyGradeName: this.getListName(this.gradeList, this.ruleForm.supplyGradeId),
                                supplySubjectId: this.ruleForm.supplySubjectId,
                                supplySubjectName: this.getListName(this.supplySubjectList, this.ruleForm.supplySubjectId),
                                supplyTeacherJson: JSON.stringify(this.ruleForm.supplyAddressData.userJson),
                                adjustPics: JSON.stringify(myadjustPics),
                                createUserType: 1, // 教务处创建
                                state: state,
                                type: 2,
                                typeName: '调课',
                                chooseType: this.ruleForm.chooseType,
                            };
                            if (this.supplyId) {
                                query.id = this.supplyId;
                                this.editOrPublishSupplyAdjustClass(query);
                            } else {
                                this.addOrPublishSupplyAdjustClass(query);
                            }
                        }
                    }
                });
            },
            addOrPublishSupplyAdjustClass(query) {
                addOrPublishSupplyAdjustClass(query).then(res => {
                    const data = res.data;
                    if (res.data.result) {
                        const msgText = query.state === 2 ? '发布' : '保存';
                        this.$message({
                            message: msgText + '成功',
                            type: 'success'
                        });
                        this.$router.back();
                    } else {
                        this.$message({
                            message: data.msg,
                            type: 'warning'
                        });
                    }
                }).catch();
            },
            editOrPublishSupplyAdjustClass(query) {
                editOrPublishSupplyAdjustClass(query).then(res => {
                    const data = res.data;
                    if (res.data.code === 200) {
                        const msgText = query.state === 2 ? '发布' : '保存';
                        this.$message({
                            message: msgText + '成功',
                            type: 'success'
                        });
                        this.$router.back();
                    } else {
                        this.$message({
                            message: data.msg,
                            type: 'warning'
                        });
                    }
                }).catch();
            },
            // 详情
            getSupplyAdjustClassInfo() {
                let self = this;
                getSupplyAdjustClassInfo(this.supplyId).then(res => {
                    const data = res.data.data;
                    if (res.data.code === 200) {
                        this.ruleForm = {
                            reason: data.reason,
                            reasonType: data.reasonType,
                            adjustDate: data.adjustDate,
                            adjustGradeId: data.adjustGradeId,
                            adjustClassId: data.adjustClassId,
                            adjustSectionId: data.adjustClassNo,
                            adjustSubjectId: data.adjustSubjectId,
                            supplyDate: data.supplyDate,
                            supplyGradeId: data.supplyGradeId,
                            supplyClassId: data.supplyClassId,
                            supplySectionId: data.supplyClassNo,
                            supplySubjectId: data.supplySubjectId,
                            supplyAddressData: {
                                userJson: []
                            },
                            adjustAddressData: {
                                userJson: []
                            },
                            chooseType:data.chooseType,
                            ischooseType:data.chooseType==1? (data.adjustGradeId+'-'+data.adjustClassId+'-'+data.adjustClassNo+'-'+data.adjustSubjectId):"",
                            newischooseType:data.chooseType==1? (data.supplyGradeId+'-'+data.supplyClassId+'-'+data.supplyClassNo+'-'+data.supplySubjectId):"",
                        };
                        
                        this.editTargetInfo = {
                            date: data.adjustDate,
                            teacherId: JSON.parse(data.adjustTeacherJson)[0].id,
                            teacherName: JSON.parse(data.adjustTeacherJson)[0].name,
                            teacherJson: JSON.parse(data.adjustTeacherJson),
                            key: data.chooseType==1? (data.adjustGradeId+'-'+data.adjustClassId+'-'+data.adjustClassNo+'-'+data.adjustSubjectId):"",
                            gradeId: data.adjustGradeId,
                            gradeName: data.adjustGradeName,
                            classId: data.adjustClassId,
                            className: data.adjustClassName,
                            sectionId: data.adjustClassNo,
                            sectionName: data.adjustClassNoName,
                            currId: data.adjustSubjectId,
                            currName: data.adjustSubjectName
                        };
                        
                         if(data.adjustPics){
                            for(let i=0;i<JSON.parse(data.adjustPics).length;i++){
                                this.adjustPics.push({
                                    fileUrl:JSON.parse(data.adjustPics)[i].picUrl
                                })
                            }
                        }
                        setTimeout(() => {
                            self.ruleForm.adjustSubjectId = data.adjustSubjectId;
                            self.ruleForm.supplySubjectId = data.supplySubjectId;
                            this.ruleForm.supplyAddressData = {
                            userJson: JSON.parse(data.supplyTeacherJson)
                        };
                        this.ruleForm.adjustAddressData = {
                            userJson: JSON.parse(data.adjustTeacherJson)
                        };
                            if(this.ruleForm.chooseType==1){
                                this.getScheduleCurrByTeacherIdAndDate(1);
                            }
                        }, 1000);
                    }
                }).then(() => {
                    if(this.ruleForm.chooseType==0){
                       this.getSchoolClassNoJSONArray();
                       this.querySchoolGradeClass();
                    }else{

                    }
                    
                }).catch();
            },
            // 初始调用，获取年级、班级、节次、列表
            getSchoolClassNoJSONArray() {
                getSchoolClassNoJSONArray().then(res => {
                    const data = res.data.data;
                    if (res.data.code === 200 && data.length) {
                        this.schoolSectionList = data;
                        if (!this.supplyId) {
                            this.ruleForm.supplySectionId = data[0].sectionId || '';
                            this.ruleForm.adjustSectionId = data[0].sectionId || '';
                        }
                    }
                }).catch();
            },
            querySchoolGradeClass() {
                querySchoolGradeClass().then((res) => {
                    const data = res.data.data;
                    if (res.data.code === 200) {
                        this.gradeList = data;
                        if (!this.supplyId) {
                            this.supplyClassList = data[0].classList || [];
                            this.adjustClassList = data[0].classList || [];
                            this.ruleForm.supplyGradeId = data[0].id || '';
                            this.ruleForm.supplyClassId = this.supplyClassList[0].id || '';
                            this.ruleForm.adjustGradeId = data[0].id || '';
                            this.ruleForm.adjustClassId = this.adjustClassList[0].id || '';
                        } else {
                            this.supplyClassList = data[data.map(item => item.id).indexOf(this.ruleForm.supplyGradeId)].classList || [];
                            this.adjustClassList = data[data.map(item => item.id).indexOf(this.ruleForm.adjustGradeId)].classList || [];
                        }
                        this.queryCoursesByClassId(this.ruleForm.supplyClassId, 'supply');
                        this.queryCoursesByClassId(this.ruleForm.adjustClassId, 'adjust');
                    }
                }).catch(() => {
                });
            },
            queryCoursesByClassId(id, subType) {
                queryCoursesByClassId(id).then((res) => {
                    const data = res.data.data;
                    if (res.data.code === 200 && subType === 'supply') {
                        this.supplySubjectList = data;
                        this.supplySubjectId = '';
                    } else if (res.data.code === 200 && subType === 'adjust') {
                        this.adjustSubjectList = data;
                        this.adjustSubjectId = '';
                    }
                    this.getClassSubjectAndTeacherByClassNo(subType);
                }).catch(() => {
                });
            },
            // 获取对应的课程
            getClassSubjectAndTeacherByClassNo(subType) {
                if (subType === 'supply') {
                    if (!this.ruleForm.supplyClassId || !this.ruleForm.supplySectionId || !this.ruleForm.supplyDate) {
                        return;
                    }
                    const query = {
                        classId: this.ruleForm.supplyClassId,
                        classNo: this.ruleForm.supplySectionId,
                        listenDate: this.ruleForm.supplyDate
                    };

                    getClassSubjectAndTeacherByClassNo(query).then(res => {
                        const data = res.data.data;
                        if (res.data.code === 200) {
                            if (data.subjectId && this.supplySubjectList.map(item => item.id).indexOf(data.subjectId) > -1) {
                                this.ruleForm.supplySubjectId = data.subjectId;
                            } else {
                                this.ruleForm.supplySubjectId = '';
                            }
                            this.ruleForm.supplyAddressData = {
                                userJson: JSON.parse(data.teacherJson) || []
                            };
                        }
                    }).catch();
                } else if (subType === 'adjust') {
                    if (!this.settingForm.adjustClassId || !this.settingForm.adjustSectionId || !this.settingForm.adjustDate) {
                        return;
                    }
                    const query = {
                        classId: this.settingForm.adjustClassId,
                        classNo: this.settingForm.adjustSectionId,
                        listenDate: this.settingForm.adjustDate
                    };

                    getClassSubjectAndTeacherByClassNo(query).then(res => {
                        const data = res.data.data;
                        if (res.data.code === 200) {
                            if (data.subjectId && this.adjustSubjectList.map(item => item.id).indexOf(data.subjectId) > -1) {
                                this.settingForm.adjustSubjectId = data.subjectId;
                            } else {
                                this.settingForm.adjustSubjectId = '';
                            }
                            this.settingForm.adjustAddressData = {
                                userJson: JSON.parse(data.teacherJson) || []
                            };
                        }
                    }).catch();
                }
            },
            getStrDate(data) {
                let strDate = data.getFullYear() + "-" + this.fillZero(data.getMonth() + 1) + "-" + this.fillZero(data.getDate());
                return strDate;
            },
            fillZero(n) {
                return n < 10 ? '0' + n : n;
            },
            openSettingDialog(item) {
                this.currentTargetItem = item;
                this.settingDialogVisible = true;
                if (item.targetInfo) {
                    this.settingForm = {
                        adjustDate: item.targetInfo.date,
                        adjustAddressData: { userJson: JSON.parse(JSON.stringify(item.targetInfo.teacherJson)) },
                        adjustSectionKey: item.targetInfo.key
                    };
                    this.fetchTargetSchedule();
                } else {
                    this.settingForm = {
                        adjustDate: '',
                        adjustAddressData: { userJson: [] },
                        adjustSectionKey: ''
                    };
                    this.targetScheduleList = [];
                }
                this.$nextTick(() => {
                    if(this.$refs.settingForm) this.$refs.settingForm.clearValidate();
                });
            },
            changeDialogDate(date) {
                this.settingForm.adjustDate = this.getStrDate(date);
                this.settingForm.adjustSectionKey = '';
                this.fetchTargetSchedule();
            },
            changeDialogTeacher() {
                this.settingForm.adjustSectionKey = '';
                this.fetchTargetSchedule();
            },
            fetchTargetSchedule() {
                if (this.settingForm.adjustDate && this.settingForm.adjustAddressData.userJson.length) {
                    getScheduleCurrByTeacherIdAndDate({
                        searchDate: this.settingForm.adjustDate,
                        teacherId: this.settingForm.adjustAddressData.userJson[0].id
                    }).then(res => {
                        if (res.data.result) {
                             let namelist=['','早自习','上午','午自习','下午','晚自习',]
                             const data = res.data.data;
                             for(let i=0;i<data.length;i++){
                                data[i].sectionId = data[i].dayStage+','+data[i].seq;
                                data[i].sectionNoName = namelist[data[i].dayStage-0]+'(第'+data[i].seq+'节)';
                             }
                             this.targetScheduleList = data;
                        }
                    });
                }
            },
            confirmSetting() {
                this.$refs.settingForm.validate(valid => {
                    if (valid) {
                        const { adjustDate, adjustAddressData, adjustSectionKey } = this.settingForm;
                        const targetItem = this.targetScheduleList.find(i => 
                            (i.gradeId+'-'+i.classId+'-'+i.sectionId+'-'+i.currId) === adjustSectionKey
                        );
                        
                        if (targetItem) {
                            this.$set(this.currentTargetItem, 'targetInfo', {
                                date: adjustDate,
                                teacherId: adjustAddressData.userJson[0].id,
                                teacherName: adjustAddressData.userJson[0].name,
                                key: adjustSectionKey,
                                gradeId: targetItem.gradeId,
                                gradeName: targetItem.gradeName || '', 
                                classId: targetItem.classId,
                                className: targetItem.className,
                                sectionId: targetItem.sectionId,
                                sectionName: targetItem.sectionNoName,
                                currId: targetItem.currId,
                                currName: targetItem.currName,
                                teacherJson: adjustAddressData.userJson
                            });
                            this.settingDialogVisible = false;
                        }
                    }
                });
            },
            handleCheckboxChange(item) {
                if (!item.checked) {
                    this.$set(item, 'targetInfo', null);
                }
            },
            openManualSettingDialog() {
                this.manualSettingDialogVisible = true;
                if (this.manualItem.targetInfo) {
                    this.settingForm = {
                        adjustDate: this.manualItem.targetInfo.date,
                        adjustAddressData: { userJson: JSON.parse(JSON.stringify(this.manualItem.targetInfo.teacherJson)) },
                        adjustSectionKey: this.manualItem.targetInfo.key,
                        adjustGradeId: this.manualItem.targetInfo.gradeId,
                        adjustClassId: this.manualItem.targetInfo.classId,
                        adjustSectionId: this.manualItem.targetInfo.sectionId,
                        adjustSubjectId: this.manualItem.targetInfo.currId
                    };
                } else {
                    this.settingForm = {
                        adjustDate: '',
                        adjustAddressData: { userJson: [] },
                        adjustSectionKey: '',
                        adjustGradeId: '',
                        adjustClassId: '',
                        adjustSectionId: '',
                        adjustSubjectId: ''
                    };
                }
                this.$nextTick(() => {
                    if(this.$refs.settingForm) this.$refs.settingForm.clearValidate();
                });
            },
            confirmManualSetting() {
                this.$refs.settingForm.validate(valid => {
                    if (valid) {
                        this.$set(this.manualItem, 'targetInfo', {
                            date: this.settingForm.adjustDate,
                            teacherId: this.settingForm.adjustAddressData.userJson[0].id,
                            teacherName: this.settingForm.adjustAddressData.userJson[0].name,
                            key: this.settingForm.adjustGradeId+'-'+this.settingForm.adjustClassId+'-'+this.settingForm.adjustSectionId+'-'+this.settingForm.adjustSubjectId,
                            gradeId: this.settingForm.adjustGradeId,
                            gradeName: this.getListName(this.gradeList, this.settingForm.adjustGradeId),
                            classId: this.settingForm.adjustClassId,
                            className: this.getListName(this.adjustClassList, this.settingForm.adjustClassId),
                            sectionId: this.settingForm.adjustSectionId,
                            sectionName: this.schoolSectionList[this.schoolSectionList.map(item => item.sectionId).indexOf(this.settingForm.adjustSectionId)] ? this.schoolSectionList[this.schoolSectionList.map(item => item.sectionId).indexOf(this.settingForm.adjustSectionId)].sectionNoName : '',
                            currId: this.settingForm.adjustSubjectId,
                            currName: this.getListName(this.adjustSubjectList, this.settingForm.adjustSubjectId),
                            teacherJson: this.settingForm.adjustAddressData.userJson
                        });
                        this.manualSettingDialogVisible = false;
                    }
                });
            },
            handleManualCheckboxChange() {
                if (!this.manualItem.checked) {
                    this.$set(this.manualItem, 'targetInfo', null);
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .supply_class_add {
        padding:12px;
 .demo-ruleForm {
            width: 810px;
            margin: 0 auto;
        }
        .el-input, .el-select {
            width: 100%;
        }

        .header {
            padding-bottom: 10px;
            border-bottom: 1px solid #eee;

            .button_wrap {
                width: 50%;
                margin-right: 20%;
                overflow: hidden;
                float: right;

                span {
                    width: 33%;
                    line-height: 34px;
                    float: left;
                    text-align: center;
                    background: #fff;
                    border: 1px solid #bfcbd9;
                    cursor: pointer;
                }

                .tab_left {
                    border-radius: 4px 0 0 4px;
                }

                .tab_right {
                    border-radius: 0 4px 4px 0;
                }

                .tab_color {
                    color: #fff;
                    background-color: #409eff;
                    border-color: #409eff;
                    -webkit-box-shadow: -1px 0 0 0 #409eff;
                    box-shadow: -1px 0 0 0 #409eff;
                }
            }
        }

        .supply_add_box {
            padding: 20px;
        }
    }
</style>
