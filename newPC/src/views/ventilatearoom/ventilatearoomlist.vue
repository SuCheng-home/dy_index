<template>
  <div class="ventilatearoomlist">
        <div class="el-row menu-tools">
          <el-row >
                        <el-col :span="19">   
            <el-date-picker  v-model="query.date" type="date"  size="medium" placeholder="请选择日期" :clearable="false" @change="inputsearchNametime"></el-date-picker>
            <a :href="downLoadHref" target="_blank"  v-if="dataList.length" download="examName"><el-button type="primary"  size="medium">导出</el-button></a>                       
                        </el-col>
                        <el-col :span="5">
                           <el-input size="medium" placeholder="请输入打卡地点" v-model.trim="query.searchName" @input="inputsearchNametime()">
               <el-button slot="append" icon="el-icon-search" @click="inputsearchNametime()"></el-button>
            </el-input>
                        </el-col>
                    </el-row>
          
           
         </div>
        <div class="schoolWrap scrollStyle" >
            <div class="ul">
                <div class="li">
                    <span>{{totalCount}}</span>
                    打卡地点总数
                </div>
                 <div class="li">
                    <span>{{yinum}}</span>
                    已打卡
                </div>
                 <div class="li">
                    <span>{{unFinishCount}}</span>
                    未打卡
                </div>
                 <div class="li">
                    <span>{{allFinishCount}}</span>
                    打卡项全部完成
                </div>
                 <div class="li">
                    <span>{{partFinishCount}}</span>
                    打卡项部分完成
                </div>
            </div>
           <el-table  :data="dataList"  border stripe  :height="maxH-115">
                <el-table-column  label="打卡地点"  align="center" show-overflow-tooltip> 
                     <template slot-scope="scope">
                         <span class="link"  v-if="scope.row.reportState>0" @click="ventilatearoomdetails(scope.row.id)">{{scope.row.placeName}}</span>
                         <span v-else>{{scope.row.placeName}}</span>
                    </template>
                </el-table-column>
                <el-table-column    label="负责人/打卡人"  align="center" show-overflow-tooltip> 
                       <template slot-scope="scope">{{scope.row.managers}}</template>
                </el-table-column>
                <el-table-column   label="状态"  align="center" >
                    <template slot-scope="scope">
                         <el-tag  size="mini" type="danger" v-if="scope.row.reportState==0">未打卡</el-tag>
                         <el-tag  size="mini" type="success" v-else>已打卡</el-tag>
                    </template>
                 </el-table-column>
                <el-table-column   label="完成度"  align="center" > 
                     <template slot-scope="scope">
                         <el-tag  size="mini" type="success" v-if="scope.row.reportState==2">全部完成</el-tag>
                         <el-tag  size="mini" type="warning" v-if="scope.row.reportState==1">部分完成</el-tag>
                         <span v-if="scope.row.reportState==0">----</span>
                     </template>
                </el-table-column>
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
import {recordAnalysis,recordListBySchoolIdAndDate} from "@/api/ventilatearoom";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      dataList: [],
      selected:[],
      total: null,
      query: {
        pageNo: 1, //页数
        pageSize: 20, //条数
        searchName: "",
        date:this.$moment(new Date()).format('YYYY-MM-DD'),
        schoolId:''
      },
      downLoadHref:'',
      allFinishCount:'', //	上报且全部完成	number	
      partFinishCount: '', //	上报部分完成	number	
      totalCount:'', //	场所总数	number	
      unFinishCount: '', //	未上报场所	number
      yinum:''
    };
  },
  mixins: [mixins, baseMixin],
  filters: {
    checkUserJsonfun(list) {
      let mylist = JSON.parse(list);
      let name = "";
      for (let i = 0; i < mylist.length; i++) {
        name += mylist[i].name + "   ";
      }
      return name;
    }
  },
  computed: {
    ...mapGetters(["schoolInfo"])
  },
  created() {
    this.query.schoolId = this.schoolInfo.id;
    this.recordListBySchoolIdAndDates();
  },  
  methods: {  
    //详情
    ventilatearoomdetails(id) {
      this.$router.push({
        path: "ventilatearoomdetails",
        query: { id: id }
      });
    },
    //获取列表
    recordListBySchoolIdAndDates() {
      this.datalist = [];
      this.query.date = this.$moment(this.query.date).format('YYYY-MM-DD');
       this. downLoadHref=global.BasePath + "structure/sterilize/downRecordAnalysis?date=" +this.query.date+"&schoolId=" +this.query.schoolId+"&token=" +this.$store.getters.token;
      recordListBySchoolIdAndDate(this.query).then(res => {
        let data = res.data.data;
        this.dataList = data.dataList;
        this.total = data.pagination.total;
      });
      recordAnalysis(this.query).then(res => {
        let data = res.data.data;    
        this.allFinishCount=data.allFinishCount;
        this.partFinishCount=data.partFinishCount;
        this.totalCount=data.totalCount;
        this.unFinishCount=data.unFinishCount;
        this.yinum=Math.floor(data.totalCount-data.unFinishCount)
      });
    },
    //搜索
    inputsearchNametime() {
      this.query.pageSize = 20;
      this.query.pageNo = 1;
      this.recordListBySchoolIdAndDates();
    },
    //切换条数
    handleSizeChange(val) {
      this.query.pageSize = val;
      this.query.pageNo = 1;
      this.recordListBySchoolIdAndDates();
    },
    //切换页数
    handleCurrentChange() {
      this.recordListBySchoolIdAndDates();
    },   
  }
};
</script>
<style lang="scss" scoped>
.ventilatearoomlist {
  padding:12px;
  box-sizing: border-box;
  .menu-tools {
    border-bottom: 1px solid #e7eaec;
    padding-bottom: 10px;
  }
  .radiobox{
    .el-radio{
       width: 100%;
       margin: 5px 0px;
    }
  }
  .link{
      color:#409eff;
      cursor:pointer;
  }
  .ul{
      overflow: auto;
      padding-bottom: 10px;
      .li{
        width: 150px;
        float: left;
        text-align: center;
        margin-top: 10px;
        margin-left: 25px;
        padding: 5px 0;
        color: #fff;
        background: #409efa;
        border-radius: 5px;
        line-height: 30px;
        span{
            display: block;
            width: 100%;
            height: 40px;
            line-height: 40px;
            font-size: 36px;
            overflow: hidden;
        }
      }
  }
}
</style>


