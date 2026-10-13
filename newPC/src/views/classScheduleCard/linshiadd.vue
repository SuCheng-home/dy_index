<template>
  <div class="open_class_add">
    <div class="header">
      <el-button size="medium" @click="goBack">返回</el-button>
      <el-button size="medium" type="primary" @click="saveOpenClass">保存</el-button>
    </div>
    <div class="open_class_add_box" :style="`height: ${nobottommaxH}px;`">
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="140px" class="demo-ruleForm">
        <el-form-item label="原因" prop="reason">
          <el-input type="textarea" placeholder="请输入原因" v-model.trim="ruleForm.reason"></el-input>
        </el-form-item>
        <el-form-item label="停课日期" prop="stopDate">
          <el-date-picker v-model="ruleForm.stopDate" type="date" placeholder="选择停课日期" :clearable="false"></el-date-picker>
        </el-form-item>
          <el-form-item label="停课年级班级" prop="addressData">
                    <address-book v-model="ruleForm.addressData" :config="teacherConfigData"></address-book>
                </el-form-item>
        <!-- <el-form-item label="停课年级" prop="gradeJson">
            <el-checkbox-group v-model="ruleForm.gradeJson">
              <el-checkbox  v-for="item in gradeList" :key="item.id" :label="item.id"  name="type">
                  {{item.name}}
              </el-checkbox>
            </el-checkbox-group>
        </el-form-item> -->
        <el-form-item label="停课节次" prop="sectionNoJson">
           <el-checkbox-group v-model="ruleForm.sectionNoJson">
              <el-checkbox  v-for="i in singleDouble.morning" :key="i" :label="'1_'+i"  name="type">
                早自习第{{i}}节
              </el-checkbox>
              <el-checkbox  v-for="i in singleDouble.forenoon" :key="i" :label="'2_'+i"  name="type">
                上午第{{i}}节
              </el-checkbox>
              <el-checkbox  v-for="i in singleDouble.noon" :key="i" :label="'3_'+i"  name="type">
                午自习第{{i}}节
              </el-checkbox>
              <el-checkbox  v-for="i in singleDouble.afternoon" :key="i" :label="'4_'+i"  name="type">
                下午第{{i}}节
              </el-checkbox>
              <el-checkbox  v-for="i in singleDouble.night" :key="i" :label="'5_'+i"  name="type">
                晚自习第{{i}}节
              </el-checkbox>
            </el-checkbox-group>
        </el-form-item>
        <el-form-item label="备注" >
          <el-input type="textarea" placeholder="请输入备注" v-model.trim="ruleForm.remark"></el-input>
        </el-form-item>
        <!-- <el-form-item> 
          <span style="color: red;">说明：本功能仅适用于部分年级临时停课，如果全校停课请直接修改校历</span>
        </el-form-item> -->
      </el-form>
    </div>
  </div>
</template>

<script>
  import mixins from '@/mixins/windowResize';
  import { querySchoolGradeClass,} from "@/api/teachingStudy/openClass";
  import {addClassScheduleStop,classScheduleSet} from "@/api/classScheduleCard";
  import {mapGetters} from 'vuex';
  import AddressBook from '@/components/AddressBook/indexExpand';
  export default {
    name: "openClassAdd",
    components: {
            AddressBook
        },
    data() {
      return {
         teacherConfigData: {
                    title: '选择年级班级',
                    depart: {target: 'depart', departType: 's', userTypes: '2',notCheckSchool: true},
                    group: false
                },
        gradeList: [],       
        ruleForm: {
          gradeJson:[],
          reason: '',
          remark: '',
          sectionNoJson: [],
          stopDate: '', 
          addressData: {
                        userJson: []
                    },     
        },
        rules: {
                    stopDate: [
                        {required: true, message: '请选择停课日期！'}
                    ],
                    reason: [
                        {required: true, message: '请输入原因！'}
                    ],
                    gradeJson: [
                        { type: 'array', required: true, message: '请至少选择一个停课年级', trigger: 'change' }                        
                    ],
                   sectionNoJson: [
                        { type: 'array', required: true, message: '请至少选择一个停课节次', trigger: 'change' }                        
                    ],
                    addressData: [
                        {required: true}
                    ],
                },
                 singleDouble:{
                    afternoon:0,//	下午	number	
                    forenoon:0,//	上午	number	
                    morning:0,//	早上	number	
                    night:0,//	晚上	number	
                    noon:0,//	中午	number	
                },
                weekDayCount:5
      }
     
    },
    
  computed: {
    ...mapGetters(['schoolInfo']),
  },
    mixins: [mixins],
    created() {
        classScheduleSet(this.schoolInfo.id)
        .then(res => res.data)
        .then(data => {
          let mydata = data.data;
          this.singleDouble=mydata
          this.weekDayCount=mydata.weekDayCount;
        });
      this.querySchoolGradeClass();
    },
    methods: {
      goBack() {
        this.$router.back();
      },
      // 获取年级班级列表
      querySchoolGradeClass() {
        querySchoolGradeClass().then((res) => {
          const data = res.data.data;
          if (res.data.code === 200) {
            this.gradeList = data;
          }
        }).catch(() => {
        });
      },
      saveOpenClass() {
        if (!this.ruleForm.addressData.departJson || !this.ruleForm.addressData.departJson.length) {
                            this.$message({
                                message: '请选择停课年级班级！',
                                type: 'warning'
                            });
                            return;
                        }
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            let sectionNoJson=[]
            let gradeJson=[]
            for(let i=0;i<this.ruleForm.sectionNoJson.length;i++){
                sectionNoJson.push({
                    dayStage:this.ruleForm.sectionNoJson[i].split('_')[0],
                    seq:this.ruleForm.sectionNoJson[i].split('_')[1],
                })
            }
            
               for(let j=0;j<this.gradeList.length;j++){
                   for(let i=0;i<this.ruleForm.gradeJson.length;i++){
                   if(this.ruleForm.gradeJson[i]==this.gradeList[j].id){
                       gradeJson.push({
                           gradeId:this.gradeList[j].id,
                           gradeName:this.gradeList[j].name
                       })
                   }
                
              } 
            }
            let query = {
              reason: this.ruleForm.reason,
              remark: this.ruleForm.remark,
              stopDate: this.$moment(this.ruleForm.stopDate).format("YYYY-MM-DD"),
              sectionNoJson: sectionNoJson,
              studepartJson:this.ruleForm.addressData.departJson     
            };
            this.addClassScheduleStop(query);
          }
        });
      },
      addClassScheduleStop(query) {
        addClassScheduleStop(query).then(res => {
          const data = res.data;
          if (res.data.code === 200) {
            this.$message({
              message: '新增成功',
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
     
    }
  }
</script>

<style lang="scss" scoped>
  .open_class_add {
    padding: 12px;

    .header {
      padding-bottom: 10px;
      border-bottom: 1px solid #eee;
    }

    .open_class_add_box {
      overflow: hidden auto;
      padding: 20px;
    }

    .el-form {
      width: 810px;
      margin: 0 auto;

      .el-select, .el-input {
        width: 100%;
      }
    }
  }
</style>
