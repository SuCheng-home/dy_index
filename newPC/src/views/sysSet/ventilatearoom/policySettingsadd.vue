<template>
  <div class="policySettingsadd">
    <div class="el-row menu-tools">
      <el-button  @click="$router.back()" size="medium">返回</el-button>
      <el-button type="primary" size="medium"   @click="insertStrategys('ruleForm')">保存</el-button>
      <el-button type="primary" size="medium"   @click="ventilatearoomDictionarieslist()">打卡项设置</el-button>      
    </div>
     <div class="classCircleindex-main" :style="{height: `${nobottommaxH}px`}" >
         <div class="body">
               <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="140px" class="demo-ruleForm">
                <el-form-item label="策略名称" prop="strategyName">
                    <el-input v-model.trim="ruleForm.strategyName" :maxlength="20" placeholder="请输入策略名称"></el-input>
                </el-form-item>        
                <el-form-item label="打卡项" prop="checkStrategyJsontype">
                    <el-checkbox-group v-model="ruleForm.checkStrategyJsontype">
                          <el-checkbox :label="item.id" name="type" v-for="(item,index) in typelist" :key="index">{{item.value}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="备注">
                    <el-checkbox v-model="ruleForm.checkRemark">是否添加备注</el-checkbox>
                </el-form-item>
                 <el-form-item label="图片">
                    <el-checkbox v-model="ruleForm.checkPhoto">是否拍摄图片</el-checkbox>
                </el-form-item>
        </el-form>
         </div>
      
    </div>      
  </div>
</template>
<script>
import mixins from "@/mixins/windowResize";
import baseMixin from "@/mixins/baseMixin";
import { findSchoolDicsByCode,insertStrategy } from "@/api/ventilatearoom";
export default {
  data() {
    return {
      ruleForm: {
        checkPhoto: false, //	是否拍照上传，0不上传，1上传	number
        checkRemark: false, //	是否添加备注，0不，1是	number
        checkStrategyJson: [], //	检查项	array<object>
        strategyName: "", //	名称	string
        checkStrategyJsontype: []
      },
      typelist: [],
      rules: {
        strategyName: [
          { required: true, message: "请输入策略名称", trigger: "blur" }
        ],
        checkStrategyJsontype: [
          {
            type: "array",
            required: true,
            message: "请至少选择一个打卡项",
            trigger: "change"
          }
        ]
      }
    };
  },
  mixins: [mixins, baseMixin],
  created() {
    this.findSchoolDicsByCodes();
  },
  methods: {
    //字典设置
    ventilatearoomDictionarieslist() {
      this.$router.push({ path: "ventilatearoomDictionarieslist" });
    },
    //获取打卡项
    findSchoolDicsByCodes() {
      findSchoolDicsByCode("ventilatearoom")
        .then(res => {
          const data = res.data.data;
          this.typelist = data;
        })
        .catch(err => {});
    },
    //保存
    insertStrategys(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let obj = {
            checkPhoto: 0, //	是否拍照上传，0不上传，1上传	number
            checkRemark: 0, //	是否添加备注，0不，1是	number
            checkStrategyJson: [], //	检查项	array<object>
            strategyName: this.ruleForm.strategyName //	名称	string
          };
          if (this.ruleForm.checkPhoto) {
            obj.checkPhoto = 1;
          };
          if (this.ruleForm.checkRemark) {
            obj.checkRemark = 1;
          };
          for (let i = 0; i < this.typelist.length; i++) {
            for (let j = 0; j < this.ruleForm.checkStrategyJsontype.length; j++) {
              {
                if (
                  this.ruleForm.checkStrategyJsontype[j] == this.typelist[i].id
                ) {
                  obj.checkStrategyJson.push({
                    typeId: this.typelist[i].id,
                    typeName: this.typelist[i].value
                  });
                }
              }
            }
          };
          obj.checkStrategyJson = JSON.stringify(obj.checkStrategyJson);
           insertStrategy(obj)
                      .then(res => {
                          if(res.data.code==200){                           
                                 this.$message({
                                  message: "操作成功！",
                                  type: "success",
                                  duration: 1000
                                });
                                this.$router.back();
                          }else{
                              this.$message.error(res.data.msg);
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
.policySettingsadd {
  padding:12px;
  box-sizing: border-box;
  .menu-tools {
    border-bottom: 1px solid #e7eaec;
    padding-bottom: 10px;
  }
  .classCircleindex-main {
    padding-top: 20px;
    margin-top: 20px;
    overflow: auto;
    .body {
      width: 810px;
      margin: 0 auto;
      .el-checkbox{
          width: 100%;
      }
    }
  }
}
</style>


