<template>
<div class="evTeaTempDetailinfo"  >
     <div class="top">          
          <el-button @click="$router.back()" type="default" size="medium">返回</el-button> 
          <el-button type="primary" size="medium"  @click="print()">打印</el-button> 
          <el-button type="primary" size="medium"  @click="exportExcel('#outTable', `评教评学老师统计明细.xlsx`)"   >导出</el-button>
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
					<th>任课老师</th>
					<th>任教班级</th>
                    <th>任教科目</th>
                    <th>投票人数</th>
                    <th :key="indexs" v-for="(items,indexs) in opionNumList">题目{{items}}</th>
				  </tr>	
                  <tr :key="indexss" v-for="(itemss,indexss) in dataList">						
						<td>{{itemss.optionTeacherName}}</td>
                        <td>{{itemss.className}}</td>	
                        <td>{{itemss.optionCurrName}}</td>
                        <td>{{itemss.peopleCount}}</td>	
                        <td :key="indexs" v-for="(items,indexs) in itemss.voteCountList">
                            <div  class="box">
                                {{items}} / {{items ? computeTotal(itemss.stuCount,items) : '0%'}}
                             </div>
                        </td>
						
					</tr>	
			</tbody>
        </table>
     </div>
</div> 
</template>
<script>
import {getEvaluateCurrOptionStaticListByThId} from '@/api/evTea';
import mixin from "@/mixins/windowResize";
import { mapGetters } from "vuex";
import baseMixin from '@/mixins/baseMixin';
export default {
  data() {
    return {
       opionNumList:[],
       dataList:[]
        
    };
  },
  mixins: [mixin,baseMixin],
  created() {
     this.getEvaluateCurrOptionStaticListByThId();
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
    getEvaluateCurrOptionStaticListByThId() {
         getEvaluateCurrOptionStaticListByThId(this.$route.query)
                    .then(res => res.data)
                    .then(data => {
                        const pageData = data.data;
                        this.opionNumList = pageData.topicNumList;
                        this.dataList = pageData.userList;
                    })
     
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