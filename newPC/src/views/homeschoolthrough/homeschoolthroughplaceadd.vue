<template>
<div class="homeschoolthroughplaceadd"  >
     <div class="top"> 
         <el-button @click="$router.back()" type="default" size="medium">返回</el-button>      
        <el-button type="primary" @click="saveDicValues('ruleForm')"  size="medium" >保存</el-button>      
      </div>
     <div class="subject Dictionariesadd" :style="`height: ${nobottommaxH}px;`">
       <div class="body">
         <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="140px" class="demo-ruleForm">
                     <!-- <el-form-item label="地点编码" prop="code">
                        <el-input v-model="ruleForm.code" :maxlength='20' placeholder='请输入地点编码' ></el-input>
                    </el-form-item> -->
                    <el-form-item label="地点名称" prop="value">
                        <el-input v-model="ruleForm.value" :maxlength='20' placeholder='请输入地点名称' ></el-input>
                    </el-form-item>
                    <el-form-item label="排序号" prop="sort" >
                      <el-input v-model="ruleForm.sort"  type="number" :maxlength='4'  placeholder='请输入排序号'  ></el-input>
                     </el-form-item>  
                    <el-form-item label="地点描述">
                        <el-input type="textarea" v-model="ruleForm.remark" :maxlength='250' placeholder='请输入地点描述' ></el-input>
                    </el-form-item>
        </el-form>
       </div>         
     </div>
</div> 
</template>
<script>
import { saveDicValue } from "@/api/homeschoolthrough";
import mixin from "@/mixins/windowResize";
export default {
  data() {
    let checkPrice = (rule, value, callback) => {
      if (value) {
        let rgx = /^[0-9a-zA-Z]+$/;
        if (value.match(rgx) == null) {
          return callback(new Error("请检查输入格式,只能输入字母数字！"));
        } else {
          callback();
        }
      }
    };
    return {
      ruleForm: {
        code: "", //	值唯一码	string
        dictionaryCode: "jxt_activities_place", //	字典编码	string
        id: "0", //	主键ID	number
        remark: "", //	值描述	string
        sort: "", //	排序号	number
        value: "" //	字典值	string
      },
      rules: {
        code: [
          { required: true, message: "请输入地点编码", trigger: "blur" },
          { validator: checkPrice, trigger: "change" }
        ],
        value: [{ required: true, message: "请输入地点名称", trigger: "blur" }],
        sort: [
          { required: true, message: "请输入正确值", trigger: "blur" },
          { min: 1, max: 4, message: "长度在1到4个字符", trigger: "change" }
        ]
      }
    };
  },
  mixins: [mixin],
  created() {
   
   
  },
  methods: {
    //保存
    saveDicValues(ruleForm) {
      this.$refs[ruleForm].validate(valid => {
        if (valid) {
          let date = new Date();
          this.ruleForm.code=date.getTime()+"" ;
          saveDicValue(this.ruleForm)
            .then(res => {
              const data = res.data;
              if (data.code == 200) {
                this.$message({
                  message: "保存成功！",
                  type: "success",
                  duration: 1000
                });
                this.$router.back();
              } else {
                this.$message({
                  message: data.msg,
                  type: "error",
                  duration: 1000
                });
              }
            })
            .catch(err => {});
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.homeschoolthroughplaceadd {
  padding:12px;
  .top {
    border-bottom: 1px solid #e7eaec;
    padding-bottom: 10px;
  }
  .subject {
    padding-top: 10px;
    overflow: auto;
    .body{
      width: 810px;
      margin: 0 auto;
    }
    .el-form {
      padding-top: 20px;
      .el-select {
        width: 100%;
      }
    }
  }
}
</style>