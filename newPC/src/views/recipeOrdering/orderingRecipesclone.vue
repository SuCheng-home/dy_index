<template>
<div class="orderingRecipesclone"  >
     <div class="top"> 
         <el-button @click="$router.back()" type="default" size="medium">返回</el-button>
         <el-button type="primary" size="medium"    @click="insertMealMenus(0)">保存</el-button>
         <el-button type="primary" size="medium"    @click="insertMealMenus(1)">发布</el-button>      
      </div>
     <div class="subject " :style="`height: ${nobottommaxH}px;`">
            <div class="body"> 
                <div class="box">
                    <div class="nav"><span>食谱信息</span></div> 
                    <div class="box-box">
                        <div class="ul-top"> 
                            <div class="li">     
                                <div class="name"><div class="red">*</div>食谱周次</div>  
                                <el-select v-model="query.week"  placeholder="请选择食谱周次" @change="weekfun()">
                                    <el-option   v-for="item in dietMenuWeeklist" :key="item.week"  :label="'第'+item.week+'周'" :value="item.week"></el-option>
                                </el-select>   
                                （{{query.mondayDate}} ~ {{query.sundayDate}}）         
                            </div>
                             <div class="li">     
                                <div class="name"><div class="red">*</div>类型</div> 
                                <el-radio-group v-model="query.menuType" >
                                    <el-radio :label="1">公共</el-radio>
                                    <el-radio :label="2">老师</el-radio>
                                    <el-radio :label="3">学生</el-radio>
                                    <el-radio :label="4">指定范围</el-radio>
                                </el-radio-group>                                         
                            </div>
                            <div class="li" v-if="query.menuType==4">     
                                <div class="name">学生范围</div> 
                                    <address-book v-model="stuaddressData" :config="stuConfigData"  :isSchoolManager="true"></address-book>
                                                                                                                                        
                            </div>
                             <div class="li"  v-if="query.menuType==4">     
                                <div class="name">老师范围</div> 
                                    <address-book v-model="thaddressData" :config="thConfigData"  :isSchoolManager="true"></address-book>
                                                                                                                               
                            </div>
                            <div class="li">     
                                <div class="name">推送提醒</div> 
                                <div class="li-box">
                                  <el-checkbox v-model="query.remindStatus">是否推送提醒</el-checkbox>
                                </div>                                 
                            </div>
                            <div class="li">     
                                <div class="name"><div class="red">*</div>截止时间</div> 
                                 <el-date-picker v-model="query.limitDate" type="datetime" format="yyyy-MM-dd HH:mm" :editable="false" :clearable="false" placeholder="选择截止时间"></el-date-picker>                                        
                            </div>
                             <div class="li">     
                                <div class="name">支付设置</div> 
                                <div class="li-box">
                                   <el-checkbox v-model="payType">是否开启线上支付</el-checkbox>
                                </div>                                                                                                         
                            </div>
                       </div>              
                    </div>
                </div>
                <div class="box">
                    <div class="nav"><span>套餐信息</span> <i class="el-icon-circle-plus-outline"  @click="popfun()"></i></div> 
                    <div class="box-box" >
                      <div class="big-box" v-for="(items,indexs) in mealMenuSetList" :key="indexs">  
                        <div class="ul-top"> 
                            <div class="li">     
                                <div class="name"><div class="red">*</div>提供日期</div>
                                <el-checkbox-group v-model="items.weeklist">
                                    <el-checkbox label="1">周一</el-checkbox>
                                    <el-checkbox label="2">周二</el-checkbox>
                                    <el-checkbox label="3">周三</el-checkbox>
                                    <el-checkbox label="4">周四</el-checkbox>
                                    <el-checkbox label="5">周五</el-checkbox>
                                    <el-checkbox label="6">周六</el-checkbox>
                                    <el-checkbox label="7">周日</el-checkbox>
                                </el-checkbox-group>  
                            </div>                             
                       </div>   
                        <div class="num-box" v-if="payType">
                        <span>* </span>
                        套餐餐标：
                          <el-input-number v-model="items.menuSetPrice"  :min="0.01" :max="100" :precision="2" size="small"  :step="0.5" label="请输入价格"></el-input-number>
                        （元）
                      </div>
                      <el-tag size="small" v-if="items.setType==1" type="success">早餐</el-tag>
                      <el-tag size="small" v-if="items.setType==2">午餐</el-tag>
                      <el-tag size="small" v-if="items.setType==3" type="warning">晚餐</el-tag>
                        <div class="big-box-top">
                          <img :src="items.pic" alt=""> 
                          <div v-if="items.foodList.length">
                              <div class="li"  v-for="(item,index) in items.foodList" :key="index">{{item.name}}&nbsp;&nbsp;{{item.weight}}g</div>
                          </div>
                          <div v-else >
                              <div v-html="items.content"></div>  
                          </div>                          
                        </div> 
                        <div class="big-box-foot">{{items.name}} </div> 
                        <i class="el-icon-delete" @click="deletefun(indexs)"></i>   
                        <div class="i-box" v-if="mealMenuSetList.length>1">
                              <i class="el-icon-arrow-up" @click="funUpanddown(indexs,0)" v-if="indexs!=0"></i>
                              <i class="el-icon-arrow-down" @click="funUpanddown(indexs,1)" v-if="indexs!=(mealMenuSetList.length-1)"></i>
                        </div>              
                    </div>
                    </div>
                    <div class="noData" v-if="mealMenuSetList.length==0">暂无套餐！</div>
                </div>
            </div> 
             <el-dialog title="选择套餐" :close-on-press-escape='false' :close-on-click-modal='false' :visible.sync="dialogVisible" width="800px" :lock-scroll="false" :modal-append-to-body='false'>
		 <div class="foot-top">  
             <el-radio-group v-model="typeId">
              <el-radio-button :label="1">早餐</el-radio-button>
              <el-radio-button :label="2">午餐</el-radio-button>
              <el-radio-button :label="3">晚餐</el-radio-button>
            </el-radio-group>
        
     </div>
     <div class="food-box">
        <el-checkbox-group v-model="foodtypelist" @change="foodChange()">
          <el-checkbox  border v-for="items in datalist" :key="items.id" :label="items.id" v-show="(items.setType==typeId)">
                        <div class="box-top">
                          <img :src="items.setPic" alt=""> 
                          <div v-if="items.foodList.length">
                              <div class="li"  v-for="(item,index) in items.foodList" :key="index">{{item.name}}&nbsp;&nbsp;{{item.weight}}g</div>
                          </div>
                          <div v-else >
                              <div v-html="items.content"></div>  
                          </div>                          
                        </div> 
                        <div class="box-foot">{{items.name}}</div>  
          </el-checkbox>
        </el-checkbox-group>
     </div>
			<span slot="footer" class="dialog-footer">
				<el-button  @click="dialogVisible=false">取 消</el-button>
				<el-button type="primary" @click="dialogVisiblefun()">确 定</el-button>
			</span>
		</el-dialog> 
     </div>
</div> 
</template>
<script>
import {
  getSeveralWeekList,
  getMealSetBySchoolId,
  insertMealMenu,
  getMealMenuInfo
} from "@/api/recipeOrdering";
import mixin from "@/mixins/windowResize";
import { mapGetters } from "vuex";
import AddressBook from "@/components/AddressBook/indexExpand";
export default {
  components: { AddressBook},
  data() {
    return {
        stuConfigData: {
        title: "发布范围",
        depart: { target: "depart", departType: "s", userTypes: "2" },
        group: false
        
      },
      thConfigData: {
        title: "发布范围",
        depart: { target: "all", departType: "t", userTypes: "1" },
        group: false        
      },
      stuaddressData: { departJson: [], groupJson: [], userJson: [] },
      thaddressData: { departJson: [], groupJson: [], userJson: [] },
      query: {
        isShow: "0", //	是否发布，0未发布，1发布	number
        limitDate: "", //	截止时间	string
        mealMenuSetList: [], //	套餐集合	array<object>
        menuType: "", //	食谱类型，1公共，2老师，3学生	number
        mondayDate: "", //	周一	string
        schoolId: "", //	学校id	number
        schoolTimeId: this.$route.query.schoolTimeId, //	学期id	number
        schoolTimeName: this.$route.query.schoolTimeName, //	学期	string
        sundayDate: "", //	周日	string
        week: "", //	周	number
        remindStatus:false,
        stuDepartJson:"",
        teacherDepartJson:"",
        teacherJson:"",
        payType:1
      },
      payType:false,
      dietMenuWeeklist: [],
      datalist: [],
      dialogVisible: false,
      typeId: 1,
      foodtypelist: [],
      xuanzhonglist: [],
      mealMenuSetList: []
    };
  },
  mixins: [mixin],
  computed: { ...mapGetters(["schoolInfo"]) },
  created() {
    this.query.schoolId = this.schoolInfo.id;
    this.getSeveralWeekLists();
    this.getMealSetBySchoolIds();
    this.getMealMenuInfos()
  },
  methods: {
    funUpanddown(index,num){
      if(num==0){
        let obj=this.mealMenuSetList[index];
        this.$set(this.mealMenuSetList, index, this.mealMenuSetList[index-1]);
        this.$set(this.mealMenuSetList, index-1, obj);
      }else{
        let obj=this.mealMenuSetList[index];
        this.$set(this.mealMenuSetList, index, this.mealMenuSetList[index+1]);
        this.$set(this.mealMenuSetList, index+1, obj);
      }
    },
      getMealMenuInfos(){
        getMealMenuInfo(this.$route.query.id).then(res => res.data)
        .then(data => {
             let mydata=data.data;
            //  this.query.limitDate=mydata.limitDate;
             this.query.menuType=mydata.menuType;
             if(mydata.menuType==4){
              this.stuaddressData.departJson=mydata.stuDepartJson?JSON.parse(mydata.stuDepartJson):[];
              this.thaddressData.departJson=mydata.teacherDepartJson?JSON.parse(mydata.teacherDepartJson):[];
              this.thaddressData.userJson=mydata.teacherJson?JSON.parse(mydata.teacherJson):[];
             }
            for(let i=0;i<mydata.mealMenuSetList.length;i++){               
                this.mealMenuSetList.push({
                    mealSetId: mydata.mealMenuSetList[i].mealSetId,
                    name: mydata.mealMenuSetList[i].name,
                    pic: mydata.mealMenuSetList[i].setPic,
                    setType: mydata.mealMenuSetList[i].setType,
                    content: mydata.mealMenuSetList[i].content?mydata.mealMenuSetList[i].content.replace(/\r\n/g, "<br/>").replace(/\n/g, "<br/>").replace(/\s/g, "&nbsp;"):'',
                    foodList: mydata.mealMenuSetList[i].foodListJson?JSON.parse(mydata.mealMenuSetList[i].foodListJson):[],
                    weeklist: mydata.mealMenuSetList[i].weekDays.split(",") ,
                    menuSetPrice:mydata.mealMenuSetList[i].menuSetPrice/100
                })
            }   
        });
      },
    popfun() {
      if (!this.datalist.length) {
        this.$message.error("暂无套餐，请到套餐库创建套餐！");
        return;
      }
      this.dialogVisible = true;
    },
    //删除套餐
    deletefun(index) {
      this.mealMenuSetList.splice(index, 1);
    },
    insertMealMenus(isShow) {
      this.query.isShow = isShow;
      if (!this.query.week) {
        this.$message.error("请选择周次！");
        return;
      }
      if (!this.query.menuType) {
        this.$message.error("请选择类型！");
        return;
      }
      if (!this.query.limitDate) {
        this.$message.error("截止时间不能为空！");
        return;
      }
      this.query.limitDate = this.$moment(this.query.limitDate).format(
        "YYYY-MM-DD HH:mm"
      );
      if (
        this.$moment(this.query.limitDate).format("YYYY-MM-DD") >
          this.query.mondayDate ||
        this.$moment(this.query.limitDate).format("YYYY-MM-DD") ==
          this.query.mondayDate
      ) {
        this.$message.error("订餐截止时间应小于对应周的第一天！");
        return;
      }
      this.query.mealMenuSetList = [];
      for (let i = 0; i < this.mealMenuSetList.length; i++) {
        this.query.mealMenuSetList.push({
          mealSetId: this.mealMenuSetList[i].mealSetId,
          name: this.mealMenuSetList[i].name,
          weekDays: this.mealMenuSetList[i].weeklist.sort((old,New)=>{return old -New}).join(","),
          menuSetPrice:this.mealMenuSetList[i].menuSetPrice*100
        });
        if (this.mealMenuSetList[i].weeklist.length == 0) {
          this.$message.error(
            "请选择" + this.mealMenuSetList[i].name + "提供日期！"
          );
          return;
        }
      }
      if(this.query.mealMenuSetList.length==0){
         this.$message.error("至少选择一个套餐！");
        return;
      }
       if(this.query.menuType==4){
        if(this.stuaddressData.departJson.length+this.thaddressData.departJson.length+this.thaddressData.userJson.length==0){
             this.$message.error("至少选择老师学生至少一个发布范围！");
             return;
        }else{
            this.query.stuDepartJson=this.stuaddressData.departJson.length?this.stuaddressData.departJson:"";
            this.query.teacherDepartJson=this.thaddressData.departJson.length?this.thaddressData.departJson:"";
            this.query.teacherJson=this.thaddressData.userJson.length?this.thaddressData.userJson:"";
        }

      }else{
        this.query.stuDepartJson="";
        this.query.teacherDepartJson="";
        this.query.teacherJson="";
      }
        this.$confirm(isShow==0?"确认保存吗?":"确认发布吗?", isShow==0?"保存":"发布?", {
        type: "success"
      })
        .then(() => {
         this.query.remindStatus=this.query.remindStatus-0;
         this.query.payType=this.payType?2:1;
      insertMealMenu(this.query)
        .then(res => {
          if (res.data.code === 200) {
            this.$message({
              type: "success",
              message: "操作成功!"
            });
            this.$router.back();
          } else {
            this.$message({ type: "error", message: res.data.msg });
            return;
          }
        })
        .catch();
        })
        .catch(() => {});
    },
    //弹框勾选
    foodChange() {
      this.xuanzhonglist = [];
      for (let i = 0; i < this.foodtypelist.length; i++) {
        for (let j = 0; j < this.datalist.length; j++) {
          if (this.foodtypelist[i] == this.datalist[j].id) {
            this.xuanzhonglist.push({
              mealSetId: this.datalist[j].id,
              name: this.datalist[j].name,
              pic: this.datalist[j].setPic,
              setType: this.datalist[j].setType,
              content: this.datalist[j].content,
              foodList: this.datalist[j].foodList,
              weeklist: [],
              menuSetPrice:10
            });
          }
        }
      }
    },
    //确定取消
    dialogVisiblefun() {
      let name = "";
      if (this.xuanzhonglist.length == 0) {
        this.$message({ type: "error", message: "请选择套餐!" });
        return;
      } else {
        for (let i = 0; i < this.xuanzhonglist.length; i++) {
          let is = true;
          for (let j = 0; j < this.mealMenuSetList.length; j++) {
            if (
              this.xuanzhonglist[i].mealSetId ==
              this.mealMenuSetList[j].mealSetId
            ) {
              is = false;
            }
          }
          if (is) {
            this.mealMenuSetList.push(this.xuanzhonglist[i]);
          } else {
            name += this.xuanzhonglist[i].name + "；";
          }
        }
        if (name) {
          this.$message({ type: "error", message: name + "套餐重复!" });
        }
        this.dialogVisible = false;
        this.xuanzhonglist = [];
        this.foodtypelist = [];
      }
    },
    //获取套餐
    getMealSetBySchoolIds() {
      getMealSetBySchoolId()
        .then(res => res.data)
        .then(data => {
          for (let i = 0; i < data.data.length; i++) {
            data.data[i].content = data.data[i].content
              .replace(/\r\n/g, "<br/>")
              .replace(/\n/g, "<br/>")
              .replace(/\s/g, "&nbsp;");
          }
          this.datalist = data.data;
          this.ishide = this.datalist.length;
        });
    },
    //周次
    getSeveralWeekLists() {
      getSeveralWeekList()
        .then(res => {
          let mydata = res.data.data;
          if (!mydata) {
            return;
          }
          for (let i = 0; i < mydata.length; i++) {
            if (mydata[i].nowWeek == 1) {
              this.query.week = mydata[i].week;
              this.query.mondayDate = mydata[i].startDate;
              this.query.sundayDate = mydata[i].endDate;
            }
          }
          if (!this.query.week) {
            this.query.week = mydata[0].week;
            this.query.mondayDate = mydata[0].startDate;
            this.query.sundayDate = mydata[0].endDate;
          }
          this.dietMenuWeeklist = mydata;
          if(!this.dietMenuWeeklist.length){
             this.dietMenuWeeklist.push({
                week:this.query.week
             }) 
          }
        })
        .catch();
    },
    //切换周
    weekfun() {
      for (let i = 0; i < this.dietMenuWeeklist.length; i++) {
        if (this.query.week == this.dietMenuWeeklist[i].week) {
          this.query.mondayDate = this.dietMenuWeeklist[i].startDate;
          this.query.sundayDate = this.dietMenuWeeklist[i].endDate;
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.orderingRecipesclone {
  padding:12px;
  .big-box {
    width: 700px;
    color: #606266;
    background: #fff;
    border: 1px solid #e4e7ed;
    margin: 5px;
    border-radius: 5px;
    padding: 5px 10px;
    float: left;
    position: relative;
    .el-tag {
      position: absolute;
      left: 70px;
      top: 65px;
    }
    .num-box{
    position: absolute;
    right: 20px;
    top: 85px;
    line-height: 32px;
    font-size: 14px;
    span{
      color: #f56c6c;
    }
    }
    .ul-top {
      .li {
        position: relative;
        padding: 10px 10px 10px 5px;
        color: #909399;
        .el-date-editor.el-input,
        .el-select {
          width: 50%;
        }
        .el-checkbox-group {
          padding: 11px 0;
        }
        .name {
          position: absolute;
          width: 100px;
          text-align: right;
          top: 10px;
          left: 0px;
          line-height: 40px;
          font-size: 14px;
          .red {
            display: inline;
            color: #f56c6c;
          }
        }
      }
    }
    .big-box-top {
      overflow: hidden;
      font-size: 12px;
      line-height: 18px;

      img {
        width: 100px;
        height: 100px;
        margin-right: 15px;
        float: left;
        margin-bottom: 8px;
      }
    }
    .big-box-foot {
      font-size: 14px;
      color: #409eff;
    }
    .el-icon-delete {
      color: #f56c6c;
      position: absolute;
      right: -35px;
      top: 85px;
      font-size: 26px;
      cursor: pointer;
    }
    .i-box{
        position: absolute;
        right: -115px;
        top: 80px;
        cursor: pointer;
        width: 80px;       
        font-size: 25px;
    i{
         float: left;
    color: #409eff;
    margin: 3px;
    border-radius: 50%;
    padding: 3px;
    }
  
    }
  }
  .top {
    border-bottom: 1px solid #e7eaec;
    padding-bottom: 10px;
  }
  .noData {
    text-align: center;
    line-height: 80px;
    font-size: 16px;
    color: #303133;
    background: #fff;
  }
  .el-dialog__body,
  .foot-top {
    padding: 0px 20px;
  }
  .food-box {
    height: 325px;
    overflow: auto;
    color: #606266;
    background: #fff;
    margin: 5px;
    border-radius: 5px;
    padding: 0px 10px;
    float: left;
    position: relative;
    width: 100%;
    .box-top {
      overflow: hidden;
      font-size: 12px;
      line-height: 18px;
      width: 300px;
      img {
        width: 100px;
        height: 100px;
        margin-right: 5px;
        float: left;
        margin-bottom: 8px;
      }
    }
    .box-foot {
      font-size: 14px;
    }
    .el-checkbox.is-bordered {
      height: 140px;
      padding: 5px;
      margin: 5px;
    }
  }
  .subject {
    padding-top: 10px;
    overflow: auto;
    .body {
      width: 810px;
      margin: 0 auto;
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
          .ul-top {
            .li {
              position: relative;
              padding: 10px 10px 10px 115px;
              color: #606266;
              .el-date-editor.el-input,
              .el-select {
                width: 50%;
              }
              .el-radio-group {
                padding: 12px;
              }
              .name {
                position: absolute;
                width: 100px;
                text-align: right;
                top: 10px;
                left: 0px;
                line-height: 40px;
                font-size: 14px;
                .red {
                  display: inline;
                  color: #f56c6c;
                }
              }
                .li-box{
              padding: 10px 0;
            }
            }
          }
        }
      }
    }
  }
}
</style>