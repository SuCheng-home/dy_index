<template>
<div class="classScheduleCardwholeonedetails"  >
     <div class="top"> 
          <el-button @click="$router.back()" type="default" size="medium">返回</el-button> 
          <el-radio-group v-model="mytype" size="medium">
            <el-radio-button :label="1">排课表</el-radio-button>
            <el-radio-button :label="2">周课表</el-radio-button>
            </el-radio-group>
         <el-select v-model="selectWeek" @change="classScheduleDetailsWeek" v-if="mytype==2" placeholder="请选择周次"  size="medium" >
            <el-option  v-for="item in weekList"   :key="item.value" :label="item.label" :value="item.value"> </el-option>
        </el-select>
         <el-button type="primary" size="medium" @click="classScheduleCardeidt()" v-if="isclass&&mytype==1">编辑</el-button>  
         <a :href="exportUrl" v-if="mytype==1" download="导出" target="_blank" >
              <el-button type="primary" size="medium" icon="upload">导出</el-button>
          </a>
         <el-button type="primary" v-if="mytype==1" size="medium"  @click="print()">打印</el-button> 
      </div>
     <div class="subject" v-if="mytype==1" :style="`height: ${nobottommaxH}px;`">
         <div class="top-name">{{name}} 的课程表</div>
        <table cellpadding="0"  ref="print" id="print" cellspacing="0">
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
						<td class="td" :key="newindex" v-for="newindex in weekDayCount">
                            <div class="box">
                                <div :key="index" v-for="(item,index) in items[newindex-1]">{{item.currName}}({{item.teacherName}})</div>
                            </div>
                        </td>
					</tr>
                    <tr :key="indexs" v-for="(items,indexs) in forenoonScheduleCurrListList">						
						<td :rowspan="forenoonScheduleCurrListList.length" v-if="indexs==0">上午</td>
						<td class="td" :key="newindex" v-for="newindex in weekDayCount">
                            <div class="box">
                                <div :key="index" v-for="(item,index) in items[newindex-1]">{{item.currName}}({{item.teacherName}})</div>
                            </div>
                        </td>
					</tr>
                    <tr :key="indexs" v-for="(items,indexs) in noonScheduleCurrListList">						
						<td :rowspan="noonScheduleCurrListList.length" v-if="indexs==0">午自习</td>
						<td class="td" :key="newindex" v-for="newindex in weekDayCount">
                            <div class="box">
                                <div :key="index" v-for="(item,index) in items[newindex-1]">{{item.currName}}({{item.teacherName}})</div>
                            </div>
                        </td>
					</tr>
                    <tr :key="indexs" v-for="(items,indexs) in afternoonScheduleCurrListList">						
						<td :rowspan="afternoonScheduleCurrListList.length" v-if="indexs==0">下午</td>
						<td class="td" :key="newindex" v-for="newindex in weekDayCount">
                            <div class="box">
                                <div :key="index" v-for="(item,index) in items[newindex-1]">{{item.currName}}({{item.teacherName}})</div>
                            </div>
                        </td>
					</tr>
                    <tr :key="indexs" v-for="(items,indexs) in nightScheduleCurrListList">						
						<td :rowspan="nightScheduleCurrListList.length" v-if="indexs==0">晚自习</td>
						<td class="td" :key="newindex" v-for="newindex in weekDayCount">
                            <div class="box">
                                <div :key="index" v-for="(item,index) in items[newindex-1]">{{item.currName}}({{item.teacherName}})</div>
                            </div>
                        </td>
					</tr>
			</tbody>
        </table>
     </div>
     <div class="subject" v-if="mytype==2" :style="`height: ${nobottommaxH}px;`">
         <div class="top-name">{{name}} 第{{selectWeek}}周 的课程表</div>
         <!-- {{classScheduleSet}} -->
        <table cellpadding="0"  ref="print" id="print" cellspacing="0">
				<tbody>
                   <tr>
					<th style="width:150px"><img class="img" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/classScheduleCard/kcbone.png" alt=""></th>
					<th :colspan="bignum" :key="index" v-for="(item,index) in schoolTimeDateList">
                                {{item.schoolTimeDate}}（{{dayMapping[new Date(item.schoolTimeDate).getDay()]}}）
                    </th>
				 </tr>				
					<tr :key="indexs" v-for="(items,indexs) in classScheduleSet.morningScheduleCurrListList">						
						<td :rowspan="classScheduleSet.morningScheduleCurrListList.length" v-if="indexs==0">早自习</td>	
						<td class="td" :key="newindex" v-for="(newitem,newindex) in items">
                            <div class="box">
                                <div :key="index" v-for="(item,index) in newitem">{{item.currName}}({{item.teacherName}})</div>                              
                            </div>
                        </td>
					</tr>
                    <tr :key="indexs" v-for="(items,indexs) in classScheduleSet.forenoonScheduleCurrListList">						
						<td :rowspan="classScheduleSet.forenoonScheduleCurrListList.length" v-if="indexs==0">上午</td>	
						<td class="td" :key="newindex" v-for="(newitem,newindex) in items">
                            <div class="box">
                                <div :key="index" v-for="(item,index) in newitem">{{item.currName}}({{item.teacherName}})</div>                              
                            </div>
                        </td>
                        
					</tr>
                    <tr :key="indexs" v-for="(items,indexs) in classScheduleSet.noonScheduleCurrListList">						
						<td :rowspan="classScheduleSet.noonScheduleCurrListList.length" v-if="indexs==0">午自习</td>	
						<td class="td" :key="newindex" v-for="(newitem,newindex) in items">
                            <div class="box">
                                <div :key="index" v-for="(item,index) in newitem">{{item.currName}}({{item.teacherName}})</div>                              
                            </div>
                        </td>
					</tr>
                    <tr :key="indexs" v-for="(items,indexs) in classScheduleSet.afternoonScheduleCurrListList">						
						<td :rowspan="classScheduleSet.afternoonScheduleCurrListList.length" v-if="indexs==0">下午</td>	
						<td class="td" :key="newindex" v-for="(newitem,newindex) in items">
                            <div class="box">
                                <div :key="index" v-for="(item,index) in newitem">{{item.currName}}({{item.teacherName}})</div>                              
                            </div>
                        </td>
					</tr>
                    <tr :key="indexs" v-for="(items,indexs) in classScheduleSet.nightScheduleCurrListList">						
						<td :rowspan="classScheduleSet.nightScheduleCurrListList.length" v-if="indexs==0">晚自习</td>	
						<td class="td" :key="newindex" v-for="(newitem,newindex) in items">
                            <div class="box">
                                <div :key="index" v-for="(item,index) in newitem">{{item.currName}}({{item.teacherName}})</div>                              
                            </div>
                        </td>
					</tr>
			</tbody>
        </table>
     </div>
</div> 
</template>
<script>
import { classScheduleDetails,deleteClassSchedule,isManager,classScheduleDetailsWeek,getSchoolTimeAllList,getSeveralWeekListBySchoolTImeId,classScheduleSet} from "@/api/classScheduleCard";
import mixin from "@/mixins/windowResize";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      mytype:1,
      id: this.$route.query.id,
      isclass:false,
      name: "",
      afternoonScheduleCurrListList:[],
      forenoonScheduleCurrListList:[],
      morningScheduleCurrListList:[],
      nightScheduleCurrListList:[],
      noonScheduleCurrListList:[],
      exportUrl:'',
       classScheduleSet:{},
        bignum:0,
        teacherName:'',
        schoolYearList:[],
        weekList:[],
        selectWeek:'',
        schoolTimeDateList:[],
        dayMapping:['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
        weekDayCount:5
    };
  },
  mixins: [mixin],
  created() {
    this.classScheduleSets();
    this.exportUrl = `${global.BasePath}structure/classSchedule/exportClassSchedule?token=${this.$store.getters.token}&id=${this.$route.query.id}`;
    this.classScheduleDetailss();
     getSchoolTimeAllList().then(res => {
                    this.schoolYearList = res.data.data;
                    this.schoolYearList.forEach((item) => {
                        if (item.isCurrent === 1) {
                             getSeveralWeekListBySchoolTImeId(item.id).then((res) => {
                              const data = res.data.data;
                              if (res.data.code === 200) {
                                  this.weekList = data.map(item => {
                                      return {
                                          value: item.week-0,
                                          label: '第' + item.week + '周'
                                      }
                                  });
                                  if (data.map(item => item.nowWeek).indexOf(1) > -1) {
                                      this.selectWeek = data[data.map(item => item.nowWeek).indexOf(1)].week;
                                  } else {
                                      this.selectWeek = data[0].week;
                                  }
                                 this.classScheduleDetailsWeek();
                              }
                          }).catch(() => {
                          });
                        }
                    });
                }).catch();
  },
   computed: {
    ...mapGetters(['userInfo','schoolInfo'])
  },
  methods: {
    //获取课程表设置
    classScheduleSets() {
      classScheduleSet(this.schoolInfo.id)
        .then(res => res.data)
        .then(data => {
          this.weekDayCount = data.data.weekDayCount;
        });
    },
    classScheduleDetailsWeek(){
       classScheduleDetailsWeek(this.id,this.selectWeek)
        .then(res => res.data)
        .then(data => {
            this.classScheduleSet=data.data.classSchedule;
            // 补全日期列
            var dateList = data.data.schoolTimeDateList || [];
            while(dateList.length < this.weekDayCount && dateList.length > 0) {
              var lastDate = new Date(dateList[dateList.length - 1].schoolTimeDate);
              lastDate.setDate(lastDate.getDate() + 1);
              var y = lastDate.getFullYear();
              var m = lastDate.getMonth() + 1;
              var d = lastDate.getDate();
              dateList.push({schoolTimeDate: y + '-' + (m < 10 ? '0' + m : m) + '-' + (d < 10 ? '0' + d : d)});
            }
            this.schoolTimeDateList = dateList;
            // 补全周课表每个时间段的日期列
            var self = this;
            if(this.classScheduleSet) {
              ['morningScheduleCurrListList','forenoonScheduleCurrListList','noonScheduleCurrListList','afternoonScheduleCurrListList','nightScheduleCurrListList'].forEach(function(key) {
                var list = self.classScheduleSet[key] || [];
                list.forEach(function(row) {
                  while(row.length < self.weekDayCount) {
                    row.push([]);
                  }
                });
              });
            }
        });
    },
    print() {
      this.$print(this.$refs.print);
    },
    //获取详情
    classScheduleDetailss() {
      classScheduleDetails(this.id)
        .then(res => res.data)
        .then(data => {
          let mydata = data.data;
          this.name = mydata.departName;
          var self = this;
          function padRows(list) {
            return (list || []).map(function(row) {
              while(row.length < self.weekDayCount) {
                row.push([]);
              }
              return row;
            });
          }
          this.afternoonScheduleCurrListList=padRows(mydata.singleDoubleClassSchedule.afternoonScheduleCurrListList);
          this.forenoonScheduleCurrListList=padRows(mydata.singleDoubleClassSchedule.forenoonScheduleCurrListList);
          this.morningScheduleCurrListList=padRows(mydata.singleDoubleClassSchedule.morningScheduleCurrListList);
          this.nightScheduleCurrListList=padRows(mydata.singleDoubleClassSchedule.nightScheduleCurrListList);
          this.noonScheduleCurrListList=padRows(mydata.singleDoubleClassSchedule.noonScheduleCurrListList);
          this.isManagers(mydata.departId);
        });
    },
     //判断是不是班主任
    isManagers(departId){
        isManager(departId,this.userInfo.id)
        .then(res => res.data)
        .then(data => {
          this.isclass=data.data.result;          
        });
    },
    //删除
    deleteClassSchedules(){
        this.$confirm("确认要删除吗？", "删除", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        lockScroll: false
      }).then(() => {         
          deleteClassSchedule(this.id).then(res => {
            if (res.data.code === 200) {
              this.$message.success("删除成功");
              this.$router.back();
            } else {
              this.$message.error(res.data.msg);
            }
          });
        })
        .catch(() => {});
    },
    //编辑
    classScheduleCardeidt(){
        this.$router.push({
        path: "classScheduleCardeidt",
        query: { id: this.id}
      });
    },

  }
};
</script>
<style scoped>
.classScheduleCardwholeonedetails {
  padding:12px;
}
* {
  box-sizing: border-box;
}
.top {
  border-bottom: 1px solid #e7eaec;
  padding-bottom: 10px;
}
.subject {
  padding-top: 10px;
  overflow: auto;
}
.top-name {
  width: 100%;
  text-align: center;
  font-size: 20px;
  line-height: 60px;
  color: #303133;
}
table {
  border-collapse: collapse;
  border: 1px solid #b3d8ff;
  width: 1000px;
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
    text-align: center;
    
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
    /* width: 130px; */
    min-height: 16px;
    line-height: 16px;
    font-size: 13px;
}
</style>