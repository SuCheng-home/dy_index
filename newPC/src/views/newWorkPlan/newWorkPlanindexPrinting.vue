<template>
<div class="newWorkPlanindexPrinting">
    <div class="top"> 
         <el-button @click="$router.back()" type="default" size="medium">返回</el-button> 
         <el-button size="medium" type="primary" @click="print">打印</el-button>
    </div>
    <div class="body" :style="`height: ${nobottommaxH}px;`">
        <div ref="print" id="newprint" class="print">
        <div class="center">
           <div class="top-name">{{schoolInfo.name}}  {{query.schoolTimename}}</div>
            <div class="top-name" style="font-size:18px;">  第{{query.week}}周工作安排（{{dataList[1].dayDate}} ~ {{dataList[7].dayDate}}）</div>
               
            <table>
           <colgroup>
                <col style="width:20%" />
                <col style="width:10%" />
                <col style="width:50%" />
                <col style="width:10%" />
                <col style="width:20%" />
          </colgroup>
           <thead>
          <tr>
            <th>日期星期</th>
            <th>时间</th>
            <th>主要内容</th>
            <th>地点</th>
            <th>负责部门</th>
          </tr>
        </thead>
        <tbody> 
            <tr :key="index"  v-for="(item,index) in dataList[0].dayPlanList" v-if="dataList[0].dayPlanList.length>0">
                <td class="td" style="width:20%"  :rowspan="dataList[0].dayPlanList.length" v-if="index==0">{{dataList[0].dayName}}</td>
                <td></td>
                <td>{{index+1}}.{{item.content}}</td>
                <td></td>
                <td class="td">{{item.department}}</td>
            </tr>   
            <tr v-if="dataList[0].dayPlanList.length==0">
                <td class="td">{{dataList[0].dayName}}</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>   
        </tbody>    
        <tbody v-for="(items,indexs) in dataList" :key="indexs" v-if="indexs!=0&&indexs!=8">
            <tr :key="index"  v-for="(item,index) in items.dayPlanList" v-if="items.dayPlanList.length>0">
                <td class="td" :rowspan="items.dayPlanList.length" v-if="index==0">{{items.dayName}}（{{items.dayDate}}）</td>
                <td><span v-if="item.timeType==1">全天</span>
                                 <span v-if="item.timeType==2">上午</span>
                                 <span v-if="item.timeType==3">下午</span>
                                 <span v-if="item.timeType==4">{{item.startTime}}</span></td>
                <td>{{index+1}}.{{item.content}}</td>
                <td>  {{item.place}}</td>
                <td class="td">{{item.department}}</td>
            </tr>   
            <tr v-if="items.dayPlanList.length==0">
                <td class="td">{{items.dayName}}（{{items.dayDate}}）</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>   
        </tbody>
        <tbody v-for="(items,indexs) in dataList" :key="indexs" v-if="indexs==8">
            <tr :key="index"  v-for="(item,index) in items.dayPlanList" v-if="items.dayPlanList.length>0">
                <td class="td" :rowspan="items.dayPlanList.length" v-if="index==0">{{items.dayName}}</td>
                <td colspan = "4">{{index+1}}.
                              {{item.outStartDate}}~{{item.outEndDate}} {{item.principals}} 外出地点 （{{item.outPlace}}）外出内容
                              （{{item.content}}）</td>
            </tr>   
            <tr v-if="items.dayPlanList.length==0">
                <td class="td">{{items.dayName}}</td>
                <td colspan = "4"></td>
            </tr>   
        </tbody>
        <tbody>
            <tr>
                <td class="td">备注</td>
                <td colspan = "4" v-html="remarks"></td>
            </tr>   
        </tbody>
      </table>
        </div>
      </div>

    </div>

</div> 
</template>
<script>
import mixin from "@/mixins/windowResize";
import { mapGetters } from "vuex";
import { getSchoolWorkPlanNoticeList } from "@/api/newWorkPlan";
export default {
  data() {
    return {
      query: {
        schoolTimeId:this.$route.query.schoolTimeId,
        schoolTimename:this.$route.query.schoolTimename,
        week:this.$route.query.week
      },
      dataList: [],
      remarks: ""
    };
  },
  mixins: [mixin],
  computed: {
    ...mapGetters(["schoolInfo"])
  },
  mounted() {
    this.getSchoolWorkPlanNoticeLists();
  },
  methods: {
      print() {
        this.$print(this.$refs.print);
      },
    getSchoolWorkPlanNoticeLists() {
      getSchoolWorkPlanNoticeList(this.query.schoolTimeId, this.query.week)
        .then(res => {
          let data = res.data.data;
          this.dataList = data;
          if (data[0].content) {
            this.remarks = data[0].content
              .replace(/\r\n/g, "<br/>")
              .replace(/\n/g, "<br/>")
              .replace(/\s/g, "&nbsp;");
          } else {
            this.remarks = "";
          }
        })
        .catch(err => {});
    }
  }
};
</script>
<style lang="scss" scoped>
.newWorkPlanindexPrinting {
  padding:12px;
}
.body {
  overflow: auto;
}
.print{
    width: 810px;
    margin: 10px auto;
    padding: 5px;
}
.top-name{
    line-height: 36px;
    font-size: 24px;
    text-align: center;
}
.top {
  border-bottom: 1px solid #e7eaec;
  padding-bottom: 10px;
}
* {
  box-sizing: border-box;
  word-break: break-all;
  word-wrap: break-word;
}
  th,.td{
      text-align: center;
      line-height: 20px;
      padding: 8px 0px;
    }    
    td{
       line-height: 20px;
      padding: 8px 10px;
      color:#606266; 
    }
    table,table  td,th{
        border: 1px solid #E4E7ED;
        font-size: 14px;

    }
    // th{
    //     border-top: none;
    // }
    table {
        border-left: 1px solid #E4E7ED;
        border-spacing: 0;/*去掉单元格间隙*/
        width: 100%;
    }
</style>
