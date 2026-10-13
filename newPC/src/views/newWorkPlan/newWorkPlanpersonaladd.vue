<template>
<div class="newWorkPlanpersonaladd"  >
     <div class="top"> 
         <el-button @click="$router.back()" type="default" size="medium">返回</el-button> 
      </div>
     <div class="subject " :style="`height: ${nobottommaxH}px;`">
         <div class="body">
           <div class="subject-top">
                {{name}}
            </div>
           <div class="ul">
                <div class="li" :key="indexs"  v-for="(items,indexs) in datalist">
                    <div class="li-top"><span></span>{{items.dayName}}（{{items.dayDate}}）<i @click="dialogVisiblefun(items.dayDate,indexs+1,)" class="el-icon-circle-plus-outline"></i></div>
                    <div class="box">
                        <div class="box-li" :key="index"   v-for="(item,index) in items.dayPlanList">
                               <span class="content">
                                 <span v-if="item.timeType==1">全天</span>
                                 <span v-if="item.timeType==2">上午</span>
                                 <span v-if="item.timeType==3">下午</span>
                                 <span v-if="item.timeType==4">{{item.startTime}}<span v-if="item.endTime">~{{item.endTime}}</span></span>
                                 {{item.content}}&nbsp;&nbsp;<span v-if="item.place">（{{item.place}}）</span>&nbsp;&nbsp;<span>{{item.principals}}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>（{{item.department}}）</span></span>
                                <i class="el-icon-upload2" v-if="item.buildUserId==myid" title="上移" @click="adjustContentOrderNos(item.id,index)"></i>
                                <i class="el-icon-edit" v-if="(item.buildUserId==myid)&&(item.state!=2)"  title="编辑" @click="dialogVisiblefuneidt(item)"></i>
                                <i class="el-icon-delete" v-if="(item.buildUserId==myid)&&(item.state!=2)" title="删除计划" @click="delWorkPlanContentByIds(item.id)"></i>
                               <div class="button" v-if="item.buildUserId==myid" >
                                 <el-tag size="mini" v-if="item.state==2&&item.isSuper!=0">已采用</el-tag>
                                 <el-tag size="mini" v-if="item.state==1&&item.isSuper!=0" type="danger">已上报</el-tag>
                                 <el-tag type="info" size="mini" v-if="item.isSuper==0">未上报</el-tag>
                               </div>
                               
                        </div>
                        <div class="zanwu" v-if="items.dayPlanList.length==0">暂无计划</div>
                    </div>
                </div>                
            </div>             
         </div>
    </div> 
    <div class="bigdialog-box" v-show="dialogVisible">         
          <div class="bigdialog-box-box">
             <div class="top-name">{{popname}}工作计划明细 <i class="el-icon-close" @click="dialogVisible = false"></i></div>
             <div class="dialog-box">
              <div class="dialog-box-name"><span>*</span>负责部门</div>
              <el-select class="selectWidth" :disabled="num==2" v-model="query.departmentId" placeholder="请选择部门" >
                <el-option v-for="item in departmentlist" :key="item.id" :label="item.name" :value="item.id"> </el-option>
              </el-select>
            </div>
            <div class="dialog-box">
                <div class="dialog-box-name"><span>*</span>参与人</div>
                <address-book v-model="addressData" :config="managerConfigData" :grouptarget="true"></address-book>
            </div>
             <div class="dialog-box">
                <div class="dialog-box-name">时间类型</div>
                  <el-select v-model="query.timeType" placeholder="请选择时间类型">
                        <el-option label="请选择" :value="-1"></el-option>
                        <el-option label="全天" :value="1"></el-option>
                        <el-option label="上午" :value="2"></el-option>
                        <el-option label="下午" :value="3"></el-option>
                        <el-option label="自定义" :value="4"></el-option>
                  </el-select>
            </div>
            <div class="dialog-box" v-if="query.timeType==4">
                <div class="dialog-box-name"><span>*</span>具体时间</div>
                 <el-time-picker
                            v-model="query.startTime"
                            :clearable="false"
                            value-format="HH:mm"
                            format="HH:mm"
                            placeholder="开始时间">
                        </el-time-picker>
                  <el-time-picker
                            v-model="query.endTime"
                            value-format="HH:mm"
                            format="HH:mm"
                            placeholder="结束时间">
                        </el-time-picker>
                
            </div>
            <div class="dialog-box">
                <div class="dialog-box-name">地点</div>
                <el-select v-model="query.place" filterable allow-create default-first-option size="medium" placeholder="请选择地点">
                    <el-option label="请选择" :value="''"></el-option>
                    <el-option v-for="item in typeList" :key="item.code" :label="item.value" :value="item.value"></el-option>
                </el-select>
            </div>
            <div class="dialog-box">
                <div class="dialog-box-name"><span>*</span>计划内容</div>
                <el-input :maxlength="500"  type="textarea" :autosize="{ minRows: 2, maxRows: 4}"  v-model="query.content"   size="medium" placeholder="请输入计划"></el-input>
            </div>
            <div class="dialog-box" style="paddingTop: 16px;">
                <div class="dialog-box-name"><span>*</span>提交至部门</div>
                <el-switch v-model="query.checked" :disabled="num==2&&query.mychecked"></el-switch>
                <!-- <el-checkbox v-model="query.checked" :disabled="num==2&&query.mychecked">是否提交</el-checkbox> -->
            </div>
            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="addWorkPlanContents()">确 定</el-button>
            </span>

          </div>            
        </div>
</div> 
</template>
<script>
import {getTermWeekAllDateList,queryDepartByUserId,getWorkPlanInfoById,addWorkPlanContent,editWorkPlanContent,delWorkPlanContentById,adjustContentOrderNo} from "@/api/newWorkPlan";
import mixin from "@/mixins/windowResize";
import {mapGetters} from 'vuex';
import AddressBook from '@/components/AddressBook/indexExpand';
import {findSchoolDicsByCode} from '@/api/common/common';
export default {
  data() {
    return {
      schoolTimeId: this.$route.query.schoolTimeId,
      week: this.$route.query.week,
      id: this.$route.query.id,
      name:this.$route.query.name,
      datalist:[],
      dialogVisible:false,
      addressData:{},
      managerConfigData: {title: '选择参与人', depart: {target: 'user', departType: 't', userTypes: '1',notCheckSchool : true},group: true},
      query:{
        conType:1,//内容类型 1个人 2部门 3学校	number	
        content:'',//	内容	string	
        dayDate:'',//	日期	string	
        dayNo:'',//	星期	number	
        department:'',//	负责部门	string	
        departmentId:'',//	负责部门ID	number	
        isSuper:'',//	是否提交上级 0不提交上级 1提交部门 2提交学校	number	
        planId:this.$route.query.id,//	计划ID	string	页面取不到传0或空字符
        planWeek: this.$route.query.week,//	计划周次	number	
        principalJson:'',//	参与人	string	
        termId: this.$route.query.schoolTimeId,//	学期ID	number
        checked:true,
        mychecked:false,
        id:'0',
        planType:0,
        title:'',
        outPlace:'',
        outStartDate:'',
        outEndDate:'',
        userIdStr:'',
        timeType:'',
        startTime:"08:00",
        place:'',
        endTime:''
      },
      departmentlist:[],
      num:1,
      popname:'',
      myid:'',
      typeList:[]
    };
  },
  components: {AddressBook},
  mixins: [mixin],
  computed:{
    ...mapGetters(['userInfo'])
  },
  created() {
     this.addressData= {userJson: [this.$store.state.user.userInfo]};
     this.myid=this.$store.state.user.userInfo.id;
     findSchoolDicsByCode({
          dicCode:'workplanePlace'
        }).then((res) => {
          const data = res.data.data;
          if (res.data.code === 200) {
            this.typeList = data;
          }
        })
    if(this.id){
      this.getWorkPlanInfoByIds();
      this.queryDepartByUserIdFun();
    }else{
      this.getTermWeekAllDateLists();
      this.queryDepartByUserIdFun();
    }
  },
  methods: {
    //获取部门
    queryDepartByUserIdFun(){
      queryDepartByUserId(this.userInfo.id).then(res =>res.data).then(data=>{
        if(data.code===200){
          this.departmentlist=data.data;
          if(this.departmentlist.length>0){
             this.query.departmentId=this.departmentlist[0].id;
          }          
        }
      }).catch(()=>{})
    },
    getTermWeekAllDateLists(){
      getTermWeekAllDateList(this.schoolTimeId, this.week)
        .then(res => {
          let data = res.data.data;  
          this.datalist=[];        
          for(let i=0;i<data.length;i++){
            this.datalist.push({dayName:data[i].dayName,dayDate:data[i].schoolTimeDate,dayPlanList:[]})
          }          
        })
        .catch(err => {});
    },
    getWorkPlanInfoByIds(){
      getWorkPlanInfoById(this.id)
        .then(res => {
          let data = res.data.data;
          this.datalist=data.planContentList;       
        })
        .catch(err => {});
    },
    //删除
    delWorkPlanContentByIds(id) {
      this.$confirm("确定要删除吗？", "提示", {
        type: "warning"
      }).then(() => {
          delWorkPlanContentById(id)
            .then(res => {
              if (res.data.code === 200) {
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
                this.getWorkPlanInfoByIds();
              }
            })
            .catch(err => {});
        })
        .catch(() => {});
    },
    //上移
    adjustContentOrderNos(id,index){
        if (index==0) {
          this.$message.error("已是第一位！");
          return;
        }else{
           adjustContentOrderNo(id)
            .then(res => {
              if (res.data.code === 200) {
                this.$message({
                  type: "success",
                  message: "上移成功!"
                });
                this.getWorkPlanInfoByIds();
              }
            })
            .catch(err => {});
        }
    },
    //弹框
    dialogVisiblefun(dayDate,dayNo){
          this.num=1;
          this.popname='添加'
          this.dialogVisible=true;
          this.query.dayDate=dayDate;
          this.query.dayNo=dayNo;
          this.query.content='';
          this.query.place='';
          this.query.timeType=-1;
          this.query.startTime='08:00';
          this.query.endTime='';
          if(this.id){
            this.query.planId=this.id;
          }else{
            this.query.planId=0; 
          }
          this.addressData= {userJson: [this.$store.state.user.userInfo]};
          this.query.checked=true;
          if(this.departmentlist.length>0){
            this.query.departmentId=this.departmentlist[0].id;
          }
    },
    dialogVisiblefuneidt(obj){
          this.num=2;
          this.popname='编辑'
          this.dialogVisible=true;
          this.query.content=obj.content;
          this.query.departmentId=obj.departmentId;
          this.query.place=obj.place||'';
          this.query.timeType=obj.timeType||-1;
          this.query.startTime=obj.startTime||'08:00';
          this.query.endTime=obj.endTime||'';
          
          this.query.id=obj.id;
          if(obj.isSuper!=0){
            this.query.checked=true;
            this.query.mychecked=true;
          }else{
            this.query.checked=false;
            this.query.mychecked=false;
          }
          this.addressData= {userJson: JSON.parse(obj.principalJson)};
    },
    //新增
    addWorkPlanContents(){  
        if(this.departmentlist.length==0){
          this.$message.error('请选择部门');
          return;
        }   
        if(this.addressData.userJson.length==0){ 
          this.$message.error('请选择参与人');
          return;
        }
      //  if(!this.query.place){
      //     this.$message.error('请选择地点');
      //     return;
      //   }
      if(this.query.timeType==4&&this.query.endTime&&((this.query.startTime>this.query.endTime)||(this.query.startTime==this.query.endTime))){ 
               this.$message.error('具体开始时间不能大于等于具体结束时间！');
               return;
           } 
        if(!(this.query.content.trim())){
          this.$message.error('请输入计划');
          return;
        }
        for (let item of this.departmentlist) {
          if ( this.query.departmentId == item.id) {
            this.query.department=item.name;
          }
        }
        if(this.query.checked){
          this.query.isSuper=1;
        }else{
          this.query.isSuper=0;
        }
        if(this.addressData.userJson.length==0){ 
          this.$message.error('请选择参与人');
          return;
        }
        this.query.principalJson=JSON.stringify(this.addressData.userJson);
       if(this.num==1){
         addWorkPlanContent(this.query).then(res=>res.data).then(data=>{
        if(data.code==200){
          if(data.result){
             this.$message({ message: "添加工作计划明细成功!",type: "success",duration: 1000});
          }else{
              this.$message.error(data.msg);
          }
            
            this.id=data.data.planId;
            this.dialogVisible=false;
            this.getWorkPlanInfoByIds();
         }else{
            this.$message.error(data.msg);
            this.dialogVisible=false;
         }
         })
       }else{
           editWorkPlanContent(this.query).then(res=>res.data).then(data=>{
              if(data.code==200){
                 if(data.result){
                    this.$message({ message: "编辑工作计划明细成功!",type: "success",duration: 1000});
                  }else{
                      this.$message.error(data.msg);
                  }
                  this.dialogVisible=false;
                  this.getWorkPlanInfoByIds();
              }else{
                  this.$message.error(data.msg);
                  this.dialogVisible=false;
              }
         })
       }       
    }
    

  }
};
</script>
<style lang="scss" scoped>
.newWorkPlanpersonaladd {
  padding:12px;
  *{
    box-sizing: border-box;
    word-break:break-all;   word-wrap:break-word;
  }
  .top {
    border-bottom: 1px solid #e7eaec;
    padding-bottom: 10px;
  }
  .bigdialog-box{
    font-size: 14px;
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 1000;
    background-color: rgba(0,0,0,0.5);  
    .bigdialog-box-box{
      position: relative;
      margin: 100px auto;
      background: #fff;
      border-radius: 2px;
      width: 800px;
      padding: 20px 30px;
      overflow: hidden;
      .dialog-footer{
        float: right;
      }
      .top-name{
        line-height: 24px;
        font-size: 18px;
        color: #303133;
        padding-bottom: 30px;
        i{
          color: #909399;
          font-size: 16px;
          float: right;
        }
      }
  } 
  }
 
  .dialog-box{
    position: relative;
    padding:5px 0 5px 130px;
    min-height: 50px;
    .el-select{
      width: 100%;
    }
    .dialog-box-name{
      position: absolute;
      left:0;
      top:0;
      line-height: 50px;
      width: 120px;
      text-align: right;
      span{
        color:#F56C6C;
      }
    }
  }
  .subject {
    padding-top: 10px;
    overflow: auto;
    .body{
        width: 810px;
        margin: 0 auto;
        .subject-top {
          line-height: 36px;
          margin: 10px auto;
          text-align: center;
          font-size: 22px;
          color: #303133;
        }
        .ul{
          .li{
             .li-top {
                height: 40px;
                line-height: 40px;
                background-color: #ECF8FF;
                span {
                    width: 4px;
                    height: 18px;
                    background-color: #409EFF;
                    display: block;
                    float: left;
                    margin: 8.5px 10px 12.5px 15px;
                }
                i{
                  font-size: 18px;  
                  color:#606266;
                  cursor:pointer;                
                }
                i:hover{
                  color:#409EFF;
                }
            }
            .box{
              font-size: 14px;
              line-height: 20px;
              color:#909399;
              .zanwu{
                text-align: center;
                line-height: 60px;
                font-size: 16px;
              }
              .box-li{                 
                  overflow: hidden;
                  padding:10px;
                  border-bottom: 1px #EBEEF5 solid;
                 .content{
                    width: 580px;
                    float: left;
                    color:#606266;
                    span{                      
                      color:#909399;
                    }
                  }
                  .name{
                    width: 120px;
                    float: left;
                    padding-right: 20px;
                  }
                  .button{
                    float: right;
                    color:#409EFF;
                    font-size: 14px;
                  }
                  i {
                    color: #8492a6;
                    font-size: 20px;
                    display: inline-block;
                    cursor: pointer;
                    margin-left: 20px;
                    float: left;
                  }
                  i:hover {
                    color: #409EFF;
                  }
              }
            }
          }

        }
    }
  }
}
</style>