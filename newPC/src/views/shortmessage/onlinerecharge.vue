<template>
    <div class="shortmessageCorporateremittance">
        <div class="top">
            <el-button @click="$router.back()"  type="default" size="medium">返回</el-button>
                <el-button type="primary" size="medium" :disabled="!checked" @click="inserts()">获取付款码</el-button>
        </div>
        <div class="body" :style="`height: ${maxH+50}px;`">
            <div class="box">
                <div class="title">您将为<span>{{schoolInfo.name}}</span>进行短信充值：</div>
                <div class="txt">
                  <div class="botton-box">
                    <span  @click="funnum(20000)"  :class="count==20000?'color':''">20000条<div class="discount" v-if="discount!=1">{{discount*10}}折</div></span>
                    <span  @click="funnum(10000)"  :class="count==10000?'color':''">10000条<div class="discount" v-if="discount!=1">{{discount*10}}折</div></span>
                    <span  @click="funnum(5000)"  :class="count==5000?'color':''">5000条<div class="discount" v-if="discount!=1">{{discount*10}}折</div></span>
                    <span  @click="funnum(2000)"  :class="count==2000?'color':''">2000条<div class="discount" v-if="discount!=1">{{discount*10}}折</div></span>
                </div>
                <el-input-number v-if="production" v-model="count"  :min="1" :max="100000" ></el-input-number>
                </div>
                <div class="title">待支付金额：￥ {{(count/10)*discount}}</div>
                <div class="title"><el-checkbox v-model="checked">我已了解</el-checkbox></div>
                <div class="txt">
                1、充值金额仅用于在智慧校园中发送短信使用。
                </div>
                <div class="txt">
                2、充值金额无法退回。
                </div>
                <div class="txt">
                    3、如需开票，请联系您的专属客户经理：{{name}}
                    <span class="color">{{mobile}}</span>
                </div>      
            </div>
            <el-dialog title="付款码（请使用微信扫码支付）" :close-on-press-escape='false' :close-on-click-modal='false' :visible.sync="QRCodepop" width="400px" :lock-scroll="false" :modal-append-to-body='false'>
                 <div class="img"><img :src="QRCodeurl" alt=""></div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="QRCodepop = false">关 闭</el-button>
                </span>                
          </el-dialog>
           
            
    </div>
    </div>

    </div>
</template>
<script>
import moment from "moment";
import { insert,queryLiableList,queryAbcOneQR} from "@/api/shortmessage";
import baseMixin from "@/mixins/baseMixin";
import mixin from "@/mixins/windowResize";
import {mapGetters} from "vuex";
import QRCode from 'qrcode';
export default {
  name: "shortmessageCorporateremittance",
  data() {
    return {
      count:20000,
       discount:1,
      name:"",
      mobile:"",
      checked:false,
      QRCodeurl:"",
      QRCodepop:false,
      production:global.command != 'production'
    };
  },
  mixins: [baseMixin, mixin],
  computed: {
     ...mapGetters(['schoolInfo'])
  },
  created() {
    if(this.schoolInfo.id==448){
      this.production=true;
    }
     queryLiableList(this.schoolInfo.id)
            .then(res => res.data)
            .then(data => {
              if (data.code == 200) {
                this.mobile=data.data[0].mobile;
                this.name=data.data[0].name;
              }
            });
  },
  methods: {
     funnum(count){
         this.count=count;
      },
    inserts() {
      this.$confirm("您将充值"+this.count+"条短信，价格"+((this.count/10)*this.discount)+"元，是否获取付款码？", "在线充值", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        if(!this.QRCodeurl){
          insert({
               count:this.count,money:this.count/10,picJson:"",realMoney:(this.count/10)*this.discount,remark:"",type:2
           })
            .then(res => res.data)
            .then(data => {
               if(data.data){
                 queryAbcOneQR(data.data.orderNo).then(res => {
                    if(res.data.data){
                      QRCode.toDataURL(res.data.data.oneQRForAll).then(url => {
                        this.QRCodeurl = url;
                      }).catch(err => {
                      });
                      this.QRCodepop=true;
                        // this.$router.back();
                      // window.open(res.data.data,'_blank')
                    }else{
                         this.$message({ type: "error", message: res.data.msg });
                    }
                }).catch();
                
              }else{
                  this.$message({ type: "error", message: data.msg });
              }
              
            });

        }else{
           this.QRCodepop=true;
        }
         


      
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.shortmessageCorporateremittance {
  padding:12px;
  .top {
    padding-bottom: 10px;
    border-bottom: 1px solid #e7eaec;
  }
  .img{
    text-align: center;
  }
   .botton-box{
      overflow: hidden;
      span{
          float: left;
          height: 64px;
          width:23%;
          margin: 20px 1%;
          text-align: center;
          color:#606266;
          font-size:17px;
          line-height: 62px;
          border-radius: 3px;
          background: #f8f8f8;
          border:1px #f8f8f8 solid;
          position: relative;
           cursor:pointer;   
          .discount{
              position: absolute;
              right: -5px;
              top:-10px;
              color: #fff;
            background-color: #f56c6c;
            border: #f56c6c 1px solid;
            line-height: 18px;
            padding: 0 5px;
            border-radius: 9px 9px 9px 0;
            font-size: 12px;
          }
      }
      .color{
          color:#48A6FC;
          background: #E5F3FF;
          border-color:#48A6FC;
      }
  }
  .body {
    overflow: auto;
    .box {
      width: 810px;
      margin: 0 auto;
      .title {
        font-size: 18px;
        padding: 10px;
        line-height: 32px;
        color: #606266;
      }
      .txt {
        background: #fff;
        padding: 10px;
        font-size: 14px;
        line-height: 30px;
        color: #909399;
        .color {
          color: #409eff;
        }
      }
    }
  }
}
</style>
