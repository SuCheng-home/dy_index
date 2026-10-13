<template>
<div class="foodbankdetails"  >
    <div class="top"> 
        <el-button @click="$router.back()" type="default" size="medium">返回</el-button>      
    </div>
    <div class="subject" :style="`height: ${nobottommaxH}px;`">
        <div class="body">
            <div class="box">
            <div class="nav"><span>菜品介绍和营养</span></div> 
            <div class="box-box">
              <div class="box-box-left">
                  <el-form  label-width="80px">
                    <el-form-item label="名称">{{name}}</el-form-item>
                    <el-form-item label="图片"> <image-previewer tag="richtext"><img class="picimg" :src="pic" alt=""></image-previewer></el-form-item>
                    <el-form-item label="类型">{{typeName}}</el-form-item>
                    <el-form-item label="烹饪方式">{{methodName}}</el-form-item>
                    <el-form-item label="备注" v-if="remark">{{remark}}</el-form-item>                    
                  </el-form>
              </div>
              <div class="box-box-right">
                <div class="h3">营养成分(100g)</div>
                 <div class="ul">
                   <div class="li"><span>热量(k):</span>{{foodElement.energy}}</div>
                   <div class="li"><span>碳水化合物(g):</span>{{foodElement.carbohydrate}}</div>
                   <div class="li"><span>脂肪(g):</span>{{foodElement.fat}}</div>
                   <div class="li"><span>维生素A(mg):</span>{{foodElement.vitaminA}}</div>
                   <div class="li"><span>蛋白质(g):</span>{{foodElement.protein}}</div>
                   <div class="li"><span>维生素E(mg):</span>{{foodElement.vitaminE}}</div>
                   <div class="li"><span>钙(mg):</span>{{foodElement.ca}}</div>
                   <div class="li"><span>维生素B1(mg):</span>{{foodElement.vitaminB1}}</div>
                   <div class="li"><span>铁(mg):</span>{{foodElement.fe}}</div>
                   <div class="li"><span>维生素B2(mg):</span>{{foodElement.vitaminB2}}</div>
                   <div class="li"><span>锌(mg):</span>{{foodElement.zn}}</div>
                   <div class="li"><span>维生素C(mg):</span>{{foodElement.vitaminC}}</div>
                 </div>                
              </div>
            </div>
          </div>
          <div class="box">
            <div class="nav"><span>食材构成</span></div> 
            <div class="box-box">
                  <div class="list-ul">
                    <div class="li">  
                        <span class="top-name">食材名称</span>
                        <span class="top-name">类型</span>
                        <span class="top-name">配比</span>
                    </div>
                    <div class="li" v-for="(item,index) in materialList" :key="index">     
                      <span>{{item.materialName}}</span>
                      <span>{{item.typeName}}</span>
                      <span>{{item.percent}}%</span>
                    </div>
              </div>             
            </div>
          </div>
        </div>        
    </div>    
</div> 
</template>
<script>
import {foodDetails} from "@/api/dietaryManagement";
import mixin from "@/mixins/windowResize";
import ImagePreviewer from '@/components/ImagePreviewer/ImagePreviewer';
export default {
  data() {
    return {
      id:this.$route.query.id,
      foodElement:{},
      name:'',
      methodName:'',
      typeName:'',
      pic:'',
      materialList:[],
      remark:''
    };
  },
  components: {ImagePreviewer},
  mixins: [mixin],
  created() {
     this.foodDetailss()
  },
  methods: {
      foodDetailss(){
       foodDetails(this.id).then(res => res.data).then(data => {
          if(data.code==200){
            let mydata=data.data;
            this.foodElement=mydata.foodElement;
            this.name=mydata.name;
            this.methodName=mydata.methodName;
            this.typeName=mydata.typeName;            
            if(mydata.remark){
               this.remark=mydata.remark;
            };
            this.pic=mydata.pic;
            this.materialList=mydata.materialList;
          }     
       })
     }
  }
};
</script>
<style lang="scss" scoped>
.foodbankdetails {
   padding:12px;
   *{
      word-break:break-all;   word-wrap:break-word;
   }
  .top {
    border-bottom: 1px solid #e7eaec;
    padding-bottom: 10px;
  }
  .subject {
    padding-top: 10px;
    overflow: auto;
    .body{
      width: 810px;
      margin: 0 auto;
      .box{
          .el-form-item {
                margin-bottom: 0px;
                .picimg{
                  height: 60px;
               }
            }
        overflow: hidden;
        *{
          box-sizing: border-box;
        }       
        .nav{
          height: 20px;
          line-height: 20px;
          margin: 10px;
          padding-left: 8px;
          border-left: 4px solid #409EFF;
          color: #333;          
        }
      
        .box-box{
          background: #fff;
          overflow: hidden;
          
          .list-ul{   
            margin-left: 20px;
            border-top: 1px #E4E7ED solid;    
            border-left: 1px #E4E7ED solid;       
            border-right: 1px #E4E7ED solid;
            .li{
               overflow: hidden;
               padding:5px 0;
               border-bottom: 1px #EBEEF5 solid;
               span{
                float: left;
                line-height: 40px;
                width: 33%; 
                font-size: 14px;  
                color: #606266;  
                padding-left: 25px;           
               } 
               .top-name{
                 color: #303133;  
                 font-size: 16px; 
               }
             }
          }
         .box-box-left{
           width: 60%;
           float: left;
           .ul{
             .li{
               overflow: hidden;
               padding:5px 0;
               border-bottom: 1px #EBEEF5 solid;
               span{
                float: left;
                line-height: 40px;
                width: 29%; 
                font-size: 14px;  
                color: #606266;             
               }
               
             }
           }
         }
         .box-box-right{
           width: 40%;
           float: left;
           .h3{
            text-align: center;
            line-height: 50px;
            font-size: 18px;
            color: #409EFF;
           }
           .ul{
             overflow: hidden;
             padding-bottom: 20px;
             .li{
               width: 50%;
               float: left;
               color:#909399;
               position: relative;
               padding: 5px;
               line-height: 20px;
               font-size: 14px;
               padding-left: 100px;
               height: 30px;
               span{
                 position: absolute;
                 width: 95px;
                 left: 0;
                 top:5px;
                 text-align: right;
                 color: #606266;
               }
             }
           }
         }
        }
      }
      
    }
    
  }
   
}
</style>