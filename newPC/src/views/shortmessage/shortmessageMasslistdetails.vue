<template>
    <div class="shortmessageMasslistdetails">
        <div class="top">
            <el-button @click="$router.back()" type="default" size="medium">返回</el-button>
             <el-select v-model="pagination.result" placeholder="请选择"  size="medium"   @change="indexfun">
                <el-option label="全部发送状态" :value="''"></el-option>
                <el-option label="发送成功" :value="0"></el-option>
                <el-option label="发送失败" :value="-1"></el-option>
                <el-option label="发送中" :value="1"></el-option>
            </el-select>
             <el-select v-model="pagination.isReply" placeholder="请选择"  size="medium"   @change="indexfun">
                <el-option label="全部回复状态" :value="0"></el-option>
                <el-option label="已回复" :value="1"></el-option>
                <el-option label="未回复" :value="2"></el-option>
            </el-select>
              <a :href="exportURL" download="导出结果" target="_blank"  v-if="dataList.length">
                    <el-button class="filter-item" size="medium" type="primary" icon="upload">导出</el-button>
                </a>
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
import { listSmsByGroupId} from "@/api/shortmessage";
import baseMixin from "@/mixins/baseMixin";
import mixin from "@/mixins/windowResize";
export default {
  name: "statisticsIndex",
  data() {
    return {
      dataList: [],
      pagination: {
        pageNo: 1,
        pageSize: 20,
        total: null,
        mobile: "",
        startTime: "",
        endTime: "",
        groupId:this.$route.query.id,
        moduleCode:this.$route.query.moduleCode,
        isReply:0,
        result:''
      },
       exportURL:""
    };
  },
  mixins: [baseMixin, mixin],
  created() {
    this.indexfun();
  },
  methods: {
    indexfun() {
      this.exportURL = global.BasePath+'structure/smsMessage/exportSmsByGroupId?groupId='+this.pagination.groupId+'&moduleCode='+ this.pagination.moduleCode+'&isReply='+this.pagination.isReply+'&result='+this.pagination.result+'&token='+this.$store.getters.token;
      listSmsByGroupId(this.pagination)
        .then(res => res.data)
        .then(data => {
          this.pagination.total = data.data.pagination.total;
          this.dataList = data.data.dataList;
        });
    },

  }
};
</script>

<style lang="scss" scoped>
.shortmessageMasslistdetails {
  padding:12px;
  .top {
    padding-bottom: 10px;
  }
}
</style>
