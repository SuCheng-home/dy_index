<template>
<div class="homeVisitadd"  v-loading="loading">
     <div class="header"> 
         <el-button @click="$router.back()" type="default" size="medium">返回</el-button> 
         <el-button type="primary" size="medium" @click="addHomeVisitBatchs(1)">保存</el-button>  
         <el-button type="primary" size="medium" @click="addHomeVisitBatchs(2)">发布</el-button>   
      </div>
     <div class="body " :style="`height: ${nobottommaxH}px;`">
          <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="140px" class="demo-ruleForm">
            <el-form-item label="家访名称" prop="batchName">
              <el-input type="input" v-model.trim="ruleForm.batchName" placeholder="请输入家访名称" :maxlength="20"></el-input>
            </el-form-item>         
            <el-form-item label="发布范围" prop="addressDataprop">
              <address-book v-model="ruleForm.addressData" :config="teacherConfigData" :isSchoolManager="true"></address-book>
            </el-form-item>
            <el-form-item label="家访方式" prop="myvisitTypes">
              <el-checkbox-group v-model="ruleForm.myvisitTypes">
                <el-checkbox :disabled="item.code==1001"  v-for="item in unitlistone" :key="item.id" :label="item.code" :name="item.code">{{item.value}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="入户时间类型" prop="timeType">
            <el-radio-group v-model="ruleForm.timeType" @change="timeTypefun()">
              <el-radio :label="1">按周次</el-radio>
              <el-radio :label="2">按日期</el-radio>
            </el-radio-group>
            <div class="time-list">
              <div class="top">
                <el-button type="primary" size="mini" @click="timeTypeadd()" plain>+ 添加时间</el-button>
              </div>
              <div class="ul">
                <div class="li" v-for="(item,index) in timelist" :key="index">
                  <el-select v-model="item.week" size="small"  v-if="ruleForm.timeType==1">
                    <el-option   v-for="item in weeklist"  size="small" :key="item.week"  :label="item.name" :value="item.week"></el-option>
                  </el-select>
                  <el-date-picker v-if="ruleForm.timeType==2" v-model="item.date" :editable="false" :clearable="false" size="small"  type="date" placeholder="选择日期"></el-date-picker>
                  <el-time-picker  is-range v-model="item.time" :editable="false"  :clearable="false" size="small" format="HH:mm" range-separator="-" start-placeholder="开始时间"  end-placeholder="结束时间" placeholder="选择时间范围"></el-time-picker>
                  <i class="el-icon-remove-outline" @click="deletefun(index)"></i>
                </div>
              </div>
            </div>
          </el-form-item>
            <el-form-item label="家访采集字段" prop="visitFields">
              <el-checkbox-group v-model="ruleForm.visitFields">
                <el-checkbox   v-for="item in unitlisttwo" :key="item.id" :label="item.code" :name="item.code">{{item.value}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>            
            <el-form-item label="前调截止时间" prop="tuneEndTime">
              <el-date-picker :editable="false"  :clearable="false" v-model.trim="ruleForm.tuneEndTime" type="datetime" placeholder="请选择前调截止时间" format="yyyy-MM-dd HH:mm" />
              （如果已完成前调，则不提醒家长）
            </el-form-item>
            <el-form-item class="new-editor" label="发布内容" prop="content">
                        <ueditor  class="rich-editor new-editor" ref="ueditor" :defaultMes="ruleForm.content"
                                 @editModel="richTextEditHandler"></ueditor>
             </el-form-item>
      </el-form>
     </div>
</div> 
</template>
<script>
import mixin from "@/mixins/windowResize";
import moment from "moment";
import AddressBook from "@/components/AddressBook/indexExpand";
import { listValue,addHomeVisitBatch} from "@/api/homeVisit";
import Ueditor from "@/components/Ueditor";
export default {
  components: { AddressBook, Ueditor },
  data() {
    const addressDatapropfun = (rule, value, callback) => {
      if (this.ruleForm.addressData.departJson.length) {
        return callback();
      } else {
        return callback(new Error("请选择发布范围"));
      }
    };
    return {
      teacherConfigData: {
        title: "发布范围",
        depart: { target: "depart", departType: "s", userTypes: "2" },
        group: false
      },
      ruleForm: {
        batchName: "",
        addressData: { departJson: [], groupJson: [], userJson: [] },
        visitTypes: [],
        myvisitTypes:['1001'],
        tuneEndTime: "",
        visitFields: [],
        content: "",
        timeType:1,
        visitTimes:[],
        state:1,
        sendScopes:[]
      },
      rules: {
        batchName: [
          { required: true, message: "请输入家访名称", trigger: "blur" }
        ],
        addressDataprop: [
          { validator: addressDatapropfun, trigger: "change", required: true }
        ],
        myvisitTypes: [
          {
            type: "array",
            required: true,
            message: "请至少选择一个家访方式",
            trigger: "change"
          }
        ],
        visitFields: [
          {
            type: "array",
            required: true,
            message: "请至少选择一个家访采集字段",
            trigger: "change"
          }
        ],
        tuneEndTime: [
          { required: true, message: "请选择前调截止时间", trigger: "change" }
        ],
        content: [
          { required: true, message: "发布内容不能为空", trigger: "change" }
        ],
        timeType:[ {required: true, message: "请选择入户时间类型", trigger: "change" }]
        
      },
      unitlistone: [],
      unitlisttwo: [],
      timelist:[],
      weeklist:[{name:'周一',week:1},{name:'周二',week:2},{name:'周三',week:3},{name:'周四',week:4},{name:'周五',week:5},{name:'周六',week:6},{name:'周日',week:7}],
      loading:false,
    };
  },
  mixins: [mixin],
  created() {
    this.listValues();
  },
  methods: {
    timeTypefun(){
      this.timelist=[];
    },
    deletefun(index){
       this.timelist.splice(index,1);
    },
    timeTypeadd(){
      this.timelist.push({
        week:1,starttime:"",date:'',num:"",name:"",endtime:"",time:[new Date(2016, 9, 10, 15, 30), new Date(2016, 9, 10, 20, 30)]
      })
    },
    listValues() {
      listValue("homeVisitType")
        .then(res => res.data)
        .then(data => {
          this.unitlistone = data.data.dataList;
        });
      listValue("homeVisitFields")
        .then(res => res.data)
        .then(data => {
          this.unitlisttwo = data.data.dataList;
        });
    },
    richTextEditHandler(content) {
      this.ruleForm.content = content;
    },
    addHomeVisitBatchs(state) {  
      this.ruleForm.state=state ;
      this.$refs.ruleForm.validate(valid => {        
        if (valid) {
          this.ruleForm.visitTypes=[];         
            for(let j=0;j<this.unitlistone.length;j++){
               for(let i=0;i<this.ruleForm.myvisitTypes.length;i++){
              if(this.ruleForm.myvisitTypes[i]==this.unitlistone[j].code){
                this.ruleForm.visitTypes.push({
                  name:this.unitlistone[j].value,
                  id:this.unitlistone[j].code,
                  sort:this.unitlistone[j].sort,
                })
              }
            }
          }
          this.ruleForm.sendScopes=this.ruleForm.addressData.departJson;
         if(this.timelist.length==0){
             this.$message({
                message: '请添加时间！',
                type: 'warning'
              });
            return;
          }
          this.ruleForm.visitTimes=[]
          for(let i=0;i<this.timelist.length;i++){
            if((this.timelist[i].date)|| (this.ruleForm.timeType==1)){
             this.ruleForm.visitTimes.push({
                week:this.timelist[i].week,
                num:i+1,
                endtime:moment(this.timelist[i].time[1]).format('HH:mm'),
                starttime:moment(this.timelist[i].time[0]).format('HH:mm'),
                date:this.timelist[i].date?moment(this.timelist[i].date).format('YYYY-MM-DD'):'',
                name:this.ruleForm.timeType==1?this.weeklist[this.timelist[i].week-1].name+"  "+moment(this.timelist[i].time[0]).format('HH:mm')+"~"+moment(this.timelist[i].time[1]).format('HH:mm'):moment(this.timelist[i].date).format('YYYY-MM-DD')+"  "+moment(this.timelist[i].time[0]).format('HH:mm')+"~"+moment(this.timelist[i].time[1]).format('HH:mm')
              })
            }else{
                this.$message({
                message: '时间日期不能为空！',
                type: 'warning'
              });
              return;
            }              
          }
          this.loading=true;         
          this.ruleForm.tuneEndTime=moment(this.ruleForm.tuneEndTime).format('YYYY-MM-DD HH:mm')
           addHomeVisitBatch(this.ruleForm).then(res => res.data).then(data => {
                                    if(data.result) {
                                        this.$message({
                                            message: '操作成功！',
                                            type: 'success',
                                            duration: 1000
                                        });
                                        this.loading=false;
                                        this.$router.back();
                }
            }).catch(() => {})
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.homeVisitadd {
  padding:12px;
  .header {
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
  }
  .body {
    overflow: auto;
    .demo-ruleForm {
      width: 810px;
      margin: 20px auto;
      .ul{
        .li{
          i{
            font-size: 22px;
            margin: 5px;
            color: #F56C6C;
          }
        }
      }
    }
  }
}
</style>