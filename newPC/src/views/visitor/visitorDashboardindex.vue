<template>
    <div class="visitorDashboardindex">
        <div class="big-top">今 日 访 客 数 据 看 板</div>
        <div class="body">
            <div class="body-left">
                <div class="body-left-top-box small-box">
                    <img class="topleft" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/topleft.png" alt="">
                    <img class="topright" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/topright.png" alt="">
                    <img class="bottomleft" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/bottomleft.png" alt="">
                    <img class="bottomright" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/bottomright.png" alt="">
                    <img class="bordertop" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/border.png" alt="">
                    <img class="borderbottom" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/border.png" alt="">
                    <div class="small-top">
                        <img src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/left.png" alt="">
                         &nbsp; &nbsp;今日访客概览&nbsp; &nbsp;
                        <img src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/right.png" alt="">
                    </div>
                    <div class="fangke">
                        <div class="fangkenum" style="box-shadow: inset 5px 5px 30px #409EFF,inset -5px -5px 30px #409EFF,inset -5px 5px 30px #409EFF,inset 5px -5px 30px #409EFF;">
                           {{Math.floor(query.inList.length+query.notInList.length)}}
                        </div>
                        今日访客
                    </div>
                    <div class="fangke"  >
                        <div class="fangkenum" style="box-shadow: inset 5px 5px 30px #67C23A,inset -5px -5px 30px #67C23A,inset -5px 5px 30px #67C23A,inset 5px -5px 30px #67C23A;">
                              {{query.inList.length}}
                        </div>
                        已到访
                    </div>
                    <div class="fangke">
                        <div class="fangkenum" style="box-shadow: inset 5px 5px 30px #E6A23C,inset -5px -5px 30px #E6A23C,inset -5px 5px 30px #E6A23C,inset 5px -5px 30px #E6A23C;">
                              {{query.notInList.length}}
                        </div>
                        未到访
                    </div>
                    
                </div>
                 <div class="body-left-bottom-box small-box">
                    <img class="topleft" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/topleft.png" alt="">
                    <img class="topright" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/topright.png" alt="">
                    <img class="bottomleft" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/bottomleft.png" alt="">
                    <img class="bottomright" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/bottomright.png" alt="">
                    <img class="bordertop" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/border.png" alt="">
                    <img class="borderbottom" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/border.png" alt="">
                    <div class="small-top">
                        <img src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/left.png" alt="">
                         &nbsp; &nbsp;今日待访名单&nbsp; &nbsp;
                        <img src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/right.png" alt="">
                    </div>
                    <div class="guandong">
                          <table>
                        <tr>
                          <th style="width:20%">姓名</th>
                          <th style="width:20%">时间</th>
                          <th style="width:20%">拜访人</th>
                          <th style="width:40%">事由</th>
                        </tr>
                        <tr v-for="(item,index) in query.notInList" :key="index">
                          <td>{{item.name}}</td>
                          <td>{{item.visitTime.slice(10,16)}}</td>
                          <td>{{item.visitUserName}}</td>
                          <td>{{item.reason}}</td>
                        </tr>                     
                    </table>

                    </div>
                  
                </div>
            </div>
            <div class="body-center">
              <div class="body-center-top-box small-box ">
                    <img class="topleft" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/topleft.png" alt="">
                    <img class="topright" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/topright.png" alt="">
                    <img class="bottomleft" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/bottomleft.png" alt="">
                    <img class="bottomright" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/bottomright.png" alt="">
                    <img class="bordertop"   src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/border.png" alt="">
                    <img class="borderbottom"    src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/border.png" alt="">
                    <div class="small-top">
                        <img src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/left.png" alt="">
                         &nbsp; &nbsp;当前访客数据&nbsp; &nbsp;
                        <img src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/right.png" alt="">
                    </div>
                   <div class="fangkebox" v-if="query.inList.length">
                           <div class="fangkeboxtop">
                               {{query.inList[0].name}}
                               <span>{{query.inList[0].visitTime.slice(10,16)}}</span>
                           </div>
                           <div class="fangkeboxli">
                               <div class="fangkeboxliname">
                                    拜访人：
                               </div>
                               {{query.inList[0].visitUserName}}
                           </div>
                           <div class="fangkeboxli">
                               <div class="fangkeboxliname">
                                    来访事由：
                               </div>
                               {{query.inList[0].reason}}
                           </div>
                   </div>
              </div>
              <div class="body-center-center-box small-box ">
                    <img class="topleft" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/topleft.png" alt="">
                    <img class="topright" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/topright.png" alt="">
                    <img class="bottomleft" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/bottomleft.png" alt="">
                    <img class="bottomright" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/bottomright.png" alt="">
                    <img class="bordertop"   src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/border.png" alt="">
                    <img class="borderbottom"   src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/border.png" alt="">
                    <div class="small-top">
                        <img src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/left.png" alt="">
                         &nbsp; &nbsp;一周访客趋势&nbsp; &nbsp;
                        <img src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/right.png" alt="">
                    </div>
                    <div id="centerecharts"></div>
              </div>
              <div class="body-center-bottom-box small-box ">
                    <img class="topleft" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/topleft.png" alt="">
                    <img class="topright" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/topright.png" alt="">
                    <img class="bottomleft" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/bottomleft.png" alt="">
                    <img class="bottomright" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/bottomright.png" alt="">
                    <img class="bordertop"   src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/border.png" alt="">
                    <img class="borderbottom"   src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/border.png" alt="">
                     <div class="small-top">
                        <img src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/left.png" alt="">
                         &nbsp; &nbsp;今日到访记录&nbsp; &nbsp;
                        <img src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/right.png" alt="">
                    </div>
                    
                    <div class="guandong">
                          <table>
                        <tr>
                          <th style="width:10%">姓名</th>
                          <th style="width:10%">预约时间</th>
                          <th style="width:10%">拜访人</th>
                          <th style="width:40%">事由</th>
                          <th style="width:10%">入校时间</th>
                          <th style="width:20%">同行人员</th>
                        </tr>
                        <tr v-for="(item,index) in query.inList" :key="index">
                          <td>{{item.name}}</td>
                          <td>{{item.visitTime.slice(10,16)}}</td>
                          <td>{{item.visitUserName}}</td>
                          <td>{{item.reason}}</td>
                          <td>{{item.intSchTime.substring(10, 19)}}</td>
                          <td>{{item.peerUser||'--'}}</td>
                        </tr>                     
                    </table>

                    </div>
              </div>
            </div>
        </div>       
    </div>
</template>

<script> 
    import { getVisitSchBoard} from "@/api/visitorReservation";
    import DefaultPage from "@/components/DefaultPage";
    export default {
        name: 'visitorDashboardindex',    
        data() {           
            return {
                query:{
                   dateList:[],
                   inList:[],
                   notInList:[]
                }
            }
        },
        components: { DefaultPage },
        mounted() {
            document.title = '访客数据看板';
            this.getVisitSchBoard() 
            setInterval(()=> {
                this.getVisitSchBoard() 
　　           }, 10000)             
        },
        methods: {
             getVisitSchBoard(){
                getVisitSchBoard()
                    .then(res => res.data)
                    .then(data => {
                    this.query = data.data;
                    let mudata={
                        listone:[],
                        listtwo:[],
                        listanme:[],
                    }
                    for(let  i=0;i<data.data.dateList.length;i++){
                        mudata.listanme.push(data.data.dateList[i].visitDate)
                        mudata.listone.push(data.data.dateList[i].userCount)
                        mudata.listtwo.push(Math.floor((data.data.dateList[i].intUserCount/data.data.dateList[i].userCount*100)||0))

                    }
                    this.centerechartsfun(mudata)
                    });
             },
            //统计图
            centerechartsfun(mydata){
                this.centerecharts=echarts.init(document.getElementById('centerecharts'));
                this.centerecharts.setOption({
                    title: {
                        text: ' ',
                        x: 'center'            
                    },
                    color: [ '#DCCA36','#ffffff'],//每个区域的颜色
                    grid: {
                        left: '4%',
                        right: '7%',
                        bottom: '10%',
                        containLabel: true
                    },
                     legend: {
                        data: ['访客人数', '到访率'],
                         textStyle:{
                                color:"#fff"
                            }
                    },
                    xAxis: [
                        {
                        type: 'category',
                        data: mydata.listanme,
                        axisPointer: {
                            type: 'shadow',
                             textStyle:{
                                color:"#fff"
                            }
                        },
                        axisLine: {
                            lineStyle:{
                                color:"#fff"
                            }
                        },     
                        }
                    ],
                    yAxis: [
                        {
                        type: 'value',
                        name: '访客人数',
                        min: 0,
                         interval: 10,
                        axisLabel: {
                            formatter: '{value}人'
                        },
                       
                         axisLabel: {
                            textStyle:{
                                color:"#fff"
                            },
                        },
                    axisLine: {
                        lineStyle:{
                                color:"#fff"
                        }
                        },
                        },
                        {
                        type: 'value',
                        name: '到访率',
                        min: 0,
                        max: 100,
                        interval: 20,
                        axisLabel: {
                            formatter: '{value} %',
                              textStyle:{
                                color:"#fff"
                            }
                        },
                    axisLine: {
                            lineStyle:{
                                color:"#fff"
                            }
                        },
                       
                        }
                    ],
                    series: [
                        {
                        name: '访客人数',
                        type: 'bar',
                        tooltip: {
                            valueFormatter: function (value) {
                            return value + '人';
                            }
                        },
                         barMaxWidth:60,
                        data: mydata.listone,
                         label: {
                            normal: {
                                show: true,
                                position: 'top',
                                color:"#fff"
                            }
                        }
                        },
                        {
                        name: '到访率',
                        type: 'line',
                        yAxisIndex: 1,
                        tooltip: {
                            valueFormatter: function (value) {
                            return value + ' %';
                            }
                        },
                        data: mydata.listtwo,
                         label: {
                            normal: {
                                show: true,
                                position: 'top',
                                color:"#fff"
                            }
                        }
                        }
                    ]
                })
            },
           
        }
    }
</script>

<style lang="scss" scoped>
   .visitorDashboardindex {
       width: 1920px;
       height: 1080px;
       background-image: url(https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/bg.png);
       background-position: center center;
       background-size: cover;
       *{
           box-sizing: border-box;
       }
       .fangkebox{
           color:#fff;
           padding: 60px 50px 0 50px;
           .fangkeboxtop{
               font-size: 32px;
               line-height: 60px;
            span{
                float: right;
                font-size: 20px;
                line-height: 60px;
            }
           }
           .fangkeboxli{
               padding: 10px 0;
               line-height: 30px;
               position: relative;
               padding-left: 100px;
               font-size: 20px;
               .fangkeboxliname{
                   position: absolute;
                   width: 100px;
                   text-align: right;
                   top:10px;
                   left: 0px;
                   line-height: 30px;
               }
           }
       }
       .guandong{
           height: 480px;
           overflow: auto;
       }
       .big-top{
            font-size: 45px;
            font-weight: bold;
            color: #fff;
            line-height: 90px;
            text-align: center;
            
       }
       .fangke{
           width: 33%;
           float: left;
           font-size: 30px;
           color:#fff;
           font-weight: 600;
           text-align: center;
           padding:50px 0px;
           line-height: 60px;
           margin: 0 auto;
           .fangkenum{
               border-radius: 50%;
                border-radius: 50%;
                height: 140px;
                width: 140px;
                line-height: 140px;
                font-size: 30px;
                margin: 20px auto;               
           }
       }
       .body{
            padding:20px 30px;
            overflow: hidden;
            .small-box{
                padding:12px;
                background: rgba(19, 22, 142,0.5);
                position: relative;
                border:1px rgba(28, 68, 117,0.5) solid;
                box-shadow: inset 20px 20px 34px rgba(17,115,247,0.2), inset -20px -20px 34px rgba(17,115,247,0.2);;
                .small-top{
                    font-size: 18px;
                    font-weight: bold;
                    color:#4FD9FC;
                    text-align: center;
                    img{
                        height: 16px;
                        top: 2px;
                        position: relative;
                    }
                }  
                .topleft{
                    position: absolute;
                    left: -2px;
                    top: -2px;
                    height: 20px;
                }  
                .topright{
                    position: absolute;
                    right: -2px;
                    top: -2px;
                    height: 20px;
                }         
                .bottomleft{
                    position: absolute;
                    left: -2px;
                    bottom: -2px;
                    height: 20px;
                }  
                 .bottomright{
                    position: absolute;
                    right: -2px;
                    bottom: -2px;
                    height: 20px;
                }
                .bordertop{
                    position: absolute;
                    left: 20%;
                    top: 0px;
                    width: 60%; height: 2px;
                }
                .borderbottom{
                    position: absolute;
                    left: 20%;
                    bottom: 0px;
                    width: 60%; height: 2px;
                }
            }
          
            table{
               border-collapse:collapse;
               width: 100%;
               margin-top: 15px;
               table, td, th{
                    border: 1px solid #1AD3EE;
                    text-align: center;
                    color: #4FD9FC;
                    font-size: 14px;
                    padding: 8.5px 0;
              }
               th{
                 background:rgba(0, 22, 75,0.2);
                 color: #fff;
              }
            }
            .body-left{
                width: 600px;
                float: left;
                .body-left-top-box{
                  height: 400px;                 
                  }
                .body-left-bottom-box{
                   height: 530px;
                   margin-top:20px;
                }
            }
            .body-center{
                width: 1240px;
                float: left;               
                margin-left: 20px;
                .body-center-top-box{
                    height: 400px;
                    float: left;
                    margin-right: 20px;
                    width: 420px;
                }
                .body-center-center-box{
                    height:400px;
                    float: left;
                    width: 800px;
                    #centerecharts{
                        height: 360px;
                        width: 800px;
                        margin: 0 auto;
                        color:#fff;
                    }
                }
                .body-center-bottom-box{
                    height: 530px;
                    float: left;
                    width: 1240px;
                    margin-top: 20px;                   
                }
            }
          
       }
      
    }
</style>
