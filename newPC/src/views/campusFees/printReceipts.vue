<template>
    <div class="printReceipts">
        <div class="top">
           <el-button @click="$router.back()" type="default" size="medium">返回</el-button> 
           <el-select v-model="query.classId" placeholder="请选择班级"  @change="newqueryChargeNoticeDetailList()" size="medium">
                <el-option v-for="item in classlist" :key="item.id" :label="item.name"  :value="item.id" ></el-option>
          </el-select> 
         打印一页几条： <el-input-number v-model.trim="dayinnum" step-strictly  :min="1" :max="99999" :step="1"></el-input-number>
          <el-button type="primary"   @click="print()" size="medium" >打印</el-button> 
        </div>
        <div class="body" :style="`height: ${nobottommaxH}px;    overflow: auto;`">
           <div ref="print">
            <div class="box" :key="indexs" v-for="(items, indexs) in dataList" style="border-bottom: 1px dashed #ccc;padding:0 10px;">            
              <div  style="background: #fff; margin-bottom: 5px; border: 1px solid #eee;padding: 10px; border-radius: 5px; margin: 15px 0;">
                        
                          <div v-if="numfun(indexs+1)"  style="overflow: hidden;border-bottom: 1px solid #e7eaec; page-break-after: always;" >
                             <div style="text-align: center;font-size: 20px;position: relative;line-height: 30px;">收据
                           <div v-if="items.orderId" style="position: absolute; right: 10px;top: 0;font-size: 14px;line-height: 30px;">
                             NO:{{items.orderId}}
                           </div>
                         </div>
                         <div style="    text-align: center; font-size: 14px; line-height: 30px;">
                           入账日期：{{items.payTime}}
                         </div>
                         <div style=" border: 1px solid #aaa;margin: 5px 0; padding: 10px;border-radius: 8px;">
                            <div style=" font-size: 14px; line-height: 30px;    display: inline-block; width: 49%;">
                              <span style=" width: 32%;display: inline-block;text-align: right;">交款单位：</span>
                              <span style=" width: 64%;display: inline-block;border-bottom: 1px solid #aaa;" >{{items.studentName}}</span>
                            </div>  
                            <div style=" font-size: 14px; line-height: 30px;    display: inline-block; width: 49%;">
                              <span style=" width: 32%;display: inline-block;text-align: right;">收款方式：</span>
                              <span style=" width: 64%;display: inline-block;border-bottom: 1px solid #aaa;" >
                                    <span   v-if="items.status==1||items.status==4"> 线上支付</span>
                                    <span   v-if="items.status==2"> 线下补缴</span>
                              </span>
                            </div>                          
                            <div style=" font-size: 14px; line-height: 30px;    display: inline-block; width: 49%;">
                              <span style=" width: 32%;display: inline-block;text-align: right;">人民币（大写）：</span>
                              <span style=" width: 64%;display: inline-block;border-bottom: 1px solid #aaa;" >{{items.payMoney|bignamefun}}</span>
                            </div> 
                            <div style=" font-size: 14px; line-height: 30px;    display: inline-block; width: 49%;">
                              <span style=" width: 32%;display: inline-block;text-align: right;">￥：</span>
                              <span style=" width: 64%;display: inline-block;border-bottom: 1px solid #aaa;" >{{items.payMoney}}</span>
                            </div> 
                            <div style=" font-size: 14px; line-height: 30px;    display: inline-block; width: 100%;">
                              <span style=" width: 16%;display: inline-block;text-align: right;">收款事由：</span>
                              <span style=" width: 81%;display: inline-block;border-bottom: 1px solid #aaa;" >{{chargeName}}</span>
                            </div> 
                             <div style=" font-size: 16px; line-height: 30px;    display: inline-block; width: 100%;text-align: right;    padding: 10px 50px 0 0;">{{items.payTime.slice(0, 10)}}</div>
                         </div>   
                          <div style=" font-size: 14px; line-height: 30px;display: inline-block; width: 100%;">
                               <span style=" width: 16%;    float: left;text-align: right;">单位盖章：</span>
                               <span style=" width: 30%;    float: left;">{{schoolInfo.name}}</span>
                               <span style=" width: 13%;    float: left;">财会主管：</span>
                               <span style=" width: 8%;    float: left;">记账：</span>
                               <span style=" width: 8%;    float: left;">出纳：</span>
                               <span style=" width: 8%;    float: left;">审核：</span>
                               <span style=" width: 15%;    float: left;">经办：{{createUserName}}</span>
                            </div>                            
                          </div>     
                          <div v-else>
                             <div style="text-align: center;font-size: 20px;position: relative;line-height: 30px;">收据
                           <div v-if="items.orderId" style="position: absolute; right: 10px;top: 0;font-size: 14px;line-height: 30px;">
                             NO:{{items.orderId}}
                           </div>
                         </div>
                         <div style="    text-align: center; font-size: 14px; line-height: 30px;">
                           入账日期：{{items.payTime}}
                         </div>
                         <div style=" border: 1px solid #aaa;margin: 5px 0; padding: 10px;border-radius: 8px;">
                            <div style=" font-size: 14px; line-height: 30px;    display: inline-block; width: 49%;">
                              <span style=" width: 32%;display: inline-block;text-align: right;">交款单位：</span>
                              <span style=" width: 64%;display: inline-block;border-bottom: 1px solid #aaa;" >{{items.studentName}}</span>
                            </div>  
                            <div style=" font-size: 14px; line-height: 30px;    display: inline-block; width: 49%;">
                              <span style=" width: 32%;display: inline-block;text-align: right;">收款方式：</span>
                              <span style=" width: 64%;display: inline-block;border-bottom: 1px solid #aaa;" >
                                    <span   v-if="items.status==1||items.status==4"> 线上支付</span>
                                    <span   v-if="items.status==2"> 线下补缴</span>
                              </span>
                            </div>                          
                            <div style=" font-size: 14px; line-height: 30px;    display: inline-block; width: 49%;">
                              <span style=" width: 32%;display: inline-block;text-align: right;">人民币（大写）：</span>
                              <span style=" width: 64%;display: inline-block;border-bottom: 1px solid #aaa;" >{{items.payMoney|bignamefun}}</span>
                            </div> 
                            <div style=" font-size: 14px; line-height: 30px;    display: inline-block; width: 49%;">
                              <span style=" width: 32%;display: inline-block;text-align: right;">￥：</span>
                              <span style=" width: 64%;display: inline-block;border-bottom: 1px solid #aaa;" >{{items.payMoney}}</span>
                            </div> 
                            <div style=" font-size: 14px; line-height: 30px;    display: inline-block; width: 100%;">
                              <span style=" width: 16%;display: inline-block;text-align: right;">收款事由：</span>
                              <span style=" width: 81%;display: inline-block;border-bottom: 1px solid #aaa;" >{{chargeName}}</span>
                            </div> 
                            <div style=" font-size: 16px; line-height: 30px;    display: inline-block; width: 100%;text-align: right;    padding: 10px 50px 0 0;">{{items.payTime.slice(0, 10)}}</div>
                         </div>  
                          <div style=" font-size: 14px; line-height: 30px;display: inline-block; width: 100%;">
                               <span style=" width: 16%;    float: left;text-align: right;">单位盖章：</span>
                               <span style=" width: 30%;    float: left;">{{schoolInfo.name}}</span>
                               <span style=" width: 13%;    float: left;">财会主管：</span>
                               <span style=" width: 8%;    float: left;">记账：</span>
                               <span style=" width: 8%;    float: left;">出纳：</span>
                               <span style=" width: 8%;    float: left;">审核：</span>
                               <span style=" width: 15%;    float: left;">经办：{{createUserName}}</span>
                            </div> 
                          </div>                 
              </div>                   
            </div>
            </div>
         
        </div>
    </div>
</template>
<script>
import {queryChargeNoticeDetailList} from '@/api/campusFees';
import mixin from "@/mixins/windowResize";
import {mapGetters} from 'vuex';
export default {
  name: "printReceipts",
  data: function() {
    return {
      dataList: [], //表格主题数据
      classlist: [], //班级
      date:moment().format('YYYY-MM-DD'),
      query: {
        pageNo: 1, //页数
        pageSize: 200, //条数
        searchVal: "",
        chargeId: this.$route.query.id,
        classId: "",
        status: "",
      },
      chargeName:this.$route.query.chargeName,
      createUserName:this.$route.query.createUserName,
      dayinnum:4
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
    computed: {
            ...mapGetters(['schoolInfo'])
        },
  //获取渲染数据当数据加载完成后执行(生命周期中的钩子函数)
  created() {
       queryChargeNoticeDetailList(this.query).then(res => {
            let data = res.data.data;
            if(data.classModelList.length){
                this.classlist=data.classModelList
                this.query.classId=data.classModelList[0].id
                this.newqueryChargeNoticeDetailList()
            }
           });
        },
  methods: {
     numfun(num){
                if(num%this.dayinnum==0){
                    return true;
                }else{
                    return false;
                }

            },
       //打印
        print() {
        this.$print(this.$refs.print);
        },
      newqueryChargeNoticeDetailList(){
          this.dataList=[]
           queryChargeNoticeDetailList(this.query).then(res => {
            let data = res.data.data.dataList;
            for(let i=0;i<data.length;i++){
              if(data[i].status==1||data[i].status==2||data[i].status==4){
                   this.dataList.push(data[i])
              }              
            }
           });
        }
  }
};
</script>
<style  lang="scss" scoped="scoped">
.printReceipts {
  padding:12px;
    .top {
      padding-bottom: 10px;   
      border-bottom: 1px solid #eee;
   }
   .box{
      width:810px;    
          margin: 0px auto;  
    }
}
</style>
