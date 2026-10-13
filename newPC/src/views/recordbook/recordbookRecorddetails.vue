<template>
<div class="recordbookRecorddetails"  >
     <div class="top"> 
         <el-button @click="$router.back()" type="default" size="medium">返回</el-button> 
         <el-button type="primary" size="medium"  @click="exportExcel('#outTable', `记分册成绩.xls`)"   v-if="dataList.length>0">导出</el-button>     
     </div>
     <div class="subject" >
           <el-table ref="table"  :data="dataList" border :height="nobottommaxH" :cell-class-name='getCellIndex'>
              <el-table-column prop="num"  align="center" label="学号" fixed show-overflow-tooltip></el-table-column>
              <el-table-column  prop="name"  align="center"  label="姓名"  fixed  show-overflow-tooltip></el-table-column>
              <el-table-column  align="center" :label="itemss.currName" v-for="(itemss,indexss) in currList" :key="indexss">
                  <el-table-column  align="center" :label="items.typeName" v-for="(items,indexs) in itemss.scoreBookSet.examTypeList" :key="indexs">
                    <el-table-column  v-if="items.joinQuestion"  align="center" :label="item.typeName" v-for="(item,index) in itemss.scoreBookSet.questionTypeList" :key="index">
                            <template slot-scope="scope">
                               <span v-if="scope.row.list[scope.row.index-2].score"> {{scope.row.list[scope.row.index-2].score}}</span>  
                               <span v-else>----</span>   
                            </template>
                    </el-table-column> 
                     <template slot-scope="scope" v-if="!items.joinQuestion">
                        <span v-if="scope.row.list[scope.row.index-2].score"> {{scope.row.list[scope.row.index-2].score}}</span>  
                        <span v-else>----</span>   
                     </template>                  
                  </el-table-column>
              </el-table-column>
           </el-table>
     </div>
     <div style="display: none;" id="outTable">
           <el-table :data="dataList" border :height="maxH" :cell-class-name='getCellIndex'>
              <el-table-column prop="num"  align="center" label="学号"  show-overflow-tooltip></el-table-column>
              <el-table-column  prop="name"  align="center"  label="姓名"    show-overflow-tooltip></el-table-column>
              <el-table-column  align="center" :label="itemss.currName" v-for="(itemss,indexss) in currList" :key="indexss">
                  <el-table-column  align="center" :label="items.typeName" v-for="(items,indexs) in itemss.scoreBookSet.examTypeList" :key="indexs">
                    <el-table-column  v-if="items.joinQuestion"  align="center" :label="item.typeName" v-for="(item,index) in itemss.scoreBookSet.questionTypeList" :key="index">
                            <template slot-scope="scope">
                               <span v-if="scope.row.list[scope.row.index-2].score"> {{scope.row.list[scope.row.index-2].score}}</span>  
                               <span v-else>----</span>   
                            </template>
                    </el-table-column> 
                     <template slot-scope="scope" v-if="!items.joinQuestion">
                        <span v-if="scope.row.list[scope.row.index-2].score"> {{scope.row.list[scope.row.index-2].score}}</span>  
                        <span v-else>----</span>   
                     </template>                  
                  </el-table-column>
              </el-table-column>
           </el-table>
     </div>
</div> 
</template>
<script>
import baseMixin from '@/mixins/baseMixin';
import { getScoreBookRecord } from "@/api/recordbook";
import mixin from "@/mixins/windowResize";
export default {
  data() {
    return {    
      id: this.$route.query.id,
      currList: [],
      dataList: [],
       timer:null
    };
  },
  mixins: [mixin,baseMixin],
  created() {
    this.getScoreBookRecords();
  },
  methods: {
    //索引
    getCellIndex({ row, column, rowIndex, columnIndex }){
              row.index = columnIndex;
    },
    //获取详情
    getScoreBookRecords() {
      getScoreBookRecord(this.id).then(res => {
        let mydata = res.data.data;
        this.currList = mydata.currList;
        let list = mydata.recordListList;
          for (let i = 0; i < list.length; i++) {
          let obj = {
            name:list[i][0].stuName,
            num:list[i][0].learnNo,
            list:list[i]
          };         
          this.dataList.push(obj);
        };
           this.$nextTick(()=>{
                this.timer=setTimeout(()=> {
                this.$refs.table.doLayout()
                },300) 
            })
      });
    }
  }
};
</script>
<style scoped>
.recordbookRecorddetails .el-table td,
.recordbookRecorddetails .el-table th {
  padding: 5px 0;
  font-size: 12px;
}
.recordbookRecorddetails .el-table .cell,
.recordbookRecorddetails .el-table th div {
   padding:0;
}
</style>
<style lang="scss" scoped>
.recordbookRecorddetails {
  padding:12px;
  .top {
    padding-bottom: 10px;
  }
}
</style>