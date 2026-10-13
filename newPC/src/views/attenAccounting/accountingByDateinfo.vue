<template>
    <div class="eatSettingclasslist">  
        <div class="top">  
                 <el-button  @click="$router.back()" type="default" size="medium">返回</el-button>
                 <el-date-picker
                        size="medium"
                        @change="getTeacherRecordListByDate"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        v-model="searchDate"
                        type="date"
                        :clearable="false"
                        placeholder="选择日期"
                    ></el-date-picker>
                <el-button type="primary" size="medium"  @click="exportExcel('#outTable', `出勤明细.xlsx`)"   v-if="datalist.length>0">导出</el-button>
               <el-input  size="medium"  style="width:20%;float: right;" placeholder="请输入老师姓名" v-model.trim="searchName" @change="getTeacherRecordListByDate">
            <el-button slot="append" icon="el-icon-search" @click="getTeacherRecordListByDate"></el-button>
       </el-input>
        </div>
         <div  id="outTable" >
            <el-table :data="datalist" border style="width: 100%" ref="print">
                  <el-table-column align="center"  label="姓名">
                    <template slot-scope="scope">
                        <span>{{scope.row.userName}}</span>
                    </template>
                 </el-table-column>
                <el-table-column align="center"  label="所在部门">
                    <template slot-scope="scope">
                        <span>{{scope.row.userDepartNames}}</span>
                    </template>
                 </el-table-column>
                  <el-table-column align="center"  label="日期">
                    <template slot-scope="scope">
                        <span>{{scope.row.todayDate}}</span>
                    </template>
                 </el-table-column>
                   <el-table-column align="center"  label="签到时间">
                    <template slot-scope="scope">
                         {{scope.row.userSignInDate?scope.row.userSignInDate.slice(11, 16):'----'}}                   
                    </template>
                 </el-table-column>
                  <el-table-column align="center"  label="签到状态">
                    <template slot-scope="scope">
                        <span v-if="scope.row.haveAttendanceRecord==1">----</span>
                        <span v-else>
                          <span v-if="scope.row.markSignIn==0">
                            <span v-if="scope.row.signInState==0"><el-tag type="danger" size="mini">未签</el-tag></span>
                            <span v-if="scope.row.signInState==1"><el-tag type="success" size="mini">正常</el-tag></span>
                            <span v-if="scope.row.signInState==2"><el-tag type="warning" size="mini">迟到</el-tag></span>
                            <span v-if="scope.row.signInState==3">
                                <el-tag type="info" v-if="scope.row.signInRemark&&scope.row.signInRemark.split(',')[0]==6" size="mini">外出</el-tag>
                                <el-tag type="info" v-else size="mini">请假</el-tag>
                            </span>
                        </span>
                         <span v-if="scope.row.markSignIn==1">
                             <el-tag  size="mini">补卡</el-tag>
                        </span>
                        </span>                       
                    </template>
                 </el-table-column>
                 <el-table-column align="center"  label="签退时间"  show-overflow-tooltip>
                      <template slot-scope="scope">
                          {{scope.row.userSignOutDate?scope.row.userSignOutDate.slice(11, 16):'----'}}                    
                    </template>
                 </el-table-column>
                 <el-table-column align="center"  label="签退状态"  show-overflow-tooltip>
                      <template slot-scope="scope">
                          <span v-if="scope.row.haveAttendanceRecord==1">----</span>
                          <span  v-else-if="scope.row.signOut==0">----</span>
                          <span v-else>
                           <span v-if="scope.row.markSignOut==0">
                                <span v-if="scope.row.signOutState==0"><el-tag type="danger" size="mini">未签</el-tag></span>
                                <span v-if="scope.row.signOutState==1"><el-tag type="success" size="mini">正常</el-tag></span>
                                <span v-if="scope.row.signOutState==2"><el-tag type="warning" size="mini">早退</el-tag></span>
                                <span v-if="scope.row.signOutState==3">
                                      <el-tag type="info" v-if="scope.row.signOutRemark&&scope.row.signOutRemark.split(',')[0]==6" size="mini">外出</el-tag>
                                      <el-tag type="info" v-else size="mini">请假</el-tag>
                                </span>
                        </span>
                         <span v-if="scope.row.markSignOut==1">
                             <el-tag  size="mini">补卡</el-tag>
                        </span>
                        </span>                      
                    </template>
                 </el-table-column>
                  <el-table-column align="center"  label="加班"  show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if="scope.row.workDayTime">{{scope.row.workDayTime}}天</span><span v-if="scope.row.workTime">{{scope.row.workTime}}小时</span>
                    </template>
                 </el-table-column>
             </el-table>            
        </div> 
      
    </div>
</template>
<script>
    import windowResize from "@/mixins/windowResize";
    import baseMixin from '@/mixins/baseMixin';
    import {getTeacherRecordListByDate} from '@/api/schoolManage/teacherAttendanceStatistics';
    export default {
        data() {
            return {
               datalist:[],
               searchName:'',
               searchDate:moment().format('YYYY-MM-DD')
            }
        },
        mixins: [windowResize,baseMixin],       
        created() {
            this.getTeacherRecordListByDate()
        },
        methods: {
              //获取详情
             getTeacherRecordListByDate(){
                  getTeacherRecordListByDate({searchName:this.searchName,searchDate:this.searchDate}).then(res => {
                    if (res.data.code === 200) {
                        this.datalist=res.data.data;         
                    }; 
                }).catch(err => {});
             },          
        },
    }
</script>
<style lang="scss" scoped>
   .eatSettingclasslist{
       padding: 12px;
       .top{
            padding-bottom:10px;          
       }     
   }   
</style>
