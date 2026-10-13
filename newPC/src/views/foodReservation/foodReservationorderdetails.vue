<template>
<div class="foodReservationorderdetails"  >
    <div class="top">
        <el-button @click="$router.back()" type="default" size="medium">返回</el-button>
        <el-button type="danger" size="medium"  v-if="typePayWay==1&&orderState==0" @click="deleteOrderByIds()">删除订单</el-button>
        <span  v-else> 
            <el-button type="danger" size="medium" v-if="flag&&orderState!=3" @click="cancelOrderByOrderIds()">取消订单</el-button>
        </span>
    </div>
    <div class="body" :style="`height: ${nobottommaxH}px;`">
        <div class="body-box">
              <div class="typename">
                    {{typeName}} &nbsp; &nbsp;
                    <el-tag size="mini"  v-if="typePayWay==1">线上支付</el-tag>
                    <el-tag size="mini" v-else>线下支付</el-tag>
                </div>
                <div class="ul">
                    <div class="li"  v-for="(item,index) in datalist" :key="index">
                        <img :src="item.pastryUrl" alt="">
                        <div class="name">{{item.pastryName}}</div>
                        <div class="num"><span>￥{{item.pastryPrice/100}}</span></div>    
                        <div class="right">
                            <span class="rightnum">x {{item.quantity}}&nbsp;</span>
                            <span>
                                <el-tag size="mini" v-if="typePayWay==2&&item.pastryState==3">已退单</el-tag>
                                <el-tag size="mini" v-if="typePayWay==1&&item.pastryState==1"  type="success">已支付</el-tag>
                                <el-tag size="mini" v-if="typePayWay==1&&item.pastryState==3">退款成功</el-tag>
                                <el-tag size="mini" v-if="typePayWay==1&&item.pastryState==0"  type="danger">未支付</el-tag>
                                <el-tag size="mini" v-if="typePayWay==1&&item.pastryState==4"  type="danger">退款失败</el-tag>
                                <el-tag size="mini" v-if="typePayWay==1&&item.pastryState==2"  type="warning">退款中</el-tag>
                                <el-tag size="mini" v-if="typePayWay==1&&item.pastryState==5"  type="warning">部分退款</el-tag>
                            </span>
                            <span>&nbsp;
                                <span class="red" v-if="flag&&typePayWay==1&&(item.pastryState==1||item.pastryState==4)" @click="refunds('退款',item)">退款</span>
                                <span class="red" v-if="flag&&typePayWay==2&&item.pastryState==1" @click="refunds('退单',item)">退单</span>
                            </span>
                        </div>                  
                    </div>                    
                </div>               
                <div class="bottomnum">订  单  号：<span>{{orderNo}}</span></div>
                <div class="bottomnum">领取日期：<span>{{orderDate}}</span></div>
                <div class="bottomnum">总  金  额：<span>￥{{totalAmount/100}}</span></div>
                <div class="bottomnum"  v-if="typePayWay==1">已  支  付：<span>￥{{paidAmount/100}}</span></div>
                <div class="bottomnum"  v-if="typePayWay==1">已  退  款：<span>￥{{refundAmount/100}}</span></div>
                <div class="bottomnum"  v-if="orderState==3">订单状态：<span><el-tag  size="mini" type="danger"  >订单已取消</el-tag></span></div>
        </div>
    </div>  
</div> 
</template>
<script>
import {getOrderInfoById,refund,deleteOrderById,cancelOrderByOrderId,getPastryTypeById} from "@/api/foodReservation";
import mixin from "@/mixins/windowResize";
export default {
  data() {
    return {
      id: this.$route.query.orderId,
      datalist: [],
      typeName: "",
      typePayWay: "",
      orderDate: "",
      orderNo: "",
      totalAmount: "",
      paidAmount: "",
      refundAmount: "",
      orderState: "",
      flag: "",
      startDate: "",
      endDate: "",
      typeId: ""
    };
  },
  mixins: [mixin],
  created() {
       this.getOrderInfoByIds()
  },
  methods: {
      //判断当前时间是否在考核时间内
            checkTime(){
                //开始时间   
                let date = new Date();
                let a = this.startDate.split(":");
                let b = this.endDate.split(":");
                let thisDate = new Date();
                let hh =new Date(thisDate).getHours() < 10? "0" + new Date(thisDate).getHours(): new Date(thisDate).getHours();
                let mm =new Date(thisDate).getMinutes() < 10? "0" + new Date(thisDate).getMinutes(): new Date(thisDate).getMinutes();
                if(date.setHours(a[0],a[1]) > date.setHours(hh,mm)||date.setHours(hh,mm) > date.setHours(b[0],b[1])){
                  return false;
                }else{
                 return true;  
                }
                
            },
            //获取类型详情
            getPastryTypeByIds(id){
               getPastryTypeById(id).then(res => res.data).then(data => {       
                    let mydata=data.data;
                    this.startDate=mydata.startDate;
                    this.endDate=mydata.endDate;                 
                })
            },
           //获取类型详情
            getOrderInfoByIds(){
               getOrderInfoById(this.id).then(res => res.data).then(data => {       
                    let mydata=data.data;
                    this.typeName=mydata.typeName;
                    this.typePayWay=mydata.typePayWay;
                    this.datalist=mydata.orderPastryList;
                    this.orderDate=mydata.orderDate;
                    this.orderNo=mydata.orderNo;
                    this.totalAmount=mydata.totalAmount;
                    this.paidAmount=mydata.paidAmount;
                    this.refundAmount=mydata.refundAmount;
                    this.orderState=mydata.orderState;
                    this.flag=mydata.flag;
                    this.typeId=mydata.typeId
                   this.getPastryTypeByIds(mydata.typeId)                 
                })
            },
            //退款  
            refunds(name,obj){
                let $this=this;
                 //判断是否可以提交订单
                if((!this.checkTime())){
                  this.$message.error( '当前时间不在运营时间，无法'+name+'!');
                  return;
                }
                  this.$confirm('确定要'+name+'吗？', name, {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    refund(obj).then(res => res.data).then(data => {
                            if(data.result) {
                                  this.$message({type: 'success', message: name+'成功!' });
                                  this.getOrderInfoByIds();
                           }
                        })
                });
            },
             //删除   
            deleteOrderByIds(){
                let $this=this;
                 this.$confirm('确定要删除订单吗？', '删除订单', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteOrderById(this.id)
                    .then(res => {
                    if (res.data.code === 200) {
                       this.$message({type: 'success', message: '删除成功!' });
                        $this.$router.back();
                    }
                    })
                    .catch(err => {});
                });
            },
             //取消   
            cancelOrderByOrderIds(){
                let $this=this;
                 //判断是否可以提交订单
                if((!this.checkTime())){
                    this.$message.error( '当前时间不在运营时间，无法取消订单!');
                  return;
                }
                 this.$confirm('确定要取消订单吗？', '取消订单', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    cancelOrderByOrderId(this.id)
                    .then(res => {
                    if (res.data.code === 200) {
                        this.$message({type: 'success', message: '取消订单成功!' });
                        $this.getOrderInfoByIds();
                    }
                    })
                    .catch(err => {});
                });
            },
  }
};
</script>
<style lang="scss" scoped>
.foodReservationorderdetails {
  padding:12px;
  .top {
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
  }
  .body{
      overflow: auto;
      .ul{
              padding-left: 10px;
              .li{
                  overflow: hidden;
                  border-bottom: 1px solid #E4E7ED;
                  padding: 5px 0;
                  line-height: 30px;
                  font-size: 14px;
                  color:#303133;
                 position: relative;
                img{
                    float: left;
                    width: 60px;
                    height: 60px;
                    margin-right: 5px;
                }
                .right{
                    position: absolute;
                    top:20px;
                    right:10px;
                    .red{
                        color:#ee0a24;
                        cursor:pointer;
                    }
                }
                .num{
                    color:#606266;
                    span{
                        color: #67C23A;
                        font-size: 16px;
                        margin-right: 10px;
                    }
                }
              }  
          }
      .body-box{
        width: 500px;
        margin: 0 auto;
        padding-top: 20px;
        .typename{
            padding-bottom: 20px;
            color:#303133;
            font-size: 15px;
        }
        .bottomnum{
            color:#606266;
            font-size: 14px;
            line-height: 30px;
            
        }
        .bottomnum>span{
                color:#409EFF;
            }
      }
  }  
}
</style>