<template>
  <div class="outApplyDetail" :outApplyObject="outApplyObject">
    <back-tool>
    </back-tool>
    <div class="outApplyCont" :style="`height:${nobottommaxH}px`">
      <div class="body">
          <h1>{{outApplyObject.createName}}外出申请</h1>
      <p class="smallTitle">{{outApplyObject.departName}}</p>
      <div>
        <el-form class="form" ref="ruleForm" label-width="120px">
          <el-form-item  label="外出时间：">
              <div class="cont">{{outApplyObject.startDate}}~{{outApplyObject.endDate}}</div>
          </el-form-item>
          <el-form-item  label="外出地点：">
              <div class="cont">{{outApplyObject.outAddress}}</div>
          </el-form-item>
          <el-form-item  label="共同外出人员：" v-if="outApplyObject.newUserList.length!==0">
              <div class="cont">
                <span v-for="(item,index) in outApplyObject.newUserList" :key="index" >{{item.userName}}&nbsp;<span v-if="outApplyObject.newUserList.length>1&&index<outApplyObject.newUserList.length-1">;</span>&nbsp;</span>
              </div>
          </el-form-item>
          <el-form-item  label="外出事由：">
              <div class="cont">{{outApplyObject.content}}</div>
              <image-previewer tag="richtext"> 
                <span class="img">
                  <img style="width: 100px!important;height: 100px;margin-right: 10px;"  v-for="picItem in outApplyObject.picJson" :src="picItem.picUrl" :key="picItem.fileId">
                </span> 
              </image-previewer> 
          </el-form-item>
        </el-form>
      </div>
      <div class="feedBackList" v-if="outApplyObject.auditRecordList.length!==0">
        <div class="title"><span class="square"></span>审批信息</div>
        <ul class="feedUl">
          <li v-for="(auditItem,auditIndex) in outApplyObject.auditRecordList" :key="auditIndex">
            <div v-if="auditItem.type==1&&auditItem.auditState==1">
              <span class="status_icon status_success">初审通过</span>
              <!-- <span class="status_icon status_fail" >驳回</span> -->
              <span class="disc_text">
                {{auditItem.auditUserName}}&nbsp;&nbsp;&nbsp; {{auditItem.auditDate|filterDate}}
              </span>
              <div class="feedCont">
                {{auditItem.auditContent}}
              </div>
            </div>
            <div v-if="auditItem.type==1&&auditItem.auditState==2">
              <span class="status_icon status_fail">初审退回</span>
              <!-- <span class="status_icon status_fail" >驳回</span> -->
              <span class="disc_text">
                {{auditItem.auditUserName}}&nbsp;&nbsp;&nbsp; {{auditItem.auditDate|filterDate}}
              </span>
              <div class="feedCont">
                {{auditItem.auditContent}}
              </div>
            </div>
            <div v-if="auditItem.type==2&&auditItem.auditState==1">
              <span class="status_icon status_success">终审通过</span>
              <!-- <span class="status_icon status_fail" >驳回</span> -->
              <span class="disc_text">
                {{auditItem.auditUserName}}&nbsp;&nbsp;&nbsp; {{auditItem.auditDate|filterDate}}
              </span>
              <div class="feedCont">
                {{auditItem.auditContent}}
              </div>
            </div>
            <div v-if="auditItem.type==2&&auditItem.auditState==2">
              <span class="status_icon status_fail">终审退回</span>
              <!-- <span class="status_icon status_fail" >驳回</span> -->
              <span class="disc_text">
                {{auditItem.auditUserName}}&nbsp;&nbsp;&nbsp; {{auditItem.auditDate|filterDate}}
              </span>
              <div class="feedCont">
                {{auditItem.auditContent}}
              </div>
            </div>
          </li>
        </ul>
      </div>
      </div>
     
    </div>
  </div>
</template>
<script>
import BackTool from '@/components/BackTool';
import {mapGetters} from 'vuex';
import mixin from '@/mixins/windowResize';
import ImagePreviewer from '@/components/ImagePreviewer/ImagePreviewer.vue';
import {getOutApplyInfoById} from '@/api/outApplyStatistics';
export default {
  components: {
    ImagePreviewer,
    BackTool
  },
  data(){
    return{
      id:this.$route.query.id,
      outApplyObject:{}
    }
  },
  created(){
    this.getOutApplyInfoByIdFunc();
  },
  mounted(){

  },
  computed: {
    ...mapGetters([
        'userInfo'
    ])
  },
  filters:{
    filterDate(date){
      return date?date.slice(0,19):'';
    }
  },
  mixins: [mixin],
  methods:{
    getOutApplyInfoByIdFunc(){
      getOutApplyInfoById({
        applyId:this.id
      }).then(res=>res.data)
      .then(data=>{
        if(data.code===200){
          
          this.outApplyObject=data.data;
          if(this.outApplyObject.userList.length!==0){
             let newUserList=this.outApplyObject.userList.filter(ele=>ele.userId!==this.userInfo.id);
            this.$set(this.outApplyObject,"newUserList",newUserList);
          }
          if(this.outApplyObject.picJson.length!==0){
            this.outApplyObject.picJson=JSON.parse(this.outApplyObject.picJson);
          }
        }
      }).catch(()=>{})
    }
  }
}
</script>
<style lang="scss" scoped>
ul,li{
  list-style: none;
  padding:0;
}
.body{
  margin: 0 auto;
  width: 810px;
}
.outApplyDetail{
  padding:12px;
  box-sizing: border-box;
  h1{
    font-size:20px;
    padding:20px 0 0 0;
    text-align: center;
  }
  .smallTitle{
    font-size:16px;
    text-align: center;
    color:#5f5f5f;
    font-weight: normal;
  }
  .form{
    .cont{
      color:#5f5f5f;
      margin-bottom:10px;
    }
  }
  .outApplyCont{
    box-sizing: border-box;
    overflow-x: hidden;
    overflow-y: auto;
  }
  .feedBackList{
    .title{
      padding: 10px 0;
      border-bottom: 1px solid #e7eaec;
      .square{
        display: inline-block;
        width: 10px;
        height: 10px;
        background: #acd6ff;
        margin: 15px 8px 0 0;
      }
    }
    .feedUl{
      padding-top:15px;
      .status_icon{
        padding: 2px 7px;
        font-size: 12px;
        color: #58ce76;
        background: #edfaf1;
        border: 1px solid #74d48c;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        border-radius: 4px;
        margin-right: 10px;
      }
      .feedCont{
        width:810px;
        margin:15px 0;
        word-break: break-all;
      }
      .status_success{
        color: #58ce76;
        background: #edfaf1;
        border: 1px solid #74d48c;
      }
      .status_fail{
        color: #fc8b97;
        background: #feeaec;
        border: 1px solid #fa5f6d;
      }
    }
    
  }
}

</style>
<style scoped>
.outApplyDetail .el-form-item__label{
  color:#333;
}
.outApplyDetail  .el-form-item{
  margin-bottom:0;
}
.outApplyCont::-webkit-scrollbar-track-piece {
  background: #d3dce6;
}
.outApplyCont::-webkit-scrollbar {
  width: 6px;
}
.outApplyCont::-webkit-scrollbar-thumb {
  background: #99a9bf;
  border-radius: 20px;
}
</style>

