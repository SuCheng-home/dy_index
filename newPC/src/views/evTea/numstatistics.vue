<template>
<div class="numstatistics"  >
     <div class="top"> 
         <el-button @click="$router.back()" type="default" size="medium">返回</el-button>
          <el-button type="primary" size="medium"  @click="print()">打印</el-button> 
          <el-button type="primary" size="medium"  @click="exportExcel('#outTable', `分数统计.xlsx`)"   >导出</el-button>
          <el-button type="primary" size="medium"  @click="numstatisticsinfo('')">查看详情</el-button> 
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
					<th>老师姓名</th>
                    <th>评教人数</th>
                    <th>问题数</th>
                    <th>投票总数</th>
                    <th>总得分</th>
                    <th>平均分</th>
				  </tr>	
                  <tr :key="indexs" v-for="(items,indexs) in dataList" v-if="(items.tempTeacherName==teacherName)||(teacherName=='')">						
						<td><div class="title" @click="numstatisticsinfo(items.tempTeacherName)">{{items.tempTeacherName}}</div></td>	
                        <td><div class="box">{{items.peopleCount}}</div></td>
                        <td><div class="box">{{items.topicCount}}</div></td>
                        <td><div class="box">{{items.stuCount}}</div></td>
                        <td><div class="box">{{items.score}}</div></td>
                        <td><div class="box">{{(items.score/items.peopleCount).toFixed(2)-0}}</div></td>
					</tr>	
			</tbody>
        </table>
     </div>
</div> 
</template>
<script>
import {getStaticScoreListThByBatchTempId} from '@/api/evTea';
import mixin from "@/mixins/windowResize";
import { mapGetters } from "vuex";
import baseMixin from '@/mixins/baseMixin';
export default {
  data() {
    return {
        teacherName:'',
        dataList:[],
        batchId:this.$route.query.batchId,   
        batchTempId:this.$route.query.batchTempId,  
    };
  },
  mixins: [mixin,baseMixin],
  created() {
      getStaticScoreListThByBatchTempId(this.$route.query)
                    .then(res => res.data)
                    .then(data => {
                        this.dataList = data.data;
                    })
  },
  methods: {
    print() {
      this.$print(this.$refs.print);
    },
    numstatisticsinfo(teacherUserName){
        this.$router.push({
        path: "numstatisticsinfo",
        query: { teacherUserName: teacherUserName,batchId:this.batchId,batchTempId:this.batchTempId}
      });
    },

  }
};
</script>
<style scoped>
.numstatistics {
  padding:12px;
}
* {
  box-sizing: border-box;
}
.title{
    text-align: center;
    color:#409EFF;
    cursor:pointer;
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