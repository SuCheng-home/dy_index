<template>
    <div class="stopgangsettings">
        <div class="top">
            <back-tool>
                <el-button type="primary" @click="Preservation()" size="medium">保存</el-button>                
                <el-button type="primary" @click="initFireManages()" v-if="newquery.isSameSch==1"  size="medium">初始化停伙时间</el-button>
                <el-button type="primary"  size="medium" @click="initFireManageByGrouppop()" v-if="newquery.isSameSch==2" >初始化停伙时间</el-button>
            </back-tool>
        </div>
        <div :style="'height:' + (maxH-40) + 'px;overflow: auto;'">
            <el-form label-width="180px"  style="width:810px;margin:10px auto;">
                 <el-form-item label="推送时间">
                     <el-radio v-model="query.samePushDate" :label="0">相同推送时间</el-radio>
                     <el-radio v-model="query.samePushDate" :label="1">不同推送时间</el-radio>
                </el-form-item>  
                  <el-form-item label="供餐方式" v-if="type==3">
                     <el-radio v-model="query.isSameSch" :label="1">全校相同</el-radio>
                     <el-radio v-model="query.isSameSch" :label="2">按照年级</el-radio>
                     <span class="red" style="color:red">备注:按年级仅初中校可以选择</span>
                </el-form-item>  
                 <!-- <el-form-item label="">
                      <el-checkbox v-model="query.stuFire">学生停伙类型设置</el-checkbox>
                </el-form-item>   -->
                 <div v-if="query.stuFire">
                  <el-form-item label="学生餐次设置">
                    <el-checkbox v-model="query.lunch">午餐停伙</el-checkbox>
                    <el-checkbox v-model="query.stuBreakfast">早餐停伙</el-checkbox>
                    <el-checkbox v-model="query.breakMeal">课间餐停伙</el-checkbox>                    
                    <el-checkbox v-model="query.stuSupper">晚餐停伙</el-checkbox>
                   </el-form-item>                   
                 <el-form-item label="学生餐标设置" v-if="query.lunch||query.stuBreakfast||query.breakMeal||query.stuSupper">
                      <span  v-if="query.lunch">
                    <el-checkbox v-model="query.lunchCheck" >午餐</el-checkbox> 
                    <span v-if="query.lunchCheck"> <el-input-number v-model="query.lunchPrice"  size="mini" :precision="1" :step="0.1" :max='999'></el-input-number> 元</span>
                    </span>
                    <span  v-if="query.stuBreakfast">
                       <el-checkbox v-model="query.stuBreakfastCheck">早餐</el-checkbox> 
                       <span v-if="query.stuBreakfastCheck"><el-input-number v-model="query.stuBreakfastPrice"  size="mini" :precision="1" :step="0.1" :max='999'></el-input-number> 元</span>
                    </span>

                     <span  v-if="query.breakMeal">
                        <el-checkbox v-model="query.breakMealCheck">课间餐</el-checkbox> 
                        <span v-if="query.breakMealCheck"><el-input-number v-model="query.breakMealPrice"  size="mini" :precision="1" :step="0.1" :max='999'></el-input-number> 元</span>
                    </span>
                    
                    <span  v-if="query.stuSupper">
                        <el-checkbox v-model="query.stuSupperCheck">晚餐</el-checkbox> 
                        <span v-if="query.stuSupperCheck"><el-input-number v-model="query.stuSupperPrice"  size="mini" :precision="1" :step="0.1" :max='999'></el-input-number> 元</span>
                    </span>  
                </el-form-item>
                  <el-form-item label="学生停伙截至时间" v-if="query.samePushDate==0">
                    <el-select class="filter-item" v-model="query.stuFireDayState" size="medium">
                        <el-option  label="当天" :value="0"></el-option>
                        <el-option  label="提前一天" :value="1"></el-option>
                    </el-select>
                    <el-time-select :clearable="false" :editable="false"   v-model="query.stuFireDate" size="medium" :picker-options="{  start: '00:00',  step: '00:05',    end: '23:55'   }" placeholder="选择时间"></el-time-select>
                    </el-form-item>
                      <el-form-item label="学生停伙截至时间" v-if="query.samePushDate==1&&(query.lunch||query.stuBreakfast||query.breakMeal||query.stuSupper)">
                    <div v-if="query.lunch">
                        <span class="cbox">午餐</span>                       
                        <el-select class="filter-item" v-model="query.stuLunchPushState" size="medium">
                            <el-option  label="当天" :value="0"></el-option>
                            <el-option  label="提前一天" :value="1"></el-option>
                        </el-select>
                        <el-time-select :clearable="false" :editable="false"   v-model="query.stuLunchPushDate" size="medium" :picker-options="{  start: '00:00',  step: '00:05',    end: '23:55'   }" placeholder="选择时间"></el-time-select>
                    </div>
                    <div v-if="query.stuBreakfast">
                        <span class="cbox">早餐</span>                        
                        <el-select class="filter-item" v-model="query.stuBreakfastPushState" size="medium">
                            <el-option  label="当天" :value="0"></el-option>
                            <el-option  label="提前一天" :value="1"></el-option>
                        </el-select>
                        <el-time-select  :editable="false"   v-model="query.stuBreakfastPushDate" size="medium" :picker-options="{  start: '00:00',  step: '00:05',    end: '23:55'   }" placeholder="选择时间"></el-time-select>
                    </div>
                    <div v-if="query.breakMeal">                        
                        <span class="cbox">课间餐</span>
                        <el-select class="filter-item" v-model="query.breakMealPushState" size="medium">
                            <el-option  label="当天" :value="0"></el-option>
                            <el-option  label="提前一天" :value="1"></el-option>
                        </el-select>
                        <el-time-select  :clearable="false" :editable="false"   v-model="query.breakMealPushDate" size="medium" :picker-options="{  start: '00:00',  step: '00:05',    end: '23:55'   }" placeholder="选择时间"></el-time-select>
                    </div>
                    <div v-if="query.stuSupper">                        
                        <span class="cbox">晚餐</span>
                        <el-select class="filter-item" v-model="query.stuSupperPushState" size="medium">
                            <el-option  label="当天" :value="0"></el-option>
                            <el-option  label="提前一天" :value="1"></el-option>
                        </el-select>
                        <el-time-select  :editable="false"   v-model="query.stuSupperPushDate" size="medium" :picker-options="{  start: '00:00',  step: '00:05',    end: '23:55'   }" placeholder="选择时间"></el-time-select>
                    </div>                  
                </el-form-item>
                 <!-- <el-form-item label="提醒班主任确认学生停伙">
                     <el-radio v-model="query.remindHeadTeacher" :label="0">不提醒</el-radio>
                     <el-radio v-model="query.remindHeadTeacher" :label="1">提醒</el-radio>
                </el-form-item> -->
                 </div>

                   <!-- <el-form-item label="">
                      <el-checkbox v-model="query.thFire">老师停伙类型设置</el-checkbox>
                </el-form-item>   -->
                <div v-if="query.thFire">
                    <el-form-item label="老师停伙餐次设置">
                    <el-checkbox v-model="query.teacherLunch">午餐停伙</el-checkbox>
                    <el-checkbox v-model="query.breakfast">早餐停伙</el-checkbox>
                    <el-checkbox v-model="query.supper">晚餐停伙</el-checkbox>
					<el-checkbox v-model="query.teacherMilk">牛奶</el-checkbox>
                </el-form-item>    
                 <el-form-item label="老师餐标设置" v-if="query.teacherLunch||query.breakfast||query.supper">     
                      <span  v-if="query.teacherLunch">
                        <el-checkbox v-model="query.teacherLunchCheck" >午餐</el-checkbox>                    
                        <span v-if="query.teacherLunchCheck"><el-input-number v-model="query.teacherLunchPrice"  size="mini" :precision="1" :step="0.1" :max='999'></el-input-number> 元                   
                   </span>
                    </span> 
                    
                      <span  v-if="query.breakfast">
                        <el-checkbox v-model="query.breakfastCheck">早餐</el-checkbox>                    
                        <span v-if="query.breakfastCheck"><el-input-number v-model="query.breakfastPrice"  size="mini" :precision="1" :step="0.1" :max='999'></el-input-number> 元</span>
                    </span>
                     
                    <span  v-if="query.supper">
                        <el-checkbox v-model="query.supperCheck">晚餐</el-checkbox> 
                        <span v-if="query.supperCheck"><el-input-number v-model="query.supperPrice"  size="mini" :precision="1" :step="0.1" :max='999'></el-input-number> 元</span>
                    </span>
                 </el-form-item>  
                 <el-form-item label="老师停伙截至时间"   v-if="query.samePushDate==0">
                    <el-select class="filter-item" v-model="query.teacherFireDayState" size="medium">
                        <el-option  label="当天" :value="0"></el-option>
                        <el-option  label="提前一天" :value="1"></el-option>
                    </el-select>
                    <el-time-select  :clearable="false" :editable="false"   v-model="query.teacherFireDate" size="medium"  :picker-options="{  start: '00:00',  step: '00:05',    end: '23:55'   }" placeholder="选择时间"></el-time-select>
                </el-form-item>              
                <el-form-item label="老师停伙截至时间" v-if="query.samePushDate==1&&(query.teacherLunch||query.breakfast||query.supper)">
                    <div v-if="query.teacherLunch">
                        <span class="cbox">午餐</span>                       
                        <el-select class="filter-item" v-model="query.teacherLunchPushState" size="medium">
                            <el-option  label="当天" :value="0"></el-option>
                            <el-option  label="提前一天" :value="1"></el-option>
                        </el-select>
                        <el-time-select  :clearable="false" :editable="false"   v-model="query.teacherLunchPushDate" size="medium" :picker-options="{  start: '00:00',  step: '00:05',    end: '23:55'   }" placeholder="选择时间"></el-time-select>
                    </div>
                    <div v-if="query.breakfast">
                        <span class="cbox">早餐</span>                        
                        <el-select class="filter-item" v-model="query.teacherBreakfastPushState" size="medium">
                            <el-option  label="当天" :value="0"></el-option>
                            <el-option  label="提前一天" :value="1"></el-option>
                        </el-select>
                        <el-time-select  :clearable="false" :editable="false"   v-model="query.teacherBreakfastPushDate" size="medium" :picker-options="{  start: '00:00',  step: '00:05',    end: '23:55'   }" placeholder="选择时间"></el-time-select>
                    </div>
                    <div v-if="query.supper">                        
                        <span class="cbox">晚餐</span>
                        <el-select class="filter-item" v-model="query.teacherSupperPushState" size="medium">
                            <el-option  label="当天" :value="0"></el-option>
                            <el-option  label="提前一天" :value="1"></el-option>
                        </el-select>
                        <el-time-select  :editable="false"   v-model="query.teacherSupperPushDate" size="medium" :picker-options="{  start: '00:00',  step: '00:05',    end: '23:55'   }" placeholder="选择时间"></el-time-select>
                    </div>                  
                </el-form-item>  
                </div>
                             
            </el-form>
        </div>
        <el-dialog title="初始化停伙时间" :visible.sync="dialogTableVisible" :close-on-press-escape='false' :close-on-click-modal='false' :modal-append-to-body='false' >
        <el-form label-width="140px">
                 <el-form-item label="老师停伙">
                      <el-checkbox-group v-model="mealTypes" >
                          <el-checkbox v-if="newquery.breakfast==1"  disabled :label="0">早餐停伙</el-checkbox>
                          <el-checkbox v-if="newquery.teacherLunch==1" disabled :label="1">午餐停伙</el-checkbox>
                           <el-checkbox v-if="newquery.supper==1" disabled :label="3">晚餐停伙</el-checkbox>
                      </el-checkbox-group>
                </el-form-item> 
                 <el-form-item :label="item.name+'学生停伙'" v-for="item in gradeList" :key="item.id">
                        <el-checkbox-group v-model="item.mealTypes"  >
                                    <el-checkbox v-if="newquery.stuBreakfast==1"  :label="0">早 餐 停 伙</el-checkbox>
                                    <el-checkbox v-if="newquery.breakMeal==1"  :label="2">课间餐停伙</el-checkbox>
                                    <el-checkbox v-if="newquery.lunch==1"  :label="1">午 餐 停 伙</el-checkbox>                                
                                    <el-checkbox v-if="newquery.stuSupper==1"  :label="3">晚 餐 停 伙</el-checkbox>                                 
                              </el-checkbox-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogTableVisible = false">取 消</el-button>
                <el-button type="primary" @click="initFireManageByGroup">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import {getFireSet, insertOrEditFireSet,judgeInitFire} from "@/api/fire";
    import {initFireManage,initFireManageByGroup} from "@/api/eatSetting";
    import {getSchoolGradeClass} from "@/api/common/common"
    //	返回按钮
    import BackTool from "@/components/BackTool";
	import mixin from '@/mixins/windowResize'
    export default {
        name: "stopgangsettings",
        //引入返回模块
        components: {
            BackTool
        },
        data: function() {
            return {
                mealTypes:[],
                query: {
                    samePushDate:0,
                    teacherMilk:false,//	教师牛奶，1代表有牛奶，0代表无牛奶	number
                    supper:"",//	晚餐，0无晚餐，1有晚餐	number
                    schoolId:"",//	学校id	number	
                    stuFireDate:"",//	学生停伙时间	string	
                    stuFireDayState:"",//	,学生停伙标示天，0代表当天，1代表提前一天	number                   
                    teacherFireDate:"",//	教师停伙时间	string	
                    teacherFireDayState:"",//	教师停伙标示天，0代表当天，1代表提前一天	number
                    lunch:true,//	午餐，1代表有午餐，0代表无午餐	number	
                    lunchCheck:true,//	学生午餐餐标，1代表有午餐，0代表无午餐	number	
                    lunchPrice:"",//	学生午餐价位	string
                    breakMeal:"",//	课间餐，1代表有课间餐，0代表无课间餐	number	
                    breakMealCheck:"",//	课间餐餐标，1代表有课间餐，0代表无课间餐	number	
                    breakMealPrice:"",//	课间餐价位	string	
                    stuBreakfast:"",//	学生早餐，1代表有早餐，0代表无早餐	number	
                    stuBreakfastCheck:"",//	学生早餐餐标，1代表有早餐，0代表无早餐	number	
                    stuBreakfastPrice:"",//	学生早餐价位	number	 
                    stuSupper:"",//	学生晚餐，1代表有晚餐，0代表无晚餐	number	
                    stuSupperCheck:"",//	学生晚餐餐标，1代表有晚餐，0代表无晚餐	number	
                    stuSupperPrice:"",//	学生晚餐价位	number
                    teacherLunch:true,//	教师午餐，1代表有午餐，0代表无午餐	number
                    teacherLunchCheck:true,//	教师午餐餐标，1代表有午餐，0代表无午餐	number	
                    teacherLunchPrice:"",//	教师午餐餐标	string	
                    breakfast:"",//	早餐，1代表有早餐，0代表无早餐	number	
                    breakfastCheck:"",//	早餐餐标，1代表有早餐，0代表无早餐	number	
                    breakfastPrice:"",//	早餐价位	string	     
                    supperPrice:"",
                    supperCheck:"",
                    remindHeadTeacher:0,  
                     samePushDate:0,
                    breakMealPushState:0,
                    breakMealPushDate:'',
                    stuLunchPushState:0,
                    stuLunchPushDate:'',
                    teacherLunchPushState:0,
                    teacherLunchPushDate:'',
                    teacherBreakfastPushState:0,
                    teacherBreakfastPushDate:'',
                    teacherSupperPushState:0,
                    teacherSupperPushDate:'',
                    stuBreakfastPushState:0,
                    stuBreakfastPushDate:'',
                    stuSupperPushState:0,
                    stuSupperPushDate:'',
                    thFire:true,
                    stuFire:true,
                    isSameSch:1,
                    limitDayCountTh:0      
                },
                isdisabled:true,
                type:this.$store.getters.schoolInfo.type,
                newquery:{
                    isSameSch:1
                },
                gradeList:[],
                 dialogTableVisible: false,
            };
        },
			mixins: [mixin],
        //获取渲染数据当数据加载完成后执行(生命周期中的钩子函数)
        created() {
            this.getFireSets();
            judgeInitFire().then(res => {
                    let data = res.data.data;
                   this.isdisabled=data;
                }).catch();
        },
        methods: {
            initFireManageByGroup(){
              let list=[]
              list.push({
                  gradeName:'',
                  gradeId:0,
                  fireType:1,
                  mealTypes:this.mealTypes.join(',')
              })
              for(let i=0;i<this.gradeList.length;i++){
                  list.push({
                  gradeName:this.gradeList[i].name,
                  gradeId:this.gradeList[i].id,
                  fireType:2,
                  mealTypes:this.gradeList[i].mealTypes.join(',')
              })
              }
              this.$confirm('确定要初始化停伙时间吗？', '提示', {
                    type: 'success'
                }).then(() => {

                    initFireManageByGroup(list).then(res => {
                        if (res.data.result) {
                            this.$message({
                                type: 'success',
                                message: '初始化停伙时间成功!'
                            });
                             judgeInitFire().then(res => {
                    let data = res.data.data;
                   this.isdisabled=data;
                }).catch();
                            this.dialogTableVisible=false
                        }else{
                           this.$message.error(res.data.msg);
                        }
                    })
                }).catch(() => {
                });

            },
             initFireManageByGrouppop(){
                getFireSet().then(res => {
                    let data = res.data.data; 
                    this.newquery=data
                    this.dialogTableVisible=true
                    this.mealTypes=[]
                    if(this.newquery.breakfast==1){
                       this.mealTypes.push(0)
                    }
                    if(this.newquery.teacherLunch==1){
                       this.mealTypes.push(1)
                    }
                    if(this.newquery.supper==1){
                       this.mealTypes.push(3)
                    }
                }).catch();
            },
            getFireSets(){
                getFireSet().then(res => {
                    let data = res.data.data;                    
                    this.query.supper = data.supper == 1;
                    this.query.thFire = data.thFire == 1;
                    this.query.stuFire = data.stuFire == 1;
                    this.query.stuFireDayState = data.stuFireDayState;
                    this.query.teacherFireDayState = data.teacherFireDayState;
                    this.query.stuFireDate = data.stuFireDate;
                    this.query.teacherFireDate = data.teacherFireDate;
                    this.query.schoolId = data.schoolId;
                    this.query.lunchPrice = data.lunchPrice-0;  
                    this.query.breakMeal = data.breakMeal == 1;
                    this.query.breakMealCheck = data.breakMealCheck == 1;
                    this.query.breakMealPrice = data.breakMealPrice-0;
                    this.query.stuBreakfast = data.stuBreakfast == 1;
                    this.query.stuBreakfastCheck = data.stuBreakfastCheck == 1;
                    this.query.stuBreakfastPrice = data.stuBreakfastPrice-0;
                    this.query.stuSupper = data.stuSupper == 1;
                    this.query.stuSupperCheck = data.stuSupperCheck == 1;
                    this.query.stuSupperPrice = data.stuSupperPrice-0;
                    this.query.teacherLunchPrice = data.teacherLunchPrice-0; 
                    this.query.breakfast = data.breakfast == 1;
                    this.query.breakfastCheck = data.breakfastCheck == 1;
                    this.query.breakfastPrice = data.breakfastPrice-0;
                    this.query.supperCheck=data.supperCheck==1;
                    this.query.supperPrice=data.supperPrice;
                    this.query.remindHeadTeacher=data.remindHeadTeacher;
                    this.query.samePushDate=data.samePushDate;
                    this.query.breakMealPushState=data.breakMealPushState;
                    this.query.breakMealPushDate=data.breakMealPushDate;
                    this.query.stuLunchPushState=data.stuLunchPushState;
                    this.query.stuLunchPushDate=data.stuLunchPushDate;
                    this.query.teacherLunchPushState=data.teacherLunchPushState;
                    this.query.teacherLunchPushDate=data.teacherLunchPushDate;
                    this.query.teacherBreakfastPushState=data.teacherBreakfastPushState;
                    this.query.teacherBreakfastPushDate=data.teacherBreakfastPushDate;
                    this.query.teacherSupperPushState=data.teacherSupperPushState;
                    this.query.teacherSupperPushDate=data.teacherSupperPushDate;
                    this.query.stuBreakfastPushState=data.stuBreakfastPushState;
                    this.query.stuBreakfastPushDate=data.stuBreakfastPushDate;
                    this.query.stuSupperPushState=data.stuSupperPushState;
                    this.query.stuSupperPushDate=data.stuSupperPushDate;
                    this.query.lunch=data.lunch==1;
                    this.query.lunchCheck=data.lunchCheck==1;
                    this.query.teacherLunch=data.teacherLunch==1;
                    this.query.teacherLunchCheck=data.teacherLunchCheck==1;
					this.query.teacherMilk = data.teacherMilk == 1
                    this.query.isSameSch=data.isSameSch?(data.isSameSch-0):1;
                     this.newquery=data
                    if(this.query.isSameSch==2){
                          getSchoolGradeClass().then((res) => {
                        const data = res.data.data;
                        if (res.data.code === 200) {
                             for(let i=0;i<data.length;i++){
                               data[i].mealTypes=[]
                            }
                            this.gradeList = data;
                        }
                        }).catch(() => {
                        });
                    }
                }).catch();
            },
            Preservation(){ 
                if(!this.query.stuFireDate&&this.query.stuFire){
                    this.$message.error('请选择学生停伙截至时间！');
                    return;
                }
                if(!this.query.teacherFireDate&&this.query.thFire){
                    this.$message.error('请选择老师停伙截至时间！');
                    return;
                }
                 if(!this.query.stuFire){
                     this.query.stuSupper=false;
                     this.query.stuBreakfast=false;
                     this.query.breakMeal=false;
                     this.query.lunch=false;
                 }
                 if(!this.query.thFire){
                  this.query.teacherLunch=false;
                  this.query.supper=false;
                  this.query.breakfast=false;
                  this.query.remindHeadTeacher=0
                 }
                 let query={
                     stuFire:this.query.stuFire-0,
                     thFire:this.query.thFire-0,
                    teacherFireDate:this.query.teacherFireDate,
                    teacherFireDayState:this.query.teacherFireDayState,
                    stuFireDate:this.query.stuFireDate,
                    stuFireDayState:this.query.stuFireDayState,
                    teacherLunchPrice:this.query.teacherLunchPrice,
                    teacherLunch:this.query.teacherLunch? 1 : 0,
                    teacherLunchCheck:this.query.teacherLunch?(this.query.teacherLunchCheck? 1 : 0):0, 
					teacherMilk: this.query.teacherMilk ? 1 : 0,
                    schoolId:this.query.schoolId,
                    lunchPrice:this.query.lunchPrice,
                    lunch:this.query.lunch? 1 : 0,
                    lunchCheck:this.query.lunch?(this.query.lunchCheck? 1 : 0):0,
                    breakMeal:this.query.breakMeal ? 1 : 0,
                    breakMealCheck:this.query.breakMeal ? (this.query.breakMealCheck ? 1 : 0) : 0,
                    breakMealPrice:this.query.breakMealPrice,
                    stuBreakfast:this.query.stuBreakfast ? 1 : 0,
                    stuBreakfastCheck:this.query.stuBreakfast ? (this.query.stuBreakfastCheck ? 1 : 0) : 0,
                    stuBreakfastPrice:this.query.stuBreakfastPrice,
                    stuSupper:this.query.stuSupper ? 1 : 0,
                    stuSupperCheck:this.query.stuSupper ? (this.query.stuSupperCheck ? 1 : 0) : 0,
                    stuSupperPrice:this.query.stuSupperPrice, 
                    breakfast:this.query.breakfast ? 1 : 0,
                    breakfastCheck:this.query.breakfast ? (this.query.breakfastCheck ? 1 : 0) : 0,
                    breakfastPrice:this.query.breakfastPrice,
                    supper:this.query.supper ? 1 : 0,
                    supperPrice:this.query.supperPrice,
                    supperCheck:this.query.supper ? (this.query.supperCheck ? 1 : 0) : 0,
                    remindHeadTeacher:this.query.remindHeadTeacher,                     
                    samePushDate:this.query.samePushDate,
                    breakMealPushState:this.query.breakMealPushState,
                    breakMealPushDate:this.query.breakMealPushDate,
                    stuLunchPushState:this.query.stuLunchPushState,
                    stuLunchPushDate:this.query.stuLunchPushDate,
                    teacherLunchPushState:this.query.teacherLunchPushState,
                    teacherLunchPushDate:this.query.teacherLunchPushDate,
                    teacherBreakfastPushState:this.query.teacherBreakfastPushState,
                    teacherBreakfastPushDate:this.query.teacherBreakfastPushDate,
                    teacherSupperPushState:this.query.teacherSupperPushState,
                    teacherSupperPushDate:this.query.teacherSupperPushDate,
                    stuBreakfastPushState:this.query.stuBreakfastPushState,
                    stuBreakfastPushDate:this.query.stuBreakfastPushDate,
                    stuSupperPushState:this.query.stuSupperPushState,
                    stuSupperPushDate:this.query.stuSupperPushDate,
                    isSameSch:this.query.isSameSch,
                    limitDayCountTh:this.query.limitDayCountTh,
                    isBatchSt:2,
                    isRemindManTh:2,
                    remindManUserJsonTh:"[]"
                }
                insertOrEditFireSet(query).then(res => {
                    if (res.data.code === 200) {
                        this.$message({     type: 'success',  message: '操作成功!'  });                       
                        this.$router.back();
                    }
                }).catch();
            },
            //初始
            initFireManages() {
                this.$confirm('确定要初始化停伙时间吗？', '提示', {
                    type: 'success'
                }).then(() => {

                    initFireManage().then(res => {
                        if (res.data.code === 200) {
                            this.$message({
                                type: 'success',
                                message: '初始化停伙时间成功!'
                            });
                        }
                    })
                }).catch(() => {
                });

            }
        }
    };
</script>
<style scoped>
    .stopgangsettings {
        padding:12px;
    }
    .stopgangsettings .el-checkbox {
        min-width: 70px;
        margin-left: 15px;
        margin-right: 0;
    }
   .stopgangsettings .el-input-number--mini {
    width: 95px;
}
.cbox{
    float: left;
    width: 60px;
    text-align: right;
    padding-right: 10px;
        color: #606266;
}
</style>
