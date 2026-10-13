<template>
<div class="dietaryManagementexpertdetails"  >
    <div class="top"> 
         <el-col :span="6">
           <el-button @click="$router.back()" type="default" size="medium">返回</el-button> 
         <el-button type="primary" size="medium" @click="dietaryManagementcopy()">使用该食谱</el-button>
         </el-col> 
    <el-col :span="12">
          <div class="top-name">{{name}}</div>      
    </el-col>      
    </div>
    <div class="subject" :style="`height: ${nobottommaxH}px;`">
      <div class="body">
          <div class="box">
            <div class="nav"><span>周一</span></div> 
            <div class="box-box" v-if="mondayFood.length>0">
              <div class="box-box-left">
                  <div class="ul">
                    <div class="li" v-for="(item,index) in mondayFood" :key="index">                      
                      <span class="img"  :style="`background-image: url(${item.pic})`"></span>
                      <span>{{item.name}}</span>
                      <span>{{item.typeName}}</span>
                      <span>一份100g</span>
                    </div>
                  </div>
              </div>
              <div class="box-box-right">
                <div class="h3">营养成分(仅供参考)</div>
                 <div class="ul">
                   <div class="li"><span>热量(k):</span>{{mondayFoodElement.energy}}</div>
                   <div class="li"><span>碳水化合物(g):</span>{{mondayFoodElement.carbohydrate}}</div>
                   <div class="li"><span>脂肪(g):</span>{{mondayFoodElement.fat}}</div>
                   <div class="li"><span>维生素A(mg):</span>{{mondayFoodElement.vitaminA}}</div>
                   <div class="li"><span>蛋白质(g):</span>{{mondayFoodElement.protein}}</div>
                   <div class="li"><span>维生素E(mg):</span>{{mondayFoodElement.vitaminE}}</div>
                   <div class="li"><span>钙(mg):</span>{{mondayFoodElement.ca}}</div>
                   <div class="li"><span>维生素B1(mg):</span>{{mondayFoodElement.vitaminB1}}</div>
                   <div class="li"><span>铁(mg):</span>{{mondayFoodElement.fe}}</div>
                   <div class="li"><span>维生素B2(mg):</span>{{mondayFoodElement.vitaminB2}}</div>
                   <div class="li"><span>锌(mg):</span>{{mondayFoodElement.zn}}</div>
                   <div class="li"><span>维生素C(mg):</span>{{mondayFoodElement.vitaminC}}</div>
                 </div>                
              </div>
            </div>
            <div v-else class="noData">暂无安排！</div>
          </div>
          <div class="box">
            <div class="nav"><span>周二</span></div> 
            <div class="box-box" v-if="tuesdayFood.length>0">
              <div class="box-box-left">
                  <div class="ul">
                    <div class="li" v-for="(item,index) in tuesdayFood" :key="index">                      
                      <span class="img"  :style="`background-image: url(${item.pic})`"></span>
                      <span>{{item.name}}</span>
                      <span>{{item.typeName}}</span>
                      <span>一份100g</span>
                    </div>
                  </div>
              </div>
              <div class="box-box-right">
                <div class="h3">营养成分(仅供参考)</div>
                 <div class="ul">
                   <div class="li"><span>热量(k):</span>{{tuesdayFoodElement.energy}}</div>
                   <div class="li"><span>碳水化合物(g):</span>{{tuesdayFoodElement.carbohydrate}}</div>
                   <div class="li"><span>脂肪(g):</span>{{tuesdayFoodElement.fat}}</div>
                   <div class="li"><span>维生素A(mg):</span>{{tuesdayFoodElement.vitaminA}}</div>
                   <div class="li"><span>蛋白质(g):</span>{{tuesdayFoodElement.protein}}</div>
                   <div class="li"><span>维生素E(mg):</span>{{tuesdayFoodElement.vitaminE}}</div>
                   <div class="li"><span>钙(mg):</span>{{tuesdayFoodElement.ca}}</div>
                   <div class="li"><span>维生素B1(mg):</span>{{tuesdayFoodElement.vitaminB1}}</div>
                   <div class="li"><span>铁(mg):</span>{{tuesdayFoodElement.fe}}</div>
                   <div class="li"><span>维生素B2(mg):</span>{{tuesdayFoodElement.vitaminB2}}</div>
                   <div class="li"><span>锌(mg):</span>{{tuesdayFoodElement.zn}}</div>
                   <div class="li"><span>维生素C(mg):</span>{{tuesdayFoodElement.vitaminC}}</div>
                 </div>                
              </div>
            </div>
            <div v-else class="noData">暂无安排！</div>
          </div>
          <div class="box">
            <div class="nav"><span>周三</span></div> 
            <div class="box-box" v-if="wednesdayFood.length>0">
              <div class="box-box-left">
                  <div class="ul">
                    <div class="li" v-for="(item,index) in wednesdayFood" :key="index">                      
                      <span class="img"  :style="`background-image: url(${item.pic})`"></span>
                      <span>{{item.name}}</span>
                      <span>{{item.typeName}}</span>
                      <span>一份100g</span>
                    </div>
                  </div>
              </div>
              <div class="box-box-right">
                <div class="h3">营养成分(仅供参考)</div>
                 <div class="ul">
                   <div class="li"><span>热量(k):</span>{{wednesdayFoodElement.energy}}</div>
                   <div class="li"><span>碳水化合物(g):</span>{{wednesdayFoodElement.carbohydrate}}</div>
                   <div class="li"><span>脂肪(g):</span>{{wednesdayFoodElement.fat}}</div>
                   <div class="li"><span>维生素A(mg):</span>{{wednesdayFoodElement.vitaminA}}</div>
                   <div class="li"><span>蛋白质(g):</span>{{wednesdayFoodElement.protein}}</div>
                   <div class="li"><span>维生素E(mg):</span>{{wednesdayFoodElement.vitaminE}}</div>
                   <div class="li"><span>钙(mg):</span>{{wednesdayFoodElement.ca}}</div>
                   <div class="li"><span>维生素B1(mg):</span>{{wednesdayFoodElement.vitaminB1}}</div>
                   <div class="li"><span>铁(mg):</span>{{wednesdayFoodElement.fe}}</div>
                   <div class="li"><span>维生素B2(mg):</span>{{wednesdayFoodElement.vitaminB2}}</div>
                   <div class="li"><span>锌(mg):</span>{{wednesdayFoodElement.zn}}</div>
                   <div class="li"><span>维生素C(mg):</span>{{wednesdayFoodElement.vitaminC}}</div>
                 </div>                
              </div>
            </div>
            <div v-else class="noData">暂无安排！</div>
          </div>
          <div class="box">
            <div class="nav"><span>周四</span></div> 
            <div class="box-box" v-if="thursdayFood.length>0">
              <div class="box-box-left">
                  <div class="ul">
                    <div class="li" v-for="(item,index) in thursdayFood" :key="index">                      
                      <span class="img"  :style="`background-image: url(${item.pic})`"></span>
                      <span>{{item.name}}</span>
                      <span>{{item.typeName}}</span>
                      <span>一份100g</span>
                    </div>
                  </div>
              </div>
              <div class="box-box-right">
                <div class="h3">营养成分(仅供参考)</div>
                 <div class="ul">
                   <div class="li"><span>热量(k):</span>{{thursdayFoodElement.energy}}</div>
                   <div class="li"><span>碳水化合物(g):</span>{{thursdayFoodElement.carbohydrate}}</div>
                   <div class="li"><span>脂肪(g):</span>{{thursdayFoodElement.fat}}</div>
                   <div class="li"><span>维生素A(mg):</span>{{thursdayFoodElement.vitaminA}}</div>
                   <div class="li"><span>蛋白质(g):</span>{{thursdayFoodElement.protein}}</div>
                   <div class="li"><span>维生素E(mg):</span>{{thursdayFoodElement.vitaminE}}</div>
                   <div class="li"><span>钙(mg):</span>{{thursdayFoodElement.ca}}</div>
                   <div class="li"><span>维生素B1(mg):</span>{{thursdayFoodElement.vitaminB1}}</div>
                   <div class="li"><span>铁(mg):</span>{{thursdayFoodElement.fe}}</div>
                   <div class="li"><span>维生素B2(mg):</span>{{thursdayFoodElement.vitaminB2}}</div>
                   <div class="li"><span>锌(mg):</span>{{thursdayFoodElement.zn}}</div>
                   <div class="li"><span>维生素C(mg):</span>{{thursdayFoodElement.vitaminC}}</div>
                 </div>                
              </div>
            </div>
            <div v-else class="noData">暂无安排！</div>
          </div>
          <div class="box">
            <div class="nav"><span>周五</span></div> 
            <div class="box-box" v-if="fridayFood.length>0">
              <div class="box-box-left">
                  <div class="ul">
                    <div class="li" v-for="(item,index) in fridayFood" :key="index">                      
                      <span class="img"  :style="`background-image: url(${item.pic})`"></span>
                      <span>{{item.name}}</span>
                      <span>{{item.typeName}}</span>
                      <span>一份100g</span>
                    </div>
                  </div>
              </div>
              <div class="box-box-right">
                <div class="h3">营养成分(仅供参考)</div>
                 <div class="ul">
                   <div class="li"><span>热量(k):</span>{{fridayFoodElement.energy}}</div>
                   <div class="li"><span>碳水化合物(g):</span>{{fridayFoodElement.carbohydrate}}</div>
                   <div class="li"><span>脂肪(g):</span>{{fridayFoodElement.fat}}</div>
                   <div class="li"><span>维生素A(mg):</span>{{fridayFoodElement.vitaminA}}</div>
                   <div class="li"><span>蛋白质(g):</span>{{fridayFoodElement.protein}}</div>
                   <div class="li"><span>维生素E(mg):</span>{{fridayFoodElement.vitaminE}}</div>
                   <div class="li"><span>钙(mg):</span>{{fridayFoodElement.ca}}</div>
                   <div class="li"><span>维生素B1(mg):</span>{{fridayFoodElement.vitaminB1}}</div>
                   <div class="li"><span>铁(mg):</span>{{fridayFoodElement.fe}}</div>
                   <div class="li"><span>维生素B2(mg):</span>{{fridayFoodElement.vitaminB2}}</div>
                   <div class="li"><span>锌(mg):</span>{{fridayFoodElement.zn}}</div>
                   <div class="li"><span>维生素C(mg):</span>{{fridayFoodElement.vitaminC}}</div>
                 </div>                
              </div>
            </div>
            <div v-else class="noData">暂无安排！</div>
          </div>
          <div class="box">
            <div class="nav"><span>周六</span></div> 
            <div class="box-box" v-if="saturdayFood.length>0">
              <div class="box-box-left">
                  <div class="ul">
                    <div class="li" v-for="(item,index) in saturdayFood" :key="index">                      
                      <span class="img"  :style="`background-image: url(${item.pic})`"></span>
                      <span>{{item.name}}</span>
                      <span>{{item.typeName}}</span>
                      <span>一份100g</span>
                    </div>
                  </div>
              </div>
              <div class="box-box-right">
                <div class="h3">营养成分(仅供参考)</div>
                 <div class="ul">
                   <div class="li"><span>热量(k):</span>{{saturdayFoodElement.energy}}</div>
                   <div class="li"><span>碳水化合物(g):</span>{{saturdayFoodElement.carbohydrate}}</div>
                   <div class="li"><span>脂肪(g):</span>{{saturdayFoodElement.fat}}</div>
                   <div class="li"><span>维生素A(mg):</span>{{saturdayFoodElement.vitaminA}}</div>
                   <div class="li"><span>蛋白质(g):</span>{{saturdayFoodElement.protein}}</div>
                   <div class="li"><span>维生素E(mg):</span>{{saturdayFoodElement.vitaminE}}</div>
                   <div class="li"><span>钙(mg):</span>{{saturdayFoodElement.ca}}</div>
                   <div class="li"><span>维生素B1(mg):</span>{{saturdayFoodElement.vitaminB1}}</div>
                   <div class="li"><span>铁(mg):</span>{{saturdayFoodElement.fe}}</div>
                   <div class="li"><span>维生素B2(mg):</span>{{saturdayFoodElement.vitaminB2}}</div>
                   <div class="li"><span>锌(mg):</span>{{saturdayFoodElement.zn}}</div>
                   <div class="li"><span>维生素C(mg):</span>{{saturdayFoodElement.vitaminC}}</div>
                 </div>                
              </div>
            </div>
            <div v-else class="noData">暂无安排！</div>
          </div>
          <div class="box">
            <div class="nav"><span>周日</span></div> 
            <div class="box-box" v-if="sundayFood.length>0">
              <div class="box-box-left">
                  <div class="ul">
                    <div class="li" v-for="(item,index) in sundayFood" :key="index">                      
                      <span class="img"  :style="`background-image: url(${item.pic})`"></span>
                      <span>{{item.name}}</span>
                      <span>{{item.typeName}}</span>
                      <span>一份100g</span>
                    </div>
                  </div>
              </div>
              <div class="box-box-right">
                <div class="h3">营养成分(仅供参考)</div>
                 <div class="ul">
                   <div class="li"><span>热量(k):</span>{{sundayFoodElement.energy}}</div>
                   <div class="li"><span>碳水化合物(g):</span>{{sundayFoodElement.carbohydrate}}</div>
                   <div class="li"><span>脂肪(g):</span>{{sundayFoodElement.fat}}</div>
                   <div class="li"><span>维生素A(mg):</span>{{sundayFoodElement.vitaminA}}</div>
                   <div class="li"><span>蛋白质(g):</span>{{sundayFoodElement.protein}}</div>
                   <div class="li"><span>维生素E(mg):</span>{{sundayFoodElement.vitaminE}}</div>
                   <div class="li"><span>钙(mg):</span>{{sundayFoodElement.ca}}</div>
                   <div class="li"><span>维生素B1(mg):</span>{{sundayFoodElement.vitaminB1}}</div>
                   <div class="li"><span>铁(mg):</span>{{sundayFoodElement.fe}}</div>
                   <div class="li"><span>维生素B2(mg):</span>{{sundayFoodElement.vitaminB2}}</div>
                   <div class="li"><span>锌(mg):</span>{{sundayFoodElement.zn}}</div>
                   <div class="li"><span>维生素C(mg):</span>{{sundayFoodElement.vitaminC}}</div>
                 </div>                
              </div>
            </div>
            <div v-else class="noData">暂无安排！</div>
          </div>
      </div>
    </div>    
</div> 
</template>
<script>
import {publicMenuDetails} from "@/api/dietaryManagement";
import mixin from "@/mixins/windowResize";
export default {
  data() {
    return {
     id:this.$route.query.id,
     fridayFood:[],//5
     fridayFoodElement:{},//5
     mondayFood:[],//1
     mondayFoodElement:{},//1
     saturdayFood:[],//6
     saturdayFoodElement:{},//6
     sundayFood:[],//7
     sundayFoodElement:{},//7
     thursdayFood:[],//4
     thursdayFoodElement:{},//4
     tuesdayFood:[],//2
     tuesdayFoodElement:{},//2
     wednesdayFood:[],//3
     wednesdayFoodElement:{},//3
     name:''
    };
  },
  mixins: [mixin],
  created() {
     this.publicMenuDetailss();
  },
  methods: {
     publicMenuDetailss(){
       publicMenuDetails(this.id).then(res => res.data).then(data => {
          if(data.code==200){
            let mydata=data.data;
            this.name=mydata.name;
            this.fridayFood=mydata.fridayFood;
            this.fridayFoodElement=mydata.fridayFoodElement;
            this.mondayFood=mydata.mondayFood;    
            this.mondayFoodElement=mydata.mondayFoodElement;
            this.saturdayFood=mydata.saturdayFood;
            this.saturdayFoodElement=mydata.saturdayFoodElement;
            this.thursdayFood=mydata.thursdayFood;
            this.thursdayFoodElement=mydata.thursdayFoodElement;
            this.sundayFood=mydata.sundayFood;
            this.sundayFoodElement=mydata.sundayFoodElement;
            this.tuesdayFood=mydata.tuesdayFood;
            this.tuesdayFoodElement=mydata.tuesdayFoodElement;
            this.wednesdayFood=mydata.wednesdayFood;
            this.wednesdayFoodElement=mydata.wednesdayFoodElement;
          }     
       })
     },
     //使用
     dietaryManagementcopy(){
        this.$router.push({
                    path: "dietaryManagementcopy",
                    query: {id: this.id}
                });
     }
  }
};
</script>
<style lang="scss" scoped>
.dietaryManagementexpertdetails {
   padding:12px;
  .top {
    border-bottom: 1px solid #e7eaec;
    padding-bottom: 10px;
    overflow: hidden;
    .top-name{
      text-align: center;
      font-size: 24px;
      color: #303133;
      line-height: 36px;
    }
  }
  .subject {
    padding-top: 10px;
    overflow: auto;
    .body{
      width: 810px;
      margin: 0 auto;
      .box{
        overflow: hidden;
        *{
          box-sizing: border-box;
        }
        .noData{
          text-align: center;
          line-height: 80px;
          font-size: 16px;
          color: #303133;
          background: #fff
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
          padding-bottom: 20px;
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
               .img{
                  height: 40px;
                  width: 40px;
                  background-position: center center;
                  background-size: cover;
                  margin: 0 15px 0 5px;
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