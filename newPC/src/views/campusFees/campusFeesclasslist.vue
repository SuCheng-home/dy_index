<template>
    <div class="campusFeesclasslist">
        <div class="bigtop"> 
         <el-button @click="$router.back()" type="default" size="medium">返回</el-button> 
         <!-- <a :href="downLoadHref" target="_blank" v-if="dateList.length" download="examName">、 -->
             <el-button type="primary"  size="medium" @click="exportExcel('#outTable', `收费明细-按班统计.xlsx`)">导出</el-button>
             <!-- </a> -->
           <span class="top">{{name}}</span>     
      </div>
      <div class="top-ul">
                    <div class="li"><div class="num">{{dataname.countAllUser}}人</div>总人数</div>
                     <div class="li"><div class="num">{{dataname.countPayedUser}}人</div>线上缴费</div>
                     <div class="li"><div class="num">{{dataname.countPayedOfflineUser}}人</div>线下缴费</div>
                     <div class="li"><div class="num">{{dataname.exemptionUser}}人</div>免缴</div>
                     <div class="li"><div class="num">{{dataname.refundUser}}人</div>退款</div>
                     <div class="li"><div class="num">{{dataname.countNoPayUser}}人</div>未缴费</div>
                     <div class="li"><div class="num">{{dataname.countAllMoney}}元</div>应收费</div>
                     <div class="li"><div class="num">{{dataname.refundMoney}}元</div>退款</div>
                     <div class="li"><div class="num">{{dataname.countPayMoney}}元</div>线上到账</div>
                     <div class="li"><div class="num">{{dataname.countPayOfflineMoney}}元</div>线下到账</div>
                     <div class="li"><div class="num">{{dataname.countNoPayMoney}}元</div>未到账</div>
                     <div class="li"><div class="num">{{dataname.balance}}元</div>结余</div>
                 </div>
         <div class="time-table" id="outTable">
            <el-table stripe  :data="dateList" border fit highlight-current-row  style="width: 100%" :height="nobottommaxH-70">
                <el-table-column  label="班级">
                    <template slot-scope="scope">
                       <span >{{scope.row.className}}</span>
                    </template>
                </el-table-column>
                <el-table-column  label="班级人数">
                    <template slot-scope="scope">
                       <span >{{scope.row.classUser}}</span>
                    </template>
                </el-table-column>
                <el-table-column  label="班级应缴费总金额">
                    <template slot-scope="scope">
                       <span >{{scope.row.amountPayable}}</span>
                    </template>
                </el-table-column>
                 <el-table-column  label="免缴人数">
                    <template slot-scope="scope">
                       <span >{{scope.row.exemptionUser}}</span>
                    </template>
                </el-table-column>
                <el-table-column  label="线下支付人数">
                    <template slot-scope="scope">
                       <span >{{scope.row.payedOfflineUser}}</span>
                    </template>
                </el-table-column>
                <el-table-column  label="线下支付金额">
                    <template slot-scope="scope">
                       <span >{{scope.row.payedOfflineFee}}</span>
                    </template>
                </el-table-column>
                <el-table-column  label="线上支付人数">
                    <template slot-scope="scope">
                       <span >{{scope.row.payedLineUser}}</span>
                    </template>
                </el-table-column>
                <el-table-column  label="线上支付金额">
                    <template slot-scope="scope">
                       <span >{{scope.row.payedLineFee}}</span>
                    </template>
                </el-table-column>
                 <el-table-column  label="未缴人数">
                    <template slot-scope="scope">
                       <span v-if="scope.row.payedNoUser>0&&scope.row.className!='总计'" class="a-span"  @click="classdialogVisible(scope.row.classId)">{{scope.row.payedNoUser}}</span>
                       <span v-if="scope.row.payedNoUser==0||scope.row.className=='总计'" >{{scope.row.payedNoUser}}</span>
                    </template>
                </el-table-column>
                <el-table-column  label="缴费比例">
                    <template slot-scope="scope">
                       <span >{{scope.row.payedPercentage}}</span>
                    </template>
                </el-table-column>
                <el-table-column  label="已退人数">
                    <template slot-scope="scope">
                       <span >{{scope.row.refundUserCount}}</span>
                    </template>
                </el-table-column>
                <el-table-column  label="已退金额">
                    <template slot-scope="scope">
                       <span >{{scope.row.refundFeeCount}}</span>
                    </template>
                </el-table-column>
                <el-table-column  label="结余金额">
                    <template slot-scope="scope">
                       <span >{{scope.row.deductFeeCount}}</span>
                    </template>
                </el-table-column>
            </el-table>
            <el-dialog  title="未缴学生" :visible.sync="dialogVisible"  width="80%" >
            <div class="content-box">
                <div class="ul">
                    <div class="li"  v-for="(item,index) in classdateList" :key="index">
                        <img :src="item.avatar" alt="">
                        <div class="name">{{item.studentName}}</div>
                    </div>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
        </div>
    </div>
</template>
<script>
import {queryChargeStaticGroupByClass,queryChargeNoticeDetailListByClass,queryChargeNoticeStatic} from '@/api/campusFees';
import Backtool from '@/components/BackTool';
import baseMixin from '@/mixins/baseMixin';
import _ from 'lodash';
import mixin from '@/mixins/windowResize';
export default {
  name: "campusFeesdetails",
  data: function() {
    return {
        id:   this.$route.query.id,
        dateList:[] ,
        name:'' ,
        dialogVisible:false,
       query: {
        chargeId:this.$route.query.id,
        classId:'',
        status:'0',
      },
      classdateList:[],
      dataname:{},//总览数据
       downLoadHref: global.BasePath + "chargeNotice/queryChargeStaticGroupByClassExport?noticeId=" +this.$route.query.id +"&token=" +this.$store.getters.token,//导出全部名单
    };
  },
    components: {
            Backtool
        },
   mixins: [mixin,baseMixin],
  //获取渲染数据当数据加载完成后执行(生命周期中的钩子函数)
  created() {
      
       queryChargeStaticGroupByClass(this.id).then(res => {
        let data = res.data.data;
        this.dateList=data.dataList;
        this.name= data.chargeModel.chargeName;
         //获取校园收费总览
      queryChargeNoticeStatic(this.id).then(res => {
         this.dataname = res.data.data;
          let obj={
            className:'总计',
            classUser: this.dataname.countAllUser,
            exemptionUser:this.dataname.exemptionUser,
            payedOfflineUser:this.dataname.countPayedOfflineUser,
            payedLineUser:this.dataname.countPayedUser,            
            payedNoUser:this.dataname.countNoPayUser,
            payedPercentage:parseFloat(((this.dataname.countAllUser-this.dataname.countNoPayUser)/this.dataname.countAllUser)*100).toFixed(2)+'%',
            payedLineFee:this.dataname.countPayMoney,
            payedOfflineFee:this.dataname.countPayOfflineMoney,
            refundUserCount:this.dataname.refundUser,
            refundFeeCount:this.dataname.refundMoney,
            deductFeeCount:this.dataname.balance,
            amountPayable:this.dataname.countAllMoney,
            
            
        }
         this.dateList.push(obj)
      });
       
      });
  },
  methods: {
    classdialogVisible(id){
      this.query.classId=id;
      this.dialogVisible=true;
      this.queryChargeNoticeDetailLists()
    },
   queryChargeNoticeDetailLists() {
        queryChargeNoticeDetailListByClass(this.query.chargeId,this.query.classId).then(res => {
        let data = res.data.data;
        this.classdateList=data.dataList;
      });
    },
  }
};
</script>
<style scoped>
.campusFeesclasslist{
    padding:12px;
}
.campusFeesclasslist  .top-ul{
    overflow: hidden;
}
.campusFeesclasslist  .top-ul .li{
    width: 7.3%;
    height: 60px;
    margin: 10px 0.5%;
    padding-top: 3px;
    background-color: #20a0ff;
    color: #fff;
    text-align: center;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    border-radius: 5px;
    font-size: 16px;
    float: left;
}
.campusFeesclasslist .top-ul .li .num{
   font-size: 15px;
    line-height: 30px;
}
.bigtop {
    padding-bottom: 10px;
    overflow: hidden;
        border-bottom: 1px solid #e7eaec;
  }
.campusFeesclasslist .top{
    font-size: 20px;
    font-weight: 600;
    display: inline-block;
    width: 70%;
    text-align: center;
}
.campusFeesclasslist .a-span{
  color:#409EFF;
  cursor:pointer;
}
.campusFeesclasslist .ul{
      overflow: auto;
    min-height: 100px;
    max-height: 300px;
}
.campusFeesclasslist .ul .li{
       float: left;
    padding: 10px 5px;
    height: 94px;
    margin: 5px;
    width: 80px;
    border: 1px #eee solid;
    }
.campusFeesclasslist .ul .li img{
        width: 50px;
    margin: 0 10px;
    border-radius: 50%;
    height: 50px;
}
.campusFeesclasslist .ul .li .name{
    text-align: center;
}
</style>
