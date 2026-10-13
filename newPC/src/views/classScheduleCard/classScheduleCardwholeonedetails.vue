<template>
<div class="classScheduleCardwholeonedetails"  >
     <div class="top"> 
         <el-button @click="$router.back()" type="default" size="medium">返回</el-button> 
         <el-button type="primary" size="medium" @click="classScheduleCardeidt()">编辑</el-button>  
         <el-button type="danger" size="medium" @click="deleteClassSchedules()">删除</el-button>
         <a :href="exportUrl" download="导出" target="_blank">
              <el-button type="primary" size="medium" icon="upload">导出</el-button>
          </a>
         <el-button type="primary" size="medium"  @click="print()">打印</el-button> 
          <el-button type="primary" size="medium" @click="dialogGroupfun()">刷新周课表</el-button>
      </div>
     <div class="subject" :style="`height: ${nobottommaxH}px;`">
         <div class="top-name">{{name}}</div>
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
     <el-dialog title="刷新周课表" :visible.sync="dialogGroup">
         <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
        <el-checkbox-group v-model="myweekList" @change="handleCheckedCitiesChange">
            <el-checkbox :label="item.value" v-for="(item,index) in weekList" :key="index" >
                {{item.label}}
                 <span style="color:red" v-if="myweeknum==item.value">
                 （当前周）
               </span>
            </el-checkbox>
        </el-checkbox-group>
      <div slot="footer" class="dialog-footer">
          <el-button @click="dialogGroup=false">取 消</el-button>
          <el-button type="primary" @click="copyClassScheduleCurrWeek()">保 存</el-button>
      </div>
    </el-dialog>
</div> 
</template>
<script>
import { classScheduleDetails,deleteClassSchedule,isManager,copyClassScheduleCurrWeek,getSchoolTimeAllList,getSeveralWeekListBySchoolTImeId,classScheduleSet} from "@/api/classScheduleCard";
import mixin from "@/mixins/windowResize";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      id: this.$route.query.id,      
      name: "",
      dialogGroup:false,
      afternoonScheduleCurrListList:[],
      forenoonScheduleCurrListList:[],
      morningScheduleCurrListList:[],
      nightScheduleCurrListList:[],
      noonScheduleCurrListList:[],
      exportUrl:'',
      schoolYearList:[],
      weekList:[],
      myweekList:[],
      selectWeek:'',
      dayMapping:['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
      departId:'',
      checkAll: false,
      isIndeterminate: true,
      myweeknum:-1,
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
                                          value: item.week,
                                          label: '第' + item.week + '周'
                                      }
                                  });
                                   for(let i=0;i<data.length;i++){
                                        if(data[i].nowWeek){
                                            this.myweeknum=data[i].week
                                        }
                                        }  
                                  if (data.map(item => item.nowWeek).indexOf(1) > -1) {
                                      this.selectWeek = data[data.map(item => item.nowWeek).indexOf(1)].week;
                                  } else {
                                      this.selectWeek = data[0].week;
                                  }
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
        handleCheckAllChange(val) {
        let cityOptions=[]
        for(let i=0;i<this.weekList.length;i++){
            cityOptions.push(this.weekList[i].value)
        }
        this.myweekList = val ? cityOptions : [];
        this.isIndeterminate = false;
      },
      handleCheckedCitiesChange(value) {
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.weekList.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.weekList.length;
      },
      dialogGroupfun(){
          this.dialogGroup=true;
          this.myweekList=[]
      },
       copyClassScheduleCurrWeek() {
           if(this.myweekList.length==0){
               this.$message.error('请选择要刷新的周次');
               return
           }
      this.$confirm("确认要刷新周课表吗？", "刷新周课表", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        lockScroll: false
      })
        .then(() => {
          copyClassScheduleCurrWeek(
            {classId:this.departId,weekList:this.myweekList}
          ).then(res => {
            if (res.data.code === 200) {
              this.$message.success("刷新周课表成功");
              this.dialogGroup=false;
            } else {
              this.$message.error(res.data.msg);
            }
          });
        })
        .catch(() => {});
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
          this.name = mydata.departName + "的课程表";
          this.departId = mydata.departId;
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
  width: 810px;
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
    /* width: 130px; */
    min-height: 16px;
    line-height: 16px;
    font-size: 13px;
}
</style>