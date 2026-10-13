<template>
    <div class="add-allCon" style="    padding: 12px;">
       <div class="header">
          <el-row>
            <el-col :span="19">   
              <el-button type="primary" size="medium" @click="$router.back()">返回</el-button>
              <el-button type="primary" size="medium" @click="saveIt()">保存</el-button>
            </el-col>
          </el-row>
        </div>
        <div class="add_wrap">
           <el-form :model="listQuery" :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm">
            <div class="type_title">
              <div class="line"></div>
              <span style="line-height: 25px;">学生信息</span>
            </div>
            <el-form-item label="学生" prop="checkStudent">
              <address-book v-model="stuAddressData" :config="stuConfigData" @input="confirmSelect"  :isSchoolManager="true"></address-book>
            </el-form-item>
            <el-form-item label="性别" >
              <span v-if="listQuery.stuSex == 1 && listQuery.stuSex !== ''">男</span>
              <span v-if="listQuery.stuSex == 2 && listQuery.stuSex !== ''">女</span>
             
            </el-form-item>
            <el-form-item label="年龄">
              <span v-if="listQuery.stuAge!==''">{{listQuery.stuAge + '岁'}}</span>
            </el-form-item>
            <el-form-item label="班级" >
               {{listQuery.className}}
            </el-form-item>
            <!-- <el-form-item label="所在学校">
              {{listQuery.schoolName}}
            </el-form-item> -->
             <div class="type_title">
                <div class="line"></div>
                <span style="line-height: 25px;">预约人信息</span>
             </div>
             <el-form-item label="家长" prop="stuRelation">
                <el-select v-model="listQuery.stuRelation" placeholder="请选择" @change="relativeChange">
                  <el-option
                    v-for="item in relativeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
            </el-form-item>
             <el-form-item label="手机号码">
              {{listQuery.mobile}}
            </el-form-item>
            <div class="type_title">
                <div class="line"></div>
                <span style="line-height: 25px;">预约时间</span>
             </div>
             <el-form-item label="日期" prop="meetDate">
               <el-date-picker
                  v-model="listQuery.meetDate"
                  @change="dateChange"
                  type="date"
                  placeholder="选择日期"
                  >
              </el-date-picker>
            </el-form-item>
             <el-form-item label="时间段" prop="meetDateRange">
                 <el-input v-if="listQuery.meetDate" placeholder="请选择时间段" style="width: 220px;"
                  readonly v-model="listQuery.meetDateRange" @click.native="dialogVisible=true"></el-input>
            </el-form-item>
             <div class="type_title">
                <div class="line"></div>
                <span style="line-height: 25px;">预约面询心理问题</span>
             </div>
             <el-form-item label="问题" prop="illnessTypeCode">
              <el-select v-model="listQuery.illnessTypeCode" placeholder="请选择">
                  <el-option
                    v-for="item in illTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
              </el-select>
             </el-form-item>
             <div class="type_title">
                <div class="line"></div>
                <span style="line-height: 25px;">预约面询心理问题程度</span>
             </div>
             <el-form-item label="程度" prop="illnessLevelCode">
               <el-select v-model="listQuery.illnessLevelCode" placeholder="请选择" @change="illnessLevelChange">
                  <el-option
                    v-for="item in illLevelOption"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div style="background: #f2f6fa;">
               {{selectData.remark}}
          </div>
        </div>
        <el-dialog
        title="时间段"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="handleClose">
         <div class="timeList">
           <div class="timeItem" :class="{'isActive': item.isSelect}" v-for="(item, index) in dateRangeList" :key="index" @click="changeSelect(item)">
                {{item.dateRange}} <span style="float: right">{{item.subscribeCount + '/' + item.limitCount}}</span>
           </div>
         </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="confirmChoose">确 定</el-button>
          </span>
        </el-dialog>
    </div>
</template>

<script>
import { findSchoolDicsByCode, queryParent, queryStudent, getUserById } from '@/api/common/common'
import { getDateScheduleByDateRange, insertSubscribe } from '@/api/psychological'
import AddressBook from '@/components/AddressBook/indexExpand';
export default {
    data() {
       var validateStudent = (rule, value, callback) => {
        if (!this.stuAddressData.userJson.length) {
          callback(new Error('请选择学生！'));
        } else {
          callback();
        }
      };
      return {
        createId:'',
        createName: '',
        selectData: '',
        dialogVisible: false,
        rules: {
          checkStudent: [
            {required: true, validator: validateStudent, trigger: 'blur' }
          ],
          stuRelation: [
            {required: true, message: '请选择家长', trigger: 'change' }
          ],
          meetDate: [
            {required: true, message: '请选择日期', trigger: 'blur' }
          ],
          meetDateRange: [
            {required: true, message: '请选择时间段', trigger: 'blur' }
          ],
          illnessTypeCode: [
            {required: true, message: '请选择问题', trigger: 'change' }
          ],
          illnessLevelCode: [
            {required: true, message: '请选择程度', trigger: 'change' }
          ],
        },
        dateRangeList: [],
        stuAddressData: {userJson: []},
        relativeOptions: [],
        illTypeOptions: [],
        illLevelOption: [],
        listQuery: {
          stuSex: '',
          stuAge: '',
          stuId: '',
          stuName: '',
          className: '',
          classId: '',
          gradeId: '',
          gradeName: '',
          // schoolName: '',
          mobile: '',
          stuName: '',
          stuRelation: '',
          meetDate: '',
          meetDateRange: '',
          illnessTypeCode: '', //问题
          illnessLevelCode: '', //程度
          dateScheduleId: '',
          weekDay: ''
        },
        stuConfigData: {
          title: '请选择学生',
          SingleChose: true,
          depart: {target: 'user', departType: 's', userTypes: '2', notCheckSchool: true},
          group: false
        },
      };
    },
    components: {
      AddressBook
    },
    created(){
      this.findSchoolDicsByCode('psychologicalIllnessType',1)
      this.findSchoolDicsByCode('psychologicalIllnessLevel',2)
    },
    watch: {
       'listQuery.meetDate':{
          handler:function(newValue,oldValue){
              if (!newValue) {
                this.dateRangeList = []
              }
          },
          deep:true,
        },
        'listQuery.meetDateRange':{
          handler:function(newValue,oldValue){
             this.$refs['ruleForm'].validateField('meetDateRange')
          },
          deep:true,
        }
    },
    methods: {
      illnessLevelChange(val) {
         this.selectData = this.illLevelOption.find(v => {
            return val == v.value
         })
         
      },
      changeSelect(item) {
        this.dateRangeList.forEach(v => {
          if (v.id == item.id) {
            v.isSelect = !v.isSelect
          } else {
            v.isSelect = false
          }
        })
      },
      // 选择关系
      relativeChange(val) {
        this.listQuery.mobile = this.relativeOptions.find(v => {
          return val == v.value
        }).mobile
        this.createId = this.relativeOptions.find(v => {
          return val == v.value
        }).createId
        this.createName = this.relativeOptions.find(v => {
          return val == v.value
        }).createName
      },
      // 时间改变触发
      dateChange(val) {
        if (val) {
          this.listQuery.meetDateRange = ''
          this.getDateScheduleByDateRange(this.$moment(val).format('YYYY-MM-DD'))
        }
      },
      // 对话框确定
      confirmChoose() {
         this.dialogVisible = false
         let obj = this.dateRangeList.find(v => {
            return v.isSelect
         })
        this.listQuery.dateScheduleId = obj.id
        this.listQuery.meetDateRange = obj.dateRange
        this.listQuery.weekDay = obj.weekDay
      },
      getUserById(id) {
        getUserById({id: id}).then(res => {

        })
      },
      confirmSelect(val) {
        if (val.userJson.length) {
          this.queryStudent(val.userJson[0].id)
          this.queryParent(val.userJson[0].id)
          this.getUserById(val.userJson[0].id)
          this.$refs['ruleForm'].validateField('checkStudent')
        } else {
            this.$nextTick(v => {
                this.listQuery.stuSex = ''
                this.listQuery.stuAge = ''
                this.listQuery.className = ''
                this.listQuery.classId = ''
                this.listQuery.gradeId = ''
                this.listQuery.gradeName = ''
                // this.listQuery.schoolName = ''
                this.$refs['ruleForm'].validateField('checkStudent')
            })
        }
      },
      saveIt() {
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
           this.listQuery.meetDate = this.$moment(this.listQuery.meetDate).format('YYYY-MM-DD')
           this.listQuery.stuSex =  this.listQuery.stuSex == 1 ? '男' : '女'
           let illnessLevel = this.illLevelOption.find(v => {
              return v.value == this.listQuery.illnessLevelCode
            }).label
            let illnessType = this.illTypeOptions.find(v => {
              return v.value == this.listQuery.illnessTypeCode
            }).label
            insertSubscribe({
               ...this.listQuery,
               illnessLevel: illnessLevel,
               illnessLevelRemark:this.selectData.remark,
               illnessType: illnessType,
               parentSubscribe: 0,
               parentId: this.createId,
               parentName: this.createName
            }).then(res => {
                this.$message({
                  type: 'success',
                  message: '保存成功!'
                });  
                this.$router.back()  
            })
          } else {
            
          }
        });
      },
      // 获取预约时间表
      getDateScheduleByDateRange(date) {
          getDateScheduleByDateRange({
            endDate: date,
            startDate: date
          }).then(res => {
              this.dateRangeList =  res.data.data
              this.dateRangeList.forEach(v => {
              this.$set(v, 'isSelect', false) 
            })
          })
      },
      queryStudent(id) {
         queryStudent({
           idsStr: id
         }).then(res => {
            this.listQuery.stuSex = res.data.data[0].gender
            this.listQuery.stuAge = res.data.data[0].age
            this.listQuery.className = res.data.data[0].className
            this.listQuery.classId = res.data.data[0].classId
            this.listQuery.gradeId = res.data.data[0].gradeId
            this.listQuery.gradeName = res.data.data[0].gradeName
            // this.listQuery.schoolName = res.data.data[0].schoolName
            this.listQuery.stuId = res.data.data[0].id
            this.listQuery.stuName = res.data.data[0].name
            if (res.data.data[0].birthDate) {
              this.listQuery.stuAge = new Date().getFullYear() - res.data.data[0].birthDate.slice(0, 4)
            } else {
               this.listQuery.stuAge = 0
            }
         }) 
      },
      // 查询家长信息
      queryParent(id) {
        queryParent({
          childId: id
        }).then(res => {
           this.createId= res.data.data[0].id,
           this.createName = res.data.data[0].name
           this.relativeOptions = res.data.data.map(v => {
             return {
               label: v.nick,
               value: v.nick,
               mobile: v.mobile,
               createId: v.id,
               createName: v.name
             }
           })
        })
      },
      // 字典查询
      findSchoolDicsByCode(key,index) {
          findSchoolDicsByCode({
            dicCode: key,
            schoolId: this.$store.getters.schoolInfo.id
          }).then(res => {
             if (index == 1) {
               this.illTypeOptions = res.data.data.map(v => {
                 return {
                   label: v.value,
                   value: v.code
                 }
               })
             } else {
               this.illLevelOption = res.data.data.map(v => {
                  return {
                   label: v.value,
                   value: v.code,
                   remark: v.remark
                 }
               })
             }
          })
      }
    }
};
</script>

<style scoped lang="scss">
.add-allCon {
  padding-bottom: 80px;
   .header {
    padding-bottom: 10px;
  }
.add_wrap {
   width: 810px;
   margin: 0 auto;
   .el-form-item {
     margin-bottom: 20px !important;
   }
   .type_title {
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      font-size: 16px;
      font-weight: 600;
      line-height: 20px;
      height: 20px;
     .line {
        width: 3px;
        height: 20px;
        background: #409EFF;
        margin-right: 15px
     }
   }
}
.timeList {
  display: flex;
  flex-wrap: wrap;
  padding: 0 20px;
  .timeItem:nth-child(2n) {
    margin-right: 0 !important;
  }
  .isActive {
    background: #409EFF;
    color: #fff
  }
  .timeItem {
     cursor: pointer;
     padding: 0 15px;
     margin-right: 20px ;
     margin-bottom: 20px;
     width: 230px;
     height: 35px;
     line-height: 35px;
    //  text-align: center;
     border: 1px solid #bfcbd9;
     border-radius: 5px;
  }
}
}

</style>
