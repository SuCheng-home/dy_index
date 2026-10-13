<template>
<div class="classScheduleCardadd"  >
     <div class="top"> 
         <el-button @click="$router.back()" type="default" size="medium">返回</el-button> 
         <el-select v-model="departId" placeholder="请选择班级" disabled size="medium" @change="queryTeacherCourseByClassIds()">
            <el-option  v-for="item in classlist"   :key="item.id" :label="item.name" :value="item.id"> </el-option>
        </el-select>
        <el-button type="primary" size="medium" @click="kaiqi(1)" >开启点击横向添加</el-button>
        <el-button type="primary" size="medium" @click="kaiqi(2)" >开启点击竖向添加</el-button>
        <el-button type="primary" size="medium" @click="kaiqi(0)" >关闭点击添加</el-button>
         <el-button type="primary" size="medium" @click="copyfun()" v-if="singleDouble">复制到双周</el-button>
         <el-button type="primary" size="medium" @click="updateClassSchedule()">保存</el-button>  
      </div>
     <div class="subject" :style="`height: ${nobottommaxH}px;`">
         <input type="hidden" name="mynum" v-model="mynum">
        <div class="body">
             <table cellpadding="0" cellspacing="0">
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
					           	<td class="td" :key="newindex" v-for="newindex in weekDayCount" draggable="true" @dragstart="onDragstart($event,1)"  @drop="onDrop(1,1,indexs,newindex,1)" @dragend="onDragend()" @dragover="onDragover($event)"> <!--  往哪拖,时间段,时间段内节次,周几,单双 -->
                            <div class="box">
                                <div class="td-right-box-li" :key="index" v-for="(item,index) in items[newindex-1]">
                                  <i class="el-icon-close" @click="deletefun(1,indexs,newindex,1,index)"></i><!--  时间段,时间段内节次,周几,单双,第几个-->
                                  <div class="right-box-li-currname">{{item.currName}}</div>
                                   <div class="right-box-li-name">{{item.teacherName}}</div>
                                </div>                              
                            </div>
                        </td>
                     
					</tr>
                    <tr :key="indexs" v-for="(items,indexs) in forenoonScheduleCurrListList">						
						<td :rowspan="forenoonScheduleCurrListList.length" v-if="indexs==0">上午</td>	
					    	<td class="td" :key="newindex" v-for="newindex in weekDayCount" draggable="true" @dragstart="onDragstart($event,1)"  @drop="onDrop(1,2,indexs,newindex,1)" @dragend="onDragend()" @dragover="onDragover($event)"> <!--  往哪拖,时间段,时间段内节次,周几,单双 -->
                            <div class="box" >
                                <div class="td-right-box-li" :key="index" v-for="(item,index) in items[newindex-1]">
                                  <i class="el-icon-close" @click="deletefun(2,indexs,newindex,1,index)"></i><!--  时间段,时间段内节次,周几,单双,第几个-->
                                  <div class="right-box-li-currname">{{item.currName}}</div>
                                   <div class="right-box-li-name">{{item.teacherName}}</div>
                                </div>                              
                            </div>
                 </td>
					</tr>
                    <tr :key="indexs" v-for="(items,indexs) in noonScheduleCurrListList">						
						<td :rowspan="noonScheduleCurrListList.length" v-if="indexs==0">午自习</td>	
					       	<td class="td" draggable="true" @dragstart="onDragstart($event,1)" :key="newindex" v-for="newindex in weekDayCount" @drop="onDrop(1,3,indexs,newindex,1)" @dragend="onDragend()" @dragover="onDragover($event)"> <!--  往哪拖,时间段,时间段内节次,周几,单双 -->
                            <div class="box" >
                                <div class="td-right-box-li" :key="index" v-for="(item,index) in items[newindex-1]">
                                  <i class="el-icon-close" @click="deletefun(3,indexs,newindex,1,index)"></i><!--  时间段,时间段内节次,周几,单双,第几个-->
                                  <div class="right-box-li-currname">{{item.currName}}</div>
                                   <div class="right-box-li-name">{{item.teacherName}}</div>
                                </div>                              
                            </div>
                        </td>
					</tr>
                    <tr :key="indexs" v-for="(items,indexs) in afternoonScheduleCurrListList">						
						<td :rowspan="afternoonScheduleCurrListList.length" v-if="indexs==0">下午</td>	
						<td class="td"  draggable="true" @dragstart="onDragstart($event,1)" :key="newindex" v-for="newindex in weekDayCount" @drop="onDrop(1,4,indexs,newindex,1)" @dragend="onDragend()" @dragover="onDragover($event)"> <!--  往哪拖,时间段,时间段内节次,周几,单双 -->
                            <div class="box">
                                <div class="td-right-box-li" :key="index" v-for="(item,index) in items[newindex-1]">
                                  <i class="el-icon-close" @click="deletefun(4,indexs,newindex,1,index)"></i><!--  时间段,时间段内节次,周几,单双,第几个-->
                                  <div class="right-box-li-currname">{{item.currName}}</div>
                                   <div class="right-box-li-name">{{item.teacherName}}</div>
                                </div>                              
                            </div>
                        </td>
					</tr>
                    <tr :key="indexs" v-for="(items,indexs) in nightScheduleCurrListList">						
						<td :rowspan="nightScheduleCurrListList.length" v-if="indexs==0">晚自习</td>	
						<td class="td" draggable="true" @dragstart="onDragstart($event,1)" :key="newindex" v-for="newindex in weekDayCount"  @drop="onDrop(1,5,indexs,newindex,1)" @dragend="onDragend()" @dragover="onDragover($event)"> <!--  往哪拖,时间段,时间段内节次,周几,单双 -->
                            <div class="box">
                                <div class="td-right-box-li" :key="index" v-for="(item,index) in items[newindex-1]">
                                  <i class="el-icon-close" @click="deletefun(5,indexs,newindex,1,index)"></i><!--  时间段,时间段内节次,周几,单双,第几个-->
                                  <div class="right-box-li-currname">{{item.currName}}</div>
                                   <div class="right-box-li-name">{{item.teacherName}}</div>
                                </div>                              
                            </div>
                        </td>
					</tr>
			</tbody>
           </table>
            <table cellpadding="0" cellspacing="0" v-show="singleDouble">
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
					<tr :key="indexs" v-for="(items,indexs) in twomorningScheduleCurrListList">						
						<td :rowspan="twomorningScheduleCurrListList.length" v-if="indexs==0">早自习</td>	
						           <td class="td"  draggable="true" @dragstart="onDragstart($event,1)"  @drop="onDrop(1,1,indexs,newindex,2)"  :key="newindex" v-for="newindex in weekDayCount" @dragend="onDragend()" @dragover="onDragover($event)"> <!--  往哪拖,时间段,时间段内节次,周几,单双 -->
                            <div class="box">
                                <div class="td-right-box-li" :key="index" v-for="(item,index) in items[newindex-1]">
                                  <i class="el-icon-close" @click="deletefun(1,indexs,newindex,2,index)"></i><!--  时间段,时间段内节次,周几,单双,第几个-->
                                  <div class="right-box-li-currname">{{item.currName}}</div>
                                   <div class="right-box-li-name">{{item.teacherName}}</div>
                                </div>                              
                            </div>
                        </td>
					</tr>
          <tr :key="indexs" v-for="(items,indexs) in twoforenoonScheduleCurrListList">						
						<td :rowspan="twoforenoonScheduleCurrListList.length" v-if="indexs==0">上午</td>	
						<td class="td" draggable="true" @dragstart="onDragstart($event,1)"  @drop="onDrop(1,2,indexs,newindex,2)" :key="newindex" v-for="newindex in weekDayCount" @dragend="onDragend()" @dragover="onDragover($event)"> <!--  往哪拖,时间段,时间段内节次,周几,单双 -->
                            <div class="box">
                                <div class="td-right-box-li" :key="index" v-for="(item,index) in items[newindex-1]">
                                  <i class="el-icon-close" @click="deletefun(2,indexs,newindex,2,index)"></i><!--  时间段,时间段内节次,周几,单双,第几个-->
                                  <div class="right-box-li-currname">{{item.currName}}</div>
                                   <div class="right-box-li-name">{{item.teacherName}}</div>
                                </div>                              
                            </div>
                        </td>                       
					</tr>
                    <tr :key="indexs" v-for="(items,indexs) in twonoonScheduleCurrListList">						
						<td :rowspan="twonoonScheduleCurrListList.length" v-if="indexs==0">午自习</td>	
						<td class="td"  draggable="true" @dragstart="onDragstart($event,1)"  @drop="onDrop(1,3,indexs,newindex,2)" :key="newindex" v-for="newindex in weekDayCount" @dragend="onDragend()" @dragover="onDragover($event)"> <!--  往哪拖,时间段,时间段内节次,周几,单双 -->
                            <div class="box">
                                <div class="td-right-box-li" :key="index" v-for="(item,index) in items[newindex-1]">
                                  <i class="el-icon-close" @click="deletefun(3,indexs,newindex,2,index)"></i><!--  时间段,时间段内节次,周几,单双,第几个-->
                                  <div class="right-box-li-currname">{{item.currName}}</div>
                                   <div class="right-box-li-name">{{item.teacherName}}</div>
                                </div>                              
                            </div>
                        </td>
					</tr>
                    <tr :key="indexs" v-for="(items,indexs) in twoafternoonScheduleCurrListList">						
						<td :rowspan="twoafternoonScheduleCurrListList.length" v-if="indexs==0">下午</td>	
						<td class="td"  draggable="true" @dragstart="onDragstart($event,1)"  @drop="onDrop(1,4,indexs,newindex,2)" :key="newindex" v-for="newindex in weekDayCount" @dragend="onDragend()" @dragover="onDragover($event)"> <!--  往哪拖,时间段,时间段内节次,周几,单双 -->
                            <div class="box">
                                <div class="td-right-box-li" :key="index" v-for="(item,index) in items[newindex-1]">
                                  <i class="el-icon-close" @click="deletefun(4,indexs,newindex,2,index)"></i><!--  时间段,时间段内节次,周几,单双,第几个-->
                                  <div class="right-box-li-currname">{{item.currName}}</div>
                                   <div class="right-box-li-name">{{item.teacherName}}</div>
                                </div>                              
                            </div>
                        </td>
					</tr>
                    <tr :key="indexs" v-for="(items,indexs) in twonightScheduleCurrListList">						
						<td :rowspan="twonightScheduleCurrListList.length" v-if="indexs==0">晚自习</td>	
						<td class="td"  draggable="true" @dragstart="onDragstart($event,1)"  @drop="onDrop(1,5,indexs,newindex,2)" :key="newindex" v-for="newindex in weekDayCount" @dragend="onDragend()" @dragover="onDragover($event)"> <!--  往哪拖,时间段,时间段内节次,周几,单双 -->
                            <div class="box">
                                <div class="td-right-box-li" :key="index" v-for="(item,index) in items[newindex-1]">
                                  <i class="el-icon-close" @click="deletefun(5,indexs,newindex,2,index)"></i><!--  时间段,时间段内节次,周几,单双,第几个-->
                                  <div class="right-box-li-currname">{{item.currName}}</div>
                                   <div class="right-box-li-name">{{item.teacherName}}</div>
                                </div>                              
                            </div>
                        </td>
					</tr>
			</tbody>
           </table>   
           <div class="right-box" :style="`height: ${nobottommaxH-30}px;`">
              <div class="right-box-li"  @click="mystart++" v-if="clicknum!=0" style="line-height: 30px;background: #E6A23C; border-color: #E6A23C;">
                 <div class="right-box-li-currname">{{clicknum==1?'横向空白一节课':'竖向空白一节课'}}</div>
               </div>
               <div class="right-box-li"  @click="mystart=mystart+weekDayCount" v-if="clicknum==1" style="line-height: 30px;background: #E6A23C; border-color: #E6A23C;">
                 <div class="right-box-li-currname">横向一排空白</div>
                   <!-- <div class="right-box-li-name">&nbsp;</div> -->
               </div>
                <div class="right-box-li"  @click="mystart=mystart+bignum" v-if="clicknum==2" style="line-height: 30px;background: #E6A23C; border-color: #E6A23C;">
                 <div class="right-box-li-currname">竖向一排空白</div>
                   <!-- <div class="right-box-li-name">&nbsp;</div> -->
               </div>
               <div class="right-box-li" v-for="(item,index) in currlist"   :key="item.id"  draggable="true" @click="newclickfun(item)"  @dragstart="onDragstart($event,2,index)"  @drop="onDrop(2)" @dragend="onDragend()" @dragover="onDragover($event)">
                   <div class="right-box-li-currname">{{item.courseName}}</div>
                   <div class="right-box-li-name">{{item.teacherName}}</div>
               </div>
           </div>
        </div>
     </div>
</div> 
</template>
<script>
import {
    classScheduleSet,
  classScheduleDetailsById,
  querySchoolClass,
  queryTeacherCourseByClassId,
  updateClassSchedule
} from "@/api/classScheduleCard";
import mixin from "@/mixins/windowResize";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      mynum: 0,
      afternoonScheduleCurrListList: [],
      forenoonScheduleCurrListList: [],
      morningScheduleCurrListList: [],
      nightScheduleCurrListList: [],
      noonScheduleCurrListList: [],
      twomylis: [],
      twoafternoonScheduleCurrListList: [],
      twoforenoonScheduleCurrListList: [],
      twomorningScheduleCurrListList: [],
      twonightScheduleCurrListList: [],
      twonoonScheduleCurrListList: [],
      singleDouble: false,
      classlist: [],
      currlist: [],
      departId: "",
      typenum: 0, //2是网课程表拖拽
      indexnum: 0, //拖拽第几个
      onenum: 0,
      twonum: 0,
      threenum: 0,
      fivenum: 0,
      fournum: 0,
      onelist: [],
      twolist: [],
      threelist: [],
      fivelist: [],
      fourlist: [],
      myonelist:[],
      mytwolist:[],
      weekDayCount:this.weekDayCount,
      clicknum:0,
      mystart:1,
      bignum:0,
      id: this.$route.query.id,
    };
  },
  mixins: [mixin],
  created() {
    this.classScheduleSets();
    this.querySchoolClasss();
  },
  computed: {
    ...mapGetters(["schoolInfo"])
  },
  methods: {
    kaiqi(num){
       this.clicknum=num;
       this.mystart=1
       if(num==1){
          this.$message.success("开启点击横向添加成功");
       }
       if(num==2){
          this.$message.success("开启点击竖向添加成功");
       }
       if(num==0){
          this.$message.success("关闭点击添加成功");
       }
    },
    newclickfun(newobj){
       let obj = {
          currId: newobj.courseId, //	课程id	number
          currName: newobj.courseName, //	课程名称	string
          teacherId:newobj.teacherId, //	教师id	number
          teacherName: newobj.teacherName, //	教师名字	string
          dayStage: '', //	天的阶段，1早上，2上午，3中午，4下午，5晚上	number
          dayState: '', //	1周一，2周二，3周三，4周四，5周五，6周六，7周日	number
          seq: '', //	节次	number
          singleDouble: 1 //	单双，1代表单，2代表双	number
        };        
        //横版添加
        if(this.clicknum==1){          
          if(this.mystart<(this.morningScheduleCurrListList.length*this.weekDayCount+1)){
            obj.dayStage=1
            obj.dayState=this.mystart%this.weekDayCount?this.mystart%this.weekDayCount:this.weekDayCount
            obj.seq=Math.ceil(this.mystart/this.weekDayCount)            
            let onemynum=Math.ceil((this.mystart-this.weekDayCount)/this.weekDayCount)
            let twomynum=this.mystart%this.weekDayCount?(this.mystart%this.weekDayCount- 1):this.weekDayCount-1
            this.morningScheduleCurrListList[onemynum][twomynum].push(obj);
            this.onelist[onemynum][twomynum].push(obj);
            this.mystart++          
          }else if(this.mystart<((this.morningScheduleCurrListList.length+this.forenoonScheduleCurrListList.length)*this.weekDayCount+1)){
                obj.dayStage=2
                obj.dayState=this.mystart%this.weekDayCount?this.mystart%this.weekDayCount:this.weekDayCount
                obj.seq=Math.ceil((this.mystart-this.morningScheduleCurrListList.length*this.weekDayCount)/this.weekDayCount)            
                let onemynum=Math.ceil((this.mystart-this.weekDayCount-this.morningScheduleCurrListList.length*this.weekDayCount)/this.weekDayCount)
                let twomynum=this.mystart%this.weekDayCount?(this.mystart%this.weekDayCount- 1):this.weekDayCount-1
                this.forenoonScheduleCurrListList[onemynum][twomynum].push(obj);
                this.threelist[onemynum][twomynum].push(obj);
                this.mystart++
          }else if(this.mystart<((this.morningScheduleCurrListList.length+this.forenoonScheduleCurrListList.length+this.noonScheduleCurrListList.length)*this.weekDayCount+1)){
                obj.dayStage=3
                obj.dayState=this.mystart%this.weekDayCount?this.mystart%this.weekDayCount:this.weekDayCount
                obj.seq=Math.ceil((this.mystart-(this.morningScheduleCurrListList.length+this.forenoonScheduleCurrListList.length)*this.weekDayCount)/this.weekDayCount)            
                let onemynum=Math.ceil((this.mystart-this.weekDayCount-(this.morningScheduleCurrListList.length+this.forenoonScheduleCurrListList.length)*this.weekDayCount)/this.weekDayCount)
                let twomynum=this.mystart%this.weekDayCount?(this.mystart%this.weekDayCount- 1):this.weekDayCount-1
                this.noonScheduleCurrListList[onemynum][twomynum].push(obj);
                this.twolist[onemynum][twomynum].push(obj);
                this.mystart++
          }else if(this.mystart<((this.morningScheduleCurrListList.length+this.forenoonScheduleCurrListList.length+this.noonScheduleCurrListList.length+this.afternoonScheduleCurrListList.length)*this.weekDayCount+1)){
                obj.dayStage=4
                obj.dayState=this.mystart%this.weekDayCount?this.mystart%this.weekDayCount:this.weekDayCount
                obj.seq=Math.ceil((this.mystart-(this.morningScheduleCurrListList.length+this.forenoonScheduleCurrListList.length+this.noonScheduleCurrListList.length)*this.weekDayCount)/this.weekDayCount)            
                let onemynum=Math.ceil((this.mystart-this.weekDayCount-(this.morningScheduleCurrListList.length+this.forenoonScheduleCurrListList.length+this.noonScheduleCurrListList.length)*this.weekDayCount)/this.weekDayCount)
                let twomynum=this.mystart%this.weekDayCount?(this.mystart%this.weekDayCount- 1):this.weekDayCount-1
                this.afternoonScheduleCurrListList[onemynum][twomynum].push(obj);
                this.fivelist[onemynum][twomynum].push(obj);
                this.mystart++
          }else if(this.mystart<((this.morningScheduleCurrListList.length+this.forenoonScheduleCurrListList.length+this.noonScheduleCurrListList.length+this.afternoonScheduleCurrListList.length+this.nightScheduleCurrListList.length)*this.weekDayCount+1)){
                obj.dayStage=5
                obj.dayState=this.mystart%this.weekDayCount?this.mystart%this.weekDayCount:this.weekDayCount
                obj.seq=Math.ceil((this.mystart-(this.morningScheduleCurrListList.length+this.forenoonScheduleCurrListList.length+this.noonScheduleCurrListList.length+this.afternoonScheduleCurrListList.length)*this.weekDayCount)/this.weekDayCount)            
                let onemynum=Math.ceil((this.mystart-this.weekDayCount-(this.morningScheduleCurrListList.length+this.forenoonScheduleCurrListList.length+this.noonScheduleCurrListList.length+this.afternoonScheduleCurrListList.length)*this.weekDayCount)/this.weekDayCount)
                let twomynum=this.mystart%this.weekDayCount?(this.mystart%this.weekDayCount- 1):this.weekDayCount-1
                this.nightScheduleCurrListList[onemynum][twomynum].push(obj);
                this.fourlist[onemynum][twomynum].push(obj);
                this.mystart++
          }

        }
        //竖版添加
        let bignum=Math.floor(this.morningScheduleCurrListList.length+this.forenoonScheduleCurrListList.length+this.noonScheduleCurrListList.length+this.afternoonScheduleCurrListList.length+this.nightScheduleCurrListList.length)
           if(this.clicknum==2){
          if((this.mystart <( bignum*this.weekDayCount+1))&&(this.mystart%bignum?this.mystart%bignum:bignum)<this.morningScheduleCurrListList.length+1){
            obj.dayStage=1
            obj.dayState=Math.ceil(this.mystart/bignum)
            obj.seq=((this.mystart%bignum)?(this.mystart%bignum):bignum)            
            let onemynum=Math.ceil(((this.mystart%bignum)?(this.mystart%bignum):bignum)-1)
            let twomynum=Math.floor((this.mystart/bignum)-((this.nightScheduleCurrListList.length+this.afternoonScheduleCurrListList.length+ this.noonScheduleCurrListList.length+this.forenoonScheduleCurrListList.length)?0:(this.mystart%bignum?0:1)))
            // console.log(onemynum,twomynum)
            this.morningScheduleCurrListList[onemynum][twomynum].push(obj);
            this.onelist[onemynum][twomynum].push(obj);
            this.mystart++  
          }else if((this.mystart <( bignum*this.weekDayCount+1))&&(this.mystart%bignum?this.mystart%bignum:bignum)<this.morningScheduleCurrListList.length+this.forenoonScheduleCurrListList.length+1){
                obj.dayStage=2
                obj.dayState=Math.ceil(this.mystart/bignum)
                obj.seq=Math.floor(((this.mystart%bignum)?(this.mystart%bignum):bignum)- this.morningScheduleCurrListList.length)       
                let onemynum=Math.ceil(((this.mystart%bignum)?(this.mystart%bignum):bignum)-this.morningScheduleCurrListList.length-1)
                let twomynum=Math.floor((this.mystart/bignum)-((this.nightScheduleCurrListList.length+this.afternoonScheduleCurrListList.length+ this.noonScheduleCurrListList.length)?0:(this.mystart%bignum?0:1)))
                // console.log(onemynum,twomynum)
                this.forenoonScheduleCurrListList[onemynum][twomynum].push(obj);
                this.threelist[onemynum][twomynum].push(obj);
                this.mystart++
          }else if((this.mystart <( bignum*this.weekDayCount+1))&&(this.mystart%bignum?this.mystart%bignum:bignum)<this.morningScheduleCurrListList.length+this.forenoonScheduleCurrListList.length+this.noonScheduleCurrListList.length+1){
                obj.dayStage=3
                obj.dayState=Math.ceil(this.mystart/bignum)
                obj.seq=Math.floor(((this.mystart%bignum)?(this.mystart%bignum):bignum)- this.morningScheduleCurrListList.length-this.forenoonScheduleCurrListList.length)       
                let onemynum=Math.ceil(((this.mystart%bignum)?(this.mystart%bignum):bignum)-this.morningScheduleCurrListList.length-this.forenoonScheduleCurrListList.length-1)
                let twomynum=Math.floor((this.mystart/bignum)-((this.nightScheduleCurrListList.length+this.afternoonScheduleCurrListList.length)?0:(this.mystart%bignum?0:1)))
                // console.log(onemynum,twomynum)
                this.noonScheduleCurrListList[onemynum][twomynum].push(obj);
                this.twolist[onemynum][twomynum].push(obj);
                this.mystart++               
          }else if((this.mystart <( bignum*this.weekDayCount+1))&&(this.mystart%bignum?this.mystart%bignum:bignum)<this.morningScheduleCurrListList.length+this.forenoonScheduleCurrListList.length+this.noonScheduleCurrListList.length+this.afternoonScheduleCurrListList.length+1){
                obj.dayStage=4
                obj.dayState=Math.ceil(this.mystart/bignum)                
                obj.seq=Math.floor(((this.mystart%bignum)?(this.mystart%bignum):bignum)- this.morningScheduleCurrListList.length-this.forenoonScheduleCurrListList.length-this.noonScheduleCurrListList.length)       
                let onemynum=Math.ceil(((this.mystart%bignum)?(this.mystart%bignum):bignum)-this.morningScheduleCurrListList.length-this.forenoonScheduleCurrListList.length-this.noonScheduleCurrListList.length-1)
                let twomynum=Math.floor((this.mystart/bignum)-(this.nightScheduleCurrListList.length?0:(this.mystart%bignum?0:1)))
                this.afternoonScheduleCurrListList[onemynum][twomynum].push(obj);
                this.fivelist[onemynum][twomynum].push(obj);
                this.mystart++
          }else if((this.mystart <( bignum*this.weekDayCount+1))&&(this.mystart%bignum?this.mystart%bignum:bignum)<this.morningScheduleCurrListList.length+this.forenoonScheduleCurrListList.length+this.noonScheduleCurrListList.length+this.afternoonScheduleCurrListList.length+this.nightScheduleCurrListList.length+1){
                obj.dayStage=5
                obj.dayState=Math.ceil(this.mystart/bignum)
                obj.seq=Math.floor(((this.mystart%bignum)?(this.mystart%bignum):bignum)- this.morningScheduleCurrListList.length-this.forenoonScheduleCurrListList.length-this.noonScheduleCurrListList.length-this.afternoonScheduleCurrListList.length)       
                let onemynum=Math.ceil(((this.mystart%bignum)?(this.mystart%bignum):bignum)-this.morningScheduleCurrListList.length-this.forenoonScheduleCurrListList.length-this.noonScheduleCurrListList.length-this.afternoonScheduleCurrListList.length-1)
                let twomynum=Math.floor((this.mystart/bignum)-(this.mystart%bignum?0:1))
                // console.log(onemynum,twomynum)
                this.nightScheduleCurrListList[onemynum][twomynum].push(obj);
                this.fourlist[onemynum][twomynum].push(obj);
                this.mystart++
          }   
             console.log(obj.seq) 
        }
        //  console.log(this.mystart/bignum)
         

    },
    //保存
    updateClassSchedule() {
      let obj = {
        currSchedule: "",
        departId: this.departId,
        schoolId: this.schoolInfo.id,
        id:this.id
      };
      this.myonelist = [];
      this.mytwolist=[];
      let list=[];
      for (let i = 0; i < this.afternoonScheduleCurrListList.length; i++) {
        for (let j = 0; j < this.afternoonScheduleCurrListList[i].length; j++) {
          for (
            let k = 0;
            k < this.afternoonScheduleCurrListList[i][j].length;
            k++
          ) {
            this.myonelist.push(this.afternoonScheduleCurrListList[i][j][k]);
          }
        }
      }
      for (let i = 0; i < this.forenoonScheduleCurrListList.length; i++) {
        for (let j = 0; j < this.forenoonScheduleCurrListList[i].length; j++) {
          for (
            let k = 0;
            k < this.forenoonScheduleCurrListList[i][j].length;
            k++
          ) {
            this.myonelist.push(this.forenoonScheduleCurrListList[i][j][k]);
          }
        }
      }
      for (let i = 0; i < this.morningScheduleCurrListList.length; i++) {
        for (let j = 0; j < this.morningScheduleCurrListList[i].length; j++) {
          for (
            let k = 0;
            k < this.morningScheduleCurrListList[i][j].length;
            k++
          ) {
            this.myonelist.push(this.morningScheduleCurrListList[i][j][k]);
          }
        }
      }
      for (let i = 0; i < this.nightScheduleCurrListList.length; i++) {
        for (let j = 0; j < this.nightScheduleCurrListList[i].length; j++) {
          for (
            let k = 0;
            k < this.nightScheduleCurrListList[i][j].length;
            k++
          ) {
            this.myonelist.push(this.nightScheduleCurrListList[i][j][k]);
          }
        }
      }
      for (let i = 0; i < this.noonScheduleCurrListList.length; i++) {
        for (let j = 0; j < this.noonScheduleCurrListList[i].length; j++) {
          for (let k = 0; k < this.noonScheduleCurrListList[i][j].length; k++) {
            this.myonelist.push(this.noonScheduleCurrListList[i][j][k]);
          }
        }
      }
      if (this.singleDouble) {
        for (let i = 0; i < this.twoafternoonScheduleCurrListList.length; i++) {
          for (
            let j = 0;
            j < this.twoafternoonScheduleCurrListList[i].length;
            j++
          ) {
            for (
              let k = 0;
              k < this.twoafternoonScheduleCurrListList[i][j].length;
              k++
            ) {
              this.mytwolist.push(this.twoafternoonScheduleCurrListList[i][j][k]);
            }
          }
        }
        for (let i = 0; i < this.twoforenoonScheduleCurrListList.length; i++) {
          for (
            let j = 0;
            j < this.twoforenoonScheduleCurrListList[i].length;
            j++
          ) {
            for (
              let k = 0;
              k < this.twoforenoonScheduleCurrListList[i][j].length;
              k++
            ) {
              this.mytwolist.push(this.twoforenoonScheduleCurrListList[i][j][k]);
            }
          }
        }
        for (let i = 0; i < this.twomorningScheduleCurrListList.length; i++) {
          for (
            let j = 0;
            j < this.twomorningScheduleCurrListList[i].length;
            j++
          ) {
            for (
              let k = 0;
              k < this.twomorningScheduleCurrListList[i][j].length;
              k++
            ) {
              this.mytwolist.push(this.twomorningScheduleCurrListList[i][j][k]);
            }
          }
        }
        for (let i = 0; i < this.twonightScheduleCurrListList.length; i++) {
          for (
            let j = 0;
            j < this.twonightScheduleCurrListList[i].length;
            j++
          ) {
            for (
              let k = 0;
              k < this.twonightScheduleCurrListList[i][j].length;
              k++
            ) {
              this.mytwolist.push(this.twonightScheduleCurrListList[i][j][k]);
            }
          }
        }
        for (let i = 0; i < this.twonoonScheduleCurrListList.length; i++) {
          for (let j = 0; j < this.twonoonScheduleCurrListList[i].length; j++) {
            for (
              let k = 0;
              k < this.twonoonScheduleCurrListList[i][j].length;
              k++
            ) {
              this.mytwolist.push(this.twonoonScheduleCurrListList[i][j][k]);
            }
          }
        }
      }
      for(let i=0;i<this.myonelist.length;i++){  
        if(this.singleDouble){
           list.push({
                currId: this.myonelist[i].currId, //	课程id	number
                currName:  this.myonelist[i].currName, //	课程名称	string
                teacherId:  this.myonelist[i].teacherId, //	教师id	number
                teacherName:  this.myonelist[i].teacherName, //	教师名字	string
                dayStage:  this.myonelist[i].dayStage, //	天的阶段，1早上，2上午，3中午，4下午，5晚上	number
                dayState:  this.myonelist[i].dayState, //	1周一，2周二，3周三，4周四，5周五，6周六，7周日	number
                seq: this.myonelist[i].seq, //	节次	number
                singleDouble:1//	单双，1代表单，2代表双	number
          })
         
        }else{
             list.push({
                currId: this.myonelist[i].currId, //	课程id	number
                currName:  this.myonelist[i].currName, //	课程名称	string
                teacherId:  this.myonelist[i].teacherId, //	教师id	number
                teacherName:  this.myonelist[i].teacherName, //	教师名字	string
                dayStage:  this.myonelist[i].dayStage, //	天的阶段，1早上，2上午，3中午，4下午，5晚上	number
                dayState:  this.myonelist[i].dayState, //	1周一，2周二，3周三，4周四，5周五，6周六，7周日	number
                seq: this.myonelist[i].seq, //	节次	number
                singleDouble:0//	单双，1代表单，2代表双	number
          })
        }        
         
      }
      for(let i=0;i<this.mytwolist.length;i++){          
          list.push({
                currId: this.mytwolist[i].currId, //	课程id	number
                currName:  this.mytwolist[i].currName, //	课程名称	string
                teacherId:  this.mytwolist[i].teacherId, //	教师id	number
                teacherName:  this.mytwolist[i].teacherName, //	教师名字	string
                dayStage:  this.mytwolist[i].dayStage, //	天的阶段，1早上，2上午，3中午，4下午，5晚上	number
                dayState:  this.mytwolist[i].dayState, //	1周一，2周二，3周三，4周四，5周五，6周六，7周日	number
                seq: this.mytwolist[i].seq, //	节次	number
                singleDouble: 2 //	单双，1代表单，2代表双	number
          })
      }
      obj.currSchedule = JSON.stringify(list);
      updateClassSchedule(obj).then(res => {
        if (res.data.code === 200) {
          this.$message.success("操作成功");
          this.$router.back();
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    //开始拖拽
    onDragstart($event, one, two) {
      //解决火狐拖拽问题
      $event.dataTransfer.setData("aaa", null);
      this.typenum = one;
      this.indexnum = two;
    },
    //目标元素 往哪拖,时间段,时间段内节次,周几,单双
    onDrop(one, two, three, five, four) {
      this.onenum = one;
      this.twonum = two;
      this.threenum = three;
      this.fivenum = five;
      this.fournum = four;
    },
    //拖拽操作
    onDragend() {
      if (this.onenum == 1 && this.typenum == 2) {
        let obj = {
          currId: this.currlist[this.indexnum].courseId, //	课程id	number
          currName: this.currlist[this.indexnum].courseName, //	课程名称	string
          teacherId: this.currlist[this.indexnum].teacherId, //	教师id	number
          teacherName: this.currlist[this.indexnum].teacherName, //	教师名字	string
          dayStage: this.twonum, //	天的阶段，1早上，2上午，3中午，4下午，5晚上	number
          dayState: this.fivenum, //	1周一，2周二，3周三，4周四，5周五，6周六，7周日	number
          seq: this.threenum + 1, //	节次	number
          singleDouble: this.fournum //	单双，1代表单，2代表双	number
        };
        if (this.fournum == 1) {
          //单周
          if (this.twonum == 1) {
            this.morningScheduleCurrListList[this.threenum][
              this.fivenum - 1
            ].push(obj);
            this.onelist[this.threenum][this.fivenum - 1].push(obj);
          } else if (this.twonum == 2) {
            this.forenoonScheduleCurrListList[this.threenum][
              this.fivenum - 1
            ].push(obj);
            this.threelist[this.threenum][this.fivenum - 1].push(obj);
          } else if (this.twonum == 3) {
            this.noonScheduleCurrListList[this.threenum][this.fivenum - 1].push(
              obj
            );
            this.twolist[this.threenum][this.fivenum - 1].push(obj);
          } else if (this.twonum == 4) {
            this.afternoonScheduleCurrListList[this.threenum][
              this.fivenum - 1
            ].push(obj);
            this.fivelist[this.threenum][this.fivenum - 1].push(obj);
          } else if (this.twonum == 5) {
            this.nightScheduleCurrListList[this.threenum][
              this.fivenum - 1
            ].push(obj);
            this.fourlist[this.threenum][this.fivenum - 1].push(obj);
          }
        } else {
          if (this.twonum == 1) {
            this.twomorningScheduleCurrListList[this.threenum][
              this.fivenum - 1
            ].push(obj);
          } else if (this.twonum == 2) {
            this.twoforenoonScheduleCurrListList[this.threenum][
              this.fivenum - 1
            ].push(obj);
          } else if (this.twonum == 3) {
            this.twonoonScheduleCurrListList[this.threenum][
              this.fivenum - 1
            ].push(obj);
          } else if (this.twonum == 4) {
            this.twoafternoonScheduleCurrListList[this.threenum][
              this.fivenum - 1
            ].push(obj);
          } else if (this.twonum == 5) {
            this.twonightScheduleCurrListList[this.threenum][
              this.fivenum - 1
            ].push(obj);
          }
        }
        this.mynum = this.mynum + 1;
      }
    },
    //删除 时间段,时间段内节次,周几,单双,第几个
    deletefun(one, two, three, five, four) {
      if (five == 1) {
        //单周
        if (one == 1) {
          this.morningScheduleCurrListList[two][three - 1].splice(four, 1);
          this.onelist[two][three - 1].splice(four, 1);
        } else if (one == 2) {
          this.forenoonScheduleCurrListList[two][three - 1].splice(four, 1);
          this.threelist[two][three - 1].splice(four, 1);
        } else if (one == 3) {
          this.noonScheduleCurrListList[two][three - 1].splice(four, 1);
          this.twolist[two][three - 1].splice(four, 1);
        } else if (one == 4) {
          this.afternoonScheduleCurrListList[two][three - 1].splice(four, 1);
          this.fivelist[two][three - 1].splice(four, 1);
        } else if (one == 5) {
          this.nightScheduleCurrListList[two][three - 1].splice(four, 1);
          this.fourlist[two][three - 1].splice(four, 1);
        }
      } else {
        if (one == 1) {
          this.twomorningScheduleCurrListList[two][three - 1].splice(four, 1);
        } else if (one == 2) {
          this.twoforenoonScheduleCurrListList[two][three - 1].splice(four, 1);
        } else if (one == 3) {
          this.twonoonScheduleCurrListList[two][three - 1].splice(four, 1);
        } else if (one == 4) {
          this.twoafternoonScheduleCurrListList[two][three - 1].splice(four, 1);
        } else if (one == 5) {
          this.twonightScheduleCurrListList[two][three - 1].splice(four, 1);
        }
      }
      this.mynum = this.mynum + 1;
    },
    //阻止元素的默认行为，不然ondrop不管用
    onDragover(event) {
      event.preventDefault();
    },
    //获取班级
    querySchoolClasss() {
      querySchoolClass().then(res => {
        let data = res.data.data;
        this.classlist = data;
        this.departId = data[0].id;
        this.queryTeacherCourseByClassIds();
      });
    },
      //复制
    copyfun() {
      for (let i = 0; i < this.morningScheduleCurrListList.length; i++) {
        for (let j = 0; j < this.morningScheduleCurrListList[i].length; j++) {
          this.twomorningScheduleCurrListList[i][j] = [];
          for(let k=0;k<this.morningScheduleCurrListList[i][j].length;k++){
                this.twomorningScheduleCurrListList[i][j].push(this.morningScheduleCurrListList[i][j][k])
          }
        }
      }
      for (let i = 0; i < this.noonScheduleCurrListList.length; i++) {
        for (let j = 0; j < this.noonScheduleCurrListList[i].length; j++) {
          this.twonoonScheduleCurrListList[i][j] = [];
          for(let k=0;k<this.noonScheduleCurrListList[i][j].length;k++){
                this.twonoonScheduleCurrListList[i][j].push(this.noonScheduleCurrListList[i][j][k])
          }
        }
      }
      for (let i = 0; i < this.forenoonScheduleCurrListList.length; i++) {
        for (let j = 0; j < this.forenoonScheduleCurrListList[i].length; j++) {
          this.twoforenoonScheduleCurrListList[i][j] = [];
          for(let k=0;k<this.forenoonScheduleCurrListList[i][j].length;k++){
                this.twoforenoonScheduleCurrListList[i][j].push(this.forenoonScheduleCurrListList[i][j][k])
          }
        }
      }
      for (let i = 0; i < this.afternoonScheduleCurrListList.length; i++) {
        for (let j = 0; j < this.afternoonScheduleCurrListList[i].length; j++) {
          this.twoafternoonScheduleCurrListList[i][j] = [];
          for(let k=0;k<this.afternoonScheduleCurrListList[i][j].length;k++){
                this.twoafternoonScheduleCurrListList[i][j].push(this.afternoonScheduleCurrListList[i][j][k])
          }
        }
      }
      for (let i = 0; i < this.nightScheduleCurrListList.length; i++) {
        for (let j = 0; j < this.nightScheduleCurrListList[i].length; j++) {
          this.twonightScheduleCurrListList[i][j] = [];
          for(let k=0;k<this.nightScheduleCurrListList[i][j].length;k++){
                this.twonightScheduleCurrListList[i][j].push(this.nightScheduleCurrListList[i][j][k])
          }
        }
      }
      this.mynum = this.mynum + 1;
    },
    //获取详情
    classScheduleSets() {
       this.mystart=1
      classScheduleSet(this.schoolInfo.id)
        .then(res => res.data)
        .then(data => {
          let mydata = data.data;
          this.weekDayCount=data.data.weekDayCount;
          this.singleDouble = mydata.singleDouble > 0;
          this.afternoonScheduleCurrListList = [];
          this.forenoonScheduleCurrListList = [];
          this.morningScheduleCurrListList = [];
          this.nightScheduleCurrListList = [];
          this.noonScheduleCurrListList = [];
          this.twoafternoonScheduleCurrListList = [];
          this.twoforenoonScheduleCurrListList = [];
          this.twomorningScheduleCurrListList = [];
          this.twonightScheduleCurrListList = [];
          this.twonoonScheduleCurrListList = [];
          this.onelist = [];
          this.twolist = [];
          this.threelist = [];
          this.fivelist = [];
          this.fourlist = [];
          if (mydata.morning > 0) {
            for (let i = 0; i < mydata.morning; i++) {
              this.morningScheduleCurrListList.push(this.weekDayCount==5?[[],[],[],[],[]]:[[],[],[],[],[],[],[]]);
              this.onelist.push(this.weekDayCount==5?[[],[],[],[],[]]:[[],[],[],[],[],[],[]]);
            }
            if (this.singleDouble) {
              for (let i = 0; i < mydata.morning; i++) {
                this.twomorningScheduleCurrListList.push(this.weekDayCount==5?[[],[],[],[],[]]:[[],[],[],[],[],[],[]]);
              }
            }
          }
          if (mydata.forenoon > 0) {
            for (let i = 0; i < mydata.forenoon; i++) {
              this.forenoonScheduleCurrListList.push(this.weekDayCount==5?[[],[],[],[],[]]:[[],[],[],[],[],[],[]]);
              this.threelist.push(this.weekDayCount==5?[[],[],[],[],[]]:[[],[],[],[],[],[],[]]);
            }
            if (this.singleDouble) {
              for (let i = 0; i < mydata.forenoon; i++) {
                this.twoforenoonScheduleCurrListList.push(this.weekDayCount==5?[[],[],[],[],[]]:[[],[],[],[],[],[],[]]);
              }
            }
          }
          if (mydata.noon > 0) {
            for (let i = 0; i < mydata.noon; i++) {
              this.noonScheduleCurrListList.push(this.weekDayCount==5?[[],[],[],[],[]]:[[],[],[],[],[],[],[]]);
              this.twolist.push(this.weekDayCount==5?[[],[],[],[],[]]:[[],[],[],[],[],[],[]]);
            }
            if (this.singleDouble) {
              for (let i = 0; i < mydata.noon; i++) {
                this.twonoonScheduleCurrListList.push(this.weekDayCount==5?[[],[],[],[],[]]:[[],[],[],[],[],[],[]]);
              }
            }
          }
          if (mydata.afternoon > 0) {
            for (let i = 0; i < mydata.afternoon; i++) {
              this.afternoonScheduleCurrListList.push(this.weekDayCount==5?[[],[],[],[],[]]:[[],[],[],[],[],[],[]]);
              this.fivelist.push(this.weekDayCount==5?[[],[],[],[],[]]:[[],[],[],[],[],[],[]]);
            }
            if (this.singleDouble) {
              for (let i = 0; i < mydata.afternoon; i++) {
                this.twoafternoonScheduleCurrListList.push(this.weekDayCount==5?[[],[],[],[],[]]:[[],[],[],[],[],[],[]]);
              }
            }
          }
          if (mydata.night > 0) {
            for (let i = 0; i < mydata.night; i++) {
              this.nightScheduleCurrListList.push(this.weekDayCount==5?[[],[],[],[],[]]:[[],[],[],[],[],[],[]]);
              this.fourlist.push(this.weekDayCount==5?[[],[],[],[],[]]:[[],[],[],[],[],[],[]]);
            }
            if (this.singleDouble) {
              for (let i = 0; i < mydata.night; i++) {
                this.twonightScheduleCurrListList.push(this.weekDayCount==5?[[],[],[],[],[]]:[[],[],[],[],[],[],[]]);
              }
            }
          }


           this.bignum=Math.floor(this.morningScheduleCurrListList.length+this.forenoonScheduleCurrListList.length+this.noonScheduleCurrListList.length+this.afternoonScheduleCurrListList.length+this.nightScheduleCurrListList.length)
          this.classScheduleDetailsByIds();
       });
    },
     //获取详情
    classScheduleDetailsByIds() {
      classScheduleDetailsById(this.id)
        .then(res => res.data)
        .then(data => {
          let mydata = data.data;
          this.departId = mydata.departId;
          this.queryTeacherCourseByClassIds();
          if (!this.singleDouble) {
            if (mydata.singleDoubleClassSchedule) {
              this.afternoonScheduleCurrListList =
                mydata.singleDoubleClassSchedule.afternoonScheduleCurrListList;
              this.forenoonScheduleCurrListList =
                mydata.singleDoubleClassSchedule.forenoonScheduleCurrListList;
              this.morningScheduleCurrListList =
                mydata.singleDoubleClassSchedule.morningScheduleCurrListList;
              this.nightScheduleCurrListList =
                mydata.singleDoubleClassSchedule.nightScheduleCurrListList;
              this.noonScheduleCurrListList =
                mydata.singleDoubleClassSchedule.noonScheduleCurrListList;
              
            }
          } else {
            if (mydata.singleClassSchedule) {
              this.afternoonScheduleCurrListList =
                mydata.singleClassSchedule.afternoonScheduleCurrListList;
              this.forenoonScheduleCurrListList =
                mydata.singleClassSchedule.forenoonScheduleCurrListList;
              this.morningScheduleCurrListList =
                mydata.singleClassSchedule.morningScheduleCurrListList;
              this.nightScheduleCurrListList =
                mydata.singleClassSchedule.nightScheduleCurrListList;
              this.noonScheduleCurrListList =
                mydata.singleClassSchedule.noonScheduleCurrListList;             
              
              this.twoafternoonScheduleCurrListList =
                mydata.doubleClassSchedule.afternoonScheduleCurrListList;
              this.twoforenoonScheduleCurrListList =
                mydata.doubleClassSchedule.forenoonScheduleCurrListList;
              this.twomorningScheduleCurrListList =
                mydata.doubleClassSchedule.morningScheduleCurrListList;
              this.twonightScheduleCurrListList =
                mydata.doubleClassSchedule.nightScheduleCurrListList;
              this.twonoonScheduleCurrListList =
                mydata.doubleClassSchedule.noonScheduleCurrListList;
            }
          }
        });
    },
    //获取班级课程
    queryTeacherCourseByClassIds() {
      queryTeacherCourseByClassId(this.departId).then(res => {
        let data = res.data.data;
        this.currlist = data;       
      });
    }
  }
};
</script>
<style scoped>
.classScheduleCardadd {
  padding:12px;
}
.right-box {
  width: 240px;
  overflow: auto;
  position: fixed;
  left: 72%;
}
.right-box-li {
  width: 110px;
  float: left;
  margin: 1px;
  border-radius: 3px;
  border: 1px solid #c2e7b0;
  text-align: center;
  font-size: 13px;
  margin: 1px 0 0 1px;
  padding: 5px 0;
  color: #ffffff;
  background: #265b9c;
  border-color: #265b9c;
  cursor: pointer;
}
.td-right-box-li {
  width: 116px;
  margin: 2px;
  border-radius: 3px;
  border: 1px solid #c2e7b0;
  text-align: center;
  font-size: 13px;
  padding: 5px 0;
  color: #ffffff;
  background: #265b9c;
  border-color: #265b9c;
  position: relative;
}
.td-right-box-li i {
  cursor: pointer;
  position: absolute;
  right: 5px;
  top: 5px;
}
* {
  box-sizing: border-box;
}
.top {
  border-bottom: 1px solid #e7eaec;
  padding-bottom: 10px;
}
.subject {
  padding-top: 20px;
  overflow: auto;
}
.body {
  width: 1000px;
  overflow: hidden;
}
table {
  border-collapse: collapse;
  border: 1px solid #b3d8ff;
  width: 750px;
  float: left;
  margin-bottom: 30px;
}
th {
  border: 1px solid #b3d8ff;
  text-align: center;
  font-size: 14px;
  line-height: 12px;
  height: 56px;
  overflow: hidden;
  background: #ecf5ff;
  color: #409eff;
}
td {
  border: 1px solid #b3d8ff;
  text-align: center;
  font-size: 16px;
  background: #fff;
}
.img {
  width: 145px;
  height: 52px;
  margin: 1px 2px 1px 1px;
}
.box {
  width: 120px;
  min-height: 42px;
  line-height: 16px;
  font-size: 13px;
}
</style>