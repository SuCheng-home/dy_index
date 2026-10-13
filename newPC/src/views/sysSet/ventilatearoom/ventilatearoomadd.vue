<template>
<div class="ventilatearoomadd"  >
     <div class="top"> 
         <el-button @click="$router.back()" type="default" size="medium">返回</el-button>      
        <el-button type="primary" @click="insertPlaces('ruleForm')"  size="medium" >保存</el-button>      
      </div>
     <div class="subject Dictionariesadd" :style="`height: ${nobottommaxH}px;`">
         <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="140px" class="demo-ruleForm">
                    <el-form-item label="地点名称" prop="placeName">
                        <el-input v-model.trim="ruleForm.placeName" :maxlength='50' placeholder='请输入地点名称' ></el-input>
                    </el-form-item>
                    <el-form-item label="地点排序号" prop="placeOrder" >
                      <el-input v-model="ruleForm.placeOrder"  type="number" :maxlength='4'  placeholder='请输入地点排序号'  ></el-input>
                     </el-form-item> 
                     <el-form-item label="打卡策略" prop="strategyId">
                        <el-select v-model="ruleForm.strategyId" placeholder="请选择打卡策略">
                           <el-option :label="item.strategyName" :value="item.id" v-for="(item,index) in dataList" :key="index"></el-option>
                     </el-select>                     
                    </el-form-item>
                    <el-form-item label="负责人" prop="workStuJson" >
                       <div class="classevaluateindex-box"><address-book v-model="ruleForm.workStuJson" :config="managerConfigData"></address-book></div>
                     </el-form-item>
        </el-form>
     </div>
</div> 
</template>
<script>
import AddressBook from '@/components/AddressBook/indexExpand';
import { insertPlace,listStrategyBySchoolId} from "@/api/ventilatearoom";
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
     const workStuJsonValidator = (rule, value, callback) => {                               
                if ((JSON.stringify(this.ruleForm.workStuJson) === '{}' || this.ruleForm.workStuJson.userJson.length === 0)) {
                    callback(new Error('请选择负责人'));
                }else {
                    callback();
                }
             };
    return {
      ruleForm: {       
        placeOrder: "", 
        placeName: "",
        strategyId:'',
        strategyName:'',
        checkUserJson:[],
        workStuJson: {},
      },
      managerConfigData: {title: '请选择负责人', depart: {target: 'user', departType: 't', userTypes: '1'}},
      dataList: [],
      rules: {       
        placeName: [{ required: true, message: "请输入地点名称", trigger: "blur" }],
        placeOrder: [
          { required: true, message: "请输入地点排序号", trigger: "blur" }
        ],
         strategyId: [
            { required: true, message: '请选择打卡策略', trigger: 'change' }
          ],
        workStuJson: [{
                        required: true,
                        validator: workStuJsonValidator
                    }],
      }
    };
  },
  components: {AddressBook},
  mixins: [mixin],
  created() {
      this.listStrategyBySchoolIds();
  },
  methods: {
    //策略
    listStrategyBySchoolIds(){
        this.datalist = [];
        listStrategyBySchoolId().then(res => {
            this.dataList = res.data.data;
            if(this.dataList.length>0){
                this.ruleForm.strategyId=this.dataList[0].id;
            }
         });
    },
    //保存
    insertPlaces(ruleForm) {
      this.$refs[ruleForm].validate(valid => {
        if (valid) {
            for(let i=0;i<this.dataList.length;i++){
              if(this.ruleForm.strategyId==this.dataList[i].id){
                  this.ruleForm.strategyName=this.dataList[i].strategyName;
              };
            };
            this.ruleForm.checkUserJson=JSON.stringify(this.ruleForm.workStuJson.userJson);
          insertPlace(this.ruleForm)
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
.ventilatearoomadd {
  padding:12px;
  .top {
    border-bottom: 1px solid #e7eaec;
    padding-bottom: 10px;
    overflow: hidden;
  }
  .subject {
    padding-top: 10px;
    overflow: auto;
    .el-form{
      padding-top: 20px;
      width: 810px;
      margin: 0 auto;
      .el-select{
       width: 100%;
      }
    }
  }
}
</style>