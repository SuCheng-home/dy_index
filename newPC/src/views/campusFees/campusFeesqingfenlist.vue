<template>
    <div class="platformmerchantlist">
        <div class="top">
            <el-button @click="$router.back()" type="default" size="medium">返回</el-button>   
            <el-button size="medium" type="primary" @click="isShowDialogfun()" v-if="banlance>0">清分</el-button>          
            <span style="color:#303133;font-size:18px">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;收费总计：{{totalFee||"0"}}</span>
            <span style="color:#303133;font-size:18px">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;已清分：{{withdFee||"0"}}</span>
            <span style="color:#303133;font-size:18px">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;剩余：{{banlance||"0"}}</span>
        </div>
        <el-table stripe :data="dataList" border fit highlight-current-row  :height="maxH-30"> 
             <el-table-column align="center" label="清分金额（元）" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.totalfee}}</span>
                    </template>
                </el-table-column>   
                <el-table-column align="center" label="操作人" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.withdUname}}</span>
                    </template>
                </el-table-column>  
                 <el-table-column align="center" label="操作时间" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.createTime}}</span>
                    </template>
                </el-table-column>      			
                <el-table-column align="center" label="监管账户" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.merName}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="清分到账户" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.subMerName}}</span>
                    </template>
                </el-table-column>  
                <el-table-column align="center" label="备注" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.remark}}</span>
                    </template>
                </el-table-column>
                 <el-table-column align="center" label="交易状态">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark"  v-if="scope.row.status==4" :content="scope.row.reason" placement="top">
                            <el-tag type="danger"  size="small">出金失败</el-tag>
                        </el-tooltip>                 
                        <el-tag type="success" size="small" v-if="scope.row.status==3">已出金</el-tag>
                        <el-tag type="warning" size="small" v-if="scope.row.status==1">申请中</el-tag>
                        <el-tag type="warning" size="small" v-if="scope.row.status==2">处理中</el-tag>
                        <el-tag size="small" v-if="scope.row.status==5">已撤回</el-tag>
                        <el-tag size="small" v-if="scope.row.status==6">受理成功</el-tag>
                        <el-tag type="warning" size="small" v-if="scope.row.status==7">受理成功未出金</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
					<template slot-scope="scope">
						<el-button type="text" size="small" v-if="scope.row.status==3" @click="downloadReceipt(scope.row.withdBatchSn)">电子回单下载</el-button>
            		</template>
				</el-table-column>
            </el-table>
            <div class="pagination-container">
                <el-pagination @size-change="queryBillFlowListfun" @current-change="queryBillFlowListfun"
                               :current-page.sync="pagination.pageNo" :page-sizes="[10, 20, 30, 50]"
                               :page-size.sync="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper"
                               :total="pagination.total">
                </el-pagination>
            </div>
             <el-dialog title="清分" :visible.sync="isShowDialog" width="600px" :close-on-click-modal="false">
                <el-form ref="form" label-width="80px">
                    <el-form-item label="清分金额" >
                    <el-input-number v-model.trim="fee" :precision="2"  size="medium" :min="0.01" :max="banlance" :step="1"></el-input-number>
                    </el-form-item>
                    <el-form-item label="备注">
                        <el-input :maxlength="100"   type="textarea" :autosize="{ minRows: 2, maxRows: 10}"  v-model="remark"   size="medium" placeholder="请输入备注"></el-input>
                    </el-form-item>
                    <el-form-item label="注意" >
                      清分金额不得超过本批次剩余金额。
                    </el-form-item>
                </el-form>
                <span slot="footer">
                    <el-button size="medium" @click="isShowDialog = false">取 消</el-button>
                    <el-button size="medium" type="primary" @click="updateChargenoticeWithdnew()">确 定</el-button>
                </span>
                </el-dialog>
    </div>
</template>
<script>
import moment from "moment";
import {queryChargenoticeWithdList,updateChargenoticeWithdnew,queryChargenoticeWithdStatic} from "@/api/campusFees";
import baseMixin from "@/mixins/baseMixin";
import mixin from "@/mixins/windowResize";
export default {
  name: "statisticsIndex",
  data() {
    return {
      pagination: {
        pageNo: 1,
        pageSize: 20,
        total: null,
        cid: this.$route.query.id
      },
      banlance:"",
      totalFee:"",
      withdFee:"",
      isShowDialog:false,
      fee:undefined,
      remark:""
    };
  },
  mixins: [baseMixin, mixin],
  created() {
    this.queryBillFlowListfun(); 
    this.queryChargenoticeWithdStatic();   
  },
  methods: {   
      isShowDialogfun(){
          this.isShowDialog=true;
          this.fee=undefined;
      },
    downloadReceipt(withdBatchSn){
       let myhref=(global.command === "production"?"https://pay.zhxiaoyuan.cn":"https://pay.weixiaojia.net")+"/orderpay/withd/downloadReceipt?withdBatchSn="+withdBatchSn+"&token="+this.$store.getters.token
        window.open(myhref,"_blank");
   },
   queryChargenoticeWithdStatic() {       
      queryChargenoticeWithdStatic(this.pagination.cid)
        .then(res => res.data)
        .then(data => {
            let mydata=data.data;
            this.withdFee=mydata.withdFee;
            this.totalFee=mydata.totalFee;
            this.banlance=mydata.banlance-0;
        });
    },
    updateChargenoticeWithdnew() {    
        if(!this.fee){
             this.$message({
            type: "warning",
            message: "请输入清分金额！"
          });
          return
        }
      updateChargenoticeWithdnew(this.pagination.cid,this.fee,this.remark)
        .then(res => res.data)
        .then(data => {
           this.isShowDialog=false;
           this.remark='';
           if(!data.result){
                this.$message({
            type: "warning",
            message: data.msg
          });
           }else{             
              this.$message({
                    type: "success",
                    message: "清分成功!"
                  });
                   this.queryBillFlowListfun(); 
            this.queryChargenoticeWithdStatic(); 
           }
            
        });
    },
    queryBillFlowListfun() {       
      queryChargenoticeWithdList(this.pagination)
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
.platformmerchantlist {
  padding:12px;
  .top {
    padding-bottom: 10px;
  }
}
</style>
