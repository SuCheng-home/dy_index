<template>
<div class="accountStatement"  >
     <div class="top"> 
         <!-- <el-button @click="$router.back()" type="default" size="medium">返回</el-button>  -->
         <el-date-picker v-model="month" size="medium" type="month"  placeholder="选择月" :clearable="false" @change="queryBillDates()"></el-date-picker>
         <el-select  size="medium"  v-model="listQuery.mchType" @change="queryBillDatestype()" >
                <el-option :label='nameLlist[item.mchType]' :value="item.mchType" v-for="(item,index) in typelist" :key="index"> </el-option>
         </el-select>
      </div>
     <div class="subject Dictionariesadd" :style="`height: ${nobottommaxH}px;`">
        <div class="body" > 
            <div class="body-top" v-if="numList.length">
                商户 
                <span v-for="(item,index) in numList" :key="index">
                   <el-tag v-if="item.merchantId==listQuery.mertId">{{item.merchantId}}</el-tag>  
                   <el-tag type="info" v-else @click="merchantIdfun(item.merchantId)">{{item.merchantId}}</el-tag>
                </span>                
            </div>
            <div class="big-box" v-if="datalist.length>0">
               <span v-for="(item,index) in datalist" :key="index" @click="mydialogVisiblefun(item.billDate,item.error)">
                   <el-tag v-if="item.error==1">{{item.billDate}}</el-tag>  
                   <el-tag type="danger" v-if="item.error==2" >{{item.billDate}}</el-tag>
                   <el-tag type="info" v-if="item.error==0" @click="updateHandleBill(item.billDate)">{{item.billDate}}</el-tag>
                </span> 
            </div>
             <default-page Mes="暂无对账单" v-else></default-page>
         </div> 
          <el-dialog title="对账单详情"   :visible.sync="mydialogVisible" width="810px">
           <div class="pop-box"  ref="print" >
             <div class="pop-box-top" style="color: #606266; font-size: 14px;line-height: 20px;padding-bottom: 10px;border-bottom: 1px solid #e4e7ed;">商户号：{{listQuery.mertId}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;对账日期：{{date}} <div class="title" style=" color:#409EFF;font-size: 14px;line-height: 20px;cursor:pointer;float: right;" @click="newchargechargedetails()">收费明细</div></div>
             <div class="title" style=" color: #606266;font-size: 14px;line-height: 20px;padding: 10px 0;">银行对账单</div>
             <table border="1" v-for="(item,index) in toplist" :key="index" style="width: 100%; border: 1px solid #dcdfe6; border-collapse: collapse;  border-collapse: collapse;border-spacing: 0;table-layout: fixed;">
              <tr>
              <th style="padding: 8px 0;  text-align:center;color:#303133;font-size: 14px;line-height: 20px;background: #f5f7fa;">{{item.transferFlag=="PAY"?'缴费成功总记录数':'退款成功总记录数'}}</th>
              <th style="padding: 8px 0;  text-align:center;color:#303133;font-size: 14px;line-height: 20px;background: #f5f7fa;">{{item.transferFlag=="PAY"?'缴费成功总金额（元）':'退款成功总金额（元）'}}</th>
              <th style="padding: 8px 0;  text-align:center;color:#303133;font-size: 14px;line-height: 20px;background: #f5f7fa;">{{item.transferFlag=="PAY"?'收付标识':'收付标识'}}</th>
              </tr>
              <tr>
              <td style="padding: 8px 0;text-align:  center;color:#606266;font-size: 14px;line-height: 20px;border: 1px solid #dcdfe6;">{{item.tradeCount}}</td>
              <td style="padding: 8px 0;text-align:  center;color:#606266;font-size: 14px;line-height: 20px;border: 1px solid #dcdfe6;">{{item.tradeFeeCount}}</td>
              <td style="padding: 8px 0;text-align:  center;color:#606266;font-size: 14px;line-height: 20px;border: 1px solid #dcdfe6;">{{item.transferFlag}}</td>
              </tr>
              </table>
             <div class="title" style=" color: #606266;font-size: 14px;line-height: 20px;padding: 10px 0;">智慧校园对账单</div>
              <table border="1" style="width: 100%; border: 1px solid #dcdfe6; border-collapse: collapse;  border-collapse: collapse;border-spacing: 0;table-layout: fixed;">
              <tr>
                  <th style="padding: 8px 0;  text-align:center;color:#303133;font-size: 14px;line-height: 20px;background: #f5f7fa;">缴费成功总记录数</th>
                  <th style="padding: 8px 0;  text-align:center;color:#303133;font-size: 14px;line-height: 20px;background: #f5f7fa;">缴费成功总金额（元）</th>
                  <th style="padding: 8px 0;  text-align:center;color:#303133;font-size: 14px;line-height: 20px;background: #f5f7fa;">退款成功总记录数</th>
                  <th style="padding: 8px 0;  text-align:center;color:#303133;font-size: 14px;line-height: 20px;background: #f5f7fa;">退款成功总金额（元）</th>
              </tr>
              <tr>
              <td style="padding: 8px 0;text-align:  center;color:#606266;font-size: 14px;line-height: 20px;border: 1px solid #dcdfe6;">{{oneobj.payCount}}</td>
              <td style="padding: 8px 0;text-align:  center;color:#606266;font-size: 14px;line-height: 20px;border: 1px solid #dcdfe6;">{{oneobj.payFeeCount}}</td>
              <td style="padding: 8px 0;text-align:  center;color:#606266;font-size: 14px;line-height: 20px;border: 1px solid #dcdfe6;">{{oneobj.refundCount}}</td>
              <td style="padding: 8px 0;text-align:  center;color:#606266;font-size: 14px;line-height: 20px;border: 1px solid #dcdfe6;">{{oneobj.refundFeeCount}}</td>
              </tr>
              </table>
             <div class="title" style=" color:#409EFF;font-size: 14px;line-height: 20px;padding: 10px 0;">按收费项统计</div>
              <table border="1" style="width: 100%; border: 1px solid #dcdfe6; border-collapse: collapse;  border-collapse: collapse;border-spacing: 0;table-layout: fixed;">
              <tr>
                  <th style="padding: 8px 0;  text-align:center;color:#303133;font-size: 14px;line-height: 20px;background: #f5f7fa;">收费类型</th>
                  <th style="padding: 8px 0;  text-align:center;color:#303133;font-size: 14px;line-height: 20px;background: #f5f7fa;">缴费成功总记录数</th>
                  <th style="padding: 8px 0;  text-align:center;color:#303133;font-size: 14px;line-height: 20px;background: #f5f7fa;">缴费成功总金额（元）</th>
                  <th style="padding: 8px 0;  text-align:center;color:#303133;font-size: 14px;line-height: 20px;background: #f5f7fa;">退款成功总记录数</th>
                  <th style="padding: 8px 0;  text-align:center;color:#303133;font-size: 14px;line-height: 20px;background: #f5f7fa;">退款成功总金额（元）</th>
              </tr>
              <tr  v-for="(item,index) in bottomlist" :key="index" >
              <td style="padding: 8px 0;text-align:  center;color:#606266;font-size: 14px;line-height: 20px;border: 1px solid #dcdfe6;">{{item.typeName}}</td>
              <td style="padding: 8px 0;text-align:  center;color:#606266;font-size: 14px;line-height: 20px;border: 1px solid #dcdfe6;">{{item.payCount}}</td>
              <td v-if="item.err" @click="accountStatementlist(item.id)" style=" cursor:pointer;padding: 8px 0;text-align:  center;color:#F56C6C;font-size: 14px;line-height: 20px;border: 1px solid #dcdfe6;">{{item.payFeeCount}}(异常金额:{{item.orderFeeCount}})</td>
              <td v-else style="padding: 8px 0;text-align:  center;color:#606266;font-size: 14px;line-height: 20px;border: 1px solid #dcdfe6;">{{item.payFeeCount}} </td>
              <td style="padding: 8px 0;text-align:  center;color:#606266;font-size: 14px;line-height: 20px;border: 1px solid #dcdfe6;">{{item.refundCount}}</td>
              <td style="padding: 8px 0;text-align:  center;color:#606266;font-size: 14px;line-height: 20px;border: 1px solid #dcdfe6;">{{item.refundFeeCount}}</td>
              </tr>
             
              </table>
               <table v-if="bottomlist.length==0"  border="1" style="width: 100%; border: 1px solid #dcdfe6; border-collapse: collapse;  border-collapse: collapse;border-spacing: 0;table-layout: fixed;">
                  <tr  >                
                     <td style="width:100%;padding: 8px 0;text-align:  center;color:#606266;font-size: 14px;line-height: 20px;border: 1px solid #dcdfe6;">暂无数据</td>
                  </tr>
               </table>
              
          </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="mydialogVisible = false">关 闭</el-button>
                <el-button type="primary" @click="print()">打 印</el-button>
            </span>
        </el-dialog> 
         
     </div>
</div> 
</template>
<script>
import {
  queryChargesettingList,
  queryAbcSettingList,
  queryBillDate,
  queryBillabcSummary,
  queryBillSummary,
  queryBillSummaryDetail,
  querymchIdList,queryBillccbSummary,updateHandleBill
} from "@/api/newcharge";
import mixin from "@/mixins/windowResize";
import DefaultPage from "@/components/DefaultPage";
export default {
  data() {
    return {
      datalist: [],
      month: new Date(),
      listQuery: {
        mchType: 5,
        mertId: "",
        billDateEnd: "",
        billDateStart: ""
      },
      typelist: [],
      numList: [],
      mydialogVisible: false,
      date: "",
      nameLlist: [
        "",
        "微信商户",
        "建行商户",
        "工行商户",
        "建融慧学",
        "农行商户",
        "农行二级商户"
      ],
      toplist: [],
      oneobj: {
        payCount: "", //	缴费成功记录数	number
        payFeeCount: "", //	缴费成功总金额（元）	string
        refundCount: "", //	退款成功记录数	number
        refundFeeCount: "" //	退款成功总金额（元）	string
      },
      bottomlist: [],
      myid: "",
      dataid:""
    };
  },
  mixins: [mixin],
  created() {
    this.queryChargesettingLists();
  },
  components: { DefaultPage },
  methods: {
    updateHandleBill(billDate) {
                this.$confirm('是否对'+billDate+'对账？', '对账', {
                    type: 'success'
                }).then(() => {
                    updateHandleBill(billDate,this.listQuery.mertId,this.listQuery.mchType)
                        .then(res => res.data)
                        .then(data => {
                            if (data.result) {
                                this.$message({
                                    type: 'success',
                                    message: '对账成功!'
                                });
                                this.queryBillDates();
                            }else{
                              this.$message.error(data.msg);
                            }
                        });
                });

            },
    //获取列表
    queryChargesettingLists() {
      queryChargesettingList()
        .then(res => {
          let mydata = res.data.data;
          //	1微信商户 2建行商户 3工行商户 4建融会学 5农行商户
          for (let i = 0; i < mydata.length; i++) {
            if (mydata[i].mchType != 1 && mydata[i].mchType != 3) {
              this.typelist.push(mydata[i]);
            }
          }
          if (this.typelist.length) {
            this.listQuery.mchType = this.typelist[0].mchType;
            this.myid = this.typelist[0].id;
            this.queryAbcSettingLists();
          }
        })
        .catch();
    },
    queryBillDatestype(){
      for(let i=0;i<this.typelist.length;i++){
        if(this.listQuery.mchType == this.typelist[i].mchType){
            this.myid = this.typelist[i].id;
            this.queryAbcSettingLists();
        }

      }
    },
    //获取商户号
    queryAbcSettingLists() {
      this.numList=[]
     querymchIdList(this.myid)
          .then(res => {
            if (res.data.code === 200) {
              let data = res.data.data.mchIdList;
              for(let i=0;i<data.length;i++){
                     this.numList.push({
                       merchantId: data[i]
                     })
              }
              if (this.numList.length) {
                this.listQuery.mertId = this.numList[0].merchantId;
                this.queryBillDates();
              }
            }
          })
          .catch(function() {});
    },
    //打印
    print() {
      this.mydialogVisible = false;
      this.$print(this.$refs.print);
    },
    accountStatementlist(id) {
      this.$router.push({ path: "accountStatementlist", query: { id: id } });
    },
    newchargechargedetails() {
      this.$router.push({ path: "newchargechargedetails", query: { date: this.date,dataid:this.dataid } });
    },
    mydialogVisiblefun(date, num) {
      if (num != 0) {
        this.date = date;
        this.mydialogVisible = true;
        this.queryBillabcSummarys();
        this.queryBillSummarys();
      }
    },
    queryBillSummaryDetails(id) {
      queryBillSummaryDetail(id)
        .then(res => {
          if (res.data.code === 200) {
            let data = res.data.data;
            this.bottomlist = data ? data : [];
          }
        })
        .catch(function() {});
    },
    queryBillSummarys() {
      queryBillSummary(this.date, this.listQuery.mertId, this.listQuery.mchType)
        .then(res => {
          if (res.data.code === 200) {
            let data = res.data.data;
            this.oneobj = data;
            this.dataid=data.id;
            this.queryBillSummaryDetails(data.id);
          }
        })
        .catch(function() {});
    },
    //获取银行对账单
    queryBillabcSummarys() {
      if (this.listQuery.mchType == 5) {
        queryBillabcSummary(this.date, this.listQuery.mertId)
          .then(res => {
            if (res.data.code === 200) {
              let data = res.data.data;
              this.toplist = data;
            }
          })
          .catch(function() {});
      } else {
        queryBillccbSummary(this.date, this.listQuery.mertId)
          .then(res => {
            if (res.data.code === 200) {
              let data = res.data.data;
              this.toplist = data;
            }
          })
          .catch(function() {});
      }
    },
    merchantIdfun(merchantId) {
      this.listQuery.mertId = merchantId;
      this.queryBillDates();
    },
    queryBillDates() {
      this.month = moment(this.month).format("YYYY-MM");
      let num = new Date(
        this.month.split("-")[0],
        this.month.split("-")[1],
        0
      ).getDate();
      this.listQuery.billDateStart = this.month + "-" + "01";
      this.listQuery.billDateEnd = this.month + "-" + num;
      this.datalist = [];
      for (let i = 0; i < num; i++) {
        this.datalist.push({
          error: 0,
          billDate: this.month + "-" + (i > 8 ? i + 1 : "0" + (i + 1))
        });
      }
      queryBillDate(this.listQuery)
        .then(res => res.data)
        .then(data => {
          let mydata = data.data;
          for (let i = 0; i < this.datalist.length; i++) {
            for (let j = 0; j < mydata.length; j++) {
              if (this.datalist[i].billDate == mydata[j].billDate) {
                this.datalist[i].error = mydata[j].error;
              }
            }
          }
        });
    }
  }
};
</script>


<style lang="scss" scoped>
.accountStatement {
  padding:12px;
  .top {
    border-bottom: 1px solid #e7eaec;
    padding-bottom: 10px;
  }
  .subject {
    padding-top: 10px;
    overflow: auto;
    .body {
      width: 810px;
      margin: 0 auto;
      .el-tag {
        margin: 0 8px;
        cursor: pointer;
        font-size: 16px;
        padding: 6px 10px;
        height: 40px;
      }
      .body-top {
        line-height: 32px;
        padding: 14px;
        font-size: 14px;
        color: #303133;
      }
      .big-box {
        margin: 10px 1px 8px 40px;
        padding: 10px;
        border: 1px solid #e4e7ed;
        border-radius: 5px;
        height: 400px;
        .el-tag {
          margin-bottom: 20px;
        }
      }
    }
  }
}
</style>