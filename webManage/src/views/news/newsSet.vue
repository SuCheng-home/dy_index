<template>
  <div class="newsSet-wrap">
    <el-form ref="form" :model="ruleForm" label-width="150px">
      <el-form-item label="消息审核设置">
        <el-checkbox v-model="ruleForm.isBatch">消息需要审核</el-checkbox>
      </el-form-item>
      <el-form-item label="智慧校园消息默认进入">
        <el-radio-group v-model="ruleForm.isToModule" @change="radioChange">
          <el-radio :label="1">消息中心</el-radio>
          <el-radio :label="2">模块</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="请选择模块" v-if="ruleForm.isToModule==2">
        <el-select v-model="ruleForm.moduleJson" placeholder="请选择活动区域" >
          <el-option :label="moduleItem.name"  :value="moduleItem.id" v-for="moduleItem in moduleIds" :key="moduleItem.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="sure-btn"  @click.native="sureBtn">确定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {getSchoolWebModuleListByWebId} from '@/api/webManage';
import {updateSchoolWebSettingInit} from '@/api/otherMessage';
import {getSchoolWebSettingById} from '@/api/webService';
const IsBatch={OK:2,NO:1}
export default {
  data(){
    return{
      ruleForm:{
        isToModule:1,
        moduleJson:'',
        lastmoduleIds:{},
        isBatch:false
      },
      moduleIds:[],
    }
  },//localStorage.getItem("webId"),
  created(){
    this.getSchoolWebSettingByIdFunc();
  },
  mounted(){
    this.getSchoolWebModuleListByWebIdFunc();
  },
  methods:{
    getSchoolWebSettingByIdFunc(){
      getSchoolWebSettingById({
        webId:localStorage.getItem("webId"),
      }).then(res=>res.data)
      .then(data=>{
        let setData=data.data;
        if(setData){
          this.ruleForm.isToModule=setData.isToModule;
          this.ruleForm.isBatch=setData.isBatch==2;
          this.ruleForm.lastmoduleIds=JSON.parse(setData.moduleJson);
          if(JSON.parse(setData.moduleJson)){
            this.ruleForm.moduleJson=JSON.parse(setData.moduleJson).id;
          }
        }
      })
    },
    radioChange(val){
      if(val==1){
        // this.ruleForm.moduleJson='';
      }
    },
    sureBtn(){
      
      let flag=true;
      
      if(this.ruleForm.isToModule==2&&this.ruleForm.moduleJson==''||this.ruleForm.isToModule==2&&this.ruleForm.moduleJson==null){
        this.$alert('模块不能为空!','提示',{
          type: 'error',
          confirmButtonText: '确定'
        })
        return false;
      }
      if(flag){
        if(this.ruleForm.isToModule==1){
          this.ruleForm.moduleJson='';
        }else if(this.ruleForm.isToModule==2){
          
        }
        var itemJson={};
        this.moduleIds.map((item)=>{
          if(item.id==this.ruleForm.moduleJson){
            itemJson.id=item.id;
            itemJson.name=item.name;
          }
        })
        this.ruleForm.lastmoduleIds=itemJson;
        updateSchoolWebSettingInit({
          id:localStorage.getItem("webId"),
          batchUserJson:'',
          isBatch:1,
          isToModule:this.ruleForm.isToModule,
          moduleJson:JSON.stringify(this.ruleForm.lastmoduleIds),
          templateTypeMb:'',
          templateTypePc:'',
          isBatch:this.ruleForm.isBatch?IsBatch.OK:IsBatch.NO
        }).then(res=>{
          if(res.data.code===200){
            this.$message({
                type: 'success',
                message: '设置成功!'
            });
          }
        })
      }
    },
    getSchoolWebModuleListByWebIdFunc(){
      getSchoolWebModuleListByWebId({
        webId:localStorage.getItem("webId"),
        type:23
      }).then(res=>res.data)
      .then(data=>{
        this.moduleIds=data.data;
      })
    }
  }
}
</script>

<style lang="scss" scope>
.newsSet-wrap{
  position: absolute;
  width:560px;
  left:40%;
  top:20%;
  margin-left:-250px;
  padding:20px;
  border:1px solid #d1dbe5;
  box-sizing: border-box;
  border-radius:6px;
  overflow: hidden;
  .sure-btn{
    width:120px;
    padding: 10px 15px;
  }
}
</style>
<style lang="scss">
.newsSet-wrap .el-form-item__label{
  font-weight: bold;
  color: #666;
  line-height: 40px;
  font-size: 14px;
  position: relative;
  padding-right:20px;
}
.newsSet-wrap .required .el-form-item__label:before{
  content:"*";
  font-size:17px;
  position: relative;
  top: 2px;
  display: inline-block;
  color: #f00;
  margin-right: 3px;
}
</style>


