<template>
<div class="newWorkPlanpersonaladd"  >
     <div class="top"> 
         <el-button @click="$router.back()" type="default" size="medium">返回</el-button> 
          <el-button type="primary" size="medium"   v-if="isfabu&&(state!=2)" @click="publishWorkPlans()">发布</el-button>
          <el-button type="primary" size="medium"  v-if="myis"  @click="newWorkPlanschooladdinfo()">导出</el-button>
      </div>
     <div class="subject " >
         <div class="body-box">
            <div class="body">
           <div class="subject-top">
               <div class="subject-top-box">
              <div class="subject-top-box-name"><span>*</span>周次</div>
              <el-select class="selectWidth" :disabled="myis" v-model="week" placeholder="请选择周次" @change="getWorkPlanInfoByParams()" >
                <el-option v-for="item in weeklist" :key="item.weekNo" :label='"第"+item.weekNo+"周"' :value="item.weekNo"> </el-option>
              </el-select>
              日期：{{weekname}}
            </div>            
            </div>
           <div class="ul" :style="`height: ${nobottommaxH-90}px;`">
              <div class="li" :key="indexs"  v-for="(items,indexs) in datalist">
                <div class="li-top"><span></span>{{items.dayName}}<template v-if="items.dayDate"> （{{items.dayDate}}）</template>&nbsp;&nbsp;<i @click="dialogVisiblefun(items.dayDate,indexs)" class="el-icon-circle-plus-outline"></i></div>
                    <div class="box">
                        <div class="box-li" :key="index"   v-for="(item,index) in items.dayPlanList">
                               <span class="content" v-if="items.planType==-1">{{item.content}}<span v-if="item.department">（{{item.department}}）</span></span>
                               <span class="content" v-if="items.planType==1"><span>{{item.outStartDate}}</span>~<span>{{item.outEndDate}}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>{{item.principals}}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>{{item.outPlace}}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>{{item.content}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></span>
                               <span class="content" v-if="items.planType==0">
                                  <span v-if="item.timeType==1">全天</span>
                                 <span v-if="item.timeType==2">上午</span>
                                 <span v-if="item.timeType==3">下午</span>
                                 <span v-if="item.timeType==4">{{item.startTime}}<span v-if="item.endTime">~{{item.endTime}}</span></span>
                                 {{item.content}}&nbsp;&nbsp;<span v-if="item.place">（{{item.place}}）</span>&nbsp;&nbsp;<span>{{item.principals}}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>（{{item.department}}）</span></span>
                               <i class="el-icon-upload2" title="上移" @click="adjustContentOrderNos(item.id,index)"></i>
                               <i class="el-icon-edit"   title="编辑"  @click="dialogVisiblefuneidt(item,indexs)"></i>
                               <i class="el-icon-delete" title="删除计划"  @click="delWorkPlanContentByIds(item.id)"></i>                              
                        </div>
                        <div class="zanwu" v-if="items.dayPlanList.length==0">暂无计划</div>
                    </div>
                </div> 
                <div class="li">
                    <div class="li-top"><span></span>备注</div>
                    <div class="box">
                        <el-input :maxlength="500" @change="remarksfun('备注')"  type="textarea" :autosize="{ minRows: 2, maxRows: 10}"  v-model="remarks"   size="medium" placeholder="请输入备注"></el-input>
                    </div>
                </div>                 
            </div>             
         </div>
         <div class="right-box" v-if="shangbaolist.length>0">
             <div class="right-box-top">各部门提交的工作计划 
                <el-tag size="mini"  @click="batchAdoptSchoolPlanContentss(0)">全部采用</el-tag>
             </div>
             <div class="ul" :style="`height: ${nobottommaxH-65}px;`">
               <div :key="indexs"   v-for="(items,indexs) in shangbaolist">
                    <div class="bumen-name">{{items.department}}
                      <el-tag size="mini"  @click="batchAdoptSchoolPlanContentss(items.departmentId)">全部采用</el-tag>
                    </div>
                    <div class="li" :key="index"   v-for="(item,index) in items.dayPlanList">
                     <div>
                        <div v-if="item.planType==1">{{item.outStartDate}}~{{item.outEndDate}}&nbsp;&nbsp;{{item.principals}}&nbsp;&nbsp;{{item.outPlace}}</span>
                         </div>
                       {{item.content}}  
                       <span v-if="item.place&&item.planType==0">（{{item.place}}）</span>                    
                     </div>
                     <div class="li-name" v-if="item.planType==0">{{item.principals}}<span>{{item.dayName}}（{{item.dayDate}}<span v-if="item.timeType==1">全天</span>
                                 <span v-if="item.timeType==2">上午</span>
                                 <span v-if="item.timeType==3">下午</span>
                                 <span v-if="item.timeType==4">{{item.startTime}}<span v-if="item.endTime">~{{item.endTime}}</span></span>）</span></div>   
                     <div class="li-name" v-if="item.planType==-1"><span>{{ userInfo.schoolId==1664?'全周工作':'重点工作' }}</span></div>                
                     <div class="li-name" v-if="item.planType==1"><span>外出计划</span></div>
                     <div class="tag-box">
                         <el-tag size="mini"  @click="useOrRefusePlanContents(item.id,2)">采用</el-tag>
                         <el-tag size="mini" type="danger"  @click="useOrRefusePlanContents(item.id,0)">退回</el-tag>
                     </div>
                 </div>
               </div>
                 
             </div>
         </div>
         </div>         
    </div> 
    <div class="bigdialog-box" v-show="dialogVisible">  
          <div class="bigdialog-box-box">
             <div class="top-name">{{popname}}<template v-if="myisnum==0">{{ userInfo.schoolId==1664?'全周':'重点' }}</template><template v-if="myisnum==8">外出</template>工作计划明细 <i class="el-icon-close" @click="dialogVisible = false"></i></div>             
             <div class="dialog-box" v-if="myisnum!=8">
                <div class="dialog-box-name"><span>*</span>部门</div>
                <el-select class="selectWidth"   v-model="query.departmentId" placeholder="请选择部门">
                <el-option v-for="item in departmentlist" :key="item.id" :label="item.name" :value="item.id"> </el-option>
              </el-select>
            </div>    
             <div class="dialog-box" v-if="myisnum==8">
                <div class="dialog-box-name"><span>*</span>外出主题</div>
                <el-input :maxlength="100"   v-model.trim="query.title"   size="medium" placeholder="请输入主题"></el-input>
            </div>
            <div class="dialog-box" v-if="myisnum!=0&&myisnum!=8">
                <div class="dialog-box-name"><span>*</span>
                <template>参与人</template>
                </div>
                <address-book v-model="addressData" :config="managerConfigData"  :grouptarget="true"></address-book>
            </div>
            <div class="dialog-box" v-if="myisnum!=0&&myisnum!=8">
                <div class="dialog-box-name">时间类型</div>
                  <el-select v-model="query.timeType" placeholder="请选择时间类型">
                         <el-option label="请选择" :value="-1"></el-option>
                        <el-option label="全天" :value="1"></el-option>
                        <el-option label="上午" :value="2"></el-option>
                        <el-option label="下午" :value="3"></el-option>
                        <el-option label="自定义" :value="4"></el-option>
                  </el-select>
            </div>
            <div class="dialog-box" v-if="myisnum!=0&&myisnum!=8&&query.timeType==4">
                <div class="dialog-box-name"><span>*</span>具体时间</div>
                 <el-time-picker
                            v-model="query.startTime"
                            :clearable="false"
                            value-format="HH:mm"
                            format="HH:mm"
                            placeholder="具体时间">
                        </el-time-picker>
                  <el-time-picker
                            v-model="query.endTime"
                            value-format="HH:mm"
                            format="HH:mm"
                            placeholder="结束时间">
                        </el-time-picker>
                
            </div>
            <div class="dialog-box" v-if="myisnum!=0&&myisnum!=8">
                <div class="dialog-box-name">地点</div>
                <el-select v-model="query.place" filterable allow-create default-first-option size="medium" placeholder="请选择地点">
                   <el-option label="请选择" :value="''"></el-option>
                    <el-option v-for="item in typeList" :key="item.code" :label="item.value" :value="item.value"></el-option>
                </el-select>
            </div>
            <div class="dialog-box" v-if="myisnum!=8">
                <div class="dialog-box-name"><span>*</span>计划内容</div>
                <el-input :maxlength="500"  type="textarea" :autosize="{ minRows: 2, maxRows: 4}"  v-model="query.content"   size="medium" placeholder="请输入计划"></el-input>
            </div>
             <div class="dialog-box" v-if="myisnum==8">
                <div class="dialog-box-name"><span>*</span>外出内容</div>
                <el-input :maxlength="200"  type="textarea" :autosize="{ minRows: 2, maxRows: 4}"  v-model="query.content"   size="medium" placeholder="请输入外出内容"></el-input>
            </div>
            <div class="dialog-box" v-if="myisnum==8">
                <div class="dialog-box-name"><span>*</span>外出时间</div>
                <el-date-picker v-model="query.outStartDate" type="datetime" format="yyyy-MM-dd HH:mm" :editable="false" :clearable="false" placeholder="选择开始日期时间"></el-date-picker>
                至
                <el-date-picker v-model="query.outEndDate" type="datetime" format="yyyy-MM-dd HH:mm" :editable="false" :clearable="false" placeholder="选择结束日期时间"></el-date-picker>
            </div>
              <div class="dialog-box" v-if="myisnum==8">
                <div class="dialog-box-name"><span>*</span><template>外出人员</template></div>
                <address-book v-model="addressData" :config="managerConfigDatatwo" ></address-book>
            </div>
            <div class="dialog-box" v-if="myisnum==8">
                <div class="dialog-box-name"><span>*</span>外出地点</div>
                <el-input :maxlength="20"   v-model.trim="query.outPlace"   size="medium" placeholder="请输入外出地点"></el-input>
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
import {weekPlanAddCalendar,queryDepartByType,batchAdoptSchoolPlanContents,getSchoolNotAdoptPlanContentList,publishWorkPlan,editWorkPlan,addWorkPlan,useOrRefusePlanContent,getWorkPlanInfoByParam,getPersonWorkPlanList,getTermWeekAllDateList,getWorkPlanInfoById,addWorkPlanContent,editWorkPlanContent,delWorkPlanContentById,adjustContentOrderNo} from "@/api/newWorkPlan";
import mixin from "@/mixins/windowResize";
import {mapGetters} from 'vuex';
import AddressBook from '@/components/AddressBook/indexExpand';
import {findSchoolDicsByCode} from '@/api/common/common';
export default {
  data() {
    return {
      isfabu:this.$route.query.isfabu,
      state:'',
      schoolTimeId: this.$route.query.schoolTimeId,
      week:'',
      weekname:'',
      weeklist:[],
      id: '',
      datalist:[],
      dialogVisible:false,
      addressData:{},
      managerConfigDatatwo: {title: '选择外出人员', depart: {target: 'user', departType: 't', userTypes: '1',notCheckSchool : true}},
      managerConfigData: {title: '选择参与人', depart: {target: 'user', departType: 't', userTypes: '1',notCheckSchool : true},group: true},
      query:{
        conType:3,//内容类型 1个人 2部门 3学校	number	
        content:'',//	内容	string	
        dayDate:'',//	日期	string	
        dayNo:'',//	星期	number	
        department:'',//	负责部门	string	
        departmentId:'',//	负责部门ID	number	
        isSuper:'0',//	是否提交上级 0不提交上级 1提交部门 2提交学校	number	
        planId:'',//	计划ID	string	页面取不到传0或空字符
        planWeek: '',//	计划周次	number	
        principalJson:'',//	参与人	string	
        termId: this.$route.query.schoolTimeId,//	学期ID	number
        checked:false,
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
        endTime:'',
        place:''
      },
      departmentlist:[],
      num:1,
      popname:'',
      shangbaolist:[],
      remarks:'',
      myis:false,
      mainWorks:'',
      myisnum:100,
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
     if(this.$route.query.week||(this.$route.query.week===0)){
         this.myis=true;
     }
    this.queryDepartByTypes();
     findSchoolDicsByCode({
          dicCode:'workplanePlace'
        }).then((res) => {
          const data = res.data.data;
          if (res.data.code === 200) {
            this.typeList = data;
          }
        })
  },
  methods: {
    newWorkPlanschooladdinfo(){
       this.$router.push({
                        path: "newWorkPlanschooladdinfo",
                        query: {
                            schoolTimeId: this.$route.query.schoolTimeId,
                            week: this.$route.query.week,
                            schoolTimeName:this.$route.query.schoolTimeName
                        }
                    });

    },
   
    //全部采用
    batchAdoptSchoolPlanContentss(id){
       this.$confirm("确定采用全部吗？", "提示", {
        type: "warning"
      }).then(() => {
          batchAdoptSchoolPlanContents(id,this.week,this.schoolTimeId)
            .then(res => {
              if (res.data.code === 200) {
                this.$message({
                  type: "success",
                  message: "采用全部成功!"
                });
                this.getWorkPlanInfoByParams();
              }
            })
            .catch(err => {});
        })
        .catch(() => {});
    },
    //发布
    publishWorkPlans(){
     let num=0;
      for(let i=0;i<this.datalist.length;i++){
        num+=this.datalist[i].dayPlanList.length;
      }
      if(!num){
        this.$message({
                        type: "warning",
                        message: "至少有一条计划!"
                    });
                    return
      }
       this.$confirm("确定要发布吗？", "提示", {
        type: "warning"
      }).then(() => {
          publishWorkPlan(this.id)
            .then(res => {
              if (res.data.code === 200) {
                this.$message({
                  type: "success",
                  message: "发布成功!"
                });
                this.$router.back();
              }
            })
            .catch(err => {});
        })
        .catch(() => {});
    },
    //备注
    remarksfun(name){
     if(!this.id){
         let obj={
            departId:'0',//	部门ID	number	
            departName:'',//	部门名称	string	
            endDate:this.datalist[6].dayDate,//	周结束日期	string	
            remarks:this.remarks.trim(),//	备注	string	
            schoolTimeId:this.schoolTimeId,//	学期Id	number	
            startDate:this.datalist[0].dayDate,//	周开始日期	string	
            useType:'3',//	类型 1个人 2部门 3学校	number	
            weekNo:this.week,//	周次	number
            mainWorks:this.mainWorks.trim()
         };
         addWorkPlan(obj)
            .then(res => {
              if (res.data.code === 200) {
                this.$message({
                  type: "success",
                  message: name+"添加成功!"
                });
                this.id=res.data.data.id
                this.getWorkPlanInfoByParams();
              }
            })
            .catch(err => {});
     }else{
         editWorkPlan(this.id,this.remarks.trim(),this.mainWorks.trim())
            .then(res => {
              if (res.data.code === 200) {
                this.$message({
                  type: "success",
                  message: name+"修改成功!"
                });
                this.getWorkPlanInfoByParams();
              }
            })
            .catch(err => {});
     }
    },
    //采用退回
    useOrRefusePlanContents(id,state){
        let name='退回';
        if(state==2){
          name='采用'
        }
     this.$confirm("确定要"+name+"吗？", "提示", {
        type: "warning"
      }).then(() => {
          useOrRefusePlanContent(id,state)
            .then(res => {
              if (res.data.code === 200) {
                this.$message({
                  type: "success",
                  message: name+"成功!"
                });
                if((!this.id)&&(state==2)){
                    this.id=res.data.data.planId;
                }
                this.getWorkPlanInfoByParams();
              }
            })
            .catch(err => {});
        })
        .catch(() => {});

    },
    //获取上报
    getSchoolNotAdoptPlanContentLists(){
           getSchoolNotAdoptPlanContentList(this.week,this.schoolTimeId).then(res => {
          let data = res.data.data;
          this.shangbaolist=data;
        })
        .catch(err => {});
    },
    //获取部门
    queryDepartByTypes(){      
      queryDepartByType().then(res =>res.data).then(data=>{
        if(data.code===200){
          this.departmentlist=data.data;
          if(this.departmentlist.length>0){
               this.query.departmentId=this.departmentlist[0].id
               this.getPersonWorkPlanLists();
          }
              
        }
      }).catch(()=>{})
    },
    //获取周次
    getPersonWorkPlanLists(){
       getPersonWorkPlanList(this.schoolTimeId).then(res => {
          let data = res.data.data;
          this.weeklist=data;
          if(this.$route.query.week||(this.$route.query.week===0)){
             this.week=this.$route.query.week;
              for(let i=0;i<this.weeklist.length;i++){
              if(this.weeklist[i].weekNo==this.$route.query.week){                  
                  this.weekname='（'+this.weeklist[i].startDate+'~'+this.weeklist[i].endDate+'）'
              }              
          }

          }else{
            for(let i=0;i<this.weeklist.length;i++){
              if(this.weeklist[i].isCurrent==1){
                  this.week=this.weeklist[i].weekNo;
                  this.weekname='（'+this.weeklist[i].startDate+'~'+this.weeklist[i].endDate+'）'
              }              
          }
          if(!this.week){
              this.week=this.weeklist[0].weekNo;
                  this.weekname='（'+this.weeklist[0].startDate+'~'+this.weeklist[0].endDate+'）'
          }
          }          
          this.getWorkPlanInfoByParams()
        })
        .catch(err => {});
    },
    //获取是否有id
    getWorkPlanInfoByParams(){
        if(this.departmentlist.length==0){
            return;
          }
        this.remarks='';
        this.mainWorks='';
         for(let i=0;i<this.weeklist.length;i++){
              if(this.weeklist[i].weekNo==this.week){
                  this.week=this.weeklist[i].weekNo;
                  this.weekname='（'+this.weeklist[i].startDate+'~'+this.weeklist[i].endDate+'）'
              }              
          }
         getWorkPlanInfoByParam(0,this.week,this.schoolTimeId,3).then(res => {
          let data = res.data.data;
          this.getSchoolNotAdoptPlanContentLists();
          this.id='';
         if(data.id){
             this.id=data.id;
            this.getWorkPlanInfoByIds();
         }else{
            this.getTermWeekAllDateLists()
         } 
        })
        .catch(err => {});
    },
    //如果没有id获取数据
    getTermWeekAllDateLists(){
      getTermWeekAllDateList(this.schoolTimeId, this.week)
        .then(res => {
          let data = res.data.data;
          this.datalist=[]; 
          this.state=1;   
          this.datalist.push({dayName:this.userInfo.schoolId==1664?'全周工作':'重点工作',dayDate:'',dayPlanList:[]})      
          for(let i=0;i<data.length;i++){
            this.datalist.push({dayName:data[i].dayName,dayDate:data[i].schoolTimeDate,dayPlanList:[]})
          }   
          this.datalist.push({dayName:'外出计划',dayDate:'',dayPlanList:[]})       
        })
        .catch(err => {});
    },
    //如果有id获取数据
    getWorkPlanInfoByIds(){
      getWorkPlanInfoById(this.id)
        .then(res => {
          let data = res.data.data;
          this.datalist=data.planContentList;  
          if(data.remarks){
             this.remarks=data.remarks;
          }
          // if(data.mainWorks){
          //     this.mainWorks=data.mainWorks;
          // }   
          this.state=data.state;    
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
          this.myisnum=dayNo;
          this.popname='添加'
          this.dialogVisible=true;
          this.query.dayDate=dayDate;
          this.query.dayNo=dayNo!=8?dayNo:0;
          this.query.content='';
          this.query.outEndDate='';  
          this.query.outPlace=''; 
          this.query.outStartDate=''; 
          this.query.departmentId=this.departmentlist[0].id
          this.query.title='';  
          this.query.place='';
          this.query.timeType=-1;
          this.query.startTime='08:00';
          this.query.endTime='';
          this.addressData= {userJson: [this.$store.state.user.userInfo]};
          this.query.checked=false;
    },
    dialogVisiblefuneidt(obj,indexs){
          this.num=2;
          this.myisnum=indexs;
          this.popname='编辑'
          this.dialogVisible=true;
          this.query.content=obj.content;
          this.query.id=obj.id;
           this.query.departmentId=obj.departmentId
            this.query.place=obj.place||'';
          this.query.timeType=obj.timeType||-1;
          this.query.startTime=obj.startTime||'08:00';
          this.query.endTime=obj.endTime||'';
          if(indexs==8){
            this.query.outEndDate=obj.outEndDate;  
            this.query.outPlace=obj.outPlace; 
            this.query.outStartDate=obj.outStartDate; 
            this.query.title=obj.title;
          }          
          if(obj.isSuper==2){
            this.query.checked=true;
            this.query.mychecked=true;
          }else{
            this.query.checked=false;
            this.query.mychecked=false;
          }
          if(indexs){
             this.addressData= {userJson: JSON.parse(obj.principalJson)};
          }         
    },
    //新增
    addWorkPlanContents(){     
         if(this.id){
            this.query.planId=this.id;
          }else{
            this.query.planId=0; 
          }
        if((!this.query.title)&&(this.myisnum==8)){ 
          this.$message.error('请输入外出主题！');
          return;
        }
        if((this.addressData.userJson.length==0)&&(this.myisnum!=8)){ 
          this.$message.error('请选择参与人！');
          return;
        }
        //   if(!this.query.place&&(this.myisnum!=8&&this.myisnum!=0)){
        //   this.$message.error('请选择地点');
        //   return;
        // }
        if((this.addressData.userJson.length==0)&&(this.myisnum==8)){ 
          this.$message.error('请选择外出人员！');
          return;
        }  
        if(this.myisnum==8){
           if(!(this.query.outStartDate&&this.query.outEndDate)){ 
               this.$message.error('外出开始时间结束时间不能为空！');
               return;
           } 
           this.query.outStartDate=this.$moment(this.query.outStartDate).format('YYYY-MM-DD HH:mm');
           this.query.outEndDate=this.$moment(this.query.outEndDate).format('YYYY-MM-DD HH:mm');
           if((this.query.outStartDate>this.query.outEndDate)||(this.query.outStartDate==this.query.outEndDate)){ 
               this.$message.error('外出开始时间不能大于等于结束时间！');
               return;
           } 
        } 
        if(this.query.timeType==4&&this.query.endTime&&((this.query.startTime>this.query.endTime)||(this.query.startTime==this.query.endTime))){ 
               this.$message.error('具体开始时间不能大于等于具体结束时间！');
               return;
           } 
        if(!(this.query.content.trim())){
          this.$message.error('请输入计划！');
          return;
        }    
        if((!this.query.outPlace)&&(this.myisnum==8)){ 
          this.$message.error('请输入外出地点！');
          return;
        }      
        for (let item of this.departmentlist) {
          if ( this.query.departmentId == item.id) {
            this.query.department=item.name;
          }
        }
        if(this.query.checked){
          this.query.isSuper=2;
        }else{
          this.query.isSuper=0;
        }
         this.query.planType=0;
        if(this.myisnum==8){
          this.query.planType=1;
        }
        if(this.myisnum==0){
          this.query.principalJson='';
          this.query.planType=-1;
        }else{
           this.query.principalJson=JSON.stringify(this.addressData.userJson);
        }
        
        this.query.planWeek=this.week;
       if(this.num==1){
         this.query.userIdStr='';
         for(let i=0;i<this.addressData.userJson.length;i++){
          if(i<this.addressData.userJson.length-1){
             this.query.userIdStr+=(this.addressData.userJson[i].id+',');
          }else{
            this.query.userIdStr+=this.addressData.userJson[i].id;
          }
         }
         if(this.myisnum==8){
         weekPlanAddCalendar(this.query).then(res=>res.data).then(data=>{
        if(data.code==200){
            if(data.result){
            
            }else{
                this.$message.error(data.msg);
            }
         }
         })
         }
         addWorkPlanContent(this.query).then(res=>res.data).then(data=>{
        if(data.code==200){
            if(data.result){
             this.$message({ message: "添加成功!",type: "success",duration: 1000});
            }else{
                this.$message.error(data.msg);
            }
            this.dialogVisible=false;
            this.getWorkPlanInfoByParams();
         }else{
            this.$message.error(data.msg);
            this.dialogVisible=false;
         }
         })
       }else{
           editWorkPlanContent(this.query).then(res=>res.data).then(data=>{
              if(data.code==200){
                  if(data.result){
                      this.$message({ message: "编辑成功!",type: "success",duration: 1000});
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
  .el-date-editor.el-input{
    width:292px;
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
    .body-box{
        width: 1040px;
        margin: 0 auto;
    }  
    .right-box{
        border: 1px #e7eaec solid;       
        float: right;
        width: 280px;
        margin: 0 10px;
        .el-tag{
          cursor:pointer;
        }
        .right-box-top{
          font-size: 16px;
          text-align: center;
          border-bottom: 1px solid #e7eaec;
          padding: 6px;
          line-height: 28px;
          color:#606266;
        }
        .ul{
            padding:10px;
            color:#606266;
            overflow: auto;
            .bumen-name{
              font-size: 16px;
              line-height: 20px;
              height: 20px;
              margin: 5px 0 15px 0;
              padding-left: 10px;
              border-left: 3px solid #409EFF;
              .el-button{
                margin-left: 10px;
              }
            }
            .li{
             border:1px #e7eaec solid;
             border-radius: 3px;
             padding: 5px;  
             font-size: 12px;
             margin: 10px 0;
             div{
                 margin: 10px 0;
                 span{
                     float: right;
                 }
             }
             .tag-box{
               overflow: hidden;
               span{
                float: none;
               }
             }
             .li-name{
               color: #909399;
               margin: 15px 0;
             }
            }
        }
    }
    .body{
        width: 710px;
        float: left;
        overflow: auto;
        .subject-top {
          line-height: 36px;
          margin: 10px auto;
          font-size: 14px;
          color: #303133;
          .subject-top-box{
              position: relative;
                padding:5px 0 5px 50px;
                min-height: 50px;
                .el-select{
                width: 300px;
                margin-right: 30px;
                }
                .subject-top-box-name{
                position: absolute;
                left:0;
                top:0;
                line-height: 50px;
                width: 40px;
                text-align: right;
                span{
                    color:#F56C6C;
                }
                }
          }
        }
        .ul{
            overflow: auto;
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
                    color:#909399;
                    span{
                      color:#606266;
                      
                    }
                  }
                  .name{
                    width: 140px;
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
                    margin-left: 10px;
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