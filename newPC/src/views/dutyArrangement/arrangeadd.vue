<template>
  <div class="arrangeadd">
    <div class="header">
      <el-button size="medium" @click.native="goBack">返回</el-button>
      <el-button type="primary" size="medium" @click.native="addWatchStationInit">保存</el-button>
    </div>

    <div class="body" :style="`height: ${maxH-0+60}px;`">
        <div class="bodybox">
              <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position="right" label-width="140px">
                <el-form-item label="岗位名称" prop="stationId">
                    <el-select size="medium" :disabled="ruleForm.stationInitId" v-model="ruleForm.stationId" placeholder="请选择岗位名称" >
                        <el-option v-for="item in gangweiList" :key="item.id" :label="item.title" :value="item.id"></el-option>
                    </el-select>
                </el-form-item> 
                <el-form-item label="值班日期" class="is-required" v-if="ruleForm.watchType==2">
                    <el-date-picker
                        size="medium"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        v-model="ruleForm.watchDate"
                         :clearable="false"
                        align="right"
                        :disabled="ruleForm.stationInitId"
                        type="date"
                        placeholder="选择日期"
                    >
                    </el-date-picker>
                   </el-form-item>  
                <el-form-item label="值班周次" prop="weekNumber"  v-if="ruleForm.watchType==1">
                 <el-select size="medium" :disabled="ruleForm.stationInitId" v-model="ruleForm.weekNumber" placeholder="请选择值班周次" >
                        <el-option v-for="(item,index) in dayMapping" v-if="item" :key="index" :label="item" :value="index"></el-option>
                    </el-select>
                </el-form-item> 
                 <el-form-item label="值班教师" class="is-required">
                    <address-book v-model="addressData" :config="configData" ref="address"></address-book>
                </el-form-item>
                <el-form-item label="值班时段" class="is-required" >
                  <el-time-picker v-model="dateRange"  is-range format="HH:mm" type="daterange"  range-separator="-" :clearable="false"  size="medium"  start-placeholder="开始时间" end-placeholder="结束时间"  placeholder="选择时间范围"></el-time-picker>
                </el-form-item>  
                 <el-form-item label="课时计算" prop="classHourCount">
                <el-input-number v-model.trim="ruleForm.classHourCount" :precision="1"  :min="0" :max="10"></el-input-number>
                </el-form-item>
                
            </el-form>
        </div>
    </div>
  </div>
</template>

<script>
  import mixins from '@/mixins/windowResize';
  import AddressBook from '@/components/AddressBook/indexExpand';
  import {addWatchStationInit,getWatchStationInit,uddateWatchStationInit,getWatchGroupStationList} from '@/api/dutyArrangement';
  import {findDicsByCode} from '@/api/common/common';
  export default {
    name: 'guideGroupAdd',
    components: {
      AddressBook
    },
    data() {
      return {
        listLoading: false,
        groupId: this.$route.query.groupId,
        ruleForm: {
            groupId: this.$route.query.groupId,//	值班组id	number	
            stationInitId: this.$route.query.id,
            classHourCount:0,//	课时数量	string	
            endTime:'',//	名称	结束日期	string	            
            startTime:'',//		开始期间	string	
            stationId:'',//		岗位id	number	
            teacherJson:'',//		值班老师json	string	
            teacherUserIds:'',//		值班老师ids	string	
            teacherUserNames:'',//		值班老师姓名	string	
            watchDate:new Date(),//		值班日期	string	
            watchType:this.$route.query.watchType,//		值班方式 1 按周 2 按日期	number	
            weekNamer:'',//		周几名称	string	
            weekNumber:'',//		星期几序号	number	
        },
        dayMapping:['', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六','星期日'],
        dateRange: [new Date('2011-11-11 06:00'), new Date('2011-11-11 08:00')],
        rules: {
          stationId:[{ required: true, message: '请选择岗位名称', trigger: 'change' }],
          classHourCount: [
                        {required: true, message: '请输入课时！', trigger: 'blur'}
                    ],
           weekNumber:[{ required: true, message: '请选周次', trigger: 'change' }],
        },
        configData: {title: '请选择值班教师', depart: {target: 'user', departType: 't', userTypes: '1'}},
        addressData: {},
        gangweiList:[]
      }     
    },
    mixins: [mixins],
    created() {
        if(this.$route.query.id){
            this.getWatchStationInit()
        }
        getWatchGroupStationList(this.$route.query.groupId)
                    .then(res => res.data)
                    .then(data => {
                        if (data.code === 200) {
                           this.gangweiList = data.data                           
                        }
                    })
    },
    methods: {
      goBack() {
        this.$router.back();
      },
      getWatchStationInit() {
        getWatchStationInit(this.$route.query.id).then(res => {
          const data = res.data.data;
          if (res.data.code === 200) {
            this.addressData = {userJson:JSON.parse(data.teacherJson)};
            this.ruleForm.classHourCount = data.classHourCount;
            this.ruleForm.stationId = data.stationId;
            this.ruleForm.watchDate = data.watchDate;
            this.ruleForm.weekNumber = data.weekNumber;
            this.dateRange=[new Date('2011-11-11 '+data.startTime), new Date('2011-11-11 '+data.endTime)]
          }
        })
      },
      addWatchStationInit() {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            if ((!this.addressData.userJson || !this.addressData.userJson.length)) {
              this.$message({
                message: '请选择值班教师!',
                type: 'warning'
              });
              return;
            }
            let query = {
                groupId: this.ruleForm.groupId,//	值班组id	number	
                classHourCount:this.ruleForm.classHourCount,//	课时数量	string	
                endTime:this.$moment(this.dateRange[1]).format("HH:ss"),//	名称	结束日期	string	            
                startTime:this.$moment(this.dateRange[0]).format("HH:ss"),//		开始期间	string	
                stationId:this.ruleForm.stationId,//		岗位id	number	
                teacherJson:this.addressData.userJson,//		值班老师json	string	
                teacherUserIds:this.addressData.userJson.map(user => user.id).join(' , '),//		值班老师ids	string	
                teacherUserNames:this.addressData.userJson.map(user => user.name).join(' , '),//		值班老师姓名	string	
                watchType:this.ruleForm.watchType,//		值班方式 1 按周 2 按日期	number	
            };
            if(this.ruleForm.watchType==1){
              query.weekNamer=this.dayMapping[this.ruleForm.weekNumber]
              query.weekNumber=this.ruleForm.weekNumber
            }else{
                query.watchDate=this.$moment(this.ruleForm.watchDate).format("YYYY-MM-DD")
            }
            if(this.$route.query.id){
              query.id=this.$route.query.id
              uddateWatchStationInit(query).then(res => {
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
               addWatchStationInit(query).then(res => {
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
  .arrangeadd {
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
