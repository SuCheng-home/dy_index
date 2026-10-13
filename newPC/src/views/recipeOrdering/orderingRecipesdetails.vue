<template>
<div class="orderingRecipesdetails"  >
     <div class="top"> 
         <el-button @click="$router.back()" type="default" size="medium">返回</el-button>   
         <address-book v-model="addressDataone" :config="activityScopeDataone"  dataSuffix="List" :isbutton="true" v-if="myobj.menuType!=2&&isShow==1" >补发学生</address-book>
          <address-book v-model="addressDatatwo" :config="activityScopeDatatwo"  dataSuffix="List" :isbutton="true" v-if="myobj.menuType!=3&&isShow==1" >补发老师</address-book>
         <el-button type="primary"    v-if="isShow==0"  size="medium" @click="orderingRecipeseidt()">编辑</el-button>
         <el-button type="primary"    v-if="isShow==0"  size="medium" @click="publishMealMenus()">发布</el-button>
         <el-button type="primary"    v-if="isShow==1"  size="medium" @click="orderingRecipeslistone()">订餐详情</el-button>  
      </div>
     <div class="subject " :style="`height: ${nobottommaxH}px;`">
            <div class="body"> 
                <div class="box">
                    <div class="nav"><span>食谱信息</span></div> 
                    <div class="box-box">
                        <div class="ul-top"> 
                            <div class="li">     
                                <div class="name">食谱周次</div>  
                                 第 {{query.week}} 周
                                （{{query.mondayDate}} ~ {{query.sundayDate}}）         
                            </div>
                             <div class="li">     
                                <div class="name">类型</div> 
                                <span v-if="query.menuType==1">公共</span>
                                <span v-if="query.menuType==2">老师</span>
                                <span v-if="query.menuType==3">学生</span>    
                                <span v-if="query.menuType==4">指定范围</span>                                                                     
                            </div>
                            <div class="li">     
                                <div class="name">截止时间</div> 
                                {{query.limitDate}}
                            </div>
                             <div class="li">     
                                <div class="name">支付</div> 
                                <div class="li-box">
                                   <span v-if="query.payType==2">线上支付</span>
                                   <span v-else>线下支付</span>
                                </div>                                                                                                         
                            </div>
                       </div>              
                    </div>
                </div>
                <div class="box">
                    <div class="nav"><span>套餐信息</span></div> 
                    <div class="box-box" >
                      <div class="big-box" v-for="(items,indexs) in mealMenuSetList" :key="indexs">  
                       
                        <div class="big-box-top">  
                          <img :src="items.pic" alt=""> 
                          <div class="li li-top">
                           提供日期:
                           <span v-for="(item,index) in items.weeklist" :key="index">
                               {{weekname[item-1]}}
                           </span>
                           </div>                    
                          <div v-if="items.foodList.length">
                              <div class="li"  v-for="(item,index) in items.foodList" :key="index">{{item.name}}&nbsp;&nbsp;{{item.weight}}g</div>
                          </div>
                          <div v-else class="li">
                              <div v-html="items.content"></div>  
                          </div>                          
                        </div> 
                        <div class="num-box" v-if="query.payType==2">
                        套餐餐标：{{items.menuSetPrice}}（元）
                      </div>
                        <div class="box-box-right" v-if="items.foodList.length">
                            <div class="h3">营养成分(仅供参考)</div>
                            <div class="ul">
                            <div class="li"><span>热量(k):</span>{{items.myElement.energy}}</div>
                            <div class="li"><span>碳水化合物(g):</span>{{items.myElement.carbohydrate}}</div>
                            <div class="li"><span>脂肪(g):</span>{{items.myElement.fat}}</div>
                            <div class="li"><span>维生素A(mg):</span>{{items.myElement.vitaminA}}</div>
                            <div class="li"><span>蛋白质(g):</span>{{items.myElement.protein}}</div>
                            <div class="li"><span>维生素E(mg):</span>{{items.myElement.vitaminE}}</div>
                            <div class="li"><span>钙(mg):</span>{{items.myElement.ca}}</div>
                            <div class="li"><span>维生素B1(mg):</span>{{items.myElement.vitaminB1}}</div>
                            <div class="li"><span>铁(mg):</span>{{items.myElement.fe}}</div>
                            <div class="li"><span>维生素B2(mg):</span>{{items.myElement.vitaminB2}}</div>
                            <div class="li"><span>锌(mg):</span>{{items.myElement.zn}}</div>
                            <div class="li"><span>维生素C(mg):</span>{{items.myElement.vitaminC}}</div>
                            </div>                
                        </div>
                        <div class="big-box-foot">
                            {{items.name}} &nbsp;  
                            <el-tag size="small" v-if="items.setType==1" type="success">早餐</el-tag>
                            <el-tag size="small" v-if="items.setType==2">午餐</el-tag>
                            <el-tag size="small" v-if="items.setType==3" type="warning">晚餐</el-tag>
                      </div>           
                    </div>
                    </div>
                </div>
            </div> 
            
     </div>
</div> 
</template>
<script>
import {getMealMenuInfo,publishMealMenu,reissueMealMenu} from "@/api/recipeOrdering";
import mixin from "@/mixins/windowResize";
import AddressBook from '@/components/AddressBook/indexExpand';
export default {
  data() {
    return {
      query: {
        limitDate: "", //	截止时间	string
        menuType: "", //	食谱类型，1公共，2老师，3学生	number
        mondayDate: "", //	周一	string
        sundayDate: "", //	周日	string
        week: "", //	周	number
        payType:1
      },
      isShow:'1',
      mealMenuSetList: [],
      weekname:['周一','周二','周三','周四','周五','周六','周日'],
      myobj:{},
      activityScopeDataone: {
        title: "发布范围",
        depart: { target: "user", departType: "s", userTypes: "2", notCheckSchool: true },
        group: false
      },
       addressDataone:{},
       activityScopeDatatwo: {
        title: "发布范围",
        depart: { target: "user", departType: "t", userTypes: "1",notCheckSchool: true},
        group: false
      },
       addressDatatwo:{},
    };
  },
  components: { AddressBook},
   watch:{
    addressDataone(addressDataone){
      if(addressDataone.departList.length !== 0||addressDataone.userList.length !== 0||addressDataone.groupList.length !== 0) {
        const addressNextData={
          userJson:[],
          groupJson:[],
          departJson:[]
        };
        reissueMealMenu({
          id:this.$route.query.id,//	周食谱id	number	
          menuType:this.myobj.menuType,//	食谱类型，1公共，2老师，3学生	number	
          payType:this.query.payType,//	是否需要支付,1不要支付,2需要支付	number	
          schoolId:this.myobj.schoolId,//	学校id	number	
          schoolTimeId:this.myobj.schoolTimeId,//	学期id	number	
          stuJson:addressDataone.userList,//	地址簿学生json	array<object>	
          teacherJson:[],	//地址薄教师json	array<object>	
          week:this.query.week//	周	number	
        }).then(res=>res.data)
        .then(data=>{
          if(data.code===200){
            this.$message({
              type: "success",
              message: "补发成功!"
            });
          }else{
            this.$message({
              type: "error",
              message: "补发失败!请稍后重试!谢谢!"
            });
          }
          this.addressDataone={
          userJson:[],
          groupJson:[],
          departJson:[]
        };
        }).catch(()=>{
          this.$message({
              message: `${data.msg}`,
              type: 'error'
          });
        })
      }else {
        this.$message.error("请选择补发人员！");
      }
    },
     addressDatatwo(addressDatatwo){
      if(addressDatatwo.departList.length !== 0||addressDatatwo.userList.length !== 0||addressDatatwo.groupList.length !== 0) {
       
        reissueMealMenu({
          id:this.$route.query.id,//	周食谱id	number	
          menuType:this.myobj.menuType,//	食谱类型，1公共，2老师，3学生	number	
          payType:this.query.payType,//	是否需要支付,1不要支付,2需要支付	number	
          schoolId:this.myobj.schoolId,//	学校id	number	
          schoolTimeId:this.myobj.schoolTimeId,//	学期id	number	
          stuJson:[],//	地址簿学生json	array<object>	
          teacherJson:addressDatatwo.userList,	//地址薄教师json	array<object>	
          week:this.query.week//	周	number	
        }).then(res=>res.data)
        .then(data=>{
          if(data.code===200){
            this.$message({
              type: "success",
              message: "补发成功!"
            });
            
          }else{
            this.$message({
              type: "error",
              message: "补发失败!请稍后重试!谢谢!"
            });
          }
          this.addressDatatwo={
          userJson:[],
          groupJson:[],
          departJson:[]
        };
        }).catch(()=>{
          this.$message({
              message: `${data.msg}`,
              type: 'error'
          });
        })
      }else {
        this.$message.error("请选择补发人员！");
      }
    }
  },
  mixins: [mixin],
  created() {
    this.getMealMenuInfos()
  },
  methods: {
      //发布
      publishMealMenus(){
          this.$confirm("您确定发布吗?", "发布", {
        type: " info"
      })
        .then(() => {          
        publishMealMenu(this.myobj)
        .then(res => {
          if (res.data.code === 200) {
            this.$message({
              type: "success",
              message: "发布成功!"
            });
            this.getMealMenuInfos();
          } else {
            this.$message({ type: "error", message: res.data.msg });
            return;
          }
        })
        .catch();
        })
        .catch(() => {});
      },
      //编辑
    orderingRecipeseidt() {
      this.$router.push({
        path: "orderingRecipeseidt",
        query: {id: this.$route.query.id}
      });
    },
    orderingRecipeslistone() {
      this.$router.push({
        path: "orderingRecipeslistone",
        query: {id: this.$route.query.id,week:this.query.week,menuType:this.$route.query.menuType}
      });
    },
      getMealMenuInfos(){
        getMealMenuInfo(this.$route.query.id).then(res => res.data)
        .then(data => {
             let mydata=data.data;
             this.query.week=mydata.week;
             this.query.limitDate=mydata.limitDate.split(':')[0]+":"+mydata.limitDate.split(':')[1];
             this.query.menuType=mydata.menuType;
             this.query.mondayDate=mydata.mondayDate;
             this.query.sundayDate=mydata.sundayDate;
             this.query.payType=mydata.payType;
             this.isShow=mydata.isShow;
             this.myobj={
                id:this.$route.query.id,//	周食谱id	number	
                menuType:mydata.menuType,//	食谱类型，1公共，2老师，3学生	number	
                schoolId:mydata.schoolId,//	学校id	number	
                schoolTimeId:mydata.schoolTimeId,//	学期id	number	
                week:mydata.week //周number	
             }
            this.mealMenuSetList=[];
            for(let i=0;i<mydata.mealMenuSetList.length;i++){               
                this.mealMenuSetList.push({
                    mealSetId: mydata.mealMenuSetList[i].mealSetId,
                    name: mydata.mealMenuSetList[i].name,
                    pic: mydata.mealMenuSetList[i].setPic,
                    setType: mydata.mealMenuSetList[i].setType,
                    content: mydata.mealMenuSetList[i].content?mydata.mealMenuSetList[i].content.replace(/\r\n/g, "<br/>").replace(/\n/g, "<br/>").replace(/\s/g, "&nbsp;"):'',
                    foodList: mydata.mealMenuSetList[i].foodListJson?JSON.parse(mydata.mealMenuSetList[i].foodListJson):[],
                    weeklist: mydata.mealMenuSetList[i].weekDays.split(","),
                    myElement: mydata.mealMenuSetList[i],
                    menuSetPrice:mydata.mealMenuSetList[i].menuSetPrice/100
                })
            }     
        });
      }
  }
};
</script>

<style lang="scss" scoped>
.orderingRecipesdetails {
  padding:12px;
  .top {
    border-bottom: 1px solid #e7eaec;
    padding-bottom: 10px;
  }
  .num-box{
    position: absolute;
    right: 300px;
    top: 85px;
    line-height: 32px;
    font-size: 14px;
    }
  .subject {
    padding-top: 10px;
    overflow: auto;
    .body {
      width: 810px;
      margin: 0 auto;
      .box {
        overflow: hidden;        
        .nav {
          height: 20px;
          line-height: 20px;
          margin: 10px;
          padding-left: 8px;
          border-left: 4px solid #409eff;
          color: #333;
          .el-icon-circle-plus-outline {
            font-size: 20px;
            margin-left: 10px;
            color: #c0c4cc;
            cursor: pointer;
          }
          .el-icon-circle-plus-outline:hover {
            color: #409eff;
          }
        }
        .box-box {
          background: #fff;
          overflow: hidden;         
          .box-box-right{
           width: 40%;
           right: 0;
           top:0;
           position:absolute;
           .h3{
            text-align: center;
            line-height: 36px;
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
               line-height: 18px;
               font-size: 14px;
               padding-left: 100px;
               height: 25px;
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
          .big-box{
              padding: 10px;
              position: relative;
              border-bottom: 3px #EBEEF5 solid;
              img{
                  float: left;
                  width: 150px;
                  height: 150px;
                  margin-right: 5px;
              }
              .big-box-top{
                overflow: hidden;
              }
              .big-box-foot{
                  line-height: 24px;
                  padding-top: 10px;
                  font-size: 14px;
              }
              .li{
                  font-size: 13px;
                  color:#606266;
                  line-height: 20px
              }
              .li-top{
                  line-height: 30px;
                  font-size: 14px;
                span{
                    margin: 0 5px;
                }
            }
          }
          .ul-top {
            .li {
                line-height: 40px;
                font-size: 14px;
                color:#303133;
              .name {
                text-align: right;
                float: left;
                width: 100px;
                padding-right: 10px;
                color:#909399;
              }
            }
            
          }
        }
      }
    }
  }
}
</style>