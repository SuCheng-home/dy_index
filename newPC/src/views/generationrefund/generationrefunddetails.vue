<template>
    <div class="generationrefunddetails">
        <div class="top">
             <el-button  @click="$router.back()"  size="medium">返回</el-button> 
              <el-select v-model="query.status" placeholder="请选择状态" size="medium" @change="queryPayRefundapplyDetailLists()">
                          <el-option label="全部状态" :value="0" ></el-option>
                        <el-option label="申请通过" :value="1" ></el-option>
                        <el-option label="申请未通过" :value="2" ></el-option>
                        <el-option label="请求中" :value="3" ></el-option>
                        <el-option label="交易成功" :value="4" ></el-option>
                        <el-option label="交易失败" :value="5" ></el-option>
                    </el-select>
             <el-button type="primary" v-if="myquery.status==2"  size="medium" @click="dialogVisible=true" >提交退款</el-button> 
              <a class="export-btn" :href="exportUrl" download="导出" target="_blank" v-if="dateList.length">
                        <el-button class="filter-item" type="primary" icon="upload" size="medium">导出</el-button>
                    </a>   
             <span class="refundName">{{myquery.refundName}} </span> 本次共退款给{{total}}人，共计￥{{myquery.totalfee}} （{{myquery.totalfee|bignamefun()}} ） &nbsp; &nbsp; &nbsp;批次号：{{myquery.applyBatchSn}}
               &nbsp; &nbsp; &nbsp; &nbsp;
                       <el-tag v-if="myquery.status==1" >处理中</el-tag>
                       <el-tag v-if="myquery.status==2" type="success">已就绪</el-tag>
                       <el-tag v-if="myquery.status==3" type="warning">待审核</el-tag>
                       <el-tag v-if="myquery.status==4" type="danger">被驳回</el-tag>
                       <el-tag v-if="myquery.status==6" type="danger">退费失败</el-tag>
                       <el-tag v-if="myquery.status==5" type="success">已退款</el-tag>
        </div>
        <div class="time-table">
            
            <el-table stripe :data="dateList"  border fit highlight-current-row style="width: 100%" :height="maxH">
              <el-table-column align="center" label="学号" show-overflow-tooltip v-if="myquery.refundUser==1">
                    <template slot-scope="scope">
                        {{scope.row.loginname}}
                    </template>
                </el-table-column>
                <el-table-column  prop="uname" align="center" label="姓名" show-overflow-tooltip></el-table-column>
                <el-table-column  prop="departName"  align="center" label="班级/部门"></el-table-column>
                <el-table-column  prop="refundAcct"   align="center" :label="myquery.refundType==1?'退款卡号':'缴费订单'"></el-table-column>
                <el-table-column  prop="refundaAcctName"  align="center"  :label="myquery.refundType==1?'持卡人姓名':'缴费人姓名'"></el-table-column>
                <el-table-column  prop="requestsn"  align="center"  label="退费订单"></el-table-column>
                 <el-table-column  prop="orderNo"  align="center"  label="业务订单" v-if="myquery.refundType==2"></el-table-column>
                <el-table-column  prop="fee"  align="center" label="应退金额"></el-table-column>  
                <el-table-column  prop="refundedfee"  align="center" label="实退金额"></el-table-column> 
                <el-table-column align="center" label="退款进度" >
                    <template slot-scope="scope">
                       <el-tag v-if="scope.row.status==1" type="success">申请通过</el-tag>
                       <el-tag v-if="scope.row.status==2"  type="danger">申请未通过</el-tag>
                       <el-tag v-if="scope.row.status==3" type="warning">请求中</el-tag>
                       <el-tag v-if="scope.row.status==4"  type="success">交易成功</el-tag>
                       <el-tooltip class="item" effect="dark" v-if="scope.row.status==5" :content="scope.row.reason" placement="top">
                          <el-tag   type="danger">交易失败</el-tag>
                       </el-tooltip>
                      
                    </template>
                </el-table-column>  
                <el-table-column  prop="successtime"  align="center" label="退款时间"></el-table-column>  
            </el-table>
        </div>
        <div class="pagination-container">
            <el-pagination @size-change="queryPayRefundapplyDetailLists()" @current-change="queryPayRefundapplyDetailLists()"
                           :current-page.sync="query.pageNo" :page-sizes="[10,20,30, 50]"
                           :page-size="query.pageSize" layout="total, sizes, prev, pager, next, jumper"
                           :total="total">
            </el-pagination>
        </div>
         <el-dialog title="审批人" :visible.sync="dialogVisible" width="600px">
            <el-form class="card-dialog-padding"  ref="ruleDialogForm" label-width="140px">
                <el-form-item label="审批人" >
                   <el-radio v-model="uid" v-for="item in mylist" :key="item.id" :label="item.id">{{item.name}}</el-radio>
                     <!-- <el-select v-model="cmdBatchSn" placeholder="请选择退款指令" @change="cmdBatchSnfun()">
                        <el-option v-for="item in cmdBatchSnlist" :label="item.cmdBatchSn" :value="item.cmdBatchSn" :key="item.cmdBatchSn"></el-option>
                    </el-select> -->
                </el-form-item>
                 <!-- <el-form-item label="授权金额">
                     {{totalfee}}
                </el-form-item>
                 <el-form-item label="本次应退金额">
                     {{bigtotalfee}}
                </el-form-item>
                <el-form-item label="备注">
                     如果无可选择的退款指令，请与银行相关人员联系。
                </el-form-item>
                  <el-form-item label="" v-if="cmdBatchSn&&(totalfee!=bigtotalfee)">
                      <div class="red">
                           <span>效验未通过，请更换退款指令或者与银行相关人员联系</span>
                      </div>
                </el-form-item> -->
            </el-form>
            
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible=false">关闭</el-button>
                <el-button type="primary" @click="addRefundSubmits()"   :disabled="!mylist.length">{{mylist.length?'确定':'暂无可选审批人'}}</el-button>
            </span>
        </el-dialog> 
    </div>
</template>
<script>
import {queryPayRefundapplyDetailList,queryPayRefundapplyByApplyBatchSn,queryRefundcmdList,addRefundSubmit,queryAuditorList,addAuditort} from '@/api/generationrefund';
import mixin from "@/mixins/windowResize";
export default {
  name: "newrestaurantRefundindex",
  data: function() {
    return {
      dateList: [], //表格主题数据
      exportUrl: "",
      total: null,
      query: {
        pageNo: 1, //页数
        pageSize: 20, //条数
        applyBatchSn:this.$route.query.applyBatchSn||this.$route.query.id,
        status:0
      },      
      cmdBatchSnlist:[],
      dialogVisible:false,
      bigtotalfee:"",
      totalfee:"",
      cmdBatchSn:"",
      myid:false,
      myquery:this.$route.query,
      mylist:[],
      uid:"",
      schoolId:this.$store.getters.schoolInfo.id,
      };
  },
   filters: {
            bignamefun(amount) {
               // 汉字的数字
                const cnNums = ["零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"];
                // 基本单位
                const cnIntRadice = ["", "拾", "佰", "仟"];
                // 对应整数部分扩展单位
                const cnIntUnits = ["", "万", "亿", "兆"];
                // 对应小数部分单位
                const cnDecUnits = ["角", "分"];
                // 整数金额时后面跟的字符
                const cnInteger = "整";
                // 整型完以后的单位
                const cnIntLast = "元";
                // 最大处理的数字
                const maxNum = 9999999999999999.99;
                // 金额整数部分
                let integerNum;
                // 金额小数部分
                let decimalNum;
                // 输出的中文金额字符串
                let chineseStr = "";
                // 分离金额后用的数组，预定义
                let parts;
                if (amount === "") {
                    return "";
                }
                amount = parseFloat(amount);
                if (amount >= maxNum) {
                    // 超出最大处理数字
                    return "";
                }
                if (amount === 0) {
                    chineseStr = cnNums[0] + cnIntLast + cnInteger;
                    return chineseStr;
                }
                // 转换为字符串
                amount = amount.toString();
                if (amount.indexOf(".") === -1) {
                    integerNum = amount;

                    decimalNum = "";
                } else {
                    parts = amount.split(".");
                    integerNum = parts[0];
                    decimalNum = parts[1].substr(0, 4);
                }
                // 获取整型部分转换
                if (parseInt(integerNum, 10) > 0) {
                    let zeroCount = 0;
                    const IntLen = integerNum.length;
                    for (let i = 0; i < IntLen; i++) {
                        const n = integerNum.substr(i, 1);
                        const p = IntLen - i - 1;
                        const q = p / 4;
                        const m = p % 4;
                        if (n === "0") {
                            zeroCount++;
                        } else {
                            if (zeroCount > 0) {
                                chineseStr += cnNums[0];
                            }
                            // 归零
                            zeroCount = 0;
                            //alert(cnNums[parseInt(n)])
                            chineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
                        }
                        if (m === 0 && zeroCount < 4) {
                            chineseStr += cnIntUnits[q];
                        }
                    }
                    chineseStr += cnIntLast;
                }
                // 小数部分
                if (decimalNum !== "") {
                    const decLen = decimalNum.length;
                    for (let i = 0; i < decLen; i++) {
                        const n = decimalNum.substr(i, 1);
                        if (n !== "0") {
                            chineseStr += cnNums[Number(n)] + cnDecUnits[i];
                        }
                    }
                }
                if (chineseStr === "") {
                    chineseStr += cnNums[0] + cnIntLast + cnInteger;
                } else if (decimalNum === "") {
                    chineseStr += cnInteger;
                }
                return chineseStr;
            }
            
        },
  mixins: [mixin],
  //获取渲染数据当数据加载完成后执行(生命周期中的钩子函数)
  created() {
    queryAuditorList().then(res => {
         let data=res.data.data;
         this.mylist=data;
         this.uid=data[0].id;
      });
    this.queryPayRefundapplyDetailLists();
    this.queryPayRefundapplyByApplyBatchSns();
    
  },
  methods: {
      addRefundSubmits(){
        if(this.myid){
          return
        }else{
          this.myid=true;
        }
        let name=""
        for(let i=0;i<this.mylist.length;i++){
          if(this.uid==this.mylist[i].id){
            name=this.mylist[i].name
          }
        }
          addAuditort(this.query.applyBatchSn,this.uid,name).then(res => {
           if (res.data.code === 200) {
                  this.$message({
                    type: "success",
                    message: "审批人选择成功!"
                  });
                  this.queryPayRefundapplyByApplyBatchSns()
                }
                if (res.data.code === 1005) {
                     this.$message({
                        type: "warning",
                        message: res.data.msg
                    });
                }
                this.myid=false;
                this.dialogVisible=false;
      });
      },
      cmdBatchSnfun(){
          for(let i=0;i<this.cmdBatchSnlist.length;i++){
              if(this.cmdBatchSn==this.cmdBatchSnlist[i].cmdBatchSn){
                  this.totalfee=this.cmdBatchSnlist[i].totalfee;
              }
          }

      },
      queryPayRefundapplyByApplyBatchSns(){
             queryPayRefundapplyByApplyBatchSn(this.query.applyBatchSn).then(res => {
          let data = res.data.data;
          this.myquery=data;
      });
      },
      queryRefundcmdLists(merhId){
          queryRefundcmdList(merhId).then(res => {
          let data = res.data.data;
          this.cmdBatchSnlist=data;
          if(this.cmdBatchSnlist.length){
               this.cmdBatchSn=this.cmdBatchSnlist[0].cmdBatchSn;
               this.totalfee=this.cmdBatchSnlist[0].totalfee;
          }
      });
      },
    //获取列表
    queryPayRefundapplyDetailLists() {
      this.dateList = [];
      this.exportUrl = `${global.newcharge}abcpay/refundapplyDetail/exportPayRefundapplyDetailList?applyBatchSn=${
        this.query.applyBatchSn
      }&status=${
        this.query.status==0?"":this.query.status
      }&token=${this.$store.getters.token}`;
      queryPayRefundapplyDetailList(this.query).then(res => {
          let data = res.data.data;
          this.dateList = data.dataList;
          this.total = data.pagination.total;
      });
    },
  }
};
</script>
<style scoped="scoped">
.generationrefunddetails {
  padding:12px;
}
.generationrefunddetails .top {
  padding-bottom: 10px;
}
.red{
    color: red;
}
.refundName{
  color: #409EFF;
  margin: 0 20px;
}
</style>
