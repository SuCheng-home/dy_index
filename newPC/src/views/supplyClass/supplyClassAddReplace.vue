<template>
    <div class="supply_class_add">
        <div class="header">
            <el-button @click="goBack" size="medium">返回</el-button>
            <!-- 20260303 应产品需求 去掉存草稿功能 -->
            <!-- <el-button type="primary" @click="saveSupply(1)" size="medium">存草稿</el-button> -->
            <el-button type="primary" @click="saveSupply(2)" size="medium">发布</el-button>
            <div class="button_wrap" v-show="!supplyId">
                <span class="tab_left tab_color">代课</span>
                <span @click="indexChange">调课</span>
                <span class="tab_right " @click="otheradd">其他</span>
            </div>
        </div>
        <div class="supply_add_box"  >
            <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="140px" class="demo-ruleForm">
                  <el-form-item label="选择方式" class="is-required">
                    <el-radio-group v-model="ruleForm.chooseType" @change="getScheduleCurrByTeacherIdAndDate()" :disabled="supplyId!=0">
                        <el-radio :label="1">按照课表</el-radio>
                        <el-radio :label="0">手动选择</el-radio>
                    </el-radio-group>
                </el-form-item>
                <!-- <el-form-item label="代课老师" prop="addressData">
                    <address-book v-model="ruleForm.addressData" :config="teacherConfigData" @confirm="getScheduleCurrByTeacherIdAndDate()"></address-book>
                </el-form-item> -->
                <el-form-item label="被代课老师" prop="adjustAddressData">
                    <address-book v-model="ruleForm.adjustAddressData" :config="teacherConfigData" @confirm="getScheduleCurrByTeacherIdAndDate()"></address-book>
                </el-form-item>
                <el-form-item label="日期" prop="adjustDate">
                    <el-date-picker v-model="ruleForm.adjustDate" type="date" placeholder="选择日期" :clearable="false"
                                    @change="changeDate" ></el-date-picker>
                </el-form-item>   
                 <el-form-item label="可代班节次"   v-if="ruleForm.chooseType==1" required >
                    <div v-for="(item,index) in chooseTypeList" :key="index" class="class-item">
                        <el-checkbox v-model="item.checked" @change="handleCheckChange(item)">
                            {{ item.className }}--{{ item.sectionNoName }}--{{ item.currName }}
                        </el-checkbox>
                        <div v-if="item.checked" class="teacher-select">
                            <address-book v-model="item.teacherData" :config="teacherConfigData" @confirm="handleTeacherConfirm(item)"></address-book>
                        </div>
                    </div>
                </el-form-item>            
               <div v-if="ruleForm.chooseType==0">
                    <el-form-item label="可代班节次" required>
                        <div style="margin-bottom: 10px;">
                            <el-button type="text" @click="openManualDialog">添加代课节次</el-button>
                        </div>
                        <div v-for="(item, index) in manualChooseTypeList" :key="index" class="class-item">
                            <span>{{ item.className }}--{{ item.sectionNoName }}--{{ item.subjectName }}</span>
                            <div class="teacher-select" style="display: flex;align-items: center;">
                                
                                <address-book v-model="item.teacherData" :config="teacherConfigData" style="flex: 1;"></address-book>
                                <i class="el-icon-delete" style="cursor: pointer; color: #F56C6C; margin-left: 10px;" @click="removeManualItem(index)"></i>
                            </div>
                          
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
                <template v-if="isSubstitute === 3">
                    <el-form-item label="抵扣条" prop="substituteId">
                        <el-select v-model="ruleForm.substituteId" placeholder="请选择抵扣条">
                            <el-option v-for="(item) in ticketTypeList" :key="item.key" :label="item.value" :value="item.key">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="发送数量" prop="sendNum">
                        <el-input-number v-model="ruleForm.sendNum" :min="1" ></el-input-number>
                    </el-form-item>
                </template>
                  <el-form-item label="图片" prop="pic">
                        <uploader  multiple v-model="adjustPics" pathPrefix="daiketiaoke" module="daiketiaoke" moduleCode="2009" :extList="['bmp', 'png', 'jpg', 'jpeg', 'gif']" showMode="image" :showModeCover="false" showResult="image" ></uploader>
                    </el-form-item>
            </el-form>
        </div>
        <el-dialog title="请选择课节次" :visible.sync="manualDialogVisible" width="500px" append-to-body>
            <el-form :model="manualForm" ref="manualForm" label-width="80px">
                <el-form-item label="年级" prop="gradeId" :rules="{required: true, message: '请选择年级', trigger: 'change'}">
                    <el-select v-model="manualForm.gradeId" placeholder="请选择年级" @change="changeManualGrade">
                        <el-option v-for="item in gradeList" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="班级" prop="classId" :rules="{required: true, message: '请选择班级', trigger: 'change'}">
                    <el-select v-model="manualForm.classId" placeholder="请选择班级" @change="changeManualClass">
                        <el-option v-for="item in manualClassList" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="节次" prop="sectionId" :rules="{required: true, message: '请选择节次', trigger: 'change'}">
                    <el-select v-model="manualForm.sectionId" placeholder="请选择节次">
                        <el-option v-for="item in schoolSectionList" :key="item.sectionId" :label="item.sectionNoName"
                                   :value="item.sectionId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="课程" prop="subjectId" :rules="{required: true, message: '请选择课程', trigger: 'change'}">
                    <el-select v-model="manualForm.subjectId" placeholder="请选择课程">
                        <el-option v-for="item in manualSubjectList" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="manualDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmManualAdd">确 定</el-button>
            </div>
        </el-dialog>
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
        addOrPublishSupplyAdjustClassList,
        getScheduleCurrByTeacherIdAndDate,
        getSchoolSupplyAdjustClassSetInfo
    } from '@/api/supplyClass';
    import {
        getSchoolOvertimeDeductionTypeList
    } from '@/api/leaveCancelTicket';

    export default {
        name: "supplyClassAddReplace",
        components: {
            AddressBook,Uploader
        },
        data() {
            return {
                supplyId: 0,
                teacherConfigData: {
                    title: '选择老师',
                    depart: {target: 'user', departType: 't', userTypes: '1'},
                    SingleChose: true,
                    group: false
                },
                schoolSectionList: [],
                gradeList: [],
                classList: [],
                subjectList: [],
                ruleForm: {
                    addressData: {
                        userJson: []
                    },
                    adjustDate: '',
                    reason: '',
                    reasonType:'',
                    gradeId: '',
                    classId: '',
                    sectionId: '',
                    subjectId: '',
                    adjustAddressData: {
                        userJson: []
                    },
                    chooseType:1,
                    ischooseType:'',
                    substituteId: '',
                    sendNum: '',
                },
                manualDialogVisible: false,
                manualForm: {
                    gradeId: '',
                    classId: '',
                    sectionId: '',
                    subjectId: ''
                },
                manualChooseTypeList: [],
                manualClassList: [],
                manualSubjectList: [],
                chooseTypeList:[],
                rules: {
                    addressData: [
                        {required: true}
                    ],
                    adjustAddressData: [
                        {required: true}
                    ],
                    adjustDate: [
                        {required: true, message: '请选择日期！'}
                    ],
                    gradeId: [
                        {required: true, message: '请选择年级！'}
                    ],
                    classId: [
                        {required: true, message: '请选择班级！'}
                    ],
                    sectionId: [
                        {required: true, message: '请选择节次！'}
                    ],
                    subjectId: [
                        {required: true, message: '请选择课程！'}
                    ],
                   
                    substituteId: [
                        {required: true, message: '请选择抵扣条！'}
                    ],
                    sendNum: [
                        {required: true, message: '请输入发送数量！'}
                    ]
                },
                adjustPics:[],
                isSubstitute: 1, // 是否发生抵扣条 1 不发 2自动发 3手动发
                ticketTypeList: []
            }
        },
        mixins: [mixins],
        created() {
            this.supplyId = this.$route.query.id || 0;
            // 先加载抵扣条类型列表，确保编辑时能正确回显
            getSchoolOvertimeDeductionTypeList({
                deductionName: ''
            })
                .then(res => res.data)
                .then(data => {
                const pageData = data.data;
                this.ticketTypeList = pageData.filter(i => i.typeCode==1)
                    .map(i => ({
                    key: i.id,
                    value: i.deductionName
                    }));
                
                // 加载设置信息
                getSchoolSupplyAdjustClassSetInfo().then(res => {
                    const data = res.data.data;
                    if (data.id) {                        
                        this.isSubstitute=data.isSubstitute;
                    }
                })
                
                // 加载编辑数据
                if (this.supplyId) {
                    this.getSupplyAdjustClassInfo();
                } else {
                    this.getSchoolClassNoJSONArray();
                    this.querySchoolGradeClass();
                }
            })
          
        },
        methods: {
            goBack() {
                this.$router.back();
            },
            indexChange() {
                this.$router.replace({path: 'addChange'});
            },
            otheradd() {
                this.$router.replace({path: 'otheradd'});
            },
            openManualDialog() {
                this.manualDialogVisible = true;
                this.manualForm = {
                    gradeId: '',
                    classId: '',
                    sectionId: '',
                    subjectId: ''
                };
                if (this.$refs.manualForm) {
                    this.$refs.manualForm.resetFields();
                }
            },
            changeManualGrade(val) {
                if (val) {
                    this.manualClassList = this.gradeList[this.gradeList.map(item => item.id).indexOf(val)].classList || [];
                    this.manualForm.classId = '';
                    this.manualForm.subjectId = '';
                }
            },
            changeManualClass(val) {
                if(val){
                     queryCoursesByClassId(val).then((res) => {
                        const data = res.data.data;
                        if (res.data.code === 200) {
                            this.manualSubjectList = data;
                        }
                    }).catch(() => {
                    });
                }
                this.manualForm.subjectId = '';
            },
            confirmManualAdd() {
                this.$refs.manualForm.validate((valid) => {
                    if (valid) {
                      
                        const { gradeId, classId, sectionId, subjectId } = this.manualForm;
                        
                        // Check for duplicate
                        const exists = this.manualChooseTypeList.some(item => 
                            item.gradeId === gradeId && 
                            item.classId === classId && 
                            item.sectionId === sectionId && 
                            item.subjectId === subjectId
                        );
                        
                        if (exists) {
                            this.$message.warning('该节次已添加！');
                            return;
                        }

                        // Fetch original teacher info
                        const query = {
                            classId: classId,
                            classNo: sectionId,
                            listenDate: this.ruleForm.adjustDate
                        };
                        
                        getClassSubjectAndTeacherByClassNo(query).then(res => {
                            const data = res.data.data;
                            if (res.data.code === 200) {
                                const adjustTeacherJson = JSON.parse(data.teacherJson) || [];
                                
                                // 更新被代课老师信息
                                this.ruleForm.adjustAddressData = {
                                    userJson: adjustTeacherJson
                                };
                                
                                const gradeName = this.getListName(this.gradeList, gradeId);
                                const className = this.getListName(this.manualClassList, classId);
                                const sectionObj = this.schoolSectionList.find(i => i.sectionId === sectionId);
                                const sectionNoName = sectionObj ? sectionObj.sectionNoName : '';
                                const subjectName = this.getListName(this.manualSubjectList, subjectId);

                                this.manualChooseTypeList.push({
                                    gradeId, gradeName,
                                    classId, className,
                                    sectionId, sectionNoName,
                                    subjectId, subjectName,
                                    adjustTeacherData: { userJson: adjustTeacherJson },
                                    teacherData: { userJson: [] } // For substitute teacher selection
                                });
                                this.manualDialogVisible = false;
                            }
                        });
                    }
                });
            },
            removeManualItem(index) {
                this.manualChooseTypeList.splice(index, 1);
            },
            changeDate(date) {
              
                
                this.ruleForm.adjustDate = this.getStrDate(date);
                  console.log(123,date,this.ruleForm);
                if(this.ruleForm.chooseType==1){
                   this.getScheduleCurrByTeacherIdAndDate();
                }else{
                   this.getClassSubjectAndTeacherByClassNo();
                }
                
               
            },
            getScheduleCurrByTeacherIdAndDate(num){
                if(this.ruleForm.chooseType==0){
                 return;
                }
                if(this.ruleForm.adjustDate&&this.ruleForm.adjustAddressData.userJson.length){
                    if(num!=1){
                        this.ruleForm.ischooseType='';
                    }
                    console.log('123',{
                        searchDate:this.ruleForm.adjustDate,
                        teacherId:this.ruleForm.adjustAddressData.userJson[0].id
                    });
                    
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
                                    // 编辑时根据 ischooseType 回显选中状态
                                    const currentKey = data.data[i].gradeId + '-' + data.data[i].classId + '-' + data.data[i].sectionId + '-' + data.data[i].currId;
                                    data.data[i].checked = this.ruleForm.ischooseType === currentKey;
                                    // 编辑时回显被代课老师
                                    data.data[i].teacherData = {
                                        userJson: data.data[i].checked ? this.ruleForm.adjustAddressData.userJson : []
                                    };
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
            },
            handleCheckChange(item) {
                if (!item.checked) {
                    item.teacherData = { userJson: [] };
                }
            },
            handleTeacherConfirm(item) {
                console.log('选择老师确认:', item);
            },
            changeGrade(val) {
                if (val) {
                    this.classList = this.gradeList[this.gradeList.map(item => item.id).indexOf(val)].classList || [];
                    this.ruleForm.classId = this.classList[0].id || '';
                    this.queryCoursesByClassId(this.ruleForm.classId);
                }
            },
            changeClass(val) {
                this.queryCoursesByClassId(val);
                this.getClassSubjectAndTeacherByClassNo();
            },
            changeSection(val) {
                this.getClassSubjectAndTeacherByClassNo();
            },
            getListName(list, selectId) {
                if (list && list.length && selectId) {
                    const selectName = list[list.map(item => item.id).indexOf(selectId)].name;
                    return selectName;
                }
                return '';
            },
            saveSupply(state) {
                this.$refs['ruleForm'].validate((valid) => {
                    if (valid) {
                         if (!this.ruleForm.adjustAddressData.userJson || !this.ruleForm.adjustAddressData.userJson.length) {
                            this.$message({
                                message: '请选择被代课老师！',
                                type: 'warning'
                            });
                            return;
                        }
                      
                      if (this.ruleForm.chooseType == 1) {
                            // 检查是否有选中的可代班节次
                             const checkedItems = this.chooseTypeList.filter(item => item.checked);
                                if (checkedItems.length === 0) {
                                    this.$message({
                                    message: '请选择可代班节次！',
                                    type: 'warning'
                                });
                                return;
                            }  }
                             if (this.ruleForm.chooseType == 0) {
                            // 检查是否有选中的可代班节次
                                if (this.manualChooseTypeList.length===0) {
                                    this.$message({
                                    message: '请选择可代班节次！',
                                    type: 'warning'
                                });
                                return;
                            }  }
                        
                        // 检查每个选中的节次是否都选择了老师
                        if (this.ruleForm.chooseType === 1) {
                            const checkedItems = this.chooseTypeList.filter(item => item.checked);
                            const invalidItems = checkedItems.filter(item => 
                                !item.teacherData || !item.teacherData.userJson || !item.teacherData.userJson.length
                            );
                            
                            if (invalidItems.length > 0) {
                                this.$message({
                                    message: '请为所有选中的节次选择老师！',
                                    type: 'warning'
                                });
                                return;
                            }
                        }
                         // 检查每个选中的节次是否都选择了老师
                        if (this.ruleForm.chooseType === 0) {
                            const invalidItems = this.manualChooseTypeList.filter(item => 
                                !item.teacherData || !item.teacherData.userJson || !item.teacherData.userJson.length
                            );
                            if (invalidItems.length > 0) {
                                this.$message({
                                    message: '请为所有添加的节次选择老师！',
                                    type: 'warning'
                                });
                                return;
                            }
                        }
                        
                        let myadjustPics=[]
                        for(let i=0;i<this.adjustPics.length;i++){
                               myadjustPics.push({
                                    picUrl:this.adjustPics[i].fileUrl
                                })
                            }
  // 1是手动后代班，0是自动代班
                        if(this.ruleForm.chooseType==0){
                            if (this.manualChooseTypeList.length === 0) {
                                this.$message.warning('请添加代课节次！');
                                return;
                            }
                            const invalidItems = this.manualChooseTypeList.filter(item => 
                                !item.teacherData || !item.teacherData.userJson || !item.teacherData.userJson.length
                            );
                            
                            if (invalidItems.length > 0) {
                                this.$message.warning('请为所有节次选择代课老师！');
                                return;
                            }

                            // 构建 list 数组，将每个对象转成字符串
                            const list = this.manualChooseTypeList.map(item => {
                                let query = {
                                    reason: this.ruleForm.reason,
                                    reasonType:this.ruleForm.reasonType,
                                    chooseType: this.ruleForm.chooseType,
                                    adjustClassId: item.classId,
                                    adjustClassName: item.className,
                                    adjustClassNo: item.sectionId,
                                    adjustClassNoName: item.sectionNoName,
                                    adjustDate: this.ruleForm.adjustDate,
                                    adjustGradeId: item.gradeId,
                                    adjustGradeName: item.gradeName,
                                    adjustSubjectId: item.subjectId,
                                    adjustSubjectName: item.subjectName,   
                                    adjustTeacherJson: JSON.stringify(this.ruleForm.adjustAddressData.userJson),
                                    supplyTeacherJson: JSON.stringify(item.teacherData.userJson),
                                    createUserType: 1, 
                                    state: state,
                                    type: 1,
                                    typeName: '代课',
                                    adjustPics: JSON.stringify(myadjustPics),
                                };
                                if (this.isSubstitute === 3) {
                                    query.sendNum = this.ruleForm.sendNum
                                    query.substituteId = this.ruleForm.substituteId
                                    query.substituteName = this.ticketTypeList.find(i => i.key === this.ruleForm.substituteId).value
                                }
                                
                                if (item.id) {
                                    query.id = item.id;
                                }
                                return query;
                            });
                            console.log(123,list);
                            
                            // 调用批量新增接口
                            addOrPublishSupplyAdjustClassList(list).then(res => {
                                    console.log('res',res);
                                    if (res.data.result) {
                                        const msgText = state === 2 ? '发布' : '保存';
                                        
                                        // 检查res.data.data是否为空数组
                                        if (!res.data.data || res.data.data.length === 0) {
                                            this.$message({
                                                message: msgText + '成功',
                                                type: 'success'
                                            });
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
                                            });
                                        }
                                    } else {
                                        this.$message({
                                            message: res.data.msg || '操作失败',
                                            type: 'warning'
                                        });
                                    }
                                }).catch(err => {
                                    this.$message({
                                        message: err.message || '网络请求失败',
                                        type: 'warning'
                                    });
                                });
                        }else{
                            const checkedItems = this.chooseTypeList.filter(item => item.checked);
                            //  <!-- 20260303 应产品需求 去掉存草稿功能 -->
                            // 对于修改操作，只处理当前选中的项
                            // if (this.supplyId) {
                            //     const currentItem = checkedItems.find(obj => 
                            //         this.ruleForm.ischooseType === (obj.gradeId + '-' + obj.classId + '-' + obj.sectionId + '-' + obj.currId)
                            //     );
                            //     if (currentItem) {
                            //         let query = {
                            //             reason: this.ruleForm.reason,
                            //             chooseType: this.ruleForm.chooseType,
                            //             adjustClassId: currentItem.classId,
                            //             adjustClassName: currentItem.className,
                            //             adjustClassNo: currentItem.sectionId,
                            //             adjustClassNoName: currentItem.sectionNoName,
                            //             adjustDate: this.ruleForm.adjustDate,
                            //             adjustGradeId: currentItem.gradeId,
                            //             adjustGradeName: currentItem.gradeName,
                            //             adjustSubjectId: currentItem.currId,
                            //             adjustSubjectName: currentItem.currName,
                            //             adjustTeacherJson: JSON.stringify(currentItem.teacherData.userJson),
                            //             supplyTeacherJson: JSON.stringify(this.ruleForm.addressData.userJson),
                            //             createUserType: 1,
                            //             state: state,
                            //             type: 1,
                            //             typeName: '代课',
                            //             adjustPics: JSON.stringify(myadjustPics),
                            //             id: this.supplyId
                            //         };
                            //         if (this.isSubstitute === 3) {
                            //             query.sendNum = this.ruleForm.sendNum
                            //             query.substituteId = this.ruleForm.substituteId
                            //             query.substituteName = this.ticketTypeList.find(i => i.key === this.ruleForm.substituteId).value
                            //         }
                            //         this.editOrPublishSupplyAdjustClass(query).then(success => {
                            //             if (success) {
                            //                 const msgText = state === 2 ? '发布' : '保存';
                            //                 this.$message({
                            //                     message: msgText + '成功',
                            //                     type: 'success'
                            //                 });
                            //                 this.$router.back();
                            //             }
                            //         });
                            //     }
                            // } else {
                                // 新增操作，构建 list 数组，将每个对象转成字符串
                                const list = checkedItems.map(obj => {
                                    let query = {
                                        reason: this.ruleForm.reason,
                                        reasonType: this.ruleForm.reasonType,
                                        chooseType: this.ruleForm.chooseType,
                                        adjustClassId: obj.classId,
                                        adjustClassName: obj.className,
                                        adjustClassNo: obj.sectionId,
                                        adjustClassNoName: obj.sectionNoName,
                                        adjustDate: this.ruleForm.adjustDate,
                                        adjustGradeId: obj.gradeId,
                                        adjustGradeName: obj.gradeName,
                                        adjustSubjectId: obj.currId,
                                        adjustSubjectName: obj.currName,
                                        
                                        adjustTeacherJson: JSON.stringify(this.ruleForm.adjustAddressData.userJson),
                                        supplyTeacherJson: JSON.stringify(obj.teacherData.userJson),
                                        createUserType: 1,
                                        state: state,
                                        type: 1,
                                        typeName: '代课',
                                        adjustPics: JSON.stringify(myadjustPics),
                                    };
                                    if (this.isSubstitute === 3) {
                                        query.sendNum = this.ruleForm.sendNum
                                        query.substituteId = this.ruleForm.substituteId
                                        query.substituteName = this.ticketTypeList.find(i => i.key === this.ruleForm.substituteId).value
                                    }
                                    return query;
                                });
                                console.log(321,list);
                                
                                // 调用批量新增接口
                                addOrPublishSupplyAdjustClassList(list).then(res => {
                                    console.log('res',res);
                                    if (res.data.result) {
                                        const msgText = state === 2 ? '发布' : '保存';
                                        
                                        // 检查res.data.data是否为空数组
                                        if (!res.data.data || res.data.data.length === 0) {
                                            this.$message({
                                                message: msgText + '成功',
                                                type: 'success'
                                            });
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
                                            });
                                        }
                                    } else {
                                        this.$message({
                                            message: res.data.msg || '操作失败',
                                            type: 'warning'
                                        });
                                    }
                                }).catch(err => {
                                    this.$message({
                                        message: err.message || '网络请求失败',
                                        type: 'warning'
                                    });
                                });
                            // }
                        }
                    }
                });
            },
           
            editOrPublishSupplyAdjustClass(query) {
                return editOrPublishSupplyAdjustClass(query).then(res => {
                    if (!res.data.result) {
                        this.$message.warning(res.data.msg || '操作失败');
                    }
                    return res.data.result;
                }).catch(err => {
                    this.$message.warning(err.message || '网络请求失败');
                    return false;
                });
            },
            // 详情
            getSupplyAdjustClassInfo() {
                getSupplyAdjustClassInfo(this.supplyId).then(res => {
                    const data = res.data.data;
                    if (res.data.code === 200) {
                        this.ruleForm = {
                            reason: data.reason,
                            reasonType: data.reasonType,
                            adjustDate: data.adjustDate,
                            gradeId: data.adjustGradeId,
                            classId: data.adjustClassId,
                            sectionId: data.adjustClassNo,
                            subjectId: data.adjustSubjectId,
                            chooseType:data.chooseType,
                            ischooseType:data.chooseType==1? (data.adjustGradeId+'-'+data.adjustClassId+'-'+data.adjustClassNo+'-'+data.adjustSubjectId):"",
                            addressData: {
                                userJson: []
                            },
                            adjustAddressData: {
                                userJson: []
                            },
                            substituteId: data.substituteId || '',
                            sendNum: data.sendNum || ''
                        };
                        // 设置 isSubstitute，确保抵扣条和发送数量的控件能正确显示
                        if (data.substituteId || data.sendNum) {
                            this.isSubstitute = 3;
                        }
                       if(data.adjustPics){
                            for(let i=0;i<JSON.parse(data.adjustPics).length;i++){
                                this.adjustPics.push({
                                    fileUrl:JSON.parse(data.adjustPics)[i].picUrl
                                })
                            }
                        }
                        
                        this.ruleForm.addressData.userJson = data.supplyTeacherList;
                        this.ruleForm.adjustAddressData.userJson = data.adjustTeacherList;
                        if(this.ruleForm.chooseType==1){
                            this.getScheduleCurrByTeacherIdAndDate(1);
                        } else {
                            // Populate manual list for editing
                            this.manualChooseTypeList = [{
                                id: this.supplyId,
                                gradeId: data.adjustGradeId,
                                gradeName: data.adjustGradeName,
                                classId: data.adjustClassId,
                                className: data.adjustClassName,
                                sectionId: data.adjustClassNo,
                                sectionNoName: data.adjustClassNoName,
                                subjectId: data.adjustSubjectId,
                                subjectName: data.adjustSubjectName,
                                adjustTeacherData: { userJson: data.adjustTeacherList || [] },
                                teacherData: { userJson: data.supplyTeacherList || [] }
                            }];
                        }
                    }
                }).then(() => {
                    this.getSchoolClassNoJSONArray();
                    this.querySchoolGradeClass();
                }).catch();
            },
            getSchoolClassNoJSONArray() {
                getSchoolClassNoJSONArray().then(res => {
                    const data = res.data;
                    if (res.data.code === 200 && data.data.length) {
                        this.schoolSectionList = data.data;
                        if (!this.supplyId) {
                            this.ruleForm.sectionId = data.data[0].sectionId || '';
                        }
                    }
                }).catch();
            },
            getClassSubjectAndTeacherByClassNo() {
                if (!this.ruleForm.classId || !this.ruleForm.sectionId || !this.ruleForm.adjustDate) {
                    return;
                }
                const query = {
                    classId: this.ruleForm.classId,
                    classNo: this.ruleForm.sectionId,
                    listenDate: this.ruleForm.adjustDate
                };
                getClassSubjectAndTeacherByClassNo(query).then(res => {
                    const data = res.data.data;
                    if (res.data.code === 200) {
                        this.ruleForm.subjectId = data.subjectId || '';
                        this.ruleForm.adjustAddressData = {
                            userJson: JSON.parse(data.teacherJson) || []
                        };
                    }
                }).catch();
            },
            querySchoolGradeClass() {
                querySchoolGradeClass().then((res) => {
                    const data = res.data.data;
                    if (res.data.code === 200) {
                        this.gradeList = data;
                        if (!this.supplyId) {
                            this.classList = data[0].classList || [];
                            this.ruleForm.gradeId = data[0].id || '';
                            this.ruleForm.classId = this.classList[0].id || '';
                        } else {
                            this.classList = data[data.map(item => item.id).indexOf(this.ruleForm.gradeId)].classList || [];
                        }
                        this.queryCoursesByClassId(this.ruleForm.classId);
                    }
                }).catch(() => {
                });
            },
            queryCoursesByClassId(id) {
                queryCoursesByClassId(id).then((res) => {
                    const data = res.data.data;
                    if (res.data.code === 200) {
                        this.subjectList = data;
                    }
                }).catch(() => {
                });
            },
            getStrDate(data) {
                let strDate = data.getFullYear() + "-" + this.fillZero(data.getMonth() + 1) + "-" + this.fillZero(data.getDate());
                return strDate;
            },
            fillZero(n) {
                return n < 10 ? '0' + n : n;
            },
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
        
        .class-item {
            margin-bottom: 6px;
            padding:5px 10px;
            border: 1px solid #DCDFE6;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        
        .teacher-select {
            width: 50%;
            padding-left: 25px;
        }
    }
</style>
