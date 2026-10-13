<template>
    <div class="visitorReservationindex">
        <div class="top">
            <el-date-picker v-model="daterange" size="medium" type="daterange" class="mywidthdaterange" range-separator="-" start-placeholder="开始日期" @change="getVisitRecordList()" end-placeholder="结束日期" :clearable="false"  ></el-date-picker>
             <el-select   v-model="pagination.status"  placeholder="请选择"  @change="getVisitRecordList" size="medium">
                        <el-option  label="全部来访状态" :value="0" ></el-option>
                        <el-option  label="未审批" :value="1" ></el-option>
                        <el-option  label="已审批" :value="2" ></el-option>
                        <el-option  label="驳回" :value="3" ></el-option>
                        <el-option  label="加审通过" :value="4" ></el-option>
                        <el-option  label="加审驳回" :value="5" ></el-option>
                        <el-option  label="已到访" :value="6" ></el-option>
                    </el-select>
             <a :href="exportUrl" download="导出结果" target="_blank"  v-if="dataList.length">
              <el-button type="primary" size="medium" icon="upload">导出</el-button>
          </a>
          <el-button type="primary" size="medium" @click.native="visitorDashboardindex()">数据看板</el-button>
            <el-input class="search-input" style="width:20%;float: right;"  placeholder="请输入访客姓名" icon="search" size="medium" @change="getVisitRecordList()"
                          v-model.trim="pagination.name">
                    <el-button slot="append" icon="el-icon-search" @click="getVisitRecordList()"></el-button>
            </el-input>
        </div>
        <el-table stripe :data="dataList" border fit highlight-current-row  :height="maxH">
                <el-table-column align="center" label="来访人" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span class="link-type" @click="visitorReservationinfo(scope.row.id)">{{scope.row.name}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="手机号" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.mobile}}</span>
                    </template>
                </el-table-column>               
               <el-table-column align="center" label="来访时间" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.visitTime?scope.row.visitTime.substring(0, 16):"----"}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="来访事由" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.reason}}</span>
                    </template>
                </el-table-column>
                 <el-table-column align="center" label="拜访人" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.visitUserName}}</span>
                    </template>
                </el-table-column>
                  <el-table-column align="center" label="拜访状态" show-overflow-tooltip>
                    <template slot-scope="scope">
                         <el-tag  size="mini" v-if="scope.row.status==1" type="info">未审批</el-tag>
                        <el-tag  size="mini" v-if="scope.row.status==2" type="success">已审批</el-tag>
                        <el-tag  size="mini" v-if="scope.row.status==3" type="warning">驳回</el-tag>                   
                        <el-tag  size="mini" v-if="scope.row.status==4" type="success">加审通过</el-tag>
                        <el-tag  size="mini" v-if="scope.row.status==5" type="danger">加审驳回</el-tag>
                        <el-tag  size="mini" v-if="scope.row.status==6" >已到访</el-tag>
                    </template>
                </el-table-column>
                  <el-table-column align="center" label="操作" show-overflow-tooltip>
                    <template slot-scope="scope">
                       <el-button size="small" type="text" @click="delVisitRecord(scope.row.id)" class="buttontextred">
                                删除
                            </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination-container">
                <el-pagination @size-change="getVisitRecordList" @current-change="getVisitRecordList"
                               :current-page.sync="pagination.pageNo" :page-sizes="[10, 20, 30, 50]"
                               :page-size.sync="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper"
                               :total="pagination.total">
                </el-pagination>
            </div>
    </div>
</template>
<script>
import moment from "moment";
import { getVisitRecordList,delVisitRecord} from "@/api/visitorReservation";
import baseMixin from "@/mixins/baseMixin";
import mixin from "@/mixins/windowResize";
export default {
  data() {
    return {
      daterange: [new Date(), new Date()],
      dataList: [],
      exportUrl: "",
      pagination: {
        pageNo: 1,
        pageSize: 20,
        total: null,
        name: "",
        startDate: "",
        endDate: "",
        visitUserId:0,
        status:0
      },
      orderDetailsList: [],
      dialogTableVisible: false,
      content: "",
      exportUrl:""
    };
  },
  mixins: [baseMixin, mixin],
  created() {
    this.daterange[0] = new Date(moment().set("date", 1).valueOf());
    this.getVisitRecordList();

  },
  methods: {
    visitorDashboardindex(){
       const prefixUrl = global.command === 'production' ? 'https://www.zhxiaoyuan.cn/app/#' : 'http://www.weixiaojia.net/app/#/';
       window.open(`${prefixUrl}visitorDashboardindex`, "_blank");
   },
      delVisitRecord(recordId) {
                this.$confirm('是否删除', '删除', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delVisitRecord(recordId)
                        .then(res => res.data)
                        .then(data => {
                            if(data.result) {
                                this.$message({
                                    type: 'success',
                                    message: '删除成功!'
                                });
                                this.getVisitRecordList();
                            }
                        })
                });

            },
    getVisitRecordList() {
      this.pagination.startDate = moment(this.daterange[0]).format(
        "YYYY-MM-DD"
      );
      this.pagination.endDate = moment(this.daterange[1]).format(
        "YYYY-MM-DD"
      );
       this.exportUrl = `${global.BasePath}structure/visit/exportVisitRecordList?token=${this.$store.getters.token}&endDate=${this.pagination.endDate}&startDate=${this.pagination.startDate}&status=${this.pagination.status}&name=${this.pagination.name}`;
      getVisitRecordList(this.pagination)
        .then(res => res.data)
        .then(data => {
          this.pagination.total = data.data.pagination.total;
          this.dataList = data.data.dataList;
        });
    },
   visitorReservationinfo(recordId){
         this.$router.push({
                    path: "visitorReservationinfo",
                    query: {recordId: recordId}
               });
   }
  }
};
</script>

<style lang="scss" scoped>
.visitorReservationindex {
  padding:12px;
  .top {
    padding-bottom: 10px;
  }
  .img{
      height: 20px;
  }
}
</style>
