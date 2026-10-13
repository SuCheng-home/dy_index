<template>
    <div class="readingplatformbookmanagementeidt ">
        <div class="top">
          <el-button @click="$router.back()" type="default" size="medium">返回</el-button>
          <el-button type="primary" size="medium" @click="insertFoods('ruleForm')">保存</el-button>
        </div>
        <div class="subject" :style="`height: ${nobottommaxH}px;`">
            <div class="body">
             <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="140px" class="demo-ruleForm">
              
                <el-form-item label="库存" prop="inventory">
                     <el-input-number size="medium" v-model="ruleForm.inventory" :precision="0" :step="1" :min="1" :max="10000" placeholder="请输入积分"></el-input-number>
                </el-form-item>
                  <el-form-item label="任务说明" >
                    <el-input type="textarea"  :rows="6" v-model="ruleForm.taskRemark" size="medium" :maxlength="200"  placeholder="请输入任务说明"></el-input>
                </el-form-item>
                </el-form>
            </div>
         </div>   			
        
    </div>
</template>
<script>
import {getReadPlatBookById,updateReadPlatBook} from "@/api/readingplatform";
import mixin from "@/mixins/windowResize";
export default {
  data() {
    return {
      ruleForm: {
        inventory: "",   
        level: "",
        levelName: "",
        id:this.$route.query.id,
        taskRemark:""
      },
      rules: {
        inventory: [
          { required: true, message: "请输入库存", trigger: "blur" },
        ],
      },
    };
  },
  created() {
       getReadPlatBookById(this.$route.query.id).then(res=>res.data)
      .then(data=>{
        let mydata=data.data;
         this.ruleForm.levelName=mydata.levelName;
         this.ruleForm.level=mydata.level;
         this.ruleForm.taskRemark=mydata.taskRemark;
         this.ruleForm.inventory=mydata.inventory;
      })
  },
  mixins: [mixin],
  methods: {      
    //保存
    insertFoods(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {      
            let $this=this;
             updateReadPlatBook(this.ruleForm)
              .then(res => {
                if (res.data.code === 200) {
                  $this.$message({
                    type: "success",
                    message: "编辑成功!"
                  });
                  $this.$router.back();
                }else{
                  this.$message({type: 'error', message:res.data.msg});
                  return;
                }             
              }).catch();
          };
        });
    },
    
  }
};
</script>

<style lang="scss" scoped>
.readingplatformbookmanagementeidt {
  padding:12px;
  * {
    box-sizing: border-box;
  }
   .food-box{
        height: 210px;
        overflow: auto;
        border-top: 1px #EBEEF5 solid;
        border-bottom: 1px #EBEEF5 solid;
        margin-top: 10px;
      .el-checkbox.is-bordered {
            padding: 5px 10px;
            height: 32px;
            margin: 5px;
        }
   }
   .foot-top{
    overflow: hidden;
   }
  .top {
    border-bottom: 1px solid #e7eaec;
    padding-bottom: 10px;
  }
  .subject {
    padding-top: 10px;
    overflow: auto;
    .body {
      width: 810px;
      margin: 20px auto;
      
     
    }
  }
}
</style>
