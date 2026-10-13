<template>
<div class="shortmessageRechargerecordlist"  >
    <div class="top">
        <el-button @click="$router.back()" type="default" size="medium">返回</el-button>
        <!-- <el-button type="primary" size="medium" @click="remindCurUsers()">充值提醒</el-button> -->
        <el-button type="primary" size="medium" @click="onlinerecharge()">在线充值</el-button>
        <el-button type="primary" size="medium" @click="shortmessageCorporateremittance()">对公汇款</el-button>
    </div>
     <el-table stripe :data="dataList"  :height="`${maxH}px`" border style="width: 100%">
             <el-table-column  label="购买条数" show-overflow-tooltip align="center" >
                <template slot-scope="scope">
                    {{scope.row.count?scope.row.count:0}}
                </template>
            </el-table-column>
             <el-table-column label="原价" align="center">
                <template slot-scope="scope">
                      ￥ {{scope.row.money?scope.row.money:0}}
                </template>
            </el-table-column>
            <el-table-column label="支付金额" align="center">
                <template slot-scope="scope">
                       ￥ {{scope.row.realMoney?scope.row.realMoney:0}}
                </template>
            </el-table-column>
            <el-table-column label="操作员" show-overflow-tooltip align="center">
                <template slot-scope="scope">
                       {{scope.row.createUserName}}
                </template>
            </el-table-column>
            <el-table-column label="备注" align="center">
                <template slot-scope="scope">
                        {{scope.row.remark}}
                </template>
            </el-table-column>
            <el-table-column label="时间" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                        {{(scope.row.state==2||scope.row.state==3)?scope.row.approveTime.substring(0, 19):scope.row.createTime.substring(0, 19)}}
                </template>
            </el-table-column>
             <el-table-column label="充值方式" align="center">
                <template slot-scope="scope">
                        <span  v-if="scope.row.type==1">平台赠送 </span>
                        <span  v-if="scope.row.type==2">在线充值 </span>
                        <span  v-if="scope.row.type==3">对公汇款</span>
                </template>
            </el-table-column>
             <el-table-column align="center" label="状态" >
                                      <template slot-scope="scope">
                                          <el-button  v-if="scope.row.state==1&&scope.row.orderNo" @click.native.prevent="queryAbcOneQR(scope.row.orderNo)"  type="text" size="small">待付款</el-button>
                                          <el-tag  size="mini" type="info"  v-if="scope.row.state==1&&!scope.row.orderNo">草稿</el-tag>
                                          <el-tag  size="mini" type="success" v-if="scope.row.state == 2">同意</el-tag>
                                          <el-tag  size="mini" type="danger" v-if="scope.row.state == 3">不通过</el-tag>
                                          <el-tag  size="mini" type="success" v-if="scope.row.state == 4">已充值</el-tag>
                                          <el-tag  size="mini" type="warning" v-if="scope.row.state ==5">待确认</el-tag>
                                          <el-tag  size="mini" type="danger" v-if="scope.row.state == 6">支付失败</el-tag>
                                      </template>
                                  </el-table-column>
            <el-table-column label="汇款单" align="center">
                <template slot-scope="scope">
                    <image-previewer tag="richtext">
                          <img class="picimg" :src="scope.row.picJson" alt="" v-if="scope.row.type==3">
                    </image-previewer>
                </template>
            </el-table-column>
              <!-- <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                         <el-button  v-if="scope.row.type==2" @click.native.prevent="isShowBatchAddCharfun(scope.row.id)"  type="text" size="small">查看详情</el-button>
                    </template>
            </el-table-column>  -->
        </el-table>
        <el-dialog title="订单明细" :visible.sync="isShowBatchAddChar" :close-on-press-escape='false'  width="600px" :lock-scroll="false" :close-on-click-modal='false' :modal-append-to-body='false'>

            <span slot="footer" class="dialog-footer">
                <el-button size="medium" type="primary" @click="isShowBatchAddChar = false">确定</el-button>
            </span>
        </el-dialog>
         <el-dialog title="付款码（请使用微信扫码支付）" :close-on-press-escape='false' :close-on-click-modal='false' :visible.sync="QRCodepop" width="400px" :lock-scroll="false" :modal-append-to-body='false'>
                 <div class="img"><img :src="QRCodeurl" alt=""></div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="QRCodepop = false">关 闭</el-button>
                </span>                
          </el-dialog>
           
</div>
</template>
<script>
import {remindCurUser,listByState,queryAbcOneQR} from "@/api/shortmessage";
import mixin from "@/mixins/windowResize";
import {mapGetters} from 'vuex';
import QRCode from 'qrcode';
import ImagePreviewer from '@/components/ImagePreviewer/ImagePreviewer';
export default {
  data() {
    return {
     schoolId:"",
     dataList:[],
     isShowBatchAddChar:false,
     QRCodeurl:"",
     QRCodepop:false
    };
  },
  computed:{
    ...mapGetters([
      'schoolInfo'
    ])
  },
  components: {ImagePreviewer},
  mixins: [mixin],
  created() {
      this.schoolId=this.schoolInfo.id;
      this.listByStates();
  },
  methods: {
      queryAbcOneQR(orderNo){
         queryAbcOneQR(orderNo).then(res => {
                    if(res.data.data){
                      QRCode.toDataURL(res.data.data.oneQRForAll).then(url => {
                        this.QRCodeurl = url;
                      }).catch(err => {
                      });
                      this.QRCodepop=true;
                    }else{
                         this.$message({ type: "error", message: res.data.msg });
                    }
                }).catch();
      },
      isShowBatchAddCharfun(id){
        this.isShowBatchAddChar=true;
      },
      listByStates(){
          listByState()
                    .then(res => res.data)
                    .then(data => {
                        this.dataList = data.data.reverse();
                    }).catch(err => {
                })
      },
       remindCurUsers(id){
               this.$confirm('是否充值提醒?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    remindCurUser().then(res => {
                        this.$message({
                            type: 'success',
                            message: '充值链接已发送到微信端，请在微信上点击充值！'
                        });
                    }).catch();

                }).catch(() => {
                });
            },
        shortmessageCorporateremittance(){
            this.$router.push({path: 'shortmessageCorporateremittance'});
        },
         onlinerecharge(){
            this.$router.push({path: 'onlinerecharge'});
        }

  }
};
</script>
<style lang="scss" scoped>
.shortmessageRechargerecordlist {
   padding: 12px;
  .top {
    padding-bottom: 10px;
    overflow: hidden;
  }
  .picimg{
      height: 28px;
      max-width:50px;
  }
    .img{
    text-align: center;
  }
}
</style>
