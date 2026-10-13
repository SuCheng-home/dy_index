<template>
    <div class="chineseCharactersindex">
        <div class="content" :style="`height:${notbmaxH-60}px`">
            <div v-show="isshowhide">
                <div v-show="datalist.length>0" >
                    <div id="myechartsone"></div>
                </div>
                <default-page Mes="暂无数据" v-show="datalist.length==0" ></default-page>
            </div>
            <div v-show="!isshowhide">
                <div  v-if="!isshowhide" class="overflowbutton">
                    <el-button @click="isshowhidefun()" style="float:right">返回上层图表</el-button>
                </div>
                <div id="myechartstwo"></div>
            </div>
        </div>
    </div>
</template>
<script>
    import mixins from '@/mixins/windowResize';
    import DefaultPage from '@/components/DefaultPage';
    import {getCheckGradeCharBySchoolId,getCheckClassCharByGradeId} from '@/api/chineseCharacters';
    import echarts from 'echarts';
    export default {
        data(){
            return{
                myechartsone:null,
                myechartstwo:null,
                datalist:[],
                gradeId:'',
                isshowhide:true,
                gradename:'',
            }
        },
        mixins:[mixins],
        components: {DefaultPage},
        mounted(){           
            this.getCheckGradeCharBySchoolIds()
        }, 
        methods:{

            //获取年级详情
            getCheckGradeCharBySchoolIds(){
                let listname=[];
                let listone=[];
                let listtwo=[]
                getCheckGradeCharBySchoolId().then(res => res.data).then(data => {
                    this.datalist = data.data;
                    for(let i=0;i<data.data.length;i++) {
                       listname.push(data.data[i].gradeName);
                       listone.push(data.data[i].agvRightCount-0);
                       listtwo.push(data.data[i].postCodeAgvRightCount-0);
                    }; 
                     this.gradeIdfun(listname,listone,listtwo);                
                });               
            },
             //获取班级详情
            getCheckClassCharByGradeIds(){
                let mylistname=[];
                let mylistone=[];
                getCheckClassCharByGradeId(this.gradeId).then(res => res.data).then(data => {
                    for(let i=0;i<data.data.length;i++) {
                       mylistname.push(data.data[i].className);
                       mylistone.push(data.data[i].agvRightCount-0);
                    }; 
                     this.classIdfun(mylistname,mylistone);                
                });               
            },
            //年级统计
            gradeIdfun(listname,listone,listtwo){
                this.myechartsone = echarts.init( document.getElementById("myechartsone"));
                this.myechartsone.setOption({
                    title: {text: "识字量平均值",x: "center"},
                    grid: {left: "2%",right: "4%",bottom: "6%",containLabel: true},
                    color: ["#50E0BD",'#1893FB'], //每个区域的颜色
                    tooltip: {trigger: "item",formatter: "{a} <br/>{b}识字量 : {c}"},
                    legend: {data: ["全校平均","全区平均"],x: "center",y: "bottom"},
                    xAxis: {data:listname, name:'年级',},
                    yAxis : [{ name:'识字量',type : 'value'},],        
                    series: [
                        { barMaxWidth: 60,name:'全校平均',type:'bar',data:listone, label: { normal: { show: true,position: "top"}}},
                        { barMaxWidth: 60,name:'全区平均',type:'bar',data:listtwo, label: { normal: { show: true,position: "top"}}}
                        ]
                });
                let $this=this;
                this.myechartsone.on("click", params => {
                    if(params.seriesIndex==0){
                        $this.gradeId=$this.datalist[params.dataIndex].gradeId;
                        $this.gradename=$this.datalist[params.dataIndex].gradeName;
                        $this.isshowhide=false;
                        this.getCheckClassCharByGradeIds()
                    }
                    
                });
            },
            //班级统计
            classIdfun(mylistname,mylistone){
                this.myechartstwo = echarts.init( document.getElementById("myechartstwo"));
                this.myechartstwo.setOption({
                    title: {text: "识字量平均值",x: "center"},
                    grid: {left: "2%",right: "4%",bottom: "6%",containLabel: true},
                    color: ["#50E0BD"], //每个区域的颜色
                    tooltip: {trigger: "item",formatter: "{a} <br/>{b}识字量 : {c}"},
                    legend: {data: [this.gradename],x: "center",y: "bottom"},
                    xAxis: {data:mylistname, name:'班级',},
                    yAxis : [{ name:'识字量',type : 'value'},],        
                    series: [
                        { barMaxWidth: 60,name:this.gradename,type:'bar',data:mylistone, label: { normal: { show: true,position: "top"}}},
                        ]
                });               
            },
            //返回
            isshowhidefun(){
                this.isshowhide=true;
            }

        }
    }
</script>
<style lang="scss" scoped>
.chineseCharactersindex{
    padding:12px;
    *{        
        box-sizing: border-box;
    }    
    .content{
       overflow:auto;
       padding-top: 50px;
       #myechartsone{
            width:1000px;
            height: 500px;
            margin: 0 auto;
       }
       #myechartstwo{
            width:1000px;
            height: 500px;
            margin: 0 auto;
       }
       .overflowbutton{
            width:1130px;
            margin: 0 auto;
            overflow: hidden;
       }
    }
}
  
</style>


