<template>
    <div class="newdeyuSummaryTable">
                  <div class="top">
                        <el-select size="medium" v-model="query.schoolTimeId" placeholder="请选择学期" @change="changeSchool()">
                           <el-option v-for="item in schoolYearList" :key="item.id" :label="item.schoolTimeName" :value="item.id"></el-option>
                        </el-select>
                        <el-date-picker size="medium" v-model="daterange" type="daterange" class="mywidthdaterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"  @change="teacherBehEvalStuScores()" :clearable="false" >
                        </el-date-picker>
                       <el-select v-model="query.dimensionId" placeholder="请选择分类"  size="medium"   @change="getSchoolConductListByTh" >
                             <el-option label="全部分类" :value="0"></el-option>
                        <el-option v-for="statusItem in typelist" :key="statusItem.id" :label="statusItem.dimensionName" :value="statusItem.id">
                            </el-option>
                        </el-select>
                        <el-button   v-if="behEvalThList.length"  @click="exportExcel('#outTable', `德育评价老师统计.xlsx`)" type="primary" size="medium" icon="upload">导出</el-button>
                        <el-input  size="medium"  style="width:20%;float: right;" placeholder="请输入老师姓名" v-model.trim="query.createUserName" @change="getSchoolConductListByTh">
                              <el-button slot="append" icon="el-icon-search" @click="getSchoolConductListByTh"></el-button>
                        </el-input>
                    </div>
                    <div  id="outTable" >
                         <el-table stripe :data="behEvalThList"  :height="`${nobottommaxH}px`" border>             
                        <el-table-column label="姓名" align="center" sortable prop="teacherUserName"></el-table-column>   
                        <el-table-column label="所属部门" align="center" sortable prop="departName"></el-table-column>                           
                        <el-table-column label="加分次数" align="center" sortable prop="addCount"></el-table-column> 
                        <el-table-column label="扣分次数" align="center" sortable prop="lessCount"></el-table-column> 
                        <el-table-column label="评价总计" align="center" sortable prop="totalCount"></el-table-column>
                    </el-table>

                    </div>
                  
    </div>
</template>
<script>
import mixin from "@/mixins/windowResize";
import { mapGetters } from "vuex";
import baseMixin from '@/mixins/baseMixin';
import { getSchoolTimeAllList} from "@/api/classroomEvaluationtwo";
import {getSchoolConductListByTh,getSchoolConductDimensionList} from  '@/api/deyu';
export default {
  data() {
    return {
      activeName: "four",
      query: {
        schoolTimeId: "",
        startDate: "",
        endDate: "",
        createUserName:"",
        dimensionId:0
      },
      schoolYearList:[],
      daterange:[ this.$moment().format('YYYY-MM-DD'), this.$moment().format('YYYY-MM-DD')],
      behEvalThList:[],
      typelist:[]
    };
  },
  mixins: [mixin,baseMixin],
  computed: {
    ...mapGetters(["userInfo"])
  },
  mounted() {
       //学期列表
      getSchoolTimeAllList().then(res=>res.data)
      .then(data=>{
        if(data.code===200){
          this.schoolYearList=data.data;
          this.schoolYearList.forEach(item=>{
            if(item.isCurrent==1){
              this.query.schoolTimeId=item.id;          
              this.daterange= [item.startDate, this.$moment().format('YYYY-MM-DD')];
              this.getSchoolConductListByTh()
            }
          })
        }
      })

      getSchoolConductDimensionList().then(res=>res.data)
      .then(data=>{
        if(data.code===200){
          this.typelist=data.data;          
        }
      })
  },
  methods: {
    getSchoolConductListByTh(){
        this.datalist=[];
        this.query.startDate = this.$moment(this.daterange[0]).format('YYYY-MM-DD'); //时间
        this.query.endDate = this.$moment(this.daterange[1]).format('YYYY-MM-DD'); //时间
        getSchoolConductListByTh(this.query).then(res=>res.data).then(data=>{
           if(data.code===200){ 
           this.behEvalThList=data.data;
            }
        })
    },
     //切换学期
    changeSchool(){
      let schoolItem='';
      for(let i=0;i<this.schoolYearList.length;i++){
        if(this.schoolYearList[i].id==this.query.schoolTimeId){
            schoolItem=this.schoolYearList[i]
        }
      };
      if(schoolItem.isCurrent==1){
        if(schoolItem.startDate>this.$moment().format('YYYY-MM-DD')){
            this.daterange= [ this.$moment().format('YYYY-MM-DD'),schoolItem.startDate];
        }else{
            this.daterange= [schoolItem.startDate, this.$moment().format('YYYY-MM-DD')];
        }
          
      }else{
          this.daterange= [schoolItem.startDate, schoolItem.endDate];
      };
      this.getSchoolConductListByTh()
    },
  }
};
</script>
<style lang="scss" scoped>
.newdeyuSummaryTable {
  padding: 12px;
  .top {
    padding-bottom: 10px;
  }
}
</style>
