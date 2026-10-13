<template>
    <div class="newchargesetupindex">
        <div class="top" v-if="datalist.length<6">
            <!-- <el-button  type="default" @click="$router.back()" size="medium">返回</el-button> -->
            <el-button class="filter-item" type="primary" size="medium" @click="addpop()" >新增</el-button>    
            <el-button class="filter-item" type="primary" size="medium" @click="newchargesetuptype()" >收费类型设置</el-button>       
        </div>
        <div class="subject" :style="`height: ${nobottommaxH}px;`">
         <div class="box" v-for="(item,index) in datalist" :key="index"> 
             <i class="el-icon-collection-tag" v-if="item.defaultMch==1"></i>
             <i class="el-icon-edit" @click="eidt(item.mchType,item.payChargeId)"></i>
             <i class="el-icon-delete" @click="deleteChargesettings(item.id)"></i>
             {{nameLlist[item.mchType]}}
             <span v-if="item.defaultMch!=1" @click="updateChargesettingDefaults(item.id)">设为默认商户</span>
          </div> 
          <default-page Mes="暂无商户" v-if="mynum==0"></default-page>
     </div>
     <el-dialog title="商户选择"   :visible.sync="mydialogVisibleone" width="700px">
            <el-radio v-model="addnum" :label="item.id" border  v-for="(item,index) in poplistimg" :key="index">
              <img :src="item.url" alt="">
              <div class="name">{{item.name}}</div>
            </el-radio>
            <span slot="footer" class="dialog-footer">
                <el-button @click="mydialogVisibleone = false">取 消</el-button>
                <el-button type="primary" @click="add()">确 定</el-button>
            </span>
        </el-dialog> 
         
    </div>
</template>
<script>
import { queryChargesettingList,deleteChargesetting,updateChargesettingDefault} from "@/api/newcharge";
import {isShowByPermission} from "@/utils";
import DefaultPage from "@/components/DefaultPage";
import mixin from "@/mixins/windowResize";
export default {
  name: "statisticsIndex",
  data() {
    return {
      datalist: [],
      nameLlist: [
        "",
        "微信商户",
        "建行商户",
        "工行商户",
        "建融慧学",
        "农行商户",
        "农行二级商户"      
      ],
      mynum:1,
      addnum:1,
      poplistimg:[],
      mydialogVisibleone:false
    };
  },
  mixins: [mixin],
  components: { DefaultPage },
  created() {
    this.queryChargesettingLists();
  },
  methods: {
    isShowByPermission,
    addpop(){
      this.mydialogVisibleone=true;
      this.poplistimg=[];
      let imglist=[
         {name:"微信商户",id:1,url:'https://cdnfile-10043692.file.myqcloud.com/admin/images/newcharge/wx.png'},
         {name:"建行商户",id:2,url:'https://cdnfile-10043692.file.myqcloud.com/admin/images/newcharge/jh.png'},
         {name:"工行商户",id:3,url:'https://cdnfile-10043692.file.myqcloud.com/admin/images/newcharge/gh.png'},
         {name:"建融慧学",id:4,url:'https://cdnfile-10043692.file.myqcloud.com/admin/images/newcharge/jh.png'},
         {name:"农行商户",id:5,url:'https://cdnfile-10043692.file.myqcloud.com/admin/images/newcharge/nh.png'},
         {name:"农行二级商户",id:6,url:'https://cdnfile-10043692.file.myqcloud.com/admin/images/newcharge/nh.png'}
        ]
      for(let i=0;i<imglist.length;i++){
        let is=false
        for(let j=0;j<this.datalist.length;j++){
          if(imglist[i].id==this.datalist[j].mchType){
            is=true
          }
        }  
        if(!is){
           this.poplistimg.push(imglist[i])
        }  
      }
      this.addnum=this.poplistimg[0].id;      
    },
    newchargesetuptype(){
     this.$router.push({path: 'newchargesetuptype'});
    },
    //新增
    add(){
        //	1微信商户 2建行商户 3工行商户 4建融会学 5农行商户
        if(this.addnum==1){
            this.$router.push({path: 'newchargesetupaddwx'});
        }else if(this.addnum==2){
            this.$router.push({path: 'newchargesetupaddjh'});            
        }else if(this.addnum==3){
            this.$router.push({path: 'newchargeghlist'});
        }else if(this.addnum==5){
            this.$router.push({path: 'newchargenhlist'});
        }else if(this.addnum==6){
            this.$router.push({path: 'newchargenhlister'});
        }else if(this.addnum==4){
            this.$router.push({path: 'newchargesetupaddjr'});
        }
    },
    transactionFlow(){
        this.$router.push({path: 'transactionFlow'});
    },
    accountStatement(){
        this.$router.push({path: 'accountStatement'});
    },
    //编辑
    eidt(num,id){
       //	1微信商户 2建行商户 3工行商户 4建融会学 5农行商户
        if(num==1){
           this.$router.push({path: 'newchargesetupeidtwx', query: {id:id}});
        }else if(num==2){
           this.$router.push({path: 'newchargesetupeidtjh', query: {id:id}});           
        }else if(num==3){
           this.$router.push({path: 'newchargeghlist'}); 
        }else if(num==5){
           this.$router.push({path: 'newchargenhlist'});
        }else if(num==6){
           this.$router.push({path: 'newchargenhlister'});
        }else if(num==4){
           this.$router.push({path: 'newchargesetupeidtjr', query: {id:id}}); 
        }
    },
    //获取列表
    queryChargesettingLists() {
      queryChargesettingList()
        .then(res => {
          let mydata = res.data.data;
          this.datalist = mydata;
          this.mynum=this.datalist.length;
        })
        .catch();
    },
    //删除
    deleteChargesettings(id) {
      this.$confirm("此操作将永久删除此商户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteChargesetting(id)
            .then(res => {
              if(res.data.code==200){
                 this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.queryChargesettingLists();
              }else{
               this.$message({
                  type: "error",
                  message:res.data.msg,
                });
              } 
             
            })
            .catch();
        })
        .catch(() => {});
    },
    //默认
    updateChargesettingDefaults(id) {
      this.$confirm("是否设为默认商户?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          updateChargesettingDefault(id)
            .then(res => {
              this.$message({
                type: "success",
                message: "设置成功!"
              });
              this.queryChargesettingLists();
            })
            .catch();
        })
        .catch(() => {});
    },
  }
};
</script>

<style lang="scss" scoped>
.newchargesetupindex {
  padding:12px;
  .top {
    padding-bottom: 10px;
    border-bottom: 1px solid #e7eaec;
  }
  .el-radio.is-bordered {
    padding: 5px;
    height: 120px;
    margin: 5px;
    img{
      position: relative;
      left: -13px;
      width: 90px;
      padding-bottom: 10px;
    }
}
.name{
  text-align: center;
    position: relative;
    top: -15px;
}
  .subject {
    overflow: auto;
    .box {
      float: left;
      margin: 8px;
      background-color: #ecf5ff;
      color: #303133;
      border: 1px solid #d9ecff;
      width: 200px;
      height: 110px;
      border-radius: 5px;
      font-size: 24px;
      text-align: center;
      line-height: 110px;
      position: relative;
      .el-icon-collection-tag {
          position: absolute;
          top: 5px;
          left: 0px;
          color: #67c23a;
          font-size: 30px;
          background-color: #f0f9eb;
      }
      .el-icon-edit {
        position: absolute;
        top: 5px;
        right: 35px;
        font-size: 20px;
        color: #409eff;
        cursor: pointer;
      }
      .el-icon-delete {
        position: absolute;
        top: 5px;
        right: 5px;
        font-size: 20px;
        color: #f56c6c;
        cursor: pointer;
      }
      span {
        position: absolute;
        bottom: 5px;
        right: 5px;
        font-size: 14px;
        color: #409eff;
        line-height: 20px;
        cursor: pointer;
      }
    }
  }
}
</style>
