<template>
    <div class="lack">
        <div class="top"> 
                      <el-date-picker
                v-model="daterange" size="medium"
                type="daterange" class="mywidthdaterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"  @change="statisticss()"
                :clearable="false" style="width:220px;"
            >
            </el-date-picker>        
             <a :href="exportURL" download="导出" target="_blank" v-if="dateList.length">
                <el-button class="filter-item" type="primary" size="medium" icon="upload">导出</el-button>
            </a>             
             <h3>{{msg}}</h3>
        </div>         
         <div class="time-table">     		      
            <el-table stripe :data="dateList" v-loading.body="listLoading" border fit highlight-current-row  style="width: 100%" :height="maxH">
                 <el-table-column align="center" label="班级" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.className}}</span>
                    </template>
                </el-table-column> 
                <el-table-column align="center" label="上报人" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.createUser}}</span>
                    </template>
                </el-table-column> 
                 <el-table-column align="center" label="缺餐" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.missMealCount}}份</span>
                    </template>
                </el-table-column> 
                 <el-table-column align="center" label="缺水果" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.missFruitCount}}份</span>
                    </template>
                </el-table-column> 
                 <el-table-column align="center" label="水果不达标" >
                    <template slot-scope="scope">
                        <span>{{scope.row.badFruitCount}}份</span>
                    </template>
                </el-table-column>                              
                <el-table-column align="center" label="上报时间" width="200">
                    <template slot-scope="scope">
                        <span>{{scope.row.createDate|formatTimeMap}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="备注" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.remark}}</span>
                    </template>
                </el-table-column>
            </el-table>
        </div> 
         <div  class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page.sync="query.pageNo" :page-sizes="[10,20,30, 50]"
                           :page-size="query.pageSize" layout="total, sizes, prev, pager, next, jumper"
                           :total="total">
            </el-pagination>
        </div>    
    </div>
</template>

<script>
import { reportMissAnalysis } from "@/api/fire";
//	返回按钮
import BackTool from "@/components/BackTool";
import moment from "moment";
import mixin from '@/mixins/windowResize';
export default {
  name: "statisticsDetail",
  //引入返回模块
  components: {
    BackTool
  },
  data: function() {
    return {
      listLoading: false,     
      dateList: [],//表格主题数据
      total:null,
      exportURL: '',
      msg:'',
      query: {
        startDate: this.$moment().format("YYYY-MM-DD"), //开始时间
        endDate:this.$moment().format("YYYY-MM-DD"), //结束时间      
        pageNo: 1, //页数
        pageSize: 20 //条数
      },
       daterange: [new Date(), new Date()],
    };
  },
   mixins: [mixin],
  //获取渲染数据当数据加载完成后执行(生命周期中的钩子函数)
  created() { 
       this.daterange[0] = new Date(moment().set('date', 1).valueOf());   
      this.statisticss();
    
  }, 
   filters: {
           
            formatTimeMap(type) {
                if (type.indexOf("-") === -1) {
                    return "暂未发布"
                } else {
                    return type.substring(0,19)
                }

            }
        },
  methods: {
    statisticss() {  
      this.query.startDate = this.$moment(this.daterange[0]).format("YYYY-MM-DD"); //时间
      this.query.endDate = this.$moment(this.daterange[1]).format("YYYY-MM-DD"); //时间
      this.exportURL = global.BasePath + 'structure/report/downReportMiss?endDate=' + this.query.endDate+'&startDate=' + this.query.startDate + '&token=' + this.$store.getters.token;
      reportMissAnalysis(this.query).then(res => {
        let data = res.data.data;
        this.dateList=data.dataList;
        this.msg=data.msg;
        this.total = data.pagination.total;
      });
    },
  
    handleSizeChange(val) {
                this.query.pageSize = val;
                this.statisticss();
            },
    handleCurrentChange(val) {
                this.query.pageNo = val;
                this.statisticss();
    }
  
  }
};
</script>
<style scoped>
.top{
     padding-bottom:10px;
}
.lack {
  padding:12px;
}
.lack h3{
 margin: 0;
 line-height: 40px
}
.lack .el-select {
    width: 100px;
}
</style>
