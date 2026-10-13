<template>
  <div class="dutyArrangementadd">
    <div class="header">
      <el-button size="medium" @click.native="goBack">返回</el-button>
      <el-button type="primary" size="medium" @click.native="addWatchGroup">保存</el-button>
    </div>

    <div class="body" :style="`height: ${maxH-0+60}px;`">
        <div class="bodybox">
              <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position="right" label-width="140px">
                <el-form-item label="值班组名称" prop="title">
                <el-input v-model.trim="ruleForm.title" :maxlength="30" placeholder="请输入组名称(1-30个字符)"></el-input>
                </el-form-item>
                <el-form-item label="提醒人员设置">
                      <el-checkbox v-model="ruleForm.isRemindWacthTh" :true-label="2" :false-label="1">提醒值班人员</el-checkbox>
                      <el-checkbox v-model="ruleForm.isRemindElse" :true-label="2" :false-label="1">提醒其它人员</el-checkbox>
                </el-form-item>
                <el-form-item label="提醒时间" class="is-required" v-if="ruleForm.isRemindElse==2||ruleForm.isRemindWacthTh==2">
                    <el-time-select :clearable="false" :editable="false"   v-model="ruleForm.remindTime" size="medium" :picker-options="{  start: '06:00',  step: '00:05',    end: '21:00'   }" placeholder="选择时间"></el-time-select>
                </el-form-item>
                <el-form-item v-if="ruleForm.isRemindElse==2">
                <div slot="label"><span style="color: #f00;">*</span>其他提醒人员</div>
                <address-book v-model="addressData" :config="configData" ref="address"></address-book>
                </el-form-item>
                <el-form-item label="提醒内容" prop="remindWatchThText" v-if="ruleForm.isRemindWacthTh==2">
                    <el-input type="textarea" :rows="3" v-model.trim="ruleForm.remindWatchThText"
                              placeholder="请输入提醒内容" :maxlength="200"></el-input>
                </el-form-item>
                <el-form-item label="其他人员提醒内容" prop="remindElseText" v-if="ruleForm.isRemindElse==2">
                    <el-input type="textarea" :rows="3" v-model.trim="ruleForm.remindElseText" placeholder="请输入其他人员提醒内容" :maxlength="200"></el-input>
                    <div style="color:red">{0} 是插入提醒人员姓名</div>
                </el-form-item>                
                <el-form-item label="值班方式" class="is-required" >
                     <el-radio-group v-model="ruleForm.watchType" :disabled="groupId">
                      <el-radio :label="2">按照日期</el-radio>
                      <el-radio :label="1">按照周次</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="值班时段" class="is-required" v-if="ruleForm.watchType==1">
                  <el-date-picker v-model="dateRange" type="daterange"  range-separator="-" :clearable="false"  size="medium" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                </el-form-item>  
                <el-form-item label="是否签到" class="is-required" >
                     <el-radio-group v-model="ruleForm.isSign">
                      <el-radio :label="1">否</el-radio>
                      <el-radio :label="2">是</el-radio>
                    </el-radio-group>
                </el-form-item>   
                <el-form-item label="签到方式" class="is-required" v-if="ruleForm.isSign==2">
                     <el-radio-group v-model="ruleForm.signType">
                      <el-radio :label="1">扫码签到</el-radio>
                      <el-radio :label="2">选择签到单</el-radio>
                    </el-radio-group>
                </el-form-item>  
                <el-form-item label="签到单" prop="signSheetCode" v-if="ruleForm.signType==2">
                  <el-select size="medium" v-model="ruleForm.signSheetCode" placeholder="请选择签到单" >
                        <el-option v-for="item in typelist" :key="item.code" :label="item.value" :value="item.code"></el-option>
                </el-select>
            </el-form-item>      
            </el-form>
        </div>
    </div>
  </div>
</template>

<script>
  import mixins from '@/mixins/windowResize';
  import AddressBook from '@/components/AddressBook/indexExpand';
  import {addWatchGroup,getWatchGroup,updateWatchGroup} from '@/api/dutyArrangement';
  import {findDicsByCode} from '@/api/common/common';
  export default {
    name: 'guideGroupAdd',
    components: {
      AddressBook
    },
    data() {
      return {
        listLoading: false,
        groupId: this.$route.query.groupId || 0,
        ruleForm: {
          title:'',//	名称	string  
          isRemindElse:1,//	提醒其它人员 1 不提醒 2 提醒	number	
          isRemindWacthTh:1,//	提醒值班人员 1不提醒 2 提醒	number	          
          elseJson:'',//	其它人员json	string	
          remindTime:'06:00',//	提醒时间	string	
          remindElseText:'今天由{0}进行值班，请知悉!',//	其它人员提醒内容	string
          remindWatchThText:'您好，请您于6:30准时到，请勿迟到!',//	值班人员提醒内容	string
          watchType:2,//	值班方式 1 按周 2 按日期	number
          endDate:'',//	结束日期	string
          startDate:'',//	开始日期	string	
          isSign:1,//	是否签到 1 否 2 签到	number	          	
          signSheetCode:'',//	签到单code	string	
          signSheetName:'',//	签到单名称	string	
          signType:1,//	1 扫码 2 签到单	number          
        },
        dateRange: [new Date(), new Date()],
        rules: {
          title: [
            {required: true, message: '请输入值班组名称', trigger: 'blur'},
            {min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur'}
          ],
          remindElseText: [
            {required: true, message: '请输入其它人员提醒内容', trigger: 'blur'},
          ],
          remindWatchThText: [
            {required: true, message: '请输入值班人员提醒内容', trigger: 'blur'},
          ],
          signSheetCode:[{ required: true, message: '请选签到单', trigger: 'change' }],
        },
        configData: {title: '请选择其他提醒人员', depart: {target: 'user', departType: 't', userTypes: '1'}},
        addressData: {},
        typelist:[]
      }     
    },
    mixins: [mixins],
    created() {
      if (this.groupId) {
        this.getWatchGroup();
      }
       findDicsByCode({
                dicCode: 'signSheet'
            })
                .then(res => res.data)
                .then(data => {
                    this.typelist = data.data;
                })
    },
    methods: {
      goBack() {
        this.$router.back();
      },
      getWatchGroup() {
        getWatchGroup(this.groupId).then(res => {
          const data = res.data.data;
          if (res.data.code === 200) {
            this.ruleForm.title = data.title;
            this.ruleForm.isRemindElse = data.isRemindElse;
            this.ruleForm.isRemindWacthTh = data.isRemindWacthTh;
            this.addressData = {userJson:JSON.parse(data.elseJson)};
            if(data.remindTime){
              this.ruleForm.remindTime=data.remindTime
            }
            this.ruleForm.remindElseText = data.remindElseText;
            this.ruleForm.remindWatchThText = data.remindWatchThText;
            this.ruleForm.watchType = data.watchType;
            this.ruleForm.isSign = data.isSign;
            this.ruleForm.signSheetCode = data.signSheetCode;
            this.ruleForm.signType = data.signType;
            if(data.startDate){
              this.dateRange=[new Date(data.startDate), new Date(data.endDate)]
            }
          }
        })
      },
      addWatchGroup() {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            if ((!this.addressData.userJson || !this.addressData.userJson.length)&&this.ruleForm.isRemindElse==2) {
              this.$message({
                message: '请选择其他提醒人员!',
                type: 'warning'
              });
              return;
            }
            let query = {
              title: this.ruleForm.title,//	名称	string  
              isRemindElse:this.ruleForm.isRemindElse,//	提醒其它人员 1 不提醒 2 提醒	number	
              isRemindWacthTh:this.ruleForm.isRemindWacthTh,//	提醒值班人员 1不提醒 2 提醒	number	          
              elseJson:this.ruleForm.isRemindElse==2?this.addressData.userJson:[],//	其它人员json	string	
              remindTime:(this.ruleForm.isRemindElse==2||this.ruleForm.isRemindWacthTh==2)?this.ruleForm.remindTime:'',//	提醒时间	string	
              remindElseText:this.ruleForm.isRemindElse==2?this.ruleForm.remindElseText:'',//	其它人员提醒内容	string
              remindWatchThText:this.ruleForm.isRemindWacthTh==2?this.ruleForm.remindWatchThText:'',//	值班人员提醒内容	string
              watchType:this.ruleForm.watchType,//	值班方式 1 按周 2 按日期	number              
              isSign:this.ruleForm.isSign,//	是否签到 1 否 2 签到	number	          	
              signSheetCode:this.ruleForm.signType==2?this.ruleForm.signSheetCode:'',//	签到单code	string	
              signSheetName:'',//	签到单名称	string	
              signType:this.ruleForm.isSign==1?1:this.ruleForm.signType,//	1 扫码 2 签到单	number
            };
            if(this.ruleForm.watchType){
              query.endDate=this.$moment(this.dateRange[1]).format("YYYY-MM-DD")
              query.startDate=this.$moment(this.dateRange[0]).format("YYYY-MM-DD")
            }
            if(query.signSheetCode){
              for(let i=0;i<this.typelist.length;i++){
                if(query.signSheetCode==this.typelist[i].code){
                  query.signSheetName=this.typelist[i].value
                }
              }
            }
            if(this.groupId){
              query.id=this.groupId
              updateWatchGroup(query).then(res => {
              if (res.data.code === 200 && res.data.result) {
                this.$message.success('保存成功');
                this.listLoading = false;
                this.goBack();
              } else {
                this.$message.warning(res.data.msg);
                this.listLoading = false;
              }
            })
            }else{
               addWatchGroup(query).then(res => {
              if (res.data.code === 200 && res.data.result) {
                this.$message.success('保存成功');
                this.listLoading = false;
                this.goBack();
              } else {
                this.$message.warning(res.data.msg);
                this.listLoading = false;
              }
            })

            }
           
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped="scoped">
  .dutyArrangementadd {
    padding:12px;
    .header {
      padding-bottom: 10px;
      border-bottom: 1px solid #eee;
    }
    .body{
        overflow: auto;
        .bodybox {
            width: 810px;
            margin: 20px auto;
        }        
    }
   
  }
</style>
