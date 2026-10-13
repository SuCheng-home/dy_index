<template>
  <div  class="planAdd" style="padding:12px;">  
     <backtool>
            <el-button type="primary" size="medium"  @click="updateWorkPlans('ruleForm',1)">保存草稿</el-button> 
            <el-button type="primary" size="medium"  @click="updateWorkPlans('ruleForm',2)">上报</el-button>  
        </backtool> 
    <div class="subject" :style="`height: ${nobottommaxH}px;`"> 
      <div class="body">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="140px" class="demo-ruleForm">  
        <el-form-item label="工作计划时间范围" prop="dateRange">
                    <el-date-picker
                        v-model="ruleForm.startDate"
                        forma="yyyy-MM-dd"
                        type="date"
                        placeholder="开始日期"
                    >
                    </el-date-picker>至
                    <el-date-picker
                        v-model="ruleForm.endDate"
                        forma="yyyy-MM-dd"
                        type="date"
                        placeholder="结束日期"
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="部门" prop="departId">
                  <el-select v-model="ruleForm.departId" placeholder="请选择部门">
                    <el-option :label="item.name" :value="item.id" :key="index"  v-for="(item,index) in departmentlist"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="工作计划明细">
                    <i class="el-icon-plus my-el-icon-plus" title="添加计划" @click="rangadd()"></i>
                     <div class="boxli"  :key="index"  v-for="(item,index) in dataList" >
                          <span class="title">计划{{index+1}}</span>
                          <div class="content">
                               <el-input  type="textarea" :rows="4" placeholder="请输入计划内容"  :maxlength="200"  v-model.trim="item.planContent"> </el-input>
                          </div>
                          <div class="responsibility">
                              <address-book v-model="item.teacherNameData" :config="teacherConfigData"></address-book>
                          </div>
                          
                          <i class="el-icon-delete" title="删除计划" @click="rangedelete(index)" v-if="index!=0" ></i>
                      </div>
                </el-form-item>
         
        </el-form>
        </div> 
      
    </div>
  
  </div>
</template>
<script>
import mixin from '@/mixins/windowResize';
 import Backtool from '@/components/BackTool';
import moment from "moment";
import AddressBook from '@/components/AddressBook/indexExpand';
import {
  queryDepartByUserId,
  updateWorkPlan,
  getWorkPlan,
  getDepartListByUserId,
  getDepartListByOtherManId
} from "@/api/workPlan";
export default {
  name: "dataAnalysis",
  components: {
    AddressBook,
     Backtool
  },
  data() {
    const daterangeValidator = (rule, value, callback) => {
   
      if(!this.ruleForm.startDate || !this.ruleForm.endDate) {
                    callback(new Error('工作计划时间范围不能为空！'));
                }else {
                    callback();
                }     
    };
    return {
      teacherConfigData: {
        title: "责任人",
        depart: { target: "user", departType: "t", userTypes: "1" },
        group: false,
        SingleChose: true
      },
      ruleForm: {
        batchId:this.$route.query.id,
        startDate: "",
        endDate: "",
        departId: "",
        departName: "",
        state: "1",
        workPlanDetailModelList:[]       
      },
       dataList: [],//计划数组
      departmentlist: [],//部门
      rules: {
        dateRange: [
          {
            required: true,
            trigger: "blur",
            validator:daterangeValidator}
        ],
        departId: [
          {
            type: "number",
            required: true,
            message: "请选择活动部门",
            trigger: "change"
          }
        ]
      }
    };
  },
  mixins: [mixin],
  created() {    
    //获取部门
   getDepartListByUserId()
      .then(res => {
         if(res.data.data!=null){
           this.departmentlist =res.data.data ;
        }
      getDepartListByOtherManId()
      .then(res => {
         if(res.data.data!=null){
            for(let i=0;i<res.data.data.length;i++){
          this.departmentlist.push(res.data.data[i])
        }
        }; 
         getWorkPlan(this.ruleForm.batchId)
            .then(res => {
              this.ruleForm.startDate=res.data.data.startDate;
              this.ruleForm.endDate=res.data.data.endDate;
              this.ruleForm.departId=res.data.data.workPlanDetailModelList[0].departId;
              for(let i=0;i<res.data.data.workPlanDetailModelList.length;i++){
                var obj ={
                      planContent:res.data.data.workPlanDetailModelList[i].planContent,
                      teacherNameData: {
                      userJson: [{
                                dataType: "user",
                                avatar: res.data.data.workPlanDetailModelList[i].avatar,
                                id: res.data.data.workPlanDetailModelList[i].dutyUserId,
                                name: res.data.data.workPlanDetailModelList[i].dutyUserName}
                      ]
                    }
                };
                this.dataList.push(obj)
              }
              
            }) .catch(err => {});  
      })
      .catch(err => {});
      })
      .catch(err => {});
   
  },
  methods: {
    //新建
    rangadd() {
      this.dataList.push({
        planContent: "",
        teacherNameData: {
          userJson: []
        }
      });
    },
    //删除
    rangedelete(index) {
      this.dataList.splice(index, 1);
    },
    //上报草稿
    updateWorkPlans(ruleForm,num){
       let timeone = new Date(moment(this.ruleForm.startDate).format("YYYY/MM/DD")).getTime();
        let timetwo = new Date(moment(this.ruleForm.endDate).format("YYYY/MM/DD")).getTime();
         if(timeone>timetwo) {
           this.$message.error('工作计划时间范围开始日期必须小于结束日期！');
           return
      }  
        this.$refs[ruleForm].validate((valid) =>  {
                    if (valid) {
                       this.ruleForm.state=num;
                       this.ruleForm.startDate=this.$moment(this.ruleForm.startDate).format('YYYY-MM-DD');//时间
                       this.ruleForm.endDate=this.$moment(this.ruleForm.endDate).format('YYYY-MM-DD');//时间
                      //获取部门名称
                      for(let i=0; i<this.departmentlist.length;i++){
                           if(this.departmentlist[i].id==this.ruleForm.departId){
                              this.ruleForm.departName=this.departmentlist[i].name;
                           }
                      };
                      //拼装计划
                      this.ruleForm.workPlanDetailModelList=[];
                      for(let i=0; i<this.dataList.length;i++){
                          if(this.dataList[i].planContent==''){
                            this.$message.error('计划'+(i+1)+'内容不能为空！');
                            this.dataList[i].planContent='';
                            return;
                          };
                          if(this.dataList[i].teacherNameData.userJson.length===0){
                            this.$message.error('请选择计划'+(i+1)+'负责人！');
                            return;
                          };
                          let num=i+1;
                           let obj={
                            id: this.dataList[i].teacherNameData.userJson[0].id,
                            loginname: this.dataList[i].teacherNameData.userJson[0].loginname,
                            mobile:this.dataList[i].teacherNameData.userJson[0].mobile,
                            name: this.dataList[i].teacherNameData.userJson[0].name,
                            avatar: this.dataList[i].teacherNameData.userJson[0].avatar
                          };
                         this.ruleForm.workPlanDetailModelList.push({
                          departId:this.ruleForm.departId,
                          departName:this.ruleForm.departName,
                          planContent:this.dataList[i].planContent,
                          sortNo:num,
                          dutyUserJson:obj
                         }) 
                      };
                      updateWorkPlan(this.ruleForm)
                      .then(res => {
                          if(res.data.code==200){
                                 this.$message({
                                  message: "操作成功！",
                                  type: "success",
                                  duration: 1000
                                });
                                this.$router.back();
                          }else{
                             this.$message.error(res.data.msg);
                          }
                      })
                      .catch(err => {});
                       
                    }
                });
    }
  }
};
</script>
<style scoped>
.top {
  border-bottom: 1px solid #e7eaec;
  padding-bottom: 10px;
}
.body{
  width: 810px;
  margin: 0 auto;
}
.subject {
  padding-top: 10px;
  overflow: auto;
}
.my-el-icon-plus {
  border: 2px #ccc solid;
  padding: 3px;
  font-size: 18px;
  border-radius: 50%;
  color: #8492a6;
  display: inline-block;
  cursor: pointer;
}
.my-el-icon-plus:hover {
  border: 2px #20a0ff solid;
  padding: 3px;
  font-size: 18px;
  border-radius: 50%;
  color: #20a0ff;
}
.boxli {
  overflow: hidden;
  margin: 0 0 20px 0;
  padding: 10px;
  border: 1px #eee solid;
  width: 660px;
  border-radius: 5px;
}
.boxli .title {
  float: left;
  width: 50px;
}
.boxli .content {
  float: left;
  width: 400px;
  margin-right: 20px;
}
.boxli .responsibility {
  float: left;
  width: 120px;
  margin-right: 20px;
}
.boxli i {
  color: #8492a6;
  font-size: 22px;
  display: inline-block;
  cursor: pointer;
}
.boxli i:hover {
  color: red;
}
.planAdd .el-date-editor.el-input {
    width: 320px;
}
.planAdd .el-select{
  width: 660px;
}
</style>
