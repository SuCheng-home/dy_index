<template>
  <div class="app-container calendar-list-container">
    <div class="header"></div>
    <div class="moduleUse" id="moduleUse"></div>
  </div>
</template>
<script>
import echarts from 'echarts';
import {statisticsTotalListPage} from '@/api/system';
export default{
  data(){
    return{
      moduleList:[],
      moduleUses:null
    }
  },
  created(){
    this.statisticsTotalListPageFunc();
  },
  mounted(){

  },
  methods:{
    moduleUseFunc(array){
      this.moduleUses = echarts.init(document.getElementById('moduleUse'));
      this.moduleUses.setOption({
        title: {
          text: '模块使用分析',
          x: 'center' 
        },
        tooltip : {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow',
                label: {
                    show: true
                }
            }
        },
        color: [
          "#7CB5EC"
        ],
        calculable : true,
        grid: {
            top: '12%',
            left: '3%',
            right: '6%',
            containLabel: true
        },
        xAxis: [
            {
                type : 'category',
                splitLine: {show:false},
                data : array.map(item=>{
                  return item.name
                })
            }
        ],
        yAxis: [
            {
                type : 'value'      
            }
        ],
        dataZoom: [
            {
                type:'slider',
                show: true,
                start: 0,
                end: 60
            }
        ],
        series : [
            {
                name: '创建数量',
                type: 'bar',
                label: {
                    normal: {
                        show: true,
                        position: 'top'
                    }
                },
                itemStyle:{
                  
                },
                data: array.map(item=>{
                  return item.y
                })
            }
        ]
      })
       this.moduleUses.on("click",this.insertDetail);
    //   let myChart=echarts.init(document.getElementById('moduleUse'))
    //  myChart.getZr().on('click', function(param) {
    //   // 获取 点击的 触发点像素坐标
    //   const pointInPixel = [param.offsetX, param.offsetY]
    //   // 判断给定的点是否在指定的坐标系或者系列上
    //   if (myChart.containPixel('grid', pointInPixel)) {
    //     // 获取到点击的 x轴 下标  转换为逻辑坐标
    //     let xIndex = myChart.convertFromPixel({ seriesIndex: 0 },pointInPixel)[0]
    //     // 做一些其他事情
    //     console.log(xIndex)
    //   }
    // })
    },
    insertDetail(params){
      let moduleCode=this.moduleList[params.dataIndex].moduleId;
      let modulename=this.moduleList[params.dataIndex].name;
      if(moduleCode){
        this.$router.push({
            path: 'moduleDetail',
            query: {moduleCode: moduleCode,modulename:modulename}
        });
      }
    },
    statisticsTotalListPageFunc(){
      statisticsTotalListPage().then(res=>res.data)
      .then(data=>{
        if(data.code===200){
          this.moduleList=data.data;
          this.moduleUseFunc(this.moduleList);
        }
      })
    }
  } 
}
</script>
<style lang="scss" scoped>
.header{
  height:58px;
}
.moduleUse{
  width:100%;
  height:460px;
  margin-top:20px;
}
</style>