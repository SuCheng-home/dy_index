<template>
    <div class="schoolLogdetails">  
         <el-tabs type="border-card"  v-model="activeName" @tab-click="campusCrdindex()">
            <el-tab-pane label="校务日志" name="one"></el-tab-pane>
            <el-tab-pane label="检查数据" name="two"   >
                <div class="top">  
                <el-button  @click="$router.back()" type="default" size="medium">返回</el-button>
                <el-button type="primary" size="medium" v-if="isNeedSend&&state==1" @click="publishSchoolLogs()">发布</el-button>
                <el-button type="primary" size="medium" @click="printStatistics">打印</el-button>
                <!-- 前端导出 -->
                <el-button type="primary" size="medium"  @click="exportExcel('#outTable', `检查数据.xlsx`)"   v-if="datalist.length>0">导出</el-button>
        </div>
        <div  class="content">
            <el-table  :data="datalist"  border style="width: 100%"  :height="maxH-30">
                  <el-table-column align="center" fixed  label="班级" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.className}}</span>
                    </template>
                 </el-table-column>
                 <el-table-column   :key="index"  v-for="(item,index) in typeNameList"  align="center" :label="item"  show-overflow-tooltip  >                    
                     <template slot-scope="scope">
                        <span>{{scope.row.scoreList[index]}}</span>
                    </template>
                </el-table-column> 
                <el-table-column align="center" fixed="right"  label="总分" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.totalScore}}</span>
                    </template>
                 </el-table-column>
             </el-table>            
        </div>    
        <div  style="display: none;" id="outTable" >
            <el-table :data="datalist" border style="width: 100%" ref="print">
                  <el-table-column align="center"  label="班级">
                    <template slot-scope="scope">
                        <span>{{scope.row.className}}</span>
                    </template>
                 </el-table-column>
                 <el-table-column   :key="index"  v-for="(item,index) in typeNameList"  align="center" :label="item">                    
                     <template slot-scope="scope">
                        <span>{{scope.row.scoreList[index]}}</span>
                    </template>
                </el-table-column> 
                <el-table-column align="center"  label="总分" >
                    <template slot-scope="scope">
                        <span>{{scope.row.totalScore}}</span>
                    </template>
                 </el-table-column>
             </el-table>            
        </div> 
            </el-tab-pane>
            <el-tab-pane label="外出日程" name="three" v-if="isAddCalendarData"></el-tab-pane>
          </el-tabs>  
    </div>
</template>
<script>
    import windowResize from "@/mixins/windowResize";
    import baseMixin from '@/mixins/baseMixin';
    import {publishSchoolLog, getSchoolLogDetail} from '@/api/schoolLog';
    export default {
        data() {
            return {
               activeName:'two',
               schoolType:'',
               id: this.$route.query.id,
               isNeedSend:false,
               isAddAttendanceData:false,//	是否添加考勤数据 1添加 2不添加	number	@mock=1
               isAddCalendarData:false,	//是否添加日程数据 1添加 2不添加	number	@mock=1
               isAddCheckData:false,	//是否添加检查数据 1添加 2不添加	number	@mock=1
               isNeedSend:false,	//是否需要发送 1需要 2不需要	number	@mock=1   
               state:2,
               datalist:[],
               typeNameList:[]
            }
        },
        mixins: [windowResize,baseMixin],       
        created() {
            this.getSchoolLogDetails()
        },
        methods: {
            //打印
            printStatistics() {
                this.$print(this.$refs.print);
            },
              //获取详情
             getSchoolLogDetails(){
                  getSchoolLogDetail(this.id).then(res => {
                    if (res.data.code === 200) {
                        let mydata=res.data.data.schoolLog;
                        this.schoolType=res.data.data.schoolType;
                        this.state=mydata.state;
                        if(mydata.isAddAttendanceData==1){
                        this.isAddAttendanceData=true;
                        };
                        if(mydata.isAddCalendarData==1){
                            this.isAddCalendarData=true;
                        };
                        if(mydata.isAddCheckData==1){
                            this.isAddCheckData=true;
                        };
                        if(mydata.isNeedSend==1){
                            this.isNeedSend=true;
                        };    
                        this.datalist=res.data.data.checkTypeStatistical.checkStatisticalList; 
                        this.typeNameList=res.data.data.checkTypeStatistical.typeNameList;                 
                    }; 
                }).catch(err => {});
             },
            //发布
            publishSchoolLogs(){
               this.$confirm('是否发布此日志', '发布', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    publishSchoolLog(this.id).then(res => res.data).then(data => {
                            if(data.result) {
                                let _this = this;
                                this.$message({
                                    message: '发布成功！',
                                    type: 'success',
                                    duration: 1000,
                                    onClose: function () {
                                        _this.$router.back();
                                    }
                                });
                           }
                        })
                });
            }, 
            campusCrdindex(){
               if(this.activeName=='one'){
                   this.schoolLogdetailsone()
               }
               if(this.activeName=='three'){
                   this.schoolLogdetailsthree()
               }
            },           
            //考勤数据
            schoolLogdetailsone(){
                 this.$router.replace({
                    path:'schoolLogdetailsone',
                    query: {id: this.id}
                   });
            },
             //外出日程
            schoolLogdetailsthree(){
                 this.$router.replace({
                    path:'schoolLogdetailsthree',
                    query: {id: this.id}
                   });
            }
          
        },
    }
</script>
<style lang="scss" scoped>
   .schoolLogdetails{
       padding: 12px;
       .top{
           *{
               box-sizing: border-box;
               overflow: hidden;
           }
           padding: 0 0 10px 0;
          .button{
            margin-bottom:20px;
            width: 100%;
            margin: 10px auto;
            overflow: hidden;
            margin-top: 0;
            span{
                color: #222;
                width: 33%;
                padding: 10px 0;
                font-size: 14px;
                line-height: 16px;
                text-align: center;
                border: 1px #ddd solid;
                float: left;
                cursor: pointer;
            }
            p{
                    padding: 0;
                    margin: 0;
            }
           .left{
                border-radius: 5px 0 0 5px;
            }
            .right{
                border-radius: 0 5px 5px 0;            
            }
           .color{
                color: #fff;
                background-color: #409eff;
                border-color: #409eff;
            }            
      }
       }
       .content{
            overflow:auto;
       }     
   }   
</style>
