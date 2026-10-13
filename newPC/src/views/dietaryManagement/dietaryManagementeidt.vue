<template>
<div class="dietaryManagementeidt"  >
    <div class="top"> 
        <el-button @click="$router.back()" type="default" size="medium">返回</el-button> 
        <el-button type="primary" size="medium" @click="updateSchoolMenus(0)">保存</el-button>  
        <el-button type="primary" size="medium" @click="updateSchoolMenus(1)">发布</el-button>   
    </div>
    <div class="subject" :style="`height: ${nobottommaxH}px;`">
      <div class="body">
        <div class="box">
            <div class="nav"><span>名称周次</span></div> 
            <div class="box-box" >
                  <div class="ul-top">                    
                    <div class="li">     
                         <div class="name"><div class="red">*</div>食谱名称</div> 
                         <el-input v-model.trim="name" :maxlength="30" placeholder="请输入食谱名称"></el-input>
                    </div>
                    <div class="li">     
                         <div class="name"><div class="red">*</div>食谱周数</div>  
                          <el-select v-model="dietMenuWeek" placeholder="请选择食谱周数"  disabled >
                            <el-option   v-for="item in dietMenuWeeklist" :key="item.week"  :label="'第'+item.week+'周'" :value="item.week"></el-option>
                          </el-select>               
                    </div>
              </div>             
            </div>
        </div>
          <div class="box">
            <div class="nav"><span>周一</span> <i class="el-icon-circle-plus-outline" @click="popfun(1)"></i></div> 
            <div class="box-box" v-if="mondayFood.length>0">
                  <div class="ul">                    
                    <div class="li" v-for="(item,index) in mondayFood" :key="index">     
                        <span class="img"  :style="`background-image: url(${item.foodPic})`"></span>
                        <span>{{item.foodName}}</span>
                        <span>{{item.foodTypeName}}</span>
                        <span v-show="schoolInfotype==2||schoolInfotype==9">小低<el-input size="mini" onKeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))" v-model="item.smallLow" placeholder="请输入" :maxlength="3"></el-input>g</span>
                        <span v-show="schoolInfotype==2||schoolInfotype==9">小高<el-input size="mini" onKeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))" v-model="item.smallHeight" placeholder="请输入" :maxlength="3"></el-input>g</span>
                        <span v-show="schoolInfotype==9">初中<el-input size="mini" v-model="item.juniorMiddleSchool" onKeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))" placeholder="请输入" :maxlength="3"></el-input>g</span>
                        <span v-show="schoolInfotype!=2&&schoolInfotype!=9">每份<el-input size="mini" v-model="item.usual" onKeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))" placeholder="请输入" :maxlength="3"></el-input>g</span>
                        <el-tooltip class="item" effect="dark" content="删除" placement="top">
                          <i class="el-icon-delete" @click="deletefun(1,index)"></i>
                        </el-tooltip>                       
                    </div>
              </div>             
            </div>
             <div v-else class="noData">暂无安排！</div>
          </div>
          <div class="box">
            <div class="nav"><span>周二</span> <i class="el-icon-circle-plus-outline" @click="popfun(2)"></i></div> 
            <div class="box-box" v-if="tuesdayFood.length>0">
                  <div class="ul">                    
                    <div class="li" v-for="(item,index) in tuesdayFood" :key="index">     
                        <span class="img"  :style="`background-image: url(${item.foodPic})`"></span>
                        <span>{{item.foodName}}</span>
                        <span>{{item.foodTypeName}}</span>
                        <span v-show="schoolInfotype==2||schoolInfotype==9">小低<el-input size="mini" onKeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))" v-model="item.smallLow" placeholder="请输入" :maxlength="3"></el-input>g</span>
                        <span v-show="schoolInfotype==2||schoolInfotype==9">小高<el-input size="mini" onKeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))" v-model="item.smallHeight" placeholder="请输入" :maxlength="3"></el-input>g</span>
                        <span v-show="schoolInfotype==9">初中<el-input size="mini" v-model="item.juniorMiddleSchool" onKeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))" placeholder="请输入" :maxlength="3"></el-input>g</span>
                        <span v-show="schoolInfotype!=2&&schoolInfotype!=9">每份<el-input size="mini" v-model="item.usual" onKeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))" placeholder="请输入" :maxlength="3"></el-input>g</span>
                        <el-tooltip class="item" effect="dark" content="删除" placement="top">
                          <i class="el-icon-delete" @click="deletefun(2,index)"></i>
                        </el-tooltip>                       
                    </div>
              </div>             
            </div>
             <div v-else class="noData">暂无安排！</div>
          </div>
          <div class="box">
            <div class="nav"><span>周三</span> <i class="el-icon-circle-plus-outline" @click="popfun(3)"></i></div> 
            <div class="box-box" v-if="wednesdayFood.length>0">
                  <div class="ul">                    
                    <div class="li" v-for="(item,index) in wednesdayFood" :key="index">     
                        <span class="img"  :style="`background-image: url(${item.foodPic})`"></span>
                        <span>{{item.foodName}}</span>
                        <span>{{item.foodTypeName}}</span>
                        <span v-show="schoolInfotype==2||schoolInfotype==9">小低<el-input size="mini" onKeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))" v-model="item.smallLow" placeholder="请输入" :maxlength="3"></el-input>g</span>
                        <span v-show="schoolInfotype==2||schoolInfotype==9">小高<el-input size="mini" onKeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))" v-model="item.smallHeight" placeholder="请输入" :maxlength="3"></el-input>g</span>
                        <span v-show="schoolInfotype==9">初中<el-input size="mini" v-model="item.juniorMiddleSchool" onKeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))" placeholder="请输入" :maxlength="3"></el-input>g</span>
                        <span v-show="schoolInfotype!=2&&schoolInfotype!=9">每份<el-input size="mini" v-model="item.usual" onKeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))" placeholder="请输入" :maxlength="3"></el-input>g</span>
                        <el-tooltip class="item" effect="dark" content="删除" placement="top">
                          <i class="el-icon-delete" @click="deletefun(3,index)"></i>
                        </el-tooltip>                       
                    </div>
              </div>             
            </div>
             <div v-else class="noData">暂无安排！</div>
          </div>
          <div class="box">
            <div class="nav"><span>周四</span> <i class="el-icon-circle-plus-outline" @click="popfun(4)"></i></div> 
            <div class="box-box" v-if="thursdayFood.length>0">
                  <div class="ul">                    
                    <div class="li" v-for="(item,index) in thursdayFood" :key="index">     
                        <span class="img"  :style="`background-image: url(${item.foodPic})`"></span>
                        <span>{{item.foodName}}</span>
                        <span>{{item.foodTypeName}}</span>
                        <span v-show="schoolInfotype==2||schoolInfotype==9">小低<el-input size="mini" onKeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))" v-model="item.smallLow" placeholder="请输入" :maxlength="3"></el-input>g</span>
                        <span v-show="schoolInfotype==2||schoolInfotype==9">小高<el-input size="mini" onKeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))" v-model="item.smallHeight" placeholder="请输入" :maxlength="3"></el-input>g</span>
                        <span v-show="schoolInfotype==9">初中<el-input size="mini" v-model="item.juniorMiddleSchool" onKeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))" placeholder="请输入" :maxlength="3"></el-input>g</span>
                        <span v-show="schoolInfotype!=2&&schoolInfotype!=9">每份<el-input size="mini" v-model="item.usual" onKeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))" placeholder="请输入" :maxlength="3"></el-input>g</span>
                        <el-tooltip class="item" effect="dark" content="删除" placement="top">
                          <i class="el-icon-delete" @click="deletefun(4,index)"></i>
                        </el-tooltip>                       
                    </div>
              </div>             
            </div>
             <div v-else class="noData">暂无安排！</div>
          </div>
          <div class="box">
            <div class="nav"><span>周五</span> <i class="el-icon-circle-plus-outline" @click="popfun(5)"></i></div> 
            <div class="box-box" v-if="fridayFood.length>0">
                  <div class="ul">                    
                    <div class="li" v-for="(item,index) in fridayFood" :key="index">     
                        <span class="img"  :style="`background-image: url(${item.foodPic})`"></span>
                        <span>{{item.foodName}}</span>
                        <span>{{item.foodTypeName}}</span>
                        <span v-show="schoolInfotype==2||schoolInfotype==9">小低<el-input size="mini" onKeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))" v-model="item.smallLow" placeholder="请输入" :maxlength="3"></el-input>g</span>
                        <span v-show="schoolInfotype==2||schoolInfotype==9">小高<el-input size="mini" onKeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))" v-model="item.smallHeight" placeholder="请输入" :maxlength="3"></el-input>g</span>
                        <span v-show="schoolInfotype==9">初中<el-input size="mini" v-model="item.juniorMiddleSchool" onKeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))" placeholder="请输入" :maxlength="3"></el-input>g</span>
                        <span v-show="schoolInfotype!=2&&schoolInfotype!=9">每份<el-input size="mini" v-model="item.usual" onKeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))" placeholder="请输入" :maxlength="3"></el-input>g</span>
                        <el-tooltip class="item" effect="dark" content="删除" placement="top">
                          <i class="el-icon-delete" @click="deletefun(5,index)"></i>
                        </el-tooltip>                       
                    </div>
              </div>             
            </div>
             <div v-else class="noData">暂无安排！</div>
          </div>
          <div class="box">
            <div class="nav"><span>周六</span> <i class="el-icon-circle-plus-outline" @click="popfun(6)"></i></div> 
            <div class="box-box" v-if="saturdayFood.length>0">
                  <div class="ul">                    
                    <div class="li" v-for="(item,index) in saturdayFood" :key="index">     
                        <span class="img"  :style="`background-image: url(${item.foodPic})`"></span>
                        <span>{{item.foodName}}</span>
                        <span>{{item.foodTypeName}}</span>
                        <span v-show="schoolInfotype==2||schoolInfotype==9">小低<el-input size="mini" onKeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))" v-model="item.smallLow" placeholder="请输入" :maxlength="3"></el-input>g</span>
                        <span v-show="schoolInfotype==2||schoolInfotype==9">小高<el-input size="mini" onKeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))" v-model="item.smallHeight" placeholder="请输入" :maxlength="3"></el-input>g</span>
                        <span v-show="schoolInfotype==9">初中<el-input size="mini" v-model="item.juniorMiddleSchool" onKeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))" placeholder="请输入" :maxlength="3"></el-input>g</span>
                        <span v-show="schoolInfotype!=2&&schoolInfotype!=9">每份<el-input size="mini" v-model="item.usual" onKeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))" placeholder="请输入" :maxlength="3"></el-input>g</span>
                        <el-tooltip class="item" effect="dark" content="删除" placement="top">
                          <i class="el-icon-delete" @click="deletefun(6,index)"></i>
                        </el-tooltip>                       
                    </div>
              </div>             
            </div>
             <div v-else class="noData">暂无安排！</div>
          </div>
          <div class="box">
            <div class="nav"><span>周日</span> <i class="el-icon-circle-plus-outline" @click="popfun(7)"></i></div> 
            <div class="box-box" v-if="sundayFood.length>0">
                  <div class="ul">                    
                    <div class="li" v-for="(item,index) in sundayFood" :key="index">     
                        <span class="img"  :style="`background-image: url(${item.foodPic})`"></span>
                        <span>{{item.foodName}}</span>
                        <span>{{item.foodTypeName}}</span>
                        <span v-show="schoolInfotype==2||schoolInfotype==9">小低<el-input size="mini" onKeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))" v-model="item.smallLow" placeholder="请输入" :maxlength="3"></el-input>g</span>
                        <span v-show="schoolInfotype==2||schoolInfotype==9">小高<el-input size="mini" onKeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))" v-model="item.smallHeight" placeholder="请输入" :maxlength="3"></el-input>g</span>
                        <span v-show="schoolInfotype==9">初中<el-input size="mini" v-model="item.juniorMiddleSchool" onKeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))" placeholder="请输入" :maxlength="3"></el-input>g</span>
                        <span v-show="schoolInfotype!=2&&schoolInfotype!=9">每份<el-input size="mini" v-model="item.usual" onKeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))" placeholder="请输入" :maxlength="3"></el-input>g</span>
                        <el-tooltip class="item" effect="dark" content="删除" placement="top">
                          <i class="el-icon-delete" @click="deletefun(7,index)"></i>
                        </el-tooltip>                       
                    </div>
              </div>             
            </div>
             <div v-else class="noData">暂无安排！</div>
          </div>
      </div>
    </div>   
    <el-dialog title="选择菜品" :close-on-press-escape='false' :close-on-click-modal='false' :visible.sync="dialogVisible" width="800px" :lock-scroll="false" :modal-append-to-body='false'>
		 <div class="foot-top">        
        <el-col :span="18">
             <el-radio-group v-model="typeId">
              <el-radio-button :label="item.id" v-for="item in foodTypeList" :key="item.id">{{item.value}}</el-radio-button>
            </el-radio-group>
        </el-col>
        <el-col :span="6">
                <el-input size="medium"  placeholder="请输入菜品名称" v-model.trim="searchName">
                  <el-button size="medium" slot="append" icon="el-icon-search" ></el-button>
                </el-input>
        </el-col>
     </div>
     <div class="select-box">
       <div class="name" v-if="xuanzhonglist.length==0">菜品选中区</div>
       <div class="box"  v-for="(item,index) in xuanzhonglist" :key="index">
         <img :src="item.foodPic" alt="">{{item.foodName}}<i class="el-icon-close" @click="xuanzhonglistfun(item.foodId)"></i>
      </div>
     </div>
     <div class="food-box">
        <el-checkbox-group v-model="foodtypelist" @change="foodChange()">
          <el-checkbox  border v-for="item in foodlist" :key="item.id" :label="item.id" v-show="(item.typeId==typeId)&&indexoffun(item.name)">
            <img class="img" :src="item.pic" alt="">
            {{item.name}}
          </el-checkbox>
        </el-checkbox-group>
     </div>
			<span slot="footer" class="dialog-footer">
				<el-button  @click="dialogVisible=false">取 消</el-button>
				<el-button type="primary" @click="dialogVisiblefun()">确 定</el-button>
			</span>
		</el-dialog>   
</div> 
</template>
<script>
import {updateSchoolMenu,chooseSchoolFoodAndCount,findDicsByCode,getCurrentSchoolTimeBySchoolId,schoolMenuDetails} from "@/api/dietaryManagement";
import mixin from "@/mixins/windowResize";
import { mapGetters} from 'vuex';
export default {
  data() {
    return {
     id:this.$route.query.id,
     showMenu:'',
     mondayFood:[],//1 
     tuesdayFood:[],//2
     wednesdayFood:[],//3
     thursdayFood:[],//4
     fridayFood:[],//5
     saturdayFood:[],//6
     sundayFood:[],//7
     name:'',
     schoolInfotype:'',
     dietMenuWeek:'',
     schoolTimeId:'',
     schoolTimeName:'',
     mynum:'',
     foodTypeList:[],
     typeId:'',
     searchName:'',
     dialogVisible:false,
     dietMenuWeeklist:[],     
     foodlist:[],
     foodtypelist:[],
     xuanzhonglist:[] 
    };
  },
  mixins: [mixin],
  computed: {...mapGetters(['schoolInfo'])},
  created() {
    this.schoolInfotype=this.schoolInfo.type;
    findDicsByCode('foodType').then(res=>{                
                this.foodTypeList=res.data.data;
                this.typeId=this.foodTypeList[0].id;               
            }).catch();
   
    getCurrentSchoolTimeBySchoolId().then(res=>{                
        let mydata=res.data.data;
         this.schoolTimeId=mydata.id;
         this.schoolTimeName=mydata.schoolTimeName;
    }).catch();
     this.chooseSchoolFoodAndCounts();
     this.schoolMenuDetailss();
  },
  methods: {
    //获取详情
     schoolMenuDetailss(){
       schoolMenuDetails(this.id).then(res => res.data).then(data => {
          if(data.code==200){
            let mydata=data.data;
            this.fridayFood=mydata.fridayFood;
            this.name=mydata.name;
            this.mondayFood=mydata.mondayFood;    
            this.saturdayFood=mydata.saturdayFood;
            this.thursdayFood=mydata.thursdayFood;
            this.sundayFood=mydata.sundayFood;
            this.tuesdayFood=mydata.tuesdayFood;
            this.wednesdayFood=mydata.wednesdayFood;
            this.dietMenuWeek=mydata.dietMenuWeek;
            this.showMenu=mydata.showMenu;
            this.dietMenuWeeklist.push({week:mydata.dietMenuWeek})
          }     
       })
     },
    //保存
    updateSchoolMenus(num){
      let showMenu='';
      if(num==1){
          showMenu=1
      }else{
        showMenu=this.showMenu;
      }
      if(!this.name){
          this.$message({type: 'error', message:'请输入食谱名称!'});
          return;
      };
      if(!this.dietMenuWeek){
          this.$message({type: 'error', message:'请选择食谱周数!'});
          return;
      };
      let znum=this.mondayFood.length+this.tuesdayFood.length+this.wednesdayFood.length+this.thursdayFood.length+this.fridayFood.length+this.saturdayFood.length+this.sundayFood.length;
      if(!znum){
          this.$message({type: 'error', message:'菜谱不能为空!'});
          return;
      };          
      for(let i=0;i<this.mondayFood.length;i++){
             if(this.schoolInfotype!=2&&this.schoolInfotype!=9){
               if(!(this.mondayFood[i].usual-0)){
                 this.$message({type: 'error', message:'请输入周一菜谱中的'+this.mondayFood[i].foodName+'每份克数,不能为零！'});
                 return;
               };
             };
            if(this.schoolInfotype==2){
               if(!(this.mondayFood[i].smallLow-0)){
                 this.$message({type: 'error', message:'请输入周一菜谱中的'+this.mondayFood[i].foodName+'小低每份克数,不能为零！'});
                 return;
               };
                if(!(this.mondayFood[i].smallHeight-0)){
                 this.$message({type: 'error', message:'请输入周一菜谱中的'+this.mondayFood[i].foodName+'小高每份克数,不能为零！'});
                 return;
               };
            };
            if(this.schoolInfotype==9){
               if(!(this.mondayFood[i].smallLow-0)){
                 this.$message({type: 'error', message:'请输入周一菜谱中的'+this.mondayFood[i].foodName+'小低每份克数,不能为零！'});
                 return;
               };
               if(!(this.mondayFood[i].smallHeight-0)){
                 this.$message({type: 'error', message:'请输入周一菜谱中的'+this.mondayFood[i].foodName+'小高每份克数,不能为零！'});
                 return;
               };
               if(!(this.mondayFood[i].juniorMiddleSchool-0)){
                 this.$message({type: 'error', message:'请输入周一菜谱中的'+this.mondayFood[i].foodName+'初中每份克数,不能为零！'});
                 return;
               }
            };
      };
      for(let i=0;i<this.tuesdayFood.length;i++){
             if(this.schoolInfotype!=2&&this.schoolInfotype!=9){
               if(!(this.tuesdayFood[i].usual-0)){
                 this.$message({type: 'error', message:'请输入周二菜谱中的'+this.tuesdayFood[i].foodName+'每份克数,不能为零！'});
                 return;
               };
             };
            if(this.schoolInfotype==2){
               if(!(this.tuesdayFood[i].smallLow-0)){
                 this.$message({type: 'error', message:'请输入周二菜谱中的'+this.tuesdayFood[i].foodName+'小低每份克数,不能为零！'});
                 return;
               };
                if(!(this.tuesdayFood[i].smallHeight-0)){
                 this.$message({type: 'error', message:'请输入周二菜谱中的'+this.tuesdayFood[i].foodName+'小高每份克数,不能为零！'});
                 return;
               };
            };
            if(this.schoolInfotype==9){
               if(!(this.tuesdayFood[i].smallLow-0)){
                 this.$message({type: 'error', message:'请输入周二菜谱中的'+this.tuesdayFood[i].foodName+'小低每份克数,不能为零！'});
                 return;
               };
               if(!(this.tuesdayFood[i].smallHeight-0)){
                 this.$message({type: 'error', message:'请输入周二菜谱中的'+this.tuesdayFood[i].foodName+'小高每份克数,不能为零！'});
                 return;
               };
               if(!(this.tuesdayFood[i].juniorMiddleSchool-0)){
                 this.$message({type: 'error', message:'请输入周二菜谱中的'+this.tuesdayFood[i].foodName+'初中每份克数,不能为零！'});
                 return;
               }
            };
      };
      for(let i=0;i<this.wednesdayFood.length;i++){
             if(this.schoolInfotype!=2&&this.schoolInfotype!=9){
               if(!(this.wednesdayFood[i].usual-0)){
                 this.$message({type: 'error', message:'请输入周三菜谱中的'+this.wednesdayFood[i].foodName+'每份克数,不能为零！'});
                 return;
               };
             };
            if(this.schoolInfotype==2){
               if(!(this.wednesdayFood[i].smallLow-0)){
                 this.$message({type: 'error', message:'请输入周三菜谱中的'+this.wednesdayFood[i].foodName+'小低每份克数,不能为零！'});
                 return;
               };
                if(!(this.wednesdayFood[i].smallHeight-0)){
                 this.$message({type: 'error', message:'请输入周三菜谱中的'+this.wednesdayFood[i].foodName+'小高每份克数,不能为零！'});
                 return;
               };
            };
            if(this.schoolInfotype==9){
               if(!(this.wednesdayFood[i].smallLow-0)){
                 this.$message({type: 'error', message:'请输入周三菜谱中的'+this.wednesdayFood[i].foodName+'小低每份克数,不能为零！'});
                 return;
               };
               if(!(this.wednesdayFood[i].smallHeight-0)){
                 this.$message({type: 'error', message:'请输入周三菜谱中的'+this.wednesdayFood[i].foodName+'小高每份克数,不能为零！'});
                 return;
               };
               if(!(this.wednesdayFood[i].juniorMiddleSchool-0)){
                 this.$message({type: 'error', message:'请输入周三菜谱中的'+this.wednesdayFood[i].foodName+'初中每份克数,不能为零！'});
                 return;
               }
            };
      };
      for(let i=0;i<this.thursdayFood.length;i++){
             if(this.schoolInfotype!=2&&this.schoolInfotype!=9){
               if(!(this.thursdayFood[i].usual-0)){
                 this.$message({type: 'error', message:'请输入周四菜谱中的'+this.thursdayFood[i].foodName+'每份克数,不能为零！'});
                 return;
               };
             };
            if(this.schoolInfotype==2){
               if(!(this.thursdayFood[i].smallLow-0)){
                 this.$message({type: 'error', message:'请输入周四菜谱中的'+this.thursdayFood[i].foodName+'小低每份克数,不能为零！'});
                 return;
               };
                if(!(this.thursdayFood[i].smallHeight-0)){
                 this.$message({type: 'error', message:'请输入周四菜谱中的'+this.thursdayFood[i].foodName+'小高每份克数,不能为零！'});
                 return;
               };
            };
            if(this.schoolInfotype==9){
               if(!(this.thursdayFood[i].smallLow-0)){
                 this.$message({type: 'error', message:'请输入周四菜谱中的'+this.thursdayFood[i].foodName+'小低每份克数,不能为零！'});
                 return;
               };
               if(!(this.thursdayFood[i].smallHeight-0)){
                 this.$message({type: 'error', message:'请输入周四菜谱中的'+this.thursdayFood[i].foodName+'小高每份克数,不能为零！'});
                 return;
               };
               if(!(this.thursdayFood[i].juniorMiddleSchool-0)){
                 this.$message({type: 'error', message:'请输入周四菜谱中的'+this.thursdayFood[i].foodName+'初中每份克数,不能为零！'});
                 return;
               }
            };
      };
      for(let i=0;i<this.fridayFood.length;i++){
             if(this.schoolInfotype!=2&&this.schoolInfotype!=9){
               if(!(this.fridayFood[i].usual-0)){
                 this.$message({type: 'error', message:'请输入周五菜谱中的'+this.fridayFood[i].foodName+'每份克数,不能为零！'});
                 return;
               };
             };
            if(this.schoolInfotype==2){
               if(!(this.fridayFood[i].smallLow-0)){
                 this.$message({type: 'error', message:'请输入周五菜谱中的'+this.fridayFood[i].foodName+'小低每份克数,不能为零！'});
                 return;
               };
                if(!(this.fridayFood[i].smallHeight-0)){
                 this.$message({type: 'error', message:'请输入周五菜谱中的'+this.fridayFood[i].foodName+'小高每份克数,不能为零！'});
                 return;
               };
            };
            if(this.schoolInfotype==9){
               if(!(this.fridayFood[i].smallLow-0)){
                 this.$message({type: 'error', message:'请输入周五菜谱中的'+this.fridayFood[i].foodName+'小低每份克数,不能为零！'});
                 return;
               };
               if(!(this.fridayFood[i].smallHeight-0)){
                 this.$message({type: 'error', message:'请输入周五菜谱中的'+this.fridayFood[i].foodName+'小高每份克数,不能为零！'});
                 return;
               };
               if(!(this.fridayFood[i].juniorMiddleSchool-0)){
                 this.$message({type: 'error', message:'请输入周五菜谱中的'+this.fridayFood[i].foodName+'初中每份克数,不能为零！'});
                 return;
               }
            };
      };
      for(let i=0;i<this.saturdayFood.length;i++){
             if(this.schoolInfotype!=2&&this.schoolInfotype!=9){
               if(!(this.saturdayFood[i].usual-0)){
                 this.$message({type: 'error', message:'请输入周六菜谱中的'+this.saturdayFood[i].foodName+'每份克数,不能为零！'});
                 return;
               };
             };
            if(this.schoolInfotype==2){
               if(!(this.saturdayFood[i].smallLow-0)){
                 this.$message({type: 'error', message:'请输入周六菜谱中的'+this.saturdayFood[i].foodName+'小低每份克数,不能为零！'});
                 return;
               };
                if(!(this.saturdayFood[i].smallHeight-0)){
                 this.$message({type: 'error', message:'请输入周六菜谱中的'+this.saturdayFood[i].foodName+'小高每份克数,不能为零！'});
                 return;
               };
            };
            if(this.schoolInfotype==9){
               if(!(this.saturdayFood[i].smallLow-0)){
                 this.$message({type: 'error', message:'请输入周六菜谱中的'+this.saturdayFood[i].foodName+'小低每份克数,不能为零！'});
                 return;
               };
               if(!(this.saturdayFood[i].smallHeight-0)){
                 this.$message({type: 'error', message:'请输入周六菜谱中的'+this.saturdayFood[i].foodName+'小高每份克数,不能为零！'});
                 return;
               };
               if(!(this.saturdayFood[i].juniorMiddleSchool-0)){
                 this.$message({type: 'error', message:'请输入周六菜谱中的'+this.saturdayFood[i].foodName+'初中每份克数,不能为零！'});
                 return;
               }
            };
      };
      for(let i=0;i<this.sundayFood.length;i++){
             if(this.schoolInfotype!=2&&this.schoolInfotype!=9){
               if(!(this.sundayFood[i].usual-0)){
                 this.$message({type: 'error', message:'请输入周日菜谱中的'+this.sundayFood[i].foodName+'每份克数,不能为零！'});
                 return;
               };
             };
            if(this.schoolInfotype==2){
               if(!(this.sundayFood[i].smallLow-0)){
                 this.$message({type: 'error', message:'请输入周日菜谱中的'+this.sundayFood[i].foodName+'小低每份克数,不能为零！'});
                 return;
               };
                if(!(this.sundayFood[i].smallHeight-0)){
                 this.$message({type: 'error', message:'请输入周日菜谱中的'+this.sundayFood[i].foodName+'小高每份克数,不能为零！'});
                 return;
               };
            };
            if(this.schoolInfotype==9){
               if(!(this.sundayFood[i].smallLow-0)){
                 this.$message({type: 'error', message:'请输入周日菜谱中的'+this.sundayFood[i].foodName+'小低每份克数,不能为零！'});
                 return;
               };
               if(!(this.sundayFood[i].smallHeight-0)){
                 this.$message({type: 'error', message:'请输入周日菜谱中的'+this.sundayFood[i].foodName+'小高每份克数,不能为零！'});
                 return;
               };
               if(!(this.sundayFood[i].juniorMiddleSchool-0)){
                 this.$message({type: 'error', message:'请输入周日菜谱中的'+this.sundayFood[i].foodName+'初中每份克数,不能为零！'});
                 return;
               }
            };
      };
      let obj={
        mondayFoodStr:JSON.stringify(this.mondayFood),//1 
        tuesdayFoodStr:JSON.stringify(this.tuesdayFood),//2
        wednesdayFoodStr:JSON.stringify(this.wednesdayFood),//3
        thursdayFoodStr:JSON.stringify(this.thursdayFood),//4
        fridayFoodStr:JSON.stringify(this.fridayFood),//5
        saturdayFoodStr:JSON.stringify(this.saturdayFood),//6
        sundayFoodStr:JSON.stringify(this.sundayFood),//7
        name:this.name,
        dietMenuWeek:this.dietMenuWeek,
        schoolTimeId:this.schoolTimeId,
        schoolTimeName:this.schoolTimeName,
        showMenu:showMenu,
        id:this.id
      };
      let $this=this;
      updateSchoolMenu(obj)
              .then(res => {
                if (res.data.code === 200) {
                  $this.$message({
                    type: "success",
                    message: "操作成功!"
                  });
                  $this.$router.back();
                }                
              }).catch();
    },
   //删除
   deletefun(num,index){
      if(num==1){
        this.mondayFood.splice(index,1)
      };
      if(num==2){
        this.tuesdayFood.splice(index,1)
      };
      if(num==3){
        this.wednesdayFood.splice(index,1)
      };
      if(num==4){
        this.thursdayFood.splice(index,1)
      };
      if(num==5){
        this.fridayFood.splice(index,1)
      };
      if(num==6){
        this.saturdayFood.splice(index,1)
      };
      if(num==7){
        this.sundayFood.splice(index,1)
      };
   },
   //删除选中的菜品
   xuanzhonglistfun(id){
    for(let i=0;i<this.foodtypelist.length;i++){
        if(this.foodtypelist[i]==id){          
          this.foodtypelist.splice(i,1)
        };
    };
    this.foodChange();
   },
   //弹框
   popfun(num){
     this.mynum=num;
     this.typeId=this.foodTypeList[0].id;
     this.dialogVisible=true;
     this.foodtypelist=[];
     this.xuanzhonglist=[];
   },
   //弹框勾选
   foodChange(){   	
     this.xuanzhonglist=[];
     for(let i=0;i<this.foodtypelist.length;i++){
       for(let j=0;j<this.foodlist.length;j++){
         if(this.foodtypelist[i]==this.foodlist[j].id){
           let highSchool='0';
           let juniorMiddleSchool='0';
           let smallHeight='0';
           let smallLow='0';
           let usual='0';
           if(this.schoolInfotype==1){
             usual=this.foodlist[j].kindergarten;
           };
           if(this.schoolInfotype==2){
             smallHeight=this.foodlist[j].smallHeight;
             smallLow=this.foodlist[j].smallLow;
           };
           if(this.schoolInfotype==3||this.schoolInfotype==6){
              usual=this.foodlist[j].juniorMiddleSchool;
              // juniorMiddleSchool=this.foodlist[j].juniorMiddleSchool;
           };
           if(this.schoolInfotype==4){
             highSchool=this.foodlist[j].highSchool;
             usual=this.foodlist[j].highSchool;
           };
           if(this.schoolInfotype==9){
             smallHeight=this.foodlist[j].smallHeight;
             smallLow=this.foodlist[j].smallLow;
             juniorMiddleSchool=this.foodlist[j].juniorMiddleSchool;
           }; 
            if(this.schoolInfotype==10){
             usual=this.foodlist[j].smallHeight;
           };           
          this.xuanzhonglist.push({
            foodId:this.foodlist[j].id,
            foodName:this.foodlist[j].name,
            foodPic:this.foodlist[j].pic,
            foodTypeId:this.foodlist[j].typeId,
            foodTypeName:this.foodlist[j].typeName,
            highSchool:highSchool,
            juniorMiddleSchool:juniorMiddleSchool,
            smallHeight:smallHeight,
            smallLow:smallLow,
            usual:usual,
          })
         }
       }
     }
   },
   //搜索
   indexoffun(name){
     if(!this.searchName){
       return true;
     }else{
         return name.indexOf(this.searchName) != -1;
     };   
   },
   //确定取消
   dialogVisiblefun(){
     this.dialogVisible=false;
     if(this.xuanzhonglist.length==0){
          this.$message({type: 'error', message:'请选择菜品!'});
          return;
     }else{
        if(this.mynum==1){    
          let foodName='';      
          for(let i=0;i<this.xuanzhonglist.length;i++){
             let is=true;
             for(let j=0;j<this.mondayFood.length;j++){
               if(this.xuanzhonglist[i].foodId==this.mondayFood[j].foodId){
                 is=false;
               }
             };
             if(is){
                this.mondayFood.push(this.xuanzhonglist[i])
             }else{
               foodName+=this.xuanzhonglist[i].foodName;
             }
          }
          if(foodName!=''){
            this.$message({type: 'error', message:foodName+'菜品重复!'});
          }
        };
        if(this.mynum==2){
          let foodName='';      
          for(let i=0;i<this.xuanzhonglist.length;i++){
             let is=true;
             for(let j=0;j<this.tuesdayFood.length;j++){
               if(this.xuanzhonglist[i].foodId==this.tuesdayFood[j].foodId){
                 is=false;
               }
             };
             if(is){
                this.tuesdayFood.push(this.xuanzhonglist[i])
             }else{
               foodName+=this.xuanzhonglist[i].foodName;
             }
          }
          if(foodName){
            this.$message({type: 'error', message:foodName+'菜品重复!'});
          }
        };
        if(this.mynum==3){
          for(let i=0;i<this.xuanzhonglist.length;i++){
             let is=true;
             for(let j=0;j<this.wednesdayFood.length;j++){
               if(this.xuanzhonglist[i].foodId==this.wednesdayFood[j].foodId){
                 is=false;
               }
             };
             if(is){
                this.wednesdayFood.push(this.xuanzhonglist[i])
             }else{
               foodName+=this.xuanzhonglist[i].foodName;
             }
          }
          if(foodName){
            this.$message({type: 'error', message:foodName+'菜品重复!'});
          }
        };
        if(this.mynum==4){
          for(let i=0;i<this.xuanzhonglist.length;i++){
             let is=true;
             for(let j=0;j<this.thursdayFood.length;j++){
               if(this.xuanzhonglist[i].foodId==this.thursdayFood[j].foodId){
                 is=false;
               }
             };
             if(is){
                this.thursdayFood.push(this.xuanzhonglist[i])
             }else{
               foodName+=this.xuanzhonglist[i].foodName;
             }
          }
          if(foodName){
            this.$message({type: 'error', message:foodName+'菜品重复!'});
          }
        };
        if(this.mynum==5){
          for(let i=0;i<this.xuanzhonglist.length;i++){
             let is=true;
             for(let j=0;j<this.fridayFood.length;j++){
               if(this.xuanzhonglist[i].foodId==this.fridayFood[j].foodId){
                 is=false;
               }
             };
             if(is){
                this.fridayFood.push(this.xuanzhonglist[i])
             }else{
               foodName+=this.xuanzhonglist[i].foodName;
             }
          }
          if(foodName){
            this.$message({type: 'error', message:foodName+'菜品重复!'});
          }
        };
        if(this.mynum==6){
          for(let i=0;i<this.xuanzhonglist.length;i++){
             let is=true;
             for(let j=0;j<this.saturdayFood.length;j++){
               if(this.xuanzhonglist[i].foodId==this.saturdayFood[j].foodId){
                 is=false;
               }
             };
             if(is){
                this.saturdayFood.push(this.xuanzhonglist[i])
             }else{
               foodName+=this.xuanzhonglist[i].foodName;
             }
          }
          if(foodName){
            this.$message({type: 'error', message:foodName+'菜品重复!'});
          }
        };
        if(this.mynum==7){
          for(let i=0;i<this.xuanzhonglist.length;i++){
             let is=true;
             for(let j=0;j<this.sundayFood.length;j++){
               if(this.xuanzhonglist[i].foodId==this.sundayFood[j].foodId){
                 is=false;
               }
             };
             if(is){
                this.sundayFood.push(this.xuanzhonglist[i])
             }else{
               foodName+=this.xuanzhonglist[i].foodName;
             }
          }
          if(foodName){
            this.$message({type: 'error', message:foodName+'菜品重复!'});
          }
        };
     }
   },
   //获取菜品
   chooseSchoolFoodAndCounts(){
     chooseSchoolFoodAndCount('','0').then(res=>{                
                let mydata=res.data.data;
                this.foodlist=mydata;
            }).catch();
   }
  }
};
</script>
<style lang="scss" scoped>
.dietaryManagementeidt {
   padding:12px;
    *{
          box-sizing: border-box;
        }  
  .top {
    border-bottom: 1px solid #e7eaec;
    padding-bottom: 10px;
  }
  .el-dialog__body{
    padding: 10px;
  }
  .foot-top{
    overflow: hidden;
  }
  .select-box{
    height: 50px;
    margin: 10px 0;
    border-top: 1px #EBEEF5 solid;
    border-bottom: 1px #EBEEF5 solid;
    padding: 5px;
    overflow: auto;
    .name{
      line-height: 38px;
      font-size: 20px;
      color:#C0C4CC;
    }
    .box{
      float: left;
      height: 38px;      
      img{
        float: left;
        width: 30px;
        height: 30px;
      }
      line-height: 30px;
      font-size: 14px;
      border:1px  #EBEEF5 solid;
      padding: 3px;
      border-radius: 3px;
      margin-right: 5px;
      i{
        font-size: 18px;
        cursor:pointer;        
      }
      i:hover{
        color:#f56c6c;
      }
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
    .el-checkbox.is-bordered {        
          height: 80px;
          min-width: 130px;
          padding: 50px 10px 10px 10px;
          margin: 5px;
      }
  }
  .subject {
    padding-top: 10px;
    overflow: auto;
    .body{
      width: 810px;
      margin: 0 auto;
      .el-form-item {
                margin-bottom: 0px;              
      }
      .box{          
        overflow: hidden;       
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
          .el-icon-circle-plus-outline{
                  font-size: 20px;
                  margin-left: 10px;
                  color: #C0C4CC;
                  cursor: pointer;                 
               }
                .el-icon-circle-plus-outline:hover{
                    color:#409EFF
                  }         
        }
        .box-box{
          background: #fff;
          overflow: hidden;
          .ul-top{
            .li{
              position: relative;
              padding:10px 10px 10px 110px;
              .el-select{
                  width: 100%;
                }
              .name{
                position: absolute;
                width: 100px;
                text-align: right;
                top: 10px;
                left: 0px;
                line-height: 40px;
                font-size: 14px;               
                .red{
                  display: inline;
                  color:#f56c6c;
                }

              }
            }
          }
          .ul{              
            .li{
               overflow: hidden;
               padding:5px 0;
               border-bottom: 1px #EBEEF5 solid;
               span{
                float: left;
                line-height: 40px;
                width: 140px;
                font-size: 14px;
                color: #606266;
                text-align: center;  
                .el-input {
                    width: 70px;
                    margin: 0 5px;
                }         
               } 
               .el-icon-delete{
                  line-height: 40px;
                  font-size: 20px;
                  float: right;
                  margin-right: 10px;
                  color: #606266;
                  cursor:pointer;                  
               }
                .el-icon-delete:hover{
                    color:#F56C6C
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
    }
    
  }
    
  }
   
}
</style>