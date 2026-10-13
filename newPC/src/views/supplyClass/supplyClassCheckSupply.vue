<template>
  <div class="supply_class_check_wrap">
    <div class="header">
      <el-button @click="goBack" size="medium">返回</el-button>
      <el-button type="primary" @click="checkSupply(2)" size="medium">同意</el-button>
      <el-button type="danger" @click="checkSupply(-1)" size="medium">不同意</el-button>
    </div>
    <div class="check_box" :style="`height: ${nobottommaxH}px;`">
      <el-form label-width="140px" class="demo-ruleForm" :model="ruleForm" :rules="rules">
        <el-form-item label="调课老师">{{supplyClassMsg.supplyTeacherName}}</el-form-item>
        <el-form-item label="日期">{{supplyClassMsg.supplyDate}}</el-form-item>
        <el-form-item label="班级">{{supplyClassMsg.supplyClassName}}</el-form-item>
        <el-form-item label="节次">{{supplyClassMsg.supplyClassNoName}}</el-form-item>
        <el-form-item label="课程">{{supplyClassMsg.supplySubjectName}}</el-form-item>

        <!-- <el-form-item label="被调课老师">{{supplyClassMsg.adjustTeacherName}}</el-form-item>
        <el-form-item label="日期">{{supplyClassMsg.adjustDate}}</el-form-item>
        <el-form-item label="班级">{{supplyClassMsg.adjustClassName}}</el-form-item>
        <el-form-item label="节次">{{supplyClassMsg.adjustClassNoName}}</el-form-item>
        <el-form-item label="课程">{{supplyClassMsg.adjustSubjectName}}</el-form-item> -->


         <el-form-item label="被调课老师" prop="adjustAddressData">
                            <address-book v-model="ruleForm.adjustAddressData" :config="teacherConfigData" @confirm="getScheduleCurrByTeacherIdAndDate(2)"></address-book>
                        </el-form-item>
                        <el-form-item label="日期" prop="adjustDate">
                            <el-date-picker v-model="ruleForm.adjustDate" type="date" placeholder="选择日期" :clearable="false"
                                            @change="changeAdjustDate" :picker-options="supplyDateOptions"></el-date-picker>
                        </el-form-item>
                         <el-form-item label="可调班节次" prop="ischooseType" v-if="ruleForm.chooseType==1">
                            <el-select v-model="ruleForm.ischooseType" placeholder="请选择可代调节次">
                                <el-option v-for="(item,index) in chooseTypeList" :key="index" :label="item.className+'--'+item.sectionNoName+'--'+item.currName" :value="item.gradeId+'-'+item.classId+'-'+item.sectionId+'-'+item.currId">
                                </el-option>
                            </el-select>
                        </el-form-item>  
                        <div  v-if="ruleForm.chooseType==0">
                             <el-form-item label="年级" prop="adjustGradeId">
                            <el-select v-model="ruleForm.adjustGradeId" placeholder="请选择年级" @change="changeAdjustGrade">
                                <el-option v-for="item in gradeList" :key="item.id" :label="item.name" :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="班级" prop="adjustClassId">
                            <el-select v-model="ruleForm.adjustClassId" placeholder="请选择班级" @change="changeAdjustClass">
                                <el-option v-for="item in adjustClassList" :key="item.id" :label="item.name" :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="节次" prop="adjustSectionId">
                            <el-select v-model="ruleForm.adjustSectionId" placeholder="请选择节次" @change="changeAdjustSection">
                                <el-option v-for="item in schoolSectionList" :key="item.sectionId" :label="item.sectionNoName"
                                           :value="item.sectionId">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="课程" prop="adjustSubjectId">
                            <el-select v-model="ruleForm.adjustSubjectId" placeholder="请选择课程">
                                <el-option v-for="item in adjustSubjectList" :key="item.id" :label="item.name" :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        </div>
                        <el-form-item label="原因" v-if="supplyClassMsg.reasonType">{{supplyClassMsg.reasonType || '--'}}</el-form-item>
        <el-form-item label="理由" v-if="supplyClassMsg.reason">{{supplyClassMsg.reason || '--'}}</el-form-item>
          <el-form-item label="图片" v-if="adjustPics.length">
                  <image-previewer tag="richtext" >
                      <span class="img" :key="index" v-for="(item, index) in adjustPics">
                        <img :src="item.picUrl">
                      </span>
                  </image-previewer>
              </el-form-item> 
        <el-form-item label="审批意见" prop="examineRemark">
          <el-input type="textarea" v-model.trim="examineRemark" :maxlength="200"></el-input>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import mixins from '@/mixins/windowResize';
   import AddressBook from '@/components/AddressBook/indexExpand';
   import {
        getSupplyAdjustClassInfo,
        getSchoolClassNoJSONArray,
        getClassSubjectAndTeacherByClassNo,
        querySchoolGradeClass,
        queryCoursesByClassId,
        addOrPublishSupplyAdjustClass,
        editOrPublishSupplyAdjustClass,getScheduleCurrByTeacherIdAndDate,examineSupplyAdjustClass
    } from '@/api/supplyClass';
  import ImagePreviewer from '@/components/ImagePreviewer/ImagePreviewer.vue';
  export default {
    name: "supplyClassCheckSupply",
    data() {
      return {
        addressData: {},
        supplyClassMsg: {},
        examineRemark: '',
        adjustPics:[],
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
                adjustPics:[],
                myis:false
      }
    },
     components: {ImagePreviewer,AddressBook},
    mixins: [mixins],
    created() {
       this.supplyId = this.$route.query.id || 0;
      this.getSupplyAdjustClassInfo();
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
                    this.ruleForm.adjustClassId = this.adjustClassList[0].id || '';
                    this.queryCoursesByClassId(this.ruleForm.adjustClassId, 'adjust');
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
      goBack() {
        this.$router.back();
      },
      getSupplyAdjustClassInfo() {
         let self = this;
        getSupplyAdjustClassInfo(parseInt(this.$route.query.id)).then(res => {
          const data = res.data.data;
          if (res.data.code === 200) {
            this.supplyClassMsg = data;
            this.adjustPics= data.adjustPics?JSON.parse(data.adjustPics):[];
             this.ruleForm = {
                            reason: data.reason,
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
                            ischooseType:(data.chooseType==1&&data.adjustGradeId)? (data.adjustGradeId+'-'+data.adjustClassId+'-'+data.adjustClassNo+'-'+data.adjustSubjectId):"",
                            newischooseType:data.chooseType==1? (data.supplyGradeId+'-'+data.supplyClassId+'-'+data.supplyClassNo+'-'+data.supplySubjectId):"",
                        };
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
             setTimeout(() => {
                         
                            this.myis=true
                        }, 2000);
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
                    if ((!this.ruleForm.adjustClassId || !this.ruleForm.adjustSectionId || !this.ruleForm.adjustDate)||!this.myis) {
                        return;
                    }
                    const query = {
                        classId: this.ruleForm.adjustClassId,
                        classNo: this.ruleForm.adjustSectionId,
                        listenDate: this.ruleForm.adjustDate
                    };

                    getClassSubjectAndTeacherByClassNo(query).then(res => {
                        const data = res.data.data;
                        if (res.data.code === 200) {
                            if (data.subjectId && this.adjustSubjectList.map(item => item.id).indexOf(data.subjectId) > -1) {
                                this.ruleForm.adjustSubjectId = data.subjectId;
                            } else {
                                this.ruleForm.adjustSubjectId = '';
                            }
                            this.ruleForm.adjustAddressData = {
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
      checkSupply(state) {
        if (!this.examineRemark && state === -1) {
          this.$message({
            message: '请填写审批意见！',
            type: 'warning'
          });
          return;
        }
         if (state ===2&&(!this.ruleForm.adjustAddressData.userJson || !this.ruleForm.adjustAddressData.userJson.length)) {
                            this.$message({
                                message: '请选择被调课老师！',
                                type: 'warning'
                            });
                            return;
                        }
        let query = {};
        if(state ===2){
             if(this.ruleForm.chooseType==0){
        query={
          examineRemark: this.examineRemark,
          id: parseInt(this.$route.query.id),
          state: state,
          supplyTeacherJson: '',
          adjustClassId: this.ruleForm.adjustClassId,
                            adjustClassName: this.getListName(this.adjustClassList, this.ruleForm.adjustClassId),
                            adjustClassNo: this.ruleForm.adjustSectionId,
                            adjustClassNoName: this.schoolSectionList[this.schoolSectionList.map(item => item.sectionId).indexOf(this.ruleForm.adjustSectionId)].sectionNoName,
                            adjustDate: this.ruleForm.adjustDate,
                            adjustGradeId: this.ruleForm.adjustGradeId,
                            adjustGradeName: this.getListName(this.gradeList, this.ruleForm.adjustGradeId),
                            adjustSubjectId: this.ruleForm.adjustSubjectId,
                            adjustSubjectName: this.getListName(this.adjustSubjectList, this.ruleForm.adjustSubjectId),
                            adjustTeacherJson: JSON.stringify(this.ruleForm.adjustAddressData.userJson),
        }
         }else{
            let obj={};
              for(let i=0;i<this.chooseTypeList.length;i++){
                
                             if(this.ruleForm.ischooseType==(this.chooseTypeList[i].gradeId+'-'+this.chooseTypeList[i].classId+'-'+this.chooseTypeList[i].sectionId+'-'+this.chooseTypeList[i].currId)){
                              obj=this.chooseTypeList[i];
                             }
                         }
              console.log(obj)
            query={
          examineRemark: this.examineRemark,
          id: parseInt(this.$route.query.id),
          state: state,
          supplyTeacherJson: '',
          adjustClassId: this.ruleForm.adjustClassId,
            adjustDate: this.ruleForm.adjustDate,
                            adjustGradeId: this.ruleForm.adjustGradeId,
                            adjustClassId: obj.classId,
                            adjustClassName: obj.className,
                            adjustClassNo: obj.sectionId,
                            adjustClassNoName:obj.sectionNoName,
                            adjustGradeId: obj.gradeId,
                            adjustGradeName: obj.gradeName,
                            adjustSubjectId: obj.currId,
                            adjustSubjectName: obj.currName,
                            adjustTeacherJson: JSON.stringify(this.ruleForm.adjustAddressData.userJson),
        }
         }
            
        }else{
              query={
          examineRemark: this.examineRemark,
          id: parseInt(this.$route.query.id),
          state: state,
          supplyTeacherJson: '',}
         }
        this.examineSupplyAdjustClass(query);
      },
      examineSupplyAdjustClass(query) {
        examineSupplyAdjustClass(query).then(res => {
          const data = res.data;
          if (res.data.code === 200) {
            this.$message({
              type: 'success',
              message: '审核成功!'
            });
            this.$router.back();
          } else {
            this.$message({
              message: data.msg,
              type: 'warning'
            });
          }
        }).catch();
      }
    }
  }
</script>

<style lang="scss" scoped>
  .supply_class_check_wrap {
    padding:12px;
    .img img {
        width: 80px;
        height: 80px;
        margin: 10px;
    }
    .header {
      padding-bottom: 10px;
      border-bottom: 1px solid #eee;
    }

    .check_box {
      padding: 20px;
      overflow-x: hidden;
      overflow-y: auto;
    }

    .demo-ruleForm {
      width: 810px;
      margin: 0 auto;
      .el-date-editor,.el-select{
      width:100%;
      }
    }
  }
</style>
