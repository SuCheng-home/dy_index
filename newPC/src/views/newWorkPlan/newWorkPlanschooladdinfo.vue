<template>
<div class="newWorkPlanschooladdinfo"  >
     <div class="top"> 
         <el-button @click="$router.back()" type="default" size="medium">返回</el-button> 
         <el-button size="medium" type="primary" @click="print">打印</el-button>
         <el-button size="medium" type="primary" @click="exportExcel('#newprint', `工作计划明细.xlsx`)">导出</el-button>
      </div>
     <div class="body" :style="`height: ${nobottommaxH}px;`">
        <div ref="print" id="newprint" class="print">
        <div class="center">
            
             
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
                <th colspan = "5" >
                    <div class="top-name">{{schoolInfo.name}}  {{query.schoolTimeName}}</div>
            <div class="top-name" style="font-size:18px;">第{{query.week}}周工作安排（{{dataList[1].dayDate}} ~ {{dataList[7].dayDate}}）</div>
                </th>
            </tr>   
          <tr>
             <th>日期星期</th>
            <th>时间</th>
            <th>主要内容</th>
            <th>地点</th>
            <th>负责部门</th>
          </tr>
        </thead>
        <tbody v-for="(items,indexs) in dataList" :key="indexs" >
            <tr :key="index"  v-for="(item,index) in items.dayPlanList" v-if="items.dayPlanList.length>0">
                <td class="td" :rowspan="items.dayPlanList.length" v-if="index==0">{{items.dayName}}<span v-if="items.dayDate">（{{items.dayDate}}）</span></td>
                <td><span v-if="item.timeType==1">全天</span>
                                 <span v-if="item.timeType==2">上午</span>
                                 <span v-if="item.timeType==3">下午</span>
                                 <span v-if="item.timeType==4">{{item.startTime}}</span></td>
                <td>{{index+1}}.{{item.content}}</td>
                <td>  {{item.place}}</td>
                <td class="td">{{item.department}}</td>
            </tr>   
            <tr v-if="items.dayPlanList.length==0">
                <td class="td">{{items.dayName}}<span v-if="items.dayDate">（{{items.dayDate}}）</span></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
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
import windowResize from "@/mixins/windowResize";
    import baseMixin from '@/mixins/baseMixin';
import {getWorkPlanInfoByParam,getWorkPlanInfoById} from "@/api/newWorkPlan";
import mixin from "@/mixins/windowResize";
import {mapGetters} from 'vuex';
export default {
  data() {
    return {
      query: this.$route.query,
      id:'',
      dataList:[],
      remarks:''
    };
  },
  mixins: [mixin,windowResize,baseMixin],
   computed: {
    ...mapGetters(["schoolInfo"])
  },
  created() {
    this.getWorkPlanInfoByParams();
  },
  methods: {
       print() {
        this.$print(this.$refs.print);
      },
    //获取是否有id
    getWorkPlanInfoByParams(){
         getWorkPlanInfoByParam(0,this.query.week,this.query.schoolTimeId,3).then(res => {
          let data = res.data.data;
           this.id=data.id;
            this.getWorkPlanInfoByIds();
        })
        .catch(err => {});
    },
    getWorkPlanInfoByIds(){
      getWorkPlanInfoById(this.id)
        .then(res => {
          let data = res.data.data;
          this.dataList=data.planContentList;  
          if(data.remarks){
             this.remarks=data.remarks;
          }  
        })
        .catch(err => {});
    }
  }
};
</script>
<style lang="scss" scoped>
.newWorkPlanschooladdinfo {
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
