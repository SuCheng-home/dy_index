<template>
<div class="evTeaTempDetailinfo"  >
     <div class="top">          
          <el-button @click="$router.back()" type="default" size="medium">返回</el-button> 
          <el-button type="primary" size="medium"  @click="print()">打印</el-button> 
          <el-button type="primary" size="medium"  @click="exportExcel('#outTable', `老师评教评学统计.xlsx`)"   >导出</el-button>
          <!-- <el-input class="search-input" style="width:20%;float: right;"
                          placeholder="请输入老师姓名（全称）" icon="search" size="medium" 
                          v-model.trim="teacherName">
                    <el-button slot="append" icon="el-icon-search" ></el-button>
            </el-input>   -->
      </div>
     <div class="subject" id="outTable" :style="`height: ${nobottommaxH}px;`">
        <table cellpadding="0"  ref="print" id="print" cellspacing="0">
				<tbody>
                   <tr>
					<th>姓名</th>
					<th>所教班级</th>
                    <th>所教学科</th>
                    <th>投票人数</th>
                    <th>总票数</th>
                    <th :key="indexs" v-for="(items,indexs) in topicOpionNumList">{{items}}</th>
				  </tr>	
                  <tr :key="indexss" v-for="(itemss,indexss) in userList">						
						<td>{{itemss.tempTeacherName}}</td>
                        <td>{{itemss.className}}</td>	
                        <td>{{itemss.tempCurrName}}</td>
                        <td>{{itemss.peopleCount}}</td>	
                        <td>{{itemss.stuCount}}</td>	
                        <td :key="indexs" v-for="(items,indexs) in itemss.voteCountList">
                            <div  class="box">
                                {{items}} / {{items ? computeTotal(itemss.peopleCount,items) : '0%'}}
                             </div>
                        </td>
						
					</tr>	
			</tbody>
        </table>
     </div>
</div> 
</template>
<script>
import {getEvaluateCurrTopicStaticListByBatchTempId} from '@/api/evTea';
import mixin from "@/mixins/windowResize";
import { mapGetters } from "vuex";
import baseMixin from '@/mixins/baseMixin';
export default {
  data() {
    return {
       topicOpionNumList:[],
       userList:[]
        
    };
  },
  mixins: [mixin,baseMixin],
  created() {
     this.getEvaluateCurrTopicStaticListByBatchTempId();
  },
  methods: {
       computeTotal(one,two){
        var aa=(((two/one)*100).toFixed(2)-0)+'%';
        return aa;
      },
    print() {
      this.$print(this.$refs.print);
    },
    //获取详情
    getEvaluateCurrTopicStaticListByBatchTempId() {
      getEvaluateCurrTopicStaticListByBatchTempId(this.$route.query)
        .then(res => res.data)
        .then(data => {
          this.userList = data.data.userList; 
          this.topicOpionNumList = data.data.topicOpionNumList; 
         });
    }
  }
};
</script>
<style scoped>
.evTeaTempDetailinfo {
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
    min-width:70px;
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