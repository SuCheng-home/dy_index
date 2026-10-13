<template>
<div class="Intelligencecourseadd" v-loading="loading" >
     <div class="top"> 
         <el-button  type="default" @click="$router.back()" size="medium">返回</el-button>
         <el-button  type="primary" @click="systemSourceDataPosts()" size="medium">保存</el-button> 
     </div>        
     <div class="subject">
       <div class="body">
          <el-form :model="numberValidateForm" ref="numberValidateForm" label-width="140px" class="demo-ruleForm">
            <el-form-item label="排课计划名称" prop="scheduleName" :rules="[{ required: true, message: '排课计划名称不能为空'}]">
                <el-input type="text" v-model="numberValidateForm.scheduleName"  maxlength="30"  placeholder="请输入排课计划名称(1~30)"></el-input>
            </el-form-item>
         </el-form>

       </div>
        
     </div>
</div> 
</template>
<script>
//窗口大小调整
import mixin from '@/mixins/windowResize';
import {mapGetters} from 'vuex';
import {systemSourceDataPost} from "@/api/Intelligencecourse";
export default {
  data() {
    return {
      numberValidateForm:{
        scheduleName: ''
      },
      loading:false
    };
  },
  mixins: [mixin],
  computed: {
    ...mapGetters(['schoolInfo'])
  },
  mounted() {
  }, 
  methods: { 
   //保存
     systemSourceDataPosts() {       
       let  $this=this;
        this.$refs['numberValidateForm'].validate((valid) => {
          if (valid) {
          this.$confirm("确认保存吗？", "提示").then(() => {
            this.loading=true;
            systemSourceDataPost(this.schoolInfo.id,this.numberValidateForm.scheduleName).then(res => {                
                if (res.data.code === 200) {
                  this.$message({
                    type: "success",
                    message: "保存成功,请在客户端上完成排课!"
                  });
                 this.$router.back();
                } else {
                  this.$message({
                    type: "error",
                    message: res.data.msg
                  });
                };
                this.loading=false;
              })
              .catch(function() {
                $this.loading=false;
              });
          });
          } 
        });
      },
  }
};
</script>
<style scoped>
.Intelligencecourseadd{
    padding:12px;
}
.Intelligencecourseadd .top {
  border-bottom: 1px solid #e7eaec;
  padding-bottom: 10px ;
}
.Intelligencecourseadd .body{
    width: 810px;
    margin: 0 auto;
    padding-top: 20px;
}
</style>