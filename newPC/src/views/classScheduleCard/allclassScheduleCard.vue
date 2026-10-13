<template>
<div class="classScheduleCardwholeonedetails"  >
     <div class="top"> 
        <el-select v-model="selectWeek" @change="getClassScheduleDetailsBySchIdAndWeek2"  placeholder="请选择周次"  size="medium" >
                        <el-option  v-for="item in weekList"   :key="item.value" :label="item.label" :value="item.value"> </el-option>
                    </el-select>
          <el-button type="primary" size="medium"  @click="print()">打印</el-button> 
          <el-button type="primary" size="medium"  @click="exportExcel('#outTable', `全校总表.xlsx`)"   >导出</el-button>
          <el-input class="search-input" style="width:20%;float: right;"
                          placeholder="请输入老师姓名（全称）" icon="search" size="medium" 
                          v-model.trim="teacherName">
                    <el-button slot="append" icon="el-icon-search" ></el-button>
            </el-input>  
      </div>
     <div class="subject" id="outTable" :style="`height: ${nobottommaxH}px;`">
        <table cellpadding="0"  ref="print" id="print" cellspacing="0">
				<tbody>
                   <tr>
					<th>星期</th>
					<th :colspan="bignum" :key="index" v-for="(item,index) in schoolTimeDateList" v-if="item.schoolTimeDate">
            {{item.schoolTimeDate}}（{{dayMapping[new Date(item.schoolTimeDate).getDay()]}}）
          </th>
				  </tr>	
          <tr>
					<th>班级</th>
          <template   v-for="(item,index) in schoolTimeDateList" v-if="item.schoolTimeDate">
              	<th v-if="classScheduleSet.morning!=0" :colspan="classScheduleSet.morning">早</th>
                <th v-if="classScheduleSet.forenoon!=0" :colspan="classScheduleSet.forenoon">上午</th>
                <th v-if="classScheduleSet.noon!=0" :colspan="classScheduleSet.noon">午</th>
                <th v-if="classScheduleSet.afternoon!=0" :colspan="classScheduleSet.afternoon">下午</th>
                <th v-if="classScheduleSet.night!=0" :colspan="classScheduleSet.night">晚</th>
          </template>
				
				  </tr>	
                  <tr :key="indexss" v-for="(itemss,indexss) in classList">						
						<td><div class="title">{{itemss.className}}</div></td>	
                        <td :key="indexs" v-for="(items,indexs) in itemss.seqCurrTeahcerList">
                          <el-tooltip class="item" effect="dark" :content="item.teacherName" placement="top" :key="index" v-for="(item,index) in items">
                            <div  class="box" :class="{ 'color':item.teacherName==teacherName}">
                                {{item.currName}}
                             </div>
                          </el-tooltip>
                           
                        </td>
						
					</tr>	
			</tbody>
        </table>
     </div>
</div> 
</template>
<script>
import {getClassScheduleDetailsBySchIdAndWeek2,getSchoolTimeAllList,getSeveralWeekListBySchoolTImeId,classScheduleSet} from "@/api/classScheduleCard";
import mixin from "@/mixins/windowResize";
import { mapGetters } from "vuex";
import baseMixin from '@/mixins/baseMixin';
export default {
  data() {
    return {
        classList:[],
        classScheduleSet:{
            afternoon:0,//	下午	number	0代表没有
            forenoon:0,//	上午	number	0代表没有
            morning:0,//	早上	number	0代表没有
            night:0,//	晚上	number	0代表没有
            noon:0,//	中午	number	0代表没有
        },
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
  mixins: [mixin,baseMixin],
  computed: {
    ...mapGetters(["schoolInfo"])
  },
  created() {
     this.classScheduleSets();
    
  },
  methods: {
    print() {
      this.$print(this.$refs.print);
    },
    //获取课程表设置
    classScheduleSets() {
      classScheduleSet(this.schoolInfo.id)
        .then(res => res.data)
        .then(data => {
          this.weekDayCount = data.data.weekDayCount;
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
                                  if (data.map(item => item.nowWeek).indexOf(1) > -1) {
                                      this.selectWeek = data[data.map(item => item.nowWeek).indexOf(1)].week;
                                  } else {
                                      this.selectWeek = data[0].week;
                                  }
                                 this.getClassScheduleDetailsBySchIdAndWeek2();
                              }
                          }).catch(() => {
                          });
                        }
                    });
                }).catch();
        });
    },
    //获取详情
    getClassScheduleDetailsBySchIdAndWeek2() {
      getClassScheduleDetailsBySchIdAndWeek2(this.selectWeek)
        .then(res => res.data)
        .then(data => {
          var weekDayCount = (data.data.classScheduleSet && data.data.classScheduleSet.weekDayCount) || this.weekDayCount;
          this.classScheduleSet=data.data.classScheduleSet;
          // 补全日期列：后端只返回5天时，前端补全周六日日期
          var dateList = data.data.schoolTimeDateList || [];
          while(dateList.length < weekDayCount && dateList.length > 0) {
            var lastDate = new Date(dateList[dateList.length - 1]);
            lastDate.setDate(lastDate.getDate() + 1);
            var y = lastDate.getFullYear();
            var m = lastDate.getMonth() + 1;
            var d = lastDate.getDate();
            dateList.push(y + '-' + (m < 10 ? '0' + m : m) + '-' + (d < 10 ? '0' + d : d));
          }
          this.schoolTimeDateList = dateList;
          // 补全每个班级的数据列：不足weekDayCount时补空数组
          var classList = data.data.classList || [];
          classList.forEach(function(item) {
            var seqList = item.seqCurrTeahcerList || [];
            while(seqList.length < weekDayCount) {
              seqList.push([]);
            }
            item.seqCurrTeahcerList = seqList;
          });
          this.classList = classList;
          this.bignum=Math.round(data.data.classScheduleSet.afternoon+data.data.classScheduleSet.forenoon+data.data.classScheduleSet.morning+data.data.classScheduleSet.night+data.data.classScheduleSet.noon)
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
.title{
    width: 90px;
    text-align: center;
}
/* .top {
  border-bottom: 1px solid #e7eaec;
  padding-bottom: 10px;
} */
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
  margin: 0 auto;
  min-width: 100%;
}
th {
    border: 1px solid #b3d8ff;
    text-align: center;
    font-size: 13px;
    line-height: 20px;
    overflow: hidden;
    background: #ecf5ff;
    color:#409EFF;
    padding: 5px;
}
td {
  border: 1px solid #b3d8ff;
  text-align: center;
  font-size: 12px;
  line-height: 16px;
  background: #fff;
  padding: 5px;
  min-width:40px;
}
.box{   
   margin: 2px auto;
   cursor:pointer;
}
.color{
    background: #E6A23C;
    color:#fff;
}
</style>