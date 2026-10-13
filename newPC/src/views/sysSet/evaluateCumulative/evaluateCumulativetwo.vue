<template>
  <div class="evaluateCumulativetwo">
     <el-tabs type="border-card"  v-model="activeName" @tab-click="tabsfun()">
      <el-tab-pane label="评价维度设置" name="one"></el-tab-pane>
      <el-tab-pane label="换算设置" name="two">
          <div class="header">
            <el-button @click="$router.back()" type="default" size="medium">返回</el-button>
            <el-button type="primary" size="medium" @click="saveAssessFlowerRules()">保存</el-button>
            <el-button type="primary" size="medium" @click="resetSchoolStuPoints()">立即生效</el-button>
          </div>
          <div class="body" :style="`height: ${maxH-20}px;`">
            <div class="form-box">
              <div class="box-top">评价星和花朵换算关系（获得一朵花需要满足以下条件）</div>
              <el-form label-width="200px">
              <el-form-item :label="item.name" v-for="item in flowerRuleJson" :key="item.id">
                  <el-input-number v-model="item.num" :step="1" step-strictly  placeholder="请输入星数" :min="0" :max="999"></el-input-number>
              </el-form-item>
            </el-form>
             <div class="form-box">
              <div class="box-top">花朵呈现规则（用于手机端学生花圃呈现效果）</div>
              <el-form label-width="200px">
              <el-form-item :label="'第'+(index+1)+'阶段，花朵数大于'" v-for="(item,index) in flowerLevelJson" :key="index">
                 <el-input-number  v-model="item.flowerNum" :step="1" step-strictly  placeholder="请输入花数" :min="0" :max="999"></el-input-number> 朵
              </el-form-item>
            </el-form>
            </div>              
          </div>
          </div>
      </el-tab-pane>
      <el-tab-pane label="称号晋升设置" name="three"></el-tab-pane>
    </el-tabs> 
  </div>
</template>
<script>
  import mixins from '@/mixins/windowResize';
  import {getSchoolAssessDimensionList,getAssessFlowerRuleList,saveAssessFlowerRule,resetSchoolStuPoint} from '@/api/evaluateCumulative';
  export default {
    data() {
      return {
        activeName:'two',
        flowerRuleJson:[],
        flowerLevelJson:[
          {flowerNum:0,levelNo:1},
          {flowerNum:0,levelNo:2},
          {flowerNum:0,levelNo:3},
          {flowerNum:0,levelNo:4},
          {flowerNum:0,levelNo:5},
          {flowerNum:0,levelNo:6},
          {flowerNum:0,levelNo:7}
        ]
      }
    },
    mixins: [mixins],
    created() {
      this.getSchoolAssessDimensionLists()
    },
    methods: {
      resetSchoolStuPoints(){
      this.$confirm("立即生效将重新处理学校学生分数,确认要立即生效吗？", "立即生效", {confirmButtonText: "确定",cancelButtonText: "取消",type: "warning",lockScroll: false }).then(() => {         
          resetSchoolStuPoint().then(res => {
            if (res.data.code === 200) {
              this.$message.success("立即生效成功！");
            } else {
              this.$message.error(res.data.msg);
            }
          });
        }).catch(() => {});
      }, 
      //保存
      saveAssessFlowerRules(){
        let list=[];
        for(let i=0;i<this.flowerRuleJson.length;i++){
           if(this.flowerRuleJson[i].num){
             list.push({
               dimensionId:this.flowerRuleJson[i].id,
               ruleNum:this.flowerRuleJson[i].num
              //  dimensionName:this.flowerRuleJson[i].name
             })
           }
        }
        if(list.length==0){
          this.$message.error('评价星的数量不能全部为0或空！');
          return;
        }
        for(let i=0;i<this.flowerLevelJson.length;i++){
           if((this.flowerLevelJson[i].flowerNum!==0)&&(!this.flowerLevelJson[i].flowerNum)){
               this.$message.error('请输入第'+(i+1)+'阶段花朵数');
              return;
           }else{
             if(i>0){
               if(this.flowerLevelJson[i].flowerNum<=this.flowerLevelJson[i-1].flowerNum){
                  this.$message.error('第'+(i+1)+'阶段花朵数要大于第'+(i)+'阶段花朵数');
                  return;
               }
             }
           }
        }
        saveAssessFlowerRule(JSON.stringify(this.flowerLevelJson),JSON.stringify(list)).then(res => {
            if (res.data.code === 200) {
              this.$message.success("保存成功！");
            } else {
              this.$message.error(res.data.msg);
            }
          });

      },
       getSchoolAssessDimensionLists(){
        getSchoolAssessDimensionList().then(res => res.data).then(data => {
          for(let i=0;i<data.data.length;i++){
            data.data[i].num=0;
          }
          this.flowerRuleJson=data.data;
          this.getAssessFlowerRuleLists()
        });
      },    
      getAssessFlowerRuleLists(){
        getAssessFlowerRuleList().then(res => res.data).then(data => {
          let mydataflowerRuleList=data.data.flowerRuleList; 
          let mydataflowerLevelList=data.data.flowerLevelList; 
          if(mydataflowerLevelList.length){
           this.flowerLevelJson=mydataflowerLevelList;
          }
          for(let i=0;mydataflowerRuleList.length;i++){
            for(let j=0;j< this.flowerRuleJson.length;j++){
              if( this.flowerRuleJson[j].id==mydataflowerRuleList[i].dimensionId){
                this.flowerRuleJson[j].num=mydataflowerRuleList[i].ruleNum;
              }
            }
          }       
        });
      },   
      tabsfun(){
        if(this.activeName=='one'){
           this.$router.replace({path: 'evaluateCumulativeone'});
        }else if(this.activeName=='three'){
            this.$router.replace({path: 'evaluateCumulativethree'});
        }
      },
    
    }
  }
</script>

<style lang="scss" scoped>
.evaluateCumulativetwo{
  padding: 12px;
  .header {
      padding-bottom: 10px;
      border-bottom: 1px solid #eee;
  }
  .body{
    overflow: auto;
    .box-top{
        line-height: 20px;
        font-size: 16px;
        border-left: 4px solid #409eff;
        padding-left: 10px;
        margin-bottom: 30px; 
    }
    .form-box{
      width: 810px;
      margin: 20px auto;
    }
  }
}
</style>
