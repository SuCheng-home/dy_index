<template>
    <div class="refunddetails">
        <div class="bigtop">
            <el-col :span="19">
                <el-button @click="$router.back()" type="default" size="medium">返回</el-button> 
                 <el-select style="width:160px;" size="medium" v-model="query.status" placeholder="请选择状态"
                       @change="handleInputChange">
                        <el-option label="全部状态" :value="''"></el-option>
                 <el-option label="草稿" :value="0"></el-option>
                 <el-option label="申请退款" :value="1"></el-option>
                 <el-option label="退款成功" :value="2"></el-option>
                 <el-option label="退款失败" :value="3"></el-option>
            </el-select>
                <a :href="downLoadHref" v-if="dateList.length" target="_blank" download="examName"><el-button type="primary"  size="medium">导出</el-button></a>
               <span class="red"> 退费总金额：{{refundedCountFee}} 元</span>
            </el-col>
            <el-col :span="5">
                <el-input placeholder="姓名" v-model.trim="query.studentName" @change="handleInputChange"  size="medium">
                  <el-button slot="append" icon="el-icon-search" @click="handleInputChange"></el-button>
                </el-input>
            </el-col>
        </div>
         <div class="time-table" >
             <div class="box-top">
                 <h1>{{dataname.chargeName}}<i class="el-icon-menu"  @click="dialogVisible = true"></i> <span class="p">落款部门：<span class="red">{{dataname.inscription}}</span><span class="red" v-if="!dataname.inscription">暂无</span>截止时间：<span class="red">{{dataname.deadlineTime}}<span class="red" v-if="!dataname.deadlineTime">无限制</span></span></span></h1>
                 
              </div>
            <el-table stripe  :data="dateList" border fit highlight-current-row  style="width: 100%" :height="maxH-36">
               <el-table-column align="center" label="学号" v-if="is==2" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.learnNum}}</span>
                    </template>
                </el-table-column>
                 <el-table-column align="center" label="姓名" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.studentName}}</span>
                    </template>
                </el-table-column>
                 <el-table-column align="center" label="所在班级"  show-overflow-tooltip v-if="is==2">
                    <template slot-scope="scope">
                        <span >{{scope.row.deptName}}</span>
                    </template>
                </el-table-column>
                 <el-table-column align="center" label="应退金额(元)" >
                    <template slot-scope="scope">
                        <span >{{scope.row.refundMoney}}</span>
                    </template>
                </el-table-column>
                 <el-table-column align="center" label="退费来源"   show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.chargeType}}</span>
                    </template>
                </el-table-column>
                 <el-table-column align="center" label="备注"   show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.refundRemark}}</span>
                    </template>
                </el-table-column>
                 <el-table-column align="center" label="退费状态">
                    <template slot-scope="scope">
                      <el-tag  size="mini" type="info" v-if="scope.row.status==0">草稿</el-tag>
                        <el-tooltip class="item" effect="dark"  v-if="scope.row.status==3" :content="scope.row.reason" placement="top">
                            <el-tag  size="mini" type="danger"  >退费失败</el-tag>
                        </el-tooltip>                        
                        <el-tag  size="mini" type="success"  v-if="scope.row.status==2">退费成功</el-tag>
                        <el-tag  size="mini" type="warning"  v-if="scope.row.status==1">申请中</el-tag>
                    </template>
                </el-table-column>
                 <el-table-column align="center" label="订单号" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.orderId}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="退费时间">
                    <template slot-scope="scope">
                        <span>{{scope.row.createTime}}</span>
                    </template>
                </el-table-column>        
            </el-table>
        </div>
        <el-dialog  title="收费内容" :visible.sync="dialogVisible" >
            <div class="content-box" v-html="content"></div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>        
         <div  class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                            :page-sizes="[10,20,30, 50]"
                           :page-size="query.pageSize" layout="total, sizes, prev, pager, next, jumper"
                           :total="total">
            </el-pagination>
        </div>
    </div>
</template>
<script>
import {
  queryChargeNoticeStatic,
  queryRefundList,
  queryChargeNoticeDetail,queryRefundCount
} from "@/api/campusFees";
import mixin from "@/mixins/windowResize";
import { isShowByPermission } from "@/utils";
export default {
  name: "refunddetails",
  data: function() {
    return {
      dateList: [], //表格主题数据
      total: null,
      dataname: {}, //总览数据
      dialogVisible: false,
      is: this.$route.query.is,
      query: {
        pageNo: 1, //页数
        pageSize: 20, //条数
        studentName: "",
        cid: this.$route.query.id,
        status:''
      },
      content: "",
      refundedCountFee:0,
         downLoadHref: ''
    };
  },
  mixins: [mixin],
  //获取渲染数据当数据加载完成后执行(生命周期中的钩子函数)
  created() {
    queryRefundCount(this.query.cid).then(res => {
      this.refundedCountFee = res.data.data.refundedCountFee;
    });
    //获取校园收费总览
    queryChargeNoticeStatic(this.query.cid).then(res => {
      this.dataname = res.data.data;
    });
    //校园收费通知详情
    queryChargeNoticeDetail(this.query.cid).then(res => {
      this.content = res.data.data.charge.content;
    });
    this.queryRefundLists();
  },
  methods: {
    queryRefundLists() {
      this.dateList = [];
      this.downLoadHref=global.BasePath + "chargeNoticeProduct/exportRefundList?cid=" +this.$route.query.id +"&studentName=" +this.query.studentName+"&status=" +this.query.status+"&token=" +this.$store.getters.token,//导出全部名单
      queryRefundList(this.query).then(res => {
        let data = res.data.data;
        if (data) {
          this.dateList = data.dataList;
          this.total = data.pagination.total;
        }else{
           this.total=0;
        }
      });
    },
    handleInputChange() {
      this.queryRefundLists();
    },
    handleSizeChange(val) {
      this.query.pageNo = 1;
      this.query.pageSize = val;
      this.queryRefundLists();
    },
    handleCurrentChange(val) {
      this.query.pageNo = val;
      this.queryRefundLists();
    }
  }
};
</script>
<style scoped>
.refunddetails {
  padding:12px;
}
.bigtop {
    border-bottom: 1px solid #e7eaec;
    padding-bottom: 10px;
    overflow: hidden;
  }
.el-button + .el-button {
  margin-left: 0px;
}
.refunddetails .el-table th {
  padding: 10px 0;
  min-width: 0;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  text-overflow: ellipsis;
  vertical-align: middle;
  position: relative;
  text-align: left;
}
.refunddetails .el-table td {
  padding: 5px 0;
  min-width: 0;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  text-overflow: ellipsis;
  vertical-align: middle;
  position: relative;
  text-align: left;
}
.pagination-container {
  margin-top: 10px;
}
.refunddetails .el-input-box {
  float: right;
  width: 240px;
}
.refunddetails .box-top {
  height: 36px;
}
.upload-import {
  display: inline-block;
}
.refunddetails .top {
  line-height: 30px;
  font-size: 20px;
  color: #666;
  font-weight: 600;
  margin: 10px 10px;
  padding-left: 10px;
  border-left: 8px solid #409eff;
}
.top .red{
  float: right;
    line-height: 36px;
    padding-right: 20px;
    color: red;
}
.refunddetails .box-top h1 {
  font-size: 20px;
  margin: 0;
  margin-top: 10px;
}
.refunddetails .box-top h1 i {
  color: #409eff;
  margin-left: 10px;
  cursor: pointer;
}
.refunddetails .box-top .p {
  text-align: right;
  padding: 0 20px;
  font-size: 14px;
  font-weight: 600;
  color: #666;
  margin: 0;
}
.refunddetails .box-top .p .red {
  color: red;
  margin-right: 15px;
}
</style>
