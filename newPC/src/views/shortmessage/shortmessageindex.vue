<template>
    <div class="shortmessageindex"  :style="`height: ${maxH+120}px;`">
       <div class="body">
           <div class="left">
               <div class="top-box">
                   <div class="num">
                       <div class="nun-txt">短信额度</div>
                       <div class="plue">{{totalCount?totalCount:0}}</div>
                   </div>
                   <div class="num">
                       <div class="nun-txt">已使用</div>
                       <div class="green">{{usedCount}}</div>
                   </div>
                   <div class="num">
                       <div class="nun-txt">短信剩余</div>
                       <div class="yellow">{{mynum}}</div>
                   </div>
                   <div class="num">
                       <el-progress type="dashboard" :percentage="percentage" :color="customColorMethod"></el-progress>
                   </div>
               </div>
               <div class="title">近一月使用情况</div>
               <div id="myecharts"></div>
               <div class="title">TIP：短信计费规则</div>
               <div class="txt">
                   <div class="p"><span></span>短信长度（字数） ＝ 短信签名字数 + 短信内容字数。</div>
                   <div class="p"><span></span>汉字、字母、数字、标点符号（不区分全角/半角）以及空格等，都按1个字计算。</div>
                   <div class="p"><span></span>国内短信长度（签名+正文）不超过70字时，按照1条短信计费；超过70字即为长短信时，按67字/条分隔成多条计费。</div>
                   <div class="p"><span></span>例如，短信长度为150字，则按照67字/67字/16字分隔成3条计费。</div>
                   <div class="p"><span></span>单次发送的短信长度最长不允许超过500字。</div>
               </div>
           </div>
           <div class="right">
               <div class="ul">
                   <div class="li" @click="shortmessageTemplate()">
                       <i class="plue"></i>
                       <span>短信模板</span>
                       <span class="color">{{templateCount}}</span>
                       <span class="color">模板管理</span>
                   </div>
                   <div class="li" @click="shortmessageMasslist()">
                       <i class="green"></i>
                       <span>群发任务</span>
                       <span class="color">{{groupCount}}</span>
                       <span class="color">短信群发</span>
                   </div>
                   <div class="li" @click="shortmessageRechargerecordlist()">
                       <i class="yellow"></i>
                       <span>充值记录</span>
                       <span class="color">{{rechargeCount}}</span>
                       <span class="color">短信充值</span>
                   </div>
                    <div class="li" @click="shortmessagedetailedlist()">
                        <i class="lv"></i>
                       <span>短信总计</span>
                       <span class="color">{{smsCount}}</span>
                       <span class="color">查看明细</span>
                   </div>
                   <div class="li" @click="shortmessagefail()">
                        <i class="red"></i>
                       <span>失败数量</span>
                       <span class="color">{{failCount}}</span>
                       <span class="color">查看明细</span>
                   </div>
                   <div class="li" @click="shortmessagegroup()">
                        <i class="hui"></i>
                       <span>群组数量</span>
                       <span class="color">{{mobileGroupCount}}</span>
                       <span class="color">群组管理</span>
                   </div>
               </div>
            </div>          
       </div>
    </div>
</template>
<script>

  import mixins from '@/mixins/windowResize';
  import echarts from 'echarts';
  import {statisticAll,statisticBySchoolId,findListByDay} from '@/api/shortmessage';
    export default {
        name: "shortmessageindex",
        data() {
            return {
                enddate:"",
                startdate:"",
                totalCount:0,
                usedCount:0,
                percentage:"",
                mynum:"",
                groupCount:0,
                templateCount:0,
                rechargeCount:0,
                smsCount:0,
                failCount:0,
                mobileGroupCount:0
            }
        },
        mixins: [mixins],
        created() {
         let myDate = new Date();
         let nowY = myDate.getFullYear();
         let nowM = myDate.getMonth()+1;
         let nowD = myDate.getDate();
         this.enddate = nowY+"-"+(nowM<10 ? "0" + nowM : nowM)+"-"+(nowD<10 ? "0"+ nowD : nowD);//当前日期
         let lw = new Date(myDate - 1000 * 60 * 60 * 24 * 30);//最后一个数字30可改，30天的意思
         let lastY = lw.getFullYear();
         let lastM = lw.getMonth()+1;
         let lastD = lw.getDate();
         this.startdate=lastY+"-"+(lastM<10 ? "0" + lastM : lastM)+"-"+(lastD<10 ? "0"+ lastD : lastD);//三十天之前日期
         this.findListByDays();
         this.statisticBySchoolIds();
         this.statisticAlls();
        },
        methods: {
           findListByDays(){
               findListByDay(this.startdate,this.enddate).then(res => {
                    const data = res.data.data;
                    let namelist=[];
                    let numlist=[];
                    for(let i=0;i<data.length;i++){
                        namelist.push(data[i].date);
                        numlist.push(data[i].usedCount);
                    };
                   echarts.init(document.getElementById('myecharts')).setOption({
                    title: {
                        text: '',
                        x: 'center'            
                    },
                    color: [ '#409EFF'],//每个区域的颜色
                    grid: {
                        left: '0%',
                        right: '0%',
                        bottom: '8%',
                        containLabel: true
                    },
                    legend: {
                        data:['短信条数'],
                        x : 'center',
                        y : 'bottom',
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    xAxis: {                        
                        data:namelist
                    },
                    yAxis: {name: '短信条数',},
                    series: [{
                        name: '短信条数',
                        type: 'line',
                        data: numlist,
                        label: {
                            normal: {
                                show: true,
                                position: 'top'
                            }
                        }
                    }]
                })
                    
                })
           },
           customColorMethod(percentage) {
                if (percentage < 20) {
                return '#F56C6C';
                } else if (percentage < 50) {
                return '#E6A23C';
                } else {
                return '#409EFF';
                }
            },
           statisticBySchoolIds(){               
               statisticBySchoolId().then(res => {
                const data = res.data.data;
                this.totalCount=data.totalCount;
                this.usedCount=data.usedCount;
                this.percentage=data.totalCount?Math.floor((((this.totalCount-this.usedCount)*100)/this.totalCount)):0
                this.mynum=Math.floor((this.totalCount-this.usedCount));
                }).catch(() => {
                })
           },
           statisticAlls(){
               statisticAll().then(res => {
                const data = res.data.data;
                this.groupCount=data.groupCount;
                this.templateCount=data.templateCount;
                this.rechargeCount=data.rechargeCount;
                this.smsCount=data.smsCount;
                this.failCount=data.failCount;
                this.mobileGroupCount=data.mobileGroupCount||0;
                }).catch(() => {
                })
           },
           shortmessageTemplate(){
               this.$router.push({path: 'shortmessageTemplate'});
           },
           shortmessagedetailedlist(){
               this.$router.push({path: 'shortmessagedetailedlist'});
           },
           shortmessagefail(){
               this.$router.push({path: 'shortmessagefail'});
           },
           shortmessageRechargerecordlist(){
               this.$router.push({path: 'shortmessageRechargerecordlist'});
           },
           shortmessageMasslist(){
               this.$router.push({path: 'shortmessageMasslist'});
           },
           shortmessagegroup(){
               this.$router.push({path: 'shortmessagegroup'});
           },
        }
    }
</script>
<style lang="scss" scoped>
    .shortmessageindex{
        overflow: auto;       
       .body{           
           overflow: hide;
           padding:  20px;
           overflow: hidden;
           position: relative;
           padding-right: 360px;
           .left{
              float: left;              
              border-right: 2px solid #F2F6FC;
              padding-right: 10px;
              width: 100%;
              box-sizing: border-box;
              .title{
                  font-size: 16px;
                  line-height: 18px;
                  border-left: 3px solid #409EFF;
                  color:#606266;
                  padding-left: 10px;
                  margin-top:20px;                
              }
              .top-box{
                  overflow: hidden;
                  padding: 30px 0;
                  .num{
                      float: left;
                      width: 25%;
                      text-align: center;
                      .nun-txt{
                          font-size: 14px;
                          color:#909399;
                          line-height: 20px;
                          padding-top: 30px;
                          text-align: center;
                      }
                      .plue{
                          font-size: 28px;
                          text-align: center;
                          line-height: 48px;
                          color:#409EFF;
                      }
                      .green{
                          font-size: 28px;
                          text-align: center;
                          line-height: 40px;
                          color:#67C23A;
                      }
                      .yellow{
                          font-size: 28px;
                          text-align: center;
                          line-height: 40px;
                          color:#E6A23C;
                      }
                  }
              }
               #myecharts{
                    width: 100%;
                    height: 300px;
              }
              .txt{
                  font-size: 14px;
                  color:#909399;
                  line-height: 24px;
                  .p{
                      padding: 8px 30px;
                      position: relative;    
                      span{
                          position: absolute;
                          width:8px;
                          height: 8px;
                          border-radius: 50%;
                          background: #409EFF;
                          top:16px;
                          left: 13px;
                      }                  
                  }
              }
           }
           .right{
                width: 350px;
                position: absolute;
                right: 0;
                top:0;
               .ul{
                   .li{
                       overflow: hidden;
                       padding: 10px;
                       width: 350px;
                       span{
                           width: 100px;
                           float: left;
                           line-height: 30px;
                           color:#909399;
                           cursor:pointer;
                           font-size: 14px;
                       }
                       .color{
                           color:#409EFF;                           
                       }
                       i{
                           position: relative;
                           width: 14px;
                           height: 14px;
                           border-radius: 50%;
                           top:8px;
                           float: left;
                           margin-right:15px;
                           
                       }
                       .plue{
                           background: #409EFF;
                       }
                       .green{
                           background: #67C23A;
                       }
                       .yellow{
                           background: #E6A23C;
                       }
                       .red{
                           background: #F56C6C;
                       }
                       .lv{
                           background: #1FC7CB;
                       }
                       .hui{
                           background: #909399;
                       }
                   }
               }
           }
       }
      
    }
</style>
