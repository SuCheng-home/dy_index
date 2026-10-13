<template>
<div class="accountStatement"  >
     <div class="top"> 
         <el-button @click="$router.back()" type="default" size="medium">返回</el-button> 
         <el-date-picker v-model="month" size="medium" type="month"  placeholder="选择月" :clearable="false" @change="queryBillDates()"></el-date-picker>
        
      </div>
     <div class="subject Dictionariesadd" :style="`height: ${nobottommaxH}px;`">
        <div class="body" > 
            <div class="body-top" v-if="numList.length">
                商户 
                <span v-for="(item,index) in numList" :key="index">
                   <el-tag v-if="item.merchantId==mertId">{{item.merchantId}}</el-tag>  
                   <el-tag type="info" v-else @click="merchantIdfun(item.merchantId)">{{item.merchantId}}</el-tag>
                </span>                
            </div>
            <div class="big-box" v-if="datalist.length>0">
               <span v-for="(item,index) in datalist" :key="index" @click="generationreAccountStatementlist(item.billDate,item.error)">
                   <el-tag v-if="item.error==1">{{item.billDate}}</el-tag>  
                   <el-tag type="danger" v-if="item.error==2" >{{item.billDate}}</el-tag>
                   <el-tag type="info" v-if="item.error==0" @click="updateBillReconciliation(item.billDate)">{{item.billDate}}</el-tag>
                </span> 
            </div>
             <default-page Mes="暂无对账单" v-else></default-page>
         </div> 
          
         
     </div>
</div> 
</template>
<script>
import {
  queryChargesettingList,
  queryAbcSettingList,
  queryBillDate,
  querymchIdList,queryRefundbilldate,updateBillReconciliation
} from "@/api/newcharge";
import mixin from "@/mixins/windowResize";
import DefaultPage from "@/components/DefaultPage";
export default {
  data() {
    return {
      datalist: [],
      month: new Date(),
      mchType: 5,
      mertId: "",
      numList: [],
      typelist:[],
      date: "",
      myid:""
    };
  },
  mixins: [mixin],
  created() {
     if(sessionStorage.getItem('generationremonth')){
         this.month=sessionStorage.getItem('generationremonth');
     }
    this.queryChargesettingLists();
  },
  components: { DefaultPage },
  methods: {
     updateBillReconciliation(billDate) {
                this.$confirm('是否对'+billDate+'对账？', '对账', {
                    type: 'success'
                }).then(() => {
                    updateBillReconciliation(billDate.split("-")[0]+billDate.split("-")[1]+billDate.split("-")[2])
                        .then(res => res.data)
                        .then(data => {
                            if (data.result) {
                                this.$message({
                                    type: 'success',
                                    message: '对账成功!'
                                });
                                this.queryChargesettingLists();
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
            if (mydata[i].mchType == 5) {
              this.typelist.push(mydata[i]);
            }
          }
          if (this.typelist.length) {
            this.mchType = this.typelist[0].mchType;
            this.myid = this.typelist[0].id;
            this.queryAbcSettingLists();
          }
        })
        .catch();
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
                this.mertId = this.numList[0].merchantId;
                this.queryBillDates();
              }
            }
          })
          .catch(function() {});
    },
    generationreAccountStatementlist(date, num) {
      if (num != 0) {
        sessionStorage.setItem("generationremonth",this.month);
        this.$router.push({ path: "generationreAccountStatementlist", query: { date: date,mertId:this.mertId } });
      }
    },   
    merchantIdfun(merchantId) {
      this.mertId = merchantId;
      this.queryBillDates();
    },
    queryBillDates() {
      this.month = moment(this.month).format("YYYY-MM");
      let num = new Date(this.month.split("-")[0],this.month.split("-")[1],0).getDate();
      this.datalist = [];
      for (let i = 0; i < num; i++) {
        this.datalist.push({
          error: 0,
          billDate: this.month + "-" + (i > 8 ? i + 1 : "0" + (i + 1))
        });
      }
      queryRefundbilldate(this.month.split("-")[0]+this.month.split("-")[1],this.mertId)
        .then(res => res.data)
        .then(data => {
          let mydata = data.data;
          for (let i = 0; i < this.datalist.length; i++) {
            for (let j = 0; j < mydata.length; j++) {
              if (this.datalist[i].billDate == mydata[j].billdateformat) {
                this.datalist[i].error = 1;
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