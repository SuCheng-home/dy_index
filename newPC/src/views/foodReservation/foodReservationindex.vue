<template>
<div class="foodReservationindex"  >
     <div class="top"> 
         <el-select v-model="typeId" v-if="bigishide==1" size="medium" placeholder="请选择食品分类" @change="getShelfPastryByTypeIds()">
                <el-option :label="item.typeName" :value="item.id"  v-for="(item,index) in typelist" :key="index"></el-option>
         </el-select>
         <el-button type="primary" size="medium" @click="foodReservationlibraryindex()">食品库</el-button>
         <el-button type="primary" size="medium" v-if="bigishide==1" @click="foodReservationrelease()">发布上架食品</el-button>     
         <el-button type="primary" size="medium" v-if="isShowByPermission('/pastry/typeSet')" @click="foodReservationclassification()">食品分类设置</el-button>         
         <el-button type="primary" size="medium" v-if="bigishide==1" @click="popfun()">食品上架</el-button>
      </div>
     <div class="subject" :style="`height: ${nobottommaxH}px;`">
       <div class="body" v-if="bigishide==1">         
         <div class="ul" v-if="ishide==1">
           <div class="li" v-for="(items,indexs) in datalist" :key="indexs">
              <img :src="items.pastryUrl" alt="">
              <el-checkbox-group  v-model="items.weekDaylist" @change="managePastryWeekDays(items.id,items.weekDaylist)">
                <el-checkbox v-for="(item,index) in weeklist" :label="item.id" :key="index">{{item.name}}</el-checkbox>
              </el-checkbox-group>
              <div class="button">
                <el-button type="danger" size="mini" plain icon="el-icon-close" circle @click="downShelfPastrys(items.id)"></el-button>
              </div>
           </div>
         </div>
          <default-page Mes="此类型下暂无食品" v-if="ishide==2"></default-page>   
       </div>
       <default-page Mes="暂无负责类型" v-if="bigishide==2"></default-page>       
     </div>
    <el-dialog title="请选择上架食品" :close-on-press-escape='false' :close-on-click-modal='false' :visible.sync="dialogVisible" width="800px" :lock-scroll="false" :modal-append-to-body='false'>
		 <div class="food-box">
        <el-checkbox-group v-model="foodtypelist">
          <el-checkbox  border v-for="item in foodlist" :key="item.id" :label="item.id">
            <img class="img" :src="item.pastryUrl" alt="">
            {{item.pastryName}}
          </el-checkbox>
        </el-checkbox-group>
         <default-page Mes="此类型下暂无未上架食品" v-if="popishide==2"></default-page>
     </div>
			<span slot="footer" class="dialog-footer">
				<el-button  @click="dialogVisible=false">取 消</el-button>
				<el-button type="primary" @click="dialogVisiblefun()">确 定</el-button>
			</span>
		</el-dialog> 
</div> 
</template>
<script>
import {getTypeListByUserId,getShelfPastryByTypeId,getDownShelfPastryByTypeId,addShelf,downShelfPastry,managePastryWeekDay} from "@/api/foodReservation";
import mixin from "@/mixins/windowResize";
import DefaultPage from "@/components/DefaultPage";
import {mapGetters} from 'vuex';
import { isShowByPermission} from "@/utils";
export default {
  data() {
    return {
      datalist: [],
      typelist:[],
      weeklist:[{name:'周一',id:'1'},{name:'周二',id:'2'},{name:'周三',id:'3'},{name:'周四',id:'4'},{name:'周五',id:'5'},{name:'周六',id:'6'},{name:'周日',id:'7'}],
      bigishide:0,
      ishide:0,
      popishide:0,
      typeId:'',
      dialogVisible:false,
      foodtypelist:[],
      foodlist:[]
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
    isShowByPermission,
    //获取负责的类型
     getTypeListByUserIds(){
        getTypeListByUserId().then(res => res.data).then(data => {
           this.typelist=data.data;
           if(this.typelist.length){
              this.typeId=this.typelist[0].id;
              this.bigishide=1;
              this.getShelfPastryByTypeIds();
           }else{
              this.bigishide=2;
           }
        })
    },
    //弹框
   popfun(){
     this.dialogVisible=true;
     this.foodtypelist=[];
     this.getDownShelfPastryByTypeIds();
   },
    //确定取消
   dialogVisiblefun(){    
      if(this.foodtypelist.length==0){
          this.$message({type: 'error', message:'请选择食品!'});
          return;
      };
       addShelf(this.foodtypelist.join(',')) .then(res => res.data).then(data => {
                                    if(data.result) {
                                        this.$message({
                                            message: '上架成功！',
                                            type: 'success',
                                            duration: 1000
                                        });
                                        this.getShelfPastryByTypeIds();
                }
            }).catch(() => {})     
      this.dialogVisible=false;
      this.popishide=0;
   },
   //获取未发布
    getDownShelfPastryByTypeIds(){
        getDownShelfPastryByTypeId(this.schoolInfo.id,this.typeId).then(res => res.data).then(data => {
          let mydata=data.data;
          this.foodlist=mydata;
          if(this.foodlist.length){
            this.popishide=1;
          }else{
              this.popishide=2;
          }
        })
    },
    //获取已发布的
    getShelfPastryByTypeIds(){
        getShelfPastryByTypeId(this.schoolInfo.id,this.typeId).then(res => res.data).then(data => {
          let mydata=data.data;
          for(let i=0;i<mydata.length;i++){
            this.$set( mydata[i], "weekDaylist", []);
            if(mydata[i].weekDay){
              mydata[i].weekDaylist=mydata[i].weekDay.split(',');
            }
          }
          this.datalist=mydata;
          if(this.datalist.length){
            this.ishide=1;
          }else{
              this.ishide=2;
          }
        })
    },
    //分类
    foodReservationclassification(){
         this.$router.push({
            path: "foodReservationclassification"
          });
    },
    //食品库
    foodReservationlibraryindex(){
         this.$router.push({
            path: "foodReservationlibraryindex"
          });
    },
    //发布
    foodReservationrelease(){
         this.$router.push({
            path: "foodReservationrelease"
          });
    },
    //下架
    downShelfPastrys(id){
        this.$confirm("确定要下架吗？", "提示", {
        type: "warning"
      })
        .then(() => {
          downShelfPastry(id)
            .then(res => {
              if (res.data.code === 200) {
                this.$message({
                  type: "success",
                  message: "下架成功!"
                });
               this.getShelfPastryByTypeIds()
              }
            })
            .catch(err => {});
        })
        .catch(() => {});

    },
    //上架
    managePastryWeekDays(id,week){
      managePastryWeekDay(id,week.join(',')).then(res => res.data).then(data => {
          if(data.result) {
            this.getShelfPastryByTypeIds()
          }
      }).catch(() => {})      
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
      .li{
        float: left;
        width: 200px;
        margin: 10px;
        border: 1px solid #d7dae2;
        border-radius: 4px;
        padding: 10px;
        position: relative;
        img{
          display: block;
          width: 180px;
          height: 180px;
          margin-bottom: 10px;
        }
        .el-checkbox {
            margin-right: 6px;
        }
        .button{
            position: absolute;
            top: 15px;
            right: 15px;
        }
      }
    }
  }
  .food-box{
      height: 240px;
      overflow: auto;
      border-bottom: 1px #EBEEF5 solid;
    .img{
        width: 45px;
        height: 45px;
        left: 40px;
        position: absolute;
        top: 5px;
    }
    .el-checkbox.is-bordered {        
          height: 80px;
          min-width: 130px;
          padding: 50px 10px 10px 10px;
          margin: 5px;
      }
  }
}
</style>