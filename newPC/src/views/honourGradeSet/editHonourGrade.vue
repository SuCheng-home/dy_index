<template>
  <div class="addHonourGrade padding">
    <div class="header">
      <el-row>
        <el-col :span="24">
          <el-button  @click="$router.back()" type="default" size="medium">返回</el-button>
          <el-button type="primary" size="medium"  @click="saveHandler">保存</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="main-wrap">
      <el-form ref="form" :model="listQuery" :rules="rules" label-width="140px">
        <el-form-item label="级别" prop="honorTypeCode">
          <el-select v-model="listQuery.honorTypeCode" size="medium">
            <el-option :key="index" v-for="(item, index) in levelList" :label="item.value" :value="item.code" placeholder="请选择"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="权重" prop="typeBeliel">
          <el-input maxlength="3" v-model="listQuery.typeBeliel" placeholder="权重(1-100数字)"></el-input>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import {findDicsByCode} from '@/api/common/common';
import {getSchoolHonorTypeById,updateSchoolHonorType} from '@/api/honour/honourGradeSet';
export default {
  data(){
    const checkNum=(rule,value,callback)=>{
      if(!(/^[1-9][0-9]{0,}$/).test(value)){
        callback(new Error("请填写大于0的数字"));
      }else if(parseInt(value)>100){
        callback(new Error("请填写小于100的数字"));
      }else{
        callback();
      }
    };
    return{
      listQuery:{
        honorTypeCode:'',
        honorTypeName:'',
        typeBeliel:null,
        id:this.$route.query.honorTypeId
      },
        levelList: [],
        rules:{
        honorTypeCode:[
          {
            required: true,
            message: '请选择级别!'
          }
        ],
        typeBeliel:[
          {
            required: true,
            message: '请输入权重!',
            trigger: 'blur'
          },{
            required: true,
            trigger: 'change',
            validator: checkNum
          }
        ]
      }
    }
  },
  created(){
    this.getDicLevelList();
    this.getSchoolHonorTypeByIdFunc();
  },
  methods:{
    getDicLevelList() {
      findDicsByCode({dicCode: 'schoolhonorlevel'}).then(res => res.data).then(data => {
        if (data.code === 200 && data.result && data.data) {
          this.levelList = data.data;
        }
      }).catch(error => {});
    },
    getSchoolHonorTypeByIdFunc(){
      getSchoolHonorTypeById({
        honorTypeId:this.$route.query.honorTypeId
      }).then(res=>res.data)
      .then(data=>{
        if(data.code===200 && data.data){
          this.listQuery.honorTypeCode=data.data.honorTypeCode || '';
          this.listQuery.honorTypeName=data.data.honorTypeName || '';
          this.listQuery.typeBeliel=data.data.typeBeliel;
        }
      })
    },
    goBack(){
      this.$router.push({
        path:'honourGradeList'
      })
    },
    saveHandler(){
      this.$refs.form.validate((valid)=>{
        if(valid){
          this.listQuery.honorTypeName = this.levelList[this.levelList.map(item => item.code).indexOf(this.listQuery.honorTypeCode)].value || '';
          updateSchoolHonorType(this.listQuery).then(res=>res.data)
          .then(data=>{
            if(data.code===200){
              this.$message({
                type: 'success',
                message: '编辑成功!'
              });
              this.$router.back()
            }else{
              this.$message({
                type: 'error',
                message: data.msg
              });
            }
          })
        }else{
          return false;
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.padding{
  padding:12px;
  box-sizing: border-box;
}
.addHonourGrade{
  .header{
    padding-bottom:10px;
    border-bottom:1px solid  #e7eaec;
    margin-bottom:20px;
  }
  .main-wrap{
     width:810px;
    margin: 0 auto;
  }
}
</style>
<style lang="scss">
.addHonourGrade .el-form-item__label{
  font-weight: bold;
}
</style>

