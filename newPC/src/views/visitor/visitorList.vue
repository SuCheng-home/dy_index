<template>
    <div class="visitorList">
        <div class="top">
            <el-date-picker v-model="daterange" size="medium" type="daterange" class="mywidthdaterange" range-separator="-" start-placeholder="开始日期" @change="getVisitorListfun()" end-placeholder="结束日期" :clearable="false"  ></el-date-picker>
            <el-input class="search-input" style="width:20%;float: right;"  placeholder="请输入来访人员名称" icon="search" size="medium" @change="getVisitorListdun()"
                          v-model.trim="pagination.name">
                    <el-button slot="append" icon="el-icon-search" @click="getVisitorListfun()"></el-button>
            </el-input>
        </div>
        <el-table stripe :data="dataList" border fit highlight-current-row  :height="maxH">
                <el-table-column align="center" label="流水号" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span class="link-type" @click="visitordetails(scope.row.vid)">{{scope.row.vid}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="来访人姓名" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.name}}</span>
                    </template>
                </el-table-column>
                <!-- <el-table-column align="center" label="来访人身份证号" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.no}}</span>
                    </template>
                </el-table-column> -->
                <el-table-column align="center" label="探访人员" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.toName}}</span>
                    </template>
                </el-table-column>
               <el-table-column align="center" label="到达时间" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.arrive?scope.row.arrive.substring(0, 19):"----"}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="离开时间" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.leaveTime?scope.row.leaveTime.substring(0, 19):"---"}}</span>
                    </template>
                </el-table-column>
                 <el-table-column align="center" label="图片" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <image-previewer tag="richtext" >
                              <img class="img"  :src="scope.row.photo1"> 
                        </image-previewer>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination-container">
                <el-pagination @size-change="getVisitorListfun" @current-change="getVisitorListfun"
                               :current-page.sync="pagination.pageNo" :page-sizes="[10, 20, 30, 50]"
                               :page-size.sync="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper"
                               :total="pagination.total">
                </el-pagination>
            </div>
    </div>
</template>
<script>
import moment from "moment";
import { getVisitorList} from "@/api/visitor";
import baseMixin from "@/mixins/baseMixin";
import mixin from "@/mixins/windowResize";
import ImagePreviewer from '@/components/ImagePreviewer/ImagePreviewer.vue';
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
      },
      orderDetailsList: [],
      dialogTableVisible: false,
      content: ""
    };
  },
  mixins: [baseMixin, mixin],
   components: {ImagePreviewer},
  created() {
    this.daterange[0] = new Date(moment().set("date", 1).valueOf());
    this.getVisitorListfun();
  },
  methods: {
    getVisitorListfun() {
      this.pagination.startDate = moment(this.daterange[0]).format(
        "YYYY-MM-DD"
      );
      this.pagination.endDate = moment(this.daterange[1]).format(
        "YYYY-MM-DD"
      );
      getVisitorList(this.pagination)
        .then(res => res.data)
        .then(data => {
          this.pagination.total = data.data.pagination.total;
          this.dataList = data.data.dataList;
        });
    },
   visitordetails(vid){
         this.$router.push({
                    path: "visitordetails",
                    query: {vid: vid}
               });
   }
  }
};
</script>

<style lang="scss" scoped>
.visitorList {
  padding:12px;
  .top {
    padding-bottom: 10px;
  }
  .img{
      height: 20px;
  }
}
</style>
