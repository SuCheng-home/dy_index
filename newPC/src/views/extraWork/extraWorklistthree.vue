<template>
  <div class="extraWorklistthree">
    <div class="header">
      <el-button  size="medium" @click="extraWorklisttwo()">返回</el-button>   
      <el-date-picker size="medium"  v-model="daterange" type="daterange" class="mywidthdaterange" range-separator="-"  start-placeholder="开始日期" end-placeholder="结束日期" @change="loadExtraWorkLists()" :clearable="false"> </el-date-picker>
      <!-- <a :href="downLoadHref" target="_blank" download="examName"><el-button type="primary"  size="medium">导出</el-button></a>  -->
    </div>
    <div class="schoolWrap scrollStyle" >
           <el-table  :data="dataList"  border stripe  :height="maxH">
                <el-table-column   prop="workContent" label="事由"  align="center" width="180" show-overflow-tooltip> </el-table-column>
                <el-table-column align="center" label="加班人员及时长" width="180" show-overflow-tooltip>
                    <template slot-scope="scope" >
                     <span v-for="(item,index) in scope.row.workUserInfoList" :key="index"> {{item.userNameStr}} {{item.workTime}}
                         <span v-if="item.workUnit==1">天</span>
                         <span v-else>小时</span>；
                         </span>               
                    </template>
                </el-table-column>
                <el-table-column   prop="createUserName" label="申请人"  align="center" > </el-table-column>
                 <el-table-column align="center" label="加班开始日期">
                    <template slot-scope="scope" >
                     <span > {{scope.row.startTime.slice(0,10)}}</span>               
                    </template>
                </el-table-column> 
                 <el-table-column align="center" label="加班结束日期">
                    <template slot-scope="scope" >
                     <span > {{scope.row.endTime.slice(0,10)}}</span>               
                    </template>
                </el-table-column> 
                <el-table-column align="center" label="图片">
                    <template slot-scope="scope" >
                     <span v-if="(!scope.row.picList)||(scope.row.picList.length==0)"> ----</span>  
                     <span>
                          <image-previewer tag="richtext">
                               <img v-for="(item,index) in scope.row.picList" :key="index" :src="item.picUrl" style="margin: 0 3px; width: 20px;height:20px;vertical-align: middle;">
                          </image-previewer></span>             
                    </template>
                </el-table-column>  
                <el-table-column align="center" label="申请时间">
                    <template slot-scope="scope" >
                     <span  > {{scope.row.createTime.slice(0,16)}}</span>               
                    </template>
                </el-table-column> 
                <el-table-column   prop="applyUserName" label="审批人"  align="center" > </el-table-column>                
            </el-table>   
    </div>
     <div class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page.sync="query.pageNo" :page-sizes="[10,20,30, 50]"
                           :page-size="query.pageSize" layout="total, sizes, prev, pager, next, jumper"
                           :total="total">
            </el-pagination>
        </div>
    
  </div>
</template>
<script>
import mixins from "@/mixins/windowResize";
import baseMixin from "@/mixins/baseMixin";
import moment from "moment";
import {loadExtraWorkListtwo} from '@/api/extraWork';
import ImagePreviewer from '@/components/ImagePreviewer/ImagePreviewer.vue';
export default {
  data() {
    return {
      dataList: [],
      daterange: ["", ""],
      total: null,
      query: {
        startTime: "",
        endTime: "",
        pageNo: 1, //页数
        pageSize: 20, //条数
        fromType: 2,
        workUserId:this.$route.query.workUserId
      },
      downLoadHref:'',
      
    };
  },
  created() {
      if(this.$route.query.startTime){
            this.daterange = [this.$route.query.startTime,this.$route.query.endTime];
      }else{
          this.daterange = [this.$moment().format("YYYY-MM-DD"),this.$moment().format("YYYY-MM-DD")];
      }
    
    this.loadExtraWorkLists();
  },
   components: {
            ImagePreviewer
        },
  mixins: [mixins, baseMixin],
  methods: {
    extraWorklisttwo() {
       this.query.startTime = this.$moment(this.daterange[0]).format("YYYY-MM-DD"); //时间
      this.query.endTime = this.$moment(this.daterange[1]).format("YYYY-MM-DD"); //时间
      this.$router.push({
        path: "extraWorklisttwo",
        query: {
            endTime:this.query.endTime,
             startTime:this.query.startTime
        }
      });
    },
    //获取列表
    loadExtraWorkLists() {
      this.datalist = [];
      this.query.startTime = this.$moment(this.daterange[0]).format("YYYY-MM-DD"); //时间
      this.query.endTime = this.$moment(this.daterange[1]).format("YYYY-MM-DD"); //时间
      this. downLoadHref=global.BasePath + "structure/extraWork/exportExtraWorkList?startTime=" +this.query.startTime +"&workUserId=" +this.query.workUserId+"&endTime=" +this.query.endTime+"&fromType=2"+"&token=" +this.$store.getters.token;
       loadExtraWorkListtwo(this.query).then(res => {
                    let data = res.data.data;
                    this.dataList = data.dataList;
                    this.total = data.pagination.total;
       });
    },
    //切换条数
    handleSizeChange(val) {
      this.query.pageSize = val;
      this.query.pageNo = 1;
      this.loadExtraWorkLists();
    },
    //切换页数
    handleCurrentChange() {
      this.loadExtraWorkLists();
    }
  }
};
</script>
<style scoped>
.el-range-editor--medium .el-range-separator {
  width: 30px;
}
</style>

<style lang="scss" scoped>
.extraWorklistthree {
  padding:12px;
  box-sizing: border-box;
  font-size: 14px;

  * {
    box-sizing: border-box;
  }
  .checkbox-box {
    padding-bottom: 10px;
  }  
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 240px;
  }
  .el-select {
    width: 175px;
  }
  .red {
    color: #f56c6c;
  }
  .green {
    color: #67c23a;
  }
  .filter-item {
    width: 100px;
  }
  .header {
    padding-bottom: 10px;
   
  }
  .schoolWrap {
    overflow-x: hidden;
    overflow-y: auto;
    box-sizing: border-box;
    .title {
      line-height: 34px;
      height: 34px;
      .square {
        display: inline-block;
        width: 10px;
        height: 10px;
        background: #acd6ff;
        margin: 15px 8px 0 0;
      }
    }
    .text {
      padding-left: 18px;
      box-sizing: border-box;
      h3 {
        font-size: 16px;
      }
    }
  }
}
</style>

