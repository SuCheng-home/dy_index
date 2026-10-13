<template>
  <div class="addFeedBack" :feedBackDetail="feedBackDetail">
    <back-tool>
      <el-button size="medium" type="primary" @click="print()">打印</el-button>
    </back-tool>
    <div class="form-container" ref="print" id="print">
      <h1>{{schoolInfo.fullName}}常规检查情况通知单</h1>
      <div class="smallTitle">{{feedBackDetail.createTime|changeTime}}</div>
      <div class="infoTop">
        <span class="link-type">{{feedBackDetail.teacherName}}</span>
        <span>老师：</span>
      </div>
      <div class="mainWrap">
        <span class="preText">您于</span>
        <span class="link-type">{{feedBackDetail.checkDate}}</span>
        <span>日因</span>
        <span class="link-type">{{feedBackDetail.checkTypeName}}</span>
        <span class="link-type">{{feedBackDetail.feedbackTypeName}}</span>
        <span>，将在常规考核中予以执行学校考勤管理制度相关规定，特此通告。</span>
      </div>
      <div class="bottomWrap">
        <div class="bottom-cont">
          <label class="control-label">落款：</label>
          <span class="link-type">{{feedBackDetail.departName}}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import BackTool from '@/components/BackTool';
import _ from 'lodash';
import {getCheckFeedback} from '@/api/checkFeedBack';
import {mapGetters} from 'vuex';
import moment from "moment";
export default {
  components: {
    BackTool,
  },
  data(){
    return{
      listQuery:{
        checkTypeCode:'',
        checkTypeName:'',
        feedbackTypeCode:'',
        feedbackTypeName:'',
        teacherId:'',
        teacherName:'',
        checkDate:new Date(),
        departId:'',
        departName:''
      },
      teacherConfigData: {
        title: "通报老师",
        depart: { target: "user", departType: "t", userTypes: "1" },
        SingleChose:true
      },
      teacherUser: {},
      checkTypeList:[],
      feedTypeList:[],
      dialogGroup:false,
      groupList:[],
      groupCode:'',
      groupName:'',
      id:this.$route.query.id,
      feedBackDetail:{}
    }
  },
  created () {
    this.getCheckFeedbackFunc();
  },
  mounted(){

  },
  computed: {
    ...mapGetters([
        'userInfo',
        'schoolInfo'
    ])
  },
  filters:{
    changeTime(date1){
      return date1?moment(new Date(Number(date1))).format('YYYY-MM-DD'):'';
    }
  },
  methods:{
    print() {
      this.$print(this.$refs.print);
    },
    getCheckFeedbackFunc(){
      getCheckFeedback({
        id:this.id
      }).then(res=>res.data)
      .then(data=>{
        if(data.code===200){
          this.feedBackDetail=data.data;
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.addFeedBack{
  padding:12px;
  box-sizing: border-box;
}
.form-container {
  width: 810px;
  padding-top: 20px;
  margin:0 auto;
  h1{
    text-align: center;
    font-size:26px;
    font-weight: bold;
    margin-top:20px;
    margin-bottom:20px;
  }
  .smallTitle{
    text-align: right;
    margin-bottom:30px;
    font-size:16px;
  }
}
.address-teacher,.dateSelect{
  display:inline-block;
 // width:200px;
  //vertical-align: middle;
}
.mainWrap{
  margin-top:20px;
  line-height:50px;
  .preText{
    text-indent: 2em;
    display: inline-block;
  }
}
.bottomWrap{
  margin-top:100px;
  .bottom-cont{
    float: right;
  }
  .el-icon-circle-plus-outline{
    color:#409EFF;
    cursor: pointer;
  }
}
.bottomWrap:after{
  content: '';
  display: block;
  visibility: hidden;
  height: 0;
  clear: both;
}
.link-type{
  color: #409EFF;
}
</style>
<style lang="scss">
.addFeedBack{
  .el-input,.el-input-group{
      width:auto;
  }
}
</style>
