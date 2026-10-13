<template>
  <div class="addFeedBack">
    <back-tool>
      <el-button size="medium" type="primary" @click="sendInfo">发布公示</el-button>
    </back-tool>
    <div class="form-container">
      <h1>{{schoolInfo.fullName}}常规检查情况通知单</h1>
      <div class="infoTop">
        <div class="address-teacher">
          <address-book style="width: 130px;" v-model="teacherUser" :config="teacherConfigData"></address-book>
        </div>
        <span style="float: left;margin-top: 10px;">老师：</span>
      </div>
      <div class="mainWrap">
        <span class="preText">您于</span>
        <template>
          <el-date-picker
            v-model.trim="listQuery.checkDate"
            type="date"
            size="medium"
            placeholder="选择日期"
            @change="timeChangeHandler"
            >
          </el-date-picker>
        </template>
        <span>日因</span>
        <template>
          <el-select v-model="listQuery.checkTypeCode" placeholder="请选择检查类型" @change="changeCheckType" size="medium">
            <el-option v-for="checkTypeItem in checkTypeList" :key="checkTypeItem.code" :label="checkTypeItem.value" :value="checkTypeItem.code">
              </el-option>
          </el-select>
        </template>
        <template>
          <el-select v-model="listQuery.feedbackTypeCode" placeholder="请选择反馈类型" @change="changeFeedType" size="medium">
            <el-option v-for="feedTypeItem in feedTypeList" :key="feedTypeItem.code" :label="feedTypeItem.value" :value="feedTypeItem.code">
              </el-option>
          </el-select>
        </template>
        <span>，将在常规考核中予以执行学校考勤管理制度相关规定，特此通告。</span>
      </div>
      <div class="bottomWrap">
        <div class="bottom-cont">
          <label class="control-label">落款：</label>
          <template>
            <el-input class="search-input" :maxlength="15" 
                      placeholder="请输入落款部门" icon="search" size="medium" @keyup.enter.native="handleInputChange"
                      v-model.trim="listQuery.departName">
                      <i slot="suffix" class="el-input__icon el-icon-circle-plus-outline" @click="dislogShow"></i>
            </el-input>
          </template>
        </div>
      </div>
    </div>
    <el-dialog title="选择落款部门" :visible.sync="dialogGroup">
      <el-form  ref="tableModuleObject" label-width="100px">
          <el-form-item label="落款部门">
            <el-select class="selectWidth" v-model="groupCode" placeholder="请选择部门" >
                <el-option
                  v-for="groupItem in groupList"
                  :key="groupItem.id"
                  :label="groupItem.name"
                  :value="groupItem.id">
                </el-option>
            </el-select>
          </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
          <el-button @click="dialogGroup=false">取 消</el-button>
          <el-button type="primary" @click="addGroup()">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import BackTool from '@/components/BackTool';
import _ from 'lodash';
import {findSchoolDicsByCode,queryDepartByUserId,addCheckFeedback} from '@/api/checkFeedBack';
import {mapGetters} from 'vuex';
import AddressBook from '@/components/AddressBook/indexExpand';
export default {
  components: {
    BackTool,
    AddressBook,
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
      groupName:''
    }
  },
  created () {
    this.queryDepartByUserIdFunc();
    this.checkTypeFunc();
    this.feedBackFunc();
  },
  mounted(){

  },
  computed: {
    ...mapGetters([
        'userInfo',
        'schoolInfo'
    ])
  },
  methods:{
    sendInfo(){
      if (!this.teacherUser.userJson || this.teacherUser.userJson.length === 0) {
        this.$message({
          message: '请选择通报老师！',
          type: 'error'
        });
        return false;
      }
      
      if(!this.listQuery.checkDate){
        this.$message({
          message: '日期不能为空！',
          type: 'error'
        });
        return false;
      }
      if(this.listQuery.checkTypeCode==''){
        this.$message({
          message: '请到学校字典里设置检查类型！',
          type: 'error'
        });
        return false;
      }
      if(this.listQuery.feedbackTypeCode==''){
        this.$message({
          message: '请到学校字典里设置反馈类型！',
          type: 'error'
        });
        return false;
      }
      if(this.listQuery.departName==''){
        this.$message({
          message: '落款部门不能为空！',
          type: 'error'
        });
        return false;
      }
      this.listQuery.teacherId=this.teacherUser.userJson[0].id;
      this.listQuery.teacherName=this.teacherUser.userJson[0].name;
      this.listQuery.checkDate=this.$moment(this.listQuery.checkDate).format('YYYY-MM-DD');
      addCheckFeedback(this.listQuery).then(res=>res.data)
      .then(data=>{
        if(data.code===200){
          this.$message({
              type: 'success',
              message: '发布公示成功！'
          });
          this.$router.push({
              path: 'feedBackList'
          })
        }
      })
    },
    addGroup(){
      this.dialogGroup=false;
      let groupItem=this.groupList.find(item=>this.groupCode==item.id);
      this.listQuery.departName=groupItem.name;
      this.listQuery.departId=groupItem.id;
    },
    dislogShow(){
      if(this.groupList&&this.groupList.length==0){
        this.$message({
          message:"未找到可选择部门,请手动输入!",
          type: 'warning'
        })
        return false;
      }else if(this.groupList&&this.groupList.length!==0){
        this.dialogGroup=true;
        this.groupCode=this.groupList[0].id;
        this.groupName=this.groupList[0].name;
      }
    },
    queryDepartByUserIdFunc(){
      queryDepartByUserId({
        userId:this.userInfo.id,
        depType:7
      }).then(res=>res.data)
      .then(data=>{
        if(data.code===200){
          this.groupList=data.data;
          this.groupCode=this.groupList[0].id;
          this.groupName=this.groupList[0].name;
        }
      }).catch(()=>{})
    },
    handleInputChange:_.debounce(
        function () {
           
        },
        // 这是我们为用户停止输入等待的毫秒数
        500
    ),
    checkTypeFunc(){
      findSchoolDicsByCode({
        dicCode:'checkFeedback_checkType'
      }).then(res=>res.data)
      .then(data=>{
        if(data.code===200){
          this.checkTypeList=data.data;
          this.listQuery.checkTypeCode=this.checkTypeList[0].code;
          this.listQuery.checkTypeName=this.checkTypeList[0].value;
        }
      })
    },
    feedBackFunc(){
      findSchoolDicsByCode({
        dicCode:'checkFeedback_feedbackType'
      }).then(res=>res.data)
      .then(data=>{
        if(data.code===200){
          this.feedTypeList=data.data;
          this.listQuery.feedbackTypeCode=this.feedTypeList[0].code;
          this.listQuery.feedbackTypeName=this.feedTypeList[0].value;
        }
      })
    },
    changeCheckType(val){
      this.listQuery.checkTypeCode=val;
      let checkItem=this.checkTypeList.find(item=>this.listQuery.checkTypeCode==item.code);
      this.listQuery.checkTypeName=checkItem.value;
    },
    changeFeedType(val){
      this.listQuery.feedbackTypeCode=val;
      let feedBackItem=this.feedTypeList.find(item=>this.listQuery.feedbackTypeCode==item.code);
      this.listQuery.feedbackTypeName=feedBackItem.value;
    },
    timeChangeHandler(val){
      this.listQuery.checkDate=val;
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
    margin-bottom:30px;
  }
}
.address-teacher,.dateSelect{
  display:inline-block;
  max-width:500px;
  vertical-align: middle;
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
</style>
<style lang="scss">
.addFeedBack{
  .el-input,.el-input-group{
      width:auto;
  }
}
</style>
