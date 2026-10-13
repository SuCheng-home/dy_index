<template>
    <div class="databoardgrade">
        <div class="big-top">年 级 数 据 看 板</div>
        <div class="body">
             <div class="body-top">
                <div class="botton" @click="$router.back()">返回</div>
             </div>
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
                 <div class="body-left-bottom-box small-box">
                    <img class="topleft" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/topleft.png" alt="">
                    <img class="topright" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/topright.png" alt="">
                    <img class="bottomleft" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/bottomleft.png" alt="">
                    <img class="bottomright" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/bottomright.png" alt="">
                    <img class="bordertop" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/border.png" alt="">
                    <img class="borderbottom" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/border.png" alt="">
                    <div class="small-top">
                        <img src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/left.png" alt="">
                         &nbsp; &nbsp;班级评价统计&nbsp; &nbsp;
                        <img src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/right.png" alt="">
                    </div>
                    <div class="table-box">
                        <table>
                            <tr>
                            <th style="width:50%">班 级</th>
                            <th style="width:50%">评价次数</th>
                            </tr>
                            <tr v-for="(item,index) in twolist" :key="index">
                            <td><span class="link" @click="databoardalss(item.classId)">{{item.className}}</span></td>
                            <td>{{item.behCount}} 次</td>
                            </tr>                    
                        </table>
                    </div>
                </div>
            </div>
            <div class="body-center">
                <div class="body-center-button">
                    <div class="botton" v-if="index<6" @click="bigfun(item.id)" :class="{'color':gradeId==item.id}" v-for="(item,index) in gradeslist" :key="index" >{{item.name}}</div>
                </div>
              <div class="body-center-top-box small-box ">
                    <img class="topleft" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/topleft.png" alt="">
                    <img class="topright" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/topright.png" alt="">
                    <img class="bottomleft" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/bottomleft.png" alt="">
                    <img class="bottomright" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/bottomright.png" alt="">
                    <img class="bordertop"    src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/border.png" alt="">
                    <img class="borderbottom"   src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/border.png" alt="">
                    <div class="small-top">
                        <img src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/left.png" alt="">
                         &nbsp; &nbsp;基础数据&nbsp; &nbsp;
                        <img src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/right.png" alt="">
                    </div>
                    <div class="body-center-top-four">
                       <div class="body-center-top-four-box">
                          <div><span class="liboxbutton">{{threenumobj.stuCount}}</span>人</div>
                          <div class="body-center-top-four-box-name">年级学生</div>
                        </div>
                        <div class="body-center-top-four-box">
                          <div><span class="liboxbutton">{{threenumobj.behPeopleSt}}</span>人</div>
                          <div class="body-center-top-four-box-name">评价学生</div>
                        </div>
                        <div class="body-center-top-four-box">
                          <div><span class="liboxbutton">{{Math.ceil((threenumobj.behPeopleSt/threenumobj.stuCount)*10000)/100}}</span>%</div>
                          <div class="body-center-top-four-box-name">评价比例</div>
                        </div>
                        <div class="body-center-top-four-box">
                          <div><span class="liboxbutton">{{threenumobj.behCount}}</span>次</div>
                          <div class="body-center-top-four-box-name">平台总体评价</div>
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
                         &nbsp; &nbsp;学年年级评价次数柱状图&nbsp; &nbsp;
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
                    <div class="body-center-bottom-box-name">
                       平均每位学生每学期达<span>{{Math.ceil(threenumobj.behCount/(threenumobj.behPeopleSt*threenumobj.schTimeCount))}}</span>次
                    </div>
                    <div class="body-center-bottom-box-name">
                       平均每位老师每学期送出评价<span>{{Math.ceil(threenumobj.behCount/(threenumobj.behPeopleTh*threenumobj.schTimeCount))}}</span>次
                    </div>
              </div>
            </div>
            <div class="body-right">
                <div class="body-right-top-box small-box">
                    <img class="topleft" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/topleft.png" alt="">
                    <img class="topright" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/topright.png" alt="">
                    <img class="bottomleft" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/bottomleft.png" alt="">
                    <img class="bottomright" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/bottomright.png" alt="">
                    <img class="bordertop" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/border.png" alt="">
                    <img class="borderbottom" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/border.png" alt="">
                    <div class="small-top">
                        <img src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/left.png" alt="">
                         &nbsp; &nbsp;学科统计&nbsp; &nbsp;
                        <img src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/right.png" alt="">
                    </div>   
                    <div class="width-ul">
                       <div class="width-li"  v-for="(item,index) in fourlist" :key="index"  v-if="item.curriculumName">
                            <span class="width-li-name">{{item.curriculumName}}</span>
                            <div class="width-li-big">
                                <div class="width-li-color" :style="'width:'+((item.behCount/numwidth)*100)+'%'"></div>
                            </div>
                            <span class="width-li-num">{{item.behCount}} 次</span>
                        </div>                   
                    </div>               
                </div>
                 <div class="body-right-bottom-box small-box">
                    <img class="topleft" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/topleft.png" alt="">
                    <img class="topright" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/topright.png" alt="">
                    <img class="bottomleft" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/bottomleft.png" alt="">
                    <img class="bottomright" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/bottomright.png" alt="">
                    <img class="bordertop" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/border.png" alt="">
                    <img class="borderbottom" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/border.png" alt="">
                    <div class="small-top">
                        <img src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/left.png" alt="">
                         &nbsp; &nbsp;班级评价教师统计&nbsp; &nbsp;
                        <img src="https://cdnfile-10043692.file.myqcloud.com/admin/images/databoard/right.png" alt="">
                    </div>
                    <div class="table-box">
                         <table>
                        <tr>
                          <th style="width:50%">班 级</th>
                          <th style="width:50%">评价教师数</th>
                        </tr>
                        <tr v-for="(item,index) in twolist" :key="index">
                            <td>{{item.className}}</td>
                            <td>{{item.behPeopleTh}} 人</td>
                        </tr>                         
                       </table>
                    </div>                  
                </div>
            </div>
        </div>       
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    import {getSchoolGrade,getTypeListStatic,getBehEvalRecordStatic,getSchoolYearListStatic,getCurrListStatic,getClassListStatic} from '@/api/databoard';
    export default {
        name: 'databoardgrade',    
        data() {           
            return {
                numwidth:0,
                centerecharts:null,    
                onenumobj:{
                    one:0,
                    two:0,
                    three:0,
                    four:0
                },
                twolist:[],
                threenumobj:{
                    behCount: 0,
                    behPeopleSt: 0,
                    behPeopleTh: 0,
                    earlyDate: "",
                    moreBehCount: 0,
                    moreDate: "",
                    schTimeCount: 0,
                    stuCount: 0
                },
                fourlist:[],
                gradeslist:[],
                gradeId:""        
            }
        },
        filters:{
            numfun(num){
                let mynum=num?((num-0)>10000?((num/10000).toFixed(2)+'W'):num):'----'
                 return mynum;
            },
        },   
        mounted() {
            document.title = '年级数据看板';
            // 获取年级列表
            getSchoolGrade()
                .then(res => res.data)
                .then(res => {
                if (res.code === 200) {
                    let data = res.data.slice(0,6).reverse();
                    this.gradeslist =data;   
                    this.gradeId=data[0].id;    
                    this.bigfun(data[0].id)             
                } else {
                    this.$message.error(res.msg);
                }
                })
                .catch(err => {
                this.$message.error(res.msg);
                })
           
        },
        computed: {
            ...mapGetters(['schoolInfo'])
        },
        methods: {
            bigfun(id){
                this.gradeId=id;
                this.getTypeListStatics();
                this.getClassListStatics();
                this.getBehEvalRecordStatics();
                this.getSchoolYearListStatics();
                this.getCurrListStatics();   
            },
            //科目排名
            getCurrListStatics(){
                getCurrListStatic({classId:0,gradeId:this.gradeId,schoolId:this.schoolInfo.id,studentId:0})
                .then(res => res.data)
                .then(data => {
                   let mydata=data.data;
                   for(let i=0;i<mydata.length;i++){
                     if(this.numwidth<mydata[i].behCount){
                         this.numwidth=mydata[i].behCount
                     }
                   }
                   this.fourlist=mydata;
                });
            },
            //柱状图
            getSchoolYearListStatics(){
                 getSchoolYearListStatic({classId:0,gradeId:this.gradeId,schoolId:this.schoolInfo.id,studentId:0})
                .then(res => res.data)
                .then(data => {
                   let mydata=data.data;
                   let obj={
                       datelist:[],
                       numlist:[]
                   };
                   for(let i=0;i<mydata.length;i++){
                       obj.datelist.push(mydata[i].schoolYear);
                    //    obj.numlist.push(mydata[i].behCount);
                       obj.numlist.push(Math.ceil(mydata[i].behCount/1000))
                   }
                   this.centerechartsfun(obj);
                });
            },
            //基础数据
            getBehEvalRecordStatics(){
                getBehEvalRecordStatic({classId:0,gradeId:this.gradeId,schoolId:this.schoolInfo.id,studentId:0})
                .then(res => res.data)
                .then(data => {
                    this.threenumobj= data.data;
                });
            },
            //班级数据
            getClassListStatics(){
                getClassListStatic({gradeId:this.gradeId,schoolId:this.schoolInfo.id})
                .then(res => res.data)
                .then(data => {
                    this.twolist= data.data;
                });
            },
            //听说想看
            getTypeListStatics(){
                getTypeListStatic({classId:0,gradeId:this.gradeId,schoolId:this.schoolInfo.id,studentId:0})
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
            //统计图
            centerechartsfun(mydata){
                this.centerecharts=echarts.init(document.getElementById('centerecharts'));
                this.centerecharts.setOption({
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
                        name: '学年',
                        data: mydata.datelist,
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
                                return params.name+'学年' + '<br/>'+"共评价了"+params.value+'K次' ;
                        }
                    },
                    yAxis: {
                    name: '次数',
                    axisLabel: {
                            formatter: "{value}K",
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
                        data:mydata.numlist,
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
            databoardalss(classId){
                this.$router.push({
                    path: "databoardalss",
                    query:{
                        classId:classId,
                        gradeId:this.gradeId
                    }
                });
            }
        }
    }
</script>

<style lang="scss" scoped>
   .databoardgrade {
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
              .link{
                  color:#DCCA36;
                  cursor:pointer;
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
                   height: 450px;
                   margin-top:40px;
                    .table-box{
                         height: 400px;
                         overflow: auto;
                     }
                }
            }
            .body-center{
                width: 720px;
                float: left;               
                margin-left: 40px;
                .body-center-button{
                     overflow: hidden;
                      padding-bottom: 20px;
                     .botton{
                        width: 100px;
                        margin: 0 10px;
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
                    .color{
                        background: linear-gradient(0deg, #2DBCDD 0%, #09809C 74%, #2DBCDD 98%);
                        border: 1px solid #90F3FF;
                        box-shadow: 0px 2px 6px 0px #7C9EEB;
                    }
                }
                .body-center-top-box{
                    height: 190px;
                    .body-center-top-four{
                        overflow: hidden;
                        .body-center-top-four-box{
                            float: left;
                            width: 25%;
                            height: 150px;
                            color: #fff;
                            text-align: center;
                            padding: 30px 0;
                            .liboxbutton{
                                height: 22px;
                                font-size: 18px;
                                font-weight: bold;
                                background: linear-gradient(0deg, #2DBCDD 0%, #09809C 74%, #2DBCDD 98%);
                                box-shadow: 0px 2px 6px 0px #7C9EEB;
                                border-radius: 2px;
                                padding: 0 8px;
                                margin-right: 5px;
                            }
                            .body-center-top-four-box-name{
                                font-size: 16px;
                                padding-top: 25px;
                            }
                        }
                    }                    
                }
                .body-center-center-box{
                    height: 370px;
                    margin: 40px 0;
                    #centerecharts{
                        height: 320px;
                        width: 600px;
                        margin: 0 auto;
                        color:#fff;
                    }
                }
                .body-center-bottom-box{
                    height: 150px;
                    padding:30px 40px;
                    .body-center-bottom-box-name{
                        height: 40px;
                        background: #0339AF;
                        border-radius: 2px;
                        color: #fff;
                        line-height: 40px;
                        font-size: 18px;
                        margin-bottom: 10px;
                        text-align: center;
                        span{
                            color:#DCCA36;
                            padding: 0 5px;
                        }
                    }
                }
            }
            .body-right{
                width: 460px;
                float: right;
                .body-right-top-box{
                    height: 360px;
                    .width-ul{
                        margin-top: 15px;
                        height: 300px;
                        overflow: auto;
                        .width-li{
                            padding: 5px 0;
                            height: 30px;
                            color:#fff;
                            font-size: 12px;
                            line-height: 20px;
                            .width-li-name{
                                float: left;
                                width: 80px;
                                text-align: right;
                                overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
                            }
                            .width-li-num{
                                float: right;
                                width: 78px;
                                font-size: 13px;
                                text-align: left;
                            }
                            .width-li-big{
                                width: 240px;
                                margin: 2.5px 5px;
                                height: 15px;
                                border-radius: 10px;
                                background: #0339AF;
                                float: left;
                                .width-li-color{
                                    background: #DCCA36;
                                    border-radius: 10px;
                                    height: 15px;
                                }
                            }
                        }
                            
                    }
                }
                .body-right-bottom-box{
                     height: 450px;
                     margin-top:40px;
                     .table-box{
                         height: 400px;
                         overflow: auto;
                     }
                }
            }
       }
      
    }
</style>
