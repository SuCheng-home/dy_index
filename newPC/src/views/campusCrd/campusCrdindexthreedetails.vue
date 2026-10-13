<template>
<div class="campusCrdindexthreedetails"  >
     <div class="top"> 
         <el-button @click="$router.back()" type="default" size="medium">返回</el-button> 
         <el-button type="primary" size="medium"   @click="dialogVisiblefun()">新增绑卡</el-button>     
      </div>
     <div class="subject Dictionariesadd" :style="`height: ${nobottommaxH}px;`">
        <div class="box" v-if="datalist.length>0"> 
            <div class="nav"><span>{{className}}的班级卡</span> </div>
               <div class="ul">
                    <div class="li" v-for="(item,index) in datalist" :key="index">班级卡{{index+1}}：                       
                        <span> {{item}}</span>
                        <div class="style">
                               <el-tag type="danger" @click="deleteCampusCards(item)"  size="medium">解绑</el-tag>
                         </div>
                        </div>
                    </div>
         </div> 
          <default-page Mes="暂无校园卡" v-else></default-page>
     </div>
     <el-dialog title="新增绑卡（如无读卡器请认真核对卡号）" :close-on-press-escape='false' :close-on-click-modal='false' :visible.sync="dialogVisible" width="700px" :lock-scroll="false" :modal-append-to-body='false'>
			<div class="input-box">
                <div class="name">班级：</div>
                <div class="input">{{className}}</div>
            </div>
            <div class="input-box">
                <div class="name"><span>* </span>卡号：</div>
                <div class="input"><el-input :maxlength="30" ref="customerInput"  v-model.trim="sid" oninput="value=value.replace(/[\W]/g,'')"  size="medium" placeholder="请输入卡号"></el-input></div>
            </div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="addCampusCardthrees()">确 定</el-button>
			</span>
		</el-dialog> 
</div> 
</template>
<script>
import {getCampusCardInfo,deleteCampusCard,addCampusCardthree} from "@/api/campusCrd";
import mixin from "@/mixins/windowResize";
import DefaultPage from "@/components/DefaultPage";
export default {
  data() {
    return {
      datalist: [],
      classId: this.$route.query.classId,
      className:'',
      dialogVisible:false,
      sid:'',
      is:true
    };
  },
  mixins: [mixin],
  created() {
    this.getCampusCardInfos();
  },
  components: { DefaultPage},
  methods: {
    //获取详情
    getCampusCardInfos() {
      getCampusCardInfo(3,this.classId)
        .then(res => res.data)
        .then(data => {
            this.className=data.data.classCard.classDepartName;
            this.datalist=data.data.classCard.sids;
        });
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
    addCampusCardthrees(){
        if(!this.sid){
           this.$message.error('请输入卡号');
           return;
        };
        if(!this.is){
          return;
        }else{
          this.is=false;
        }
       addCampusCardthree(this.sid,this.classId).then(res=>res.data).then(data=>{
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
.campusCrdindexthreedetails {
  padding:12px;
  .top {
    border-bottom: 1px solid #e7eaec;
    padding-bottom: 10px;
  }
  .subject {
    padding-top: 10px;
    overflow: auto;
    .box{
      width: 810px;
      margin: 0 auto;
    }
    .nav {
      height: 20px;
      line-height: 20px;
      margin: 5px 15px;
      padding-left: 8px;
      border-left: 4px solid #409eff;
      color: #333;
    }
    .ul{
      padding:20px 0 0 60px;
    }
    .li {
        width: 320px;
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