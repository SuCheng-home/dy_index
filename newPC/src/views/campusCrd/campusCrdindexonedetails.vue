<template>
<div class="campusCrdindexonedetails"  >
     <div class="top"> 
         <el-button @click="$router.back()" type="default" size="medium">返回</el-button> 
         <el-button type="primary" size="medium"   @click="dialogVisiblefun()">新增绑卡</el-button>     
      </div>
     <div class="subject Dictionariesadd" :style="`height: ${nobottommaxH}px;`">
        <div class="box" v-if="datalist.length>0"> 
            <div class="nav"><span>{{studentName}}的学生卡</span> </div>
               <div class="ul">
                    <div class="li" v-for="(item,index) in datalist" :key="index">学生卡{{index+1}}：                       
                        <span> {{item}}</span>
                        <div class="style">
                               <el-tag type="danger" @click="deleteCampusCards(item)"  size="medium">解绑</el-tag>
                               <el-tag  @click="dialogVisibletwofun(item)"  size="medium">换卡</el-tag>
                         </div>
                        </div>
                    </div>
         </div> 
          <default-page Mes="暂无校园卡" v-else></default-page>
     </div>
     <el-dialog title="新增绑卡（如无读卡器请认真核对卡号）" :close-on-press-escape='false' :close-on-click-modal='false' :visible.sync="dialogVisible" width="700px" :lock-scroll="false" :modal-append-to-body='false'>
			<div class="input-box">
                <div class="name">学生：</div>
                <div class="input">{{studentName}}</div>
            </div>
            <div class="input-box">
                <div class="name"><span>* </span>卡号：</div>
                <div class="input"><el-input :maxlength="30" ref="customerInput"  v-model.trim="sid" oninput="value=value.replace(/[\W]/g,'')"  size="medium" placeholder="请输入卡号"></el-input></div>
            </div>
             <div class="input-box" v-if="sourcelist.length>1">
                <div class="name"><span>* </span>来源：</div>
                <div class="input">
                   <el-radio-group v-model="companyCode">
                      <el-radio :label="item.code" v-for="(item,index) in sourcelist" :key="index">{{item.value}}</el-radio>
                    </el-radio-group>
                </div>
            </div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="addCampusCardones()">确 定</el-button>
			</span>
		</el-dialog> 
     <el-dialog title="换卡（如无读卡器请认真核对卡号）" :close-on-press-escape='false' :close-on-click-modal='false' :visible.sync="dialogVisibletwo" width="700px" :lock-scroll="false" :modal-append-to-body='false'>
			<div class="input-box">
                <div class="name">原卡号：</div>
                <div class="input">{{mysid}}</div>
            </div>
            <div class="input-box">
                <div class="name"><span>* </span>新卡号：</div>
                <div class="input"><el-input :maxlength="30" ref="customerInput"  v-model.trim="oldSid" oninput="value=value.replace(/[\W]/g,'')"  size="medium" placeholder="请输入卡号"></el-input></div>
            </div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisibletwo = false">取 消</el-button>
				<el-button type="primary" @click="replaceCards()">确 定</el-button>
			</span>
		</el-dialog> 
</div> 
</template>
<script>
import {getCampusCardInfo,deleteCampusCard,addCampusCardone,listBySchoolId,replaceCard} from "@/api/campusCrd";
import mixin from "@/mixins/windowResize";
import DefaultPage from "@/components/DefaultPage";
export default {
  data() {
    return {
      datalist: [],
      studentId: this.$route.query.studentId,
      studentName:'',
      dialogVisible:false,
      sid:'',
      is:true,
      sourcelist:[],
      companyCode:"",
      mysid:"",
      dialogVisibletwo:false,
      oldSid:""
    };
  },
  mixins: [mixin],
  created() {
    this.getCampusCardInfos();
    this.findSchoolDicsByCodes();
  },
  components: { DefaultPage},
  methods: {
    dialogVisibletwofun(mysid){
      this.mysid=mysid;
      this.dialogVisibletwo=true;
      this.oldSid="";
    },
     //换卡
    replaceCards() {
       if(this.oldSid==this.mysid){
           this.$message.error('新旧卡号不能一样');
           return;
        };
         if(!this.oldSid){
           this.$message.error('新卡号不能为空');
           return;
        };
      this.$confirm("确认要换卡吗？", "换卡", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        lockScroll: false
      }).then(() => {         
          replaceCard(this.oldSid,this.mysid).then(res => {
            if (res.data.code === 200) {
              this.$message.success("换卡成功");
               this.getCampusCardInfos();
               this.dialogVisibletwo=false;
            } else {
              this.$message.error(res.data.msg);
            }
          });
        })
        .catch(() => {});
    },
    //获取详情
    getCampusCardInfos() {
      getCampusCardInfo(1,this.studentId)
        .then(res => res.data)
        .then(data => {
            this.studentName=data.data.campusCardPageModel.userName;
            this.datalist=data.data.campusCardPageModel.sids;
        });
    },
      findSchoolDicsByCodes(){
        listBySchoolId().then(res=>res.data).then(data=>{
        if(data.code===200){
          let mydata=data.data;
         this.sourcelist=mydata;
          if(this.sourcelist.length){
            this.companyCode=this.sourcelist[0].code;
          }
         }
      })
    },
    
    //解除绑定
    deleteCampusCards(sid) {
      this.$confirm("确认要解除绑定吗？", "解除绑定", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        lockScroll: false
      }).then(() => {         
          deleteCampusCard(sid).then(res => {
            if (res.data.code === 200) {
              this.$message.success("解除绑定成功");
               this.getCampusCardInfos();
            } else {
              this.$message.error(res.data.msg);
            }
          });
        })
        .catch(() => {});
    },
    //弹框
    dialogVisiblefun(){
      this.dialogVisible=true;
      this.$nextTick(function () {
          this.$refs.customerInput.$el.querySelector('input').focus();
       });
    },
    //绑卡
    addCampusCardones(){
        if(!this.sid){
           this.$message.error('请输入卡号');
           return;
        };
          if(!this.companyCode){
           this.$message.error('请输创建来源');
           return;
        }
        if(!this.is){
          return;
        }else{
          this.is=false;
        }       
        let name="";
        for(let i=0;i<this.sourcelist.length;i++){
          if(this.companyCode==this.sourcelist[i].code){
            name=this.sourcelist[i].value
          }
        }
       addCampusCardone(this.sid,this.studentId,this.companyCode,name).then(res=>res.data).then(data=>{
         this.is=true;
        if(data.code==200){
            this.$message({ message: "新增校园卡成功!",type: "success",duration: 1000});
            this.sid='';
            this.dialogVisible=false;
            this.getCampusCardInfos();
         };
          if(data.code==1005){
            this.$message.error(data.msg);
            this.sid='';
            this.dialogVisible=false;
         }
      })
    }
  }
};
</script>
<style lang="scss" scoped>
.campusCrdindexonedetails {
  padding:12px;
  .top {
    border-bottom: 1px solid #e7eaec;
    padding-bottom: 10px;
  }
  .subject {
    padding-top: 10px;
    overflow: auto;
    .nav {
      height: 20px;
      line-height: 20px;
      margin: 5px 15px;
      padding-left: 8px;
      border-left: 4px solid #409eff;
      color: #333;
    }
    .box{
      width: 810px;
      margin: 0 auto;
    }
    .ul{
      padding:20px 0 0 60px;
    }
    .li {
        width: 400px;
        line-height: 30px;
        font-size: 14px;
        color: #666;
        padding: 10px 80px 10px 30px;
        position: relative;
        margin-bottom: 10px;
      .style {
        position: absolute;
        top: 10px;
        right: 0;
        cursor:pointer;
      }
    }
  }
   .input-box{
      overflow: hidden;
      line-height: 36px;
      margin:10px 0;
      .name{
         width: 100px;
        text-align: right;
        font-size: 14px;
        padding-right: 10px;
        float: left;        
          span{
              color:red
          }
      }
      .input{
          float: left;
          width: 500px;
      }
  }
}
</style>