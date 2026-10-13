<template>
    <div class="accountingByPersoninfo">  
        <div class="top">  
                 <el-button  @click="$router.back()" type="default" size="medium">返回</el-button>
                   <el-select size="medium" v-model="schoolTimeCode" placeholder="请选择学期" @change="getAttendanceRecordThListByMonth()">
                <el-option v-for="item in schoolYearList" :key="item.id" :label="item.schoolTimeName"
                           :value="item.id"></el-option>
            </el-select>
                  <el-date-picker
                        size="medium"
                        @change="getAttendanceRecordThListByMonth"
                        format="yyyy-MM"
                        value-format="yyyy-MM"
                        v-model="date"
                        align="right"
                        :clearable="false"
                        type="month"
                        placeholder="选择日期"
                    >
                    </el-date-picker>
                <el-button type="primary" size="medium"  @click="exportExcel('#outTable', `明细.xlsx`)"   v-if="datalist.length>0">导出</el-button>
              
        </div>
         <div>
            <el-table :data="datalist" border style="width: 100%" ref="print" :height="nobottommaxH">
                  <el-table-column align="center" fixed  label="姓名">
                    <template slot-scope="scope">
                        <span>{{scope.row.userName}}</span>
                    </template>
                 </el-table-column>
                <el-table-column align="center" show-overflow-tooltip fixed  label="所在部门">
                    <template slot-scope="scope">
                        <span>{{scope.row.userDepartNames}}</span>
                    </template>
                 </el-table-column>
                  <el-table-column align="center"  v-for="(item,index) in dateList" :key="index"  :label="item.schoolTimeDate.slice(8,10)-0">
                    <template slot-scope="scope">
                        <div v-if="scope.row.recordList[index]">
                            <span v-if="scope.row.recordList[index].signInState==0"><el-tag type="danger" size="mini">缺卡</el-tag></span>
                            <span v-if="scope.row.recordList[index].signInState==1" style="color:#67C23A">{{scope.row.recordList[index].userSignInDate?scope.row.recordList[index].userSignInDate.slice(11, 16):''}}</span>
                            <span v-if="scope.row.recordList[index].signInState==2" style="color:#E6A23C">{{scope.row.recordList[index].userSignInDate?scope.row.recordList[index].userSignInDate.slice(11, 16):''}}</span>
                            <span v-if="scope.row.recordList[index].signInState==3">
                                <el-tag type="warning"  size="mini">请假</el-tag>
                            </span>
                        </div>
                        <div v-if="scope.row.recordList[index]">
                                <span v-if="scope.row.recordList[index].signOutState==0"><el-tag type="danger" size="mini">缺卡</el-tag></span>
                                <span v-if="scope.row.recordList[index].signOutState==1" style="color:#67C23A">{{scope.row.recordList[index].userSignOutDate?scope.row.recordList[index].userSignOutDate.slice(11, 16):''}}</span>
                                <span v-if="scope.row.recordList[index].signOutState==2" style="color:#E6A23C">{{scope.row.recordList[index].userSignOutDate?scope.row.recordList[index].userSignOutDate.slice(11, 16):''}}</span>
                                <span v-if="scope.row.recordList[index].signOutState==3">
                                       <el-tag type="warning" size="mini">请假</el-tag>
                                </span>
                        </div>
                        <div v-if="!scope.row.recordList[index]">--</div>
                    </template>
                 </el-table-column>
             </el-table>            
        </div> 
        <div  id="outTable"  style="display: none;">
            <el-table :data="datalist" border style="width: 100%" >
                  <el-table-column align="center"  label="姓名">
                    <template slot-scope="scope">
                        <span>{{scope.row.userName}}</span>
                    </template>
                 </el-table-column>
                <el-table-column align="center" show-overflow-tooltip   label="所在部门">
                    <template slot-scope="scope">
                        <span>{{scope.row.userDepartNames}}</span>
                    </template>
                 </el-table-column>
                  <el-table-column align="center"  v-for="(item,index) in dateList" :key="index"  :label="item.schoolTimeDate.slice(8,10)-0">
                    <template slot-scope="scope">
                        <div v-if="scope.row.recordList[index]">
                            <span v-if="scope.row.recordList[index].signInState==0"><el-tag type="danger" size="mini">缺卡</el-tag></span>
                            <span v-if="scope.row.recordList[index].signInState==1" style="color:#67C23A">{{scope.row.recordList[index].userSignInDate?scope.row.recordList[index].userSignInDate.slice(11, 16):''}}</span>
                            <span v-if="scope.row.recordList[index].signInState==2" style="color:#E6A23C">{{scope.row.recordList[index].userSignInDate?scope.row.recordList[index].userSignInDate.slice(11, 16):''}}</span>
                            <span v-if="scope.row.recordList[index].signInState==3">
                                <el-tag type="warning"  size="mini">请假</el-tag>
                            </span>
                        </div>
                        <div v-if="scope.row.recordList[index]">
                                <span v-if="scope.row.recordList[index].signOutState==0"><el-tag type="danger" size="mini">缺卡</el-tag></span>
                                <span v-if="scope.row.recordList[index].signOutState==1" style="color:#67C23A">{{scope.row.recordList[index].userSignOutDate?scope.row.recordList[index].userSignOutDate.slice(11, 16):''}}</span>
                                <span v-if="scope.row.recordList[index].signOutState==2" style="color:#E6A23C">{{scope.row.recordList[index].userSignOutDate?scope.row.recordList[index].userSignOutDate.slice(11, 16):''}}</span>
                                <span v-if="scope.row.recordList[index].signOutState==3">
                                       <el-tag type="warning" size="mini">请假</el-tag>
                                </span>
                        </div>
                        <div v-if="!scope.row.recordList[index]">--</div>
                    </template>
                 </el-table-column>
             </el-table>            
        </div> 
      
    </div>
</template>
<script>
    import windowResize from "@/mixins/windowResize";
    import baseMixin from '@/mixins/baseMixin';
    import {getAttendanceRecordThListByMonth} from '@/api/schoolManage/teacherAttendanceStatistics';
    import {getSchoolTimeAllList} from '@/api/classroomEvaluation';
    export default {
        data() {
            return {
               datalist:[],
               dateList:[],
               date:this.$route.query.date,
               schoolTimeCode:'',
               schoolYearList: [],
               timer:null
            }
        },
        mixins: [windowResize,baseMixin],       
        created() {
             getSchoolTimeAllList().then(res => res.data)
                .then(data => {
                    if (data.code === 200) {
                        this.schoolYearList = data.data;
                        this.schoolYearList.forEach(item => {
                            if (item.isCurrent == 1) {
                                this.schoolTimeCode = item.id;
                            }
                        })
                         this.getAttendanceRecordThListByMonth()
                    }
                })
           this.$nextTick(() => {
                this.timer = setTimeout(() => {
                    this.$refs.print.doLayout()
                }, 300)
            })
        },
        methods: {
              //获取详情
             getAttendanceRecordThListByMonth(){
                  getAttendanceRecordThListByMonth(this.date,this.schoolTimeCode).then(res => {
                    if (res.data.code === 200) {
                        this.datalist=res.data.data.userList;
                        this.dateList=res.data.data.dateList; 
                         this.$nextTick(() => {
                this.timer = setTimeout(() => {
                    this.$refs.print.doLayout()
                }, 300)
            })        
                    }; 
                }).catch(err => {});
             },          
        },
    }
</script>
<style lang="scss" scoped>
   .accountingByPersoninfo{
       padding: 12px;
       .top{
            padding-bottom:10px;          
       }     
   }   
</style>
