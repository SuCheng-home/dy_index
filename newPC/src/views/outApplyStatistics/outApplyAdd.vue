<template>
  <div class="outApplyAdd">
    <back-tool>
      <el-button size="medium" type="primary" :loading="view_loading" @click="saveHandler">保存</el-button>
    </back-tool>
    <div class="form-container">
      <el-form :model="ruleForm" ref="ruleForm" class="demo-ruleForm">
        <!-- <el-row>
          <el-col :span="24">
            <el-form-item label="" label-width="20px">
              <el-checkbox v-model="ruleForm.exam">需要审批</el-checkbox>
            </el-form-item>
          </el-col>
        </el-row> -->
        <el-row>
          <el-col :span="24">
            <el-form-item label="" label-width="140px">
              <el-checkbox v-model="ruleForm.firstExam">初审</el-checkbox>
              <div class="short-book">
                  <address-book v-model="ruleForm.firstResultUser" :config="configPushData"
                                ref="address"></address-book>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="" label-width="140px">
              <el-checkbox v-model="ruleForm.secondExam">终审</el-checkbox>
              <div class="short-book">
                  <address-book v-model="ruleForm.secondResultUser" :config="configPushData"
                                ref="address"></address-book>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>
<script>
import BackTool from '@/components/BackTool';
import mixin from '@/mixins/windowResize';
import AddressBook from '@/components/AddressBook/indexExpand';
import {getOutApplySetBySchoolId,saveOutApplySet} from '@/api/outApplyStatistics';
export default {
  components: {
    BackTool,
    AddressBook
  },
  data(){
    return{
      ruleForm:{
       // exam:true,
        firstExam:true,
        secondExam:true,
        firstResultUser:{},
        firstUserJson:'',
        secondResultUser:{},
        sencondUserJson:''
      },
      configPushData: {
          title: '审核人员设置',
          depart: {target: 'user', departType: 't', userTypes: '1'},
          group: true
      },
      view_loading:false
    }
  },
  created(){
    this.getOutApplySetBySchoolIdFunc();
  },
  mounted(){

  },
  mixins:[mixin],
  methods:{
    getOutApplySetBySchoolIdFunc(){
      getOutApplySetBySchoolId().then(res=>res.data)
      .then(data=>{
        if(data.code===200){
          let outApplyObject=data.data;
          this.ruleForm.firstExam=outApplyObject.firstAudit===0?false:true;
          this.ruleForm.secondExam=outApplyObject.secondAudit===0?false:true;
          if(outApplyObject.firstUserJson.length!==0){
            this.ruleForm.firstResultUser={
              departJson: [],
              userJson: JSON.parse(outApplyObject.firstUserJson),
              groupJson: []
            }
          }
          if(outApplyObject.sencondUserJson.length!==0){
            this.ruleForm.secondResultUser={
              departJson: [],
              userJson: JSON.parse(outApplyObject.sencondUserJson),
              groupJson: []
            }
          }
        }
      }).catch(()=>{})
    },
    saveHandler(){
      if(this.ruleForm.firstExam){
        if (!this.ruleForm.firstResultUser.userJson || this.ruleForm.firstResultUser.userJson.length === 0) {
            this.$alert('请选择初审人员！', '提示', {
                type: 'error'
            }, {
                confirmButtonText: '确定'
            });
            return false;
        }
      }
      if(this.ruleForm.firstExam){
        if(!this.ruleForm.secondExam){
          this.$alert('请勾选终审类型！', '提示', {
              type: 'error'
          }, {
              confirmButtonText: '确定'
          });
          return false;
        }
      }
      if(this.ruleForm.secondExam){
        if (!this.ruleForm.secondResultUser.userJson || this.ruleForm.secondResultUser.userJson.length === 0) {
            this.$alert('请选择终审人员！', '提示', {
                type: 'error'
            }, {
                confirmButtonText: '确定'
            });
            return false;
        }
      }
      this.ruleForm.firstUserJson=JSON.stringify(this.ruleForm.firstResultUser.userJson);
      this.ruleForm.sencondUserJson=JSON.stringify(this.ruleForm.secondResultUser.userJson);
      if(!this.ruleForm.firstExam){
        this.ruleForm.firstUserJson='';
      }
      if(!this.ruleForm.secondExam){
        this.ruleForm.sencondUserJson='';
      }
      var That=this;
      this.view_loading = true;
      saveOutApplySet({
        firstAudit:this.ruleForm.firstExam?1:0,
        firstUserJson:this.ruleForm.firstUserJson?this.ruleForm.firstUserJson:'',
        secondAudit:this.ruleForm.secondExam?1:0,
        sencondUserJson:this.ruleForm.sencondUserJson?this.ruleForm.sencondUserJson:''
      }).then(res=>res.data)
      .then(data=>{
        if(data.code===200){
          That.$message({
            message: '外出申请审批设置成功',
            type: 'success'
          });
          setTimeout(() => {
            That.$router.push({
              path:'outApplyList'
            })
          }, 500)
        }else{
          That.view_loading = false;
        }
      }).catch(()=>{
        That.view_loading = false;
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.outApplyAdd{
  padding:12px;
  box-sizing: border-box;
}
.form-container {
  width: 810px;
  margin: 0 auto;
  padding-top: 30px;
  //margin:0 auto;
  .el-form-item{
    margin-bottom:20px;
  }
  .el-checkbox{
    margin-right: 20px;
  }
  .short-book {
    width: 100%;
    display: inline-block;
    vertical-align: middle;
    margin: 0 8px;
  }
}
</style>

