<template>
<div class="foodReservationindex"  >
     <div class="top"> 
          <el-button @click="$router.back()" type="default" size="medium">返回</el-button>
         <el-select v-model="typeId" size="medium" placeholder="请选择食品分类" @change="weekShelfPastrys()">
                <el-option :label="item.typeName" :value="item.id"  v-for="(item,index) in typelist" :key="index"></el-option>
         </el-select>
         <el-button type="primary" size="medium"  v-if="ishide!=2" @click="sendWeekPastryMessages()">发布</el-button>
      </div>
     <div class="subject" :style="`height: ${nobottommaxH}px;`">
       <div class="body">         
         <div class="ul" v-if="myobj.mondayPastryList.length">
           <div class="ul-top"><div>周一</div></div>
           <div class="li" v-for="(items,indexs) in myobj.mondayPastryList" :key="indexs">
              <img :src="items.pastryUrl" alt="">
              {{items.pastryName}}&nbsp;&nbsp;<span>￥{{items.pastryPrice/100}}</span>
           </div>
         </div>
         <div class="ul" v-if="myobj.tuesdayPastryList.length">
           <div class="ul-top"><div>周二</div></div>
           <div class="li" v-for="(items,indexs) in myobj.tuesdayPastryList" :key="indexs">
              <img :src="items.pastryUrl" alt="">
              {{items.pastryName}}&nbsp;&nbsp;<span>￥{{items.pastryPrice/100}}</span>
           </div>
         </div>
         <div class="ul" v-if="myobj.wednesdayPastryList.length">
           <div class="ul-top"><div>周三</div></div>
           <div class="li" v-for="(items,indexs) in myobj.wednesdayPastryList" :key="indexs">
              <img :src="items.pastryUrl" alt="">
              {{items.pastryName}}&nbsp;&nbsp;<span>￥{{items.pastryPrice/100}}</span>
           </div>
         </div>
         <div class="ul" v-if="myobj.thursdayPastryList.length">
           <div class="ul-top"><div>周四</div></div>
           <div class="li" v-for="(items,indexs) in myobj.thursdayPastryList" :key="indexs">
              <img :src="items.pastryUrl" alt="">
              {{items.pastryName}}&nbsp;&nbsp;<span>￥{{items.pastryPrice/100}}</span>
           </div>
         </div>
         <div class="ul" v-if="myobj.fridayPastryList.length">
           <div class="ul-top"><div>周五</div></div>
           <div class="li" v-for="(items,indexs) in myobj.fridayPastryList" :key="indexs">
              <img :src="items.pastryUrl" alt="">
              {{items.pastryName}}&nbsp;&nbsp;<span>￥{{items.pastryPrice/100}}</span>
           </div>
         </div>
         <div class="ul" v-if="myobj.saturdayPastryList.length">
           <div class="ul-top"><div>周六</div></div>
           <div class="li" v-for="(items,indexs) in myobj.saturdayPastryList" :key="indexs">
              <img :src="items.pastryUrl" alt="">
              {{items.pastryName}}&nbsp;&nbsp;<span>￥{{items.pastryPrice/100}}</span>
           </div>
         </div>
         <div class="ul" v-if="myobj.sundayPastryList.length">
           <div class="ul-top"><div>周日</div></div>
           <div class="li" v-for="(items,indexs) in myobj.sundayPastryList" :key="indexs">
              <img :src="items.pastryUrl" alt="">
              {{items.pastryName}}&nbsp;&nbsp;<span>￥{{items.pastryPrice/100}}</span>
           </div>
         </div>
          <default-page Mes="此类型下暂无待发布食品" v-if="ishide==2"></default-page>   
       </div>       
     </div>
   
</div> 
</template>
<script>
import {weekShelfPastry,getTypeListByUserId,sendWeekPastryMessage} from "@/api/foodReservation";
import mixin from "@/mixins/windowResize";
import DefaultPage from "@/components/DefaultPage";
import {mapGetters} from 'vuex';
export default {
  data() {
    return {
      ishide:0,
      typeId:'',
      typelist:[],
      myobj:{
        mondayPastryList:[],
        fridayPastryList:[],
        saturdayPastryList:[],
        sundayPastryList:[],
        thursdayPastryList:[],
        tuesdayPastryList:[],
        wednesdayPastryList:[]
      }
    };
  },
  mixins: [mixin],
  computed: {
    ...mapGetters(['schoolInfo']),
  },
  created() {
    this.getTypeListByUserIds();
  },
  components: { DefaultPage},
  methods: {
    //获取负责的类型
     getTypeListByUserIds(){
        getTypeListByUserId().then(res => res.data).then(data => {
           this.typelist=data.data;
           if(this.typelist.length){
              this.typeId=this.typelist[0].id;
              this.weekShelfPastrys();
           }
        })
    },
    //获取食品
    weekShelfPastrys(){
        weekShelfPastry(this.schoolInfo.id,this.typeId).then(res => res.data).then(data => {
          let myobj=data.data;
          this.myobj=myobj; 
          if(myobj.mondayPastryList.length||myobj.fridayPastryList.length||myobj.saturdayPastryList.length||myobj.sundayPastryList.length||myobj.thursdayPastryList.length||myobj.tuesdayPastryList.length||myobj.wednesdayPastryList.length) {
            this.ishide=0;
          }else{
            this.ishide=2;
          }       
        })
    },
    //发布
    sendWeekPastryMessages(){
         this.$confirm("确定要发布吗？", "提示", {
        type: "warning"
      })
        .then(() => {
            let name='';
            for(let i=0;i<this.typelist.length;i++){
                 if(this.typelist[i].id==this.typeId){
                   name=this.typelist[i].typeName;
                 }
            }
          sendWeekPastryMessage(JSON.stringify(this.myobj),this.typeId,name)
            .then(res => {
              if (res.data.code === 200) {
                this.$message({
                  type: "success",
                  message: "发布成功!"
                });     
                 this.$router.back();          
              }
            })
            .catch(err => {});
        })
        .catch(() => {});
    }
    
  }
};
</script>
<style lang="scss" scoped>
.foodReservationindex{
  padding:12px;
  .top {
    border-bottom: 1px solid #e7eaec;
    padding-bottom: 10px;
  }
  .subject {
    padding-top: 10px;
    overflow: auto;
    .ul{
        overflow: hidden;
        width: 810px;
        margin: 5px auto;         
        .ul-top{
            // background-color: #f0f0f0;
                padding: 5px 0;
           div{
                height: 20px;
            line-height: 20px;
            margin: 5px;
            padding-left: 8px;
            border-left: 4px solid #409eff;
            color: #333;
           }
               
        }
        .li{
            float: left;
            width: 270px;
            margin: 10px 0;
            line-height: 60px;
            color: #303133;
            font-size: 14px;
            img{
                height: 60px;
                width: 60px;
                float: left;
                margin-right:8px;
            }
            span{
                color: #409eff
            }
        }
    }
   
  }
  
}
</style>