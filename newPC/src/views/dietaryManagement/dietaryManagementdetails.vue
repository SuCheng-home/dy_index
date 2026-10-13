<template>
<div class="dietaryManagementdetails"  >
    <div class="top"> 
        <el-button @click="$router.back()" type="default" size="medium">返回</el-button> 
        <el-button type="primary" size="medium" @click="dietaryManagementeidt()">编辑</el-button>  
        <el-button type="primary" size="medium" @click="showSchoolMenus()">发布</el-button>   
    </div>
    <div class="subject" :style="`height: ${nobottommaxH}px;`">
      <h2>{{name}}</h2>
      <div class="meta-info"><span>第{{dietMenuWeek}}周</span> <span>{{weekMonday}}~{{weekSunday}}</span></div>
      <div class="body">
        <!-- <div class="box">
            <div class="nav"><span>名称周次</span></div> 
            <div class="box-box" >
                  <div class="ul-top">                    
                    <div class="li">     
                         <div class="name">食谱名称</div> 
                         
                    </div>
                    <div class="li">     
                         <div class="name">食谱周数</div>                                          
                          
                    </div>
              </div>             
            </div>
        </div> -->          
          <div class="box">
            <div class="nav"><span>周一</span></div> 
            <div class="box-box" v-if="mondayFood.length>0">
                  <div class="ul">                    
                    <div class="li" :class="{ 'color': (item.foodCount>1)&&(item.foodTypeName!='主食') }" v-for="(item,index) in mondayFood" :key="index">     
                        <span class="img"  :style="`background-image: url(${item.foodPic})`"></span>
                        <span class="name">{{item.foodName}}</span>
                        <span>{{item.foodTypeName}}</span>
                        <span v-show="schoolInfotype==2||schoolInfotype==9">小低 {{item.smallLow}} g</span>
                        <span v-show="schoolInfotype==2||schoolInfotype==9">小高 {{item.smallHeight}} g</span>
                        <span v-show="schoolInfotype==9">初中 {{item.juniorMiddleSchool}} g</span>
                        <span v-show="schoolInfotype!=2&&schoolInfotype!=9">每份 {{item.usual}} g</span>
                        <div class="num" v-if="(item.foodCount>1)&&(item.foodTypeName!='主食')">此菜品本周已使用{{item.foodCount}}次</div>
                    </div>
              </div>             
            </div>
             <div v-else class="noData">暂无安排！</div>
          </div>
          <div class="box">
            <div class="nav"><span>周二</span></div> 
            <div class="box-box" v-if="tuesdayFood.length>0">
                  <div class="ul">                    
                    <div class="li"  :class="{ 'color': (item.foodCount>1)&&(item.foodTypeName!='主食') }" v-for="(item,index) in tuesdayFood" :key="index">     
                       <span class="img"  :style="`background-image: url(${item.foodPic})`"></span>
                        <span class="name">{{item.foodName}}</span>
                        <span>{{item.foodTypeName}}</span>
                        <span v-show="schoolInfotype==2||schoolInfotype==9">小低 {{item.smallLow}} g</span>
                        <span v-show="schoolInfotype==2||schoolInfotype==9">小高 {{item.smallHeight}} g</span>
                        <span v-show="schoolInfotype==9">初中 {{item.juniorMiddleSchool}} g</span>
                        <span v-show="schoolInfotype!=2&&schoolInfotype!=9">每份 {{item.usual}} g</span> 
                         <div class="num" v-if="(item.foodCount>1)&&(item.foodTypeName!='主食')">此菜品本周已使用{{item.foodCount}}次</div>                       
                    </div>
              </div>             
            </div>
             <div v-else class="noData">暂无安排！</div>
          </div>
          <div class="box">
            <div class="nav"><span>周三</span></div> 
            <div class="box-box" v-if="wednesdayFood.length>0">
                  <div class="ul">                    
                    <div class="li"   :class="{ 'color': (item.foodCount>1)&&(item.foodTypeName!='主食') }" v-for="(item,index) in wednesdayFood" :key="index">     
                       <span class="img"  :style="`background-image: url(${item.foodPic})`"></span>
                        <span class="name">{{item.foodName}}</span>
                        <span>{{item.foodTypeName}}</span>
                        <span v-show="schoolInfotype==2||schoolInfotype==9">小低 {{item.smallLow}} g</span>
                        <span v-show="schoolInfotype==2||schoolInfotype==9">小高 {{item.smallHeight}} g</span>
                        <span v-show="schoolInfotype==9">初中 {{item.juniorMiddleSchool}} g</span>
                        <span v-show="schoolInfotype!=2&&schoolInfotype!=9">每份 {{item.usual}} g</span>  
                        <div class="num" v-if="(item.foodCount>1)&&(item.foodTypeName!='主食')">此菜品本周已使用{{item.foodCount}}次</div>                    
                    </div>
              </div>             
            </div>
             <div v-else class="noData">暂无安排！</div>
          </div>
          <div class="box">
            <div class="nav"><span>周四</span> </div> 
            <div class="box-box" v-if="thursdayFood.length>0">
                  <div class="ul">                    
                    <div class="li"  :class="{ 'color': (item.foodCount>1)&&(item.foodTypeName!='主食') }" v-for="(item,index) in thursdayFood" :key="index">     
                        <span class="img"  :style="`background-image: url(${item.foodPic})`"></span>
                        <span class="name">{{item.foodName}}</span>
                        <span>{{item.foodTypeName}}</span>
                        <span v-show="schoolInfotype==2||schoolInfotype==9">小低 {{item.smallLow}} g</span>
                        <span v-show="schoolInfotype==2||schoolInfotype==9">小高 {{item.smallHeight}} g</span>
                        <span v-show="schoolInfotype==9">初中 {{item.juniorMiddleSchool}} g</span>
                        <span v-show="schoolInfotype!=2&&schoolInfotype!=9">每份 {{item.usual}} g</span>      
                         <div class="num" v-if="(item.foodCount>1)&&(item.foodTypeName!='主食')">此菜品本周已使用{{item.foodCount}}次</div>                 
                    </div>
              </div>             
            </div>
             <div v-else class="noData">暂无安排！</div>
          </div>
          <div class="box">
            <div class="nav"><span>周五</span> </div> 
            <div class="box-box" v-if="fridayFood.length>0">
                  <div class="ul">                    
                    <div class="li"  :class="{ 'color': (item.foodCount>1)&&(item.foodTypeName!='主食') }" v-for="(item,index) in fridayFood" :key="index">     
                        <span class="img"  :style="`background-image: url(${item.foodPic})`"></span>
                        <span class="name">{{item.foodName}}</span>
                        <span>{{item.foodTypeName}}</span>
                        <span v-show="schoolInfotype==2||schoolInfotype==9">小低 {{item.smallLow}} g</span>
                        <span v-show="schoolInfotype==2||schoolInfotype==9">小高 {{item.smallHeight}} g</span>
                        <span v-show="schoolInfotype==9">初中 {{item.juniorMiddleSchool}} g</span>
                        <span v-show="schoolInfotype!=2&&schoolInfotype!=9">每份 {{item.usual}} g</span>  
                         <div class="num" v-if="(item.foodCount>1)&&(item.foodTypeName!='主食')">此菜品本周已使用{{item.foodCount}}次</div>                    
                    </div>
              </div>             
            </div>
             <div v-else class="noData">暂无安排！</div>
          </div>
          <div class="box">
            <div class="nav"><span>周六</span></div> 
            <div class="box-box" v-if="saturdayFood.length>0">
                  <div class="ul">                    
                    <div class="li" :class="{ 'color': (item.foodCount>1)&&(item.foodTypeName!='主食') }" v-for="(item,index) in saturdayFood" :key="index">     
                        <span class="img"  :style="`background-image: url(${item.foodPic})`"></span>
                        <span class="name">{{item.foodName}}</span>
                        <span>{{item.foodTypeName}}</span>
                        <span v-show="schoolInfotype==2||schoolInfotype==9">小低 {{item.smallLow}} g</span>
                        <span v-show="schoolInfotype==2||schoolInfotype==9">小高 {{item.smallHeight}} g</span>
                        <span v-show="schoolInfotype==9">初中 {{item.juniorMiddleSchool}} g</span>
                        <span v-show="schoolInfotype!=2&&schoolInfotype!=9">每份 {{item.usual}} g</span>  
                        <div class="num" v-if="(item.foodCount>1)&&(item.foodTypeName!='主食')">此菜品本周已使用{{item.foodCount}}次</div>                     
                    </div>
              </div>             
            </div>
             <div v-else class="noData">暂无安排！</div>
          </div>
          <div class="box">
            <div class="nav"><span>周日</span></div> 
            <div class="box-box" v-if="sundayFood.length>0">
                  <div class="ul">                    
                    <div class="li"  :class="{ 'color': (item.foodCount>1)&&(item.foodTypeName!='主食') }" v-for="(item,index) in sundayFood" :key="index">     
                       <span class="img"  :style="`background-image: url(${item.foodPic})`"></span>
                        <span class="name">{{item.foodName}}</span>
                        <span>{{item.foodTypeName}}</span>
                        <span v-show="schoolInfotype==2||schoolInfotype==9">小低 {{item.smallLow}} g</span>
                        <span v-show="schoolInfotype==2||schoolInfotype==9">小高 {{item.smallHeight}} g</span>
                        <span v-show="schoolInfotype==9">初中 {{item.juniorMiddleSchool}} g</span>
                        <span v-show="schoolInfotype!=2&&schoolInfotype!=9">每份 {{item.usual}} g</span>  
                        <div class="num" v-if="item.foodCount>1">此菜品本周已使用{{item.foodCount}}次</div>                   
                    </div>
              </div>             
            </div>
             <div v-else class="noData">暂无安排！</div>
          </div>
          <div class="box">
            <div class="nav"><span>营养成分</span></div> 
            <div class="nutrition-box" v-for="(item,index) in weekElementList" :key="index">
                 <div class="h3"><span v-if="item.type==1">小低</span><span v-if="item.type==2">小高</span><span v-if="item.type==3">初中</span>营养成分(仅供参考)</div>
                 <div class="num-name-box">
                   <div class="left">
                     评分：<span class="color">{{item.score}}分</span>
                     <div class="xing-box">
                       <i class="fa fa-star" aria-hidden="true"></i>
                       <i class="fa fa-star" aria-hidden="true"></i>
                       <i class="fa fa-star" aria-hidden="true"></i>
                       <i class="fa fa-star" aria-hidden="true"></i>
                       <i class="fa fa-star" aria-hidden="true"></i>
                       <div class="pop-box" :style="`width: ${(5-item.score)*20}%;`"></div>
                      </div>
                   </div>
                   <div class="right">
                     专家评价：
                     <span class="color" v-if="(item.score*1)==5">非常合理</span>
                     <span class="color" v-if="((item.score*1)<5)&&((item.score*1)>=4)">基本合理</span>
                     <span class="color" v-if="((item.score*1)<4)&&((item.score*1)>=3)">有待改进</span>
                     <span class="color-red" v-if="((item.score*1)<3)&&((item.score*1)>=2)">急需改进</span>
                     <span class="color-red" v-if="(item.score*1)<2">食谱无效</span>
                   </div>
                 </div>
                 <div class="ul">
                   <div @click="popfun('energy',item.energy*1<item.elementSet.energy*1,'热量')" class="li" :class="{ 'color-red':item.energy*1>item.elementSet.energyM*1,'color':item.energy*1<item.elementSet.energy*1}"><span>热量(k):</span>{{item.energy}}（{{item.elementSet.energy}}~{{item.elementSet.energyM}}）</div>
                   <div @click="popfun('carbohydrate',item.carbohydrate*1<item.elementSet.carbohydrate*1,'碳水化合物')" class="li" :class="{ 'color-red':item.carbohydrate*1>item.elementSet.carbohydrateM*1,'color':item.carbohydrate*1<item.elementSet.carbohydrate*1}"><span>碳水化合物(g):</span>{{item.carbohydrate}}（{{item.elementSet.carbohydrate}}~{{item.elementSet.carbohydrateM}}）</div>
                   <div @click="popfun('fat',item.fat*1<item.elementSet.fat*1,'脂肪')" class="li" :class="{ 'color-red':item.fat*1>item.elementSet.fatM*1,'color':item.fat*1<item.elementSet.fat*1}"><span>脂肪(g):</span>{{item.fat}}（{{item.elementSet.fat}}~{{item.elementSet.fatM}}）</div>
                   <div @click="popfun('vitaminA',item.vitaminA*1<item.elementSet.vitaminA*1,'维生素A')" class="li" :class="{ 'color-red':item.vitaminA*1>item.elementSet.vitaminAM*1,'color':item.vitaminA*1<item.elementSet.vitaminA*1}"><span>维生素A(mg):</span>{{item.vitaminA}}（{{item.elementSet.vitaminA}}~{{item.elementSet.vitaminAM}}）</div>
                   <div @click="popfun('protein',item.protein*1<item.elementSet.protein*1,'蛋白质')" class="li" :class="{ 'color-red':item.protein*1>item.elementSet.proteinM*1,'color':item.protein*1<item.elementSet.protein*1}"><span>蛋白质(g):</span>{{item.protein}}（{{item.elementSet.protein}}~{{item.elementSet.proteinM}}）</div>
                   <div @click="popfun('vitaminE',item.vitaminE*1<item.elementSet.vitaminE*1,'维生素E')" class="li" :class="{ 'color-red':item.vitaminE*1>item.elementSet.vitaminEM*1,'color':item.vitaminE*1<item.elementSet.vitaminE*1}"><span>维生素E(mg):</span>{{item.vitaminE}}（{{item.elementSet.vitaminE}}~{{item.elementSet.vitaminEM}}）</div>
                   <div @click="popfun('ca',item.ca*1<item.elementSet.ca*1,'钙')" class="li" :class="{ 'color-red':item.ca*1>item.elementSet.caM*1,'color':item.ca*1<item.elementSet.ca*1}"><span>钙(mg):</span>{{item.ca}}（{{item.elementSet.ca}}~{{item.elementSet.caM}}）</div>
                   <div @click="popfun('vitaminB1',item.vitaminB1*1<item.elementSet.vitaminB1*1,'维生素B1')" class="li" :class="{ 'color-red':item.vitaminB1*1>item.elementSet.vitaminB1M*1,'color':item.vitaminB1*1<item.elementSet.vitaminB1*1}"><span>维生素B1(mg):</span>{{item.vitaminB1}}（{{item.elementSet.vitaminB1}}~{{item.elementSet.vitaminB1M}}）</div>
                   <div @click="popfun('fe',item.fe*1<item.elementSet.fe*1,'铁')" class="li" :class="{ 'color-red':item.fe*1>item.elementSet.feM*1,'color':item.fe*1<item.elementSet.fe*1}"><span>铁(mg):</span>{{item.fe}}（{{item.elementSet.fe}}~{{item.elementSet.feM}}）</div>
                   <div @click="popfun('vitaminB2',item.vitaminB2*1<item.elementSet.vitaminB2*1,'维生素B2')" class="li" :class="{ 'color-red':item.vitaminB2*1>item.elementSet.vitaminB2M*1,'color':item.vitaminB2*1<item.elementSet.vitaminB2*1}"><span>维生素B2(mg):</span>{{item.vitaminB2}}（{{item.elementSet.vitaminB2}}~{{item.elementSet.vitaminB2M}}）</div>
                   <div @click="popfun('zn',item.zn*1<item.elementSet.zn*1,'锌')" class="li" :class="{ 'color-red':item.zn*1>item.elementSet.znM*1,'color':item.zn*1<item.elementSet.zn*1}"><span>锌(mg):</span>{{item.zn}}（{{item.elementSet.zn}}~{{item.elementSet.znM}}）</div>
                   <div @click="popfun('vitaminC',item.vitaminC*1<item.elementSet.vitaminC*1,'维生素C')" class="li" :class="{ 'color-red':item.vitaminC*1>item.elementSet.vitaminCM*1,'color':item.vitaminC*1<item.elementSet.vitaminC*1}"><span>维生素C(mg):</span>{{item.vitaminC}}（{{item.elementSet.vitaminC}}~{{item.elementSet.vitaminCM}}）</div>
                 </div>   
            </div>
          </div>
      </div>
    </div>  
   <el-dialog :title="zname+'营养成分推荐菜品'" :close-on-press-escape='false' :close-on-click-modal='false' :visible.sync="dialogVisible" width="800px" :lock-scroll="false" :modal-append-to-body='false'>
	 <div class="food-box">       
        <el-radio-group v-model="foodtype" @change="foodChange()">
          <el-radio  border v-for="item in foodlist" :key="item.id" :label="item.id">
            <img class="img" :src="item.pic" alt="">
            {{item.name}}
          </el-radio>
        </el-radio-group>
     </div>    
     <div class="food-box-bottom">
        <div class="name" v-if="bottomtype.length==0">暂无替换菜品</div>
        <el-radio-group v-model="bottomtype" >
          <el-radio  border v-for="item in myobj.mondayFood" :key="item.id" :label="item.id">
              周一 {{item.foodName}}
          </el-radio>
          <el-radio  border v-for="item in myobj.tuesdayFood" :key="item.id" :label="item.id">
              周二 {{item.foodName}}
          </el-radio>
          <el-radio  border v-for="item in myobj.wednesdayFood" :key="item.id" :label="item.id">
              周三 {{item.foodName}}
          </el-radio>
          <el-radio  border v-for="item in myobj.thursdayFood" :key="item.id" :label="item.id">
              周四 {{item.foodName}}
          </el-radio>
          <el-radio  border v-for="item in myobj.fridayFood" :key="item.id" :label="item.id">
              周五 {{item.foodName}}
          </el-radio>
          <el-radio  border v-for="item in myobj.saturdayFood" :key="item.id" :label="item.id">
              周六 {{item.foodName}}
          </el-radio>
          <el-radio  border v-for="item in myobj.sundayFood" :key="item.id" :label="item.id">
              周日 {{item.foodName}}
          </el-radio>
         
        </el-radio-group>
     </div>
			<span slot="footer" class="dialog-footer">
				<el-button  @click="dialogVisible=false">取 消</el-button>
				<el-button type="primary" @click="dialogVisiblefun()">确 定</el-button>
			</span>
		</el-dialog> 
</div> 
</template>
<script>
import { schoolMenuDetails, showSchoolMenu,getDietaryFoodByElement,getWeekFoodByMenuIdAndFoodType,replaceFood} from "@/api/dietaryManagement";
import mixin from "@/mixins/windowResize";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      id: this.$route.query.id,
      mondayFood: [], //1
      tuesdayFood: [], //2
      wednesdayFood: [], //3
      thursdayFood: [], //4
      fridayFood: [], //5
      saturdayFood: [], //6
      sundayFood: [], //7
      name: "",
      dietMenuWeek: "",
      schoolInfotype: "",
      weekElementList:[],
      weekMonday:'',
      weekSunday:'',

      foodlist:[],
      foodtype:'',
      bottomtype:'',
      zname:'',
      dialogVisible:false,
      myobj:{
        mondayFood: [], //1
        tuesdayFood: [], //2
        wednesdayFood: [], //3
        thursdayFood: [], //4
        fridayFood: [], //5
        saturdayFood: [], //6
        sundayFood: [], //7
      }
    };
  },
  mixins: [mixin],
  computed: { ...mapGetters(["schoolInfo"]) },
  created() {
    this.schoolMenuDetailss();
    this.schoolInfotype = this.schoolInfo.type;
  },
  methods: {
    //弹出
    popfun(name,is,zname){
      if(is){
        this.zname=zname;
        this.dialogVisible=true;
        this.getDietaryFoodByElements(name)
      }
    },
    //确定
    dialogVisiblefun(){
      if(!this.bottomtype){
        this.$message({type: 'error', message:'请选择替换菜品!'});
        return;
      };
      let obj={}
      for(let i=0;i<this.foodlist.length;i++){
        if(this.foodtype==this.foodlist[i].id){
          obj={
            foodId:this.foodlist[i].id,//菜品id	number	
            foodName:this.foodlist[i].name,//	食物名称	string	
            foodPic:this.foodlist[i].pic,//	食物图片	string	
            foodTypeId:this.foodlist[i].typeId,//	食物类型	number	
            foodTypeName:this.foodlist[i].typeName,//	食物类型	string	
            menuDetailsIds:this.bottomtype,//		string	
            menuId:this.id,//	食谱id	number
          }
        }
      };      
      this.dialogVisible=false;
      replaceFood(obj)
              .then(res => {
                if (res.data.code === 200) {
                  this.$message({
                    type: "success",
                    message: "替换成功!"
                  });
                  this.schoolMenuDetailss();
                }                
              }).catch();
    },
    //切换菜品
    foodChange(){
      for(let i=0;i<this.foodlist.length;i++){
          if(this.foodtype==this.foodlist[i].id){
              this.getWeekFoodByMenuIdAndFoodTypes(this.foodlist[i].typeId)
          }
      }
      
    },
    //最高的十份
    getDietaryFoodByElements(name){
          getDietaryFoodByElement(name).then(res=>{                
                let mydata=res.data.data;
                this.foodlist=mydata;
                this.foodtype=this.foodlist[0].id; 
                this.getWeekFoodByMenuIdAndFoodTypes(this.foodlist[0].typeId)
            }).catch();
    },
    //获取替换的
     getWeekFoodByMenuIdAndFoodTypes(typeId){
        getWeekFoodByMenuIdAndFoodType(this.id,typeId).then(res=>{                
                let mydata=res.data.data;
                this.myobj=mydata;
                this.bottomtype='';        
                if(mydata.mondayFood.length>0){
                   this.bottomtype=mydata.mondayFood[0].id;
                   return;
                };
                if(mydata.tuesdayFood.length>0){
                   this.bottomtype=mydata.tuesdayFood[0].id;
                   return;
                };
                if(mydata.wednesdayFood.length>0){
                   this.bottomtype=mydata.wednesdayFood[0].id;
                   return;
                };
                if(mydata.thursdayFood.length>0){
                   this.bottomtype=mydata.thursdayFood[0].id;
                   return;
                };
                if(mydata.fridayFood.length>0){
                   this.bottomtype=mydata.fridayFood[0].id;
                   return;
                };
                if(mydata.saturdayFood.length>0){
                   this.bottomtype=mydata.saturdayFood[0].id;
                   return;
                };
                if(mydata.sundayFood.length>0){
                   this.bottomtype=mydata.sundayFood[0].id;
                   return;
                };
                           
            }).catch();
     },
    //获取详情
    schoolMenuDetailss() {
      schoolMenuDetails(this.id)
        .then(res => res.data)
        .then(data => {
          if (data.code == 200) {
            let mydata = data.data;
            this.fridayFood = mydata.fridayFood;
            this.name = mydata.name;
            this.weekSunday = mydata.weekSunday;
            this.weekMonday = mydata.weekMonday;
            this.mondayFood = mydata.mondayFood;
            this.saturdayFood = mydata.saturdayFood;
            this.thursdayFood = mydata.thursdayFood;
            this.sundayFood = mydata.sundayFood;
            this.tuesdayFood = mydata.tuesdayFood;
            this.wednesdayFood = mydata.wednesdayFood;
            this.dietMenuWeek = mydata.dietMenuWeek;
            this.weekElementList = mydata.weekElementList;
          }
        });
    },
    //编辑
    dietaryManagementeidt() {
      this.$router.push({
        path: "dietaryManagementeidt",
        query: { id: this.id }
      });
    },
    //发布
    showSchoolMenus() {
      this.$confirm("是否发布此食谱?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          showSchoolMenu(this.id)
            .then(res => {
              this.$message({
                type: "success",
                message: "发布成功!"
              });
            })
            .catch();
        })
        .catch(() => {});
    }
  }
};
</script>
<style lang="scss" scoped>
.dietaryManagementdetails {
  padding:12px;
  * {
    box-sizing: border-box;
  }
  .top {
    border-bottom: 1px solid #e7eaec;
    padding-bottom: 10px;
  }
  .food-box-bottom{
      overflow: hidden;
      border-bottom: 1px #EBEEF5 solid;
      padding: 5px 0;
      height: 100px;
      overflow: auto;
      .name{
      line-height: 26px;
      font-size: 20px;
      color:#C0C4CC;
    }
      .el-radio.is-bordered {
        padding: 10px;
        height: 36px;
        width: 162px;
        margin: 4px;
    }
  }
 
  .food-box{
      height: 181px;
      overflow: auto;
      border-bottom: 1px #EBEEF5 solid;
    .img{
        width: 45px;
        height: 45px;
        left: 40px;
        position: absolute;
        top: 5px;
    }
    .el-radio.is-bordered {        
          height: 80px;
          width: 130px;
          padding: 50px 10px 10px 10px;
          margin: 5px;
      }
  }
  .subject {
    padding-top: 10px;
    overflow: auto;
     h2 {
           line-height: 1.2em;
          text-align: center;
          color: #676a6c;
      }
      .meta-info {
          font-size: 14px;
          text-align: center;
          color: #676a6c;
          margin-bottom: 10px;
      }
    .body {
      width: 810px;
      margin: 0 auto;  
      .el-form-item {
        margin-bottom: 0px;
      }
      .box {
        overflow: hidden;
        .noData {
          text-align: center;
          line-height: 80px;
          font-size: 16px;
          color: #303133;
          background: #fff;
        }
        .nav {
          height: 20px;
          line-height: 20px;
          margin: 10px;
          padding-left: 8px;
          border-left: 4px solid #409EFF;
          color: #333;
        }
       .nutrition-box {
         padding: 0 120px;
         background: #fff;
          .h3{
            text-align: center;
            line-height: 50px;
            font-size: 18px;
            color: #409EFF;
           }
           .color{
             color: #409EFF;
           }
           .color-red{
             color: #F56C6C;
           }
           .num-name-box{
             overflow: hidden;
             .left{
                width: 50%;
                line-height: 36px;
                overflow: hidden;
                 float: left;
                .xing-box{
                  display: inline-block;
                  color: #409EFF;
                  position: relative;
                  .pop-box{
                    position: absolute;
                    top:0;
                    right:0;
                    height: 36px;
                    background: #fff;
                    opacity: 0.7;
                  }
                }
             }
             .right{
               width: 50%;
               float: left;
               line-height: 36px;
             }
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
             .color{
                color: #409EFF;
                cursor:pointer;
                 span{                
                 color: #409EFF;
               }
              }
              .color-red{
                color: #F56C6C;
                span{                
                 color: #F56C6C;
               }
              }
           }
        }
        .box-box {
          background: #fff;
          overflow: hidden;
          .ul-top {
            .li {
              position: relative;
              padding: 10px 10px 10px 110px;
              font-size: 14px;
              color: #909399;
              .el-select {
                width: 100%;
              }
              .name {
                position: absolute;
                width: 100px;
                text-align: right;
                top: 0px;
                left: 0px;
                line-height: 36px;
                font-size: 14px;
                color: #303133;
              }
            }
          }
          .ul {
            .li {
              overflow: hidden;
              padding: 5px 0;
              border-bottom: 1px #ebeef5 solid;
              span {
                float: left;
                line-height: 40px;
                width: 100px;
                font-size: 14px;
                color: #606266;
                text-align: center;
                .el-input {
                  width: 70px;
                  margin: 0 5px;
                }
              }
              .name {
                width: 140px;
              }
              .el-icon-delete {
                line-height: 40px;
                font-size: 20px;
                float: right;
                margin-right: 10px;
                color: #606266;
                cursor: pointer;
              }
              .img {
                height: 40px;
                width: 40px;
                background-position: center center;
                background-size: cover;
                margin: 0 15px 0 5px;
              }
              .num {
                float: right;
                font-size: 14px;
                line-height: 40px;
                color: #409EFF;
                padding-right: 15px;
              }
            }
            .color {
              background-color: #e9f9fa;
            }
          }
        }
      }
    }
  }
}
</style>