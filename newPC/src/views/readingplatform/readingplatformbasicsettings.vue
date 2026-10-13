<template>
    <div class="readingplatformbasicsettings ">
        <div class="top">
          <el-button @click="$router.back()" type="default" size="medium">返回</el-button>
          <el-button type="primary" size="medium" @click="readPlatBaseSets()">保存</el-button>
        </div>
        <div class="subject" :style="`height: ${nobottommaxH}px;`">
            <div class="body">
             <el-form :model="ruleForm"  ref="ruleForm" label-width="200px" class="demo-ruleForm">
                <!-- <el-form-item label="完成一篇读后感获得积分 ">
                    <el-input-number size="medium" v-model="ruleForm.readResponsePoints" :precision="0" :step="1" :min="1" :max="100" placeholder="请输入"></el-input-number>
                </el-form-item> -->
                 <el-form-item label="帖子被加精一次获得积分 ">
                    <el-input-number size="medium" v-model="ruleForm.digestPoint" :precision="0" :step="1" :min="1" :max="100" placeholder="请输入"></el-input-number>
                </el-form-item>
                 <el-form-item label="完成任务获得的积分 ">
                    任务中设置的积分
                </el-form-item>
                 <el-form-item label="被删帖子扣除积分 ">
                     <el-checkbox v-model="ruleForm.subExtraStatus">额外扣除积分</el-checkbox>
                    <el-input-number size="medium" v-if="ruleForm.subExtraStatus" v-model="ruleForm.subExtraPoints" :precision="0" :step="1" :min="1" :max="100" placeholder="请输入"></el-input-number>
                </el-form-item>
               
                </el-form>
            </div>
         </div>   			
        
    </div>
</template>
<script>
import {getSchoolReadPlatSetInfo,readPlatBaseSet} from "@/api/readingplatform";
import mixin from "@/mixins/windowResize";
export default {
  data() {
    return {
      ruleForm: {
        digestPoint:undefined,//	加精分数	number	
        id:0,//	主键ID，新增时传0	number	
        readResponsePoints:0,//	读后感得分	number	
        subExtraPoints:undefined,//	扣除额外多少分	number	
        subExtraStatus:false,//	扣除任务额外的分，1代表勾选，0代表未勾选	number	        
      },
    };
  },
  created() {
    getSchoolReadPlatSetInfo().then(res => res.data)
                    .then(data => {
                        if (data.code === 200) {
                            let detailObject = data.data;
                            if(detailObject){
                                this.ruleForm.subExtraStatus = detailObject.subExtraStatus == 1 ? true : false;
                                this.ruleForm.digestPoint = detailObject.digestPoint?detailObject.digestPoint:undefined;
                                // this.ruleForm.readResponsePoints = detailObject.readResponsePoints?detailObject.readResponsePoints:undefined;
                                this.ruleForm.subExtraPoints = detailObject.subExtraPoints?detailObject.subExtraPoints:undefined;
                                this.ruleForm.id = detailObject.id? detailObject.id : 0;
                            }
                            
                        }
                    }).catch(() => {
                })
  },
  mixins: [mixin],
  methods: {
    //保存
    readPlatBaseSets(){
        // if(!this.ruleForm.readResponsePoints){
        //         this.$message({type: 'error', message:'请输入完成一篇读后感获得积分!'});
        //         return;
        //     };
           if(!this.ruleForm.digestPoint){
                this.$message({type: 'error', message:'请输入帖子被加精一次获得积分!'});
                return;
            };
            if(!this.ruleForm.subExtraPoints&&this.ruleForm.subExtraStatus){
                this.$message({type: 'error', message:'请输入额外扣除积分!'});
                return;
            };
             readPlatBaseSet(this.ruleForm)
              .then(res => {
                if (res.data.code === 200) {
                  this.$message({
                    type: "success",
                    message: "保存成功!"
                  });
                }else{
                  this.$message({type: 'error', message:res.data.msg});
                  return;
                }             
              }).catch();
    },
   
  }
};
</script>

<style lang="scss" scoped>
.readingplatformbasicsettings {
  padding:12px;
  .top {
    border-bottom: 1px solid #e7eaec;
    padding-bottom: 10px;
  }
  .subject {
    padding-top: 20px;
    overflow: auto;
    .body {
      width: 810px;
      margin: 0 auto;
     
    }
  }
}
</style>
