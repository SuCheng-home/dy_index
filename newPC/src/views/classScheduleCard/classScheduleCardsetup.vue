<template>
<div class="classScheduleCardsetup"  >
     <div class="top"> 
         <el-button @click="$router.go(-1)" type="default" size="medium">返回</el-button> 
         <el-button type="primary" size="medium" @click="insertOrUpdateClassScheduleSets()">确定</el-button> 
      </div>
     <div class="subject" :style="`height: ${windowHeight-160}px;`">
        <div class="top-list">
            <div class="red">若更改单双周设置，将清空学校所有课程表数据，请慎重设置</div>
            <div class="box-num">
                <el-checkbox v-model="morning" @change="changefun()">早自习</el-checkbox>
                <el-select v-model="numobj.morning" size="mini" @change="changefun()">
                    <el-option key="1" label="1" value="1"></el-option>
                    <el-option key="2" label="2" value="2"></el-option>
                    <el-option key="3" label="3" value="3"></el-option>
                    <el-option key="4" label="4" value="4"></el-option>
                    <el-option key="5" label="5" value="5"></el-option>
                </el-select>
            </div>
            <div class="box-num">
                <el-checkbox v-model="forenoon" @change="changefun()">上午</el-checkbox>
                <el-select v-model="numobj.forenoon" size="mini" @change="changefun()">
                    <el-option key="1" label="1" value="1"></el-option>
                    <el-option key="2" label="2" value="2"></el-option>
                    <el-option key="3" label="3" value="3"></el-option>
                    <el-option key="4" label="4" value="4"></el-option>
                    <el-option key="5" label="5" value="5"></el-option>
                </el-select>
            </div>
            <div class="box-num">
                <el-checkbox v-model="noon" @change="changefun()">午自习</el-checkbox>
                <el-select v-model="numobj.noon" size="mini" @change="changefun()">
                    <el-option key="1" label="1" value="1"></el-option>
                    <el-option key="2" label="2" value="2"></el-option>
                    <el-option key="3" label="3" value="3"></el-option>
                    <el-option key="4" label="4" value="4"></el-option>
                    <el-option key="5" label="5" value="5"></el-option>
                </el-select>
            </div>
            <div class="box-num">
                <el-checkbox v-model="afternoon" @change="changefun()">下午</el-checkbox>
                <el-select v-model="numobj.afternoon" size="mini" @change="changefun()">
                    <el-option key="1" label="1" value="1"></el-option>
                    <el-option key="2" label="2" value="2"></el-option>
                    <el-option key="3" label="3" value="3"></el-option>
                    <el-option key="4" label="4" value="4"></el-option>
                    <el-option key="5" label="5" value="5"></el-option>
                </el-select>
            </div>
            <div class="box-num">
                <el-checkbox v-model="night" @change="changefun()">晚自习</el-checkbox>
                <el-select v-model="numobj.night" size="mini" @change="changefun()">
                    <el-option key="1" label="1" value="1"></el-option>
                    <el-option key="2" label="2" value="2"></el-option>
                    <el-option key="3" label="3" value="3"></el-option>
                    <el-option key="4" label="4" value="4"></el-option>
                    <el-option key="5" label="5" value="5"></el-option>
                </el-select>
            </div>
            <div class="box-num">
                <el-checkbox v-model="singleDouble">单双周不同</el-checkbox>
            </div>
            <div class="box-num" style="    width: 215px;">
                每周上课
               <el-radio v-model="weekDayCount" @change="changefun()" :label="5">五天</el-radio>
               <el-radio v-model="weekDayCount" @change="changefun()" :label="7">七天</el-radio>
            </div>
        </div>
        <table cellpadding="0"  cellspacing="0">
				<tbody>
                   <tr>
					<th style="width:150px"><img class="img" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/classScheduleCard/kcbone.png" alt=""></th>
					<th>星期一</th>
					<th>星期二</th>
					<th>星期三</th>
					<th>星期四</th>
					<th>星期五</th>
                    <th v-if="weekDayCount==7">星期六</th>
                    <th v-if="weekDayCount==7">星期日</th>
				 </tr>				
					<tr :key="indexs" v-for="(items,indexs) in morningScheduleCurrListList">						
						<td :rowspan="morningScheduleCurrListList.length" v-if="indexs==0">早自习</td>	
						<td class="td">
                            <div class="box">
                                <div :key="index" v-for="(item,index) in items[0]">{{item.currName}}</div>                              
                            </div>
                        </td>
                        <td class="td">
                            <div class="box">
                                <div :key="index" v-for="(item,index) in items[1]">{{item.currName}}</div>                              
                            </div>
                        </td>
                        <td class="td">
                            <div class="box">
                                <div :key="index" v-for="(item,index) in items[2]">{{item.currName}}</div>                              
                            </div>
                        </td>
                        <td class="td">
                            <div class="box">
                                <div :key="index" v-for="(item,index) in items[3]">{{item.currName}}</div>                              
                            </div>
                        </td>
                        <td class="td">
                            <div class="box">
                                <div :key="index" v-for="(item,index) in items[4]">{{item.currName}}</div>                              
                            </div>
                        </td>
                         <td class="td" v-if="weekDayCount==7">
                            <div class="box">
                                <div :key="index" v-for="(item,index) in items[5]">{{item.currName}}</div>                              
                            </div>
                        </td>
                         <td class="td" v-if="weekDayCount==7">
                            <div class="box">
                                <div :key="index" v-for="(item,index) in items[6]">{{item.currName}}</div>                              
                            </div>
                        </td>
					</tr>
                    <tr :key="indexs" v-for="(items,indexs) in forenoonScheduleCurrListList">						
						<td :rowspan="forenoonScheduleCurrListList.length" v-if="indexs==0">上午</td>	
						<td class="td">
                            <div class="box">
                                <div :key="index" v-for="(item,index) in items[0]">{{item.currName}}</div>                              
                            </div>
                        </td>
                        <td class="td">
                            <div class="box">
                                <div :key="index" v-for="(item,index) in items[1]">{{item.currName}}</div>                              
                            </div>
                        </td>
                        <td class="td">
                            <div class="box">
                                <div :key="index" v-for="(item,index) in items[2]">{{item.currName}}</div>                              
                            </div>
                        </td>
                        <td class="td">
                            <div class="box">
                                <div :key="index" v-for="(item,index) in items[3]">{{item.currName}}</div>                              
                            </div>
                        </td>
                        <td class="td">
                            <div class="box">
                                <div :key="index" v-for="(item,index) in items[4]">{{item.currName}}</div>                              
                            </div>
                        </td>
                         <td class="td" v-if="weekDayCount==7">
                            <div class="box">
                                <div :key="index" v-for="(item,index) in items[5]">{{item.currName}}</div>                              
                            </div>
                        </td>
                         <td class="td" v-if="weekDayCount==7">
                            <div class="box">
                                <div :key="index" v-for="(item,index) in items[6]">{{item.currName}}</div>                              
                            </div>
                        </td>
					</tr>
                    <tr :key="indexs" v-for="(items,indexs) in noonScheduleCurrListList">						
						<td :rowspan="noonScheduleCurrListList.length" v-if="indexs==0">午自习</td>	
						<td class="td">
                            <div class="box">
                                <div :key="index" v-for="(item,index) in items[0]">{{item.currName}}</div>                              
                            </div>
                        </td>
                        <td class="td">
                            <div class="box">
                                <div :key="index" v-for="(item,index) in items[1]">{{item.currName}}</div>                              
                            </div>
                        </td>
                        <td class="td">
                            <div class="box">
                                <div :key="index" v-for="(item,index) in items[2]">{{item.currName}}</div>                              
                            </div>
                        </td>
                        <td class="td">
                            <div class="box">
                                <div :key="index" v-for="(item,index) in items[3]">{{item.currName}}</div>                              
                            </div>
                        </td>
                        <td class="td">
                            <div class="box">
                                <div :key="index" v-for="(item,index) in items[4]">{{item.currName}}</div>                              
                            </div>
                        </td>
                         <td class="td" v-if="weekDayCount==7">
                            <div class="box">
                                <div :key="index" v-for="(item,index) in items[5]">{{item.currName}}</div>                              
                            </div>
                        </td>
                         <td class="td" v-if="weekDayCount==7">
                            <div class="box">
                                <div :key="index" v-for="(item,index) in items[6]">{{item.currName}}</div>                              
                            </div>
                        </td>
					</tr>
                    <tr :key="indexs" v-for="(items,indexs) in afternoonScheduleCurrListList">						
						<td :rowspan="afternoonScheduleCurrListList.length" v-if="indexs==0">下午</td>	
						<td class="td">
                            <div class="box">
                                <div :key="index" v-for="(item,index) in items[0]">{{item.currName}}</div>                              
                            </div>
                        </td>
                        <td class="td">
                            <div class="box">
                                <div :key="index" v-for="(item,index) in items[1]">{{item.currName}}</div>                              
                            </div>
                        </td>
                        <td class="td">
                            <div class="box">
                                <div :key="index" v-for="(item,index) in items[2]">{{item.currName}}</div>                              
                            </div>
                        </td>
                        <td class="td">
                            <div class="box">
                                <div :key="index" v-for="(item,index) in items[3]">{{item.currName}}</div>                              
                            </div>
                        </td>
                        <td class="td">
                            <div class="box">
                                <div :key="index" v-for="(item,index) in items[4]">{{item.currName}}</div>                              
                            </div>
                        </td>
                         <td class="td" v-if="weekDayCount==7">
                            <div class="box">
                                <div :key="index" v-for="(item,index) in items[5]">{{item.currName}}</div>                              
                            </div>
                        </td>
                         <td class="td" v-if="weekDayCount==7">
                            <div class="box">
                                <div :key="index" v-for="(item,index) in items[6]">{{item.currName}}</div>                              
                            </div>
                        </td>
					</tr>
                    <tr :key="indexs" v-for="(items,indexs) in nightScheduleCurrListList">						
						<td :rowspan="nightScheduleCurrListList.length" v-if="indexs==0">晚自习</td>	
						<td class="td">
                            <div class="box">
                                <div :key="index" v-for="(item,index) in items[0]">{{item.currName}}</div>                              
                            </div>
                        </td>
                        <td class="td">
                            <div class="box">
                                <div :key="index" v-for="(item,index) in items[1]">{{item.currName}}</div>                              
                            </div>
                        </td>
                        <td class="td">
                            <div class="box">
                                <div :key="index" v-for="(item,index) in items[2]">{{item.currName}}</div>                              
                            </div>
                        </td>
                        <td class="td">
                            <div class="box">
                                <div :key="index" v-for="(item,index) in items[3]">{{item.currName}}</div>                              
                            </div>
                        </td>
                        <td class="td">
                            <div class="box">
                                <div :key="index" v-for="(item,index) in items[4]">{{item.currName}}</div>                              
                            </div>
                        </td>
                        <td class="td" v-if="weekDayCount==7">
                            <div class="box">
                                <div :key="index" v-for="(item,index) in items[5]">{{item.currName}}</div>                              
                            </div>
                        </td>
                         <td class="td" v-if="weekDayCount==7">
                            <div class="box">
                                <div :key="index" v-for="(item,index) in items[6]">{{item.currName}}</div>                              
                            </div>
                        </td>
					</tr>
			</tbody>
        </table>
     </div>
</div> 
</template>
<script>
import {classScheduleSet,insertOrUpdateClassScheduleSet} from "@/api/classScheduleCard";
import mixin from "@/mixins/windowResize";
import {mapGetters} from 'vuex';
export default {
  data() {
    return {
      afternoonScheduleCurrListList:[],
      forenoonScheduleCurrListList:[],
      morningScheduleCurrListList:[],
      nightScheduleCurrListList:[],
      noonScheduleCurrListList:[],
      afternoon:false,//	下午	number	
      forenoon:false,//	上午	number	
      morning:false,//	早上	number	
      night:false,//	晚上	number	
      noon:false,//	中午	number	
      schoolId:false,//	学校id	number	
      singleDouble:false,//	是否单双周,0不是,1是	number
      numobj:{
        afternoon:1,//	下午	number	
        forenoon:1,//	上午	number	
        morning:1,//	早上	number	
        night:1,//	晚上	number	
        noon:1,//	中午	number	
      },
      weekDayCount:5
    };
  },
  mixins: [mixin],
  created() {    
    this.classScheduleSets();
  },
  computed: {
    ...mapGetters(['schoolInfo']),
  },
  methods: {
    //切换
    changefun(){
        this.morningScheduleCurrListList=[];
        if((this.numobj.morning>0)&&this.morning){
             for(let i=0;i<this.numobj.morning;i++){
                 this.morningScheduleCurrListList.push(this.weekDayCount==5?[[],[],[],[],[]]:[[],[],[],[],[],[],[]])
             }
         }
        this.forenoonScheduleCurrListList=[];
        if((this.numobj.forenoon>0)&&this.forenoon){
             for(let i=0;i<this.numobj.forenoon;i++){
                 this.forenoonScheduleCurrListList.push(this.weekDayCount==5?[[],[],[],[],[]]:[[],[],[],[],[],[],[]])
             }
         }
        this.noonScheduleCurrListList=[];
        if((this.numobj.noon>0)&&this.noon){
             for(let i=0;i<this.numobj.noon;i++){
                 this.noonScheduleCurrListList.push(this.weekDayCount==5?[[],[],[],[],[]]:[[],[],[],[],[],[],[]])
             }
         }
        this.afternoonScheduleCurrListList=[];
        if((this.numobj.afternoon>0)&&this.afternoon){
             for(let i=0;i<this.numobj.afternoon;i++){
                 this.afternoonScheduleCurrListList.push(this.weekDayCount==5?[[],[],[],[],[]]:[[],[],[],[],[],[],[]])
             }
         }
        this.nightScheduleCurrListList=[];
        if((this.numobj.night>0)&&this.night){
             for(let i=0;i<this.numobj.night;i++){
                 this.nightScheduleCurrListList.push(this.weekDayCount==5?[[],[],[],[],[]]:[[],[],[],[],[],[],[]])
             }
         }
    },
    //获取设置
    classScheduleSets() {
      classScheduleSet(this.schoolInfo.id)
        .then(res => res.data)
        .then(data => {
          let mydata = data.data;
          this.weekDayCount=mydata.weekDayCount-0;
          this.singleDouble=(mydata.singleDouble>0);
         if(mydata.morning>0){
             this.morning=true;
             this.numobj.morning=mydata.morning;
             for(let i=0;i<mydata.morning;i++){
                 this.morningScheduleCurrListList.push(this.weekDayCount==5?[[],[],[],[],[]]:[[],[],[],[],[],[],[]])
             }
         }
         if(mydata.forenoon>0){
             this.forenoon=true;
             this.numobj.forenoon=mydata.forenoon;
             for(let i=0;i<mydata.forenoon;i++){
                 this.forenoonScheduleCurrListList.push(this.weekDayCount==5?[[],[],[],[],[]]:[[],[],[],[],[],[],[]])
             }
         }
         if(mydata.noon>0){
             this.noon=true;
             this.numobj.noon=mydata.noon;
             for(let i=0;i<mydata.noon;i++){
                 this.noonScheduleCurrListList.push(this.weekDayCount==5?[[],[],[],[],[]]:[[],[],[],[],[],[],[]])
             }
         }
         if(mydata.afternoon>0){
             this.afternoon=true;
             this.numobj.afternoon=mydata.afternoon;
             for(let i=0;i<mydata.afternoon;i++){
                 this.afternoonScheduleCurrListList.push(this.weekDayCount==5?[[],[],[],[],[]]:[[],[],[],[],[],[],[]])
             }
         }
         if(mydata.night>0){
             this.night=true;
             this.numobj.night=mydata.night;
             for(let i=0;i<mydata.night;i++){
                 this.nightScheduleCurrListList.push(this.weekDayCount==5?[[],[],[],[],[]]:[[],[],[],[],[],[],[]])
             }
         }
        });
    },
    //提交设置
    insertOrUpdateClassScheduleSets(){
        let obj={
                afternoon:0,//	下午	number	
                forenoon:0,//	上午	number	
                morning:0,//	早上	number	
                night:0,//	晚上	number	
                noon:0,//	中午	number	
                schoolId:this.schoolInfo.id,//	学校id	number	
                singleDouble:0,//	是否单双周,0不是,1是	number
                weekDayCount:this.weekDayCount
            };
        if(this.singleDouble){
            obj.singleDouble=1
        }
        if(this.afternoon){
            obj.afternoon=this.numobj.afternoon;
        }
        if(this.forenoon){
            obj.forenoon=this.numobj.forenoon;
        }
        if(this.morning){
            obj.morning=this.numobj.morning;
        }
        if(this.night){
            obj.night=this.numobj.night;
        }
        if(this.noon){
            obj.noon=this.numobj.noon;
        }
        insertOrUpdateClassScheduleSet(obj).then(res => {
            if (res.data.code === 200) {
              this.$message.success("操作成功");
              this.$router.go(-1);
            } else {
              this.$message.error(res.data.msg);
            }
          });
    }
  }
};
</script>
<style scoped>
.classScheduleCardsetup .el-checkbox__label {
    padding-left: 3px;
    line-height: 28px;
}
</style>

<style scoped>
.classScheduleCardsetup {
  padding:12px;
}
* {
  box-sizing: border-box;
}
.top {
  border-bottom: 1px solid #e7eaec;
  padding-bottom: 10px;
}
.red{
    text-align: center;
    font-size:18px;
    color:red;
    line-height: 48px;
}
.subject {
  padding-top: 10px;
  overflow: auto;
}
.top-list {
  width:1050px;
  overflow: hidden;
  margin: 20px auto;
}
.top-list .box-num{
    float: left;
    width:135px;
}
.el-checkbox{
    margin: 0;
}
.el-select {
    width: 55px;
    padding: 0;
}
.el-input--suffix .el-input__inner {
    padding: 0 10px;
}
table {
  border-collapse: collapse;
  border: 1px solid #b3d8ff;
  width: 1050px;
  margin: 0 auto;
}
th {
    border: 1px solid #b3d8ff;
    text-align: center;
    font-size: 14px;
    line-height: 12px;
    height: 56px;
    overflow: hidden;
    background: #ecf5ff;
    color:#409EFF;
}
td {
  border: 1px solid #b3d8ff;
  text-align: center;
  font-size: 16px;
  background: #fff;
  padding: 15px 0;
}
.img{
    width: 145px;
    height: 52px;
    margin: 1px 2px 1px 1px;
}
.box{
    width: 130px;
    min-height: 16px;
    line-height: 16px;
    font-size: 13px;
}
</style>