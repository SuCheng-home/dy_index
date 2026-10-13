<template>
  <div class="app-container invitation-container">
    <div class="header">
      <el-select class="filter-item btnLeftLine" v-model="classSet" placeholder=""  size="medium" @change="classChange">
          <el-option v-for="item in classList" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <el-button type="primary leftMargin"   size="medium" @click="printHandler" v-if="studentList&&studentList.length!==0">打印</el-button>
    </div>
    <div class="print-wrap" :style="`height: ${nobottommaxH}px;`">
      <div class="print-box">
        <h3 class="print-h3" v-if="studentList&&studentList.length==0">本班所有孩子家长都已关注，无需邀请</h3>
        <div class="print-wrap" id="print-wrap" v-if="studentList&&studentList.length!==0">
          <div class="print" v-for="(studentItem,studentIndex) in studentList" :key="studentIndex">
            <div class="attention_title">尊敬的{{studentItem.name}}同学家长您好：</div>
            <div class="attention_des">为了更好的满足家校互动的需要，我校开通了基于微信的家校互动平台，欢迎您通过扫描下方二维码关注。平台中的{{studentItem.name}}同学家长手机为：{{studentItem.parentMobile}}，如号码与您实际使用号码不一致，请拨打联系电话：13255273810。我们会尽快修整并帮助您完成关注。感谢您的配合。</div>
            <div class="attention_img">
              <img :src="wxqrcode">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import mixin from '@/mixins/windowResize';
import {querySchoolClass,invitationIndex} from '@/api/system';
export default{
  data(){
    return{
      classList:[],
      classSet:'',
      studentList:[],
      managerMobile:'',
      wxqrcode:''
    }
  },
  mixins: [mixin],
  created(){
    this.querySchoolClassFunc();
  },
  mounted(){

  },
  methods:{
    printHandler(){
      var printWrap=document.getElementById("print-wrap");
      var newstr=printWrap.innerHTML;
      var oldstr=printWrap.innerHTML;
      document.body.innerHTML=newstr;
      window.print();
      window.location.reload();
      document.body.innerHTML=oldstr;
      return false;
    },
    classChange(val){
      invitationIndex({
        departId:val
      }).then(res=>res.data)
      .then(data=>{
        if(data.code===200){
          this.studentList=data.data.studentList;
          if(data.data.schoolModel){
            this.managerMobile=data.data.schoolModel.managerMobile;
            this.wxqrcode=data.data.schoolModel.wxqrcode;
          }
        }
      })
    },
    querySchoolClassFunc(){
      this.classList=[];
      querySchoolClass().then(res=>res.data)
      .then(data=>{
        if(data.code===200){
          data.data.forEach((item,index)=>{
            let classHash={};
            classHash.value=item.id;
            classHash.label=item.name;
            classHash.wxDepartId=item.wxDepartId;
            this.classList.push(classHash);
          });
          this.classSet=this.classList[0].value;
          this.classChange(this.classSet);
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.invitation-container{
  overflow: hidden;
}
.header {
    padding-bottom: 10px;
    border-bottom: 1px solid #e7eaec;
}
.print-wrap{
  width:100%;
  overflow-x:hidden;
  overflow-y: auto;
}
.print-wrap::-webkit-scrollbar-thumb {
    background: #99a9bf;
    border-radius: 20px;
}
.print-wrap::-webkit-scrollbar {
    width: 6px;
}
.print-wrap::after {
    top: 0;
    right: 0;
    width: 0px;
    height: 100%;
}
// .leftMargin{
//   margin-left: 10px;
// }
.print{
  width:65%;
  padding-top:20px;
  overflow-x: hidden;
  overflow-y: auto;
  margin:0 auto;
  box-sizing: border-box;
}
.print-h3{
  text-align: center;
  line-height: 100px;
}
.attention_title {
  color: #666;
  font-weight: 600;
  font-size:14px;
  margin-bottom:10px;
}
.attention_des {
  text-indent: 2em;
  font-size:14px;
  line-height:24px;
}
.attention_img{
  text-align: center;
}
.attention_img img {
  width: 220px;
}
</style>
