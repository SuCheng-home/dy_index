<template>
    <div class="databoardstu">
        <div class="big-top">学 生 数 据 看 板</div>
        <div class="body">
             <div class="body-top">
                <div class="botton" @click="$router.back()">返回</div>
                <div class="name">
                     <img :src="topmyobj.avatar" alt="">&nbsp;&nbsp;
                     {{topmyobj.name}}&nbsp;&nbsp; <span>
                     {{topmyobj.gradeName}}&nbsp;&nbsp;
                     {{topmyobj.className}} &nbsp;&nbsp;   
                        </span></div>
             </div>
            <div class="body-left">
                <div class="body-left-bottom-box small-box">
                    <img class="topleft" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/topleft.png" alt="">
                    <img class="topright" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/topright.png" alt="">
                    <img class="bottomleft" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/bottomleft.png" alt="">
                    <img class="bottomright" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/bottomright.png" alt="">
                    <img class="bordertop" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/border.png" alt="">
                    <img class="borderbottom" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/border.png" alt="">
                    <div class="body-box-name">
                        被评价总次数<span>{{behCount}}</span>次
                    </div> 
                </div>
                <div class="body-left-top-box small-box">
                    <img class="topleft" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/topleft.png" alt="">
                    <img class="topright" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/topright.png" alt="">
                    <img class="bottomleft" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/bottomleft.png" alt="">
                    <img class="bottomright" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/bottomright.png" alt="">
                    <img class="bordertop" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/border.png" alt="">
                    <img class="borderbottom" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/border.png" alt="">
                    <div class="small-top">
                        <img src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/left.png" alt="">
                         &nbsp; &nbsp;维度统计&nbsp; &nbsp;
                        <img src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/right.png" alt="">
                    </div>
                    <div class="ulbox">
                         <div class="libox">
                            <img src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/one.png" alt="">
                            <span class="liboxname">会听</span>
                            <span class="liboxbutton">{{onenumobj.one}}</span>
                            次
                        </div>
                        <div class="libox">
                            <img src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/two.png" alt="">
                            <span class="liboxname">会说</span>
                            <span class="liboxbutton">{{onenumobj.two}}</span>
                            次
                        </div>
                        <div class="libox">
                            <img src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/three.png" alt="">
                            <span class="liboxname">会想</span>
                            <span class="liboxbutton">{{onenumobj.three}}</span>
                            次
                        </div>
                        <div class="libox">
                            <img src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/four.png" alt="">
                            <span class="liboxname">会做</span>
                           <span class="liboxbutton">{{onenumobj.four}}</span>
                            次
                        </div>
                    </div>
                </div>                 
            </div>           
            <div class="body-right">
                <div class="body-right-top-box small-box">
                    <img class="topleft" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/topleft.png" alt="">
                    <img class="topright" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/topright.png" alt="">
                    <img class="bottomleft" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/bottomleft.png" alt="">
                    <img class="bottomright" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/bottomright.png" alt="">
                    <img class="bordertop"   src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/border.png" alt="">
                    <img class="borderbottom"    src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/border.png" alt="">
                    <div class="small-top">
                        <img src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/left.png" alt="">
                         &nbsp; &nbsp;学科评价次数柱状图&nbsp; &nbsp;
                        <img src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/right.png" alt="">
                    </div>   
                    <div id="centerechartsone"></div>       
                </div>
            </div>   
            <div class="body-bottom ">
                <div class="body-bottom-left small-box">
                    <img class="topleft" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/topleft.png" alt="">
                    <img class="topright" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/topright.png" alt="">
                    <img class="bottomleft" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/bottomleft.png" alt="">
                    <img class="bottomright" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/bottomright.png" alt="">
                    <img class="bordertop" style="width:30%;left: 35%;" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/border.png" alt="">
                    <img class="borderbottom" style="width:30%;left: 35%;" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/border.png" alt="">
                    <div class="small-top">
                        <img src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/left.png" alt="">
                         &nbsp; &nbsp;学期班级位置曲线图&nbsp; &nbsp;
                        <img src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/right.png" alt="">
                    </div>   
                    <div id="centerechartstwo"></div>
                </div>    
                <div class="body-bottom-right small-box">
                    <img class="topleft" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/topleft.png" alt="">
                    <img class="topright" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/topright.png" alt="">
                    <img class="bottomleft" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/bottomleft.png" alt="">
                    <img class="bottomright" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/bottomright.png" alt="">
                    <img class="bordertop" style="width:30%;left: 35%;" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/border.png" alt="">
                    <img class="borderbottom" style="width:30%;left: 35%;" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/border.png" alt="">
                    <div class="small-top">
                        <img src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/left.png" alt="">
                         &nbsp; &nbsp;学期总评&nbsp; &nbsp;
                        <img src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/right.png" alt="">
                    </div>   
                    <div id="centerechartsthree"></div>
                    <div class="body-bottom-right-top">
                        <div class="botton-box">
                            <div class="botton" @click="getStuCurrListStatics(item.schoolTimeId)" :class="{'color':schoolTimeId==item.schoolTimeId}" v-for="(item,index) in schoolTimelist" :key="index">
                                {{xqlist[index]}}
                            </div>
                           
                        </div>                       
                        <div class="body-bottom-right-top-name">
                           {{commonLeaveTitle}}
                        </div>
                    </div>
                </div>              
            </div>        
        </div> 
            
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    import {getTypeListStatic,getBehEvalRecordStatic,getCurrListStatic,getStuTimeListStatic,getStuCurrListStatic,info} from '@/api/databoard';
    export default {
        name: 'databoardstu',    
        data() {           
            return {
                centerechartstwo:null,  
                centerechartsone:null,
                centerechartsthree:null,
                onenumobj:{
                    one:0,
                    two:0,
                    three:0,
                    four:0
                },
                gradeId:this.$route.query.gradeId,
                classId:this.$route.query.classId,
                studentId:this.$route.query.studentId,
                behCount:"0",
                xqlist:['一（上）','一（下）','二（上）','二（下）','三（上）','三（下）','四（上）','四（下）','五（上）','五（下）','六（上）','六（下）'],
                schoolTimelist:[],
                schoolTimeId:"",
                commonLeaveTitle:"",
                topmyobj:{}
            }
        },
        mounted() {
            document.title = '学生数据看板';
            this.getTypeListStatics();
            this.getBehEvalRecordStatics();
            this.getCurrListStatics();
            this.getStuTimeListStatics(); 
            this.infos();           
        },
        computed: {
            ...mapGetters(['schoolInfo'])
        },
        methods: {
            //学生信息
            infos(){
                info(this.studentId)
                .then(res => res.data)
                .then(data => {
                    let mydata=data.data;
                    this.topmyobj=mydata[0];
                });
            },
            //学期总评   
            getStuCurrListStatics(schoolTimeId){
                this.schoolTimeId=schoolTimeId;
               getStuCurrListStatic({classId:this.classId,gradeId:this.gradeId,schoolId:this.schoolInfo.id,studentId:this.studentId,schoolTimeId:this.schoolTimeId})
                .then(res => res.data)
                .then(data => {
                    let mydata=data.data;
                    this.commonLeaveTitle=mydata.commonLeaveTitle;
                    let obj={
                       namelist:[],
                       numlist:[],
                       num:0
                    };
                    for(let i=0;i<mydata.currList.length;i++){
                       if(obj.num<(mydata.currList[i].rank-0)){
                          obj.num=mydata.currList[i].rank-0
                       }
                   }
                    for(let i=0;i<mydata.currList.length;i++){
                       obj.namelist.push({
                           max:obj.num,
                           name:mydata.currList[i].curriculumName
                       });
                       obj.numlist.push(mydata.currList[i].rank);
                   }   
                    this.centerechartsthreefun(obj);                
                });
                // let obj={
                //        namelist: [{name:'英语',max:18}, {name:'数学',max:18},{name:'语文',max:18}, {name:'政治',max:18}, {name:'历史',max:18}, {name:'历史',max:18}, {name:'历史',max:18}, {name:'化学',max:18},{name:'英语',max:18}, {name:'数学',max:18},{name:'语文',max:18}, {name:'政治',max:18}, {name:'历史',max:18}, {name:'化学',max:18}],
                //        numlist:[10,12,8,9,18,13,14,8,9,18,13,14,8,9],
                //        num:18
                //     };
                    // this.centerechartsthreefun(obj);

            },
            //学期排名
            getStuTimeListStatics(){
                getStuTimeListStatic({classId:this.classId,gradeId:this.gradeId,schoolId:this.schoolInfo.id,studentId:this.studentId,curriculumId:0})
                .then(res => res.data)
                .then(data => {
                    let mydata=data.data;
                    this.schoolTimelist=mydata;
                    let obj={
                       namelist:[],
                       numlist:[]
                    };
                    for(let i=0;i<mydata.length;i++){
                       obj.namelist.push(this.xqlist[i]);
                       obj.numlist.push(mydata[i].rank-0);
                   }
                   this.getStuCurrListStatics(mydata[0].schoolTimeId);
                   this.centerechartstwofun(obj);
                });

            },
             //科目排名
            getCurrListStatics(){
                getCurrListStatic({classId:this.classId,gradeId:this.gradeId,schoolId:this.schoolInfo.id,studentId:this.studentId})
                .then(res => res.data)
                .then(data => {
                    let mydata=data.data;
                    let obj={
                       namelist:[],
                       numlist:[]
                    };
                    for(let i=0;i<mydata.length;i++){
                       obj.namelist.push(mydata[i].curriculumName);
                       obj.numlist.push(mydata[i].behCount);
                   }
                   this.centerechartsonefun(obj);
                });
            },
              //基础数据
            getBehEvalRecordStatics(){
                getBehEvalRecordStatic({classId:this.classId,gradeId:this.gradeId,schoolId:this.schoolInfo.id,studentId:this.studentId})
                .then(res => res.data)
                .then(data => {
                    this.behCount= data.data.behCount;
                });
            },
             //听说想看
            getTypeListStatics(){
                getTypeListStatic({classId:this.classId,gradeId:this.gradeId,schoolId:this.schoolInfo.id,studentId:this.studentId})
                .then(res => res.data)
                .then(data => {
                    let mydata = data.data;
                    for(let i=0;i<mydata.length;i++){
                       if(mydata[i].behTypeName){
                            if(mydata[i].behTypeName=='听'){
                            this.onenumobj.one=mydata[i].behCount;
                            }
                            if(mydata[i].behTypeName=='说'){
                                this.onenumobj.two=mydata[i].behCount;
                            }
                            if(mydata[i].behTypeName=='想'){
                                this.onenumobj.three=mydata[i].behCount;
                            }
                            if(mydata[i].behTypeName=='做'){
                                this.onenumobj.four=mydata[i].behCount;
                            }
                        }         
                    }
                });
            },
            centerechartsonefun(mydata){
                this.centerechartsone=echarts.init(document.getElementById('centerechartsone'));
                this.centerechartsone.setOption({
                    title: {
                        text: ' ',
                        x: 'center'            
                    },
                    color: [ '#DCCA36'],//每个区域的颜色
                    grid: {
                        left: '4%',
                        right: '7%',
                        bottom: '10%',
                        containLabel: true
                    },
                    xAxis: {
                        name: '学科',
                        data:mydata.namelist,
                        axisLabel: {
                            textStyle:{
                                color:"#fff"
                            }
                        },
                        axisLine: {
                            lineStyle:{
                                color:"#fff"
                            }
                        },                    
                    },
                    tooltip: {
                        formatter: function (params) {
                                return params.name + '<br/>'+"共评价了"+params.value+'次' ;
                        }
                    },
                    yAxis: {
                    name: '次数',
                    axisLabel: {
                            formatter: "{value}",
                            textStyle:{
                                color:"#fff"
                            }
                        },
                    axisLine: {
                            lineStyle:{
                                color:"#fff"
                            }
                        },
                        splitLine: {
                            show: true,
                            lineStyle:{
                                color: ['#fff'],
                                width: 0.5,
                                type: 'dotted'
                            }
                        }
                    },
                    series: [{
                        name: '次数',
                        type: 'bar',
                        data: mydata.numlist,
                        barMaxWidth:15,
                        label: {
                            normal: {
                                show: true,
                                position: 'top',
                                color:"#fff"
                            }
                        }
                    }]
                })
            },
            centerechartstwofun(mydata){
                this.centerechartstwo=echarts.init(document.getElementById('centerechartstwo'));
                this.centerechartstwo.setOption({
                    title: {
                        text: ' ',
                        x: 'center'            
                    },
                    color: [ '#DCCA36'],//每个区域的颜色
                    grid: {
                        left: '4%',
                        right: '7%',
                        bottom: '10%',
                        containLabel: true
                    },
                    xAxis: {
                        name: '学期',
                        nameTextStyle:{ fontSize: 12, color:'#fff', padding: [0, 0, -20, 0] },
                        data:mydata.namelist,                        
                        axisLabel: {
                            textStyle:{
                                color:"#fff"
                            }
                        },
                        axisLine: {
                            lineStyle:{
                                color:"#fff",                                
                            }                            
                        },              
                    },
                    // tooltip: {
                    //     formatter: function (params) {
                    //         return params.name+'学期' + '<br/>'+"班级排名 "+params.value ;
                    //     }
                    // },
                    yAxis: {
                    name: '班级排名',                      
                    nameTextStyle:{ fontSize: 12, color:'#fff', padding: [-200, 0, 0, -20] },
                  
                    axisLabel: {
                        show: false,
                                formatter: "{value}",
                                textStyle:{
                                    color:"#fff"
                                }
                            },
                        axisLine: {
                             
                                lineStyle:{
                                    color:"#fff"
                                }
                            },
                        splitLine: {
                                show: true,
                                lineStyle:{
                                    color: ['#fff'],
                                    width: 0.5,
                                    type: 'dotted'
                                }
                        },
                        inverse:true
                    },
                    series: [{
                        name: '班级排名',
                        type: 'line',
                        data: mydata.numlist,
                        smooth: true,
                        symbolSize: 12, //拐点大小   
                        symbol:"circle" ,                                             
                        itemStyle : {
                          normal : {
                           color:'#3FFFEA', //改变折线点的颜色
                           lineStyle:{
                            color:'#DCCA36' //改变折线颜色
                           }
                          }                           
                        },
                        label: {
                            normal: {
                                show: false,
                                position: 'top',
                                color:"#fff"
                            }
                        }
                    }]
                })
            },
            centerechartsthreefun(mydata){
                this.centerechartsthree=echarts.init(document.getElementById('centerechartsthree'));
                this.centerechartsthree.setOption({
                    title: {
                            text: '',
                        },
                        tooltip: {},
                        legend: {
                            data: ["学科"],
                            top: '20%;'
                        },
                        grid: {
                            top: '20%',
                            left: '2%',
                            right: '2%',
                            bottom: '5%',
                            containLabel: true
                        },
                    color:['#DCCA36'],
                        radar: {
                            radius: 80,
                            name: {
                                textStyle: {
                                    color: '#4CF9FF'
                                }
                            },
                            indicator: mydata.namelist
                        },
                        series: [{
                            name: '排名',
                            type: 'radar',
                            symbolSize: 8, //拐点大小   
                            symbol:"circle" ,                    
                            itemStyle : {
                            normal : {
                            color:'#3FFFEA', //改变折线点的颜色
                            lineStyle:{
                                color:'#DCCA36' //改变折线颜色
                            }
                            }                           
                            },
                            inverse:true,
                            label: {
                            normal: {
                                show: true,
                                position: 'top',
                            }
                           },
                            data : [
                                {
                                    value : mydata.numlist,
                                    name : '排名'
                                }
                            ]
                        }]
                })

            }
        }
    }
</script>

<style lang="scss" scoped>
   .databoardstu {
       width: 1920px;
       height: 1080px;
       background-image: url(https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/bg.png);
       background-position: center center;
       background-size: cover;
       *{
           box-sizing: border-box;
       }
       .big-top{
            font-size: 45px;
            font-weight: bold;
            color: #fff;
            line-height: 90px;
            text-align: center;
            
       }
       .body{
            padding:20px 100px;
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
            .body-top{
                overflow: hidden;
                padding-bottom: 20px;
                .botton{
                    width: 80px;
                    height: 40px;
                    line-height: 38px;
                    text-align: center;
                    color:#fff;
                    border:rgba(144, 243, 255,0.3) 1px solid;
                    background-image: linear-gradient(rgba(43, 143, 255,0.3), rgba(57, 248, 254,0.3));
                    border-radius: 2px;
                    cursor:pointer;
                    float: left;
                }
                .name{
                    float: left;
                   width: 1640px;
                   text-align: center;
                   color: #fff;
                   font-size: 28px;
                   img{
                        height: 40px;
                        position: relative;
                        top: 10px;
                        width: 40px;
                        border-radius: 50%;
                   }
                   span{
                       font-size: 22px;
                   }
                }
            }            
            .body-box-name{
                        height: 60px;
                        background: #0339AF;
                        border-radius: 2px;
                        color: #fff;
                        line-height:60px;
                        font-size: 24px;
                         text-align: center;
                        span{
                            color:#DCCA36;
                            padding: 0 5px;
                            font-size: 28px;
                        }
                    }
            .body-left{
                width: 460px;
                float: left;
                .body-left-top-box{
                  height: 360px;
                  .ulbox{
                      padding-top: 30px;
                    .libox{
                        font-size: 14px;
                        line-height: 60px;
                        color: #fff;
                        padding: 0 0 5px 55px;
                        img{
                            float: left;
                            height: 60px;
                        }
                        .liboxname{
                            font-size: 18px;
                            line-height: 60px;
                            font-weight: bold;
                            padding: 0 30px;
                        }
                        .liboxbutton{
                            height: 22px;
                            font-size: 18px;
                            font-weight: bold;
                            background: linear-gradient(0deg, #2DBCDD 0%, #09809C 74%, #2DBCDD 98%);
                            box-shadow: 0px 2px 6px 0px #7C9EEB;
                            border-radius: 2px;
                            padding: 0 5px;
                            margin-right: 10px;
                            width: 100px;
                        }

                    }

                  }
                  
                }
                .body-left-bottom-box{
                   height: 140px;
                   margin-bottom:40px;
                   padding: 40px 20px;
                }
            }           
            .body-right{
                width: 1220px;
                float: right;
                .body-right-top-box{
                    height: 540px;
                    #centerechartsone{
                        height: 480px;
                        width: 1200px;
                    }
                }
            }
            .body-bottom{
                height: 300px;
                width: 100%;
                float: left;
                margin-top: 40px;
               .body-bottom-left{
                   width: 840px;
                   height: 300px;
                   float: left;
                   #centerechartstwo{
                       width: 840px;
                       height: 250px;
                   }
               }
               .body-bottom-right{
                   width: 840px;
                   height: 300px;
                   float: right;
                   #centerechartsthree{
                       width: 300px;
                       height: 250px;
                       float: left;
                   }
                    .body-bottom-right-top{
                        overflow: hidden;
                        width: 500px;
                        height: 300px;
                        padding: 20px;
                        .botton-box{
                            overflow: hidden;
                        }
                        .botton{
                            width: 66px;
                            height: 32px;
                            margin: 5px;
                            line-height: 30px;
                            text-align: center;
                            color:#fff;
                            border:rgba(144, 243, 255,0.3) 1px solid;
                            background-image: linear-gradient(rgba(43, 143, 255,0.3), rgba(57, 248, 254,0.3));
                            border-radius: 2px;
                            cursor:pointer;
                            float: left;
                            font-size: 13px;
                        }
                       .color{
                            background: linear-gradient(0deg, #2DBCDD 0%, #09809C 74%, #2DBCDD 98%);
                            border: 1px solid #90F3FF;
                            box-shadow: 0px 2px 6px 0px #7C9EEB;
                       }
                       .body-bottom-right-top-name{
                            font-size: 18px;
                            font-family: Microsoft YaHei;
                            font-weight: 400;
                            color: #FFFFFF;
                            text-indent: 36px;
                            line-height: 36px;
                            padding: 10px 0;
                       }
            }
               }
            }
       }
      
    }
</style>
