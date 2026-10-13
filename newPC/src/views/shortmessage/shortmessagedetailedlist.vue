<template>
    <div class="shortmessagedetailedlist">
        <div class="top">
            <el-button @click="$router.back()" type="default" size="medium">返回</el-button>
            <el-date-picker v-model="daterange" size="medium" type="daterange" class="mywidthdaterange" range-separator="-" start-placeholder="开始日期" @change="indexfun()" end-placeholder="结束日期" :clearable="false"  ></el-date-picker>
               <el-select v-model="pagination.isReply" placeholder="请选择"  size="medium"   @change="indexfun">
                <el-option label="全部回复状态" :value="0"></el-option>
                <el-option label="已回复" :value="1"></el-option>
                <el-option label="未回复" :value="2"></el-option>
            </el-select>
            <el-input class="search-input" style="width:20%;float: right;"  placeholder="请输入手机号" icon="search" size="medium" @change="indexfun()"
                          v-model.trim="pagination.mobile">
                    <el-button slot="append" icon="el-icon-search" @click="indexfun()"></el-button>
            </el-input>
        </div>
        <el-table stripe :data="dataList" border fit highlight-current-row  :height="maxH">
                <el-table-column align="center" label="模板名称" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.moduleName}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="手机号" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.mobile}}</span>
                        <span v-if="scope.row.userName">（{{scope.row.userName}}）</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="发送内容" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.content}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="发送时间" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.sendTime.substring(0, 19)}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="结果" show-overflow-tooltip>
                    <template slot-scope="scope">
                          <el-tag  size="mini" v-if="scope.row.result==0" >发送成功</el-tag>
                         <el-tag  size="mini" type="success" v-else-if="scope.row.result==1" >发送中</el-tag>
                        <el-tooltip class="item" effect="dark" v-else :content="scope.row.reason" placement="top">
                            <el-tag  size="mini" type="danger"   >发送失败</el-tag>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="计费条数" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.fee}}</span>
                    </template>
                </el-table-column>
                 <el-table-column align="center" label="回复" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.replyContent?scope.row.replyContent:"--"}}</span>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination-container">
                <el-pagination @size-change="indexfun" @current-change="indexfun"
                               :current-page.sync="pagination.pageNo" :page-sizes="[10, 20, 30, 50]"
                               :page-size.sync="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper"
                               :total="pagination.total">
                </el-pagination>
            </div>
    </div>
</template>
<script>
import moment from "moment";
import { index} from "@/api/shortmessage";
import baseMixin from "@/mixins/baseMixin";
import mixin from "@/mixins/windowResize";
export default {
  name: "statisticsIndex",
  data() {
    return {
      daterange: [new Date(), new Date()],
      dataList: [],
      exportUrl: "",
      pagination: {
        pageNo: 1,
        pageSize: 20,
        total: null,
        mobile: "",
        startTime: "",
        endTime: "",
        isReply:0
      },
      orderDetailsList: [],
      dialogTableVisible: false,
      content: ""
    };
  },
  mixins: [baseMixin, mixin],
  created() {
    this.daterange[0] = new Date(moment().set("date", 1).valueOf());
    this.indexfun();
  },
  methods: {
    indexfun() {
      this.pagination.startTime = moment(this.daterange[0]).format(
        "YYYY-MM-DD"
      );
      this.pagination.endTime = moment(this.daterange[1]).format(
        "YYYY-MM-DD"
      );
      index(this.pagination)
        .then(res => res.data)
        .then(data => {
          this.pagination.total = data.data.fpi.pagination.total;
          this.dataList = data.data.fpi.dataList;
        });
    },

  }
};
</script>

<style lang="scss" scoped>
.shortmessagedetailedlist {
  padding:12px;
  .top {
    padding-bottom: 10px;
  }
}
</style>
