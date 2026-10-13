<template>
<div class="homeVisitadd"  v-loading="loading">
     <div class="header"> 
         <el-button @click="$router.back()" type="default" size="medium">返回</el-button> 
         <el-button type="primary" size="medium" @click="addUpdateHomeVisitInit()">保存</el-button>  
      </div>
     <div class="body " :style="`height: ${nobottommaxH}px;`">
          <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="140px" class="demo-ruleForm">           
            <el-form-item label="家访采集字段" prop="visitFields">
              <el-checkbox-group v-model="ruleForm.visitFields">
                <el-checkbox  :disabled="item.code=='1001'||item.code=='1002'" v-for="item in unitlisttwo" :key="item.id" :label="item.code" :name="item.code">{{item.value}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>  
      </el-form>
     </div>
</div> 
</template>
<script>
import mixin from "@/mixins/windowResize";
import moment from "moment";
import {listValue,addUpdateHomeVisitInit,getHomeVisitInit} from "@/api/homeVisit";
export default {
  data() {
    return {
      ruleForm: {
        visitFields: ['1001','1002'],
      },
      rules: {
        visitFields: [
          {
            type: "array",
            required: true,
            message: "请至少选择一个家访采集字段",
            trigger: "change"
          }
        ],        
      },
      unitlisttwo: [],
    };
  },
  mixins: [mixin],
  created() {
    this.listValues();
    getHomeVisitInit(this.ruleForm).then(res => res.data).then(data => {
            if(data.result&&data.data) {
                this.ruleForm.visitFields=JSON.parse(data.data.visitFields)
            }
            }).catch(() => {})
  },
  methods: {
    listValues() {
      listValue("homeVisitFields")
        .then(res => res.data)
        .then(data => {
          this.unitlisttwo = data.data.dataList;
        });
    },
    addUpdateHomeVisitInit() {  
      this.$refs.ruleForm.validate(valid => {        
        if (valid) {
           addUpdateHomeVisitInit(this.ruleForm).then(res => res.data).then(data => {
                                    if(data.result) {
                                        this.$message({
                                            message: '操作成功！',
                                            type: 'success',
                                            duration: 1000
                                        });
                                        this.loading=false;
                                        this.$router.back();
                }
            }).catch(() => {})
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.homeVisitadd {
  padding:12px;
  .header {
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
  }
  .body {
    overflow: auto;
    .demo-ruleForm {
      width: 810px;
      margin: 20px auto;
      .ul{
        .li{
          i{
            font-size: 22px;
            margin: 5px;
            color: #F56C6C;
          }
        }
      }
    }
  }
}
</style>